/**
 * Editor State Management
 * Centralized state for the visual editor using Svelte 5 runes
 */

import { SvelteSet } from 'svelte/reactivity';
import type { EditorMode, SelectionState, ViewportState, BoundingBox } from '../types/editor';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;

/**
 * Manages editor mode, selection, and canvas state
 */
export class CanvasState {
	// Editor mode (select, pan, connect)
	mode = $state<EditorMode>('select');

	// Selection state
	selection = $state<SelectionState>({
		selectedIds: new SvelteSet<string>(),
		hoveredId: null,
		lassoBox: null
	});

	// Canvas state (pan, zoom, drag)
	canvas = $state<ViewportState>({
		panOffset: { x: 0, y: 0 },
		zoom: 1,
		isDragging: false,
		isPanning: false
	});

	// Derived state
	hasSelection = $derived(this.selection.selectedIds.size > 0);
	isMultiSelect = $derived(this.selection.selectedIds.size > 1);
	selectedCount = $derived(this.selection.selectedIds.size);

	// ========================================================================
	// Mode Management
	// ========================================================================

	setMode(mode: EditorMode) {
		this.mode = mode;
	}

	// ========================================================================
	// Selection Management
	// ========================================================================

	/**
	 * Add element to selection (multi-select)
	 */
	addToSelection(id: string) {
		this.selection.selectedIds.add(id);
	}

	/**
	 * Remove element from selection
	 */
	removeFromSelection(id: string) {
		this.selection.selectedIds.delete(id);
	}

	/**
	 * Toggle element selection (add if not present, remove if present)
	 */
	toggleSelection(id: string) {
		if (this.selection.selectedIds.has(id)) {
			this.selection.selectedIds.delete(id);
		} else {
			this.selection.selectedIds.add(id);
		}
	}

	/**
	 * Replace current selection with single element or array of elements
	 */
	setSelection(ids: string | string[]) {
		this.selection.selectedIds.clear();
		const idsArray = Array.isArray(ids) ? ids : [ids];
		idsArray.forEach((id) => this.selection.selectedIds.add(id));
	}

	/**
	 * Clear all selections
	 */
	clearSelection() {
		this.selection.selectedIds.clear();
		this.selection.hoveredId = null;
		this.selection.lassoBox = null;
	}

	/**
	 * Get array of selected IDs
	 */
	getSelectedIds(): string[] {
		return Array.from(this.selection.selectedIds);
	}

	/**
	 * Check if element is selected
	 */
	isSelected(id: string): boolean {
		return this.selection.selectedIds.has(id);
	}

	// ========================================================================
	// Hover State
	// ========================================================================

	setHovered(id: string | null) {
		this.selection.hoveredId = id;
	}

	// ========================================================================
	// Lasso Selection
	// ========================================================================

	setLassoBox(box: BoundingBox) {
		this.selection.lassoBox = box;
	}

	clearLassoBox() {
		this.selection.lassoBox = null;
	}

	// ========================================================================
	// Canvas Management
	// ========================================================================

	setPanOffset(x: number, y: number) {
		this.canvas.panOffset = { x, y };
	}

	setZoom(zoom: number) {
		// Clamp zoom to min/max range
		this.canvas.zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
	}

	setDragging(isDragging: boolean) {
		this.canvas.isDragging = isDragging;
	}

	setPanning(isPanning: boolean) {
		this.canvas.isPanning = isPanning;
	}

	resetCanvas() {
		this.canvas.panOffset = { x: 0, y: 0 };
		this.canvas.zoom = 1;
		this.canvas.isDragging = false;
		this.canvas.isPanning = false;
	}

	// ========================================================================
	// Clear All State
	// ========================================================================

	clearAll() {
		this.mode = 'select';
		this.clearSelection();
		this.resetCanvas();
	}
}

// Export singleton instance
export const canvasState = new CanvasState();
