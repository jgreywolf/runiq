import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { stadiumShape } from './stadium.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: { id: 'test-node', shape: 'stadium', label, data },
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

describe('Stadium Shape', () => {
  it('should have correct id', () => {
    expect(stadiumShape.id).toBe('stadium');
  });

  it('should calculate bounds with extra width for rounded ends', () => {
    const ctx = createMockContext('Start');
    const bounds = stadiumShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(40 + 24); // text + padding*2
    expect(bounds.height).toBe(16 + 24);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Start');
    const anchors = stadiumShape.anchors!(ctx);

    expect(anchors).toHaveLength(4);
    expect(anchors[0].name).toBe('top');
  });

  it('should render with rounded corners', () => {
    const ctx = createMockContext('Start');
    const svg = stadiumShape.render(ctx, { x: 10, y: 10 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('rx='); // Rounded corners
    expect(svg).toContain('Start');
  });

  it('should use semicircular ends (rx = height/2)', () => {
    const ctx = createMockContext('End');
    const bounds = stadiumShape.bounds(ctx);
    const svg = stadiumShape.render(ctx, { x: 0, y: 0 });

    const expectedRx = bounds.height / 2;
    expect(svg).toContain(`rx="${expectedRx}"`);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = stadiumShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should handle long text', () => {
    const ctx = createMockContext('Very Long Stadium Label');
    const bounds = stadiumShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(150);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('"Start" & <Go>');
    const svg = stadiumShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&quot;');
    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
