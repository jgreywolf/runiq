import type { ContainerDeclaration, DiagramAst, EdgeAst, NodeAst } from '@runiq/core';

export interface BpmnExportResult {
  xml: string;
  warnings: string[];
}

export interface BpmnImportResult {
  diagram: DiagramAst;
  warnings: string[];
}

interface PoolInfo {
  id: string;
  label: string;
}

interface LaneInfo {
  id: string;
  label: string;
  poolId: string;
  nodeIds: string[];
}

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
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

function getNodeDataValue(node: NodeAst, key: string): string | undefined {
  const values = node.data?.values;
  if (!Array.isArray(values) || values.length === 0) {
    return undefined;
  }
  const entry = values[0];
  if (typeof entry !== 'object' || entry === null) {
    return undefined;
  }
  const value = (entry as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : undefined;
}

function buildBpmnIndex(containers?: ContainerDeclaration[]) {
  const nodeToPool = new Map<string, string>();
  const nodeToLane = new Map<string, string>();
  const pools: PoolInfo[] = [];
  const lanes: LaneInfo[] = [];

  const walk = (
    items: ContainerDeclaration[],
    currentPoolId?: string
  ) => {
    for (const container of items) {
      const containerId = container.id || container.label || '';
      if (container.shape === 'bpmnPool') {
        const label = container.label || containerId;
        pools.push({ id: containerId, label });
        currentPoolId = containerId;
      }

      if (container.shape === 'bpmnLane') {
        const label = container.label || containerId;
        const poolId = currentPoolId || 'default-pool';
        lanes.push({
          id: containerId,
          label,
          poolId,
          nodeIds: [...container.children],
        });
        for (const child of container.children) {
          nodeToLane.set(child, containerId);
        }
      }

      if (currentPoolId) {
        for (const child of container.children) {
          nodeToPool.set(child, currentPoolId);
        }
      }

      if (container.containers && container.containers.length > 0) {
        walk(container.containers, currentPoolId);
      }
    }
  };

  if (containers) {
    walk(containers);
  }

  return { nodeToPool, nodeToLane, pools, lanes };
}

function renderFlowNode(node: NodeAst, warnings: string[]): string | null {
  const name = escapeXml(node.label || node.id);

  if (node.shape === 'bpmnTask') {
    return `<bpmn:task id="${node.id}" name="${name}" />`;
  }

  if (node.shape === 'bpmnGateway') {
    const gatewayType = getNodeDataValue(node, 'gatewayType') || 'exclusive';
    const tag = {
      exclusive: 'exclusiveGateway',
      parallel: 'parallelGateway',
      inclusive: 'inclusiveGateway',
      eventBased: 'eventBasedGateway',
      complex: 'complexGateway',
    }[gatewayType] || 'exclusiveGateway';
    return `<bpmn:${tag} id="${node.id}" name="${name}" />`;
  }

  if (node.shape === 'bpmnEvent') {
    const eventType = getNodeDataValue(node, 'eventType') || 'intermediate';
    const eventTag =
      eventType === 'start'
        ? 'startEvent'
        : eventType === 'end'
          ? 'endEvent'
          : 'intermediateCatchEvent';
    const definitionTag = {
      timer: 'timerEventDefinition',
      message: 'messageEventDefinition',
      error: 'errorEventDefinition',
      signal: 'signalEventDefinition',
      conditional: 'conditionalEventDefinition',
    }[eventType];
    if (definitionTag) {
      return `<bpmn:${eventTag} id="${node.id}" name="${name}"><bpmn:${definitionTag} /></bpmn:${eventTag}>`;
    }
    return `<bpmn:${eventTag} id="${node.id}" name="${name}" />`;
  }

  if (node.shape === 'transaction') {
    return `<bpmn:transaction id="${node.id}" name="${name}" />`;
  }

  if (node.shape === 'eventSubProcess') {
    return `<bpmn:subProcess id="${node.id}" name="${name}" triggeredByEvent="true" />`;
  }

  if (node.shape === 'callActivity') {
    return `<bpmn:callActivity id="${node.id}" name="${name}" />`;
  }

  warnings.push(`BPMN export: Unsupported shape "${node.shape}" for node "${node.id}".`);
  return null;
}

function renderSequenceFlows(
  edges: EdgeAst[],
  nodeToPool: Map<string, string>,
  poolId: string
): string[] {
  const flows: string[] = [];
  edges.forEach((edge, index) => {
    const fromId = extractNodeId(edge.from);
    const toId = extractNodeId(edge.to);
    const fromPool = nodeToPool.get(fromId);
    const toPool = nodeToPool.get(toId);

    if (fromPool && toPool && fromPool === poolId && toPool === poolId) {
      flows.push(
        `<bpmn:sequenceFlow id="Flow_${index}" sourceRef="${fromId}" targetRef="${toId}" />`
      );
    }
  });
  return flows;
}

function renderMessageFlows(
  edges: EdgeAst[],
  nodeToPool: Map<string, string>
): string[] {
  const flows: string[] = [];
  edges.forEach((edge, index) => {
    const fromId = extractNodeId(edge.from);
    const toId = extractNodeId(edge.to);
    const fromPool = nodeToPool.get(fromId);
    const toPool = nodeToPool.get(toId);

    if (!fromPool || !toPool || fromPool === toPool) {
      return;
    }

    flows.push(
      `<bpmn:messageFlow id="MessageFlow_${index}" sourceRef="${fromId}" targetRef="${toId}" />`
    );
  });
  return flows;
}

export function toBpmnXml(diagram: DiagramAst): BpmnExportResult {
  const warnings: string[] = [];
  const { nodeToPool, pools, lanes } = buildBpmnIndex(diagram.containers);

  const poolList = pools.length > 0 ? pools : [{ id: 'default-pool', label: 'Pool' }];
  const poolIds = new Set(poolList.map((pool) => pool.id));

  for (const node of diagram.nodes) {
    if (!nodeToPool.has(node.id) && poolIds.size > 0 && node.shape.startsWith('bpmn')) {
      warnings.push(`BPMN export: Node "${node.id}" is not assigned to a pool.`);
    }
  }

  const processes = poolList.map((pool) => {
    const flowNodes: string[] = [];
    const flowEdges: string[] = [];

    for (const node of diagram.nodes) {
      const poolId = nodeToPool.get(node.id) || pool.id;
      if (poolId !== pool.id) {
        continue;
      }
      const rendered = renderFlowNode(node, warnings);
      if (rendered) {
        flowNodes.push(rendered);
      }
    }

    flowEdges.push(...renderSequenceFlows(diagram.edges, nodeToPool, pool.id));

    const laneEntries = lanes.filter((lane) => lane.poolId === pool.id);
    const laneXml =
      laneEntries.length > 0
        ? `<bpmn:laneSet id="LaneSet_${pool.id}">${laneEntries
            .map((lane) => {
              const flowRefs = lane.nodeIds
                .map((nodeId) => `<bpmn:flowNodeRef>${nodeId}</bpmn:flowNodeRef>`)
                .join('');
              return `<bpmn:lane id="${lane.id}" name="${escapeXml(
                lane.label
              )}">${flowRefs}</bpmn:lane>`;
            })
            .join('')}</bpmn:laneSet>`
        : '';

    return `<bpmn:process id="Process_${pool.id}" isExecutable="false">${laneXml}${flowNodes.join(
      ''
    )}${flowEdges.join('')}</bpmn:process>`;
  });

  const participants = poolList
    .map(
      (pool) =>
        `<bpmn:participant id="Participant_${pool.id}" name="${escapeXml(
          pool.label
        )}" processRef="Process_${pool.id}" />`
    )
    .join('');

  const messageFlows = renderMessageFlows(diagram.edges, nodeToPool).join('');

  const collaboration =
    participants || messageFlows
      ? `<bpmn:collaboration id="Collaboration_1">${participants}${messageFlows}</bpmn:collaboration>`
      : '';

  const xml = [
    XML_HEADER,
    '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="Definitions_1" targetNamespace="http://runiq.io/bpmn">',
    collaboration,
    ...processes,
    '</bpmn:definitions>',
  ]
    .filter(Boolean)
    .join('');

  return { xml, warnings };
}

export function fromBpmnXml(_xml: string): BpmnImportResult {
  return {
    diagram: {
      astVersion: '1.0',
      nodes: [],
      edges: [],
      containers: [],
    },
    warnings: [
      'BPMN XML import is not implemented yet. This function returns an empty diagram.',
    ],
  };
}
