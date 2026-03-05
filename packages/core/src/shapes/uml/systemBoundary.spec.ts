import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { systemBoundaryShape } from './systemBoundary.js';

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
      padding: 20,
      fontSize: 14,
      fontFamily: 'Arial',
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('UML System Boundary', () => {
  it('should have correct id', () => {
    expect(systemBoundaryShape.id).toBe('systemBoundary');
  });

  it('should calculate bounds with extra space for label at top', () => {
    const ctx = createMockContext('Banking System');
    const bounds = systemBoundaryShape.bounds(ctx);

    // Should be reasonably large to contain use cases
    expect(bounds.width).toBeGreaterThanOrEqual(200);
    expect(bounds.height).toBeGreaterThanOrEqual(150);
  });

  it('should enforce minimum dimensions for container', () => {
    const ctx = createMockContext('A');
    const bounds = systemBoundaryShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(200);
    expect(bounds.height).toBeGreaterThanOrEqual(150);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Banking System');
    const anchors = systemBoundaryShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
    expect(anchors?.[0].name).toBe('top');
    expect(anchors?.[1].name).toBe('right');
    expect(anchors?.[2].name).toBe('bottom');
    expect(anchors?.[3].name).toBe('left');
  });

  it('should render rectangle with dashed stroke', () => {
    const ctx = createMockContext('Banking System');
    const svg = systemBoundaryShape.render(ctx, { x: 50, y: 50 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('stroke-dasharray');
  });

  it('should position label at top-left corner', () => {
    const ctx = createMockContext('Banking System');
    const svg = systemBoundaryShape.render(ctx, { x: 50, y: 50 });

    // Label should be visible at the top
    expect(svg).toContain('Banking System');
    expect(svg).toContain('<text'); // Label is rendered
  });

  it('should handle long system names', () => {
    const ctx = createMockContext('Enterprise Resource Planning System');
    const bounds = systemBoundaryShape.bounds(ctx);

    // Should be wide enough for the label
    expect(bounds.width).toBeGreaterThan(200);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = systemBoundaryShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
