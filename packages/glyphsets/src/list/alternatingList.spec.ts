import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { alternatingListGlyphSet } from './alternatingList.js';

describe('alternatingList', () => {
  it('should have correct metadata', () => {
    expect(alternatingListGlyphSet.id).toBe('alternatingList');
    expect(alternatingListGlyphSet.name).toBe('Alternating List');
    expect(alternatingListGlyphSet.category).toBe('list');
    expect(alternatingListGlyphSet.description).toContain('alternating');
  });

  it('should have required parameters', () => {
    expect(alternatingListGlyphSet.parameters).toBeDefined();
    const paramNames = alternatingListGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(alternatingListGlyphSet.minItems).toBe(3);
    expect(alternatingListGlyphSet.maxItems).toBe(8);
  });

  it('should generate alternating list', () => {
    const result = alternatingListGlyphSet.generator({
      items: ['Item 1', 'Item 2', 'Item 3'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = alternatingListGlyphSet.generator({
      items: ['A', 'B', 'C'],
      theme: 'vibrant',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      alternatingListGlyphSet.generator({
        items: ['Only', 'Two'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      alternatingListGlyphSet.generator({
        items: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default theme if not provided', () => {
    const result = alternatingListGlyphSet.generator({
      items: ['A', 'B', 'C'],
    });

    expect(result.nodes).toBeDefined();
  });
});
