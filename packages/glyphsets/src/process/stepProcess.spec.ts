import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { stepProcessGlyphSet } from './stepProcess.js';

describe('stepProcess', () => {
  it('should have correct metadata', () => {
    expect(stepProcessGlyphSet.id).toBe('stepProcess');
    expect(stepProcessGlyphSet.name).toBe('Step Process');
    expect(stepProcessGlyphSet.category).toBe('process');
    expect(stepProcessGlyphSet.description).toContain('staircase');
  });

  it('should have required parameters', () => {
    expect(stepProcessGlyphSet.parameters).toBeDefined();
    const paramNames = stepProcessGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('direction');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(stepProcessGlyphSet.minItems).toBe(3);
    expect(stepProcessGlyphSet.maxItems).toBe(8);
  });

  it('should generate step process', () => {
    const result = stepProcessGlyphSet.generator({
      items: ['Junior', 'Mid-Level', 'Senior'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should apply direction parameter', () => {
    const result = stepProcessGlyphSet.generator({
      items: ['A', 'B', 'C'],
      direction: 'down',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should support up direction', () => {
    const result = stepProcessGlyphSet.generator({
      items: ['A', 'B', 'C'],
      direction: 'up',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = stepProcessGlyphSet.generator({
      items: ['A', 'B', 'C'],
      theme: 'forest',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      stepProcessGlyphSet.generator({
        items: ['Only', 'Two'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      stepProcessGlyphSet.generator({
        items: Array(9).fill('Step'),
      })
    ).toThrow(GlyphSetError);
  });

  it('should use defaults if not provided', () => {
    const result = stepProcessGlyphSet.generator({
      items: ['A', 'B', 'C'],
    });

    expect(result.nodes).toBeDefined();
  });
});
