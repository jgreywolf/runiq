import { describe, it, expect } from 'vitest';
import { puzzleGlyphSet } from '../src/relationship/puzzle.js';
import type { DiagramAst } from '@runiq/core';

describe('puzzleGlyphSet', () => {
  describe('metadata', () => {
    it('should have correct id', () => {
      expect(puzzleGlyphSet.id).toBe('puzzle');
    });

    it('should have correct name', () => {
      expect(puzzleGlyphSet.name).toBe('Puzzle Diagram');
    });

    it('should have correct category', () => {
      expect(puzzleGlyphSet.category).toBe('relationship');
    });

    it('should have appropriate item limits', () => {
      expect(puzzleGlyphSet.minItems).toBe(2);
      expect(puzzleGlyphSet.maxItems).toBe(6);
    });

    it('should have correct tags', () => {
      expect(puzzleGlyphSet.tags).toContain('relationship');
      expect(puzzleGlyphSet.tags).toContain('puzzle');
      expect(puzzleGlyphSet.tags).toContain('integration');
    });
  });

  describe('parameter validation', () => {
    it('should require items parameter', () => {
      expect(() => {
        puzzleGlyphSet.generator({});
      }).toThrow('items');
    });

    it('should require at least 2 items', () => {
      expect(() => {
        puzzleGlyphSet.generator({
          items: ['Only One'],
        });
      }).toThrow('2');
    });

    it('should reject more than 6 items', () => {
      expect(() => {
        puzzleGlyphSet.generator({
          items: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        });
      }).toThrow('6');
    });
  });

  describe('basic puzzle generation', () => {
    it('should generate puzzle with 2 pieces', () => {
      const result = puzzleGlyphSet.generator({
        items: ['Frontend', 'Backend'],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].shape).toBe('puzzle');
      expect(result.edges).toHaveLength(0);
    });

    it('should store pieces data correctly', () => {
      const result = puzzleGlyphSet.generator({
        items: ['UI', 'Logic', 'Data'],
      }) as DiagramAst;

      const node = result.nodes[0];
      expect(node.data?.pieces).toHaveLength(3);
      expect(node.data?.pieces?.[0]?.label).toBe('UI');
      expect(node.data?.pieces?.[1]?.label).toBe('Logic');
      expect(node.data?.pieces?.[2]?.label).toBe('Data');
    });

    it('should use LR direction', () => {
      const result = puzzleGlyphSet.generator({
        items: ['A', 'B'],
      }) as DiagramAst;

      expect(result.direction).toBe('LR');
    });
  });

  describe('multiple pieces', () => {
    it('should handle 3 pieces', () => {
      const result = puzzleGlyphSet.generator({
        items: ['A', 'B', 'C'],
      }) as DiagramAst;

      expect(result.nodes[0].data?.pieces).toHaveLength(3);
    });

    it('should handle 4 pieces', () => {
      const result = puzzleGlyphSet.generator({
        items: ['A', 'B', 'C', 'D'],
      }) as DiagramAst;

      expect(result.nodes[0].data?.pieces).toHaveLength(4);
    });

    it('should handle 5 pieces', () => {
      const result = puzzleGlyphSet.generator({
        items: ['A', 'B', 'C', 'D', 'E'],
      }) as DiagramAst;

      expect(result.nodes[0].data?.pieces).toHaveLength(5);
    });

    it('should handle 6 pieces (maximum)', () => {
      const result = puzzleGlyphSet.generator({
        items: ['A', 'B', 'C', 'D', 'E', 'F'],
      }) as DiagramAst;

      expect(result.nodes[0].data?.pieces).toHaveLength(6);
    });
  });

  describe('color theming', () => {
    it('should apply default theme colors', () => {
      const result = puzzleGlyphSet.generator({
        items: ['Piece 1', 'Piece 2', 'Piece 3'],
      }) as DiagramAst;

      const node = result.nodes[0];
      expect(node.data?.pieces?.[0]?.color).toBeDefined();
      expect(node.data?.pieces?.[1]?.color).toBeDefined();
      expect(node.data?.pieces?.[2]?.color).toBeDefined();
    });

    it('should support custom theme colors', () => {
      const result = puzzleGlyphSet.generator({
        items: ['A', 'B', 'C', 'D'],
        theme: 'vibrant',
      }) as DiagramAst;

      const node = result.nodes[0];
      expect(node.data?.pieces?.[0]?.color).toBeDefined();
    });

    it('should use different colors for each piece', () => {
      const result = puzzleGlyphSet.generator({
        items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
      }) as DiagramAst;

      const node = result.nodes[0];
      const colors = node.data?.pieces?.map((p: any) => p.color);

      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(colors?.length);
    });
  });

  describe('real-world use cases', () => {
    it('should generate system integration puzzle', () => {
      const result = puzzleGlyphSet.generator({
        items: ['Frontend', 'Backend', 'Database', 'API'],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].data?.pieces).toHaveLength(4);
    });

    it('should generate team collaboration', () => {
      const result = puzzleGlyphSet.generator({
        items: ['Design', 'Development', 'Testing', 'Deployment'],
        theme: 'cool',
      }) as DiagramAst;

      expect(result.nodes[0].data?.pieces).toHaveLength(4);
    });

    it('should generate solution components', () => {
      const result = puzzleGlyphSet.generator({
        items: ['Problem', 'Analysis', 'Solution'],
      }) as DiagramAst;

      expect(result.nodes[0].data?.pieces).toHaveLength(3);
    });

    it('should generate business model', () => {
      const result = puzzleGlyphSet.generator({
        items: [
          'Value Proposition',
          'Customer Segments',
          'Revenue Streams',
          'Key Resources',
          'Key Partners',
        ],
      }) as DiagramAst;

      expect(result.nodes[0].data?.pieces).toHaveLength(5);
    });

    it('should generate project phases', () => {
      const result = puzzleGlyphSet.generator({
        items: [
          'Planning',
          'Design',
          'Development',
          'Testing',
          'Deployment',
          'Maintenance',
        ],
        theme: 'monochrome',
      }) as DiagramAst;

      expect(result.nodes[0].data?.pieces).toHaveLength(6);
    });
  });
});
