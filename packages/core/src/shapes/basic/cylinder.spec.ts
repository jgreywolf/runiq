import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { cylinderShape } from '../index.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: { id: 'test-node', shape: 'cylinder', label, data },
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

describe('Cylinder Shape (Database)', () => {
  it('should have correct id', () => {
    expect(cylinderShape.id).toBe('cylinder');
  });

  it('should calculate bounds with minimum size', () => {
    const ctx = createMockContext('DB');
    const bounds = cylinderShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(60);
    expect(bounds.height).toBeGreaterThanOrEqual(80);
  });

  it('should provide 4 anchor points accounting for ellipse height', () => {
    const ctx = createMockContext('Database');
    const anchors = cylinderShape.anchors!(ctx);

    expect(anchors).toHaveLength(4);
    const bounds = cylinderShape.bounds(ctx);
    const ellipseH = bounds.height * 0.15;

    // Top anchor should be below the ellipse
    expect(anchors[0].y).toBe(ellipseH);
  });

  it('should render cylinder with ellipse and rectangle', () => {
    const ctx = createMockContext('Users');
    const svg = cylinderShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<g>'); // Group element
    expect(svg).toContain('<ellipse'); // Top ellipse
    expect(svg).toContain('<rect'); // Side
    expect(svg).toContain('<line'); // Side lines
    expect(svg).toContain('<path'); // Bottom arc
  });

  it('should have proper 3D cylinder appearance', () => {
    const ctx = createMockContext('Storage');
    const svg = cylinderShape.render(ctx, { x: 0, y: 0 });

    // Should have top ellipse, side lines, and bottom curve
    expect(svg).toContain('ellipse'); // Top
    expect(svg.match(/<line/g)?.length).toBe(2); // Two side lines
    expect(svg).toContain('path'); // Bottom curve
  });

  it('should calculate ellipse size as 15% of height', () => {
    const ctx = createMockContext('Data');
    const bounds = cylinderShape.bounds(ctx);
    const svg = cylinderShape.render(ctx, { x: 0, y: 0 });

    const ry = bounds.height * 0.15;
    expect(svg).toContain(`ry="${ry}"`);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = cylinderShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(60);
    expect(bounds.height).toBeGreaterThanOrEqual(80);
  });

  it('should handle long text', () => {
    const ctx = createMockContext('Very Long Database Name');
    const bounds = cylinderShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(150);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('User & <Data>');
    const svg = cylinderShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
