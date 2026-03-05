import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { hourglassShape } from './hourglass.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'hourglass',
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

describe('Hourglass', () => {
  it('should have correct shape id', () => {
    expect(hourglassShape.id).toBe('hourglass');
  });

  it('should calculate bounds', () => {
    const ctx = createMockContext('Time');
    const bounds = hourglassShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Wait');
    const anchors = hourglassShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render hourglass shape', () => {
    const ctx = createMockContext('Timer');
    const svg = hourglassShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toBeTruthy();
    expect(svg.length).toBeGreaterThan(0);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = hourglassShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Time & <Wait>');
    const svg = hourglassShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
