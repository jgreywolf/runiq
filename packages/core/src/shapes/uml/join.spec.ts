import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { joinShape } from './join.js';

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

describe('UML Join', () => {
  it('should have correct id', () => {
    expect(joinShape.id).toBe('join');
  });

  it('should calculate bounds as horizontal bar', () => {
    const ctx = createMockContext();
    const bounds = joinShape.bounds(ctx);

    // Join is identical to fork - thick horizontal bar
    expect(bounds.width).toBeGreaterThan(bounds.height);
    expect(bounds.height).toBeLessThan(15);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext();
    const anchors = joinShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render thick horizontal bar', () => {
    const ctx = createMockContext();
    const svg = joinShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg.includes('fill="#000000"') || svg.includes('fill="black"')).toBe(
      true
    );
  });

  it('should support custom width', () => {
    const ctx = createMockContext('', { width: 150 });
    const bounds = joinShape.bounds(ctx);

    expect(bounds.width).toBe(150);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = joinShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
