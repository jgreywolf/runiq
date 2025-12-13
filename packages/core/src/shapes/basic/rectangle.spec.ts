import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { rectangleShape } from './rectangle.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: { id: 'test-node', shape: 'rectangle', label, data },
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

describe('Rectangle Shape', () => {
  it('should have correct id', () => {
    expect(rectangleShape.id).toBe('rectangle');
  });

  it('should calculate bounds based on text', () => {
    const ctx = createMockContext('Test');
    const bounds = rectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
    expect(bounds.width).toBe(32 + 24); // text width + padding*2
    expect(bounds.height).toBe(16 + 24); // text height + padding*2
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Test');
    const anchors = rectangleShape.anchors!(ctx);

    expect(anchors).toHaveLength(4);
    expect(anchors.map((a) => a.name)).toEqual([
      'top',
      'right',
      'bottom',
      'left',
    ]);
  });

  it('should render valid SVG', () => {
    const ctx = createMockContext('Test');
    const svg = rectangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('<text');
    expect(svg).toContain('Test');
  });

  it('should handle long text', () => {
    const ctx = createMockContext('Very Long Label Text');
    const bounds = rectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(100);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = rectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Test & <test>');
    const svg = rectangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
