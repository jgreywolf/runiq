<script lang="ts">
	import { getShapeCategoryByProfile } from '$lib/data/toolbox-data';
	import { canvasState, diagramState } from '$lib/state';
import {
	editorRefs,
	editorState,
		handleDelete,
		handleEdit,
		handleInsertEdge,
		handleInsertShape,
		handleInsertShapeAndEdge,
		handleParse,
		handleResetStyles,
	updateCode
} from '$lib/state/editorState.svelte';
import { applyDraftOperation } from '$lib/state/draftOperations';
	import { ProfileName } from '$lib/types';
	import { InteractionManager } from '$lib/utils/interactionManager.svelte';
	import { clipboardManager } from '$lib/utils/clipboardManager.svelte';
	import { listBrandIconNames } from '@runiq/icons-brand';
	import { listIconifyIconNamesForDsl } from '@runiq/icons-iconify';
	import { getAvailableBaseThemes } from '@runiq/core';
	import { type DiagramProfile, type NodeLocation, type WarningDetail } from '@runiq/parser-dsl';
	import { onMount, tick } from 'svelte';
	import EditorToolbar from './Editor/EditorToolbar.svelte';
	import ContainerPickerFlyout from './ContainerPickerFlyout.svelte';
	import ImageInsertFlyout from './ImageInsertFlyout.svelte';
	import ShapePickerFlyout from './ShapePickerFlyout.svelte';
	import CanvasInteractionLayer from './visual-canvas/CanvasInteractionLayer.svelte';
	import CanvasStateOverlay from './visual-canvas/CanvasStateOverlay.svelte';
	import CanvasStatusBar from './visual-canvas/CanvasStatusBar.svelte';
	import { createCanvasEventHandlers } from './visual-canvas/canvasEventHandlers';
	import { createCanvasDebugLogger } from './visual-canvas/debug';
	import ElementToolbar from './visual-canvas/ElementToolbar.svelte';
	import QuickConnectOverlay from './visual-canvas/QuickConnectOverlay.svelte';
	import {
		computeElementToolbarPosition,
		constrainToolbarPosition
	} from './visual-canvas/elementToolbarPosition';
	import {
		closeAllPanels as closePanelState,
		createFillDraftFromStyles,
		createInitialPanelOpen,
		getFilteredIconTokens as getFilteredIconTokensFromState,
		type ElementPanelKey
	} from './visual-canvas/elementToolbarState';
import {
	getFilteredStyleDeclarations
} from './visual-canvas/elementStyleActions';
import {
	applyStyleRefForSelection,
	clearStyleRefForSelection,
	openCreateStyleDialogWorkflow,
	removeStyleDeclarationWorkflow,
	saveStyleDeclarationAndApplyWorkflow
} from './visual-canvas/elementStyleWorkflow';
import {
	applyBorderDraftForSelected,
		applyFillDraftForSelected,
		applyIconToSelectedNode,
		applyTextDraftForSelected,
		clearIconOnSelectedNode,
		openBorderPanelDraft,
		openFillPanelDraft,
	openIconPanelDraft,
	openTextPanelDraft
} from './visual-canvas/elementPanelActions';
import {
	applyShapeToSelection,
	deleteSelectionFromToolbar,
	handlePanelOpenChange as handlePanelOpenChangeOrchestrated
} from './visual-canvas/elementToolbarOrchestrator';
import { createGlobalPointerDismissHandler } from './visual-canvas/elementToolbarDismiss';
import {
	hasAnySelection,
	hasPrimarySelection,
	shouldClearElementToolbar,
	shouldRepositionElementToolbar
} from './visual-canvas/elementToolbarVisibility';
import { supportsCanvasSelection } from './visual-canvas/interactiveProfiles';
	import {
		getQuickConnectBehaviorFromModifiers,
		type QuickConnectBehavior,
		type QuickConnectDirection
	} from './visual-canvas/quickConnect';
	import {
		type QuickConnectHandle
	} from './visual-canvas/quickConnectRuntime';
