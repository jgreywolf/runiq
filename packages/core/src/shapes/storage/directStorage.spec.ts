import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { directStorageShape } from './directStorage.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'directStorage',
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

describe('Direct Storage', () => {
  it('should have correct shape id', () => {
    expect(directStorageShape.id).toBe('directStorage');
  });

  it('should calculate bounds', () => {
    const ctx = createMockContext('Direct');
    const bounds = directStorageShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(80);
    expect(bounds.height).toBeGreaterThanOrEqual(60);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Storage');
    const anchors = directStorageShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render with inward curves on left and right', () => {
    const ctx = createMockContext('Access');
    const svg = directStorageShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path');
    expect(svg).toContain('Q'); // Quadratic curves
    expect(svg).toContain('Access');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = directStorageShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Direct & <Storage>');
    const svg = directStorageShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
