import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { multiRectangleShape } from './multiRectangle.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'multiRectangle',
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

describe('Multi Rectangle', () => {
  it('should have correct shape id', () => {
    expect(multiRectangleShape.id).toBe('multiRectangle');
  });

  it('should calculate bounds accounting for stack offset', () => {
    const ctx = createMockContext('Multiple Docs');
    const bounds = multiRectangleShape.bounds(ctx);

    // Should be larger due to stacking effect
    expect(bounds.width).toBeGreaterThan(
      ctx.measureText('Multiple Docs', ctx.style).width
    );
  });

  it('should have 4 anchor points on front rectangle', () => {
    const ctx = createMockContext('Test');
    const anchors = multiRectangleShape.anchors(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render valid SVG with multiple rectangles', () => {
    const ctx = createMockContext('Multi-page');
    const svg = multiRectangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    // Should have multiple rect elements for stacking
    const rectCount = (svg.match(/<rect/g) || []).length;
    expect(rectCount).toBeGreaterThan(1);
    expect(svg).toContain('Multi-page');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = multiRectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Docs & <More>');
    const svg = multiRectangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
