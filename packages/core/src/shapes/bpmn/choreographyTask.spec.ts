import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { bpmnChoreographyTaskShape } from './choreographyTask.js';

function createMockContext(
  label = 'Approve Contract',
  data?: Record<string, unknown>
): ShapeRenderContext {
  return {
    node: {
      id: 'choreo',
      shape: 'bpmnChoreographyTask',
      label,
      data,
    },
    style: {
      padding: 12,
      fontSize: 14,
      fontFamily: 'Arial',
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('BPMN Choreography Task', () => {
  it('should have the correct shape id', () => {
    expect(bpmnChoreographyTaskShape.id).toBe('bpmnChoreographyTask');
  });

  it('should render the central task with participant bands', () => {
    const svg = bpmnChoreographyTaskShape.render(createMockContext(), { x: 0, y: 0 });

    const rects = svg.match(/<rect/g);
    expect(rects).toBeDefined();
    expect(rects!.length).toBeGreaterThanOrEqual(3);
    expect(svg).toContain('Approve Contract');
  });

  it('should render participant labels in the choreography bands', () => {
    const svg = bpmnChoreographyTaskShape.render(
      createMockContext('Vendor Approval', {
        initiatingParticipant: 'Buyer',
        receivingParticipant: 'Vendor',
      }),
      { x: 0, y: 0 }
    );

    expect(svg).toContain('Buyer');
    expect(svg).toContain('Vendor');
    expect(svg).toContain('Vendor Approval');
  });
});
