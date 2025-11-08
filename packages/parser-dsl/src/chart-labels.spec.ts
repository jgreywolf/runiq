import { describe, it, expect } from 'vitest';
import { parse } from './langium-parser.js';

describe('Chart Labels Property', () => {
  it('should parse radar chart with labels property', () => {
    const code = `
diagram "Radar with Labels" {
  shape skills as @radarChart 
    labels:["JavaScript","TypeScript","React","Node.js","Testing"]
    data:[85,72,90,68,78]
    showLegend:true
}
`;

    const result = parse(code);
    if (!result.success) {
      console.log('Parse errors:', result.errors);
    }
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);

    const diagram = result.diagram;
    expect(diagram).toBeDefined();
    expect(diagram?.nodes).toHaveLength(1);

    const node = diagram?.nodes[0];
    expect(node?.id).toBe('skills');
    expect(node?.shape).toBe('radarChart');
    expect(node?.data?.labels).toEqual([
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Testing',
    ]);
    expect(node?.data?.values).toEqual([85, 72, 90, 68, 78]);
    expect(node?.data?.showLegend).toBe(true);
  });

  it('should parse line chart with labels property', () => {
    const code = `
diagram "Line with Labels" {
  shape sales as @lineChart 
    labels:["Jan","Feb","Mar","Apr","May"]
    data:[45000,52000,48000,61000,58000]
}
`;

    const result = parse(code);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);

    const diagram = result.diagram;
    expect(diagram).toBeDefined();
    expect(diagram?.nodes).toHaveLength(1);

    const node = diagram?.nodes[0];
    expect(node?.id).toBe('sales');
    expect(node?.shape).toBe('lineChart');
    expect(node?.data?.labels).toEqual(['Jan', 'Feb', 'Mar', 'Apr', 'May']);
    expect(node?.data?.values).toEqual([45000, 52000, 48000, 61000, 58000]);
  });

  it('should parse chart with labels and other properties', () => {
    const code = `
diagram "Chart with Multiple Properties" {
  shape myChart as @radarChart 
    label:"Team Skills"
    labels:["JavaScript","TypeScript","React"]
    data:[85,72,90]
    colors:["#3b82f6","#ef4444","#10b981"]
    showLegend:true
}
`;

    const result = parse(code);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);

    const diagram = result.diagram;
    const node = diagram?.nodes[0];
    expect(node?.label).toBe('Team Skills');
    expect(node?.data?.labels).toEqual(['JavaScript', 'TypeScript', 'React']);
    expect(node?.data?.values).toEqual([85, 72, 90]);
    expect(node?.data?.colors).toEqual(['#3b82f6', '#ef4444', '#10b981']);
    expect(node?.data?.showLegend).toBe(true);
  });

  it('should parse chart without labels (backward compatibility)', () => {
    const code = `
diagram "Chart without Labels" {
  shape myChart as @radarChart 
    data:[85,72,90,68,78]
}
`;

    const result = parse(code);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);

    const diagram = result.diagram;
    const node = diagram?.nodes[0];
    expect(node?.data?.labels).toBeUndefined();
    expect(node?.data?.values).toEqual([85, 72, 90, 68, 78]);
  });
});
