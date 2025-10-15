import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from '../types.js';
import {
  linedDocumentShape,
  multiDocumentShape,
  taggedDocumentShape,
} from '../shapes/index.js';

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
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Document Shapes (TDD)', () => {
  describe('Lined Document', () => {
    it('should have id lined-doc', () => {
      expect(linedDocumentShape.id).toBe('lined-doc');
    });

    it('should calculate bounds with fold space', () => {
      const ctx = createMockContext('Report');
      const bounds = linedDocumentShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(60);
      expect(bounds.height).toBeGreaterThanOrEqual(60); // Tall enough for lines
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('File');
      const anchors = linedDocumentShape.anchors!(ctx);

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
  });

  describe('Multi Document (Stacked)', () => {
    it('should have id multi-doc', () => {
      expect(multiDocumentShape.id).toBe('multi-doc');
    });

    it('should calculate bounds with stack offset', () => {
      const ctx = createMockContext('Files');
      const bounds = multiDocumentShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(60);
      expect(bounds.height).toBeGreaterThanOrEqual(50);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Stack');
      const anchors = multiDocumentShape.anchors!(ctx);

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
  });

  describe('Tagged Document', () => {
    it('should have id tag-doc', () => {
      expect(taggedDocumentShape.id).toBe('tag-doc');
    });

    it('should calculate bounds with fold and tag', () => {
      const ctx = createMockContext('Tagged');
      const bounds = taggedDocumentShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(60);
      expect(bounds.height).toBeGreaterThanOrEqual(50);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Label');
      const anchors = taggedDocumentShape.anchors!(ctx);

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
  });
});
