import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { numberedChevronListGlyphSet } from './numberedChevronList.js';

describe('numberedChevronList', () => {
  it('should have correct metadata', () => {
    expect(numberedChevronListGlyphSet.id).toBe('numberedChevronList');
    expect(numberedChevronListGlyphSet.name).toBe('Numbered Chevron List');
    expect(numberedChevronListGlyphSet.category).toBe('list');
    expect(numberedChevronListGlyphSet.description).toContain('numbered');
  });

  it('should have required parameters', () => {
    expect(numberedChevronListGlyphSet.parameters).toBeDefined();
    const paramNames = numberedChevronListGlyphSet.parameters.map(
      (p) => p.name
    );
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('colorScheme');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(numberedChevronListGlyphSet.minItems).toBe(2);
    expect(numberedChevronListGlyphSet.maxItems).toBe(8);
  });

  it('should generate numbered chevron list', () => {
    const result = numberedChevronListGlyphSet.generator({
      items: ['Step 1', 'Step 2'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should apply colorScheme parameter', () => {
    const result = numberedChevronListGlyphSet.generator({
      items: ['A', 'B'],
      colorScheme: 'single',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should support multi color scheme', () => {
    const result = numberedChevronListGlyphSet.generator({
      items: ['A', 'B', 'C'],
      colorScheme: 'multi',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = numberedChevronListGlyphSet.generator({
      items: ['A', 'B'],
      theme: 'professional',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      numberedChevronListGlyphSet.generator({
        items: ['Only One'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      numberedChevronListGlyphSet.generator({
        items: Array(9).fill('Item'),
      })
    ).toThrow(GlyphSetError);
  });

  it('should use defaults if not provided', () => {
    const result = numberedChevronListGlyphSet.generator({
      items: ['A', 'B'],
    });

    expect(result.nodes).toBeDefined();
  });
});
