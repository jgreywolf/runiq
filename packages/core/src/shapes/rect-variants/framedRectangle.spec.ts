import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { framedRectangleShape } from './framedRectangle.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'framedRectangle',
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

describe('Framed Rectangle', () => {
  it('should have correct shape id', () => {
    expect(framedRectangleShape.id).toBe('framedRectangle');
  });

  it('should calculate bounds accounting for frame width', () => {
    const ctx = createMockContext('Subroutine');
    const bounds = framedRectangleShape.bounds(ctx);

    // Should be wider than basic rectangle due to frames
    expect(bounds.width).toBeGreaterThan(
      ctx.measureText('Subroutine', ctx.style).width
    );
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('Test');
    const anchors = framedRectangleShape.anchors(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render valid SVG with frame lines', () => {
    const ctx = createMockContext('Call Process');
    const svg = framedRectangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('<line'); // Frame lines
    expect(svg).toContain('Call Process');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = framedRectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Sub & <Call>');
    const svg = framedRectangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
