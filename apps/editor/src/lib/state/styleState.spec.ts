import { describe, it, expect, beforeEach } from 'vitest';
import { StyleState } from './styleState.svelte';

describe('StyleState', () => {
	let styleState: StyleState;

	beforeEach(() => {
		styleState = new StyleState();
	});

	describe('Initialization', () => {
		it('should initialize with empty styles', () => {
			expect(styleState.currentStyles).toEqual({});
		});

		it('should initialize as not visible', () => {
			expect(styleState.isVisible).toBe(false);
		});

		it('should initialize with no mixed values', () => {
			expect(styleState.hasMixedValues).toBe(false);
		});
	});

	describe('Visibility Management', () => {
		it('should show panel', () => {
			styleState.show();
			expect(styleState.isVisible).toBe(true);
		});

		it('should hide panel', () => {
			styleState.show();
			styleState.hide();
			expect(styleState.isVisible).toBe(false);
		});

		it('should toggle visibility from hidden to visible', () => {
			styleState.toggle();
			expect(styleState.isVisible).toBe(true);
		});

		it('should toggle visibility from visible to hidden', () => {
			styleState.show();
			styleState.toggle();
			expect(styleState.isVisible).toBe(false);
		});
	});

	describe('Style Properties Management', () => {
		it('should set single style property', () => {
			styleState.setStyle('fill', '#ff0000');
			expect(styleState.currentStyles.fill).toBe('#ff0000');
		});

		it('should set multiple style properties individually', () => {
			styleState.setStyle('fill', '#ff0000');
			styleState.setStyle('stroke', '#00ff00');
			expect(styleState.currentStyles.fill).toBe('#ff0000');
			expect(styleState.currentStyles.stroke).toBe('#00ff00');
		});

		it('should update existing style property', () => {
			styleState.setStyle('fill', '#ff0000');
			styleState.setStyle('fill', '#00ff00');
			expect(styleState.currentStyles.fill).toBe('#00ff00');
		});

		it('should set multiple styles at once', () => {
			const styles = {
				fill: '#ff0000',
				stroke: '#00ff00',
				strokeWidth: 2
			};
			styleState.setStyles(styles);
			expect(styleState.currentStyles).toEqual(styles);
		});

		it('should merge styles when setting multiple styles', () => {
			styleState.setStyle('opacity', 0.5);
			styleState.setStyles({ fill: '#ff0000', stroke: '#00ff00' });
			expect(styleState.currentStyles).toEqual({
				opacity: 0.5,
				fill: '#ff0000',
				stroke: '#00ff00'
			});
		});

		it('should get style property value', () => {
			styleState.setStyle('fill', '#ff0000');
			expect(styleState.getStyle('fill')).toBe('#ff0000');
		});

		it('should return undefined for non-existent property', () => {
			expect(styleState.getStyle('fill')).toBeUndefined();
		});

		it('should remove style property', () => {
			styleState.setStyles({ fill: '#ff0000', stroke: '#00ff00' });
			styleState.removeStyle('fill');
			expect(styleState.currentStyles.fill).toBeUndefined();
			expect(styleState.currentStyles.stroke).toBe('#00ff00');
		});

		it('should clear all styles', () => {
			styleState.setStyles({ fill: '#ff0000', stroke: '#00ff00', opacity: 0.5 });
			styleState.clearStyles();
			expect(styleState.currentStyles).toEqual({});
		});
	});

	describe('Mixed Values Management', () => {
		it('should set mixed values flag', () => {
			styleState.setMixedValues(true);
			expect(styleState.hasMixedValues).toBe(true);
		});

		it('should clear mixed values flag', () => {
			styleState.setMixedValues(true);
			styleState.setMixedValues(false);
			expect(styleState.hasMixedValues).toBe(false);
		});
	});

	describe('Common Style Properties', () => {
		it('should handle fill color', () => {
			styleState.setFill('#ff0000');
			expect(styleState.fill).toBe('#ff0000');
		});

		it('should handle stroke color', () => {
			styleState.setStroke('#00ff00');
			expect(styleState.stroke).toBe('#00ff00');
		});

		it('should handle stroke width', () => {
			styleState.setStrokeWidth(3);
			expect(styleState.strokeWidth).toBe(3);
		});

		it('should handle opacity', () => {
			styleState.setOpacity(0.7);
			expect(styleState.opacity).toBe(0.7);
		});

		it('should clamp opacity to 0-1 range (minimum)', () => {
			styleState.setOpacity(-0.5);
			expect(styleState.opacity).toBeGreaterThanOrEqual(0);
		});

		it('should clamp opacity to 0-1 range (maximum)', () => {
			styleState.setOpacity(1.5);
			expect(styleState.opacity).toBeLessThanOrEqual(1);
		});

		it('should handle font size', () => {
			styleState.setFontSize(16);
			expect(styleState.fontSize).toBe(16);
		});

		it('should handle font family', () => {
			styleState.setFontFamily('Arial');
			expect(styleState.fontFamily).toBe('Arial');
		});
	});

	describe('Derived State', () => {
		it('should report hasStyles as false when empty', () => {
			expect(styleState.hasStyles).toBe(false);
		});

		it('should report hasStyles as true when not empty', () => {
			styleState.setStyle('fill', '#ff0000');
			expect(styleState.hasStyles).toBe(true);
		});

		it('should derive fill color', () => {
			styleState.setStyle('fill', '#ff0000');
			expect(styleState.fill).toBe('#ff0000');
		});

		it('should derive stroke color', () => {
			styleState.setStyle('stroke', '#00ff00');
			expect(styleState.stroke).toBe('#00ff00');
		});

		it('should derive stroke width', () => {
			styleState.setStyle('strokeWidth', 2);
			expect(styleState.strokeWidth).toBe(2);
		});

		it('should derive opacity', () => {
			styleState.setStyle('opacity', 0.5);
			expect(styleState.opacity).toBe(0.5);
		});

		it('should derive font size', () => {
			styleState.setStyle('fontSize', 14);
			expect(styleState.fontSize).toBe(14);
		});

		it('should derive font family', () => {
			styleState.setStyle('fontFamily', 'Helvetica');
			expect(styleState.fontFamily).toBe('Helvetica');
		});
	});

	describe('Reset State', () => {
		it('should reset all state', () => {
			styleState.show();
			styleState.setStyles({ fill: '#ff0000', stroke: '#00ff00' });
			styleState.setMixedValues(true);

			styleState.reset();

			expect(styleState.isVisible).toBe(false);
			expect(styleState.currentStyles).toEqual({});
			expect(styleState.hasMixedValues).toBe(false);
		});
	});
});
