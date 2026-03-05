import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { increasingListGlyphSet } from './increasingList.js';

describe('increasingList', () => {
  it('should have correct metadata', () => {
    expect(increasingListGlyphSet.id).toBe('increasingList');
    expect(increasingListGlyphSet.name).toBe('Increasing List');
    expect(increasingListGlyphSet.category).toBe('list');
    expect(increasingListGlyphSet.description).toContain(
      'progressively larger'
    );
  });

  it('should have required parameters', () => {
    expect(increasingListGlyphSet.parameters).toBeDefined();
    const paramNames = increasingListGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('shape');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(increasingListGlyphSet.minItems).toBe(3);
    expect(increasingListGlyphSet.maxItems).toBe(6);
  });

  it('should generate increasing list', () => {
    const result = increasingListGlyphSet.generator({
      items: ['Small', 'Medium', 'Large'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should apply shape parameter', () => {
    const result = increasingListGlyphSet.generator({
      items: ['A', 'B', 'C'],
      shape: 'box',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should support circle shape', () => {
    const result = increasingListGlyphSet.generator({
      items: ['A', 'B', 'C'],
      shape: 'circle',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = increasingListGlyphSet.generator({
      items: ['A', 'B', 'C'],
      theme: 'cool',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      increasingListGlyphSet.generator({
        items: ['Only', 'Two'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      increasingListGlyphSet.generator({
        items: ['1', '2', '3', '4', '5', '6', '7', '8'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should use defaults if not provided', () => {
    const result = increasingListGlyphSet.generator({
      items: ['A', 'B', 'C'],
    });

    expect(result.nodes).toBeDefined();
  });
});
