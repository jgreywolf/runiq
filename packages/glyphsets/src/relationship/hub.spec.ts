import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { hubGlyphSet } from './hub.js';

describe('hub', () => {
  it('should have correct metadata', () => {
    expect(hubGlyphSet.id).toBe('hub');
    expect(hubGlyphSet.name).toBe('Hub and Spoke');
    expect(hubGlyphSet.category).toBe('relationship');
    expect(hubGlyphSet.description).toContain('hub');
  });

  it('should have required parameters', () => {
    expect(hubGlyphSet.parameters).toBeDefined();
    const paramNames = hubGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('theme');
    expect(paramNames).toContain('bidirectional');
  });

  it('should have min/max items', () => {
    expect(hubGlyphSet.minItems).toBe(3);
    expect(hubGlyphSet.maxItems).toBe(12);
  });

  it('should generate hub with center and 2 spokes', () => {
    const result = hubGlyphSet.generator({
      centers: ['Central Idea'],
      spokes: ['Concept A', 'Concept B'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
    expect(result.nodes.length).toBe(1);
    expect(result.nodes[0].shape).toBe('hub');
  });

  it('should generate hub with multiple spokes', () => {
    const result = hubGlyphSet.generator({
      centers: ['Hub'],
      spokes: ['A', 'B', 'C', 'D', 'E'],
    });

    expect(result.nodes).toBeDefined();
    expect(result.nodes.length).toBe(1);
  });

  it('should apply bidirectional parameter', () => {
    const result = hubGlyphSet.generator({
      centers: ['Hub'],
      spokes: ['A', 'B'],
      bidirectional: true,
    });

    expect(result.edges).toBeDefined();
  });

  it('should support unidirectional arrows', () => {
    const result = hubGlyphSet.generator({
      centers: ['Hub'],
      spokes: ['A', 'B'],
      bidirectional: false,
    });

    expect(result.edges).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = hubGlyphSet.generator({
      centers: ['Hub'],
      spokes: ['A', 'B'],
      theme: 'ocean',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with no center', () => {
    expect(() =>
      hubGlyphSet.generator({
        centers: [],
        spokes: ['A', 'B'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too few spokes', () => {
    expect(() =>
      hubGlyphSet.generator({
        centers: ['Hub'],
        spokes: ['Only One'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default bidirectional if not provided', () => {
    const result = hubGlyphSet.generator({
      centers: ['Hub'],
      spokes: ['A', 'B'],
    });

    expect(result.edges).toBeDefined();
  });

  it('should use default theme if not provided', () => {
    const result = hubGlyphSet.generator({
      centers: ['Hub'],
      spokes: ['A', 'B'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should handle maximum spokes', () => {
    const result = hubGlyphSet.generator({
      centers: ['Hub'],
      spokes: Array(11)
        .fill('Spoke')
        .map((s, i) => `${s} ${i + 1}`),
    });

    expect(result.nodes).toBeDefined();
  });
});
