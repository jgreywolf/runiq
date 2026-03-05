import { describe, expect, it } from 'vitest';
import { parse } from '../langium-parser.js';

/**
 * Unit tests for diagram-converter.
 *
 * Note: Comprehensive diagram testing exists in:
 * - integration/parser.spec.ts (35 tests)
 * - integration/container-*.spec.ts (6 files, 188 tests)
 * - integration/data-parser.spec.ts (16 tests)
 * - integration/uml-relationships.spec.ts (13 tests)
 * - integration/class-diagram-parser.spec.ts (18 tests)
 *
 * These tests focus on basic converter behavior through the parser.
 */
describe('diagram-converter', () => {
  describe('Basic Diagram Structure', () => {
    it('should convert empty diagram', () => {
      const dsl = 'diagram "Test" {}';
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram).toBeDefined();
      expect(result.diagram?.title).toBe('Test');
      expect(result.diagram?.astVersion).toBe('1.0');
    });

    it('should convert diagram name with special characters', () => {
      const dsl = 'diagram "My Complex Diagram (v1.0)" {}';
      const result = parse(dsl);

      expect(result.diagram?.title).toBe('My Complex Diagram (v1.0)');
    });

    it('should initialize empty nodes and edges arrays', () => {
      const dsl = 'diagram "Test" {}';
      const result = parse(dsl);

      expect(result.diagram?.nodes).toEqual([]);
      expect(result.diagram?.edges).toEqual([]);
    });
  });

  describe('Node Shape Declarations', () => {
    it('should convert node with shape and label', () => {
      const dsl = 'diagram "Test" { shape A as @rect label: "Node A" }';
      const result = parse(dsl);

      expect(result.diagram?.nodes).toHaveLength(1);
      expect(result.diagram?.nodes[0]).toMatchObject({
        id: 'A',
        shape: 'rect',
        label: 'Node A',
      });
      expect(result.diagram?.nodes[0].data).toBeDefined();
    });

    it('should use node ID as default label when not specified', () => {
      const dsl = 'diagram "Test" { shape NodeA as @circ }';
      const result = parse(dsl);

      expect(result.diagram?.nodes[0].id).toBe('NodeA');
      expect(result.diagram?.nodes[0].label).toBe('NodeA');
    });

    it('should convert multiple nodes in sequence', () => {
      const dsl = `diagram "Test" {
        shape A as @rect label: "Node A"
        shape B as @circ label: "Node B"
        shape C as @rounded label: "Node C"
      }`;
      const result = parse(dsl);

      expect(result.diagram?.nodes).toHaveLength(3);
      expect(result.diagram?.nodes.map((n) => n.id)).toEqual(['A', 'B', 'C']);
      expect(result.diagram?.nodes.map((n) => n.shape)).toEqual([
        'rect',
        'circ',
        'rounded',
      ]);
    });

    it('should handle nodes with camelCase IDs', () => {
      const dsl = `diagram "Test" {
        shape myNode as @rect
        shape myNode2 as @circ
      }`;
      const result = parse(dsl);

      expect(result.diagram?.nodes[0].id).toBe('myNode');
      expect(result.diagram?.nodes[1].id).toBe('myNode2');
    });
  });

  describe('Edge Declarations', () => {
    it('should convert simple edge between nodes', () => {
      const dsl = `diagram "Test" {
        A -> B
      }`;
      const result = parse(dsl);

      expect(result.diagram?.edges).toHaveLength(1);
      expect(result.diagram?.edges[0]).toMatchObject({
        from: 'A',
        to: 'B',
      });
    });

    it('should auto-create nodes referenced in edges', () => {
      const dsl = 'diagram "Test" { A -> B }';
      const result = parse(dsl);

      expect(result.diagram?.nodes).toHaveLength(2);
      expect(result.diagram?.nodes[0].id).toBe('A');
      expect(result.diagram?.nodes[1].id).toBe('B');
    });

    it('should convert edge with properties', () => {
      const dsl = 'diagram "Test" { A -> B }';
      const result = parse(dsl);

      // Note: Edge label syntax tested in integration tests
      expect(result.diagram?.edges[0].from).toBe('A');
      expect(result.diagram?.edges[0].to).toBe('B');
    });

    it('should convert multiple edges', () => {
      const dsl = `diagram "Test" {
        A -> B
        B -> C
        C -> D
      }`;
      const result = parse(dsl);

      expect(result.diagram?.edges).toHaveLength(3);
      expect(result.diagram?.edges[0]).toMatchObject({ from: 'A', to: 'B' });
      expect(result.diagram?.edges[1]).toMatchObject({ from: 'B', to: 'C' });
      expect(result.diagram?.edges[2]).toMatchObject({ from: 'C', to: 'D' });
    });

    it('should handle self-referencing edge', () => {
      const dsl = 'diagram "Test" { A -> A }';
      const result = parse(dsl);

      expect(result.diagram?.edges[0]).toMatchObject({ from: 'A', to: 'A' });
    });
  });

  describe('Direction and Routing', () => {
    it('should convert direction declaration', () => {
      const dsl = `diagram "Test" {
        direction LR
        A -> B
      }`;
      const result = parse(dsl);

      expect(result.diagram?.direction).toBe('LR');
    });

    it('should convert all direction options', () => {
      const directions = ['LR', 'RL', 'TB', 'BT'];

      for (const dir of directions) {
        const dsl = `diagram "Test" { direction ${dir} }`;
        const result = parse(dsl);

        expect(result.diagram?.direction).toBe(dir);
      }
    });

    it('should convert routing declaration', () => {
      const dsl = `diagram "Test" {
        routing orthogonal
        A -> B
      }`;
      const result = parse(dsl);

      expect(result.diagram?.routing).toBe('orthogonal');
    });
  });

  describe('Comments and Whitespace', () => {
    it('should ignore comments', () => {
      const dsl = `diagram "Test" {
        // This is a comment
        shape A as @rect
        /* Multi-line
           comment */
        shape B as @circ
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.nodes).toHaveLength(2);
    });

    it('should handle extra whitespace', () => {
      const dsl = `diagram   "Test"   {


        shape    A    as    @rect


      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.nodes).toHaveLength(1);
    });
  });

  describe('Error Handling', () => {
    it('should detect missing diagram name', () => {
      const dsl = 'diagram {}';
      const result = parse(dsl);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect unclosed braces', () => {
      const dsl = 'diagram "Test" {';
      const result = parse(dsl);

      expect(result.success).toBe(false);
    });

    it('should detect invalid keywords', () => {
      const dsl = 'diagram "Test" { invalidKeyword }';
      const result = parse(dsl);

      expect(result.success).toBe(false);
    });
  });

  describe('Complex Diagrams', () => {
    it('should handle diagram with multiple statement types', () => {
      const dsl = `diagram "Test" {
        direction LR
        routing orthogonal
        
        shape A as @rect label: "Node A"
        shape B as @circ label: "Node B"
        
        A -> B
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.direction).toBe('LR');
      expect(result.diagram?.routing).toBe('orthogonal');
      expect(result.diagram?.nodes).toHaveLength(2);
      expect(result.diagram?.edges).toHaveLength(1);
    });

    it('should preserve statement order', () => {
      const dsl = `diagram "Test" {
        shape First as @rect
        shape Second as @circ
        shape Third as @rounded
      }`;
      const result = parse(dsl);

      expect(result.diagram?.nodes.map((n) => n.id)).toEqual([
        'First',
        'Second',
        'Third',
      ]);
    });
  });
});
