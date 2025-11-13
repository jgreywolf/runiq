import { describe, it, expect } from 'vitest';
import { convergingGlyphSet } from '../src/relationship/converging.js';
import type { DiagramAst } from '@runiq/core';

describe('convergingGlyphSet', () => {
  describe('metadata', () => {
    it('should have correct id', () => {
      expect(convergingGlyphSet.id).toBe('converging');
    });

    it('should have correct name', () => {
      expect(convergingGlyphSet.name).toBe('Converging Diagram');
    });

    it('should have correct category', () => {
      expect(convergingGlyphSet.category).toBe('relationship');
    });

    it('should have appropriate item limits', () => {
      expect(convergingGlyphSet.minItems).toBe(2);
      expect(convergingGlyphSet.maxItems).toBe(5);
    });

    it('should have correct tags', () => {
      expect(convergingGlyphSet.tags).toContain('converging');
      expect(convergingGlyphSet.tags).toContain('funnel');
      expect(convergingGlyphSet.tags).toContain('merge');
    });
  });

  describe('parameter validation', () => {
    it('should require items parameter', () => {
      expect(() => {
        convergingGlyphSet.generator({
          target: 'Goal',
        });
      }).toThrow('items');
    });

    it('should allow optional target parameter', () => {
      const result = convergingGlyphSet.generator({
        items: ['A', 'B'],
      });
      expect(result.nodes[0].data?.target?.label).toBe('Target');
    });

    it('should require at least 2 items', () => {
      expect(() => {
        convergingGlyphSet.generator({
          items: ['Only One'],
          target: 'Goal',
        });
      }).toThrow('2-5 items');
    });

    it('should reject more than 5 items', () => {
      expect(() => {
        convergingGlyphSet.generator({
          items: ['A', 'B', 'C', 'D', 'E', 'F'],
          target: 'Goal',
        });
      }).toThrow('2-5 items');
    });
  });

  describe('basic converging generation', () => {
    it('should generate converging with 2 items', () => {
      const result = convergingGlyphSet.generator({
        items: ['Data Source 1', 'Data Source 2'],
        target: 'Analytics Dashboard',
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1); // Composite node
      expect(result.edges).toHaveLength(0); // No separate edges
      expect(result.nodes[0].shape).toBe('converging');
    });

    it('should store sources and target data correctly', () => {
      const result = convergingGlyphSet.generator({
        items: ['Input A', 'Input B'],
        target: 'Output',
      }) as DiagramAst;

      const sources = result.nodes[0].data?.sources as Array<{
        label: string;
        color: string;
      }>;
      const target = result.nodes[0].data?.target as {
        label: string;
        color: string;
      };

      expect(sources).toHaveLength(2);
      expect(sources[0].label).toBe('Input A');
      expect(sources[1].label).toBe('Input B');
      expect(target.label).toBe('Output');
    });

    it('should use LR direction', () => {
      const result = convergingGlyphSet.generator({
        items: ['A', 'B'],
        target: 'C',
      }) as DiagramAst;

      expect(result.direction).toBe('LR');
    });
  });

  describe('multiple items', () => {
    it('should handle 3 items', () => {
      const result = convergingGlyphSet.generator({
        items: ['Team A', 'Team B', 'Team C'],
        target: 'Project Goal',
      }) as DiagramAst;

      const sources = result.nodes[0].data?.sources;
      expect(sources).toHaveLength(3);
    });

    it('should handle 4 items', () => {
      const result = convergingGlyphSet.generator({
        items: ['North', 'South', 'East', 'West'],
        target: 'Center',
      }) as DiagramAst;

      const sources = result.nodes[0].data?.sources;
      expect(sources).toHaveLength(4);
    });

    it('should handle 5 items (maximum)', () => {
      const result = convergingGlyphSet.generator({
        items: ['Stream 1', 'Stream 2', 'Stream 3', 'Stream 4', 'Stream 5'],
        target: 'River',
      }) as DiagramAst;

      const sources = result.nodes[0].data?.sources;
      expect(sources).toHaveLength(5);
    });
  });

  describe('color theming', () => {
    it('should apply default theme colors', () => {
      const result = convergingGlyphSet.generator({
        items: ['Source A', 'Source B'],
        target: 'Destination',
      }) as DiagramAst;

      const sources = result.nodes[0].data?.sources as Array<{ color: string }>;
      const target = result.nodes[0].data?.target as { color: string };

      expect(sources[0].color).toBeDefined();
      expect(sources[1].color).toBeDefined();
      expect(target.color).toBeDefined();
      // Professional theme colors
      expect(sources[0].color).toBe('#546E7A');
      expect(sources[1].color).toBe('#607D8B');
    });

    it('should support custom theme colors', () => {
      const result = convergingGlyphSet.generator({
        items: ['Input 1', 'Input 2'],
        target: 'Result',
        theme: 'vibrant',
      }) as DiagramAst;

      const sources = result.nodes[0].data?.sources as Array<{ color: string }>;
      // Vibrant theme colors
      expect(sources[0].color).toBe('#E74C3C');
      expect(sources[1].color).toBe('#3498DB');
    });

    it('should use different color for target', () => {
      const result = convergingGlyphSet.generator({
        items: ['A', 'B'],
        target: 'C',
      }) as DiagramAst;

      const sources = result.nodes[0].data?.sources as Array<{ color: string }>;
      const target = result.nodes[0].data?.target as { color: string };

      expect(target.color).not.toBe(sources[0].color);
      expect(target.color).not.toBe(sources[1].color);
    });
  });

  describe('real-world use cases', () => {
    it('should generate data aggregation flow', () => {
      const result = convergingGlyphSet.generator({
        items: ['Database 1', 'Database 2', 'API Feed'],
        target: 'Data Warehouse',
        theme: 'colorful',
      }) as DiagramAst;

      expect(result.nodes[0].data?.sources).toHaveLength(3);
      expect(result.nodes[0].data?.target.label).toBe('Data Warehouse');
    });

    it('should generate team collaboration', () => {
      const result = convergingGlyphSet.generator({
        items: ['Engineering', 'Design', 'Product', 'Marketing'],
        target: 'Product Launch',
        theme: 'professional',
      }) as DiagramAst;

      expect(result.nodes[0].data?.sources).toHaveLength(4);
    });

    it('should generate resource consolidation', () => {
      const result = convergingGlyphSet.generator({
        items: ['Budget', 'People', 'Technology'],
        target: 'Strategic Initiative',
        theme: 'vibrant',
      }) as DiagramAst;

      const target = result.nodes[0].data?.target;
      expect(target.label).toBe('Strategic Initiative');
    });

    it('should generate ideas to solution', () => {
      const result = convergingGlyphSet.generator({
        items: ['Brainstorming', 'Research', 'User Feedback'],
        target: 'Final Solution',
        theme: 'cool',
      }) as DiagramAst;

      expect(result.nodes[0].data?.sources).toHaveLength(3);
    });

    it('should generate streams to river', () => {
      const result = convergingGlyphSet.generator({
        items: ['Mountain Stream', 'Valley Creek', 'Forest Brook'],
        target: 'Main River',
        theme: 'warm',
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].shape).toBe('converging');
    });
  });
});
