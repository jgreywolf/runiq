import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { forkJoinShape } from './forkJoin.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'fork',
      label,
      data,
    },
    style: {
      padding: 12,
      fontSize: 14,
      fontFamily: 'Arial',
      fill: '#000000',
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Fork/Join', () => {
  it('should have correct shape id', () => {
    expect(forkJoinShape.id).toBe('fork');
  });

  it('should calculate bounds for thick line', () => {
    const ctx = createMockContext('Split');
    const bounds = forkJoinShape.bounds(ctx);

    expect(bounds.height).toBeLessThanOrEqual(30); // Very short
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Join');
    const anchors = forkJoinShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render thick horizontal bar', () => {
    const ctx = createMockContext('Parallel');
    const svg = forkJoinShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');

    const bounds = forkJoinShape.bounds(ctx);
    expect(bounds.width).toBeGreaterThanOrEqual(120);
    expect(bounds.height).toBeLessThan(bounds.width / 4); // Much wider than tall
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = forkJoinShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Fork & <Join>');
    const svg = forkJoinShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
