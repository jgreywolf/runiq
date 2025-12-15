import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { finalStateShape } from './finalState.js';

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

describe('UML Final State', () => {
  it('should have correct id', () => {
    expect(finalStateShape.id).toBe('finalState');
  });

  it('should calculate bounds as bullseye', () => {
    const ctx = createMockContext();
    const bounds = finalStateShape.bounds(ctx);

    // Final state is typically 20-24px diameter
    expect(bounds.width).toBeLessThan(30);
    expect(bounds.height).toBeLessThan(30);
    expect(bounds.width).toBe(bounds.height); // Should be circular
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext();
    const anchors = finalStateShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render bullseye (outer circle with inner filled circle)', () => {
    const ctx = createMockContext();
    const svg = finalStateShape.render(ctx, { x: 0, y: 0 });

    // Should have 2 circles
    const circleCount = (svg.match(/<circle/g) || []).length;
    expect(circleCount).toBe(2);
    expect(svg.includes('fill="#000000"') || svg.includes('fill="black"')).toBe(
      true
    );
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = finalStateShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
