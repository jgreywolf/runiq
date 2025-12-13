import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { erdRelationshipShape } from './relationship.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'erdRelationship',
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

describe('ERD Relationship', () => {
  it('should have correct shape id', () => {
    expect(erdRelationshipShape.id).toBe('erdRelationship');
  });

  it('should calculate bounds with label', () => {
    const ctx = createMockContext('purchases');
    const bounds = erdRelationshipShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('has');
    const anchors = erdRelationshipShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render diamond shape', () => {
    const ctx = createMockContext('owns');
    const svg = erdRelationshipShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('owns');
    expect(svg).toContain('polygon');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = erdRelationshipShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('has & <owns>');
    const svg = erdRelationshipShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
