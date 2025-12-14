import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { continuousBlockProcessGlyphSet } from './continuousBlockProcess.js';

describe('continuousBlockProcess', () => {
  it('should have correct metadata', () => {
    expect(continuousBlockProcessGlyphSet.id).toBe('continuousBlockProcess');
    expect(continuousBlockProcessGlyphSet.name).toBe(
      'Continuous Block Process'
    );
    expect(continuousBlockProcessGlyphSet.category).toBe('process');
    expect(continuousBlockProcessGlyphSet.description).toContain(
      'continuous flow'
    );
  });

  it('should have required parameters', () => {
    expect(continuousBlockProcessGlyphSet.parameters).toBeDefined();
    const paramNames = continuousBlockProcessGlyphSet.parameters.map(
      (p) => p.name
    );
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('direction');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(continuousBlockProcessGlyphSet.minItems).toBe(3);
    expect(continuousBlockProcessGlyphSet.maxItems).toBe(8);
  });

  it('should generate continuous block process', () => {
    const result = continuousBlockProcessGlyphSet.generator({
      items: ['Stage 1', 'Stage 2', 'Stage 3'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should apply direction parameter', () => {
    const result = continuousBlockProcessGlyphSet.generator({
      items: ['A', 'B', 'C'],
      direction: 'TB',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should support LR direction', () => {
    const result = continuousBlockProcessGlyphSet.generator({
      items: ['A', 'B', 'C'],
      direction: 'LR',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = continuousBlockProcessGlyphSet.generator({
      items: ['A', 'B', 'C'],
      theme: 'sunset',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      continuousBlockProcessGlyphSet.generator({
        items: ['Only', 'Two'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      continuousBlockProcessGlyphSet.generator({
        items: Array(9).fill('Block'),
      })
    ).toThrow(GlyphSetError);
  });

  it('should use defaults if not provided', () => {
    const result = continuousBlockProcessGlyphSet.generator({
      items: ['A', 'B', 'C'],
    });

    expect(result.nodes).toBeDefined();
  });
});
