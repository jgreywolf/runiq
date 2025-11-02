import type {
  DiagramAst,
  NodeAst,
  EdgeAst,
  GroupAst,
  Style,
  Direction,
  EdgeRouting,
  ContainerDeclaration,
  ContainerStyle,
  ContainerTemplate,
  TemplateParameter,
  ContainerPreset,
  RuniqDocument,
  DiagramProfile,
  ElectricalProfile,
  DigitalProfile,
  WardleyProfile,
  WardleyComponent,
  WardleyDependency,
  WardleyAnchor,
  WardleyEvolution,
  SequenceProfile,
  SequenceParticipant,
  SequenceMessage,
  SequenceNote,
  SequenceFragment,
  SequenceFragmentAlternative,
  NetAst,
  PartAst,
  AnalysisAst,
  ModuleAst,
  PortAst,
  InstanceAst,
  PneumaticProfile,
  HydraulicProfile,
  PressureSpec,
  FlowRateSpec,
  FluidSpec,
  TemperatureRange,
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
    } else if (Langium.isWardleyProfile(profile)) {
      runiqDoc.profiles.push(convertWardleyProfile(profile));
    } else if (Langium.isSequenceProfile(profile)) {
      runiqDoc.profiles.push(convertSequenceProfile(profile));
    } else if (Langium.isPneumaticProfile(profile)) {
      runiqDoc.profiles.push(convertPneumaticProfile(profile));
    } else if (Langium.isHydraulicProfile(profile)) {
      runiqDoc.profiles.push(convertHydraulicProfile(profile));
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
 * Convert WardleyProfile to core AST format
 */
function convertWardleyProfile(
  profile: Langium.WardleyProfile
): WardleyProfile {
  const wardleyProfile: WardleyProfile = {
    type: 'wardley',
    astVersion: '1.0',
    name: profile.name.replace(/^"|"$/g, ''),
    components: [],
    dependencies: [],
  };

  // Process Wardley statements
  for (const statement of profile.statements) {
    if (Langium.isWardleyComponentStatement(statement)) {
      // component "Customer" evolution:0.8 value:0.9
      const component: WardleyComponent = {
        name: statement.name.replace(/^"|"$/g, ''),
        evolution: 0.5, // Default
        value: 0.5, // Default
      };

      for (const prop of statement.properties) {
        if (Langium.isWardleyEvolutionProperty(prop)) {
          component.evolution = parseFloat(prop.value);
        } else if (Langium.isWardleyValueProperty(prop)) {
          component.value = parseFloat(prop.value);
        } else if (Langium.isWardleyLabelProperty(prop)) {
          component.label = prop.value.replace(/^"|"$/g, '');
        } else if (Langium.isWardleyInertiaProperty(prop)) {
          component.inertia = prop.value === 'true';
        }
      }

      wardleyProfile.components.push(component);
    } else if (Langium.isWardleyDependencyStatement(statement)) {
      // dependency from:"Customer" to:"Cup of Tea"
      const dependency: WardleyDependency = {
        from: statement.from.replace(/^"|"$/g, ''),
        to: statement.to.replace(/^"|"$/g, ''),
      };
      wardleyProfile.dependencies.push(dependency);
    } else if (Langium.isWardleyAnchorStatement(statement)) {
      // anchor "User Need" value:0.95
      if (!wardleyProfile.anchors) wardleyProfile.anchors = [];
      const anchor: WardleyAnchor = {
        name: statement.name.replace(/^"|"$/g, ''),
        value: 0.9, // Default
      };

      for (const prop of statement.properties) {
        if (Langium.isWardleyValueProperty(prop)) {
          anchor.value = parseFloat(prop.value);
        } else if (Langium.isWardleyEvolutionProperty(prop)) {
          anchor.evolution = parseFloat(prop.value);
        }
      }

      wardleyProfile.anchors.push(anchor);
    } else if (Langium.isWardleyEvolutionStatement(statement)) {
      // evolve "Legacy System" to evolution:0.7
      if (!wardleyProfile.evolutions) wardleyProfile.evolutions = [];
      const evolution: WardleyEvolution = {
        component: statement.component.replace(/^"|"$/g, ''),
        toEvolution: 0.5, // Default
      };

      for (const prop of statement.properties) {
        if (Langium.isWardleyEvolutionProperty(prop)) {
          evolution.toEvolution = parseFloat(prop.value);
        }
      }

      wardleyProfile.evolutions.push(evolution);
    }
  }

  return wardleyProfile;
}

/**
 * Convert SequenceProfile from Langium AST to core format
 */
function convertSequenceProfile(
  profile: Langium.SequenceProfile
): SequenceProfile {
  const sequenceProfile: SequenceProfile = {
    type: 'sequence',
    astVersion: '1.0',
    title: profile.name.replace(/^"|"$/g, ''),
    participants: [],
    messages: [],
  };

  // Process sequence statements
  for (const statement of profile.statements) {
    if (Langium.isSequenceParticipantStatement(statement)) {
      // participant "Actor" as actor
      const name = statement.name.replace(/^"|"$/g, '');
      const participant: SequenceParticipant = {
        id: name.toLowerCase().replace(/\s+/g, '_'), // Generate ID from name
        name: name,
        type: statement.type || 'entity', // Default to entity
      };
      sequenceProfile.participants.push(participant);
    } else if (Langium.isSequenceMessageStatement(statement)) {
      // message from:"Actor" to:"Web Server" label:"HTTP Request" type:sync activate:true
      const message: SequenceMessage = {
        from: '',
        to: '',
        label: '',
        type: 'sync', // Default
      };

      for (const prop of statement.properties) {
        if (Langium.isSequenceFromProperty(prop)) {
          const from = prop.from.replace(/^"|"$/g, '');
          // Preserve 'lost' and 'found' as-is for special message types
          message.from =
            from === 'lost' || from === 'found'
              ? from
              : from.toLowerCase().replace(/\s+/g, '_');
        } else if (Langium.isSequenceToProperty(prop)) {
          const to = prop.to.replace(/^"|"$/g, '');
          // Preserve 'lost' and 'found' as-is for special message types
          message.to =
            to === 'lost' || to === 'found'
              ? to
              : to.toLowerCase().replace(/\s+/g, '_');
        } else if (Langium.isSequenceLabelProperty(prop)) {
          message.label = prop.label.replace(/^"|"$/g, '');
        } else if (Langium.isSequenceTypeProperty(prop)) {
          message.type = prop.type as SequenceMessage['type'];
        } else if (Langium.isSequenceActivateProperty(prop)) {
          message.activate = prop.value === 'true';
        } else if (Langium.isSequenceGuardProperty(prop)) {
          message.guard = prop.value.replace(/^"|"$/g, '');
        } else if (Langium.isSequenceTimingProperty(prop)) {
          message.timing = prop.value.replace(/^"|"$/g, '');
        }
      }

      sequenceProfile.messages.push(message);
    } else if (Langium.isSequenceNoteStatement(statement)) {
      // note "This is a note" position:left participants:("Actor")
      if (!sequenceProfile.notes) sequenceProfile.notes = [];

      const note: SequenceNote = {
        text: statement.text.replace(/^"|"$/g, ''),
        position: 'left', // Default
        participants: [],
      };

      for (const prop of statement.properties) {
        if (Langium.isSequenceNotePositionProperty(prop)) {
          note.position = prop.position as SequenceNote['position'];
        } else if (Langium.isSequenceNoteParticipantsProperty(prop)) {
          note.participants = prop.participants.map((p) => {
            const name = p.replace(/^"|"$/g, '');
            return name.toLowerCase().replace(/\s+/g, '_');
          });
        }
      }

      sequenceProfile.notes.push(note);
    } else if (Langium.isSequenceFragmentStatement(statement)) {
      // fragment loop "Retry Logic" from:5 to:7
      if (!sequenceProfile.fragments) sequenceProfile.fragments = [];

      const fragment: SequenceFragment = {
        type: statement.type as SequenceFragment['type'],
        label: statement.label.replace(/^"|"$/g, ''),
        startAfterMessage: 0,
        endAfterMessage: 0,
      };

      for (const prop of statement.properties) {
        if (Langium.isSequenceFragmentFromProperty(prop)) {
          fragment.startAfterMessage = parseFloat(prop.from);
        } else if (Langium.isSequenceFragmentToProperty(prop)) {
          fragment.endAfterMessage = parseFloat(prop.to);
        } else if (Langium.isSequenceFragmentAlternativesProperty(prop)) {
          if (!fragment.alternatives) fragment.alternatives = [];
          for (const alt of prop.alternatives) {
            const alternative: SequenceFragmentAlternative = {
              label: alt.label.replace(/^"|"$/g, ''),
              startAfterMessage: parseFloat(alt.fromMsg),
              endAfterMessage: parseFloat(alt.toMsg),
            };
            fragment.alternatives.push(alternative);
          }
        }
      }

      sequenceProfile.fragments.push(fragment);
    }
  }

  return sequenceProfile;
}

/**
 * Convert PneumaticProfile to core AST format
 */
function convertPneumaticProfile(
  profile: Langium.PneumaticProfile
): PneumaticProfile {
  const pneumaticProfile: PneumaticProfile = {
    type: 'pneumatic',
    name: profile.name.replace(/^"|"$/g, ''),
    nets: [],
    parts: [],
  };

  // Process pneumatic statements
  for (const statement of profile.statements) {
    if (Langium.isNetStatement(statement)) {
      // net P, A, R
      for (const netName of statement.names) {
        pneumaticProfile.nets.push({ name: netName });
      }
    } else if (Langium.isPartStatement(statement)) {
      // part CYL1 type:CYL_SA pins:(A,P,EXHAUST)
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
        } else if (Langium.isPartPinsProperty(prop)) {
          part.pins = prop.pins;
        } else if (Langium.isPartGenericProperty(prop)) {
          let value = prop.value;
          if (
            typeof value === 'string' &&
            value.startsWith('"') &&
            value.endsWith('"')
          ) {
            value = value.slice(1, -1);
          }
          // Handle 'doc' property specially
          if (prop.key === 'doc') {
            part.doc = value as string;
          } else {
            if (!part.params) part.params = {};
            part.params[prop.key] = value;
          }
        }
      }

      pneumaticProfile.parts.push(part);
    } else if (Langium.isPressureStatement(statement)) {
      // pressure 6 bar operating
      const pressure: PressureSpec = {
        value: parseFloat(statement.value),
        unit: statement.unit as PressureSpec['unit'],
      };
      if (statement.type) {
        pressure.type = statement.type as PressureSpec['type'];
      }
      pneumaticProfile.pressure = pressure;
    } else if (Langium.isFlowRateStatement(statement)) {
      // flowRate 100 L/min
      const flowRate: FlowRateSpec = {
        value: parseFloat(statement.value),
        unit: statement.unit as FlowRateSpec['unit'],
      };
      pneumaticProfile.flowRate = flowRate;
    }
  }

  return pneumaticProfile;
}

