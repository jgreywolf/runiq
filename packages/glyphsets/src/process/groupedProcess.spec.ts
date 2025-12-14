import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { groupedProcessGlyphSet } from './groupedProcess.js';

describe('groupedProcess', () => {
  it('should have correct metadata', () => {
    expect(groupedProcessGlyphSet.id).toBe('groupedProcess');
    expect(groupedProcessGlyphSet.name).toBe('Grouped Process');
    expect(groupedProcessGlyphSet.category).toBe('process');
    expect(groupedProcessGlyphSet.description).toContain('Parallel');
  });

  it('should have required parameters', () => {
    expect(groupedProcessGlyphSet.parameters).toBeDefined();
    const paramNames = groupedProcessGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('groups');
  });

  it('should have min/max items', () => {
    expect(groupedProcessGlyphSet.minItems).toBe(2);
    expect(groupedProcessGlyphSet.maxItems).toBe(4);
  });

  it('should generate grouped process', () => {
    const result = groupedProcessGlyphSet.generator({
      groups: [
        { name: 'Design', items: ['Wireframes', 'Prototypes'] },
        { name: 'Engineering', items: ['Backend', 'Frontend'] },
      ],
      mergePoint: 'Launch',
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should handle multiple groups', () => {
    const result = groupedProcessGlyphSet.generator({
      groups: [
        { name: 'Group A', items: ['A1', 'A2'] },
        { name: 'Group B', items: ['B1'] },
        { name: 'Group C', items: ['C1', 'C2', 'C3'] },
      ],
      mergePoint: 'Merge',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply mergePoint parameter', () => {
    const result = groupedProcessGlyphSet.generator({
      groups: [
        { name: 'A', items: ['A1'] },
        { name: 'B', items: ['B1'] },
      ],
      mergePoint: 'Final Stage',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few groups', () => {
    expect(() =>
      groupedProcessGlyphSet.generator({
        groups: [{ name: 'Only One', items: ['Item'] }],
        mergePoint: 'End',
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many groups', () => {
    expect(() =>
      groupedProcessGlyphSet.generator({
        groups: Array(7)
          .fill(null)
          .map((_, i) => ({ name: `Group ${i}`, items: ['Item'] })),
        mergePoint: 'End',
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default mergePoint if not provided', () => {
    const result = groupedProcessGlyphSet.generator({
      groups: [
        { name: 'A', items: ['A1'] },
        { name: 'B', items: ['B1'] },
      ],
    });

    expect(result.nodes).toBeDefined();
  });
});
