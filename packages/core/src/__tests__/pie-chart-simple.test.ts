import { describe, it, expect } from 'vitest';
import { pieChart } from '../shapes/charts/pie.js';
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
    expect(pieChart.id).toBe('pie-chart');
  });

  it('should calculate default bounds (200x200)', () => {
    const bounds = pieChart.bounds(ctx());
    expect(bounds).toEqual({ width: 200, height: 200 });
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

    it('should not render legend by default (backwards compatible)', () => {
      const data = {
        values: [30, 45, 25],
      };
      const rendered = pieChart.render(ctx(data), { x: 0, y: 0 });
      const rectCount = (rendered.match(/<rect/g) || []).length;
      expect(rectCount).toBe(0);
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
        showLegend: true,
      };
      const boundsWithLegend = pieChart.bounds(ctx(data));
      const boundsNoLegend = pieChart.bounds(ctx({ values: [30, 45, 25] }));
      
      // Width should be wider to accommodate legend
      expect(boundsWithLegend.width).toBeGreaterThan(boundsNoLegend.width);
      // Height should be same or taller
      expect(boundsWithLegend.height).toBeGreaterThanOrEqual(boundsNoLegend.height);
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
});
