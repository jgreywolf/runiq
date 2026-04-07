import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { bpmnBoundaryEventShape } from './boundaryEvent.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'boundary',
      shape: 'bpmnBoundaryEvent',
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

describe('BPMN Boundary Event', () => {
  it('should have the correct shape id', () => {
    expect(bpmnBoundaryEventShape.id).toBe('bpmnBoundaryEvent');
  });

  it('should render as a double-circle event by default', () => {
    const svg = bpmnBoundaryEventShape.render(
      createMockContext('Timeout', { eventType: 'timer' }),
      { x: 0, y: 0 }
    );

    const circles = svg.match(/<circle/g);
    expect(circles).toBeDefined();
    expect(circles!.length).toBeGreaterThanOrEqual(2);
    expect(svg).toContain('Timeout');
  });

  it('should support non-interrupting dashed boundaries', () => {
    const svg = bpmnBoundaryEventShape.render(
      createMockContext('Reminder', {
        eventType: 'message',
        interrupting: false,
      }),
      { x: 0, y: 0 }
    );

    expect(svg).toContain('stroke-dasharray');
    expect(svg).toContain('Reminder');
  });
});
