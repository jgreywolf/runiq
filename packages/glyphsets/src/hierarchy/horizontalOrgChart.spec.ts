import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { horizontalOrgChartGlyphSet } from './horizontalOrgChart.js';

describe('horizontalOrgChart', () => {
  it('should have correct metadata', () => {
    expect(horizontalOrgChartGlyphSet.id).toBe('horizontalOrgChart');
    expect(horizontalOrgChartGlyphSet.name).toBe(
      'Horizontal Organization Chart'
    );
    expect(horizontalOrgChartGlyphSet.category).toBe('hierarchy');
    expect(horizontalOrgChartGlyphSet.description).toContain('left-to-right');
  });

  it('should have required parameters', () => {
    expect(horizontalOrgChartGlyphSet.parameters).toBeDefined();
    const paramNames = horizontalOrgChartGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('structure');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(horizontalOrgChartGlyphSet.minItems).toBe(2);
    expect(horizontalOrgChartGlyphSet.maxItems).toBe(50);
  });

  it('should generate org chart with structure', () => {
    const result = horizontalOrgChartGlyphSet.generator({
      structure: {
        name: 'CEO',
        reports: [
          { name: 'CTO', reports: [] },
          { name: 'CFO', reports: [] },
        ],
      },
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.nodes.length).toBe(1);
    expect(result.nodes[0].shape).toBe('horizontalOrgChart');
  });

  it('should handle nested reporting structure', () => {
    const result = horizontalOrgChartGlyphSet.generator({
      structure: {
        name: 'VP Eng',
        reports: [
          {
            name: 'Engineering Manager',
            reports: [{ name: 'Dev 1' }, { name: 'Dev 2' }],
          },
        ],
      },
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = horizontalOrgChartGlyphSet.generator({
      structure: { name: 'CEO', reports: [{ name: 'CTO' }] },
      theme: 'vibrant',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with invalid structure', () => {
    expect(() =>
      horizontalOrgChartGlyphSet.generator({
        structure: {},
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default theme if not provided', () => {
    const result = horizontalOrgChartGlyphSet.generator({
      structure: { name: 'CEO', reports: [{ name: 'CTO' }] },
    });

    expect(result.nodes).toBeDefined();
  });
});
