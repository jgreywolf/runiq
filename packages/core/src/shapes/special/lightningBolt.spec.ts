import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { lightningBoltShape } from './lightningBolt.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'lightning',
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

describe('Lightning Bolt', () => {
  it('should have correct shape id', () => {
    expect(lightningBoltShape.id).toBe('lightning');
  });

  it('should calculate bounds for zigzag shape', () => {
    const ctx = createMockContext('Zap');
    const bounds = lightningBoltShape.bounds(ctx);

    expect(bounds.height).toBeGreaterThanOrEqual(80); // Tall
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Event');
    const anchors = lightningBoltShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render lightning bolt with zigzag pattern', () => {
    const ctx = createMockContext('Power');
    const svg = lightningBoltShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<polygon');
    expect(svg).toContain('points=');

    const pointsMatch = svg.match(/points="([^"]+)"/);
    expect(pointsMatch).toBeTruthy();
    if (pointsMatch) {
      const coords = pointsMatch[1].split(' ');
      expect(coords.length).toBeGreaterThanOrEqual(7); // Classic 7-point lightning bolt
    }
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = lightningBoltShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Power & <Event>');
    const svg = lightningBoltShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
