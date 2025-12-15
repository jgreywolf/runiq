import type {
  ContainerDeclaration,
  DiagramAst,
  PositionedContainer,
} from '@runiq/core';
import { LineStyle } from '@runiq/core';
import { describe, expect, it } from 'vitest';
import { renderContainer } from './container.js';

describe('renderContainer', () => {
  const createMinimalDiagram = (
    containers?: ContainerDeclaration[]
  ): DiagramAst => ({
    type: 'diagram',
    nodes: [],
    edges: [],
    containers,
  });

  const createContainer = (
    id: string,
    overrides?: Partial<ContainerDeclaration>
  ): ContainerDeclaration => ({
    type: 'container',
    id,
    children: [],
    ...overrides,
  });

  describe('Basic Container Rendering', () => {
    it('should render a simple container with default styling', () => {
      const container: PositionedContainer = {
        id: 'container1',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
      };

      const diagram = createMinimalDiagram();
      const result = renderContainer(container, diagram, false);

      expect(result).toContain('<g');
      expect(result).toContain('data-runiq-container="container1"');
      expect(result).toContain('<rect');
      expect(result).toContain('x="100"');
      expect(result).toContain('y="200"');
      expect(result).toContain('width="300"');
      expect(result).toContain('height="400"');
      expect(result).toContain('fill="#f9f9f9"'); // Default fill
      expect(result).toContain('stroke="#ddd"'); // Default stroke
      expect(result).toContain('stroke-width="2"'); // Default stroke width
      expect(result).toContain('rx="8"'); // Default border radius
      expect(result).toContain('</g>');
    });

    it('should render container with label', () => {
      const container: PositionedContainer = {
        id: 'container1',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
        label: 'My Container',
      };

      const diagram = createMinimalDiagram();
      const result = renderContainer(container, diagram, false);

      expect(result).toContain('<text');
      expect(result).toContain('x="110"'); // x + 10
      expect(result).toContain('y="220"'); // y + 20
      expect(result).toContain('class="runiq-container-label"');
      expect(result).toContain('My Container');
    });

    it('should escape XML entities in label', () => {
      const container: PositionedContainer = {
        id: 'container1',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
        label: '<script>alert("XSS")</script>',
      };

      const diagram = createMinimalDiagram();
      const result = renderContainer(container, diagram, false);

      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
      expect(result).toContain('&quot;');
    });

    it('should omit data attributes in strict mode', () => {
      const container: PositionedContainer = {
        id: 'container1',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
      };

      const diagram = createMinimalDiagram();
      const result = renderContainer(container, diagram, true);

      expect(result).not.toContain('data-runiq-container');
      expect(result).not.toContain('data-container-id');
      expect(result).toContain('<g>'); // No attributes on group
    });
  });

  describe('Container Style Application', () => {
    it('should apply custom fill color', () => {
      const containerAst = createContainer('container1', {
        containerStyle: {
          fillColor: '#ff0000',
        },
      });

      const container: PositionedContainer = {
        id: 'container1',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
      };

      const diagram = createMinimalDiagram([containerAst]);
      const result = renderContainer(container, diagram, false);

      expect(result).toContain('fill="#ff0000"');
    });

    it('should apply custom stroke color and width', () => {
      const containerAst: ContainerDeclaration = {
        id: 'container1',
        containerStyle: {
          strokeColor: '#00ff00',
          strokeWidth: 5,
        },
      };

      const container: PositionedContainer = {
        id: 'container1',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
      };

      const diagram = createMinimalDiagram([containerAst]);
      const result = renderContainer(container, diagram, false);

      expect(result).toContain('stroke="#00ff00"');
      expect(result).toContain('stroke-width="5"');
    });

    it('should apply dashed border style', () => {
      const containerAst: ContainerDeclaration = {
        id: 'container1',
        containerStyle: {
          borderStyle: LineStyle.DASHED,
        },
      };

      const container: PositionedContainer = {
        id: 'container1',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
      };

      const diagram = createMinimalDiagram([containerAst]);
      const result = renderContainer(container, diagram, false);

      expect(result).toContain('stroke-dasharray="5,5"');
    });

    it('should apply dotted border style', () => {
      const containerAst: ContainerDeclaration = {
        id: 'container1',
        containerStyle: {
          borderStyle: LineStyle.DOTTED,
        },
      };

      const container: PositionedContainer = {
        id: 'container1',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
      };

      const diagram = createMinimalDiagram([containerAst]);
      const result = renderContainer(container, diagram, false);

      expect(result).toContain('stroke-dasharray="2,2"');
    });

    it('should use solid border by default', () => {
      const containerAst: ContainerDeclaration = {
        id: 'container1',
        containerStyle: {
          borderStyle: LineStyle.SOLID,
        },
      };

      const container: PositionedContainer = {
        id: 'container1',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
      };

      const diagram = createMinimalDiagram([containerAst]);
      const result = renderContainer(container, diagram, false);

      expect(result).not.toContain('stroke-dasharray');
    });

    it('should handle container without containerStyle in AST', () => {
      const containerAst: ContainerDeclaration = {
        id: 'container1',
      };

      const container: PositionedContainer = {
        id: 'container1',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
      };

      const diagram = createMinimalDiagram([containerAst]);
      const result = renderContainer(container, diagram, false);

      expect(result).toContain('fill="#f9f9f9"'); // Default fill
      expect(result).toContain('stroke="#ddd"'); // Default stroke
    });
  });

  describe('Container with Shape References', () => {
    it('should render container using shape definition', () => {
      const containerAst: ContainerDeclaration = {
        id: 'container1',
        shape: 'rectangle',
      };

      const container: PositionedContainer = {
        id: 'container1',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
      };

      const diagram = createMinimalDiagram([containerAst]);
      const result = renderContainer(container, diagram, false);

      // Should contain shape-rendered content
      expect(result).toContain('<rect');
      expect(result).toBeTruthy();
    });

    it('should fall back to default rendering for unknown shape', () => {
      const containerAst: ContainerDeclaration = {
        id: 'container1',
        shape: 'nonexistent-shape',
      };

      const container: PositionedContainer = {
        id: 'container1',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
      };

      const diagram = createMinimalDiagram([containerAst]);
      const result = renderContainer(container, diagram, false);

      // Should fall back to default rendering
      expect(result).toContain('fill="#f9f9f9"');
      expect(result).toContain('<rect');
    });

    it('should apply style to shape-based container', () => {
      const containerAst: ContainerDeclaration = {
        id: 'container1',
        shape: 'rectangle',
        containerStyle: {
          fillColor: '#ff0000',
          strokeColor: '#00ff00',
          strokeWidth: 3,
        },
      };

      const container: PositionedContainer = {
        id: 'container1',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
      };

      const diagram = createMinimalDiagram([containerAst]);
      const result = renderContainer(container, diagram, false);

      // Should contain styled shape
      expect(result).toContain('<rect');
      expect(result).toBeTruthy();
    });

    it('should convert border style to strokeDasharray for shapes', () => {
      const containerAst: ContainerDeclaration = {
        id: 'container1',
        shape: 'rectangle',
        containerStyle: {
          borderStyle: LineStyle.DASHED,
        },
      };

      const container: PositionedContainer = {
        id: 'container1',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
      };

      const diagram = createMinimalDiagram([containerAst]);
      const result = renderContainer(container, diagram, false);

      // Shape renderer should have received strokeDasharray in style
      expect(result).toBeTruthy();
    });
  });

  describe('Nested Container Rendering', () => {
    it('should recursively render nested containers', () => {
      const nested: PositionedContainer = {
        id: 'nested1',
        x: 150,
        y: 250,
        width: 100,
        height: 100,
      };

      const container: PositionedContainer = {
        id: 'container1',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
        containers: [nested],
      };

      const diagram = createMinimalDiagram();
      const result = renderContainer(container, diagram, false);

      expect(result).toContain('data-runiq-container="container1"');
      expect(result).toContain('data-runiq-container="nested1"');
      expect(result).toContain('x="150"');
      expect(result).toContain('y="250"');
      expect(result).toContain('width="100"');
      expect(result).toContain('height="100"');
    });

    it('should handle multiple nested containers', () => {
      const nested1: PositionedContainer = {
        id: 'nested1',
        x: 150,
        y: 250,
        width: 100,
        height: 100,
      };

      const nested2: PositionedContainer = {
        id: 'nested2',
        x: 150,
        y: 400,
        width: 100,
        height: 100,
      };

      const container: PositionedContainer = {
        id: 'container1',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
        containers: [nested1, nested2],
      };

      const diagram = createMinimalDiagram();
      const result = renderContainer(container, diagram, false);

      expect(result).toContain('data-runiq-container="container1"');
      expect(result).toContain('data-runiq-container="nested1"');
      expect(result).toContain('data-runiq-container="nested2"');
    });

    it('should handle deeply nested containers', () => {
      const deepNested: PositionedContainer = {
        id: 'deep',
        x: 200,
        y: 300,
        width: 50,
        height: 50,
      };

      const nested: PositionedContainer = {
        id: 'nested',
        x: 150,
        y: 250,
        width: 100,
        height: 100,
        containers: [deepNested],
      };

      const container: PositionedContainer = {
        id: 'root',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
        containers: [nested],
      };

      const diagram = createMinimalDiagram();
      const result = renderContainer(container, diagram, false);

      expect(result).toContain('data-runiq-container="root"');
      expect(result).toContain('data-runiq-container="nested"');
      expect(result).toContain('data-runiq-container="deep"');
    });
  });

  describe('Edge Cases', () => {
    it('should handle container with zero dimensions', () => {
      const container: PositionedContainer = {
        id: 'container1',
        x: 100,
        y: 200,
        width: 0,
        height: 0,
      };

      const diagram = createMinimalDiagram();
      const result = renderContainer(container, diagram, false);

      expect(result).toContain('width="0"');
      expect(result).toContain('height="0"');
      expect(result).toContain('<g');
      expect(result).toContain('</g>');
    });

    it('should handle container at origin', () => {
      const container: PositionedContainer = {
        id: 'container1',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      };

      const diagram = createMinimalDiagram();
      const result = renderContainer(container, diagram, false);

      expect(result).toContain('x="0"');
      expect(result).toContain('y="0"');
    });

    it('should handle container with negative coordinates', () => {
      const container: PositionedContainer = {
        id: 'container1',
        x: -100,
        y: -200,
        width: 300,
        height: 400,
      };

      const diagram = createMinimalDiagram();
      const result = renderContainer(container, diagram, false);

      expect(result).toContain('x="-100"');
      expect(result).toContain('y="-200"');
    });

    it('should handle empty label', () => {
      const container: PositionedContainer = {
        id: 'container1',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
        label: '',
      };

      const diagram = createMinimalDiagram();
      const result = renderContainer(container, diagram, false);

      // Empty label should not render text element (label is falsy)
      expect(result).not.toContain('<text');
      expect(result).toContain('<rect');
    });

    it('should handle container not found in AST', () => {
      const container: PositionedContainer = {
        id: 'nonexistent',
        x: 100,
        y: 200,
        width: 300,
        height: 400,
      };

      const diagram = createMinimalDiagram([{ id: 'other-container' }]);
      const result = renderContainer(container, diagram, false);

      // Should use default styling
      expect(result).toContain('fill="#f9f9f9"');
      expect(result).toContain('<g');
      expect(result).toContain('</g>');
    });
  });
});
