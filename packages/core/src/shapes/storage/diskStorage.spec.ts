import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { diskStorageShape } from './diskStorage.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'diskStorage',
      label,
      data,
    },
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

describe('Disk Storage', () => {
  it('should have correct shape id', () => {
    expect(diskStorageShape.id).toBe('diskStorage');
  });

  it('should calculate bounds for disk shape', () => {
    const ctx = createMockContext('Disk');
    const bounds = diskStorageShape.bounds(ctx);

    expect(bounds.height).toBeLessThanOrEqual(50); // Short
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Storage');
    const anchors = diskStorageShape.anchors(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render flattened cylinder wider than tall', () => {
    const ctx = createMockContext('Platter');
    const svg = diskStorageShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<g>');
    expect(svg).toContain('<ellipse'); // Top ellipse
    expect(svg).toContain('<path'); // Bottom curve

    const bounds = diskStorageShape.bounds(ctx);
    expect(bounds.width).toBeGreaterThan(bounds.height);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = diskStorageShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Disk & <Storage>');
    const svg = diskStorageShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
