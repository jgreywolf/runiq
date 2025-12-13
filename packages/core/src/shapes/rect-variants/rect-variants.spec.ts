import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { dividedRectangleShape } from './dividedRectangle.js';
import { framedRectangleShape } from './framedRectangle.js';
import { linedRectangleShape } from './linedRectangle.js';
import { multiRectangleShape } from './multiRectangle.js';
import { notchedPentagonShape } from './notchedPentagon.js';
import { notchedRectangleShape } from './notchedRectangle.js';
import { taggedRectangleShape } from './taggedRectangle.js';

/**
 * Test suite for rectangle variant shapes
 * These shapes are specialized rectangles used in flowcharts and process diagrams
 *
 * Shape Categories:
 * 1. Process variants: dividedRectangle, framedRectangle, linedRectangle, multiRectangle
 * 2. Specialized: notchedPentagon, notchedRectangle, taggedRectangle
 */

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'test',
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

describe('Rectangle Variant Shapes', () => {
  // ===================================================================
  // DIVIDED RECTANGLE - Rectangle split vertically
  // ===================================================================
  describe('dividedRectangle', () => {
    it('should have correct shape id', () => {
      expect(dividedRectangleShape.id).toBe('dividedRectangle');
    });

    it('should calculate bounds with label', () => {
      const ctx = createMockContext('Process A | Process B');
      const bounds = dividedRectangleShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should respect minWidth from data', () => {
      const ctx = createMockContext('X', { minWidth: 150 });
      const bounds = dividedRectangleShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(150);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('Test');
      const anchors = dividedRectangleShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors[0].name).toBe('top');
      expect(anchors[1].name).toBe('right');
      expect(anchors[2].name).toBe('bottom');
      expect(anchors[3].name).toBe('left');
    });

    it('should render valid SVG with dividing line', () => {
      const ctx = createMockContext('Left|Right');
      const svg = dividedRectangleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('<line'); // Dividing line
      expect(svg).toContain('Left|Right');
    });

    it('should escape XML in labels', () => {
      const ctx = createMockContext('A & B < C');
      const svg = dividedRectangleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('&amp;');
      expect(svg).toContain('&lt;');
    });
  });

  // ===================================================================
  // FRAMED RECTANGLE - Rectangle with side frames
  // ===================================================================
  describe('framedRectangle', () => {
    it('should have correct shape id', () => {
      expect(framedRectangleShape.id).toBe('framedRectangle');
    });

    it('should calculate bounds accounting for frame width', () => {
      const ctx = createMockContext('Subroutine');
      const bounds = framedRectangleShape.bounds(ctx);

      // Should be wider than basic rectangle due to frames
      expect(bounds.width).toBeGreaterThan(
        ctx.measureText('Subroutine', ctx.style).width
      );
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('Test');
      const anchors = framedRectangleShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render valid SVG with frame lines', () => {
      const ctx = createMockContext('Call Process');
      const svg = framedRectangleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('<line'); // Frame lines
      expect(svg).toContain('Call Process');
    });
  });

  // ===================================================================
  // LINED RECTANGLE - Rectangle with bottom line
  // ===================================================================
  describe('linedRectangle', () => {
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
  });

  // ===================================================================
  // MULTI RECTANGLE - Stacked rectangles effect
  // ===================================================================
  describe('multiRectangle', () => {
    it('should have correct shape id', () => {
      expect(multiRectangleShape.id).toBe('multiRectangle');
    });

    it('should calculate bounds accounting for stack offset', () => {
      const ctx = createMockContext('Multiple Docs');
      const bounds = multiRectangleShape.bounds(ctx);

      // Should be larger due to stacking effect
      expect(bounds.width).toBeGreaterThan(
        ctx.measureText('Multiple Docs', ctx.style).width
      );
    });

    it('should have 4 anchor points on front rectangle', () => {
      const ctx = createMockContext('Test');
      const anchors = multiRectangleShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render valid SVG with multiple rectangles', () => {
      const ctx = createMockContext('Multi-page');
      const svg = multiRectangleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      // Should have multiple rect elements for stacking
      const rectCount = (svg.match(/<rect/g) || []).length;
      expect(rectCount).toBeGreaterThan(1);
      expect(svg).toContain('Multi-page');
    });
  });

  // ===================================================================
  // NOTCHED PENTAGON - Loop limit marker
  // ===================================================================
  describe('notchedPentagon', () => {
    it('should have correct shape id', () => {
      expect(notchedPentagonShape.id).toBe('notchedPentagon');
    });

    it('should calculate bounds with minimum dimensions', () => {
      const ctx = createMockContext('Loop');
      const bounds = notchedPentagonShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(80);
      expect(bounds.height).toBeGreaterThanOrEqual(60);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('Test');
      const anchors = notchedPentagonShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render valid SVG with pentagon polygon', () => {
      const ctx = createMockContext('For Each');
      const svg = notchedPentagonShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<polygon');
      expect(svg).toContain('For Each');
    });
  });

  // ===================================================================
  // NOTCHED RECTANGLE - Rectangle with corner notches
  // ===================================================================
  describe('notchedRectangle', () => {
    it('should have correct shape id', () => {
      expect(notchedRectangleShape.id).toBe('notchedRectangle');
    });

    it('should calculate bounds with label', () => {
      const ctx = createMockContext('Preparation');
      const bounds = notchedRectangleShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('Test');
      const anchors = notchedRectangleShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render valid SVG with notched corners', () => {
      const ctx = createMockContext('Setup');
      const svg = notchedRectangleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<polygon'); // Notched corners use polygon
      expect(svg).toContain('Setup');
    });
  });

  // ===================================================================
  // TAGGED RECTANGLE - Rectangle with corner tag
  // ===================================================================
  describe('taggedRectangle', () => {
    it('should have correct shape id', () => {
      expect(taggedRectangleShape.id).toBe('taggedRectangle');
    });

    it('should calculate bounds with label', () => {
      const ctx = createMockContext('Tagged Item');
      const bounds = taggedRectangleShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('Test');
      const anchors = taggedRectangleShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render valid SVG with corner tag', () => {
      const ctx = createMockContext('Reference');
      const svg = taggedRectangleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('<polygon'); // Corner tag uses polygon
      expect(svg).toContain('Reference');
    });
  });

  // ===================================================================
  // CROSS-SHAPE CONSISTENCY TESTS
  // ===================================================================
  describe('Cross-shape consistency', () => {
    const allShapes = [
      { shape: dividedRectangleShape, name: 'dividedRectangle' },
      { shape: framedRectangleShape, name: 'framedRectangle' },
      { shape: linedRectangleShape, name: 'linedRectangle' },
      { shape: multiRectangleShape, name: 'multiRectangle' },
      { shape: notchedPentagonShape, name: 'notchedPentagon' },
      { shape: notchedRectangleShape, name: 'notchedRectangle' },
      { shape: taggedRectangleShape, name: 'taggedRectangle' },
    ];

    it('all shapes should have unique IDs', () => {
      const ids = allShapes.map((s) => s.shape.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('all shapes should render without errors', () => {
      const ctx = createMockContext('Test Label');
      allShapes.forEach(({ shape, name }) => {
        expect(() => {
          shape.render(ctx, { x: 0, y: 0 });
        }).not.toThrow();
      });
    });

    it('all shapes should have positive bounds', () => {
      const ctx = createMockContext('Test');
      allShapes.forEach(({ shape, name }) => {
        const bounds = shape.bounds(ctx);
        expect(bounds.width).toBeGreaterThan(0);
        expect(bounds.height).toBeGreaterThan(0);
      });
    });

    it('all shapes should have at least 4 anchors', () => {
      const ctx = createMockContext('Test');
      allShapes.forEach(({ shape, name }) => {
        const anchors = shape.anchors(ctx);
        expect(anchors.length).toBeGreaterThanOrEqual(4);
      });
    });

    it('all shapes should produce valid SVG', () => {
      const ctx = createMockContext('Test');
      allShapes.forEach(({ shape, name }) => {
        const svg = shape.render(ctx, { x: 0, y: 0 });
        expect(svg).toBeTruthy();
        expect(typeof svg).toBe('string');
        expect(svg.length).toBeGreaterThan(0);
      });
    });
  });
});
