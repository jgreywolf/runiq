import { describe, expect, it } from 'vitest';
import {
	escapeLabel,
	extractElementData,
	formatPropertyValue,
	generateShapeCode,
	type ClipboardItem
} from './codeHelpers';

describe('codeHelpers', () => {
	describe('generateShapeCode', () => {
		it('should generate code for a node preserving shape and label', () => {
			const item: ClipboardItem = {
				type: 'node',
				id: 'node1',
				data: { id: 'node1', shape: 'rhombus', label: 'Decision' }
			};
			const result = generateShapeCode(item, 'node2');
			expect(result).toBe('shape node2 as @rhombus label:"Decision"');
		});

		it('should fallback to rectangle and copy label when shape metadata is missing', () => {
			const item: ClipboardItem = {
				type: 'node',
				id: 'node1',
				data: { id: 'node1' }
			};
			const result = generateShapeCode(item, 'node2');
			expect(result).toBe('shape node2 as @rectangle label:"Copy of node1"');
		});

		it('should generate code for an edge', () => {
			const item: ClipboardItem = {
				type: 'edge',
				id: 'edge1',
				data: { id: 'edge1' }
			};
			const result = generateShapeCode(item, 'edge2');
			expect(result).toBe('edge1 -> edge2');
		});
	});

	describe('extractElementData', () => {
		it('should extract node ID from SVG element', () => {
			const mockElement = {
				getAttribute: (attr: string) => {
					if (attr === 'data-node-id') return 'node1';
					if (attr === 'data-node-shape') return 'circle';
					return null;
				},
				querySelector: (selector: string) =>
					selector === 'text'
						? ({
								textContent: 'Node Label'
							} as Element)
						: null
			} as Element;

			const result = extractElementData(mockElement, 'node');
			expect(result.id).toBe('node1');
			expect(result.shape).toBe('circle');
			expect(result.label).toBe('Node Label');
		});

		it('should extract edge ID from SVG element', () => {
			const mockElement = {
				getAttribute: (attr: string) => (attr === 'data-edge-id' ? 'edge1' : null)
			} as Element;

			const result = extractElementData(mockElement, 'edge');
			expect(result.id).toBe('edge1');
		});

		it('should return null ID if attribute missing', () => {
			const mockElement = {
				getAttribute: () => null,
				querySelector: () => null
			} as unknown as Element;

			const result = extractElementData(mockElement, 'node');
			expect(result.id).toBeNull();
		});
	});

	describe('escapeLabel', () => {
		it('should escape backslashes', () => {
			expect(escapeLabel('C:\\path\\file')).toBe('C:\\\\path\\\\file');
		});

		it('should escape quotes', () => {
			expect(escapeLabel('He said "hello"')).toBe('He said \\"hello\\"');
		});

		it('should escape newlines', () => {
			expect(escapeLabel('Line 1\nLine 2')).toBe('Line 1\\nLine 2');
		});

		it('should handle multiple escape sequences', () => {
			expect(escapeLabel('Path: C:\\dir\nName: "test"')).toBe('Path: C:\\\\dir\\nName: \\"test\\"');
		});

		it('should return empty string for empty input', () => {
			expect(escapeLabel('')).toBe('');
		});

		it('should not modify normal text', () => {
			expect(escapeLabel('Normal text')).toBe('Normal text');
		});
	});

	describe('formatPropertyValue', () => {
		it('should format string values with quotes', () => {
			expect(formatPropertyValue('hello')).toBe('"hello"');
		});

		it('should format string values with escaping', () => {
			expect(formatPropertyValue('Say "hi"')).toBe('"Say \\"hi\\""');
		});

		it('should format number values', () => {
			expect(formatPropertyValue(42)).toBe('42');
			expect(formatPropertyValue(3.14)).toBe('3.14');
			expect(formatPropertyValue(0)).toBe('0');
		});

		it('should format boolean values', () => {
			expect(formatPropertyValue(true)).toBe('true');
			expect(formatPropertyValue(false)).toBe('false');
		});

		it('should convert null to string', () => {
			expect(formatPropertyValue(null)).toBe('null');
		});

		it('should convert undefined to string', () => {
			expect(formatPropertyValue(undefined)).toBe('undefined');
		});

		it('should convert objects to string', () => {
			const obj = { key: 'value' };
			expect(formatPropertyValue(obj)).toBe('[object Object]');
		});

		it('should convert arrays to string', () => {
			expect(formatPropertyValue([1, 2, 3])).toBe('1,2,3');
		});
	});
});
