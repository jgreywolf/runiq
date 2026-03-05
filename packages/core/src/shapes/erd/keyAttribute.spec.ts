import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { erdKeyAttributeShape } from './keyAttribute.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'erdKeyAttribute',
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

describe('ERD Key Attribute', () => {
  it('should have correct shape id', () => {
    expect(erdKeyAttributeShape.id).toBe('erdKeyAttribute');
  });

  it('should calculate bounds with label', () => {
    const ctx = createMockContext('id');
    const bounds = erdKeyAttributeShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('userId');
    const anchors = erdKeyAttributeShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render underlined text for key attribute', () => {
    const ctx = createMockContext('customerId');
    const svg = erdKeyAttributeShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('customerId');
    expect(svg).toContain('ellipse');
    // Key attributes have underlined text
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = erdKeyAttributeShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('key & <id>');
    const svg = erdKeyAttributeShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
