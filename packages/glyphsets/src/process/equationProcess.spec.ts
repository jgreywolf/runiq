import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { equationProcessGlyphSet } from './equationProcess.js';

describe('equationProcess', () => {
  it('should have correct metadata', () => {
    expect(equationProcessGlyphSet.id).toBe('equationProcess');
    expect(equationProcessGlyphSet.name).toBe('Equation Process');
    expect(equationProcessGlyphSet.category).toBe('process');
    expect(equationProcessGlyphSet.description).toContain('Equation');
  });

  it('should have required parameters', () => {
    expect(equationProcessGlyphSet.parameters).toBeDefined();
    const paramNames = equationProcessGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('theme');
  });

  it('should have min/max items', () => {
    expect(equationProcessGlyphSet.minItems).toBe(3);
    expect(equationProcessGlyphSet.maxItems).toBe(6);
  });

  it('should generate equation process', () => {
    const result = equationProcessGlyphSet.generator({
      items: ['Input A', 'Input B', 'Result'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should handle multiple inputs', () => {
    const result = equationProcessGlyphSet.generator({
      items: ['Talent', 'Effort', 'Opportunity', 'Success'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply theme parameter', () => {
    const result = equationProcessGlyphSet.generator({
      items: ['A', 'B', 'C'],
      theme: 'ocean',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      equationProcessGlyphSet.generator({
        items: ['Only', 'Two'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      equationProcessGlyphSet.generator({
        items: Array(7).fill('Item'),
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default theme if not provided', () => {
    const result = equationProcessGlyphSet.generator({
      items: ['A', 'B', 'C'],
    });

    expect(result.nodes).toBeDefined();
  });
});
