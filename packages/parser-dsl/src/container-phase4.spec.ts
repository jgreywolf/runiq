import { describe, it, expect } from 'vitest';
import { parse } from './langium-parser.js';

describe('Container Phase 4: Visual Controls Parser Tests', () => {
  describe('Collapse Button Controls', () => {
    it('should parse collapseButtonVisible true', () => {
      const dsl = `diagram "test" {
        container "Services" collapseButtonVisible: true {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.collapseButtonVisible).toBe(true);
    });

    it('should parse collapseButtonVisible false', () => {
      const dsl = `diagram "test" {
        container "Services" collapseButtonVisible: false {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.collapseButtonVisible).toBe(false);
    });

    it('should parse collapseButtonPosition top-left', () => {
      const dsl = `diagram "test" {
        container "Services" collapseButtonPosition: top-left {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.collapseButtonPosition).toBe('top-left');
    });

    it('should parse collapseButtonPosition top-right', () => {
      const dsl = `diagram "test" {
        container "Services" collapseButtonPosition: top-right {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.collapseButtonPosition).toBe('top-right');
    });

    it('should parse all collapseButtonPosition values', () => {
      const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
      
      for (const position of positions) {
        const dsl = `diagram "test" {
          container "Services" collapseButtonPosition: ${position} {
            shape node1 as @rect label: "API"
          }}`;
        const result = parse(dsl);
        expect(result.success).toBe(true);
        const container = result.diagram?.containers?.[0];
        expect(container?.containerStyle?.collapseButtonPosition).toBe(position);
      }
    });

    it('should parse collapseButtonStyle icon', () => {
      const dsl = `diagram "test" {
        container "Services" collapseButtonStyle: icon {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.collapseButtonStyle).toBe('icon');
    });

    it('should parse collapseButtonStyle text', () => {
      const dsl = `diagram "test" {
        container "Services" collapseButtonStyle: text {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.collapseButtonStyle).toBe('text');
    });

    it('should parse collapseButtonStyle icon-text', () => {
      const dsl = `diagram "test" {
        container "Services" collapseButtonStyle: icon-text {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.collapseButtonStyle).toBe('icon-text');
    });

    it('should parse collapseButtonSize', () => {
      const dsl = `diagram "test" {
        container "Services" collapseButtonSize: 28 {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.collapseButtonSize).toBe(28);
    });

    it('should parse collapseButtonColor', () => {
      const dsl = `diagram "test" {
        container "Services" collapseButtonColor: "#1976d2" {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.collapseButtonColor).toBe('#1976d2');
    });

    it('should parse all collapse button properties together', () => {
      const dsl = `diagram "test" {
        container "Services" collapseButtonVisible: true collapseButtonPosition: top-right collapseButtonStyle: icon-text collapseButtonSize: 28 collapseButtonColor: "#1976d2" {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      const style = container?.containerStyle;
      expect(style?.collapseButtonVisible).toBe(true);
      expect(style?.collapseButtonPosition).toBe('top-right');
      expect(style?.collapseButtonStyle).toBe('icon-text');
      expect(style?.collapseButtonSize).toBe(28);
      expect(style?.collapseButtonColor).toBe('#1976d2');
    });
  });

  describe('Resize Controls', () => {
    it('should parse resizable true', () => {
      const dsl = `diagram "test" {
        container "Services" resizable: true {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.resizable).toBe(true);
    });

    it('should parse resizable false', () => {
      const dsl = `diagram "test" {
        container "Services" resizable: false {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.resizable).toBe(false);
    });

    it('should parse resizeHandles with cardinal directions', () => {
      const dsl = `diagram "test" {
        container "Services" resizeHandles: [n, s, e, w] {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.resizeHandles).toEqual(['n', 's', 'e', 'w']);
    });

    it('should parse resizeHandles with diagonal directions', () => {
      const dsl = `diagram "test" {
        container "Services" resizeHandles: [ne, nw, se, sw] {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.resizeHandles).toEqual(['ne', 'nw', 'se', 'sw']);
    });

    it('should parse resizeHandles with all directions', () => {
      const dsl = `diagram "test" {
        container "Services" resizeHandles: [n, s, e, w, ne, nw, se, sw] {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.resizeHandles).toHaveLength(8);
    });

    it('should parse minResizeWidth', () => {
      const dsl = `diagram "test" {
        container "Services" minResizeWidth: 250 {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.minResizeWidth).toBe(250);
    });

    it('should parse minResizeHeight', () => {
      const dsl = `diagram "test" {
        container "Services" minResizeHeight: 180 {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.minResizeHeight).toBe(180);
    });

    it('should parse all resize properties together', () => {
      const dsl = `diagram "test" {
        container "Services" resizable: true resizeHandles: [se, sw, ne, nw] minResizeWidth: 300 minResizeHeight: 200 {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      const style = container?.containerStyle;
      expect(style?.resizable).toBe(true);
      expect(style?.resizeHandles).toEqual(['se', 'sw', 'ne', 'nw']);
      expect(style?.minResizeWidth).toBe(300);
      expect(style?.minResizeHeight).toBe(200);
    });
  });

  describe('Interactive Feedback - Hover', () => {
    it('should parse hoverHighlight true', () => {
      const dsl = `diagram "test" {
        container "Services" hoverHighlight: true {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.hoverHighlight).toBe(true);
    });

    it('should parse hoverBorderColor', () => {
      const dsl = `diagram "test" {
        container "Services" hoverBorderColor: "#4CAF50" {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.hoverBorderColor).toBe('#4CAF50');
    });

    it('should parse hoverBorderWidth', () => {
      const dsl = `diagram "test" {
        container "Services" hoverBorderWidth: 2 {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.hoverBorderWidth).toBe(2);
    });

    it('should parse all hover properties together', () => {
      const dsl = `diagram "test" {
        container "Services" hoverHighlight: true hoverBorderColor: "#FF5722" hoverBorderWidth: 3 {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      const style = container?.containerStyle;
      expect(style?.hoverHighlight).toBe(true);
      expect(style?.hoverBorderColor).toBe('#FF5722');
      expect(style?.hoverBorderWidth).toBe(3);
    });
  });

  describe('Interactive Feedback - Selection', () => {
    it('should parse selectionHighlight true', () => {
      const dsl = `diagram "test" {
        container "Services" selectionHighlight: true {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.selectionHighlight).toBe(true);
    });

    it('should parse selectionBorderColor', () => {
      const dsl = `diagram "test" {
        container "Services" selectionBorderColor: "#2196F3" {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.selectionBorderColor).toBe('#2196F3');
    });

    it('should parse selectionBorderWidth', () => {
      const dsl = `diagram "test" {
        container "Services" selectionBorderWidth: 4 {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.selectionBorderWidth).toBe(4);
    });

    it('should parse all selection properties together', () => {
      const dsl = `diagram "test" {
        container "Services" selectionHighlight: true selectionBorderColor: "#9C27B0" selectionBorderWidth: 3 {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      const style = container?.containerStyle;
      expect(style?.selectionHighlight).toBe(true);
      expect(style?.selectionBorderColor).toBe('#9C27B0');
      expect(style?.selectionBorderWidth).toBe(3);
    });
  });

  describe('Visual Feedback Indicators', () => {
    it('should parse showChildCount true', () => {
      const dsl = `diagram "test" {
        container "Services" showChildCount: true {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.showChildCount).toBe(true);
    });

    it('should parse showChildCount false', () => {
      const dsl = `diagram "test" {
        container "Services" showChildCount: false {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.showChildCount).toBe(false);
    });

    it('should parse childCountPosition', () => {
      const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
      
      for (const position of positions) {
        const dsl = `diagram "test" {
          container "Services" childCountPosition: ${position} {
            shape node1 as @rect label: "API"
          }}`;
        const result = parse(dsl);
        expect(result.success).toBe(true);
        const container = result.diagram?.containers?.[0];
        expect(container?.containerStyle?.childCountPosition).toBe(position);
      }
    });

    it('should parse showDepthIndicator true', () => {
      const dsl = `diagram "test" {
        container "Services" showDepthIndicator: true {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.showDepthIndicator).toBe(true);
    });

    it('should parse depthIndicatorStyle bar', () => {
      const dsl = `diagram "test" {
        container "Services" depthIndicatorStyle: bar {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.depthIndicatorStyle).toBe('bar');
    });

    it('should parse depthIndicatorStyle indent', () => {
      const dsl = `diagram "test" {
        container "Services" depthIndicatorStyle: indent {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.depthIndicatorStyle).toBe('indent');
    });

    it('should parse depthIndicatorStyle color', () => {
      const dsl = `diagram "test" {
        container "Services" depthIndicatorStyle: color {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.depthIndicatorStyle).toBe('color');
    });

    it('should parse all visual indicator properties together', () => {
      const dsl = `diagram "test" {
        container "Services" showChildCount: true childCountPosition: top-right showDepthIndicator: true depthIndicatorStyle: bar {
          shape node1 as @rect label: "API"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      const style = container?.containerStyle;
      expect(style?.showChildCount).toBe(true);
      expect(style?.childCountPosition).toBe('top-right');
      expect(style?.showDepthIndicator).toBe(true);
      expect(style?.depthIndicatorStyle).toBe('bar');
    });
  });

  describe('Complete Phase 4 Example', () => {
    it('should parse container with all Phase 4 visual control features', () => {
      const dsl = `diagram "test" {
        container "Interactive" collapseButtonVisible: true collapseButtonPosition: top-right collapseButtonStyle: icon-text collapseButtonSize: 28 collapseButtonColor: "#1976d2" resizable: true resizeHandles: [se, sw, ne, nw] minResizeWidth: 300 minResizeHeight: 200 hoverHighlight: true hoverBorderColor: "#4CAF50" hoverBorderWidth: 2 selectionHighlight: true selectionBorderColor: "#2196F3" selectionBorderWidth: 3 showChildCount: true childCountPosition: top-left showDepthIndicator: true depthIndicatorStyle: bar {
          shape node1 as @rect label: "Node 1"
          shape node2 as @rect label: "Node 2"
          shape node3 as @rect label: "Node 3"
        }}`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      const style = container?.containerStyle;

      // Collapse button
      expect(style?.collapseButtonVisible).toBe(true);
      expect(style?.collapseButtonPosition).toBe('top-right');
      expect(style?.collapseButtonStyle).toBe('icon-text');
      expect(style?.collapseButtonSize).toBe(28);
      expect(style?.collapseButtonColor).toBe('#1976d2');

      // Resize
      expect(style?.resizable).toBe(true);
      expect(style?.resizeHandles).toEqual(['se', 'sw', 'ne', 'nw']);
      expect(style?.minResizeWidth).toBe(300);
      expect(style?.minResizeHeight).toBe(200);

      // Hover
      expect(style?.hoverHighlight).toBe(true);
      expect(style?.hoverBorderColor).toBe('#4CAF50');
      expect(style?.hoverBorderWidth).toBe(2);

      // Selection
      expect(style?.selectionHighlight).toBe(true);
      expect(style?.selectionBorderColor).toBe('#2196F3');
      expect(style?.selectionBorderWidth).toBe(3);

      // Indicators
      expect(style?.showChildCount).toBe(true);
      expect(style?.childCountPosition).toBe('top-left');
      expect(style?.showDepthIndicator).toBe(true);
      expect(style?.depthIndicatorStyle).toBe('bar');
    });
  });
});
