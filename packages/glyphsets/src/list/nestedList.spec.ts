import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { nestedListGlyphSet } from './nestedList.js';

describe('nestedList', () => {
  it('should have correct metadata', () => {
    expect(nestedListGlyphSet.id).toBe('nestedList');
    expect(nestedListGlyphSet.name).toBe('Nested List');
    expect(nestedListGlyphSet.category).toBe('list');
    expect(nestedListGlyphSet.description).toContain('Hierarchical');
  });

  it('should have required parameters', () => {
    expect(nestedListGlyphSet.parameters).toBeDefined();
    const paramNames = nestedListGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('levels');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(nestedListGlyphSet.minItems).toBe(2);
    expect(nestedListGlyphSet.maxItems).toBe(10);
  });

  it('should generate nested list', () => {
    const result = nestedListGlyphSet.generator({
      levels: [
        { label: 'Category 1', items: ['Item A', 'Item B'] },
        { label: 'Category 2', items: ['Item C', 'Item D'] },
      ],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should handle varying sub-items', () => {
    const result = nestedListGlyphSet.generator({
      levels: [
        { label: 'Section A', items: ['1'] },
        { label: 'Section B', items: ['2', '3', '4'] },
      ],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = nestedListGlyphSet.generator({
      levels: [
        { label: 'Cat A', items: ['A'] },
        { label: 'Cat B', items: ['B'] },
      ],
      theme: 'vibrant',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few levels', () => {
    expect(() =>
      nestedListGlyphSet.generator({
        levels: [{ label: 'Only One', items: ['A'] }],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many levels', () => {
    expect(() =>
      nestedListGlyphSet.generator({
        levels: Array(11)
          .fill(null)
          .map((_, i) => ({ label: `L${i}`, items: ['A'] })),
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default theme if not provided', () => {
    const result = nestedListGlyphSet.generator({
      levels: [
        { label: 'A', items: ['1'] },
        { label: 'B', items: ['2'] },
      ],
    });

    expect(result.nodes).toBeDefined();
  });
});
