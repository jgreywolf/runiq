import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { notchedRectangleShape } from '../index.js';

function createMockContext(label: string): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'rect',
      label,
    },
    style: {
      fill: '#f0f0f0',
      stroke: '#333',
      strokeWidth: 1,
      fontFamily: 'sans-serif',
      fontSize: 14,
      padding: 12,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Flowchart Notched Rectangle', () => {
  it('should have correct id', () => {
    expect(notchedRectangleShape.id).toBe('notchedRectangle');
  });

  it('should calculate standard bounds', () => {
    const ctx = createMockContext('Notched');
    const bounds = notchedRectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Cut');
    const anchors = notchedRectangleShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
    expect(anchors?.[0].y).toBe(8); // Top anchor below notch
  });

  it('should render polygon with corner notches', () => {
    const ctx = createMockContext('Interface');
    const svg = notchedRectangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<polygon');
    expect(svg).toContain('points=');
  });

  it('should have cut corners at top', () => {
    const ctx = createMockContext('Corner');
    const svg = notchedRectangleShape.render(ctx, { x: 0, y: 0 });

    const pointsMatch = svg.match(/points="([^"]+)"/);
    expect(pointsMatch).toBeTruthy();
    if (pointsMatch) {
      const coords = pointsMatch[1].split(' ');
      expect(coords).toHaveLength(6); // 6 points for notched rectangle
    }
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = notchedRectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
