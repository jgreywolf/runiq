import { describe, expect, it } from 'vitest';
import { cycleGlyphSet } from './cycle';

describe('Cycle', () => {
  it('generates circular process with cycle back', () => {
    const result = cycleGlyphSet.generator({
      steps: ['Plan', 'Do', 'Check', 'Act'],
    });

    // Cycle glyphset creates a single node with cycle shape
    expect(result.nodes).toHaveLength(1);
    expect(result.nodes?.[0].shape).toBe('cycle');
    expect(result.nodes?.[0].data).toHaveProperty('steps');
  });

  it('requires minimum 3 steps for meaningful cycle', () => {
    expect(() => {
      cycleGlyphSet.generator({ steps: ['A', 'B'] });
    }).toThrow('at least 3 steps');
  });

  it('handles 8 steps (max)', () => {
    const steps = Array.from({ length: 8 }, (_, i) => `item ${i + 1}`);
    const result = cycleGlyphSet.generator({ steps });

    expect(result.nodes).toHaveLength(1);
    expect(result.nodes?.[0].data).toHaveProperty('steps');
  });
});
