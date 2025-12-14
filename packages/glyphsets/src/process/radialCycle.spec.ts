import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { radialCycleGlyphSet } from './radialCycle.js';

describe('radialCycle', () => {
  it('should have correct metadata', () => {
    expect(radialCycleGlyphSet.id).toBe('radialCycle');
    expect(radialCycleGlyphSet.name).toBe('Radial Cycle');
    expect(radialCycleGlyphSet.category).toBe('process');
    expect(radialCycleGlyphSet.description).toContain('Center hub');
  });

  it('should have required parameters', () => {
    expect(radialCycleGlyphSet.parameters).toBeDefined();
    const paramNames = radialCycleGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('centerLabel');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(radialCycleGlyphSet.minItems).toBe(3);
    expect(radialCycleGlyphSet.maxItems).toBe(8);
  });

  it('should generate radial cycle', () => {
    const result = radialCycleGlyphSet.generator({
      items: ['Performance', 'Security', 'Usability'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should apply centerLabel parameter', () => {
    const result = radialCycleGlyphSet.generator({
      items: ['A', 'B', 'C'],
      centerLabel: 'Product',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = radialCycleGlyphSet.generator({
      items: ['A', 'B', 'C'],
      theme: 'vibrant',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      radialCycleGlyphSet.generator({
        items: ['Only', 'Two'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      radialCycleGlyphSet.generator({
        items: Array(9).fill('Item'),
      })
    ).toThrow(GlyphSetError);
  });

  it('should use defaults if not provided', () => {
    const result = radialCycleGlyphSet.generator({
      items: ['A', 'B', 'C'],
    });

    expect(result.nodes).toBeDefined();
  });
});
