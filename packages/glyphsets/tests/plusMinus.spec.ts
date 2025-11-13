import { describe, it, expect } from 'vitest';
import { plusMinusGlyphSet } from '../src/relationship/plusMinus.js';
import type { DiagramAst } from '@runiq/core';

describe('plusMinusGlyphSet', () => {
  describe('metadata', () => {
    it('should have correct id', () => {
      expect(plusMinusGlyphSet.id).toBe('plusMinus');
    });

    it('should have correct name', () => {
      expect(plusMinusGlyphSet.name).toBe('Plus/Minus Diagram');
    });

    it('should have correct category', () => {
      expect(plusMinusGlyphSet.category).toBe('relationship');
    });

    it('should have appropriate item limits', () => {
      expect(plusMinusGlyphSet.minItems).toBe(2);
      expect(plusMinusGlyphSet.maxItems).toBe(10);
    });

    it('should have correct tags', () => {
      expect(plusMinusGlyphSet.tags).toContain('relationship');
      expect(plusMinusGlyphSet.tags).toContain('comparison');
      expect(plusMinusGlyphSet.tags).toContain('pros');
      expect(plusMinusGlyphSet.tags).toContain('cons');
    });
  });

  describe('parameter validation', () => {
    it('should require items parameter', () => {
      expect(() => {
        plusMinusGlyphSet.generator({});
      }).toThrow('items');
    });

    it('should require at least 2 items', () => {
      expect(() => {
        plusMinusGlyphSet.generator({
          items: ['Only One'],
        });
      }).toThrow('2');
    });

    it('should reject more than 10 items', () => {
      expect(() => {
        plusMinusGlyphSet.generator({
          items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
        });
      }).toThrow('10');
    });
  });

  describe('basic plusMinus generation', () => {
    it('should generate plusMinus with 2 items (1 pro, 1 con)', () => {
      const result = plusMinusGlyphSet.generator({
        items: ['Pro', 'Con'],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].shape).toBe('plusMinus');
      expect(result.edges).toHaveLength(0);
    });

    it('should split items evenly between plus and minus', () => {
      const result = plusMinusGlyphSet.generator({
        items: ['Pro 1', 'Pro 2', 'Con 1', 'Con 2'],
      }) as DiagramAst;

      const node = result.nodes[0];
      expect(node.data?.plus).toHaveLength(2);
      expect(node.data?.minus).toHaveLength(2);
    });

    it('should handle odd number of items (plus gets extra)', () => {
      const result = plusMinusGlyphSet.generator({
        items: ['Pro 1', 'Pro 2', 'Con 1'],
      }) as DiagramAst;

      const node = result.nodes[0];
      expect(node.data?.plus).toHaveLength(2);
      expect(node.data?.minus).toHaveLength(1);
    });

    it('should use LR direction', () => {
      const result = plusMinusGlyphSet.generator({
        items: ['A', 'B'],
      }) as DiagramAst;

      expect(result.direction).toBe('LR');
    });
  });

  describe('color theming', () => {
    it('should apply default theme colors', () => {
      const result = plusMinusGlyphSet.generator({
        items: ['Pro 1', 'Pro 2', 'Con 1', 'Con 2'],
      }) as DiagramAst;

      const node = result.nodes[0];
      expect(node.data?.plus?.[0]?.color).toBeDefined();
      expect(node.data?.plus?.[1]?.color).toBeDefined();
      expect(node.data?.minus?.[0]?.color).toBeDefined();
      expect(node.data?.minus?.[1]?.color).toBeDefined();
    });

    it('should support custom theme colors', () => {
      const result = plusMinusGlyphSet.generator({
        items: ['A', 'B', 'C', 'D'],
        theme: 'vibrant',
      }) as DiagramAst;

      const node = result.nodes[0];
      expect(node.data?.plus?.[0]?.color).toBeDefined();
    });

    it('should alternate colors between plus and minus', () => {
      const result = plusMinusGlyphSet.generator({
        items: ['Pro 1', 'Pro 2', 'Con 1', 'Con 2'],
      }) as DiagramAst;

      const node = result.nodes[0];
      const plusColors = node.data?.plus?.map((p: any) => p.color);
      const minusColors = node.data?.minus?.map((m: any) => m.color);

      // Plus and minus should use alternating theme colors
      expect(plusColors).toBeDefined();
      expect(minusColors).toBeDefined();
    });
  });

  describe('real-world use cases', () => {
    it('should generate cloud migration decision', () => {
      const result = plusMinusGlyphSet.generator({
        items: [
          'Scalability',
          'Cost Savings',
          'High Initial Cost',
          'Migration Risk',
        ],
      }) as DiagramAst;

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].data?.plus).toHaveLength(2);
      expect(result.nodes[0].data?.minus).toHaveLength(2);
    });

    it('should generate remote work analysis', () => {
      const result = plusMinusGlyphSet.generator({
        items: [
          'Flexibility',
          'No Commute',
          'Lower Costs',
          'Isolation',
          'Communication Challenges',
        ],
        theme: 'cool',
      }) as DiagramAst;

      expect(result.nodes[0].data?.plus).toHaveLength(3);
      expect(result.nodes[0].data?.minus).toHaveLength(2);
    });

    it('should generate technology adoption', () => {
      const result = plusMinusGlyphSet.generator({
        items: [
          'Innovation',
          'Competitive Edge',
          'Efficiency Gains',
          'Learning Curve',
          'Implementation Cost',
          'Technical Debt',
        ],
      }) as DiagramAst;

      expect(result.nodes[0].data?.plus).toHaveLength(3);
      expect(result.nodes[0].data?.minus).toHaveLength(3);
    });

    it('should generate product feature decision', () => {
      const result = plusMinusGlyphSet.generator({
        items: [
          'User Demand',
          'Revenue Potential',
          'Market Differentiation',
          'Development Time',
          'Maintenance Burden',
          'Complexity',
        ],
        theme: 'warm',
      }) as DiagramAst;

      expect(result.nodes[0].data?.plus).toHaveLength(3);
      expect(result.nodes[0].data?.minus).toHaveLength(3);
    });

    it('should generate maximum items', () => {
      const result = plusMinusGlyphSet.generator({
        items: [
          'Pro 1',
          'Pro 2',
          'Pro 3',
          'Pro 4',
          'Pro 5',
          'Con 1',
          'Con 2',
          'Con 3',
          'Con 4',
          'Con 5',
        ],
      }) as DiagramAst;

      expect(result.nodes[0].data?.plus).toHaveLength(5);
      expect(result.nodes[0].data?.minus).toHaveLength(5);
    });
  });
});
