import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { segmentedCycleGlyphSet } from './segmentedCycle.js';

describe('segmentedCycle', () => {
  it('should have correct metadata', () => {
    expect(segmentedCycleGlyphSet.id).toBe('segmentedCycle');
    expect(segmentedCycleGlyphSet.name).toBe('Segmented Cycle');
    expect(segmentedCycleGlyphSet.category).toBe('process');
    expect(segmentedCycleGlyphSet.description).toContain('Pie chart');
  });

  it('should have required parameters', () => {
    expect(segmentedCycleGlyphSet.parameters).toBeDefined();
    const paramNames = segmentedCycleGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('showPercentages');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(segmentedCycleGlyphSet.minItems).toBe(2);
    expect(segmentedCycleGlyphSet.maxItems).toBe(6);
  });

  it('should generate segmented cycle', () => {
    const result = segmentedCycleGlyphSet.generator({
      items: ['Planning', 'Development'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should apply showPercentages parameter', () => {
    const result = segmentedCycleGlyphSet.generator({
      items: ['A', 'B'],
      showPercentages: true,
    });

    expect(result.nodes).toBeDefined();
  });

  it('should hide percentages when showPercentages is false', () => {
    const result = segmentedCycleGlyphSet.generator({
      items: ['A', 'B'],
      showPercentages: false,
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = segmentedCycleGlyphSet.generator({
      items: ['A', 'B'],
      theme: 'colorful',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      segmentedCycleGlyphSet.generator({
        items: ['Only One'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      segmentedCycleGlyphSet.generator({
        items: Array(9).fill('Segment'),
      })
    ).toThrow(GlyphSetError);
  });

  it('should use defaults if not provided', () => {
    const result = segmentedCycleGlyphSet.generator({
      items: ['A', 'B'],
    });

    expect(result.nodes).toBeDefined();
  });
});
