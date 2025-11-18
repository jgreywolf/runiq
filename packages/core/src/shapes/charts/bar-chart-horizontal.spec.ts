import { describe, it, expect } from 'vitest';
import { barChart } from './barChart.js';
import type { ShapeRenderContext, NodeAst } from '../../types.js';

// Helper to create render context for horizontal bar chart
function createContext(data: any, style?: any): ShapeRenderContext {
  const node: NodeAst = {
    id: 'test',
    shape: 'bar-chart',
    data: { ...data, flipAxes: true }, // flipAxes: true for horizontal
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
      expect(barChart.id).toBe('barChart');
    });

    it('should calculate bounds based on number of bars', () => {
      const ctx = createContext({ values: [30, 45, 25, 60] });
      const bounds = barChart.bounds(ctx);

      // Height: 4 bars * (40 height + 15 spacing) + 15 spacing = 235
      expect(bounds.height).toBe(235);
      expect(bounds.width).toBe(400); // default width
    });

    it('should handle empty data with minimum size', () => {
      const ctx = createContext({ values: [] });
      const bounds = barChart.bounds(ctx);
      expect(bounds.width).toBe(400);
      expect(bounds.height).toBe(200); // minimum height
    });
  });

  describe('Anchor Points', () => {
    it('should define 4 anchor points (n, e, s, w)', () => {
      const ctx = createContext({ values: [30, 45, 25] });
      const anchors = barChart.anchors!(ctx);
      expect(anchors).toHaveLength(4);

      const bounds = barChart.bounds(ctx);
      expect(anchors[0]).toEqual({ x: bounds.width / 2, y: 0, name: 'n' }); // north
      expect(anchors[1]).toEqual({
        x: bounds.width,
        y: bounds.height / 2,
        name: 'e',
      }); // east
      expect(anchors[2]).toEqual({
        x: bounds.width / 2,
        y: bounds.height,
        name: 's',
      }); // south
      expect(anchors[3]).toEqual({ x: 0, y: bounds.height / 2, name: 'w' }); // west
    });
  });

  describe('Data Normalization', () => {
    it('should handle simple numeric array', () => {
      const ctx = createContext({ values: [30, 45, 25] });
      const svg = barChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('rect'); // bars rendered
    });

    it('should handle labeled data', () => {
      const ctx = createContext({
        values: [
          { label: 'Product A', value: 100 },
          { label: 'Product B', value: 150 },
        ],
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('Product A');
      expect(svg).toContain('Product B');
    });

    it('should filter out negative and zero values', () => {
      const ctx = createContext({ values: [30, -10, 0, 45, 25] });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      // Should only render 3 bars (30, 45, 25)
      const rectCount = (svg.match(/<rect/g) || []).length;
      expect(rectCount).toBe(3); // exactly 3 bars
    });
  });

  describe('Bar Rendering', () => {
    it('should scale bar widths proportionally to max value', () => {
      const ctx = createContext({ values: [50, 100, 25] });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      // Should contain bar elements
      expect(svg).toContain('<rect');
      expect(svg).toContain('width=');
    });

    it('should render bars with correct spacing', () => {
      const ctx = createContext({ values: [30, 45, 25] });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      // Check that bars are positioned with spacing
      expect(svg).toContain('y="15"'); // first bar at y=15 (spacing)
      expect(svg).toContain('y="70"'); // second bar at y=70 (15 + 40 + 15)
    });

    it('should use color palette for bars', () => {
      const ctx = createContext({ values: [30, 45, 25] });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

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
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      // Check for axis line
      expect(svg).toContain('<line'); // y-axis

      // Check for labels
      expect(svg).toContain('<text');
      expect(svg).toContain('Category A');
      expect(svg).toContain('Category B');
    });

    it('should handle single bar', () => {
      const ctx = createContext({ values: [100] });
      const svg = barChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
      expect(svg).toContain('Bar 1'); // default label
    });

    it('should render empty state for no data', () => {
      const ctx = createContext({ values: [] });
      const svg = barChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('No data');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing data property', () => {
      const ctx = createContext(undefined);
      const svg = barChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('No data');
    });

    it('should handle large number of bars', () => {
      const values = Array(20).fill(50);
      const ctx = createContext({ values });
      const bounds = barChart.bounds(ctx);
      expect(bounds.height).toBe(20 * 55 + 15); // 20 bars * (40 + 15) + 15

      const svg = barChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
    });

    it('should handle very large values', () => {
      const ctx = createContext({ values: [1000000, 2000000, 1500000] });
      const svg = barChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
      // Should scale proportionally regardless of absolute values
    });

    it('should handle decimal values', () => {
      const ctx = createContext({ values: [10.5, 20.75, 15.25] });
      const svg = barChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
    });
  });

  describe('Style Integration', () => {
    it('should respect custom stroke from style', () => {
      const ctx = createContext(
        { values: [30, 45] },
        { stroke: '#000', strokeWidth: 3 }
      );
      const svg = barChart.render(ctx, { x: 0, y: 0 });
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
      const svg = barChart.render(ctx, { x: 0, y: 0 });

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
      const bounds = barChart.bounds(ctx);

      // Height should accommodate 2 groups
      expect(bounds.height).toBeGreaterThan(100);
    });

    it('should use different colors for each series', () => {
      const ctx = createContext({
        values: [{ label: 'Q1', values: [30, 45, 25] }],
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

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
      const svg = barChart.render(ctx, { x: 0, y: 0 });

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
      const svg = barChart.render(ctx, { x: 0, y: 0 });

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
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('width=');
    });

    it('should detect grouped format vs simple format', () => {
      const simpleCtx = createContext({ values: [30, 45, 25] });
      const simpleSvg = barChart.render(simpleCtx, { x: 0, y: 0 });

      const groupedCtx = createContext({
        values: [{ label: 'Q1', values: [30, 45] }],
      });
      const groupedSvg = barChart.render(groupedCtx, { x: 0, y: 0 });

      expect(simpleSvg).toContain('<rect');
      expect(groupedSvg).toContain('<rect');
      expect(simpleSvg).not.toContain('Q1');
      expect(groupedSvg).toContain('Q1');
    });
  });

  describe('Stacked Bars', () => {
    it('should render stacked bars with multiple series', () => {
      const ctx = createContext({
        stacked: true,
        values: [
          { label: 'Q1', values: [30, 20, 15] }, // total 65
          { label: 'Q2', values: [40, 25, 10] }, // total 75
        ],
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      // Should render rectangles for each segment
      const rectCount = (svg.match(/<rect/g) || []).length;
      expect(rectCount).toBe(6); // 2 groups * 3 series = 6 segments

      // Should contain group labels
      expect(svg).toContain('Q1');
      expect(svg).toContain('Q2');
    });

    it('should calculate bounds for stacked bars', () => {
      const ctx = createContext({
        stacked: true,
        values: [
          { label: 'Q1', values: [30, 20, 15] },
          { label: 'Q2', values: [40, 25, 10] },
          { label: 'Q3', values: [35, 30, 20] },
        ],
      });
      const bounds = barChart.bounds(ctx);

      expect(bounds.width).toBe(400); // default width
      // 3 groups * (40 height + 15 spacing) + 15 spacing + top/bottom margins = 225
      expect(bounds.height).toBe(225);
    });

    it('should use different colors for each series in stack', () => {
      const ctx = createContext({
        stacked: true,
        values: [{ label: 'Q1', values: [30, 20, 15] }],
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      // Should use default color palette
      expect(svg).toContain('fill="#4299e1"'); // first series (blue)
      expect(svg).toContain('fill="#48bb78"'); // second series (green)
      expect(svg).toContain('fill="#ed8936"'); // third series (orange)
    });

    it('should stack bars horizontally with cumulative widths', () => {
      const ctx = createContext({
        stacked: true,
        values: [
          { label: 'Q1', values: [30, 20, 10] }, // total 60
        ],
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      // Parse SVG to check x positions
      // Left segment (30) should start at left
      // Middle segment (20) should start after left
      // Right segment (10) should start at right
      expect(svg).toContain('<rect'); // has rectangles

      // Segments should be stacked (not overlapping)
      const rectMatches = svg.match(/<rect[^>]*>/g) || [];
      expect(rectMatches.length).toBe(3);
    });

    it('should render group labels on the left', () => {
      const ctx = createContext({
        stacked: true,
        values: [
          { label: 'Q1', values: [30, 20] },
          { label: 'Q2', values: [40, 25] },
        ],
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      // Should have labels at left of each stack
      expect(svg).toContain('Q1');
      expect(svg).toContain('Q2');
      expect(svg).toContain('text-anchor="end"'); // left-aligned
    });

    it('should handle groups with different number of series', () => {
      const ctx = createContext({
        stacked: true,
        values: [
          { label: 'Q1', values: [30, 20, 15] }, // 3 series
          { label: 'Q2', values: [40, 25] }, // 2 series
        ],
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      // Should render all segments
      const rectCount = (svg.match(/<rect/g) || []).length;
      expect(rectCount).toBe(5); // 3 + 2 = 5 segments
    });

    it('should scale stacks to max cumulative total', () => {
      const ctx = createContext({
        stacked: true,
        values: [
          { label: 'Q1', values: [30, 20, 10] }, // total 60
          { label: 'Q2', values: [40, 30, 20] }, // total 90 (max)
        ],
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      // Q2 stack should reach full width
      // Q1 stack should be proportionally shorter
      expect(svg).toContain('<rect'); // has bars

      // Both stacks should be present
      expect(svg).toContain('Q1');
      expect(svg).toContain('Q2');
    });

    it('should handle single group with stacked bars', () => {
      const ctx = createContext({
        stacked: true,
        values: [{ label: 'Total', values: [40, 30, 20, 10] }],
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      const rectCount = (svg.match(/<rect/g) || []).length;
      expect(rectCount).toBe(4); // 4 segments in stack
      expect(svg).toContain('Total');
    });

    it('should handle empty stacked data', () => {
      const ctx = createContext({
        stacked: true,
        values: [],
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('No data available');
    });

    it('should detect stacked format via stacked property', () => {
      const stackedCtx = createContext({
        stacked: true,
        values: [{ label: 'Q1', values: [30, 20] }],
      });
      const groupedCtx = createContext({
        values: [{ label: 'Q1', values: [30, 20] }],
      });

      const stackedSvg = barChart.render(stackedCtx, { x: 0, y: 0 });
      const groupedSvg = barChart.render(groupedCtx, { x: 0, y: 0 });

      // Both should render but with different layouts
      expect(stackedSvg).toContain('<rect');
      expect(groupedSvg).toContain('<rect');

      // Stacked should have horizontal segments
      // Grouped should have vertical segments
    });
  });

  describe('Custom Colors', () => {
    it('should use custom colors in simple format', () => {
      const ctx = createContext({
        values: [30, 45, 25],
        colors: ['#ff0000', '#00ff00', '#0000ff'],
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      // Should use custom colors
      expect(svg).toContain('fill="#ff0000"');
      expect(svg).toContain('fill="#00ff00"');
      expect(svg).toContain('fill="#0000ff"');
    });

    it('should use custom colors in grouped format', () => {
      const ctx = createContext({
        values: [{ label: 'Q1', values: [30, 20] }],
        colors: ['#ff0000', '#00ff00'],
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      // Should use custom colors for series
      expect(svg).toContain('fill="#ff0000"');
      expect(svg).toContain('fill="#00ff00"');
    });

    it('should use custom colors in stacked format', () => {
      const ctx = createContext({
        stacked: true,
        values: [{ label: 'Q1', values: [30, 20, 15] }],
        colors: ['#ff0000', '#00ff00', '#0000ff'],
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      // Should use custom colors for segments
      expect(svg).toContain('fill="#ff0000"');
      expect(svg).toContain('fill="#00ff00"');
      expect(svg).toContain('fill="#0000ff"');
    });

    it('should fall back to default palette if no custom colors', () => {
      const ctx = createContext({
        values: [30, 45, 25],
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      // Should use default palette
      expect(svg).toContain('fill="#4299e1"');
    });
  });

  describe('Title and Axis Labels', () => {
    it('should render title when provided', () => {
      const ctx = createContext({
        values: [30, 45, 25],
        title: 'Sales by Product',
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Sales by Product');
    });

    it('should render xLabel at bottom', () => {
      const ctx = createContext({
        values: [30, 45, 25],
        xLabel: 'Revenue ($K)',
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Revenue ($K)');
    });

    it('should render yLabel on left side', () => {
      const ctx = createContext({
        values: [30, 45, 25],
        yLabel: 'Products',
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Products');
    });

    it('should render all labels together', () => {
      const ctx = createContext({
        values: [30, 45, 25],
        title: 'Product Sales',
        xLabel: 'Revenue ($K)',
        yLabel: 'Products',
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Product Sales');
      expect(svg).toContain('Revenue ($K)');
      expect(svg).toContain('Products');
    });

    it('should not render labels when not provided', () => {
      const ctx = createContext({
        values: [30, 45, 25],
      });
      const svg = barChart.render(ctx, { x: 0, y: 0 });

      // Should have bars and axis
      expect(svg).toContain('<rect');
      expect(svg).toContain('<line');
    });
  });
});
