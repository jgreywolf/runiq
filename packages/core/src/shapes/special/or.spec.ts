import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { orShape } from './or.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'or',
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

describe('OR Shape', () => {
  it('should have correct shape id', () => {
    expect(orShape.id).toBe('or');
  });

  it('should calculate bounds', () => {
    const ctx = createMockContext('OR');
    const bounds = orShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Gate');
    const anchors = orShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render OR gate shape', () => {
    const ctx = createMockContext('OR');
    const svg = orShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toBeTruthy();
    expect(svg.length).toBeGreaterThan(0);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = orShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('OR & <Gate>');
    const svg = orShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
