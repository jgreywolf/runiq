import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { invertedPyramidGlyphSet } from './invertedPyramid.js';

describe('invertedPyramid', () => {
  it('should have correct metadata', () => {
    expect(invertedPyramidGlyphSet.id).toBe('invertedPyramid');
    expect(invertedPyramidGlyphSet.name).toBe('Inverted Pyramid');
    expect(invertedPyramidGlyphSet.category).toBe('hierarchy');
    expect(invertedPyramidGlyphSet.description).toContain(
      'Upside-down pyramid'
    );
  });

  it('should have required parameters', () => {
    expect(invertedPyramidGlyphSet.parameters).toBeDefined();
    const paramNames = invertedPyramidGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('levels');
    expect(paramNames).toContain('showValues');
  });

  it('should have min/max items', () => {
    expect(invertedPyramidGlyphSet.minItems).toBe(3);
    expect(invertedPyramidGlyphSet.maxItems).toBe(8);
  });

  it('should generate inverted pyramid with 3 levels', () => {
    const result = invertedPyramidGlyphSet.generator({
      levels: ['Stage 1', 'Stage 2', 'Stage 3'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should generate pyramid with 5 levels', () => {
    const result = invertedPyramidGlyphSet.generator({
      levels: ['L1', 'L2', 'L3', 'L4', 'L5'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply showValues parameter', () => {
    const result = invertedPyramidGlyphSet.generator({
      levels: ['A', 'B', 'C'],
      showValues: true,
    });

    expect(result.nodes).toBeDefined();
  });

  it('should hide values when showValues is false', () => {
    const result = invertedPyramidGlyphSet.generator({
      levels: ['A', 'B', 'C'],
      showValues: false,
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few levels', () => {
    expect(() =>
      invertedPyramidGlyphSet.generator({
        levels: ['Only', 'Two'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many levels', () => {
    expect(() =>
      invertedPyramidGlyphSet.generator({
        levels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default showValues if not provided', () => {
    const result = invertedPyramidGlyphSet.generator({
      levels: ['A', 'B', 'C'],
    });

    expect(result.nodes).toBeDefined();
  });
});
