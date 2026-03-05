import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { cylinderShape } from './cylinder.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'cylinder',
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

describe('Cylinder (Database)', () => {
  it('should have correct shape id', () => {
    expect(cylinderShape.id).toBe('cylinder');
  });

  it('should calculate bounds with ellipse space', () => {
    const ctx = createMockContext('Database');
    const bounds = cylinderShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(60);
    expect(bounds.height).toBeGreaterThanOrEqual(80);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('DB');
    const anchors = cylinderShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
    expect(anchors?.[0].name).toBe('top');
  });

  it('should render cylinder with top and bottom ellipses', () => {
    const ctx = createMockContext('Storage');
    const svg = cylinderShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<ellipse'); // Top ellipse
    expect(svg).toContain('<path'); // Cylinder body
    expect(svg).toContain('Storage');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = cylinderShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('DB & <Storage>');
    const svg = cylinderShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
