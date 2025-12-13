import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { flippedTrapezoidShape, trapezoidShape } from './trapezoid.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: { id: 'test-node', shape: 'trapezoid', label, data },
    style: {
      padding: 12,
      fontSize: 14,
      fontFamily: 'Arial',
      fill: '#f0f0f0',
      stroke: '#333',
      strokeWidth: 1,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Trapezoid Shape', () => {
  it('should have correct id for base-down trapezoid', () => {
    expect(trapezoidShape.id).toBe('trapezoid');
  });

  it('should calculate bounds with minimum size', () => {
    const ctx = createMockContext('Priority');
    const bounds = trapezoidShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(80);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('High');
    const anchors = trapezoidShape.anchors!(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render trapezoid with narrower top', () => {
    const ctx = createMockContext('Top Narrow');
    const bounds = trapezoidShape.bounds(ctx);
    const svg = trapezoidShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path');
    // Top should be inset 20% on each side
    const inset = bounds.width * 0.2;
    expect(svg).toContain(`${inset},0`); // Top left
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = trapezoidShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(80);
  });

  it('should handle long text', () => {
    const ctx = createMockContext('Very Long Trapezoid Label');
    const bounds = trapezoidShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(150);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Priority & <High>');
    const svg = trapezoidShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});

describe('Flipped Trapezoid Shape', () => {
  it('should have correct id for base-up trapezoid', () => {
    expect(flippedTrapezoidShape.id).toBe('flippedTrapezoid');
  });

  it('should render trapezoid with narrower bottom', () => {
    const ctx = createMockContext('Manual Op');
    const bounds = flippedTrapezoidShape.bounds(ctx);
    const svg = flippedTrapezoidShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path');
    // Bottom should be inset
    const inset = bounds.width * 0.2;
    const bottomY = bounds.height;
    expect(svg).toContain(`${inset},${bottomY}`); // Bottom left
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Manual');
    const anchors = flippedTrapezoidShape.anchors!(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = flippedTrapezoidShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(80);
  });

  it('should handle long text', () => {
    const ctx = createMockContext('Very Long Flipped Trapezoid Label');
    const bounds = flippedTrapezoidShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(200);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Manual & "Input"');
    const svg = flippedTrapezoidShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&quot;');
  });
});
