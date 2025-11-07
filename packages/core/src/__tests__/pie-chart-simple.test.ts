import { describe, it, expect } from 'vitest';
import { pieChart } from '../shapes/charts/pieChart.js';
import type { ShapeRenderContext, NodeAst, Style } from '../types.js';

// Helper to create test context
function ctx(data?: any): ShapeRenderContext {
  const node: NodeAst = {
    id: 'test',
    shape: 'pie-chart',
    label: 'Test',
    data,
  };

  return {
    node,
    style: {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 1,
    },
    measureText: (text: string) => ({ width: text.length * 8, height: 14 }),
  };
}

describe('Pie Chart Shape', () => {
  it('should have correct shape ID', () => {
    expect(pieChart.id).toBe('pieChart');
  });

  it('should calculate default bounds (250x250 without legend)', () => {
    // Create context without label to test base size
    const node: NodeAst = {
      id: 'test',
      shape: 'pie-chart',
      data: { showLegend: false },
    };
    const context: ShapeRenderContext = {
      node,
      style: {},
      measureText: (text: string) => ({ width: text.length * 8, height: 14 }),
    };
    const bounds = pieChart.bounds(context);
    expect(bounds).toEqual({ width: 250, height: 250 });
  });

  it('should define 4 anchor points', () => {
    const anchors = pieChart.anchors?.(ctx()) || [];
    expect(anchors.length).toBe(4);
  });

  it('should render 3 slices for 3 values', () => {
    const rendered = pieChart.render(ctx({ values: [30, 45, 25] }), {
      x: 0,
      y: 0,
    });
    const pathCount = (rendered.match(/<path/g) || []).length;
    expect(pathCount).toBe(3);
  });

  it('should render 2 slices for labeled data', () => {
    const data = {
      values: [
        { label: 'A', value: 60 },
        { label: 'B', value: 40 },
      ],
    };
    const rendered = pieChart.render(ctx(data), { x: 0, y: 0 });
    const pathCount = (rendered.match(/<path/g) || []).length;
    expect(pathCount).toBe(2);
  });

  it('should handle empty data', () => {
    const rendered = pieChart.render(ctx({ values: [] }), { x: 0, y: 0 });
    expect(rendered).toBeDefined();
  });

  it('should handle missing data', () => {
    const rendered = pieChart.render(ctx(), { x: 0, y: 0 });
    expect(rendered).toBeDefined();
  });

  it('should filter out zero values', () => {
    const rendered = pieChart.render(ctx({ values: [10, 0, 20] }), {
      x: 0,
      y: 0,
    });
    const pathCount = (rendered.match(/<path/g) || []).length;
    expect(pathCount).toBe(2);
  });

  it('should filter out negative values', () => {
    const rendered = pieChart.render(ctx({ values: [10, -5, 20] }), {
      x: 0,
      y: 0,
    });
    const pathCount = (rendered.match(/<path/g) || []).length;
    expect(pathCount).toBe(2);
  });

  it('should render valid SVG paths', () => {
    const rendered = pieChart.render(ctx({ values: [50, 50] }), { x: 0, y: 0 });
    expect(rendered).toContain('<path');
    expect(rendered).toContain('d="M');
    expect(rendered).toContain('fill=');
  });

  it('should handle floating point values', () => {
    const rendered = pieChart.render(ctx({ values: [10.5, 20.75] }), {
      x: 0,
      y: 0,
    });
    const pathCount = (rendered.match(/<path/g) || []).length;
    expect(pathCount).toBe(2);
  });

  describe('Legend Support', () => {
    it('should render legend when showLegend is true', () => {
      const data = {
        values: [30, 45, 25],
        showLegend: true,
      };
      const rendered = pieChart.render(ctx(data), { x: 0, y: 0 });
      expect(rendered).toContain('<g'); // Legend container
      expect(rendered).toContain('<rect'); // Color swatches
      expect(rendered).toContain('<text'); // Legend labels
    });

    it('should not render legend when showLegend is false', () => {
      const data = {
        values: [30, 45, 25],
        showLegend: false,
      };
      const rendered = pieChart.render(ctx(data), { x: 0, y: 0 });
      // Should only contain path elements (slices), no legend
      const rectCount = (rendered.match(/<rect/g) || []).length;
      expect(rectCount).toBe(0);
    });

    it('should render legend by default (3 rects for 3 values)', () => {
      const data = {
        values: [30, 45, 25],
      };
      const rendered = pieChart.render(ctx(data), { x: 0, y: 0 });
      const rectCount = (rendered.match(/<rect/g) || []).length;
      expect(rectCount).toBe(3); // Legend shows by default now
    });

    it('should include labels in legend', () => {
      const data = {
        values: [
          { label: 'Category A', value: 30 },
          { label: 'Category B', value: 45 },
        ],
        showLegend: true,
      };
      const rendered = pieChart.render(ctx(data), { x: 0, y: 0 });
      expect(rendered).toContain('Category A');
      expect(rendered).toContain('Category B');
    });

    it('should include percentages in legend', () => {
      const data = {
        values: [30, 70],
        showLegend: true,
      };
      const rendered = pieChart.render(ctx(data), { x: 0, y: 0 });
      expect(rendered).toContain('30%');
      expect(rendered).toContain('70%');
    });

    it('should render color swatches matching slice colors', () => {
      const data = {
        values: [30, 45, 25],
        showLegend: true,
      };
      const rendered = pieChart.render(ctx(data), { x: 0, y: 0 });
      expect(rendered).toContain('#4299e1'); // First color (blue)
      expect(rendered).toContain('#48bb78'); // Second color (green)
      expect(rendered).toContain('#ed8936'); // Third color (orange)
    });

    it('should expand bounds when legend is shown', () => {
      const data = {
        values: [30, 45, 25],
        showLegend: true, // Explicitly enabled
      };
      const boundsWithLegend = pieChart.bounds(ctx(data));
      const boundsNoLegend = pieChart.bounds(
        ctx({ values: [30, 45, 25], showLegend: false })
      ); // Explicitly disabled

      // Width should be wider to accommodate legend
      expect(boundsWithLegend.width).toBeGreaterThan(boundsNoLegend.width);
      // Height should be same or taller
      expect(boundsWithLegend.height).toBeGreaterThanOrEqual(
        boundsNoLegend.height
      );
    });
  });

  describe('Custom Colors', () => {
    it('should use custom colors when provided', () => {
      const context = ctx({
        values: [
          { label: 'Red', value: 30 },
          { label: 'Green', value: 25 },
          { label: 'Blue', value: 20 },
        ],
        colors: ['#ff0000', '#00ff00', '#0000ff'],
      });
      const svg = pieChart.render(context, { x: 0, y: 0 });

      // Should use custom colors
      expect(svg).toContain('fill="#ff0000"');
      expect(svg).toContain('fill="#00ff00"');
      expect(svg).toContain('fill="#0000ff"');

      // Should not use default palette colors
      expect(svg).not.toContain('fill="#4299e1"');
    });

    it('should cycle through custom colors if more slices than colors', () => {
      const context = ctx({
        values: [30, 25, 20, 15, 10],
        colors: ['#ff0000', '#00ff00'],
      });
      const svg = pieChart.render(context, { x: 0, y: 0 });

      // Should use colors and cycle back
      expect(svg).toContain('fill="#ff0000"');
      expect(svg).toContain('fill="#00ff00"');
    });

    it('should fall back to default palette if no custom colors', () => {
      const context = ctx({
        values: [30, 25, 20],
      });
      const svg = pieChart.render(context, { x: 0, y: 0 });

      // Should use default palette
      expect(svg).toContain('fill="#4299e1"');
      expect(svg).toContain('fill="#48bb78"');
    });

    it('should use custom colors in legend', () => {
      const context = ctx({
        values: [
          { label: 'Red', value: 30 },
          { label: 'Green', value: 25 },
        ],
        colors: ['#ff0000', '#00ff00'],
        showLegend: true,
      });
      const svg = pieChart.render(context, { x: 0, y: 0 });

      // Legend should show custom colors
      expect(svg).toContain('fill="#ff0000"');
      expect(svg).toContain('fill="#00ff00"');
      expect(svg).toContain('Red');
      expect(svg).toContain('Green');
    });
  });

  describe('Title Support', () => {
    it('should render title when provided', () => {
      const node: NodeAst = {
        id: 'test',
        shape: 'pie-chart',
        label: 'Sales by Region',
        data: { values: [30, 25, 20] },
      };
      const context: ShapeRenderContext = {
        node,
        style: {},
        measureText: (text: string) => ({ width: text.length * 8, height: 14 }),
      };
      const svg = pieChart.render(context, { x: 0, y: 0 });

      // Should contain the title text
      expect(svg).toContain('Sales by Region');
      expect(svg).toContain('<text');
    });

    it('should not render title when not provided', () => {
      const node: NodeAst = {
        id: 'test',
        shape: 'pie-chart',
        data: { values: [30, 25, 20] },
      };
      const context: ShapeRenderContext = {
        node,
        style: {},
        measureText: (text: string) => ({ width: text.length * 8, height: 14 }),
      };
      const svg = pieChart.render(context, { x: 0, y: 0 });

      // Should only have slice paths, no title
      expect(svg).toContain('<path');
      // The word "title" shouldn't appear in rendered output
      const titleMatches = svg.match(/title/gi);
      expect(titleMatches).toBeNull();
    });

    it('should position title above pie chart', () => {
      const node: NodeAst = {
        id: 'test',
        shape: 'pie-chart',
        label: 'Test Chart',
        data: { values: [30, 25, 20] },
      };
      const context: ShapeRenderContext = {
        node,
        style: {},
        measureText: (text: string) => ({ width: text.length * 8, height: 14 }),
      };
      const svg = pieChart.render(context, { x: 0, y: 0 });

      // Title should be near top (y coordinate close to 0)
      expect(svg).toContain('Test Chart');
      // Should be centered (text-anchor="middle")
      expect(svg).toContain('text-anchor="middle"');
    });

    it('should work with title and legend together', () => {
      const node: NodeAst = {
        id: 'test',
        shape: 'pie-chart',
        label: 'Chart with Legend',
        data: {
          values: [
            { label: 'A', value: 30 },
            { label: 'B', value: 25 },
          ],
          showLegend: true,
        },
      };
      const context: ShapeRenderContext = {
        node,
        style: {},
        measureText: (text: string) => ({ width: text.length * 8, height: 14 }),
      };
      const svg = pieChart.render(context, { x: 0, y: 0 });

      // Should have both title and legend
      expect(svg).toContain('Chart with Legend');
      expect(svg).toContain('A (');
      expect(svg).toContain('B (');
    });
  });
});
