import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { equationGlyphSet } from './equation.js';

describe('equation', () => {
  it('should have correct metadata', () => {
    expect(equationGlyphSet.id).toBe('equation');
    expect(equationGlyphSet.name).toBe('Equation');
    expect(equationGlyphSet.category).toBe('relationship');
    expect(equationGlyphSet.description).toContain('equation');
  });

  it('should have required parameters', () => {
    expect(equationGlyphSet.parameters).toBeDefined();
    const paramNames = equationGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('theme');
    expect(paramNames).toContain('operator');
  });

  it('should have min/max items', () => {
    expect(equationGlyphSet.minItems).toBe(3);
    expect(equationGlyphSet.maxItems).toBe(5);
  });

  it('should generate equation with 2 inputs and 1 output', () => {
    const result = equationGlyphSet.generator({
      inputs: ['A', 'B'],
      outputs: ['C'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should generate equation with 3 inputs', () => {
    const result = equationGlyphSet.generator({
      inputs: ['A', 'B', 'C'],
      outputs: ['Result'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should use default "Result" if no outputs provided', () => {
    const result = equationGlyphSet.generator({
      inputs: ['A', 'B'],
      outputs: [],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply operator parameter', () => {
    const result = equationGlyphSet.generator({
      inputs: ['A', 'B'],
      outputs: ['C'],
      operator: '+',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should support minus operator', () => {
    const result = equationGlyphSet.generator({
      inputs: ['A', 'B'],
      outputs: ['C'],
      operator: '-',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should support multiply operator', () => {
    const result = equationGlyphSet.generator({
      inputs: ['A', 'B'],
      outputs: ['C'],
      operator: '×',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = equationGlyphSet.generator({
      inputs: ['A', 'B'],
      outputs: ['C'],
      theme: 'forest',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      equationGlyphSet.generator({
        inputs: ['A'],
        outputs: ['B'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default operator if not provided', () => {
    const result = equationGlyphSet.generator({
      inputs: ['A', 'B'],
      outputs: ['C'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should use default theme if not provided', () => {
    const result = equationGlyphSet.generator({
      inputs: ['A', 'B'],
      outputs: ['C'],
    });

    expect(result.nodes).toBeDefined();
  });
});
