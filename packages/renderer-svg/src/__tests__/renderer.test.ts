import { describe, it, expect, beforeEach } from 'vitest';
import { renderSvg } from '../index.js';
import type { DiagramAst, LaidOutDiagram } from '@runiq/core';
import { shapeRegistry, iconRegistry } from '@runiq/core';

describe('renderer-svg', () => {
  beforeEach(() => {
    // Register mock shapes for testing
    shapeRegistry.register({
      id: 'rounded',
      bounds: (ctx) => {
        const textSize = ctx.measureText(
          ctx.node.label || ctx.node.id,
          ctx.style
        );
        const padding = ctx.style.padding || 12;
        return {
          width: textSize.width + padding * 2,
          height: textSize.height + padding * 2,
        };
      },
      render: (ctx, position) => {
        const bounds = shapeRegistry.get('rounded')!.bounds(ctx);
        const { x, y } = position;
        const fill = ctx.style.fill || '#f0f0f0';
        const stroke = ctx.style.stroke || '#333';
        const rx = ctx.style.rx || 8;
        return `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" rx="${rx}" fill="${fill}" stroke="${stroke}" />
<text x="${x + bounds.width / 2}" y="${y + bounds.height / 2}" text-anchor="middle">${ctx.node.label || ctx.node.id}</text>`;
      },
    });

    shapeRegistry.register({
      id: 'circle',
      bounds: (_ctx) => ({ width: 80, height: 80 }),
      render: (_ctx, position) => {
        const { x, y } = position;
        return `<circle cx="${x + 40}" cy="${y + 40}" r="40" fill="#f0f0f0" stroke="#333" />`;
      },
    });

    // Register mock icon provider
    iconRegistry.register({
      id: 'fa',
      getPath: (name: string) => {
        if (name === 'user') {
          return { d: 'M10,10 L20,20', viewBox: '0 0 24 24' };
        }
        return undefined;
      },
    });
  });

  describe('Basic Rendering', () => {
    it('should render empty diagram', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [],
        edges: [],
        size: { width: 200, height: 200 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('width="200"');
      expect(result.svg).toContain('height="200"');
      expect(result.svg).toContain('</svg>');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render single node', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'A', shape: 'rounded' }],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'A', x: 10, y: 10, width: 100, height: 60 }],
        edges: [],
        size: { width: 150, height: 100 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('<rect');
      expect(result.svg).toContain('x="10"');
      expect(result.svg).toContain('y="10"');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render multiple nodes', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [
          { id: 'A', x: 10, y: 10, width: 100, height: 60 },
          { id: 'B', x: 150, y: 10, width: 100, height: 60 },
        ],
        edges: [],
        size: { width: 300, height: 100 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('<svg');
      // Should contain two rect elements (one for each node)
      expect((result.svg.match(/<rect/g) || []).length).toBeGreaterThanOrEqual(
        2
      );
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('Edge Rendering', () => {
    it('should render simple edge', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B' }],
      };

      const layout: LaidOutDiagram = {
        nodes: [
          { id: 'A', x: 10, y: 50, width: 100, height: 60 },
          { id: 'B', x: 200, y: 50, width: 100, height: 60 },
        ],
        edges: [
          {
            from: 'A',
            to: 'B',
            points: [
              { x: 110, y: 80 },
              { x: 200, y: 80 },
            ],
          },
        ],
        size: { width: 350, height: 150 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('<path');
      expect(result.svg).toContain('M 110 80');
      expect(result.svg).toContain('L 200 80');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render edge with label', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B', label: 'yes' }],
      };

      const layout: LaidOutDiagram = {
        nodes: [
          { id: 'A', x: 10, y: 50, width: 100, height: 60 },
          { id: 'B', x: 200, y: 50, width: 100, height: 60 },
        ],
        edges: [
          {
            from: 'A',
            to: 'B',
            points: [
              { x: 110, y: 80 },
              { x: 200, y: 80 },
            ],
          },
        ],
        size: { width: 350, height: 150 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('<text');
      expect(result.svg).toContain('yes');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render edge with arrowhead', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B' }],
      };

      const layout: LaidOutDiagram = {
        nodes: [
          { id: 'A', x: 10, y: 50, width: 100, height: 60 },
          { id: 'B', x: 200, y: 50, width: 100, height: 60 },
        ],
        edges: [
          {
            from: 'A',
            to: 'B',
            points: [
              { x: 110, y: 80 },
              { x: 200, y: 80 },
            ],
          },
        ],
        size: { width: 350, height: 150 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('<marker');
      expect(result.svg).toContain('arrow-A-B');
      expect(result.svg).toContain('marker-end');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render multiple edges', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
          { id: 'C', shape: 'rounded' },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
        ],
      };

      const layout: LaidOutDiagram = {
        nodes: [
          { id: 'A', x: 10, y: 10, width: 100, height: 60 },
          { id: 'B', x: 150, y: 10, width: 100, height: 60 },
          { id: 'C', x: 290, y: 10, width: 100, height: 60 },
        ],
        edges: [
          {
            from: 'A',
            to: 'B',
            points: [
              { x: 110, y: 40 },
              { x: 150, y: 40 },
            ],
          },
          {
            from: 'B',
            to: 'C',
            points: [
              { x: 250, y: 40 },
              { x: 290, y: 40 },
            ],
          },
        ],
        size: { width: 400, height: 100 },
      };

      const result = renderSvg(diagram, layout);

      expect((result.svg.match(/<path/g) || []).length).toBeGreaterThanOrEqual(
        4
      ); // 2 edges × 2 paths each (line + arrow)
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('Accessibility', () => {
    it('should include title element', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        title: 'Test Diagram',
        nodes: [],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [],
        edges: [],
        size: { width: 200, height: 200 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('<title');
      expect(result.svg).toContain('Test Diagram');
      expect(result.svg).toContain('id="diagram-title"');
    });

    it('should use custom title from options', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        title: 'Diagram Title',
        nodes: [],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [],
        edges: [],
        size: { width: 200, height: 200 },
      };

      const result = renderSvg(diagram, layout, { title: 'Custom Title' });

      expect(result.svg).toContain('Custom Title');
      expect(result.svg).not.toContain('Diagram Title');
    });

    it('should include description when provided', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [],
        edges: [],
        size: { width: 200, height: 200 },
      };

      const result = renderSvg(diagram, layout, {
        description: 'Test description',
      });

      expect(result.svg).toContain('<desc>');
      expect(result.svg).toContain('Test description');
    });

    it('should include aria-labelledby', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [],
        edges: [],
        size: { width: 200, height: 200 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('role="img"');
      expect(result.svg).toContain('aria-labelledby="diagram-title"');
    });

    it('should include tooltip for nodes', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'A', shape: 'rounded', tooltip: 'Node tooltip' }],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'A', x: 10, y: 10, width: 100, height: 60 }],
        edges: [],
        size: { width: 150, height: 100 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('<title>');
      expect(result.svg).toContain('Node tooltip');
    });

    it('should include tooltip for edges', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B', tooltip: 'Edge tooltip' }],
      };

      const layout: LaidOutDiagram = {
        nodes: [
          { id: 'A', x: 10, y: 50, width: 100, height: 60 },
          { id: 'B', x: 200, y: 50, width: 100, height: 60 },
        ],
        edges: [
          {
            from: 'A',
            to: 'B',
            points: [
              { x: 110, y: 80 },
              { x: 200, y: 80 },
            ],
          },
        ],
        size: { width: 350, height: 150 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('Edge tooltip');
    });
  });

  describe('Styling', () => {
    it('should include default styles', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [],
        edges: [],
        size: { width: 200, height: 200 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('<style');
      expect(result.svg).toContain('runiq-node-text');
      expect(result.svg).toContain('runiq-edge-text');
    });

    it('should apply custom node styles', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        styles: {
          primary: {
            fill: '#3b82f6',
            stroke: '#1d4ed8',
          },
        },
        nodes: [{ id: 'A', shape: 'rounded', style: 'primary' }],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'A', x: 10, y: 10, width: 100, height: 60 }],
        edges: [],
        size: { width: 150, height: 100 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('fill="#3b82f6"');
      expect(result.svg).toContain('stroke="#1d4ed8"');
    });

    it('should apply custom edge styles', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        styles: {
          primary: {
            stroke: '#ef4444',
            strokeWidth: 3,
          },
        },
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B', style: 'primary' }],
      };

      const layout: LaidOutDiagram = {
        nodes: [
          { id: 'A', x: 10, y: 50, width: 100, height: 60 },
          { id: 'B', x: 200, y: 50, width: 100, height: 60 },
        ],
        edges: [
          {
            from: 'A',
            to: 'B',
            points: [
              { x: 110, y: 80 },
              { x: 200, y: 80 },
            ],
          },
        ],
        size: { width: 350, height: 150 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('stroke="#ef4444"');
      expect(result.svg).toContain('stroke-width="3"');
    });
  });

  describe('Links', () => {
    it('should render node with link', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          {
            id: 'A',
            shape: 'rounded',
            link: { href: 'https://example.com' },
          },
        ],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'A', x: 10, y: 10, width: 100, height: 60 }],
        edges: [],
        size: { width: 150, height: 100 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('<a');
      expect(result.svg).toContain('xlink:href="https://example.com"');
    });

    it('should render node link with target', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          {
            id: 'A',
            shape: 'rounded',
            link: { href: 'https://example.com', target: '_blank' },
          },
        ],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'A', x: 10, y: 10, width: 100, height: 60 }],
        edges: [],
        size: { width: 150, height: 100 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('target="_blank"');
    });

    it('should render edge with link', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B', link: { href: 'https://example.com' } }],
      };

      const layout: LaidOutDiagram = {
        nodes: [
          { id: 'A', x: 10, y: 50, width: 100, height: 60 },
          { id: 'B', x: 200, y: 50, width: 100, height: 60 },
        ],
        edges: [
          {
            from: 'A',
            to: 'B',
            points: [
              { x: 110, y: 80 },
              { x: 200, y: 80 },
            ],
          },
        ],
        size: { width: 350, height: 150 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('<a');
      expect(result.svg).toContain('xlink:href="https://example.com"');
    });

    it('should not render links in strict mode', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          {
            id: 'A',
            shape: 'rounded',
            link: { href: 'https://example.com' },
          },
        ],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'A', x: 10, y: 10, width: 100, height: 60 }],
        edges: [],
        size: { width: 150, height: 100 },
      };

      const result = renderSvg(diagram, layout, { strict: true });

      expect(result.svg).not.toContain('<a');
      expect(result.svg).not.toContain('xlink:href');
    });
  });

  describe('Icons', () => {
    it('should render node with icon', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          {
            id: 'A',
            shape: 'rounded',
            icon: { provider: 'fa', name: 'user' },
          },
        ],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'A', x: 10, y: 10, width: 100, height: 60 }],
        edges: [],
        size: { width: 150, height: 100 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('viewBox="0 0 24 24"');
      expect(result.svg).toContain('M10,10 L20,20');
    });

    it('should warn about missing icons', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          {
            id: 'A',
            shape: 'rounded',
            icon: { provider: 'fa', name: 'unknown' },
          },
        ],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'A', x: 10, y: 10, width: 100, height: 60 }],
        edges: [],
        size: { width: 150, height: 100 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((w) => w.includes('Icon'))).toBe(true);
    });
  });

  describe('Strict Mode', () => {
    it('should not add data attributes in strict mode', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'A', shape: 'rounded' }],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'A', x: 10, y: 10, width: 100, height: 60 }],
        edges: [],
        size: { width: 150, height: 100 },
      };

      const result = renderSvg(diagram, layout, { strict: true });

      expect(result.svg).not.toContain('data-runiq-node');
      expect(result.svg).not.toContain('data-runiq-edge');
    });

    it('should add data attributes in non-strict mode', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'A', shape: 'rounded' }],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'A', x: 10, y: 10, width: 100, height: 60 }],
        edges: [],
        size: { width: 150, height: 100 },
      };

      const result = renderSvg(diagram, layout, { strict: false });

      expect(result.svg).toContain('data-runiq-node="A"');
    });
  });

  describe('Error Handling', () => {
    it('should warn about missing node in layout', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'A', shape: 'rounded' }],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'B', x: 10, y: 10, width: 100, height: 60 }],
        edges: [],
        size: { width: 150, height: 100 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((w) => w.includes('not found'))).toBe(true);
    });

    it('should warn about unknown shape', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'A', shape: 'unknown-shape' }],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'A', x: 10, y: 10, width: 100, height: 60 }],
        edges: [],
        size: { width: 150, height: 100 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((w) => w.includes('Unknown shape'))).toBe(
        true
      );
    });

    it('should render fallback for unknown shape', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'A', shape: 'unknown-shape' }],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'A', x: 10, y: 10, width: 100, height: 60 }],
        edges: [],
        size: { width: 150, height: 100 },
      };

      const result = renderSvg(diagram, layout);

      // Should still render something
      expect(result.svg).toContain('<rect');
      expect(result.svg).toContain('A');
    });

    it('should warn about edge with insufficient points', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [{ from: 'A', to: 'B' }],
      };

      const layout: LaidOutDiagram = {
        nodes: [
          { id: 'A', x: 10, y: 50, width: 100, height: 60 },
          { id: 'B', x: 200, y: 50, width: 100, height: 60 },
        ],
        edges: [
          {
            from: 'A',
            to: 'B',
            points: [{ x: 110, y: 80 }], // Only 1 point (need at least 2)
          },
        ],
        size: { width: 350, height: 150 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(
        result.warnings.some((w) => w.includes('insufficient points'))
      ).toBe(true);
    });
  });

  describe('XML Escaping', () => {
    it('should escape special characters in titles', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        title: '<script>alert("xss")</script>',
        nodes: [],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [],
        edges: [],
        size: { width: 150, height: 100 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('&lt;script&gt;');
      expect(result.svg).not.toContain('<script>');
    });

    it('should escape special characters in tooltips', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'A', shape: 'rounded', tooltip: 'Test & "quote"' }],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'A', x: 10, y: 10, width: 100, height: 60 }],
        edges: [],
        size: { width: 150, height: 100 },
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('&amp;');
      expect(result.svg).toContain('&quot;');
    });
  });

  describe('Container Rendering', () => {
    it('should render container with nodes', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'A', shape: 'rounded' }],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Container 1',
            children: ['A'],
          },
        ],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'A', x: 50, y: 50, width: 100, height: 60 }],
        edges: [],
        size: { width: 250, height: 200 },
        containers: [
          {
            id: 'c1',
            x: 20,
            y: 20,
            width: 200,
            height: 150,
            label: 'Container 1',
          },
        ],
      };

      const result = renderSvg(diagram, layout);

      // Should contain container rectangle
      expect(result.svg).toContain('data-runiq-container="c1"');
      expect(result.svg).toContain('Container 1');
      // Container should be rendered before nodes (appear in SVG first)
      const containerIndex = result.svg.indexOf('data-runiq-container');
      const nodeIndex = result.svg.indexOf('data-runiq-node');
      expect(containerIndex).toBeLessThan(nodeIndex);
      expect(result.warnings).toHaveLength(0);
    });

    it('should render nested containers', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'rounded' },
        ],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'outer',
            label: 'Outer',
            children: ['A'],
            containers: [
              {
                type: 'container',
                id: 'inner',
                label: 'Inner',
                children: ['B'],
              },
            ],
          },
        ],
      };

      const layout: LaidOutDiagram = {
        nodes: [
          { id: 'A', x: 50, y: 50, width: 100, height: 60 },
          { id: 'B', x: 80, y: 150, width: 100, height: 60 },
        ],
        edges: [],
        size: { width: 300, height: 280 },
        containers: [
          {
            id: 'outer',
            x: 20,
            y: 20,
            width: 250,
            height: 240,
            label: 'Outer',
            containers: [
              {
                id: 'inner',
                x: 50,
                y: 120,
                width: 180,
                height: 120,
                label: 'Inner',
              },
            ],
          },
        ],
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('data-runiq-container="outer"');
      expect(result.svg).toContain('data-runiq-container="inner"');
      expect(result.svg).toContain('Outer');
      expect(result.svg).toContain('Inner');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render empty container', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'empty',
            label: 'Empty Container',
            children: [],
          },
        ],
      };

      const layout: LaidOutDiagram = {
        nodes: [],
        edges: [],
        size: { width: 250, height: 200 },
        containers: [
          {
            id: 'empty',
            x: 20,
            y: 20,
            width: 200,
            height: 150,
            label: 'Empty Container',
          },
        ],
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('data-runiq-container="empty"');
      expect(result.svg).toContain('Empty Container');
      expect(result.warnings).toHaveLength(0);
    });

    it('should apply container styles', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'styled',
            label: 'Styled Container',
            children: [],
            containerStyle: {
              backgroundColor: '#e0f0ff',
              borderColor: '#0066cc',
              borderWidth: 3,
            },
          },
        ],
      };

      const layout: LaidOutDiagram = {
        nodes: [],
        edges: [],
        size: { width: 250, height: 200 },
        containers: [
          {
            id: 'styled',
            x: 20,
            y: 20,
            width: 200,
            height: 150,
            label: 'Styled Container',
          },
        ],
      };

      const result = renderSvg(diagram, layout);

      expect(result.svg).toContain('fill="#e0f0ff"');
      expect(result.svg).toContain('stroke="#0066cc"');
      expect(result.svg).toContain('stroke-width="3"');
      expect(result.warnings).toHaveLength(0);
    });
  });
});
