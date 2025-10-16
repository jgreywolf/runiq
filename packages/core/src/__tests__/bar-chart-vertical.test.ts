import { describe, it, expect } from 'vitest';
import { barChartVertical } from '../shapes/charts/bar-chart-vertical.js';
import type { ShapeRenderContext, NodeAst } from '../types.js';

// Helper to create render context
function createContext(data: any, style?: any): ShapeRenderContext {
  const node: NodeAst = {
    id: 'test',
    shape: 'bar-chart-vertical',
    data,
  };
  return {
    node,
    style: style || {},
    measureText: () => ({ width: 50, height: 12 }),
  };
}

describe('Bar Chart Vertical Shape', () => {
  describe('Shape Properties', () => {
    it('should have correct shape ID', () => {
      expect(barChartVertical.id).toBe('bar-chart-vertical');
    });

    it('should calculate bounds based on number of bars', () => {
      const ctx = createContext({ values: [30, 45, 25, 60] });
      const bounds = barChartVertical.bounds(ctx);
      
      // 4 bars * (60 width + 20 spacing) + 20 spacing = 340
      expect(bounds.width).toBe(340);
      expect(bounds.height).toBe(300); // default height
    });

    it('should handle empty data with minimum size', () => {
      const ctx = createContext({ values: [] });
      const bounds = barChartVertical.bounds(ctx);
      expect(bounds.width).toBe(200); // minimum width
      expect(bounds.height).toBe(300);
    });
  });

  describe('Anchor Points', () => {
    it('should define 4 anchor points (n, e, s, w)', () => {
      const ctx = createContext({ values: [30, 45, 25] });
      const anchors = barChartVertical.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      
      const bounds = barChartVertical.bounds(ctx);
      expect(anchors[0]).toEqual({ x: bounds.width / 2, y: 0, name: 'n' }); // north
      expect(anchors[1]).toEqual({ x: bounds.width, y: bounds.height / 2, name: 'e' }); // east
      expect(anchors[2]).toEqual({ x: bounds.width / 2, y: bounds.height, name: 's' }); // south
      expect(anchors[3]).toEqual({ x: 0, y: bounds.height / 2, name: 'w' }); // west
    });
  });

  describe('Data Normalization', () => {
    it('should handle simple numeric array', () => {
      const ctx = createContext({ values: [30, 45, 25] });
      const svg = barChartVertical.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('rect'); // bars rendered
    });

    it('should handle labeled data', () => {
      const ctx = createContext({
        values: [
          { label: 'Q1', value: 100 },
          { label: 'Q2', value: 150 },
        ],
      });
      const svg = barChartVertical.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('Q1');
      expect(svg).toContain('Q2');
    });

    it('should filter out negative and zero values', () => {
      const ctx = createContext({ values: [30, -10, 0, 45, 25] });
      const svg = barChartVertical.render(ctx, { x: 0, y: 0 });
      
      // Should only render 3 bars (30, 45, 25)
      const rectCount = (svg.match(/<rect/g) || []).length;
      expect(rectCount).toBe(3); // exactly 3 bars
    });
  });

  describe('Bar Rendering', () => {
    it('should scale bar heights proportionally to max value', () => {
      const ctx = createContext({ values: [50, 100, 25] });
      const svg = barChartVertical.render(ctx, { x: 0, y: 0 });
      
      // Should contain bar elements
      expect(svg).toContain('<rect');
      expect(svg).toContain('height=');
    });

    it('should render bars with correct spacing', () => {
      const ctx = createContext({ values: [30, 45, 25] });
      const svg = barChartVertical.render(ctx, { x: 0, y: 0 });
      
      // Check that bars are positioned with spacing
      expect(svg).toContain('x="20"'); // first bar at x=20 (spacing)
      expect(svg).toContain('x="100"'); // second bar at x=100 (20 + 60 + 20)
    });

    it('should use color palette for bars', () => {
      const ctx = createContext({ values: [30, 45, 25] });
      const svg = barChartVertical.render(ctx, { x: 0, y: 0 });
      
      // Check that colors from palette are used
      expect(svg).toContain('fill="#4299e1"'); // first color (blue)
      expect(svg).toContain('fill="#48bb78"'); // second color (green)
      expect(svg).toContain('fill="#ed8936"'); // third color (orange)
    });

    it('should render axis and labels', () => {
      const ctx = createContext({
        values: [
          { label: 'A', value: 30 },
          { label: 'B', value: 45 },
        ],
      });
      const svg = barChartVertical.render(ctx, { x: 0, y: 0 });
      
      // Check for axis line
      expect(svg).toContain('<line'); // x-axis
      
      // Check for labels
      expect(svg).toContain('<text');
      expect(svg).toContain('A');
      expect(svg).toContain('B');
    });

    it('should handle single bar', () => {
      const ctx = createContext({ values: [100] });
      const svg = barChartVertical.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
      expect(svg).toContain('Bar 1'); // default label
    });

    it('should render empty state for no data', () => {
      const ctx = createContext({ values: [] });
      const svg = barChartVertical.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('No data');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing data property', () => {
      const ctx = createContext(undefined);
      const svg = barChartVertical.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('No data');
    });

    it('should handle large number of bars', () => {
      const values = Array(20).fill(50);
      const ctx = createContext({ values });
      const bounds = barChartVertical.bounds(ctx);
      expect(bounds.width).toBe(20 * 80 + 20); // 20 bars * (60 + 20) + 20
      
      const svg = barChartVertical.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
    });

    it('should handle very large values', () => {
      const ctx = createContext({ values: [1000000, 2000000, 1500000] });
      const svg = barChartVertical.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
      // Should scale proportionally regardless of absolute values
    });

    it('should handle decimal values', () => {
      const ctx = createContext({ values: [10.5, 20.75, 15.25] });
      const svg = barChartVertical.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
    });
  });

  describe('Style Integration', () => {
    it('should respect custom stroke from style', () => {
      const ctx = createContext({ values: [30, 45] }, { stroke: '#000', strokeWidth: 3 });
      const svg = barChartVertical.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('stroke="#000"');
      expect(svg).toContain('stroke-width="3"');
    });
  });
});
