import type { DiagramAst } from '../types/index.js';
import { validateBpmnDiagram } from './bpmn.js';

// TODO: Do we actually need this anymore?  Its only used in CLI
export type DiagramType =
  | 'flowchart'
  | 'sequence'
  | 'entity-relationship'
  | 'state-machine'
  | 'block-diagram'
  | 'use-case'
  | 'bpmn'
  | 'generic';

export interface DiagramValidationError {
  message: string;
  nodeId?: string;
  line?: number;
  column?: number;
}

export interface DiagramValidationResult {
  valid: boolean;
  errors: DiagramValidationError[];
  warnings: DiagramValidationError[];
}

export interface DiagramTypeConstraints {
  type: DiagramType;
  allowedShapes: string[];
  requiredProperties?: string[];
  description: string;
}

// Diagram type definitions with shape constraints
export const DIAGRAM_TYPE_CONSTRAINTS: Record<
  DiagramType,
  DiagramTypeConstraints
> = {
  flowchart: {
    type: 'flowchart',
    description: 'Flow diagrams showing process steps and decision points',
    allowedShapes: ['rounded', 'rhombus', 'doc', 'hex'],
  },
  sequence: {
    type: 'sequence',
    description: 'Sequence diagrams showing interactions between actors',
    allowedShapes: ['actor', 'rounded'],
  },
  'entity-relationship': {
    type: 'entity-relationship',
    description: 'ER diagrams showing data entities and relationships',
    allowedShapes: ['rounded', 'rhombus'],
  },
  'state-machine': {
    type: 'state-machine',
    description: 'State diagrams showing states and transitions',
    allowedShapes: ['rounded', 'hex'],
  },
  'block-diagram': {
    type: 'block-diagram',
    description: 'Control system and signal flow diagrams',
    allowedShapes: [
      'box',
      'rounded',
      'junction',
      'multiply-junction',
      'divide-junction',
      'compare-junction',
      'transfer-fn',
      'gain',
      'integrator',
      'differentiator',
      'time-delay',
      'saturation',
      'small-circle',
      'circle',
    ],
  },
  'use-case': {
    type: 'use-case',
    description: 'UML use case diagrams showing actors and system interactions',
    allowedShapes: [
      'actor',
      'actor-circle',
      'actor-rect',
      'person',
      'ellipse-wide',
      'system-boundary',
      'rounded',
    ],
  },
  bpmn: {
    type: 'bpmn',
    description: 'BPMN diagrams with pools, lanes, events, gateways, and tasks',
    allowedShapes: [
      'bpmnTask',
      'bpmnEvent',
      'bpmnGateway',
      'bpmnDataObject',
      'bpmnMessage',
      'bpmnPool',
      'bpmnLane',
      'transaction',
      'eventSubProcess',
      'callActivity',
      'startNonInterfering',
      'intermediateNonInterfering',
      'conversation',
      'annotation',
    ],
  },
  generic: {
    type: 'generic',
    description: 'Generic diagrams with no shape restrictions',
    allowedShapes: [], // empty means all shapes allowed
  },
};

export function validateDiagramType(
  ast: DiagramAst,
  diagramType?: DiagramType
): DiagramValidationResult {
  const errors: DiagramValidationError[] = [];
  const warnings: DiagramValidationError[] = [];

  // If no type specified, use generic (no constraints)
  if (!diagramType || diagramType === 'generic') {
    return { valid: true, errors: [], warnings: [] };
  }

  const constraints = DIAGRAM_TYPE_CONSTRAINTS[diagramType];
  if (!constraints) {
    errors.push({
      message: `Unknown diagram type: ${diagramType}. Valid types: ${Object.keys(DIAGRAM_TYPE_CONSTRAINTS).join(', ')}`,
    });
    return { valid: false, errors, warnings };
  }

  // Validate shape usage
  if (constraints.allowedShapes.length > 0) {
    for (const node of ast.nodes) {
      if (!constraints.allowedShapes.includes(node.shape)) {
        errors.push({
          message: `Shape "${node.shape}" is not allowed in ${diagramType} diagrams. Allowed shapes: ${constraints.allowedShapes.join(', ')}`,
          nodeId: node.id,
        });
      }
    }
  }

  // Check for duplicate node IDs
  const nodeIds = new Set<string>();
  for (const node of ast.nodes) {
    if (nodeIds.has(node.id)) {
      errors.push({
        message: `Duplicate node ID: ${node.id}`,
        nodeId: node.id,
      });
    }
    nodeIds.add(node.id);
  }

  // Validate edges reference existing nodes
  for (const edge of ast.edges) {
    if (!nodeIds.has(edge.from)) {
      warnings.push({
        message: `Edge references non-existent node: ${edge.from}`,
      });
    }
    if (!nodeIds.has(edge.to)) {
      warnings.push({
        message: `Edge references non-existent node: ${edge.to}`,
      });
    }
  }

  // Validate groups reference existing nodes
  if (ast.groups) {
    for (const group of ast.groups) {
      for (const childId of group.children) {
        if (!nodeIds.has(childId)) {
          errors.push({
            message: `Group "${group.label}" references non-existent node: ${childId}`,
          });
        }
      }
    }
  }

  if (diagramType === 'bpmn') {
    const bpmnResult = validateBpmnDiagram(ast);
    errors.push(...bpmnResult.errors);
    warnings.push(...bpmnResult.warnings);
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function listDiagramTypes(): DiagramTypeConstraints[] {
  return Object.values(DIAGRAM_TYPE_CONSTRAINTS);
}
