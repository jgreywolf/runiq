import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { linearVennGlyphSet } from './linearVenn.js';

describe('linearVenn', () => {
  it('should have correct metadata', () => {
    expect(linearVennGlyphSet.id).toBe('linearVenn');
    expect(linearVennGlyphSet.name).toBe('Linear Venn Diagram');
    expect(linearVennGlyphSet.category).toBe('comparison');
    expect(linearVennGlyphSet.description).toContain('overlapping circles');
  });

  it('should have required parameters', () => {
    expect(linearVennGlyphSet.parameters).toBeDefined();
    const paramNames = linearVennGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('theme');
    expect(paramNames).toContain('overlap');
  });

  it('should have min/max items', () => {
    expect(linearVennGlyphSet.minItems).toBe(2);
    expect(linearVennGlyphSet.maxItems).toBe(4);
  });

  it('should generate diagram with 2 circles', () => {
    const result = linearVennGlyphSet.generator({
      circles: ['Set A', 'Set B'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.nodes.length).toBeGreaterThan(0);
  });

  it('should generate diagram with 3 circles', () => {
    const result = linearVennGlyphSet.generator({
      circles: ['Set A', 'Set B', 'Set C'],
    });

    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should generate diagram with 4 circles', () => {
    const result = linearVennGlyphSet.generator({
      circles: ['Set A', 'Set B', 'Set C', 'Set D'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few circles', () => {
    expect(() =>
      linearVennGlyphSet.generator({
        circles: ['Only One'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many circles', () => {
    expect(() =>
      linearVennGlyphSet.generator({
        circles: ['A', 'B', 'C', 'D', 'E'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should apply theme parameter', () => {
    const result = linearVennGlyphSet.generator({
      circles: ['A', 'B'],
      theme: 'colorful',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply overlap parameter', () => {
    const result = linearVennGlyphSet.generator({
      circles: ['A', 'B'],
      overlap: 0.5,
    });

    expect(result.nodes).toBeDefined();
  });

  it('should use default theme if not provided', () => {
    const result = linearVennGlyphSet.generator({
      circles: ['A', 'B'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should use default overlap if not provided', () => {
    const result = linearVennGlyphSet.generator({
      circles: ['A', 'B'],
    });

    expect(result.nodes).toBeDefined();
  });
});
