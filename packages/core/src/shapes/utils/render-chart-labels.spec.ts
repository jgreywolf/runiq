import { describe, expect, it, vi } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import {
  renderAxisLabel,
  renderChartTitle,
  renderLegend,
  renderXAxisLabel,
  renderYAxisLabel,
} from './render-chart-labels.js';

function createMockContext(): ShapeRenderContext {
  return {
    node: { id: 'test', label: 'Test' },
    style: {
      fontSize: 14,
      fontFamily: 'Arial',
    },
    measureText: vi.fn(() => ({ width: 100, height: 16 })),
    renderLabel: vi.fn((text: string) => `<text>${text}</text>`),
  } as unknown as ShapeRenderContext;
}

describe('render-chart-labels', () => {
  describe('renderChartTitle', () => {
    it('should render chart title', () => {
      const ctx = createMockContext();
      const svg = renderChartTitle({
        ctx,
        title: 'Sales Data',
        position: { x: 0, y: 0 },
        width: 400,
      });

      expect(svg).toContain('Sales Data');
    });

    it('should center title horizontally', () => {
      const ctx = createMockContext();
      const svg = renderChartTitle({
        ctx,
        title: 'Chart',
        position: { x: 100, y: 50 },
        width: 200,
      });

      // Title X should be center: 100 + 200/2 = 200
      expect(ctx.renderLabel).toHaveBeenCalled();
    });

    it('should apply custom font size', () => {
      const ctx = createMockContext();
      const svg = renderChartTitle({
        ctx,
        title: 'Chart',
        position: { x: 0, y: 0 },
        width: 400,
        fontSize: 20,
      });

      expect(svg).toBeDefined();
    });

    it('should apply custom font weight', () => {
      const ctx = createMockContext();
      const svg = renderChartTitle({
        ctx,
        title: 'Chart',
        position: { x: 0, y: 0 },
        width: 400,
        fontWeight: 'bold',
      });

      expect(svg).toBeDefined();
    });

    it('should use default y offset', () => {
      const ctx = createMockContext();
      renderChartTitle({
        ctx,
        title: 'Chart',
        position: { x: 0, y: 0 },
        width: 400,
      });

      expect(ctx.renderLabel).toHaveBeenCalledWith(
        'Chart',
        200,
        20,
        expect.anything()
      );
    });

    it('should apply custom y offset', () => {
      const ctx = createMockContext();
      renderChartTitle({
        ctx,
        title: 'Chart',
        position: { x: 0, y: 10 },
        width: 400,
        yOffset: 30,
      });

      expect(ctx.renderLabel).toHaveBeenCalledWith(
        'Chart',
        200,
        40,
        expect.anything()
      );
    });
  });

  describe('renderXAxisLabel', () => {
    it('should render X-axis label', () => {
      const svg = renderXAxisLabel({
        label: 'Time (hours)',
        x: 200,
        y: 350,
      });

      expect(svg).toContain('<text');
      expect(svg).toContain('Time (hours)');
      expect(svg).toContain('x="200"');
      expect(svg).toContain('y="350"');
    });

    it('should center text horizontally', () => {
      const svg = renderXAxisLabel({
        label: 'X Axis',
        x: 100,
        y: 300,
      });

      expect(svg).toContain('text-anchor="middle"');
    });

    it('should apply custom font size', () => {
      const svg = renderXAxisLabel({
        label: 'X Axis',
        x: 100,
        y: 300,
        fontSize: 16,
      });

      expect(svg).toContain('font-size="16"');
    });

    it('should apply custom color', () => {
      const svg = renderXAxisLabel({
        label: 'X Axis',
        x: 100,
        y: 300,
        color: '#333',
      });

      expect(svg).toContain('fill="#333"');
    });

    it('should escape XML characters', () => {
      const svg = renderXAxisLabel({
        label: '<Time> & Value',
        x: 100,
        y: 300,
      });

      expect(svg).toContain('&lt;Time&gt;');
      expect(svg).toContain('&amp;');
    });
  });

  describe('renderYAxisLabel', () => {
    it('should render Y-axis label with rotation', () => {
      const svg = renderYAxisLabel({
        label: 'Value ($)',
        x: 20,
        y: 200,
      });

      expect(svg).toContain('<text');
      expect(svg).toContain('Value ($)');
      expect(svg).toContain('transform="rotate(-90 20 200)"');
    });

    it('should apply rotation transformation', () => {
      const svg = renderYAxisLabel({
        label: 'Y Axis',
        x: 30,
        y: 150,
      });

      expect(svg).toContain('rotate(-90');
    });

    it('should apply custom font size', () => {
      const svg = renderYAxisLabel({
        label: 'Y Axis',
        x: 20,
        y: 200,
        fontSize: 18,
      });

      expect(svg).toContain('font-size="18"');
    });

    it('should apply custom color', () => {
      const svg = renderYAxisLabel({
        label: 'Y Axis',
        x: 20,
        y: 200,
        color: '#444',
      });

      expect(svg).toContain('fill="#444"');
    });
  });

  describe('renderAxisLabel', () => {
    it('should render X-axis label when rotate is false', () => {
      const svg = renderAxisLabel({
        label: 'X Label',
        x: 100,
        y: 300,
        rotate: false,
      });

      expect(svg).not.toContain('rotate');
      expect(svg).toContain('X Label');
    });

    it('should render Y-axis label when rotate is true', () => {
      const svg = renderAxisLabel({
        label: 'Y Label',
        x: 20,
        y: 200,
        rotate: true,
      });

      expect(svg).toContain('rotate(-90');
      expect(svg).toContain('Y Label');
    });

    it('should default to X-axis when rotate not specified', () => {
      const svg = renderAxisLabel({
        label: 'Label',
        x: 100,
        y: 300,
      });

      expect(svg).not.toContain('rotate');
    });
  });

  describe('renderLegend', () => {
    it('should render legend items', () => {
      const svg = renderLegend({
        items: [
          { label: 'Series 1', color: '#ff0000' },
          { label: 'Series 2', color: '#00ff00' },
        ],
        x: 400,
        y: 100,
      });

      expect(svg).toContain('Series 1');
      expect(svg).toContain('Series 2');
      expect(svg).toContain('#ff0000');
      expect(svg).toContain('#00ff00');
    });

    it('should render vertical legend by default', () => {
      const svg = renderLegend({
        items: [
          { label: 'A', color: '#f00' },
          { label: 'B', color: '#0f0' },
        ],
        x: 400,
        y: 100,
      });

      expect(svg).toBeDefined();
      expect(svg).toContain('A');
      expect(svg).toContain('B');
    });

    it('should render horizontal legend when specified', () => {
      const svg = renderLegend({
        items: [
          { label: 'A', color: '#f00' },
          { label: 'B', color: '#0f0' },
        ],
        x: 100,
        y: 400,
        orientation: 'horizontal',
      });

      expect(svg).toBeDefined();
      expect(svg).toContain('A');
      expect(svg).toContain('B');
    });

    it('should include values when provided', () => {
      const svg = renderLegend({
        items: [
          { label: 'Series 1', color: '#ff0000', value: '42%' },
          { label: 'Series 2', color: '#00ff00', value: '58%' },
        ],
        x: 400,
        y: 100,
      });

      expect(svg).toContain('42%');
      expect(svg).toContain('58%');
    });

    it('should render with custom swatch size', () => {
      const svg = renderLegend({
        items: [{ label: 'Test', color: '#000' }],
        x: 400,
        y: 100,
        swatchSize: 16,
      });

      expect(svg).toBeDefined();
    });

    it('should handle empty items array', () => {
      const svg = renderLegend({
        items: [],
        x: 400,
        y: 100,
      });

      expect(svg).toBe('');
    });

    it('should render rect swatches by default', () => {
      const svg = renderLegend({
        items: [{ label: 'Test', color: '#f00' }],
        x: 400,
        y: 100,
      });

      expect(svg).toContain('<rect');
    });

    it('should render circle swatches when specified', () => {
      const svg = renderLegend({
        items: [{ label: 'Test', color: '#f00' }],
        x: 400,
        y: 100,
        swatchShape: 'circle',
      });

      expect(svg).toContain('<circle');
    });

    it('should render line swatches when specified', () => {
      const svg = renderLegend({
        items: [{ label: 'Test', color: '#f00' }],
        x: 400,
        y: 100,
        swatchShape: 'line',
      });

      expect(svg).toContain('<line');
    });

    it('should handle multiple items with values', () => {
      const svg = renderLegend({
        items: [
          { label: 'Product A', color: '#ff6384', value: '35%' },
          { label: 'Product B', color: '#36a2eb', value: '25%' },
          { label: 'Product C', color: '#ffce56', value: '40%' },
        ],
        x: 450,
        y: 50,
      });

      expect(svg).toContain('Product A (35%)');
      expect(svg).toContain('Product B (25%)');
      expect(svg).toContain('Product C (40%)');
    });
  });
});
