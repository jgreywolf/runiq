import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { linedDocumentShape } from '../index.js';

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

describe('Flowchart Lined Document', () => {
  it('should have correct id', () => {
    expect(linedDocumentShape.id).toBe('linedDocument');
  });

  it('should calculate bounds with fold space', () => {
    const ctx = createMockContext('Report');
    const bounds = linedDocumentShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(60);
    expect(bounds.height).toBeGreaterThanOrEqual(60); // Tall enough for lines
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('File');
    const anchors = linedDocumentShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render document with fold corner', () => {
    const ctx = createMockContext('Doc');
    const svg = linedDocumentShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path'); // Document shape
    expect(svg).toContain('<line'); // Horizontal lines
  });

  it('should have horizontal lines inside', () => {
    const ctx = createMockContext('Text');
    const svg = linedDocumentShape.render(ctx, { x: 0, y: 0 });

    const lineCount = (svg.match(/<line/g) || []).length;
    expect(lineCount).toBeGreaterThanOrEqual(2); // At least 2 lines
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = linedDocumentShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
