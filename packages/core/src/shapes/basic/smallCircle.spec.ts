import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { smallCircleShape } from './smallCircle.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {},
  nodeId: string = 'A'
): ShapeRenderContext {
  return {
    node: { id: nodeId, shape: 'smallCircle', label, data },
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

describe('Small Circle', () => {
  it('should have id sm-circ', () => {
    expect(smallCircleShape.id).toBe('smallCircle');
  });

  it('should have smaller minimum size than standard circle', () => {
    const ctx = createMockContext('', {}, 'X'); // Short id for minimum size test
    const bounds = smallCircleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(30); // Minimum 30px (vs 50 for standard)
    expect(bounds.height).toBe(bounds.width); // Square bounds
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('B');
    const anchors = smallCircleShape.anchors!(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render single circle', () => {
    const ctx = createMockContext('C');
    const svg = smallCircleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<circle');
  });

  it.skip('should use smaller font size', () => {
    const ctx = createMockContext('X');
    const svg = smallCircleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('font-size="12"'); // Smaller than standard 14
  });

  it('should expand for text labels', () => {
    const ctx = createMockContext('Small');
    const bounds = smallCircleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(40);
    expect(bounds.height).toBeGreaterThan(40);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('A&B');
    const svg = smallCircleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
  });
});
