import { tick } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';

export interface SelectionStateConfig {
	onSelectionChange?: (nodeId: string | null, edgeId: string | null) => void;
}

export class SelectionState {
	// Single selection
	selectedNodeId = $state<string | null>(null);
	selectedEdgeId = $state<string | null>(null);

	// Multi-selection
	selectedNodeIds = $state<Set<string>>(new SvelteSet());
	selectedEdgeIds = $state<Set<string>>(new SvelteSet());

	// Hover state
	hoveredElementId = $state<string | null>(null);

	// Label editing state
	editingNodeId = $state<string | null>(null);
	editingEdgeId = $state<string | null>(null);
	editingLabel = $state<string>('');
	editInputPosition = $state<{ x: number; y: number } | null>(null);

	// Lasso selection state
	lassoStartX = $state(0);
	lassoStartY = $state(0);
	lassoEndX = $state(0);
	lassoEndY = $state(0);
	isLassoActive = $state(false);
	isLassoPending = $state(false);
	readonly LASSO_THRESHOLD = 5;

	private config: SelectionStateConfig;

	constructor(config: SelectionStateConfig = {}) {
		this.config = config;
	}

	// Check if anything is selected
	get hasSelection(): boolean {
		return (
			this.selectedNodeId !== null ||
			this.selectedEdgeId !== null ||
			this.selectedNodeIds.size > 0 ||
			this.selectedEdgeIds.size > 0
		);
	}

	// Check if multiple items are selected
	get hasMultiSelection(): boolean {
		return (
			this.selectedNodeIds.size > 1 ||
			this.selectedEdgeIds.size > 1 ||
			(this.selectedNodeIds.size === 1 && this.selectedEdgeIds.size === 1)
		);
	}

	// Get count of selected items
	get selectionCount(): number {
		return this.selectedNodeIds.size + this.selectedEdgeIds.size;
	}

	// Get primary selected element ID
	get primarySelectedId(): string | null {
		return this.selectedNodeId || this.selectedEdgeId;
	}

	// Select a single node
	selectNode(nodeId: string, addToSelection = false): void {
		if (addToSelection) {
			this.selectedNodeIds.add(nodeId);
		} else {
			this.clearSelection();
			this.selectedNodeId = nodeId;
		}
		this.notifySelectionChange();
	}

	// Select a single edge
	selectEdge(edgeId: string, addToSelection = false): void {
		if (addToSelection) {
			this.selectedEdgeIds.add(edgeId);
		} else {
			this.clearSelection();
			this.selectedEdgeId = edgeId;
		}
		this.notifySelectionChange();
	}

	// Toggle node selection in multi-select mode
	toggleNodeSelection(nodeId: string): void {
		if (this.selectedNodeIds.has(nodeId)) {
			this.selectedNodeIds.delete(nodeId);
		} else {
			this.selectedNodeIds.add(nodeId);
		}
		this.selectedNodeIds = new SvelteSet(this.selectedNodeIds); // Trigger reactivity
	}

	// Toggle edge selection in multi-select mode
	toggleEdgeSelection(edgeId: string): void {
		if (this.selectedEdgeIds.has(edgeId)) {
			this.selectedEdgeIds.delete(edgeId);
		} else {
			this.selectedEdgeIds.add(edgeId);
		}
		this.selectedEdgeIds = new SvelteSet(this.selectedEdgeIds); // Trigger reactivity
	}

	// Clear all selections
	clearSelection(): void {
		this.selectedNodeId = null;
		this.selectedEdgeId = null;
		this.selectedNodeIds = new SvelteSet();
		this.selectedEdgeIds = new SvelteSet();
		this.notifySelectionChange();
	}

	// Select all nodes and edges from a container
	selectAll(svgContainer: HTMLElement | null): void {
		if (!svgContainer) return;

		const svgElement = svgContainer.querySelector('svg');
		if (!svgElement) return;

		const newSelectedNodes = new SvelteSet<string>();
		const newSelectedEdges = new SvelteSet<string>();

		svgElement.querySelectorAll('[data-node-id]').forEach((element) => {
			const nodeId = element.getAttribute('data-node-id');
			if (nodeId) newSelectedNodes.add(nodeId);
		});

		svgElement.querySelectorAll('[data-edge-id]').forEach((element) => {
			const edgeId = element.getAttribute('data-edge-id');
			if (edgeId) newSelectedEdges.add(edgeId);
		});

		this.selectedNodeIds = newSelectedNodes;
		this.selectedEdgeIds = newSelectedEdges;
	}

	// Start edge creation mode
	startEdgeCreation(nodeId: string): void {
		this.edgeCreationMode = true;
		this.edgeCreationStartNode = nodeId;
	}

	// Cancel edge creation mode
	cancelEdgeCreation(): void {
		this.edgeCreationMode = false;
		this.edgeCreationStartNode = null;
		this.clearSelection();
	}

