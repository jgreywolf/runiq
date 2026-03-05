import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { radarChart } from './radarChart.js';

describe('radarChart', () => {
  describe('Shape Definition', () => {
    it('should have correct id', () => {
      expect(radarChart.id).toBe('radarChart');
    });

    it('should have bounds method', () => {
      expect(radarChart.bounds).toBeDefined();
      expect(typeof radarChart.bounds).toBe('function');
    });

    it('should have anchors method', () => {
      expect(radarChart.anchors).toBeDefined();
      expect(typeof radarChart.anchors).toBe('function');
    });

    it('should have render method', () => {
      expect(radarChart.render).toBeDefined();
      expect(typeof radarChart.render).toBe('function');
    });
  });

  describe('Bounds Calculation', () => {
    it('should return fixed dimensions', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
            series: [{ label: 'S1', values: [80, 70, 90] }],
          },
        },
        styles: {},
      };

      const bounds = radarChart.bounds(ctx);
      expect(bounds.width).toBe(400);
      expect(bounds.height).toBe(400);
    });
  });

  describe('Anchor Points', () => {
    it('should have 4 anchor points (N, E, S, W)', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {},
        },
        styles: {},
      };

      const anchors = radarChart.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual(['n', 'e', 's', 'w']);
    });

    it('should position anchors correctly for fixed size', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {},
        },
        styles: {},
      };

      const anchors = radarChart.anchors!(ctx);

      expect(anchors[0]).toEqual({ x: 200, y: 0, name: 'n' }); // North
      expect(anchors[1]).toEqual({ x: 400, y: 200, name: 'e' }); // East
      expect(anchors[2]).toEqual({ x: 200, y: 400, name: 's' }); // South
      expect(anchors[3]).toEqual({ x: 0, y: 200, name: 'w' }); // West
    });
  });

  describe('Data Normalization', () => {
    it('should handle full structured data with axes and series', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [
              { label: 'Speed', max: 100 },
              { label: 'Strength', max: 100 },
              { label: 'Intelligence', max: 100 },
              { label: 'Agility', max: 100 },
            ],
            series: [
              { label: 'Hero A', values: [80, 90, 70, 85], color: '#3b82f6' },
            ],
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Speed');
      expect(svg).toContain('Strength');
      expect(svg).toContain('Intelligence');
      expect(svg).toContain('Agility');
      expect(svg).toContain('polygon');
    });

    it('should handle simple array of values (single series)', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: [80, 90, 70, 85, 75],
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Axis 1');
      expect(svg).toContain('Axis 5');
      expect(svg).toContain('polygon');
    });

    it('should handle object with values array', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            values: [70, 80, 90, 75, 85],
            label: 'Test Series',
            color: '#ef4444',
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('polygon');
      expect(svg).toContain('#ef4444');
    });

    it('should handle multiple series', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [
              { label: 'A' },
              { label: 'B' },
              { label: 'C' },
              { label: 'D' },
            ],
            series: [
              { label: 'Series 1', values: [80, 70, 90, 85] },
              { label: 'Series 2', values: [70, 85, 75, 80] },
            ],
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      // Should have 2 polygons
      const polygonCount = (svg.match(/<polygon/g) || []).length;
      expect(polygonCount).toBe(2);
    });

    it('should handle string axes (auto-convert to axis objects)', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: ['Speed', 'Power', 'Defense'],
            series: [{ label: 'Character', values: [80, 90, 70] }],
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Speed');
      expect(svg).toContain('Power');
      expect(svg).toContain('Defense');
    });
  });

  describe('Rendering Features', () => {
    it('should render grid circles by default', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
            series: [{ label: 'S1', values: [80, 70, 90] }],
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('fill="none"');
    });

    it('should hide grid when showGrid is false', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
            series: [{ label: 'S1', values: [80, 70, 90] }],
            showGrid: false,
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      // Grid circles should not be present
      expect(svg).not.toContain('fill="none"');
    });

    it('should render markers by default', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
            series: [{ label: 'S1', values: [80, 70, 90] }],
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      // Should have data point markers
      const markerCount = (svg.match(/<circle cx/g) || []).length;
      expect(markerCount).toBeGreaterThan(0);
    });

    it('should hide markers when showMarkers is false', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
            series: [{ label: 'S1', values: [80, 70, 90] }],
            showMarkers: false,
          },
        },
        styles: {},
      };

      const withMarkersCtx: ShapeRenderContext = {
        node: {
          id: 'radar2',
          type: 'radarChart',
          data: {
            axes: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
            series: [{ label: 'S1', values: [80, 70, 90] }],
            showMarkers: true,
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });
      const svgWithMarkers = radarChart.render(withMarkersCtx, { x: 0, y: 0 });

      const noMarkersCount = (svg.match(/<circle/g) || []).length;
      const withMarkersCount = (svgWithMarkers.match(/<circle/g) || []).length;

      expect(withMarkersCount).toBeGreaterThan(noMarkersCount);
    });

    it('should render legend when showLegend is true and multiple series', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
            series: [
              { label: 'Series 1', values: [80, 70, 90] },
              { label: 'Series 2', values: [70, 85, 75] },
            ],
            showLegend: true,
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Series 1');
      expect(svg).toContain('Series 2');
      expect(svg).toContain('<rect'); // Legend color boxes
    });

    it('should not render legend for single series even if showLegend is true', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
            series: [{ label: 'Series 1', values: [80, 70, 90] }],
            showLegend: true,
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      // Should not have legend rectangles (only grid/marker circles)
      expect(svg).not.toContain('<rect');
    });

    it('should render chart title when label is provided', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          label: 'Skills Assessment',
          data: {
            axes: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
            series: [{ label: 'S1', values: [80, 70, 90] }],
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Skills Assessment');
      expect(svg).toContain('font-size="16"'); // Title uses fontSize 16
    });

    it('should render radial axes (spokes)', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
            series: [{ label: 'S1', values: [80, 70, 90] }],
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      // Should have lines for axes
      const lineCount = (svg.match(/<line/g) || []).length;
      expect(lineCount).toBe(3); // One line per axis
    });

    it('should render axis labels', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [
              { label: 'Speed' },
              { label: 'Power' },
              { label: 'Defense' },
              { label: 'Agility' },
            ],
            series: [{ label: 'S1', values: [80, 70, 90, 75] }],
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Speed');
      expect(svg).toContain('Power');
      expect(svg).toContain('Defense');
      expect(svg).toContain('Agility');
    });

    it('should respect custom gridLevels', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
            series: [{ label: 'S1', values: [80, 70, 90] }],
            gridLevels: 5,
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      // Should have 5 grid circles
      const gridCircles = svg.match(/fill="none"/g) || [];
      expect(gridCircles.length).toBe(5);
    });
  });

  describe('Custom Colors', () => {
    it('should use custom colors when provided', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
            series: [
              { label: 'S1', values: [80, 70, 90] },
              { label: 'S2', values: [70, 85, 75] },
            ],
            colors: ['#ff0000', '#00ff00'],
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('#ff0000');
      expect(svg).toContain('#00ff00');
    });

    it('should use series color when specified', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
            series: [{ label: 'S1', values: [80, 70, 90], color: '#9333ea' }],
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('#9333ea');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data gracefully', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: [],
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('No data');
    });

    it('should handle null data', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: null,
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('No data');
    });

    it('should handle undefined data', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: undefined,
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('No data');
    });

    it('should handle empty series array', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
            series: [],
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('No data');
    });

    it('should handle series with empty values', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
            series: [{ label: 'S1', values: [] }],
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('No data');
    });

    it('should require at least 3 axes', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [{ label: 'A' }, { label: 'B' }],
            series: [{ label: 'S1', values: [80, 70] }],
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('at least 3 axes');
    });

    it('should handle missing values in series (treat as 0)', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [
              { label: 'A' },
              { label: 'B' },
              { label: 'C' },
              { label: 'D' },
            ],
            series: [{ label: 'S1', values: [80, 70] }], // Only 2 values for 4 axes
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('polygon');
    });

    it('should normalize values to axis max', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [
              { label: 'A', max: 100 },
              { label: 'B', max: 50 },
              { label: 'C', max: 200 },
            ],
            series: [{ label: 'S1', values: [100, 50, 200] }],
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      // All values should be at max radius (normalized to 1)
      expect(svg).toContain('polygon');
    });

    it('should auto-calculate axis max from data', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
            series: [
              { label: 'S1', values: [50, 100, 75] },
              { label: 'S2', values: [80, 60, 90] },
            ],
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      // Should render successfully with auto-calculated max values
      expect(svg).toContain('polygon');
      const polygonCount = (svg.match(/<polygon/g) || []).length;
      expect(polygonCount).toBe(2);
    });

    it('should apply position offset correctly', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: {
            axes: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
            series: [{ label: 'S1', values: [80, 70, 90] }],
          },
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 100, y: 50 });

      expect(svg).toContain('translate(100, 50)');
    });

    it('should not normalize to all-equal values for simple array with different values', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'radar1',
          type: 'radarChart',
          data: [90, 85, 78, 82, 88],
        },
        styles: {},
      };

      const svg = radarChart.render(ctx, { x: 0, y: 0 });

      // Extract polygon points to verify they're not all at max radius
      const polygonMatch = svg.match(/points="([^"]+)"/);
      expect(polygonMatch).toBeTruthy();

      if (polygonMatch) {
        const points = polygonMatch[1].split(' ');
        const distances: number[] = [];

        // Calculate distance from center for each point
        const centerX = 200; // width/2
        const centerY = 200; // height/2

        for (const pointStr of points) {
          const [x, y] = pointStr.split(',').map(Number);
          const distance = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
          );
          distances.push(distance);
        }

        // Verify that not all distances are equal (which would create a regular polygon)
        const uniqueDistances = new Set(distances.map((d) => Math.round(d)));
        expect(uniqueDistances.size).toBeGreaterThan(1);
      }
    });
  });
});
