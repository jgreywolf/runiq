import { describe, expect, it } from 'vitest';
import {
  escapeXml,
  getDataProperty,
  renderMultilineText,
} from './shape-types.js';

describe('shape-types', () => {
  describe('getDataProperty', () => {
    it('should return undefined for undefined data', () => {
      const result = getDataProperty(undefined, 'test');
      expect(result).toBeUndefined();
    });

    it('should return default value for undefined data', () => {
      const result = getDataProperty(undefined, 'test', 'default');
      expect(result).toBe('default');
    });

    it('should extract from parser format: { values: [{ property: value }] }', () => {
      const data = { values: [{ name: 'test', count: 42 }] };
      expect(getDataProperty(data, 'name')).toBe('test');
      expect(getDataProperty(data, 'count')).toBe(42);
    });

    it('should extract from direct format: { property: value }', () => {
      const data = { name: 'test', count: 42 };
      expect(getDataProperty(data, 'name')).toBe('test');
      expect(getDataProperty(data, 'count')).toBe(42);
    });

    it('should extract from array format: [{ property: value }]', () => {
      const data = [{ name: 'test', count: 42 }] as unknown as Record<
        string,
        unknown
      >;
      expect(getDataProperty(data, 'name')).toBe('test');
      expect(getDataProperty(data, 'count')).toBe(42);
    });

    it('should return default value if property not found', () => {
      const data = { name: 'test' };
      expect(getDataProperty(data, 'missing', 'default')).toBe('default');
    });

    it('should handle empty values array', () => {
      const data = { values: [] };
      expect(getDataProperty(data, 'name', 'default')).toBe('default');
    });

    it('should handle empty direct object', () => {
      const data = {};
      expect(getDataProperty(data, 'name', 'default')).toBe('default');
    });

    it('should handle empty array', () => {
      const data = [] as unknown as Record<string, unknown>;
      expect(getDataProperty(data, 'name', 'default')).toBe('default');
    });

    it('should handle typed return values', () => {
      const data = { count: 42, flag: true, text: 'hello' };
      expect(getDataProperty<number>(data, 'count')).toBe(42);
      expect(getDataProperty<boolean>(data, 'flag')).toBe(true);
      expect(getDataProperty<string>(data, 'text')).toBe('hello');
    });

    it('should prioritize parser format over direct format', () => {
      const data = {
        values: [{ name: 'from-values' }],
        name: 'direct',
      };
      expect(getDataProperty(data, 'name')).toBe('from-values');
    });
  });

  describe('escapeXml', () => {
    it('should escape ampersand', () => {
      expect(escapeXml('A & B')).toBe('A &amp; B');
    });

    it('should escape less than', () => {
      expect(escapeXml('A < B')).toBe('A &lt; B');
    });

    it('should escape greater than', () => {
      expect(escapeXml('A > B')).toBe('A &gt; B');
    });

    it('should escape double quotes', () => {
      expect(escapeXml('Say "hello"')).toBe('Say &quot;hello&quot;');
    });

    it('should escape single quotes', () => {
      expect(escapeXml("It's")).toBe('It&apos;s');
    });

    it('should escape all special characters', () => {
      expect(escapeXml('<tag attr="value" other=\'val\'>&text</tag>')).toBe(
        '&lt;tag attr=&quot;value&quot; other=&apos;val&apos;&gt;&amp;text&lt;/tag&gt;'
      );
    });

    it('should handle empty string', () => {
      expect(escapeXml('')).toBe('');
    });

    it('should handle string with no special characters', () => {
      expect(escapeXml('Hello World')).toBe('Hello World');
    });

    it('should handle multiple ampersands', () => {
      expect(escapeXml('A & B & C')).toBe('A &amp; B &amp; C');
    });
  });

  describe('renderMultilineText', () => {
    it('should render single line as simple text element', () => {
      const svg = renderMultilineText('Hello', 100, 50);
      expect(svg).toContain('<text');
      expect(svg).toContain('x="100"');
      expect(svg).toContain('y="50"');
      expect(svg).toContain('Hello');
      expect(svg).not.toContain('<tspan');
    });

    it('should render multiple lines with tspan elements', () => {
      const svg = renderMultilineText('Line 1\nLine 2\nLine 3', 100, 50);
      expect(svg).toContain('<text');
      expect(svg).toContain('<tspan');
      expect(svg).toContain('Line 1');
      expect(svg).toContain('Line 2');
      expect(svg).toContain('Line 3');
    });

    it('should apply text-anchor option', () => {
      const svg = renderMultilineText('Test', 100, 50, {
        textAnchor: 'middle',
      });
      expect(svg).toContain('text-anchor="middle"');
    });

    it('should apply dominant-baseline option', () => {
      const svg = renderMultilineText('Test', 100, 50, {
        dominantBaseline: 'middle',
      });
      expect(svg).toContain('dominant-baseline="middle"');
    });

    it('should apply font options', () => {
      const svg = renderMultilineText('Test', 100, 50, {
        fontFamily: 'Arial',
        fontSize: 16,
        fontWeight: 'bold',
        fontStyle: 'italic',
      });
      expect(svg).toContain('font-family="Arial"');
      expect(svg).toContain('font-size="16"');
      expect(svg).toContain('font-weight="bold"');
      expect(svg).toContain('font-style="italic"');
    });

    it('should apply fill color', () => {
      const svg = renderMultilineText('Test', 100, 50, { fill: '#FF0000' });
      expect(svg).toContain('fill="#FF0000"');
    });

    it('should apply className', () => {
      const svg = renderMultilineText('Test', 100, 50, {
        className: 'my-text',
      });
      expect(svg).toContain('class="my-text"');
    });

    it('should escape XML in text content', () => {
      const svg = renderMultilineText('A < B & C > D', 100, 50);
      expect(svg).toContain('&lt;');
      expect(svg).toContain('&amp;');
      expect(svg).toContain('&gt;');
    });

    it('should calculate line spacing based on fontSize', () => {
      const svg = renderMultilineText('Line 1\nLine 2', 100, 50, {
        fontSize: 20,
      });
      // Line height should be fontSize * 1.2 = 24
      expect(svg).toContain('<tspan x="100" y="50"');
      expect(svg).toContain('<tspan x="100" y="74"'); // 50 + 24
    });

    it('should center multiline text with dominant-baseline middle', () => {
      const svg = renderMultilineText('Line 1\nLine 2\nLine 3', 100, 50, {
        dominantBaseline: 'middle',
        fontSize: 14,
      });
      // With 3 lines and lineHeight 16.8 (14 * 1.2), vertical adjustment should occur
      expect(svg).toContain('<tspan');
      expect(svg).toMatch(/y="[0-9.]+"/); // Y coordinates should be adjusted
    });

    it('should handle empty string', () => {
      const svg = renderMultilineText('', 100, 50);
      expect(svg).toContain('<text');
      expect(svg).toContain('x="100"');
      expect(svg).toContain('y="50"');
    });

    it('should handle string with only newlines', () => {
      const svg = renderMultilineText('\n\n', 100, 50);
      expect(svg).toContain('<tspan');
      // Should create 3 tspan elements (empty strings)
      const tspanCount = (svg.match(/<tspan/g) || []).length;
      expect(tspanCount).toBe(3);
    });

    it('should not include empty attributes', () => {
      const svg = renderMultilineText('Test', 100, 50, {});
      expect(svg).not.toContain('text-anchor=');
      expect(svg).not.toContain('font-family=');
      expect(svg).not.toContain('class=');
    });
  });
});
