import { describe, it, expect } from 'vitest';
import { divergingGlyphSet } from '../src/relationship/diverging.js';
import type { DiagramAst } from '@runiq/core';

describe('divergingGlyphSet', () => {
  describe('metadata', () => {
    it('should have correct id', () => {
      expect(divergingGlyphSet.id).toBe('diverging');
    });

    it('should have correct name', () => {
      expect(divergingGlyphSet.name).toBe('Diverging Diagram');
    });

    it('should have correct category', () => {
      expect(divergingGlyphSet.category).toBe('relationship');
    });

    it('should have appropriate item limits', () => {
      expect(divergingGlyphSet.minItems).toBe(2);
      expect(divergingGlyphSet.maxItems).toBe(5);
    });

    it('should have correct tags', () => {
      expect(divergingGlyphSet.tags).toContain('relationship');
      expect(divergingGlyphSet.tags).toContain('diverging');
      expect(divergingGlyphSet.tags).toContain('branching');
    });
  });

  describe('parameter validation', () => {
    it('should require items parameter', () => {
      expect(() => {
        divergingGlyphSet.generator({
          source: 'Start',
        });
      }).toThrow('items');
    });

    it('should allow optional source parameter', () => {
      const result = divergingGlyphSet.generator({
        items: ['A', 'B'],
      });
      expect(result.nodes[0].data?.source?.label).toBe('Source');
    });

    it('should require at least 2 items', () => {
      expect(() => {
        divergingGlyphSet.generator({
          items: ['Only One'],
          source: 'Start',
        });
      }).toThrow('2-5');
    });

    it('should reject more than 5 items', () => {
      expect(() => {
        divergingGlyphSet.generator({
          items: ['A', 'B', 'C', 'D', 'E', 'F'],
          source: 'Start',
        });
      }).toThrow('2-5');
    });
  });

  describe('basic diverging generation', () => {
    it('should generate diverging with 2 items', () => {
      const result = divergingGlyphSet.generator({
        source: 'Decision Point',
        items: ['Path A', 'Path B'],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].shape).toBe('diverging');
      expect(result.edges).toHaveLength(0); // Composite shape handles arrows
    });

    it('should store source and destinations data correctly', () => {
      const result = divergingGlyphSet.generator({
        source: 'Manager',
        items: ['Team A', 'Team B', 'Team C'],
      }) as DiagramAst;

      const node = result.nodes[0];
      expect(node.data?.source?.label).toBe('Manager');
      expect(node.data?.destinations).toHaveLength(3);
      expect(node.data?.destinations?.[0]?.label).toBe('Team A');
      expect(node.data?.destinations?.[1]?.label).toBe('Team B');
      expect(node.data?.destinations?.[2]?.label).toBe('Team C');
    });

    it('should use LR direction', () => {
      const result = divergingGlyphSet.generator({
        items: ['A', 'B'],
      }) as DiagramAst;

      expect(result.direction).toBe('LR');
    });
  });

  describe('multiple destinations', () => {
    it('should handle 3 destinations', () => {
      const result = divergingGlyphSet.generator({
        items: ['A', 'B', 'C'],
      }) as DiagramAst;

      expect(result.nodes[0].data?.destinations).toHaveLength(3);
    });

    it('should handle 4 destinations', () => {
      const result = divergingGlyphSet.generator({
        items: ['A', 'B', 'C', 'D'],
      }) as DiagramAst;

      expect(result.nodes[0].data?.destinations).toHaveLength(4);
    });

    it('should handle 5 destinations (maximum)', () => {
      const result = divergingGlyphSet.generator({
        items: ['A', 'B', 'C', 'D', 'E'],
      }) as DiagramAst;

      expect(result.nodes[0].data?.destinations).toHaveLength(5);
    });
  });

  describe('color theming', () => {
    it('should apply default theme colors', () => {
      const result = divergingGlyphSet.generator({
        source: 'Root',
        items: ['Branch 1', 'Branch 2'],
      }) as DiagramAst;

      const node = result.nodes[0];
      expect(node.data?.source?.color).toBeDefined();
      expect(node.data?.destinations?.[0]?.color).toBeDefined();
      expect(node.data?.destinations?.[1]?.color).toBeDefined();

      // Source and destinations should have different colors
      expect(node.data?.source?.color).not.toBe(
        node.data?.destinations?.[0]?.color
      );
    });

    it('should support custom theme colors', () => {
      const result = divergingGlyphSet.generator({
        items: ['A', 'B'],
        theme: 'vibrant',
      }) as DiagramAst;

      const node = result.nodes[0];
      expect(node.data?.source?.color).toBeDefined();
      expect(node.data?.destinations?.[0]?.color).toBeDefined();
    });

    it('should use different color for source vs destinations', () => {
      const result = divergingGlyphSet.generator({
        source: 'Origin',
        items: ['Dest 1', 'Dest 2', 'Dest 3'],
      }) as DiagramAst;

      const node = result.nodes[0];
      const sourceColor = node.data?.source?.color;
      const destColors = node.data?.destinations?.map((d: any) => d.color);

      // Each destination should have a different color
      const uniqueColors = new Set(destColors);
      expect(uniqueColors.size).toBe(destColors?.length);

      // Source color should be different from all destinations
      destColors?.forEach((color: string) => {
        expect(sourceColor).not.toBe(color);
      });
    });
  });

  describe('real-world use cases', () => {
    it('should generate decision branching flow', () => {
      const result = divergingGlyphSet.generator({
        source: 'User Action',
        items: ['Success Path', 'Error Path', 'Retry Path'],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].data?.source?.label).toBe('User Action');
      expect(result.nodes[0].data?.destinations).toHaveLength(3);
    });

    it('should generate delegation structure', () => {
      const result = divergingGlyphSet.generator({
        source: 'Project Manager',
        items: ['Frontend Team', 'Backend Team', 'QA Team', 'DevOps Team'],
        theme: 'professional',
      }) as DiagramAst;

      expect(result.nodes[0].data?.destinations).toHaveLength(4);
    });

    it('should generate broadcasting pattern', () => {
      const result = divergingGlyphSet.generator({
        source: 'Notification Service',
        items: ['Email', 'SMS', 'Push', 'In-App'],
      }) as DiagramAst;

      expect(result.nodes[0].data?.source?.label).toBe('Notification Service');
    });

    it('should generate distribution network', () => {
      const result = divergingGlyphSet.generator({
        source: 'Warehouse',
        items: ['Store A', 'Store B', 'Store C'],
      }) as DiagramAst;

      expect(result.nodes[0].data?.destinations).toHaveLength(3);
    });

    it('should generate river tributaries', () => {
      const result = divergingGlyphSet.generator({
        source: 'Main River',
        items: ['North Branch', 'South Branch'],
        theme: 'cool',
      }) as DiagramAst;

      expect(result.nodes[0].data?.source?.label).toBe('Main River');
      expect(result.nodes[0].data?.destinations).toHaveLength(2);
    });
  });
});
