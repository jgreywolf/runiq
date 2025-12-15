import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { taggedDocumentShape } from '../index.js';

function createMockContext(label: string): ShapeRenderContext {
  return {
    node: {
      id: label.toLowerCase(),
      shape: 'doc',
      label,
    },
    style: {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
      fontSize: 14,
      fontFamily: 'Arial',
      padding: 12,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Flowchart Tagged Document', () => {
  it('should have correct id', () => {
    expect(taggedDocumentShape.id).toBe('taggedDocument');
  });

  it('should calculate bounds with fold and tag', () => {
    const ctx = createMockContext('Tagged');
    const bounds = taggedDocumentShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(60);
    expect(bounds.height).toBeGreaterThanOrEqual(50);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Label');
    const anchors = taggedDocumentShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render document with corner tag', () => {
    const ctx = createMockContext('Tagged');
    const svg = taggedDocumentShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path'); // Document shape
    expect(svg).toContain('<polygon'); // Corner tag
  });

  it('should have triangular tag in corner', () => {
    const ctx = createMockContext('Flag');
    const svg = taggedDocumentShape.render(ctx, { x: 0, y: 0 });

    // Should have polygon for tag
    expect(svg).toContain('<polygon');
    expect(svg).toContain('points=');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = taggedDocumentShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
