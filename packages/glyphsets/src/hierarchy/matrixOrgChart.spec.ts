import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { matrixOrgChartGlyphSet } from './matrixOrgChart.js';

describe('matrixOrgChart', () => {
  it('should have correct metadata', () => {
    expect(matrixOrgChartGlyphSet.id).toBe('matrixOrgChart');
    expect(matrixOrgChartGlyphSet.name).toBe('Matrix Organization Chart');
    expect(matrixOrgChartGlyphSet.category).toBe('hierarchy');
    expect(matrixOrgChartGlyphSet.description).toContain('dual reporting');
  });

  it('should have required parameters', () => {
    expect(matrixOrgChartGlyphSet.parameters).toBeDefined();
    const paramNames = matrixOrgChartGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('structure');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(matrixOrgChartGlyphSet.minItems).toBe(3);
    expect(matrixOrgChartGlyphSet.maxItems).toBe(40);
  });

  it('should generate matrix org chart', () => {
    const result = matrixOrgChartGlyphSet.generator({
      structure: {
        ceo: 'CEO',
        functional: [
          { name: 'VP Eng', reports: ['Dev Lead'] },
          { name: 'VP Product', reports: ['PM'] },
        ],
        projects: [{ name: 'Project A', team: ['Dev Lead', 'PM'] }],
      },
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.nodes.length).toBe(1);
    expect(result.nodes[0].shape).toBe('matrixOrgChart');
  });

  it('should handle complex matrix structure', () => {
    const result = matrixOrgChartGlyphSet.generator({
      structure: {
        ceo: 'CEO',
        functional: [
          { name: 'Engineering', reports: ['Dev 1', 'Dev 2'] },
          { name: 'Product', reports: ['PM 1', 'PM 2'] },
        ],
        projects: [
          { name: 'Project Alpha', team: ['Dev 1', 'PM 1'] },
          { name: 'Project Beta', team: ['Dev 2', 'PM 2'] },
        ],
      },
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = matrixOrgChartGlyphSet.generator({
      structure: {
        ceo: 'CEO',
        functional: [{ name: 'VP', reports: ['Lead'] }],
        projects: [{ name: 'Project', team: ['Lead'] }],
      },
      theme: 'ocean',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with invalid structure', () => {
    expect(() =>
      matrixOrgChartGlyphSet.generator({
        structure: {},
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default theme if not provided', () => {
    const result = matrixOrgChartGlyphSet.generator({
      structure: {
        ceo: 'CEO',
        functional: [{ name: 'VP', reports: ['Lead'] }],
        projects: [{ name: 'Project', team: ['Lead'] }],
      },
    });

    expect(result.nodes).toBeDefined();
  });
});
