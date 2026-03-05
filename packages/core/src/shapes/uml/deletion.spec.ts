import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { deletionShape } from './deletion.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: '@test',
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

describe('UML Deletion', () => {
  it('should have correct id', () => {
    expect(deletionShape.id).toBe('deletion');
  });

  it('should calculate bounds as small square', () => {
    const ctx = createMockContext();
    const bounds = deletionShape.bounds(ctx);

    // Deletion X is typically 20-30px
    expect(bounds.width).toBeLessThan(40);
    expect(bounds.height).toBeLessThan(40);
    expect(bounds.width).toBe(bounds.height); // Square
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext();
    const anchors = deletionShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render X mark', () => {
    const ctx = createMockContext();
    const svg = deletionShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<line'); // Two lines forming X
    // Should have at least 2 lines
    const lineCount = (svg.match(/<line/g) || []).length;
    expect(lineCount).toBeGreaterThanOrEqual(2);
  });

  it('should use thicker stroke for visibility', () => {
    const ctx = createMockContext();
    const svg = deletionShape.render(ctx, { x: 0, y: 0 });

    // Should use stroke-width of 2 or 3
    const hasThickStroke =
      svg.includes('stroke-width="2"') || svg.includes('stroke-width="3"');
    expect(hasThickStroke).toBe(true);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = deletionShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
