<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import * as Popover from '$lib/components/ui/popover';
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
	import Icon from '@iconify/svelte';
	import { listBrandIconNames } from '@runiq/icons-brand';
	import { listIconifyIconNamesForDsl } from '@runiq/icons-iconify';
	import { type WarningDetail } from '@runiq/parser-dsl';
	import { onMount, tick } from 'svelte';
	import EditorToolbar from './Editor/EditorToolbar.svelte';
	import { createCanvasEventHandlers } from './visual-canvas/canvasEventHandlers';
	import { createCanvasDebugLogger } from './visual-canvas/debug';
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
		QUICK_CONNECT_NEW_NODE_PREVIEW_HEIGHT,
		QUICK_CONNECT_NEW_NODE_PREVIEW_WIDTH,
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

	function getFilteredIconTokens(): string[] {
		return getFilteredIconTokensFromState(availableIconTokens, iconSearchQuery);
	}

	// DOM element references
	let editInputElement = $state<HTMLInputElement | null>(null);
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

	// TODO: label edit on double click of element
	function handleStartLabelEdit() {
		if (editorState.profileName !== ProfileName.diagram || canvasState.mode !== 'select') return;
		const nodeId = selection.selectedNodeId;
		const edgeId = selection.selectedEdgeId;
		if (!nodeId && !edgeId) return;
		interactionManager.startLabelEdit(nodeId, edgeId);
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

	function getFilteredStyleDeclarations() {
		return filterStyleDeclarations(getStyleDeclarations(), styleSearchQuery);
	}

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

	function removeStyleDeclaration(styleName: string) {
		updateCode(deleteStyleDeclaration(editorState.code, styleName), true);
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
	<!-- Header -->
	<div class="flex items-center justify-between border-b border-runiq-200 bg-runiq-50 px-4 py-2">
		<!-- Status -->
		<div class="flex items-center gap-2">
			{#if isRendering}
				<Badge variant="secondary" class="gap-1">
					<svg class="h-3 w-3 animate-spin" viewBox="0 0 24 24">
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
							fill="none"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Rendering...
				</Badge>
			{:else if diagramState.errors.length > 0}
				<Badge variant="destructive" class="gap-1">
					<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
					{diagramState.errors.length} Error{diagramState.errors.length === 1 ? '' : 's'}
				</Badge>
			{:else if warningDetails.length + combinedWarnings.length > 0}
				<button
					type="button"
					class="focus:outline-none"
					onclick={() => {
						showWarnings = !showWarnings;
					}}
				>
					<Badge variant="outline" class="gap-1 border-warning text-warning">
						<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
						{warningDetails.length + combinedWarnings.length}
						Warning
						{warningDetails.length + combinedWarnings.length === 1 ? '' : 's'}
					</Badge>
				</button>
			{:else if svgOutput}
				<Badge variant="default" class="gap-1 bg-success text-white">
					<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
					Ready
				</Badge>
			{/if}

			{#if parseTime > 0 && renderTime > 0}
				<span class="text-xs text-neutral-500">
					Parse: {parseTime}ms · Render: {renderTime}ms
				</span>
			{/if}

			{#if editorState.profileName === ProfileName.diagram && canvasState.mode === 'connect'}
				<Badge
					variant="outline"
					class="gap-1 border-blue-300 bg-blue-50 text-blue-700"
					data-testid="connect-mode-hint"
				>
					Connect: {quickConnectBehaviorHint === 'auto'
						? 'Auto'
						: quickConnectBehaviorHint === 'new'
							? 'New'
							: 'Existing'}
					<span class="text-[10px] text-blue-500">(Alt New / Shift Existing)</span>
				</Badge>
			{/if}

			{#if selection.selectedNodeIds.size > 0 || selection.selectedEdgeIds.size > 0}
				<Badge variant="outline" class="gap-1 border-purple-300 bg-purple-50 text-purple-700">
					<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					Multi-Select: {selection.selectedNodeIds.size + selection.selectedEdgeIds.size} items
				</Badge>
			{:else if selection.selectedNodeId}
				<Badge variant="outline" class="gap-1">
					<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
						/>
					</svg>
					Selected: {selection.selectedNodeId}
				</Badge>
			{:else if selection.selectedEdgeId}
				<Badge variant="outline" class="gap-1">
					<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					Selected: {selection.selectedEdgeId}
				</Badge>
			{/if}

			<!-- Multi-select help hint -->
			{#if !selection.selectedNodeId && !selection.selectedEdgeId && selection.selectedNodeIds.size === 0 && selection.selectedEdgeIds.size === 0}
				<span class="text-xs text-neutral-400 italic">
					Tip: Ctrl+Click to multi-select, Ctrl+Drag for lasso
				</span>
			{/if}
		</div>

		<!-- Zoom Level Display -->
		<div class="flex items-center gap-1">
			<span class="min-w-[60px] text-center text-xs text-neutral-600">
				{viewport.zoomPercentage}%
			</span>
		</div>
	</div>

	{#if (warningDetails.length > 0 || combinedWarnings.length > 0) && showWarnings}
		<div class="border-b border-warning/40 bg-warning/10 px-4 py-2">
			<div class="flex items-start justify-between gap-3">
				<div>
					<div class="text-sm font-semibold text-warning">Warnings</div>
					{#if warningDetails.length > 0}
						<ul class="mt-1 space-y-2 text-sm text-neutral-700">
							{#each warningDetails as warning}
								<li>
									<button
										type="button"
										class="flex w-full items-start gap-2 rounded px-2 py-1 text-left hover:bg-warning/20"
										onclick={() => {
											editorState.showCodeEditor = true;
											editorState.activeTab = 'syntax';
											tick().then(() => {
												editorRefs.code?.jumpTo(warning.range.startLine, warning.range.startColumn);
											});
										}}
									>
										<span class="mt-0.5 h-1.5 w-1.5 rounded-full bg-warning"></span>
										<span class="flex-1">
											<span class="block">{warning.message}</span>
											<span class="text-xs text-neutral-500">
												Line {warning.range.startLine}, Col {warning.range.startColumn}
											</span>
										</span>
									</button>
								</li>
							{/each}
						</ul>
					{/if}
					{#if combinedWarnings.length > 0}
						<ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-700">
							{#each combinedWarnings as warning}
								<li>{warning}</li>
							{/each}
						</ul>
					{/if}
				</div>
				<button
					type="button"
					class="rounded p-1 text-warning hover:bg-warning/20"
					aria-label="Dismiss warnings"
					onclick={() => {
						showWarnings = false;
					}}
				>
					<Icon icon="lucide:x" class="size-4" />
				</button>
			</div>
		</div>
	{/if}

	<!-- Floating Toolbar -->
	<div
		class="absolute left-4 z-10 flex gap-2"
		style="top: {showWarnings && diagramState.warnings.length > 0 ? '120px' : '66px'};"
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
				<Popover.Root
					open={panelOpen.changeShape}
					onOpenChange={(open) => onPanelOpenChange('changeShape', open)}
				>
					<Popover.Trigger
						class={`toolbar-button ${panelOpen.changeShape ? 'is-active' : ''}`}
						title="Change Shape"
						disabled={!selection.selectedNodeId}
					>
						<Icon icon="lucide:shapes" class="size-4" />
						<span>Change Shape</span>
					</Popover.Trigger>
					<Popover.Content class="element-flyout-panel" align="start" sideOffset={8}>
						<div class="flyout-title">Change Shape</div>
						{#each diagramShapeCategories as category}
							<div class="shape-picker-group">
								<div class="shape-picker-group-title">{category.label}</div>
								<div class="shape-picker-grid">
									{#each category.shapes as shape}
										<button
											type="button"
											class="shape-picker-item"
											onclick={() => handleApplyShape(shape.id)}
										>
											<span class="shape-picker-label">{shape.label}</span>
										</button>
									{/each}
								</div>
							</div>
						{/each}
					</Popover.Content>
				</Popover.Root>
				<Popover.Root
					open={panelOpen.styles}
					onOpenChange={(open) => onPanelOpenChange('styles', open)}
				>
					<Popover.Trigger
						class={`toolbar-button ${panelOpen.styles ? 'is-active' : ''}`}
						title="Apply Style"
						disabled={!selection.selectedNodeId}
					>
						<Icon icon="lucide:swatch-book" class="size-4" />
						<span>Styles</span>
					</Popover.Trigger>
					<Popover.Content class="element-flyout-panel" align="start" sideOffset={8}>
						<div class="flyout-title">Styles</div>
						<input
							class="icon-flyout-input"
							type="text"
							bind:value={styleSearchQuery}
							placeholder="Search styles..."
						/>
						<div class="icon-results-list">
							{#each getFilteredStyleDeclarations() as styleDecl}
								<div class="style-row">
									<button
										type="button"
										class="style-apply-btn"
										onclick={() => applyStyleRef(styleDecl.name)}
									>
										<span class="font-semibold">{styleDecl.name}</span>
										<span class="style-preview">
											<span
												class="style-preview-chip"
												style={`background:${styleDecl.properties.fillColor || '#f3f4f6'}; border-color:${styleDecl.properties.strokeColor || '#d1d5db'};`}
											></span>
											<span
												>{styleDecl.properties.fillColor || 'theme'} / {styleDecl.properties
													.strokeColor || 'theme'}</span
											>
										</span>
									</button>
									<button
										type="button"
										class="toolbar-button toolbar-button-sm"
										onclick={() => openCreateStyleDialog(styleDecl)}
									>
										Edit
									</button>
									<button
										type="button"
										class="toolbar-button toolbar-button-sm"
										onclick={() => removeStyleDeclaration(styleDecl.name)}
									>
										Delete
									</button>
								</div>
							{/each}
						</div>
						<div class="icon-flyout-actions">
							<button class="toolbar-button toolbar-button-sm" onclick={resetStyleRefToTheme}>
								Reset to Theme
							</button>
							<button
								class="toolbar-button toolbar-button-sm"
								onclick={() => openCreateStyleDialog()}
							>
								Create New
							</button>
						</div>
					</Popover.Content>
				</Popover.Root>
				<div class="toolbar-divider-vertical"></div>
				<Popover.Root
					open={panelOpen.border}
					onOpenChange={(open) => onPanelOpenChange('border', open)}
				>
					<Popover.Trigger
						class={`toolbar-button ${panelOpen.border ? 'is-active' : ''}`}
						title="Border/Stroke"
					>
						<Icon icon="lucide:square-dashed-bottom-code" class="size-4" />
						<span>Border</span>
					</Popover.Trigger>
					<Popover.Content class="element-flyout-panel" align="start" sideOffset={8}>
						<div class="flyout-title">Border / Stroke</div>
						<div class="icon-flyout-label">Color</div>
						<input class="icon-flyout-input" type="color" bind:value={borderDraft.strokeColor} />
						<div class="icon-flyout-label">Width</div>
						<input
							class="icon-flyout-input"
							type="number"
							min="0"
							step="0.5"
							bind:value={borderDraft.strokeWidth}
						/>
						<div class="border-style-buttons">
							{#each borderStyleChoices as choice}
								<button
									type="button"
									class="toolbar-button toolbar-button-sm"
									class:is-active={borderDraft.lineStyle === choice.id}
									onclick={() => (borderDraft.lineStyle = choice.id)}
								>
									<Icon icon={choice.icon} class="size-4" />
									<span>{choice.label}</span>
								</button>
							{/each}
						</div>
						<div class="icon-flyout-actions">
							<button class="toolbar-button toolbar-button-sm" onclick={() => closeAllPanels()}>
								Cancel
							</button>
							<button class="toolbar-button toolbar-button-sm" onclick={applyBorderDraft}>
								Apply
							</button>
						</div>
					</Popover.Content>
				</Popover.Root>
				<Popover.Root
					open={panelOpen.fill}
					onOpenChange={(open) => onPanelOpenChange('fill', open)}
				>
					<Popover.Trigger
						class={`toolbar-button ${panelOpen.fill ? 'is-active' : ''}`}
						title="Fill Color"
					>
						<Icon icon="lucide:paintbucket" class="size-4" />
						<span>Fill</span>
					</Popover.Trigger>
					<Popover.Content class="element-flyout-panel" align="start" sideOffset={8}>
						<div class="flyout-title">Fill Color</div>
						{#if !selection.selectedNodeId}
							<div class="icon-result-empty">Fill is available for nodes only.</div>
						{/if}
						<input class="icon-flyout-input" type="color" bind:value={fillDraft.fillColor} />
						<div class="icon-flyout-actions">
							<button class="toolbar-button toolbar-button-sm" onclick={() => closeAllPanels()}>
								Cancel
							</button>
							<button class="toolbar-button toolbar-button-sm" onclick={applyFillDraft}>
								Apply
							</button>
						</div>
					</Popover.Content>
				</Popover.Root>
				<Popover.Root
					open={panelOpen.text}
					onOpenChange={(open) => onPanelOpenChange('text', open)}
				>
					<Popover.Trigger
						class={`toolbar-button ${panelOpen.text ? 'is-active' : ''}`}
						title="Text Styling"
					>
						<Icon icon="lucide:type" class="size-4" />
						<span>Text</span>
					</Popover.Trigger>
					<Popover.Content class="element-flyout-panel" align="start" sideOffset={8}>
						<div class="flyout-title">Text</div>
						<div class="icon-flyout-label">Color</div>
						<input class="icon-flyout-input" type="color" bind:value={textDraft.textColor} />
						<div class="icon-flyout-label">Size</div>
						<input
							class="icon-flyout-input"
							type="number"
							min="8"
							step="1"
							bind:value={textDraft.fontSize}
						/>
						<div class="icon-flyout-label">Font Family</div>
						<input
							class="icon-flyout-input"
							type="text"
							bind:value={textDraft.fontFamily}
							placeholder="sans-serif"
						/>
						<div class="icon-flyout-actions">
							<button class="toolbar-button toolbar-button-sm" onclick={resetTextDraftToTheme}>
								Reset
							</button>
							<button class="toolbar-button toolbar-button-sm" onclick={() => closeAllPanels()}>
								Cancel
							</button>
							<button class="toolbar-button toolbar-button-sm" onclick={applyTextDraft}>
								Apply
							</button>
						</div>
					</Popover.Content>
				</Popover.Root>
				<Popover.Root
					open={panelOpen.icon}
					onOpenChange={(open) => onPanelOpenChange('icon', open)}
				>
					<Popover.Trigger
						class={`toolbar-button ${panelOpen.icon ? 'is-active' : ''}`}
						title="Icon"
						disabled={!selection.selectedNodeId}
					>
						<Icon icon="lucide:badge-plus" class="size-4" />
						<span>Icon</span>
					</Popover.Trigger>
					<Popover.Content class="element-flyout-panel" align="start" sideOffset={8}>
						<div class="flyout-title">Icon</div>
						<label class="icon-flyout-label" for="node-icon-input">Search icons</label>
						<input
							id="node-icon-input"
							class="icon-flyout-input"
							type="text"
							bind:value={iconSearchQuery}
							placeholder="Search (e.g. aws, database, github)"
						/>
						<div class="icon-token-preview">
							<span class="icon-token-preview-label">Selected</span>
							<input
								class="icon-flyout-input"
								type="text"
								bind:value={iconInputValue}
								placeholder="brand/github_actions"
								onkeydown={(event) => {
									if (event.key === 'Enter') handleApplyIcon();
								}}
							/>
						</div>
						<div class="icon-results-list" role="listbox" aria-label="Available icons">
							{#each getFilteredIconTokens() as token}
								<button
									type="button"
									class="icon-result-item"
									onclick={() => handleSelectIconToken(token)}
								>
									<code>{token}</code>
								</button>
							{/each}
							{#if getFilteredIconTokens().length === 0}
								<div class="icon-result-empty">No icons match your search.</div>
							{/if}
						</div>
						<div class="icon-flyout-actions">
							<button class="toolbar-button toolbar-button-sm" onclick={handleApplyIcon}>
								Apply
							</button>
							<button class="toolbar-button toolbar-button-sm" onclick={handleClearIcon}>
								Clear
							</button>
						</div>
					</Popover.Content>
				</Popover.Root>
				<div class="toolbar-divider-vertical"></div>
				<button
					onclick={handleDeleteFromToolbar}
					class="toolbar-button toolbar-button-danger"
					title="Delete element"
				>
					<Icon icon="lucide:trash-2" class="size-4" />
				</button>
			</div>
		{/if}

		<!-- Lasso Selection Rectangle -->
		{#if selection.isLassoActive}
			<div
				class="lasso-rectangle"
				style="left: {Math.min(selection.lassoStartX, selection.lassoEndX)}px; top: {Math.min(
					selection.lassoStartY,
					selection.lassoEndY
				)}px; width: {Math.abs(selection.lassoEndX - selection.lassoStartX)}px; height: {Math.abs(
					selection.lassoEndY - selection.lassoStartY
				)}px;"
			></div>
		{/if}

		{#if editorState.profileName === ProfileName.diagram && canvasState.mode === 'connect' && connectPreviewStart && connectPreviewEnd}
			<svg class="connect-preview-overlay" aria-hidden="true">
				<line
					class="connect-preview-line"
					x1={connectPreviewStart.x}
					y1={connectPreviewStart.y}
					x2={connectPreviewEnd.x}
					y2={connectPreviewEnd.y}
				/>
			</svg>
		{/if}

		{#if editorState.profileName === ProfileName.diagram && canvasState.mode === 'connect' && !connectPreviewStart && quickConnectNodeId && quickConnectHandles.length > 0}
			<div class="quick-connect-layer" aria-hidden="true">
				{#each quickConnectHandles as handle}
					<button
						type="button"
						class="quick-connect-handle"
						class:is-active={quickConnectActiveDirection === handle.direction}
						style="left: {handle.x}px; top: {handle.y}px;"
						title={`Quick connect ${handle.direction} (Alt: force new, Shift: force existing)`}
						onmouseenter={(event) =>
							activateQuickConnect(
								quickConnectNodeId as string,
								handle.direction,
								getQuickConnectBehaviorFromModifiers(event)
							)}
						onmouseleave={() => {
							quickConnectActiveDirection = null;
							quickConnectPreviewStart = null;
							quickConnectPreviewEnd = null;
							quickConnectTargetNodeId = null;
							quickConnectNewNodePosition = null;
						}}
						onclick={(event) => {
							event.preventDefault();
							event.stopPropagation();
							runQuickConnect(
								quickConnectNodeId as string,
								handle.direction,
								getQuickConnectBehaviorFromModifiers(event)
							);
						}}
					>
						<span class={`quick-connect-arrow quick-connect-arrow-${handle.direction}`}></span>
					</button>
				{/each}
			</div>
		{/if}

		{#if editorState.profileName === ProfileName.diagram && canvasState.mode === 'connect' && quickConnectPreviewStart && quickConnectPreviewEnd}
			<svg class="connect-preview-overlay" aria-hidden="true">
				<line
					class="quick-connect-preview-line"
					x1={quickConnectPreviewStart.x}
					y1={quickConnectPreviewStart.y}
					x2={quickConnectPreviewEnd.x}
					y2={quickConnectPreviewEnd.y}
				/>
				{#if !quickConnectTargetNodeId}
					<rect
						class="quick-connect-new-node-preview"
						x={quickConnectPreviewEnd.x - QUICK_CONNECT_NEW_NODE_PREVIEW_WIDTH / 2}
						y={quickConnectPreviewEnd.y - QUICK_CONNECT_NEW_NODE_PREVIEW_HEIGHT / 2}
						width={QUICK_CONNECT_NEW_NODE_PREVIEW_WIDTH}
						height={QUICK_CONNECT_NEW_NODE_PREVIEW_HEIGHT}
						rx="6"
						ry="6"
					/>
				{/if}
			</svg>
		{/if}

		<!-- Label Edit Input -->
		{#if (selection.editingNodeId || selection.editingEdgeId) && selection.editInputPosition}
			<input
				type="text"
				bind:this={editInputElement}
				bind:value={selection.editingLabel}
				onkeydown={handleEditKeyPress}
				class="edit-input"
				style="left: {selection.editInputPosition.x}px; top: {selection.editInputPosition.y}px;"
			/>
		{/if}

		{#if showCreateStyleDialog}
			<div class="style-create-overlay">
				<div class="style-create-dialog">
					<h3 class="flyout-title mb-2">{editingStyleName ? 'Edit Style' : 'Create Style'}</h3>
					<label class="icon-flyout-label" for="style-name-input">Style Name</label>
					<input
						id="style-name-input"
						class="icon-flyout-input"
						type="text"
						bind:value={newStyleName}
						placeholder="myStyle"
					/>
					<div class="style-create-grid">
						<div>
							<label class="icon-flyout-label" for="style-fill-input">Fill</label>
							<input
								id="style-fill-input"
								class="icon-flyout-input"
								type="color"
								bind:value={newStyleDraft.fillColor}
							/>
						</div>
						<div>
							<label class="icon-flyout-label" for="style-stroke-input">Stroke</label>
							<input
								id="style-stroke-input"
								class="icon-flyout-input"
								type="color"
								bind:value={newStyleDraft.strokeColor}
							/>
						</div>
						<div>
							<label class="icon-flyout-label" for="style-stroke-width-input">Stroke Width</label>
							<input
								id="style-stroke-width-input"
								class="icon-flyout-input"
								type="number"
								min="0"
								step="0.5"
								bind:value={newStyleDraft.strokeWidth}
							/>
						</div>
						<div>
							<label class="icon-flyout-label" for="style-text-color-input">Text Color</label>
							<input
								id="style-text-color-input"
								class="icon-flyout-input"
								type="color"
								bind:value={newStyleDraft.textColor}
							/>
						</div>
						<div>
							<label class="icon-flyout-label" for="style-font-size-input">Font Size</label>
							<input
								id="style-font-size-input"
								class="icon-flyout-input"
								type="number"
								min="8"
								step="1"
								bind:value={newStyleDraft.fontSize}
							/>
						</div>
						<div>
							<label class="icon-flyout-label" for="style-font-family-input">Font Family</label>
							<input
								id="style-font-family-input"
								class="icon-flyout-input"
								type="text"
								bind:value={newStyleDraft.fontFamily}
								placeholder="sans-serif"
							/>
						</div>
					</div>
					<div class="icon-flyout-actions">
						<button
							class="toolbar-button toolbar-button-sm"
							onclick={() => (showCreateStyleDialog = false)}
						>
							Cancel
						</button>
						<button class="toolbar-button toolbar-button-sm" onclick={saveStyleDeclarationAndApply}>
							Save
						</button>
					</div>
				</div>
			</div>
		{/if}

		{#if svgOutput}
			<!-- SVG Preview with Pan/Zoom -->
			<div
				class="absolute inset-0 flex items-center justify-center transition-transform"
				style="transform: translate({viewport.translateX}px, {viewport.translateY}px) scale({viewport.scale})"
			>
				<div class="rounded-lg bg-transparent p-4">
					{@html svgOutput}
				</div>
			</div>
		{/if}

		{#if diagramState.errors.length > 0}
			<!-- Error Overlay -->
			<div class="absolute inset-0 flex items-center justify-center bg-black/5 p-8">
				<div
					class="max-w-2xl rounded-lg border-2 border-error bg-white/95 p-6 shadow-lg backdrop-blur-sm"
				>
					<div class="mb-4 flex items-center gap-2 text-error">
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<h3 class="text-lg font-semibold">Parsing Errors</h3>
					</div>
					{#if svgOutput}
						<p class="mb-3 text-xs text-neutral-600">Showing last valid render.</p>
					{/if}
					<div class="space-y-2">
						{#each diagramState.errors as error}
							<div class="rounded bg-error/10 px-3 py-2 font-mono text-sm text-error">
								{error}
							</div>
						{/each}
					</div>
					<p class="mt-4 text-sm text-neutral-600">
						Fix the errors in the code editor to update the preview.
					</p>
				</div>
			</div>
		{:else if !svgOutput}
			<!-- Empty State -->
			<div class="absolute inset-0 flex items-center justify-center p-8 text-center">
				<div class="max-w-md">
					<svg
						class="mx-auto mb-4 h-16 w-16 text-neutral-300"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					<h3 class="mb-2 text-lg font-medium text-neutral-700">No Diagram</h3>
					<p class="text-sm text-neutral-500">
						Start typing in the code editor to see your diagram here.
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>
