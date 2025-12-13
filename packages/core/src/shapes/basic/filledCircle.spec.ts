import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { filledCircleShape } from './filledCircle.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: { id: 'test-node', shape: 'filledCircle', label, data },
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

describe('Filled Circle', () => {
  it('should have id fill-circ', () => {
    expect(filledCircleShape.id).toBe('filledCircle');
  });

  it('should calculate standard circle bounds', () => {
    const ctx = createMockContext('Done');
    const bounds = filledCircleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(50);
    expect(bounds.height).toBeGreaterThanOrEqual(50);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Complete');
    const anchors = filledCircleShape.anchors!(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render filled circle', () => {
    const ctx = createMockContext('End');
    const svg = filledCircleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<circle');
    expect(svg).toContain('fill='); // Should have fill color
  });

  it('should use contrasting text color', () => {
    const ctx = createMockContext('State');
    const svg = filledCircleShape.render(ctx, { x: 0, y: 0 });

    // Should have white text on dark background
    expect(svg).toContain('<text');
    expect(svg).toContain('fill="#fff"'); // White text
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = filledCircleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(50);
    expect(bounds.height).toBeGreaterThanOrEqual(50);
  });

  it('should handle long text', () => {
    const ctx = createMockContext('Very Long Complete State');
    const bounds = filledCircleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(150);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Done & <Complete>');
    const svg = filledCircleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
