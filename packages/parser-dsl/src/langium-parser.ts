import type {
  DiagramAst,
  NodeAst,
  EdgeAst,
  GroupAst,
  Style,
  Direction,
  ContainerDeclaration,
  ContainerStyle,
  RuniqDocument,
  DiagramProfile,
  ElectricalProfile,
  DigitalProfile,
  NetAst,
  PartAst,
  AnalysisAst,
  ModuleAst,
  PortAst,
  InstanceAst,
} from '@runiq/core';
import { EmptyFileSystem } from 'langium';
import { createRuniqServices } from './langium-module.js';
import * as Langium from './generated/ast.js';

/**
 * Convert NodeRef to string representation
 * Supports both simple refs (node1) and member refs (Class.field)
 */
function nodeRefToString(ref: Langium.NodeRef): string {
  if (ref.member) {
    return `${ref.node}.${ref.member}`;
  }
  return ref.node;
}

/**
 * Convert Langium DataProperty to core data format
 */
function convertDataProperty(
  prop: Langium.DataProperty
): Record<string, unknown> {
  const values: Array<number | Record<string, unknown>> = [];

  for (const item of prop.items) {
    if (Langium.isDataObject(item)) {
      // Convert object properties to key-value pairs
      const obj: Record<string, unknown> = {};
      for (const objProp of item.properties) {
        const key = objProp.key;
        const value = objProp.value;

        // Handle arrays (DataArray type)
        if (Langium.isDataArray(value)) {
          const arrayValues = value.items.map((num) => parseFloat(num));
          obj[key] = arrayValues;
          continue;
        }

        // Remove quotes from strings
        if (typeof value === 'string') {
          let strValue = value;
          if (strValue.startsWith('"') && strValue.endsWith('"')) {
            strValue = strValue.slice(1, -1);
          }
          // Try to parse as number
          const numValue = parseFloat(strValue);
          if (!isNaN(numValue) && strValue === numValue.toString()) {
            obj[key] = numValue;
          } else {
            obj[key] = strValue;
          }
        } else {
          obj[key] = value;
        }
      }
      values.push(obj);
    } else if (Langium.isDataValue(item)) {
      // Plain number value (DataValue type)
      const numValue = parseFloat(item.value);
      if (!isNaN(numValue)) {
        values.push(numValue);
      }
    }
  }

  return { values };
}

/**
 * Parse result type
 */
export interface ParseResult {
  success: boolean;
  document?: RuniqDocument;
  diagram?: DiagramAst; // Backwards compatibility - points to first diagram profile
  errors: string[];
}

/**
 * Create parser services (singleton)
 */
const services = createRuniqServices(EmptyFileSystem);
const parser = services.Runiq.parser.LangiumParser;

/**
 * Parse Runiq DSL text into RuniqDocument or DiagramAst (legacy)
 * @param text - The Runiq DSL source code
 * @returns ParseResult with document/diagram or errors
 */
export function parse(text: string): ParseResult {
  // Parse using Langium
  const parseResult = parser.parse(text);

  // Check for parse errors
  if (
    parseResult.lexerErrors.length > 0 ||
    parseResult.parserErrors.length > 0
  ) {
    const errors: string[] = [];

    parseResult.lexerErrors.forEach((err) => {
      const location =
        err.line !== undefined && err.column !== undefined
          ? ` at line ${err.line}, column ${err.column}`
          : '';
      errors.push(`Lexer error${location}: ${err.message}`);
    });

    parseResult.parserErrors.forEach((err) => {
      const token = err.token;
      const location =
        token &&
        token.startLine !== undefined &&
        token.startColumn !== undefined
          ? ` at line ${token.startLine}, column ${token.startColumn}`
          : '';
      errors.push(`Parser error${location}: ${err.message}`);
    });

    return { success: false, errors };
  }

  // Convert Langium AST to Runiq Document
  const document = parseResult.value as Langium.Document;
  const runiqDocument = convertToRuniqDocument(document);

  // Backwards compatibility: expose first diagram profile as 'diagram'
  const firstDiagramProfile = runiqDocument.profiles.find(
    (p) => p.type === 'diagram'
  );

  let diagram: DiagramAst | undefined;
  if (firstDiagramProfile && firstDiagramProfile.type === 'diagram') {
    // Convert DiagramProfile to DiagramAst for backwards compatibility
    const { type, name, ...rest } = firstDiagramProfile;
    diagram = {
      ...rest,
      astVersion: runiqDocument.astVersion,
      title: name, // Map 'name' to 'title'
    };
  }

  return {
    success: true,
    document: runiqDocument,
    diagram, // Backwards compatibility
    errors: [],
  };
}

