import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { interconnectedGlyphSet } from './interconnected.js';

describe('interconnected', () => {
  it('should have correct metadata', () => {
    expect(interconnectedGlyphSet.id).toBe('interconnected');
    expect(interconnectedGlyphSet.name).toBe('Interconnected');
    expect(interconnectedGlyphSet.category).toBe('relationship');
    expect(interconnectedGlyphSet.description).toContain('mesh network');
  });

  it('should have required parameters', () => {
    expect(interconnectedGlyphSet.parameters).toBeDefined();
    const paramNames = interconnectedGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('theme');
    expect(paramNames).toContain('showAllConnections');
  });

  it('should have min/max items', () => {
    expect(interconnectedGlyphSet.minItems).toBe(3);
    expect(interconnectedGlyphSet.maxItems).toBe(8);
  });

  it('should generate mesh with 3 items', () => {
    const result = interconnectedGlyphSet.generator({
      items: ['Node A', 'Node B', 'Node C'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
    expect(result.nodes.length).toBe(1);
    expect(result.nodes[0].shape).toBe('interconnected');
  });

  it('should generate mesh with 5 items', () => {
    const result = interconnectedGlyphSet.generator({
      items: ['A', 'B', 'C', 'D', 'E'],
    });

    expect(result.nodes).toBeDefined();
    expect(result.nodes.length).toBe(1);
  });

  it('should apply showAllConnections parameter', () => {
    const result = interconnectedGlyphSet.generator({
      items: ['A', 'B', 'C'],
      showAllConnections: true,
    });

    expect(result.edges).toBeDefined();
    expect(result.edges.length).toBe(0);
  });

  it('should support partial connections', () => {
    const result = interconnectedGlyphSet.generator({
      items: ['A', 'B', 'C'],
      showAllConnections: false,
    });

    expect(result.edges).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = interconnectedGlyphSet.generator({
      items: ['A', 'B', 'C'],
      theme: 'cool',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      interconnectedGlyphSet.generator({
        items: ['A', 'B'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      interconnectedGlyphSet.generator({
        items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default showAllConnections if not provided', () => {
    const result = interconnectedGlyphSet.generator({
      items: ['A', 'B', 'C'],
    });

    expect(result.edges).toBeDefined();
  });

  it('should use default theme if not provided', () => {
    const result = interconnectedGlyphSet.generator({
      items: ['A', 'B', 'C'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should handle maximum items', () => {
    const result = interconnectedGlyphSet.generator({
      items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    });

    expect(result.nodes).toBeDefined();
    expect(result.nodes.length).toBe(1);
  });
});
