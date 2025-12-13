import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { erdMultivaluedAttributeShape } from './multivaluedAttribute.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'erdMultivaluedAttribute',
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

describe('ERD Multivalued Attribute', () => {
  it('should have correct shape id', () => {
    expect(erdMultivaluedAttributeShape.id).toBe('erdMultivaluedAttribute');
  });

  it('should calculate bounds with label', () => {
    const ctx = createMockContext('phoneNumbers');
    const bounds = erdMultivaluedAttributeShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('emails');
    const anchors = erdMultivaluedAttributeShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render double ellipse for multivalued attribute', () => {
    const ctx = createMockContext('skills');
    const svg = erdMultivaluedAttributeShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('skills');
    // Should have nested ellipses for multivalued
    expect(svg).toContain('ellipse');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = erdMultivaluedAttributeShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('multi & <values>');
    const svg = erdMultivaluedAttributeShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
