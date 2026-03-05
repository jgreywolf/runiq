/**
 * Diagram State Management
 * Centralized state for diagram data using Svelte 5 runes
 */

import { SvelteMap } from 'svelte/reactivity';
import type { DiagramProfile } from '@runiq/parser-dsl';
import type { DiagramElement } from '../types/editor';

/**
 * Manages diagram profile, elements, code, and parse results
 */
export class DiagramState {
	// Diagram profile
	profile = $state<DiagramProfile | null>(null);

	// Elements (nodes and edges)
	elements = $state<SvelteMap<string, DiagramElement>>(new SvelteMap());

	// Source code and data
	code = $state<string>('');
	dataContent = $state<string>('');

	// Parse results
	errors = $state<string[]>([]);
	warnings = $state<string[]>([]);

	// Derived state
	hasProfile = $derived(this.profile !== null);
	hasElements = $derived(this.elements.size > 0);
	elementCount = $derived(this.elements.size);
	elementArray = $derived(Array.from(this.elements.values()));
	nodes = $derived(this.elementArray.filter((e) => e.type === 'node'));
	edges = $derived(this.elementArray.filter((e) => e.type === 'edge'));
	hasErrors = $derived(this.errors.length > 0);
	hasWarnings = $derived(this.warnings.length > 0);

	// ========================================================================
	// Profile Management
	// ========================================================================

	setProfile(profile: DiagramProfile | null) {
		this.profile = profile;
	}

	clearProfile() {
		this.profile = null;
	}

	// ========================================================================
	// Element Management
	// ========================================================================

	/**
	 * Add or replace element
	 */
	addElement(element: DiagramElement) {
		this.elements.set(element.id, element);
	}

	/**
	 * Update element properties
	 */
	updateElement(id: string, updates: Partial<DiagramElement>) {
		const element = this.elements.get(id);
		if (element) {
			this.elements.set(id, { ...element, ...updates });
		}
	}

	/**
	 * Delete element by ID
	 */
	deleteElement(id: string) {
		this.elements.delete(id);
	}

	/**
	 * Delete multiple elements
	 */
	deleteElements(ids: string[]) {
		ids.forEach((id) => this.elements.delete(id));
	}

	/**
	 * Get element by ID
	 */
	getElement(id: string): DiagramElement | undefined {
		return this.elements.get(id);
	}

	/**
	 * Check if element exists
	 */
	hasElement(id: string): boolean {
		return this.elements.has(id);
	}

	/**
	 * Clear all elements
	 */
	clearElements() {
		this.elements.clear();
	}

	// ========================================================================
	// Code Management
	// ========================================================================

	setCode(code: string) {
		this.code = code;
	}

	clearCode() {
		this.code = '';
	}

	// ========================================================================
	// Data Content Management
	// ========================================================================

	setDataContent(data: string) {
		this.dataContent = data;
	}

	clearDataContent() {
		this.dataContent = '';
	}

	// ========================================================================
	// Error Management
	// ========================================================================

	setErrors(errors: string[]) {
		this.errors = errors;
	}

	addError(error: string) {
		this.errors.push(error);
	}

	clearErrors() {
		this.errors = [];
	}

	// ========================================================================
	// Warning Management
	// ========================================================================

	setWarnings(warnings: string[]) {
		this.warnings = warnings;
	}

	addWarning(warning: string) {
		this.warnings.push(warning);
	}

	clearWarnings() {
		this.warnings = [];
	}

	// ========================================================================
	// Clear All State
	// ========================================================================

	clearAll() {
		this.profile = null;
		this.elements.clear();
		this.code = '';
		this.dataContent = '';
		this.errors = [];
		this.warnings = [];
	}
}

// Export singleton instance
export const diagramState = new DiagramState();
