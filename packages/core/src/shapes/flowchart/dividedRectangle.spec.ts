import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { dividedRectangleShape } from '../index.js';

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

describe('Flowchart Divided Rectangle', () => {
  it('should have correct id', () => {
    expect(dividedRectangleShape.id).toBe('dividedRectangle');
  });

  it('should calculate bounds with minimum width', () => {
    const ctx = createMockContext('Split');
    const bounds = dividedRectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(80);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Dual');
    const anchors = dividedRectangleShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render rectangle divided into sections', () => {
    const ctx = createMockContext('Section');
    const svg = dividedRectangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('<line'); // Dividing line
  });

  it('should have vertical dividing line', () => {
    const ctx = createMockContext('Divide');
    const svg = dividedRectangleShape.render(ctx, { x: 10, y: 10 });

    expect(svg).toContain('<line');
    expect(svg).toContain('x1='); // Vertical line
    expect(svg).toContain('x2=');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = dividedRectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
