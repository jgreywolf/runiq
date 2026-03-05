import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { spiralCycleGlyphSet } from './spiralCycle.js';

describe('spiralCycle', () => {
  it('should have correct metadata', () => {
    expect(spiralCycleGlyphSet.id).toBe('spiralCycle');
    expect(spiralCycleGlyphSet.name).toBe('Spiral Cycle');
    expect(spiralCycleGlyphSet.category).toBe('process');
    expect(spiralCycleGlyphSet.description).toContain('Spiral');
  });

  it('should have required parameters', () => {
    expect(spiralCycleGlyphSet.parameters).toBeDefined();
    const paramNames = spiralCycleGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(spiralCycleGlyphSet.minItems).toBe(3);
    expect(spiralCycleGlyphSet.maxItems).toBe(8);
  });

  it('should generate spiral cycle', () => {
    const result = spiralCycleGlyphSet.generator({
      items: ['Initial', 'Managed', 'Defined'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should generate maturity model', () => {
    const result = spiralCycleGlyphSet.generator({
      items: ['Initial', 'Managed', 'Defined', 'Quantified', 'Optimizing'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = spiralCycleGlyphSet.generator({
      items: ['A', 'B', 'C'],
      theme: 'sunset',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      spiralCycleGlyphSet.generator({
        items: ['Only', 'Two'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      spiralCycleGlyphSet.generator({
        items: Array(9).fill('Stage'),
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default theme if not provided', () => {
    const result = spiralCycleGlyphSet.generator({
      items: ['A', 'B', 'C'],
    });

    expect(result.nodes).toBeDefined();
  });
});
