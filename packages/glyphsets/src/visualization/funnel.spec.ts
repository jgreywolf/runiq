import { describe, it, expect } from 'vitest';
import { funnelGlyphSet } from './funnel';

describe('Funnel', () => {
  it('generates top-to-bottom funnel', () => {
    const result = funnelGlyphSet.generator({
      stages: ['Awareness', 'Interest', 'Decision', 'Action'],
    });

    expect(result.direction).toBe('TB');
    // Funnel glyphset creates a single node using invertedPyramid shape
    expect(result.nodes).toHaveLength(1);
    expect(result.nodes?.[0].shape).toBe('invertedPyramid');
    expect(result.edges).toHaveLength(0); // No edges - self-contained shape
  });

  it('uses invertedPyramid shape for funnel visualization', () => {
    const result = funnelGlyphSet.generator({
      stages: ['Top', 'Middle', 'Bottom'],
    });

    expect(result.nodes?.[0].shape).toBe('invertedPyramid');
  });

  it('validates minimum stages', () => {
    expect(() => {
      funnelGlyphSet.generator({ stages: ['A', 'B'] });
    }).toThrow('Inverted pyramid requires at least 3');
  });
});
