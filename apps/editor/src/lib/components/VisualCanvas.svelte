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
	import { clipboardManager } from '$lib/utils/clipboardManager.svelte';
	import { InteractionManager } from '$lib/utils/interactionManager.svelte';
	import {
		handleEdit,
		handleDelete,
		handleResetStyles,
		handleInsertShape,
		editorRefs,
		handleParse
	} from '$lib/state/editorState.svelte';
	import { editorState } from '$lib/state/editorState.svelte';

	let diagramDataId = 'runiq-diagram';

	let svgOutput = $state('');
	let isRendering = $state(false);
	let parseTime = $state(0);
	let renderTime = $state(0);
	let showWarnings = $state(false);
	let lastWarningCount = $state(0);
	let warningDetails = $state<WarningDetail[]>([]);
	let combinedWarnings = $state<string[]>([]);

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

		if (warningCount === 0) {
			showWarnings = false;
		} else if (warningCount > lastWarningCount) {
			showWarnings = true;
		}

		lastWarningCount = warningCount;
	});

	$effect(() => {
		const detailMessages = new Set(warningDetails.map((warning) => warning.message));
		const merged = [...diagramState.warnings, ...editorState.lintWarnings];
		const unique: string[] = [];

		for (const warning of merged) {
			if (!warning || detailMessages.has(warning) || unique.includes(warning)) {
				continue;
			}
			unique.push(warning);
		}

		combinedWarnings = unique;
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

	// Export functions for parent component access
	export function hasValidDiagram(): boolean {
		return svgOutput.trim() !== '' && diagramState.errors.length === 0;
	}

	export function getSvg(): string {
		return svgOutput;
	}

	let lastCode = '';
	let lastDataContent = '';

	// Debounce timer
	let debounceTimer: ReturnType<typeof setTimeout>;

	// Watch for code or data changes with debounce
	$effect(() => {
		// Read reactive values to track them
		const currentCode = editorState.code;
		const currentDataContent = editorState.dataContent;

		if (currentCode !== lastCode || currentDataContent !== lastDataContent) {
			lastCode = currentCode;
			lastDataContent = currentDataContent;
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				renderDiagram(currentCode);
			}, 300);
		}

		// Cleanup function to clear timeout on unmount or re-run
		return () => {
			clearTimeout(debounceTimer);
		};
	});

	async function renderDiagram(dslCode: string) {
		if (!dslCode.trim()) {
			svgOutput = '';
			diagramState.clearErrors();
			diagramState.clearWarnings();
			warningDetails = [];
			parseTime = 0;
			renderTime = 0;
			handleParse(true, []);
			return;
		}

		isRendering = true;
		diagramState.clearErrors();
		diagramState.clearWarnings();

		try {
			const result = await renderDiagramUtil(
				dslCode,
				editorState.dataContent,
				editorState.layoutEngine
			);

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

			isRendering = false;
			handleParse(result.success, result.errors);
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : 'Unknown error';
			diagramState.setErrors([errorMsg]);
			warningDetails = [];
			svgOutput = '';
			isRendering = false;
			handleParse(false, diagramState.errors);
		}
	}

	// Handle canvas click (deselect)
	function handleCanvasClick(event: MouseEvent) {
		// Only deselect if clicking on the canvas itself, not on an element
		if (event.target === event.currentTarget || (event.target as HTMLElement).tagName === 'svg') {
			// If we're in multi-select mode (have multiple items selected), only clear if NOT holding Ctrl
			if (selection.hasMultiSelection && (event.ctrlKey || event.metaKey)) {
				// Don't clear multi-selection when Ctrl+clicking empty space
				return;
			}

			interactionManager.clearSelection();
		}
	}

	// Handle keyboard events for the canvas
	function handleCanvasKeyDown(event: KeyboardEvent) {
		// Don't intercept if we're editing text
		if (selection.editingNodeId || selection.editingEdgeId) return;

		if (event.key === 'Delete' || event.key === 'Backspace') {
			// Delete selected elements (single or multi)
			if (selection.selectedNodeIds.size > 0 || selection.selectedEdgeIds.size > 0) {
				// Delete all multi-selected items
				selection.selectedNodeIds.forEach((nodeId) => {
					handleDelete(nodeId, null);
				});
				selection.selectedEdgeIds.forEach((edgeId) => {
					handleDelete(null, edgeId);
				});
				interactionManager.clearSelection();
				event.preventDefault();
			} else if (selection.selectedNodeId || selection.selectedEdgeId) {
				// Delete single selected item
				handleDelete(selection.selectedNodeId, selection.selectedEdgeId);
				interactionManager.clearSelection();
				event.preventDefault();
			}
		} else if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
			// Copy selected elements
			clipboardManager.copy(
				svgContainer,
				selection.selectedNodeId,
				selection.selectedEdgeId,
				selection.selectedNodeIds,
				selection.selectedEdgeIds
			);
			event.preventDefault();
		} else if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
			// Paste clipboard contents
			clipboardManager.paste(handleInsertShape);
			event.preventDefault();
		} else if ((event.ctrlKey || event.metaKey) && event.key === 'x') {
			// Cut selected elements
			clipboardManager.cut(
				svgContainer,
				selection.selectedNodeId,
				selection.selectedEdgeId,
				selection.selectedNodeIds,
				selection.selectedEdgeIds
			);
			interactionManager.clearSelection();
			event.preventDefault();
		} else if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
			// Select all elements
			selection.selectAll(svgContainer);
			event.preventDefault();
		}
	}

	// Handle edit input key press
	function handleEditKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			// Save the edit
			if (selection.editingNodeId) {
				handleEdit(selection.editingNodeId, 'label', selection.editingLabel);
			} else if (selection.editingEdgeId) {
				// For edges, we don't have location info yet (could be added later)
				handleEdit(selection.editingEdgeId, 'edgeLabel', selection.editingLabel);
			}
			selection.cancelLabelEdit();
		} else if (event.key === 'Escape') {
			// Cancel the edit
			selection.cancelLabelEdit();
		}
	}

	// Pan controls and lasso selection
	function handleMouseDown(e: MouseEvent) {
		// Don't start panning/lasso if we're editing
		if (selection.editingNodeId || selection.editingEdgeId) return;

		// Don't start lasso/pan if clicking on an element (let the element click handler deal with it)
		const target = e.target as HTMLElement;
		if (target.closest('[data-node-id], [data-edge-id]')) {
			return;
		}

		if (e.button === 0) {
			if (!svgContainer) return;
			const rect = svgContainer.getBoundingClientRect();
			const clientX = e.clientX - rect.left;
			const clientY = e.clientY - rect.top;

			// Ctrl+Drag for lasso selection (pending until drag threshold)
			if (e.ctrlKey || e.metaKey) {
				selection.startLasso(clientX, clientY);
			} else {
				// Regular panning
				viewport.startPan(e.clientX, e.clientY);
			}
		}
	}

	function handleMouseMove(e: MouseEvent) {
		if (!svgContainer) return;

		const rect = svgContainer.getBoundingClientRect();
		viewport.updateMousePosition(e.clientX, e.clientY, rect);

		if (selection.isLassoPending || selection.isLassoActive) {
			selection.updateLasso(viewport.mouseX, viewport.mouseY);
		} else if (viewport.isPanning) {
			// Handle canvas panning
			viewport.updatePan(e.clientX, e.clientY);
		}
	}

	function handleMouseUp(e: MouseEvent) {
		if (!svgContainer) return;

		if (selection.isLassoActive) {
			// Complete lasso selection
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

	// Drag-and-drop handlers for shapes from toolbox
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

		// Insert the shape code
		handleInsertShape(shapeCode);
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
		class="relative flex-1 overflow-hidden bg-neutral-50"
		bind:this={svgContainer}
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={handleMouseUp}
		onmouseleave={handleMouseUp}
		onwheel={handleWheel}
		onclick={handleCanvasClick}
		ondragover={handleDragOver}
		ondrop={handleDrop}
		onkeydown={handleCanvasKeyDown}
		tabindex="0"
		style="cursor: {viewport.isPanning
			? 'grabbing'
			: selection.editingNodeId || selection.editingEdgeId
				? 'default'
				: 'grab'}; outline: none;"
	>
		<!-- Floating Toolbar at Top Center -->
		{#if selection.selectedNodeId || selection.selectedEdgeId}
			<div class="floating-toolbar">
				<button
					onclick={() => {
						// Extract current styles from selected element and update styleState
						const elementId = selection.selectedNodeId || selection.selectedEdgeId;
						const profile = diagramState.profile as any;
						if (elementId && profile) {
							const element =
								profile.nodes?.find((n: any) => n.id === elementId) ||
								profile.edges?.find(
									(e: any) => e.id === elementId || `${e.from}-${e.to}` === elementId
								);
							if (element?.properties) {
								styleState.setStyles({
									fill: element.properties.fillColor,
									stroke: element.properties.strokeColor,
									strokeWidth: element.properties.strokeWidth || 1,
									opacity: element.properties.opacity || 1,
									fontSize: element.properties.textSize,
									fontFamily: element.properties.fontFamily,
									color: element.properties.textColor
								});
							}
						}
						styleState.toggle();
					}}
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

		<!-- Label Edit Input -->
		{#if (selection.editingNodeId || selection.editingEdgeId) && selection.editInputPosition}
			<input
				type="text"
				bind:this={editInputElement}
				bind:value={selection.editingLabel}
				onkeydown={handleEditKeyPress}
				class="edit-input"
				style="left: {selection.editInputPosition.x}px; top: {selection.editInputPosition.y}px;"
				autofocus
			/>
		{/if}

		{#if styleState.isVisible}
			<StylePanel
				selectedIds={(() => {
					const ids = new Set<string>();
					if (selection.selectedNodeId) ids.add(selection.selectedNodeId);
					if (selection.selectedEdgeId) ids.add(selection.selectedEdgeId);
					selection.selectedNodeIds.forEach((id) => ids.add(id));
					selection.selectedEdgeIds.forEach((id) => ids.add(id));
					return ids;
				})()}
				currentStyles={styleState.currentStyles}
				hasMixedValues={styleState.hasMixedValues}
				onClose={() => styleState.hide()}
				onStyleChange={(property, value) => {
					// Update styleState
					styleState.setStyle(property, value);

					// Map StylePanel property names to DSL property names
					const propertyMap: Record<string, string> = {
						fill: 'fillColor',
						stroke: 'strokeColor',
						strokeWidth: 'strokeWidth',
						fontSize: 'fontSize',
						fontFamily: 'fontFamily',
						fontWeight: 'fontWeight',
						opacity: 'opacity'
					};

					const dslProperty = propertyMap[property] || property;

					// Apply to all selected elements
					const selectedIds = [
						...(selection.selectedNodeId ? [selection.selectedNodeId] : []),
						...(selection.selectedEdgeId ? [selection.selectedEdgeId] : []),
						...Array.from(selection.selectedNodeIds),
						...Array.from(selection.selectedEdgeIds)
					];

					selectedIds.forEach((targetId) => {
						handleEdit(targetId, dslProperty, value);
					});
				}}
				onResetStyles={() => {
					// Get all selected element IDs
					const selectedIds = [
						...(selection.selectedNodeId ? [selection.selectedNodeId] : []),
						...(selection.selectedEdgeId ? [selection.selectedEdgeId] : []),
						...Array.from(selection.selectedNodeIds),
						...Array.from(selection.selectedEdgeIds)
					];

					// Call centralized action
					handleResetStyles(selectedIds); // Clear styleState
					styleState.setStyles({});
				}}
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
				<div class="rounded-lg border border-neutral-300 bg-white p-4 shadow-sm">
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
