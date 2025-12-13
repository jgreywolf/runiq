import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { flippedTriangleShape } from './flippedTriangle.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'flippedTriangle',
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

describe('Flipped Triangle Shape', () => {
  it('should have correct shape id', () => {
    expect(flippedTriangleShape.id).toBe('flippedTriangle');
  });

  it('should calculate bounds with minimum dimensions', () => {
    const ctx = createMockContext('Down');
    const bounds = flippedTriangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(60);
    expect(bounds.height).toBeGreaterThanOrEqual(50);
  });

  it('should expand for longer text', () => {
    const ctx = createMockContext('Long Label Text');
    const bounds = flippedTriangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(60);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('Test');
    const anchors = flippedTriangleShape.anchors(ctx);

    expect(anchors).toHaveLength(4);
    expect(anchors.map((a) => a.name)).toEqual([
      'top',
      'right',
      'bottom',
      'left',
    ]);
  });

  it('should render valid SVG with triangle polygon', () => {
    const ctx = createMockContext('Down');
    const svg = flippedTriangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<polygon');
    expect(svg).toContain('points=');
    expect(svg).toContain('Down');
  });

  it('should have 3 points in polygon', () => {
    const ctx = createMockContext('Test');
    const svg = flippedTriangleShape.render(ctx, { x: 0, y: 0 });

    const pointsMatch = svg.match(/points="([^"]+)"/);
    expect(pointsMatch).toBeTruthy();

    if (pointsMatch) {
      const points = pointsMatch[1].trim();
      const coordinates = points.split(/[\s,]+/);
      // Triangle has 3 points = 6 numbers (x,y pairs)
      expect(coordinates.length).toBe(6);
    }
  });

  it('should position text higher in flipped triangle', () => {
    const ctx = createMockContext('Test');
    const svg = flippedTriangleShape.render(ctx, { x: 0, y: 0 });
    const bounds = flippedTriangleShape.bounds(ctx);

    // Text should be positioned in upper portion of triangle
    const textMatch = svg.match(/y="(\d+\.?\d*)"/);
    expect(textMatch).toBeTruthy();

    if (textMatch) {
      const textY = parseFloat(textMatch[1]);
      // Text Y should be in upper third of triangle
      expect(textY).toBeLessThan(bounds.height * 0.6);
    }
  });

  it('should escape XML in labels', () => {
    const ctx = createMockContext('A & B');
    const svg = flippedTriangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
  });

  it('should handle empty label', () => {
    const ctx = createMockContext('');
    expect(() => {
      flippedTriangleShape.bounds(ctx);
      flippedTriangleShape.render(ctx, { x: 0, y: 0 });
    }).not.toThrow();
  });
});