/**
 * Convert Langium Document to RuniqDocument with profiles
 */
function convertToRuniqDocument(document: Langium.Document): RuniqDocument {
  const runiqDoc: RuniqDocument = {
    astVersion: '1.0',
    profiles: [],
  };

  // Convert each profile
  for (const profile of document.profiles) {
    if (Langium.isDiagramProfile(profile)) {
      runiqDoc.profiles.push(convertDiagramProfile(profile));
    } else if (Langium.isElectricalProfile(profile)) {
      runiqDoc.profiles.push(convertElectricalProfile(profile));
    } else if (Langium.isDigitalProfile(profile)) {
      runiqDoc.profiles.push(convertDigitalProfile(profile));
    }
  }

  return runiqDoc;
}

/**
 * Convert DiagramProfile to core AST format
 */
function convertDiagramProfile(
  profile: Langium.DiagramProfile
): DiagramProfile {
  const diagramProfile: DiagramProfile = {
    type: 'diagram',
    name: profile.name.replace(/^"|"$/g, ''),
    direction: 'TB', // Default
    nodes: [],
    edges: [],
    groups: [],
    styles: {},
  };

  // Track which nodes have been explicitly declared
  const declaredNodes = new Set<string>();

  // Process all statements in the diagram
  for (const statement of profile.statements) {
    processDialogStatement(statement, diagramProfile, declaredNodes);
  }

  return diagramProfile;
}

/**
 * Convert ElectricalProfile to core AST format
 */
function convertElectricalProfile(
  profile: Langium.ElectricalProfile
): ElectricalProfile {
  const electricalProfile: ElectricalProfile = {
    type: 'electrical',
    name: profile.name.replace(/^"|"$/g, ''),
    nets: [],
    parts: [],
  };

  // Process electrical statements
  for (const statement of profile.statements) {
    if (Langium.isNetStatement(statement)) {
      // net IN, OUT, GND
      for (const netName of statement.names) {
        electricalProfile.nets.push({ name: netName });
      }
    } else if (Langium.isPartStatement(statement)) {
      // part R1 type:R value:10k pins:(IN,OUT)
      const part: PartAst = {
        ref: statement.ref,
        type: '',
        pins: [],
      };

      for (const prop of statement.properties) {
        if (Langium.isPartTypeProperty(prop)) {
          part.type = prop.type;
        } else if (Langium.isPartValueProperty(prop)) {
          if (!part.params) part.params = {};
          let value = prop.value;
          if (
            typeof value === 'string' &&
            value.startsWith('"') &&
            value.endsWith('"')
          ) {
            value = value.slice(1, -1);
          }
          part.params.value = value;
        } else if (Langium.isPartSourceProperty(prop)) {
          if (!part.params) part.params = {};
          part.params.source = prop.source.replace(/^"|"$/g, '');
        } else if (Langium.isPartPinsProperty(prop)) {
          part.pins = prop.pins;
        } else if (Langium.isPartGenericProperty(prop)) {
          // Handle generic properties like model:"2N2222", w:"10u", l:"1u", ratio:"10:1"
          if (!part.params) part.params = {};
          let value = prop.value;
          if (
            typeof value === 'string' &&
            value.startsWith('"') &&
            value.endsWith('"')
          ) {
            value = value.slice(1, -1);
          }
          part.params[prop.key] = value;
        }
      }

      electricalProfile.parts.push(part);
    } else if (Langium.isAnalysisStatement(statement)) {
      // analysis tran "0 5m"
      if (!electricalProfile.analyses) electricalProfile.analyses = [];
      const analysis: AnalysisAst = {
        kind: statement.kind as AnalysisAst['kind'],
        args: statement.args?.replace(/^"|"$/g, ''),
      };
      electricalProfile.analyses.push(analysis);
    }
  }

  return electricalProfile;
}

