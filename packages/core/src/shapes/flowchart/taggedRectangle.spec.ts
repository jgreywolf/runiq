import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { taggedRectangleShape } from '../index.js';

function createMockContext(label: string): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'rect',
      label,
    },
    style: {
      fill: '#f0f0f0',
      stroke: '#333',
      strokeWidth: 1,
      fontFamily: 'sans-serif',
      fontSize: 14,
      padding: 12,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Flowchart Tagged Rectangle', () => {
  it('should have correct id', () => {
    expect(taggedRectangleShape.id).toBe('taggedRectangle');
  });

  it('should calculate standard bounds', () => {
    const ctx = createMockContext('Tagged');
    const bounds = taggedRectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Tag');
    const anchors = taggedRectangleShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render rectangle with corner tag', () => {
    const ctx = createMockContext('Flag');
    const svg = taggedRectangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('<polygon'); // Corner tag
  });

  it('should have small triangular tag in corner', () => {
    const ctx = createMockContext('Mark');
    const svg = taggedRectangleShape.render(ctx, { x: 10, y: 10 });

    expect(svg).toContain('<polygon');
    expect(svg).toContain('points='); // Triangle points
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = taggedRectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
