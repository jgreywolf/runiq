import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { notchedPentagonShape } from './notchedPentagon.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'notchedPentagon',
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

describe('Notched Pentagon', () => {
  it('should have correct shape id', () => {
    expect(notchedPentagonShape.id).toBe('notchedPentagon');
  });

  it('should calculate bounds with minimum dimensions', () => {
    const ctx = createMockContext('Loop');
    const bounds = notchedPentagonShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(80);
    expect(bounds.height).toBeGreaterThanOrEqual(60);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('Test');
    const anchors = notchedPentagonShape.anchors(ctx);

    expect(anchors).toHaveLength(4);
    expect(anchors.map((a) => a.name)).toEqual([
      'top',
      'right',
      'bottom',
      'left',
    ]);
  });

  it('should render valid SVG with pentagon polygon', () => {
    const ctx = createMockContext('For Each');
    const svg = notchedPentagonShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<polygon');
    expect(svg).toContain('For Each');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = notchedPentagonShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(80);
    expect(bounds.height).toBeGreaterThanOrEqual(60);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Loop & <Each>');
    const svg = notchedPentagonShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
