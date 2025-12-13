import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { activationShape } from './activation.js';

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

describe('UML Activation', () => {
  it('should have correct id', () => {
    expect(activationShape.id).toBe('activation');
  });

  it('should calculate bounds as thin vertical rectangle', () => {
    const ctx = createMockContext('', { height: 80 });
    const bounds = activationShape.bounds(ctx);

    // Activation boxes are narrow (typically 10-20 px)
    expect(bounds.width).toBeLessThan(30);
    expect(bounds.height).toBe(80);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext();
    const anchors = activationShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render thin rectangle', () => {
    const ctx = createMockContext('', { height: 100 });
    const svg = activationShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('width="16"'); // Thin activation box
  });

  it('should default to 60px height if not specified', () => {
    const ctx = createMockContext();
    const bounds = activationShape.bounds(ctx);

    expect(bounds.height).toBe(60);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = activationShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
