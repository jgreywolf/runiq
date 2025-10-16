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
});
