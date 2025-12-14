import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { steppedVennGlyphSet } from './steppedVenn.js';

describe('steppedVenn', () => {
  it('should have correct metadata', () => {
    expect(steppedVennGlyphSet.id).toBe('steppedVenn');
    expect(steppedVennGlyphSet.name).toBe('Stepped Venn Diagram');
    expect(steppedVennGlyphSet.category).toBe('comparison');
    expect(steppedVennGlyphSet.description).toContain('stacked circles');
  });

  it('should have required parameters', () => {
    expect(steppedVennGlyphSet.parameters).toBeDefined();
    const paramNames = steppedVennGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(steppedVennGlyphSet.minItems).toBe(2);
    expect(steppedVennGlyphSet.maxItems).toBe(4);
  });

  it('should generate diagram with 2 circles', () => {
    const result = steppedVennGlyphSet.generator({
      circles: ['Level 1', 'Level 2'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.nodes.length).toBeGreaterThan(0);
  });

  it('should generate diagram with 3 circles', () => {
    const result = steppedVennGlyphSet.generator({
      circles: ['Level 1', 'Level 2', 'Level 3'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should generate diagram with 4 circles', () => {
    const result = steppedVennGlyphSet.generator({
      circles: ['Level 1', 'Level 2', 'Level 3', 'Level 4'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few circles', () => {
    expect(() =>
      steppedVennGlyphSet.generator({
        circles: ['Only One'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many circles', () => {
    expect(() =>
      steppedVennGlyphSet.generator({
        circles: ['A', 'B', 'C', 'D', 'E'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should apply theme parameter', () => {
    const result = steppedVennGlyphSet.generator({
      circles: ['A', 'B'],
      theme: 'vibrant',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should use default theme if not provided', () => {
    const result = steppedVennGlyphSet.generator({
      circles: ['A', 'B'],
    });

    expect(result.nodes).toBeDefined();
  });
});
