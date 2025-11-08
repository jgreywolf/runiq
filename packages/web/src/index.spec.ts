import { describe, it, expect } from 'vitest';
import { parseRuniq, layoutRuniq, renderRuniqToSvg } from './index.js';

const sample = `diagram "My Diagram" {
  direction TB
  style s1 fill: "#eef"
  shape A as @rectangle label:"Hello" style: s1
  shape B as @rectangle label:"World"
  A -link-> B
}`;

describe('@runiq/web API', () => {
  it('parses and layouts a simple diagram', async () => {
    const ast = parseRuniq(sample);
    expect(ast.nodes.length).toBe(2);
    const layout = await layoutRuniq(ast, { direction: 'TB', spacing: 80 });
    expect(layout.nodes.length).toBe(2);
    expect(layout.edges.length).toBe(1);
    expect(layout.size.width).toBeGreaterThan(0);
    expect(layout.size.height).toBeGreaterThan(0);
  });

  it('renders SVG end-to-end', async () => {
    const result = await renderRuniqToSvg(sample, {}, { title: 'Sample' });
    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('<title id="diagram-title">Sample</title>');
  });
});
