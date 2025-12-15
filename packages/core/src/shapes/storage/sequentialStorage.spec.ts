import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { sequentialStorageShape } from './sequentialStorage.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'sequentialStorage',
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

describe('Sequential Storage', () => {
  it('should have correct shape id', () => {
    expect(sequentialStorageShape.id).toBe('sequentialStorage');
  });

  it('should calculate bounds', () => {
    const ctx = createMockContext('Tape');
    const bounds = sequentialStorageShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(80);
    expect(bounds.height).toBeGreaterThanOrEqual(60);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Sequential');
    const anchors = sequentialStorageShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render half-stadium with curved left side', () => {
    const ctx = createMockContext('Tape');
    const svg = sequentialStorageShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path');
    expect(svg).toContain('A'); // Arc for left curve
    expect(svg).toContain('Tape');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = sequentialStorageShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Tape & <Storage>');
    const svg = sequentialStorageShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
