import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { internalStorageShape } from './internalStorage.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'internalStorage',
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

describe('Internal Storage', () => {
  it('should have correct shape id', () => {
    expect(internalStorageShape.id).toBe('internalStorage');
  });

  it('should calculate standard bounds', () => {
    const ctx = createMockContext('Memory');
    const bounds = internalStorageShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(80);
    expect(bounds.height).toBeGreaterThanOrEqual(60);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Buffer');
    const anchors = internalStorageShape.anchors(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render rectangle with window-pane divisions', () => {
    const ctx = createMockContext('RAM');
    const svg = internalStorageShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('<line'); // Division lines

    const lineCount = (svg.match(/<line/g) || []).length;
    expect(lineCount).toBe(2); // Horizontal and vertical lines
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = internalStorageShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('RAM & <Buffer>');
    const svg = internalStorageShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
