import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { multiRectangleShape } from '../index.js';

function createMockContext(label: string): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'rect',
      label,
    },
    style: {
      fill: '#f0f0f0',
      stroke: '#333',
      strokeWidth: 1,
      fontFamily: 'sans-serif',
      fontSize: 14,
      padding: 12,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Flowchart Multi Rectangle', () => {
  it('should have correct id', () => {
    expect(multiRectangleShape.id).toBe('multiRectangle');
  });

  it('should calculate bounds with offset for stacked effect', () => {
    const ctx = createMockContext('Loop');
    const bounds = multiRectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(32 + 24); // Base + offsets
    expect(bounds.height).toBeGreaterThan(16 + 24); // Base + offsets
  });

  it('should provide 4 anchor points on front rectangle', () => {
    const ctx = createMockContext('Repeat');
    const anchors = multiRectangleShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
    expect(anchors?.[0].name).toBe('top');
    expect(anchors?.[1].name).toBe('right');
    expect(anchors?.[2].name).toBe('bottom');
    expect(anchors?.[3].name).toBe('left');
  });

  it('should render multiple offset rectangles', () => {
    const ctx = createMockContext('Stack');
    const svg = multiRectangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg.match(/<rect/g)?.length).toBeGreaterThanOrEqual(2);
  });

  it('should show depth with 2-3 rectangles', () => {
    const ctx = createMockContext('Multi');
    const svg = multiRectangleShape.render(ctx, { x: 0, y: 0 });

    // Should have multiple rectangles stacked
    const rectCount = (svg.match(/<rect/g) || []).length;
    expect(rectCount).toBeGreaterThanOrEqual(2);
    expect(rectCount).toBeLessThanOrEqual(3);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = multiRectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
