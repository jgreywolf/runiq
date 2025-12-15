import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { hexShape } from './hex.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'hexagon',
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

describe('Hexagon Shape', () => {
  it('should have correct shape id', () => {
    expect(hexShape.id).toBe('hexagon');
  });

  it('should calculate bounds with minimum dimensions', () => {
    const ctx = createMockContext('A');
    const bounds = hexShape.bounds(ctx);

    // Should enforce minimum size
    expect(bounds.width).toBeGreaterThanOrEqual(100);
    expect(bounds.height).toBeGreaterThanOrEqual(60);
  });

  it('should calculate bounds for longer text', () => {
    const ctx = createMockContext('Preparation Step');
    const bounds = hexShape.bounds(ctx);

    // Should expand for longer text
    expect(bounds.width).toBeGreaterThan(100);
    expect(bounds.height).toBeGreaterThanOrEqual(60);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('Test');
    const anchors = hexShape.anchors(ctx);

    expect(anchors).toHaveLength(4);
    expect(anchors.map((a) => a.name)).toEqual([
      'top',
      'right',
      'bottom',
      'left',
    ]);
  });

  it('should render valid SVG with polygon', () => {
    const ctx = createMockContext('Process');
    const svg = hexShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<polygon');
    expect(svg).toContain('points=');
    expect(svg).toContain('Process');
  });

  it('should have 6 points in polygon', () => {
    const ctx = createMockContext('Test');
    const svg = hexShape.render(ctx, { x: 0, y: 0 });

    const pointsMatch = svg.match(/points="([^"]+)"/);
    expect(pointsMatch).toBeTruthy();

    if (pointsMatch) {
      const points = pointsMatch[1].trim();
      const coordinates = points.split(/[\s,]+/);
      // Should have 6 pairs of coordinates = 12 numbers
      expect(coordinates.length).toBe(12);
    }
  });

  it('should center text', () => {
    const ctx = createMockContext('Centered');
    const svg = hexShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('text-anchor="middle"');
    expect(svg).toContain('Centered');
  });

  it('should handle empty label', () => {
    const ctx = createMockContext('');
    expect(() => {
      hexShape.bounds(ctx);
      hexShape.render(ctx, { x: 0, y: 0 });
    }).not.toThrow();
  });
});
