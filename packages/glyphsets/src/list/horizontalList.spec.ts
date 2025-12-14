import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { horizontalListGlyphSet } from './horizontalList.js';

describe('horizontalList', () => {
  it('should have correct metadata', () => {
    expect(horizontalListGlyphSet.id).toBe('horizontalList');
    expect(horizontalListGlyphSet.name).toBe('Horizontal List');
    expect(horizontalListGlyphSet.category).toBe('list');
    expect(horizontalListGlyphSet.description).toContain('left-to-right');
  });

  it('should have required parameters', () => {
    expect(horizontalListGlyphSet.parameters).toBeDefined();
    const paramNames = horizontalListGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(horizontalListGlyphSet.minItems).toBe(2);
    expect(horizontalListGlyphSet.maxItems).toBe(10);
  });

  it('should generate horizontal list', () => {
    const result = horizontalListGlyphSet.generator({
      items: ['Phase 1', 'Phase 2'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should generate list with multiple items', () => {
    const result = horizontalListGlyphSet.generator({
      items: ['A', 'B', 'C', 'D'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = horizontalListGlyphSet.generator({
      items: ['Item 1', 'Item 2'],
      theme: 'warm',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      horizontalListGlyphSet.generator({
        items: ['Only One'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      horizontalListGlyphSet.generator({
        items: Array(11).fill('Item'),
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default theme if not provided', () => {
    const result = horizontalListGlyphSet.generator({
      items: ['A', 'B'],
    });

    expect(result.nodes).toBeDefined();
  });
});
