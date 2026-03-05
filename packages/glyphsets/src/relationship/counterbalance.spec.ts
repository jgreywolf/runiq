import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { counterBalanceGlyphSet } from './counterbalance.js';

describe('counterbalance', () => {
  it('should have correct metadata', () => {
    expect(counterBalanceGlyphSet.id).toBe('counterBalance');
    expect(counterBalanceGlyphSet.name).toBe('Counterbalance');
    expect(counterBalanceGlyphSet.category).toBe('relationship');
    expect(counterBalanceGlyphSet.description).toContain('balance scale');
  });

  it('should have required parameters', () => {
    expect(counterBalanceGlyphSet.parameters).toBeDefined();
    const paramNames = counterBalanceGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('theme');
    expect(paramNames).toContain('leftWeight');
    expect(paramNames).toContain('rightWeight');
  });

  it('should have min/max items', () => {
    expect(counterBalanceGlyphSet.minItems).toBe(2);
    expect(counterBalanceGlyphSet.maxItems).toBe(2);
  });

  it('should generate balanced scale with 2 sides', () => {
    const result = counterBalanceGlyphSet.generator({
      sides: ['Left Option', 'Right Option'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should apply leftWeight parameter', () => {
    const result = counterBalanceGlyphSet.generator({
      sides: ['Heavy', 'Light'],
      leftWeight: 75,
      rightWeight: 25,
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply rightWeight parameter', () => {
    const result = counterBalanceGlyphSet.generator({
      sides: ['Light', 'Heavy'],
      leftWeight: 25,
      rightWeight: 75,
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = counterBalanceGlyphSet.generator({
      sides: ['A', 'B'],
      theme: 'warm',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few sides', () => {
    expect(() =>
      counterBalanceGlyphSet.generator({
        sides: ['Only One'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many sides', () => {
    expect(() =>
      counterBalanceGlyphSet.generator({
        sides: ['A', 'B', 'C'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default weights if not provided', () => {
    const result = counterBalanceGlyphSet.generator({
      sides: ['A', 'B'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should use default theme if not provided', () => {
    const result = counterBalanceGlyphSet.generator({
      sides: ['A', 'B'],
    });

    expect(result.nodes).toBeDefined();
  });
});
