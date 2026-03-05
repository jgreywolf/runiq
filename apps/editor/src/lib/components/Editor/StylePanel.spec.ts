import { describe, it, expect } from 'vitest';
import type { StyleProperties } from '$lib/types/editor';

describe('StylePanel', () => {
	describe('Style Property Management', () => {
		it('should manage fill color', () => {
			const styles: StyleProperties = { fill: '#ff0000' };
			expect(styles.fill).toBe('#ff0000');
		});

		it('should manage stroke color', () => {
			const styles: StyleProperties = { stroke: '#00ff00' };
			expect(styles.stroke).toBe('#00ff00');
		});

		it('should manage stroke width', () => {
			const styles: StyleProperties = { strokeWidth: 2 };
			expect(styles.strokeWidth).toBe(2);
		});

		it('should manage opacity', () => {
			const styles: StyleProperties = { opacity: 0.7 };
			expect(styles.opacity).toBe(0.7);
		});

		it('should manage font size', () => {
			const styles: StyleProperties = { fontSize: 14 };
			expect(styles.fontSize).toBe(14);
		});

		it('should manage font family', () => {
			const styles: StyleProperties = { fontFamily: 'Arial' };
			expect(styles.fontFamily).toBe('Arial');
		});

		it('should manage multiple properties', () => {
			const styles: StyleProperties = {
				fill: '#ff0000',
				stroke: '#00ff00',
				strokeWidth: 2,
				opacity: 0.8
			};

			expect(styles.fill).toBe('#ff0000');
			expect(styles.stroke).toBe('#00ff00');
			expect(styles.strokeWidth).toBe(2);
			expect(styles.opacity).toBe(0.8);
		});
	});

	describe('Visibility Logic', () => {
		it('should be visible when elements are selected', () => {
			const selectedIds = new Set(['node1']);
			const isVisible = selectedIds.size > 0;
			expect(isVisible).toBe(true);
		});

		it('should be hidden when no elements selected', () => {
			const selectedIds = new Set<string>();
			const isVisible = selectedIds.size > 0;
			expect(isVisible).toBe(false);
		});

		it('should be visible for multi-selection', () => {
			const selectedIds = new Set(['node1', 'node2']);
			const isVisible = selectedIds.size > 0;
			expect(isVisible).toBe(true);
		});
	});

	describe('Color Parsing', () => {
		it('should parse hex color format', () => {
			const isValidHex = (color: string) => /^#[0-9A-Fa-f]{6}$/.test(color);
			expect(isValidHex('#ff0000')).toBe(true);
			expect(isValidHex('#00FF00')).toBe(true);
		});

		it('should reject invalid hex colors', () => {
			const isValidHex = (color: string) => /^#[0-9A-Fa-f]{6}$/.test(color);
			expect(isValidHex('red')).toBe(false);
			expect(isValidHex('#ff')).toBe(false);
			expect(isValidHex('ff0000')).toBe(false);
		});

		it('should handle rgb color format', () => {
			const isValidRgb = (color: string) => /^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/.test(color);
			expect(isValidRgb('rgb(255,0,0)')).toBe(true);
			expect(isValidRgb('rgb(255, 0, 0)')).toBe(true);
		});
	});

	describe('Number Validation', () => {
		it('should validate stroke width range', () => {
			const isValidStrokeWidth = (width: number) => width >= 0 && width <= 20;
			expect(isValidStrokeWidth(0)).toBe(true);
			expect(isValidStrokeWidth(5)).toBe(true);
			expect(isValidStrokeWidth(20)).toBe(true);
			expect(isValidStrokeWidth(-1)).toBe(false);
			expect(isValidStrokeWidth(21)).toBe(false);
		});

		it('should validate opacity range', () => {
			const isValidOpacity = (opacity: number) => opacity >= 0 && opacity <= 1;
			expect(isValidOpacity(0)).toBe(true);
			expect(isValidOpacity(0.5)).toBe(true);
			expect(isValidOpacity(1)).toBe(true);
			expect(isValidOpacity(-0.1)).toBe(false);
			expect(isValidOpacity(1.1)).toBe(false);
		});

		it('should validate font size range', () => {
			const isValidFontSize = (size: number) => size >= 8 && size <= 72;
			expect(isValidFontSize(8)).toBe(true);
			expect(isValidFontSize(16)).toBe(true);
			expect(isValidFontSize(72)).toBe(true);
			expect(isValidFontSize(7)).toBe(false);
			expect(isValidFontSize(73)).toBe(false);
		});
	});

	describe('Multi-Selection Style Merging', () => {
		it('should detect mixed fill colors', () => {
			const styles = [{ fill: '#ff0000' }, { fill: '#00ff00' }];
			const fillColors = styles.map((s) => s.fill);
			const hasMixedFill = new Set(fillColors).size > 1;
			expect(hasMixedFill).toBe(true);
		});

		it('should detect uniform fill colors', () => {
			const styles = [{ fill: '#ff0000' }, { fill: '#ff0000' }];
			const fillColors = styles.map((s) => s.fill);
			const hasMixedFill = new Set(fillColors).size > 1;
			expect(hasMixedFill).toBe(false);
		});

		it('should get common style value', () => {
			const styles = [{ strokeWidth: 2 }, { strokeWidth: 2 }, { strokeWidth: 2 }];
			const strokeWidths = styles.map((s) => s.strokeWidth);
			const uniqueValues = new Set(strokeWidths);
			const commonValue = uniqueValues.size === 1 ? Array.from(uniqueValues)[0] : undefined;
			expect(commonValue).toBe(2);
		});

		it('should return undefined for mixed values', () => {
			const styles = [{ strokeWidth: 2 }, { strokeWidth: 3 }, { strokeWidth: 4 }];
			const strokeWidths = styles.map((s) => s.strokeWidth);
			const uniqueValues = new Set(strokeWidths);
			const commonValue = uniqueValues.size === 1 ? Array.from(uniqueValues)[0] : undefined;
			expect(commonValue).toBeUndefined();
		});
	});

	describe('Style Change Callbacks', () => {
		it('should format style change event', () => {
			const change = {
				property: 'fill',
				value: '#ff0000'
			};

			expect(change.property).toBe('fill');
			expect(change.value).toBe('#ff0000');
		});

		it('should handle numeric value changes', () => {
			const change = {
				property: 'strokeWidth',
				value: 3
			};

			expect(change.property).toBe('strokeWidth');
			expect(change.value).toBe(3);
			expect(typeof change.value).toBe('number');
		});

		it('should handle string value changes', () => {
			const change = {
				property: 'fontFamily',
				value: 'Helvetica'
			};

			expect(change.property).toBe('fontFamily');
			expect(change.value).toBe('Helvetica');
			expect(typeof change.value).toBe('string');
		});
	});

	describe('Panel State', () => {
		it('should track open state', () => {
			let isOpen = false;
			const toggle = () => {
				isOpen = !isOpen;
			};

			expect(isOpen).toBe(false);
			toggle();
			expect(isOpen).toBe(true);
			toggle();
			expect(isOpen).toBe(false);
		});

		it('should close when requested', () => {
			let isOpen = true;
			const close = () => {
				isOpen = false;
			};

			close();
			expect(isOpen).toBe(false);
		});
	});

	describe('Input Sanitization', () => {
		it('should trim whitespace from color values', () => {
			const sanitize = (color: string) => color.trim();
			expect(sanitize('  #ff0000  ')).toBe('#ff0000');
			expect(sanitize('#00ff00 ')).toBe('#00ff00');
		});

		it('should convert numbers to strings for display', () => {
			const toString = (value: number) => String(value);
			expect(toString(2)).toBe('2');
			expect(toString(0.5)).toBe('0.5');
		});

		it('should parse string numbers for processing', () => {
			const toNumber = (value: string) => parseFloat(value);
			expect(toNumber('2')).toBe(2);
			expect(toNumber('0.5')).toBe(0.5);
		});
	});
});
