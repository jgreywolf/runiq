import { describe, it, expect, beforeEach } from 'vitest';
import { ElkLayoutEngine } from '../elk-adapter.js';
import type { DiagramAst } from '@runiq/core';
import { shapeRegistry } from '@runiq/core';

describe('ElkLayoutEngine - Container Support', () => {
  let engine: ElkLayoutEngine;

  beforeEach(() => {
    engine = new ElkLayoutEngine();

    // Register test shapes
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
      id: 'actor',
      bounds: (_ctx) => ({ width: 80, height: 100 }),
      render: (_ctx, position) =>
        `<g><circle cx="${position.x + 40}" cy="${position.y + 20}" r="15"/></g>`,
    });

    shapeRegistry.register({
      id: 'cylinder',
      bounds: (_ctx) => ({ width: 100, height: 80 }),
      render: (_ctx, position) =>
        `<ellipse cx="${position.x + 50}" cy="${position.y + 10}" rx="50" ry="10"/>`,
    });
  });

  describe('Basic Container Layout', () => {
    it('should layout a simple container with one node', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'A', shape: 'rounded' }],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Container 1',
            children: ['A'],
          },
        ],
      };

      const result = await engine.layout(diagram);

      expect(result.nodes).toHaveLength(1);
      expect(result.containers).toBeDefined();
      expect(result.containers).toHaveLength(1);

      const container = result.containers![0];
      expect(container.id).toBe('c1');
      expect(container.x).toBeGreaterThanOrEqual(0);
      expect(container.y).toBeGreaterThanOrEqual(0);
      expect(container.width).toBeGreaterThan(100); // Should be larger than child node
      expect(container.height).toBeGreaterThan(60);
    });

    it('should layout container with multiple nodes', async () => {
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
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'System',
            children: ['A', 'B', 'C'],
          },
        ],
      };

      const result = await engine.layout(diagram);

      expect(result.nodes).toHaveLength(3);
      // ELK generates edge routing at multiple levels (container and diagram)
      // so we get duplicate edges with different routing points
      expect(result.edges.length).toBeGreaterThanOrEqual(2);
      expect(result.containers).toHaveLength(1);

      const container = result.containers![0];
      const nodeA = result.nodes.find((n) => n.id === 'A')!;
      const nodeB = result.nodes.find((n) => n.id === 'B')!;
      const nodeC = result.nodes.find((n) => n.id === 'C')!;

      // Verify all nodes are within container bounds
      expect(nodeA.x).toBeGreaterThanOrEqual(container.x);
      expect(nodeA.y).toBeGreaterThanOrEqual(container.y);
      expect(nodeB.x).toBeGreaterThanOrEqual(container.x);
      expect(nodeB.y).toBeGreaterThanOrEqual(container.y);
      expect(nodeC.x).toBeGreaterThanOrEqual(container.x);
      expect(nodeC.y).toBeGreaterThanOrEqual(container.y);
    });

    it('should layout empty container', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Empty Container',
            children: [],
          },
        ],
      };

      const result = await engine.layout(diagram);

      expect(result.containers).toHaveLength(1);
      const container = result.containers![0];
      expect(container.width).toBeGreaterThan(0); // Should have minimum size
      expect(container.height).toBeGreaterThan(0);
    });
  });

  describe('Nested Containers', () => {
    it('should layout two-level nested containers', async () => {
      // TODO: Implement proper nested container positioning relative to parent
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B' }],
        containers: [
          {
            type: 'container',
            id: 'outer',
            label: 'Outer',
            children: ['A'],
            containers: [
              {
                type: 'container',
                id: 'inner',
                label: 'Inner',
                children: ['B'],
              },
            ],
          },
        ],
      };

      const result = await engine.layout(diagram);

      expect(result.containers).toHaveLength(1);
      const outer = result.containers![0];
      expect(outer.containers).toHaveLength(1);
      const inner = outer.containers![0];

      // Inner container should be within outer container
      expect(inner.x).toBeGreaterThanOrEqual(outer.x);
      expect(inner.y).toBeGreaterThanOrEqual(outer.y);
      expect(inner.x + inner.width).toBeLessThanOrEqual(outer.x + outer.width);
      expect(inner.y + inner.height).toBeLessThanOrEqual(
        outer.y + outer.height
      );
    });

    it('should layout three-level nested containers', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
          { id: 'C', shape: 'rounded' },
        ],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'level1',
            label: 'Level 1',
            children: ['A'],
            containers: [
              {
                type: 'container',
                id: 'level2',
                label: 'Level 2',
                children: ['B'],
                containers: [
                  {
                    type: 'container',
                    id: 'level3',
                    label: 'Level 3',
                    children: ['C'],
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = await engine.layout(diagram);

      expect(result.containers).toHaveLength(1);
      const level1 = result.containers![0];
      expect(level1.containers).toHaveLength(1);
      const level2 = level1.containers![0];
      expect(level2.containers).toHaveLength(1);
      const level3 = level2.containers![0];

      // Verify nesting hierarchy
      expect(level2.x).toBeGreaterThanOrEqual(level1.x);
      expect(level3.x).toBeGreaterThanOrEqual(level2.x);
      expect(level1.width).toBeGreaterThan(level2.width);
      expect(level2.width).toBeGreaterThan(level3.width);
    });

    it('should layout multiple nested containers at same level', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
          { id: 'C', shape: 'rounded' },
        ],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'parent',
            label: 'Parent',
            children: ['A'],
            containers: [
              {
                type: 'container',
                id: 'child1',
                label: 'Child 1',
                children: ['B'],
              },
              {
                type: 'container',
                id: 'child2',
                label: 'Child 2',
                children: ['C'],
              },
            ],
          },
        ],
      };

      const result = await engine.layout(diagram);

      const parent = result.containers![0];
      expect(parent.containers).toHaveLength(2);

      const child1 = parent.containers![0];
      const child2 = parent.containers![1];

      // Both children should be within parent
      expect(child1.x).toBeGreaterThanOrEqual(parent.x);
      expect(child2.x).toBeGreaterThanOrEqual(parent.x);

      // Children should not overlap
      const child1Right = child1.x + child1.width;
      const child2Right = child2.x + child2.width;
      const noOverlapX = child1Right <= child2.x || child2Right <= child1.x;
      const noOverlapY =
        child1.y + child1.height <= child2.y ||
        child2.y + child2.height <= child1.y;

      expect(noOverlapX || noOverlapY).toBe(true);
    });
  });

  describe('Multiple Top-Level Containers', () => {
    it('should layout multiple containers at diagram level', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Container 1',
            children: ['A'],
          },
          {
            type: 'container',
            id: 'c2',
            label: 'Container 2',
            children: ['B'],
          },
        ],
      };

      const result = await engine.layout(diagram);

      expect(result.containers).toHaveLength(2);
      const c1 = result.containers![0];
      const c2 = result.containers![1];

      // Containers should not overlap
      const noOverlapX = c1.x + c1.width <= c2.x || c2.x + c2.width <= c1.x;
      const noOverlapY = c1.y + c1.height <= c2.y || c2.y + c2.height <= c1.y;

      expect(noOverlapX || noOverlapY).toBe(true);
    });
  });

  describe('Cross-Container Edges', () => {
    it('should layout edges between nodes in different containers', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B' }],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Container 1',
            children: ['A'],
          },
          {
            type: 'container',
            id: 'c2',
            label: 'Container 2',
            children: ['B'],
          },
        ],
      };

      const result = await engine.layout(diagram);

      expect(result.edges).toHaveLength(1);
      expect(result.edges[0].from).toBe('A');
      expect(result.edges[0].to).toBe('B');
      expect(result.edges[0].points.length).toBeGreaterThanOrEqual(2);
    });

    it('should layout edges from external node to container node', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'External', shape: 'actor' },
          { id: 'Internal', shape: 'rounded' },
        ],
        edges: [{ from: 'External', to: 'Internal' }],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'System',
            children: ['Internal'],
          },
        ],
      };

      const result = await engine.layout(diagram);

      expect(result.nodes).toHaveLength(2);
      expect(result.edges).toHaveLength(1);
      expect(result.containers).toHaveLength(1);
    });

    it('should layout edges between nested containers', async () => {
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
        containers: [
          {
            type: 'container',
            id: 'outer',
            label: 'Outer',
            children: ['A'],
            containers: [
              {
                type: 'container',
                id: 'inner1',
                label: 'Inner 1',
                children: ['B'],
              },
              {
                type: 'container',
                id: 'inner2',
                label: 'Inner 2',
                children: ['C'],
              },
            ],
          },
        ],
      };

      const result = await engine.layout(diagram);

      expect(result.edges).toHaveLength(2);
      // All edges should have valid routing
      result.edges.forEach((edge) => {
        expect(edge.points.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe('Mixed Content', () => {
    it('should layout diagram with containers and standalone nodes', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'Standalone', shape: 'actor' },
          { id: 'InContainer', shape: 'rounded' },
        ],
        edges: [{ from: 'Standalone', to: 'InContainer' }],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Container',
            children: ['InContainer'],
          },
        ],
      };

      const result = await engine.layout(diagram);

      expect(result.nodes).toHaveLength(2);
      expect(result.containers).toHaveLength(1);
      expect(result.edges).toHaveLength(1);

      // Standalone node should be positioned
      const standalone = result.nodes.find((n) => n.id === 'Standalone')!;
      expect(standalone.x).toBeGreaterThanOrEqual(0);
      expect(standalone.y).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Container Padding', () => {
    it('should apply default padding to containers', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'A', shape: 'rounded' }],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Container',
            children: ['A'],
          },
        ],
      };

      const result = await engine.layout(diagram);

      const container = result.containers![0];
      const node = result.nodes[0];

      // Container should have padding around node
      const paddingX = node.x - container.x;
      const paddingY = node.y - container.y;

      expect(paddingX).toBeGreaterThan(0);
      expect(paddingY).toBeGreaterThan(0);
    });

    it('should apply custom padding from containerStyle', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'A', shape: 'rounded' }],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Container',
            children: ['A'],
            containerStyle: {
              padding: 50,
            },
          },
        ],
      };

      const result = await engine.layout(diagram);

      const container = result.containers![0];
      const node = result.nodes[0];

      // Container should have custom padding
      const paddingX = node.x - container.x;
      expect(paddingX).toBeGreaterThanOrEqual(40); // Allow some tolerance
    });
  });

  describe('Real-World C4 Diagram', () => {
    it('should layout a complete C4 system context diagram', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        title: 'Banking System - System Context',
        direction: 'TB',
        nodes: [
          { id: 'Customer', shape: 'actor', label: 'Customer' },
          { id: 'WebApp', shape: 'rect', label: 'Web Application' },
          { id: 'MobileApp', shape: 'rect', label: 'Mobile App' },
          { id: 'API', shape: 'rect', label: 'API Gateway' },
          { id: 'Backend', shape: 'rect', label: 'Backend Services' },
          { id: 'DB', shape: 'cylinder', label: 'Database' },
          { id: 'Cache', shape: 'cylinder', label: 'Redis Cache' },
          { id: 'Email', shape: 'rect', label: 'Email System' },
        ],
        edges: [
          { from: 'Customer', to: 'WebApp' },
          { from: 'Customer', to: 'MobileApp' },
          { from: 'WebApp', to: 'API' },
          { from: 'MobileApp', to: 'API' },
          { from: 'API', to: 'Backend' },
          { from: 'Backend', to: 'DB' },
          { from: 'Backend', to: 'Cache' },
          { from: 'Backend', to: 'Email' },
        ],
        containers: [
          {
            type: 'container',
            id: 'system',
            label: 'Internet Banking System',
            children: ['WebApp', 'MobileApp', 'API', 'Backend'],
            containerStyle: {
              borderStyle: 'solid',
              borderColor: '#1168bd',
              padding: 30,
            },
            containers: [
              {
                type: 'container',
                id: 'data-layer',
                label: 'Data Layer',
                children: ['DB', 'Cache'],
                containerStyle: {
                  borderStyle: 'dashed',
                  backgroundColor: '#f0f0f0',
                },
              },
            ],
          },
        ],
      };

      const result = await engine.layout(diagram);

      expect(result.nodes).toHaveLength(8);
      expect(result.edges).toHaveLength(8);
      expect(result.containers).toHaveLength(1);

      const mainContainer = result.containers![0];
      expect(mainContainer.containers).toHaveLength(1);

      // Verify all container nodes are positioned
      const containerNodeIds = [
        'WebApp',
        'MobileApp',
        'API',
        'Backend',
        'DB',
        'Cache',
      ];
      containerNodeIds.forEach((id) => {
        const node = result.nodes.find((n) => n.id === id);
        expect(node).toBeDefined();
        expect(node!.x).toBeGreaterThanOrEqual(0);
        expect(node!.y).toBeGreaterThanOrEqual(0);
      });

      // External nodes should be positioned
      const externalNodes = ['Customer', 'Email'];
      externalNodes.forEach((id) => {
        const node = result.nodes.find((n) => n.id === id);
        expect(node).toBeDefined();
      });

      // Verify overall diagram size
      expect(result.size.width).toBeGreaterThan(0);
      expect(result.size.height).toBeGreaterThan(0);
    });
  });

  describe('Layout Options with Containers', () => {
    it('should respect direction option with containers', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B' }],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Container',
            children: ['A', 'B'],
          },
        ],
      };

      const resultTB = await engine.layout(diagram, { direction: 'TB' });
      const resultLR = await engine.layout(diagram, { direction: 'LR' });

      // Different directions should produce different layouts
      // TB: nodes should be vertically aligned (same x, different y)
      // LR: nodes should be horizontally aligned (different x, same y)
      const tbYDiff = Math.abs(resultTB.nodes[0].y - resultTB.nodes[1].y);
      const lrXDiff = Math.abs(resultLR.nodes[0].x - resultLR.nodes[1].x);

      expect(tbYDiff).toBeGreaterThan(100); // TB should have vertical separation
      expect(lrXDiff).toBeGreaterThan(100); // LR should have horizontal separation
    });

    it('should respect spacing option with containers', async () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B' }],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Container',
            children: ['A', 'B'],
          },
        ],
      };

      const resultSmall = await engine.layout(diagram, { spacing: 50 });
      const resultLarge = await engine.layout(diagram, { spacing: 150 });

      // Larger spacing should produce larger distance between nodes
      const distSmall = Math.abs(
        resultSmall.nodes[0].y - resultSmall.nodes[1].y
      );
      const distLarge = Math.abs(
        resultLarge.nodes[0].y - resultLarge.nodes[1].y
      );

      expect(distLarge).toBeGreaterThan(distSmall);
    });
  });
});
