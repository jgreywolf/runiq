import { describe, it, expect } from 'vitest';
import { barChartHorizontal } from '../shapes/charts/bar-chart-horizontal.js';
import type { ShapeRenderContext, NodeAst } from '../types.js';

// Helper to create render context
function createContext(data: any, style?: any): ShapeRenderContext {
  const node: NodeAst = {
    id: 'test',
    shape: 'bar-chart-horizontal',
    data,
  };
  return {
    node,
    style: style || {},
    measureText: () => ({ width: 50, height: 12 }),
  };
}

describe('Bar Chart Horizontal Shape', () => {
  describe('Shape Properties', () => {
    it('should have correct shape ID', () => {
      expect(barChartHorizontal.id).toBe('bar-chart-horizontal');
    });

    it('should calculate bounds based on number of bars', () => {
      const ctx = createContext({ values: [30, 45, 25, 60] });
      const bounds = barChartHorizontal.bounds(ctx);
      
      // Height: 4 bars * (40 height + 15 spacing) + 15 spacing = 235
      expect(bounds.height).toBe(235);
      expect(bounds.width).toBe(400); // default width
    });

    it('should handle empty data with minimum size', () => {
      const ctx = createContext({ values: [] });
      const bounds = barChartHorizontal.bounds(ctx);
      expect(bounds.width).toBe(400);
      expect(bounds.height).toBe(200); // minimum height
    });
  });

  describe('Anchor Points', () => {
    it('should define 4 anchor points (n, e, s, w)', () => {
      const ctx = createContext({ values: [30, 45, 25] });
      const anchors = barChartHorizontal.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      
      const bounds = barChartHorizontal.bounds(ctx);
      expect(anchors[0]).toEqual({ x: bounds.width / 2, y: 0, name: 'n' }); // north
      expect(anchors[1]).toEqual({ x: bounds.width, y: bounds.height / 2, name: 'e' }); // east
      expect(anchors[2]).toEqual({ x: bounds.width / 2, y: bounds.height, name: 's' }); // south
      expect(anchors[3]).toEqual({ x: 0, y: bounds.height / 2, name: 'w' }); // west
    });
  });

  describe('Data Normalization', () => {
    it('should handle simple numeric array', () => {
      const ctx = createContext({ values: [30, 45, 25] });
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('rect'); // bars rendered
    });

    it('should handle labeled data', () => {
      const ctx = createContext({
        values: [
          { label: 'Product A', value: 100 },
          { label: 'Product B', value: 150 },
        ],
      });
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('Product A');
      expect(svg).toContain('Product B');
    });

    it('should filter out negative and zero values', () => {
      const ctx = createContext({ values: [30, -10, 0, 45, 25] });
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      
      // Should only render 3 bars (30, 45, 25)
      const rectCount = (svg.match(/<rect/g) || []).length;
      expect(rectCount).toBe(3); // exactly 3 bars
    });
  });

  describe('Bar Rendering', () => {
    it('should scale bar widths proportionally to max value', () => {
      const ctx = createContext({ values: [50, 100, 25] });
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      
      // Should contain bar elements
      expect(svg).toContain('<rect');
      expect(svg).toContain('width=');
    });

    it('should render bars with correct spacing', () => {
      const ctx = createContext({ values: [30, 45, 25] });
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      
      // Check that bars are positioned with spacing
      expect(svg).toContain('y="15"'); // first bar at y=15 (spacing)
      expect(svg).toContain('y="70"'); // second bar at y=70 (15 + 40 + 15)
    });

    it('should use color palette for bars', () => {
      const ctx = createContext({ values: [30, 45, 25] });
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      
      // Check that colors from palette are used
      expect(svg).toContain('fill="#4299e1"'); // first color (blue)
      expect(svg).toContain('fill="#48bb78"'); // second color (green)
      expect(svg).toContain('fill="#ed8936"'); // third color (orange)
    });

    it('should render axis and labels', () => {
      const ctx = createContext({
        values: [
          { label: 'Category A', value: 30 },
          { label: 'Category B', value: 45 },
        ],
      });
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      
      // Check for axis line
      expect(svg).toContain('<line'); // y-axis
      
      // Check for labels
      expect(svg).toContain('<text');
      expect(svg).toContain('Category A');
      expect(svg).toContain('Category B');
    });

    it('should handle single bar', () => {
      const ctx = createContext({ values: [100] });
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
      expect(svg).toContain('Bar 1'); // default label
    });

    it('should render empty state for no data', () => {
      const ctx = createContext({ values: [] });
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('No data');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing data property', () => {
      const ctx = createContext(undefined);
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('No data');
    });

    it('should handle large number of bars', () => {
      const values = Array(20).fill(50);
      const ctx = createContext({ values });
      const bounds = barChartHorizontal.bounds(ctx);
      expect(bounds.height).toBe(20 * 55 + 15); // 20 bars * (40 + 15) + 15
      
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
    });

    it('should handle very large values', () => {
      const ctx = createContext({ values: [1000000, 2000000, 1500000] });
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
      // Should scale proportionally regardless of absolute values
    });

    it('should handle decimal values', () => {
      const ctx = createContext({ values: [10.5, 20.75, 15.25] });
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
    });
  });

  describe('Style Integration', () => {
    it('should respect custom stroke from style', () => {
      const ctx = createContext({ values: [30, 45] }, { stroke: '#000', strokeWidth: 3 });
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('stroke="#000"');
      expect(svg).toContain('stroke-width="3"');
    });
  });

  describe('Grouped Bars', () => {
    it('should render grouped bars with multiple series', () => {
      const ctx = createContext({
        values: [
          { label: 'Q1', values: [30, 45, 25] },
          { label: 'Q2', values: [35, 50, 30] },
        ],
      });
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      
      // Should render 6 bars total (2 groups * 3 series)
      const rectCount = (svg.match(/<rect/g) || []).length;
      expect(rectCount).toBe(6);
    });

    it('should calculate bounds for grouped bars', () => {
      const ctx = createContext({
        values: [
          { label: 'Q1', values: [30, 45, 25] },
          { label: 'Q2', values: [35, 50, 30] },
        ],
      });
      const bounds = barChartHorizontal.bounds(ctx);
      
      // Height should accommodate 2 groups
      expect(bounds.height).toBeGreaterThan(100);
    });

    it('should use different colors for each series', () => {
      const ctx = createContext({
        values: [
          { label: 'Q1', values: [30, 45, 25] },
        ],
      });
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      
      // Should have 3 different colors
      expect(svg).toContain('#4299e1'); // blue (series 1)
      expect(svg).toContain('#48bb78'); // green (series 2)
      expect(svg).toContain('#ed8936'); // orange (series 3)
    });

    it('should render group labels on the left', () => {
      const ctx = createContext({
        values: [
          { label: 'Q1', values: [30, 45] },
          { label: 'Q2', values: [35, 50] },
        ],
      });
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      
      expect(svg).toContain('Q1');
      expect(svg).toContain('Q2');
    });

    it('should handle groups with different number of series', () => {
      const ctx = createContext({
        values: [
          { label: 'Q1', values: [30, 45] },
          { label: 'Q2', values: [35, 50, 25] },
        ],
      });
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      
      const rectCount = (svg.match(/<rect/g) || []).length;
      expect(rectCount).toBe(5);
    });

    it('should scale all bars to same max value', () => {
      const ctx = createContext({
        values: [
          { label: 'Q1', values: [30, 100] },
          { label: 'Q2', values: [50, 60] },
        ],
      });
      const svg = barChartHorizontal.render(ctx, { x: 0, y: 0 });
      
      expect(svg).toContain('<rect');
      expect(svg).toContain('width=');
    });

    it('should detect grouped format vs simple format', () => {
      const simpleCtx = createContext({ values: [30, 45, 25] });
      const simpleSvg = barChartHorizontal.render(simpleCtx, { x: 0, y: 0 });
      
      const groupedCtx = createContext({
        values: [{ label: 'Q1', values: [30, 45] }],
      });
      const groupedSvg = barChartHorizontal.render(groupedCtx, { x: 0, y: 0 });
      
      expect(simpleSvg).toContain('<rect');
      expect(groupedSvg).toContain('<rect');
      expect(simpleSvg).not.toContain('Q1');
      expect(groupedSvg).toContain('Q1');
    });
  });
});
