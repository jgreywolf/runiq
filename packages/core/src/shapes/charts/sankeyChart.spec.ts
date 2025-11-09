import { describe, it, expect } from 'vitest';
import { sankeyChart, sankeyNode } from './sankeyChart.js';
import type { ShapeRenderContext } from '../../types.js';

describe('sankeyNode', () => {
  describe('Shape Definition', () => {
    it('should have correct id', () => {
      expect(sankeyNode.id).toBe('sankeyNode');
    });

    it('should have bounds method', () => {
      expect(sankeyNode.bounds).toBeDefined();
      expect(typeof sankeyNode.bounds).toBe('function');
    });

    it('should have anchors method', () => {
      expect(sankeyNode.anchors).toBeDefined();
      expect(typeof sankeyNode.anchors).toBe('function');
    });

    it('should have render method', () => {
      expect(sankeyNode.render).toBeDefined();
      expect(typeof sankeyNode.render).toBe('function');
    });
  });

  describe('Bounds Calculation', () => {
    it('should return default dimensions', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'node1',
          type: 'sankeyNode',
        },
        styles: {},
      };

      const bounds = sankeyNode.bounds(ctx);
      expect(bounds.width).toBeGreaterThanOrEqual(120);
      expect(bounds.height).toBeGreaterThanOrEqual(80);
    });

    it('should respect padding', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'node1',
          type: 'sankeyNode',
          label: 'Test',
        },
        style: { padding: 30 },
        styles: {},
        measureText: () => ({ width: 50, height: 20 }),
      };

      const bounds = sankeyNode.bounds(ctx);
      expect(bounds.width).toBeGreaterThanOrEqual(50 + 30 * 2);
      expect(bounds.height).toBeGreaterThanOrEqual(20 + 30 * 2);
    });
  });

  describe('Anchors', () => {
    it('should return 4-point anchor system', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'node1',
          type: 'sankeyNode',
        },
        styles: {},
      };

      const anchors = sankeyNode.anchors(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual(['n', 'e', 's', 'w']);
    });

    it('should position anchors at shape boundaries', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'node1',
          type: 'sankeyNode',
        },
        styles: {},
      };

      const bounds = sankeyNode.bounds(ctx);
      const anchors = sankeyNode.anchors(ctx);

      expect(anchors[0]).toEqual({ x: bounds.width / 2, y: 0, name: 'n' });
      expect(anchors[1]).toEqual({
        x: bounds.width,
        y: bounds.height / 2,
        name: 'e',
      });
      expect(anchors[2]).toEqual({
        x: bounds.width / 2,
        y: bounds.height,
        name: 's',
      });
      expect(anchors[3]).toEqual({ x: 0, y: bounds.height / 2, name: 'w' });
    });
  });

  describe('Rendering', () => {
    it('should render rectangle with label', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'node1',
          type: 'sankeyNode',
          label: 'Energy Source',
        },
        styles: {},
      };

      const svg = sankeyNode.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
      expect(svg).toContain('Energy Source');
    });

    it('should apply custom fill color', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'node1',
          type: 'sankeyNode',
        },
        style: { fill: '#ff0000' },
        styles: {},
      };

      const svg = sankeyNode.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('fill="#ff0000"');
    });
  });
});

