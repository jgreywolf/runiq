import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { erdAttributeShape } from './attribute.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'erdAttribute',
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

describe('ERD Attribute', () => {
  it('should have correct shape id', () => {
    expect(erdAttributeShape.id).toBe('erdAttribute');
  });

  it('should calculate bounds with label', () => {
    const ctx = createMockContext('name');
    const bounds = erdAttributeShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('age');
    const anchors = erdAttributeShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render ellipse for attribute', () => {
    const ctx = createMockContext('email');
    const svg = erdAttributeShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('email');
    expect(svg).toContain('ellipse');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = erdAttributeShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('attr & <name>');
    const svg = erdAttributeShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
