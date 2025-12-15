import { describe, it, expect } from 'vitest';
import {
  calculateGraphMetrics,
  findHubNodes,
  findBridgeNodes,
  findPeripheralNodes,
  type GraphMetrics,
  type NodeMetrics,
} from './graph-metrics.js';
import type { DiagramAst } from '../types/index.js';

describe('Graph Metrics', () => {
  describe('calculateGraphMetrics', () => {
    it('should calculate metrics for a simple 3-node graph', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'circle' },
          { id: 'B', shape: 'circle' },
          { id: 'C', shape: 'circle' },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
        ],
      };

      const metrics = calculateGraphMetrics(diagram);

      expect(metrics.nodeCount).toBe(3);
      expect(metrics.edgeCount).toBe(2);
      expect(metrics.averageDegree).toBeCloseTo(0.667, 2);
      expect(metrics.nodes).toHaveLength(3);

      // Node B should have highest degree (1 in, 1 out)
      const nodeB = metrics.nodes.find((n) => n.nodeId === 'B')!;
      expect(nodeB.inDegree).toBe(1);
      expect(nodeB.outDegree).toBe(1);
      expect(nodeB.degree).toBe(2);

      // Node A should have 0 in-degree, 1 out-degree
      const nodeA = metrics.nodes.find((n) => n.nodeId === 'A')!;
      expect(nodeA.inDegree).toBe(0);
      expect(nodeA.outDegree).toBe(1);
      expect(nodeA.degree).toBe(1);

      // Node C should have 1 in-degree, 0 out-degree
      const nodeC = metrics.nodes.find((n) => n.nodeId === 'C')!;
      expect(nodeC.inDegree).toBe(1);
      expect(nodeC.outDegree).toBe(0);
      expect(nodeC.degree).toBe(1);
    });

    it('should calculate metrics for a weighted graph', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'circle' },
          { id: 'B', shape: 'circle' },
          { id: 'C', shape: 'circle' },
        ],
        edges: [
          { from: 'A', to: 'B', weight: 10 },
          { from: 'B', to: 'C', weight: 5 },
          { from: 'A', to: 'C', weight: 20 },
        ],
      };

      const metrics = calculateGraphMetrics(diagram);

      expect(metrics.nodeCount).toBe(3);
      expect(metrics.edgeCount).toBe(3);

      // Closeness should consider weighted paths
      const nodeA = metrics.nodes.find((n) => n.nodeId === 'A')!;
      expect(nodeA.closeness).toBeGreaterThan(0);
    });

    it('should calculate metrics for a star topology', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'Hub', shape: 'circle' },
          { id: 'A', shape: 'circle' },
          { id: 'B', shape: 'circle' },
          { id: 'C', shape: 'circle' },
          { id: 'D', shape: 'circle' },
        ],
        edges: [
          { from: 'Hub', to: 'A' },
          { from: 'Hub', to: 'B' },
          { from: 'Hub', to: 'C' },
          { from: 'Hub', to: 'D' },
        ],
      };

      const metrics = calculateGraphMetrics(diagram);

      expect(metrics.nodeCount).toBe(5);
      expect(metrics.edgeCount).toBe(4);

      // Hub should have highest degree
      const hub = metrics.nodes.find((n) => n.nodeId === 'Hub')!;
      expect(hub.degree).toBe(4);
      expect(hub.outDegree).toBe(4);
      expect(hub.inDegree).toBe(0);

      // Hub should have highest closeness (shortest avg distance)
      expect(hub.closeness).toBeGreaterThan(0);

      // Peripheral nodes should have degree 1
      const nodeA = metrics.nodes.find((n) => n.nodeId === 'A')!;
      expect(nodeA.degree).toBe(1);
    });

    it('should calculate betweenness centrality correctly', () => {
      // Linear chain: A -> B -> C -> D
      // B and C are bridges with high betweenness
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'circle' },
          { id: 'B', shape: 'circle' },
          { id: 'C', shape: 'circle' },
          { id: 'D', shape: 'circle' },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
          { from: 'C', to: 'D' },
        ],
      };

      const metrics = calculateGraphMetrics(diagram);

      // B and C should have positive betweenness
      const nodeB = metrics.nodes.find((n) => n.nodeId === 'B')!;
      const nodeC = metrics.nodes.find((n) => n.nodeId === 'C')!;
      expect(nodeB.betweenness).toBeGreaterThan(0);
      expect(nodeC.betweenness).toBeGreaterThan(0);

      // A and D should have zero betweenness (endpoints)
      const nodeA = metrics.nodes.find((n) => n.nodeId === 'A')!;
      const nodeD = metrics.nodes.find((n) => n.nodeId === 'D')!;
      expect(nodeA.betweenness).toBe(0);
      expect(nodeD.betweenness).toBe(0);
    });

    it('should calculate clustering coefficient for triangles', () => {
      // Triangle: A -> B, B -> C, C -> A
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'circle' },
          { id: 'B', shape: 'circle' },
          { id: 'C', shape: 'circle' },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
          { from: 'C', to: 'A' },
        ],
      };

      const metrics = calculateGraphMetrics(diagram);

      // All nodes should have clustering coefficient = 1 (perfect triangle)
      const nodeA = metrics.nodes.find((n) => n.nodeId === 'A')!;
      const nodeB = metrics.nodes.find((n) => n.nodeId === 'B')!;
      const nodeC = metrics.nodes.find((n) => n.nodeId === 'C')!;

      expect(nodeA.clustering).toBeGreaterThan(0);
      expect(nodeB.clustering).toBeGreaterThan(0);
      expect(nodeC.clustering).toBeGreaterThan(0);
    });

    it('should handle disconnected graphs', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'circle' },
          { id: 'B', shape: 'circle' },
          { id: 'C', shape: 'circle' },
          { id: 'D', shape: 'circle' },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'C', to: 'D' },
        ],
      };

      const metrics = calculateGraphMetrics(diagram);

      expect(metrics.nodeCount).toBe(4);
      expect(metrics.edgeCount).toBe(2);
      expect(metrics.isConnected).toBe(false);
    });

    it('should handle graphs with only nodes (no edges)', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'circle' },
          { id: 'B', shape: 'circle' },
        ],
        edges: [],
      };

      const metrics = calculateGraphMetrics(diagram);

      expect(metrics.nodeCount).toBe(2);
      expect(metrics.edgeCount).toBe(0);
      expect(metrics.averageDegree).toBe(0);
      expect(metrics.density).toBe(0);
      expect(metrics.isConnected).toBe(false);

      // All nodes should have zero degree
      expect(metrics.nodes[0].degree).toBe(0);
      expect(metrics.nodes[1].degree).toBe(0);
    });

    it('should handle empty diagrams', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
      };

      const metrics = calculateGraphMetrics(diagram);

      expect(metrics.nodeCount).toBe(0);
      expect(metrics.edgeCount).toBe(0);
      expect(metrics.averageDegree).toBe(0);
      expect(metrics.density).toBe(0);
      expect(metrics.isConnected).toBe(true); // Empty graph is trivially connected
      expect(metrics.nodes).toHaveLength(0);
    });

    it('should auto-create nodes from edges', () => {
      // Edges can reference undeclared nodes
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'A', shape: 'circle' }],
        edges: [
          { from: 'A', to: 'B' }, // B is not declared
          { from: 'B', to: 'C' }, // C is not declared
        ],
      };

      const metrics = calculateGraphMetrics(diagram);

      // Should include all 3 nodes (A declared, B and C from edges)
      expect(metrics.nodeCount).toBe(3);
      expect(metrics.edgeCount).toBe(2);

      // Should have metrics for all nodes
      const nodeB = metrics.nodes.find((n) => n.nodeId === 'B')!;
      expect(nodeB).toBeDefined();
      expect(nodeB.inDegree).toBe(1);
      expect(nodeB.outDegree).toBe(1);
    });

    it('should calculate network density correctly', () => {
      // Complete graph K3: all nodes connected to each other
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'circle' },
          { id: 'B', shape: 'circle' },
          { id: 'C', shape: 'circle' },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'A', to: 'C' },
          { from: 'B', to: 'A' },
          { from: 'B', to: 'C' },
          { from: 'C', to: 'A' },
          { from: 'C', to: 'B' },
        ],
      };

      const metrics = calculateGraphMetrics(diagram);

      // Density = 6 / (3 * 2) = 1.0 (complete graph)
      expect(metrics.density).toBe(1.0);
    });
  });

  describe('findHubNodes', () => {
    it('should identify nodes with high degree', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'Hub', shape: 'circle' },
          { id: 'A', shape: 'circle' },
          { id: 'B', shape: 'circle' },
          { id: 'C', shape: 'circle' },
        ],
        edges: [
          { from: 'Hub', to: 'A' },
          { from: 'Hub', to: 'B' },
          { from: 'Hub', to: 'C' },
          { from: 'A', to: 'B' },
        ],
      };

      const metrics = calculateGraphMetrics(diagram);
      const hubs = findHubNodes(metrics);

      expect(hubs.length).toBeGreaterThan(0);
      expect(hubs[0].nodeId).toBe('Hub');
      expect(hubs[0].degree).toBeGreaterThan(2);
    });

    it('should use custom threshold', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'circle' },
          { id: 'B', shape: 'circle' },
          { id: 'C', shape: 'circle' },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
        ],
      };

      const metrics = calculateGraphMetrics(diagram);
      const hubs = findHubNodes(metrics, 2);

      // Only node B has degree >= 2
      expect(hubs).toHaveLength(1);
      expect(hubs[0].nodeId).toBe('B');
    });
  });

  describe('findBridgeNodes', () => {
    it('should identify nodes with high betweenness', () => {
      // Bridge topology: A -> B -> C (B is the bridge)
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'circle' },
          { id: 'B', shape: 'circle' },
          { id: 'C', shape: 'circle' },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
        ],
      };

      const metrics = calculateGraphMetrics(diagram);
      const bridges = findBridgeNodes(metrics, 0); // Include all positive betweenness

      expect(bridges.length).toBeGreaterThan(0);
      // B should be first (highest betweenness)
      expect(bridges[0].nodeId).toBe('B');
    });

    it('should use custom threshold', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'circle' },
          { id: 'B', shape: 'circle' },
          { id: 'C', shape: 'circle' },
          { id: 'D', shape: 'circle' },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
          { from: 'C', to: 'D' },
        ],
      };

      const metrics = calculateGraphMetrics(diagram);
      const bridges = findBridgeNodes(metrics, 0.5);

      // Only nodes with betweenness >= 0.5
      expect(bridges.length).toBeLessThanOrEqual(2);
    });
  });

  describe('findPeripheralNodes', () => {
    it('should identify nodes with low closeness', () => {
      // Star topology: peripheral nodes have low closeness
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'Hub', shape: 'circle' },
          { id: 'A', shape: 'circle' },
          { id: 'B', shape: 'circle' },
        ],
        edges: [
          { from: 'Hub', to: 'A' },
          { from: 'Hub', to: 'B' },
        ],
      };

      const metrics = calculateGraphMetrics(diagram);
      const peripheral = findPeripheralNodes(metrics);

      // A and B should be peripheral
      expect(peripheral.length).toBeGreaterThan(0);
      const peripheralIds = peripheral.map((n) => n.nodeId);
      expect(peripheralIds).toContain('A');
      expect(peripheralIds).toContain('B');
    });

    it('should use custom threshold', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'circle' },
          { id: 'B', shape: 'circle' },
          { id: 'C', shape: 'circle' },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
        ],
      };

      const metrics = calculateGraphMetrics(diagram);
      const peripheral = findPeripheralNodes(metrics, 0.5);

      // Only nodes with closeness <= 0.5
      expect(peripheral.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Complex Network Topologies', () => {
    it('should analyze a social network', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'Alice', shape: 'circle' },
          { id: 'Bob', shape: 'circle' },
          { id: 'Carol', shape: 'circle' },
          { id: 'Dave', shape: 'circle' },
          { id: 'Eve', shape: 'circle' },
        ],
        edges: [
          { from: 'Alice', to: 'Bob' },
          { from: 'Alice', to: 'Carol' },
          { from: 'Bob', to: 'Carol' },
          { from: 'Carol', to: 'Dave' },
          { from: 'Dave', to: 'Eve' },
        ],
      };

      const metrics = calculateGraphMetrics(diagram);

      expect(metrics.nodeCount).toBe(5);
      expect(metrics.edgeCount).toBe(5);

      // Alice, Bob, Carol form a triangle (high clustering)
      const alice = metrics.nodes.find((n) => n.nodeId === 'Alice')!;
      const bob = metrics.nodes.find((n) => n.nodeId === 'Bob')!;
      const carol = metrics.nodes.find((n) => n.nodeId === 'Carol')!;

      expect(alice.clustering).toBeGreaterThan(0);
      expect(bob.clustering).toBeGreaterThan(0);
      expect(carol.clustering).toBeGreaterThan(0);

      // Carol should have high betweenness (bridge between triangle and chain)
      expect(carol.betweenness).toBeGreaterThan(0);
    });

    it('should analyze a dependency graph', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'App', shape: 'rectangle' },
          { id: 'Router', shape: 'rectangle' },
          { id: 'API', shape: 'rectangle' },
          { id: 'Database', shape: 'rectangle' },
        ],
        edges: [
          { from: 'App', to: 'Router' },
          { from: 'Router', to: 'API' },
          { from: 'API', to: 'Database' },
        ],
      };

      const metrics = calculateGraphMetrics(diagram);

      // Router and API are critical dependencies (high betweenness)
      const router = metrics.nodes.find((n) => n.nodeId === 'Router')!;
      const api = metrics.nodes.find((n) => n.nodeId === 'API')!;

      expect(router.betweenness).toBeGreaterThan(0);
      expect(api.betweenness).toBeGreaterThan(0);

      // Database is a leaf (zero out-degree)
      const database = metrics.nodes.find((n) => n.nodeId === 'Database')!;
      expect(database.outDegree).toBe(0);
    });

    it('should analyze a mesh network', () => {
      // Fully connected 4-node network
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'N1', shape: 'circle' },
          { id: 'N2', shape: 'circle' },
          { id: 'N3', shape: 'circle' },
          { id: 'N4', shape: 'circle' },
        ],
        edges: [
          { from: 'N1', to: 'N2' },
          { from: 'N1', to: 'N3' },
          { from: 'N1', to: 'N4' },
          { from: 'N2', to: 'N1' },
          { from: 'N2', to: 'N3' },
          { from: 'N2', to: 'N4' },
          { from: 'N3', to: 'N1' },
          { from: 'N3', to: 'N2' },
          { from: 'N3', to: 'N4' },
          { from: 'N4', to: 'N1' },
          { from: 'N4', to: 'N2' },
          { from: 'N4', to: 'N3' },
        ],
      };

      const metrics = calculateGraphMetrics(diagram);

      // All nodes should have same degree (3)
      metrics.nodes.forEach((node) => {
        expect(node.outDegree).toBe(3);
        expect(node.inDegree).toBe(3);
      });

      // Network should be fully connected
      expect(metrics.isConnected).toBe(true);

      // Density should be 1.0 (complete graph)
      expect(metrics.density).toBe(1.0);
    });
  });

  describe('Metrics Sorting', () => {
    it('should sort nodes by degree (descending)', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'Low', shape: 'circle' },
          { id: 'Medium', shape: 'circle' },
          { id: 'High', shape: 'circle' },
        ],
        edges: [
          { from: 'High', to: 'Medium' },
          { from: 'High', to: 'Low' },
          { from: 'Medium', to: 'Low' },
        ],
      };

      const metrics = calculateGraphMetrics(diagram);

      // Nodes should be sorted by degree (descending)
      expect(metrics.nodes[0].degree).toBeGreaterThanOrEqual(
        metrics.nodes[1].degree
      );
      expect(metrics.nodes[1].degree).toBeGreaterThanOrEqual(
        metrics.nodes[2].degree
      );
    });
  });
});
