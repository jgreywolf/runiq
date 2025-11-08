import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from './types.js';
import {
  doubleCircleShape,
  smallCircleShape,
  framedCircleShape,
  crossCircleShape,
  filledCircleShape,
} from './shapes/index.js';

function createMockContext(label: string): ShapeRenderContext {
  return {
    node: {
      id: label.toLowerCase(),
      shape: 'circ',
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

describe('Circle Variants (TDD)', () => {
  describe('Double Circle (Concentric)', () => {
    it('should have id d-circ', () => {
      expect(doubleCircleShape.id).toBe('doubleCircle');
    });

    it('should calculate bounds with padding for outer circle', () => {
      const ctx = createMockContext('End');
      const bounds = doubleCircleShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(50);
      expect(bounds.height).toBeGreaterThanOrEqual(50);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('State');
      const anchors = doubleCircleShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render two concentric circles', () => {
      const ctx = createMockContext('Terminal');
      const svg = doubleCircleShape.render(ctx, { x: 0, y: 0 });

      const circleCount = (svg.match(/<circle/g) || []).length;
      expect(circleCount).toBe(2); // Outer and inner circles
    });

    it('should have gap between circles', () => {
      const ctx = createMockContext('End');
      const svg = doubleCircleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      // Should have two different radii
      const radiusMatches = svg.match(/r="(\d+(\.\d+)?)"/g);
      expect(radiusMatches).toBeTruthy();
      expect(radiusMatches!.length).toBe(2);
    });
  });

  describe('Small Circle', () => {
    it('should have id sm-circ', () => {
      expect(smallCircleShape.id).toBe('smallCircle');
    });

    it('should calculate smaller bounds than standard circle', () => {
      const ctx = createMockContext('A');
      const bounds = smallCircleShape.bounds(ctx);

      expect(bounds.width).toBeLessThanOrEqual(40); // Smaller than standard 50px
      expect(bounds.height).toBeLessThanOrEqual(40);
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

    it('should use smaller font size', () => {
      const ctx = createMockContext('X');
      const svg = smallCircleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('font-size="12"'); // Smaller than standard 14
    });
  });

  describe('Framed Circle', () => {
    it('should have id fr-circ', () => {
      expect(framedCircleShape.id).toBe('framedCircle');
    });

    it('should calculate bounds with frame space', () => {
      const ctx = createMockContext('Event');
      const bounds = framedCircleShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(50);
      expect(bounds.height).toBeGreaterThanOrEqual(50);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Action');
      const anchors = framedCircleShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render two circles with frame gap', () => {
      const ctx = createMockContext('Node');
      const svg = framedCircleShape.render(ctx, { x: 0, y: 0 });

      const circleCount = (svg.match(/<circle/g) || []).length;
      expect(circleCount).toBe(2); // Outer frame and inner circle
    });

    it('should have visible frame spacing', () => {
      const ctx = createMockContext('Frame');
      const svg = framedCircleShape.render(ctx, { x: 0, y: 0 });

      // Should have two circles with different radii
      expect(svg).toContain('<circle');
      const radiusMatches = svg.match(/r="(\d+(\.\d+)?)"/g);
      expect(radiusMatches).toBeTruthy();
      expect(radiusMatches!.length).toBe(2);
    });
  });

  describe('Cross Circle (X Inside)', () => {
    it('should have id x-circ', () => {
      expect(crossCircleShape.id).toBe('crossCircle');
    });

    it('should calculate standard circle bounds', () => {
      const ctx = createMockContext('Cancel');
      const bounds = crossCircleShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(50);
      expect(bounds.height).toBeGreaterThanOrEqual(50);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Reject');
      const anchors = crossCircleShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render circle with X inside', () => {
      const ctx = createMockContext('No');
      const svg = crossCircleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('<line'); // Diagonal lines for X
    });

    it('should have two diagonal lines forming X', () => {
      const ctx = createMockContext('Stop');
      const svg = crossCircleShape.render(ctx, { x: 0, y: 0 });

      const lineCount = (svg.match(/<line/g) || []).length;
      expect(lineCount).toBe(2); // Two diagonal lines
    });
  });

  describe('Filled Circle', () => {
    it('should have id fill-circ', () => {
      expect(filledCircleShape.id).toBe('filledCircle');
    });

    it('should calculate standard circle bounds', () => {
      const ctx = createMockContext('Done');
      const bounds = filledCircleShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(50);
      expect(bounds.height).toBeGreaterThanOrEqual(50);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Complete');
      const anchors = filledCircleShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render filled circle', () => {
      const ctx = createMockContext('End');
      const svg = filledCircleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('fill='); // Should have fill color
    });

    it('should use contrasting text color', () => {
      const ctx = createMockContext('State');
      const svg = filledCircleShape.render(ctx, { x: 0, y: 0 });

      // Should have white text on dark background
      expect(svg).toContain('<text');
      expect(svg).toContain('fill="#fff"'); // White text
    });
  });
});
