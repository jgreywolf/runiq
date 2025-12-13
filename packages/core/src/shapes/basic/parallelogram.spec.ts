import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { parallelogramShape } from './parallelogram.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: { id: 'test-node', shape: 'parallelogram', label, data },
    style: {
      padding: 12,
      fontSize: 14,
      fontFamily: 'Arial',
      fill: '#f0f0f0',
      stroke: '#333',
      strokeWidth: 1,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Parallelogram Shape (Data I/O)', () => {
  it('should have correct id', () => {
    expect(parallelogramShape.id).toBe('parallelogram');
  });

  it('should calculate bounds with skew space', () => {
    const ctx = createMockContext('Input Data');
    const bounds = parallelogramShape.bounds(ctx);

    const textWidth = 'Input Data'.length * 8;
    const skew = 15;
    expect(bounds.width).toBe(textWidth + 24 + skew * 2);
  });

  it('should provide 4 anchor points accounting for skew', () => {
    const ctx = createMockContext('Data');
    const anchors = parallelogramShape.anchors!(ctx);

    expect(anchors).toHaveLength(4);
    // Left and right anchors should be offset by skew
    expect(anchors[3].x).toBe(15); // Left anchor at skew position
  });

  it('should render parallelogram polygon', () => {
    const ctx = createMockContext('Input');
    const svg = parallelogramShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<polygon');
    const pointsMatch = svg.match(/points="([^"]+)"/);
    expect(pointsMatch).toBeTruthy();
    if (pointsMatch) {
      const coords = pointsMatch[1].split(' ');
      expect(coords).toHaveLength(4); // 4 points (parallelogram)
    }
  });

  it('should lean to the right', () => {
    const ctx = createMockContext('Right');
    const svg = parallelogramShape.render(ctx, { x: 0, y: 0 });

    // Top left should be shifted right (skew)
    expect(svg).toContain('15,0'); // Top left at x=15
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = parallelogramShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should handle long text', () => {
    const ctx = createMockContext('Very Long Parallelogram Label Text');
    const bounds = parallelogramShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(200);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Input & Output');
    const svg = parallelogramShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
  });
});
