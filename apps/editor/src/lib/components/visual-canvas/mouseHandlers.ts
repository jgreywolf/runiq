// Mouse event handlers for the visual canvas

export interface MouseHandlerContext {
	svgContainer: HTMLDivElement | null;
	scale: number;
	translateX: number;
	translateY: number;
	isDragging: boolean;
	dragStart: { x: number; y: number } | null;
	selectedNodeId: string | null;
	selectedEdgeId: string | null;
	selectedNodeIds: Set<string>;
	selectedEdgeIds: Set<string>;
	hoveredElementId: string | null;
	isLassoActive: boolean;
	isLassoPending: boolean;
	lassoStartX: number;
	lassoStartY: number;
	lassoEndX: number;
	lassoEndY: number;
}

export interface MouseHandlerCallbacks {
	onselect?: (nodeId: string | null, edgeId: string | null) => void;
	clearSelection: () => void;
	updateMultiSelection: () => void;
	startLabelEdit: (nodeId: string | null, edgeId: string | null) => void;
}

const chartShapes = new Set([
	'lineChart',
	'radarChart',
	'pieChart',
	'barChart',
	'pyramidShape',
	'sankeyChart'
]);

export function handleElementMouseEnter(event: Event, context: MouseHandlerContext): void {
	const target = event.currentTarget as SVGElement;

	const nodeId = target.getAttribute('data-node-id');
	const edgeId = target.getAttribute('data-edge-id');
	const containerId = target.getAttribute('data-container-id');
	const shapeId = target.getAttribute('data-node-shape');

	context.hoveredElementId = nodeId || edgeId || containerId || null;

	if (shapeId && chartShapes.has(shapeId)) {
		return;
	}

	// Add hover class
	target.classList.add('runiq-hovered');
}

export function handleElementMouseLeave(event: Event, context: MouseHandlerContext): void {
	const target = event.currentTarget as SVGElement;

	const shapeId = target.getAttribute('data-node-shape');
	context.hoveredElementId = null;

	if (shapeId && chartShapes.has(shapeId)) {
		return;
	}

	// Remove hover class
	target.classList.remove('runiq-hovered');
}

export function handleElementClick(
	event: Event,
	context: MouseHandlerContext,
	callbacks: MouseHandlerCallbacks
): void {
	event.stopPropagation();
	const target = event.currentTarget as SVGElement;
	const nodeId = target.getAttribute('data-node-id');
	const edgeId = target.getAttribute('data-edge-id');
	const mouseEvent = event as MouseEvent;

	// Handle Ctrl+Click for multi-select
	if ((mouseEvent.ctrlKey || mouseEvent.metaKey) && !mouseEvent.shiftKey) {
		if (nodeId) {
			const newSet = new Set(context.selectedNodeIds);
			if (newSet.has(nodeId)) {
				newSet.delete(nodeId);
				target.classList.remove('runiq-multi-selected');
			} else {
				newSet.add(nodeId);
				target.classList.add('runiq-multi-selected');
			}

			// Clear single selection
			context.selectedNodeId = null;
			context.selectedEdgeId = null;

			context.selectedNodeIds = newSet;
			callbacks.updateMultiSelection();
		} else if (edgeId) {
			const newSet = new Set(context.selectedEdgeIds);
			if (newSet.has(edgeId)) {
				newSet.delete(edgeId);
				target.classList.remove('runiq-multi-selected');
			} else {
				newSet.add(edgeId);
				target.classList.add('runiq-multi-selected');
			}

			// Clear single selection
			context.selectedNodeId = null;
			context.selectedEdgeId = null;

			context.selectedEdgeIds = newSet;
			callbacks.updateMultiSelection();
		}
		return;
	}

	// Normal selection behavior (no modifiers)
	callbacks.clearSelection();

	if (nodeId) {
		context.selectedNodeId = nodeId;
		context.selectedEdgeId = null;
		target.classList.add('runiq-selected');
		if (callbacks.onselect) callbacks.onselect(nodeId, null);
	} else if (edgeId) {
		context.selectedEdgeId = edgeId;
		context.selectedNodeId = null;
		target.classList.add('runiq-selected');
		if (callbacks.onselect) callbacks.onselect(null, edgeId);
	}
}

