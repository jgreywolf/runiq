import { describe, it, expect } from 'vitest';
import type {
  DiagramAst,
  ContainerDeclaration,
  ContainerStyle,
} from './types.js';

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
          strokeWidth: 2,
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
        strokeWidth: 3,
      };

      expect(style.borderStyle).toBe('solid');
      expect(style.strokeWidth).toBe(3);
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
        strokeWidth: 1,
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

  // ============================================================================
  // Phase 1: Container Styling Enhancements
  // ============================================================================
  describe('Phase 1: Container Headers and Titles', () => {
    it('should support header property on containers', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Container',
        header: 'Frontend Services',
        children: [],
      };

      expect(container.header).toBe('Frontend Services');
    });

    it('should support header independent of label', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'frontend',
        label: 'Frontend',
        header: 'Frontend Services Layer',
        children: [],
      };

      expect(container.label).toBe('Frontend');
      expect(container.header).toBe('Frontend Services Layer');
      expect(container.header).not.toBe(container.label);
    });

    it('should work without header (optional)', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Container',
        children: [],
      };

      expect(container.header).toBeUndefined();
    });
  });

  describe('Phase 1: Container Icons and Badges', () => {
    it('should support icon property on containers', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Backend',
        icon: 'server',
        children: [],
      };

      expect(container.icon).toBe('server');
    });

    it('should support different icon names', () => {
      const containers = [
        { icon: 'database' },
        { icon: 'cloud' },
        { icon: 'lock' },
        { icon: 'users' },
      ];

      expect(containers[0].icon).toBe('database');
      expect(containers[1].icon).toBe('cloud');
      expect(containers[2].icon).toBe('lock');
      expect(containers[3].icon).toBe('users');
    });

    it('should work without icon (optional)', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Container',
        children: [],
      };

      expect(container.icon).toBeUndefined();
    });

    it('should support badge property on containers', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'API Gateway',
        badge: 'v2.0',
        children: [],
      };

      expect(container.badge).toBe('v2.0');
    });

    it('should support both icon and badge', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'api',
        label: 'API',
        icon: 'server',
        badge: 'v2.0',
        children: [],
      };

      expect(container.icon).toBe('server');
      expect(container.badge).toBe('v2.0');
    });
  });

  describe('Phase 1: Container Shadow and Depth', () => {
    it('should support shadow in containerStyle', () => {
      const style: ContainerStyle = {
        shadow: true,
      };

      expect(style.shadow).toBe(true);
    });

    it('should support shadow as false', () => {
      const style: ContainerStyle = {
        shadow: false,
      };

      expect(style.shadow).toBe(false);
    });

    it('should support depth property for visual hierarchy', () => {
      const style: ContainerStyle = {
        depth: 2,
      };

      expect(style.depth).toBe(2);
    });

    it('should support different depth levels', () => {
      const styles = [{ depth: 0 }, { depth: 1 }, { depth: 2 }, { depth: 3 }];

      expect(styles[0].depth).toBe(0);
      expect(styles[1].depth).toBe(1);
      expect(styles[2].depth).toBe(2);
      expect(styles[3].depth).toBe(3);
    });

    it('should support shadow and depth together', () => {
      const style: ContainerStyle = {
        shadow: true,
        depth: 2,
        backgroundColor: '#f0f0f0',
      };

      expect(style.shadow).toBe(true);
      expect(style.depth).toBe(2);
      expect(style.backgroundColor).toBe('#f0f0f0');
    });
  });

  describe('Phase 1: Collapsed State (for Phase 2)', () => {
    it('should support collapsed property on containers', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Container',
        collapsed: false,
        children: [],
      };

      expect(container.collapsed).toBe(false);
    });

    it('should support collapsed as true', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Container',
        collapsed: true,
        children: ['node1', 'node2'],
      };

      expect(container.collapsed).toBe(true);
    });

    it('should work without collapsed (defaults to undefined)', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Container',
        children: [],
      };

      expect(container.collapsed).toBeUndefined();
    });

    it('should support collapsible property', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Container',
        collapsible: true,
        collapsed: false,
        children: [],
      };

      expect(container.collapsible).toBe(true);
      expect(container.collapsed).toBe(false);
    });
  });

  describe('Phase 1: Enhanced Container Styling', () => {
    it('should support all Phase 1 style properties together', () => {
      const style: ContainerStyle = {
        borderStyle: 'solid',
        borderColor: '#01579b',
        strokeWidth: 2,
        backgroundColor: '#e1f5fe',
        opacity: 0.9,
        padding: 20,
        labelPosition: 'top',
        shadow: true,
        depth: 1,
      };

      expect(style.borderStyle).toBe('solid');
      expect(style.borderColor).toBe('#01579b');
      expect(style.strokeWidth).toBe(2);
      expect(style.backgroundColor).toBe('#e1f5fe');
      expect(style.opacity).toBe(0.9);
      expect(style.padding).toBe(20);
      expect(style.labelPosition).toBe('top');
      expect(style.shadow).toBe(true);
      expect(style.depth).toBe(1);
    });

    it('should support header position styling', () => {
      const style: ContainerStyle = {
        headerPosition: 'top',
      };

      expect(style.headerPosition).toBe('top');
    });

    it('should support different header positions', () => {
      const positions: Array<'top' | 'bottom' | 'left' | 'right'> = [
        'top',
        'bottom',
        'left',
        'right',
      ];

      positions.forEach((pos) => {
        const style: ContainerStyle = {
          headerPosition: pos,
        };
        expect(style.headerPosition).toBe(pos);
      });
    });

    it('should support header background color', () => {
      const style: ContainerStyle = {
        headerBackgroundColor: '#1976d2',
      };

      expect(style.headerBackgroundColor).toBe('#1976d2');
    });

    it('should support icon size', () => {
      const style: ContainerStyle = {
        iconSize: 24,
      };

      expect(style.iconSize).toBe(24);
    });

    it('should support icon color', () => {
      const style: ContainerStyle = {
        iconColor: '#ffffff',
      };

      expect(style.iconColor).toBe('#ffffff');
    });
  });

  describe('Phase 1: Complete Container Example', () => {
    it('should support a fully styled container with all Phase 1 features', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'frontend',
        label: 'Frontend',
        header: 'Frontend Services',
        icon: 'desktop',
        badge: 'v3.2',
        collapsible: true,
        collapsed: false,
        containerStyle: {
          backgroundColor: '#e1f5fe',
          borderColor: '#01579b',
          strokeWidth: 2,
          borderStyle: 'solid',
          padding: 20,
          shadow: true,
          depth: 1,
          labelPosition: 'top',
          headerPosition: 'top',
          headerBackgroundColor: '#0277bd',
          iconSize: 20,
          iconColor: '#ffffff',
          opacity: 0.95,
        },
        children: ['ui', 'components'],
      };

      expect(container.type).toBe('container');
      expect(container.header).toBe('Frontend Services');
      expect(container.icon).toBe('desktop');
      expect(container.badge).toBe('v3.2');
      expect(container.collapsible).toBe(true);
      expect(container.collapsed).toBe(false);
      expect(container.containerStyle?.shadow).toBe(true);
      expect(container.containerStyle?.depth).toBe(1);
      expect(container.containerStyle?.headerBackgroundColor).toBe('#0277bd');
      expect(container.containerStyle?.iconSize).toBe(20);
      expect(container.children).toHaveLength(2);
    });
  });

  describe('Phase 1: Nested Container Visual Hierarchy', () => {
    it('should support different depths for nested containers', () => {
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
            id: 'outer',
            label: 'Outer',
            containerStyle: { depth: 0 },
            children: ['n1'],
            containers: [
              {
                type: 'container',
                id: 'middle',
                label: 'Middle',
                containerStyle: { depth: 1 },
                children: ['n2'],
                containers: [
                  {
                    type: 'container',
                    id: 'inner',
                    label: 'Inner',
                    containerStyle: { depth: 2 },
                    children: ['n3'],
                  },
                ],
              },
            ],
          },
        ],
      };

      expect(diagram.containers![0].containerStyle?.depth).toBe(0);
      expect(diagram.containers![0].containers![0].containerStyle?.depth).toBe(
        1
      );
      expect(
        diagram.containers![0].containers![0].containers![0].containerStyle
          ?.depth
      ).toBe(2);
    });

    it('should support automatic depth calculation based on nesting', () => {
      const outer: ContainerDeclaration = {
        type: 'container',
        id: 'outer',
        label: 'Outer',
        children: [],
        containers: [
          {
            type: 'container',
            id: 'inner',
            label: 'Inner',
            children: [],
          },
        ],
      };

      const nestingLevel = outer.containers ? 1 : 0;
      expect(nestingLevel).toBe(1);
    });
  });

  describe('Phase 1: Style Inheritance Rules', () => {
    it('should support style inheritance from parent to child containers', () => {
      const parent: ContainerDeclaration = {
        type: 'container',
        id: 'parent',
        label: 'Parent',
        containerStyle: {
          backgroundColor: '#f0f0f0',
          borderColor: '#333',
          padding: 20,
        },
        children: [],
        containers: [
          {
            type: 'container',
            id: 'child',
            label: 'Child',
            children: [],
            // Child can inherit or override parent styles
          },
        ],
      };

      expect(parent.containerStyle?.backgroundColor).toBe('#f0f0f0');
      expect(parent.containers![0].containerStyle).toBeUndefined();
    });

    it('should allow child containers to override inherited styles', () => {
      const parent: ContainerDeclaration = {
        type: 'container',
        id: 'parent',
        label: 'Parent',
        containerStyle: {
          backgroundColor: '#f0f0f0',
          borderColor: '#333',
        },
        children: [],
        containers: [
          {
            type: 'container',
            id: 'child',
            label: 'Child',
            containerStyle: {
              backgroundColor: '#e0e0e0', // Override parent
            },
            children: [],
          },
        ],
      };

      expect(parent.containerStyle?.backgroundColor).toBe('#f0f0f0');
      expect(parent.containers![0].containerStyle?.backgroundColor).toBe(
        '#e0e0e0'
      );
    });

    it('should support inherit keyword for explicit inheritance', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Container',
        containerStyle: {
          backgroundColor: 'inherit',
        },
        children: [],
      };

      expect(container.containerStyle?.backgroundColor).toBe('inherit');
    });
  });
});
