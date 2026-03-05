import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { abstractShape } from './abstract.js';

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

describe('UML Abstract Class', () => {
  it('should have correct id', () => {
    expect(abstractShape.id).toBe('abstract');
  });

  it('should calculate bounds', () => {
    const ctx = createMockContext('AbstractFactory');
    const bounds = abstractShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(80);
    expect(bounds.height).toBeGreaterThan(30);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Vehicle');
    const anchors = abstractShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render abstract class with italicized name', () => {
    const ctx = createMockContext('Vehicle', {
      attributes: ['speed: int'],
      methods: ['move()', 'stop()'],
    });
    const svg = abstractShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('font-style="italic"');
    expect(svg).toContain('Vehicle');
  });

  it('should show «abstract» stereotype when specified', () => {
    const ctx = createMockContext('Shape', {
      showStereotype: true,
      methods: ['draw()'],
    });
    const svg = abstractShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('«abstract»');
    expect(svg).toContain('Shape');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = abstractShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
