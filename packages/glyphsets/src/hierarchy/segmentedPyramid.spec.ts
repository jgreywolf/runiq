import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { segmentedPyramidGlyphSet } from './segmentedPyramid.js';

describe('segmentedPyramid', () => {
  it('should have correct metadata', () => {
    expect(segmentedPyramidGlyphSet.id).toBe('segmentedPyramid');
    expect(segmentedPyramidGlyphSet.name).toBe('Segmented Pyramid');
    expect(segmentedPyramidGlyphSet.category).toBe('hierarchy');
    expect(segmentedPyramidGlyphSet.description).toContain('subdivided');
  });

  it('should have required parameters', () => {
    expect(segmentedPyramidGlyphSet.parameters).toBeDefined();
    const paramNames = segmentedPyramidGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('levels');
  });

  it('should have min/max items', () => {
    expect(segmentedPyramidGlyphSet.minItems).toBe(3);
    expect(segmentedPyramidGlyphSet.maxItems).toBe(6);
  });

  it('should generate segmented pyramid', () => {
    const result = segmentedPyramidGlyphSet.generator({
      levels: [
        { label: 'Executive', items: ['CEO'] },
        { label: 'Management', items: ['VP Eng', 'VP Product'] },
        { label: 'Staff', items: ['Team A', 'Team B', 'Team C'] },
      ],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should handle multiple segments per level', () => {
    const result = segmentedPyramidGlyphSet.generator({
      levels: [
        { label: 'Vision', items: ['Mission', 'Goals'] },
        { label: 'Strategy', items: ['Marketing', 'Sales', 'Product'] },
        { label: 'Tactics', items: ['A', 'B', 'C', 'D'] },
      ],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few levels', () => {
    expect(() =>
      segmentedPyramidGlyphSet.generator({
        levels: [
          { label: 'L1', items: ['A'] },
          { label: 'L2', items: ['B'] },
        ],
      })
    ).toThrow(GlyphSetError);
  });

  it('should handle levels properly', () => {
    const result = segmentedPyramidGlyphSet.generator({
      levels: [
        { label: 'L1', items: ['A'] },
        { label: 'L2', items: ['B', 'C'] },
        { label: 'L3', items: ['D'] },
      ],
    });

    expect(result.nodes).toBeDefined();
  });
});
