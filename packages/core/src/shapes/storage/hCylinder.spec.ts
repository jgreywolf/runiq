import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { hCylinderShape } from './hCylinder.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'hCylinder',
      label,
      data,
    },
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

describe('H-Cylinder (Horizontal Database)', () => {
  it('should have correct shape id', () => {
    expect(hCylinderShape.id).toBe('hCylinder');
  });

  it('should calculate bounds with ellipse space', () => {
    const ctx = createMockContext('DB');
    const bounds = hCylinderShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(100);
    expect(bounds.height).toBeGreaterThanOrEqual(60);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Storage');
    const anchors = hCylinderShape.anchors(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render horizontal cylinder with vertical ellipses', () => {
    const ctx = createMockContext('Data');
    const svg = hCylinderShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<g>');
    expect(svg).toContain('<ellipse');
    const ellipseCount = (svg.match(/<ellipse/g) || []).length;
    expect(ellipseCount).toBe(2); // Left and right ellipses
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = hCylinderShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('DB & <Storage>');
    const svg = hCylinderShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