import {
		activateQuickConnectPreview,
		resetQuickConnectState,
		runQuickConnect as runQuickConnectAction,
		updateQuickConnectFromMouseEvent as updateQuickConnectFromMouseEventAction
	} from './visual-canvas/quickConnectActions';
	import { withQuickConnectState } from './visual-canvas/quickConnectStateBridge';
	import { createCanvasRenderRuntime } from './visual-canvas/renderRuntime';
	import { renderDiagram as renderDiagramUtil } from './visual-canvas/renderingUtils';
	import { resolveSelectionSourceLocation } from './visual-canvas/selectionCodeNavigation';
	import { SelectionState } from './visual-canvas/SelectionState.svelte';
	import {
		extractSelectedElementStyles,
	} from './visual-canvas/viewModel';
	import { ViewportState } from './visual-canvas/ViewportState.svelte';
	import {
		applyRenderEmptyState,
		applyRenderErrorState,
		applyRenderSuccessState,
		computeWarningUiState,
		getFloatingToolbarTop,
		jumpToWarningLocation,
		type RenderStateCallbacks,
		shouldForceSelectMode
	} from './visual-canvas/warningStatusOrchestration';
	import { applyThemeToDsl } from './Editor/editorToolbarActions';

	let diagramDataId = 'runiq-diagram';

	let svgOutput = $state('');
	let isRendering = $state(false);
	let parseTime = $state(0);
	let renderTime = $state(0);
	let transientStatusMessage = $state<string | null>(null);
	let showWarnings = $state(false);
	let lastWarningCount = $state(0);
	let warningDetails = $state<WarningDetail[]>([]);
	let combinedWarnings = $state<string[]>([]);
	let canvasContextMenu = $state<{ x: number; y: number } | null>(null);
	let elementContextMenu = $state<
		{
			x: number;
			y: number;
			nodeId: string | null;
			edgeId: string | null;
			containerId: string | null;
			containerLabel: string | null;
		} | null
	>(null);
	let contextShapeFlyout = $state<{
		x: number;
		y: number;
		target: 'canvas' | 'element';
		containerId: string | null;
		containerLabel: string | null;
	} | null>(null);
	let contextContainerFlyout = $state<{
		x: number;
		y: number;
		target: 'canvas' | 'element';
		containerId: string | null;
		containerLabel: string | null;
	} | null>(null);
	let contextImageFlyout = $state<{
		x: number;
		y: number;
		target: 'canvas' | 'element';
		containerId: string | null;
		containerLabel: string | null;
	} | null>(null);
	let styleClipboard = $state<{
		kind: 'node' | 'edge';
		styleRef?: string;
		properties: Record<string, string | number | boolean>;
	} | null>(null);
	let containerClipboard = $state<{ id: string; block: string } | null>(null);
	let connectPreviewStart = $state<{ x: number; y: number } | null>(null);
	let connectPreviewEnd = $state<{ x: number; y: number } | null>(null);
	let quickConnectNodeId = $state<string | null>(null);
	let quickConnectHandles = $state<QuickConnectHandle[]>([]);
	let quickConnectActiveDirection = $state<QuickConnectDirection | null>(null);
	let quickConnectPreviewStart = $state<{ x: number; y: number } | null>(null);
	let quickConnectPreviewEnd = $state<{ x: number; y: number } | null>(null);
	let quickConnectTargetNodeId = $state<string | null>(null);
	let quickConnectNewNodePosition = $state<{ x: number; y: number } | null>(null);
	let quickConnectBehaviorHint = $state<QuickConnectBehavior>('auto');
	let nodeContainerDrag = $state<{
		nodeId: string;
		label: string;
		width: number;
		height: number;
		x: number;
		y: number;
		connectedTargets: { x: number; y: number }[];
		hoverContainerId: string | null;
		hoverContainerRect: { x: number; y: number; width: number; height: number } | null;
	} | null>(null);
	let iconInputValue = $state('');
	let iconSearchQuery = $state('');
	let panelOpen = $state<Record<ElementPanelKey, boolean>>(createInitialPanelOpen());
	let elementToolbarPosition = $state<{ x: number; y: number } | null>(null);
	let lastSelectionJumpKey = $state('');

	let borderDraft = $state({
		strokeColor: '#48677e',
		strokeWidth: 2,
		lineStyle: 'solid' as 'solid' | 'dashed' | 'dotted' | 'none'
	});
	let fillDraft = $state({ fillColor: '#ffffff' });
	let textDraft = $state({ textColor: '#1f2937', fontSize: 14, fontFamily: 'sans-serif' });
	let styleSearchQuery = $state('');
	let showCreateStyleDialog = $state(false);
	let editingStyleName = $state<string | null>(null);
	let newStyleName = $state('');
	let newStyleDraft = $state({
		fillColor: '',
		strokeColor: '',
		strokeWidth: 2,
		textColor: '',
		fontSize: 14,
		fontFamily: '',
		lineStyle: 'solid'
	});

	const canvasDebug = createCanvasDebugLogger();
	const debugCanvas = canvasDebug.log;

	const availableIconTokens = [
		...listBrandIconNames().map((name) => `brand/${name.replace(/-/g, '_')}`),
		...listIconifyIconNamesForDsl().map((name) => `iconify/${name}`)
	];
	const availableThemes = getAvailableBaseThemes();
	const diagramShapeCategories = getShapeCategoryByProfile(ProfileName.diagram).map((category) => ({
		label: category.label,
		shapes: category.shapes.map((shape) => ({ id: shape.id, label: shape.label }))
	}));
	const borderStyleChoices = [
		{ id: 'solid', label: 'Solid', icon: 'lucide:minus' },
		{ id: 'dashed', label: 'Dashed', icon: 'lucide:ellipsis' },
		{ id: 'dotted', label: 'Dotted', icon: 'lucide:grip-horizontal' },
		{ id: 'none', label: 'None', icon: 'lucide:slash' }
	] as const;

	const filteredIconTokens = $derived(
		getFilteredIconTokensFromState(availableIconTokens, iconSearchQuery)
	);
	const floatingToolbarTop = $derived(
		getFloatingToolbarTop(showWarnings, warningDetails.length, combinedWarnings.length)
	);

	// DOM element references
	let svgContainer = $state<HTMLDivElement | null>(null);
	let floatingToolbarElement = $state<HTMLDivElement | null>(null);

	// Selection state managed by SelectionState class
	// Synced with centralized editorState for consistency
	const selection = new SelectionState();

	// Viewport state managed by ViewportState class
	const viewport = new ViewportState({
		minScale: 0.1,
		maxScale: 5
	});

	// Register viewport with editorRefs for toolbar access
	editorRefs.viewport = viewport;

	// Interaction manager for coordinating mouse events and handlers
	const interactionManager = new InteractionManager(selection, viewport);

	// Effect to select all text when editing starts
	$effect(() => {
		if (selection.editInputPosition && (selection.editingNodeId || selection.editingEdgeId)) {
			const input = document.querySelector('.edit-input') as HTMLInputElement;
			if (input) {
				input.select();
			}
		}
	});

	// Effect to update interactionManager's svgContainer reference
	$effect(() => {
		interactionManager.setSvgContainer(svgContainer);
	});

	$effect(() => {
		const next = computeWarningUiState({
			warningDetails,
			diagramWarnings: diagramState.warnings,
			lintWarnings: editorState.lintWarnings,
			currentShowWarnings: showWarnings,
			lastWarningCount
		});
		const warningsChanged =
			combinedWarnings.length !== next.combinedWarnings.length ||
			combinedWarnings.some((warning, index) => warning !== next.combinedWarnings[index]);
		if (warningsChanged) {
			combinedWarnings = next.combinedWarnings;
		}
		if (showWarnings !== next.showWarnings) {
			showWarnings = next.showWarnings;
		}
		if (lastWarningCount !== next.lastWarningCount) {
			lastWarningCount = next.lastWarningCount;
		}
		debugCanvas('effect:merge-warnings', { merged: combinedWarnings.length });
	});

	$effect(() => {
		if (shouldForceSelectMode(diagramState.errors.length, canvasState.mode)) {
			debugCanvas('effect:force-select-mode-on-errors', {
				errorCount: diagramState.errors.length,
				mode: canvasState.mode
			});
			canvasState.mode = 'select';
		}
	});

	$effect(() => {
		if (canvasState.mode !== 'connect') {
			connectPreviewStart = null;
			connectPreviewEnd = null;
			resetQuickConnect();
			debugCanvas('effect:exit-connect-mode');
		}
	});

	$effect(() => {
		if (
			shouldClearElementToolbar({
				selectedNodeId: selection.selectedNodeId,
				selectedEdgeId: selection.selectedEdgeId,
				profileName: editorState.profileName,
				mode: canvasState.mode
			})
		) {
			closeAllPanels();
			if (elementToolbarPosition !== null) {
				elementToolbarPosition = null;
			}
			debugCanvas('effect:clear-panel-no-selection', {
				hasPrimarySelection: hasPrimarySelection(
					selection.selectedNodeId,
					selection.selectedEdgeId
				),
				profile: editorState.profileName,
				mode: canvasState.mode
			});
		}
	});

	$effect(() => {
		if (selection.editingNodeId || selection.editingEdgeId) {
			closeAllPanels();
			elementToolbarPosition = null;
		}
	});

	function getSelectedEdgeEndpoints(edgeId: string): { from: string | null; to: string | null } {
		const diagramSvg = getDiagramSvg();
		if (!diagramSvg) return { from: null, to: null };
		const edgeElement = diagramSvg.querySelector(`[data-edge-id="${edgeId}"]`);
		if (!edgeElement) return { from: null, to: null };
		return {
			from: edgeElement.getAttribute('data-edge-from'),
			to: edgeElement.getAttribute('data-edge-to')
		};
	}

	$effect(() => {
		const selectedNodeId = selection.selectedNodeId;
		const selectedEdgeId = selection.selectedEdgeId;
		const profileName = editorState.profileName;
		const selectionKey = `${profileName ?? 'none'}:${selectedNodeId ?? ''}:${selectedEdgeId ?? ''}`;

		if (!selectedNodeId && !selectedEdgeId) {
			lastSelectionJumpKey = '';
			return;
		}

		if (selectionKey === lastSelectionJumpKey) return;
		lastSelectionJumpKey = selectionKey;

		const edgeEndpoints = selectedEdgeId
			? getSelectedEdgeEndpoints(selectedEdgeId)
			: { from: null, to: null };
		const location = resolveSelectionSourceLocation({
			code: editorState.code,
			profileName,
			selectedNodeId,
			selectedEdgeId,
			selectedEdgeFrom: edgeEndpoints.from,
			selectedEdgeTo: edgeEndpoints.to,
			nodeLocations: diagramState.nodeLocations
		});

		if (!location) return;

		editorState.showCodeEditor = true;
		editorState.activeTab = 'syntax';
		tick().then(() => {
			editorRefs.code?.jumpTo(location.line, location.column, { focus: false, selectLine: true });
		});
	});

	function getSelectedElementId(): string | null {
		return selection.selectedNodeId || selection.selectedEdgeId;
	}

	function updateElementToolbarPosition() {
		const nextPosition = computeElementToolbarPosition(
			svgContainer,
			selection.selectedNodeId,
			selection.selectedEdgeId
		);
		if (!nextPosition) {
			elementToolbarPosition = null;
			debugCanvas('update-toolbar-position:none');
			return;
		}
		elementToolbarPosition = nextPosition;
		debugCanvas('update-toolbar-position:set', elementToolbarPosition);
	}

	function constrainToolbarToCanvasBounds() {
		if (!svgContainer || !floatingToolbarElement || !elementToolbarPosition) return;
		const containerRect = svgContainer.getBoundingClientRect();
		const toolbarRect = floatingToolbarElement.getBoundingClientRect();
		const clamped = constrainToolbarPosition(elementToolbarPosition, containerRect, toolbarRect);

		const positionChanged =
			Math.abs((elementToolbarPosition?.x ?? 0) - clamped.x) > 0.5 ||
			Math.abs((elementToolbarPosition?.y ?? 0) - clamped.y) > 0.5;
		if (positionChanged) {
			elementToolbarPosition = clamped;
		}

		debugCanvas('constrain-toolbar', {
			position: elementToolbarPosition
		});
	}

	$effect(() => {
		if (
			shouldRepositionElementToolbar({
				selectedNodeId: selection.selectedNodeId,
				selectedEdgeId: selection.selectedEdgeId,
				profileName: editorState.profileName,
				mode: canvasState.mode
			})
		) {
			debugCanvas('effect:recompute-toolbar-position', {
				node: selection.selectedNodeId,
				edge: selection.selectedEdgeId
			});
			tick().then(() => {
				updateElementToolbarPosition();
				tick().then(() => constrainToolbarToCanvasBounds());
			});
		}
	});

	$effect(() => {
		if (canvasState.mode === 'connect') {
			const hasActiveSelection = hasAnySelection({
				selectedNodeId: selection.selectedNodeId,
				selectedEdgeId: selection.selectedEdgeId,
				selectedNodeIdsSize: selection.selectedNodeIds.size,
				selectedEdgeIdsSize: selection.selectedEdgeIds.size
			});
			if (!hasActiveSelection) return;

			queueMicrotask(() => {
				selection.clearSelection();
				selection.updateVisualSelection(svgContainer);
			});
		}
	});

	// Effect to attach interactive handlers when SVG output changes
	$effect(() => {
		if (svgOutput) {
			// Wait for Svelte to update the DOM, then attach handlers
			tick().then(() => {
				interactionManager.attachHandlers(svgContainer, getDiagramSvg);
				interactionManager.restoreSelection(svgContainer, getDiagramSvg);
			});
		}
	});

	function getDiagramSvg() {
		if (!svgContainer) return null;
		const svgs = svgContainer.querySelectorAll<SVGSVGElement>('svg');
		for (const svg of svgs) {
			if (svg.querySelector('[data-node-id], [data-edge-id], [data-container-id]')) {
				return svg;
			}
		}
		return svgs[0] ?? null;
	}

	function getContainerPointFromClient(clientX: number, clientY: number): { x: number; y: number } | null {
		if (!svgContainer) return null;
		const rect = svgContainer.getBoundingClientRect();
		return { x: clientX - rect.left, y: clientY - rect.top };
	}

	function getNodeLabelById(nodeId: string): string {
		const node = (diagramState.profile as any)?.nodes?.find((n: any) => n.id === nodeId);
		return (node?.label as string) || nodeId;
	}

	function getNodeRectInContainer(nodeId: string): { x: number; y: number; width: number; height: number } | null {
		if (!svgContainer) return null;
		const nodeElement = svgContainer.querySelector(`[data-node-id="${nodeId}"]`) as SVGGraphicsElement | null;
		if (!nodeElement) return null;
		const nodeRect = nodeElement.getBoundingClientRect();
		const containerRect = svgContainer.getBoundingClientRect();
		return {
			x: nodeRect.left - containerRect.left,
			y: nodeRect.top - containerRect.top,
			width: nodeRect.width,
			height: nodeRect.height
		};
	}

	function getConnectedNodeCenters(nodeId: string): { x: number; y: number }[] {
		if (!svgContainer) return [];
		const profile = diagramState.profile as any;
		const edges = (profile?.edges as any[]) || [];
		const connectedNodeIds = new Set<string>();
		for (const edge of edges) {
			if (edge?.from === nodeId && edge?.to) connectedNodeIds.add(edge.to);
			if (edge?.to === nodeId && edge?.from) connectedNodeIds.add(edge.from);
		}
		const containerRect = svgContainer.getBoundingClientRect();
		const centers: { x: number; y: number }[] = [];
		for (const id of connectedNodeIds) {
			const nodeElement = svgContainer.querySelector(`[data-node-id="${id}"]`) as SVGGraphicsElement | null;
			if (!nodeElement) continue;
			const rect = nodeElement.getBoundingClientRect();
			centers.push({
				x: rect.left - containerRect.left + rect.width / 2,
				y: rect.top - containerRect.top + rect.height / 2
			});
		}
		return centers;
	}

	function getContainerRectInCanvas(containerId: string | null): {
		x: number;
		y: number;
		width: number;
		height: number;
	} | null {
		if (!containerId || !svgContainer) return null;
		const element = svgContainer.querySelector(`[data-container-id="${containerId}"]`) as SVGGraphicsElement | null;
		if (!element) return null;
		const rect = element.getBoundingClientRect();
		const containerRect = svgContainer.getBoundingClientRect();
		return {
			x: rect.left - containerRect.left,
			y: rect.top - containerRect.top,
			width: rect.width,
			height: rect.height
		};
	}

	function unindentBlock(lines: string[]): string {
		let minIndent = Number.POSITIVE_INFINITY;
		for (const line of lines) {
			if (!line.trim()) continue;
			const indent = (line.match(/^\s*/) || [''])[0].length;
			minIndent = Math.min(minIndent, indent);
		}
		if (!Number.isFinite(minIndent)) return lines.join('\n');
		return lines
			.map((line) => {
				if (!line.trim()) return '';
				return line.slice(minIndent);
			})
			.join('\n');
	}

	function readQuickConnectState() {
		return {
			quickConnectNodeId,
			quickConnectHandles,
			quickConnectActiveDirection,
			quickConnectPreviewStart,
			quickConnectPreviewEnd,
			quickConnectTargetNodeId,
			quickConnectNewNodePosition
		};
	}

	function writeQuickConnectState(state: ReturnType<typeof readQuickConnectState>) {
		if (quickConnectNodeId !== state.quickConnectNodeId) {
			quickConnectNodeId = state.quickConnectNodeId;
		}
		if (quickConnectHandles !== state.quickConnectHandles) {
			quickConnectHandles = state.quickConnectHandles;
		}
		if (quickConnectActiveDirection !== state.quickConnectActiveDirection) {
			quickConnectActiveDirection = state.quickConnectActiveDirection;
		}
		if (quickConnectPreviewStart !== state.quickConnectPreviewStart) {
			quickConnectPreviewStart = state.quickConnectPreviewStart;
		}
		if (quickConnectPreviewEnd !== state.quickConnectPreviewEnd) {
			quickConnectPreviewEnd = state.quickConnectPreviewEnd;
		}
		if (quickConnectTargetNodeId !== state.quickConnectTargetNodeId) {
			quickConnectTargetNodeId = state.quickConnectTargetNodeId;
		}
		if (quickConnectNewNodePosition !== state.quickConnectNewNodePosition) {
			quickConnectNewNodePosition = state.quickConnectNewNodePosition;
		}
	}

	function resetQuickConnect() {
		const alreadyReset =
			quickConnectNodeId === null &&
			quickConnectHandles.length === 0 &&
			quickConnectActiveDirection === null &&
			quickConnectPreviewStart === null &&
			quickConnectPreviewEnd === null &&
			quickConnectTargetNodeId === null &&
			quickConnectNewNodePosition === null;
		if (alreadyReset) {
			if (quickConnectBehaviorHint !== 'auto') {
				quickConnectBehaviorHint = 'auto';
			}
			return;
		}

		withQuickConnectState(
			{
				read: readQuickConnectState,
				write: writeQuickConnectState
			},
			(state) => {
				resetQuickConnectState(state);
			}
		);
		quickConnectBehaviorHint = 'auto';
	}

	// function getContainerPointFromClient(clientX: number, clientY: number): { x: number; y: number } | null {
	// 	if (!svgContainer) return null;
	// 	const rect = svgContainer.getBoundingClientRect();
	// 	return { x: clientX - rect.left, y: clientY - rect.top };
	// }

	function activateQuickConnect(
		nodeId: string,
		direction: QuickConnectDirection,
		behavior: QuickConnectBehavior = 'auto'
	) {
		withQuickConnectState(
			{
				read: readQuickConnectState,
				write: writeQuickConnectState
			},
			(state) => {
				activateQuickConnectPreview({
					state,
					svgContainer,
					profile: diagramState.profile as any,
					nodeId,
					direction,
					behavior
				});
			}
		);
	}

	function runQuickConnect(
		nodeId: string,
		direction: QuickConnectDirection,
		behavior: QuickConnectBehavior = 'auto'
	) {
		const finalState = withQuickConnectState(
			{
				read: readQuickConnectState,
				write: writeQuickConnectState
			},
			(state) => {
				runQuickConnectAction({
					state,
					svgContainer,
					profile: diagramState.profile as any,
					nodeId,
					direction,
					behavior,
					newNodeId: `id${editorState.shapeCounter}`,
					onInsertEdge: handleInsertEdge,
					onInsertShapeAndEdge: handleInsertShapeAndEdge
				});
				return state;
			}
		);
		if (finalState.quickConnectNodeId === null) {
			quickConnectBehaviorHint = 'auto';
		}
	}

	function updateQuickConnectFromMouseEvent(event: MouseEvent) {
		withQuickConnectState(
			{
				read: readQuickConnectState,
				write: writeQuickConnectState
			},
			(state) => {
				updateQuickConnectFromMouseEventAction({
					state,
					event,
					profileName: editorState.profileName,
					mode: canvasState.mode,
					connectPreviewStart,
					svgContainer
				});
			}
		);
	}

	function handleCanvasMouseMove(event: MouseEvent) {
		if (editorState.profileName === ProfileName.diagram && canvasState.mode === 'connect') {
			quickConnectBehaviorHint = getQuickConnectBehaviorFromModifiers(event);
		}
		updateQuickConnectFromMouseEvent(event);
		handleMouseMove(event);
	}

	function handleCanvasMouseLeave(event: MouseEvent) {
		quickConnectBehaviorHint = 'auto';
		resetQuickConnect();
		handleMouseUp(event);
	}

	function resolveContainerUnderPointer(
		clientX: number,
		clientY: number,
		fallbackContainerId: string | null
	): string | null {
		const elements = document.elementsFromPoint(clientX, clientY);
		for (const element of elements) {
			if (!(element instanceof Element)) continue;
			const container = element.closest('[data-container-id]');
			const containerId = container?.getAttribute('data-container-id');
			if (containerId) return containerId;
		}
		return fallbackContainerId;
	}

	function handleNodeContainerDragStart(payload: {
		nodeId: string;
		clientX: number;
		clientY: number;
		targetContainerId: string | null;
	}) {
		const rect = getNodeRectInContainer(payload.nodeId);
		const mouse = getContainerPointFromClient(payload.clientX, payload.clientY);
		if (!rect || !mouse) return;
		const resolvedContainerId = resolveContainerUnderPointer(
			payload.clientX,
			payload.clientY,
			payload.targetContainerId
		);
		nodeContainerDrag = {
			nodeId: payload.nodeId,
			label: getNodeLabelById(payload.nodeId),
			width: Math.max(56, rect.width),
			height: Math.max(30, rect.height),
			x: mouse.x - Math.max(56, rect.width) / 2,
			y: mouse.y - Math.max(30, rect.height) / 2,
			connectedTargets: getConnectedNodeCenters(payload.nodeId),
			hoverContainerId: resolvedContainerId,
			hoverContainerRect: getContainerRectInCanvas(resolvedContainerId)
		};
	}

	function handleNodeContainerDragMove(payload: {
		nodeId: string;
		clientX: number;
		clientY: number;
		targetContainerId: string | null;
	}) {
		if (!nodeContainerDrag || nodeContainerDrag.nodeId !== payload.nodeId) return;
		const mouse = getContainerPointFromClient(payload.clientX, payload.clientY);
		if (!mouse) return;
		const resolvedContainerId = resolveContainerUnderPointer(
			payload.clientX,
			payload.clientY,
			payload.targetContainerId
		);
		nodeContainerDrag = {
			...nodeContainerDrag,
			x: mouse.x - nodeContainerDrag.width / 2,
			y: mouse.y - nodeContainerDrag.height / 2,
			hoverContainerId: resolvedContainerId,
			hoverContainerRect: getContainerRectInCanvas(resolvedContainerId)
		};
	}

	function handleNodeContainerDragEnd(payload: {
		nodeId: string;
		clientX: number;
		clientY: number;
		targetContainerId: string | null;
	}) {
		const resolvedContainerId = resolveContainerUnderPointer(
			payload.clientX,
			payload.clientY,
			payload.targetContainerId
		);
		const targetContainerLabel =
			resolvedContainerId && svgContainer
				? (
						svgContainer
							.querySelector(`[data-container-id="${resolvedContainerId}"] .runiq-container-label`)
							?.textContent?.trim() || null
					)
				: null;
		if (resolvedContainerId) {
			const moved = moveNodeIntoContainer(payload.nodeId, resolvedContainerId, targetContainerLabel);
			if (moved) {
				showTransientStatus(`Moved "${getNodeLabelById(payload.nodeId)}" into container.`);
			}
		}
		nodeContainerDrag = null;
	}

	function closeCanvasContextMenu() {
		canvasContextMenu = null;
		contextShapeFlyout = null;
		contextContainerFlyout = null;
		contextImageFlyout = null;
	}

	function closeElementContextMenu() {
		elementContextMenu = null;
		contextShapeFlyout = null;
		contextContainerFlyout = null;
		contextImageFlyout = null;
	}

	function insertShapeFromContext(shapeCode: string) {
		const trimmedShapeCode = shapeCode.trim();
		const supportsDirectInsert = /^(shape|container|group)\b/.test(trimmedShapeCode);
		if (!supportsDirectInsert) {
			// Ignore non-shape clipboard items in context insert flows.
			return;
		}

		const beforeCode = editorState.code || '';
		const result = applyDraftOperation(beforeCode, editorState.shapeCounter, {
			type: 'insert-shape',
			shapeCode: trimmedShapeCode
		});
		if (result.newCode !== beforeCode) {
			editorState.shapeCounter += result.shapeCounterDelta;
			updateCode(result.newCode, true);
			return;
		}

		// Fallback only when editor is empty.
		// Never replace existing documents when insertion fails.
		if (beforeCode.trim().length > 0) {
			console.warn('Context insert skipped: unable to locate a valid profile block for insertion.');
			return;
		}

		// Bootstrap a minimal diagram when there is no existing content.
		const nextId = `id${editorState.shapeCounter}`;
		const normalizedShape = trimmedShapeCode.replace(/\bid\b/g, nextId);
		const bootstrapCode = `diagram "New Diagram" {\n  ${normalizedShape}\n}`;
		editorState.shapeCounter += 1;
		updateCode(bootstrapCode, true);
	}

	function escapeDslString(value: string): string {
		return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
	}

	function findTimelineStatementLineIndex(lines: string[], nodeId: string): number {
		const id = nodeId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const timelineRegex = new RegExp(`^\\s*(event|period|task|milestone)\\s+${id}(?:\\s|$)`);
		for (let i = 0; i < lines.length; i++) {
			if (timelineRegex.test(lines[i])) return i;
		}
		return -1;
	}

	function buildUniqueTimelineId(lines: string[], baseId: string): string {
		const code = lines.join('\n');
		const escaped = baseId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		if (!new RegExp(`\\b${escaped}\\b`).test(code)) return baseId;
		let index = 1;
		let candidate = `${baseId}_${index}`;
		while (new RegExp(`\\b${candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(code)) {
			index += 1;
			candidate = `${baseId}_${index}`;
		}
		return candidate;
	}

	function duplicateTimelineElement(nodeId: string): boolean {
		const lines = (editorState.code || '').split('\n');
		const lineIndex = findTimelineStatementLineIndex(lines, nodeId);
		if (lineIndex < 0) return false;
		const line = lines[lineIndex];
		const match = line.match(
			/^(\s*)(event|period|task|milestone)\s+([A-Za-z_][A-Za-z0-9_-]*)(.*)$/
		);
		if (!match) return false;
		const [, indent, keyword, id, remainder] = match;
		const nextId = buildUniqueTimelineId(lines, `${id}_copy`);
		let nextRemainder = remainder;
		if (/label:"([^"]*)"/.test(nextRemainder)) {
			nextRemainder = nextRemainder.replace(/label:"([^"]*)"/, (_full, current) => {
				return `label:"${escapeDslString(String(current))} Copy"`;
			});
		} else {
			nextRemainder = `${nextRemainder} label:"${nextId}"`;
		}
		const nextLine = `${indent}${keyword} ${nextId}${nextRemainder}`;
		lines.splice(lineIndex + 1, 0, nextLine);
		const nextCode = lines.join('\n');
		if (nextCode === editorState.code) return false;
		updateCode(nextCode, true);
		return true;
	}

	function deleteTimelineElement(nodeId: string): boolean {
		const lines = (editorState.code || '').split('\n');
		const lineIndex = findTimelineStatementLineIndex(lines, nodeId);
		if (lineIndex < 0) return false;
		lines.splice(lineIndex, 1);
		const nextCode = lines.join('\n');
		if (nextCode === editorState.code) return false;
		updateCode(nextCode, true);
		return true;
	}

	function getSelectedNodeProfile(nodeId: string | null): any | null {
		if (!nodeId) return null;
		return (diagramState.profile as any)?.nodes?.find((n: any) => n.id === nodeId) ?? null;
	}

	function getSelectedEdgeProfile(edgeId: string | null): any | null {
		if (!edgeId) return null;
		const profile = diagramState.profile as any;
		return (
			profile?.edges?.find((e: any) => e.id === edgeId) ??
			profile?.edges?.find((e: any) => `${e.from}-${e.to}` === edgeId) ??
			null
		);
	}

	function deleteContainerById(containerId: string): void {
		const lines = (editorState.code || '').split('\n');
		const range = findContainerRange(lines, containerId, elementContextMenu?.containerLabel);
		if (!range) return;
		const nextLines = [...lines];
		nextLines.splice(range.startIndex, range.endIndex - range.startIndex + 1);
		const nextCode = nextLines.join('\n');
		if (nextCode !== editorState.code) {
			updateCode(nextCode, true);
		}
	}

	function findContainerRange(
		lines: string[],
		containerId: string,
		containerLabel?: string | null
	): { startIndex: number; endIndex: number } | null {
		const normalizedLabel = containerLabel?.trim() || null;
		const normalizedId = containerId?.trim() || '';
		const labelMatches: number[] = [];

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const parsed = parseContainerHeader(line);
			if (!parsed) continue;
			if (parsed.id && normalizedId && parsed.id === normalizedId) {
				return findContainerRangeFromStart(lines, i);
			}
			if (normalizedLabel && parsed.label === normalizedLabel) {
				labelMatches.push(i);
			}
		}

		if (labelMatches.length === 1) {
			showTransientStatus('Container matched by label fallback.');
			return findContainerRangeFromStart(lines, labelMatches[0]);
		}

		if (labelMatches.length > 1) {
			showTransientStatus('Container label is not unique; could not resolve insertion target.');
			return null;
		}

		return null;
	}

	function parseContainerHeader(line: string): { id: string | null; label: string } | null {
		const match = line.match(
			/^\s*container\s+(?:(?<id>[A-Za-z_][A-Za-z0-9_-]*)\s+)?\"(?<label>(?:\\.|[^"])*)\"/
		);
		if (!match?.groups?.label) return null;
		const label = match.groups.label.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		const id = match.groups.id || null;
		return { id, label };
	}

	function findContainerRangeFromStart(
		lines: string[],
		startIndex: number
	): { startIndex: number; endIndex: number } | null {
		let depth = 0;
		let foundOpeningBrace = false;
		let endIndex = startIndex;
		for (let i = startIndex; i < lines.length; i++) {
			const line = lines[i];
			const opens = (line.match(/{/g) || []).length;
			const closes = (line.match(/}/g) || []).length;
			if (opens > 0) {
				foundOpeningBrace = true;
			}
			depth += opens - closes;
			endIndex = i;
			if (foundOpeningBrace && depth <= 0) {
				break;
			}
		}
		return { startIndex, endIndex };
	}

	function getContainerBlockById(containerId: string, containerLabel?: string | null): string | null {
		const lines = (editorState.code || '').split('\n');
		const range = findContainerRange(lines, containerId, containerLabel);
		if (!range) return null;
		return lines.slice(range.startIndex, range.endIndex + 1).join('\n');
	}

	function findShapeBlockRange(lines: string[], nodeId: string): { startIndex: number; endIndex: number } | null {
		const pattern = new RegExp(`^\\s*shape\\s+${nodeId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
		let startIndex = -1;
		for (let i = 0; i < lines.length; i++) {
			if (pattern.test(lines[i])) {
				startIndex = i;
				break;
			}
		}
		if (startIndex < 0) return null;
		const startIndent = (lines[startIndex].match(/^\s*/) || [''])[0].length;
		let endIndex = startIndex;
		for (let i = startIndex + 1; i < lines.length; i++) {
			const line = lines[i];
			if (!line.trim()) {
				endIndex = i;
				continue;
			}
			const indent = (line.match(/^\s*/) || [''])[0].length;
			const isContinuation = indent > startIndent;
			if (!isContinuation) break;
			endIndex = i;
		}
		// Exclude trailing blank lines from moved snippet to keep formatting stable.
		while (endIndex > startIndex && !lines[endIndex].trim()) {
			endIndex -= 1;
		}
		return { startIndex, endIndex };
	}

	function moveNodeIntoContainer(
		nodeId: string,
		targetContainerId: string,
		targetContainerLabel?: string | null
	): boolean {
		const code = editorState.code || '';
		const lines = code.split('\n');
		const nodeRange = findShapeBlockRange(lines, nodeId);
		if (!nodeRange) return false;

		const sourceContainerRange = findContainerRange(lines, targetContainerId, targetContainerLabel);
		if (
			sourceContainerRange &&
			nodeRange.startIndex >= sourceContainerRange.startIndex &&
			nodeRange.endIndex <= sourceContainerRange.endIndex
		) {
			// Already in this container.
			return false;
		}

		const snippet = unindentBlock(lines.slice(nodeRange.startIndex, nodeRange.endIndex + 1));
		const nextLines = [...lines];
		nextLines.splice(nodeRange.startIndex, nodeRange.endIndex - nodeRange.startIndex + 1);

		const targetRange = findContainerRange(nextLines, targetContainerId, targetContainerLabel);
		if (!targetRange) {
			return false;
		}

		const containerLine = nextLines[targetRange.startIndex] || '';
		const containerIndent = (containerLine.match(/^\s*/) || [''])[0];
		const childIndent = `${containerIndent}  `;
		const snippetLines = snippet.split('\n').map((line) => `${childIndent}${line}`);
		nextLines.splice(targetRange.endIndex, 0, ...snippetLines);

		const nextCode = nextLines.join('\n');
		if (nextCode === code) return false;
		updateCode(nextCode, true);
		return true;
	}

	function getNextAvailableShapeId(): string {
		const code = editorState.code || '';
		let candidateNumber = Math.max(1, editorState.shapeCounter);
		let candidate = `id${candidateNumber}`;
		while (new RegExp(`\\b${candidate}\\b`).test(code)) {
			candidateNumber += 1;
			candidate = `id${candidateNumber}`;
		}
		editorState.shapeCounter = candidateNumber + 1;
		return candidate;
	}

	function withResolvedIdPlaceholder(snippet: string): string {
		if (!/\bid\b/.test(snippet)) return snippet;
		const nextId = getNextAvailableShapeId();
		return snippet.replace(/\bid\b/g, nextId);
	}

	function getNextContainerLabel(baseLabel = 'New Container'): string {
		const code = editorState.code || '';
		const escapedBase = baseLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const pattern = new RegExp(
			`container\\s+(?:[A-Za-z_][\\w-]*\\s+)?\"${escapedBase}(?:\\s+(\\d+))?\"`,
			'g'
		);
		let maxIndex = 0;
		for (const match of code.matchAll(pattern)) {
			const suffix = match[1];
			if (!suffix) {
				maxIndex = Math.max(maxIndex, 1);
			} else {
				const parsed = Number.parseInt(suffix, 10);
				if (Number.isFinite(parsed)) {
					maxIndex = Math.max(maxIndex, parsed);
				}
			}
		}
		if (maxIndex <= 0) return baseLabel;
		return `${baseLabel} ${maxIndex + 1}`;
	}

	function normalizeInsertSnippet(snippet: string): string {
		let normalized = withResolvedIdPlaceholder(snippet);
		if (/container\s+"New Container"/.test(normalized)) {
			const nextLabel = getNextContainerLabel('New Container');
			normalized = normalized.replace(/container\s+"New Container"/g, `container "${nextLabel}"`);
		}
		return normalized;
	}

	function withUniqueContainerLabel(snippet: string): string {
		const nextLabel = getNextContainerLabel('New Container');
		return snippet.replace(/container\s+"New Container"/g, `container "${nextLabel}"`);
	}

	function insertIntoContainer(containerId: string, snippet: string, containerLabel?: string | null): void {
		const code = editorState.code || '';
		const lines = code.split('\n');
		const range = findContainerRange(lines, containerId, containerLabel);
		if (!range) {
			showTransientStatus('Could not find target container in DSL. No insertion applied.');
			return;
		}

		const containerLine = lines[range.startIndex] || '';
		const containerIndent = (containerLine.match(/^\s*/) || [''])[0];
		const childIndent = `${containerIndent}  `;
		const indentedSnippet = snippet
			.split('\n')
			.map((line) => `${childIndent}${line}`)
			.join('\n');

		const nextLines = [...lines];
		nextLines.splice(range.endIndex, 0, indentedSnippet);
		const nextCode = nextLines.join('\n');
		if (nextCode !== code) {
			updateCode(nextCode, true);
		}
	}

	function generateUniqueContainerId(baseId: string): string {
		const code = editorState.code || '';
		const baseEscaped = baseId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		if (!new RegExp(`\\b${baseEscaped}\\b`).test(code)) {
			return baseId;
		}
		let counter = 1;
		let candidate = `${baseId}_${counter}`;
		while (new RegExp(`\\b${candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(code)) {
			counter += 1;
			candidate = `${baseId}_${counter}`;
		}
		return candidate;
	}

	function rewriteContainerId(block: string, fromId: string, toId: string): string {
		const idPattern = fromId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		return block.replace(
			new RegExp(`^(\\s*container\\s+)${idPattern}(\\b)`, 'm'),
			`$1${toId}$2`
		);
	}

	function pasteContainerFromClipboard(): void {
		if (!containerClipboard) return;
		const nextId = generateUniqueContainerId(`${containerClipboard.id}_copy`);
		const block = rewriteContainerId(containerClipboard.block, containerClipboard.id, nextId);
		insertShapeFromContext(block);
	}

	function setSelectionFromContextMenu(nodeId: string | null, edgeId: string | null) {
		selection.clearSelection();
		if (nodeId) {
			selection.selectNode(nodeId);
		} else if (edgeId) {
			selection.selectEdge(edgeId);
		}
		selection.updateVisualSelection(svgContainer);
	}

	function handleCopyStyleFromContext() {
		if (editorState.profileName !== ProfileName.diagram) return;
		if (!elementContextMenu) return;
		const { nodeId, edgeId, containerId } = elementContextMenu;
		if (containerId) return;
		if (nodeId) {
			const node = getSelectedNodeProfile(nodeId);
			if (!node) return;
			const data = node.data || {};
			const properties: Record<string, string | number | boolean> = {};
			const fillColor = data.fillColor ?? data.fill;
			const strokeColor = data.strokeColor ?? data.stroke;
			const textColor = data.textColor ?? data.color;
			if (fillColor !== undefined) properties.fillColor = String(fillColor);
			if (strokeColor !== undefined) properties.strokeColor = String(strokeColor);
			if (data.strokeWidth !== undefined) properties.strokeWidth = Number(data.strokeWidth);
			if (textColor !== undefined) properties.textColor = String(textColor);
			if (data.fontSize !== undefined) properties.fontSize = Number(data.fontSize);
			if (data.fontFamily !== undefined) properties.fontFamily = String(data.fontFamily);
			if (data.lineStyle !== undefined) properties.lineStyle = String(data.lineStyle);
			if (typeof node.icon === 'string') {
				properties.icon = node.icon;
			} else if (node.icon?.provider && node.icon?.name) {
				properties.icon = `${node.icon.provider}/${node.icon.name}`;
			}
			styleClipboard = {
				kind: 'node',
				styleRef: typeof node.style === 'string' ? node.style : undefined,
				properties
			};
		} else if (edgeId) {
			const edge = getSelectedEdgeProfile(edgeId);
			if (!edge) return;
			const data = edge.data || {};
			const properties: Record<string, string | number | boolean> = {};
			const strokeColor = data.strokeColor ?? data.stroke ?? edge.strokeColor ?? edge.color;
			if (strokeColor !== undefined) properties.strokeColor = String(strokeColor);
			if (data.strokeWidth !== undefined || edge.strokeWidth !== undefined) {
				properties.strokeWidth = Number(data.strokeWidth ?? edge.strokeWidth);
			}
			if (edge.lineStyle !== undefined) properties.lineStyle = String(edge.lineStyle);
			if (edge.routing !== undefined) properties.routing = String(edge.routing);
			styleClipboard = {
				kind: 'edge',
				styleRef: typeof edge.style === 'string' ? edge.style : undefined,
				properties
			};
		}
		closeElementContextMenu();
	}

	function handleCopyElementFromContext() {
		if (editorState.profileName !== ProfileName.diagram) return;
		if (!elementContextMenu) return;
		if (elementContextMenu.containerId) {
			const block = getContainerBlockById(
				elementContextMenu.containerId,
				elementContextMenu.containerLabel
			);
			if (!block) return;
			clipboardManager.clear('canvas');
			containerClipboard = { id: elementContextMenu.containerId, block };
			closeElementContextMenu();
			return;
		}
		containerClipboard = null;
		clipboardManager.copy(
			svgContainer,
			elementContextMenu.nodeId,
			elementContextMenu.edgeId,
			new Set<string>(),
			new Set<string>(),
			'canvas'
		);
		closeElementContextMenu();
	}

	function handleCutElementFromContext() {
		if (editorState.profileName !== ProfileName.diagram) return;
		if (!elementContextMenu) return;
		if (elementContextMenu.containerId) {
			const block = getContainerBlockById(
				elementContextMenu.containerId,
				elementContextMenu.containerLabel
			);
			if (block) {
				clipboardManager.clear('canvas');
				containerClipboard = { id: elementContextMenu.containerId, block };
			}
			deleteContainerById(elementContextMenu.containerId);
			selection.clearSelection();
			selection.updateVisualSelection(svgContainer);
			closeElementContextMenu();
			return;
		}
		containerClipboard = null;
		clipboardManager.cut(
			svgContainer,
			elementContextMenu.nodeId,
			elementContextMenu.edgeId,
			new Set<string>(),
			new Set<string>(),
			(nodeId, edgeId) => handleDelete(nodeId, edgeId)
			,
			'canvas'
		);
		selection.clearSelection();
		selection.updateVisualSelection(svgContainer);
		closeElementContextMenu();
	}

	function handlePasteElementFromContext() {
		if (editorState.profileName !== ProfileName.diagram) return;
		if (containerClipboard) {
			pasteContainerFromClipboard();
			closeElementContextMenu();
			return;
		}
		clipboardManager.paste((shapeCode) => insertShapeFromContext(shapeCode), 'canvas');
		closeElementContextMenu();
	}

	function handlePasteIntoContainerFromContext() {
		if (editorState.profileName !== ProfileName.diagram) return;
		if (!elementContextMenu?.containerId) return;
		const targetContainerId = elementContextMenu.containerId;
		const targetContainerLabel = elementContextMenu.containerLabel;
		if (containerClipboard) {
			const nextId = generateUniqueContainerId(`${containerClipboard.id}_copy`);
			const block = rewriteContainerId(containerClipboard.block, containerClipboard.id, nextId);
			insertIntoContainer(targetContainerId, block, targetContainerLabel);
			closeElementContextMenu();
			return;
		}
		clipboardManager.paste(
			(shapeCode) =>
				insertIntoContainer(targetContainerId, normalizeInsertSnippet(shapeCode), targetContainerLabel),
			'canvas'
		);
		closeElementContextMenu();
	}

	function handlePasteStyleFromContext() {
		if (editorState.profileName !== ProfileName.diagram) return;
		if (!elementContextMenu || !styleClipboard) return;
		const { nodeId, edgeId, containerId } = elementContextMenu;
		if (containerId) return;
		const targetId = nodeId || edgeId;
		if (!targetId) return;
		if (nodeId && styleClipboard.styleRef) {
			handleEdit(targetId, 'style', styleClipboard.styleRef);
		}
		for (const [property, value] of Object.entries(styleClipboard.properties)) {
			handleEdit(targetId, property, value);
		}
		closeElementContextMenu();
	}

	function handleDuplicateFromContext() {
		if (!elementContextMenu) return;
		if (editorState.profileName === ProfileName.timeline && elementContextMenu.nodeId) {
			duplicateTimelineElement(elementContextMenu.nodeId);
			closeElementContextMenu();
			return;
		}
		const { nodeId, edgeId, containerId } = elementContextMenu;
		if (containerId) {
			const block = getContainerBlockById(containerId, elementContextMenu.containerLabel);
			if (!block) return;
			const nextId = generateUniqueContainerId(`${containerId}_copy`);
			insertShapeFromContext(rewriteContainerId(block, containerId, nextId));
			closeElementContextMenu();
			return;
		}

		if (nodeId) {
			const node = getSelectedNodeProfile(nodeId);
			if (!node) return;
			const nextId = `id${editorState.shapeCounter}`;
			const shapeId = node.shape || 'rectangle';
			const nextLabel = node.label ? `${node.label} Copy` : 'New Node';
			const escapedLabel = escapeDslString(nextLabel);
			const shapeCode = `shape ${nextId} as @${shapeId} label:"${escapedLabel}"`;
			insertShapeFromContext(shapeCode);
			if (typeof node.style === 'string' && node.style.length > 0) {
				handleEdit(nextId, 'style', node.style);
			}
			const inlineData = node.data || {};
			const candidateProperties = [
				'fillColor',
				'strokeColor',
				'strokeWidth',
				'textColor',
				'fontSize',
				'fontFamily',
				'lineStyle'
			] as const;
			for (const property of candidateProperties) {
				if (inlineData[property] !== undefined) {
					handleEdit(nextId, property, inlineData[property]);
				}
			}
			if (node.icon?.provider && node.icon?.name) {
				handleEdit(nextId, 'icon', `${node.icon.provider}/${node.icon.name}`);
			}
		} else if (edgeId) {
			const edge = getSelectedEdgeProfile(edgeId);
			if (!edge?.from || !edge?.to) return;
			handleInsertEdge(edge.from, edge.to);
		}

		closeElementContextMenu();
	}

	function handleDeleteFromContext() {
		if (!elementContextMenu) return;
		if (editorState.profileName === ProfileName.timeline && elementContextMenu.nodeId) {
			deleteTimelineElement(elementContextMenu.nodeId);
			selection.clearSelection();
			selection.updateVisualSelection(svgContainer);
			closeElementContextMenu();
			return;
		}
		if (elementContextMenu.containerId) {
			deleteContainerById(elementContextMenu.containerId);
		} else {
			handleDelete(elementContextMenu.nodeId, elementContextMenu.edgeId);
		}
		selection.clearSelection();
		selection.updateVisualSelection(svgContainer);
		closeElementContextMenu();
	}

	function handleCanvasContextMenu(event: MouseEvent) {
		if (!supportsCanvasSelection(editorState.profileName))
			return;
		const target = event.target as HTMLElement | null;
		if (!target) return;
		const nodeElement = target.closest('[data-node-id]') as HTMLElement | null;
		const edgeElement = target.closest('[data-edge-id]') as HTMLElement | null;
		const containerElement = target.closest('[data-container-id]') as HTMLElement | null;
		if (nodeElement || edgeElement) {
			event.preventDefault();
			const nodeId = nodeElement?.getAttribute('data-node-id') ?? null;
			const edgeId = edgeElement?.getAttribute('data-edge-id') ?? null;
			setSelectionFromContextMenu(nodeId, edgeId);
			canvasContextMenu = null;
			elementContextMenu = {
				x: event.clientX,
				y: event.clientY,
				nodeId,
				edgeId,
				containerId: null,
				containerLabel: null
			};
			return;
		}
		if (editorState.profileName === ProfileName.diagram && containerElement) {
			event.preventDefault();
			selection.clearSelection();
			selection.updateVisualSelection(svgContainer);
			canvasContextMenu = null;
			const labelText =
				containerElement.querySelector('.runiq-container-label')?.textContent?.trim() || null;
			elementContextMenu = {
				x: event.clientX,
				y: event.clientY,
				nodeId: null,
				edgeId: null,
				containerId: containerElement.getAttribute('data-container-id'),
				containerLabel: labelText
			};
			return;
		}
		event.preventDefault();
		elementContextMenu = null;
		canvasContextMenu = { x: event.clientX, y: event.clientY };
	}

	function handleContextSetMode(mode: 'select' | 'connect') {
		canvasState.mode = mode;
		closeCanvasContextMenu();
	}

	function handleContextAddShape() {
		if (!canvasContextMenu) return;
		contextContainerFlyout = null;
		contextImageFlyout = null;
		contextShapeFlyout = {
			x: canvasContextMenu.x + 190,
			y: canvasContextMenu.y,
			target: 'canvas',
			containerId: null,
			containerLabel: null
		};
	}

	function handleContextAddContainer() {
		if (!canvasContextMenu) return;
		contextShapeFlyout = null;
		contextImageFlyout = null;
		contextContainerFlyout = {
			x: canvasContextMenu.x + 190,
			y: canvasContextMenu.y,
			target: 'canvas',
			containerId: null,
			containerLabel: null
		};
	}

	function handleContextAddImage() {
		if (!canvasContextMenu) return;
		contextShapeFlyout = null;
		contextContainerFlyout = null;
		contextImageFlyout = {
			x: canvasContextMenu.x + 190,
			y: canvasContextMenu.y,
			target: 'canvas',
			containerId: null,
			containerLabel: null
		};
	}

	function handleContextAddText() {
		insertShapeFromContext(
			withResolvedIdPlaceholder('shape id as @textBlock label:"Edit text" textAlign:left')
		);
		canvasState.mode = 'select';
		closeCanvasContextMenu();
	}

	function handleElementContextAddImage() {
		if (!elementContextMenu) return;
		contextShapeFlyout = null;
		contextContainerFlyout = null;
		contextImageFlyout = {
			x: elementContextMenu.x + 190,
			y: elementContextMenu.y,
			target: 'element',
			containerId: elementContextMenu.containerId,
			containerLabel: elementContextMenu.containerLabel
		};
	}

	function handleElementContextAddText() {
		const snippet = withResolvedIdPlaceholder('shape id as @textBlock label:"Edit text" textAlign:left');
		if (elementContextMenu?.containerId) {
			insertIntoContainer(
				elementContextMenu.containerId,
				snippet,
				elementContextMenu.containerLabel
			);
		} else {
			insertShapeFromContext(snippet);
		}
		canvasState.mode = 'select';
		closeElementContextMenu();
	}

	function handleElementContextAddShape() {
		if (!elementContextMenu) return;
		contextContainerFlyout = null;
		contextImageFlyout = null;
		contextShapeFlyout = {
			x: elementContextMenu.x + 190,
			y: elementContextMenu.y,
			target: 'element',
			containerId: elementContextMenu.containerId,
			containerLabel: elementContextMenu.containerLabel
		};
	}

	function handleContextShapeSelected(shapeCode: string) {
		if (!contextShapeFlyout) return;
		const snippet = normalizeInsertSnippet(shapeCode);
		if (contextShapeFlyout.target === 'element' && contextShapeFlyout.containerId) {
			insertIntoContainer(
				contextShapeFlyout.containerId,
				snippet,
				contextShapeFlyout.containerLabel
			);
			closeElementContextMenu();
			return;
		}
		insertShapeFromContext(snippet);
		closeCanvasContextMenu();
	}

	function handleElementContextAddContainer() {
		if (!elementContextMenu) return;
		contextShapeFlyout = null;
		contextImageFlyout = null;
		contextContainerFlyout = {
			x: elementContextMenu.x + 190,
			y: elementContextMenu.y,
			target: 'element',
			containerId: elementContextMenu.containerId,
			containerLabel: elementContextMenu.containerLabel
		};
	}

	function handleContextContainerSelected(shapeCode: string) {
		if (!contextContainerFlyout) return;
		const snippet = normalizeInsertSnippet(withUniqueContainerLabel(shapeCode));
		if (contextContainerFlyout.target === 'element' && contextContainerFlyout.containerId) {
			insertIntoContainer(
				contextContainerFlyout.containerId,
				snippet,
				contextContainerFlyout.containerLabel
			);
			closeElementContextMenu();
			return;
		}
		insertShapeFromContext(snippet);
		closeCanvasContextMenu();
	}

	function handleContextImageSelected(src: string) {
		if (!contextImageFlyout) return;
		const normalizedSrc = src.trim().replace(/"/g, '\\"');
		const snippet = normalizeInsertSnippet(
			`shape id as @image label:"Image" data:[{ src:"${normalizedSrc}" }]`
		);
		if (contextImageFlyout.target === 'element' && contextImageFlyout.containerId) {
			insertIntoContainer(
				contextImageFlyout.containerId,
				snippet,
				contextImageFlyout.containerLabel
			);
			closeElementContextMenu();
			return;
		}
		insertShapeFromContext(snippet);
		closeCanvasContextMenu();
	}

	function handleContextPaste() {
		if (containerClipboard) {
			pasteContainerFromClipboard();
			closeCanvasContextMenu();
			return;
		}
		clipboardManager.paste((shapeCode) => insertShapeFromContext(shapeCode), 'canvas');
		closeCanvasContextMenu();
	}

	function handleContextApplyTheme(themeId: string) {
		const nextCode = applyThemeToDsl(editorState.code || '', themeId);
		updateCode(nextCode, true);
		closeCanvasContextMenu();
	}

	function handleEditLabelFromContext() {
		if (!elementContextMenu) return;
		if (!supportsCanvasSelection(editorState.profileName)) return;
		if (!elementContextMenu.nodeId && !elementContextMenu.edgeId) return;
		interactionManager.startLabelEdit(elementContextMenu.nodeId, elementContextMenu.edgeId);
		closeElementContextMenu();
	}

	// Export functions for parent component access
	export function hasValidDiagram(): boolean {
		return svgOutput.trim() !== '' && diagramState.errors.length === 0;
	}

	export function getSvg(): string {
		return svgOutput;
	}

	const renderStateCallbacks: RenderStateCallbacks = {
		setSvgOutput: (value: string) => (svgOutput = value),
		clearErrors: () => diagramState.clearErrors(),
		clearWarnings: () => diagramState.clearWarnings(),
		setErrors: (errors: string[]) => diagramState.setErrors(errors),
		setWarnings: (warnings: string[]) => diagramState.setWarnings(warnings),
		setWarningDetails: (details: WarningDetail[]) => (warningDetails = details),
		setParseTime: (value: number) => (parseTime = value),
		setRenderTime: (value: number) => (renderTime = value),
		setNodeLocations: (locations: Map<string, NodeLocation>) => diagramState.setNodeLocations(locations),
		clearNodeLocations: () => diagramState.clearNodeLocations(),
		setProfile: (profile: DiagramProfile) => diagramState.setProfile(profile),
		handleParse
	};

	const renderRuntime = createCanvasRenderRuntime({
		getDataContent: () => editorState.dataContent,
		getLayoutEngine: () => editorState.layoutEngine,
		getLayoutStrategy: () => editorState.layoutStrategy,
		renderDiagram: renderDiagramUtil,
		onEmpty: () => applyRenderEmptyState(renderStateCallbacks),
		onStart: () => {
			isRendering = true;
			diagramState.clearErrors();
			diagramState.clearWarnings();
		},
		onSuccess: (result) => applyRenderSuccessState(result, renderStateCallbacks),
		onError: (errorMsg) => applyRenderErrorState(errorMsg, renderStateCallbacks),
		onComplete: () => {
			isRendering = false;
		}
	});

	let transientStatusTimer: ReturnType<typeof setTimeout> | null = null;

	function showTransientStatus(message: string): void {
		transientStatusMessage = message;
		if (transientStatusTimer) {
			clearTimeout(transientStatusTimer);
		}
		transientStatusTimer = setTimeout(() => {
			transientStatusMessage = null;
			transientStatusTimer = null;
		}, 2200);
	}

	// Watch for code or data changes with debounce
	$effect(() => {
		// Read reactive values to track them
		const currentCode = editorState.code;
		const currentDataContent = editorState.dataContent;

		renderRuntime.updateInputs(currentCode, currentDataContent);

		// Cleanup function to clear timeout on unmount or re-run
		return () => {
			renderRuntime.cancel();
		};
	});

	const {
		handleCanvasClick,
		handleCanvasKeyDown: handleCanvasKeyDownBase,
		handleEditKeyPress,
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
		handleWheel,
		handleDragOver,
		handleDrop
	} = createCanvasEventHandlers({
		selection,
		viewport,
		interactionManager,
		getSvgContainer: () => svgContainer,
		getProfileName: () => editorState.profileName,
		getMode: () => canvasState.mode,
		handleDelete,
		handleEdit,
		handleInsertShape,
		handleInsertEdge,
		handleInsertShapeAndEdge,
		getNextShapeId: () => `id${editorState.shapeCounter}`,
		onConnectPreviewStart: (point) => {
			connectPreviewStart = point;
		},
		onConnectPreviewMove: (point) => {
			connectPreviewEnd = point;
		},
		onConnectPreviewEnd: () => {
			connectPreviewStart = null;
			connectPreviewEnd = null;
		},
		onNodeContainerDragStart: handleNodeContainerDragStart,
		onNodeContainerDragMove: handleNodeContainerDragMove,
		onNodeContainerDragEnd: handleNodeContainerDragEnd
	});

	function handleCanvasKeyDown(event: KeyboardEvent) {
		if (editorState.profileName === ProfileName.diagram && canvasState.mode === 'connect') {
			quickConnectBehaviorHint = getQuickConnectBehaviorFromModifiers(event);
		}
		handleCanvasKeyDownBase(event);
	}

	function handleEditBlur() {
		if (!supportsCanvasSelection(editorState.profileName) || canvasState.mode !== 'select') return;
		if (selection.editingNodeId) {
			handleEdit(selection.editingNodeId, 'label', selection.editingLabel);
			selection.cancelLabelEdit();
			return;
		}
		if (selection.editingEdgeId) {
			handleEdit(selection.editingEdgeId, 'edgeLabel', selection.editingLabel);
			selection.cancelLabelEdit();
		}
	}

	function handleCanvasKeyUp(event: KeyboardEvent) {
		if (editorState.profileName === ProfileName.diagram && canvasState.mode === 'connect') {
			quickConnectBehaviorHint = getQuickConnectBehaviorFromModifiers(event);
		}
	}

	function handleApplyIcon() {
		const applied = applyIconToSelectedNode({
			profileName: editorState.profileName,
			mode: canvasState.mode,
			selectedNodeId: selection.selectedNodeId,
			iconInputValue,
			edit: (id, property, value) => handleEdit(id, property, value)
		});
		if (!applied) return;
		closeAllPanels();
	}

	function handleClearIcon() {
		const cleared = clearIconOnSelectedNode({
			profileName: editorState.profileName,
			mode: canvasState.mode,
			selectedNodeId: selection.selectedNodeId,
			edit: (id, property, value) => handleEdit(id, property, value)
		});
		if (!cleared.cleared) return;
		iconInputValue = cleared.iconInputValue;
		iconSearchQuery = cleared.iconSearchQuery;
		closeAllPanels();
	}

	function handleSelectIconToken(token: string) {
		iconInputValue = token;
		handleApplyIcon();
	}

	function closeAllPanels(except?: ElementPanelKey) {
		closePanelState(panelOpen, except);
	}

	function onPanelOpenChange(panel: ElementPanelKey, open: boolean) {
		debugCanvas('panel-open-change', { panel, open });
		const iconDraft = handlePanelOpenChangeOrchestrated({
			panel,
			open,
			panelOpen,
			closeAllPanels,
			onOpenBorderPanel: openBorderPanel,
			onOpenFillPanel: openFillPanel,
			onOpenTextPanel: openTextPanel,
			getIconDraft: () =>
				openIconPanelDraft(
					selection.selectedNodeId,
					diagramState.profile as any,
					extractSelectedElementStyles
				)
		});
		if (iconDraft) {
			iconInputValue = iconDraft.iconInputValue;
			iconSearchQuery = iconDraft.iconSearchQuery;
		}
	}

	function handleDeleteFromToolbar() {
		deleteSelectionFromToolbar({
			selectedNodeId: selection.selectedNodeId,
			selectedEdgeId: selection.selectedEdgeId,
			deleteFn: handleDelete,
			clearSelection: () => selection.clearSelection(),
			closeAllPanels: () => closeAllPanels()
		});
	}

	function handleApplyShape(shapeId: string) {
		const applied = applyShapeToSelection(selection.selectedNodeId, shapeId, (id, property, value) =>
			handleEdit(id, property, value)
		);
		if (!applied) return;
		closeAllPanels();
	}

	function openBorderPanel() {
		const draft = openBorderPanelDraft(
			getSelectedElementId(),
			diagramState.profile as any,
			extractSelectedElementStyles
		);
		if (!draft) return;
		borderDraft = draft;
	}

	function applyBorderDraft() {
		const applied = applyBorderDraftForSelected({
			selectedId: getSelectedElementId(),
			isEdge: !!selection.selectedEdgeId,
			draft: borderDraft,
			edit: (id, property, value) => handleEdit(id, property, value)
		});
		if (!applied) return;
		closeAllPanels();
	}

	function openFillPanel() {
		const draft = openFillPanelDraft(
			getSelectedElementId(),
			diagramState.profile as any,
			extractSelectedElementStyles
		);
		if (!draft) return;
		fillDraft = draft;
	}

	function applyFillDraft() {
		const applied = applyFillDraftForSelected({
			selectedId: getSelectedElementId(),
			selectedNodeId: selection.selectedNodeId,
			draft: fillDraft,
			edit: (id, property, value) => handleEdit(id, property, value)
		});
		if (!applied) return;
		closeAllPanels();
	}

	function openTextPanel() {
		const draft = openTextPanelDraft(
			getSelectedElementId(),
			diagramState.profile as any,
			extractSelectedElementStyles
		);
		if (!draft) return;
		textDraft = draft;
	}

	function applyTextDraft() {
		const applied = applyTextDraftForSelected({
			selectedId: getSelectedElementId(),
			selectedNodeId: selection.selectedNodeId,
			draft: textDraft,
			edit: (id, property, value) => handleEdit(id, property, value)
		});
		if (!applied) return;
		closeAllPanels();
	}

	function resetTextDraftToTheme() {
		const selectedId = getSelectedElementId();
		if (!selectedId) return;
		handleResetStyles([selectedId]);
		closeAllPanels();
	}

	const filteredStyleDeclarations = $derived(
		getFilteredStyleDeclarations(editorState.code, styleSearchQuery)
	);

	function applyStyleRef(styleName: string) {
		const applied = applyStyleRefForSelection({
			selectedNodeId: selection.selectedNodeId,
			styleName,
			resetStyles: handleResetStyles,
			edit: (id, property, value) => handleEdit(id, property, value)
		});
		if (!applied) return;
		closeAllPanels();
	}

	function resetStyleRefToTheme() {
		const cleared = clearStyleRefForSelection({
			selectedNodeId: selection.selectedNodeId,
			edit: (id, property, value) => handleEdit(id, property, value)
		});
		if (!cleared) return;
		closeAllPanels();
	}

	function openCreateStyleDialog(existing?: { name: string; properties: Record<string, string> }) {
		const next = openCreateStyleDialogWorkflow(existing);
		editingStyleName = next.editingStyleName;
		newStyleName = next.newStyleName;
		newStyleDraft = next.newStyleDraft;
		showCreateStyleDialog = next.showCreateStyleDialog;
	}

	function saveStyleDeclarationAndApply() {
		const saved = saveStyleDeclarationAndApplyWorkflow({
			selectedNodeId: selection.selectedNodeId,
			code: editorState.code,
			editingStyleName,
			newStyleName,
			newStyleDraft,
			updateCode,
			edit: (id, property, value) => handleEdit(id, property, value)
		});
		if (!saved) return;
		showCreateStyleDialog = false;
		closeAllPanels();
	}

	function closeCreateStyleDialog() {
		showCreateStyleDialog = false;
	}

	function removeStyleDeclaration(styleName: string) {
		removeStyleDeclarationWorkflow({
			code: editorState.code,
			styleName,
			updateCode
		});
	}

	function handleJumpToWarning(warning: WarningDetail) {
		void jumpToWarningLocation({
			warning,
			setShowCodeEditor: (value) => (editorState.showCodeEditor = value),
			setActiveTab: (tab) => (editorState.activeTab = tab),
			jumpTo: (line, column) => editorRefs.code?.jumpTo(line, column),
			tick
		});
	}

	onMount(() => {
		// Register VisualCanvas with editorRefs
		editorRefs.preview = {
			hasValidDiagram,
			getSvg
		};

		const handleGlobalPointerDown = createGlobalPointerDismissHandler({
			hasSelection: () => selection.hasSelection,
			isInsideToolbar: (target) => !!floatingToolbarElement?.contains(target),
			isInsidePopover: (target) =>
				target instanceof Element && !!target.closest('[data-slot="popover-content"]'),
			onDismiss: () => {
				selection.clearSelection();
				selection.updateVisualSelection(svgContainer);
				closeAllPanels();
			}
		});

		const handleGlobalContextMenuDismiss = (event: PointerEvent) => {
			const hasAnyMenu = !!canvasContextMenu || !!elementContextMenu;
			if (!hasAnyMenu) return;
			const target = event.target as HTMLElement | null;
			if (target?.closest('.canvas-context-menu')) return;
			closeCanvasContextMenu();
			closeElementContextMenu();
		};

		document.addEventListener('pointerdown', handleGlobalPointerDown, true);
		document.addEventListener('pointerdown', handleGlobalContextMenuDismiss, true);

		return () => {
			// Cleanup on unmount
			editorRefs.preview = null;
			if (transientStatusTimer) {
				clearTimeout(transientStatusTimer);
				transientStatusTimer = null;
			}
			document.removeEventListener('pointerdown', handleGlobalPointerDown, true);
			document.removeEventListener('pointerdown', handleGlobalContextMenuDismiss, true);
		};
	});
</script>

<div class="flex h-full flex-col">
	<CanvasStatusBar
		{isRendering}
		errorCount={diagramState.errors.length}
		hasSvgOutput={!!svgOutput}
		{parseTime}
		{renderTime}
		isConnectMode={editorState.profileName === ProfileName.diagram && canvasState.mode === 'connect'}
		connectModeHint={quickConnectBehaviorHint}
		selectedNodeId={selection.selectedNodeId}
		selectedEdgeId={selection.selectedEdgeId}
		selectedNodeCount={selection.selectedNodeIds.size}
		selectedEdgeCount={selection.selectedEdgeIds.size}
		zoomPercentage={viewport.zoomPercentage}
		{warningDetails}
		{combinedWarnings}
		bind:showWarnings
		onJumpToWarning={handleJumpToWarning}
	/>
	{#if transientStatusMessage}
		<div class="mx-4 mt-2 rounded border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
			{transientStatusMessage}
		</div>
	{/if}
	<!-- Floating Toolbar -->
	<div
		class="absolute left-4 z-10 flex gap-2"
		style="top: {floatingToolbarTop};"
	>
		<EditorToolbar {svgContainer} {svgOutput} />
	</div>

	<!-- Canvas -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class="relative flex-1 overflow-hidden bg-white"
		bind:this={svgContainer}
		onmousedown={handleMouseDown}
		onmousemove={handleCanvasMouseMove}
		onmouseup={handleMouseUp}
		onmouseleave={handleCanvasMouseLeave}
		onwheel={handleWheel}
		onclick={handleCanvasClick}
		oncontextmenu={handleCanvasContextMenu}
		ondragover={handleDragOver}
		ondrop={handleDrop}
		onkeydown={handleCanvasKeyDown}
		onkeyup={handleCanvasKeyUp}
		tabindex="0"
		style="cursor: {viewport.isPanning
			? 'grabbing'
			: editorState.profileName === ProfileName.diagram && canvasState.mode === 'connect'
				? 'crosshair'
				: selection.editingNodeId || selection.editingEdgeId
					? 'default'
					: 'grab'}; outline: none;"
	>
		<!-- Floating Toolbar at Top Center -->
		{#if editorState.profileName === ProfileName.diagram && canvasState.mode === 'select' && !selection.editingNodeId && !selection.editingEdgeId && (selection.selectedNodeId || selection.selectedEdgeId) && elementToolbarPosition && !canvasContextMenu && !elementContextMenu && !nodeContainerDrag}
			<div
				bind:this={floatingToolbarElement}
				class="floating-toolbar"
				style="left: {elementToolbarPosition.x}px; top: {elementToolbarPosition.y}px;"
			>
				<ElementToolbar
					selectedNodeId={selection.selectedNodeId}
					{panelOpen}
					{diagramShapeCategories}
					{borderStyleChoices}
					{filteredStyleDeclarations}
					{filteredIconTokens}
					bind:showCreateStyleDialog
					{editingStyleName}
					bind:newStyleName
					bind:newStyleDraft
					{onPanelOpenChange}
					onApplyShape={handleApplyShape}
					onApplyStyleRef={applyStyleRef}
					onOpenCreateStyleDialog={openCreateStyleDialog}
					onRemoveStyleDeclaration={removeStyleDeclaration}
					onResetStyleRefToTheme={resetStyleRefToTheme}
					onCloseAllPanels={closeAllPanels}
					onApplyBorderDraft={applyBorderDraft}
					onApplyFillDraft={applyFillDraft}
					onResetTextDraftToTheme={resetTextDraftToTheme}
					onApplyTextDraft={applyTextDraft}
					onSelectIconToken={handleSelectIconToken}
					onApplyIcon={handleApplyIcon}
					onClearIcon={handleClearIcon}
					onDelete={handleDeleteFromToolbar}
					onCloseCreateStyleDialog={closeCreateStyleDialog}
					onSaveStyleDeclarationAndApply={saveStyleDeclarationAndApply}
					bind:borderDraft
					bind:fillDraft
					bind:textDraft
					bind:styleSearchQuery
					bind:iconSearchQuery
					bind:iconInputValue
				/>
			</div>
		{/if}

		<CanvasInteractionLayer
			isLassoActive={selection.isLassoActive}
			lassoStartX={selection.lassoStartX}
			lassoStartY={selection.lassoStartY}
			lassoEndX={selection.lassoEndX}
			lassoEndY={selection.lassoEndY}
			editingNodeId={selection.editingNodeId}
			editingEdgeId={selection.editingEdgeId}
			editInputPosition={selection.editInputPosition}
			bind:editingLabel={selection.editingLabel}
			{svgOutput}
			translateX={viewport.translateX}
			translateY={viewport.translateY}
			scale={viewport.scale}
			onEditKeyPress={handleEditKeyPress}
			onEditBlur={handleEditBlur}
		/>

		<QuickConnectOverlay
			isDiagramConnectMode={editorState.profileName === ProfileName.diagram && canvasState.mode === 'connect'}
			{connectPreviewStart}
			{connectPreviewEnd}
			{quickConnectNodeId}
			{quickConnectHandles}
			{quickConnectActiveDirection}
			{quickConnectPreviewStart}
			{quickConnectPreviewEnd}
			{quickConnectTargetNodeId}
			onActivateHandle={activateQuickConnect}
			onLeaveHandle={() => {
				quickConnectActiveDirection = null;
				quickConnectPreviewStart = null;
				quickConnectPreviewEnd = null;
				quickConnectTargetNodeId = null;
				quickConnectNewNodePosition = null;
			}}
			onRunHandle={runQuickConnect}
			getBehaviorFromModifiers={getQuickConnectBehaviorFromModifiers}
		/>

		{#if nodeContainerDrag}
			<div class="pointer-events-none absolute inset-0 z-[21]">
				{#if nodeContainerDrag.hoverContainerRect}
					<div
						class="absolute rounded border-2 border-blue-500/80 bg-blue-100/15"
						style="left: {nodeContainerDrag.hoverContainerRect.x}px; top: {nodeContainerDrag.hoverContainerRect.y}px; width: {nodeContainerDrag.hoverContainerRect.width}px; height: {nodeContainerDrag.hoverContainerRect.height}px;"
					></div>
				{/if}
				<svg class="absolute inset-0 h-full w-full" aria-hidden="true">
					{#each nodeContainerDrag.connectedTargets as target}
						<line
							x1={nodeContainerDrag.x + nodeContainerDrag.width / 2}
							y1={nodeContainerDrag.y + nodeContainerDrag.height / 2}
							x2={target.x}
							y2={target.y}
							stroke="#4b5563"
							stroke-width="1.5"
							stroke-dasharray="4 3"
							opacity="0.6"
						/>
					{/each}
				</svg>
				<div
					class="absolute flex items-center justify-center rounded border border-dashed border-blue-500 bg-blue-200/40 px-3 text-sm font-medium text-blue-900"
					style="left: {nodeContainerDrag.x}px; top: {nodeContainerDrag.y}px; width: {nodeContainerDrag.width}px; height: {nodeContainerDrag.height}px;"
				>
					{nodeContainerDrag.label}
				</div>
			</div>
		{/if}

		<CanvasStateOverlay errors={diagramState.errors} hasSvgOutput={!!svgOutput} />
	</div>
</div>

{#if canvasContextMenu}
	<div
		class="canvas-context-menu"
		style="left: {canvasContextMenu.x}px; top: {canvasContextMenu.y}px;"
	>
		{#if editorState.profileName === ProfileName.diagram}
			<button onclick={() => handleContextSetMode('select')}>Select Mode</button>
			<button onclick={() => handleContextSetMode('connect')}>Connect Mode</button>
			<div class="separator"></div>
			<button onclick={handleContextAddShape}>Add Shape</button>
			<button onclick={handleContextAddContainer}>Add Container</button>
			<button onclick={handleContextAddImage}>Add Image</button>
			<button onclick={handleContextAddText}>Add Text</button>
			<button onclick={handleContextPaste} disabled={!clipboardManager.hasContentInScope('canvas') && !containerClipboard}>Paste</button>
			<div class="separator"></div>
		{:else if editorState.profileName === ProfileName.timeline}
			<button onclick={() => handleContextSetMode('select')}>Select Mode</button>
			<div class="separator"></div>
		{/if}
		<div class="section-label">Theme</div>
		{#each availableThemes as themeId}
			<button onclick={() => handleContextApplyTheme(themeId)}>{themeId}</button>
		{/each}
	</div>
{/if}

{#if elementContextMenu}
	<div
		class="canvas-context-menu"
		style="left: {elementContextMenu.x}px; top: {elementContextMenu.y}px;"
	>
		{#if editorState.profileName === ProfileName.timeline}
			<button onclick={handleEditLabelFromContext} disabled={!elementContextMenu.nodeId}>Edit Label</button>
			<div class="separator"></div>
			<button onclick={handleDuplicateFromContext} disabled={!elementContextMenu.nodeId}>Duplicate</button>
			<button class="danger" onclick={handleDeleteFromContext} disabled={!elementContextMenu.nodeId}>Delete</button>
		{:else}
			<button onclick={handleEditLabelFromContext} disabled={!elementContextMenu.nodeId && !elementContextMenu.edgeId}>Edit Label</button>
			<div class="separator"></div>
			{#if !elementContextMenu.edgeId}
				<button onclick={handleCopyElementFromContext}>Copy</button>
				<button onclick={handleCutElementFromContext}>Cut</button>
			{/if}
			<button onclick={handlePasteElementFromContext} disabled={!clipboardManager.hasContentInScope('canvas') && !containerClipboard}>Paste</button>
			{#if elementContextMenu.containerId}
				<button
					onclick={handlePasteIntoContainerFromContext}
					disabled={!clipboardManager.hasContentInScope('canvas') && !containerClipboard}
					>Paste Into Container</button
				>
			{/if}
			<div class="separator"></div>
			<button onclick={handleElementContextAddShape}>Add Shape</button>
			<button onclick={handleElementContextAddContainer}>Add Container</button>
			<button onclick={handleElementContextAddImage}>Add Image</button>
			<button onclick={handleElementContextAddText}>Add Text Box</button>
			<div class="separator"></div>
			<button onclick={handleCopyStyleFromContext} disabled={!!elementContextMenu.containerId}>Copy Style</button>
			<button onclick={handlePasteStyleFromContext} disabled={!styleClipboard || !!elementContextMenu.containerId}>Paste Style</button>
			<div class="separator"></div>
			<button onclick={handleDuplicateFromContext}>Duplicate</button>
			<button class="danger" onclick={handleDeleteFromContext}>{elementContextMenu.containerId ? 'Delete Container' : 'Delete'}</button>
		{/if}
	</div>
{/if}

{#if contextShapeFlyout}
	<div
		class="canvas-context-menu shape-picker-context-flyout"
		style="left: {contextShapeFlyout.x}px; top: {contextShapeFlyout.y}px;"
	>
		<ShapePickerFlyout
			profileName={editorState.profileName ?? ProfileName.diagram}
			iconSize={12}
			onSelect={handleContextShapeSelected}
		/>
	</div>
{/if}

{#if contextContainerFlyout}
	<div
		class="canvas-context-menu shape-picker-context-flyout"
		style="left: {contextContainerFlyout.x}px; top: {contextContainerFlyout.y}px;"
	>
		<ContainerPickerFlyout
			profileName={editorState.profileName ?? ProfileName.diagram}
			onSelect={handleContextContainerSelected}
		/>
	</div>
{/if}

{#if contextImageFlyout}
	<div
		class="canvas-context-menu shape-picker-context-flyout"
		style="left: {contextImageFlyout.x}px; top: {contextImageFlyout.y}px;"
	>
		<ImageInsertFlyout onInsert={handleContextImageSelected} />
	</div>
{/if}

<style>
	.canvas-context-menu {
		position: fixed;
		z-index: 1200;
		min-width: 180px;
		background: #fff;
		border: 1px solid #d4d4d8;
		border-radius: 8px;
		box-shadow:
			0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
		padding: 6px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.canvas-context-menu button {
		text-align: left;
		background: transparent;
		border: 0;
		border-radius: 6px;
		padding: 7px 8px;
		font-size: 12px;
		color: #1f2937;
	}

	.canvas-context-menu button:hover:enabled {
		background: #f3f4f6;
	}

	.canvas-context-menu button:disabled {
		color: #9ca3af;
		cursor: not-allowed;
	}

	.canvas-context-menu button.danger {
		color: #b91c1c;
	}

	.canvas-context-menu .separator {
		height: 1px;
		background: #e5e7eb;
		margin: 4px 2px;
	}

	.canvas-context-menu .section-label {
		padding: 4px 8px 2px;
		font-size: 11px;
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	.shape-picker-context-flyout {
		min-width: auto;
		padding: 0;
		overflow: hidden;
	}
</style>

