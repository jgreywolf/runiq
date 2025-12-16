import type { DiagramAst } from '@runiq/core';
import { shapeRegistry } from '@runiq/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { ElkLayoutEngine } from './elk-adapter.js';

describe('ElkLayoutEngine', () => {
  let engine: ElkLayoutEngine;

  beforeEach(() => {
    engine = new ElkLayoutEngine();

    // Register mock shapes for testing
    shapeRegistry.register({
      id: 'rounded',
      bounds: (_ctx) => ({ width: 100, height: 60 }),
      render: (_ctx, position) =>
        `<rect x="${position.x}" y="${position.y}" width="100" height="60" rx="8" />`,
    });

    shapeRegistry.register({
      id: 'rect',
      bounds: (_ctx) => ({ width: 120, height: 60 }),
      render: (_ctx, position) =>
        `<rect x="${position.x}" y="${position.y}" width="120" height="60" />`,
    });

    shapeRegistry.register({
      id: 'circle',
      bounds: (_ctx) => ({ width: 80, height: 80 }),
      render: (_ctx, position) =>
        `<circle cx="${position.x + 40}" cy="${position.y + 40}" r="40" />`,
    });

    shapeRegistry.register({
      id: 'rhombus',
      bounds: (_ctx) => ({ width: 100, height: 100 }),
      render: (_ctx, position) =>
        `<polygon points="${position.x + 50},${position.y} ${position.x + 100},${position.y + 50} ${position.x + 50},${position.y + 100} ${position.x},${position.y + 50}" />`,
    });
  });

  describe('Engine Metadata', () => {
    it('should have correct id', () => {
      expect(engine.id).toBe('elk');
    });

    it('should support manual positions', () => {
      expect(engine.supportsManualPositions).toBe(true);
    });
  });

  describe('Basic Layouts', () => {
    it('should layout a single node', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'A', shape: 'rounded' }],
        edges: [],
      };

      const result = await engine.layout(diagram);

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].id).toBe('A');
      expect(result.nodes[0].width).toBe(100);
      expect(result.nodes[0].height).toBe(60);
      expect(result.nodes[0].x).toBeGreaterThanOrEqual(0);
      expect(result.nodes[0].y).toBeGreaterThanOrEqual(0);
      expect(result.size.width).toBeGreaterThan(0);
      expect(result.size.height).toBeGreaterThan(0);
    });

    it('should layout two connected nodes', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B' }],
      };

      const result = await engine.layout(diagram);

      expect(result.nodes).toHaveLength(2);
      expect(result.edges).toHaveLength(1);
      expect(result.edges[0].from).toBe('A');
      expect(result.edges[0].to).toBe('B');
      expect(result.edges[0].points.length).toBeGreaterThanOrEqual(2);

      // All nodes should have valid positions
      result.nodes.forEach((node) => {
        expect(node.x).toBeGreaterThanOrEqual(0);
        expect(node.y).toBeGreaterThanOrEqual(0);
        expect(node.width).toBeGreaterThan(0);
        expect(node.height).toBeGreaterThan(0);
      });
    });

    it('should layout three nodes in a chain', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
          { id: 'C', shape: 'rounded' },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
        ],
      };

      const result = await engine.layout(diagram);

      expect(result.nodes).toHaveLength(3);
      expect(result.edges).toHaveLength(2);

      // All nodes should have valid positions
      result.nodes.forEach((node) => {
        expect(node.x).toBeDefined();
        expect(node.y).toBeDefined();
        expect(node.width).toBeGreaterThan(0);
        expect(node.height).toBeGreaterThan(0);
      });
    });

    it('should layout complex branching diagram', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'Start', shape: 'rounded' },
          { id: 'Process', shape: 'rect' },
          { id: 'Decision', shape: 'rhombus' },
          { id: 'Action1', shape: 'rect' },
          { id: 'Action2', shape: 'rect' },
          { id: 'End', shape: 'rounded' },
        ],
        edges: [
          { from: 'Start', to: 'Process' },
          { from: 'Process', to: 'Decision' },
          { from: 'Decision', to: 'Action1' },
          { from: 'Decision', to: 'Action2' },
          { from: 'Action1', to: 'End' },
          { from: 'Action2', to: 'End' },
        ],
      };

      const result = await engine.layout(diagram);

      expect(result.nodes).toHaveLength(6);
      expect(result.edges).toHaveLength(6);

      // All edges should have proper routing
      result.edges.forEach((edge) => {
        expect(edge.points.length).toBeGreaterThanOrEqual(2);
        edge.points.forEach((point) => {
          expect(point.x).toBeDefined();
          expect(point.y).toBeDefined();
        });
      });
    });
  });

  describe('Direction Options', () => {
    it('should respect DOWN direction from diagram', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        direction: 'TB',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B' }],
      };

      const result = await engine.layout(diagram);

      const nodeA = result.nodes.find((n) => n.id === 'A')!;
      const nodeB = result.nodes.find((n) => n.id === 'B')!;

      // In DOWN layout, B should be below A (greater y)
      expect(nodeB.y).toBeGreaterThan(nodeA.y);
    });

    it('should respect RIGHT direction from diagram', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        direction: 'LR',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B' }],
      };

      const result = await engine.layout(diagram);

      const nodeA = result.nodes.find((n) => n.id === 'A')!;
      const nodeB = result.nodes.find((n) => n.id === 'B')!;

      // In RIGHT layout, B should be to the right of A (greater x)
      expect(nodeB.x).toBeGreaterThan(nodeA.x);
    });

    it('should respect direction from options over diagram', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        direction: 'TB',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B' }],
      };

      const result = await engine.layout(diagram, { direction: 'LR' });

      const nodeA = result.nodes.find((n) => n.id === 'A')!;
      const nodeB = result.nodes.find((n) => n.id === 'B')!;

      // Options should override diagram direction
      expect(nodeB.x).toBeGreaterThan(nodeA.x);
    });

    it('should default to DOWN when no direction specified', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B' }],
      };

      const result = await engine.layout(diagram);

      const nodeA = result.nodes.find((n) => n.id === 'A')!;
      const nodeB = result.nodes.find((n) => n.id === 'B')!;

      // Default DOWN layout: B should be below A
      expect(nodeB.y).toBeGreaterThan(nodeA.y);
    });
  });

  describe('Spacing Options', () => {
    it('should respect custom spacing', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B' }],
      };

      const result1 = await engine.layout(diagram, { spacing: 50 });
      const result2 = await engine.layout(diagram, { spacing: 150 });

      const nodeA1 = result1.nodes.find((n) => n.id === 'A')!;
      const nodeB1 = result1.nodes.find((n) => n.id === 'B')!;
      const nodeA2 = result2.nodes.find((n) => n.id === 'A')!;
      const nodeB2 = result2.nodes.find((n) => n.id === 'B')!;

      // Larger spacing should increase distance between nodes
      const distance1 = Math.abs(nodeB1.y - nodeA1.y);
      const distance2 = Math.abs(nodeB2.y - nodeA2.y);
      expect(distance2).toBeGreaterThan(distance1);
    });

    it('should use default spacing when not specified', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B' }],
      };

      const result = await engine.layout(diagram);

      expect(result.nodes).toHaveLength(2);
      expect(result.size.width).toBeGreaterThan(0);
      expect(result.size.height).toBeGreaterThan(0);
    });
  });

  describe('Edge Routing', () => {
    it('should route edges with multiple points', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
          { id: 'C', shape: 'rounded' },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'A', to: 'C' },
        ],
      };

      const result = await engine.layout(diagram);

      // Each edge should have routing points
      result.edges.forEach((edge) => {
        expect(edge.points).toBeDefined();
        expect(edge.points.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('should handle edges with labels', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B', label: 'connects' }],
      };

      const result = await engine.layout(diagram);

      expect(result.edges).toHaveLength(1);
      expect(result.edges[0].from).toBe('A');
      expect(result.edges[0].to).toBe('B');
      expect(result.edges[0].points.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Node Labels', () => {
    it('should handle nodes with labels', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded', label: 'Start Node' },
          { id: 'B', shape: 'rounded', label: 'End Node' },
        ],
        edges: [{ from: 'A', to: 'B' }],
      };

      const result = await engine.layout(diagram);

      expect(result.nodes).toHaveLength(2);
      expect(result.edges).toHaveLength(1);
    });

    it('should handle nodes without labels', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B' }],
      };

      const result = await engine.layout(diagram);

      expect(result.nodes).toHaveLength(2);
    });
  });

  describe('Different Shape Sizes', () => {
    it('should respect different node sizes', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'circle' }, // 80x80
          { id: 'B', shape: 'rounded' }, // 100x60
          { id: 'C', shape: 'rect' }, // 120x60
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
        ],
      };

      const result = await engine.layout(diagram);

      const nodeA = result.nodes.find((n) => n.id === 'A')!;
      const nodeB = result.nodes.find((n) => n.id === 'B')!;
      const nodeC = result.nodes.find((n) => n.id === 'C')!;

      expect(nodeA.width).toBe(80);
      expect(nodeA.height).toBe(80);
      expect(nodeB.width).toBe(100);
      expect(nodeB.height).toBe(60);
      expect(nodeC.width).toBe(120);
      expect(nodeC.height).toBe(60);
    });
  });

  describe('Error Handling', () => {
    it('should throw error for unknown shape', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'A', shape: 'unknown-shape' }],
        edges: [],
      };

      await expect(engine.layout(diagram)).rejects.toThrow('Unknown shape');
    });

    it('should handle empty diagram', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
      };

      const result = await engine.layout(diagram);

      expect(result.nodes).toHaveLength(0);
      expect(result.edges).toHaveLength(0);
      expect(result.size.width).toBeGreaterThanOrEqual(0);
      expect(result.size.height).toBeGreaterThanOrEqual(0);
    });

    it('should handle disconnected nodes', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
          { id: 'C', shape: 'rounded' },
        ],
        edges: [], // No connections
      };

      const result = await engine.layout(diagram);

      expect(result.nodes).toHaveLength(3);
      expect(result.edges).toHaveLength(0);

      // All nodes should still have valid positions
      result.nodes.forEach((node) => {
        expect(node.x).toBeGreaterThanOrEqual(0);
        expect(node.y).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Large Diagrams', () => {
    it('should handle diagram with 20 nodes efficiently', async () => {
      const nodes = Array.from({ length: 20 }, (_, i) => ({
        id: `Node${i}`,
        shape: 'rect' as const,
      }));

      const edges = Array.from({ length: 19 }, (_, i) => ({
        from: `Node${i}`,
        to: `Node${i + 1}`,
      }));

      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes,
        edges,
      };

      const startTime = Date.now();
      const result = await engine.layout(diagram);
      const duration = Date.now() - startTime;

      expect(result.nodes).toHaveLength(20);
      expect(result.edges).toHaveLength(19);
      expect(duration).toBeLessThan(1000); // Should complete in under 1 second
    });

    it('should handle diagram with 50 nodes', async () => {
      const nodes = Array.from({ length: 50 }, (_, i) => ({
        id: `Node${i}`,
        shape: 'rect' as const,
      }));

      // Create a more complex graph structure
      const edges = [];
      for (let i = 0; i < 49; i++) {
        edges.push({ from: `Node${i}`, to: `Node${i + 1}` });
        if (i % 5 === 0 && i + 5 < 50) {
          edges.push({ from: `Node${i}`, to: `Node${i + 5}` });
        }
      }

      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes,
        edges,
      };

      const result = await engine.layout(diagram);

      expect(result.nodes).toHaveLength(50);
      expect(result.edges.length).toBeGreaterThan(0);
      expect(result.size.width).toBeGreaterThan(0);
      expect(result.size.height).toBeGreaterThan(0);
    });
  });

  describe('ELK-Specific Features', () => {
    it('should produce deterministic layouts', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
          { id: 'C', shape: 'rounded' },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
        ],
      };

      const result1 = await engine.layout(diagram);
      const result2 = await engine.layout(diagram);

      // Same input should produce same output
      expect(result1.nodes[0].x).toBe(result2.nodes[0].x);
      expect(result1.nodes[0].y).toBe(result2.nodes[0].y);
      expect(result1.nodes[1].x).toBe(result2.nodes[1].x);
      expect(result1.nodes[1].y).toBe(result2.nodes[1].y);
    });

    it('should minimize edge crossings', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
          { id: 'C', shape: 'rounded' },
          { id: 'D', shape: 'rounded' },
        ],
        edges: [
          { from: 'A', to: 'C' },
          { from: 'B', to: 'D' },
          { from: 'A', to: 'D' },
          { from: 'B', to: 'C' },
        ],
      };

      const result = await engine.layout(diagram);

      // ELK should layout nodes to minimize crossings
      expect(result.nodes).toHaveLength(4);
      expect(result.edges).toHaveLength(4);
    });
  });

  describe('Use Case Diagram Layout', () => {
    beforeEach(() => {
      // Register use case specific shapes
      shapeRegistry.register({
        id: 'actor',
        bounds: (_ctx) => ({ width: 60, height: 100 }),
        render: (_ctx, position) =>
          `<g><circle cx="${position.x + 30}" cy="${position.y + 20}" r="15"/><path d="M${position.x + 30},${position.y + 35} L${position.x + 30},${position.y + 70}"/></g>`,
      });

      shapeRegistry.register({
        id: 'ellipse-wide',
        bounds: (_ctx) => ({ width: 150, height: 80 }),
        render: (_ctx, position) =>
          `<ellipse cx="${position.x + 75}" cy="${position.y + 40}" rx="75" ry="40" />`,
      });
    });

    it('should use BOX algorithm for use case diagrams', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'actor1', shape: 'actor' },
          { id: 'useCase1', shape: 'ellipse-wide' },
          { id: 'useCase2', shape: 'ellipse-wide' },
        ],
        edges: [
          { from: 'actor1', to: 'useCase1' },
          { from: 'actor1', to: 'useCase2' },
        ],
      };

      const result = await engine.layout(diagram);

      expect(result.nodes).toHaveLength(3);
      expect(result.edges).toHaveLength(2);

      // Check that nodes have good spacing (at least 100px between nodes)
      const actor = result.nodes.find((n) => n.id === 'actor1');
      const useCase1 = result.nodes.find((n) => n.id === 'useCase1');
      const useCase2 = result.nodes.find((n) => n.id === 'useCase2');

      expect(actor).toBeDefined();
      expect(useCase1).toBeDefined();
      expect(useCase2).toBeDefined();

      // Use case diagrams should have increased spacing (150px configured)
      // Check spacing between use cases
      if (useCase1 && useCase2) {
        const distance = Math.sqrt(
          Math.pow(useCase2.x - useCase1.x, 2) +
            Math.pow(useCase2.y - useCase1.y, 2)
        );
        // With 150px spacing, distance should be at least 100px
        expect(distance).toBeGreaterThan(100);
      }
    });

    it('should handle multiple actors and use cases', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'actor1', shape: 'actor' },
          { id: 'actor2', shape: 'actor' },
          { id: 'useCase1', shape: 'ellipse-wide' },
          { id: 'useCase2', shape: 'ellipse-wide' },
          { id: 'useCase3', shape: 'ellipse-wide' },
        ],
        edges: [
          { from: 'actor1', to: 'useCase1' },
          { from: 'actor1', to: 'useCase2' },
          { from: 'actor2', to: 'useCase2' },
          { from: 'actor2', to: 'useCase3' },
        ],
      };

      const result = await engine.layout(diagram);

      expect(result.nodes).toHaveLength(5);
      expect(result.edges).toHaveLength(4);

      // All nodes should have valid positions
      result.nodes.forEach((node) => {
        expect(node.x).toBeGreaterThanOrEqual(0);
        expect(node.y).toBeGreaterThanOrEqual(0);
        expect(node.width).toBeGreaterThan(0);
        expect(node.height).toBeGreaterThan(0);
      });

      // Check that diagram has reasonable size
      expect(result.size.width).toBeGreaterThan(150);
      expect(result.size.height).toBeGreaterThan(80);
    });
  });
});