/**
 * Convert DigitalProfile to core AST format
 */
function convertDigitalProfile(
  profile: Langium.DigitalProfile
): DigitalProfile {
  const digitalProfile: DigitalProfile = {
    type: 'digital',
    name: profile.name.replace(/^"|"$/g, ''),
    instances: [],
    nets: [],
  };

  // Process digital statements
  for (const statement of profile.statements) {
    if (Langium.isModuleStatement(statement)) {
      // module Counter ports:(clk,reset,count[7:0])
      if (!digitalProfile.modules) digitalProfile.modules = [];
      const module: ModuleAst = {
        name: statement.name,
        ports: [],
      };

      for (const prop of statement.properties) {
        if (Langium.isModulePortsProperty(prop)) {
          for (const portDecl of prop.ports) {
            const port: PortAst = {
              name: portDecl.name,
              dir: 'input', // Default, would need grammar enhancement for dir
            };
            if (portDecl.width) {
              // Parse bus width [msb:lsb]
              port.width =
                parseInt(portDecl.width.msb) - parseInt(portDecl.width.lsb) + 1;
            }
            module.ports.push(port);
          }
        } else if (Langium.isModuleParamsProperty(prop)) {
          if (!module.params) module.params = {};
          for (const paramDecl of prop.params) {
            let value = paramDecl.value;
            if (
              typeof value === 'string' &&
              value.startsWith('"') &&
              value.endsWith('"')
            ) {
              value = value.slice(1, -1);
            }
            module.params[paramDecl.name] = value;
          }
        }
      }

      digitalProfile.modules.push(module);
    } else if (Langium.isInstStatement(statement)) {
      // inst U1 of:Counter map:(clk:clk, reset:reset)
      const instance: InstanceAst = {
        ref: statement.ref,
        of: '',
        portMap: {},
      };

      for (const prop of statement.properties) {
        if (Langium.isInstOfProperty(prop)) {
          instance.of = prop.module;
        } else if (Langium.isInstMapProperty(prop)) {
          for (const conn of prop.connections) {
            instance.portMap[conn.port] = conn.net;
          }
        } else if (Langium.isInstParamsProperty(prop)) {
          if (!instance.paramMap) instance.paramMap = {};
          for (const param of prop.params) {
            let value = param.value;
            if (
              typeof value === 'string' &&
              value.startsWith('"') &&
              value.endsWith('"')
            ) {
              value = value.slice(1, -1);
            }
            instance.paramMap[param.param] = value;
          }
        }
      }

      digitalProfile.instances.push(instance);
    } else if (Langium.isDigitalNetStatement(statement)) {
      // net clk, reset, count[7:0]
      for (const netDecl of statement.names) {
        const net: NetAst = {
          name: netDecl.name,
        };
        if (netDecl.width) {
          net.width =
            parseInt(netDecl.width.msb) - parseInt(netDecl.width.lsb) + 1;
        }
        digitalProfile.nets.push(net);
      }
    }
  }

  return digitalProfile;
}

/**
 * Process a single diagram statement (extracted for reuse)
 */
