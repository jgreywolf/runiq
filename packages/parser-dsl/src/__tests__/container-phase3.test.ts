import { describe, it, expect } from 'vitest';
import { parse } from '../langium-parser.js';

describe('Container Phase 3: Layout Optimization Parser Tests', () => {
  describe('Size Constraints', () => {
    it('should parse minWidth', () => {
      const dsl = `diagram "test"
        container "Services" minWidth: 400 {
          shape node1 as @rect label: "API"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.minWidth).toBe(400);
    });

    it('should parse maxWidth', () => {
      const dsl = `diagram "test"
        container "Services" maxWidth: 800 {
          shape node1 as @rect label: "API"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.maxWidth).toBe(800);
    });

    it('should parse minHeight and maxHeight', () => {
      const dsl = `diagram "test"
        container "Panel" minHeight: 300 maxHeight: 600 {
          shape node1 as @rect label: "Content"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.minHeight).toBe(300);
      expect(container?.containerStyle?.maxHeight).toBe(600);
    });

    it('should parse all size constraints together', () => {
      const dsl = `diagram "test"
        container "Bounded" minWidth: 300 maxWidth: 900 minHeight: 200 maxHeight: 600 {
          shape node1 as @rect label: "Item"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.minWidth).toBe(300);
      expect(container?.containerStyle?.maxWidth).toBe(900);
      expect(container?.containerStyle?.minHeight).toBe(200);
      expect(container?.containerStyle?.maxHeight).toBe(600);
    });
  });

  describe('Auto-Resize Behavior', () => {
    it('should parse autoResize true', () => {
      const dsl = `diagram "test"
        container "Auto" autoResize: true {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.autoResize).toBe(true);
    });

    it('should parse autoResize false', () => {
      const dsl = `diagram "test"
        container "Fixed" autoResize: false {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.autoResize).toBe(false);
    });

    it('should parse autoResize fit-content', () => {
      const dsl = `diagram "test"
        container "Fit" autoResize: fit-content {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.autoResize).toBe('fit-content');
    });

    it('should parse autoResize fill-available', () => {
      const dsl = `diagram "test"
        container "Fill" autoResize: fill-available {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.autoResize).toBe('fill-available');
    });
  });

  describe('Padding and Margin Controls', () => {
    it('should parse individual padding values', () => {
      const dsl = `diagram "test"
        container "Padded" paddingTop: 40 paddingRight: 30 paddingBottom: 40 paddingLeft: 30 {
          shape node1 as @rect label: "Content"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.paddingTop).toBe(40);
      expect(container?.containerStyle?.paddingRight).toBe(30);
      expect(container?.containerStyle?.paddingBottom).toBe(40);
      expect(container?.containerStyle?.paddingLeft).toBe(30);
    });

    it('should parse uniform margin', () => {
      const dsl = `diagram "test"
        container "Spaced" margin: 20 {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.margin).toBe(20);
    });

    it('should parse individual margin values', () => {
      const dsl = `diagram "test"
        container "Margins" marginTop: 10 marginRight: 15 marginBottom: 10 marginLeft: 15 {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.marginTop).toBe(10);
      expect(container?.containerStyle?.marginRight).toBe(15);
      expect(container?.containerStyle?.marginBottom).toBe(10);
      expect(container?.containerStyle?.marginLeft).toBe(15);
    });

    it('should parse both padding and uniform margin', () => {
      const dsl = `diagram "test"
        container "Box" padding: 30 margin: 20 {
          shape node1 as @rect label: "Content"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.padding).toBe(30);
      expect(container?.containerStyle?.margin).toBe(20);
    });
  });

  describe('Content Alignment', () => {
    it('should parse alignContent left', () => {
      const dsl = `diagram "test"
        container "LeftAlign" alignContent: left {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.alignContent).toBe('left');
    });

    it('should parse alignContent center', () => {
      const dsl = `diagram "test"
        container "CenterAlign" alignContent: center {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.alignContent).toBe('center');
    });

    it('should parse alignContent right', () => {
      const dsl = `diagram "test"
        container "RightAlign" alignContent: right {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.alignContent).toBe('right');
    });

    it('should parse verticalAlign top', () => {
      const dsl = `diagram "test"
        container "TopAlign" verticalAlign: top {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.verticalAlign).toBe('top');
    });

    it('should parse verticalAlign middle', () => {
      const dsl = `diagram "test"
        container "MiddleAlign" verticalAlign: middle {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.verticalAlign).toBe('middle');
    });

    it('should parse verticalAlign bottom', () => {
      const dsl = `diagram "test"
        container "BottomAlign" verticalAlign: bottom {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.verticalAlign).toBe('bottom');
    });

    it('should parse both horizontal and vertical alignment', () => {
      const dsl = `diagram "test"
        container "CenterBoth" alignContent: center verticalAlign: middle {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.alignContent).toBe('center');
      expect(container?.containerStyle?.verticalAlign).toBe('middle');
    });
  });

  describe('Child Node Distribution', () => {
    it('should parse distribution space-evenly', () => {
      const dsl = `diagram "test"
        container "Evenly" distribution: space-evenly {
          shape node1 as @rect label: "A"
          shape node2 as @rect label: "B"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.distribution).toBe('space-evenly');
    });

    it('should parse distribution space-between', () => {
      const dsl = `diagram "test"
        container "Between" distribution: space-between {
          shape node1 as @rect label: "A"
          shape node2 as @rect label: "B"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.distribution).toBe('space-between');
    });

    it('should parse distribution space-around', () => {
      const dsl = `diagram "test"
        container "Around" distribution: space-around {
          shape node1 as @rect label: "A"
          shape node2 as @rect label: "B"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.distribution).toBe('space-around');
    });

    it('should parse distribution packed', () => {
      const dsl = `diagram "test"
        container "Packed" distribution: packed {
          shape node1 as @rect label: "A"
          shape node2 as @rect label: "B"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.distribution).toBe('packed');
    });

    it('should parse custom nodeSpacing', () => {
      const dsl = `diagram "test"
        container "Custom" nodeSpacing: 60 {
          shape node1 as @rect label: "A"
          shape node2 as @rect label: "B"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.nodeSpacing).toBe(60);
    });

    it('should parse distribution and nodeSpacing together', () => {
      const dsl = `diagram "test"
        container "Combined" distribution: space-evenly nodeSpacing: 80 {
          shape node1 as @rect label: "A"
          shape node2 as @rect label: "B"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.distribution).toBe('space-evenly');
      expect(container?.containerStyle?.nodeSpacing).toBe(80);
    });
  });

  describe('Edge Routing Optimization', () => {
    it('should parse edgeRouting container-aware', () => {
      const dsl = `diagram "test"
        container "Smart" edgeRouting: container-aware {
          shape node1 as @rect label: "A"
          shape node2 as @rect label: "B"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.edgeRouting).toBe('container-aware');
    });

    it('should parse edgeRouting orthogonal', () => {
      const dsl = `diagram "test"
        container "Ortho" edgeRouting: orthogonal {
          shape node1 as @rect label: "A"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.edgeRouting).toBe('orthogonal');
    });

    it('should parse edgeRouting spline', () => {
      const dsl = `diagram "test"
        container "Smooth" edgeRouting: spline {
          shape node1 as @rect label: "A"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.edgeRouting).toBe('spline');
    });

    it('should parse edgeRouting polyline', () => {
      const dsl = `diagram "test"
        container "Poly" edgeRouting: polyline {
          shape node1 as @rect label: "A"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.edgeRouting).toBe('polyline');
    });

    it('should parse edgeBundling', () => {
      const dsl = `diagram "test"
        container "Bundled" edgeBundling: true {
          shape node1 as @rect label: "A"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.edgeBundling).toBe(true);
    });

    it('should parse crossContainerEdgeOptimization', () => {
      const dsl = `diagram "test"
        container "Optimized" crossContainerEdgeOptimization: true {
          shape node1 as @rect label: "A"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.crossContainerEdgeOptimization).toBe(true);
    });

    it('should parse all edge routing features together', () => {
      const dsl = `diagram "test"
        container "FullRouting" edgeRouting: orthogonal edgeBundling: true crossContainerEdgeOptimization: true {
          shape node1 as @rect label: "A"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.edgeRouting).toBe('orthogonal');
      expect(container?.containerStyle?.edgeBundling).toBe(true);
      expect(container?.containerStyle?.crossContainerEdgeOptimization).toBe(true);
    });
  });

  describe('Layout Performance Hints', () => {
    it('should parse layoutCache', () => {
      const dsl = `diagram "test"
        container "Cached" layoutCache: true {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.layoutCache).toBe(true);
    });

    it('should parse incrementalLayout', () => {
      const dsl = `diagram "test"
        container "Incremental" incrementalLayout: true {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.incrementalLayout).toBe(true);
    });

    it('should parse layoutComplexity low', () => {
      const dsl = `diagram "test"
        container "Simple" layoutComplexity: low {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.layoutComplexity).toBe('low');
    });

    it('should parse layoutComplexity medium', () => {
      const dsl = `diagram "test"
        container "Medium" layoutComplexity: medium {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.layoutComplexity).toBe('medium');
    });

    it('should parse layoutComplexity high', () => {
      const dsl = `diagram "test"
        container "Complex" layoutComplexity: high {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.layoutComplexity).toBe('high');
    });

    it('should parse all performance hints together', () => {
      const dsl = `diagram "test"
        container "Performance" layoutCache: true incrementalLayout: true layoutComplexity: medium {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.layoutCache).toBe(true);
      expect(container?.containerStyle?.incrementalLayout).toBe(true);
      expect(container?.containerStyle?.layoutComplexity).toBe('medium');
    });
  });

  describe('Complete Phase 3 Example', () => {
    it('should parse container with all Phase 3 layout features', () => {
      const dsl = `diagram "test"
        container "Advanced" minWidth: 400 maxWidth: 1200 minHeight: 300 maxHeight: 800 autoResize: fit-content paddingTop: 40 paddingRight: 30 paddingBottom: 40 paddingLeft: 30 margin: 20 alignContent: center verticalAlign: middle distribution: space-evenly nodeSpacing: 80 edgeRouting: orthogonal edgeBundling: true crossContainerEdgeOptimization: true layoutCache: true incrementalLayout: true layoutComplexity: medium {
          shape service1 as @rect label: "Service 1"
          shape service2 as @rect label: "Service 2"
          shape service3 as @rect label: "Service 3"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      const style = container?.containerStyle;

      // Size constraints
      expect(style?.minWidth).toBe(400);
      expect(style?.maxWidth).toBe(1200);
      expect(style?.minHeight).toBe(300);
      expect(style?.maxHeight).toBe(800);

      // Auto-resize
      expect(style?.autoResize).toBe('fit-content');

      // Padding
      expect(style?.paddingTop).toBe(40);
      expect(style?.paddingRight).toBe(30);
      expect(style?.paddingBottom).toBe(40);
      expect(style?.paddingLeft).toBe(30);

      // Margin
      expect(style?.margin).toBe(20);

      // Alignment
      expect(style?.alignContent).toBe('center');
      expect(style?.verticalAlign).toBe('middle');

      // Distribution
      expect(style?.distribution).toBe('space-evenly');
      expect(style?.nodeSpacing).toBe(80);

      // Edge routing
      expect(style?.edgeRouting).toBe('orthogonal');
      expect(style?.edgeBundling).toBe(true);
      expect(style?.crossContainerEdgeOptimization).toBe(true);

      // Performance
      expect(style?.layoutCache).toBe(true);
      expect(style?.incrementalLayout).toBe(true);
      expect(style?.layoutComplexity).toBe('medium');
    });
  });

});
