import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { choiceShape } from './choice.js';

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

describe('UML Choice', () => {
  it('should have correct id', () => {
    expect(choiceShape.id).toBe('choice');
  });

  it('should calculate bounds as diamond', () => {
    const ctx = createMockContext();
    const bounds = choiceShape.bounds(ctx);

    // Choice is a small diamond, typically 20-30px
    expect(bounds.width).toBeLessThan(40);
    expect(bounds.height).toBeLessThan(40);
    expect(bounds.width).toBe(bounds.height); // Should be square diamond
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext();
    const anchors = choiceShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render diamond shape', () => {
    const ctx = createMockContext();
    const svg = choiceShape.render(ctx, { x: 0, y: 0 });

    expect(svg.includes('<path') || svg.includes('<polygon')).toBe(true);
    expect(svg.includes('M') || svg.includes('points')).toBe(true);
  });

  it('should support guard conditions', () => {
    const ctx = createMockContext('[x > 0]');
    const svg = choiceShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('[x &gt; 0]');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = choiceShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
