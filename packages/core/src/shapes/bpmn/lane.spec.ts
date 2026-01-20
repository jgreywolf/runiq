import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { bpmnLaneShape } from './lane.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'bpmnLane',
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

describe('BPMN Lane', () => {
  it('should have correct shape id', () => {
    expect(bpmnLaneShape.id).toBe('bpmnLane');
  });

  it('should calculate bounds for lanes', () => {
    const ctx = createMockContext('Sales', { width: 700, height: 180 });
    const bounds = bpmnLaneShape.bounds(ctx);

    expect(bounds.width).toBe(700);
    expect(bounds.height).toBe(180);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('Lane');
    const anchors = bpmnLaneShape.anchors?.(ctx);

    expect(anchors).toBeDefined();
    expect(anchors!).toHaveLength(4);
  });

  it('should render lane with label', () => {
    const ctx = createMockContext('Warehouse', { width: 600, height: 140 });
    const svg = bpmnLaneShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('Warehouse');
  });
});
