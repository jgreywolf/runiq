import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { gearCycleGlyphSet } from './gearCycle.js';

describe('gearCycle', () => {
  it('should have correct metadata', () => {
    expect(gearCycleGlyphSet.id).toBe('gearCycle');
    expect(gearCycleGlyphSet.name).toBe('Gear Cycle');
    expect(gearCycleGlyphSet.category).toBe('process');
    expect(gearCycleGlyphSet.description).toContain('Interlocking gears');
  });

  it('should have required parameters', () => {
    expect(gearCycleGlyphSet.parameters).toBeDefined();
    const paramNames = gearCycleGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(gearCycleGlyphSet.minItems).toBe(2);
    expect(gearCycleGlyphSet.maxItems).toBe(6);
  });

  it('should generate gear cycle', () => {
    const result = gearCycleGlyphSet.generator({
      items: ['Design', 'Production'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should generate multiple gears', () => {
    const result = gearCycleGlyphSet.generator({
      items: ['Design', 'Production', 'Quality', 'Delivery'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = gearCycleGlyphSet.generator({
      items: ['A', 'B'],
      theme: 'cool',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      gearCycleGlyphSet.generator({
        items: ['Only One'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      gearCycleGlyphSet.generator({
        items: Array(7).fill('Gear'),
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default theme if not provided', () => {
    const result = gearCycleGlyphSet.generator({
      items: ['A', 'B'],
    });

    expect(result.nodes).toBeDefined();
  });
});
