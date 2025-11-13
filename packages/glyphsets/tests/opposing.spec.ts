import { describe, it, expect } from 'vitest';
import { opposingGlyphSet } from '../src/relationship/opposing.js';
import type { DiagramAst } from '@runiq/core';

describe('opposingGlyphSet', () => {
  describe('metadata', () => {
    it('should have correct id', () => {
      expect(opposingGlyphSet.id).toBe('opposing');
    });

    it('should have correct name', () => {
      expect(opposingGlyphSet.name).toBe('Opposing Diagram');
    });

    it('should have correct category', () => {
      expect(opposingGlyphSet.category).toBe('relationship');
    });

    it('should have appropriate item limits', () => {
      expect(opposingGlyphSet.minItems).toBe(2);
      expect(opposingGlyphSet.maxItems).toBe(4);
    });

    it('should have correct tags', () => {
      expect(opposingGlyphSet.tags).toContain('opposing');
      expect(opposingGlyphSet.tags).toContain('conflict');
      expect(opposingGlyphSet.tags).toContain('tension');
    });
  });

  describe('parameter validation', () => {
    it('should require items parameter', () => {
      expect(() => {
        opposingGlyphSet.generator({});
      }).toThrow('items');
    });

    it('should require at least 2 items', () => {
      expect(() => {
        opposingGlyphSet.generator({
          items: ['Only One'],
        });
      }).toThrow('2-4 items');
    });

    it('should reject more than 4 items', () => {
      expect(() => {
        opposingGlyphSet.generator({
          items: ['A', 'B', 'C', 'D', 'E'],
        });
      }).toThrow('2-4 items');
    });
  });

  describe('basic opposing generation', () => {
    it('should generate 2-item opposition', () => {
      const result = opposingGlyphSet.generator({
        items: ['Traditional', 'Innovative'],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1); // Composite node
      expect(result.edges).toHaveLength(0); // No separate edges
      expect(result.nodes[0].shape).toBe('opposing');
      expect(result.nodes[0].data?.items).toHaveLength(2);
    });

    it('should store items data correctly', () => {
      const result = opposingGlyphSet.generator({
        items: ['Old', 'New'],
      }) as DiagramAst;

      const items = result.nodes[0].data?.items as Array<{
        label: string;
        color: string;
      }>;
      expect(items[0].label).toBe('Old');
      expect(items[1].label).toBe('New');
      expect(items[0].color).toBeDefined();
      expect(items[1].color).toBeDefined();
    });

    it('should use TB direction', () => {
      const result = opposingGlyphSet.generator({
        items: ['A', 'B'],
      }) as DiagramAst;

      expect(result.direction).toBe('TB');
    });
  });

  describe('triangular opposition (3 items)', () => {
    it('should generate 3 items in composite node', () => {
      const result = opposingGlyphSet.generator({
        items: ['Rock', 'Paper', 'Scissors'],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1); // Composite
      expect(result.nodes[0].data?.items).toHaveLength(3);
      expect(result.nodes[0].data?.pattern).toBe(3);

      const items = result.nodes[0].data?.items as Array<{ label: string }>;
      expect(items[0].label).toBe('Rock');
      expect(items[1].label).toBe('Paper');
      expect(items[2].label).toBe('Scissors');
    });

    it('should have all colors defined', () => {
      const result = opposingGlyphSet.generator({
        items: ['A', 'B', 'C'],
      }) as DiagramAst;

      const items = result.nodes[0].data?.items as Array<{ color: string }>;
      items.forEach((item) => {
        expect(item.color).toBeDefined();
        expect(typeof item.color).toBe('string');
      });
    });
  });

  describe('square opposition (4 items)', () => {
    it('should generate 4 items in composite node', () => {
      const result = opposingGlyphSet.generator({
        items: ['North', 'East', 'South', 'West'],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1); // Composite
      expect(result.nodes[0].data?.items).toHaveLength(4);
      expect(result.nodes[0].data?.pattern).toBe(4);
    });

    it('should use opposing shape', () => {
      const result = opposingGlyphSet.generator({
        items: ['A', 'B', 'C', 'D'],
      }) as DiagramAst;

      expect(result.nodes[0].shape).toBe('opposing');
    });
  });

  describe('color theming', () => {
    it('should apply default theme colors', () => {
      const result = opposingGlyphSet.generator({
        items: ['Option A', 'Option B'],
      }) as DiagramAst;

      const items = result.nodes[0].data?.items as Array<{ color: string }>;
      expect(items[0].color).toBeDefined();
      expect(items[1].color).toBeDefined();
      // Professional theme colors
      expect(items[0].color).toBe('#546E7A');
      expect(items[1].color).toBe('#607D8B');
    });

    it('should support custom theme colors', () => {
      const result = opposingGlyphSet.generator({
        items: ['Pro', 'Con'],
        theme: 'vibrant',
      }) as DiagramAst;

      const items = result.nodes[0].data?.items as Array<{ color: string }>;
      // Vibrant theme colors
      expect(items[0].color).toBe('#E74C3C');
      expect(items[1].color).toBe('#3498DB');
    });
  });

  describe('real-world use cases', () => {
    it('should generate old vs new debate', () => {
      const result = opposingGlyphSet.generator({
        items: ['Traditional Methods', 'Modern Approaches'],
        theme: 'colorful',
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].data?.items).toHaveLength(2);
    });

    it('should generate supply vs demand opposition', () => {
      const result = opposingGlyphSet.generator({
        items: ['Supply', 'Demand'],
        theme: 'professional',
      }) as DiagramAst;

      const items = result.nodes[0].data?.items as Array<{ label: string }>;
      expect(items[0].label).toBe('Supply');
      expect(items[1].label).toBe('Demand');
    });

    it('should generate rock-paper-scissors', () => {
      const result = opposingGlyphSet.generator({
        items: ['Rock', 'Paper', 'Scissors'],
        theme: 'vibrant',
      }) as DiagramAst;

      expect(result.nodes[0].data?.items).toHaveLength(3);
      expect(result.nodes[0].data?.pattern).toBe(3);
    });

    it('should generate four competing philosophies', () => {
      const result = opposingGlyphSet.generator({
        items: ['Idealism', 'Realism', 'Pragmatism', 'Skepticism'],
        theme: 'cool',
      }) as DiagramAst;

      expect(result.nodes[0].data?.items).toHaveLength(4);
      expect(result.nodes[0].data?.pattern).toBe(4);
    });

    it('should generate technology debate', () => {
      const result = opposingGlyphSet.generator({
        items: ['Open Source', 'Proprietary', 'Hybrid'],
        theme: 'warm',
      }) as DiagramAst;

      expect(result.nodes[0].data?.items).toHaveLength(3);
      expect(result.nodes[0].data?.pattern).toBe(3);
    });
  });
});
