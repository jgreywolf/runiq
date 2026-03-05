import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { columnListGlyphSet } from './columnList.js';

describe('columnList', () => {
  it('should have correct metadata', () => {
    expect(columnListGlyphSet.id).toBe('columnList');
    expect(columnListGlyphSet.name).toBe('Column List');
    expect(columnListGlyphSet.category).toBe('list');
    expect(columnListGlyphSet.description).toContain('Multi-column');
  });

  it('should have required parameters', () => {
    expect(columnListGlyphSet.parameters).toBeDefined();
    const paramNames = columnListGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('columns');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(columnListGlyphSet.minItems).toBe(4);
    expect(columnListGlyphSet.maxItems).toBe(12);
  });

  it('should generate column list', () => {
    const result = columnListGlyphSet.generator({
      items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should apply columns parameter', () => {
    const result = columnListGlyphSet.generator({
      items: ['A', 'B', 'C', 'D', 'E', 'F'],
      columns: 3,
    });

    expect(result.nodes).toBeDefined();
  });

  it('should support 2 columns', () => {
    const result = columnListGlyphSet.generator({
      items: ['A', 'B', 'C', 'D'],
      columns: 2,
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = columnListGlyphSet.generator({
      items: ['A', 'B', 'C', 'D'],
      theme: 'ocean',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      columnListGlyphSet.generator({
        items: ['Only', 'Three', 'Items'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      columnListGlyphSet.generator({
        items: Array(13).fill('Item'),
      })
    ).toThrow(GlyphSetError);
  });

  it('should use defaults if not provided', () => {
    const result = columnListGlyphSet.generator({
      items: ['A', 'B', 'C', 'D'],
    });

    expect(result.nodes).toBeDefined();
  });
});
