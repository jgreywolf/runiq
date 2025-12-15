import { describe, expect, it } from 'vitest';
import { escapeXml, renderMultilineText } from './utils.js';

describe('Utils', () => {
  describe('escapeXml', () => {
    it('should escape ampersands', () => {
      expect(escapeXml('A & B')).toBe('A &amp; B');
      expect(escapeXml('&')).toBe('&amp;');
      expect(escapeXml('&&')).toBe('&amp;&amp;');
    });

    it('should escape less than', () => {
      expect(escapeXml('A < B')).toBe('A &lt; B');
      expect(escapeXml('<')).toBe('&lt;');
      expect(escapeXml('<<')).toBe('&lt;&lt;');
    });

    it('should escape greater than', () => {
      expect(escapeXml('A > B')).toBe('A &gt; B');
      expect(escapeXml('>')).toBe('&gt;');
      expect(escapeXml('>>')).toBe('&gt;&gt;');
    });

    it('should escape double quotes', () => {
      expect(escapeXml('Say "Hello"')).toBe('Say &quot;Hello&quot;');
      expect(escapeXml('"')).toBe('&quot;');
      expect(escapeXml('""')).toBe('&quot;&quot;');
    });

    it('should escape single quotes', () => {
      expect(escapeXml("It's fine")).toBe('It&#39;s fine');
      expect(escapeXml("'")).toBe('&#39;');
      expect(escapeXml("''")).toBe('&#39;&#39;');
    });

    it('should handle text with no special characters', () => {
      expect(escapeXml('Hello World')).toBe('Hello World');
      expect(escapeXml('ABC123')).toBe('ABC123');
      expect(escapeXml('test-value_123')).toBe('test-value_123');
    });

    it('should handle empty string', () => {
      expect(escapeXml('')).toBe('');
    });

    it('should handle multiple special characters', () => {
      expect(escapeXml('<tag attr="value">A & B\'s</tag>')).toBe(
        '&lt;tag attr=&quot;value&quot;&gt;A &amp; B&#39;s&lt;/tag&gt;'
      );
    });

    it('should prevent XSS attacks', () => {
      const xssAttempt = '<script>alert("XSS")</script>';
      expect(escapeXml(xssAttempt)).toBe(
        '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
      );
    });

    it('should handle mixed content', () => {
      expect(escapeXml('User input: <>"&\'')).toBe(
        'User input: &lt;&gt;&quot;&amp;&#39;'
      );
    });
  });

  describe('renderMultilineText', () => {
    describe('Single line text', () => {
      it('should render single line as simple text element', () => {
        const result = renderMultilineText('Hello World', 10, 20);
        expect(result).toContain('<text');
        expect(result).toContain('x="10"');
        expect(result).toContain('y="20"');
        expect(result).toContain('>Hello World</text>');
        expect(result).not.toContain('<tspan');
      });

      it('should apply text-anchor to single line', () => {
        const result = renderMultilineText('Test', 10, 20, {
          textAnchor: 'middle',
        });
        expect(result).toContain('text-anchor="middle"');
      });

      it('should apply dominant-baseline to single line', () => {
        const result = renderMultilineText('Test', 10, 20, {
          dominantBaseline: 'middle',
        });
        expect(result).toContain('dominant-baseline="middle"');
      });

      it('should apply font styling to single line', () => {
        const result = renderMultilineText('Test', 10, 20, {
          fontFamily: 'Arial',
          fontSize: 16,
          fill: '#ff0000',
          fontWeight: 'bold',
          fontStyle: 'italic',
        });
        expect(result).toContain('font-family="Arial"');
        expect(result).toContain('font-size="16"');
        expect(result).toContain('fill="#ff0000"');
        expect(result).toContain('font-weight="bold"');
        expect(result).toContain('font-style="italic"');
      });

      it('should apply CSS class to single line', () => {
        const result = renderMultilineText('Test', 10, 20, {
          className: 'my-class',
        });
        expect(result).toContain('class="my-class"');
      });
    });

    describe('Multi-line text', () => {
      it('should render multi-line text with tspans', () => {
        const result = renderMultilineText('Line 1\nLine 2\nLine 3', 10, 20);
        expect(result).toContain('<text');
        expect(result).toContain('<tspan');
        expect(result).toContain('>Line 1</tspan>');
        expect(result).toContain('>Line 2</tspan>');
        expect(result).toContain('>Line 3</tspan>');
        expect(result).toContain('</text>');
      });

      it('should calculate line height correctly', () => {
        const result = renderMultilineText('Line 1\nLine 2', 10, 20, {
          fontSize: 14,
        });
        // Line height = fontSize * 1.2 = 14 * 1.2 = 16.8
        expect(result).toContain('y="20"'); // First line
        expect(result).toContain('y="36.8"'); // Second line (20 + 16.8)
      });

      it('should apply text-anchor to multi-line text', () => {
        const result = renderMultilineText('Line 1\nLine 2', 10, 20, {
          textAnchor: 'end',
        });
        expect(result).toContain('text-anchor="end"');
        // Each tspan should have same x coordinate
        expect(result).toContain('<tspan x="10"');
      });

      it('should center multi-line text vertically with middle baseline', () => {
        const result = renderMultilineText('Line 1\nLine 2\nLine 3', 10, 100, {
          dominantBaseline: 'middle',
          fontSize: 10,
        });
        // Line height = 10 * 1.2 = 12
        // Total height = 2 * 12 = 24 (for gaps between 3 lines)
        // Start Y = 100 - 24/2 = 88
        expect(result).toContain('y="88"'); // First line
        expect(result).toContain('y="100"'); // Second line (88 + 12)
        expect(result).toContain('y="112"'); // Third line (100 + 12)
      });

      it('should apply font styling to multi-line text', () => {
        const result = renderMultilineText('Line 1\nLine 2', 10, 20, {
          fontFamily: 'Courier',
          fontSize: 12,
          fill: '#0000ff',
        });
        expect(result).toContain('font-family="Courier"');
        expect(result).toContain('font-size="12"');
        expect(result).toContain('fill="#0000ff"');
      });

      it('should apply CSS class to multi-line text', () => {
        const result = renderMultilineText('Line 1\nLine 2', 10, 20, {
          className: 'multi-class',
        });
        expect(result).toContain('class="multi-class"');
      });

      it('should escape XML entities in each line', () => {
        const result = renderMultilineText('A & B\n<tag>\n"quoted"', 10, 20);
        expect(result).toContain('>A &amp; B</tspan>');
        expect(result).toContain('>&lt;tag&gt;</tspan>');
        expect(result).toContain('>&quot;quoted&quot;</tspan>');
      });

      it('should handle empty lines', () => {
        const result = renderMultilineText('Line 1\n\nLine 3', 10, 20);
        expect(result).toContain('>Line 1</tspan>');
        expect(result).toContain('></tspan>'); // Empty line
        expect(result).toContain('>Line 3</tspan>');
      });
    });

    describe('Edge cases', () => {
      it('should handle text with only newlines', () => {
        const result = renderMultilineText('\n\n', 10, 20);
        expect(result).toContain('<text');
        expect(result).toContain('<tspan');
        expect(result).toContain('></tspan>'); // Empty tspans
      });

      it('should use default fontSize when not provided', () => {
        const result = renderMultilineText('Line 1\nLine 2', 10, 20);
        // Default fontSize is 14, line height = 14 * 1.2 = 16.8
        expect(result).toContain('y="20"');
        expect(result).toContain('y="36.8"');
      });

      it('should handle custom line height multiplier', () => {
        // Testing with explicit fontSize to verify 1.2 multiplier
        const result = renderMultilineText('Line 1\nLine 2', 10, 20, {
          fontSize: 20,
        });
        // Line height = 20 * 1.2 = 24
        expect(result).toContain('y="20"');
        expect(result).toContain('y="44"'); // 20 + 24
      });

      it('should maintain x coordinate across all tspans', () => {
        const result = renderMultilineText('A\nB\nC', 50, 100);
        const tspans = result.match(/x="50"/g);
        expect(tspans).toHaveLength(3); // Three tspans with same x
      });

      it('should omit optional attributes when not provided', () => {
        const result = renderMultilineText('Test', 10, 20);
        expect(result).not.toContain('text-anchor=');
        expect(result).not.toContain('dominant-baseline=');
        expect(result).not.toContain('font-family=');
        expect(result).not.toContain('class=');
      });
    });
  });
});
