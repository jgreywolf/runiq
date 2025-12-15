import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { multiDocumentShape } from '../index.js';

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

describe('Flowchart Multi Document', () => {
  it('should have correct id', () => {
    expect(multiDocumentShape.id).toBe('multiDocument');
  });

  it('should calculate bounds with stack offset', () => {
    const ctx = createMockContext('Files');
    const bounds = multiDocumentShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(60);
    expect(bounds.height).toBeGreaterThanOrEqual(50);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Stack');
    const anchors = multiDocumentShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render stacked documents', () => {
    const ctx = createMockContext('Docs');
    const svg = multiDocumentShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<g>'); // Group for multiple docs
    expect(svg).toContain('<path'); // Document paths
  });

  it('should have multiple document layers', () => {
    const ctx = createMockContext('Multi');
    const svg = multiDocumentShape.render(ctx, { x: 0, y: 0 });

    const pathCount = (svg.match(/<path/g) || []).length;
    expect(pathCount).toBeGreaterThanOrEqual(2); // At least 2 document layers
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = multiDocumentShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
