import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { teamHierarchyGlyphSet } from './teamHierarchy.js';

describe('teamHierarchy', () => {
  it('should have correct metadata', () => {
    expect(teamHierarchyGlyphSet.id).toBe('teamHierarchy');
    expect(teamHierarchyGlyphSet.name).toBe('Team Hierarchy');
    expect(teamHierarchyGlyphSet.category).toBe('hierarchy');
    expect(teamHierarchyGlyphSet.description).toContain('teams');
  });

  it('should have required parameters', () => {
    expect(teamHierarchyGlyphSet.parameters).toBeDefined();
    const paramNames = teamHierarchyGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(teamHierarchyGlyphSet.minItems).toBe(4);
    expect(teamHierarchyGlyphSet.maxItems).toBe(20);
  });

  it('should generate team hierarchy', () => {
    const result = teamHierarchyGlyphSet.generator({
      teams: ['Engineering', 'Product'],
      members: ['Dev 1', 'Dev 2', 'PM 1'],
      leaders: ['Tech Lead', 'Product Lead'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should handle multiple teams', () => {
    const result = teamHierarchyGlyphSet.generator({
      teams: ['Backend', 'Frontend', 'QA'],
      members: ['Dev A', 'Dev B', 'Dev C', 'QA Lead'],
      leaders: ['Backend Lead', 'Frontend Lead', 'QA Manager'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = teamHierarchyGlyphSet.generator({
      teams: ['Team A'],
      members: ['Member 1', 'Member 2', 'Member 3'],
      leaders: ['Leader A'],
      theme: 'cool',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with no teams', () => {
    expect(() =>
      teamHierarchyGlyphSet.generator({
        teams: [],
        members: ['A', 'B', 'C'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too few members', () => {
    expect(() =>
      teamHierarchyGlyphSet.generator({
        teams: ['Team A'],
        members: ['Only One', 'Member'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default theme if not provided', () => {
    const result = teamHierarchyGlyphSet.generator({
      teams: ['Team A'],
      members: ['M1', 'M2', 'M3'],
    });

    expect(result.nodes).toBeDefined();
  });
});