export function handleElementDoubleClick(
	event: Event,
	context: MouseHandlerContext,
	callbacks: MouseHandlerCallbacks
): void {
	event.stopPropagation();
	const target = event.currentTarget as SVGElement;
	const nodeId = target.getAttribute('data-node-id');
	const edgeId = target.getAttribute('data-edge-id');

	if (nodeId) {
		callbacks.startLabelEdit(nodeId, null);
	} else if (edgeId) {
		callbacks.startLabelEdit(null, edgeId);
	}
}

export function handlePanStart(event: MouseEvent, context: MouseHandlerContext): void {
	// Only pan with middle mouse button or Ctrl+Left click
	if (event.button === 1 || (event.button === 0 && event.ctrlKey)) {
		event.preventDefault();
		context.isDragging = true;
		context.dragStart = { x: event.clientX, y: event.clientY };
	}
}

export function handlePan(
	event: MouseEvent,
	context: MouseHandlerContext,
	setTranslate: (x: number, y: number) => void
): void {
	if (context.isDragging && context.dragStart) {
		const dx = event.clientX - context.dragStart.x;
		const dy = event.clientY - context.dragStart.y;
		setTranslate(context.translateX + dx, context.translateY + dy);
		context.dragStart = { x: event.clientX, y: event.clientY };
	}
}

export function handlePanEnd(context: MouseHandlerContext): void {
	context.isDragging = false;
	context.dragStart = null;
}

export function handleZoom(
	event: WheelEvent,
	context: MouseHandlerContext,
	setScale: (scale: number) => void
): void {
	event.preventDefault();

	const delta = event.deltaY > 0 ? 0.9 : 1.1;
	const newScale = Math.max(0.1, Math.min(5, context.scale * delta));
	setScale(newScale);
}

export function handleLassoStart(event: MouseEvent, context: MouseHandlerContext): void {
	// Only start lasso with left click and no modifiers
	if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
		context.isLassoPending = true;
		context.lassoStartX = event.clientX;
		context.lassoStartY = event.clientY;
		context.lassoEndX = event.clientX;
		context.lassoEndY = event.clientY;
	}
}

export function handleLassoDrag(
	event: MouseEvent,
	context: MouseHandlerContext,
	LASSO_THRESHOLD: number
): void {
	if (context.isLassoPending || context.isLassoActive) {
		context.lassoEndX = event.clientX;
		context.lassoEndY = event.clientY;

		// Activate lasso if dragged beyond threshold
		if (context.isLassoPending && !context.isLassoActive) {
			const dx = context.lassoEndX - context.lassoStartX;
			const dy = context.lassoEndY - context.lassoStartY;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance > LASSO_THRESHOLD) {
				context.isLassoActive = true;
			}
		}
	}
}

export function handleLassoEnd(
	context: MouseHandlerContext,
	callbacks: MouseHandlerCallbacks
): void {
	if (context.isLassoActive) {
		// Perform lasso selection
		selectElementsInLasso(context, callbacks);
	}
	context.isLassoPending = false;
	context.isLassoActive = false;
}

function selectElementsInLasso(
	context: MouseHandlerContext,
	callbacks: MouseHandlerCallbacks
): void {
	if (!context.svgContainer) return;

	const svgElement = context.svgContainer.querySelector('svg');
	if (!svgElement) return;

	// Get lasso bounds in screen coordinates
	const minX = Math.min(context.lassoStartX, context.lassoEndX);
	const maxX = Math.max(context.lassoStartX, context.lassoEndX);
	const minY = Math.min(context.lassoStartY, context.lassoEndY);
	const maxY = Math.max(context.lassoStartY, context.lassoEndY);

	// Find all nodes and edges
	const elements = svgElement.querySelectorAll('[data-node-id], [data-edge-id]');
	const selectedNodes = new Set<string>();
	const selectedEdges = new Set<string>();

	elements.forEach((element) => {
		const rect = element.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		// Check if element center is within lasso bounds
		if (centerX >= minX && centerX <= maxX && centerY >= minY && centerY <= maxY) {
			const nodeId = element.getAttribute('data-node-id');
			const edgeId = element.getAttribute('data-edge-id');

			if (nodeId) {
				selectedNodes.add(nodeId);
				element.classList.add('runiq-multi-selected');
			} else if (edgeId) {
				selectedEdges.add(edgeId);
				element.classList.add('runiq-multi-selected');
			}
		}
	});

	context.selectedNodeIds = selectedNodes;
	context.selectedEdgeIds = selectedEdges;
	context.selectedNodeId = null;
	context.selectedEdgeId = null;

	callbacks.updateMultiSelection();
}
