import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { lifelineShape } from './lifeline.js';

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

describe('UML Lifeline', () => {
  it('should have correct id', () => {
    expect(lifelineShape.id).toBe('lifeline');
  });

  it('should calculate bounds with header box and line', () => {
    const ctx = createMockContext('UserService');
    const bounds = lifelineShape.bounds(ctx);

    // Should have width for the header box and height for the vertical line
    expect(bounds.width).toBeGreaterThan(80);
    expect(bounds.height).toBeGreaterThan(100);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Database');
    const anchors = lifelineShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
    expect(anchors?.[0].name).toBe('top');
    expect(anchors?.[1].name).toBe('right');
    expect(anchors?.[2].name).toBe('bottom');
    expect(anchors?.[3].name).toBe('left');
  });

  it('should render lifeline with header box and dashed line', () => {
    const ctx = createMockContext(':Controller');
    const svg = lifelineShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect'); // Header box
    expect(svg).toContain('stroke-dasharray'); // Dashed line
    expect(svg).toContain(':Controller');
  });

  it('should support custom height', () => {
    const ctx = createMockContext('Service', { height: 300 });
    const bounds = lifelineShape.bounds(ctx);

    // Total height = header height + line height
    // Header is ~42px (padding + line height), so total should be 342
    expect(bounds.height).toBeGreaterThan(300);
    expect(bounds.height).toBeLessThan(360);
  });

  it('should support stereotype', () => {
    const ctx = createMockContext('API', { stereotype: 'boundary' });
    const svg = lifelineShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('«boundary»');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = lifelineShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
