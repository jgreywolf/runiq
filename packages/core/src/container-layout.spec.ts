import { describe, it, expect } from 'vitest';
import type { ContainerDeclaration, ContainerStyle } from './types/index.js';

describe('Container Phase 3: Layout Optimization', () => {
  describe('Container Size Constraints', () => {
    it('should support minimum width constraint', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'bounded',
        label: 'Service Layer',
        children: ['api', 'cache'],
        containerStyle: {
          minWidth: 400,
        },
      };

      expect(container.containerStyle?.minWidth).toBe(400);
    });

    it('should support minimum height constraint', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'tall',
        label: 'Vertical Stack',
        children: ['node1', 'node2'],
        containerStyle: {
          minHeight: 600,
        },
      };

      expect(container.containerStyle?.minHeight).toBe(600);
    });

    it('should support maximum width constraint', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'limited',
        label: 'UI Components',
        children: ['button1', 'button2', 'button3'],
        containerStyle: {
          maxWidth: 800,
        },
      };

      expect(container.containerStyle?.maxWidth).toBe(800);
    });

    it('should support maximum height constraint', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'capped',
        label: 'Panel',
        children: ['item1', 'item2'],
        containerStyle: {
          maxHeight: 400,
        },
      };

      expect(container.containerStyle?.maxHeight).toBe(400);
    });

    it('should support both min and max constraints', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'constrained',
        label: 'Fixed Range',
        children: ['content'],
        containerStyle: {
          minWidth: 300,
          maxWidth: 900,
          minHeight: 200,
          maxHeight: 600,
        },
      };

      expect(container.containerStyle?.minWidth).toBe(300);
      expect(container.containerStyle?.maxWidth).toBe(900);
      expect(container.containerStyle?.minHeight).toBe(200);
      expect(container.containerStyle?.maxHeight).toBe(600);
    });
  });

  describe('Auto-Resize Behavior', () => {
    it('should support fixed size mode', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'fixed',
        label: 'Fixed Container',
        children: ['node1'],
        containerStyle: {
          autoResize: false,
        },
      };

      expect(container.containerStyle?.autoResize).toBe(false);
    });

    it('should support auto-resize mode (default)', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'auto',
        label: 'Auto Container',
        children: ['node1', 'node2'],
        containerStyle: {
          autoResize: true,
        },
      };

      expect(container.containerStyle?.autoResize).toBe(true);
    });

    it('should support fit-content resize mode', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'fit',
        label: 'Fit Content',
        children: ['node1'],
        containerStyle: {
          autoResize: 'fit-content',
        },
      };

      expect(container.containerStyle?.autoResize).toBe('fit-content');
    });

    it('should support fill-available resize mode', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'fill',
        label: 'Fill Available',
        children: ['node1'],
        containerStyle: {
          autoResize: 'fill-available',
        },
      };

      expect(container.containerStyle?.autoResize).toBe('fill-available');
    });
  });

  describe('Padding and Margin Controls', () => {
    it('should support uniform padding', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'padded',
        label: 'Padded Box',
        children: ['content'],
        containerStyle: {
          padding: 40,
        },
      };

      expect(container.containerStyle?.padding).toBe(40);
    });

    it('should support individual padding values', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'asymmetric',
        label: 'Asymmetric Padding',
        children: ['content'],
        containerStyle: {
          paddingTop: 20,
          paddingRight: 30,
          paddingBottom: 20,
          paddingLeft: 30,
        },
      };

      expect(container.containerStyle?.paddingTop).toBe(20);
      expect(container.containerStyle?.paddingRight).toBe(30);
      expect(container.containerStyle?.paddingBottom).toBe(20);
      expect(container.containerStyle?.paddingLeft).toBe(30);
    });

    it('should support container margin', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'spaced',
        label: 'Spaced Container',
        children: ['node1'],
        containerStyle: {
          margin: 20,
        },
      };

      expect(container.containerStyle?.margin).toBe(20);
    });

    it('should support individual margin values', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'margin-box',
        label: 'Custom Margins',
        children: ['node1'],
        containerStyle: {
          marginTop: 10,
          marginRight: 15,
          marginBottom: 10,
          marginLeft: 15,
        },
      };

      expect(container.containerStyle?.marginTop).toBe(10);
      expect(container.containerStyle?.marginRight).toBe(15);
      expect(container.containerStyle?.marginBottom).toBe(10);
      expect(container.containerStyle?.marginLeft).toBe(15);
    });
  });

  describe('Content Alignment', () => {
    it('should support horizontal alignment - left', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'left-aligned',
        label: 'Left Align',
        children: ['node1', 'node2'],
        containerStyle: {
          alignContent: 'left',
        },
      };

      expect(container.containerStyle?.alignContent).toBe('left');
    });

    it('should support horizontal alignment - center', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'centered',
        label: 'Center Align',
        children: ['node1', 'node2'],
        containerStyle: {
          alignContent: 'center',
        },
      };

      expect(container.containerStyle?.alignContent).toBe('center');
    });

    it('should support horizontal alignment - right', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'right-aligned',
        label: 'Right Align',
        children: ['node1', 'node2'],
        containerStyle: {
          alignContent: 'right',
        },
      };

      expect(container.containerStyle?.alignContent).toBe('right');
    });

    it('should support vertical alignment - top', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'top-aligned',
        label: 'Top Align',
        children: ['node1', 'node2'],
        containerStyle: {
          verticalAlign: 'top',
        },
      };

      expect(container.containerStyle?.verticalAlign).toBe('top');
    });

    it('should support vertical alignment - middle', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'middle-aligned',
        label: 'Middle Align',
        children: ['node1', 'node2'],
        containerStyle: {
          verticalAlign: 'middle',
        },
      };

      expect(container.containerStyle?.verticalAlign).toBe('middle');
    });

    it('should support vertical alignment - bottom', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'bottom-aligned',
        label: 'Bottom Align',
        children: ['node1', 'node2'],
        containerStyle: {
          verticalAlign: 'bottom',
        },
      };

      expect(container.containerStyle?.verticalAlign).toBe('bottom');
    });

    it('should support both horizontal and vertical alignment', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'fully-aligned',
        label: 'Center Both',
        children: ['node1'],
        containerStyle: {
          alignContent: 'center',
          verticalAlign: 'middle',
        },
      };

      expect(container.containerStyle?.alignContent).toBe('center');
      expect(container.containerStyle?.verticalAlign).toBe('middle');
    });
  });

  describe('Child Node Distribution', () => {
    it('should support equal spacing distribution', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'equal-space',
        label: 'Equal Spacing',
        children: ['node1', 'node2', 'node3'],
        containerStyle: {
          distribution: 'space-evenly',
        },
      };

      expect(container.containerStyle?.distribution).toBe('space-evenly');
    });

    it('should support space-between distribution', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'space-between',
        label: 'Space Between',
        children: ['node1', 'node2', 'node3'],
        containerStyle: {
          distribution: 'space-between',
        },
      };

      expect(container.containerStyle?.distribution).toBe('space-between');
    });

    it('should support space-around distribution', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'space-around',
        label: 'Space Around',
        children: ['node1', 'node2', 'node3'],
        containerStyle: {
          distribution: 'space-around',
        },
      };

      expect(container.containerStyle?.distribution).toBe('space-around');
    });

    it('should support packed distribution', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'packed',
        label: 'Packed Layout',
        children: ['node1', 'node2'],
        containerStyle: {
          distribution: 'packed',
        },
      };

      expect(container.containerStyle?.distribution).toBe('packed');
    });

    it('should support custom node spacing', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'custom-spacing',
        label: 'Custom Spacing',
        children: ['node1', 'node2'],
        containerStyle: {
          nodeSpacing: 60,
        },
      };

      expect(container.containerStyle?.nodeSpacing).toBe(60);
    });
  });

  describe('Edge Routing Optimization', () => {
    it('should support container-aware edge routing', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'routed',
        label: 'Smart Routing',
        children: ['node1', 'node2'],
        containerStyle: {
          edgeRouting: 'container-aware',
        },
      };

      expect(container.containerStyle?.edgeRouting).toBe('container-aware');
    });

    it('should support orthogonal routing preference', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'ortho',
        label: 'Orthogonal',
        children: ['node1', 'node2'],
        containerStyle: {
          edgeRouting: 'orthogonal',
        },
      };

      expect(container.containerStyle?.edgeRouting).toBe('orthogonal');
    });

    it('should support spline routing preference', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'spline',
        label: 'Smooth Edges',
        children: ['node1', 'node2'],
        containerStyle: {
          edgeRouting: 'spline',
        },
      };

      expect(container.containerStyle?.edgeRouting).toBe('spline');
    });

    it('should support polyline routing preference', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'poly',
        label: 'Polyline',
        children: ['node1', 'node2'],
        containerStyle: {
          edgeRouting: 'polyline',
        },
      };

      expect(container.containerStyle?.edgeRouting).toBe('polyline');
    });

    it('should support edge bundling within containers', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'bundled',
        label: 'Bundled Edges',
        children: ['node1', 'node2', 'node3'],
        containerStyle: {
          edgeBundling: true,
        },
      };

      expect(container.containerStyle?.edgeBundling).toBe(true);
    });

    it('should support cross-container edge optimization', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'optimized',
        label: 'Optimized',
        children: ['node1'],
        containerStyle: {
          crossContainerEdgeOptimization: true,
        },
      };

      expect(container.containerStyle?.crossContainerEdgeOptimization).toBe(
        true
      );
    });
  });

  describe('Layout Performance Hints', () => {
    it('should support layout caching hint', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'cached',
        label: 'Cached Layout',
        children: ['node1', 'node2'],
        containerStyle: {
          layoutCache: true,
        },
      };

      expect(container.containerStyle?.layoutCache).toBe(true);
    });

    it('should support incremental layout hint', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'incremental',
        label: 'Incremental',
        children: ['node1', 'node2'],
        containerStyle: {
          incrementalLayout: true,
        },
      };

      expect(container.containerStyle?.incrementalLayout).toBe(true);
    });

    it('should support layout complexity hint', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'complex',
        label: 'Complex Layout',
        children: ['node1', 'node2', 'node3', 'node4'],
        containerStyle: {
          layoutComplexity: 'high',
        },
      };

      expect(container.containerStyle?.layoutComplexity).toBe('high');
    });
  });

  describe('Complete Phase 3 Example', () => {
    it('should support all Phase 3 layout features together', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'advanced',
        label: 'Advanced Layout Container',
        children: ['service1', 'service2', 'service3'],
        containerStyle: {
          // Size constraints
          minWidth: 400,
          maxWidth: 1200,
          minHeight: 300,
          maxHeight: 800,

          // Auto-resize
          autoResize: 'fit-content',

          // Padding
          paddingTop: 40,
          paddingRight: 30,
          paddingBottom: 40,
          paddingLeft: 30,

          // Margin
          margin: 20,

          // Alignment
          alignContent: 'center',
          verticalAlign: 'middle',

          // Distribution
          distribution: 'space-evenly',
          nodeSpacing: 80,

          // Edge routing
          edgeRouting: 'orthogonal',
          edgeBundling: true,
          crossContainerEdgeOptimization: true,

          // Performance
          layoutCache: true,
          incrementalLayout: true,
          layoutComplexity: 'medium',
        },
      };

      const style = container.containerStyle!;

      // Verify size constraints
      expect(style.minWidth).toBe(400);
      expect(style.maxWidth).toBe(1200);
      expect(style.minHeight).toBe(300);
      expect(style.maxHeight).toBe(800);

      // Verify auto-resize
      expect(style.autoResize).toBe('fit-content');

      // Verify padding
      expect(style.paddingTop).toBe(40);
      expect(style.paddingRight).toBe(30);
      expect(style.paddingBottom).toBe(40);
      expect(style.paddingLeft).toBe(30);

      // Verify margin
      expect(style.margin).toBe(20);

      // Verify alignment
      expect(style.alignContent).toBe('center');
      expect(style.verticalAlign).toBe('middle');

      // Verify distribution
      expect(style.distribution).toBe('space-evenly');
      expect(style.nodeSpacing).toBe(80);

      // Verify edge routing
      expect(style.edgeRouting).toBe('orthogonal');
      expect(style.edgeBundling).toBe(true);
      expect(style.crossContainerEdgeOptimization).toBe(true);

      // Verify performance hints
      expect(style.layoutCache).toBe(true);
      expect(style.incrementalLayout).toBe(true);
      expect(style.layoutComplexity).toBe('medium');
    });
  });

  describe('Backward Compatibility', () => {
    it('should work with containers without Phase 3 properties', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'legacy',
        label: 'Legacy Container',
        children: ['node1'],
      };

      expect(container.containerStyle?.minWidth).toBeUndefined();
      expect(container.containerStyle?.autoResize).toBeUndefined();
      expect(container.containerStyle?.alignContent).toBeUndefined();
    });

    it('should work with Phase 1 and Phase 2 properties only', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'phase12',
        label: 'Phase 1+2 Container',
        children: ['node1'],
        header: 'Service Layer',
        icon: 'server',
        collapsed: false,
        collapsible: true,
        containerStyle: {
          shadow: true,
          depth: 2,
        },
      };

      // Phase 1 & 2 properties work
      expect(container.header).toBe('Service Layer');
      expect(container.icon).toBe('server');
      expect(container.collapsed).toBe(false);
      expect(container.containerStyle?.shadow).toBe(true);
      expect(container.containerStyle?.depth).toBe(2);

      // Phase 3 properties undefined
      expect(container.containerStyle?.minWidth).toBeUndefined();
      expect(container.containerStyle?.alignContent).toBeUndefined();
    });
  });
});