describe('sankeyChart', () => {
  describe('Shape Definition', () => {
    it('should have correct id', () => {
      expect(sankeyChart.id).toBe('sankeyChart');
    });

    it('should have bounds method', () => {
      expect(sankeyChart.bounds).toBeDefined();
      expect(typeof sankeyChart.bounds).toBe('function');
    });

    it('should have anchors method', () => {
      expect(sankeyChart.anchors).toBeDefined();
      expect(typeof sankeyChart.anchors).toBe('function');
    });

    it('should have render method', () => {
      expect(sankeyChart.render).toBeDefined();
      expect(typeof sankeyChart.render).toBe('function');
    });
  });

  describe('Bounds Calculation', () => {
    it('should return default dimensions', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'sankeyChart',
        },
        styles: {},
      };

      const bounds = sankeyChart.bounds(ctx);
      expect(bounds.width).toBe(800);
      expect(bounds.height).toBe(600);
    });

    it('should respect custom dimensions', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'sankeyChart',
          data: {
            width: 1000,
            height: 400,
          },
        },
        styles: {},
      };

      const bounds = sankeyChart.bounds(ctx);
      expect(bounds.width).toBe(1000);
      expect(bounds.height).toBe(400);
    });
  });

  describe('Rendering', () => {
    it('should render empty state when no data', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'sankeyChart',
        },
        styles: {},
      };

      const svg = sankeyChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('No Sankey data');
    });

    it('should render nodes and flows with valid data', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'sankeyChart',
          data: {
            nodes: [
              { id: 'A', label: 'Source' },
              { id: 'B', label: 'Process' },
              { id: 'C', label: 'Output' },
            ],
            links: [
              { source: 'A', target: 'B', value: 100 },
              { source: 'B', target: 'C', value: 80 },
            ],
          },
        },
        styles: {},
      };

      const svg = sankeyChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<g>');
      expect(svg).toContain('<rect');
      expect(svg).toContain('<path');
      expect(svg).toContain('Source');
      expect(svg).toContain('Process');
      expect(svg).toContain('Output');
    });

    it('should handle complex energy flow diagram', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'energyFlow',
          type: 'sankeyChart',
          data: {
            nodes: [
              { id: 'Coal', label: 'Coal' },
              { id: 'Gas', label: 'Natural Gas' },
              { id: 'Solar', label: 'Solar' },
              { id: 'Power', label: 'Power Plant' },
              { id: 'Grid', label: 'Grid' },
              { id: 'Residential', label: 'Residential' },
              { id: 'Industrial', label: 'Industrial' },
            ],
            links: [
              { source: 'Coal', target: 'Power', value: 300 },
              { source: 'Gas', target: 'Power', value: 200 },
              { source: 'Solar', target: 'Power', value: 100 },
              { source: 'Power', target: 'Grid', value: 600 },
              { source: 'Grid', target: 'Residential', value: 250 },
              { source: 'Grid', target: 'Industrial', value: 350 },
            ],
          },
        },
        styles: {},
      };

      const svg = sankeyChart.render(ctx, { x: 0, y: 0 });

      // Should render all nodes
      expect(svg).toContain('Coal');
      expect(svg).toContain('Natural Gas');
      expect(svg).toContain('Solar');
      expect(svg).toContain('Power Plant');
      expect(svg).toContain('Grid');
      expect(svg).toContain('Residential');
      expect(svg).toContain('Industrial');

      // Should have multiple paths (flows)
      const pathCount = (svg.match(/<path/g) || []).length;
      expect(pathCount).toBe(6); // 6 links
    });

    it('should apply custom colors to nodes', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'sankeyChart',
          data: {
            nodes: [
              { id: 'A', label: 'Green Energy', color: '#00ff00' },
              { id: 'B', label: 'Output' },
            ],
            links: [{ source: 'A', target: 'B', value: 100 }],
          },
        },
        styles: {},
      };

      const svg = sankeyChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('fill="#00ff00"');
    });

    it('should scale flow widths based on values', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'sankeyChart',
          data: {
            nodes: [
              { id: 'A' },
              { id: 'B' },
              { id: 'C' },
              { id: 'D' },
            ],
            links: [
              { source: 'A', target: 'C', value: 100 }, // Large flow
              { source: 'B', target: 'D', value: 10 }, // Small flow
            ],
          },
        },
        styles: {},
      };

      const svg = sankeyChart.render(ctx, { x: 0, y: 0 });

      // Both flows should be present but with different visual characteristics
      const paths = svg.match(/<path[^>]*>/g) || [];
      expect(paths.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle cycles in data', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'sankeyChart',
          data: {
            nodes: [
              { id: 'A' },
              { id: 'B' },
              { id: 'C' },
            ],
            links: [
              { source: 'A', target: 'B', value: 100 },
              { source: 'B', target: 'C', value: 80 },
              { source: 'C', target: 'A', value: 20 }, // Cycle
            ],
          },
        },
        styles: {},
      };

      const svg = sankeyChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<g>');
      expect(svg).not.toContain('No Sankey data');
    });
  });

  describe('Edge Cases', () => {
    it('should handle single node', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'sankeyChart',
          data: {
            nodes: [{ id: 'A', label: 'Single' }],
            links: [],
          },
        },
        styles: {},
      };

      const svg = sankeyChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('Single');
    });

    it('should handle disconnected nodes', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'chart1',
          type: 'sankeyChart',
          data: {
            nodes: [
              { id: 'A' },
              { id: 'B' },
              { id: 'C' },
              { id: 'D' },
            ],
            links: [
              { source: 'A', target: 'B', value: 100 },
              // C and D are disconnected
            ],
          },
        },
        styles: {},
      };

      const svg = sankeyChart.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect'); // Should still render all nodes
    });
  });
});
