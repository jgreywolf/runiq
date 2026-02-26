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
	import {
		deleteStyleDeclaration,
		insertStyleDeclaration,
		parseStyleDeclarations,
		updateStyleDeclaration
	} from '$lib/utils/dslCodeManipulation';
	import { InteractionManager } from '$lib/utils/interactionManager.svelte';
	import { listBrandIconNames } from '@runiq/icons-brand';
	import { listIconifyIconNamesForDsl } from '@runiq/icons-iconify';
	import { type WarningDetail } from '@runiq/parser-dsl';
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
		createBorderDraftFromStyles,
		createFillDraftFromStyles,
		createInitialPanelOpen,
		createStyleDraftFromExisting,
		createStylePropertiesFromDraft,
		createTextDraftFromStyles,
		filterStyleDeclarations,
		getFilteredIconTokens as getFilteredIconTokensFromState,
		type ElementPanelKey
	} from './visual-canvas/elementToolbarState';
	import {
		getQuickConnectBehaviorFromModifiers,
		type QuickConnectBehavior,
		type QuickConnectDirection
	} from './visual-canvas/quickConnect';
	import {
		computeNonOverlappingNewNodePreviewEnd,
		getNodeIdAtContainerPoint,
		getPreviewEndpointForDirection,
		getQuickConnectHandles as getRuntimeQuickConnectHandles,
		type QuickConnectHandle
	} from './visual-canvas/quickConnectRuntime';
	import { createDebouncedRunner, runRenderCycle } from './visual-canvas/renderController';
	import { renderDiagram as renderDiagramUtil } from './visual-canvas/renderingUtils';
	import { SelectionState } from './visual-canvas/SelectionState.svelte';
	import {
		extractSelectedElementStyles,
		mergeWarnings,
		updateWarningVisibility
	} from './visual-canvas/viewModel';
	import { ViewportState } from './visual-canvas/ViewportState.svelte';

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
		const warningCount = warningDetails.length + combinedWarnings.length;
		const next = updateWarningVisibility(showWarnings, lastWarningCount, warningCount);
		if (showWarnings !== next.showWarnings) {
			showWarnings = next.showWarnings;
		}
		if (lastWarningCount !== next.lastWarningCount) {
			lastWarningCount = next.lastWarningCount;
		}
		debugCanvas('effect:warning-visibility', { warningCount, showWarnings });
	});

	$effect(() => {
		const nextWarnings = mergeWarnings(
			warningDetails,
			diagramState.warnings,
			editorState.lintWarnings
		);
		const changed =
			combinedWarnings.length !== nextWarnings.length ||
			combinedWarnings.some((warning, index) => warning !== nextWarnings[index]);
		if (changed) {
			combinedWarnings = nextWarnings;
		}
		debugCanvas('effect:merge-warnings', { merged: combinedWarnings.length });
	});

	$effect(() => {
		if (diagramState.errors.length > 0 && canvasState.mode !== 'select') {
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
		const hasPrimarySelection = !!(selection.selectedNodeId || selection.selectedEdgeId);
		if (
			!hasPrimarySelection ||
			editorState.profileName !== ProfileName.diagram ||
			canvasState.mode !== 'select'
		) {
			closeAllPanels();
			if (elementToolbarPosition !== null) {
				elementToolbarPosition = null;
			}
			debugCanvas('effect:clear-panel-no-selection', {
				hasPrimarySelection,
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
			editorState.profileName === ProfileName.diagram &&
			canvasState.mode === 'select' &&
			(selection.selectedNodeId || selection.selectedEdgeId)
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
			const hasActiveSelection =
				selection.selectedNodeId !== null ||
				selection.selectedEdgeId !== null ||
				selection.selectedNodeIds.size > 0 ||
				selection.selectedEdgeIds.size > 0;
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

	function resetQuickConnect() {
		quickConnectNodeId = null;
		quickConnectHandles = [];
		quickConnectActiveDirection = null;
		quickConnectPreviewStart = null;
		quickConnectPreviewEnd = null;
		quickConnectTargetNodeId = null;
		quickConnectNewNodePosition = null;
		quickConnectBehaviorHint = 'auto';
	}

	// function getContainerPointFromClient(clientX: number, clientY: number): { x: number; y: number } | null {
	// 	if (!svgContainer) return null;
	// 	const rect = svgContainer.getBoundingClientRect();
	// 	return { x: clientX - rect.left, y: clientY - rect.top };
	// }

	function containerPointToSvgPoint(point: {
		x: number;
		y: number;
	}): { x: number; y: number } | null {
		if (!svgContainer) return null;
		const svg = svgContainer.querySelector('svg');
		if (!svg) return null;
		const rect = svg.getBoundingClientRect();
		const viewBox = svg.viewBox?.baseVal;
		if (!viewBox || rect.width === 0 || rect.height === 0) return null;
		return {
			x: Math.round((point.x / rect.width) * viewBox.width + viewBox.x),
			y: Math.round((point.y / rect.height) * viewBox.height + viewBox.y)
		};
	}

	function activateQuickConnect(
		nodeId: string,
		direction: QuickConnectDirection,
		behavior: QuickConnectBehavior = 'auto'
	) {
		const sourceHandle = quickConnectHandles.find((handle) => handle.direction === direction);
		if (!sourceHandle) return;
		quickConnectActiveDirection = direction;
		quickConnectPreviewStart = { x: sourceHandle.x, y: sourceHandle.y };
		const targetPreview =
			behavior === 'new'
				? null
				: getPreviewEndpointForDirection(
						svgContainer,
						diagramState.profile as any,
						nodeId,
						direction,
						behavior
					);
		if (targetPreview && behavior !== 'new') {
			quickConnectTargetNodeId = targetPreview.targetNodeId;
			quickConnectPreviewEnd = targetPreview.point;
			quickConnectNewNodePosition = null;
			return;
		}

		const nonOverlappingEnd = computeNonOverlappingNewNodePreviewEnd(
			svgContainer,
			{ x: sourceHandle.x, y: sourceHandle.y },
			direction,
			nodeId
		);
		quickConnectTargetNodeId = null;
		quickConnectPreviewEnd = nonOverlappingEnd;
		quickConnectNewNodePosition = containerPointToSvgPoint(nonOverlappingEnd);
	}

	function runQuickConnect(
		nodeId: string,
		direction: QuickConnectDirection,
		behavior: QuickConnectBehavior = 'auto'
	) {
		activateQuickConnect(nodeId, direction, behavior);
		if (!quickConnectPreviewStart || !quickConnectPreviewEnd) return;

		if (quickConnectTargetNodeId) {
			handleInsertEdge(nodeId, quickConnectTargetNodeId);
			resetQuickConnect();
			return;
		}
		if (behavior === 'existing') {
			resetQuickConnect();
			return;
		}

		const newNodeId = `id${editorState.shapeCounter}`;
		const svgPoint =
			quickConnectNewNodePosition ?? containerPointToSvgPoint(quickConnectPreviewEnd);
		const shapeCode = svgPoint
			? `shape ${newNodeId} as @rectangle label:"New Node" position:(${svgPoint.x},${svgPoint.y})`
			: `shape ${newNodeId} as @rectangle label:"New Node"`;
		handleInsertShapeAndEdge(shapeCode, nodeId, newNodeId);
		resetQuickConnect();
	}

	function updateQuickConnectFromMouseEvent(event: MouseEvent) {
		const canShow =
			editorState.profileName === ProfileName.diagram &&
			canvasState.mode === 'connect' &&
			connectPreviewStart === null;
		if (!canShow) {
			resetQuickConnect();
			return;
		}

		const target = event.target as Element | null;
		if (!target) {
			resetQuickConnect();
			return;
		}

		// Keep current quick-connect state while interacting with handle UI.
		if (target.closest('.quick-connect-layer')) {
			return;
		}

		let nodeId: string | null =
			target.closest('[data-node-id]')?.getAttribute('data-node-id') ?? null;
		if (!nodeId && svgContainer) {
			const containerRect = svgContainer.getBoundingClientRect();
			const point = {
				x: event.clientX - containerRect.left,
				y: event.clientY - containerRect.top
			};
			nodeId = getNodeIdAtContainerPoint(svgContainer, point);
		}
		if (!nodeId) {
			resetQuickConnect();
			return;
		}

		if (quickConnectNodeId !== nodeId) {
			quickConnectNodeId = nodeId;
			quickConnectHandles = getRuntimeQuickConnectHandles(svgContainer, nodeId);
			quickConnectActiveDirection = null;
			quickConnectPreviewStart = null;
			quickConnectPreviewEnd = null;
			quickConnectTargetNodeId = null;
			quickConnectNewNodePosition = null;
		}
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

	let lastCode = '';
	let lastDataContent = '';

	const debouncedRender = createDebouncedRunner(300, (dslCode: string) => {
		void runRenderCycle({
			dslCode,
			dataContent: editorState.dataContent,
			layoutEngine: editorState.layoutEngine,
			renderDiagram: renderDiagramUtil,
			onEmpty: () => {
				svgOutput = '';
				diagramState.clearErrors();
				diagramState.clearWarnings();
				warningDetails = [];
				parseTime = 0;
				renderTime = 0;
				handleParse(true, []);
			},
			onStart: () => {
				isRendering = true;
				diagramState.clearErrors();
				diagramState.clearWarnings();
			},
			onSuccess: (result) => {
				if (result.svg && result.svg.trim().length > 0) {
					svgOutput = result.svg;
				}
				diagramState.setErrors(result.errors);
				diagramState.setWarnings(result.warnings);
				warningDetails = result.warningDetails ?? [];
				parseTime = result.parseTime;
				renderTime = result.renderTime;

				if (result.nodeLocations) {
					diagramState.setNodeLocations(result.nodeLocations);
				} else {
					diagramState.clearNodeLocations();
				}

				if (result.profile) {
					diagramState.setProfile(result.profile);
				}

				handleParse(result.success, result.errors);
			},
			onError: (errorMsg) => {
				diagramState.setErrors([errorMsg]);
				warningDetails = [];
				handleParse(false, diagramState.errors);
			},
			onComplete: () => {
				isRendering = false;
			}
		});
	});

	// Watch for code or data changes with debounce
	$effect(() => {
		// Read reactive values to track them
		const currentCode = editorState.code;
		const currentDataContent = editorState.dataContent;

		if (currentCode !== lastCode || currentDataContent !== lastDataContent) {
			lastCode = currentCode;
			lastDataContent = currentDataContent;
			debouncedRender.schedule(currentCode);
		}

		// Cleanup function to clear timeout on unmount or re-run
		return () => {
			debouncedRender.cancel();
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
		if (editorState.profileName !== ProfileName.diagram || canvasState.mode !== 'select') return;
		const selectedNodeId = selection.selectedNodeId;
		if (!selectedNodeId) return;
		const iconValue = iconInputValue.trim();
		if (!iconValue) return;
		handleEdit(selectedNodeId, 'icon', iconValue);
		closeAllPanels();
	}

	function handleClearIcon() {
		if (editorState.profileName !== ProfileName.diagram || canvasState.mode !== 'select') return;
		const selectedNodeId = selection.selectedNodeId;
		if (!selectedNodeId) return;
		handleEdit(selectedNodeId, 'icon', '');
		iconInputValue = '';
		iconSearchQuery = '';
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
		if (open) {
			closeAllPanels(panel);
			if (panel === 'border') openBorderPanel();
			else if (panel === 'fill') openFillPanel();
			else if (panel === 'text') openTextPanel();
			else if (panel === 'icon' && selection.selectedNodeId) {
				const styles = extractSelectedElementStyles(
					diagramState.profile as any,
					selection.selectedNodeId
				);
				iconInputValue =
					typeof styles.icon === 'string' && styles.icon !== 'mixed' ? String(styles.icon) : '';
				iconSearchQuery = iconInputValue;
			}
		}
		panelOpen[panel] = open;
	}

	function handleDeleteFromToolbar() {
		handleDelete(selection.selectedNodeId, selection.selectedEdgeId);
		selection.clearSelection();
		closeAllPanels();
	}

	function handleApplyShape(shapeId: string) {
		const selectedNodeId = selection.selectedNodeId;
		if (!selectedNodeId) return;
		handleEdit(selectedNodeId, 'shapeType', shapeId);
		closeAllPanels();
	}

	function openBorderPanel() {
		const selectedId = getSelectedElementId();
		if (!selectedId) return;
		const styles = extractSelectedElementStyles(diagramState.profile as any, selectedId);
		borderDraft = createBorderDraftFromStyles(styles);
	}

	function applyBorderDraft() {
		const selectedId = getSelectedElementId();
		if (!selectedId) return;
		handleEdit(selectedId, 'strokeColor', borderDraft.strokeColor);
		handleEdit(selectedId, 'strokeWidth', Math.max(0, Number(borderDraft.strokeWidth) || 0));
		if (selection.selectedEdgeId) {
			handleEdit(
				selectedId,
				'lineStyle',
				borderDraft.lineStyle === 'none' ? 'solid' : borderDraft.lineStyle
			);
		}
		if (borderDraft.lineStyle === 'none') {
			handleEdit(selectedId, 'strokeWidth', 0);
		}
		closeAllPanels();
	}

	function openFillPanel() {
		const selectedId = getSelectedElementId();
		if (!selectedId) return;
		const styles = extractSelectedElementStyles(diagramState.profile as any, selectedId);
		fillDraft = createFillDraftFromStyles(styles);
	}

	function applyFillDraft() {
		if (!selection.selectedNodeId) return;
		const selectedId = getSelectedElementId();
		if (!selectedId) return;
		handleEdit(selectedId, 'fillColor', fillDraft.fillColor);
		closeAllPanels();
	}

	function openTextPanel() {
		const selectedId = getSelectedElementId();
		if (!selectedId) return;
		const styles = extractSelectedElementStyles(diagramState.profile as any, selectedId);
		textDraft = createTextDraftFromStyles(styles);
	}

	function applyTextDraft() {
		if (!selection.selectedNodeId) return;
		const selectedId = getSelectedElementId();
		if (!selectedId) return;
		handleEdit(selectedId, 'textColor', textDraft.textColor);
		handleEdit(selectedId, 'fontSize', Math.max(8, Number(textDraft.fontSize) || 14));
		handleEdit(selectedId, 'fontFamily', textDraft.fontFamily || 'sans-serif');
		closeAllPanels();
	}

	function resetTextDraftToTheme() {
		const selectedId = getSelectedElementId();
		if (!selectedId) return;
		handleResetStyles([selectedId]);
		closeAllPanels();
	}

	function getStyleDeclarations() {
		return parseStyleDeclarations(editorState.code);
	}

	const filteredStyleDeclarations = $derived(
		filterStyleDeclarations(getStyleDeclarations(), styleSearchQuery)
	);

	function applyStyleRef(styleName: string) {
		const selectedNodeId = selection.selectedNodeId;
		if (!selectedNodeId) return;
		// Ensure style ref is the active source of truth by clearing inline style props first.
		handleResetStyles([selectedNodeId]);
		handleEdit(selectedNodeId, 'style', styleName);
		closeAllPanels();
	}

	function resetStyleRefToTheme() {
		const selectedNodeId = selection.selectedNodeId;
		if (!selectedNodeId) return;
		handleEdit(selectedNodeId, 'style', '');
		closeAllPanels();
	}

	function openCreateStyleDialog(existing?: { name: string; properties: Record<string, string> }) {
		editingStyleName = existing?.name ?? null;
		newStyleName = existing?.name ?? '';
		newStyleDraft = createStyleDraftFromExisting(existing);
		showCreateStyleDialog = true;
	}

	function saveStyleDeclarationAndApply() {
		const selectedNodeId = selection.selectedNodeId;
		if (!selectedNodeId) return;
		const styleName = newStyleName.trim();
		if (!styleName) return;

		const properties = createStylePropertiesFromDraft(newStyleDraft);

		let nextCode = editorState.code;
		if (editingStyleName) {
			nextCode = updateStyleDeclaration(nextCode, editingStyleName, properties);
		} else {
			nextCode = insertStyleDeclaration(nextCode, styleName, properties);
		}
		updateCode(nextCode, true);
		handleEdit(selectedNodeId, 'style', styleName);
		showCreateStyleDialog = false;
		closeAllPanels();
	}

	function closeCreateStyleDialog() {
		showCreateStyleDialog = false;
	}

	function removeStyleDeclaration(styleName: string) {
		updateCode(deleteStyleDeclaration(editorState.code, styleName), true);
	}

	function handleJumpToWarning(warning: WarningDetail) {
		editorState.showCodeEditor = true;
		editorState.activeTab = 'syntax';
		tick().then(() => {
			editorRefs.code?.jumpTo(warning.range.startLine, warning.range.startColumn);
		});
	}

	onMount(() => {
		// Register VisualCanvas with editorRefs
		editorRefs.preview = {
			hasValidDiagram,
			getSvg
		};

		const handleGlobalPointerDown = (event: PointerEvent) => {
			if (!selection.hasSelection) return;
			const target = event.target as Node | null;
			if (!target) return;

			const insideToolbar = !!floatingToolbarElement?.contains(target);
			const insidePopover = target instanceof Element && !!target.closest('[data-slot="popover-content"]');
			if (insideToolbar || insidePopover) return;

			selection.clearSelection();
			selection.updateVisualSelection(svgContainer);
			closeAllPanels();
		};

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
		style="top: {showWarnings && warningDetails.length + combinedWarnings.length > 0 ? '120px' : '66px'};"
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

