import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { doubleCircleShape } from './doubleCircle.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: { id: 'test-node', shape: 'doubleCircle', label, data },
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

describe('Double Circle (Concentric)', () => {
  it('should have id d-circ', () => {
    expect(doubleCircleShape.id).toBe('doubleCircle');
  });

  it('should calculate bounds with padding for outer circle', () => {
    const ctx = createMockContext('End');
    const bounds = doubleCircleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(50);
    expect(bounds.height).toBeGreaterThanOrEqual(50);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('State');
    const anchors = doubleCircleShape.anchors!(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render two concentric circles', () => {
    const ctx = createMockContext('Terminal');
    const svg = doubleCircleShape.render(ctx, { x: 0, y: 0 });

    const circleCount = (svg.match(/<circle/g) || []).length;
    expect(circleCount).toBe(2); // Outer and inner circles
  });

  it('should have gap between circles', () => {
    const ctx = createMockContext('End');
    const svg = doubleCircleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<circle');
    // Should have two different radii
    const radiusMatches = svg.match(/r="(\d+(\.\d+)?)"/g);
    expect(radiusMatches).toBeTruthy();
    expect(radiusMatches!.length).toBe(2);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = doubleCircleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(50);
    expect(bounds.height).toBeGreaterThanOrEqual(50);
  });

  it('should handle long text', () => {
    const ctx = createMockContext('Very Long Terminal State');
    const bounds = doubleCircleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(100);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('End & <Done>');
    const svg = doubleCircleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
