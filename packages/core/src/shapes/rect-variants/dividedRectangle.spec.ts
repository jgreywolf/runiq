import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { dividedRectangleShape } from './dividedRectangle.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'dividedRectangle',
      label,
      data,
    },
    style: {
      padding: 12,
      fontSize: 14,
      fontFamily: 'Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Divided Rectangle', () => {
  it('should have correct shape id', () => {
    expect(dividedRectangleShape.id).toBe('dividedRectangle');
  });

  it('should calculate bounds with label', () => {
    const ctx = createMockContext('Process A | Process B');
    const bounds = dividedRectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should respect minWidth from data', () => {
    const ctx = createMockContext('X', { minWidth: 150 });
    const bounds = dividedRectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(150);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('Test');
    const anchors = dividedRectangleShape.anchors(ctx);

    expect(anchors).toHaveLength(4);
    expect(anchors[0].name).toBe('top');
    expect(anchors[1].name).toBe('right');
    expect(anchors[2].name).toBe('bottom');
    expect(anchors[3].name).toBe('left');
  });

  it('should render valid SVG with dividing line', () => {
    const ctx = createMockContext('Left|Right');
    const svg = dividedRectangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('<line'); // Dividing line
    expect(svg).toContain('Left|Right');
  });

  it('should escape XML in labels', () => {
    const ctx = createMockContext('A & B < C');
    const svg = dividedRectangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
  });
});
