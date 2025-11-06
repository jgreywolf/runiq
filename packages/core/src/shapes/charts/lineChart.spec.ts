import { describe, it, expect } from 'vitest';
import { lineChart } from './lineChart.js';
import type { ShapeRenderContext } from '../../types.js';

describe('lineChart', () => {
  describe('Shape Definition', () => {
    it('should have correct id', () => {
      expect(lineChart.id).toBe('lineChart');
    });

    it('should have bounds method', () => {
      expect(lineChart.bounds).toBeDefined();
      expect(typeof lineChart.bounds).toBe('function');
    });

    it('should have anchors method', () => {
      expect(lineChart.anchors).toBeDefined();
      expect(typeof lineChart.anchors).toBe('function');
    });

    it('should have render method', () => {
      expect(lineChart.render).toBeDefined();
      expect(typeof lineChart.render).toBe('function');
    });
  });

  describe('Bounds Calculation', () => {
    it('should return default dimensions for simple data', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: [10, 20, 15, 30, 25],
        },
        styles: {},
      };

      const bounds = lineChart.bounds(ctx);
      expect(bounds.width).toBe(400);
      expect(bounds.height).toBe(300);
    });

    it('should add legend width when showLegend is true', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: {
            showLegend: true,
            series: [{ label: 'Series 1', values: [10, 20, 30] }],
          },
        },
        styles: {},
      };

      const bounds = lineChart.bounds(ctx);
      expect(bounds.width).toBe(550); // 400 + 150 legend width
      expect(bounds.height).toBe(300);
    });

    it('should not add legend width when showLegend is false', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: {
            showLegend: false,
            series: [{ label: 'Series 1', values: [10, 20, 30] }],
          },
        },
        styles: {},
      };

      const bounds = lineChart.bounds(ctx);
      expect(bounds.width).toBe(400);
      expect(bounds.height).toBe(300);
    });
  });

  describe('Anchor Points', () => {
    it('should have 4 anchor points (N, E, S, W)', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: [10, 20, 30],
        },
        styles: {},
      };

      const anchors = lineChart.anchors(ctx);
      expect(anchors).toHaveLength(4);

      const names = anchors.map((a) => a.name);
      expect(names).toEqual(['n', 'e', 's', 'w']);
    });

    it('should position anchors correctly for default size', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: [10, 20, 30],
        },
        styles: {},
      };

      const anchors = lineChart.anchors(ctx);

      // North (top center)
      expect(anchors[0]).toEqual({ x: 200, y: 0, name: 'n' });
      // East (right center)
      expect(anchors[1]).toEqual({ x: 400, y: 150, name: 'e' });
      // South (bottom center)
      expect(anchors[2]).toEqual({ x: 200, y: 300, name: 's' });
      // West (left center)
      expect(anchors[3]).toEqual({ x: 0, y: 150, name: 'w' });
    });
  });

  describe('Data Normalization', () => {
    it('should handle array of numbers (single series)', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: [10, 20, 15, 30, 25],
        },
        styles: {},
      };

      const svg = lineChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<path');
      expect(svg).toContain('stroke=');
      expect(svg).not.toContain('No data');
    });

    it('should handle structured series data', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: {
            series: [
              {
                label: 'Revenue',
                values: [100, 150, 200, 180, 220],
                color: '#3b82f6',
              },
            ],
          },
        },
        styles: {},
      };

      const svg = lineChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<path');
      expect(svg).toContain('stroke="#3b82f6"');
    });

    it('should handle multiple series', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: {
            series: [
              { label: 'Series 1', values: [10, 20, 30] },
              { label: 'Series 2', values: [15, 25, 20] },
            ],
          },
        },
        styles: {},
      };

      const svg = lineChart.render(ctx, { x: 0, y: 0 });
      const pathMatches = svg.match(/<path/g);
      expect(pathMatches).toBeTruthy();
      expect(pathMatches!.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle points array format', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: {
            label: 'Temperature',
            points: [
              { x: 0, y: 20 },
              { x: 1, y: 22 },
              { x: 2, y: 21 },
            ],
          },
        },
        styles: {},
      };

      const svg = lineChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<path');
    });
  });

  describe('Rendering Features', () => {
    it('should render grid lines by default', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: [10, 20, 30],
        },
        styles: {},
      };

      const svg = lineChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<line'); // Grid lines
      expect(svg).toContain('stroke-dasharray="4,4"'); // Dashed grid
    });

    it('should hide grid when showGrid is false', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: {
            showGrid: false,
            series: [{ label: 'Series 1', values: [10, 20, 30] }],
          },
        },
        styles: {},
      };

      const svg = lineChart.render(ctx, { x: 0, y: 0 });
      expect(svg).not.toContain('stroke-dasharray="4,4"');
    });

    it('should render markers by default', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: [10, 20, 30],
        },
        styles: {},
      };

      const svg = lineChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<circle'); // Data point markers
    });

    it('should hide markers when showMarkers is false', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: {
            showMarkers: false,
            series: [{ label: 'Series 1', values: [10, 20, 30] }],
          },
        },
        styles: {},
      };

      const svg = lineChart.render(ctx, { x: 0, y: 0 });
      // Should have axes circles but not data markers
      const circleMatches = svg.match(/<circle/g);
      expect(circleMatches).toBeNull();
    });

    it('should render legend when showLegend is true', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: {
            showLegend: true,
            series: [
              { label: 'Series 1', values: [10, 20, 30] },
              { label: 'Series 2', values: [15, 25, 20] },
            ],
          },
        },
        styles: {},
      };

      const svg = lineChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('class="legend"');
      expect(svg).toContain('Series 1');
      expect(svg).toContain('Series 2');
    });

    it('should render chart title when label is provided', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          label: 'Sales Over Time',
          data: [10, 20, 30],
        },
        styles: {},
      };

      const svg = lineChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('Sales Over Time');
    });

    it('should render axes', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: [10, 20, 30],
        },
        styles: {},
      };

      const svg = lineChart.render(ctx, { x: 0, y: 0 });
      // Check for axis lines
      const lineMatches = svg.match(/<line/g);
      expect(lineMatches).toBeTruthy();
      expect(lineMatches!.length).toBeGreaterThan(0);
    });
  });

  describe('Custom Colors', () => {
    it('should use custom colors when provided', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: {
            colors: ['#ff0000', '#00ff00'],
            series: [
              { label: 'Series 1', values: [10, 20, 30] },
              { label: 'Series 2', values: [15, 25, 20] },
            ],
          },
        },
        styles: {},
      };

      const svg = lineChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('#ff0000');
      expect(svg).toContain('#00ff00');
    });

    it('should use series color when specified', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: {
            series: [
              {
                label: 'Custom',
                values: [10, 20, 30],
                color: '#purple',
              },
            ],
          },
        },
        styles: {},
      };

      const svg = lineChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('#purple');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data gracefully', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: [],
        },
        styles: {},
      };

      const svg = lineChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('No data');
    });

    it('should handle null data', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: null,
        },
        styles: {},
      };

      const svg = lineChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('No data');
    });

    it('should handle undefined data', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
        },
        styles: {},
      };

      const svg = lineChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('No data');
    });

    it('should handle single data point', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: [42],
        },
        styles: {},
      };

      const svg = lineChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<path');
      expect(svg).toContain('<circle'); // Marker for single point
    });

    it('should apply position offset correctly', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'lineChart',
          data: [10, 20, 30],
        },
        styles: {},
      };

      const svg = lineChart.render(ctx, { x: 100, y: 200 });
      expect(svg).toContain('translate(');
    });
  });
});
