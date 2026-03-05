import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import {
  extractBasicStyles,
  extractStyles,
  extractTextStyles,
} from './extract-styles.js';

describe('Style Extraction Utilities', () => {
  // Helper to create mock context
  const createMockContext = (styleOverrides = {}): ShapeRenderContext => ({
    node: {
      id: 'test',
      shape: 'rectangle',
      label: 'Test',
      data: {},
    },
    style: styleOverrides,
    measureText: () => ({ width: 100, height: 20 }),
  });

  describe('extractStyles', () => {
    it('should return default values when no styles provided', () => {
      const ctx = createMockContext({});
      const styles = extractStyles(ctx);

      expect(styles).toEqual({
        fill: '#f0f0f0',
        stroke: '#333',
        strokeWidth: 1,
        fontSize: 14,
        fontFamily: 'Arial, sans-serif',
        fontWeight: undefined,
        opacity: undefined,
      });
    });

    it('should use provided style values', () => {
      const ctx = createMockContext({
        fill: '#ff0000',
        stroke: '#00ff00',
        strokeWidth: 2,
        fontSize: 16,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        opacity: 0.8,
      });
      const styles = extractStyles(ctx);

      expect(styles).toEqual({
        fill: '#ff0000',
        stroke: '#00ff00',
        strokeWidth: 2,
        fontSize: 16,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        opacity: 0.8,
      });
    });

    it('should use custom defaults when provided', () => {
      const ctx = createMockContext({});
      const styles = extractStyles(ctx, {
        defaultFill: '#ffffff',
        defaultStroke: '#000000',
        defaultStrokeWidth: 2,
        defaultFontSize: 12,
        defaultFontFamily: 'Georgia',
      });

      expect(styles).toEqual({
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2,
        fontSize: 12,
        fontFamily: 'Georgia',
        fontWeight: undefined,
        opacity: undefined,
      });
    });

    it('should prefer ctx.style.fontFamily over ctx.style.font', () => {
      const ctx = createMockContext({
        fontFamily: 'Helvetica',
        font: 'Arial',
      });
      const styles = extractStyles(ctx);

      expect(styles.fontFamily).toBe('Helvetica');
    });

    it('should fall back to ctx.style.font if fontFamily not set', () => {
      const ctx = createMockContext({
        font: 'Arial',
      });
      const styles = extractStyles(ctx);

      expect(styles.fontFamily).toBe('Arial');
    });

    it('should handle zero values correctly (not treat as falsy)', () => {
      const ctx = createMockContext({
        strokeWidth: 0,
        fontSize: 0,
        opacity: 0,
      });
      const styles = extractStyles(ctx);

      expect(styles.strokeWidth).toBe(0);
      expect(styles.fontSize).toBe(0);
      expect(styles.opacity).toBe(0);
    });
  });

  describe('extractBasicStyles', () => {
    it('should return only basic shape styles', () => {
      const ctx = createMockContext({
        fill: '#ff0000',
        stroke: '#00ff00',
        strokeWidth: 2,
        fontSize: 16, // Should not be included
        fontFamily: 'Helvetica', // Should not be included
      });
      const styles = extractBasicStyles(ctx);

      expect(styles).toEqual({
        fill: '#ff0000',
        stroke: '#00ff00',
        strokeWidth: 2,
      });
      expect(styles).not.toHaveProperty('fontSize');
      expect(styles).not.toHaveProperty('fontFamily');
    });

    it('should use default values when no styles provided', () => {
      const ctx = createMockContext({});
      const styles = extractBasicStyles(ctx);

      expect(styles).toEqual({
        fill: '#f0f0f0',
        stroke: '#333',
        strokeWidth: 1,
      });
    });

    it('should accept custom defaults', () => {
      const ctx = createMockContext({});
      const styles = extractBasicStyles(ctx, {
        defaultFill: '#ffffff',
        defaultStroke: '#000000',
        defaultStrokeWidth: 3,
      });

      expect(styles).toEqual({
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 3,
      });
    });
  });

  describe('extractTextStyles', () => {
    it('should return only text-related styles', () => {
      const ctx = createMockContext({
        fontSize: 16,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        fill: '#ff0000', // Should not be included
        stroke: '#00ff00', // Should not be included
      });
      const styles = extractTextStyles(ctx);

      expect(styles).toEqual({
        fontSize: 16,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
      });
      expect(styles).not.toHaveProperty('fill');
      expect(styles).not.toHaveProperty('stroke');
    });

    it('should use default values when no styles provided', () => {
      const ctx = createMockContext({});
      const styles = extractTextStyles(ctx);

      expect(styles).toEqual({
        fontSize: 14,
        fontFamily: 'Arial, sans-serif',
        fontWeight: undefined,
      });
    });

    it('should accept custom defaults', () => {
      const ctx = createMockContext({});
      const styles = extractTextStyles(ctx, {
        defaultFontSize: 12,
        defaultFontFamily: 'Georgia',
      });

      expect(styles).toEqual({
        fontSize: 12,
        fontFamily: 'Georgia',
        fontWeight: undefined,
      });
    });
  });

  describe('Real-world usage patterns', () => {
    it('should work with C4 system shape defaults (blue)', () => {
      const ctx = createMockContext({});
      const styles = extractBasicStyles(ctx, {
        defaultFill: '#1168BD',
        defaultStroke: '#0B4884',
      });

      expect(styles.fill).toBe('#1168BD');
      expect(styles.stroke).toBe('#0B4884');
    });

    it('should work with UML note shape defaults (yellow)', () => {
      const ctx = createMockContext({});
      const styles = extractBasicStyles(ctx, {
        defaultFill: '#ffffcc',
      });

      expect(styles.fill).toBe('#ffffcc');
    });

    it('should work with activity diagram defaults', () => {
      const ctx = createMockContext({});
      const styles = extractStyles(ctx, {
        defaultFill: '#ffffff',
        defaultStroke: '#000000',
        defaultStrokeWidth: 1.5,
      });

      expect(styles.strokeWidth).toBe(1.5);
    });

    it('should handle shapes with no fill (transparent)', () => {
      const ctx = createMockContext({
        fill: 'none',
      });
      const styles = extractBasicStyles(ctx);

      expect(styles.fill).toBe('none');
    });
  });
});
