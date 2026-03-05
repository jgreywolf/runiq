import {
	handleElementMouseEnter,
	handleElementMouseLeave,
	handleElementClick,
	handleElementDoubleClick,
	type MouseHandlerContext,
	type MouseHandlerCallbacks
} from '$lib/components/visual-canvas/mouseHandlers';
import { SelectionState } from '$lib/components/visual-canvas/SelectionState.svelte';
import { ViewportState } from '$lib/components/visual-canvas/ViewportState.svelte';
import { canvasState } from '$lib/state';
import { SvelteSet } from 'svelte/reactivity';

/**
 * InteractionManager - Manages interactive event handlers and element interactions
 * Coordinates mouse events, selection state, and label editing
 */
export class InteractionManager {
	private svgContainerRef: HTMLDivElement | null = null;

	constructor(
		private selection: SelectionState,
		private viewport: ViewportState,
		private onselect?: (nodeId: string | null, edgeId: string | null) => void
	) {}

	/**
	 * Set the SVG container reference
	 */
	setSvgContainer(container: HTMLDivElement | null): void {
		this.svgContainerRef = container;
	}

	/**
	 * Attach interactive event handlers to all elements in the SVG
	 */
	attachHandlers(
		svgContainer: HTMLDivElement | null,
		getDiagramSvg: () => SVGSVGElement | null
	): void {
		if (!svgContainer) return;

		const svgElement = getDiagramSvg();
		if (!svgElement) return;

		// Add hover handlers to all nodes, edges, and containers
		const interactiveElements = svgElement.querySelectorAll(
			'[data-node-id], [data-edge-id], [data-container-id]'
		);

		interactiveElements.forEach((element) => {
			// Remove existing listeners to avoid duplicates
			element.removeEventListener('mouseenter', this.handleMouseEnter);
			element.removeEventListener('mouseleave', this.handleMouseLeave);
			element.removeEventListener('click', this.handleClick);
			element.removeEventListener('dblclick', this.handleDoubleClick);

			// Add new listeners
			element.addEventListener('mouseenter', this.handleMouseEnter);
			element.addEventListener('mouseleave', this.handleMouseLeave);
			element.addEventListener('click', this.handleClick);
			element.addEventListener('dblclick', this.handleDoubleClick);
		});
	}

	/**
	 * Restore selection styling after SVG re-render
	 */
	restoreSelection(
		svgContainer: HTMLDivElement | null,
		getDiagramSvg: () => SVGSVGElement | null
	): void {
		if (!svgContainer) return;

		const svgElement = getDiagramSvg();
		if (!svgElement) return;

		// Re-apply selection to the selected node or edge
		if (this.selection.selectedNodeId) {
			const nodeElement = svgElement.querySelector(
				`[data-node-id="${this.selection.selectedNodeId}"]`
			);
			if (nodeElement) {
				nodeElement.classList.add('runiq-selected');
			}
		}

		if (this.selection.selectedEdgeId) {
			const edgeElement = svgElement.querySelector(
				`[data-edge-id="${this.selection.selectedEdgeId}"]`
			);
			if (edgeElement) {
				edgeElement.classList.add('runiq-selected');
			}
		}
	}

	/**
	 * Build MouseHandlerContext from current state
	 */
	private buildContext(): MouseHandlerContext {
		return {
			svgContainer: this.svgContainerRef,
			scale: this.viewport.scale,
			translateX: this.viewport.translateX,
			translateY: this.viewport.translateY,
			isDragging: this.viewport.isDragging,
			dragStart: this.viewport.dragStart,
			selectedNodeId: this.selection.selectedNodeId,
			selectedEdgeId: this.selection.selectedEdgeId,
			selectedNodeIds: this.selection.selectedNodeIds,
			selectedEdgeIds: this.selection.selectedEdgeIds,
			hoveredElementId: this.selection.hoveredElementId,
			isLassoActive: this.selection.isLassoActive,
			isLassoPending: this.selection.isLassoPending,
			lassoStartX: this.selection.lassoStartX,
			lassoStartY: this.selection.lassoStartY,
			lassoEndX: this.selection.lassoEndX,
			lassoEndY: this.selection.lassoEndY
		};
	}

