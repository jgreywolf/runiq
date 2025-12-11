import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import {
  multiRectangleShape,
  taggedRectangleShape,
  linedRectangleShape,
  dividedRectangleShape,
  notchedRectangleShape,
} from '../index.js';

// Mock context helper
function createMockContext(label: string): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'rect',
      label,
    },
    style: {
      fill: '#f0f0f0',
      stroke: '#333',
      strokeWidth: 1,
      font: 'sans-serif',
      fontSize: 14,
      padding: 12,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Process Shapes (TDD)', () => {
  describe('Multi Rectangle (Stacked)', () => {
    it('should have id multi-rect', () => {
      expect(multiRectangleShape.id).toBe('multiRectangle');
    });

    it('should calculate bounds with offset for stacked effect', () => {
      const ctx = createMockContext('Loop');
      const bounds = multiRectangleShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(32 + 24); // Base + offsets
      expect(bounds.height).toBeGreaterThan(16 + 24); // Base + offsets
    });

    it('should provide 4 anchor points on front rectangle', () => {
      const ctx = createMockContext('Repeat');
      const anchors = multiRectangleShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render multiple offset rectangles', () => {
      const ctx = createMockContext('Stack');
      const svg = multiRectangleShape.render(ctx, { x: 0, y: 0 });

      expect(svg.match(/<rect/g)?.length).toBeGreaterThanOrEqual(2);
    });

    it('should show depth with 2-3 rectangles', () => {
      const ctx = createMockContext('Multi');
      const svg = multiRectangleShape.render(ctx, { x: 0, y: 0 });

      // Should have multiple rectangles stacked
      const rectCount = (svg.match(/<rect/g) || []).length;
      expect(rectCount).toBeGreaterThanOrEqual(2);
      expect(rectCount).toBeLessThanOrEqual(3);
    });
  });

  describe('Tagged Rectangle', () => {
    it('should have id tag-rect', () => {
      expect(taggedRectangleShape.id).toBe('taggedRectangle');
    });

    it('should calculate standard bounds', () => {
      const ctx = createMockContext('Tagged');
      const bounds = taggedRectangleShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Tag');
      const anchors = taggedRectangleShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render rectangle with corner tag', () => {
      const ctx = createMockContext('Flag');
      const svg = taggedRectangleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('<polygon'); // Corner tag
    });

    it('should have small triangular tag in corner', () => {
      const ctx = createMockContext('Mark');
      const svg = taggedRectangleShape.render(ctx, { x: 10, y: 10 });

      expect(svg).toContain('<polygon');
      expect(svg).toContain('points='); // Triangle points
    });
  });

  describe('Lined Rectangle', () => {
    it('should have id lined-rect', () => {
      expect(linedRectangleShape.id).toBe('linedRectangle');
    });

    it('should calculate bounds with minimum height', () => {
      const ctx = createMockContext('Phase');
      const bounds = linedRectangleShape.bounds(ctx);

      expect(bounds.height).toBeGreaterThanOrEqual(60);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Steps');
      const anchors = linedRectangleShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render rectangle with horizontal lines', () => {
      const ctx = createMockContext('Segment');
      const svg = linedRectangleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('<line');
    });

    it('should have 2 horizontal dividing lines', () => {
      const ctx = createMockContext('Multi');
      const svg = linedRectangleShape.render(ctx, { x: 0, y: 0 });

      const lineCount = (svg.match(/<line/g) || []).length;
      expect(lineCount).toBe(2);
    });
  });

  describe('Divided Rectangle', () => {
    it('should have id div-rect', () => {
      expect(dividedRectangleShape.id).toBe('dividedRectangle');
    });

    it('should calculate bounds with minimum width', () => {
      const ctx = createMockContext('Split');
      const bounds = dividedRectangleShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(80);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Dual');
      const anchors = dividedRectangleShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render rectangle divided into sections', () => {
      const ctx = createMockContext('Section');
      const svg = dividedRectangleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('<line'); // Dividing line
    });

    it('should have vertical dividing line', () => {
      const ctx = createMockContext('Divide');
      const svg = dividedRectangleShape.render(ctx, { x: 10, y: 10 });

      expect(svg).toContain('<line');
      expect(svg).toContain('x1='); // Vertical line
      expect(svg).toContain('x2=');
    });
  });

  describe('Notched Rectangle', () => {
    it('should have id notch-rect', () => {
      expect(notchedRectangleShape.id).toBe('notchedRectangle');
    });

    it('should calculate standard bounds', () => {
      const ctx = createMockContext('Notched');
      const bounds = notchedRectangleShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Cut');
      const anchors = notchedRectangleShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors[0].y).toBe(8); // Top anchor below notch
    });

    it('should render polygon with corner notches', () => {
      const ctx = createMockContext('Interface');
      const svg = notchedRectangleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<polygon');
      expect(svg).toContain('points=');
    });

    it('should have cut corners at top', () => {
      const ctx = createMockContext('Corner');
      const svg = notchedRectangleShape.render(ctx, { x: 0, y: 0 });

      const pointsMatch = svg.match(/points="([^"]+)"/);
      expect(pointsMatch).toBeTruthy();
      if (pointsMatch) {
        const coords = pointsMatch[1].split(' ');
        expect(coords).toHaveLength(6); // 6 points for notched rectangle
      }
    });
  });
});
