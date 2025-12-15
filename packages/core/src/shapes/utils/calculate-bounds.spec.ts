import { describe, expect, it, vi } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import {
  calculateAspectRatioBounds,
  calculateFixedBounds,
  calculateMultiLineBounds,
  calculateSimpleBounds,
} from './calculate-bounds.js';

function createMockContext(
  overrides: Partial<ShapeRenderContext> = {}
): ShapeRenderContext {
  const mockMeasureText = vi.fn((text: string) => ({
    width: text.length * 8,
    height: 16,
  }));

  return {
    node: { id: 'test', label: 'Test Label' },
    style: { padding: 10 },
    measureText: mockMeasureText,
    ...overrides,
  } as unknown as ShapeRenderContext;
}

describe('calculate-bounds utilities', () => {
  describe('calculateSimpleBounds', () => {
    it('should calculate bounds with default padding', () => {
      const ctx = createMockContext();
      const result = calculateSimpleBounds(ctx);

      // 'Test Label' = 10 chars * 8 = 80, + padding * 2 (10 * 2 = 20)
      expect(result.width).toBe(100);
      expect(result.height).toBe(36); // 16 + 10 * 2
    });

    it('should use node.id if label is empty', () => {
      const ctx = createMockContext({ node: { id: 'test-id', label: '' } });
      const result = calculateSimpleBounds(ctx);

      // 'test-id' = 7 chars * 8 = 56, + padding * 2
      expect(result.width).toBe(76);
      expect(result.height).toBe(36);
    });

    it('should use defaultLabel if provided', () => {
      const ctx = createMockContext({ node: { id: 'test', label: '' } });
      const result = calculateSimpleBounds(ctx, { defaultLabel: 'Default' });

      // 'Default' = 7 chars * 8 = 56
      expect(result.width).toBe(76);
    });

    it('should respect minWidth', () => {
      const ctx = createMockContext({ node: { id: 'test', label: 'A' } });
      const result = calculateSimpleBounds(ctx, { minWidth: 200 });

      expect(result.width).toBe(200);
    });

    it('should respect minHeight', () => {
      const ctx = createMockContext();
      const result = calculateSimpleBounds(ctx, { minHeight: 100 });

      expect(result.height).toBe(100);
    });

    it('should apply widthPaddingMultiplier', () => {
      const ctx = createMockContext({ node: { id: 'test', label: 'A' } });
      const result = calculateSimpleBounds(ctx, { widthPaddingMultiplier: 4 });

      // 'A' = 8 + padding * 4 (10 * 4 = 40)
      expect(result.width).toBe(48);
    });

    it('should apply heightPaddingMultiplier', () => {
      const ctx = createMockContext();
      const result = calculateSimpleBounds(ctx, { heightPaddingMultiplier: 4 });

      // 16 + padding * 4 (10 * 4 = 40)
      expect(result.height).toBe(56);
    });

    it('should add extraWidth', () => {
      const ctx = createMockContext({ node: { id: 'test', label: 'A' } });
      const result = calculateSimpleBounds(ctx, { extraWidth: 20 });

      // 8 + 20 + 20 (padding) = 48
      expect(result.width).toBe(48);
    });

    it('should add extraHeight', () => {
      const ctx = createMockContext();
      const result = calculateSimpleBounds(ctx, { extraHeight: 30 });

      // 16 + 20 (padding) + 30 (extra) = 66
      expect(result.height).toBe(66);
    });

    it('should use style.padding if available', () => {
      const ctx = createMockContext({ style: { padding: 20 } });
      const result = calculateSimpleBounds(ctx);

      // 'Test Label' = 80 + padding * 2 (20 * 2 = 40)
      expect(result.width).toBe(120);
      expect(result.height).toBe(56); // 16 + 20 * 2
    });

    it('should handle missing padding with defaults', () => {
      const ctx = createMockContext({ style: {} });
      const result = calculateSimpleBounds(ctx);

      // Should use ShapeDefaults.PADDING = 10
      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
    });
  });

  describe('calculateFixedBounds', () => {
    it('should return fixed dimensions', () => {
      const result = calculateFixedBounds({ width: 100, height: 50 });

      expect(result.width).toBe(100);
      expect(result.height).toBe(50);
    });

    it('should not depend on context or text', () => {
      const result1 = calculateFixedBounds({ width: 30, height: 30 });
      const result2 = calculateFixedBounds({ width: 30, height: 30 });

      expect(result1).toEqual(result2);
    });
  });

  describe('calculateMultiLineBounds', () => {
    it('should calculate bounds for multiple lines', () => {
      const ctx = createMockContext();
      const lines = ['Short', 'Much longer line', 'Mid'];
      const result = calculateMultiLineBounds(ctx, { lines });

      // Widest line: 'Much longer line' = 16 chars * 8 = 128
      expect(result.width).toBe(148); // 128 + 10 * 2
      // 3 lines * 18 (14+4) + 10 * 2 = 74
      expect(result.height).toBe(74);
    });

    it('should use node.label if lines not provided', () => {
      const ctx = createMockContext({ node: { id: 'test', label: 'Single' } });
      const result = calculateMultiLineBounds(ctx);

      // 'Single' = 6 chars * 8 = 48
      expect(result.width).toBe(68);
    });

    it('should use custom line height', () => {
      const ctx = createMockContext();
      const lines = ['Line 1', 'Line 2'];
      const result = calculateMultiLineBounds(ctx, { lines, lineHeight: 30 });

      // 2 lines * 30 + padding * 2
      expect(result.height).toBe(80);
    });

    it('should respect minWidth', () => {
      const ctx = createMockContext();
      const lines = ['A'];
      const result = calculateMultiLineBounds(ctx, { lines, minWidth: 200 });

      expect(result.width).toBe(200);
    });

    it('should respect minHeight', () => {
      const ctx = createMockContext();
      const lines = ['A'];
      const result = calculateMultiLineBounds(ctx, { lines, minHeight: 150 });

      expect(result.height).toBe(150);
    });

    it('should handle empty lines array', () => {
      const ctx = createMockContext();
      const result = calculateMultiLineBounds(ctx, { lines: [] });

      // Should have some dimensions even with no lines
      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
    });

    it('should apply widthPaddingMultiplier', () => {
      const ctx = createMockContext();
      const lines = ['Test'];
      const result = calculateMultiLineBounds(ctx, {
        lines,
        widthPaddingMultiplier: 3,
      });

      // 'Test' = 32 + padding * 3 (10 * 3 = 30)
      expect(result.width).toBe(62);
    });

    it('should apply heightPaddingMultiplier', () => {
      const ctx = createMockContext();
      const lines = ['Test'];
      const result = calculateMultiLineBounds(ctx, {
        lines,
        heightPaddingMultiplier: 3,
      });

      // 1 line * 18 + padding * 3 (10 * 3 = 30)
      expect(result.height).toBe(48);
    });

    it('should find widest line', () => {
      const ctx = createMockContext();
      const lines = ['Short', 'Very long line here', 'Mid'];
      const result = calculateMultiLineBounds(ctx, { lines });

      // 'Very long line here' = 19 chars * 8 = 152
      expect(result.width).toBe(172);
    });
  });

  describe('calculateAspectRatioBounds', () => {
    it('should maintain aspect ratio for square', () => {
      const ctx = createMockContext();
      const result = calculateAspectRatioBounds(ctx, { aspectRatio: 1 });

      // Square: width should equal height
      expect(result.width).toBe(result.height);
    });

    it('should fit text with aspect ratio > 1', () => {
      const ctx = createMockContext({ node: { id: 'test', label: 'Text' } });
      const result = calculateAspectRatioBounds(ctx, {
        aspectRatio: 2, // Width-dominant
        fitText: true,
      });

      // Height should be text + padding, width should be height * 2
      expect(result.height).toBe(36); // 16 + 10 * 2
      expect(result.width).toBe(72); // height * 2
    });

    it('should use baseSize when provided', () => {
      const ctx = createMockContext({ node: { id: 'test', label: 'A' } });
      const result = calculateAspectRatioBounds(ctx, {
        aspectRatio: 1,
        baseSize: 100,
        fitText: false,
      });

      expect(result.width).toBe(100);
      expect(result.height).toBe(100);
    });

    it('should respect minWidth', () => {
      const ctx = createMockContext();
      const result = calculateAspectRatioBounds(ctx, {
        aspectRatio: 1,
        minWidth: 200,
      });

      expect(result.width).toBeGreaterThanOrEqual(200);
    });

    it('should respect minHeight', () => {
      const ctx = createMockContext();
      const result = calculateAspectRatioBounds(ctx, {
        aspectRatio: 1,
        minHeight: 150,
      });

      expect(result.height).toBeGreaterThanOrEqual(150);
    });

    it('should handle aspect ratio < 1 (height-dominant)', () => {
      const ctx = createMockContext({ node: { id: 'test', label: 'Text' } });
      const result = calculateAspectRatioBounds(ctx, {
        aspectRatio: 0.5, // Height is 2x width
        fitText: true,
      });

      // Width should be less than height
      expect(result.width).toBeLessThan(result.height);
    });

    it('should ensure text fits when fitText is true', () => {
      const ctx = createMockContext({
        node: { id: 'test', label: 'Very Long Label Text' },
      });
      const result = calculateAspectRatioBounds(ctx, {
        aspectRatio: 1,
        fitText: true,
      });

      const textSize = ctx.measureText('Very Long Label Text', ctx.style);
      // Width should be at least text width + padding
      expect(result.width).toBeGreaterThanOrEqual(textSize.width);
    });
  });
});
