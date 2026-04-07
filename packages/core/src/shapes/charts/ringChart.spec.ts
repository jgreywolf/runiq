import { describe, expect, it } from 'vitest';
import { ringChart } from './ringChart.js';
import type { NodeAst, ShapeRenderContext } from '../../types/index.js';

function ctx(data?: any): ShapeRenderContext {
  const node: NodeAst = {
    id: 'ring-test',
    shape: 'ring-chart',
    label: 'Revenue Mix',
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

describe('ringChart', () => {
  it('should have correct id', () => {
    expect(ringChart.id).toBe('ringChart');
  });

  it('should render donut slices for numeric data', () => {
    const svg = ringChart.render(ctx({ values: [30, 20, 50] }), { x: 0, y: 0 });
    const pathCount = (svg.match(/<path/g) || []).length;
    expect(pathCount).toBe(3);
  });

  it('should support direct array data', () => {
    const svg = ringChart.render(ctx([10, 20, 30]), { x: 0, y: 0 });
    expect(svg).toContain('<path');
  });

  it('should allow custom inner radius', () => {
    const svg = ringChart.render(
      ctx({ values: [40, 60], innerRadius: 0.72 }),
      { x: 0, y: 0 }
    );
    expect(svg).toContain('<path');
  });

  it('should render legend by default', () => {
    const svg = ringChart.render(ctx({ values: [30, 70] }), { x: 0, y: 0 });
    expect(svg).toContain('<rect');
    expect(svg).toContain('30%');
    expect(svg).toContain('70%');
  });
});