function processDialogStatement(
  statement: Langium.DiagramStatement,
  diagram: DiagramProfile,
  declaredNodes: Set<string>
): void {
  if (Langium.isDirectionDeclaration(statement)) {
    diagram.direction = statement.value as Direction;
  } else if (Langium.isStyleDeclaration(statement)) {
    const style: Style = {};
    for (const prop of statement.properties) {
      let value = prop.value;
      // Remove quotes from string values
      if (
        typeof value === 'string' &&
        value.startsWith('"') &&
        value.endsWith('"')
      ) {
        value = value.slice(1, -1);
      }
      style[prop.key] = value;
    }
    if (!diagram.styles) {
      diagram.styles = {};
    }
    diagram.styles[statement.name] = style;
  } else if (Langium.isShapeDeclaration(statement)) {
    const node: NodeAst = {
      id: statement.id,
      shape: statement.shape || 'rounded', // Default to rounded if no shape specified
    };

    // Process node properties
    for (const prop of statement.properties) {
      if (Langium.isLabelProperty(prop)) {
        node.label = prop.value.replace(/^"|"$/g, '');
      } else if (Langium.isStyleRefProperty(prop)) {
        node.style = prop.ref?.$refText;
      } else if (Langium.isIconProperty(prop)) {
        node.icon = {
          provider: prop.provider,
          name: prop.icon,
        };
      } else if (Langium.isLinkProperty(prop)) {
        node.link = {
          href: prop.url.replace(/^"|"$/g, ''),
        };
      } else if (Langium.isTooltipProperty(prop)) {
        node.tooltip = prop.text.replace(/^"|"$/g, '');
      } else if (Langium.isDataProperty(prop)) {
        node.data = convertDataProperty(prop);
      } else if (Langium.isShowLegendProperty(prop)) {
        if (!node.data) node.data = {};
        node.data.showLegend = prop.value === 'true';
      } else if (Langium.isLegendPositionProperty(prop)) {
        if (!node.data) node.data = {};
        node.data.legendPosition = prop.value.replace(/^"|"$/g, '');
      } else if (Langium.isStackedProperty(prop)) {
        if (!node.data) node.data = {};
        node.data.stacked = prop.value === 'true';
      } else if (Langium.isColorsProperty(prop)) {
        if (!node.data) node.data = {};
        // Convert StringArray to array of strings
        if (prop.value && Langium.isStringArray(prop.value)) {
          node.data.colors = prop.value.items.map((item) =>
            item.replace(/^"|"$/g, '')
          );
        }
      } else if (Langium.isAffectedProperty(prop)) {
        // Store pedigree properties in node.data for later merging into style
        if (!node.data) node.data = {};
        node.data.affected = prop.value === 'true';
      } else if (Langium.isCarrierProperty(prop)) {
        if (!node.data) node.data = {};
        node.data.carrier = prop.value === 'true';
      } else if (Langium.isDeceasedProperty(prop)) {
        if (!node.data) node.data = {};
        node.data.deceased = prop.value === 'true';
      } else if (Langium.isAttributesProperty(prop)) {
        // UML Class diagram attributes
        if (!node.data) node.data = {};
        node.data.attributes = prop.attributes.map((attr) => {
          const attrObj: Record<string, unknown> = {};
          for (const field of attr.properties) {
            if (Langium.isAttrNameField(field)) {
              attrObj.name = field.value.replace(/^"|"$/g, '');
            } else if (Langium.isAttrTypeField(field)) {
              attrObj.type = field.value.replace(/^"|"$/g, '');
            } else if (Langium.isAttrVisibilityField(field)) {
              attrObj.visibility = field.value;
            } else if (Langium.isAttrDefaultField(field)) {
              attrObj.defaultValue = field.value.replace(/^"|"$/g, '');
            } else if (Langium.isAttrStaticField(field)) {
              attrObj.isStatic = field.value === 'true';
            } else if (Langium.isAttrDerivedField(field)) {
              attrObj.isDerived = field.value === 'true';
            } else if (Langium.isAttrConstraintsField(field)) {
              attrObj.constraints = field.values.map((v) =>
                v.replace(/^"|"$/g, '')
              );
            }
          }
          return attrObj;
        });
      } else if (Langium.isMethodsProperty(prop)) {
        // UML Class diagram methods
        if (!node.data) node.data = {};
        node.data.methods = prop.methods.map((method) => {
          const methodObj: Record<string, unknown> = {};
          for (const field of method.properties) {
            if (Langium.isMethodNameField(field)) {
              methodObj.name = field.value.replace(/^"|"$/g, '');
            } else if (Langium.isMethodParamsField(field)) {
              methodObj.params = field.params.map((param) => {
                const paramObj: Record<string, unknown> = {};
                for (const paramField of param.properties) {
                  if (Langium.isParamNameField(paramField)) {
                    paramObj.name = paramField.value.replace(/^"|"$/g, '');
                  } else if (Langium.isParamTypeField(paramField)) {
                    paramObj.type = paramField.value.replace(/^"|"$/g, '');
                  }
                }
                return paramObj;
              });
            } else if (Langium.isMethodReturnTypeField(field)) {
              methodObj.returnType = field.value.replace(/^"|"$/g, '');
            } else if (Langium.isMethodVisibilityField(field)) {
              methodObj.visibility = field.value;
            } else if (Langium.isMethodAbstractField(field)) {
              methodObj.isAbstract = field.value === 'true';
            } else if (Langium.isMethodStaticField(field)) {
              methodObj.isStatic = field.value === 'true';
            } else if (Langium.isMethodConstraintsField(field)) {
              methodObj.constraints = field.values.map((v) =>
                v.replace(/^"|"$/g, '')
              );
            }
          }
          // Default returnType to 'void' if not specified
          if (!methodObj.returnType) {
            methodObj.returnType = 'void';
          }
          return methodObj;
        });
      } else if (Langium.isGenericTypesProperty(prop)) {
        // Generic type parameters
        if (!node.data) node.data = {};
        node.data.genericTypes = prop.types.map((t) => t.replace(/^"|"$/g, ''));
      } else if (Langium.isStereotypeProperty(prop)) {
        // UML stereotype
        if (!node.data) node.data = {};
        node.data.stereotype = prop.value.replace(/^"|"$/g, '');
      }
    }

    // Second pass: ensure showLegend, stacked, colors, title, and labels are set after DataProperty
    for (const prop of statement.properties) {
      if (Langium.isShowLegendProperty(prop)) {
        if (!node.data) node.data = {};
        node.data.showLegend = prop.value === 'true';
      } else if (Langium.isLegendPositionProperty(prop)) {
        if (!node.data) node.data = {};
        node.data.legendPosition = prop.value.replace(/^"|"$/g, '');
      } else if (Langium.isStackedProperty(prop)) {
        if (!node.data) node.data = {};
        node.data.stacked = prop.value === 'true';
      } else if (Langium.isColorsProperty(prop)) {
        if (!node.data) node.data = {};
        if (prop.value && Langium.isStringArray(prop.value)) {
          node.data.colors = prop.value.items.map((item) =>
            item.replace(/^"|"$/g, '')
          );
        }
      } else if (Langium.isTitleProperty(prop)) {
        if (!node.data) node.data = {};
        node.data.title = prop.value.replace(/^"|"$/g, '');
      } else if (Langium.isXLabelProperty(prop)) {
        if (!node.data) node.data = {};
        node.data.xLabel = prop.value.replace(/^"|"$/g, '');
      } else if (Langium.isYLabelProperty(prop)) {
        if (!node.data) node.data = {};
        node.data.yLabel = prop.value.replace(/^"|"$/g, '');
      }
    }

    // Default label to ID if not specified
    if (!node.label) {
      node.label = node.id;
    }

    diagram.nodes.push(node);
    declaredNodes.add(node.id);
  } else if (Langium.isEdgeDeclaration(statement)) {
    // Convert NodeRef to strings (supports member refs like Class.field)
    const fromId = nodeRefToString(statement.from);
    const toId = nodeRefToString(statement.to);

    const edge: EdgeAst = {
      from: fromId,
      to: toId,
    };

    if (statement.labeledArrow) {
      edge.label = statement.labeledArrow.slice(1, -2);
    }

    // Process edge properties
    for (const prop of statement.properties) {
      if (Langium.isLineStyleProperty(prop)) {
        edge.lineStyle = prop.value as 'solid' | 'dashed' | 'dotted' | 'double';
      } else if (Langium.isArrowTypeProperty(prop)) {
        edge.arrowType = prop.value as 'standard' | 'hollow' | 'open' | 'none';
      } else if (Langium.isMultiplicitySourceProperty(prop)) {
        edge.multiplicitySource = prop.value.replace(/^"|"$/g, '');
      } else if (Langium.isMultiplicityTargetProperty(prop)) {
        edge.multiplicityTarget = prop.value.replace(/^"|"$/g, '');
      } else if (Langium.isRoleSourceProperty(prop)) {
        edge.roleSource = prop.value.replace(/^"|"$/g, '');
      } else if (Langium.isRoleTargetProperty(prop)) {
        edge.roleTarget = prop.value.replace(/^"|"$/g, '');
      } else if (Langium.isEdgeTypeProperty(prop)) {
        edge.edgeType = prop.value as
          | 'association'
          | 'aggregation'
          | 'composition'
          | 'dependency'
          | 'generalization'
          | 'realization';
      } else if (Langium.isNavigabilityProperty(prop)) {
        edge.navigability = prop.value as
          | 'source'
          | 'target'
          | 'bidirectional'
          | 'none';
      } else if (Langium.isEdgeConstraintsProperty(prop)) {
        edge.constraints = prop.values.map((v) => v.replace(/^"|"$/g, ''));
      }
    }

    diagram.edges.push(edge);

    // Auto-create nodes if needed (for edges without explicit shape declarations)
    // Only create if it's a simple node reference (not a member reference)
    if (!statement.from.member && !declaredNodes.has(fromId)) {
      diagram.nodes.push({
        id: fromId,
        shape: 'rounded',
      });
      declaredNodes.add(fromId);
    }

    if (!statement.to.member && !declaredNodes.has(toId)) {
      diagram.nodes.push({
        id: toId,
        shape: 'rounded',
      });
      declaredNodes.add(toId);
    }
  } else if (Langium.isGroupBlock(statement)) {
    if (!diagram.groups) diagram.groups = [];
    const group: GroupAst = {
      label: statement.label.replace(/^"|"$/g, ''),
      children: [],
    };

    for (const child of statement.statements) {
      processDialogStatement(child, diagram, declaredNodes);
      if (Langium.isShapeDeclaration(child)) {
        group.children.push(child.id);
      }
    }

    diagram.groups.push(group);
  } else if (Langium.isContainerBlock(statement)) {
    // Convert DiagramProfile to DiagramAst for convertContainer
    const tempDiagram: DiagramAst = {
      astVersion: '1.0',
      ...diagram,
    };
    const container = convertContainer(statement, declaredNodes, tempDiagram);
    if (!diagram.containers) diagram.containers = [];
    diagram.containers.push(container);
  }
}

