import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { sampleBadgeShape } from './sampleBadge.js';

function createMockContext(
  label = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: { id: 'sample', shape: 'sampleBadge', label, data },
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
    expect(sampleBadgeShape.id).toBe('sampleBadge');
  });

  it('calculates bounds including padding', () => {
    const ctx = createMockContext('Hello');
    const b = sampleBadgeShape.bounds(ctx);

    expect(b.width).toBeGreaterThan(0);
    expect(b.height).toBeGreaterThan(0);
  });

  it('provides four anchors named top/right/bottom/left', () => {
    const ctx = createMockContext('A');
    const anchors = sampleBadgeShape.anchors(ctx);
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
    const svg = sampleBadgeShape.render(ctx, { x: 0, y: 0 });
    expect(svg).toContain('<rect');
    expect(svg).toContain('Label');
  });
});
