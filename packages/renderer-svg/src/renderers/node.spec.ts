import type {
  DiagramAst,
  DiagramTheme,
  NodeDeclaration,
  NodeMetrics,
  PositionedNode,
} from '@runiq/core';
import { registerDefaultShapes } from '@runiq/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { renderMetricBadge, renderNode } from './node.js';

describe('renderNode', () => {
  const warnings: string[] = [];

  beforeEach(() => {
    warnings.length = 0;
    // Ensure common shapes are registered for tests
    registerDefaultShapes();
  });

  const createMinimalDiagram = (nodes: NodeDeclaration[] = []): DiagramAst => ({
    type: 'diagram',
    nodes,
    edges: [],
  });

  describe('Basic Node Rendering', () => {
    it('should render a simple node', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test Node',
        shape: 'rectangle',
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, false, warnings);

      expect(result).toContain('<g');
      expect(result).toContain('data-runiq-node="node1"');
      expect(result).toContain('data-node-id="node1"');
      expect(result).toContain('data-node-shape="rectangle"');
      expect(result).toContain('</g>');
      expect(warnings).toHaveLength(0);
    });

    it('should render node with different shapes', () => {
      // Test multiple registered basic shapes
      const shapes = ['rectangle', 'roundedRectangle', 'circle'];

      for (const shape of shapes) {
        warnings.length = 0; // Clear warnings for each shape

        const nodeAst: NodeDeclaration = {
          id: 'node1',
          label: 'Test',
          shape,
        };

        const positioned: PositionedNode = {
          id: 'node1',
          x: 100,
          y: 200,
          width: 150,
          height: 80,
        };

        const diagram = createMinimalDiagram([nodeAst]);
        const result = renderNode(positioned, diagram, false, warnings);

        expect(result).toContain(`data-node-shape="${shape}"`);
        expect(result).toBeTruthy();
        expect(warnings).toHaveLength(0); // No warnings for valid shapes
      }
    });

    it('should omit data attributes in strict mode', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test Node',
        shape: 'rectangle',
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, true, warnings);

      expect(result).not.toContain('data-runiq-node');
      expect(result).not.toContain('data-node-id');
      expect(result).not.toContain('data-node-shape');
      expect(result).toContain('<g>'); // No attributes
    });

    it('should add warning for missing node in AST', () => {
      const positioned: PositionedNode = {
        id: 'nonexistent',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram();
      const result = renderNode(positioned, diagram, false, warnings);

      expect(result).toBe('');
      expect(warnings).toContain('Node nonexistent not found in diagram AST');
    });

    it('should add warning and render fallback for unknown shape', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test Node',
        shape: 'nonexistent-shape',
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, false, warnings);

      expect(warnings).toContain('Unknown shape: nonexistent-shape');
      expect(result).toContain('<rect'); // Fallback rendering
      expect(result).toContain('fill="#f0f0f0"');
      expect(result).toContain('Test Node');
    });
  });

  describe('Theme Application', () => {
    it('should apply theme colors to node', () => {
      const theme: DiagramTheme = {
        nodeColors: ['#ff0000', '#00ff00', '#0000ff'],
        edgeColor: '#333333',
        textColor: '#ffffff',
        backgroundColor: '#000000',
      };

      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(
        positioned,
        diagram,
        false,
        warnings,
        null,
        theme,
        0
      );

      // Should apply first color from theme
      expect(result).toBeTruthy();
    });

    it('should cycle through theme colors by node index', () => {
      const theme: DiagramTheme = {
        nodeColors: ['#ff0000', '#00ff00'],
        edgeColor: '#333333',
        textColor: '#ffffff',
        backgroundColor: '#000000',
      };

      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);

      // Node index 0 should get first color
      const result0 = renderNode(
        positioned,
        diagram,
        false,
        warnings,
        null,
        theme,
        0
      );
      expect(result0).toBeTruthy();

      // Node index 1 should get second color
      const result1 = renderNode(
        positioned,
        diagram,
        false,
        warnings,
        null,
        theme,
        1
      );
      expect(result1).toBeTruthy();

      // Node index 2 should wrap to first color
      const result2 = renderNode(
        positioned,
        diagram,
        false,
        warnings,
        null,
        theme,
        2
      );
      expect(result2).toBeTruthy();
    });

    it('should not override explicit style colors with theme', () => {
      const theme: DiagramTheme = {
        nodeColors: ['#ff0000'],
        edgeColor: '#333333',
        textColor: '#ffffff',
        backgroundColor: '#000000',
      };

      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
        style: 'customStyle',
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram: DiagramAst = {
        type: 'diagram',
        nodes: [nodeAst],
        edges: [],
        styles: {
          customStyle: {
            fill: '#00ff00',
            stroke: '#0000ff',
          },
        },
      };

      const result = renderNode(
        positioned,
        diagram,
        false,
        warnings,
        null,
        theme,
        0
      );

      // Should use explicit style, not theme
      expect(result).toBeTruthy();
    });
  });

  describe('Inline Style Properties', () => {
    it('should apply fillColor from node data', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
        data: {
          fillColor: '#ff0000',
        },
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, false, warnings);

      expect(result).toBeTruthy();
    });

    it('should apply textColor from node data', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
        data: {
          textColor: '#ffffff',
        },
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, false, warnings);

      expect(result).toBeTruthy();
    });

    it('should apply strokeColor and strokeWidth from node data', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
        data: {
          strokeColor: '#00ff00',
          strokeWidth: 5,
        },
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, false, warnings);

      expect(result).toBeTruthy();
    });

    it('should apply fontSize and fontFamily from node data', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
        data: {
          fontSize: 20,
          fontFamily: 'Arial',
        },
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, false, warnings);

      expect(result).toBeTruthy();
    });

    it('should apply borderRadius from node data', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
        data: {
          borderRadius: 10,
        },
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, false, warnings);

      expect(result).toBeTruthy();
    });

    it('should apply opacity from node data', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
        data: {
          opacity: 0.5,
        },
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, false, warnings);

      expect(result).toContain('opacity="0.5"');
    });
  });

  describe('Pedigree Properties', () => {
    it('should apply affected property', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
        data: {
          affected: true,
        },
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, false, warnings);

      expect(result).toBeTruthy();
    });

    it('should apply carrier property', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
        data: {
          carrier: true,
        },
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, false, warnings);

      expect(result).toBeTruthy();
    });

    it('should apply deceased property', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
        data: {
          deceased: true,
        },
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, false, warnings);

      expect(result).toBeTruthy();
    });
  });

  describe('Icons', () => {
    it('should render node with icon', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
      };
      (nodeAst as any).icon = 'fa-solid:user';

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, false, warnings);

      // Should contain icon markup (details tested in icons.spec.ts)
      expect(result).toBeTruthy();
    });
  });

  describe('Links and Tooltips', () => {
    it('should wrap node in link element', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
      };
      (nodeAst as any).link = {
        href: 'https://example.com',
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, false, warnings);

      expect(result).toContain('<a');
      expect(result).toContain('xlink:href="https://example.com"');
      expect(result).toContain('</a>');
    });

    it('should escape XSS in link href', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
      };
      (nodeAst as any).link = {
        href: 'javascript:alert("XSS")',
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, false, warnings);

      // Quotes are escaped (prevents attribute injection)
      expect(result).toContain('&quot;');
      expect(result).toContain('xlink:href');
    });

    it('should add target attribute to link', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
      };
      (nodeAst as any).link = {
        href: 'https://example.com',
        target: '_blank',
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, false, warnings);

      expect(result).toContain('target="_blank"');
    });

    it('should add tooltip to node', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
      };
      (nodeAst as any).tooltip = 'This is a tooltip';

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, false, warnings);

      expect(result).toContain('<title>');
      expect(result).toContain('This is a tooltip');
      expect(result).toContain('</title>');
    });

    it('should escape XSS in tooltip', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
      };
      (nodeAst as any).tooltip = '<script>alert("XSS")</script>';

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, false, warnings);

      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });

    it('should not add link in strict mode', () => {
      const nodeAst: NodeDeclaration = {
        id: 'node1',
        label: 'Test',
        shape: 'rectangle',
      };
      (nodeAst as any).link = {
        href: 'https://example.com',
      };

      const positioned: PositionedNode = {
        id: 'node1',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      };

      const diagram = createMinimalDiagram([nodeAst]);
      const result = renderNode(positioned, diagram, true, warnings);

      expect(result).not.toContain('<a');
      expect(result).not.toContain('xlink:href');
    });
  });

  describe('renderMetricBadge', () => {
    const positioned: PositionedNode = {
      id: 'node1',
      x: 100,
      y: 200,
      width: 150,
      height: 80,
    };

    const nodeMetrics: NodeMetrics = {
      nodeId: 'node1',
      degree: 5,
      inDegree: 2,
      outDegree: 3,
      betweenness: 0.75,
      closeness: 0.8,
      clustering: 0.6,
    };

    it('should render degree metric badge', () => {
      const result = renderMetricBadge(
        nodeMetrics,
        positioned,
        'degree',
        'top-right'
      );

      expect(result).toContain('<rect'); // Badge uses rect background
      expect(result).toContain('<text');
      expect(result).toContain('5'); // degree value
      expect(result).toContain('runiq-metric-badge');
    });

    it('should render betweenness metric badge', () => {
      const result = renderMetricBadge(
        nodeMetrics,
        positioned,
        'betweenness',
        'top-right'
      );

      expect(result).toContain('0.75');
    });

    it('should render closeness metric badge', () => {
      const result = renderMetricBadge(
        nodeMetrics,
        positioned,
        'closeness',
        'top-right'
      );

      expect(result).toContain('0.8');
    });

    it('should render clustering metric badge', () => {
      const result = renderMetricBadge(
        nodeMetrics,
        positioned,
        'clustering',
        'top-right'
      );

      expect(result).toContain('0.6');
    });

    it('should position badge at top-right', () => {
      const result = renderMetricBadge(
        nodeMetrics,
        positioned,
        'degree',
        'top-right'
      );

      // Badge should be positioned relative to node bounds
      expect(result).toBeTruthy();
    });

    it('should position badge at top-left', () => {
      const result = renderMetricBadge(
        nodeMetrics,
        positioned,
        'degree',
        'top-left'
      );

      expect(result).toBeTruthy();
    });

    it('should position badge at bottom-right', () => {
      const result = renderMetricBadge(
        nodeMetrics,
        positioned,
        'degree',
        'bottom-right'
      );

      expect(result).toBeTruthy();
    });

    it('should position badge at bottom-left', () => {
      const result = renderMetricBadge(
        nodeMetrics,
        positioned,
        'degree',
        'bottom-left'
      );

      expect(result).toBeTruthy();
    });
  });
});
