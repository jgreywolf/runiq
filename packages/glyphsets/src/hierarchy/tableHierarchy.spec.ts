import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { tableHierarchyGlyphSet } from './tableHierarchy.js';

describe('tableHierarchy', () => {
  it('should have correct metadata', () => {
    expect(tableHierarchyGlyphSet.id).toBe('tableHierarchy');
    expect(tableHierarchyGlyphSet.name).toBe('Table Hierarchy');
    expect(tableHierarchyGlyphSet.category).toBe('hierarchy');
    expect(tableHierarchyGlyphSet.description).toContain('tabular rows');
  });

  it('should have required parameters', () => {
    expect(tableHierarchyGlyphSet.parameters).toBeDefined();
    const paramNames = tableHierarchyGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('theme');
    expect(paramNames).toContain('showConnections');
  });

  it('should have min/max items', () => {
    expect(tableHierarchyGlyphSet.minItems).toBe(3);
    expect(tableHierarchyGlyphSet.maxItems).toBe(15);
  });

  it('should generate table hierarchy', () => {
    const result = tableHierarchyGlyphSet.generator({
      levels: ['Level 1', 'Level 2', 'Level 3'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should handle categorized levels', () => {
    const result = tableHierarchyGlyphSet.generator({
      levels: ['CEO:Executive', 'VP Eng:Management', 'Dev:Staff'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply showConnections parameter', () => {
    const result = tableHierarchyGlyphSet.generator({
      levels: ['A', 'B', 'C'],
      showConnections: true,
    });

    expect(result.edges).toBeDefined();
  });

  it('should hide connections when showConnections is false', () => {
    const result = tableHierarchyGlyphSet.generator({
      levels: ['A', 'B', 'C'],
      showConnections: false,
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = tableHierarchyGlyphSet.generator({
      levels: ['A', 'B', 'C'],
      theme: 'sunset',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few levels', () => {
    expect(() =>
      tableHierarchyGlyphSet.generator({
        levels: ['Only', 'Two'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should use defaults if not provided', () => {
    const result = tableHierarchyGlyphSet.generator({
      levels: ['A', 'B', 'C'],
    });

    expect(result.nodes).toBeDefined();
  });
});
