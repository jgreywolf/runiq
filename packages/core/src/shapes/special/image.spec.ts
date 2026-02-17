import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { imageShape } from './image.js';

function createMockContext(
  label = 'Image',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'image-node',
      shape: 'image',
      label,
      data,
    },
    style: {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
      fontSize: 14,
      fontFamily: 'Arial',
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Image Shape', () => {
  it('should expose image shape id', () => {
    expect(imageShape.id).toBe('image');
  });

  it('should render external image url from data src', () => {
    const ctx = createMockContext('Hero', {
      values: [{ src: 'https://example.com/image.png' }],
    });
    const svg = imageShape.render(ctx, { x: 10, y: 20 });

    expect(svg).toContain('<image');
    expect(svg).toContain('href="https://example.com/image.png"');
  });

  it('should fallback to placeholder image for unsafe src', () => {
    const ctx = createMockContext('Unsafe', {
      values: [{ src: 'javascript:alert(1)' }],
    });
    const svg = imageShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('data:image/svg+xml');
    expect(svg).not.toContain('javascript:alert(1)');
  });
});

