import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { orbitCycleGlyphSet } from './orbitCycle.js';

describe('orbitCycle', () => {
  it('should have correct metadata', () => {
    expect(orbitCycleGlyphSet.id).toBe('orbitCycle');
    expect(orbitCycleGlyphSet.name).toBe('Orbit Cycle');
    expect(orbitCycleGlyphSet.category).toBe('process');
    expect(orbitCycleGlyphSet.description).toContain('orbit');
  });

  it('should have required parameters', () => {
    expect(orbitCycleGlyphSet.parameters).toBeDefined();
    const paramNames = orbitCycleGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('centerLabel');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(orbitCycleGlyphSet.minItems).toBe(2);
    expect(orbitCycleGlyphSet.maxItems).toBe(9);
  });

  it('should generate orbit cycle', () => {
    const result = orbitCycleGlyphSet.generator({
      items: ['CRM', 'ERP'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should generate multiple orbiting items', () => {
    const result = orbitCycleGlyphSet.generator({
      items: ['CRM', 'ERP', 'Analytics', 'Marketing', 'Support'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply centerLabel parameter', () => {
    const result = orbitCycleGlyphSet.generator({
      items: ['A', 'B'],
      centerLabel: 'Core Platform',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = orbitCycleGlyphSet.generator({
      items: ['A', 'B'],
      theme: 'warm',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      orbitCycleGlyphSet.generator({
        items: ['Only One'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      orbitCycleGlyphSet.generator({
        items: Array(10).fill('Item'),
      })
    ).toThrow(GlyphSetError);
  });

  it('should use defaults if not provided', () => {
    const result = orbitCycleGlyphSet.generator({
      items: ['A', 'B'],
    });

    expect(result.nodes).toBeDefined();
  });
});
