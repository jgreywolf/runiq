import { clipboardManager } from '$lib/utils/clipboardManager.svelte';
import type { InteractionManager } from '$lib/utils/interactionManager.svelte';
import type { SelectionState } from './SelectionState.svelte';
import type { ViewportState } from './ViewportState.svelte';

interface CanvasEventHandlerDeps {
	selection: SelectionState;
	viewport: ViewportState;
	interactionManager: InteractionManager;
	getSvgContainer: () => HTMLDivElement | null;
	handleDelete: (nodeId: string | null, edgeId: string | null) => void;
	handleEdit: (
		nodeOrEdgeId: string,
		property: string,
		value: string | number | boolean | { x: number; y: number }
	) => void;
	handleInsertShape: (shapeCode: string) => void;
}

export function createCanvasEventHandlers(deps: CanvasEventHandlerDeps) {
	const {
		selection,
		viewport,
		interactionManager,
		getSvgContainer,
		handleDelete,
		handleEdit,
		handleInsertShape
	} = deps;

	function handleCanvasClick(event: MouseEvent) {
		// Only deselect if clicking on the canvas itself, not on an element
		if (event.target === event.currentTarget || (event.target as HTMLElement).tagName === 'svg') {
			// If we're in multi-select mode (have multiple items selected), only clear if NOT holding Ctrl
			if (selection.hasMultiSelection && (event.ctrlKey || event.metaKey)) {
				return;
			}
			interactionManager.clearSelection();
		}
	}

	function handleCanvasKeyDown(event: KeyboardEvent) {
		// Don't intercept if we're editing text
		if (selection.editingNodeId || selection.editingEdgeId) return;

		if (event.key === 'Delete' || event.key === 'Backspace') {
			if (selection.selectedNodeIds.size > 0 || selection.selectedEdgeIds.size > 0) {
				selection.selectedNodeIds.forEach((nodeId) => {
					handleDelete(nodeId, null);
				});
				selection.selectedEdgeIds.forEach((edgeId) => {
					handleDelete(null, edgeId);
				});
				interactionManager.clearSelection();
				event.preventDefault();
			} else if (selection.selectedNodeId || selection.selectedEdgeId) {
				handleDelete(selection.selectedNodeId, selection.selectedEdgeId);
				interactionManager.clearSelection();
				event.preventDefault();
			}
		} else if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
			clipboardManager.copy(
				getSvgContainer(),
				selection.selectedNodeId,
				selection.selectedEdgeId,
				selection.selectedNodeIds,
				selection.selectedEdgeIds
			);
			event.preventDefault();
		} else if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
			clipboardManager.paste(handleInsertShape);
			event.preventDefault();
		} else if ((event.ctrlKey || event.metaKey) && event.key === 'x') {
			clipboardManager.cut(
				getSvgContainer(),
				selection.selectedNodeId,
				selection.selectedEdgeId,
				selection.selectedNodeIds,
				selection.selectedEdgeIds
			);
			interactionManager.clearSelection();
			event.preventDefault();
		} else if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
			selection.selectAll(getSvgContainer());
			event.preventDefault();
		}
	}

	function handleEditKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			if (selection.editingNodeId) {
				handleEdit(selection.editingNodeId, 'label', selection.editingLabel);
			} else if (selection.editingEdgeId) {
				handleEdit(selection.editingEdgeId, 'edgeLabel', selection.editingLabel);
			}
			selection.cancelLabelEdit();
		} else if (event.key === 'Escape') {
			selection.cancelLabelEdit();
		}
	}

	function handleMouseDown(e: MouseEvent) {
		if (selection.editingNodeId || selection.editingEdgeId) return;

		const target = e.target as HTMLElement;
		if (target.closest('[data-node-id], [data-edge-id]')) return;

		if (e.button !== 0) return;

		const svgContainer = getSvgContainer();
		if (!svgContainer) return;
		const rect = svgContainer.getBoundingClientRect();
		const clientX = e.clientX - rect.left;
		const clientY = e.clientY - rect.top;

		if (e.ctrlKey || e.metaKey) {
			selection.startLasso(clientX, clientY);
		} else {
			viewport.startPan(e.clientX, e.clientY);
		}
	}

	function handleMouseMove(e: MouseEvent) {
		const svgContainer = getSvgContainer();
		if (!svgContainer) return;

		const rect = svgContainer.getBoundingClientRect();
		viewport.updateMousePosition(e.clientX, e.clientY, rect);

		if (selection.isLassoPending || selection.isLassoActive) {
			selection.updateLasso(viewport.mouseX, viewport.mouseY);
		} else if (viewport.isPanning) {
			viewport.updatePan(e.clientX, e.clientY);
		}
	}

	function handleMouseUp() {
		const svgContainer = getSvgContainer();
		if (!svgContainer) return;

		if (selection.isLassoActive) {
			selection.completeLasso(
				svgContainer,
				viewport.scale,
				viewport.translateX,
				viewport.translateY
			);
		}
		selection.cancelLasso();
		viewport.endPan();
	}

	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		const delta = e.deltaY > 0 ? 0.9 : 1.1;
		viewport.zoom(delta);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'copy';
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		if (!e.dataTransfer) return;

		const shapeCode = e.dataTransfer.getData('application/x-runiq-shape');
		if (!shapeCode) return;
		handleInsertShape(shapeCode);
	}

	return {
		handleCanvasClick,
		handleCanvasKeyDown,
		handleEditKeyPress,
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
		handleWheel,
		handleDragOver,
		handleDrop
	};
}
