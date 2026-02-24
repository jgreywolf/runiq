import { clipboardManager } from '$lib/utils/clipboardManager.svelte';
import type { InteractionManager } from '$lib/utils/interactionManager.svelte';
import type { SelectionState } from './SelectionState.svelte';
import type { ViewportState } from './ViewportState.svelte';
import type { EditorMode } from '$lib/types/editor';
import { ProfileName } from '$lib/types';

interface CanvasEventHandlerDeps {
	selection: SelectionState;
	viewport: ViewportState;
	interactionManager: InteractionManager;
	getSvgContainer: () => HTMLDivElement | null;
	getProfileName: () => ProfileName | null;
	getMode: () => EditorMode;
	handleDelete: (nodeId: string | null, edgeId: string | null) => void;
	handleEdit: (
		nodeOrEdgeId: string,
		property: string,
		value: string | number | boolean | { x: number; y: number }
	) => void;
	handleInsertShape: (shapeCode: string) => void;
	handleInsertEdge: (fromNodeId: string, toNodeId: string) => void;
	handleInsertShapeAndEdge: (shapeCode: string, fromNodeId: string, toNodeId: string) => void;
	getNextShapeId: () => string;
	onConnectPreviewStart: (point: { x: number; y: number }) => void;
	onConnectPreviewMove: (point: { x: number; y: number }) => void;
	onConnectPreviewEnd: () => void;
}

