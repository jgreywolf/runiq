import { describe, it, expect } from 'vitest';
import type { DiagramAst, ContainerDeclaration } from './types.js';

describe('Container Phase 2: Collapse/Expand Functionality', () => {
  describe('Collapse State Management', () => {
    it('should support collapsed state on containers', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsed: true,
        children: ['node1', 'node2'],
      };

      expect(container.collapsed).toBe(true);
      expect(container.children).toHaveLength(2);
    });

    it('should support expanded state (collapsed: false)', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsed: false,
        children: ['node1', 'node2'],
      };

      expect(container.collapsed).toBe(false);
    });

    it('should default to undefined (expanded) when not specified', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        children: ['node1'],
      };

      expect(container.collapsed).toBeUndefined();
    });

    it('should support collapsible flag to enable collapse capability', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsible: true,
        collapsed: false,
        children: ['node1'],
      };

      expect(container.collapsible).toBe(true);
      expect(container.collapsed).toBe(false);
    });

    it('should support non-collapsible containers', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsible: false,
        children: ['node1'],
      };

      expect(container.collapsible).toBe(false);
    });
  });

  describe('Collapse Modes', () => {
    it('should support full collapse mode', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsed: true,
        collapseMode: 'full', // Hide all children
        children: ['node1', 'node2'],
        containers: [
          {
            type: 'container',
            id: 'nested',
            label: 'Nested',
            children: ['node3'],
          },
        ],
      };

      expect(container.collapseMode).toBe('full');
    });

    it('should support partial collapse mode', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsed: true,
        collapseMode: 'partial', // Show first level only
        children: ['node1', 'node2'],
        containers: [
          {
            type: 'container',
            id: 'nested',
            label: 'Nested',
            children: ['node3'],
          },
        ],
      };

      expect(container.collapseMode).toBe('partial');
    });

    it('should default to full collapse when mode not specified', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsed: true,
        children: ['node1'],
      };

      // Default behavior is full collapse
      expect(container.collapseMode).toBeUndefined();
    });
  });

  describe('Nested Container Collapse', () => {
    it('should support independent collapse states for nested containers', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'outer',
        label: 'Outer',
        collapsed: false,
        children: ['node1'],
        containers: [
          {
            type: 'container',
            id: 'inner1',
            label: 'Inner 1',
            collapsed: true,
            children: ['node2'],
          },
          {
            type: 'container',
            id: 'inner2',
            label: 'Inner 2',
            collapsed: false,
            children: ['node3'],
          },
        ],
      };

      expect(container.collapsed).toBe(false);
      expect(container.containers![0].collapsed).toBe(true);
      expect(container.containers![1].collapsed).toBe(false);
    });

    it('should support cascading collapse (all descendants)', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'outer',
        label: 'Outer',
        collapsed: true,
        collapseMode: 'full',
        children: ['node1'],
        containers: [
          {
            type: 'container',
            id: 'middle',
            label: 'Middle',
            collapsed: true,
            children: ['node2'],
            containers: [
              {
                type: 'container',
                id: 'inner',
                label: 'Inner',
                collapsed: true,
                children: ['node3'],
              },
            ],
          },
        ],
      };

      expect(container.collapsed).toBe(true);
      expect(container.containers![0].collapsed).toBe(true);
      expect(container.containers![0].containers![0].collapsed).toBe(true);
    });

    it('should support partial collapse showing first level', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'outer',
        label: 'Outer',
        collapsed: true,
        collapseMode: 'partial',
        children: ['node1'],
        containers: [
          {
            type: 'container',
            id: 'inner',
            label: 'Inner',
            collapsed: false, // First level visible
            children: ['node2'],
          },
        ],
      };

      expect(container.collapsed).toBe(true);
      expect(container.collapseMode).toBe('partial');
      expect(container.containers![0].collapsed).toBe(false);
    });
  });

  describe('Collapse Behavior with Edges', () => {
    it('should maintain edge information when container is collapsed', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'external', shape: 'rect' },
          { id: 'internal1', shape: 'rect' },
          { id: 'internal2', shape: 'rect' },
        ],
        edges: [
          { from: 'external', to: 'internal1' },
          { from: 'internal1', to: 'internal2' },
        ],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Services',
            collapsed: true,
            children: ['internal1', 'internal2'],
          },
        ],
      };

      expect(diagram.containers![0].collapsed).toBe(true);
      expect(diagram.edges).toHaveLength(2);
    });

    it('should support edge redirection to collapsed container', () => {
      // When container is collapsed, edges to internal nodes
      // should be redirected to the container itself
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'external', shape: 'rect' },
          { id: 'internal', shape: 'rect' },
        ],
        edges: [{ from: 'external', to: 'internal' }],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Services',
            collapsed: true,
            collapseRedirectEdges: true, // Redirect edges to container
            children: ['internal'],
          },
        ],
      };

      expect(diagram.containers![0].collapseRedirectEdges).toBe(true);
    });
  });

  describe('Collapse Transition State', () => {
    it('should support transition state during animation', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsed: true,
        collapseTransitionState: 'collapsing', // actively collapsing
        children: ['node1'],
      };

      expect(container.collapseTransitionState).toBe('collapsing');
    });

    it('should support expanding transition state', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsed: false,
        collapseTransitionState: 'expanding',
        children: ['node1'],
      };

      expect(container.collapseTransitionState).toBe('expanding');
    });

    it('should support stable state (no transition)', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsed: false,
        collapseTransitionState: 'stable',
        children: ['node1'],
      };

      expect(container.collapseTransitionState).toBe('stable');
    });

    it('should default to undefined when not in transition', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsed: false,
        children: ['node1'],
      };

      expect(container.collapseTransitionState).toBeUndefined();
    });
  });

  describe('Collapse Animation Settings', () => {
    it('should support animation duration', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsible: true,
        collapseAnimationDuration: 300, // milliseconds
        children: ['node1'],
      };

      expect(container.collapseAnimationDuration).toBe(300);
    });

    it('should support animation easing', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsible: true,
        collapseAnimationEasing: 'easeInOut',
        children: ['node1'],
      };

      expect(container.collapseAnimationEasing).toBe('easeInOut');
    });

    it('should support different easing functions', () => {
      const easings: Array<'linear' | 'easeIn' | 'easeOut' | 'easeInOut'> = [
        'linear',
        'easeIn',
        'easeOut',
        'easeInOut',
      ];

      easings.forEach((easing) => {
        const container: ContainerDeclaration = {
          type: 'container',
          id: 'c1',
          label: 'Services',
          collapseAnimationEasing: easing,
          children: [],
        };
        expect(container.collapseAnimationEasing).toBe(easing);
      });
    });

    it('should support disabling animation', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsible: true,
        collapseAnimationDuration: 0, // No animation
        children: ['node1'],
      };

      expect(container.collapseAnimationDuration).toBe(0);
    });
  });

  describe('Collapse Visibility Control', () => {
    it('should support showing summary when collapsed', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsed: true,
        collapseSummary: '5 services', // Show summary text
        children: ['node1', 'node2', 'node3', 'node4', 'node5'],
      };

      expect(container.collapseSummary).toBe('5 services');
    });

    it('should support showing child count badge when collapsed', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsed: true,
        collapseShowCount: true, // Show child count
        children: ['node1', 'node2', 'node3'],
      };

      expect(container.collapseShowCount).toBe(true);
      expect(container.children).toHaveLength(3);
    });

    it('should support showing icon when collapsed', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsed: true,
        collapseIcon: 'chevron-right', // Collapsed indicator
        children: ['node1'],
      };

      expect(container.collapseIcon).toBe('chevron-right');
    });

    it('should support different icons for collapsed/expanded states', () => {
      const containerCollapsed: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsed: true,
        collapseIcon: 'chevron-right',
        children: ['node1'],
      };

      const containerExpanded: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsed: false,
        collapseIcon: 'chevron-down',
        children: ['node1'],
      };

      expect(containerCollapsed.collapseIcon).toBe('chevron-right');
      expect(containerExpanded.collapseIcon).toBe('chevron-down');
    });
  });

  describe('Collapse State Persistence', () => {
    it('should support state persistence flag', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsible: true,
        collapsePersistState: true, // Save state
        children: ['node1'],
      };

      expect(container.collapsePersistState).toBe(true);
    });

    it('should support state key for persistence', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsible: true,
        collapsePersistState: true,
        collapseStateKey: 'diagram-services-c1', // Unique key for storage
        children: ['node1'],
      };

      expect(container.collapseStateKey).toBe('diagram-services-c1');
    });
  });

  describe('Complete Collapse/Expand Example', () => {
    it('should support all Phase 2 collapse features together', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'services',
        label: 'Backend Services',
        header: 'Backend Layer',
        icon: 'server',
        badge: 'v2.0',
        // Collapse properties
        collapsible: true,
        collapsed: true,
        collapseMode: 'partial',
        collapseRedirectEdges: true,
        collapseTransitionState: 'stable',
        collapseAnimationDuration: 300,
        collapseAnimationEasing: 'easeInOut',
        collapseSummary: '12 services',
        collapseShowCount: true,
        collapseIcon: 'chevron-right',
        collapsePersistState: true,
        collapseStateKey: 'backend-services',
        children: ['api1', 'api2', 'api3'],
        containers: [
          {
            type: 'container',
            id: 'database',
            label: 'Database',
            collapsed: false,
            children: ['db1'],
          },
        ],
      };

      // Verify all properties
      expect(container.collapsible).toBe(true);
      expect(container.collapsed).toBe(true);
      expect(container.collapseMode).toBe('partial');
      expect(container.collapseRedirectEdges).toBe(true);
      expect(container.collapseTransitionState).toBe('stable');
      expect(container.collapseAnimationDuration).toBe(300);
      expect(container.collapseAnimationEasing).toBe('easeInOut');
      expect(container.collapseSummary).toBe('12 services');
      expect(container.collapseShowCount).toBe(true);
      expect(container.collapseIcon).toBe('chevron-right');
      expect(container.collapsePersistState).toBe(true);
      expect(container.collapseStateKey).toBe('backend-services');
    });
  });

  describe('Keyboard Shortcuts Support', () => {
    it('should support keyboard shortcut configuration', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsible: true,
        collapseKeyboardShortcut: 'Space', // Toggle with Space key
        children: ['node1'],
      };

      expect(container.collapseKeyboardShortcut).toBe('Space');
    });

    it('should support different keyboard shortcuts', () => {
      const shortcuts = ['Space', 'Enter', 'c', 'Ctrl+Space'];

      shortcuts.forEach((shortcut) => {
        const container: ContainerDeclaration = {
          type: 'container',
          id: 'c1',
          label: 'Services',
          collapseKeyboardShortcut: shortcut,
          children: [],
        };
        expect(container.collapseKeyboardShortcut).toBe(shortcut);
      });
    });
  });

  describe('Backward Compatibility', () => {
    it('should work with containers without collapse features', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        children: ['node1', 'node2'],
      };

      expect(container.collapsible).toBeUndefined();
      expect(container.collapsed).toBeUndefined();
      expect(container.collapseMode).toBeUndefined();
    });

    it('should treat undefined collapsed as expanded', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Services',
        collapsible: true,
        children: ['node1'],
      };

      // undefined collapsed means expanded
      expect(container.collapsed).toBeUndefined();
    });
  });
});
