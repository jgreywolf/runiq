import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { braceLeftShape } from './braceLeft.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'braceLeft',
      label,
      data,
    },
    style: {
      padding: 12,
      fontSize: 14,
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeWidth: 2,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Brace Left (Grouping)', () => {
  it('should have correct shape id', () => {
    expect(braceLeftShape.id).toBe('braceLeft');
  });

  it('should calculate tall bounds for grouping', () => {
    const ctx = createMockContext('Group');
    const bounds = braceLeftShape.bounds(ctx);

    expect(bounds.height).toBeGreaterThanOrEqual(80); // Tall for grouping
    expect(bounds.width).toBeLessThan(bounds.height); // Taller than wide
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Left');
    const anchors = braceLeftShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render left-facing brace with curves', () => {
    const ctx = createMockContext('{');
    const svg = braceLeftShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path'); // Curly brace path
    // Should have curves (quadratic or cubic)
    const hasCurves = svg.includes('Q') || svg.includes('C');
    expect(hasCurves).toBe(true);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = braceLeftShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Group & <Items>');
    const svg = braceLeftShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
