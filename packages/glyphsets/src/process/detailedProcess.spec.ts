import { describe, expect, it } from 'vitest';
import { GlyphSetError } from '../types.js';
import { detailedProcessGlyphSet } from './detailedProcess.js';

describe('detailedProcess', () => {
  it('should have correct metadata', () => {
    expect(detailedProcessGlyphSet.id).toBe('detailedProcess');
    expect(detailedProcessGlyphSet.name).toBe('Detailed Process');
    expect(detailedProcessGlyphSet.category).toBe('process');
    expect(detailedProcessGlyphSet.description).toContain('substeps');
  });

  it('should have required parameters', () => {
    expect(detailedProcessGlyphSet.parameters).toBeDefined();
    const paramNames = detailedProcessGlyphSet.parameters.map((p) => p.name);
    expect(paramNames).toContain('items');
    expect(paramNames).toContain('direction');
  });

  it('should have min/max items', () => {
    expect(detailedProcessGlyphSet.minItems).toBe(2);
    expect(detailedProcessGlyphSet.maxItems).toBe(5);
  });

  it('should generate detailed process with substeps', () => {
    const result = detailedProcessGlyphSet.generator({
      items: ['Design | Wireframes | Prototypes', 'Build | Frontend | Backend'],
    });

    expect(result.astVersion).toBe('1.0');
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
  });

  it('should handle main steps without substeps', () => {
    const result = detailedProcessGlyphSet.generator({
      items: ['Planning | Plan', 'Execution | Execute'],
    });

    expect(result.nodes).toBeDefined();
  });

  it('should apply direction parameter', () => {
    const result = detailedProcessGlyphSet.generator({
      items: ['Step A | Sub1', 'Step B | Sub2'],
      direction: 'TB',
    });

    expect(result.nodes).toBeDefined();
  });

  it('should throw error with too few items', () => {
    expect(() =>
      detailedProcessGlyphSet.generator({
        items: ['Only One'],
      })
    ).toThrow(GlyphSetError);
  });

  it('should throw error with too many items', () => {
    expect(() =>
      detailedProcessGlyphSet.generator({
        items: Array(6).fill('Step | Sub'),
      })
    ).toThrow(GlyphSetError);
  });

  it('should use default direction if not provided', () => {
    const result = detailedProcessGlyphSet.generator({
      items: ['A | A1', 'B | B1'],
    });

    expect(result.nodes).toBeDefined();
  });
});
