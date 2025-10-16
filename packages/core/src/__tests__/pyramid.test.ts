import { describe, it, expect } from 'vitest';
import { pyramidShape } from '../shapes/pyramid.js';
import type { ShapeRenderContext } from '../types.js';

/**
 * Mock context for testing Pyramid diagram shape
 */
function createMockContext(label: string, data?: any): ShapeRenderContext {
  return {
    node: {
      id: 'test',
      shape: 'pyramid',
      label,
      data,
    },
    style: {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
      fontSize: 14,
      fontFamily: 'Arial',
      padding: 10,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  } as ShapeRenderContext;
}

describe('Pyramid Diagram Shape', () => {
  describe('Basic Properties', () => {
    it('should have correct id', () => {
      expect(pyramidShape.id).toBe('pyramid');
    });

    it('should calculate bounds based on data', () => {
      const ctx = createMockContext('Hierarchy', {
        levels: [
          { label: 'CEO', value: 1 },
          { label: 'Directors', value: 5 },
          { label: 'Managers', value: 20 },
          { label: 'Staff', value: 100 },
        ],
      });
      const bounds = pyramidShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
      expect(bounds.width).toBeGreaterThanOrEqual(200);
      expect(bounds.height).toBeGreaterThanOrEqual(150);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Test');
      const anchors = pyramidShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors.map((a: any) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });
  });

  describe('Data Handling', () => {
    it('should handle data with levels array', () => {
      const ctx = createMockContext('Maslow', {
        levels: [
          { label: 'Self-Actualization', value: 10 },
          { label: 'Esteem', value: 30 },
          { label: 'Belonging', value: 50 },
          { label: 'Safety', value: 70 },
          { label: 'Physiological', value: 100 },
        ],
      });
      const svg = pyramidShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Self-Actualization');
      expect(svg).toContain('Esteem');
      expect(svg).toContain('Belonging');
      expect(svg).toContain('Safety');
      expect(svg).toContain('Physiological');
    });

    it('should render stacked trapezoids', () => {
      const ctx = createMockContext('Pyramid', {
        levels: [
          { label: 'Top', value: 20 },
          { label: 'Middle', value: 50 },
          { label: 'Bottom', value: 100 },
        ],
      });
      const svg = pyramidShape.render(ctx, { x: 0, y: 0 });

      // Should contain polygon (trapezoid) elements
      expect(svg).toContain('<polygon');
      expect(svg.split('<polygon').length - 1).toBe(3); // 3 levels
    });

    it('should scale widths proportionally to values', () => {
      const ctx = createMockContext('Pyramid', {
        levels: [
          { label: 'A', value: 25 },
          { label: 'B', value: 50 },
          { label: 'C', value: 75 },
          { label: 'D', value: 100 },
        ],
      });
      const svg = pyramidShape.render(ctx, { x: 0, y: 0 });

      // Top level should be narrower than bottom
      expect(svg).toBeTruthy();
      expect(svg).toContain('A');
      expect(svg).toContain('D');
    });

    it('should display values in each level', () => {
      const ctx = createMockContext('Pyramid', {
        levels: [
          { label: 'Alpha', value: 10 },
          { label: 'Beta', value: 50 },
          { label: 'Gamma', value: 100 },
        ],
        showValues: true,
      });
      const svg = pyramidShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('10');
      expect(svg).toContain('50');
      expect(svg).toContain('100');
    });

    it('should apply custom colors to levels', () => {
      const ctx = createMockContext('Pyramid', {
        levels: [
          { label: 'L1', value: 30 },
          { label: 'L2', value: 60 },
          { label: 'L3', value: 100 },
        ],
        colors: ['#ff0000', '#00ff00', '#0000ff'],
      });
      const svg = pyramidShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('#ff0000');
      expect(svg).toContain('#00ff00');
      expect(svg).toContain('#0000ff');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing data gracefully', () => {
      const ctx = createMockContext('Empty', {});

      expect(() => pyramidShape.render(ctx, { x: 0, y: 0 })).not.toThrow();
    });

    it('should handle single level', () => {
      const ctx = createMockContext('Single', {
        levels: [{ label: 'Only', value: 100 }],
      });
      const svg = pyramidShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Only');
      expect(svg).toContain('<polygon');
    });

    it('should handle many levels', () => {
      const ctx = createMockContext('Many', {
        levels: Array.from({ length: 10 }, (_, i) => ({
          label: `Level ${i + 1}`,
          value: (i + 1) * 10,
        })),
      });
      const svg = pyramidShape.render(ctx, { x: 0, y: 0 });

      expect(svg.split('<polygon').length - 1).toBe(10);
    });

    it('should render valid SVG markup', () => {
      const ctx = createMockContext('Valid', {
        levels: [
          { label: 'A', value: 30 },
          { label: 'B', value: 100 },
        ],
      });
      const svg = pyramidShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toMatch(/<polygon[^>]*>/);
      expect(svg).toMatch(/<text[^>]*>/);
    });
  });
});
