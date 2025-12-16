import { describe, expect, it, vi } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { renderShapeLabel } from './render-label.js';

// Helper to create a mock measureText function
const createMockMeasureText = () => {
  return vi.fn((text: string) => ({
    width: text.length * 8, // Approximate: 8px per character
    height: 14,
  }));
};

describe('render-label utility', () => {
  describe('renderShapeLabel', () => {
    it('should use renderLabel when available', () => {
      const mockRenderLabel = vi.fn(() => '<text>Mock rendered</text>');

      const ctx = {
        style: { color: '#ff0000', fontSize: 16 },
        renderLabel: mockRenderLabel,
        measureText: createMockMeasureText(),
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
        measureText: createMockMeasureText(),
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
        measureText: createMockMeasureText(),
      } as unknown as ShapeRenderContext;

      const result = renderShapeLabel(ctx, 'Test', 50, 50);

      expect(result).toContain('fill="#000"');
    });

    it('should use default fontSize when not specified', () => {
      const ctx = {
        style: {},
        measureText: createMockMeasureText(),
      } as unknown as ShapeRenderContext;

      const result = renderShapeLabel(ctx, 'Test', 50, 50);

      expect(result).toContain('font-size="14"');
    });

    it('should use default fontFamily when not specified', () => {
      const ctx = {
        style: {},
        measureText: createMockMeasureText(),
      } as unknown as ShapeRenderContext;

      const result = renderShapeLabel(ctx, 'Test', 50, 50);

      expect(result).toContain('font-family="sans-serif"');
    });

    it('should apply custom textAnchor', () => {
      const ctx = {
        style: {},
        measureText: createMockMeasureText(),
      } as unknown as ShapeRenderContext;

      const result = renderShapeLabel(ctx, 'Test', 50, 50, 'start');

      expect(result).toContain('text-anchor="start"');
    });

    it('should apply custom dominantBaseline', () => {
      const ctx = {
        style: {},
        measureText: createMockMeasureText(),
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

    describe('Multiline text support', () => {
      it('should render single line as simple text element', () => {
        const ctx = {
          style: { fontSize: 14 },
        } as unknown as ShapeRenderContext;

        const result = renderShapeLabel(ctx, 'Single Line', 100, 100);

        expect(result).toContain('<text');
        expect(result).toContain('x="100"');
        expect(result).toContain('y="100"');
        expect(result).toContain('Single Line');
        expect(result).not.toContain('<tspan');
        expect(result).toContain('</text>');
      });

      it('should render multiline text with tspan elements', () => {
        const ctx = {
          style: { fontSize: 14 },
        } as unknown as ShapeRenderContext;

        const result = renderShapeLabel(
          ctx,
          'Line 1\nLine 2\nLine 3',
          100,
          100
        );

        expect(result).toContain('<text');
        expect(result).toContain('<tspan');
        expect(result).toContain('Line 1');
        expect(result).toContain('Line 2');
        expect(result).toContain('Line 3');
        expect(result).toContain('</text>');

        // Should have 3 tspans
        const tspanCount = (result.match(/<tspan/g) || []).length;
        expect(tspanCount).toBe(3);
      });

      it('should calculate line spacing correctly for multiline text', () => {
        const ctx = {
          style: { fontSize: 14 },
        } as unknown as ShapeRenderContext;

        const result = renderShapeLabel(
          ctx,
          'Line 1\nLine 2',
          100,
          100,
          'middle',
          'middle'
        );

        // Line height should be fontSize * 1.2 = 14 * 1.2 = 16.8
        // For 2 lines centered, first line at y = 100 - 16.8/2 = 91.6
        // Second line at y = 91.6 + 16.8 = 108.4 (may have floating point precision)
        expect(result).toContain('y="91.6"');
        expect(result).toMatch(/y="108\.3\d+"/); // Handle floating point precision
      });

      it('should center multiline text vertically with middle baseline', () => {
        const ctx = {
          style: { fontSize: 20 },
        } as unknown as ShapeRenderContext;

        // fontSize 20 * 1.2 = 24 line height
        // 3 lines: (3-1) * 24 = 48 total height
        // Centered at y=100: start at 100 - 48/2 = 76
        const result = renderShapeLabel(
          ctx,
          'A\nB\nC',
          50,
          100,
          'middle',
          'middle'
        );

        expect(result).toContain('y="76"'); // First line
        expect(result).toContain('y="100"'); // Second line (at center)
        expect(result).toContain('y="124"'); // Third line
      });

      it('should maintain x coordinate for all tspans', () => {
        const ctx = {
          style: { fontSize: 14 },
        } as unknown as ShapeRenderContext;

        const result = renderShapeLabel(ctx, 'A\nB\nC', 75, 100);

        // All tspans should have x="75"
        const xMatches = result.match(/x="75"/g);
        expect(xMatches).toBeTruthy();
        expect(xMatches!.length).toBe(3); // One for each tspan
      });

      it('should escape XML in each line of multiline text', () => {
        const ctx = {
          style: {},
        } as unknown as ShapeRenderContext;

        const result = renderShapeLabel(
          ctx,
          '<tag1>\n&special\n"quoted"',
          50,
          50
        );

        expect(result).toContain('&lt;tag1&gt;');
        expect(result).toContain('&amp;special');
        expect(result).toContain('&quot;quoted&quot;');
      });

      it('should apply text-anchor to multiline text', () => {
        const ctx = {
          style: {},
        } as unknown as ShapeRenderContext;

        const result = renderShapeLabel(ctx, 'A\nB', 50, 50, 'start');

        expect(result).toContain('text-anchor="start"');
      });

      it('should apply all style attributes to multiline text', () => {
        const ctx = {
          style: {
            fontSize: 16,
            font: 'Arial',
            color: '#ff0000',
            fontWeight: 'bold',
            fontStyle: 'italic',
          },
        } as unknown as ShapeRenderContext;

        const result = renderShapeLabel(ctx, 'Line 1\nLine 2', 50, 50);

        expect(result).toContain('font-size="16"');
        expect(result).toContain('font-family="Arial"');
        expect(result).toContain('fill="#ff0000"');
        expect(result).toContain('font-weight="bold"');
        expect(result).toContain('font-style="italic"');
      });

      it('should handle empty lines in multiline text', () => {
        const ctx = {
          style: { fontSize: 14 },
        } as unknown as ShapeRenderContext;

        const result = renderShapeLabel(ctx, 'Line 1\n\nLine 3', 100, 100);

        // Should have 3 tspans (including empty line)
        const tspanCount = (result.match(/<tspan/g) || []).length;
        expect(tspanCount).toBe(3);

        // Empty line should still create a tspan
        expect(result).toContain('><tspan'); // Empty tspan content
      });
    });

    describe('textAlign property mapping', () => {
      it('should map textAlign:"left" to text-anchor="start"', () => {
        const ctx = {
          style: { textAlign: 'left' },
        } as unknown as ShapeRenderContext;

        const result = renderShapeLabel(ctx, 'Left', 50, 50);

        expect(result).toContain('text-anchor="start"');
      });

      it('should map textAlign:"center" to text-anchor="middle"', () => {
        const ctx = {
          style: { textAlign: 'center' },
        } as unknown as ShapeRenderContext;

        const result = renderShapeLabel(ctx, 'Center', 50, 50);

        expect(result).toContain('text-anchor="middle"');
      });

      it('should map textAlign:"right" to text-anchor="end"', () => {
        const ctx = {
          style: { textAlign: 'right' },
        } as unknown as ShapeRenderContext;

        const result = renderShapeLabel(ctx, 'Right', 50, 50);

        expect(result).toContain('text-anchor="end"');
      });

      it('should default to text-anchor="middle" when textAlign not specified', () => {
        const ctx = {
          style: {},
        } as unknown as ShapeRenderContext;

        const result = renderShapeLabel(ctx, 'Default', 50, 50);

        expect(result).toContain('text-anchor="middle"');
      });

      it('should handle case-insensitive textAlign values', () => {
        const ctx = {
          style: { textAlign: 'LEFT' },
        } as unknown as ShapeRenderContext;

        const result = renderShapeLabel(ctx, 'Left', 50, 50);

        expect(result).toContain('text-anchor="start"');
      });

      it('should allow direct SVG values (start/middle/end)', () => {
        const ctx1 = {
          style: { textAlign: 'start' },
        } as unknown as ShapeRenderContext;

        const result1 = renderShapeLabel(ctx1, 'Start', 50, 50);
        expect(result1).toContain('text-anchor="start"');

        const ctx2 = {
          style: { textAlign: 'end' },
        } as unknown as ShapeRenderContext;

        const result2 = renderShapeLabel(ctx2, 'End', 50, 50);
        expect(result2).toContain('text-anchor="end"');
      });

      it('should give priority to textAlign over textAnchor parameter', () => {
        const ctx = {
          style: { textAlign: 'left' },
        } as unknown as ShapeRenderContext;

        // Even though textAnchor parameter is 'end', textAlign should take precedence
        const result = renderShapeLabel(ctx, 'Left Priority', 50, 50, 'end');

        expect(result).toContain('text-anchor="start"');
      });

      it('should pass textAlign mapping to renderLabel when available', () => {
        const mockRenderLabel = vi.fn(() => '<text>Mock</text>');

        const ctx = {
          style: { textAlign: 'right' },
          renderLabel: mockRenderLabel,
        } as unknown as ShapeRenderContext;

        renderShapeLabel(ctx, 'Right', 50, 50);

        expect(mockRenderLabel).toHaveBeenCalledWith('Right', 50, 50, {
          fontSize: 14,
          fontFamily: 'sans-serif',
          fill: '#000',
          textAnchor: 'end', // Should map 'right' to 'end'
          dominantBaseline: 'middle',
          fontWeight: undefined,
          fontStyle: undefined,
          textDecoration: undefined,
        });
      });

      it('should work with multiline text', () => {
        const ctx = {
          style: { textAlign: 'right' },
        } as unknown as ShapeRenderContext;

        const result = renderShapeLabel(ctx, 'Line 1\nLine 2', 50, 50);

        expect(result).toContain('text-anchor="end"');
      });
    });
  });
});