/**
 * Container conversion helper
 */
function convertContainer(
  block: Langium.ContainerBlock,
  declaredNodes: Set<string>,
  diagram: DiagramAst
): ContainerDeclaration {
  // Generate ID from label if not provided
  const id =
    block.id ||
    block.label
      .replace(/^"|"$/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

  const container: ContainerDeclaration = {
    type: 'container',
    id,
    label: block.label.replace(/^"|"$/g, ''),
    children: [],
  };

  // Process container properties
  let styleRef: string | undefined;
  let containerType: string | undefined;
  const containerStyle: ContainerStyle = {};
  const layoutOptions: { algorithm?: string; spacing?: number } = {};

  for (const prop of block.properties) {
    if (Langium.isStyleRefProperty(prop)) {
      styleRef = prop.ref?.$refText;
    } else if (Langium.isContainerTypeProperty(prop)) {
      containerType = prop.type;
    } else if (Langium.isContainerStyleProperty(prop)) {
      if (prop.borderStyle) {
        containerStyle.borderStyle = prop.borderStyle;
      } else if (prop.borderColor) {
        containerStyle.borderColor = prop.borderColor.replace(/^"|"$/g, '');
      } else if (prop.borderWidth !== undefined) {
        containerStyle.borderWidth = parseFloat(prop.borderWidth);
      } else if (prop.backgroundColor) {
        containerStyle.backgroundColor = prop.backgroundColor.replace(
          /^"|"$/g,
          ''
        );
      } else if (prop.opacity !== undefined) {
        containerStyle.opacity = parseFloat(prop.opacity);
      } else if (prop.padding !== undefined) {
        containerStyle.padding = parseFloat(prop.padding);
      } else if (prop.labelPosition) {
        containerStyle.labelPosition = prop.labelPosition as
          | 'top'
          | 'bottom'
          | 'left'
          | 'right';
      }
    } else if (Langium.isContainerLayoutProperty(prop)) {
      if (prop.algorithm) {
        layoutOptions.algorithm = prop.algorithm;
      } else if (prop.spacing !== undefined) {
        layoutOptions.spacing = parseFloat(prop.spacing);
      }
    }
  }

  if (styleRef) {
    container.style = styleRef;
  }

  if (Object.keys(containerStyle).length > 0) {
    container.containerStyle = containerStyle;
  }

  if (Object.keys(layoutOptions).length > 0) {
    container.layoutOptions = layoutOptions as any;
  }

  // Process nested statements recursively
  let isFirstNode = true; // Track first node for mindmap central node
  for (const statement of block.statements) {
    if (Langium.isShapeDeclaration(statement)) {
      // Add node to container's children
      container.children.push(statement.id);

      // Determine shape based on container type or explicit declaration
      let shape: string;
      if (statement.shape) {
        // Explicit shape specified
        shape = statement.shape;
      } else if (containerType === 'mindmap') {
        // Mindmap defaults: first node is central (circle), rest are branches (rounded)
        shape = isFirstNode ? 'circ' : 'rounded';
      } else {
        // Default shape for other containers
        shape = 'rounded';
      }

      // Track that we've processed the first node (for mindmap defaults)
      if (isFirstNode) {
        isFirstNode = false;
      }

      // Add node to main diagram
      const node: NodeAst = {
        id: statement.id,
        shape,
      };

      // Process node properties
      for (const prop of statement.properties) {
        if (Langium.isLabelProperty(prop)) {
          node.label = prop.value.replace(/^"|"$/g, '');
        } else if (Langium.isStyleRefProperty(prop)) {
          node.style = prop.ref?.$refText;
        } else if (Langium.isIconProperty(prop)) {
          node.icon = {
            provider: prop.provider,
            name: prop.icon,
          };
        } else if (Langium.isLinkProperty(prop)) {
          node.link = {
            href: prop.url.replace(/^"|"$/g, ''),
          };
        } else if (Langium.isTooltipProperty(prop)) {
          node.tooltip = prop.text.replace(/^"|"$/g, '');
        } else if (Langium.isDataProperty(prop)) {
          node.data = convertDataProperty(prop);
        } else if (Langium.isShowLegendProperty(prop)) {
          if (!node.data) node.data = {};
          node.data.showLegend = prop.value === 'true';
        } else if (Langium.isLegendPositionProperty(prop)) {
          if (!node.data) node.data = {};
          node.data.legendPosition = prop.value.replace(/^"|"$/g, '');
        } else if (Langium.isStackedProperty(prop)) {
          if (!node.data) node.data = {};
          node.data.stacked = prop.value === 'true';
        } else if (Langium.isColorsProperty(prop)) {
          if (!node.data) node.data = {};
          // Convert StringArray to array of strings
          if (prop.value && Langium.isStringArray(prop.value)) {
            node.data.colors = prop.value.items.map((item) =>
              item.replace(/^"|"$/g, '')
            );
          }
        } else if (Langium.isAffectedProperty(prop)) {
          // Store pedigree properties in node.data for later merging into style
          if (!node.data) node.data = {};
          node.data.affected = prop.value === 'true';
        } else if (Langium.isCarrierProperty(prop)) {
          if (!node.data) node.data = {};
          node.data.carrier = prop.value === 'true';
        } else if (Langium.isDeceasedProperty(prop)) {
          if (!node.data) node.data = {};
          node.data.deceased = prop.value === 'true';
        }
      }

      // Second pass: ensure showLegend, stacked, colors, title, and labels are set after DataProperty
      for (const prop of statement.properties) {
        if (Langium.isShowLegendProperty(prop)) {
          if (!node.data) node.data = {};
          node.data.showLegend = prop.value === 'true';
        } else if (Langium.isLegendPositionProperty(prop)) {
          if (!node.data) node.data = {};
          node.data.legendPosition = prop.value.replace(/^"|"$/g, '');
        } else if (Langium.isStackedProperty(prop)) {
          if (!node.data) node.data = {};
          node.data.stacked = prop.value === 'true';
        } else if (Langium.isColorsProperty(prop)) {
          if (!node.data) node.data = {};
          // Convert StringArray to array of strings
          if (prop.value && Langium.isStringArray(prop.value)) {
            node.data.colors = prop.value.items.map((item) =>
              item.replace(/^"|"$/g, '')
            );
          }
        } else if (Langium.isTitleProperty(prop)) {
          if (!node.data) node.data = {};
          node.data.title = prop.value.replace(/^"|"$/g, '');
        } else if (Langium.isXLabelProperty(prop)) {
          if (!node.data) node.data = {};
          node.data.xLabel = prop.value.replace(/^"|"$/g, '');
        } else if (Langium.isYLabelProperty(prop)) {
          if (!node.data) node.data = {};
          node.data.yLabel = prop.value.replace(/^"|"$/g, '');
        }
      }

      diagram.nodes.push(node);
      declaredNodes.add(statement.id);
    } else if (Langium.isEdgeDeclaration(statement)) {
      // Edges in containers just get added to main diagram
      // Convert NodeRef to strings (supports member refs like Class.field)
      const fromId = nodeRefToString(statement.from);
      const toId = nodeRefToString(statement.to);

      const edge: EdgeAst = {
        from: fromId,
        to: toId,
      };

      if (statement.labeledArrow) {
        // Extract label from labeledArrow terminal (e.g., "-success->" -> "success")
        const match = statement.labeledArrow.match(/^-(.+)->$/);
        if (match) {
          edge.label = match[1];
        }
      }

      // Process edge properties
      for (const prop of statement.properties) {
        if (Langium.isLineStyleProperty(prop)) {
          edge.lineStyle = prop.value as
            | 'solid'
            | 'dashed'
            | 'dotted'
            | 'double';
        } else if (Langium.isArrowTypeProperty(prop)) {
          edge.arrowType = prop.value as
            | 'standard'
            | 'hollow'
            | 'open'
            | 'none';
        }
      }

      diagram.edges.push(edge);

      // Auto-create nodes if needed (only for simple refs, not member refs)
      if (!statement.from.member && !declaredNodes.has(fromId)) {
        diagram.nodes.push({
          id: fromId,
          shape: 'rounded',
        });
        declaredNodes.add(fromId);
      }

      if (!statement.to.member && !declaredNodes.has(toId)) {
        diagram.nodes.push({
          id: toId,
          shape: 'rounded',
        });
        declaredNodes.add(toId);
      }
    } else if (Langium.isContainerBlock(statement)) {
      // Recursive nesting - convert nested container
      const nestedContainer = convertContainer(
        statement,
        declaredNodes,
        diagram
      );

      // Add nested container to parent's containers array (not children)
      if (!container.containers) {
        container.containers = [];
      }
      container.containers.push(nestedContainer);
    }
  }

  return container;
}
