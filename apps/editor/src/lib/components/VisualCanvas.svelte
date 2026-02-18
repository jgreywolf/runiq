<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { type NodeLocation, type WarningDetail } from '@runiq/parser-dsl';
	import { Badge } from '$lib/components/ui/badge';
	import Icon from '@iconify/svelte';
	import EditorToolbar from './Editor/EditorToolbar.svelte';
	import StylePanel from './Editor/StylePanel.svelte';
	import { diagramState, styleState } from '$lib/state';
	import { renderDiagram as renderDiagramUtil } from './visual-canvas/renderingUtils';
	import { SelectionState } from './visual-canvas/SelectionState.svelte';
	import { ViewportState } from './visual-canvas/ViewportState.svelte';
	import { InteractionManager } from '$lib/utils/interactionManager.svelte';
	import { createCanvasEventHandlers } from './visual-canvas/canvasEventHandlers';
	import { createDebouncedRunner, runRenderCycle } from './visual-canvas/renderController';
	import {
		collectSelectedIds,
		collectSelectedIdSet,
		extractSelectedElementStyles,
		mapStyleProperty,
		mergeWarnings,
		updateWarningVisibility
	} from './visual-canvas/viewModel';
	import {
		findNonOverlappingPreviewPoint,
		getQuickConnectBehaviorFromModifiers,
		offsetPointInDirection,
		selectDirectionalTarget,
		type CanvasNodeBox,
		type QuickConnectBehavior,
		type QuickConnectDirection
	} from './visual-canvas/quickConnect';
	import {
		handleEdit,
		handleDelete,
		handleResetStyles,
		handleInsertShape,
		handleInsertEdge,
		handleInsertShapeAndEdge,
		editorRefs,
		handleParse
	} from '$lib/state/editorState.svelte';
	import { editorState } from '$lib/state/editorState.svelte';
	import { canvasState } from '$lib/state';
	import { ProfileName } from '$lib/types';

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
	type QuickConnectHandle = {
		direction: QuickConnectDirection;
		x: number;
		y: number;
	};
	let quickConnectNodeId = $state<string | null>(null);
	let quickConnectHandles = $state<QuickConnectHandle[]>([]);
	let quickConnectActiveDirection = $state<QuickConnectDirection | null>(null);
	let quickConnectPreviewStart = $state<{ x: number; y: number } | null>(null);
	let quickConnectPreviewEnd = $state<{ x: number; y: number } | null>(null);
	let quickConnectTargetNodeId = $state<string | null>(null);
	let quickConnectNewNodePosition = $state<{ x: number; y: number } | null>(null);
	let quickConnectBehaviorHint = $state<QuickConnectBehavior>('auto');

	// DOM element references
	let editInputElement = $state<HTMLInputElement | null>(null);
	let svgContainer = $state<HTMLDivElement | null>(null);

	// Selection state managed by SelectionState class
	// Synced with centralized editorState for consistency
	const selection = new SelectionState({
		onSelectionChange: (nodeId, edgeId) => {
			// Selection changes are now handled internally
		}
	});

	// Viewport state managed by ViewportState class
	const viewport = new ViewportState({
		minScale: 0.1,
		maxScale: 5
	});

	// Register viewport with editorRefs for toolbar access
	editorRefs.viewport = viewport;

	// Interaction manager for coordinating mouse events and handlers
	const interactionManager = new InteractionManager(selection, viewport);

	// Node locations from parser (for code highlighting)
	let nodeLocations = $state<Map<string, NodeLocation>>(new Map());

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
		showWarnings = next.showWarnings;
		lastWarningCount = next.lastWarningCount;
	});

	$effect(() => {
		combinedWarnings = mergeWarnings(
			warningDetails,
			diagramState.warnings,
			editorState.lintWarnings
		);
	});

	$effect(() => {
		if (diagramState.errors.length > 0 && canvasState.mode !== 'select') {
			canvasState.mode = 'select';
		}
	});

	$effect(() => {
		if (canvasState.mode !== 'connect') {
			connectPreviewStart = null;
			connectPreviewEnd = null;
			resetQuickConnect();
		}
	});

	$effect(() => {
		if (canvasState.mode === 'connect') {
			const hasActiveSelection =
				selection.selectedNodeId !== null ||
				selection.selectedEdgeId !== null ||
				selection.selectedNodeIds.size > 0 ||
				selection.selectedEdgeIds.size > 0;
			const shouldHideStyle = styleState.isVisible;
			if (!hasActiveSelection && !shouldHideStyle) return;

			queueMicrotask(() => {
				selection.clearSelection();
				selection.updateVisualSelection(svgContainer);
				if (shouldHideStyle) styleState.hide();
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

	function getContainerPointFromClient(clientX: number, clientY: number): { x: number; y: number } | null {
		if (!svgContainer) return null;
		const rect = svgContainer.getBoundingClientRect();
		return { x: clientX - rect.left, y: clientY - rect.top };
	}

	function containerPointToSvgPoint(point: { x: number; y: number }): { x: number; y: number } | null {
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

	const QUICK_CONNECT_NODE_HITBOX_PADDING = 24;
	const QUICK_CONNECT_NEW_NODE_PREVIEW_WIDTH = 112;
	const QUICK_CONNECT_NEW_NODE_PREVIEW_HEIGHT = 44;
	const QUICK_CONNECT_NEW_NODE_STEP = 96;
	const QUICK_CONNECT_NEW_NODE_MAX_STEPS = 8;

	function listCanvasNodeBoxes(): CanvasNodeBox[] {
		if (!svgContainer) return [];
		const containerRect = svgContainer.getBoundingClientRect();
		const nodes = Array.from(svgContainer.querySelectorAll('[data-node-id]')) as SVGGraphicsElement[];
		return nodes
			.map((nodeEl) => {
				const id = nodeEl.getAttribute('data-node-id');
				if (!id) return null;
				const rect = nodeEl.getBoundingClientRect();
				const left = rect.left - containerRect.left;
				const top = rect.top - containerRect.top;
				const right = left + rect.width;
				const bottom = top + rect.height;
				return {
					id,
					left,
					right,
					top,
					bottom,
					centerX: left + rect.width / 2,
					centerY: top + rect.height / 2
				};
			})
			.filter((node): node is CanvasNodeBox => node !== null);
	}

	function getNodeIdAtContainerPoint(
		point: { x: number; y: number },
		padding = QUICK_CONNECT_NODE_HITBOX_PADDING
	): string | null {
		const boxes = listCanvasNodeBoxes();
		const candidates = boxes
			.filter(
				(box) =>
					point.x >= box.left - padding &&
					point.x <= box.right + padding &&
					point.y >= box.top - padding &&
					point.y <= box.bottom + padding
			)
			.sort((a, b) => {
				const da = Math.abs(point.x - a.centerX) + Math.abs(point.y - a.centerY);
				const db = Math.abs(point.x - b.centerX) + Math.abs(point.y - b.centerY);
				return da - db;
			});
		return candidates[0]?.id ?? null;
	}

	function getQuickConnectHandles(nodeId: string): QuickConnectHandle[] {
		const node = listCanvasNodeBoxes().find((candidate) => candidate.id === nodeId);
		if (!node) return [];
		return [
			{ direction: 'top', x: node.centerX, y: node.top - 12 },
			{ direction: 'right', x: node.right + 12, y: node.centerY },
			{ direction: 'bottom', x: node.centerX, y: node.bottom + 12 },
			{ direction: 'left', x: node.left - 12, y: node.centerY }
		];
	}

	function getConnectedTargets(sourceNodeId: string): Set<string> {
		const profile = diagramState.profile as any;
		const edges = Array.isArray(profile?.edges) ? profile.edges : [];
		const targets = new Set<string>();
		for (const edge of edges) {
			if (edge?.from === sourceNodeId && typeof edge?.to === 'string') {
				targets.add(edge.to);
			}
		}
		return targets;
	}

	function getPreviewEndpointForDirection(
		sourceNodeId: string,
		direction: QuickConnectDirection,
		behavior: QuickConnectBehavior
	): { point: { x: number; y: number }; targetNodeId: string | null } | null {
		const nodeBoxes = listCanvasNodeBoxes();
		const connectedTargets = getConnectedTargets(sourceNodeId);
		return selectDirectionalTarget({
			sourceNodeId,
			direction,
			nodeBoxes,
			connectedTargets,
			behavior
		});
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
			behavior === 'new' ? null : getPreviewEndpointForDirection(nodeId, direction, behavior);
		if (targetPreview && behavior !== 'new') {
			quickConnectTargetNodeId = targetPreview.targetNodeId;
			quickConnectPreviewEnd = targetPreview.point;
			quickConnectNewNodePosition = null;
			return;
		}

		const distance = 170;
		const end = offsetPointInDirection(
			{ x: sourceHandle.x, y: sourceHandle.y },
			direction,
			distance
		);
		const nonOverlappingEnd = findNonOverlappingPreviewPoint({
			initialPoint: end,
			direction,
			sourceNodeId: nodeId,
			nodeBoxes: listCanvasNodeBoxes(),
			previewWidth: QUICK_CONNECT_NEW_NODE_PREVIEW_WIDTH,
			previewHeight: QUICK_CONNECT_NEW_NODE_PREVIEW_HEIGHT,
			stepDistance: QUICK_CONNECT_NEW_NODE_STEP,
			maxSteps: QUICK_CONNECT_NEW_NODE_MAX_STEPS
		});
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
		const svgPoint = quickConnectNewNodePosition ?? containerPointToSvgPoint(quickConnectPreviewEnd);
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

		let nodeId: string | null = target.closest('[data-node-id]')?.getAttribute('data-node-id') ?? null;
		if (!nodeId && svgContainer) {
			const containerRect = svgContainer.getBoundingClientRect();
			const point = {
				x: event.clientX - containerRect.left,
				y: event.clientY - containerRect.top
			};
			nodeId = getNodeIdAtContainerPoint(point);
		}
		if (!nodeId) {
			resetQuickConnect();
			return;
		}

		if (quickConnectNodeId !== nodeId) {
			quickConnectNodeId = nodeId;
			quickConnectHandles = getQuickConnectHandles(nodeId);
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
				svgOutput = result.svg;
				diagramState.setErrors(result.errors);
				diagramState.setWarnings(result.warnings);
				warningDetails = result.warningDetails ?? [];
				parseTime = result.parseTime;
				renderTime = result.renderTime;

				if (result.nodeLocations) {
					nodeLocations = result.nodeLocations;
				}

				if (result.profile) {
					diagramState.setProfile(result.profile);
				}

				handleParse(result.success, result.errors);
			},
			onError: (errorMsg) => {
				diagramState.setErrors([errorMsg]);
				warningDetails = [];
				svgOutput = '';
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

	function handleOpenStylePanel() {
		if (editorState.profileName !== ProfileName.diagram || canvasState.mode !== 'select') return;
		const elementId = selection.selectedNodeId || selection.selectedEdgeId;
		const styles = extractSelectedElementStyles(diagramState.profile as any, elementId);
		if (Object.keys(styles).length > 0) {
			styleState.setStyles(styles);
		}
		styleState.toggle();
	}

	function handleStyleChange(property: string, value: string | number) {
		if (editorState.profileName !== ProfileName.diagram || canvasState.mode !== 'select') return;
		styleState.setStyle(property, value);
		const dslProperty = mapStyleProperty(property);
		for (const targetId of collectSelectedIds(selection)) {
			handleEdit(targetId, dslProperty, value);
		}
	}

	function handleResetSelectedStyles() {
		const selectedIds = collectSelectedIds(selection);
		handleResetStyles(selectedIds);
		styleState.setStyles({});
	}

	// onMount(() => {
	// 	if (editorState.code) {
	// 		renderDiagram(editorState.code);
	// 	}
	// });

	onMount(() => {
		// Register VisualCanvas with editorRefs
		editorRefs.preview = {
			hasValidDiagram,
			getSvg
		};

		return () => {
			// Cleanup on unmount
			editorRefs.preview = null;
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
						{warningDetails.length + combinedWarnings.length === 1
							? ''
							: 's'}
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
												editorRefs.code?.jumpTo(
													warning.range.startLine,
													warning.range.startColumn
												);
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
		{#if editorState.profileName === ProfileName.diagram && canvasState.mode === 'select' && (selection.selectedNodeId || selection.selectedEdgeId)}
			<div class="floating-toolbar">
				<button
					onclick={handleOpenStylePanel}
					class="toolbar-button"
					title="Edit Style (colors, fonts, effects)"
				>
					<Icon icon="lucide:palette" class="size-4" />
					<span>Style</span>
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

		{#if styleState.isVisible && editorState.profileName === ProfileName.diagram && canvasState.mode === 'select'}
			<StylePanel
				selectedIds={collectSelectedIdSet(selection)}
				currentStyles={styleState.currentStyles}
				hasMixedValues={styleState.hasMixedValues}
				onClose={() => styleState.hide()}
				onStyleChange={handleStyleChange}
				onResetStyles={handleResetSelectedStyles}
			/>
		{/if}

		{#if diagramState.errors.length > 0}
			<!-- Error Overlay -->
			<div class="absolute inset-0 flex items-center justify-center p-8">
				<div class="max-w-2xl rounded-lg border-2 border-error bg-white p-6 shadow-lg">
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
					<div class="space-y-2">
						{#each diagramState.errors as error}
							<div class="rounded bg-error/10 px-3 py-2 font-mono text-sm text-error">
								{error}
							</div>
						{/each}
					</div>
					<p class="mt-4 text-sm text-neutral-600">
						Fix the errors in the code editor to see the preview.
					</p>
				</div>
			</div>
		{:else if svgOutput}
			<!-- SVG Preview with Pan/Zoom -->
			<div
				class="absolute inset-0 flex items-center justify-center transition-transform"
				style="transform: translate({viewport.translateX}px, {viewport.translateY}px) scale({viewport.scale})"
			>
				<div class="rounded-lg bg-transparent p-4">
					{@html svgOutput}
				</div>
			</div>
		{:else}
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
