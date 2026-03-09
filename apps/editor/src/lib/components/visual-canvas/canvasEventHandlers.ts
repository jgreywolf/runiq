import { clipboardManager } from '$lib/utils/clipboardManager.svelte';
import type { InteractionManager } from '$lib/utils/interactionManager.svelte';
import type { SelectionState } from './SelectionState.svelte';
import type { ViewportState } from './ViewportState.svelte';
import type { EditorMode } from '$lib/types/editor';
import { ProfileName } from '$lib/types';
import { supportsCanvasSelection } from './interactiveProfiles';

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
	onNodeContainerDragStart?: (payload: {
		nodeId: string;
		clientX: number;
		clientY: number;
		targetContainerId: string | null;
	}) => void;
	onNodeContainerDragMove?: (payload: {
		nodeId: string;
		clientX: number;
		clientY: number;
		targetContainerId: string | null;
	}) => void;
	onNodeContainerDragEnd?: (payload: {
		nodeId: string;
		clientX: number;
		clientY: number;
		targetContainerId: string | null;
	}) => void;
	onSequenceParticipantReorder?: (payload: {
		sourceNodeId: string;
		targetNodeId: string;
		position: 'before' | 'after';
	}) => void;
	onSequenceMessageReorder?: (payload: {
		sourceEdgeId: string;
		targetEdgeId: string;
		position: 'before' | 'after';
	}) => void;
	onSequenceCreateMessage?: (payload: { fromNodeId: string; toNodeId: string }) => void;
	onSequenceRetargetMessageEndpoint?: (payload: {
		edgeId: string;
		endpoint: 'from' | 'to';
		participantNodeId: string;
	}) => void;
	onSequenceDropTargetHover?: (participantNodeId: string | null) => void;
	onSequenceParticipantReorderPreview?: (preview: {
		targetNodeId: string;
		position: 'before' | 'after';
		x: number;
	} | null) => void;
	onSequenceMessageReorderPreview?: (preview: {
		targetEdgeId: string;
		position: 'before' | 'after';
		y: number;
	} | null) => void;
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
		onConnectPreviewEnd,
		onNodeContainerDragStart,
		onNodeContainerDragMove,
		onNodeContainerDragEnd,
		onSequenceParticipantReorder,
		onSequenceMessageReorder,
		onSequenceCreateMessage,
		onSequenceRetargetMessageEndpoint,
		onSequenceDropTargetHover,
		onSequenceParticipantReorderPreview,
		onSequenceMessageReorderPreview
	} = deps;
	let connectStartNodeId: string | null = null;
	let nodeDragPending:
		| {
				nodeId: string;
				clientX: number;
				clientY: number;
		  }
		| null = null;
	let nodeDragActiveNodeId: string | null = null;
	let sequenceParticipantDragPending:
		| {
				nodeId: string;
				clientX: number;
				clientY: number;
		  }
		| null = null;
	let sequenceParticipantDragActiveNodeId: string | null = null;
	let sequenceMessageDragPending:
		| {
				edgeId: string;
				clientX: number;
				clientY: number;
		  }
		| null = null;
	let sequenceMessageDragActiveEdgeId: string | null = null;
	let sequenceLifelineConnectStartNodeId: string | null = null;
	let sequenceMessageEndpointDrag:
		| {
				edgeId: string;
				endpoint: 'from' | 'to';
				startPoint: { x: number; y: number };
		  }
		| null = null;

	const isDiagramProfile = () => getProfileName() === ProfileName.diagram;
	const isSequenceProfile = () => getProfileName() === ProfileName.sequence;
	const isInteractiveProfile = () => supportsCanvasSelection(getProfileName());
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

	function getContainerIdFromEventTarget(target: EventTarget | null): string | null {
		const maybeElement = target as unknown as Element | null;
		if (!maybeElement || typeof maybeElement.closest !== 'function') return null;
		const element = maybeElement.closest('[data-container-id]');
		return element?.getAttribute('data-container-id') ?? null;
	}

	function getEdgeIdFromEventTarget(target: EventTarget | null): string | null {
		const maybeElement = target as unknown as Element | null;
		if (!maybeElement || typeof maybeElement.closest !== 'function') return null;
		const element = maybeElement.closest('[data-edge-id]');
		return element?.getAttribute('data-edge-id') ?? null;
	}

	function getSequenceEndpointFromEventTarget(target: EventTarget | null): 'from' | 'to' | null {
		const maybeElement = target as unknown as Element | null;
		if (!maybeElement || typeof maybeElement.closest !== 'function') return null;
		const element = maybeElement.closest('[data-seq-endpoint]');
		const endpoint = element?.getAttribute('data-seq-endpoint');
		return endpoint === 'from' || endpoint === 'to' ? endpoint : null;
	}

	function getSequenceMessageLineElement(edgeId: string): SVGLineElement | null {
		const svgContainer = getSvgContainer();
		if (!svgContainer) return null;
		const svgEdge = svgContainer.querySelector(
			`[data-edge-id="${edgeId}"]`
		) as SVGGraphicsElement | null;
		return svgEdge?.querySelector('line.message-line') as SVGLineElement | null;
	}

	function getActiveSequenceMessageEdgeIdFromTarget(target: EventTarget | null): string | null {
		const edgeIdFromTarget = getEdgeIdFromEventTarget(target);
		if (edgeIdFromTarget?.startsWith('seq-message-')) return edgeIdFromTarget;
		return selection.selectedEdgeId?.startsWith('seq-message-') ? selection.selectedEdgeId : null;
	}

	function getSequenceParticipantNodeIdFromEventTarget(target: EventTarget | null): string | null {
		const fromNode = getNodeIdFromEventTarget(target);
		if (fromNode?.startsWith('seq-participant-')) return fromNode;
		const maybeElement = target as unknown as Element | null;
		if (!maybeElement || typeof maybeElement.closest !== 'function') return null;
		const lifeline = maybeElement.closest('[data-seq-lifeline], [data-participant-id]');
		if (!lifeline) return null;
		const participantNodeId = lifeline.getAttribute('data-participant-id');
		return participantNodeId?.startsWith('seq-participant-') ? participantNodeId : null;
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

	function clearSequenceConnectPreview() {
		sequenceLifelineConnectStartNodeId = null;
		sequenceMessageEndpointDrag = null;
		onSequenceDropTargetHover?.(null);
		onConnectPreviewEnd();
	}

	function clearSequenceReorderPreviews() {
		onSequenceParticipantReorderPreview?.(null);
		onSequenceMessageReorderPreview?.(null);
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

	function getNearestSequenceParticipantTarget(
		sourceNodeId: string,
		clientX: number
	): { targetNodeId: string; position: 'before' | 'after' } | null {
		const svgContainer = getSvgContainer();
		if (!svgContainer) return null;
		const participantElements = Array.from(
			svgContainer.querySelectorAll('[data-node-id^="seq-participant-"]')
		) as SVGGraphicsElement[];
		if (participantElements.length < 2) return null;
		const centers = participantElements
			.map((element) => {
				const nodeId = element.getAttribute('data-node-id');
				if (!nodeId || nodeId === sourceNodeId) return null;
				const rect = element.getBoundingClientRect();
				return { nodeId, x: rect.left + rect.width / 2 };
			})
			.filter((entry): entry is { nodeId: string; x: number } => !!entry);
		if (centers.length === 0) return null;
		let nearest = centers[0];
		let distance = Math.abs(clientX - nearest.x);
		for (const candidate of centers.slice(1)) {
			const d = Math.abs(clientX - candidate.x);
			if (d < distance) {
				nearest = candidate;
				distance = d;
			}
		}
		return {
			targetNodeId: nearest.nodeId,
			position: clientX < nearest.x ? 'before' : 'after'
		};
	}

	function getNearestSequenceParticipantNodeId(clientX: number): string | null {
		const svgContainer = getSvgContainer();
		if (!svgContainer) return null;
		const participantElements = Array.from(
			svgContainer.querySelectorAll('[data-node-id^="seq-participant-"]')
		) as SVGGraphicsElement[];
		if (participantElements.length === 0) return null;

		let nearestNodeId: string | null = null;
		let nearestDistance = Number.POSITIVE_INFINITY;
		for (const element of participantElements) {
			const nodeId = element.getAttribute('data-node-id');
			if (!nodeId) continue;
			const rect = element.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const distance = Math.abs(clientX - centerX);
			if (distance < nearestDistance) {
				nearestDistance = distance;
				nearestNodeId = nodeId;
			}
		}
		return nearestNodeId;
	}

	function getNearestSequenceMessageTarget(
		sourceEdgeId: string,
		clientY: number
	): { targetEdgeId: string; position: 'before' | 'after' } | null {
		const svgContainer = getSvgContainer();
		if (!svgContainer) return null;
		const messageElements = Array.from(
			svgContainer.querySelectorAll('[data-edge-id^="seq-message-"]')
		) as SVGGraphicsElement[];
		if (messageElements.length < 2) return null;
		const centers = messageElements
			.map((element) => {
				const edgeId = element.getAttribute('data-edge-id');
				if (!edgeId || edgeId === sourceEdgeId) return null;
				const rect = element.getBoundingClientRect();
				return { edgeId, y: rect.top + rect.height / 2 };
			})
			.filter((entry): entry is { edgeId: string; y: number } => !!entry);
		if (centers.length === 0) return null;
		let nearest = centers[0];
		let distance = Math.abs(clientY - nearest.y);
		for (const candidate of centers.slice(1)) {
			const d = Math.abs(clientY - candidate.y);
			if (d < distance) {
				nearest = candidate;
				distance = d;
			}
		}
		return {
			targetEdgeId: nearest.edgeId,
			position: clientY < nearest.y ? 'before' : 'after'
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

	function getContainerCoordinatesFromSvgPoint(x: number, y: number): { x: number; y: number } | null {
		const svgContainer = getSvgContainer();
		if (!svgContainer) return null;
		const svg = svgContainer.querySelector('svg');
		if (!svg) return null;
		const svgRect = svg.getBoundingClientRect();
		const containerRect = svgContainer.getBoundingClientRect();
		const viewBox = svg.viewBox?.baseVal;
		if (!viewBox || svgRect.width === 0 || svgRect.height === 0) return null;
		const px = ((x - viewBox.x) / viewBox.width) * svgRect.width;
		const py = ((y - viewBox.y) / viewBox.height) * svgRect.height;
		return {
			x: svgRect.left - containerRect.left + px,
			y: svgRect.top - containerRect.top + py
		};
	}

	function handleCanvasClick(event: MouseEvent) {
		if (!isInteractiveProfile() || !isSelectMode()) return;
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
		if (!isInteractiveProfile()) return;
		if (isTypingTarget(event.target)) return;
		// Don't intercept if we're editing text
		if (selection.editingNodeId || selection.editingEdgeId) return;
		const profileName = getProfileName();
		const canMutateViaKeyboard =
			profileName === ProfileName.diagram || profileName === ProfileName.timeline;

		if (event.key === 'Delete' && canMutateViaKeyboard) {
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
		} else if ((event.ctrlKey || event.metaKey) && event.key === 'c' && canMutateViaKeyboard) {
			clipboardManager.copy(
				getSvgContainer(),
				selection.selectedNodeId,
				selection.selectedEdgeId,
				selection.selectedNodeIds,
				selection.selectedEdgeIds,
				'canvas'
			);
			event.preventDefault();
		} else if ((event.ctrlKey || event.metaKey) && event.key === 'v' && canMutateViaKeyboard) {
			clipboardManager.paste(handleInsertShape, 'canvas');
			event.preventDefault();
		} else if ((event.ctrlKey || event.metaKey) && event.key === 'x' && canMutateViaKeyboard) {
			clipboardManager.cut(
				getSvgContainer(),
				selection.selectedNodeId,
				selection.selectedEdgeId,
				selection.selectedNodeIds,
				selection.selectedEdgeIds,
				undefined,
				'canvas'
			);
			interactionManager.clearSelection();
			event.preventDefault();
		} else if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
			selection.selectAll(getSvgContainer());
			event.preventDefault();
		}
	}

	function handleEditKeyPress(event: KeyboardEvent) {
		if (!isInteractiveProfile() || !isSelectMode()) return;
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
		if (!isInteractiveProfile()) return;
		if (selection.editingNodeId || selection.editingEdgeId) return;

		if (isSequenceProfile() && isSelectMode() && e.button === 0) {
			const endpointHandle = getSequenceEndpointFromEventTarget(e.target);
			const edgeId = getActiveSequenceMessageEdgeIdFromTarget(e.target);
			if (endpointHandle && edgeId?.startsWith('seq-message-')) {
				const lineElement = getSequenceMessageLineElement(edgeId);
				if (lineElement) {
					const x1 = Number.parseFloat(lineElement.getAttribute('x1') || '0');
					const x2 = Number.parseFloat(lineElement.getAttribute('x2') || '0');
					const y = Number.parseFloat(lineElement.getAttribute('y1') || '0');
					const oppositePoint =
						getContainerCoordinatesFromSvgPoint(endpointHandle === 'from' ? x2 : x1, y) ??
						{ x: endpointHandle === 'from' ? x2 : x1, y };
					sequenceMessageEndpointDrag = {
						edgeId,
						endpoint: endpointHandle,
						startPoint: oppositePoint
					};
					// Make endpoint drag immune to panning/lasso state.
					viewport.endPan();
					selection.cancelLasso();
					onConnectPreviewStart(oppositePoint);
					onConnectPreviewMove(oppositePoint);
					e.preventDefault();
					return;
				}
				// Even if line lookup fails, consume the event so pan does not start.
				e.preventDefault();
				return;
			}
		}

		if (isSequenceProfile() && isConnectMode()) {
			if (e.button !== 0) return;
			const participantNodeId = getSequenceParticipantNodeIdFromEventTarget(e.target);
			if (!participantNodeId) {
				clearSequenceConnectPreview();
				return;
			}
			sequenceLifelineConnectStartNodeId = participantNodeId;
			const start = getNodeCenterInContainer(participantNodeId);
			if (start) {
				onConnectPreviewStart(start);
				onConnectPreviewMove(start);
			}
			return;
		}

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
		if (isSequenceProfile() && isSelectMode() && e.button === 0) {
			const participantNodeId = getSequenceParticipantNodeIdFromEventTarget(target);
			if (participantNodeId && !target.closest('[data-edge-id]')) {
				sequenceParticipantDragPending = {
					nodeId: participantNodeId,
					clientX: e.clientX,
					clientY: e.clientY
				};
				return;
			}

			const edgeId = getEdgeIdFromEventTarget(target);
			if (edgeId?.startsWith('seq-message-')) {
				const endpointHandle = getSequenceEndpointFromEventTarget(target);
				const edgeElement = (target as Element).closest('[data-edge-id]') as SVGGraphicsElement | null;
				let lineElement = edgeElement?.querySelector('line.message-line') as SVGLineElement | null;
				if (!lineElement) lineElement = getSequenceMessageLineElement(edgeId);
				if (lineElement) {
					const x1 = Number.parseFloat(lineElement.getAttribute('x1') || '0');
					const x2 = Number.parseFloat(lineElement.getAttribute('x2') || '0');
					const y = Number.parseFloat(lineElement.getAttribute('y1') || '0');
					const svgCoords = getSvgCoordinates(e);
					if (endpointHandle) {
						const oppositePoint = endpointHandle === 'from' ? { x: x2, y } : { x: x1, y };
						sequenceMessageEndpointDrag = {
							edgeId,
							endpoint: endpointHandle,
							startPoint: oppositePoint
						};
						onConnectPreviewStart(oppositePoint);
						onConnectPreviewMove(oppositePoint);
						return;
					}
					if (svgCoords) {
						const nearStart = Math.abs(svgCoords.x - x1) <= 10 && Math.abs(svgCoords.y - y) <= 12;
						const nearEnd = Math.abs(svgCoords.x - x2) <= 10 && Math.abs(svgCoords.y - y) <= 12;
						if (nearStart || nearEnd) {
							const oppositePoint =
								getContainerCoordinatesFromSvgPoint(nearStart ? x2 : x1, y) ??
								{ x: nearStart ? x2 : x1, y };
							sequenceMessageEndpointDrag = {
								edgeId,
								endpoint: nearStart ? 'from' : 'to',
								startPoint: oppositePoint
							};
							onConnectPreviewStart(oppositePoint);
							onConnectPreviewMove(oppositePoint);
							return;
						}
					}
				}
				sequenceMessageDragPending = {
					edgeId,
					clientX: e.clientX,
					clientY: e.clientY
				};
				return;
			}
		}

		if (isDiagramProfile() && isSelectMode() && e.button === 0) {
			const nodeId = getNodeIdFromEventTarget(target);
			if (
				nodeId &&
				!selection.selectedEdgeId &&
				!e.ctrlKey &&
				!e.metaKey &&
				!e.shiftKey
			) {
				nodeDragPending = {
					nodeId,
					clientX: e.clientX,
					clientY: e.clientY
				};
			}
		}
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

		if (isSequenceProfile() && isConnectMode() && sequenceLifelineConnectStartNodeId) {
			const mouse = getContainerCoordinates(e);
			if (mouse) onConnectPreviewMove(mouse);
			return;
		}

		if (isSequenceProfile() && isSelectMode()) {
			if (sequenceMessageEndpointDrag) {
				const mouse = getContainerCoordinates(e);
				const hoveredParticipant =
					getSequenceParticipantNodeIdFromEventTarget(e.target) ??
					getNearestSequenceParticipantNodeId(e.clientX);
				onSequenceDropTargetHover?.(hoveredParticipant);
				if (mouse) onConnectPreviewMove(mouse);
				return;
			}
			if (sequenceParticipantDragPending && !sequenceParticipantDragActiveNodeId) {
				const dx = e.clientX - sequenceParticipantDragPending.clientX;
				const dy = e.clientY - sequenceParticipantDragPending.clientY;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance > 6) {
					sequenceParticipantDragActiveNodeId = sequenceParticipantDragPending.nodeId;
				}
			}
			if (sequenceMessageDragPending && !sequenceMessageDragActiveEdgeId) {
				const dx = e.clientX - sequenceMessageDragPending.clientX;
				const dy = e.clientY - sequenceMessageDragPending.clientY;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance > 6) {
					sequenceMessageDragActiveEdgeId = sequenceMessageDragPending.edgeId;
				}
			}
			if (sequenceParticipantDragActiveNodeId || sequenceMessageDragActiveEdgeId) {
				if (sequenceParticipantDragActiveNodeId) {
					const target = getNearestSequenceParticipantTarget(
						sequenceParticipantDragActiveNodeId,
						e.clientX
					);
					if (target) {
						const svgContainer = getSvgContainer();
						const targetElement = svgContainer?.querySelector(
							`[data-node-id="${target.targetNodeId}"]`
						) as SVGGraphicsElement | null;
						if (svgContainer && targetElement) {
							const containerRect = svgContainer.getBoundingClientRect();
							const targetRect = targetElement.getBoundingClientRect();
							const x =
								target.position === 'before'
									? targetRect.left - containerRect.left
									: targetRect.right - containerRect.left;
							onSequenceParticipantReorderPreview?.({
								targetNodeId: target.targetNodeId,
								position: target.position,
								x
							});
						}
					}
				}
				if (sequenceMessageDragActiveEdgeId) {
					const target = getNearestSequenceMessageTarget(sequenceMessageDragActiveEdgeId, e.clientY);
					if (target) {
						const svgContainer = getSvgContainer();
						const targetElement = svgContainer?.querySelector(
							`[data-edge-id="${target.targetEdgeId}"]`
						) as SVGGraphicsElement | null;
						if (svgContainer && targetElement) {
							const containerRect = svgContainer.getBoundingClientRect();
							const targetRect = targetElement.getBoundingClientRect();
							const y =
								target.position === 'before'
									? targetRect.top - containerRect.top
									: targetRect.bottom - containerRect.top;
							onSequenceMessageReorderPreview?.({
								targetEdgeId: target.targetEdgeId,
								position: target.position,
								y
							});
						}
					}
				}
				return;
			}
		}

		if (isConnectMode() && connectStartNodeId) {
			const mouse = getContainerCoordinates(e);
			if (mouse) onConnectPreviewMove(mouse);
		}

		if (isDiagramProfile() && isSelectMode()) {
			if (nodeDragPending && !nodeDragActiveNodeId) {
				const dx = e.clientX - nodeDragPending.clientX;
				const dy = e.clientY - nodeDragPending.clientY;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance > 6) {
					nodeDragActiveNodeId = nodeDragPending.nodeId;
					onNodeContainerDragStart?.({
						nodeId: nodeDragActiveNodeId,
						clientX: e.clientX,
						clientY: e.clientY,
						targetContainerId: getContainerIdFromEventTarget(e.target)
					});
				}
			}
			if (nodeDragActiveNodeId) {
				onNodeContainerDragMove?.({
					nodeId: nodeDragActiveNodeId,
					clientX: e.clientX,
					clientY: e.clientY,
					targetContainerId: getContainerIdFromEventTarget(e.target)
				});
				return;
			}
		}

		if (selection.isLassoPending || selection.isLassoActive) {
			selection.updateLasso(viewport.mouseX, viewport.mouseY);
		} else if (viewport.isPanning) {
			viewport.updatePan(e.clientX, e.clientY);
		}
	}

	function handleMouseUp() {
		if (!isInteractiveProfile()) return;

		if (sequenceParticipantDragActiveNodeId) {
			sequenceParticipantDragPending = null;
			sequenceParticipantDragActiveNodeId = null;
			clearSequenceReorderPreviews();
			return;
		}
		sequenceParticipantDragPending = null;

		if (sequenceMessageDragActiveEdgeId) {
			sequenceMessageDragPending = null;
			sequenceMessageDragActiveEdgeId = null;
			clearSequenceReorderPreviews();
			return;
		}
		sequenceMessageDragPending = null;

		if (nodeDragActiveNodeId) {
			nodeDragPending = null;
			nodeDragActiveNodeId = null;
			return;
		}
		nodeDragPending = null;

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
		if (isSequenceProfile() && isSelectMode() && sequenceMessageEndpointDrag) {
			const targetNodeId =
				getSequenceParticipantNodeIdFromEventTarget(e.target) ??
				getNearestSequenceParticipantNodeId(e.clientX);
			if (targetNodeId) {
				onSequenceRetargetMessageEndpoint?.({
					edgeId: sequenceMessageEndpointDrag.edgeId,
					endpoint: sequenceMessageEndpointDrag.endpoint,
					participantNodeId: targetNodeId
				});
			}
			clearSequenceConnectPreview();
			return;
		}

		if (isSequenceProfile() && isSelectMode() && sequenceParticipantDragActiveNodeId) {
			const target = getNearestSequenceParticipantTarget(sequenceParticipantDragActiveNodeId, e.clientX);
			if (target) {
				onSequenceParticipantReorder?.({
					sourceNodeId: sequenceParticipantDragActiveNodeId,
					targetNodeId: target.targetNodeId,
					position: target.position
				});
			}
			sequenceParticipantDragPending = null;
			sequenceParticipantDragActiveNodeId = null;
			clearSequenceReorderPreviews();
			return;
		}

		if (isSequenceProfile() && isSelectMode() && sequenceMessageDragActiveEdgeId) {
			const target = getNearestSequenceMessageTarget(sequenceMessageDragActiveEdgeId, e.clientY);
			if (target) {
				onSequenceMessageReorder?.({
					sourceEdgeId: sequenceMessageDragActiveEdgeId,
					targetEdgeId: target.targetEdgeId,
					position: target.position
				});
			}
			sequenceMessageDragPending = null;
			sequenceMessageDragActiveEdgeId = null;
			clearSequenceReorderPreviews();
			return;
		}

		if (isSequenceProfile() && isConnectMode() && sequenceLifelineConnectStartNodeId) {
			const targetNodeId = getSequenceParticipantNodeIdFromEventTarget(e.target);
			if (targetNodeId && targetNodeId !== sequenceLifelineConnectStartNodeId) {
				onSequenceCreateMessage?.({
					fromNodeId: sequenceLifelineConnectStartNodeId,
					toNodeId: targetNodeId
				});
			}
			clearSequenceConnectPreview();
			return;
		}

		if (nodeDragActiveNodeId) {
			onNodeContainerDragEnd?.({
				nodeId: nodeDragActiveNodeId,
				clientX: e.clientX,
				clientY: e.clientY,
				targetContainerId: getContainerIdFromEventTarget(e.target)
			});
			nodeDragPending = null;
			nodeDragActiveNodeId = null;
			return;
		}
		nodeDragPending = null;

		if (!isInteractiveProfile() || !isConnectMode()) {
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
