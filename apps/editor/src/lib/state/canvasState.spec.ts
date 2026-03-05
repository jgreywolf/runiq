import { describe, it, expect, beforeEach } from 'vitest';
import { CanvasState } from './canvasState.svelte';

describe('EditorState', () => {
	let editorState: CanvasState;

	beforeEach(() => {
		editorState = new CanvasState();
	});

	describe('Mode Management', () => {
		it('should initialize with select mode', () => {
			expect(editorState.mode).toBe('select');
		});

		it('should switch to connect mode', () => {
			editorState.setMode('connect');
			expect(editorState.mode).toBe('connect');
		});

		it('should switch back to select mode', () => {
			editorState.setMode('connect');
			editorState.setMode('select');
			expect(editorState.mode).toBe('select');
		});
	});

	describe('Selection Management', () => {
		it('should initialize with empty selection', () => {
			expect(editorState.selection.selectedIds.size).toBe(0);
			expect(editorState.selection.hoveredId).toBeNull();
			expect(editorState.selection.lassoBox).toBeNull();
		});

		it('should add element to selection', () => {
			editorState.addToSelection('node1');
			expect(editorState.selection.selectedIds.has('node1')).toBe(true);
			expect(editorState.selection.selectedIds.size).toBe(1);
		});

		it('should add multiple elements to selection', () => {
			editorState.addToSelection('node1');
			editorState.addToSelection('node2');
			expect(editorState.selection.selectedIds.size).toBe(2);
			expect(editorState.selection.selectedIds.has('node1')).toBe(true);
			expect(editorState.selection.selectedIds.has('node2')).toBe(true);
		});

		it('should not add duplicate elements', () => {
			editorState.addToSelection('node1');
			editorState.addToSelection('node1');
			expect(editorState.selection.selectedIds.size).toBe(1);
		});

		it('should remove element from selection', () => {
			editorState.addToSelection('node1');
			editorState.addToSelection('node2');
			editorState.removeFromSelection('node1');
			expect(editorState.selection.selectedIds.has('node1')).toBe(false);
			expect(editorState.selection.selectedIds.has('node2')).toBe(true);
			expect(editorState.selection.selectedIds.size).toBe(1);
		});

		it('should toggle element selection (add when not present)', () => {
			editorState.toggleSelection('node1');
			expect(editorState.selection.selectedIds.has('node1')).toBe(true);
		});

		it('should toggle element selection (remove when present)', () => {
			editorState.addToSelection('node1');
			editorState.toggleSelection('node1');
			expect(editorState.selection.selectedIds.has('node1')).toBe(false);
		});

		it('should replace selection with single element', () => {
			editorState.addToSelection('node1');
			editorState.addToSelection('node2');
			editorState.setSelection('node3');
			expect(editorState.selection.selectedIds.size).toBe(1);
			expect(editorState.selection.selectedIds.has('node3')).toBe(true);
		});

		it('should replace selection with multiple elements', () => {
			editorState.addToSelection('node1');
			editorState.setSelection(['node2', 'node3']);
			expect(editorState.selection.selectedIds.size).toBe(2);
			expect(editorState.selection.selectedIds.has('node2')).toBe(true);
			expect(editorState.selection.selectedIds.has('node3')).toBe(true);
		});

		it('should clear selection', () => {
			editorState.addToSelection('node1');
			editorState.addToSelection('node2');
			editorState.clearSelection();
			expect(editorState.selection.selectedIds.size).toBe(0);
		});

		it('should report hasSelection as false when empty', () => {
			expect(editorState.hasSelection).toBe(false);
		});

		it('should report hasSelection as true when not empty', () => {
			editorState.addToSelection('node1');
			expect(editorState.hasSelection).toBe(true);
		});

		it('should report isMultiSelect as false with single selection', () => {
			editorState.addToSelection('node1');
			expect(editorState.isMultiSelect).toBe(false);
		});

		it('should report isMultiSelect as true with multiple selections', () => {
			editorState.addToSelection('node1');
			editorState.addToSelection('node2');
			expect(editorState.isMultiSelect).toBe(true);
		});
	});

	describe('Hover State', () => {
		it('should set hovered element', () => {
			editorState.setHovered('node1');
			expect(editorState.selection.hoveredId).toBe('node1');
		});

		it('should clear hovered element', () => {
			editorState.setHovered('node1');
			editorState.setHovered(null);
			expect(editorState.selection.hoveredId).toBeNull();
		});

		it('should update hovered element', () => {
			editorState.setHovered('node1');
			editorState.setHovered('node2');
			expect(editorState.selection.hoveredId).toBe('node2');
		});
	});

	describe('Lasso Selection', () => {
		it('should set lasso box', () => {
			const box = { x: 10, y: 20, width: 100, height: 150 };
			editorState.setLassoBox(box);
			expect(editorState.selection.lassoBox).toEqual(box);
		});

		it('should clear lasso box', () => {
			editorState.setLassoBox({ x: 10, y: 20, width: 100, height: 150 });
			editorState.clearLassoBox();
			expect(editorState.selection.lassoBox).toBeNull();
		});

		it('should update lasso box', () => {
			editorState.setLassoBox({ x: 10, y: 20, width: 100, height: 150 });
			editorState.setLassoBox({ x: 15, y: 25, width: 120, height: 180 });
			expect(editorState.selection.lassoBox).toEqual({ x: 15, y: 25, width: 120, height: 180 });
		});
	});

	describe('Canvas State', () => {
		it('should initialize with default canvas state', () => {
			expect(editorState.canvas.panOffset).toEqual({ x: 0, y: 0 });
			expect(editorState.canvas.zoom).toBe(1);
			expect(editorState.canvas.isDragging).toBe(false);
			expect(editorState.canvas.isPanning).toBe(false);
		});

		it('should update pan offset', () => {
			editorState.setPanOffset(50, 75);
			expect(editorState.canvas.panOffset).toEqual({ x: 50, y: 75 });
		});

		it('should update zoom level', () => {
			editorState.setZoom(1.5);
			expect(editorState.canvas.zoom).toBe(1.5);
		});

		it('should set dragging state', () => {
			editorState.setDragging(true);
			expect(editorState.canvas.isDragging).toBe(true);
		});

		it('should clear dragging state', () => {
			editorState.setDragging(true);
			editorState.setDragging(false);
			expect(editorState.canvas.isDragging).toBe(false);
		});

		it('should set panning state', () => {
			editorState.setPanning(true);
			expect(editorState.canvas.isPanning).toBe(true);
		});

		it('should clear panning state', () => {
			editorState.setPanning(true);
			editorState.setPanning(false);
			expect(editorState.canvas.isPanning).toBe(false);
		});

		it('should clamp zoom to minimum value', () => {
			editorState.setZoom(0.05);
			expect(editorState.canvas.zoom).toBeGreaterThanOrEqual(0.1);
		});

		it('should clamp zoom to maximum value', () => {
			editorState.setZoom(15);
			expect(editorState.canvas.zoom).toBeLessThanOrEqual(10);
		});

		it('should reset canvas state', () => {
			editorState.setPanOffset(100, 200);
			editorState.setZoom(2);
			editorState.resetCanvas();
			expect(editorState.canvas.panOffset).toEqual({ x: 0, y: 0 });
			expect(editorState.canvas.zoom).toBe(1);
		});
	});

	describe('Clear All State', () => {
		it('should clear all editor state', () => {
			editorState.setMode('connect');
			editorState.addToSelection('node1');
			editorState.setHovered('node2');
			editorState.setPanOffset(50, 75);
			editorState.setZoom(1.5);

			editorState.clearAll();

			expect(editorState.mode).toBe('select');
			expect(editorState.selection.selectedIds.size).toBe(0);
			expect(editorState.selection.hoveredId).toBeNull();
			expect(editorState.canvas.panOffset).toEqual({ x: 0, y: 0 });
			expect(editorState.canvas.zoom).toBe(1);
		});
	});
});
