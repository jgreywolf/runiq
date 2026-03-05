import { describe, expect, it } from 'vitest';
import { unescapeString } from './string-utils.js';

describe('string-utils', () => {
  describe('unescapeString', () => {
    describe('Quote Removal', () => {
      it('should remove surrounding double quotes', () => {
        expect(unescapeString('"hello"')).toBe('hello');
      });

      it('should remove surrounding double quotes from empty string', () => {
        expect(unescapeString('""')).toBe('');
      });

      it('should not remove quotes if only at start', () => {
        expect(unescapeString('"hello')).toBe('"hello');
      });

      it('should not remove quotes if only at end', () => {
        expect(unescapeString('hello"')).toBe('hello"');
      });

      it('should preserve string without quotes', () => {
        expect(unescapeString('hello')).toBe('hello');
      });

      it('should remove quotes from string with spaces', () => {
        expect(unescapeString('"hello world"')).toBe('hello world');
      });

      it('should remove quotes from string with special characters', () => {
        expect(unescapeString('"hello@world#123"')).toBe('hello@world#123');
      });
    });

    describe('Escaped Quotes', () => {
      it('should unescape \\" to "', () => {
        expect(unescapeString('\\"hello\\"')).toBe('"hello"');
      });

      it('should unescape \\" in middle of string', () => {
        expect(unescapeString('say \\"hello\\"')).toBe('say "hello"');
      });

      it('should handle multiple escaped quotes', () => {
        expect(unescapeString('\\"one\\" and \\"two\\"')).toBe(
          '"one" and "two"'
        );
      });

      it('should unescape quotes after removing surrounding quotes', () => {
        expect(unescapeString('"say \\"hello\\""')).toBe('say "hello"');
      });
    });

    describe('Newline Escapes', () => {
      it('should unescape \\n to actual newline', () => {
        expect(unescapeString('line1\\nline2')).toBe('line1\nline2');
      });

      it('should handle multiple newlines', () => {
        expect(unescapeString('a\\nb\\nc')).toBe('a\nb\nc');
      });

      it('should unescape newlines in quoted strings', () => {
        expect(unescapeString('"line1\\nline2"')).toBe('line1\nline2');
      });

      it('should preserve actual newline characters', () => {
        const actual = 'line1\nline2';
        expect(unescapeString(actual)).toBe(actual);
      });
    });

    describe('Tab Escapes', () => {
      it('should unescape \\t to actual tab', () => {
        expect(unescapeString('col1\\tcol2')).toBe('col1\tcol2');
      });

      it('should handle multiple tabs', () => {
        expect(unescapeString('a\\tb\\tc')).toBe('a\tb\tc');
      });

      it('should unescape tabs in quoted strings', () => {
        expect(unescapeString('"a\\tb"')).toBe('a\tb');
      });
    });

    describe('Carriage Return Escapes', () => {
      it('should unescape \\r to actual carriage return', () => {
        expect(unescapeString('line1\\rline2')).toBe('line1\rline2');
      });

      it('should handle \\r\\n sequences', () => {
        expect(unescapeString('line1\\r\\nline2')).toBe('line1\r\nline2');
      });
    });

    describe('Backslash Escapes', () => {
      it('should unescape \\\\ to single backslash', () => {
        const input = 'A\\\\\\\\B'; // 4 backslashes
        const result = unescapeString(input);
        const expected = 'A\\\\B'; // 2 backslashes
        expect(result).toBe(expected);
      });

      it('should handle multiple escaped backslashes', () => {
        expect(unescapeString('\\\\\\\\')).toBe('\\\\');
      });

      it('should unescape backslashes in quoted strings', () => {
        expect(unescapeString('"C:\\\\Users\\\\file"')).toBe('C:\\Users\\file');
      });

      it('should preserve single unescaped backslash', () => {
        // Single backslash not followed by escapable char
        expect(unescapeString('test\\x')).toBe('test\\x');
      });
    });

    describe('Mixed Escape Sequences', () => {
      it('should handle quotes and newlines together', () => {
        expect(unescapeString('"line1\\n\\"quoted\\""')).toBe(
          'line1\n"quoted"'
        );
      });

      it('should handle all escape types in one string', () => {
        expect(unescapeString('"a\\nb\\tc\\"d\\"e\\\\f"')).toBe(
          'a\nb\tc"d"e\\f'
        );
      });

      it('should process escapes in correct order', () => {
        // Backslash must be last to avoid double-unescaping
        expect(unescapeString('\\\\\\"')).toBe('\\"');
      });

      it('should handle complex real-world example', () => {
        const input = '"Path: C:\\\\Users\\\\docs\\nLine 2: \\"value\\""';
        const expected = 'Path: C:\\Users\\docs\nLine 2: "value"';
        expect(unescapeString(input)).toBe(expected);
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty string', () => {
        expect(unescapeString('')).toBe('');
      });

      it('should handle string with only quotes', () => {
        expect(unescapeString('""')).toBe('');
      });

      it('should handle string with only escapes', () => {
        expect(unescapeString('\\n\\t\\r')).toBe('\n\t\r');
      });

      it('should preserve Unicode characters', () => {
        expect(unescapeString('"Hello 世界 🌍"')).toBe('Hello 世界 🌍');
      });

      it('should handle escaped characters at string boundaries', () => {
        expect(unescapeString('\\n')).toBe('\n');
        expect(unescapeString('a\\n')).toBe('a\n');
        expect(unescapeString('\\na')).toBe('\na');
      });

      it('should not double-process already unescaped strings', () => {
        const input = 'already\nunescaped';
        expect(unescapeString(input)).toBe(input);
      });
    });

    describe('DSL Integration Scenarios', () => {
      it('should handle node labels with quotes', () => {
        expect(unescapeString('"Node \\"Label\\""')).toBe('Node "Label"');
      });

      it('should handle multiline descriptions', () => {
        expect(unescapeString('"Line 1\\nLine 2\\nLine 3"')).toBe(
          'Line 1\nLine 2\nLine 3'
        );
      });

      it('should handle file paths in data', () => {
        expect(unescapeString('"C:\\\\Program Files\\\\App"')).toBe(
          'C:\\Program Files\\App'
        );
      });

      it('should handle JSON-like data strings', () => {
        expect(unescapeString('"{\\n  \\"key\\": \\"value\\"\\n}"')).toBe(
          '{\n  "key": "value"\n}'
        );
      });
    });
  });
});
