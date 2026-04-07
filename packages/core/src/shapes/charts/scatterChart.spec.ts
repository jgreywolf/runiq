import { describe, expect, it } from 'vitest';
import { scatterChart } from './scatterChart.js';
import type { ShapeRenderContext } from '../../types/index.js';

describe('scatterChart', () => {
  it('should have correct id', () => {
    expect(scatterChart.id).toBe('scatterChart');
  });

  it('should render circles for point data', () => {
    const ctx: ShapeRenderContext = {
      node: {
        id: 'scatter-1',
        type: 'scatterChart',
        data: {
          points: [
            { x: 10, y: 15, label: 'A' },
            { x: 20, y: 35, label: 'B' },
            { x: 40, y: 22, label: 'C' },
          ],
        },
      },
      styles: {},
    };

    const svg = scatterChart.render(ctx, { x: 0, y: 0 });
    const circleCount = (svg.match(/<circle/g) || []).length;
    expect(circleCount).toBe(3);
  });

  it('should render multiple series legends when enabled', () => {
    const ctx: ShapeRenderContext = {
      node: {
        id: 'scatter-2',
        type: 'scatterChart',
        data: {
          showLegend: true,
          series: [
            {
              label: 'Current',
              points: [
                { x: 10, y: 20 },
                { x: 20, y: 30 },
              ],
            },
            {
              label: 'Target',
              points: [
                { x: 30, y: 15 },
                { x: 40, y: 25 },
              ],
            },
          ],
        },
      },
      styles: {},
    };

    const svg = scatterChart.render(ctx, { x: 0, y: 0 });
    expect(svg).toContain('Current');
    expect(svg).toContain('Target');
    expect(svg).toContain('<rect');
  });

  it('should render point labels when enabled', () => {
    const ctx: ShapeRenderContext = {
      node: {
        id: 'scatter-3',
        type: 'scatterChart',
        data: {
          showPointLabels: true,
          points: [
            { x: 12, y: 18, label: 'A' },
            { x: 26, y: 30, label: 'B' },
          ],
        },
      },
      styles: {},
    };

    const svg = scatterChart.render(ctx, { x: 0, y: 0 });
    expect(svg).toContain('A');
    expect(svg).toContain('B');
  });

  it('should render points from standard parsed data.values objects', () => {
    const ctx: ShapeRenderContext = {
      node: {
        id: 'scatter-4',
        type: 'scatterChart',
        data: {
          showPointLabels: true,
          values: [
            { x: 20, y: 120, label: 'A' },
            { x: 55, y: 60, label: 'B' },
            { x: 80, y: 210, label: 'C' },
          ],
        },
      },
      styles: {},
    };

    const svg = scatterChart.render(ctx, { x: 0, y: 0 });
    const circleCount = (svg.match(/<circle/g) || []).length;
    expect(circleCount).toBe(3);
    expect(svg).toContain('A');
    expect(svg).toContain('B');
    expect(svg).toContain('C');
    expect(svg).not.toContain('No data');
  });
});
