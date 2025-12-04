/**
 * Style State Management
 * Centralized state for style panel using Svelte 5 runes
 */

import type { StyleProperties } from '../types/editor';

/**
 * Manages style panel visibility and current style values
 */
export class StyleState {
	// Style properties
	currentStyles = $state<StyleProperties>({});

	// Panel visibility
	isVisible = $state<boolean>(false);

	// Mixed values indicator (multi-selection with different values)
	hasMixedValues = $state<boolean>(false);

	// Derived state
	hasStyles = $derived(Object.keys(this.currentStyles).length > 0);
	fill = $derived(this.currentStyles.fill);
	stroke = $derived(this.currentStyles.stroke);
	strokeWidth = $derived(this.currentStyles.strokeWidth);
	opacity = $derived(this.currentStyles.opacity);
	fontSize = $derived(this.currentStyles.fontSize);
	fontFamily = $derived(this.currentStyles.fontFamily);

	// ========================================================================
	// Visibility Management
	// ========================================================================

	show() {
		this.isVisible = true;
	}

	hide() {
		this.isVisible = false;
	}

	toggle() {
		this.isVisible = !this.isVisible;
	}

	// ========================================================================
	// Style Properties Management
	// ========================================================================

	/**
	 * Set a single style property
	 */
	setStyle(key: string, value: unknown) {
		this.currentStyles = { ...this.currentStyles, [key]: value };
	}

	/**
	 * Set multiple style properties at once
	 */
	setStyles(styles: StyleProperties) {
		this.currentStyles = { ...this.currentStyles, ...styles };
	}

	/**
	 * Get style property value
	 */
	getStyle(key: string): unknown {
		return this.currentStyles[key];
	}

	/**
	 * Remove a style property
	 */
	removeStyle(key: string) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { [key]: _removed, ...rest } = this.currentStyles;
		this.currentStyles = rest;
	}

	/**
	 * Clear all style properties
	 */
	clearStyles() {
		this.currentStyles = {};
	}

	// ========================================================================
	// Mixed Values Management
	// ========================================================================

	setMixedValues(mixed: boolean) {
		this.hasMixedValues = mixed;
	}

	// ========================================================================
	// Common Style Property Helpers
	// ========================================================================

	setFill(color: string) {
		this.setStyle('fill', color);
	}

	setStroke(color: string) {
		this.setStyle('stroke', color);
	}

	setStrokeWidth(width: number) {
		this.setStyle('strokeWidth', width);
	}

	setOpacity(opacity: number) {
		// Clamp opacity to 0-1 range
		this.setStyle('opacity', Math.max(0, Math.min(1, opacity)));
	}

	setFontSize(size: number) {
		this.setStyle('fontSize', size);
	}

	setFontFamily(family: string) {
		this.setStyle('fontFamily', family);
	}

	// ========================================================================
	// Reset State
	// ========================================================================

	reset() {
		this.currentStyles = {};
		this.isVisible = false;
		this.hasMixedValues = false;
	}
}

// Export singleton instance
export const styleState = new StyleState();
