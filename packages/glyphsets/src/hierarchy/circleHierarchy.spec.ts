import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { circleHierarchyGlyphSet } from './circleHierarchy.js';

describe('circleHierarchy', () => {
  it('should have correct metadata', () => {
    expect(circleHierarchyGlyphSet.id).toBe('circleHierarchy');
    expect(circleHierarchyGlyphSet.name).toBe('Circle Hierarchy');
    expect(circleHierarchyGlyphSet.category).toBe('hierarchy');
    expect(circleHierarchyGlyphSet.description).toContain('concentric circles');
  });

  it('should have required parameters', () => {
    expect(circleHierarchyGlyphSet.parameters).toBeDefined();
    const paramNames = circleHierarchyGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(circleHierarchyGlyphSet.minItems).toBe(3);
    expect(circleHierarchyGlyphSet.maxItems).toBe(15);
  });

  it('should generate hierarchy with root and children', () => {
    const result = circleHierarchyGlyphSet.generator({
      roots: ['Central Concept'],
      children: ['Child A', 'Child B', 'Child C'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should throw error without root', () => {
    expect(() =>
      circleHierarchyGlyphSet.generator({
        roots: [],
        children: ['A', 'B'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too few children', () => {
    expect(() =>
      circleHierarchyGlyphSet.generator({
        roots: ['Root'],
        children: ['Only One'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should apply theme parameter', () => {
    const result = circleHierarchyGlyphSet.generator({
      roots: ['Root'],
      children: ['A', 'B'],
      theme: 'colorful',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should use default theme if not provided', () => {
    const result = circleHierarchyGlyphSet.generator({
      roots: ['Root'],
      children: ['A', 'B'],
    });

    expect(result.nodes).toBeDefined();
  });
});
