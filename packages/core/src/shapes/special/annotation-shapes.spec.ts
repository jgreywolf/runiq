import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from '../../types.js';
import { textBlockShape, braceLeftShape, braceRightShape } from '../index.js';

function createMockContext(label: string): ShapeRenderContext {
  return {
    node: {
      id: label.toLowerCase(),
      shape: 'textBlock',
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

describe('Annotation Shapes (TDD)', () => {
  describe('Text Block (Comment)', () => {
    it('should have id text', () => {
      expect(textBlockShape.id).toBe('textBlock');
    });

    it('should calculate bounds with padding', () => {
      const ctx = createMockContext('Note: This is a comment');
      const bounds = textBlockShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(100);
      expect(bounds.height).toBeGreaterThanOrEqual(40);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Comment');
      const anchors = textBlockShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render text block with dashed border', () => {
      const ctx = createMockContext('Note');
      const svg = textBlockShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('stroke-dasharray'); // Dashed border
    });

    it('should have transparent or light fill', () => {
      const ctx = createMockContext('Comment');
      const svg = textBlockShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('fill=');
      // Should not be solid dark fill
      expect(svg).not.toContain('fill="#333"');
    });
  });

  describe('Brace Left (Grouping)', () => {
    it('should have id brace-l', () => {
      expect(braceLeftShape.id).toBe('braceLeft');
    });

    it('should calculate tall bounds for grouping', () => {
      const ctx = createMockContext('Group');
      const bounds = braceLeftShape.bounds(ctx);

      expect(bounds.height).toBeGreaterThanOrEqual(80); // Tall for grouping
      expect(bounds.width).toBeLessThan(bounds.height); // Taller than wide
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Left');
      const anchors = braceLeftShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render left-facing brace', () => {
      const ctx = createMockContext('{');
      const svg = braceLeftShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path'); // Curly brace path
    });

    it('should have curvy brace shape', () => {
      const ctx = createMockContext('Brace');
      const svg = braceLeftShape.render(ctx, { x: 0, y: 0 });

      // Should have curves (quadratic or cubic)
      const hasCurves = svg.includes('Q') || svg.includes('C');
      expect(hasCurves).toBe(true);
    });
  });

  describe('Brace Right (Grouping)', () => {
    it('should have id brace-r', () => {
      expect(braceRightShape.id).toBe('braceRight');
    });

    it('should calculate tall bounds for grouping', () => {
      const ctx = createMockContext('Group');
      const bounds = braceRightShape.bounds(ctx);

      expect(bounds.height).toBeGreaterThanOrEqual(80); // Tall for grouping
      expect(bounds.width).toBeLessThan(bounds.height); // Taller than wide
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Right');
      const anchors = braceRightShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render right-facing brace', () => {
      const ctx = createMockContext('}');
      const svg = braceRightShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path'); // Curly brace path
    });

    it('should have curvy brace shape', () => {
      const ctx = createMockContext('Brace');
      const svg = braceRightShape.render(ctx, { x: 0, y: 0 });

      // Should have curves (quadratic or cubic)
      const hasCurves = svg.includes('Q') || svg.includes('C');
      expect(hasCurves).toBe(true);
    });
  });
});
