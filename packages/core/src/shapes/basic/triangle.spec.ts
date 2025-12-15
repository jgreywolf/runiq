import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { triangleShape } from './triangle.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: { id: 'test-node', shape: 'triangle', label, data },
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

describe('Triangle Shape', () => {
  it('should have correct id', () => {
    expect(triangleShape.id).toBe('triangle');
  });

  it('should calculate bounds with minimum size', () => {
    const ctx = createMockContext('Extract');
    const bounds = triangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(80);
    expect(bounds.height).toBeGreaterThanOrEqual(70);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Merge');
    const anchors = triangleShape.anchors!(ctx);

    expect(anchors).toHaveLength(4);
    // Triangle: top point, bottom right, bottom center, bottom left
    expect(anchors[0].name).toBe('top');
    expect(anchors[2].name).toBe('bottom');
  });

  it('should render polygon with 3 points', () => {
    const ctx = createMockContext('Tri');
    const svg = triangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<polygon');
    expect(svg).toContain('points=');
    // Should have 3 coordinate pairs
    const pointsMatch = svg.match(/points="([^"]+)"/);
    expect(pointsMatch).toBeTruthy();
    if (pointsMatch) {
      const coords = pointsMatch[1].split(' ');
      expect(coords).toHaveLength(3); // 3 points
    }
  });

  it('should position text lower in triangle', () => {
    const ctx = createMockContext('Text');
    const bounds = triangleShape.bounds(ctx);
    const svg = triangleShape.render(ctx, { x: 0, y: 0 });

    // Text should be at 0.6 of height (60% down)
    const expectedY = bounds.height * 0.6;
    expect(svg).toContain(`y="${expectedY}"`);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = triangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(80);
    expect(bounds.height).toBeGreaterThanOrEqual(70);
  });

  it('should expand for long text', () => {
    const ctx = createMockContext('Very Long Triangle Label');
    const bounds = triangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(150);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Test & <Triangle>');
    const svg = triangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
