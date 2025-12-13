import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { linedRectangleShape } from './linedRectangle.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'linedRectangle',
      label,
      data,
    },
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

describe('Lined Rectangle', () => {
  it('should have correct shape id', () => {
    expect(linedRectangleShape.id).toBe('linedRectangle');
  });

  it('should calculate bounds with label', () => {
    const ctx = createMockContext('Document');
    const bounds = linedRectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('Test');
    const anchors = linedRectangleShape.anchors(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render valid SVG with bottom line', () => {
    const ctx = createMockContext('Manual Input');
    const svg = linedRectangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('<line'); // Bottom line
    expect(svg).toContain('Manual Input');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = linedRectangleShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Doc & "Input"');
    const svg = linedRectangleShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&quot;');
  });
});