	// Start label editing
	startLabelEdit(
		nodeId: string | null,
		edgeId: string | null,
		currentLabel: string,
		position: { x: number; y: number }
	): void {
		if (nodeId) {
			this.editingNodeId = nodeId;
			this.editingEdgeId = null;
		} else if (edgeId) {
			this.editingEdgeId = edgeId;
			this.editingNodeId = null;
		}
		this.editingLabel = currentLabel;
		this.editInputPosition = position;
	}

	// Cancel label editing
	cancelLabelEdit(): void {
		this.editingNodeId = null;
		this.editingEdgeId = null;
		this.editingLabel = '';
		this.editInputPosition = null;
	}

	// Start lasso selection
	startLasso(x: number, y: number): void {
		this.isLassoPending = true;
		this.lassoStartX = x;
		this.lassoStartY = y;
		this.lassoEndX = x;
		this.lassoEndY = y;
	}

	// Update lasso selection
	updateLasso(x: number, y: number): void {
		// Check if we've dragged far enough to activate lasso
		if (this.isLassoPending) {
			const dx = x - this.lassoStartX;
			const dy = y - this.lassoStartY;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance > this.LASSO_THRESHOLD) {
				this.isLassoPending = false;
				this.isLassoActive = true;
			}
		}

		if (this.isLassoActive) {
			this.lassoEndX = x;
			this.lassoEndY = y;
		}
	}

	// Complete lasso selection
	completeLasso(
		svgContainer: HTMLElement | null,
		scale: number,
		translateX: number,
		translateY: number
	): void {
		if (!this.isLassoActive || !svgContainer) {
			this.cancelLasso();
			return;
		}

		const svgElement = svgContainer.querySelector('svg');
		if (!svgElement) {
			this.cancelLasso();
			return;
		}

		// Calculate lasso bounds
		const minX = Math.min(this.lassoStartX, this.lassoEndX);
		const maxX = Math.max(this.lassoStartX, this.lassoEndX);
		const minY = Math.min(this.lassoStartY, this.lassoEndY);
		const maxY = Math.max(this.lassoStartY, this.lassoEndY);

		const newSelectedNodes = new SvelteSet<string>();
		const newSelectedEdges = new SvelteSet<string>();

		// Check all interactive elements
		const elements = svgElement.querySelectorAll('[data-node-id], [data-edge-id]');
		elements.forEach((element) => {
			const bbox = (element as SVGGraphicsElement).getBBox();

			// Transform SVG coordinates to screen coordinates
			const elemX = bbox.x * scale + translateX;
			const elemY = bbox.y * scale + translateY;
			const elemWidth = bbox.width * scale;
			const elemHeight = bbox.height * scale;

			// Check if element intersects with lasso
			if (elemX < maxX && elemX + elemWidth > minX && elemY < maxY && elemY + elemHeight > minY) {
				const nodeId = element.getAttribute('data-node-id');
				const edgeId = element.getAttribute('data-edge-id');

				if (nodeId) newSelectedNodes.add(nodeId);
				if (edgeId) newSelectedEdges.add(edgeId);
			}
		});

		// Update selection
		this.selectedNodeIds = newSelectedNodes;
		this.selectedEdgeIds = newSelectedEdges;

		this.cancelLasso();
	}

	// Cancel lasso selection
	cancelLasso(): void {
		this.isLassoActive = false;
		this.isLassoPending = false;
	}

	// Update visual styling for selections
	updateVisualSelection(svgContainer: HTMLElement | null): void {
		if (!svgContainer) return;

		const svgElement = svgContainer.querySelector('svg');
		if (!svgElement) return;

		// Clear all selection classes
		svgElement
			.querySelectorAll('.runiq-selected, .runiq-multi-selected, .runiq-edge-start')
			.forEach((el) => {
				el.classList.remove('runiq-selected', 'runiq-multi-selected', 'runiq-edge-start');
			});

		// Single selection
		if (this.selectedNodeId) {
			const nodeElement = svgElement.querySelector(`[data-node-id="${this.selectedNodeId}"]`);
			if (nodeElement) {
				nodeElement.classList.add('runiq-selected');
				if (this.edgeCreationMode && this.edgeCreationStartNode === this.selectedNodeId) {
					nodeElement.classList.add('runiq-edge-start');
				}
			}
		}

		if (this.selectedEdgeId) {
			const edgeElement = svgElement.querySelector(`[data-edge-id="${this.selectedEdgeId}"]`);
			if (edgeElement) {
				edgeElement.classList.add('runiq-selected');
			}
		}

		// Multi-selection
		this.selectedNodeIds.forEach((nodeId) => {
			const nodeElement = svgElement.querySelector(`[data-node-id="${nodeId}"]`);
			if (nodeElement) {
				nodeElement.classList.add('runiq-multi-selected');
			}
		});

		this.selectedEdgeIds.forEach((edgeId) => {
			const edgeElement = svgElement.querySelector(`[data-edge-id="${edgeId}"]`);
			if (edgeElement) {
				edgeElement.classList.add('runiq-multi-selected');
			}
		});
	}

	// Notify selection change callback
	private notifySelectionChange(): void {
		if (this.config.onSelectionChange) {
			this.config.onSelectionChange(this.selectedNodeId, this.selectedEdgeId);
		}
	}
}
