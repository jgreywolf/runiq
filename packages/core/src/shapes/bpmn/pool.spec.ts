import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { bpmnPoolShape } from './pool.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'bpmnPool',
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

describe('BPMN Pool', () => {
  it('should have correct shape id', () => {
    expect(bpmnPoolShape.id).toBe('bpmnPool');
  });

  it('should calculate bounds for pool/lane', () => {
    const ctx = createMockContext('Customer', { width: 800, height: 200 });
    const bounds = bpmnPoolShape.bounds(ctx);

    expect(bounds.width).toBe(800);
    expect(bounds.height).toBe(200);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('Lane');
    const anchors = bpmnPoolShape.anchors?.(ctx);

    expect(anchors).toBeDefined();
    expect(anchors!).toHaveLength(4);
  });

  it('should render horizontal lane with label', () => {
    const ctx = createMockContext('Sales Department', {
      width: 600,
      height: 150,
    });
    const svg = bpmnPoolShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('Sales Department');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('', { width: 400, height: 100 });
    const bounds = bpmnPoolShape.bounds(ctx);

    expect(bounds.width).toBe(400);
    expect(bounds.height).toBe(100);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Pool & <Lane>', { width: 500, height: 150 });
    const svg = bpmnPoolShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
