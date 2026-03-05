import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { phasedProcessGlyphSet } from './phasedProcess.js';

describe('phasedProcess', () => {
  it('should have correct metadata', () => {
    expect(phasedProcessGlyphSet.id).toBe('phasedProcess');
    expect(phasedProcessGlyphSet.name).toBe('Phased Process');
    expect(phasedProcessGlyphSet.category).toBe('process');
    expect(phasedProcessGlyphSet.description).toContain('milestone');
  });

  it('should have required parameters', () => {
    expect(phasedProcessGlyphSet.parameters).toBeDefined();
    const paramNames = phasedProcessGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('direction');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(phasedProcessGlyphSet.minItems).toBe(2);
    expect(phasedProcessGlyphSet.maxItems).toBe(6);
  });

  it('should generate phased process', () => {
    const result = phasedProcessGlyphSet.generator({
      items: ['Planning', 'Execution'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should apply direction parameter', () => {
    const result = phasedProcessGlyphSet.generator({
      items: ['A', 'B'],
      direction: 'TB',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should support LR direction', () => {
    const result = phasedProcessGlyphSet.generator({
      items: ['A', 'B'],
      direction: 'LR',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = phasedProcessGlyphSet.generator({
      items: ['A', 'B'],
      theme: 'professional',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      phasedProcessGlyphSet.generator({
        items: ['Only One'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      phasedProcessGlyphSet.generator({
        items: Array(7).fill('Phase'),
      })
    ).toThrow(GlyphSetError);
  });

  it('should use defaults if not provided', () => {
    const result = phasedProcessGlyphSet.generator({
      items: ['A', 'B'],
    });

    expect(result.nodes).toBeDefined();
  });
});
