import { describe, it, expect } from 'vitest';
import {
  validateArrayParameter,
  validateStringParameter,
  validateBooleanParameter,
  validateNumberParameter,
  validateRequired,
} from './validation';
import { GlyphSetError } from '../types';

describe('Validation Utilities', () => {
  describe('validateArrayParameter', () => {
    it('should accept valid array', () => {
      const value = ['a', 'b', 'c'];
      expect(() =>
        validateArrayParameter('testGlyphset', 'items', value)
      ).not.toThrow();
    });

    it('should throw if not an array', () => {
      expect(() =>
        validateArrayParameter('testGlyphset', 'items', 'not-array')
      ).toThrow(GlyphSetError);
    });

    it('should throw if undefined', () => {
      expect(() =>
        validateArrayParameter('testGlyphset', 'items', undefined)
      ).toThrow(GlyphSetError);
    });

    it('should throw if empty by default', () => {
      expect(() => validateArrayParameter('testGlyphset', 'items', [])).toThrow(
        GlyphSetError
      );
    });

    it('should allow empty if allowEmpty is true', () => {
      expect(() =>
        validateArrayParameter('testGlyphset', 'items', [], {
          allowEmpty: true,
        })
      ).not.toThrow();
    });

    it('should validate minItems', () => {
      expect(() =>
        validateArrayParameter('testGlyphset', 'items', ['a'], { minItems: 2 })
      ).toThrow(GlyphSetError);

      expect(() =>
        validateArrayParameter('testGlyphset', 'items', ['a', 'b'], {
          minItems: 2,
        })
      ).not.toThrow();
    });

    it('should validate maxItems', () => {
      expect(() =>
        validateArrayParameter('testGlyphset', 'items', ['a', 'b', 'c'], {
          maxItems: 2,
        })
      ).toThrow(GlyphSetError);

      expect(() =>
        validateArrayParameter('testGlyphset', 'items', ['a', 'b'], {
          maxItems: 2,
        })
      ).not.toThrow();
    });

    it('should validate itemType string', () => {
      expect(() =>
        validateArrayParameter('testGlyphset', 'items', ['a', 'b'], {
          itemType: 'string',
        })
      ).not.toThrow();

      expect(() =>
        validateArrayParameter('testGlyphset', 'items', ['a', 123], {
          itemType: 'string',
        })
      ).toThrow(GlyphSetError);
    });
  });

  describe('validateStringParameter', () => {
    it('should accept valid string', () => {
      expect(() =>
        validateStringParameter('testGlyphset', 'theme', 'colorful')
      ).not.toThrow();
    });

    it('should throw if not a string', () => {
      expect(() =>
        validateStringParameter('testGlyphset', 'theme', 123)
      ).toThrow(GlyphSetError);
    });

    it('should validate allowed values', () => {
      expect(() =>
        validateStringParameter('testGlyphset', 'theme', 'colorful', [
          'colorful',
          'monochrome',
        ])
      ).not.toThrow();

      expect(() =>
        validateStringParameter('testGlyphset', 'theme', 'invalid', [
          'colorful',
          'monochrome',
        ])
      ).toThrow(GlyphSetError);
    });
  });

  describe('validateBooleanParameter', () => {
    it('should accept true', () => {
      expect(() =>
        validateBooleanParameter('testGlyphset', 'showValues', true)
      ).not.toThrow();
    });

    it('should accept false', () => {
      expect(() =>
        validateBooleanParameter('testGlyphset', 'showValues', false)
      ).not.toThrow();
    });

    it('should throw if not a boolean', () => {
      expect(() =>
        validateBooleanParameter('testGlyphset', 'showValues', 'true')
      ).toThrow(GlyphSetError);
    });
  });

  describe('validateNumberParameter', () => {
    it('should accept valid number', () => {
      expect(() =>
        validateNumberParameter('testGlyphset', 'columns', 3)
      ).not.toThrow();
    });

    it('should throw if not a number', () => {
      expect(() =>
        validateNumberParameter('testGlyphset', 'columns', '3')
      ).toThrow(GlyphSetError);
    });

    it('should throw if NaN', () => {
      expect(() =>
        validateNumberParameter('testGlyphset', 'columns', NaN)
      ).toThrow(GlyphSetError);
    });

    it('should validate min constraint', () => {
      expect(() =>
        validateNumberParameter('testGlyphset', 'columns', 1, { min: 2 })
      ).toThrow(GlyphSetError);

      expect(() =>
        validateNumberParameter('testGlyphset', 'columns', 2, { min: 2 })
      ).not.toThrow();
    });

    it('should validate max constraint', () => {
      expect(() =>
        validateNumberParameter('testGlyphset', 'columns', 5, { max: 4 })
      ).toThrow(GlyphSetError);

      expect(() =>
        validateNumberParameter('testGlyphset', 'columns', 4, { max: 4 })
      ).not.toThrow();
    });
  });

  describe('validateRequired', () => {
    it('should accept non-null values', () => {
      expect(() =>
        validateRequired('testGlyphset', 'items', ['a'])
      ).not.toThrow();
      expect(() => validateRequired('testGlyphset', 'items', 0)).not.toThrow();
      expect(() =>
        validateRequired('testGlyphset', 'items', false)
      ).not.toThrow();
    });

    it('should throw if undefined', () => {
      expect(() =>
        validateRequired('testGlyphset', 'items', undefined)
      ).toThrow(GlyphSetError);
    });

    it('should throw if null', () => {
      expect(() => validateRequired('testGlyphset', 'items', null)).toThrow(
        GlyphSetError
      );
    });
  });
});
