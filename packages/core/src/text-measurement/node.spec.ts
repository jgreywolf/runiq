import { describe, expect, it } from 'vitest';
import { createTextMeasurer, measureText } from './node.js';

describe('node text measurement', () => {
  describe('measureText', () => {
    it('should measure single line text', () => {
      const result = measureText('Hello', {
        fontSize: 14,
      });

      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBe(16.8); // 14 * 1.2
    });

    it('should measure multi-line text', () => {
      const result = measureText('Hello\nWorld', {
        fontSize: 14,
      });

      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBe(33.6); // 2 lines * 14 * 1.2
    });

    it('should use default font size', () => {
      const result = measureText('Test', {});

      expect(result.height).toBe(16.8); // 14 * 1.2
    });

    it('should estimate narrow characters correctly', () => {
      const narrow = measureText('iii', { fontSize: 10 });
      const normal = measureText('aaa', { fontSize: 10 });

      // Narrow chars (i) should be narrower than normal chars (a)
      expect(narrow.width).toBeLessThan(normal.width);
    });

    it('should estimate wide characters correctly', () => {
      const wide = measureText('WWW', { fontSize: 10 });
      const normal = measureText('aaa', { fontSize: 10 });

      // Wide chars (W) should be wider than normal chars (a)
      expect(wide.width).toBeGreaterThan(normal.width);
    });

    it('should handle punctuation and spaces', () => {
      const result = measureText('a b c', { fontSize: 10 });

      // Spaces have a width ratio of 0.3
      expect(result.width).toBeGreaterThan(0);
    });

    it('should find widest line in multi-line text', () => {
      const result = measureText('ab\nabcdef', { fontSize: 10 });

      // Second line is wider
      const line1 = measureText('ab', { fontSize: 10 });
      const line2 = measureText('abcdef', { fontSize: 10 });

      expect(result.width).toBe(line2.width);
      expect(result.width).toBeGreaterThan(line1.width);
    });

    it('should handle empty string', () => {
      const result = measureText('', { fontSize: 14 });

      expect(result.width).toBe(0);
      expect(result.height).toBe(16.8); // Still has 1 line height
    });

    it('should handle string with only newlines', () => {
      const result = measureText('\n\n', { fontSize: 14 });

      expect(result.width).toBe(0);
      expect(result.height).toBeCloseTo(50.4, 1); // 3 lines * 14 * 1.2
    });

    it('should scale with font size', () => {
      const small = measureText('Test', { fontSize: 10 });
      const large = measureText('Test', { fontSize: 20 });

      expect(large.width).toBeGreaterThan(small.width);
      expect(large.height).toBeGreaterThan(small.height);
    });

    it('should use character-specific ratios', () => {
      // Test specific characters with known ratios
      const i = measureText('i', { fontSize: 10 }); // ratio 0.3
      const w = measureText('w', { fontSize: 10 }); // ratio 0.8
      const a = measureText('a', { fontSize: 10 }); // ratio 0.6 (default)

      expect(i.width).toBe(3); // 10 * 0.3
      expect(w.width).toBe(8); // 10 * 0.8
      expect(a.width).toBe(6); // 10 * 0.6
    });
  });

  describe('createTextMeasurer', () => {
    it('should return measureText function', () => {
      const measurer = createTextMeasurer();

      expect(typeof measurer).toBe('function');
      expect(measurer).toBe(measureText);
    });

    it('should work when called', () => {
      const measurer = createTextMeasurer();
      const result = measurer('Test', { fontSize: 14 });

      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBe(16.8);
    });
  });
});