export function createCanvasEventHandlers(deps: CanvasEventHandlerDeps) {
	const {
		selection,
		viewport,
		interactionManager,
		getSvgContainer,
		getProfileName,
		getMode,
		handleDelete,
		handleEdit,
		handleInsertShape,
		handleInsertEdge,
		handleInsertShapeAndEdge,
		getNextShapeId,
		onConnectPreviewStart,
		onConnectPreviewMove,
		onConnectPreviewEnd
	} = deps;
	let connectStartNodeId: string | null = null;

	const isDiagramProfile = () => getProfileName() === ProfileName.diagram;
	const isSelectMode = () => getMode() === 'select';
	const isConnectMode = () => getMode() === 'connect';

	function isTypingTarget(target: EventTarget | null): boolean {
		const el = target as HTMLElement | null;
		if (!el) return false;
		const tag = el.tagName?.toLowerCase();
		if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
		if ((el as HTMLElement).isContentEditable) return true;
		if (typeof el.closest === 'function' && el.closest('[contenteditable="true"]')) return true;
		return false;
	}

	function getNodeIdFromEventTarget(target: EventTarget | null): string | null {
		const maybeElement = target as unknown as Element | null;
		if (!maybeElement || typeof maybeElement.closest !== 'function') return null;
		const element = maybeElement.closest('[data-node-id]');
		return element?.getAttribute('data-node-id') ?? null;
	}

	function clearConnectStartHighlight() {
		const svgContainer = getSvgContainer();
		if (!svgContainer || !connectStartNodeId) return;
		svgContainer
			.querySelector(`[data-node-id="${connectStartNodeId}"]`)
			?.classList.remove('runiq-edge-start');
		connectStartNodeId = null;
		onConnectPreviewEnd();
	}

	function getContainerCoordinates(event: MouseEvent): { x: number; y: number } | null {
		const svgContainer = getSvgContainer();
		if (!svgContainer) return null;
		const rect = svgContainer.getBoundingClientRect();
		return { x: event.clientX - rect.left, y: event.clientY - rect.top };
	}

	function getNodeCenterInContainer(nodeId: string): { x: number; y: number } | null {
		const svgContainer = getSvgContainer();
		if (!svgContainer) return null;
		const nodeElement = svgContainer.querySelector(`[data-node-id="${nodeId}"]`) as SVGGraphicsElement | null;
		if (!nodeElement || typeof nodeElement.getBoundingClientRect !== 'function') return null;
		const nodeRect = nodeElement.getBoundingClientRect();
		const containerRect = svgContainer.getBoundingClientRect();
		return {
			x: nodeRect.left - containerRect.left + nodeRect.width / 2,
			y: nodeRect.top - containerRect.top + nodeRect.height / 2
		};
	}

	function getSvgCoordinates(event: MouseEvent): { x: number; y: number } | null {
		const svgContainer = getSvgContainer();
		if (!svgContainer) return null;
		const svg = svgContainer.querySelector('svg');
		if (!svg) return null;
		const rect = svg.getBoundingClientRect();
		const viewBox = svg.viewBox?.baseVal;
		if (!viewBox || rect.width === 0 || rect.height === 0) return null;
		const x = ((event.clientX - rect.left) / rect.width) * viewBox.width + viewBox.x;
		const y = ((event.clientY - rect.top) / rect.height) * viewBox.height + viewBox.y;
		return { x: Math.round(x), y: Math.round(y) };
	}

	function handleCanvasClick(event: MouseEvent) {
		if (!isDiagramProfile() || !isSelectMode()) return;
		const target = event.target as HTMLElement | null;
		if (!target) return;
		if (target.closest('.floating-toolbar, .element-flyout-panel, .style-create-overlay, .style-create-dialog')) {
			return;
		}
		// Deselect when clicking anywhere in canvas that is not a node/edge
		if (!target.closest('[data-node-id], [data-edge-id]')) {
			if (selection.hasMultiSelection && (event.ctrlKey || event.metaKey)) {
				return;
			}
			interactionManager.clearSelection();
		}
	}

	function handleCanvasKeyDown(event: KeyboardEvent) {
		if (!isDiagramProfile()) return;
		if (isTypingTarget(event.target)) return;
		// Don't intercept if we're editing text
		if (selection.editingNodeId || selection.editingEdgeId) return;

		if (event.key === 'Delete') {
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
		if (!isDiagramProfile() || !isSelectMode()) return;
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
		if (!isDiagramProfile()) return;
		if (selection.editingNodeId || selection.editingEdgeId) return;

		if (isConnectMode()) {
			if (e.button !== 0) return;
			const nodeId = getNodeIdFromEventTarget(e.target);
			if (!nodeId) {
				clearConnectStartHighlight();
				return;
			}

			clearConnectStartHighlight();
			connectStartNodeId = nodeId;
			getSvgContainer()
				?.querySelector(`[data-node-id="${nodeId}"]`)
				?.classList.add('runiq-edge-start');
			const start = getNodeCenterInContainer(nodeId);
			if (start) {
				onConnectPreviewStart(start);
				onConnectPreviewMove(start);
			}
			return;
		}

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

		if (isConnectMode() && connectStartNodeId) {
			const mouse = getContainerCoordinates(e);
			if (mouse) onConnectPreviewMove(mouse);
		}

		if (selection.isLassoPending || selection.isLassoActive) {
			selection.updateLasso(viewport.mouseX, viewport.mouseY);
		} else if (viewport.isPanning) {
			viewport.updatePan(e.clientX, e.clientY);
		}
	}

	function handleMouseUp() {
		if (!isDiagramProfile()) return;

		if (isConnectMode()) {
			onConnectPreviewEnd();
			return;
		}

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

	function handleMouseUpWithEvent(e: MouseEvent) {
		if (!isDiagramProfile() || !isConnectMode()) {
			handleMouseUp();
			return;
		}
		if (!connectStartNodeId) return;
		if (selection.editingNodeId || selection.editingEdgeId) return;

		const targetNodeId = getNodeIdFromEventTarget(e.target);

		if (targetNodeId && targetNodeId !== connectStartNodeId) {
			handleInsertEdge(connectStartNodeId, targetNodeId);
			clearConnectStartHighlight();
			return;
		}

		if (!targetNodeId) {
			const position = getSvgCoordinates(e);
			const newNodeId = getNextShapeId();
			const shapeCode = position
				? `shape ${newNodeId} as @rectangle label:"New Node" position:(${position.x},${position.y})`
				: `shape ${newNodeId} as @rectangle label:"New Node"`;
			handleInsertShapeAndEdge(shapeCode, connectStartNodeId, newNodeId);
		}

		clearConnectStartHighlight();
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
		handleMouseUp: handleMouseUpWithEvent,
		handleWheel,
		handleDragOver,
		handleDrop
	};
}
