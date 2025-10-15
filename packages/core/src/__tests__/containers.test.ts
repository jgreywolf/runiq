import { describe, it, expect } from 'vitest';
import type {
  DiagramAst,
  ContainerDeclaration,
  ContainerStyle,
} from '../types.js';

describe('Hierarchical Containers - Core Types', () => {
  describe('ContainerDeclaration Type', () => {
    it('should define a simple container with nodes', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'system1',
        label: 'System Boundary',
        children: ['node1', 'node2'],
      };

      expect(container.type).toBe('container');
      expect(container.id).toBe('system1');
      expect(container.label).toBe('System Boundary');
      expect(container.children).toHaveLength(2);
    });

    it('should support containers without explicit ID (derived from label)', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        label: 'My Container',
        children: [],
      };

      // ID is optional, can be derived from label during parsing
      expect(container.label).toBe('My Container');
    });

    it('should support nested containers', () => {
      const nested: ContainerDeclaration = {
        type: 'container',
        id: 'outer',
        label: 'Outer Container',
        children: ['node1'],
        containers: [
          {
            type: 'container',
            id: 'inner',
            label: 'Inner Container',
            children: ['node2', 'node3'],
          },
        ],
      };

      expect(nested.containers).toHaveLength(1);
      expect(nested.containers![0].id).toBe('inner');
    });

    it('should support container styles', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'styled',
        label: 'Styled Container',
        children: [],
        containerStyle: {
          borderStyle: 'dashed',
          borderColor: '#666',
          borderWidth: 2,
          backgroundColor: 'transparent',
        },
      };

      expect(container.containerStyle?.borderStyle).toBe('dashed');
      expect(container.containerStyle?.borderColor).toBe('#666');
    });

    it('should support named style references', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Container',
        children: [],
        style: 'secureZone',
      };

      expect(container.style).toBe('secureZone');
    });
  });

  describe('ContainerStyle Type', () => {
    it('should define border styles', () => {
      const style: ContainerStyle = {
        borderStyle: 'solid',
        borderColor: 'red',
        borderWidth: 3,
      };

      expect(style.borderStyle).toBe('solid');
      expect(style.borderWidth).toBe(3);
    });

    it('should define background styles', () => {
      const style: ContainerStyle = {
        backgroundColor: '#f0f0f0',
        opacity: 0.5,
      };

      expect(style.backgroundColor).toBe('#f0f0f0');
      expect(style.opacity).toBe(0.5);
    });

    it('should define padding', () => {
      const style: ContainerStyle = {
        padding: 20,
      };

      expect(style.padding).toBe(20);
    });

    it('should define label positioning', () => {
      const style: ContainerStyle = {
        labelPosition: 'top',
      };

      expect(style.labelPosition).toBe('top');
    });

    it('should support all properties together', () => {
      const style: ContainerStyle = {
        borderStyle: 'dotted',
        borderColor: 'blue',
        borderWidth: 1,
        backgroundColor: '#eef',
        opacity: 0.3,
        padding: 15,
        labelPosition: 'bottom',
      };

      expect(Object.keys(style).length).toBeGreaterThan(5);
    });
  });

  describe('DiagramAst with Containers', () => {
    it('should include containers array in diagram AST', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'n1', shape: 'rect' },
          { id: 'n2', shape: 'rect' },
        ],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Container 1',
            children: ['n1', 'n2'],
          },
        ],
      };

      expect(diagram.containers).toHaveLength(1);
      expect(diagram.containers![0].children).toContain('n1');
    });

    it('should support diagrams without containers', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'n1', shape: 'rect' }],
        edges: [],
      };

      expect(diagram.containers).toBeUndefined();
    });

    it('should support multiple top-level containers', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'n1', shape: 'rect' },
          { id: 'n2', shape: 'rect' },
          { id: 'n3', shape: 'rect' },
        ],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Container 1',
            children: ['n1'],
          },
          {
            type: 'container',
            id: 'c2',
            label: 'Container 2',
            children: ['n2', 'n3'],
          },
        ],
      };

      expect(diagram.containers).toHaveLength(2);
    });

    it('should support nested containers (3 levels)', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'n1', shape: 'rect' },
          { id: 'n2', shape: 'rect' },
          { id: 'n3', shape: 'rect' },
        ],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'level1',
            label: 'Level 1',
            children: ['n1'],
            containers: [
              {
                type: 'container',
                id: 'level2',
                label: 'Level 2',
                children: ['n2'],
                containers: [
                  {
                    type: 'container',
                    id: 'level3',
                    label: 'Level 3',
                    children: ['n3'],
                  },
                ],
              },
            ],
          },
        ],
      };

      expect(diagram.containers).toHaveLength(1);
      expect(diagram.containers![0].containers).toHaveLength(1);
      expect(diagram.containers![0].containers![0].containers).toHaveLength(1);
    });
  });

  describe('Container Node Membership', () => {
    it('should track which container a node belongs to', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'n1', shape: 'rect', data: { containerId: 'c1' } },
          { id: 'n2', shape: 'rect', data: { containerId: 'c1' } },
          { id: 'n3', shape: 'rect' }, // No container
        ],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Container',
            children: ['n1', 'n2'],
          },
        ],
      };

      const n1 = diagram.nodes.find((n) => n.id === 'n1')!;
      const n3 = diagram.nodes.find((n) => n.id === 'n3')!;

      expect(n1.data?.containerId).toBe('c1');
      expect(n3.data?.containerId).toBeUndefined();
    });
  });

  describe('Edges Across Container Boundaries', () => {
    it('should support edges between nodes in different containers', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'n1', shape: 'rect' },
          { id: 'n2', shape: 'rect' },
        ],
        edges: [
          {
            from: 'n1',
            to: 'n2',
            data: { crossesContainer: true },
          },
        ],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Container 1',
            children: ['n1'],
          },
          {
            type: 'container',
            id: 'c2',
            label: 'Container 2',
            children: ['n2'],
          },
        ],
      };

      expect(diagram.edges[0].data?.crossesContainer).toBe(true);
    });

    it('should support edges within the same container', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'n1', shape: 'rect' },
          { id: 'n2', shape: 'rect' },
        ],
        edges: [{ from: 'n1', to: 'n2' }],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Container',
            children: ['n1', 'n2'],
          },
        ],
      };

      // Edge stays within container
      expect(diagram.edges[0].from).toBe('n1');
      expect(diagram.edges[0].to).toBe('n2');
    });
  });

  describe('Container Layout Metadata', () => {
    it('should support container-specific layout options', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Container',
        children: [],
        layoutOptions: {
          algorithm: 'layered',
          direction: 'TB',
          spacing: 50,
        },
      };

      expect(container.layoutOptions?.algorithm).toBe('layered');
      expect(container.layoutOptions?.direction).toBe('TB');
    });

    it('should support different layouts per container', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'n1', shape: 'rect' },
          { id: 'n2', shape: 'rect' },
        ],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Hierarchical',
            children: ['n1'],
            layoutOptions: { algorithm: 'layered' },
          },
          {
            type: 'container',
            id: 'c2',
            label: 'Radial',
            children: ['n2'],
            layoutOptions: { algorithm: 'radial' },
          },
        ],
      };

      expect(diagram.containers![0].layoutOptions?.algorithm).toBe('layered');
      expect(diagram.containers![1].layoutOptions?.algorithm).toBe('radial');
    });
  });

  describe('Container Positioning', () => {
    it('should support positioned containers in layout output', () => {
      interface PositionedContainer {
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
        label?: string;
      }

      const positioned: PositionedContainer = {
        id: 'c1',
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        label: 'Container',
      };

      expect(positioned.width).toBeGreaterThan(0);
      expect(positioned.height).toBeGreaterThan(0);
    });
  });

  describe('Container Style Inheritance', () => {
    it('should support style inheritance from diagram to container', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
        styles: {
          secureZone: {
            stroke: 'red',
            strokeWidth: 3,
          },
        },
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Secure Container',
            children: [],
            style: 'secureZone',
          },
        ],
      };

      expect(diagram.styles?.secureZone.stroke).toBe('red');
      expect(diagram.containers![0].style).toBe('secureZone');
    });
  });

  describe('Container Validation Helpers', () => {
    it('should detect empty containers', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'empty',
        label: 'Empty Container',
        children: [],
      };

      const isEmpty =
        container.children.length === 0 &&
        (!container.containers || container.containers.length === 0);
      expect(isEmpty).toBe(true);
    });

    it('should detect non-empty containers', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'full',
        label: 'Full Container',
        children: ['n1', 'n2'],
      };

      const isEmpty = container.children.length === 0;
      expect(isEmpty).toBe(false);
    });

    it('should detect containers with only nested containers', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'parent',
        label: 'Parent',
        children: [],
        containers: [
          {
            type: 'container',
            id: 'child',
            label: 'Child',
            children: ['n1'],
          },
        ],
      };

      const hasOnlyContainers =
        container.children.length === 0 &&
        container.containers &&
        container.containers.length > 0;
      expect(hasOnlyContainers).toBe(true);
    });
  });
});
