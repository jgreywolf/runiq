import { describe, it, expect } from 'vitest';
import {
  extractCommonParams,
  extractStringParam,
  extractBooleanParam,
  extractNumberParam,
  extractArrayParam,
} from './parameters';

describe('Parameter Utilities', () => {
  describe('extractCommonParams', () => {
    it('should extract all common parameters with defaults', () => {
      const params = {
        theme: 'monochrome',
        shape: 'circle',
        useContainers: true,
        showValues: true,
        direction: 'LR',
        orientation: 'vertical',
      };

      const result = extractCommonParams(params);

      expect(result.theme).toBe('monochrome');
      expect(result.shape).toBe('circle');
      expect(result.useContainers).toBe(true);
      expect(result.showValues).toBe(true);
      expect(result.direction).toBe('LR');
      expect(result.orientation).toBe('vertical');
    });

    it('should use default values when parameters are missing', () => {
      const params = {};

      const result = extractCommonParams(params);

      expect(result.theme).toBe('colorful');
      expect(result.shape).toBe('rect');
      expect(result.useContainers).toBe(false);
      expect(result.showValues).toBe(false);
      expect(result.direction).toBe('TB');
      expect(result.orientation).toBe('horizontal');
    });

    it('should use custom defaults when provided', () => {
      const params = {};

      const result = extractCommonParams(params, {
        theme: 'vibrant',
        shape: 'rounded',
        direction: 'LR',
        orientation: 'vertical',
      });

      expect(result.theme).toBe('vibrant');
      expect(result.shape).toBe('rounded');
      expect(result.direction).toBe('LR');
      expect(result.orientation).toBe('vertical');
    });

    it('should override custom defaults when parameters are provided', () => {
      const params = {
        theme: 'warm',
        shape: 'pill',
      };

      const result = extractCommonParams(params, {
        theme: 'cool',
        shape: 'circle',
      });

      expect(result.theme).toBe('warm');
      expect(result.shape).toBe('pill');
    });
  });

  describe('extractStringParam', () => {
    it('should extract string parameter', () => {
      const params = { label: 'Test Label' };
      const result = extractStringParam(params, 'label');
      expect(result).toBe('Test Label');
    });

    it('should return default when parameter is missing', () => {
      const params = {};
      const result = extractStringParam(params, 'label', 'Default');
      expect(result).toBe('Default');
    });

    it('should return undefined when parameter is missing and no default', () => {
      const params = {};
      const result = extractStringParam(params, 'label');
      expect(result).toBeUndefined();
    });
  });

  describe('extractBooleanParam', () => {
    it('should extract boolean parameter true', () => {
      const params = { enabled: true };
      const result = extractBooleanParam(params, 'enabled');
      expect(result).toBe(true);
    });

    it('should extract boolean parameter false', () => {
      const params = { enabled: false };
      const result = extractBooleanParam(params, 'enabled');
      expect(result).toBe(false);
    });

    it('should return default false when parameter is missing', () => {
      const params = {};
      const result = extractBooleanParam(params, 'enabled');
      expect(result).toBe(false);
    });

    it('should return custom default when parameter is missing', () => {
      const params = {};
      const result = extractBooleanParam(params, 'enabled', true);
      expect(result).toBe(true);
    });
  });

  describe('extractNumberParam', () => {
    it('should extract number parameter', () => {
      const params = { count: 42 };
      const result = extractNumberParam(params, 'count');
      expect(result).toBe(42);
    });

    it('should return default when parameter is missing', () => {
      const params = {};
      const result = extractNumberParam(params, 'count', 10);
      expect(result).toBe(10);
    });

    it('should return undefined when parameter is missing and no default', () => {
      const params = {};
      const result = extractNumberParam(params, 'count');
      expect(result).toBeUndefined();
    });

    it('should extract zero', () => {
      const params = { count: 0 };
      const result = extractNumberParam(params, 'count', 10);
      expect(result).toBe(0);
    });
  });

  describe('extractArrayParam', () => {
    it('should extract array parameter', () => {
      const params = { items: ['a', 'b', 'c'] };
      const result = extractArrayParam<string>(params, 'items');
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should return undefined when parameter is missing', () => {
      const params = {};
      const result = extractArrayParam(params, 'items');
      expect(result).toBeUndefined();
    });

    it('should extract empty array', () => {
      const params = { items: [] };
      const result = extractArrayParam(params, 'items');
      expect(result).toEqual([]);
    });

    it('should work with typed arrays', () => {
      const params = { numbers: [1, 2, 3] };
      const result = extractArrayParam<number>(params, 'numbers');
      expect(result).toEqual([1, 2, 3]);
    });
  });
});
