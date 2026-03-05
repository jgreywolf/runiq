import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { fragmentShape } from './fragment.js';

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

describe('UML Interaction Fragment', () => {
  it('should have correct id', () => {
    expect(fragmentShape.id).toBe('interactionFragment');
  });

  it('should calculate bounds for interaction fragment', () => {
    const ctx = createMockContext('alt');
    const bounds = fragmentShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(100);
    expect(bounds.height).toBeGreaterThan(80);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('loop');
    const anchors = fragmentShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render fragment with operator in pentagon', () => {
    const ctx = createMockContext('alt', {
      condition: '[x > 0]',
    });
    const svg = fragmentShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect'); // Main frame
    expect(svg).toContain('<path'); // Pentagon for operator
    expect(svg).toContain('alt');
    expect(svg).toContain('[x &gt; 0]');
  });

  it('should support different operators', () => {
    const operators = ['alt', 'opt', 'loop', 'par', 'break', 'critical', 'ref'];

    operators.forEach((op) => {
      const ctx = createMockContext(op);
      const svg = fragmentShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain(op);
    });
  });

  it('should handle fragment without condition', () => {
    const ctx = createMockContext('opt');
    const svg = fragmentShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('opt');
  });

  it('should support custom width and height', () => {
    const ctx = createMockContext('loop', {
      width: 300,
      height: 200,
    });
    const bounds = fragmentShape.bounds(ctx);

    expect(bounds.width).toBe(300);
    expect(bounds.height).toBe(200);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = fragmentShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
