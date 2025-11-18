import { describe, it, expect } from 'vitest';
import { vennGlyphSet } from './venn';

describe('Venn', () => {
  it('generates 2-circle venn diagram', () => {
    const result = vennGlyphSet.generator({
      circles: ['Set A', 'Set B'],
    });

    // Venn glyphset creates a single node with venn shape
    expect(result.nodes?.length).toBe(1);
    expect(result.nodes?.[0].shape).toBe('venn');
    expect(result.nodes?.[0].data).toHaveProperty('labels');
  });

  it('generates 3-circle venn diagram', () => {
    const result = vennGlyphSet.generator({
      circles: ['Essential', 'Valuable', 'Delightful'],
    });

    expect(result.nodes?.length).toBe(1);
    expect(result.nodes?.[0].shape).toBe('venn');
  });

  it('generates 4-circle venn diagram', () => {
    const result = vennGlyphSet.generator({
      circles: ['A', 'B', 'C', 'D'],
    });

    expect(result.nodes?.length).toBe(1);
    expect(result.nodes?.[0].data).toHaveProperty('labels');
  });

  it('validates circle count', () => {
    expect(() => {
      vennGlyphSet.generator({ circles: ['Only One'] });
    }).toThrow('2, 3, or 4 circles');

    expect(() => {
      vennGlyphSet.generator({ circles: ['A', 'B', 'C', 'D', 'E'] });
    }).toThrow('2, 3, or 4 circles');
  });
});
