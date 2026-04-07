import { describe, expect, it } from 'vitest';
import { parse } from '../langium-parser.js';

describe('Ring and Scatter Chart Properties', () => {
  it('should parse scatter chart with showPointLabels', () => {
    const code = `
diagram "Scatter Test" {
  shape options as @scatterChart
    label:"Cost vs Latency"
    data:[{"x":20,"y":120,"label":"A"},{"x":55,"y":60,"label":"B"}]
    showPointLabels:true
}
`;

    const result = parse(code);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);

    const node = result.diagram?.nodes[0];
    expect(node?.shape).toBe('scatterChart');
    expect(node?.data?.showPointLabels).toBe(true);
  });

  it('should parse ring chart with innerRadius', () => {
    const code = `
diagram "Ring Test" {
  shape revenue as @ringChart
    label:"Revenue Mix"
    data:[42,38,20]
    labels:["Services","Subscriptions","Support"]
    innerRadius:0.68
}
`;

    const result = parse(code);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);

    const node = result.diagram?.nodes[0];
    expect(node?.shape).toBe('ringChart');
    expect(node?.data?.innerRadius).toBe(0.68);
  });
});
