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
	import { listBrandIconNames } from '@runiq/icons-brand';
	import { listIconifyIconNamesForDsl } from '@runiq/icons-iconify';
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

	let diagramDataId = 'runiq-diagram';

	let svgOutput = $state('');
	let isRendering = $state(false);
	let parseTime = $state(0);
	let renderTime = $state(0);
	let showWarnings = $state(false);
	let lastWarningCount = $state(0);
	let warningDetails = $state<WarningDetail[]>([]);
	let combinedWarnings = $state<string[]>([]);
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
		quickConnectNodeId = state.quickConnectNodeId;
		quickConnectHandles = state.quickConnectHandles;
		quickConnectActiveDirection = state.quickConnectActiveDirection;
		quickConnectPreviewStart = state.quickConnectPreviewStart;
		quickConnectPreviewEnd = state.quickConnectPreviewEnd;
		quickConnectTargetNodeId = state.quickConnectTargetNodeId;
		quickConnectNewNodePosition = state.quickConnectNewNodePosition;
	}

	function resetQuickConnect() {
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

		document.addEventListener('pointerdown', handleGlobalPointerDown, true);

		return () => {
			// Cleanup on unmount
			editorRefs.preview = null;
			document.removeEventListener('pointerdown', handleGlobalPointerDown, true);
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
		{#if editorState.profileName === ProfileName.diagram && canvasState.mode === 'select' && (selection.selectedNodeId || selection.selectedEdgeId) && elementToolbarPosition}
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

