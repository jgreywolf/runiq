import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { chevronShape } from './chevron.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'chevron',
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

describe('Chevron Shape', () => {
  it('should have correct shape id', () => {
    expect(chevronShape.id).toBe('chevron');
  });

  it('should calculate bounds with arrow space', () => {
    const ctx = createMockContext('Next Step');
    const bounds = chevronShape.bounds(ctx);

    // Should include space for arrow point (20px)
    const textWidth = 'Next Step'.length * 8;
    expect(bounds.width).toBeGreaterThan(textWidth + 24); // text + padding + arrow
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('Test');
    const anchors = chevronShape.anchors(ctx);

    expect(anchors).toHaveLength(4);
    expect(anchors.map((a) => a.name)).toEqual([
      'top',
      'right',
      'bottom',
      'left',
    ]);
  });

  it('should have right anchor at arrow tip', () => {
    const ctx = createMockContext('Test');
    const bounds = chevronShape.bounds(ctx);
    const anchors = chevronShape.anchors(ctx);

    const rightAnchor = anchors.find((a) => a.name === 'right');
    expect(rightAnchor?.x).toBe(bounds.width); // At the tip
    expect(rightAnchor?.y).toBe(bounds.height / 2); // Centered vertically
  });

  it('should render valid SVG with chevron polygon', () => {
    const ctx = createMockContext('Forward');
    const svg = chevronShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<polygon');
    expect(svg).toContain('Forward');
  });

  it('should escape XML in labels', () => {
    const ctx = createMockContext('A & B');
    const svg = chevronShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
  });

  it('should handle empty label', () => {
    const ctx = createMockContext('');
    expect(() => {
      chevronShape.bounds(ctx);
      chevronShape.render(ctx, { x: 0, y: 0 });
    }).not.toThrow();
  });

  it('should handle long text', () => {
    const ctx = createMockContext('Very Long Label Text');
    const bounds = chevronShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(150);
  });

  it('should render without errors for special characters', () => {
    const ctx = createMockContext('<>&"\'');
    const svg = chevronShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
    expect(svg).toContain('&amp;');
  });
});
