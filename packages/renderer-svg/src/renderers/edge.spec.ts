import type { DiagramAst, EdgeDeclaration, RoutedEdge } from '@runiq/core';
import { ArrowType, LineStyle } from '@runiq/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { renderEdge } from './edge.js';

describe('renderEdge', () => {
  let warnings: string[] = [];

  beforeEach(() => {
    warnings = [];
  });

  const createMinimalDiagram = (edges: EdgeDeclaration[] = []): DiagramAst => ({
    type: 'diagram',
    nodes: [],
    edges,
  });

  describe('Basic Edge Rendering', () => {
    it('should render a simple straight edge', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('<g');
      expect(result).toContain('data-runiq-edge');
      expect(result).toContain('data-edge-from="node1"');
      expect(result).toContain('data-edge-to="node2"');
      expect(result).toContain('<path');
      expect(result).toContain('M 100 200');
      expect(result).toContain('L 300 200');
      expect(result).toContain('</g>');
      expect(warnings).toHaveLength(0);
    });

    it('should render edge with multiple segments', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 200, y: 200 },
          { x: 200, y: 300 },
          { x: 300, y: 300 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('M 100 200');
      expect(result).toContain('L 200 200');
      expect(result).toContain('L 200 300');
      expect(result).toContain('L 300 300');
    });

    it('should render curved edge with Bezier control point', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 200, y: 150 }, // Control point
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('M 100 200');
      expect(result).toContain('Q 200 150 300 200');
    });

    it('should omit data attributes in strict mode', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, true, warnings);

      expect(result).not.toContain('data-runiq-edge');
      expect(result).not.toContain('data-edge-from');
      expect(result).not.toContain('data-edge-to');
      expect(result).toContain('<g>'); // No attributes
    });

    it('should add warning for missing edge in AST', () => {
      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram();
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toBe('');
      expect(warnings).toContain(
        'Edge node1 -> node2 not found in diagram AST'
      );
    });

    it('should add warning for insufficient points', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [{ x: 100, y: 200 }],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toBe('');
      expect(warnings).toContain('Edge node1 -> node2 has insufficient points');
    });
  });

  describe('Edge Styling', () => {
    it('should apply default stroke color', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('stroke="#333"'); // Default stroke
    });

    it('should apply custom stroke color from style', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
        style: 'customStyle',
      };

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram: DiagramAst = {
        type: 'diagram',
        nodes: [],
        edges: [edgeAst],
        styles: {
          customStyle: {
            stroke: '#ff0000',
          },
        },
      };

      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('stroke="#ff0000"');
    });

    it('should apply stroke width', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
        data: {
          strokeWidth: 5,
        },
      };

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('stroke-width="5"');
    });

    it('should apply theme edge color', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const theme = {
        nodeColors: ['#ff0000'],
        edgeColor: '#00ff00',
        textColor: '#000000',
        backgroundColor: '#ffffff',
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings, theme);

      expect(result).toContain('stroke="#00ff00"');
    });
  });

  describe('Line Styles', () => {
    it('should render solid line by default', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).not.toContain('stroke-dasharray');
    });

    it('should render dashed line', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).lineStyle = LineStyle.DASHED;

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('stroke-dasharray="5,3"');
    });

    it('should render dotted line', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).lineStyle = LineStyle.DOTTED;

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('stroke-dasharray="2,2"');
    });

    it('should render double line for consanguineous relationships', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).lineStyle = LineStyle.DOUBLE;

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      // Should render two parallel paths
      const pathCount = (result.match(/<path/g) || []).length;
      expect(pathCount).toBeGreaterThan(2); // Hit area + 2 parallel lines
    });
  });

  describe('Arrow Types', () => {
    it('should render edge without arrow (NONE)', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).arrowType = ArrowType.NONE;

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).not.toContain('marker-end');
      expect(result).not.toContain('marker-start');
    });

    it('should render standard filled arrow', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).arrowType = ArrowType.STANDARD;

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('marker-end');
      expect(result).toContain('<marker');
      expect(result).toContain('<polygon');
    });

    it('should render hollow arrow for inheritance', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).arrowType = ArrowType.HOLLOW;

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('marker-end');
      expect(result).toContain('fill="white"');
    });

    it('should render open arrow for dependency', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).arrowType = ArrowType.OPEN;

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('marker-end');
      expect(result).toContain('<polyline');
    });

    it('should render bidirectional arrows', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).arrowType = ArrowType.STANDARD;
      (edgeAst as any).bidirectional = true;

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('marker-start');
      expect(result).toContain('marker-end');
    });
  });

  describe('UML Relationships', () => {
    it('should render aggregation (hollow diamond)', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).edgeType = 'aggregation';

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('marker-start');
      expect(result).toContain('fill="white"'); // Hollow diamond
    });

    it('should render composition (filled diamond)', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).edgeType = 'composition';

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('marker-start');
      expect(result).toContain('<polygon');
    });

    it('should render navigability arrow at source', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).navigability = 'source';

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('marker-start');
    });

    it('should render navigability arrow at target', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).navigability = 'target';

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('marker-end');
    });

    it('should render bidirectional navigability', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).navigability = 'bidirectional';

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('marker-start');
      expect(result).toContain('marker-end');
    });
  });

  describe('Edge Labels', () => {
    it('should render edge label', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).label = 'Edge Label';

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('Edge Label');
      expect(result).toContain('runiq-edge-text');
    });

    it('should escape XSS in edge label', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).label = '<script>alert("XSS")</script>';

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });

    it('should render multi-line edge label', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).label = 'Line 1\nLine 2\nLine 3';

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('Line 1');
      expect(result).toContain('Line 2');
      expect(result).toContain('Line 3');
      expect(result).toContain('<tspan');
    });

    it('should position label at midpoint of straight edge', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).label = 'Middle';

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      // Midpoint should be at (200, 200)
      expect(result).toContain('x="200"');
      expect(result).toContain('y="200"');
    });
  });

  describe('UML Stereotypes', () => {
    it('should render stereotype above edge', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).stereotype = 'create';

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('&lt;&lt;create&gt;&gt;');
      expect(result).toContain('runiq-edge-stereotype');
    });

    it('should render both stereotype and label', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).stereotype = 'create';
      (edgeAst as any).label = 'Edge Label';

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('&lt;&lt;create&gt;&gt;');
      expect(result).toContain('Edge Label');
    });
  });

  describe('State Machine Transitions', () => {
    it('should render event label', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'state1',
        to: 'state2',
      };
      (edgeAst as any).event = 'onClick';

      const routed: RoutedEdge = {
        from: 'state1',
        to: 'state2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('onClick');
    });

    it('should render guard condition', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'state1',
        to: 'state2',
      };
      (edgeAst as any).event = 'onClick';
      (edgeAst as any).guard = '[enabled]';

      const routed: RoutedEdge = {
        from: 'state1',
        to: 'state2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('onClick');
      expect(result).toContain('[enabled]');
    });

    it('should render effect action', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'state1',
        to: 'state2',
      };
      (edgeAst as any).event = 'onClick';
      (edgeAst as any).effect = 'doAction()';

      const routed: RoutedEdge = {
        from: 'state1',
        to: 'state2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('onClick');
      expect(result).toContain('/ doAction()');
    });

    it('should render complete transition label', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'state1',
        to: 'state2',
      };
      (edgeAst as any).event = 'onClick';
      (edgeAst as any).guard = '[enabled]';
      (edgeAst as any).effect = '/ doAction()';

      const routed: RoutedEdge = {
        from: 'state1',
        to: 'state2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('onClick');
      expect(result).toContain('[enabled]');
      expect(result).toContain('/ doAction()');
    });
  });

  describe('UML Constraints', () => {
    it('should render single constraint', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).constraints = ['ordered'];

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('{ordered}');
      expect(result).toContain('runiq-edge-constraint');
    });

    it('should render multiple constraints', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).constraints = ['ordered', 'unique'];

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('{ordered, unique}');
    });
  });

  describe('UML Multiplicity and Roles', () => {
    it('should render source multiplicity', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).multiplicitySource = '1';

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('>1<');
      expect(result).toContain('runiq-edge-multiplicity');
    });

    it('should render target multiplicity', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).multiplicityTarget = '0..*';

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('>0..*<');
    });

    it('should render source role', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).roleSource = 'owner';

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('>owner<');
      expect(result).toContain('runiq-edge-role');
    });

    it('should render target role', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).roleTarget = 'employee';

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('>employee<');
    });

    it('should render both multiplicity and role', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).multiplicitySource = '1';
      (edgeAst as any).roleSource = 'owner';

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('>1<');
      expect(result).toContain('>owner<');
    });
  });

  describe('Tooltips and Links', () => {
    it('should render tooltip', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).tooltip = 'Edge tooltip';

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('<title>');
      expect(result).toContain('Edge tooltip');
      expect(result).toContain('</title>');
    });

    it('should wrap edge in link', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).link = {
        href: 'https://example.com',
      };

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('<a');
      expect(result).toContain('xlink:href="https://example.com"');
      expect(result).toContain('</a>');
    });

    it('should not add link in strict mode', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      (edgeAst as any).link = {
        href: 'https://example.com',
      };

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, true, warnings);

      expect(result).not.toContain('<a');
      expect(result).not.toContain('xlink:href');
    });
  });

  describe('Edge Index Handling', () => {
    it('should use edgeIndex to find edge in AST', () => {
      const edgeAst1: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };
      const edgeAst2: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        edgeIndex: 1,
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst1, edgeAst2]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('data-edge-id="node1-node2-1"');
      expect(warnings).toHaveLength(0);
    });
  });

  describe('Hit Area', () => {
    it('should include invisible wide hit area for interaction', () => {
      const edgeAst: EdgeDeclaration = {
        from: 'node1',
        to: 'node2',
      };

      const routed: RoutedEdge = {
        from: 'node1',
        to: 'node2',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
        ],
      };

      const diagram = createMinimalDiagram([edgeAst]);
      const result = renderEdge(routed, diagram, false, warnings);

      expect(result).toContain('stroke="transparent"');
      expect(result).toContain('stroke-width="20"');
      expect(result).toContain('pointer-events="stroke"');
      expect(result).toContain('edge-hit-area');
    });
  });
});
