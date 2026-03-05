import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { circleShape } from './circle.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: { id: 'test-node', shape: 'circle', label, data },
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

describe('Circle Shape', () => {
  it('should have correct id', () => {
    expect(circleShape.id).toBe('circle');
  });

  it('should calculate square bounds for circular shape', () => {
    const ctx = createMockContext('A');
    const bounds = circleShape.bounds(ctx);

    expect(bounds.width).toBe(bounds.height); // Square bounds
    expect(bounds.width).toBeGreaterThanOrEqual(50); // Minimum size
  });

  it('should account for diagonal text in circle', () => {
    const ctx = createMockContext('Test');
    const bounds = circleShape.bounds(ctx);

    // Circle should be larger than text to fit diagonally
    const textWidth = 32; // 4 chars * 8
    expect(bounds.width).toBeGreaterThan(textWidth);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('State');
    const anchors = circleShape.anchors!(ctx);

    expect(anchors).toHaveLength(4);
    expect(anchors.map((a) => a.name)).toEqual([
      'top',
      'right',
      'bottom',
      'left',
    ]);
  });

  it('should render circle SVG element', () => {
    const ctx = createMockContext('X');
    const svg = circleShape.render(ctx, { x: 50, y: 50 });

    expect(svg).toContain('<circle');
    expect(svg).toContain('cx=');
    expect(svg).toContain('cy=');
    expect(svg).toContain('r=');
  });

  it('should enforce minimum circle diameter', () => {
    const ctx = createMockContext('');
    const bounds = circleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(50);
    expect(bounds.height).toBeGreaterThanOrEqual(50);
  });

  it('should handle long text by expanding', () => {
    const ctx = createMockContext('Very Long Label');
    const bounds = circleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(100);
    expect(bounds.height).toBe(bounds.width); // Still square
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('A & B');
    const svg = circleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
  });
});
