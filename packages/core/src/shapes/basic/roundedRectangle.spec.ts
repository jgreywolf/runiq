import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { roundedRectangleShape } from './roundedRectangle.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'rounded',
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

describe('Rounded Rectangle Shape', () => {
  it('should have correct shape id', () => {
    expect(roundedRectangleShape.id).toBe('roundedRectangle');
  });

  it('should calculate bounds with label', () => {
    const ctx = createMockContext('Rounded Box');
    const bounds = roundedRectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should respect minimum dimensions', () => {
    const ctx = createMockContext('A');
    const bounds = roundedRectangleShape.bounds(ctx);

    // Should have reasonable minimum size
    expect(bounds.width).toBeGreaterThanOrEqual(24); // At least padding
    expect(bounds.height).toBeGreaterThanOrEqual(24);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('Test');
    const anchors = roundedRectangleShape.anchors(ctx);

    expect(anchors).toHaveLength(4);
    expect(anchors.map((a) => a.name)).toEqual([
      'top',
      'right',
      'bottom',
      'left',
    ]);
  });

  it('should render valid SVG with rounded rect', () => {
    const ctx = createMockContext('Rounded');
    const svg = roundedRectangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('rx='); // Border radius attribute
    expect(svg).toContain('ry='); // Border radius attribute
    expect(svg).toContain('Rounded');
  });

  it('should have corner radius', () => {
    const ctx = createMockContext('Test');
    const svg = roundedRectangleShape.render(ctx, { x: 0, y: 0 });

    // Should have rx and ry attributes for rounded corners
    const rxMatch = svg.match(/rx="(\d+)"/);
    const ryMatch = svg.match(/ry="(\d+)"/);

    expect(rxMatch).toBeTruthy();
    expect(ryMatch).toBeTruthy();

    if (rxMatch && ryMatch) {
      const rx = parseInt(rxMatch[1]);
      const ry = parseInt(ryMatch[1]);
      expect(rx).toBeGreaterThan(0);
      expect(ry).toBeGreaterThan(0);
    }
  });

  it('should handle long text', () => {
    const ctx = createMockContext('This is a very long label for testing');
    const bounds = roundedRectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(200);
  });

  it('should escape XML in labels', () => {
    const ctx = createMockContext('A & B < C');
    const svg = roundedRectangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
  });

  it('should handle empty label', () => {
    const ctx = createMockContext('');
    expect(() => {
      roundedRectangleShape.bounds(ctx);
      roundedRectangleShape.render(ctx, { x: 0, y: 0 });
    }).not.toThrow();
  });
});
