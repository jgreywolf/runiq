/**
 * Tests for Legend Generator
 */

import { describe, it, expect } from 'vitest';
import {
  generateScaleLegend,
  generateCategoryLegend,
  generateThresholdLegend,
  generateLegendsFromMappings,
  renderLegendSVG,
  type LegendConfig,
} from './legendGenerator.js';
import type { StyleMappingConfig } from './dynamic-shape-generator.js';

describe('Legend Generator', () => {
  describe('generateScaleLegend', () => {
    it('generates scale legend for numeric range', () => {
      const mapping: StyleMappingConfig = {
        property: 'opacity',
        field: 'score',
        type: 'scale',
        scale: {
          domain: [0, 100],
          range: ['0.3', '1.0'],
        },
      };

      const legend = generateScaleLegend(mapping as any);

      expect(legend.type).toBe('scale');
      expect(legend.title).toBe('score (opacity)');
      expect(legend.entries).toHaveLength(5); // default steps
      expect(legend.entries[0].value).toBe(0);
      expect(legend.entries[0].style).toBe('0.30');
      expect(legend.entries[4].value).toBe(100);
      expect(legend.entries[4].style).toBe('1.00');
      expect(legend.position).toBe('bottom-right');
    });

    it('generates scale legend for color gradient', () => {
      const mapping: StyleMappingConfig = {
        property: 'fill',
        field: 'temperature',
        type: 'scale',
        scale: {
          domain: [0, 100],
          range: ['#0000ff', '#ff0000'],
        },
      };

      const legend = generateScaleLegend(mapping as any);

      expect(legend.entries).toHaveLength(5);
      expect(legend.entries[0].style).toBe('#0000ff'); // Blue
      expect(legend.entries[4].style).toBe('#ff0000'); // Red
      expect(legend.entries[2].style).toBe('#800080'); // Middle purple (rounded)
    });

    it('supports custom steps and position', () => {
      const mapping: StyleMappingConfig = {
        property: 'strokeWidth',
        field: 'load',
        type: 'scale',
        scale: {
          domain: [0, 10],
          range: ['1', '5'],
        },
      };

      const config: LegendConfig = {
        steps: 3,
        position: 'top-left',
        title: 'System Load',
      };

      const legend = generateScaleLegend(mapping as any, config);

      expect(legend.entries).toHaveLength(3);
      expect(legend.position).toBe('top-left');
      expect(legend.title).toBe('System Load');
      expect(legend.entries[0].value).toBe(0);
      expect(legend.entries[1].value).toBe(5);
      expect(legend.entries[2].value).toBe(10);
    });

    it('formats decimal values correctly', () => {
      const mapping: StyleMappingConfig = {
        property: 'opacity',
        field: 'score',
        type: 'scale',
        scale: {
          domain: [0, 1],
          range: ['0', '1'],
        },
      };

      const config: LegendConfig = {
        steps: 3,
      };

      const legend = generateScaleLegend(mapping as any, config);

      expect(legend.entries[0].label).toBe('0');
      expect(legend.entries[1].label).toBe('0.5');
      expect(legend.entries[2].label).toBe('1');
    });

    it('throws error for non-scale mapping', () => {
      const mapping: StyleMappingConfig = {
        property: 'fill',
        field: 'status',
        type: 'category',
        categories: { active: 'green' },
      };

      expect(() => {
        // @ts-expect-error - Testing error case
        generateScaleLegend(mapping as any);
      }).toThrow('Scale mapping required');
    });
  });

  describe('generateCategoryLegend', () => {
    it('generates category legend with color mappings', () => {
      const mapping: StyleMappingConfig = {
        property: 'fill',
        field: 'status',
        type: 'category',
        categories: {
          active: 'green',
          inactive: 'gray',
          error: 'red',
        },
      };

      const legend = generateCategoryLegend(mapping as any);

      expect(legend.type).toBe('category');
      expect(legend.title).toBe('status (fill)');
      expect(legend.entries).toHaveLength(3);

      const activeEntry = legend.entries.find((e) => e.label === 'active');
      expect(activeEntry?.style).toBe('green');

      const errorEntry = legend.entries.find((e) => e.label === 'error');
      expect(errorEntry?.style).toBe('red');
    });

    it('supports custom title and position', () => {
      const mapping: StyleMappingConfig = {
        property: 'fill',
        field: 'priority',
        type: 'category',
        categories: {
          high: '#ff0000',
          medium: '#ffaa00',
          low: '#00ff00',
        },
      };

      const config: LegendConfig = {
        title: 'Task Priority',
        position: 'top-right',
      };

      const legend = generateCategoryLegend(mapping as any, config);

      expect(legend.title).toBe('Task Priority');
      expect(legend.position).toBe('top-right');
      expect(legend.entries).toHaveLength(3);
    });

    it('throws error for non-category mapping', () => {
      const mapping: StyleMappingConfig = {
        property: 'opacity',
        field: 'score',
        type: 'scale',
        scale: {
          domain: [0, 100],
          range: ['0.3', '1.0'],
        },
      };

      expect(() => {
        // @ts-expect-error - Testing error case
        generateCategoryLegend(mapping as any);
      }).toThrow('Category mapping required');
    });
  });

  describe('generateThresholdLegend', () => {
    it('generates threshold legend with ranges', () => {
      const mapping: StyleMappingConfig = {
        property: 'fill',
        field: 'score',
        type: 'threshold',
        thresholds: [
          { value: 80, style: 'green' },
          { value: 60, style: 'yellow' },
          { value: 0, style: 'red' },
        ],
      };

      const legend = generateThresholdLegend(mapping as any);

      expect(legend.type).toBe('category'); // Displays like category
      expect(legend.title).toBe('score (fill)');
      expect(legend.entries).toHaveLength(3);

      // Should be sorted descending
      expect(legend.entries[0].label).toBe('≥ 80');
      expect(legend.entries[0].style).toBe('green');
      expect(legend.entries[1].label).toBe('60 - 80');
      expect(legend.entries[1].style).toBe('yellow');
      expect(legend.entries[2].label).toBe('0 - 60');
      expect(legend.entries[2].style).toBe('red');
    });

    it('handles unsorted thresholds', () => {
      const mapping: StyleMappingConfig = {
        property: 'fill',
        field: 'temperature',
        type: 'threshold',
        thresholds: [
          { value: 0, style: 'blue' },
          { value: 100, style: 'red' },
          { value: 50, style: 'orange' },
        ],
      };

      const legend = generateThresholdLegend(mapping as any);

      expect(legend.entries).toHaveLength(3);
      expect(legend.entries[0].label).toBe('≥ 100');
      expect(legend.entries[1].label).toBe('50 - 100');
      expect(legend.entries[2].label).toBe('0 - 50');
    });

    it('throws error for non-threshold mapping', () => {
      const mapping: StyleMappingConfig = {
        property: 'fill',
        field: 'status',
        type: 'category',
        categories: { active: 'green' },
      };

      expect(() => {
        // @ts-expect-error - Testing error case
        generateThresholdLegend(mapping as any);
      }).toThrow('Threshold mapping required');
    });
  });

  describe('generateLegendsFromMappings', () => {
    it('generates multiple legends from different mapping types', () => {
      const mappings: StyleMappingConfig[] = [
        {
          property: 'fill',
          field: 'status',
          type: 'category',
          categories: {
            active: 'green',
            inactive: 'gray',
          },
        },
        {
          property: 'opacity',
          field: 'score',
          type: 'scale',
          scale: {
            domain: [0, 100],
            range: ['0.3', '1.0'],
          },
        },
        {
          property: 'strokeWidth',
          field: 'priority',
          type: 'threshold',
          thresholds: [
            { value: 8, style: '3' },
            { value: 5, style: '2' },
            { value: 0, style: '1' },
          ],
        },
      ];

      const legends = generateLegendsFromMappings(mappings);

      expect(legends).toHaveLength(3);
      expect(legends[0].type).toBe('category');
      expect(legends[1].type).toBe('scale');
      expect(legends[2].type).toBe('category'); // Threshold displays as category
    });

    it('positions legends in different corners', () => {
      const mappings: StyleMappingConfig[] = [
        {
          property: 'fill',
          field: 'a',
          type: 'category',
          categories: { x: 'red' },
        },
        {
          property: 'opacity',
          field: 'b',
          type: 'scale',
          scale: { domain: [0, 1], range: ['0', '1'] },
        },
        {
          property: 'strokeWidth',
          field: 'c',
          type: 'category',
          categories: { y: 'blue' },
        },
      ];

      const legends = generateLegendsFromMappings(mappings);

      expect(legends[0].position).toBe('bottom-right');
      expect(legends[1].position).toBe('bottom-left');
      expect(legends[2].position).toBe('top-right');
    });

    it('respects custom position config', () => {
      const mappings: StyleMappingConfig[] = [
        {
          property: 'fill',
          field: 'status',
          type: 'category',
          categories: { active: 'green' },
        },
      ];

      const legends = generateLegendsFromMappings(mappings, {
        position: 'top-center',
      });

      expect(legends[0].position).toBe('top-center');
    });

    it('returns empty array for no mappings', () => {
      const legends = generateLegendsFromMappings([]);
      expect(legends).toHaveLength(0);
    });
  });

  describe('Legend bounds calculation', () => {
    it('calculates bounds for all positions', () => {
      const mapping: StyleMappingConfig = {
        property: 'fill',
        field: 'status',
        type: 'category',
        categories: { active: 'green' },
      };

      const positions = [
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
        'top-center',
        'bottom-center',
        'left-center',
        'right-center',
      ] as const;

      positions.forEach((position) => {
        const legend = generateCategoryLegend(mapping as any, { position });
        expect(legend.bounds.width).toBeGreaterThan(0);
        expect(legend.bounds.height).toBeGreaterThan(0);
        expect(legend.bounds.x).toBeGreaterThanOrEqual(0);
        expect(legend.bounds.y).toBeGreaterThanOrEqual(0);
      });
    });

    it('applies custom width and height', () => {
      const mapping: StyleMappingConfig = {
        property: 'fill',
        field: 'status',
        type: 'category',
        categories: { active: 'green' },
      };

      const legend = generateCategoryLegend(mapping as any, {
        width: 300,
        height: 250,
      });

      expect(legend.bounds.width).toBe(300);
      expect(legend.bounds.height).toBe(250);
    });
  });

  describe('renderLegendSVG', () => {
    it('renders scale legend as SVG', () => {
      const mapping: StyleMappingConfig = {
        property: 'fill',
        field: 'temperature',
        type: 'scale',
        scale: {
          domain: [0, 100],
          range: ['#0000ff', '#ff0000'],
        },
      };

      const legend = generateScaleLegend(mapping as any, {
        title: 'Temperature Scale',
        steps: 3,
      });

      const svg = renderLegendSVG(legend);

      expect(svg).toContain('<g class="legend"');
      expect(svg).toContain('Temperature Scale');
      expect(svg).toContain('#0000ff');
      expect(svg).toContain('#ff0000');
      expect(svg).toContain('<rect'); // Background
    });

    it('renders category legend as SVG', () => {
      const mapping: StyleMappingConfig = {
        property: 'fill',
        field: 'status',
        type: 'category',
        categories: {
          active: '#22c55e',
          warning: '#eab308',
          error: '#ef4444',
        },
      };

      const legend = generateCategoryLegend(mapping as any, {
        title: 'Status',
      });

      const svg = renderLegendSVG(legend);

      expect(svg).toContain('Status');
      expect(svg).toContain('active');
      expect(svg).toContain('warning');
      expect(svg).toContain('error');
      expect(svg).toContain('#22c55e');
      expect(svg).toContain('#eab308');
      expect(svg).toContain('#ef4444');
    });

    it('renders legend without border', () => {
      const mapping: StyleMappingConfig = {
        property: 'fill',
        field: 'status',
        type: 'category',
        categories: { active: 'green' },
      };

      const legend = generateCategoryLegend(mapping as any);
      const svg = renderLegendSVG(legend, { showBorder: false });

      // Should not have border on background rect (stroke-width="1"), but swatches still have borders
      expect(svg).not.toContain('stroke-width="1"');
    });

    it('applies custom background color', () => {
      const mapping: StyleMappingConfig = {
        property: 'fill',
        field: 'status',
        type: 'category',
        categories: { active: 'green' },
      };

      const legend = generateCategoryLegend(mapping as any);
      const svg = renderLegendSVG(legend, { backgroundColor: '#f0f0f0' });

      expect(svg).toContain('fill="#f0f0f0"');
    });

    it('escapes XML special characters in labels', () => {
      const mapping: StyleMappingConfig = {
        property: 'fill',
        field: 'message',
        type: 'category',
        categories: {
          'error & warning': 'red',
          'success > 90%': 'green',
        },
      };

      const legend = generateCategoryLegend(mapping as any);
      const svg = renderLegendSVG(legend);

      expect(svg).toContain('&amp;');
      expect(svg).toContain('&gt;');
      expect(svg).not.toContain('error & warning');
      expect(svg).not.toContain('success > 90%');
    });

    it('renders threshold legend with range labels', () => {
      const mapping: StyleMappingConfig = {
        property: 'fill',
        field: 'score',
        type: 'threshold',
        thresholds: [
          { value: 80, style: 'green' },
          { value: 60, style: 'yellow' },
          { value: 0, style: 'red' },
        ],
      };

      const legend = generateThresholdLegend(mapping as any);
      const svg = renderLegendSVG(legend);

      expect(svg).toContain('≥ 80');
      expect(svg).toContain('60 - 80');
      expect(svg).toContain('0 - 60');
    });
  });
});
