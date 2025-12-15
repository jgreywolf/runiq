import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { framedCircleShape } from './framedCircle.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: { id: 'test-node', shape: 'framedCircle', label, data },
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

describe('Framed Circle', () => {
  it('should have id fr-circ', () => {
    expect(framedCircleShape.id).toBe('framedCircle');
  });

  it('should calculate bounds with frame space', () => {
    const ctx = createMockContext('Event');
    const bounds = framedCircleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(50);
    expect(bounds.height).toBeGreaterThanOrEqual(50);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Action');
    const anchors = framedCircleShape.anchors!(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render two circles with frame gap', () => {
    const ctx = createMockContext('Node');
    const svg = framedCircleShape.render(ctx, { x: 0, y: 0 });

    const circleCount = (svg.match(/<circle/g) || []).length;
    expect(circleCount).toBe(2); // Outer frame and inner circle
  });

  it('should have visible frame spacing', () => {
    const ctx = createMockContext('Frame');
    const svg = framedCircleShape.render(ctx, { x: 0, y: 0 });

    // Should have two circles with different radii
    expect(svg).toContain('<circle');
    const radiusMatches = svg.match(/r="(\d+(\.\d+)?)"/g);
    expect(radiusMatches).toBeTruthy();
    expect(radiusMatches!.length).toBe(2);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = framedCircleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(50);
    expect(bounds.height).toBeGreaterThanOrEqual(50);
  });

  it('should handle long text', () => {
    const ctx = createMockContext('Very Long Event Name');
    const bounds = framedCircleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(100);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Action & <Event>');
    const svg = framedCircleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
