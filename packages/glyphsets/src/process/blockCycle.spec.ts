import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { blockCycleGlyphSet } from './blockCycle.js';

describe('blockCycle', () => {
  it('should have correct metadata', () => {
    expect(blockCycleGlyphSet.id).toBe('blockCycle');
    expect(blockCycleGlyphSet.name).toBe('Block Cycle');
    expect(blockCycleGlyphSet.category).toBe('process');
    expect(blockCycleGlyphSet.description).toContain('cyclical');
  });

  it('should have required parameters', () => {
    expect(blockCycleGlyphSet.parameters).toBeDefined();
    const paramNames = blockCycleGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(blockCycleGlyphSet.minItems).toBe(3);
    expect(blockCycleGlyphSet.maxItems).toBe(8);
  });

  it('should generate block cycle', () => {
    const result = blockCycleGlyphSet.generator({
      items: ['Plan', 'Do', 'Check'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should generate PDCA cycle', () => {
    const result = blockCycleGlyphSet.generator({
      items: ['Plan', 'Do', 'Check', 'Act'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = blockCycleGlyphSet.generator({
      items: ['A', 'B', 'C'],
      theme: 'forest',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      blockCycleGlyphSet.generator({
        items: ['Only', 'Two'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      blockCycleGlyphSet.generator({
        items: Array(9).fill('Block'),
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default theme if not provided', () => {
    const result = blockCycleGlyphSet.generator({
      items: ['A', 'B', 'C'],
    });

    expect(result.nodes).toBeDefined();
  });
});
