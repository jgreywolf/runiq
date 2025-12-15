import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types';
import { nodeShape } from './node';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: '@test',
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

describe('UML Node', () => {
  it('should have correct shape id', () => {
    expect(nodeShape.id).toBe('node');
  });

  it('should calculate bounds with label', () => {
    const ctx = createMockContext('Application Server');
    const bounds = nodeShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('Database Server');
    const anchors = nodeShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render 3D cube shape', () => {
    const ctx = createMockContext('Web Server');
    const svg = nodeShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path'); // 3D cube uses path
    expect(svg).toContain('Web Server');
  });

  it('should handle empty label', () => {
    const ctx = createMockContext('');
    const bounds = nodeShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should include stereotype «device»', () => {
    const ctx = createMockContext('Server');
    const svg = nodeShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('«device»');
    expect(svg).toContain('Server');
  });

  it('should apply style properties', () => {
    const ctx = createMockContext('Node', {
      fillColor: '#f3e5f5',
      strokeColor: '#7b1fa2',
    });
    const svg = nodeShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('#f3e5f5');
    expect(svg).toContain('#7b1fa2');
  });
});
