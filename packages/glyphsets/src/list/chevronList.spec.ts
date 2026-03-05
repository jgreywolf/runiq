import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { chevronListGlyphSet } from './chevronList.js';

describe('chevronList', () => {
  it('should have correct metadata', () => {
    expect(chevronListGlyphSet.id).toBe('chevronList');
    expect(chevronListGlyphSet.name).toBe('Chevron List');
    expect(chevronListGlyphSet.category).toBe('list');
    expect(chevronListGlyphSet.description).toContain('chevron');
  });

  it('should have required parameters', () => {
    expect(chevronListGlyphSet.parameters).toBeDefined();
    const paramNames = chevronListGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('direction');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(chevronListGlyphSet.minItems).toBe(2);
    expect(chevronListGlyphSet.maxItems).toBe(8);
  });

  it('should generate chevron list', () => {
    const result = chevronListGlyphSet.generator({
      items: ['Step 1', 'Step 2'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should apply direction parameter', () => {
    const result = chevronListGlyphSet.generator({
      items: ['A', 'B'],
      direction: 'LR',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should support vertical direction', () => {
    const result = chevronListGlyphSet.generator({
      items: ['A', 'B'],
      direction: 'TB',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = chevronListGlyphSet.generator({
      items: ['A', 'B'],
      theme: 'sunset',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      chevronListGlyphSet.generator({
        items: ['Only One'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      chevronListGlyphSet.generator({
        items: Array(9).fill('Item'),
      })
    ).toThrow(GlyphSetError);
  });

  it('should use defaults if not provided', () => {
    const result = chevronListGlyphSet.generator({
      items: ['A', 'B'],
    });

    expect(result.nodes).toBeDefined();
  });
});
