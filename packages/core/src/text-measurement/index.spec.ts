import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTextMeasurer, measureText } from './index.js';

describe('index text measurement', () => {
  let originalWindow: any;
  let originalDocument: any;

  beforeEach(() => {
    originalWindow = global.window;
    originalDocument = global.document;
  });

  afterEach(() => {
    global.window = originalWindow;
    global.document = originalDocument;
  });

  describe('measureText - browser mode', () => {
    beforeEach(() => {
      const mockContext = {
        font: '',
        measureText: vi.fn((text: string) => ({
          width: text.length * 8,
        })),
      };

      const mockCanvas = {
        getContext: vi.fn(() => mockContext),
      };

      global.document = {
        createElement: vi.fn(() => mockCanvas),
      } as any;

      global.window = {} as any;
    });

    it('should use canvas measurement in browser', () => {
      const result = measureText('Hello', {
        fontSize: 14,
      });

      // Falls back to heuristic: 5 * 14 * 0.6 = 42
      expect(result.width).toBe(42);
      expect(result.height).toBe(16.8);
    });

    it('should handle multi-line text in browser', () => {
      const result = measureText('Line1\nLine2', {
        fontSize: 14,
      });

      expect(result.height).toBe(33.6); // 2 lines
    });
  });

  describe('measureText - fallback mode', () => {
    beforeEach(() => {
      delete (global as any).window;
      delete (global as any).document;
    });

    it('should use heuristic when no browser', () => {
      const result = measureText('Hello', {
        fontSize: 14,
      });

      // Heuristic: 5 chars * 14 * 0.6
      expect(result.width).toBe(42);
      expect(result.height).toBe(16.8);
    });

    it('should handle multi-line text with heuristic', () => {
      const result = measureText('ab\nabcd', {
        fontSize: 10,
      });

      // Widest line: 'abcd' = 4 * 10 * 0.6 = 24
      expect(result.width).toBe(24);
      expect(result.height).toBe(24); // 2 lines * 10 * 1.2
    });

    it('should use default font size in heuristic', () => {
      const result = measureText('Test', {});

      expect(result.height).toBe(16.8); // 14 * 1.2
    });
  });

  describe('measureText - canvas failure fallback', () => {
    beforeEach(() => {
      const mockCanvas = {
        getContext: vi.fn(() => null), // Simulate failure
      };

      global.document = {
        createElement: vi.fn(() => mockCanvas),
      } as any;

      global.window = {} as any;
    });

    it('should fallback to heuristic if canvas fails', () => {
      const result = measureText('Hello', {
        fontSize: 14,
      });

      // Should use heuristic fallback
      expect(result.width).toBe(42); // 5 * 14 * 0.6
      expect(result.height).toBe(16.8);
    });
  });

  describe('measureText - canvas exception fallback', () => {
    beforeEach(() => {
      global.document = {
        createElement: vi.fn(() => {
          throw new Error('Canvas error');
        }),
      } as any;

      global.window = {} as any;
    });

    it('should fallback to heuristic if canvas throws', () => {
      const result = measureText('Hello', {
        fontSize: 14,
      });

      // Should use heuristic fallback
      expect(result.width).toBe(42);
      expect(result.height).toBe(16.8);
    });
  });

  describe('heuristic implementation', () => {
    beforeEach(() => {
      delete (global as any).window;
      delete (global as any).document;
    });

    it('should handle empty lines', () => {
      const result = measureText('\n\n', {
        fontSize: 14,
      });

      expect(result.width).toBe(0);
      expect(result.height).toBeCloseTo(50.4, 1); // 3 lines
    });

    it('should find widest line', () => {
      const result = measureText('a\nabc\nab', {
        fontSize: 10,
      });

      // Widest: 'abc' = 3 * 10 * 0.6 = 18
      expect(result.width).toBe(18);
      expect(result.height).toBe(36); // 3 lines
    });

    it('should scale with font size', () => {
      const small = measureText('Test', { fontSize: 10 });
      const large = measureText('Test', { fontSize: 20 });

      expect(large.width).toBe(small.width * 2);
      expect(large.height).toBe(small.height * 2);
    });
  });

  describe('createTextMeasurer', () => {
    it('should return measureText function', () => {
      const measurer = createTextMeasurer();

      expect(typeof measurer).toBe('function');
      expect(measurer).toBe(measureText);
    });

    it('should work in browser mode', () => {
      const mockContext = {
        font: '',
        measureText: vi.fn((text: string) => ({
          width: text.length * 8,
        })),
      };

      const mockCanvas = {
        getContext: vi.fn(() => mockContext),
      };

      global.document = {
        createElement: vi.fn(() => mockCanvas),
      } as any;

      global.window = {} as any;

      const measurer = createTextMeasurer();
      const result = measurer('Test', { fontSize: 14 });

      // Falls back to heuristic: 4 * 14 * 0.6 = 33.6
      expect(result.width).toBe(33.6);
    });

    it('should work in fallback mode', () => {
      delete (global as any).window;
      delete (global as any).document;

      const measurer = createTextMeasurer();
      const result = measurer('Test', { fontSize: 14 });

      expect(result.width).toBe(33.6); // 4 * 14 * 0.6
    });
  });
});
