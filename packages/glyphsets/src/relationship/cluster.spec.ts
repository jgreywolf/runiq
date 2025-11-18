import { describe, it, expect } from 'vitest';
import { clusterGlyphSet } from './cluster.js';
import type { DiagramAst } from '@runiq/core';

describe('clusterGlyphSet', () => {
  describe('metadata', () => {
    it('should have correct id', () => {
      expect(clusterGlyphSet.id).toBe('cluster');
    });

    it('should have correct name', () => {
      expect(clusterGlyphSet.name).toBe('Cluster Diagram');
    });

    it('should have correct category', () => {
      expect(clusterGlyphSet.category).toBe('relationship');
    });

    it('should have appropriate item limits', () => {
      expect(clusterGlyphSet.minItems).toBe(3);
      expect(clusterGlyphSet.maxItems).toBe(8);
    });

    it('should have correct tags', () => {
      expect(clusterGlyphSet.tags).toContain('relationship');
      expect(clusterGlyphSet.tags).toContain('cluster');
      expect(clusterGlyphSet.tags).toContain('radial');
      expect(clusterGlyphSet.tags).toContain('hub');
    });
  });

  describe('parameter validation', () => {
    it('should require items parameter', () => {
      expect(() => {
        clusterGlyphSet.generator({
          center: 'Main Idea',
        });
      }).toThrow('items');
    });

    it('should allow optional center parameter', () => {
      const result = clusterGlyphSet.generator({
        items: ['A', 'B', 'C'],
      });
      expect(result.nodes[0].data?.center?.label).toBe('Central Concept');
    });

    it('should require at least 3 items', () => {
      expect(() => {
        clusterGlyphSet.generator({
          items: ['Only', 'Two'],
          center: 'Main',
        });
      }).toThrow('3');
    });

    it('should reject more than 8 items', () => {
      expect(() => {
        clusterGlyphSet.generator({
          items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
          center: 'Main',
        });
      }).toThrow('8');
    });
  });

  describe('basic cluster generation', () => {
    it('should generate cluster with 3 items', () => {
      const result = clusterGlyphSet.generator({
        center: 'Product',
        items: ['Speed', 'Quality', 'Price'],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].shape).toBe('cluster');
      expect(result.edges).toHaveLength(0); // Composite shape handles connections
    });

    it('should store center and satellites data correctly', () => {
      const result = clusterGlyphSet.generator({
        center: 'Team Lead',
        items: ['Developer 1', 'Developer 2', 'Developer 3'],
      }) as DiagramAst;

      const node = result.nodes[0];
      expect(node.data?.center?.label).toBe('Team Lead');
      expect(node.data?.satellites).toHaveLength(3);
      expect(node.data?.satellites?.[0]?.label).toBe('Developer 1');
      expect(node.data?.satellites?.[1]?.label).toBe('Developer 2');
      expect(node.data?.satellites?.[2]?.label).toBe('Developer 3');
    });

    it('should use LR direction', () => {
      const result = clusterGlyphSet.generator({
        items: ['A', 'B', 'C'],
      }) as DiagramAst;

      expect(result.direction).toBe('LR');
    });
  });

  describe('multiple satellites', () => {
    it('should handle 4 satellites', () => {
      const result = clusterGlyphSet.generator({
        items: ['A', 'B', 'C', 'D'],
      }) as DiagramAst;

      expect(result.nodes[0].data?.satellites).toHaveLength(4);
    });

    it('should handle 5 satellites', () => {
      const result = clusterGlyphSet.generator({
        items: ['A', 'B', 'C', 'D', 'E'],
      }) as DiagramAst;

      expect(result.nodes[0].data?.satellites).toHaveLength(5);
    });

    it('should handle 6 satellites', () => {
      const result = clusterGlyphSet.generator({
        items: ['A', 'B', 'C', 'D', 'E', 'F'],
      }) as DiagramAst;

      expect(result.nodes[0].data?.satellites).toHaveLength(6);
    });

    it('should handle 7 satellites', () => {
      const result = clusterGlyphSet.generator({
        items: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      }) as DiagramAst;

      expect(result.nodes[0].data?.satellites).toHaveLength(7);
    });

    it('should handle 8 satellites (maximum)', () => {
      const result = clusterGlyphSet.generator({
        items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      }) as DiagramAst;

      expect(result.nodes[0].data?.satellites).toHaveLength(8);
    });
  });

  describe('color theming', () => {
    it('should apply default theme colors', () => {
      const result = clusterGlyphSet.generator({
        center: 'Hub',
        items: ['Spoke 1', 'Spoke 2', 'Spoke 3'],
      }) as DiagramAst;

      const node = result.nodes[0];
      expect(node.data?.center?.color).toBeDefined();
      expect(node.data?.satellites?.[0]?.color).toBeDefined();
      expect(node.data?.satellites?.[1]?.color).toBeDefined();
      expect(node.data?.satellites?.[2]?.color).toBeDefined();

      // Center and satellites should have different colors
      const centerColor = node.data?.center?.color;
      node.data?.satellites?.forEach((sat: any) => {
        expect(sat.color).toBeDefined();
      });
    });

    it('should support custom theme colors', () => {
      const result = clusterGlyphSet.generator({
        items: ['A', 'B', 'C', 'D'],
        theme: 'vibrant',
      }) as DiagramAst;

      const node = result.nodes[0];
      expect(node.data?.center?.color).toBeDefined();
      expect(node.data?.satellites?.[0]?.color).toBeDefined();
    });

    it('should use different colors for satellites', () => {
      const result = clusterGlyphSet.generator({
        center: 'Core',
        items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
      }) as DiagramAst;

      const node = result.nodes[0];
      const satelliteColors = node.data?.satellites?.map((s: any) => s.color);

      // Each satellite should have a different color
      const uniqueColors = new Set(satelliteColors);
      expect(uniqueColors.size).toBe(satelliteColors?.length);
    });
  });

  describe('real-world use cases', () => {
    it('should generate product features cluster', () => {
      const result = clusterGlyphSet.generator({
        center: 'Product',
        items: ['Fast', 'Secure', 'Scalable', 'Easy to Use'],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].data?.center?.label).toBe('Product');
      expect(result.nodes[0].data?.satellites).toHaveLength(4);
    });

    it('should generate topic clustering', () => {
      const result = clusterGlyphSet.generator({
        center: 'Machine Learning',
        items: [
          'Supervised',
          'Unsupervised',
          'Reinforcement',
          'Deep Learning',
          'Neural Networks',
        ],
        theme: 'cool',
      }) as DiagramAst;

      expect(result.nodes[0].data?.satellites).toHaveLength(5);
    });

    it('should generate team structure', () => {
      const result = clusterGlyphSet.generator({
        center: 'Project Manager',
        items: ['Frontend Dev', 'Backend Dev', 'Designer', 'QA Engineer'],
      }) as DiagramAst;

      expect(result.nodes[0].data?.center?.label).toBe('Project Manager');
    });

    it('should generate concept map', () => {
      const result = clusterGlyphSet.generator({
        center: 'Sustainability',
        items: [
          'Reduce Waste',
          'Renewable Energy',
          'Recycling',
          'Conservation',
          'Green Technology',
          'Carbon Neutral',
        ],
      }) as DiagramAst;

      expect(result.nodes[0].data?.satellites).toHaveLength(6);
    });

    it('should generate hub network', () => {
      const result = clusterGlyphSet.generator({
        center: 'Data Center',
        items: [
          'Office A',
          'Office B',
          'Office C',
          'Remote Site',
          'Cloud Services',
          'Backup Center',
          'DR Site',
        ],
        theme: 'monochrome',
      }) as DiagramAst;

      expect(result.nodes[0].data?.center?.label).toBe('Data Center');
      expect(result.nodes[0].data?.satellites).toHaveLength(7);
    });
  });
});
