import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { basicListGlyphSet } from './basicList.js';

describe('basicList', () => {
  it('should have correct metadata', () => {
    expect(basicListGlyphSet.id).toBe('basicList');
    expect(basicListGlyphSet.name).toBe('Basic List');
    expect(basicListGlyphSet.category).toBe('list');
    expect(basicListGlyphSet.description).toContain('Vertical list');
  });

  it('should have required parameters', () => {
    expect(basicListGlyphSet.parameters).toBeDefined();
    const paramNames = basicListGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(basicListGlyphSet.minItems).toBe(2);
    expect(basicListGlyphSet.maxItems).toBe(10);
  });

  it('should generate basic list', () => {
    const result = basicListGlyphSet.generator({
      items: ['Feature 1', 'Feature 2'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should generate list with multiple items', () => {
    const result = basicListGlyphSet.generator({
      items: ['A', 'B', 'C', 'D', 'E'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = basicListGlyphSet.generator({
      items: ['Item 1', 'Item 2'],
      theme: 'forest',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      basicListGlyphSet.generator({
        items: ['Only One'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      basicListGlyphSet.generator({
        items: Array(11).fill('Item'),
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default theme if not provided', () => {
    const result = basicListGlyphSet.generator({
      items: ['A', 'B'],
    });

    expect(result.nodes).toBeDefined();
  });
});
