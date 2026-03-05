import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { initialStateShape } from './initialState.js';

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

describe('UML Initial State', () => {
  it('should have correct id', () => {
    expect(initialStateShape.id).toBe('initialState');
  });

  it('should calculate bounds as small filled circle', () => {
    const ctx = createMockContext();
    const bounds = initialStateShape.bounds(ctx);

    // Initial state is typically 16-20px diameter
    expect(bounds.width).toBeLessThan(25);
    expect(bounds.height).toBeLessThan(25);
    expect(bounds.width).toBe(bounds.height); // Should be circular
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext();
    const anchors = initialStateShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render filled circle', () => {
    const ctx = createMockContext();
    const svg = initialStateShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<circle');
    expect(svg.includes('fill="#000000"') || svg.includes('fill="black"')).toBe(
      true
    );
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = initialStateShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
