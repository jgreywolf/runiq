import type { DiagramAst, ContainerDeclaration } from '../types/index.js';
import { ArrowType, LineStyle } from '../constants.js';
import type {
  DiagramValidationError,
  DiagramValidationResult,
} from './validation.js';

interface BpmnContainerIndex {
  nodeToPool: Map<string, string>;
  nodeToLane: Map<string, string>;
  poolIds: Set<string>;
  laneIds: Set<string>;
  laneWithoutPool: ContainerDeclaration[];
}

function extractNodeId(reference: string): string {
  const dotIndex = reference.indexOf('.');
  let id = dotIndex > 0 ? reference.substring(0, dotIndex) : reference;
  const hashIndex = id.indexOf('#');
  if (hashIndex > 0) {
    id = id.substring(0, hashIndex);
  }
  return id;
}

function buildBpmnContainerIndex(
  containers: ContainerDeclaration[] | undefined
): BpmnContainerIndex {
  const nodeToPool = new Map<string, string>();
  const nodeToLane = new Map<string, string>();
  const poolIds = new Set<string>();
  const laneIds = new Set<string>();
  const laneWithoutPool: ContainerDeclaration[] = [];

  const walk = (
    items: ContainerDeclaration[],
    currentPoolId?: string,
    currentLaneId?: string
  ) => {
    for (const container of items) {
      const containerId = container.id || container.label || '';
      const isPool = container.shape === 'bpmnPool';
      const isLane = container.shape === 'bpmnLane';
      const poolId = isPool ? containerId : currentPoolId;
      const laneId = isLane ? containerId : currentLaneId;

      if (isPool && poolId) {
        poolIds.add(poolId);
      }
      if (isLane && laneId) {
        laneIds.add(laneId);
        if (!poolId) {
          laneWithoutPool.push(container);
        }
      }

      for (const child of container.children) {
        if (poolId) {
          nodeToPool.set(child, poolId);
        }
        if (laneId) {
          nodeToLane.set(child, laneId);
        }
      }

      if (container.containers && container.containers.length > 0) {
        walk(container.containers, poolId, laneId);
      }
    }
  };

  if (containers) {
    walk(containers);
  }

  return {
    nodeToPool,
    nodeToLane,
    poolIds,
    laneIds,
    laneWithoutPool,
  };
}

export function validateBpmnDiagram(ast: DiagramAst): DiagramValidationResult {
  const errors: DiagramValidationError[] = [];
  const warnings: DiagramValidationError[] = [];

  if (!ast.containers || ast.containers.length === 0) {
    return { valid: true, errors, warnings };
  }

  const index = buildBpmnContainerIndex(ast.containers);

  if (index.laneWithoutPool.length > 0) {
    for (const lane of index.laneWithoutPool) {
      errors.push({
        message: `BPMN lane "${lane.label || lane.id}" must be nested inside a BPMN pool.`,
        nodeId: lane.id,
      });
    }
  }

  if (index.poolIds.size > 0) {
    for (const node of ast.nodes) {
      if (node.shape.startsWith('bpmn') && !index.nodeToPool.has(node.id)) {
        warnings.push({
          message: `BPMN shape "${node.id}" is not inside a BPMN pool.`,
          nodeId: node.id,
        });
      }
    }
  }

  for (const edge of ast.edges) {
    const fromId = extractNodeId(edge.from);
    const toId = extractNodeId(edge.to);
    const fromPool = index.nodeToPool.get(fromId);
    const toPool = index.nodeToPool.get(toId);

    if (!fromPool || !toPool) {
      continue;
    }

    if (fromPool !== toPool) {
      const isMessageFlow =
        edge.lineStyle === LineStyle.DASHED || edge.arrowType === ArrowType.OPEN;
      if (!isMessageFlow) {
        warnings.push({
          message:
            'Message flow expected between BPMN pools. Use dashed lines or open arrows.',
        });
      }
    } else {
      const isMessageFlow =
        edge.lineStyle === LineStyle.DASHED || edge.arrowType === ArrowType.OPEN;
      if (isMessageFlow) {
        warnings.push({
          message:
            'Sequence flow expected within a BPMN pool. Avoid dashed/open message flow styling inside pools.',
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
