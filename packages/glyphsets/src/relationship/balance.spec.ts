import { describe, it, expect } from 'vitest';
import { balanceGlyphSet } from './balance.js';
import type { DiagramAst } from '@runiq/core';

describe('balanceGlyphSet', () => {
  describe('metadata', () => {
    it('should have correct id', () => {
      expect(balanceGlyphSet.id).toBe('balance');
    });

    it('should have correct name', () => {
      expect(balanceGlyphSet.name).toBe('Balance Diagram');
    });

    it('should have correct category', () => {
      expect(balanceGlyphSet.category).toBe('relationship');
    });

    it('should have appropriate item limits', () => {
      expect(balanceGlyphSet.minItems).toBe(2);
      expect(balanceGlyphSet.maxItems).toBe(2);
    });

    it('should have correct tags', () => {
      expect(balanceGlyphSet.tags).toContain('balance');
      expect(balanceGlyphSet.tags).toContain('scale');
      expect(balanceGlyphSet.tags).toContain('comparison');
    });
  });

  describe('parameter validation', () => {
    it('should require sides parameter', () => {
      expect(() => {
        balanceGlyphSet.generator({});
      }).toThrow('Parameter "sides" must be an array with exactly 2 items');
    });

    it('should require exactly 2 sides', () => {
      expect(() => {
        balanceGlyphSet.generator({ sides: ['Only One'] });
      }).toThrow('Balance diagram requires exactly 2 sides (left and right)');
    });

    it('should reject more than 2 sides', () => {
      expect(() => {
        balanceGlyphSet.generator({ sides: ['Left', 'Middle', 'Right'] });
      }).toThrow('Balance diagram requires exactly 2 sides (left and right)');
    });
  });

  describe('basic balance generation', () => {
    it('should generate 2-side balance', () => {
      const result = balanceGlyphSet.generator({
        sides: ['Pros', 'Cons'],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1); // Single composite node
      expect(result.edges).toHaveLength(0); // No edges
      expect(result.nodes[0].shape).toBe('balance');
    });

    it('should store sides data correctly', () => {
      const result = balanceGlyphSet.generator({
        sides: ['Benefits', 'Risks'],
      }) as DiagramAst;

      const balanceNode = result.nodes[0];
      expect(balanceNode.data?.sides).toBeDefined();
      expect(balanceNode.data?.sides).toHaveLength(2);
    });

    it('should use TB direction', () => {
      const result = balanceGlyphSet.generator({
        sides: ['Left', 'Right'],
      }) as DiagramAst;

      expect(result.direction).toBe('TB');
    });
  });

  describe('color theming', () => {
    it('should apply default theme colors', () => {
      const result = balanceGlyphSet.generator({
        sides: ['Option A', 'Option B'],
      }) as DiagramAst;

      // Check that colors are applied from professional theme
      expect(result.nodes[0].data?.sides[0].color).toBeDefined();
      expect(result.nodes[0].data?.sides[1].color).toBeDefined();
      // Professional theme colors
      expect(result.nodes[0].data?.sides[0].color).toBe('#546E7A');
      expect(result.nodes[0].data?.sides[1].color).toBe('#607D8B');
    });

    it('should support custom theme colors', () => {
      const result = balanceGlyphSet.generator({
        sides: ['Pros', 'Cons'],
        theme: 'vibrant',
      }) as DiagramAst;

      // Check that colors are applied from vibrant theme
      expect(result.nodes[0].data?.sides[0].color).toBe('#E74C3C');
      expect(result.nodes[0].data?.sides[1].color).toBe('#3498DB');
    });
  });

  describe('real-world use cases', () => {
    it('should generate pros vs cons', () => {
      const result = balanceGlyphSet.generator({
        sides: ['Pros', 'Cons'],
        theme: 'professional',
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].shape).toBe('balance');
    });

    it('should generate cost vs benefit', () => {
      const result = balanceGlyphSet.generator({
        sides: ['Costs', 'Benefits'],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
    });

    it('should generate risk vs reward', () => {
      const result = balanceGlyphSet.generator({
        sides: ['Risks', 'Rewards'],
        theme: 'warm',
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
    });

    it('should generate advantages vs disadvantages', () => {
      const result = balanceGlyphSet.generator({
        sides: ['Advantages', 'Disadvantages'],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
    });

    it('should generate option comparison', () => {
      const result = balanceGlyphSet.generator({
        sides: ['Option A', 'Option B'],
        theme: 'cool',
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
    });
  });
});
