import { describe, it, expect } from 'vitest';
import { parse } from './index.js';
import type { EdgeAst } from '@runiq/core';

describe('Edge Weight Parsing', () => {
  describe('Basic Weight Syntax', () => {
    it('should parse edge with integer weight', () => {
      const input = `
        diagram "Test" {
          shape A as @circle
          shape B as @circle
          A -> B weight: 10
        }
      `;

      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.diagram?.edges).toHaveLength(1);

      const edge = result.diagram?.edges[0] as EdgeAst;
      expect(edge.from).toBe('A');
      expect(edge.to).toBe('B');
      expect(edge.weight).toBe(10);
    });

    it('should parse edge with decimal weight', () => {
      const input = `
        diagram "Test" {
          shape A as @circle
          shape B as @circle
          A -> B weight: 5.5
        }
      `;

      const result = parse(input);
      expect(result.success).toBe(true);

      const edge = result.diagram?.edges[0] as EdgeAst;
      expect(edge.weight).toBe(5.5);
    });

    it('should parse edge with zero weight', () => {
      const input = `
        diagram "Test" {
          shape A as @circle
          shape B as @circle
          A -> B weight: 0
        }
      `;

      const result = parse(input);
      expect(result.success).toBe(true);

      const edge = result.diagram?.edges[0] as EdgeAst;
      expect(edge.weight).toBe(0);
    });

    it('should parse edge with negative weight', () => {
      const input = `
        diagram "Test" {
          shape A as @circle
          shape B as @circle
          A -> B weight: -3
        }
      `;

      const result = parse(input);
      expect(result.success).toBe(true);

      const edge = result.diagram?.edges[0] as EdgeAst;
      expect(edge.weight).toBe(-3);
    });
  });

  describe('Weight with Other Properties', () => {
    it('should parse weight alongside label', () => {
      const input = `
        diagram "Test" {
          shape A as @circle
          shape B as @circle
          A -> B label: "connects" weight: 7
        }
      `;

      const result = parse(input);
      expect(result.success).toBe(true);

      const edge = result.diagram?.edges[0] as EdgeAst;
      expect(edge.label).toBe('connects');
      expect(edge.weight).toBe(7);
    });

    it('should parse weight with line style', () => {
      const input = `
        diagram "Test" {
          shape A as @circle
          shape B as @circle
          A -> B weight: 15 lineStyle: "dashed"
        }
      `;

      const result = parse(input);
      expect(result.success).toBe(true);

      const edge = result.diagram?.edges[0] as EdgeAst;
      expect(edge.weight).toBe(15);
      expect(edge.lineStyle).toBe('dashed');
    });

    it('should parse weight with stroke color and width', () => {
      const input = `
        diagram "Test" {
          shape A as @circle
          shape B as @circle
          A -> B 
            weight: 20
            strokeColor: "#ff0000"
            strokeWidth: 3
        }
      `;

      const result = parse(input);
      expect(result.success).toBe(true);

      const edge = result.diagram?.edges[0] as EdgeAst;
      expect(edge.weight).toBe(20);
      expect(edge.strokeColor).toBe('#ff0000');
      expect(edge.strokeWidth).toBe(3);
    });
  });

  describe('Multiple Weighted Edges', () => {
    it('should parse multiple edges with different weights', () => {
      const input = `
        diagram "Weighted Graph" {
          shape A as @circle label: "A"
          shape B as @circle label: "B"
          shape C as @circle label: "C"
          shape D as @circle label: "D"
          
          A -> B weight: 5
          A -> C weight: 3
          B -> C weight: 2
          B -> D weight: 4
          C -> D weight: 1
        }
      `;

      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.diagram?.edges).toHaveLength(5);

      const edges = result.diagram?.edges as EdgeAst[];
      expect(edges[0].weight).toBe(5); // A -> B
      expect(edges[1].weight).toBe(3); // A -> C
      expect(edges[2].weight).toBe(2); // B -> C
      expect(edges[3].weight).toBe(4); // B -> D
      expect(edges[4].weight).toBe(1); // C -> D
    });
  });

  describe('Weighted Edges in Containers', () => {
    it('should parse weighted edges inside force-directed container', () => {
      const input = `
        diagram "Weighted Network" {
          container "Network" algorithm: force {
            shape node1 as @circle label: "Node 1"
            shape node2 as @circle label: "Node 2"
            shape node3 as @circle label: "Node 3"
            
            node1 -> node2 weight: 10
            node2 -> node3 weight: 5
            node1 -> node3 weight: 15
          }
        }
      `;

      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.diagram?.edges).toHaveLength(3);

      const edges = result.diagram?.edges as EdgeAst[];
      expect(edges[0].weight).toBe(10);
      expect(edges[1].weight).toBe(5);
      expect(edges[2].weight).toBe(15);
    });
  });

  describe('Edge Without Weight', () => {
    it('should handle edge without weight property', () => {
      const input = `
        diagram "Test" {
          shape A as @circle
          shape B as @circle
          A -> B
        }
      `;

      const result = parse(input);
      expect(result.success).toBe(true);

      const edge = result.diagram?.edges[0] as EdgeAst;
      expect(edge.weight).toBeUndefined();
    });

    it('should handle mix of weighted and unweighted edges', () => {
      const input = `
        diagram "Test" {
          shape A as @circle
          shape B as @circle
          shape C as @circle
          
          A -> B weight: 5
          B -> C
        }
      `;

      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.diagram?.edges).toHaveLength(2);

      const edges = result.diagram?.edges as EdgeAst[];
      expect(edges[0].weight).toBe(5);
      expect(edges[1].weight).toBeUndefined();
    });
  });
});