/**
 * Convert HydraulicProfile to core AST format
 */
function convertHydraulicProfile(
  profile: Langium.HydraulicProfile
): HydraulicProfile {
  const hydraulicProfile: HydraulicProfile = {
    type: 'hydraulic',
    name: profile.name.replace(/^"|"$/g, ''),
    nets: [],
    parts: [],
  };

  // Process hydraulic statements
  for (const statement of profile.statements) {
    if (Langium.isNetStatement(statement)) {
      // net P, A, B, T
      for (const netName of statement.names) {
        hydraulicProfile.nets.push({ name: netName });
      }
    } else if (Langium.isPartStatement(statement)) {
      // part PUMP1 type:PUMP_FIXED pins:(T,P) doc:"Fixed displacement pump"
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
        } else if (Langium.isPartPinsProperty(prop)) {
          part.pins = prop.pins;
        } else if (Langium.isPartGenericProperty(prop)) {
          let value = prop.value;
          if (
            typeof value === 'string' &&
            value.startsWith('"') &&
            value.endsWith('"')
          ) {
            value = value.slice(1, -1);
          }
          // Handle 'doc' property specially
          if (prop.key === 'doc') {
            part.doc = value as string;
          } else {
            if (!part.params) part.params = {};
            part.params[prop.key] = value;
          }
        }
      }

      hydraulicProfile.parts.push(part);
    } else if (Langium.isPressureStatement(statement)) {
      // pressure 200 bar max
      const pressure: PressureSpec = {
        value: parseFloat(statement.value),
        unit: statement.unit as PressureSpec['unit'],
      };
      if (statement.type) {
        pressure.type = statement.type as PressureSpec['type'];
      }
      hydraulicProfile.pressure = pressure;
    } else if (Langium.isFlowRateStatement(statement)) {
      // flowRate 50 L/min
      const flowRate: FlowRateSpec = {
        value: parseFloat(statement.value),
        unit: statement.unit as FlowRateSpec['unit'],
      };
      hydraulicProfile.flowRate = flowRate;
    } else if (Langium.isFluidStatement(statement)) {
      // fluid mineral "ISO VG 46" temp:(10,60,C)
      const fluid: FluidSpec = {
        type: statement.type as FluidSpec['type'],
      };
      if (statement.viscosity) {
        fluid.viscosity = statement.viscosity.replace(/^"|"$/g, '');
      }
      if (
        statement.minTemp !== undefined &&
        statement.maxTemp !== undefined &&
        statement.tempUnit
      ) {
        const temperature: TemperatureRange = {
          min: parseFloat(statement.minTemp),
          max: parseFloat(statement.maxTemp),
          unit: statement.tempUnit as TemperatureRange['unit'],
        };
        fluid.temperature = temperature;
      }
      hydraulicProfile.fluid = fluid;
    }
  }

  return hydraulicProfile;
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
  } else if (Langium.isRoutingDeclaration(statement)) {
    diagram.routing = statement.value as EdgeRouting;
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

      // Strip trailing colon from key (grammar includes colon in property names)
      const key = prop.key.endsWith(':') ? prop.key.slice(0, -1) : prop.key;

      // Special handling for lineStyle: convert to strokeDasharray
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
      shape: statement.shape || 'rounded', // Default to rounded if no shape specified
    };

    // Process node properties
    for (const prop of statement.properties) {
      if (Langium.isLabelProperty(prop)) {
        node.label = prop.value.replace(/^"|"$/g, '');
      } else if (Langium.isStyleRefProperty(prop)) {
        node.style = prop.ref?.$refText;
      } else if (Langium.isFillProperty(prop)) {
        if (!node.data) node.data = {};
        node.data.fillColor = prop.value.replace(/^"|"$/g, '');
      } else if (Langium.isColorProperty(prop)) {
        if (!node.data) node.data = {};
        node.data.textColor = prop.value.replace(/^"|"$/g, '');
      } else if (Langium.isStrokeProperty(prop)) {
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
        // UML stereotype - supports single or multiple stereotypes
        if (!node.data) node.data = {};
        if (prop.values.length > 0) {
          // Multiple stereotypes: stereotypes: ["entity", "persistent"]
          node.data.stereotype = prop.values.map((v: string) =>
            v.replace(/^"|"$/g, '')
          );
        } else if (prop.value) {
          // Single stereotype: stereotype: "entity"
          node.data.stereotype = prop.value.replace(/^"|"$/g, '');
        }
      } else if (Langium.isEntryProperty(prop)) {
        // UML State Machine entry action
        node.entry = prop.value.replace(/^"|"$/g, '');
      } else if (Langium.isExitProperty(prop)) {
        // UML State Machine exit action
        node.exit = prop.value.replace(/^"|"$/g, '');
      } else if (Langium.isDoActivityProperty(prop)) {
        // UML State Machine do activity
        node.doActivity = prop.value.replace(/^"|"$/g, '');
      } else if (Langium.isInputPinsProperty(prop)) {
        // UML Activity Diagram input pins
        if (prop.value && Langium.isStringArray(prop.value)) {
          node.inputPins = prop.value.items.map((item) =>
            item.replace(/^"|"$/g, '')
          );
        }
      } else if (Langium.isOutputPinsProperty(prop)) {
        // UML Activity Diagram output pins
        if (prop.value && Langium.isStringArray(prop.value)) {
          node.outputPins = prop.value.items.map((item) =>
            item.replace(/^"|"$/g, '')
          );
        }
      } else if (Langium.isStateInvariantProperty(prop)) {
        // UML Sequence Diagram state invariant
        node.stateInvariant = prop.value.replace(/^"|"$/g, '');
      } else if (Langium.isExtensionPointsProperty(prop)) {
        // UML Use Case Diagram extension points
        if (prop.value && Langium.isStringArray(prop.value)) {
          node.extensionPoints = prop.value.items.map((item) =>
            item.replace(/^"|"$/g, '')
          );
        }
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
    // Helper function to process edge properties
    const processEdgeProperties = (edge: EdgeAst, properties: any[]) => {
      for (const prop of properties) {
        if (Langium.isEdgeLabelProperty(prop)) {
          edge.label = prop.label.replace(/^"|"$/g, '');
        } else if (Langium.isLineStyleProperty(prop)) {
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
          // Edge stereotype - supports single or multiple stereotypes
          if (prop.values.length > 0) {
            // Multiple stereotypes: stereotypes: ["include", "extend"]
            edge.stereotype = prop.values.map((v: string) =>
              v.replace(/^"|"$/g, '')
            );
          } else if (prop.value) {
            // Single stereotype: stereotype: "include"
            edge.stereotype = prop.value.replace(/^"|"$/g, '');
          }
        } else if (Langium.isEventProperty(prop)) {
          // UML State Machine event
          edge.event = prop.value.replace(/^"|"$/g, '');
        } else if (Langium.isGuardProperty(prop)) {
          // UML State Machine guard condition
          edge.guard = prop.value.replace(/^"|"$/g, '');
        } else if (Langium.isEffectProperty(prop)) {
          // UML State Machine effect/action
          edge.effect = prop.value.replace(/^"|"$/g, '');
        } else if (Langium.isFlowTypeProperty(prop)) {
          // UML Activity Diagram flow type
          edge.flowType = prop.value as 'control' | 'object';
        } else if (Langium.isStrokeProperty(prop)) {
          edge.strokeColor = prop.value.replace(/^"|"$/g, '');
        } else if (Langium.isStrokeWidthProperty(prop)) {
          edge.strokeWidth = parseFloat(prop.value);
        } else if (Langium.isStyleRefProperty(prop)) {
          edge.style = prop.ref?.$refText;
        }
      }
    };

    // Convert NodeRef to strings (supports member refs like Class.field)
    const fromId = nodeRefToString(statement.from);
    const toId = nodeRefToString(statement.to);

    // Create first edge
    const edge: EdgeAst = {
      from: fromId,
      to: toId,
    };

    if (statement.labeledArrow) {
      edge.label = statement.labeledArrow.slice(1, -2);
    }

    // Check for bidirectional arrow
    if (statement.bidirectionalArrow) {
      edge.bidirectional = true;
    }

    // Process edge properties
    processEdgeProperties(edge, statement.properties);

    diagram.edges.push(edge);

    // Handle chained edges: A -> B -> C becomes A -> B and B -> C
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

        if (chainSegment.bidirectionalArrow) {
          chainedEdge.bidirectional = true;
        }

        // Properties apply to all edges in the chain
        processEdgeProperties(chainedEdge, statement.properties);

        diagram.edges.push(chainedEdge);

        currentFrom = chainTo;
      }
    }

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
  } else if (Langium.isTemplateBlock(statement)) {
    // Phase 5: Template definitions
    const template = convertTemplate(statement);
    if (!diagram.templates) diagram.templates = [];
    diagram.templates.push(template);
  } else if (Langium.isPresetBlock(statement)) {
    // Phase 5: Preset definitions
    const preset = convertPreset(statement);
    if (!diagram.presets) diagram.presets = [];
    diagram.presets.push(preset);
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
    } else if (Langium.isContainerMetadataProperty(prop)) {
      // Phase 1: Container metadata properties
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
          | 'ease-in'
          | 'ease-out'
          | 'ease-in-out';
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
      if (prop.borderStyle) {
        containerStyle.borderStyle = prop.borderStyle;
      } else if (prop.borderColor) {
        containerStyle.borderColor = prop.borderColor.replace(/^"|"$/g, '');
      } else if (prop.borderWidth !== undefined) {
        containerStyle.borderWidth = parseFloat(prop.borderWidth);
      } else if (prop.fill) {
        // Use fill as consistent alias for backgroundColor
        containerStyle.backgroundColor = prop.fill.replace(/^"|"$/g, '');
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
      } else if (prop.shadow !== undefined) {
        // Phase 1: Shadow
        containerStyle.shadow = prop.shadow === 'true';
      } else if (prop.depth !== undefined) {
        // Phase 1: Depth
        containerStyle.depth = parseFloat(prop.depth);
      } else if (prop.headerPosition) {
        // Phase 1: Header position
        containerStyle.headerPosition = prop.headerPosition as
          | 'top'
          | 'bottom'
          | 'left'
          | 'right';
      } else if (prop.headerBackgroundColor) {
        // Phase 1: Header background color
        containerStyle.headerBackgroundColor =
          prop.headerBackgroundColor.replace(/^"|"$/g, '');
      } else if (prop.iconSize !== undefined) {
        // Phase 1: Icon size
        containerStyle.iconSize = parseFloat(prop.iconSize);
      } else if (prop.iconColor) {
        // Phase 1: Icon color
        containerStyle.iconColor = prop.iconColor.replace(/^"|"$/g, '');
      } else if (prop.minWidth !== undefined) {
        // Phase 3: Min width
        containerStyle.minWidth = parseFloat(prop.minWidth);
      } else if (prop.maxWidth !== undefined) {
        // Phase 3: Max width
        containerStyle.maxWidth = parseFloat(prop.maxWidth);
      } else if (prop.minHeight !== undefined) {
        // Phase 3: Min height
        containerStyle.minHeight = parseFloat(prop.minHeight);
      } else if (prop.maxHeight !== undefined) {
        // Phase 3: Max height
        containerStyle.maxHeight = parseFloat(prop.maxHeight);
      } else if (prop.autoResize) {
        // Phase 3: Auto resize
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
        // Phase 3: Padding top
        containerStyle.paddingTop = parseFloat(prop.paddingTop);
      } else if (prop.paddingRight !== undefined) {
        // Phase 3: Padding right
        containerStyle.paddingRight = parseFloat(prop.paddingRight);
      } else if (prop.paddingBottom !== undefined) {
        // Phase 3: Padding bottom
        containerStyle.paddingBottom = parseFloat(prop.paddingBottom);
      } else if (prop.paddingLeft !== undefined) {
        // Phase 3: Padding left
        containerStyle.paddingLeft = parseFloat(prop.paddingLeft);
      } else if (prop.margin !== undefined) {
        // Phase 3: Margin
        containerStyle.margin = parseFloat(prop.margin);
      } else if (prop.marginTop !== undefined) {
        // Phase 3: Margin top
        containerStyle.marginTop = parseFloat(prop.marginTop);
      } else if (prop.marginRight !== undefined) {
        // Phase 3: Margin right
        containerStyle.marginRight = parseFloat(prop.marginRight);
      } else if (prop.marginBottom !== undefined) {
        // Phase 3: Margin bottom
        containerStyle.marginBottom = parseFloat(prop.marginBottom);
      } else if (prop.marginLeft !== undefined) {
        // Phase 3: Margin left
        containerStyle.marginLeft = parseFloat(prop.marginLeft);
      } else if (prop.alignContent) {
        // Phase 3: Align content
        containerStyle.alignContent = prop.alignContent as
          | 'left'
          | 'center'
          | 'right';
      } else if (prop.verticalAlign) {
        // Phase 3: Vertical align
        containerStyle.verticalAlign = prop.verticalAlign as
          | 'top'
          | 'middle'
          | 'bottom';
      } else if (prop.distribution) {
        // Phase 3: Distribution
        containerStyle.distribution = prop.distribution as
          | 'space-evenly'
          | 'space-between'
          | 'space-around'
          | 'packed';
      } else if (prop.nodeSpacing !== undefined) {
        // Phase 3: Node spacing
        containerStyle.nodeSpacing = parseFloat(prop.nodeSpacing);
      } else if (prop.edgeRouting) {
        // Phase 3: Edge routing
        containerStyle.edgeRouting = prop.edgeRouting as
          | 'container-aware'
          | 'orthogonal'
          | 'spline'
          | 'polyline';
      } else if (prop.edgeBundling !== undefined) {
        // Phase 3: Edge bundling
        containerStyle.edgeBundling = prop.edgeBundling === 'true';
      } else if (prop.crossContainerEdgeOptimization !== undefined) {
        // Phase 3: Cross-container edge optimization
        containerStyle.crossContainerEdgeOptimization =
          prop.crossContainerEdgeOptimization === 'true';
      } else if (prop.layoutCache !== undefined) {
        // Phase 3: Layout cache
        containerStyle.layoutCache = prop.layoutCache === 'true';
      } else if (prop.incrementalLayout !== undefined) {
        // Phase 3: Incremental layout
        containerStyle.incrementalLayout = prop.incrementalLayout === 'true';
      } else if (prop.layoutComplexity) {
        // Phase 3: Layout complexity
        containerStyle.layoutComplexity = prop.layoutComplexity as
          | 'low'
          | 'medium'
          | 'high';
      } else if (prop.collapseButtonVisible !== undefined) {
        // Phase 4: Collapse button visible
        containerStyle.collapseButtonVisible =
          prop.collapseButtonVisible === 'true';
      } else if (prop.collapseButtonPosition) {
        // Phase 4: Collapse button position
        containerStyle.collapseButtonPosition = prop.collapseButtonPosition as
          | 'top-left'
          | 'top-right'
          | 'bottom-left'
          | 'bottom-right';
      } else if (prop.collapseButtonStyle) {
        // Phase 4: Collapse button style
        containerStyle.collapseButtonStyle = prop.collapseButtonStyle as
          | 'icon'
          | 'text'
          | 'icon-text';
      } else if (prop.collapseButtonSize !== undefined) {
        // Phase 4: Collapse button size
        containerStyle.collapseButtonSize = parseFloat(prop.collapseButtonSize);
      } else if (prop.collapseButtonColor) {
        // Phase 4: Collapse button color
        containerStyle.collapseButtonColor = prop.collapseButtonColor.replace(
          /^"|"$/g,
          ''
        );
      } else if (prop.resizable !== undefined) {
        // Phase 4: Resizable
        containerStyle.resizable = prop.resizable === 'true';
      } else if (prop.resizeHandles && prop.resizeHandles.length > 0) {
        // Phase 4: Resize handles
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
        // Phase 4: Min resize width
        containerStyle.minResizeWidth = parseFloat(prop.minResizeWidth);
      } else if (prop.minResizeHeight !== undefined) {
        // Phase 4: Min resize height
        containerStyle.minResizeHeight = parseFloat(prop.minResizeHeight);
      } else if (prop.hoverHighlight !== undefined) {
        // Phase 4: Hover highlight
        containerStyle.hoverHighlight = prop.hoverHighlight === 'true';
      } else if (prop.hoverBorderColor) {
        // Phase 4: Hover border color
        containerStyle.hoverBorderColor = prop.hoverBorderColor.replace(
          /^"|"$/g,
          ''
        );
      } else if (prop.hoverBorderWidth !== undefined) {
        // Phase 4: Hover border width
        containerStyle.hoverBorderWidth = parseFloat(prop.hoverBorderWidth);
      } else if (prop.selectionHighlight !== undefined) {
        // Phase 4: Selection highlight
        containerStyle.selectionHighlight = prop.selectionHighlight === 'true';
      } else if (prop.selectionBorderColor) {
        // Phase 4: Selection border color
        containerStyle.selectionBorderColor = prop.selectionBorderColor.replace(
          /^"|"$/g,
          ''
        );
      } else if (prop.selectionBorderWidth !== undefined) {
        // Phase 4: Selection border width
        containerStyle.selectionBorderWidth = parseFloat(
          prop.selectionBorderWidth
        );
      } else if (prop.showChildCount !== undefined) {
        // Phase 4: Show child count
        containerStyle.showChildCount = prop.showChildCount === 'true';
      } else if (prop.childCountPosition) {
        // Phase 4: Child count position
        containerStyle.childCountPosition = prop.childCountPosition as
          | 'top-left'
          | 'top-right'
          | 'bottom-left'
          | 'bottom-right';
      } else if (prop.showDepthIndicator !== undefined) {
        // Phase 4: Show depth indicator
        containerStyle.showDepthIndicator = prop.showDepthIndicator === 'true';
      } else if (prop.depthIndicatorStyle) {
        // Phase 4: Depth indicator style
        containerStyle.depthIndicatorStyle = prop.depthIndicatorStyle as
          | 'bar'
          | 'indent'
          | 'color';
      } else if (prop.templateId) {
        // Phase 5: Template reference
        containerStyle.templateId = prop.templateId.replace(/^"|"$/g, '');
      } else if (prop.extends) {
        // Phase 5: Extends/inheritance
        containerStyle.extends = prop.extends.replace(/^"|"$/g, '');
      } else if (prop.preset) {
        // Phase 5: Preset reference
        containerStyle.preset = prop.preset.replace(/^"|"$/g, '');
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

  if (block.shape) {
    container.shape = block.shape;
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

/**
 * Phase 5: Convert template definition
 */
function convertTemplate(block: Langium.TemplateBlock): ContainerTemplate {
  const template: ContainerTemplate = {
    id: block.id.replace(/^"|"$/g, ''),
  };

  // Extract label and description if present
  if (block.label) {
    template.label = block.label.replace(/^"|"$/g, '');
  }
  if (block.description) {
    template.description = block.description.replace(/^"|"$/g, '');
  }

  // Extract parameters if present
  if (block.parameters && block.parameters.length > 0) {
    template.parameters = block.parameters.map((param: any) => {
      const templateParam: TemplateParameter = {
        name: param.name.replace(/^"|"$/g, ''),
        type: param.type as 'string' | 'number' | 'boolean' | 'color',
      };

      // Add default value if present
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

  // Extract children placeholders if present
  if (block.children && block.children.length > 0) {
    template.children = block.children.map((child: string) =>
      child.replace(/^"|"$/g, '')
    );
  }

  // Extract container style properties
  if (block.properties && block.properties.length > 0) {
    const containerStyle: ContainerStyle = {};

    for (const prop of block.properties) {
      // Reuse the same property parsing logic from convertContainer
      if (Langium.isContainerStyleProperty(prop)) {
        // Phase 1 properties
        if (prop.fill) {
          // Use fill as consistent alias for backgroundColor
          containerStyle.backgroundColor = prop.fill.replace(/^"|"$/g, '');
        } else if (prop.backgroundColor) {
          containerStyle.backgroundColor = prop.backgroundColor.replace(
            /^"|"$/g,
            ''
          );
        } else if (prop.borderColor) {
          containerStyle.borderColor = prop.borderColor.replace(/^"|"$/g, '');
        } else if (prop.borderWidth !== undefined) {
          containerStyle.borderWidth = parseFloat(prop.borderWidth);
        } else if (prop.borderStyle) {
          containerStyle.borderStyle = prop.borderStyle as
            | 'solid'
            | 'dashed'
            | 'dotted';
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
        // Add more properties as needed for templates...
      }
    }

    if (Object.keys(containerStyle).length > 0) {
      template.containerStyle = containerStyle;
    }
  }

  return template;
}

/**
 * Phase 5: Convert preset definition
 */
function convertPreset(block: Langium.PresetBlock): ContainerPreset {
  const preset: ContainerPreset = {
    id: block.id.replace(/^"|"$/g, ''),
    style: {},
  };

  // Extract label if present
  if (block.label) {
    preset.label = block.label.replace(/^"|"$/g, '');
  }

  // Extract container style properties
  if (block.properties && block.properties.length > 0) {
    for (const prop of block.properties) {
      if (Langium.isContainerStyleProperty(prop)) {
        // Phase 1 properties
        if (prop.fill) {
          // Use fill as consistent alias for backgroundColor
          preset.style.backgroundColor = prop.fill.replace(/^"|"$/g, '');
        } else if (prop.backgroundColor) {
          preset.style.backgroundColor = prop.backgroundColor.replace(
            /^"|"$/g,
            ''
          );
        } else if (prop.borderColor) {
          preset.style.borderColor = prop.borderColor.replace(/^"|"$/g, '');
        } else if (prop.borderWidth !== undefined) {
          preset.style.borderWidth = parseFloat(prop.borderWidth);
        } else if (prop.borderStyle) {
          preset.style.borderStyle = prop.borderStyle as
            | 'solid'
            | 'dashed'
            | 'dotted';
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
        // Can add more Phase 2-4 properties as needed for presets...
      }
    }
  }

  return preset;
}
