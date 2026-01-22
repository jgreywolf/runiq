import { describe, expect, it } from 'vitest';
import type { DiagramAst } from '@runiq/core';
import { toBpmnXml, fromBpmnXml } from './index.js';

describe('export-bpmn', () => {
  it('exports a basic BPMN process with pools and lanes', () => {
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'task1', shape: 'bpmnTask', label: 'Do work' },
        {
          id: 'event1',
          shape: 'bpmnEvent',
          label: 'Start',
          data: { values: [{ eventType: 'start' }] },
        },
      ],
      edges: [{ from: 'event1', to: 'task1' }],
      containers: [
        {
          id: 'pool1',
          label: 'Operations',
          shape: 'bpmnPool',
          children: ['task1', 'event1'],
          containers: [
            {
              id: 'lane1',
              label: 'Team A',
              shape: 'bpmnLane',
              children: ['task1', 'event1'],
              containers: [],
            },
          ],
        },
      ],
    };

    const result = toBpmnXml(diagram);

    expect(result.warnings).toHaveLength(0);
    expect(result.xml).toContain('<bpmn:definitions');
    expect(result.xml).toContain('<bpmn:participant');
    expect(result.xml).toContain('<bpmn:laneSet');
    expect(result.xml).toContain('<bpmn:task id="task1"');
    expect(result.xml).toContain('<bpmn:startEvent id="event1"');
    expect(result.xml).toContain('<bpmn:sequenceFlow');
  });

  it('warns when BPMN nodes are not assigned to a pool', () => {
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [{ id: 'task1', shape: 'bpmnTask', label: 'Do work' }],
      edges: [],
      containers: [],
    };

    const result = toBpmnXml(diagram);

    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]).toContain('not assigned to a pool');
  });

  it('returns stub warnings for BPMN import', () => {
    const result = fromBpmnXml('<bpmn:definitions />');

    expect(result.diagram.nodes).toHaveLength(0);
    expect(result.warnings[0]).toContain('not implemented');
  });
});
