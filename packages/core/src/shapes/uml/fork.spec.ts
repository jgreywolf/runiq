import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { forkShape } from './fork.js';

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

describe('UML Fork', () => {
  it('should have correct id', () => {
    expect(forkShape.id).toBe('fork');
  });

  it('should calculate bounds as horizontal bar', () => {
    const ctx = createMockContext();
    const bounds = forkShape.bounds(ctx);

    // Fork is a thick horizontal bar
    expect(bounds.width).toBeGreaterThan(bounds.height);
    expect(bounds.height).toBeLessThan(15); // Thick bar, but not too tall
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext();
    const anchors = forkShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render thick horizontal bar', () => {
    const ctx = createMockContext();
    const svg = forkShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg.includes('fill="#000000"') || svg.includes('fill="black"')).toBe(
      true
    );
  });

  it('should support custom width', () => {
    const ctx = createMockContext('', { width: 150 });
    const bounds = forkShape.bounds(ctx);

    expect(bounds.width).toBe(150);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = forkShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
