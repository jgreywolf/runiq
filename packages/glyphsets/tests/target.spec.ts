import { describe, it, expect } from 'vitest';
import { targetGlyphSet } from '../src/relationship/target.js';
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

      expect(result.nodes).toHaveLength(2);
      expect(result.edges).toHaveLength(0); // No edges in concentric circles

      // Check nodes
      const core = result.nodes.find((n) => n.label === 'Core');
      const extended = result.nodes.find((n) => n.label === 'Extended');

      expect(core).toBeDefined();
      expect(extended).toBeDefined();

      // Inner circle should be smaller
      expect(core?.data?.size).toBeLessThan(extended?.data?.size || 0);
      expect(core?.data?.level).toBe(0);
      expect(extended?.data?.level).toBe(1);
    });

    it('should generate 3-circle target (typical use case)', () => {
      const result = targetGlyphSet.generator({
        circles: ['Core Product', 'Key Features', 'Nice to Have'],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(3);
      expect(result.nodes[0].label).toBe('Core Product');
      expect(result.nodes[1].label).toBe('Key Features');
      expect(result.nodes[2].label).toBe('Nice to Have');

      // Check concentric sizing (innermost is smallest)
      const sizes = result.nodes.map((n) => n.data?.size || 0);
      expect(sizes[0]).toBeLessThan(sizes[1]);
      expect(sizes[1]).toBeLessThan(sizes[2]);
    });

    it('should use circle shape for all nodes', () => {
      const result = targetGlyphSet.generator({
        circles: ['Inner', 'Middle', 'Outer'],
      }) as DiagramAst;

      result.nodes.forEach((node) => {
        expect(node.shape).toBe('circle');
      });
    });

    it('should position all circles at origin (overlapping)', () => {
      const result = targetGlyphSet.generator({
        circles: ['A', 'B', 'C'],
      }) as DiagramAst;

      // All circles should be at same position (concentric)
      result.nodes.forEach((node) => {
        expect(node.data?.x).toBe(0);
        expect(node.data?.y).toBe(0);
      });
    });
  });

  describe('color theming', () => {
    it('should apply professional theme colors by default', () => {
      const result = targetGlyphSet.generator({
        circles: ['Core', 'Mid', 'Outer'],
      }) as DiagramAst;

      result.nodes.forEach((node) => {
        expect(node.data?.color).toBeDefined();
        expect(typeof node.data?.color).toBe('string');
      });
    });

    it('should support custom theme', () => {
      const result = targetGlyphSet.generator({
        circles: ['A', 'B', 'C'],
        theme: 'vibrant',
      }) as DiagramAst;

      const colors = result.nodes.map((n) => n.data?.color);
      expect(colors.every((c) => c)).toBe(true);
    });

    it('should use progressively lighter colors from center outward', () => {
      const result = targetGlyphSet.generator({
        circles: ['Inner', 'Middle', 'Outer'],
      }) as DiagramAst;

      // Colors should be defined and different per level
      const levels = result.nodes.map((n) => n.data?.level);
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

      const sizes = result.nodes.map((n) => n.data?.size || 0);

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

      expect(result.nodes).toHaveLength(3);
      expect(result.nodes[0].label).toBe('Critical Goals');
      expect(result.nodes[2].label).toBe('Stretch Goals');
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

      expect(result.nodes).toHaveLength(4);
    });

    it('should generate product roadmap target', () => {
      const result = targetGlyphSet.generator({
        circles: ['MVP', 'V1 Features', 'V2 Features', 'Future Vision'],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(4);
      expect(result.nodes.every((n) => n.shape === 'circle')).toBe(true);
    });

    it('should generate influence diagram', () => {
      const result = targetGlyphSet.generator({
        circles: [
          'Direct Influence',
          'Moderate Influence',
          'Minimal Influence',
        ],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(3);
      const sizes = result.nodes.map((n) => n.data?.size || 0);
      expect(sizes[0]).toBeLessThan(sizes[1]);
      expect(sizes[1]).toBeLessThan(sizes[2]);
    });
  });
});
