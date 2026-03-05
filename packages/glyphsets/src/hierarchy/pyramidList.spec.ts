import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { pyramidListGlyphSet } from './pyramidList.js';

describe('pyramidList', () => {
  it('should have correct metadata', () => {
    expect(pyramidListGlyphSet.id).toBe('pyramidList');
    expect(pyramidListGlyphSet.name).toBe('Pyramid List');
    expect(pyramidListGlyphSet.category).toBe('hierarchy');
    expect(pyramidListGlyphSet.description).toContain('pyramid');
  });

  it('should have required parameters', () => {
    expect(pyramidListGlyphSet.parameters).toBeDefined();
    const paramNames = pyramidListGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('levels');
  });

  it('should have min/max items', () => {
    expect(pyramidListGlyphSet.minItems).toBe(3);
    expect(pyramidListGlyphSet.maxItems).toBe(6);
  });

  it('should generate pyramid list with levels', () => {
    const result = pyramidListGlyphSet.generator({
      levels: [
        { label: 'Top Priority', items: ['Feature A', 'Feature B'] },
        { label: 'Medium Priority', items: ['Feature C', 'Feature D'] },
        { label: 'Low Priority', items: ['Feature E'] },
      ],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should handle varying items per level', () => {
    const result = pyramidListGlyphSet.generator({
      levels: [
        { label: 'Core', items: ['A'] },
        { label: 'Secondary', items: ['B', 'C'] },
        { label: 'Tertiary', items: ['D', 'E', 'F', 'G'] },
      ],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few levels', () => {
    expect(() =>
      pyramidListGlyphSet.generator({
        levels: [
          { label: 'L1', items: ['A'] },
          { label: 'L2', items: ['B'] },
        ],
      })
    ).toThrow(GlyphSetError);
  });

  it('should handle levels with items', () => {
    const result = pyramidListGlyphSet.generator({
      levels: [
        { label: 'L1', items: ['A'] },
        { label: 'L2', items: ['B', 'C'] },
        { label: 'L3', items: ['D'] },
      ],
    });

    expect(result.nodes).toBeDefined();
  });
});
