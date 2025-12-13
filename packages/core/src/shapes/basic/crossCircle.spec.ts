import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { crossCircleShape } from './crossCircle.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: { id: 'test-node', shape: 'crossCircle', label, data },
    style: {
      padding: 12,
      fontSize: 14,
      fontFamily: 'Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Cross Circle (X Inside)', () => {
  it('should have id x-circ', () => {
    expect(crossCircleShape.id).toBe('crossCircle');
  });

  it('should calculate standard circle bounds', () => {
    const ctx = createMockContext('Cancel');
    const bounds = crossCircleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(50);
    expect(bounds.height).toBeGreaterThanOrEqual(50);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Reject');
    const anchors = crossCircleShape.anchors!(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render circle with X inside', () => {
    const ctx = createMockContext('No');
    const svg = crossCircleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<circle');
    expect(svg).toContain('<line'); // Diagonal lines for X
  });

  it('should have two diagonal lines forming X', () => {
    const ctx = createMockContext('Stop');
    const svg = crossCircleShape.render(ctx, { x: 0, y: 0 });

    const lineCount = (svg.match(/<line/g) || []).length;
    expect(lineCount).toBe(2); // Two diagonal lines
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = crossCircleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(50);
    expect(bounds.height).toBeGreaterThanOrEqual(50);
  });

  it('should handle long text', () => {
    const ctx = createMockContext('Very Long Cancel Label');
    const bounds = crossCircleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(130);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Cancel & <Stop>');
    const svg = crossCircleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
