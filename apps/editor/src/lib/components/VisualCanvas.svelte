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
	import { ProfileName } from '$lib/types';
	import { InteractionManager } from '$lib/utils/interactionManager.svelte';
	import { clipboardManager } from '$lib/utils/clipboardManager.svelte';
	import { listBrandIconNames } from '@runiq/icons-brand';
	import { listIconifyIconNamesForDsl } from '@runiq/icons-iconify';
	import { getAvailableBaseThemes } from '@runiq/core';
	import { type DiagramProfile, type NodeLocation, type WarningDetail } from '@runiq/parser-dsl';
	import { onMount, tick } from 'svelte';
	import EditorToolbar from './Editor/EditorToolbar.svelte';
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
	let showWarnings = $state(false);
	let lastWarningCount = $state(0);
	let warningDetails = $state<WarningDetail[]>([]);
	let combinedWarnings = $state<string[]>([]);
	let canvasContextMenu = $state<{ x: number; y: number } | null>(null);
	let elementContextMenu = $state<
		{ x: number; y: number; nodeId: string | null; edgeId: string | null } | null
	>(null);
	let styleClipboard = $state<{
		kind: 'node' | 'edge';
		styleRef?: string;
		properties: Record<string, string | number | boolean>;
	} | null>(null);
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
	let iconInputValue = $state('');
	let iconSearchQuery = $state('');
	let panelOpen = $state<Record<ElementPanelKey, boolean>>(createInitialPanelOpen());
	let elementToolbarPosition = $state<{ x: number; y: number } | null>(null);

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
		return document.querySelector<SVGSVGElement>(`[data-id="${diagramDataId}"]`);
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

	function closeCanvasContextMenu() {
		canvasContextMenu = null;
	}

	function closeElementContextMenu() {
		elementContextMenu = null;
	}

	function escapeDslString(value: string): string {
		return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
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
		if (!elementContextMenu) return;
		const { nodeId, edgeId } = elementContextMenu;
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
		if (!elementContextMenu) return;
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
		if (!elementContextMenu) return;
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
		clipboardManager.paste(handleInsertShape, 'canvas');
		closeElementContextMenu();
	}

	function handlePasteStyleFromContext() {
		if (!elementContextMenu || !styleClipboard) return;
		const { nodeId, edgeId } = elementContextMenu;
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
		const { nodeId, edgeId } = elementContextMenu;

		if (nodeId) {
			const node = getSelectedNodeProfile(nodeId);
			if (!node) return;
			const nextId = `id${editorState.shapeCounter}`;
			const shapeId = node.shape || 'rectangle';
			const nextLabel = node.label ? `${node.label} Copy` : 'New Node';
			const escapedLabel = escapeDslString(nextLabel);
			const shapeCode = `shape ${nextId} as @${shapeId} label:"${escapedLabel}"`;
			handleInsertShape(shapeCode);
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
		handleDelete(elementContextMenu.nodeId, elementContextMenu.edgeId);
		selection.clearSelection();
		selection.updateVisualSelection(svgContainer);
		closeElementContextMenu();
	}

	function handleCanvasContextMenu(event: MouseEvent) {
		if (editorState.profileName !== ProfileName.diagram) return;
		const target = event.target as HTMLElement | null;
		if (!target) return;
		const nodeElement = target.closest('[data-node-id]') as HTMLElement | null;
		const edgeElement = target.closest('[data-edge-id]') as HTMLElement | null;
		if (nodeElement || edgeElement) {
			event.preventDefault();
			const nodeId = nodeElement?.getAttribute('data-node-id') ?? null;
			const edgeId = edgeElement?.getAttribute('data-edge-id') ?? null;
			setSelectionFromContextMenu(nodeId, edgeId);
			canvasContextMenu = null;
			elementContextMenu = { x: event.clientX, y: event.clientY, nodeId, edgeId };
			return;
		}
		if (target.closest('[data-container-id]')) return;
		event.preventDefault();
		elementContextMenu = null;
		canvasContextMenu = { x: event.clientX, y: event.clientY };
	}

	function handleContextSetMode(mode: 'select' | 'connect') {
		canvasState.mode = mode;
		closeCanvasContextMenu();
	}

	function handleContextAddShape() {
		handleInsertShape('shape id as @rectangle label:"New Node"');
		closeCanvasContextMenu();
	}

	function handleContextAddContainer() {
		handleInsertShape(
			'container "New Container" {\n  shape id as @rectangle label:"Node"\n}'
		);
		closeCanvasContextMenu();
	}

	function handleContextAddImage() {
		handleInsertShape(
			'shape id as @image label:"Image" data:[{ src:"https://images.unsplash.com/photo-1461749280684-dccba630e2f6" }]'
		);
		closeCanvasContextMenu();
	}

	function handleContextAddText() {
		handleInsertShape('shape id as @textBlock label:"Edit text" textAlign:left');
		canvasState.mode = 'select';
		closeCanvasContextMenu();
	}

	function handleContextPaste() {
		clipboardManager.paste(undefined, 'canvas');
		closeCanvasContextMenu();
	}

	function handleContextApplyTheme(themeId: string) {
		const nextCode = applyThemeToDsl(editorState.code || '', themeId);
		updateCode(nextCode, true);
		closeCanvasContextMenu();
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
		}
	});

	function handleCanvasKeyDown(event: KeyboardEvent) {
		if (editorState.profileName === ProfileName.diagram && canvasState.mode === 'connect') {
			quickConnectBehaviorHint = getQuickConnectBehaviorFromModifiers(event);
		}
		handleCanvasKeyDownBase(event);
	}

	function handleEditBlur() {
		if (editorState.profileName !== ProfileName.diagram || canvasState.mode !== 'select') return;
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
		{#if editorState.profileName === ProfileName.diagram && canvasState.mode === 'select' && !selection.editingNodeId && !selection.editingEdgeId && (selection.selectedNodeId || selection.selectedEdgeId) && elementToolbarPosition}
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

		<CanvasStateOverlay errors={diagramState.errors} hasSvgOutput={!!svgOutput} />
	</div>
</div>

{#if canvasContextMenu}
	<div
		class="canvas-context-menu"
		style="left: {canvasContextMenu.x}px; top: {canvasContextMenu.y}px;"
	>
		<button onclick={() => handleContextSetMode('select')}>Select Mode</button>
		<button onclick={() => handleContextSetMode('connect')}>Connect Mode</button>
		<div class="separator"></div>
		<button onclick={handleContextAddShape}>Add Shape</button>
		<button onclick={handleContextAddContainer}>Add Container</button>
		<button onclick={handleContextAddImage}>Add Image</button>
		<button onclick={handleContextAddText}>Add Text</button>
		<button onclick={handleContextPaste} disabled={!clipboardManager.hasContentInScope('canvas')}>Paste</button>
		<div class="separator"></div>
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
		<button onclick={handleCopyElementFromContext}>Copy</button>
		<button onclick={handleCutElementFromContext}>Cut</button>
		<button onclick={handlePasteElementFromContext} disabled={!clipboardManager.hasContentInScope('canvas')}>Paste</button>
		<div class="separator"></div>
		<button onclick={handleCopyStyleFromContext}>Copy Style</button>
		<button onclick={handlePasteStyleFromContext} disabled={!styleClipboard}>Paste Style</button>
		<div class="separator"></div>
		<button onclick={handleDuplicateFromContext}>Duplicate</button>
		<button class="danger" onclick={handleDeleteFromContext}>Delete</button>
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
</style>

