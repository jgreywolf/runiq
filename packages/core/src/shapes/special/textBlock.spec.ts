import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { textBlockShape } from './textBlock.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'textBlock',
      label,
      data,
    },
    style: {
      padding: 12,
      fontSize: 14,
      fontFamily: 'Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Text Block (Comment)', () => {
  it('should have correct shape id', () => {
    expect(textBlockShape.id).toBe('textBlock');
  });

  it('should calculate bounds with padding', () => {
    const ctx = createMockContext('Note: This is a comment');
    const bounds = textBlockShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(100);
    expect(bounds.height).toBeGreaterThanOrEqual(40);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Comment');
    const anchors = textBlockShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render text block with dashed border', () => {
    const ctx = createMockContext('Note');
    const svg = textBlockShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('stroke-dasharray'); // Dashed border
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = textBlockShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Note & <Comment>');
    const svg = textBlockShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
