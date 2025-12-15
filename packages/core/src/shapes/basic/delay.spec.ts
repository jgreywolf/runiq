import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { delayShape } from '../index.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: { id: 'test-node', shape: 'delay', label, data },
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

describe('Delay Shape', () => {
  it('should have correct id', () => {
    expect(delayShape.id).toBe('delay');
  });

  it('should calculate standard bounds', () => {
    const ctx = createMockContext('Wait');
    const bounds = delayShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Delay');
    const anchors = delayShape.anchors!(ctx);

    expect(anchors).toHaveLength(4);
    expect(anchors.map((a) => a.name)).toEqual([
      'top',
      'right',
      'bottom',
      'left',
    ]);
  });

  it('should render path with curved right side', () => {
    const ctx = createMockContext('Pause');
    const svg = delayShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path');
    expect(svg).toContain('d=');
    // Should contain quadratic curve commands (Q)
    expect(svg).toContain('Q');
  });

  it('should have straight left side and curved right side', () => {
    const ctx = createMockContext('Time');
    const svg = delayShape.render(ctx, { x: 10, y: 10 });

    // Should start with M (move), have L (lines) and Q (curves)
    expect(svg).toMatch(/M \d+,\d+/); // Move command
    expect(svg).toMatch(/L \d+,\d+/); // Line command
    expect(svg).toMatch(/Q \d+,\d+ \d+,\d+/); // Quadratic curve
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = delayShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should handle long text', () => {
    const ctx = createMockContext('Very Long Delay Label');
    const bounds = delayShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(130);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Wait & Delay');
    const svg = delayShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
  });
});
