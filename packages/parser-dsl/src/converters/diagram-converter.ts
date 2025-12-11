import type {
  ContainerDeclaration,
  ContainerPreset,
  ContainerStyle,
  ContainerTemplate,
  DiagramAst,
  DiagramProfile,
  Direction,
  EdgeAst,
  EdgeRouting,
  GroupAst,
  NodeAst,
  Style,
  TemplateParameter,
} from '@runiq/core';
import { ProfileType, LineStyle, ArrowType } from '@runiq/core';
import * as Langium from '../generated/ast.js';
import {
  convertDataProperty,
  nodeRefToString,
  parseAnchoredArrow,
  unescapeString,
} from '../utils/index.js';

/**
 * Convert DiagramProfile from Langium AST to core AST format
 */
export function convertDiagramProfile(
  profile: Langium.DiagramProfile
): DiagramProfile {
  const diagram: DiagramProfile = {
    type: ProfileType.DIAGRAM,
    name: profile.name.replace(/^"|"$/g, ''),
    nodes: [],
    edges: [],
  };

  const declaredNodes = new Set<string>();

  // Process each statement in the diagram
  for (const statement of profile.statements) {
    processDialogStatement(statement, diagram, declaredNodes);
  }

  return diagram;
}

/**
 * Process a single diagram statement
 */
function processDialogStatement(
  statement: Langium.DiagramStatement,
  diagram: DiagramProfile,
  declaredNodes: Set<string>
): void {
  if (Langium.isDirectionDeclaration(statement)) {
    diagram.direction = statement.value as Direction;
  } else if (Langium.isRoutingDeclaration(statement)) {
    diagram.routing = statement.value as EdgeRouting;
  } else if (Langium.isThemeDeclaration(statement)) {
    diagram.theme = statement.value;
  } else if (Langium.isStyleDeclaration(statement)) {
    const style: Style = {};

    for (const prop of statement.properties) {
      let value = prop.value;
      if (
        typeof value === 'string' &&
        value.startsWith('"') &&
        value.endsWith('"')
      ) {
        value = value.slice(1, -1);
      }

      const key = prop.key.endsWith(':') ? prop.key.slice(0, -1) : prop.key;

      if (key === 'lineStyle') {
        if (value === 'dashed') {
          style['strokeDasharray'] = '5,5';
        } else if (value === 'dotted') {
          style['strokeDasharray'] = '2,2';
        } else if (value === 'solid') {
          style['strokeDasharray'] = 'none';
        } else {
          style['strokeDasharray'] = value;
        }
      } else {
        style[key] = value;
      }
    }
    if (!diagram.styles) {
      diagram.styles = {};
    }
    diagram.styles[statement.name] = style;
  } else if (Langium.isShapeDeclaration(statement)) {
    const node: NodeAst = {
      id: statement.id,
      shape: statement.shape || 'rounded',
      data: {},
    };

    processNodeProperties(node, statement.properties);

    if (!node.label) {
      node.label = node.id;
    }

    diagram.nodes.push(node);
    declaredNodes.add(node.id);
  } else if (Langium.isEdgeDeclaration(statement)) {
    processEdgeDeclaration(statement, diagram, declaredNodes);
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
    const tempDiagram: DiagramAst = {
      astVersion: '1.0',
      ...diagram,
    };
    const container = convertContainer(statement, declaredNodes, tempDiagram);
    if (!diagram.containers) diagram.containers = [];
    diagram.containers.push(container);
  } else if (Langium.isDataSourceDeclaration(statement)) {
    if (!(diagram as any).dataSources) (diagram as any).dataSources = [];
    (diagram as any).dataSources.push({
      format: statement.format.replace(/^"|"$/g, ''),
      key: statement.key,
      source: statement.source.replace(/^"|"$/g, ''),
      options: statement.options?.map((opt) => {
        let value: string | number | boolean = opt.value;
        if (typeof value === 'string') {
          const unquoted = value.replace(/^"|"$/g, '');
          if (unquoted === 'true') value = true;
          else if (unquoted === 'false') value = false;
          else value = unquoted;
        }
        return { name: opt.name, value };
      }),
    });
  } else if (Langium.isForEachBlock(statement)) {
    if (!(diagram as any).dataTemplates) (diagram as any).dataTemplates = [];
    (diagram as any).dataTemplates.push({
      id: statement.id.replace(/^"|"$/g, ''),
      dataKey: statement.dataKey,
      filter: statement.filter?.replace(/^"|"$/g, ''),
      limit:
        statement.limit !== undefined ? Number(statement.limit) : undefined,
      statements: statement.statements,
    });
  } else if (Langium.isTemplateBlock(statement)) {
    const template = convertTemplate(statement);
    if (!diagram.templates) diagram.templates = [];
    diagram.templates.push(template);
  } else if (Langium.isPresetBlock(statement)) {
    const preset = convertPreset(statement);
    if (!diagram.presets) diagram.presets = [];
    diagram.presets.push(preset);
  }
}

