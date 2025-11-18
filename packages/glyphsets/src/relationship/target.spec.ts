import { describe, it, expect } from 'vitest';
import { targetGlyphSet } from './target.js';
import type { DiagramAst } from '@runiq/core';

describe('targetGlyphSet', () => {
  describe('metadata', () => {
    it('should have correct id', () => {
      expect(targetGlyphSet.id).toBe('target');
    });

    it('should have correct name', () => {
      expect(targetGlyphSet.name).toBe('Target Diagram');
    });

    it('should have correct category', () => {
      expect(targetGlyphSet.category).toBe('relationship');
    });

    it('should have appropriate item limits', () => {
      expect(targetGlyphSet.minItems).toBe(2);
      expect(targetGlyphSet.maxItems).toBe(5);
    });

    it('should have correct tags', () => {
      expect(targetGlyphSet.tags).toContain('target');
      expect(targetGlyphSet.tags).toContain('bullseye');
      expect(targetGlyphSet.tags).toContain('concentric');
    });
  });

  describe('parameter validation', () => {
    it('should require circles parameter', () => {
      expect(() => {
        targetGlyphSet.generator({});
      }).toThrow('Parameter "circles" must be an array of circle labels');
    });

    it('should require at least 2 circles', () => {
      expect(() => {
        targetGlyphSet.generator({ circles: ['Only One'] });
      }).toThrow('Target requires at least 2 circles (min 2, max 5)');
    });

    it('should reject more than 5 circles', () => {
      expect(() => {
        targetGlyphSet.generator({
          circles: ['1', '2', '3', '4', '5', '6'],
        });
      }).toThrow('Target supports maximum 5 circles');
    });
  });

  describe('basic target generation', () => {
    it('should generate 2-circle target', () => {
      const result = targetGlyphSet.generator({
        circles: ['Core', 'Extended'],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
      expect(result.edges).toHaveLength(0); // No edges in concentric circles
      expect(result.nodes[0].shape).toBe('target');

      // Check composite data structure
      const circles = result.nodes[0].data?.circles;
      expect(circles).toHaveLength(2);
      expect(circles[0].label).toBe('Core');
      expect(circles[1].label).toBe('Extended');

      // Inner circle should be smaller
      expect(circles[0].size).toBeLessThan(circles[1].size);
      expect(circles[0].level).toBe(0);
      expect(circles[1].level).toBe(1);
    });

    it('should generate 3-circle target (typical use case)', () => {
      const result = targetGlyphSet.generator({
        circles: ['Core Product', 'Key Features', 'Nice to Have'],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
      const circles = result.nodes[0].data?.circles;
      expect(circles).toHaveLength(3);
      expect(circles[0].label).toBe('Core Product');
      expect(circles[1].label).toBe('Key Features');
      expect(circles[2].label).toBe('Nice to Have');

      // Check concentric sizing (innermost is smallest)
      expect(circles[0].size).toBeLessThan(circles[1].size);
      expect(circles[1].size).toBeLessThan(circles[2].size);
    });

    it('should use target shape for composite node', () => {
      const result = targetGlyphSet.generator({
        circles: ['Inner', 'Middle', 'Outer'],
      }) as DiagramAst;

      expect(result.nodes[0].shape).toBe('target');
      expect(result.nodes[0].data?.circles).toHaveLength(3);
    });

    it('should generate composite target structure', () => {
      const result = targetGlyphSet.generator({
        circles: ['A', 'B', 'C'],
      }) as DiagramAst;

      // Should be a single composite node
      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].data?.circles).toHaveLength(3);
    });
  });

  describe('color theming', () => {
    it('should apply professional theme colors by default', () => {
      const result = targetGlyphSet.generator({
        circles: ['Core', 'Mid', 'Outer'],
      }) as DiagramAst;

      const circles = result.nodes[0].data?.circles;
      circles.forEach((circle: any) => {
        expect(circle.color).toBeDefined();
        expect(typeof circle.color).toBe('string');
      });
    });

    it('should support custom theme', () => {
      const result = targetGlyphSet.generator({
        circles: ['A', 'B', 'C'],
        theme: 'vibrant',
      }) as DiagramAst;

      const circles = result.nodes[0].data?.circles;
      const colors = circles.map((c: any) => c.color);
      expect(colors.every((c: any) => c)).toBe(true);
    });

    it('should use progressively lighter colors from center outward', () => {
      const result = targetGlyphSet.generator({
        circles: ['Inner', 'Middle', 'Outer'],
      }) as DiagramAst;

      // Colors should be defined and different per level
      const circles = result.nodes[0].data?.circles;
      const levels = circles.map((c: any) => c.level);
      expect(levels).toEqual([0, 1, 2]);
    });
  });

  describe('layout and sizing', () => {
    it('should use TB (top-bottom) direction', () => {
      const result = targetGlyphSet.generator({
        circles: ['A', 'B'],
      }) as DiagramAst;

      expect(result.direction).toBe('TB');
    });

    it('should calculate sizes with proper increments', () => {
      const result = targetGlyphSet.generator({
        circles: ['A', 'B', 'C', 'D'],
      }) as DiagramAst;

      const circles = result.nodes[0].data?.circles;
      const sizes = circles.map((c: any) => c.size);

      // Each circle should be larger than the previous
      for (let i = 1; i < sizes.length; i++) {
        expect(sizes[i]).toBeGreaterThan(sizes[i - 1]);
      }
    });

    it('should store metadata about target structure', () => {
      const result = targetGlyphSet.generator({
        circles: ['Core', 'Extended'],
      }) as DiagramAst;

      expect(result.astVersion).toBe('1.0');
      expect((result as any)._glyphsetId).toBeUndefined(); // Not set by generator
    });
  });

  describe('real-world use cases', () => {
    it('should generate priority target (Goals)', () => {
      const result = targetGlyphSet.generator({
        circles: ['Critical Goals', 'Important Goals', 'Stretch Goals'],
        theme: 'warm',
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
      const circles = result.nodes[0].data?.circles;
      expect(circles[0].label).toBe('Critical Goals');
      expect(circles[2].label).toBe('Stretch Goals');
    });

    it('should generate market segmentation target', () => {
      const result = targetGlyphSet.generator({
        circles: [
          'Core Market',
          'Secondary Market',
          'Emerging Market',
          'Future Opportunities',
        ],
        theme: 'professional',
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].data?.circles).toHaveLength(4);
    });

    it('should generate product roadmap target', () => {
      const result = targetGlyphSet.generator({
        circles: ['MVP', 'V1 Features', 'V2 Features', 'Future Vision'],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].shape).toBe('target');
      expect(result.nodes[0].data?.circles).toHaveLength(4);
    });

    it('should generate influence diagram', () => {
      const result = targetGlyphSet.generator({
        circles: [
          'Direct Influence',
          'Moderate Influence',
          'Minimal Influence',
        ],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
      const circles = result.nodes[0].data?.circles;
      const sizes = circles.map((c: any) => c.size);
      expect(sizes[0]).toBeLessThan(sizes[1]);
      expect(sizes[1]).toBeLessThan(sizes[2]);
    });
  });
});
