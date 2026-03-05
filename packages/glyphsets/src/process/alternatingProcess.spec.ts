import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { alternatingProcessGlyphSet } from './alternatingProcess.js';

describe('alternatingProcess', () => {
  it('should have correct metadata', () => {
    expect(alternatingProcessGlyphSet.id).toBe('alternatingProcess');
    expect(alternatingProcessGlyphSet.name).toBe('Alternating Process');
    expect(alternatingProcessGlyphSet.category).toBe('process');
    expect(alternatingProcessGlyphSet.description).toContain('zigzag');
  });

  it('should have required parameters', () => {
    expect(alternatingProcessGlyphSet.parameters).toBeDefined();
    const paramNames = alternatingProcessGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(alternatingProcessGlyphSet.minItems).toBe(3);
    expect(alternatingProcessGlyphSet.maxItems).toBe(8);
  });

  it('should generate alternating process', () => {
    const result = alternatingProcessGlyphSet.generator({
      items: ['Step 1', 'Step 2', 'Step 3'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = alternatingProcessGlyphSet.generator({
      items: ['A', 'B', 'C'],
      theme: 'vibrant',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      alternatingProcessGlyphSet.generator({
        items: ['Only', 'Two'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      alternatingProcessGlyphSet.generator({
        items: Array(9).fill('Step'),
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default theme if not provided', () => {
    const result = alternatingProcessGlyphSet.generator({
      items: ['A', 'B', 'C'],
    });

    expect(result.nodes).toBeDefined();
  });
});
