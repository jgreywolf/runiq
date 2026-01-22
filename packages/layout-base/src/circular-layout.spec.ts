import { describe, it, expect } from 'vitest';
import { circularLayout } from './circular-layout.js';
import type { DiagramAst } from '@runiq/core';

describe('circularLayout', () => {
  it('should position nodes in a circle', () => {
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'a', shape: 'rect' },
        { id: 'b', shape: 'rect' },
        { id: 'c', shape: 'rect' },
        { id: 'd', shape: 'rect' },
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
        { from: 'c', to: 'd' },
        { from: 'd', to: 'a' },
      ],
    };

    const result = circularLayout(diagram);

    // Should have 4 nodes positioned
    expect(result.nodes).toHaveLength(4);

    // Each node should have x and y coordinates
    for (const node of result.nodes) {
      expect(node.x).toBeDefined();
      expect(node.y).toBeDefined();
      expect(typeof node.x).toBe('number');
      expect(typeof node.y).toBe('number');
    }

    // All nodes should have positive coordinates (diagram is centered/offset)
    for (const node of result.nodes) {
      expect(node.x).toBeGreaterThanOrEqual(0);
      expect(node.y).toBeGreaterThanOrEqual(0);
    }
  });

  it('should calculate appropriate radius based on node count', () => {
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'a', shape: 'rect' },
        { id: 'b', shape: 'rect' },
      ],
      edges: [{ from: 'a', to: 'b' }],
    };

    const result = circularLayout(diagram, { spacing: 50 });

    // With 2 nodes, the radius will be calculated from circumference
    // Just check that nodes are positioned in reasonable locations
    const nodeA = result.nodes.find((n) => n.id === 'a')!;
    const nodeB = result.nodes.find((n) => n.id === 'b')!;

    // Nodes should be separated from each other
    const distAB = Math.sqrt(
      (nodeA.x - nodeB.x) ** 2 + (nodeA.y - nodeB.y) ** 2
    );
    expect(distAB).toBeGreaterThan(100); // Should be reasonably far apart
  });

  it('should center the diagram with padding', () => {
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'a', shape: 'rect' },
        { id: 'b', shape: 'rect' },
        { id: 'c', shape: 'rect' },
      ],
      edges: [],
    };

    const result = circularLayout(diagram);

    // Should have size
    expect(result.size).toBeDefined();
    expect(result.size.width).toBeGreaterThan(0);
    expect(result.size.height).toBeGreaterThan(0);

    // All nodes should have positive coordinates (after centering)
    for (const node of result.nodes) {
      expect(node.x).toBeGreaterThanOrEqual(0);
      expect(node.y).toBeGreaterThanOrEqual(0);
    }

    // Size should account for node sizes
    const nodeA = result.nodes[0];
    expect(result.size.width).toBeGreaterThan(nodeA.width || 100);
    expect(result.size.height).toBeGreaterThan(nodeA.height || 60);
  });

  it('should create curved edge paths', () => {
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'a', shape: 'rect' },
        { id: 'b', shape: 'rect' },
        { id: 'c', shape: 'rect' },
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
      ],
    };

    const result = circularLayout(diagram);

    expect(result.edges).toHaveLength(2);

    // Each edge should have points
    for (const edge of result.edges) {
      expect(edge.points).toBeDefined();
      expect(edge.points?.length).toBeGreaterThan(0);

      // Points should have x and y coordinates
      if (edge.points) {
        for (const point of edge.points) {
          expect(point.x).toBeDefined();
          expect(point.y).toBeDefined();
          expect(typeof point.x).toBe('number');
          expect(typeof point.y).toBe('number');
        }
      }
    }
  });

  it('should normalize arc direction for long angle differences', () => {
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'n0', shape: 'rect' },
        { id: 'n1', shape: 'rect' },
        { id: 'n2', shape: 'rect' },
      ],
      edges: [
        { from: 'n0', to: 'n2' },
        { from: 'n2', to: 'n0' },
      ],
    };

    const result = circularLayout(diagram);

    expect(result.edges).toHaveLength(2);
    for (const edge of result.edges) {
      expect(edge.points?.length).toBe(3);
    }
  });

  it('should return empty edge points when nodes are missing', () => {
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [{ id: 'a', shape: 'rect' }],
      edges: [{ from: 'a', to: 'missing' }],
    };

    const result = circularLayout(diagram);

    expect(result.edges).toHaveLength(1);
    expect(result.edges[0].points).toEqual([]);
  });

  it('should handle empty diagram', () => {
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [],
      edges: [],
    };

    const result = circularLayout(diagram);

    expect(result.nodes).toHaveLength(0);
    expect(result.edges).toHaveLength(0);
    expect(result.size).toBeDefined();
    // Empty diagram returns 0x0 size
    expect(result.size.width).toBe(0);
    expect(result.size.height).toBe(0);
  });

  it('should handle missing nodes and edges arrays', () => {
    const diagram: DiagramAst = {
      astVersion: '1.0',
    };

    const result = circularLayout(diagram);

    expect(result.nodes).toHaveLength(0);
    expect(result.edges).toHaveLength(0);
  });

  it('should handle missing edges array with nodes present', () => {
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'a', shape: 'rect' },
        { id: 'b', shape: 'rect' },
      ],
    };

    const result = circularLayout(diagram);

    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(0);
  });

  it('should handle single node', () => {
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [{ id: 'a', shape: 'rect' }],
      edges: [],
    };

    const result = circularLayout(diagram);

    expect(result.nodes).toHaveLength(1);
    const node = result.nodes[0];
    expect(node.x).toBeDefined();
    expect(node.y).toBeDefined();
    expect(result.size.width).toBeGreaterThan(node.width || 100);
    expect(result.size.height).toBeGreaterThan(node.height || 60);
  });

  it('should respect spacing option', () => {
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'a', shape: 'rect' },
        { id: 'b', shape: 'rect' },
        { id: 'c', shape: 'rect' },
        { id: 'd', shape: 'rect' },
        { id: 'e', shape: 'rect' },
        { id: 'f', shape: 'rect' },
      ],
      edges: [],
    };

    const result1 = circularLayout(diagram, { spacing: 50 });
    const result2 = circularLayout(diagram, { spacing: 200 });

    // Larger spacing should result in larger size
    expect(result2.size.width).toBeGreaterThan(result1.size.width);
    expect(result2.size.height).toBeGreaterThan(result1.size.height);
  });

  it('should support custom start angle', () => {
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'a', shape: 'rect' },
        { id: 'b', shape: 'rect' },
        { id: 'c', shape: 'rect' },
        { id: 'd', shape: 'rect' },
      ],
      edges: [],
    };

    // Start at 90 degrees (right side)
    const result = circularLayout(diagram, { startAngle: 90 });

    // With 4 nodes, first node at 90 degrees should be to the right
    // Just verify it renders and positions nodes
    expect(result.nodes).toHaveLength(4);
    expect(result.size.width).toBeGreaterThan(0);
    expect(result.size.height).toBeGreaterThan(0);
  });

  it('should support counterclockwise direction', () => {
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'a', shape: 'rect' },
        { id: 'b', shape: 'rect' },
        { id: 'c', shape: 'rect' },
      ],
      edges: [],
    };

    const result = circularLayout(diagram, { direction: 'counterclockwise' });

    expect(result.nodes).toHaveLength(3);
    expect(result.size.width).toBeGreaterThan(0);
  });

  it('should support custom radius', () => {
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'a', shape: 'rect' },
        { id: 'b', shape: 'rect' },
        { id: 'c', shape: 'rect' },
      ],
      edges: [],
    };

    const customRadius = 300;
    const result = circularLayout(diagram, { radius: customRadius });

    // With custom radius, diagram should be larger
    expect(result.size.width).toBeGreaterThan(500); // Roughly 2 * radius + node sizes
    expect(result.size.height).toBeGreaterThan(500);
  });

  it('should maintain node properties', () => {
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        {
          id: 'a',
          shape: 'rect',
          label: 'Node A',
          data: { fill: '#ff0000' },
        },
      ],
      edges: [],
    };

    const result = circularLayout(diagram);

    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
    const node = result.nodes[0] as any;
    expect(node.id).toBe('a');
    expect(node.shape).toBe('rect');
    expect(node.label).toBe('Node A');
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
  });

  it('should maintain edge properties', () => {
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'a', shape: 'rect' },
        { id: 'b', shape: 'rect' },
      ],
      edges: [
        {
          from: 'a',
          to: 'b',
          label: 'Edge Label',
          data: { stroke: '#0000ff' },
        },
      ],
    };

    const result = circularLayout(diagram);

    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
    const edge = result.edges[0] as any;
    expect(edge.from).toBe('a');
    expect(edge.to).toBe('b');
    expect(edge.label).toBe('Edge Label');
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
  });
});