	/**
	 * Build MouseHandlerCallbacks
	 */
	private buildCallbacks(): MouseHandlerCallbacks {
		return {
			onselect: this.onselect,
			clearSelection: () => this.clearSelection(),
			updateMultiSelection: () => this.updateMultiSelection(),
			startLabelEdit: (nodeId, edgeId) => this.startLabelEdit(nodeId, edgeId)
		};
	}

	/**
	 * Sync selection state to centralized editorState
	 */
	private syncSelectionToEditorState(): void {
		const allSelectedIds = new SvelteSet<string>();

		// Add single selections
		if (this.selection.selectedNodeId) allSelectedIds.add(this.selection.selectedNodeId);
		if (this.selection.selectedEdgeId) allSelectedIds.add(this.selection.selectedEdgeId);

		// Add multi-selections
		this.selection.selectedNodeIds.forEach((id) => allSelectedIds.add(id));
		this.selection.selectedEdgeIds.forEach((id) => allSelectedIds.add(id));

		// Update editorState
		if (allSelectedIds.size > 0) {
			canvasState.setSelection(Array.from(allSelectedIds));
		} else {
			canvasState.clearSelection();
		}

		// Update hover state
		canvasState.setHovered(this.selection.hoveredElementId);
	}

	/**
	 * Handler for element mouse enter
	 */
	private handleMouseEnter = (event: Event): void => {
		const context = this.buildContext();
		handleElementMouseEnter(event, context);
		this.selection.hoveredElementId = context.hoveredElementId;
		canvasState.setHovered(context.hoveredElementId);
	};

	/**
	 * Handler for element mouse leave
	 */
	private handleMouseLeave = (event: Event): void => {
		const context = this.buildContext();
		handleElementMouseLeave(event, context);
		this.selection.hoveredElementId = context.hoveredElementId;
		canvasState.setHovered(context.hoveredElementId);
	};

	/**
	 * Handler for element click
	 */
	private handleClick = (event: Event): void => {
		const context = this.buildContext();
		const callbacks = this.buildCallbacks();

		handleElementClick(event, context, callbacks);

		// Update selection state from context
		if (context.selectedNodeId !== this.selection.selectedNodeId) {
			if (context.selectedNodeId) {
				this.selection.selectNode(context.selectedNodeId);
			}
		}
		if (context.selectedEdgeId !== this.selection.selectedEdgeId) {
			if (context.selectedEdgeId) {
				this.selection.selectEdge(context.selectedEdgeId);
			}
		}

		// Sync with editorState
		this.syncSelectionToEditorState();
	};

	/**
	 * Handler for element double click
	 */
	private handleDoubleClick = (event: Event): void => {
		const context = this.buildContext();
		const callbacks = this.buildCallbacks();
		handleElementDoubleClick(event, context, callbacks);
	};

	/**
	 * Start label editing for an element
	 */
	startLabelEdit(nodeId: string | null, edgeId: string | null): void {
		if (!this.svgContainerRef) return;

		const elementId = nodeId || edgeId;
		if (!elementId) return;

		const svgElement = this.svgContainerRef.querySelector('svg');
		if (!svgElement) return;

		const selector = nodeId ? `[data-node-id="${nodeId}"]` : `[data-edge-id="${edgeId}"]`;
		const element = svgElement.querySelector(selector);
		if (!element) return;

		const textElement = element.querySelector('text');
		if (!textElement) return;

		// Get the current label text
		const currentLabel = (textElement.textContent || '').trim();

		// Get the position of the text element in screen space
		const textRect = textElement.getBoundingClientRect();
		const containerRect = this.svgContainerRef.getBoundingClientRect();

		// Calculate position relative to container
		const inputX = textRect.left - containerRect.left;
		const inputY = textRect.top - containerRect.top;

		// Start editing mode
		this.selection.startLabelEdit(nodeId, edgeId, currentLabel, { x: inputX, y: inputY });
	}

	/**
	 * Clear selection
	 */
	clearSelection(): void {
		this.selection.clearSelection();
		this.selection.updateVisualSelection(this.svgContainerRef);
		this.syncSelectionToEditorState();
	}

	/**
	 * Update visual styling for multi-selected elements
	 */
	updateMultiSelection(): void {
		this.selection.updateVisualSelection(this.svgContainerRef);
	}
}
