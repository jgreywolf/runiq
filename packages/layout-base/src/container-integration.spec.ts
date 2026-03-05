import { describe, it, expect, beforeEach } from 'vitest';
import { parse } from '@runiq/parser-dsl';
import { ElkLayoutEngine } from './elk-adapter.js';
import { renderSvg } from '@runiq/renderer-svg';
import { shapeRegistry } from '@runiq/core';

describe('Container Integration Tests', () => {
  const engine = new ElkLayoutEngine();

  beforeEach(() => {
    // Register test shapes needed for integration tests
    shapeRegistry.register({
      id: 'rounded',
      bounds: (_ctx) => ({ width: 100, height: 60 }),
      render: (_ctx, position) =>
        `<rect x="${position.x}" y="${position.y}" width="100" height="60" rx="8" />`,
    });
  });

  it('should handle simple container from DSL to SVG', async () => {
    const dsl = `
      diagram "Test Container" {
        container c1 "My Container" {
          shape A as @rounded label: "Node A"
          shape B as @rounded label: "Node B"
          A -> B
        }
      }
    `;

    const ast = parse(dsl);
    expect(ast.errors).toHaveLength(0);
    expect(ast.diagram).toBeDefined();
    expect(ast.diagram!.nodes).toHaveLength(2); // Parser creates nodes
    expect(ast.diagram!.containers).toHaveLength(1);

    const layout = await engine.layout(ast.diagram!);
    expect(layout.containers).toHaveLength(1);
    expect(layout.containers![0].id).toBe('c1');
    expect(layout.containers![0].label).toBe('My Container');

    // All nodes are positioned at the top level (layout.nodes)
    expect(layout.nodes).toHaveLength(2);

    const result = renderSvg(ast.diagram!, layout);
    expect(result.svg).toContain('data-runiq-container="c1"');
    expect(result.svg).toContain('My Container');
    expect(result.svg).toContain('data-runiq-node="A"');
    expect(result.svg).toContain('data-runiq-node="B"');
    expect(result.warnings).toHaveLength(0);
  });

  it('should handle multiple containers', async () => {
    const dsl = `
      diagram "Multiple Containers" {
        container c1 "Container 1" {
          shape A as @rounded label: "A"
        }
        container c2 "Container 2" {
          shape B as @rounded label: "B"
          shape C as @rounded label: "C"
          B -> C
        }
        A -> B
      }
    `;

    const ast = parse(dsl);
    expect(ast.errors).toHaveLength(0);

    const layout = await engine.layout(ast.diagram!);
    expect(layout.containers).toHaveLength(2);

    const result = renderSvg(ast.diagram!, layout);
    expect(result.svg).toContain('Container 1');
    expect(result.svg).toContain('Container 2');
    expect(result.warnings).toHaveLength(0);
  });

  it('should handle container with custom styling', async () => {
    const dsl = `
      diagram "Styled Container" {
        container c1 "Styled" 
          fillColor: "#e0f0ff"
          strokeColor: "#0066cc"
          strokeWidth: 3 {
          shape A as @rounded label: "A"
        }
      }
    `;

    const ast = parse(dsl);
    expect(ast.errors).toHaveLength(0);

    const layout = await engine.layout(ast.diagram!);
    expect(layout.containers).toHaveLength(1);

    const result = renderSvg(ast.diagram!, layout);
    expect(result.svg).toContain('fill="#e0f0ff"');
    expect(result.svg).toContain('stroke="#0066cc"');
    expect(result.warnings).toHaveLength(0);
  });

  it('should handle empty container', async () => {
    const dsl = `
      diagram "Empty Container" {
        container empty "Empty Box" {}
        shape A as @rounded label: "A"
        A -> A
      }
    `;

    const ast = parse(dsl);
    expect(ast.errors).toHaveLength(0);

    const layout = await engine.layout(ast.diagram!);
    expect(layout.containers).toHaveLength(1);
    expect(layout.containers![0].width).toBeGreaterThan(0);
    expect(layout.containers![0].height).toBeGreaterThan(0);

    const result = renderSvg(ast.diagram!, layout);
    expect(result.svg).toContain('Empty Box');
    expect(result.warnings).toHaveLength(0);
  });
});
