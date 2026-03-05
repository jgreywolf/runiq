import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { linedRectangleShape } from '../index.js';

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

describe('Flowchart Lined Rectangle', () => {
  it('should have correct id', () => {
    expect(linedRectangleShape.id).toBe('linedRectangle');
  });

  it('should calculate bounds with minimum height', () => {
    const ctx = createMockContext('Phase');
    const bounds = linedRectangleShape.bounds(ctx);

    expect(bounds.height).toBeGreaterThanOrEqual(60);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Steps');
    const anchors = linedRectangleShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render rectangle with horizontal lines', () => {
    const ctx = createMockContext('Segment');
    const svg = linedRectangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('<line');
  });

  it('should have 2 horizontal dividing lines', () => {
    const ctx = createMockContext('Multi');
    const svg = linedRectangleShape.render(ctx, { x: 0, y: 0 });

    const lineCount = (svg.match(/<line/g) || []).length;
    expect(lineCount).toBe(2);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = linedRectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
