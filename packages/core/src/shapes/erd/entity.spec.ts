import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { erdEntityShape } from './entity.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'erdEntity',
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

describe('ERD Entity', () => {
  it('should have correct shape id', () => {
    expect(erdEntityShape.id).toBe('erdEntity');
  });

  it('should calculate bounds with label', () => {
    const ctx = createMockContext('Customer');
    const bounds = erdEntityShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('Order');
    const anchors = erdEntityShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render rectangle entity', () => {
    const ctx = createMockContext('Product');
    const svg = erdEntityShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('Product');
    expect(svg).toContain('rect');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = erdEntityShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Entity & <Name>');
    const svg = erdEntityShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
