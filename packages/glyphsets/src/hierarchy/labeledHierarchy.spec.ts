import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { labeledHierarchyGlyphSet } from './labeledHierarchy.js';

describe('labeledHierarchy', () => {
  it('should have correct metadata', () => {
    expect(labeledHierarchyGlyphSet.id).toBe('labeledHierarchy');
    expect(labeledHierarchyGlyphSet.name).toBe('Labeled Hierarchy');
    expect(labeledHierarchyGlyphSet.category).toBe('hierarchy');
    expect(labeledHierarchyGlyphSet.description).toContain('labeled edges');
  });

  it('should have required parameters', () => {
    expect(labeledHierarchyGlyphSet.parameters).toBeDefined();
    const paramNames = labeledHierarchyGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(labeledHierarchyGlyphSet.minItems).toBe(3);
    expect(labeledHierarchyGlyphSet.maxItems).toBe(20);
  });

  it('should generate hierarchy with roots and children', () => {
    const result = labeledHierarchyGlyphSet.generator({
      roots: ['Root'],
      children: ['Child A', 'Child B'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should handle labeled relationships', () => {
    const result = labeledHierarchyGlyphSet.generator({
      roots: ['Parent:manages'],
      children: ['Child A:reports to', 'Child B:reports to'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = labeledHierarchyGlyphSet.generator({
      roots: ['Root'],
      children: ['A', 'B'],
      theme: 'forest',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error without roots', () => {
    expect(() =>
      labeledHierarchyGlyphSet.generator({
        roots: [],
        children: ['A', 'B'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default theme if not provided', () => {
    const result = labeledHierarchyGlyphSet.generator({
      roots: ['Root'],
      children: ['A', 'B'],
    });

    expect(result.nodes).toBeDefined();
  });
});
