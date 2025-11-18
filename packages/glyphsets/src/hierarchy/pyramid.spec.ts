import { describe, it, expect } from 'vitest';
import { pyramidGlyphSet } from './pyramid.js';

describe('Pyramid', () => {
  it('generates hierarchical pyramid', () => {
    const result = pyramidGlyphSet.generator({
      levels: ['Top', 'Middle', 'Bottom'],
    });

    expect(result.direction).toBe('TB');
    // Pyramid glyphset creates a single node with pyramid shape
    expect(result.nodes).toHaveLength(1);
    expect(result.nodes?.[0].shape).toBe('pyramid');
    expect(result.edges).toHaveLength(0); // No edges - self-contained shape
  });

  it('respects showValues parameter', () => {
    const result = pyramidGlyphSet.generator({
      levels: ['Level 1', 'Level 2', 'Level 3'],
      showValues: true,
    });

    expect(result.nodes?.[0].data).toHaveProperty('showValues', true);
  });

  it('validates minimum levels', () => {
    expect(() => {
      pyramidGlyphSet.generator({ levels: ['Only', 'Two'] });
    }).toThrow('at least 3 levels');
  });
});
