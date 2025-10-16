import { describe, it, expect } from 'vitest';
import { venn2Shape } from '../shapes/venn-2.js';
import { venn3Shape } from '../shapes/venn-3.js';
import { venn4Shape } from '../shapes/venn-4.js';
import type { ShapeRenderContext } from '../types.js';

/**
 * Mock context for testing Venn diagram shapes
 */
function createMockContext(label: string, data?: any): ShapeRenderContext {
  return {
    node: {
      id: 'test',
      shape: 'venn-2',
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

describe('Venn Diagram Shapes', () => {
  describe('2-Circle Venn Diagram', () => {
    it('should have correct id', () => {
      expect(venn2Shape.id).toBe('venn-2');
    });

    it('should calculate bounds with minimum size', () => {
      const ctx = createMockContext('Venn Diagram');
      const bounds = venn2Shape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(150);
      expect(bounds.height).toBeGreaterThanOrEqual(150);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Test');
      const anchors = venn2Shape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render two overlapping circles', () => {
      const ctx = createMockContext('Venn');
      const svg = venn2Shape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle'); // Should have circles
      expect(svg.split('<circle').length - 1).toBe(2); // Exactly 2 circles
    });

    it('should handle simple data format with counts', () => {
      const ctx = createMockContext('Market Analysis', {
        setA: 100,
        setB: 80,
        intersection: 30,
        labelA: 'Product A',
        labelB: 'Product B',
      });
      const svg = venn2Shape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Product A');
      expect(svg).toContain('Product B');
      expect(svg).toContain('100');
      expect(svg).toContain('80');
      expect(svg).toContain('30');
    });

    it('should calculate only-A and only-B values', () => {
      const ctx = createMockContext('Test', {
        setA: 100,
        setB: 80,
        intersection: 30,
      });
      const svg = venn2Shape.render(ctx, { x: 0, y: 0 });

      // Only A = 100 - 30 = 70
      // Only B = 80 - 30 = 50
      expect(svg).toContain('70'); // Only A
      expect(svg).toContain('50'); // Only B
      expect(svg).toContain('30'); // Intersection
    });

    it('should work with default labels when not provided', () => {
      const ctx = createMockContext('Venn', {
        setA: 50,
        setB: 60,
        intersection: 20,
      });
      const svg = venn2Shape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Set A');
      expect(svg).toContain('Set B');
    });

    it('should apply custom colors to circles', () => {
      const ctx = createMockContext('Venn', {
        setA: 50,
        setB: 60,
        intersection: 20,
        colors: ['#4299e1', '#48bb78'],
      });
      const svg = venn2Shape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('#4299e1');
      expect(svg).toContain('#48bb78');
    });
  });

  describe('3-Circle Venn Diagram', () => {
    it('should have correct id', () => {
      expect(venn3Shape.id).toBe('venn-3');
    });

    it('should calculate bounds with minimum size', () => {
      const ctx = createMockContext('Three Sets');
      const bounds = venn3Shape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(180);
      expect(bounds.height).toBeGreaterThanOrEqual(180);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Test');
      const anchors = venn3Shape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render three overlapping circles', () => {
      const ctx = createMockContext('Venn');
      const svg = venn3Shape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg.split('<circle').length - 1).toBe(3); // Exactly 3 circles
    });

    it('should handle complete 3-set data format', () => {
      const ctx = createMockContext('Skills Analysis', {
        setA: 120,
        setB: 100,
        setC: 90,
        AB: 30,
        AC: 25,
        BC: 20,
        ABC: 10,
        labelA: 'JavaScript',
        labelB: 'Python',
        labelC: 'TypeScript',
      });
      const svg = venn3Shape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('JavaScript');
      expect(svg).toContain('Python');
      expect(svg).toContain('TypeScript');
      expect(svg).toContain('120');
      expect(svg).toContain('10'); // Center intersection
    });

    it('should calculate only-A, only-B, only-C values', () => {
      const ctx = createMockContext('Test', {
        setA: 100,
        setB: 80,
        setC: 70,
        AB: 20,
        AC: 15,
        BC: 10,
        ABC: 5,
      });
      const svg = venn3Shape.render(ctx, { x: 0, y: 0 });

      // Only A = 100 - 20 - 15 + 5 = 70
      // Only B = 80 - 20 - 10 + 5 = 55
      // Only C = 70 - 15 - 10 + 5 = 50
      // Only AB = 20 - 5 = 15
      // Only AC = 15 - 5 = 10
      // Only BC = 10 - 5 = 5
      expect(svg).toContain('70'); // Only A
      expect(svg).toContain('55'); // Only B
      expect(svg).toContain('50'); // Only C
    });

    it('should work with default labels', () => {
      const ctx = createMockContext('Venn', {
        setA: 50,
        setB: 60,
        setC: 70,
        AB: 10,
        AC: 8,
        BC: 6,
        ABC: 3,
      });
      const svg = venn3Shape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Set A');
      expect(svg).toContain('Set B');
      expect(svg).toContain('Set C');
    });

    it('should apply custom colors to three circles', () => {
      const ctx = createMockContext('Venn', {
        setA: 50,
        setB: 60,
        setC: 70,
        AB: 10,
        AC: 8,
        BC: 6,
        ABC: 3,
        colors: ['#4299e1', '#48bb78', '#ed8936'],
      });
      const svg = venn3Shape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('#4299e1');
      expect(svg).toContain('#48bb78');
      expect(svg).toContain('#ed8936');
    });
  });

  describe('Venn Diagram Integration', () => {
    it('2-circle should have consistent bounds and render size', () => {
      const ctx = createMockContext('Test');
      const bounds = venn2Shape.bounds(ctx);
      const svg = venn2Shape.render(ctx, { x: 0, y: 0 });

      // SVG should respect calculated bounds
      expect(svg).toBeTruthy();
      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('3-circle should be larger than 2-circle', () => {
      const ctx2 = createMockContext('Two');
      const ctx3 = createMockContext('Three');

      const bounds2 = venn2Shape.bounds(ctx2);
      const bounds3 = venn3Shape.bounds(ctx3);

      expect(bounds3.width).toBeGreaterThan(bounds2.width);
      expect(bounds3.height).toBeGreaterThan(bounds2.height);
    });

    it('should handle missing or invalid data gracefully', () => {
      const ctx = createMockContext('Test', {});

      expect(() => venn2Shape.render(ctx, { x: 0, y: 0 })).not.toThrow();
      expect(() => venn3Shape.render(ctx, { x: 0, y: 0 })).not.toThrow();
      expect(() => venn4Shape.render(ctx, { x: 0, y: 0 })).not.toThrow();
    });

    it('should render valid SVG markup', () => {
      const ctx = createMockContext('Test', {
        setA: 100,
        setB: 80,
        intersection: 30,
      });
      const svg = venn2Shape.render(ctx, { x: 0, y: 0 });

      // Should be well-formed XML
      expect(svg).toMatch(/<circle[^>]*>/);
      expect(svg).toMatch(/<text[^>]*>/);
    });
  });

  describe('4-Circle Venn Diagram', () => {
    it('should have correct id', () => {
      expect(venn4Shape.id).toBe('venn-4');
    });

    it('should calculate bounds with minimum size', () => {
      const ctx = createMockContext('Four Sets');
      const bounds = venn4Shape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(190);
      expect(bounds.height).toBeGreaterThanOrEqual(190);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Test');
      const anchors = venn4Shape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render four overlapping circles', () => {
      const ctx = createMockContext('Venn');
      const svg = venn4Shape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg.split('<circle').length - 1).toBe(4); // Exactly 4 circles
    });

    it('should handle complete 4-set data format', () => {
      const ctx = createMockContext('Tech Stack Analysis', {
        setA: 1000,
        setB: 900,
        setC: 800,
        setD: 700,
        AB: 250,
        AC: 220,
        AD: 200,
        BC: 190,
        BD: 180,
        CD: 170,
        ABC: 80,
        ABD: 70,
        ACD: 60,
        BCD: 50,
        ABCD: 25,
        labelA: 'React',
        labelB: 'Vue',
        labelC: 'Angular',
        labelD: 'Svelte',
      });
      const svg = venn4Shape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('React');
      expect(svg).toContain('Vue');
      expect(svg).toContain('Angular');
      expect(svg).toContain('Svelte');
      expect(svg).toContain('25'); // Center ABCD intersection
    });

    it('should work with default labels', () => {
      const ctx = createMockContext('Venn', {
        setA: 100,
        setB: 90,
        setC: 80,
        setD: 70,
        AB: 30,
        AC: 25,
        AD: 20,
        BC: 22,
        BD: 18,
        CD: 15,
        ABC: 10,
        ABD: 8,
        ACD: 7,
        BCD: 6,
        ABCD: 3,
      });
      const svg = venn4Shape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Set A');
      expect(svg).toContain('Set B');
      expect(svg).toContain('Set C');
      expect(svg).toContain('Set D');
    });

    it('should apply custom colors to four circles', () => {
      const ctx = createMockContext('Venn', {
        setA: 100,
        setB: 90,
        setC: 80,
        setD: 70,
        AB: 30,
        AC: 25,
        AD: 20,
        BC: 22,
        BD: 18,
        CD: 15,
        ABC: 10,
        ABD: 8,
        ACD: 7,
        BCD: 6,
        ABCD: 3,
        colors: ['#4299e1', '#48bb78', '#ed8936', '#9f7aea'],
      });
      const svg = venn4Shape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('#4299e1');
      expect(svg).toContain('#48bb78');
      expect(svg).toContain('#ed8936');
      expect(svg).toContain('#9f7aea');
    });

    it('should be larger than 3-circle diagram', () => {
      const ctx3 = createMockContext('Three');
      const ctx4 = createMockContext('Four');

      const bounds3 = venn3Shape.bounds(ctx3);
      const bounds4 = venn4Shape.bounds(ctx4);

      expect(bounds4.width).toBeGreaterThanOrEqual(bounds3.width);
      expect(bounds4.height).toBeGreaterThanOrEqual(bounds3.height);
    });
  });
});