/**
 * Process node properties from Langium AST
 */
function processNodeProperties(
  node: NodeAst,
  properties: Langium.NodeProperty[]
): void {
  for (const prop of properties) {
    if (Langium.isLabelProperty(prop)) {
      node.label = unescapeString(prop.value);
    } else if (Langium.isStyleRefProperty(prop)) {
      node.style = prop.ref?.$refText;
    } else if (Langium.isFillColorProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.fillColor = prop.value.replace(/^"|"$/g, '');
    } else if (Langium.isTextColorProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.textColor = prop.value.replace(/^"|"$/g, '');
    } else if (Langium.isStrokeColorProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.strokeColor = prop.value.replace(/^"|"$/g, '');
    } else if (Langium.isStrokeWidthProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.strokeWidth = parseFloat(prop.value);
    } else if (Langium.isFontSizeProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.fontSize = parseFloat(prop.value);
    } else if (Langium.isFontFamilyProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.fontFamily = prop.value.replace(/^"|"$/g, '');
    } else if (Langium.isTextAlignProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.textAlign = prop.value;
    } else if (Langium.isFontWeightProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.fontWeight = parseFloat(prop.value);
    } else if (Langium.isOpacityProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.opacity = parseFloat(prop.value);
    } else if (Langium.isBorderRadiusProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.borderRadius = parseFloat(prop.value);
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
    } else if (Langium.isShowValuesProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.showValues = prop.value === 'true';
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
    } else if (Langium.isFlipAxesProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.flipAxes = prop.value === 'true';
    } else if (Langium.isLabelsProperty(prop)) {
      if (!node.data) node.data = {};
      if (prop.value && Langium.isStringArray(prop.value)) {
        node.data.labels = prop.value.items.map((item) =>
          item.replace(/^"|"$/g, '')
        );
      }
    } else if (Langium.isIntersectionsProperty(prop)) {
      if (!node.data) node.data = {};
      if (prop.value && Langium.isStringArray(prop.value)) {
        node.data.intersections = prop.value.items.map((item) =>
          item.replace(/^"|"$/g, '')
        );
      }
    } else if (Langium.isAffectedProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.affected = prop.value === 'true';
    } else if (Langium.isCarrierProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.carrier = prop.value === 'true';
    } else if (Langium.isDeceasedProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.deceased = prop.value === 'true';
    } else if (Langium.isShowMetricsProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.showMetrics = prop.value === 'true';
    } else if (Langium.isMetricTypeProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.metricType = prop.value;
    } else if (Langium.isMetricPositionProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.metricPosition = prop.value;
    } else if (Langium.isAttributesProperty(prop)) {
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
        if (!methodObj.returnType) {
          methodObj.returnType = 'void';
        }
        return methodObj;
      });
    } else if (Langium.isGenericTypesProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.genericTypes = prop.types.map((t) => t.replace(/^"|"$/g, ''));
    } else if (Langium.isStereotypeProperty(prop)) {
      if (!node.data) node.data = {};
      if (prop.values.length > 0) {
        node.data.stereotype = prop.values.map((v: string) =>
          v.replace(/^"|"$/g, '')
        );
      } else if (prop.value) {
        node.data.stereotype = prop.value.replace(/^"|"$/g, '');
      }
    } else if (Langium.isEntryProperty(prop)) {
      node.entry = prop.value.replace(/^"|"$/g, '');
    } else if (Langium.isExitProperty(prop)) {
      node.exit = prop.value.replace(/^"|"$/g, '');
    } else if (Langium.isDoActivityProperty(prop)) {
      node.doActivity = prop.value.replace(/^"|"$/g, '');
    } else if (Langium.isInputPinsProperty(prop)) {
      if (prop.value && Langium.isStringArray(prop.value)) {
        node.inputPins = prop.value.items.map((item) =>
          item.replace(/^"|"$/g, '')
        );
      }
    } else if (Langium.isOutputPinsProperty(prop)) {
      if (prop.value && Langium.isStringArray(prop.value)) {
        node.outputPins = prop.value.items.map((item) =>
          item.replace(/^"|"$/g, '')
        );
      }
    } else if (Langium.isStateInvariantProperty(prop)) {
      node.stateInvariant = prop.value.replace(/^"|"$/g, '');
    } else if (Langium.isExtensionPointsProperty(prop)) {
      if (prop.value && Langium.isStringArray(prop.value)) {
        node.extensionPoints = prop.value.items.map((item) =>
          item.replace(/^"|"$/g, '')
        );
      }
    } else if (Langium.isGatewayTypeProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.gatewayType = prop.value;
    }
  }

  // Second pass for properties that override data properties
  for (const prop of properties) {
    if (Langium.isShowLegendProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.showLegend = prop.value === 'true';
    } else if (Langium.isShowValuesProperty(prop)) {
      if (!node.data) node.data = {};
      node.data.showValues = prop.value === 'true';
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
    } else if (Langium.isLabelsProperty(prop)) {
      if (!node.data) node.data = {};
      if (prop.value && Langium.isStringArray(prop.value)) {
        node.data.labels = prop.value.items.map((item) =>
          item.replace(/^"|"$/g, '')
        );
      }
    } else if (Langium.isIntersectionsProperty(prop)) {
      if (!node.data) node.data = {};
      if (prop.value && Langium.isStringArray(prop.value)) {
        node.data.intersections = prop.value.items.map((item) =>
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
}

/**
 * Process edge declaration with chaining support
 */
function processEdgeDeclaration(
  statement: Langium.EdgeDeclaration,
  diagram: DiagramProfile,
  declaredNodes: Set<string>
): void {
  const fromId = nodeRefToString(statement.from);
  const toId = nodeRefToString(statement.to);

  const edge: EdgeAst = {
    from: fromId,
    to: toId,
  };

  if (statement.labeledArrow) {
    edge.label = statement.labeledArrow.slice(1, -2);
  }

  if (statement.anchoredArrow) {
    const parsed = parseAnchoredArrow(statement.anchoredArrow);
    if (parsed.anchorFrom) edge.anchorFrom = parsed.anchorFrom;
    if (parsed.anchorTo) edge.anchorTo = parsed.anchorTo;
    if (parsed.label) edge.label = parsed.label;
  }

  if (statement.bidirectionalArrow) {
    edge.bidirectional = true;
  }

  processEdgeProperties(edge, statement.properties);

  diagram.edges.push(edge);

  // Handle chained edges
  if (statement.chain && statement.chain.length > 0) {
    let currentFrom = toId;

    for (const chainSegment of statement.chain) {
      const chainTo = nodeRefToString(chainSegment.to);

      const chainedEdge: EdgeAst = {
        from: currentFrom,
        to: chainTo,
      };

      if (chainSegment.labeledArrow) {
        chainedEdge.label = chainSegment.labeledArrow.slice(1, -2);
      }

      if (chainSegment.anchoredArrow) {
        const parsed = parseAnchoredArrow(chainSegment.anchoredArrow);
        if (parsed.anchorFrom) chainedEdge.anchorFrom = parsed.anchorFrom;
        if (parsed.anchorTo) chainedEdge.anchorTo = parsed.anchorTo;
        if (parsed.label) chainedEdge.label = parsed.label;
      }

      if (chainSegment.bidirectionalArrow) {
        chainedEdge.bidirectional = true;
      }

      processEdgeProperties(chainedEdge, statement.properties);

      diagram.edges.push(chainedEdge);

      currentFrom = chainTo;
    }
  }

  // Auto-create nodes if needed
  if (!statement.from.member && !declaredNodes.has(fromId)) {
    diagram.nodes.push({
      id: fromId,
      shape: 'rounded',
      data: {},
    });
    declaredNodes.add(fromId);
  }

  if (!statement.to.member && !declaredNodes.has(toId)) {
    diagram.nodes.push({
      id: toId,
      shape: 'rounded',
      data: {},
    });
    declaredNodes.add(toId);
  }
}

/**
 * Process edge properties
 */
function processEdgeProperties(
  edge: EdgeAst,
  properties: Langium.EdgeProperty[]
): void {
  for (const prop of properties) {
    if (Langium.isEdgeLabelProperty(prop)) {
      edge.label = unescapeString(prop.label);
    } else if (Langium.isLineStyleProperty(prop)) {
      edge.lineStyle = prop.value as LineStyle;
    } else if (Langium.isArrowTypeProperty(prop)) {
      edge.arrowType = prop.value as ArrowType;
    } else if (Langium.isRoutingProperty(prop)) {
      edge.routing = prop.value as EdgeRouting;
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
    } else if (Langium.isStereotypeProperty(prop)) {
      if (prop.values.length > 0) {
        edge.stereotype = prop.values.map((v: string) =>
          v.replace(/^"|"$/g, '')
        );
      } else if (prop.value) {
        edge.stereotype = prop.value.replace(/^"|"$/g, '');
      }
    } else if (Langium.isEventProperty(prop)) {
      edge.event = prop.value.replace(/^"|"$/g, '');
    } else if (Langium.isGuardProperty(prop)) {
      edge.guard = prop.value.replace(/^"|"$/g, '');
    } else if (Langium.isEffectProperty(prop)) {
      edge.effect = prop.value.replace(/^"|"$/g, '');
    } else if (Langium.isFlowTypeProperty(prop)) {
      edge.flowType = prop.value as 'control' | 'object';
    } else if (Langium.isWeightProperty(prop)) {
      edge.weight = parseFloat(String(prop.value));
    } else if (Langium.isStrokeColorProperty(prop)) {
      edge.strokeColor = prop.value.replace(/^"|"$/g, '');
    } else if (Langium.isStrokeWidthProperty(prop)) {
      edge.strokeWidth = parseFloat(prop.value);
    } else if (Langium.isStyleRefProperty(prop)) {
      edge.style = prop.ref?.$refText;
    }
  }
}

/**
 * Convert container block to container declaration
 */
export function convertContainer(
  block: Langium.ContainerBlock,
  declaredNodes: Set<string>,
  diagram: DiagramAst
): ContainerDeclaration {
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

  let styleRef: string | undefined;
  let containerType: string | undefined;
  const containerStyle: ContainerStyle = {};
  const layoutOptions: {
    algorithm?: string;
    direction?: string;
    spacing?: number;
    orientation?: 'horizontal' | 'vertical';
  } = {};

  // Process container properties
  for (const prop of block.properties) {
    if (Langium.isStyleRefProperty(prop)) {
      styleRef = prop.ref?.$refText;
    } else if (Langium.isContainerTypeProperty(prop)) {
      containerType = prop.type;
    } else if (Langium.isContainerMetadataProperty(prop)) {
      // Phase 1: Basic metadata properties
      if (prop.header) {
        container.header = prop.header.replace(/^"|"$/g, '');
      } else if (prop.icon) {
        container.icon = prop.icon.replace(/^"|"$/g, '');
      } else if (prop.badge) {
        container.badge = prop.badge.replace(/^"|"$/g, '');
      } else if (prop.collapsible !== undefined) {
        container.collapsible = prop.collapsible === 'true';
      } else if (prop.collapsed !== undefined) {
        container.collapsed = prop.collapsed === 'true';
      }
      // Phase 2: Collapse/expand properties
      else if (prop.collapseMode) {
        container.collapseMode = prop.collapseMode as 'full' | 'partial';
      } else if (prop.collapseRedirectEdges !== undefined) {
        container.collapseRedirectEdges = prop.collapseRedirectEdges === 'true';
      } else if (prop.collapseTransitionState) {
        container.collapseTransitionState = prop.collapseTransitionState as
          | 'stable'
          | 'collapsing'
          | 'expanding';
      } else if (prop.collapseAnimationDuration !== undefined) {
        container.collapseAnimationDuration = parseFloat(
          prop.collapseAnimationDuration
        );
      } else if (prop.collapseAnimationEasing) {
        container.collapseAnimationEasing = prop.collapseAnimationEasing as
          | 'linear'
          | 'easeIn'
          | 'easeOut'
          | 'easeInOut';
      } else if (prop.collapseSummary) {
        container.collapseSummary = prop.collapseSummary.replace(/^"|"$/g, '');
      } else if (prop.collapseShowCount !== undefined) {
        container.collapseShowCount = prop.collapseShowCount === 'true';
      } else if (prop.collapseIcon) {
        container.collapseIcon = prop.collapseIcon.replace(/^"|"$/g, '');
      } else if (prop.collapsePersistState !== undefined) {
        container.collapsePersistState = prop.collapsePersistState === 'true';
      } else if (prop.collapseStateKey) {
        container.collapseStateKey = prop.collapseStateKey.replace(
          /^"|"$/g,
          ''
        );
      } else if (prop.collapseKeyboardShortcut) {
        container.collapseKeyboardShortcut =
          prop.collapseKeyboardShortcut.replace(/^"|"$/g, '');
      }
    } else if (Langium.isContainerStyleProperty(prop)) {
      // Phase 1: Basic style properties
      if (prop.borderStyle) {
        containerStyle.borderStyle = prop.borderStyle as LineStyle;
      } else if (prop.strokeColor) {
        containerStyle.strokeColor = prop.strokeColor.replace(/^"|"$/g, '');
      } else if (prop.strokeWidth !== undefined) {
        containerStyle.strokeWidth = parseFloat(prop.strokeWidth);
      } else if (prop.fillColor) {
        containerStyle.fillColor = prop.fillColor.replace(/^"|"$/g, '');
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
      } else if (prop.shadow !== undefined) {
        containerStyle.shadow = prop.shadow === 'true';
      } else if (prop.depth !== undefined) {
        containerStyle.depth = parseFloat(prop.depth);
      } else if (prop.headerPosition) {
        containerStyle.headerPosition = prop.headerPosition as
          | 'top'
          | 'bottom'
          | 'left'
          | 'right';
      } else if (prop.headerBackgroundColor) {
        containerStyle.headerBackgroundColor =
          prop.headerBackgroundColor.replace(/^"|"$/g, '');
      } else if (prop.iconSize !== undefined) {
        containerStyle.iconSize = parseFloat(prop.iconSize);
      } else if (prop.iconColor) {
        containerStyle.iconColor = prop.iconColor.replace(/^"|"$/g, '');
      }
      // Phase 3: Layout and sizing properties
      else if (prop.minWidth !== undefined) {
        containerStyle.minWidth = parseFloat(prop.minWidth);
      } else if (prop.maxWidth !== undefined) {
        containerStyle.maxWidth = parseFloat(prop.maxWidth);
      } else if (prop.minHeight !== undefined) {
        containerStyle.minHeight = parseFloat(prop.minHeight);
      } else if (prop.maxHeight !== undefined) {
        containerStyle.maxHeight = parseFloat(prop.maxHeight);
      } else if (prop.autoResize) {
        if (prop.autoResize === 'true') {
          containerStyle.autoResize = true;
        } else if (prop.autoResize === 'false') {
          containerStyle.autoResize = false;
        } else {
          containerStyle.autoResize = prop.autoResize as
            | 'fit-content'
            | 'fill-available';
        }
      } else if (prop.paddingTop !== undefined) {
        containerStyle.paddingTop = parseFloat(prop.paddingTop);
      } else if (prop.paddingRight !== undefined) {
        containerStyle.paddingRight = parseFloat(prop.paddingRight);
      } else if (prop.paddingBottom !== undefined) {
        containerStyle.paddingBottom = parseFloat(prop.paddingBottom);
      } else if (prop.paddingLeft !== undefined) {
        containerStyle.paddingLeft = parseFloat(prop.paddingLeft);
      } else if (prop.margin !== undefined) {
        containerStyle.margin = parseFloat(prop.margin);
      } else if (prop.marginTop !== undefined) {
        containerStyle.marginTop = parseFloat(prop.marginTop);
      } else if (prop.marginRight !== undefined) {
        containerStyle.marginRight = parseFloat(prop.marginRight);
      } else if (prop.marginBottom !== undefined) {
        containerStyle.marginBottom = parseFloat(prop.marginBottom);
      } else if (prop.marginLeft !== undefined) {
        containerStyle.marginLeft = parseFloat(prop.marginLeft);
      } else if (prop.alignContent) {
        containerStyle.alignContent = prop.alignContent as
          | 'left'
          | 'center'
          | 'right';
      } else if (prop.verticalAlign) {
        containerStyle.verticalAlign = prop.verticalAlign as
          | 'top'
          | 'middle'
          | 'bottom';
      } else if (prop.distribution) {
        containerStyle.distribution = prop.distribution as
          | 'space-evenly'
          | 'space-between'
          | 'space-around'
          | 'packed';
      } else if (prop.nodeSpacing !== undefined) {
        containerStyle.nodeSpacing = parseFloat(prop.nodeSpacing);
      } else if (prop.edgeRouting) {
        containerStyle.edgeRouting = prop.edgeRouting as
          | 'container-aware'
          | 'orthogonal'
          | 'spline'
          | 'polyline';
      } else if (prop.edgeBundling !== undefined) {
        containerStyle.edgeBundling = prop.edgeBundling === 'true';
      } else if (prop.crossContainerEdgeOptimization !== undefined) {
        containerStyle.crossContainerEdgeOptimization =
          prop.crossContainerEdgeOptimization === 'true';
      } else if (prop.layoutCache !== undefined) {
        containerStyle.layoutCache = prop.layoutCache === 'true';
      } else if (prop.incrementalLayout !== undefined) {
        containerStyle.incrementalLayout = prop.incrementalLayout === 'true';
      } else if (prop.layoutComplexity) {
        containerStyle.layoutComplexity = prop.layoutComplexity as
          | 'low'
          | 'medium'
          | 'high';
      }
      // Phase 4: Visual controls and interaction
      else if (prop.collapseButtonVisible !== undefined) {
        containerStyle.collapseButtonVisible =
          prop.collapseButtonVisible === 'true';
      } else if (prop.collapseButtonPosition) {
        containerStyle.collapseButtonPosition = prop.collapseButtonPosition as
          | 'top-left'
          | 'top-right'
          | 'bottom-left'
          | 'bottom-right';
      } else if (prop.collapseButtonStyle) {
        containerStyle.collapseButtonStyle = prop.collapseButtonStyle as
          | 'icon'
          | 'text'
          | 'icon-text';
      } else if (prop.collapseButtonSize !== undefined) {
        containerStyle.collapseButtonSize = parseFloat(prop.collapseButtonSize);
      } else if (prop.collapseButtonColor) {
        containerStyle.collapseButtonColor = prop.collapseButtonColor.replace(
          /^"|"$/g,
          ''
        );
      } else if (prop.resizable !== undefined) {
        containerStyle.resizable = prop.resizable === 'true';
      } else if (prop.resizeHandles && prop.resizeHandles.length > 0) {
        containerStyle.resizeHandles = prop.resizeHandles as (
          | 'n'
          | 's'
          | 'e'
          | 'w'
          | 'ne'
          | 'nw'
          | 'se'
          | 'sw'
        )[];
      } else if (prop.minResizeWidth !== undefined) {
        containerStyle.minResizeWidth = parseFloat(prop.minResizeWidth);
      } else if (prop.minResizeHeight !== undefined) {
        containerStyle.minResizeHeight = parseFloat(prop.minResizeHeight);
      } else if (prop.hoverHighlight !== undefined) {
        containerStyle.hoverHighlight = prop.hoverHighlight === 'true';
      } else if (prop.hoverBorderColor) {
        containerStyle.hoverBorderColor = prop.hoverBorderColor.replace(
          /^"|"$/g,
          ''
        );
      } else if (prop.hoverBorderWidth !== undefined) {
        containerStyle.hoverBorderWidth = parseFloat(prop.hoverBorderWidth);
      } else if (prop.selectionHighlight !== undefined) {
        containerStyle.selectionHighlight = prop.selectionHighlight === 'true';
      } else if (prop.selectionBorderColor) {
        containerStyle.selectionBorderColor = prop.selectionBorderColor.replace(
          /^"|"$/g,
          ''
        );
      } else if (prop.selectionBorderWidth !== undefined) {
        containerStyle.selectionBorderWidth = parseFloat(
          prop.selectionBorderWidth
        );
      } else if (prop.showChildCount !== undefined) {
        containerStyle.showChildCount = prop.showChildCount === 'true';
      } else if (prop.childCountPosition) {
        containerStyle.childCountPosition = prop.childCountPosition as
          | 'top-left'
          | 'top-right'
          | 'bottom-left'
          | 'bottom-right';
      } else if (prop.showDepthIndicator !== undefined) {
        containerStyle.showDepthIndicator = prop.showDepthIndicator === 'true';
      } else if (prop.depthIndicatorStyle) {
        containerStyle.depthIndicatorStyle = prop.depthIndicatorStyle as
          | 'bar'
          | 'indent'
          | 'color';
      }
      // Phase 5: Templates and presets
      else if (prop.templateId) {
        containerStyle.templateId = prop.templateId.replace(/^"|"$/g, '');
      } else if (prop.extends) {
        containerStyle.extends = prop.extends.replace(/^"|"$/g, '');
      } else if (prop.preset) {
        containerStyle.preset = prop.preset.replace(/^"|"$/g, '');
      }
    } else if (Langium.isContainerLayoutProperty(prop)) {
      if (prop.algorithm) {
        layoutOptions.algorithm = prop.algorithm;
      } else if (prop.direction) {
        layoutOptions.direction = prop.direction;
      } else if (prop.spacing !== undefined) {
        layoutOptions.spacing = parseFloat(prop.spacing);
      } else if (prop.orientation) {
        layoutOptions.orientation = prop.orientation as
          | 'horizontal'
          | 'vertical';
      }
    }
  }

  if (styleRef) container.style = styleRef;
  if (block.shape) container.shape = block.shape;
  if (Object.keys(containerStyle).length > 0)
    container.containerStyle = containerStyle;
  if (Object.keys(layoutOptions).length > 0)
    container.layoutOptions = layoutOptions as any;

  // Process nested statements
  let isFirstNode = true;
  for (const statement of block.statements) {
    if (Langium.isShapeDeclaration(statement)) {
      container.children.push(statement.id);

      let shape: string;
      if (statement.shape) {
        shape = statement.shape;
      } else if (containerType === 'mindmap') {
        shape = isFirstNode ? 'circ' : 'rounded';
      } else {
        shape = 'rounded';
      }

      if (isFirstNode) isFirstNode = false;

      const node: NodeAst = {
        id: statement.id,
        shape,
        data: {},
      };

      processNodeProperties(node, statement.properties);

      diagram.nodes.push(node);
      declaredNodes.add(statement.id);
    } else if (Langium.isEdgeDeclaration(statement)) {
      const fromId = nodeRefToString(statement.from);
      const toId = nodeRefToString(statement.to);

      const edge: EdgeAst = {
        from: fromId,
        to: toId,
      };

      if (statement.labeledArrow) {
        const match = statement.labeledArrow.match(/^-(.+)->$/);
        if (match) {
          edge.label = match[1];
        }
      }

      if (statement.bidirectionalArrow) {
        edge.bidirectional = true;
      }

      processEdgeProperties(edge, statement.properties);

      diagram.edges.push(edge);

      if (!statement.from.member && !declaredNodes.has(fromId)) {
        diagram.nodes.push({
          id: fromId,
          shape: 'rounded',
          data: {},
        });
        declaredNodes.add(fromId);
      }

      if (!statement.to.member && !declaredNodes.has(toId)) {
        diagram.nodes.push({
          id: toId,
          shape: 'rounded',
          data: {},
        });
        declaredNodes.add(toId);
      }
    } else if (Langium.isContainerBlock(statement)) {
      const nestedContainer = convertContainer(
        statement,
        declaredNodes,
        diagram
      );

      if (!container.containers) {
        container.containers = [];
      }
      container.containers.push(nestedContainer);
    }
  }

  return container;
}

/**
 * Convert template block to template definition
 */
export function convertTemplate(
  block: Langium.TemplateBlock
): ContainerTemplate {
  const template: ContainerTemplate = {
    id: block.id.replace(/^"|"$/g, ''),
  };

  if (block.label) {
    template.label = block.label.replace(/^"|"$/g, '');
  }
  if (block.description) {
    template.description = block.description.replace(/^"|"$/g, '');
  }

  if (block.parameters && block.parameters.length > 0) {
    template.parameters = block.parameters.map((param: any) => {
      const templateParam: TemplateParameter = {
        name: param.name.replace(/^"|"$/g, ''),
        type: param.type as 'string' | 'number' | 'boolean' | 'color',
      };

      if (param.defaultValue !== undefined) {
        if (param.type === 'string') {
          templateParam.defaultValue = param.defaultValue.replace(/^"|"$/g, '');
        } else if (param.type === 'number') {
          templateParam.defaultValue = parseFloat(param.defaultValue);
        } else if (param.type === 'boolean') {
          templateParam.defaultValue = param.defaultValue === 'true';
        } else if (param.type === 'color') {
          templateParam.defaultValue = param.defaultValue.replace(/^"|"$/g, '');
        }
      }

      return templateParam;
    });
  }

  if (block.children && block.children.length > 0) {
    template.children = block.children.map((child: string) =>
      child.replace(/^"|"$/g, '')
    );
  }

  if (block.properties && block.properties.length > 0) {
    const containerStyle: ContainerStyle = {};

    for (const prop of block.properties) {
      if (Langium.isContainerStyleProperty(prop)) {
        if (prop.fillColor) {
          containerStyle.fillColor = prop.fillColor.replace(/^"|"$/g, '');
        } else if (prop.strokeColor) {
          containerStyle.strokeColor = prop.strokeColor.replace(/^"|"$/g, '');
        } else if (prop.strokeWidth !== undefined) {
          containerStyle.strokeWidth = parseFloat(prop.strokeWidth);
        } else if (prop.borderStyle) {
          containerStyle.borderStyle = prop.borderStyle as LineStyle;
        } else if (prop.padding !== undefined) {
          containerStyle.padding = parseFloat(prop.padding);
        } else if (prop.opacity !== undefined) {
          containerStyle.opacity = parseFloat(prop.opacity);
        } else if (prop.labelPosition) {
          containerStyle.labelPosition = prop.labelPosition as
            | 'top'
            | 'bottom'
            | 'left'
            | 'right';
        } else if (prop.shadow !== undefined) {
          containerStyle.shadow = prop.shadow === 'true';
        } else if (prop.depth !== undefined) {
          containerStyle.depth = parseFloat(prop.depth);
        }
      }
    }

    if (Object.keys(containerStyle).length > 0) {
      template.containerStyle = containerStyle;
    }
  }

  return template;
}

/**
 * Convert preset block to preset definition
 */
export function convertPreset(block: Langium.PresetBlock): ContainerPreset {
  const preset: ContainerPreset = {
    id: block.id.replace(/^"|"$/g, ''),
    style: {},
  };

  if (block.label) {
    preset.label = block.label.replace(/^"|"$/g, '');
  }

  if (block.properties && block.properties.length > 0) {
    for (const prop of block.properties) {
      if (Langium.isContainerStyleProperty(prop)) {
        if (prop.fillColor) {
          preset.style.fillColor = prop.fillColor.replace(/^"|"$/g, '');
        } else if (prop.strokeColor) {
          preset.style.strokeColor = prop.strokeColor.replace(/^"|"$/g, '');
        } else if (prop.strokeWidth !== undefined) {
          preset.style.strokeWidth = parseFloat(prop.strokeWidth);
        } else if (prop.borderStyle) {
          preset.style.borderStyle = prop.borderStyle as LineStyle;
        } else if (prop.padding !== undefined) {
          preset.style.padding = parseFloat(prop.padding);
        } else if (prop.opacity !== undefined) {
          preset.style.opacity = parseFloat(prop.opacity);
        } else if (prop.labelPosition) {
          preset.style.labelPosition = prop.labelPosition as
            | 'top'
            | 'bottom'
            | 'left'
            | 'right';
        } else if (prop.shadow !== undefined) {
          preset.style.shadow = prop.shadow === 'true';
        } else if (prop.depth !== undefined) {
          preset.style.depth = parseFloat(prop.depth);
        }
      }
    }
  }

  return preset;
}
