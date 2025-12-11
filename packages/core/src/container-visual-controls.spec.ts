import { describe, it, expect } from 'vitest';
import type {
  ContainerDeclaration,
  ContainerStyle,
} from './types/index.js';

describe('Container Phase 4: Visual Controls', () => {
  describe('Collapse Button Controls', () => {
    it('should support collapse button visibility', () => {
      const style: ContainerStyle = {
        collapseButtonVisible: true,
      };

      expect(style.collapseButtonVisible).toBe(true);
    });

    it('should support hiding collapse button', () => {
      const style: ContainerStyle = {
        collapseButtonVisible: false,
      };

      expect(style.collapseButtonVisible).toBe(false);
    });

    it('should support collapse button position top-left', () => {
      const style: ContainerStyle = {
        collapseButtonPosition: 'top-left',
      };

      expect(style.collapseButtonPosition).toBe('top-left');
    });

    it('should support collapse button position top-right', () => {
      const style: ContainerStyle = {
        collapseButtonPosition: 'top-right',
      };

      expect(style.collapseButtonPosition).toBe('top-right');
    });

    it('should support all collapse button positions', () => {
      const positions: Array<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'> = [
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ];

      for (const position of positions) {
        const style: ContainerStyle = {
          collapseButtonPosition: position,
        };
        expect(style.collapseButtonPosition).toBe(position);
      }
    });

    it('should support collapse button style icon', () => {
      const style: ContainerStyle = {
        collapseButtonStyle: 'icon',
      };

      expect(style.collapseButtonStyle).toBe('icon');
    });

    it('should support collapse button style text', () => {
      const style: ContainerStyle = {
        collapseButtonStyle: 'text',
      };

      expect(style.collapseButtonStyle).toBe('text');
    });

    it('should support collapse button style icon-text', () => {
      const style: ContainerStyle = {
        collapseButtonStyle: 'icon-text',
      };

      expect(style.collapseButtonStyle).toBe('icon-text');
    });

    it('should support collapse button size', () => {
      const style: ContainerStyle = {
        collapseButtonSize: 24,
      };

      expect(style.collapseButtonSize).toBe(24);
    });

    it('should support collapse button color', () => {
      const style: ContainerStyle = {
        collapseButtonColor: '#0066cc',
      };

      expect(style.collapseButtonColor).toBe('#0066cc');
    });

    it('should support all collapse button properties together', () => {
      const style: ContainerStyle = {
        collapseButtonVisible: true,
        collapseButtonPosition: 'top-right',
        collapseButtonStyle: 'icon-text',
        collapseButtonSize: 28,
        collapseButtonColor: '#1976d2',
      };

      expect(style.collapseButtonVisible).toBe(true);
      expect(style.collapseButtonPosition).toBe('top-right');
      expect(style.collapseButtonStyle).toBe('icon-text');
      expect(style.collapseButtonSize).toBe(28);
      expect(style.collapseButtonColor).toBe('#1976d2');
    });
  });

  describe('Resize Controls', () => {
    it('should support resizable property', () => {
      const style: ContainerStyle = {
        resizable: true,
      };

      expect(style.resizable).toBe(true);
    });

    it('should support disabling resize', () => {
      const style: ContainerStyle = {
        resizable: false,
      };

      expect(style.resizable).toBe(false);
    });

    it('should support resize handles cardinal directions', () => {
      const style: ContainerStyle = {
        resizeHandles: ['n', 's', 'e', 'w'],
      };

      expect(style.resizeHandles).toEqual(['n', 's', 'e', 'w']);
    });

    it('should support resize handles diagonal directions', () => {
      const style: ContainerStyle = {
        resizeHandles: ['ne', 'nw', 'se', 'sw'],
      };

      expect(style.resizeHandles).toEqual(['ne', 'nw', 'se', 'sw']);
    });

    it('should support all resize handles', () => {
      const style: ContainerStyle = {
        resizeHandles: ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'],
      };

      expect(style.resizeHandles).toHaveLength(8);
      expect(style.resizeHandles).toContain('n');
      expect(style.resizeHandles).toContain('sw');
    });

    it('should support minimum resize width', () => {
      const style: ContainerStyle = {
        minResizeWidth: 200,
      };

      expect(style.minResizeWidth).toBe(200);
    });

    it('should support minimum resize height', () => {
      const style: ContainerStyle = {
        minResizeHeight: 150,
      };

      expect(style.minResizeHeight).toBe(150);
    });

    it('should support all resize properties together', () => {
      const style: ContainerStyle = {
        resizable: true,
        resizeHandles: ['se', 'sw', 'ne', 'nw'],
        minResizeWidth: 250,
        minResizeHeight: 180,
      };

      expect(style.resizable).toBe(true);
      expect(style.resizeHandles).toHaveLength(4);
      expect(style.minResizeWidth).toBe(250);
      expect(style.minResizeHeight).toBe(180);
    });
  });

  describe('Interactive Feedback - Hover', () => {
    it('should support hover highlight', () => {
      const style: ContainerStyle = {
        hoverHighlight: true,
      };

      expect(style.hoverHighlight).toBe(true);
    });

    it('should support disabling hover highlight', () => {
      const style: ContainerStyle = {
        hoverHighlight: false,
      };

      expect(style.hoverHighlight).toBe(false);
    });

    it('should support hover border color', () => {
      const style: ContainerStyle = {
        hoverBorderColor: '#4CAF50',
      };

      expect(style.hoverBorderColor).toBe('#4CAF50');
    });

    it('should support hover border width', () => {
      const style: ContainerStyle = {
        hoverBorderWidth: 3,
      };

      expect(style.hoverBorderWidth).toBe(3);
    });

    it('should support all hover properties together', () => {
      const style: ContainerStyle = {
        hoverHighlight: true,
        hoverBorderColor: '#FF5722',
        hoverBorderWidth: 2,
      };

      expect(style.hoverHighlight).toBe(true);
      expect(style.hoverBorderColor).toBe('#FF5722');
      expect(style.hoverBorderWidth).toBe(2);
    });
  });

  describe('Interactive Feedback - Selection', () => {
    it('should support selection highlight', () => {
      const style: ContainerStyle = {
        selectionHighlight: true,
      };

      expect(style.selectionHighlight).toBe(true);
    });

    it('should support disabling selection highlight', () => {
      const style: ContainerStyle = {
        selectionHighlight: false,
      };

      expect(style.selectionHighlight).toBe(false);
    });

    it('should support selection border color', () => {
      const style: ContainerStyle = {
        selectionBorderColor: '#2196F3',
      };

      expect(style.selectionBorderColor).toBe('#2196F3');
    });

    it('should support selection border width', () => {
      const style: ContainerStyle = {
        selectionBorderWidth: 4,
      };

      expect(style.selectionBorderWidth).toBe(4);
    });

    it('should support all selection properties together', () => {
      const style: ContainerStyle = {
        selectionHighlight: true,
        selectionBorderColor: '#9C27B0',
        selectionBorderWidth: 3,
      };

      expect(style.selectionHighlight).toBe(true);
      expect(style.selectionBorderColor).toBe('#9C27B0');
      expect(style.selectionBorderWidth).toBe(3);
    });
  });

  describe('Visual Feedback Indicators', () => {
    it('should support showing child count badge', () => {
      const style: ContainerStyle = {
        showChildCount: true,
      };

      expect(style.showChildCount).toBe(true);
    });

    it('should support hiding child count badge', () => {
      const style: ContainerStyle = {
        showChildCount: false,
      };

      expect(style.showChildCount).toBe(false);
    });

    it('should support child count badge position', () => {
      const positions: Array<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'> = [
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ];

      for (const position of positions) {
        const style: ContainerStyle = {
          childCountPosition: position,
        };
        expect(style.childCountPosition).toBe(position);
      }
    });

    it('should support showing depth indicator', () => {
      const style: ContainerStyle = {
        showDepthIndicator: true,
      };

      expect(style.showDepthIndicator).toBe(true);
    });

    it('should support depth indicator style bar', () => {
      const style: ContainerStyle = {
        depthIndicatorStyle: 'bar',
      };

      expect(style.depthIndicatorStyle).toBe('bar');
    });

    it('should support depth indicator style indent', () => {
      const style: ContainerStyle = {
        depthIndicatorStyle: 'indent',
      };

      expect(style.depthIndicatorStyle).toBe('indent');
    });

    it('should support depth indicator style color', () => {
      const style: ContainerStyle = {
        depthIndicatorStyle: 'color',
      };

      expect(style.depthIndicatorStyle).toBe('color');
    });

    it('should support all visual indicator properties together', () => {
      const style: ContainerStyle = {
        showChildCount: true,
        childCountPosition: 'top-right',
        showDepthIndicator: true,
        depthIndicatorStyle: 'bar',
      };

      expect(style.showChildCount).toBe(true);
      expect(style.childCountPosition).toBe('top-right');
      expect(style.showDepthIndicator).toBe(true);
      expect(style.depthIndicatorStyle).toBe('bar');
    });
  });

  describe('Complete Phase 4 Example', () => {
    it('should support all Phase 4 visual control features together', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'interactive',
        label: 'Interactive Container',
        children: ['node1', 'node2', 'node3'],
        collapsible: true,
        containerStyle: {
          // Collapse button
          collapseButtonVisible: true,
          collapseButtonPosition: 'top-right',
          collapseButtonStyle: 'icon-text',
          collapseButtonSize: 28,
          collapseButtonColor: '#1976d2',

          // Resize controls
          resizable: true,
          resizeHandles: ['se', 'sw', 'ne', 'nw'],
          minResizeWidth: 300,
          minResizeHeight: 200,

          // Hover feedback
          hoverHighlight: true,
          hoverBorderColor: '#4CAF50',
          hoverBorderWidth: 2,

          // Selection feedback
          selectionHighlight: true,
          selectionBorderColor: '#2196F3',
          selectionBorderWidth: 3,

          // Visual indicators
          showChildCount: true,
          childCountPosition: 'top-left',
          showDepthIndicator: true,
          depthIndicatorStyle: 'bar',
        },
      };

      expect(container.collapsible).toBe(true);
      
      const style = container.containerStyle!;
      
      // Collapse button
      expect(style.collapseButtonVisible).toBe(true);
      expect(style.collapseButtonPosition).toBe('top-right');
      expect(style.collapseButtonStyle).toBe('icon-text');
      expect(style.collapseButtonSize).toBe(28);
      expect(style.collapseButtonColor).toBe('#1976d2');

      // Resize
      expect(style.resizable).toBe(true);
      expect(style.resizeHandles).toEqual(['se', 'sw', 'ne', 'nw']);
      expect(style.minResizeWidth).toBe(300);
      expect(style.minResizeHeight).toBe(200);

      // Hover
      expect(style.hoverHighlight).toBe(true);
      expect(style.hoverBorderColor).toBe('#4CAF50');
      expect(style.hoverBorderWidth).toBe(2);

      // Selection
      expect(style.selectionHighlight).toBe(true);
      expect(style.selectionBorderColor).toBe('#2196F3');
      expect(style.selectionBorderWidth).toBe(3);

      // Indicators
      expect(style.showChildCount).toBe(true);
      expect(style.childCountPosition).toBe('top-left');
      expect(style.showDepthIndicator).toBe(true);
      expect(style.depthIndicatorStyle).toBe('bar');
    });
  });
});
