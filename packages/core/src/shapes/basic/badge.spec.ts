import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { badgeShape } from './badge.js';

function createMockContext(
  label = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: { id: 'sample', shape: 'badge', label, data },
    style: {
      padding: 8,
      fontSize: 14,
      fontFamily: 'Arial',
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
    },
    measureText: (text: string) => ({ width: text.length * 7, height: 16 }),
  } as unknown as ShapeRenderContext;
}

describe('Sample Badge Shape', () => {
  it('exports the expected id', () => {
    expect(badgeShape.id).toBe('badge');
  });

  it('calculates bounds including padding', () => {
    const ctx = createMockContext('Hello');
    const b = badgeShape.bounds(ctx);

    expect(b.width).toBeGreaterThan(0);
    expect(b.height).toBeGreaterThan(0);
  });

  it('provides four anchors named top/right/bottom/left', () => {
    const ctx = createMockContext('A');
    const anchors = badgeShape.anchors(ctx);
    expect(anchors).toHaveLength(4);
    expect(anchors.map((a) => a.name)).toEqual([
      'top',
      'right',
      'bottom',
      'left',
    ]);
  });

  it('renders SVG rect and label', () => {
    const ctx = createMockContext('Label');
    const svg = badgeShape.render(ctx, { x: 0, y: 0 });
    expect(svg).toContain('<rect');
    expect(svg).toContain('Label');
  });
});
