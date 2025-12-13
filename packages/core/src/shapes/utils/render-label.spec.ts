import { describe, expect, it, vi } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { renderShapeLabel } from './render-label.js';

describe('render-label utility', () => {
  describe('renderShapeLabel', () => {
    it('should use renderLabel when available', () => {
      const mockRenderLabel = vi.fn(() => '<text>Mock rendered</text>');

      const ctx = {
        style: { color: '#ff0000', fontSize: 16 },
        renderLabel: mockRenderLabel,
      } as unknown as ShapeRenderContext;

      const result = renderShapeLabel(ctx, 'Test Label', 50, 50);

      expect(mockRenderLabel).toHaveBeenCalledWith('Test Label', 50, 50, {
        fontSize: 16,
        fontFamily: 'sans-serif',
        fill: '#ff0000',
        textAnchor: 'middle',
        dominantBaseline: 'middle',
        fontWeight: undefined,
        fontStyle: undefined,
        textDecoration: undefined,
      });

      expect(result).toBe('<text>Mock rendered</text>');
    });

    it('should fallback to plain text when renderLabel not available', () => {
      const ctx = {
        style: { color: '#0000ff', fontSize: 14 },
      } as unknown as ShapeRenderContext;

      const result = renderShapeLabel(ctx, 'Simple Label', 100, 100);

      expect(result).toContain('<text');
      expect(result).toContain('x="100"');
      expect(result).toContain('y="100"');
      expect(result).toContain('font-size="14"');
      expect(result).toContain('fill="#0000ff"');
      expect(result).toContain('Simple Label');
      expect(result).toContain('</text>');
    });

    it('should use default color when not specified', () => {
      const ctx = {
        style: {},
      } as unknown as ShapeRenderContext;

      const result = renderShapeLabel(ctx, 'Test', 50, 50);

      expect(result).toContain('fill="#000"');
    });

    it('should use default fontSize when not specified', () => {
      const ctx = {
        style: {},
      } as unknown as ShapeRenderContext;

      const result = renderShapeLabel(ctx, 'Test', 50, 50);

      expect(result).toContain('font-size="14"');
    });

    it('should use default fontFamily when not specified', () => {
      const ctx = {
        style: {},
      } as unknown as ShapeRenderContext;

      const result = renderShapeLabel(ctx, 'Test', 50, 50);

      expect(result).toContain('font-family="sans-serif"');
    });

    it('should apply custom textAnchor', () => {
      const ctx = {
        style: {},
      } as unknown as ShapeRenderContext;

      const result = renderShapeLabel(ctx, 'Test', 50, 50, 'start');

      expect(result).toContain('text-anchor="start"');
    });

    it('should apply custom dominantBaseline', () => {
      const ctx = {
        style: {},
      } as unknown as ShapeRenderContext;

      const result = renderShapeLabel(ctx, 'Test', 50, 50, 'middle', 'hanging');

      expect(result).toContain('dominant-baseline="hanging"');
    });

    it('should escape XML in label text', () => {
      const ctx = {
        style: {},
      } as unknown as ShapeRenderContext;

      const result = renderShapeLabel(ctx, '<script>&test</script>', 50, 50);

      expect(result).toContain('&lt;script&gt;');
      expect(result).toContain('&amp;test');
      expect(result).not.toContain('<script>');
    });

    it('should apply fontWeight when specified', () => {
      const ctx = {
        style: { fontWeight: 'bold' },
      } as unknown as ShapeRenderContext;

      const result = renderShapeLabel(ctx, 'Test', 50, 50);

      expect(result).toContain('font-weight="bold"');
    });

    it('should apply fontStyle when specified', () => {
      const ctx = {
        style: { fontStyle: 'italic' },
      } as unknown as ShapeRenderContext;

      const result = renderShapeLabel(ctx, 'Test', 50, 50);

      expect(result).toContain('font-style="italic"');
    });

    it('should apply textDecoration when specified', () => {
      const ctx = {
        style: { textDecoration: 'underline' },
      } as unknown as ShapeRenderContext;

      const result = renderShapeLabel(ctx, 'Test', 50, 50);

      expect(result).toContain('text-decoration="underline"');
    });

    it('should pass all style options to renderLabel', () => {
      const mockRenderLabel = vi.fn(() => '<text>Mock</text>');

      const ctx = {
        style: {
          color: '#333',
          fontSize: 18,
          font: 'Arial',
          fontWeight: 'bold',
          fontStyle: 'italic',
          textDecoration: 'underline',
        },
        renderLabel: mockRenderLabel,
      } as unknown as ShapeRenderContext;

      renderShapeLabel(ctx, 'Styled', 50, 50, 'end', 'text-top');

      expect(mockRenderLabel).toHaveBeenCalledWith('Styled', 50, 50, {
        fontSize: 18,
        fontFamily: 'Arial',
        fill: '#333',
        textAnchor: 'end',
        dominantBaseline: 'text-top',
        fontWeight: 'bold',
        fontStyle: 'italic',
        textDecoration: 'underline',
      });
    });

    it('should handle object color by using default', () => {
      const ctx = {
        style: { color: { r: 255, g: 0, b: 0 } },
      } as unknown as ShapeRenderContext;

      const result = renderShapeLabel(ctx, 'Test', 50, 50);

      expect(result).toContain('fill="#000"');
    });
  });
});
