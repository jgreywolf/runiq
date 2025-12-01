<script lang="ts">
	import { onMount, tick, untrack } from 'svelte';
	import { type NodeLocation } from '@runiq/parser-dsl';
	import { Badge } from '$lib/components/ui/badge';
	import Icon from '@iconify/svelte';
	import StylePanel from './visual-canvas/StylePanel.svelte';
	import {
		renderDiagram as renderDiagramUtil,
		attachInteractiveHandlers as attachHandlers,
		updateElementStyles,
		type RenderResult
	} from './visual-canvas/renderingUtils';
	import {
		handleElementMouseEnter,
		handleElementMouseLeave,
		handleElementClick,
		handleElementDoubleClick,
		handlePanStart,
		handlePan,
		handlePanEnd,
		handleZoom,
		handleLassoStart,
		handleLassoDrag,
		handleLassoEnd,
		type MouseHandlerContext,
		type MouseHandlerCallbacks
	} from './visual-canvas/mouseHandlers';
	import { SelectionState } from './visual-canvas/SelectionState.svelte';
	import { ViewportState } from './visual-canvas/ViewportState.svelte';

	let diagramDataId = 'runiq-diagram';

	// Props
	interface Props {
		code: string;
		dataContent?: string;
		layoutEngine?: string;
		onparse?: (success: boolean, errors: string[]) => void;
		onselect?: (nodeId: string | null, edgeId: string | null) => void;
		onedit?: (nodeId: string, property: string, value: any, location?: NodeLocation) => void;
		oninsertshape?: (shapeCode: string) => void;
		oninsertedge?: (fromNodeId: string, toNodeId: string) => void;
		ondelete?: (nodeId: string | null, edgeId: string | null) => void;
	}

	let {
		code = '',
		dataContent = '',
		layoutEngine = 'elk',
		onparse,
		onselect,
		onedit,
		oninsertshape,
		oninsertedge,
		ondelete
	}: Props = $props();

	let svgOutput = $state('');
	let errors = $state<string[]>([]);
	let warnings = $state<string[]>([]);
	let isRendering = $state(false);
	let parseTime = $state(0);
	let renderTime = $state(0);

	// DOM element references
	let editInputElement = $state<HTMLInputElement | null>(null);
	let svgContainer = $state<HTMLDivElement | null>(null);

	// Selection state managed by SelectionState class
	const selection = new SelectionState({
		onSelectionChange: (nodeId, edgeId) => {
			onselect?.(nodeId, edgeId);
		}
	});

	// Viewport state managed by ViewportState class
	const viewport = new ViewportState({
		minScale: 0.1,
		maxScale: 5
	});

	// Style editing state
	let showStylePanel = $state(false);
	let styleBackground = $state<string>('');
	let styleStroke = $state<string>('');
	let styleFontSize = $state<string>('');
	let styleFontColor = $state<string>('');
	let styleShadow = $state<boolean>(false);
	let styleStrokeWidth = $state<string>('');
	let styleRouting = $state<string>('');

	// Node locations from parser (for code highlighting)
	let nodeLocations = $state<Map<string, NodeLocation>>(new Map());

	// Store the parsed profile for accessing node/edge properties
	let currentProfile = $state<any>(null);

	// Clipboard state for copy/paste
	interface ClipboardItem {
		type: 'node' | 'edge';
		id: string;
		data: any;
	}
	let clipboard = $state<ClipboardItem[]>([]);

	// Effect to select all text when editing starts
	$effect(() => {
		if (selection.editInputPosition && (selection.editingNodeId || selection.editingEdgeId)) {
			const input = document.querySelector('.edit-input') as HTMLInputElement;
			if (input) {
				input.select();
			}
		}
	});

	// Effect to attach interactive handlers when SVG output changes
	$effect(() => {
		if (svgOutput) {
			// Wait for Svelte to update the DOM, then attach handlers
			tick().then(() => {
				attachInteractiveHandlers();
			});
		}
	});

	// Effect to load style values when selection changes
	$effect(() => {
		const elementId = selection.primarySelectedId;
		if (!elementId || !currentProfile) {
			return;
		}

		// Find the element in the profile
		let element: any = null;

		// Try to find as a node
		if (currentProfile.nodes) {
			element = currentProfile.nodes.find((n: any) => n.id === elementId);
		}

		// If not found, try to find as an edge
		if (!element && currentProfile.edges) {
			element = currentProfile.edges.find((e: any) => {
				// Edge ID might be "from-to" format, possibly with suffix like "from-to-1" or "from-to-2"
				const edgeId = `${e.from}-${e.to}`;

				// Direct match
				if (edgeId === elementId || e.id === elementId) {
					return true;
				}

				// Match with suffix stripped (e.g., "decision-process2-2" -> "decision-process2")
				if (elementId.startsWith(edgeId + '-')) {
					return true;
				}

				return false;
			});
		}

		if (element) {
			// Load current style values from node.data or edge properties
			// For nodes, properties are in node.data: fillColor, textColor, strokeColor, strokeWidth, fontSize
			// For edges, properties are directly on edge: strokeColor, strokeWidth, routing
			if (element.data) {
				// Node properties
				styleBackground = element.data.fillColor || '';
				styleStroke = element.data.strokeColor || '';
				styleStrokeWidth = element.data.strokeWidth ? String(element.data.strokeWidth) : '';
				styleFontSize = element.data.fontSize ? String(element.data.fontSize) : '';
				styleFontColor = element.data.textColor || '';
				styleShadow = element.data.shadow === true || element.data.shadow === 'true';
				styleRouting = '';
			} else {
				// Edge properties - check both top-level and data object
				styleBackground = '';
				styleStroke = element.strokeColor || element.data?.strokeColor || '';
				styleStrokeWidth = element.strokeWidth
					? String(element.strokeWidth)
					: element.data?.strokeWidth
						? String(element.data.strokeWidth)
						: '';
				styleFontSize = '';
				styleFontColor = '';
				styleShadow = false;
				styleRouting = element.routing || element.data?.routing || '';
			}
		} else {
			// Reset to defaults if element not found
			styleBackground = '';
			styleStroke = '';
			styleStrokeWidth = '';
			styleFontSize = '';
			styleFontColor = '';
			styleFontColor = '';
			styleShadow = false;
		}
	});

	function getDiagramSvg() {
		return document.querySelector<SVGSVGElement>(`[data-id="${diagramDataId}"]`);
	}

	let lastCode = '';
	let lastDataContent = '';

	// Debounce timer
	let debounceTimer: ReturnType<typeof setTimeout>;

	// Watch for code or data changes with debounce
	$effect(() => {
		if (code !== lastCode || dataContent !== lastDataContent) {
			lastCode = code;
			lastDataContent = dataContent;
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				renderDiagram(code);
			}, 300);
		}
	});

	async function renderDiagram(dslCode: string) {
		if (!dslCode.trim()) {
			svgOutput = '';
			errors = [];
			warnings = [];
			parseTime = 0;
			renderTime = 0;
			if (onparse) onparse(true, []);
			return;
		}

		isRendering = true;
		errors = [];
		warnings = [];

		try {
			const result = await renderDiagramUtil(dslCode, dataContent, layoutEngine);

			svgOutput = result.svg;
			errors = result.errors;
			warnings = result.warnings;
			parseTime = result.parseTime;
			renderTime = result.renderTime;

			if (result.nodeLocations) {
				nodeLocations = result.nodeLocations;
			}

			if (result.profile) {
				currentProfile = result.profile;
			}

			isRendering = false;
			if (onparse) {
				onparse(result.success, result.errors);
			}
		} catch (error) {
			errors = [error instanceof Error ? error.message : 'Unknown error'];
			svgOutput = '';
			isRendering = false;
			if (onparse) {
				onparse(false, errors);
			}
		}
	}

	// Attach interactive event handlers to rendered SVG elements
	function attachInteractiveHandlers() {
		if (!svgContainer) return;

		// Find the diagram SVG (not the icon SVGs in buttons)
		let svgElement: SVGSVGElement | null = getDiagramSvg();
		if (!svgElement) return;

		// Add hover handlers to all nodes, edges, and containers
		const interactiveElements = svgElement.querySelectorAll(
			'[data-node-id], [data-edge-id], [data-container-id]'
		);

		interactiveElements.forEach((element) => {
			// Remove existing listeners to avoid duplicates
			element.removeEventListener('mouseenter', onElementMouseEnter as any);
			element.removeEventListener('mouseleave', onElementMouseLeave as any);
			element.removeEventListener('click', onElementClick as any);
			element.removeEventListener('dblclick', onElementDoubleClick as any);

			// Add new listeners
			element.addEventListener('mouseenter', onElementMouseEnter as any);
			element.addEventListener('mouseleave', onElementMouseLeave as any);
			element.addEventListener('click', onElementClick as any);
			element.addEventListener('dblclick', onElementDoubleClick as any);
		});

		// Restore selection state after re-rendering
		restoreSelection();
	}

	// Restore selection styling after SVG re-render
	function restoreSelection() {
		if (!svgContainer) return;

		let svgElement: SVGSVGElement | null = getDiagramSvg();
		if (!svgElement) return;

		// Re-apply selection to the selected node or edge
		if (selection.selectedNodeId) {
			const nodeElement = svgElement.querySelector(`[data-node-id="${selection.selectedNodeId}"]`);
			if (nodeElement) {
				nodeElement.classList.add('runiq-selected');
			}
		}

		if (selection.selectedEdgeId) {
			const edgeElement = svgElement.querySelector(`[data-edge-id="${selection.selectedEdgeId}"]`);
			if (edgeElement) {
				edgeElement.classList.add('runiq-selected');
			}
		}
	}

	// Helper to build MouseHandlerContext from current state
	function buildMouseContext(): MouseHandlerContext {
		return {
			svgContainer,
			scale: viewport.scale,
			translateX: viewport.translateX,
			translateY: viewport.translateY,
			isDragging: viewport.isDragging,
			dragStart: viewport.dragStart,
			selectedNodeId: selection.selectedNodeId,
			selectedEdgeId: selection.selectedEdgeId,
			selectedNodeIds: selection.selectedNodeIds,
			selectedEdgeIds: selection.selectedEdgeIds,
			hoveredElementId: selection.hoveredElementId,
			isLassoActive: selection.isLassoActive,
			isLassoPending: selection.isLassoPending,
			lassoStartX: selection.lassoStartX,
			lassoStartY: selection.lassoStartY,
			lassoEndX: selection.lassoEndX,
			lassoEndY: selection.lassoEndY
		};
	}

	// Helper to build MouseHandlerCallbacks
	function buildMouseCallbacks(): MouseHandlerCallbacks {
		return {
			onselect,
			clearSelection,
			updateMultiSelection,
			startLabelEdit
		};
	}

	// Wrappers for event handlers from mouseHandlers.ts
	function onElementMouseEnter(event: Event) {
		const context = buildMouseContext();
		handleElementMouseEnter(event, context);
		selection.hoveredElementId = context.hoveredElementId;
	}

	function onElementMouseLeave(event: Event) {
		const context = buildMouseContext();
		handleElementMouseLeave(event, context);
		selection.hoveredElementId = context.hoveredElementId;
	}

	function onElementClick(event: Event) {
		const context = buildMouseContext();
		const callbacks = buildMouseCallbacks();

		handleElementClick(event, context, callbacks);

		// Update selection state from context
		if (context.selectedNodeId !== selection.selectedNodeId) {
			if (context.selectedNodeId) {
				selection.selectNode(context.selectedNodeId);
			}
		}
		if (context.selectedEdgeId !== selection.selectedEdgeId) {
			if (context.selectedEdgeId) {
				selection.selectEdge(context.selectedEdgeId);
			}
		}
	}

	function onElementDoubleClick(event: Event) {
		const context = buildMouseContext();
		const callbacks = buildMouseCallbacks();
		handleElementDoubleClick(event, context, callbacks);
	}

	// Update visual styling for multi-selected elements
	function updateMultiSelection() {
		selection.updateVisualSelection(svgContainer);
	}

	// Update visual selection (alias for consistency)
	function updateVisualSelection() {
		selection.updateVisualSelection(svgContainer);
	}

	// Start label editing
	function startLabelEdit(nodeId: string | null, edgeId: string | null) {
		if (!svgContainer) return;

		const elementId = nodeId || edgeId;
		if (!elementId) return;

		const svgElement = svgContainer.querySelector('svg');
		if (!svgElement) return;

		const selector = nodeId ? `[data-node-id="${nodeId}"]` : `[data-edge-id="${edgeId}"]`;
		const element = svgElement.querySelector(selector);
		if (!element) return;

		const textElement = element.querySelector('text');
		if (!textElement) return;

		// Get the current label text
		const currentLabel = (textElement.textContent || '').trim();

		// Get the position of the text element in screen space
		const textRect = textElement.getBoundingClientRect();
		const containerRect = svgContainer.getBoundingClientRect();

		// Calculate position relative to container
		const inputX = textRect.left - containerRect.left;
		const inputY = textRect.top - containerRect.top;

		// Start editing mode
		selection.startLabelEdit(nodeId, edgeId, currentLabel, { x: inputX, y: inputY });
	}

	// Apply style to selected node or edge
	function applyStyle(property: string, value: any) {
		const elementId = selection.primarySelectedId;
		if (!elementId || !onedit) return;

		// Map the UI property to the DSL property name
		// For nodes: fillColor, textColor, strokeColor, strokeWidth, fontSize
		// For edges: strokeColor, strokeWidth, routing
		let dslProperty: string;
		switch (property) {
			case 'background':
				dslProperty = 'fillColor'; // background color
				break;
			case 'stroke':
				dslProperty = 'strokeColor'; // border/stroke color
				break;
			case 'strokeWidth':
				dslProperty = 'strokeWidth';
				value = value ? parseInt(value) : undefined;
				break;
			case 'fontSize':
				dslProperty = 'fontSize';
				break;
			case 'fontColor':
				dslProperty = 'textColor'; // text color
				break;
			case 'shadow':
				dslProperty = 'shadow';
				value = value ? 'true' : 'false';
				break;
			case 'routing':
				dslProperty = 'routing';
				break;
			default:
				return;
		}

		onedit(elementId, dslProperty, value);
	}

	// Update visual styling for multi-selected elements
	function clearSelection() {
		selection.clearSelection();
		updateVisualSelection();
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

			clearSelection();
			if (onselect) onselect(null, null);
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
					if (ondelete) ondelete(nodeId, null);
				});
				selection.selectedEdgeIds.forEach((edgeId) => {
					if (ondelete) ondelete(null, edgeId);
				});
				clearSelection();
				event.preventDefault();
			} else if ((selection.selectedNodeId || selection.selectedEdgeId) && ondelete) {
				// Delete single selected item
				ondelete(selection.selectedNodeId, selection.selectedEdgeId);
				clearSelection();
				event.preventDefault();
			}
		} else if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
			// Copy selected elements
			handleCopy();
			event.preventDefault();
		} else if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
			// Paste clipboard contents
			handlePaste();
			event.preventDefault();
		} else if ((event.ctrlKey || event.metaKey) && event.key === 'x') {
			// Cut selected elements
			handleCut();
			event.preventDefault();
		} else if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
			// Select all elements
			handleSelectAll();
			event.preventDefault();
		}
	}

	// Copy selected elements to clipboard
	function handleCopy() {
		if (!svgContainer) return;

		const svgElement = svgContainer.querySelector('svg');
		if (!svgElement) return;

		clipboard = [];

		// Copy multi-selected items
		if (selection.selectedNodeIds.size > 0 || selection.selectedEdgeIds.size > 0) {
			selection.selectedNodeIds.forEach((nodeId) => {
				const element = svgElement.querySelector(`[data-node-id="${nodeId}"]`);
				if (element) {
					clipboard.push({
						type: 'node',
						id: nodeId,
						data: extractElementData(element, 'node')
					});
				}
			});

			selection.selectedEdgeIds.forEach((edgeId) => {
				const element = svgElement.querySelector(`[data-edge-id="${edgeId}"]`);
				if (element) {
					clipboard.push({
						type: 'edge',
						id: edgeId,
						data: extractElementData(element, 'edge')
					});
				}
			});
		}
		// Copy single selected item
		else if (selection.selectedNodeId) {
			const element = svgElement.querySelector(`[data-node-id="${selection.selectedNodeId}"]`);
			if (element) {
				clipboard.push({
					type: 'node',
					id: selection.selectedNodeId,
					data: extractElementData(element, 'node')
				});
			}
		} else if (selection.selectedEdgeId) {
			const element = svgElement.querySelector(`[data-edge-id="${selection.selectedEdgeId}"]`);
			if (element) {
				clipboard.push({
					type: 'edge',
					id: selection.selectedEdgeId,
					data: extractElementData(element, 'edge')
				});
			}
		}
	}

	// Cut selected elements (copy + delete)
	function handleCut() {
		handleCopy();

		// Delete after copying
		if (selection.selectedNodeIds.size > 0 || selection.selectedEdgeIds.size > 0) {
			selection.selectedNodeIds.forEach((nodeId) => {
				if (ondelete) ondelete(nodeId, null);
			});
			selection.selectedEdgeIds.forEach((edgeId) => {
				if (ondelete) ondelete(null, edgeId);
			});
		} else if (selection.selectedNodeId || selection.selectedEdgeId) {
			if (ondelete) ondelete(selection.selectedNodeId, selection.selectedEdgeId);
		}

		clearSelection();
	}

	// Paste clipboard contents
	function handlePaste() {
		if (clipboard.length === 0 || !oninsertshape) return;

		// Generate DSL code for pasted elements with new IDs
		clipboard.forEach((item, index) => {
			const newId = `${item.id}_copy_${Date.now()}_${index}`;
			const shapeCode = generateShapeCode(item, newId);
			if (shapeCode && oninsertshape) {
				oninsertshape(shapeCode);
			}
		});
	}

	// Select all elements in the diagram
	function handleSelectAll() {
		selection.selectAll(svgContainer);
		updateMultiSelection();
	}

	// Extract element data from SVG element
	function extractElementData(element: Element, type: 'node' | 'edge'): any {
		// This is a simplified version - in a real implementation,
		// you would extract all the node/edge properties from the AST
		return {
			id: element.getAttribute(`data-${type}-id`)
			// Additional properties would be extracted here
		};
	}

	// Generate DSL code for a clipboard item
	function generateShapeCode(item: ClipboardItem, newId: string): string {
		// This is a simplified version - in a real implementation,
		// you would generate proper DSL syntax based on the element's properties
		if (item.type === 'node') {
			return `shape ${newId} as @rectangle label:"Copy of ${item.id}"`;
		} else {
			return `edge ${item.id} -> ${newId}`;
		}
	}

	// Handle edit input key press
	function handleEditKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			// Save the edit
			if (onedit) {
				if (selection.editingNodeId) {
					const location = nodeLocations.get(selection.editingNodeId);
					onedit(selection.editingNodeId, 'label', selection.editingLabel, location);
				} else if (selection.editingEdgeId) {
					// For edges, we don't have location info yet (could be added later)
					onedit(selection.editingEdgeId, 'edgeLabel', selection.editingLabel);
				}
			}
			cancelEdit();
		} else if (event.key === 'Escape') {
			// Cancel the edit
			cancelEdit();
		}
	}

	// Cancel label editing
	function cancelEdit() {
		selection.cancelLabelEdit();
	}

	// Zoom controls
	function zoomIn() {
		viewport.zoomIn();
	}

	function zoomOut() {
		viewport.zoomOut();
	}

	function resetZoom() {
		viewport.resetZoom();
	}

	function fitToScreen() {
		if (!svgContainer || !svgOutput) return;

		// Reset pan
		viewport.translateX = 0;
		viewport.translateY = 0;

		const parser = new DOMParser();
		const svgDoc = parser.parseFromString(svgOutput, 'image/svg+xml');
		const svgElement = svgDoc.querySelector('svg');

		if (!svgElement) return;

		let svgWidth = 0;
		let svgHeight = 0;

		const viewBox = svgElement.getAttribute('viewBox');
		if (viewBox) {
			const [, , width, height] = viewBox.split(' ').map(Number);
			svgWidth = width;
			svgHeight = height;
		} else {
			svgWidth = parseFloat(svgElement.getAttribute('width') || '0');
			svgHeight = parseFloat(svgElement.getAttribute('height') || '0');
		}

		if (svgWidth === 0 || svgHeight === 0) {
			viewport.scale = 0.9;
			return;
		}

		const containerWidth = svgContainer.clientWidth;
		const containerHeight = svgContainer.clientHeight;

		viewport.fitToScreen(svgWidth, svgHeight, containerWidth, containerHeight);
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
			updateMultiSelection();
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

		if (!e.dataTransfer || !oninsertshape) return;

		const shapeCode = e.dataTransfer.getData('application/x-runiq-shape');
		if (!shapeCode) return;

		// Insert the shape code
		oninsertshape(shapeCode);
	}

	onMount(() => {
		if (code) {
			renderDiagram(code);
		}
	});
</script>

<div class="flex h-full flex-col">
	<!-- Toolbar -->
	<div class="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2">
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
			{:else if errors.length > 0}
				<Badge variant="destructive" class="gap-1">
					<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
					{errors.length} Error{errors.length === 1 ? '' : 's'}
				</Badge>
			{:else if warnings.length > 0}
				<Badge variant="outline" class="gap-1 border-warning text-warning">
					<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
					{warnings.length} Warning{warnings.length === 1 ? '' : 's'}
				</Badge>
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

		<!-- Zoom Controls -->
		<div class="flex items-center gap-1">
			<button
				onclick={zoomOut}
				class="rounded p-1 text-neutral-600 hover:bg-neutral-100"
				title="Zoom Out"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
					/>
				</svg>
			</button>

			<span class="min-w-[60px] text-center text-xs text-neutral-600">
				{viewport.zoomPercentage}%
			</span>

			<button
				onclick={zoomIn}
				class="rounded p-1 text-neutral-600 hover:bg-neutral-100"
				title="Zoom In"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
					/>
				</svg>
			</button>

			<button
				onclick={resetZoom}
				class="rounded px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100"
				title="Reset Zoom"
			>
				Reset
			</button>

			<button
				onclick={fitToScreen}
				class="rounded px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100"
				title="Fit to Screen"
			>
				Fit
			</button>
		</div>
	</div>

	<!-- Canvas -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class="relative flex-1 bg-neutral-50"
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
					onclick={() => (showStylePanel = !showStylePanel)}
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

		<!-- Style Editing Panel -->
		{#if showStylePanel && (selection.selectedNodeId || selection.selectedEdgeId)}
			<div class="style-panel" onclick={(e) => e.stopPropagation()}>
				<div class="style-panel-header">
					<h3 class="text-sm font-semibold">
						Style {selection.selectedNodeId ? 'Node' : 'Edge'}
					</h3>
					<button
						onclick={(e) => {
							e.stopPropagation();
							showStylePanel = false;
						}}
						class="close-button"
						title="Close"
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<div class="style-panel-body">
					<!-- Background Color (nodes only) -->
					{#if selection.selectedNodeId}
						<div class="style-field">
							<label for="style-background">Background:</label>
							<div class="color-picker-wrapper">
								<input
									id="style-background"
									type="color"
									bind:value={styleBackground}
									onchange={() => applyStyle('background', styleBackground)}
									class="hidden-color-input"
								/>
								<button
									type="button"
									onclick={() => document.getElementById('style-background')?.click()}
									class="color-swatch-button"
									style="background-color: {styleBackground || '#ffffff'}"
									title="Click to change color"
								>
									<span class="sr-only">Pick color</span>
								</button>
							</div>
							<input
								type="text"
								bind:value={styleBackground}
								onchange={() => applyStyle('background', styleBackground)}
								placeholder="#FFFFFF"
								class="style-text-input"
							/>
						</div>
					{/if}

					<!-- Stroke Color -->
					<div class="style-field">
						<label for="style-stroke">Stroke:</label>
						<div class="color-picker-wrapper">
							<input
								id="style-stroke"
								type="color"
								bind:value={styleStroke}
								onchange={() => applyStyle('stroke', styleStroke)}
								class="hidden-color-input"
							/>
							<button
								type="button"
								onclick={() => document.getElementById('style-stroke')?.click()}
								class="color-swatch-button"
								style="background-color: {styleStroke || '#000000'}"
								title="Click to change color"
							>
								<span class="sr-only">Pick color</span>
							</button>
						</div>
						<input
							type="text"
							bind:value={styleStroke}
							onchange={() => applyStyle('stroke', styleStroke)}
							placeholder="#000000"
							class="style-text-input"
						/>
					</div>

					<!-- Stroke Width -->
					<div class="style-field">
						<label for="style-stroke-width">Stroke Width:</label>
						<input
							id="style-stroke-width"
							type="number"
							min="1"
							max="20"
							step="1"
							bind:value={styleStrokeWidth}
							onchange={(e) => {
								const target = e.target as HTMLInputElement;
								const numValue = parseInt(target.value) || 2;
								styleStrokeWidth = String(numValue);
								applyStyle('strokeWidth', numValue);
							}}
							placeholder="2"
							class="style-number-input"
						/>
						<span class="text-xs text-neutral-500">px</span>
					</div>
					{#if selection.selectedEdgeId}
						<!-- Edge Routing Style -->
						<div class="style-field">
							<label for="style-routing">Routing:</label>
							<select
								id="style-routing"
								bind:value={styleRouting}
								onchange={() => applyStyle('routing', styleRouting)}
								class="style-select-input"
							>
								<option value="">Default</option>
								<option value="orthogonal">Orthogonal</option>
								<option value="polyline">Polyline</option>
								<option value="splines">Curved (Splines)</option>
								<option value="straight">Straight</option>
							</select>
						</div>
					{/if}

					{#if selection.selectedNodeId}
						<!-- Font Size -->
						<div class="style-field">
							<label for="style-font-size">Font Size:</label>
							<input
								id="style-font-size"
								type="number"
								bind:value={styleFontSize}
								onchange={() => applyStyle('fontSize', styleFontSize)}
								placeholder="14"
								class="style-number-input"
							/>
							<span class="text-xs text-neutral-500">px</span>
						</div>

						<!-- Font Color -->
						<div class="style-field">
							<label for="style-font-color">Font Color:</label>
							<div class="color-picker-wrapper">
								<input
									id="style-font-color"
									type="color"
									bind:value={styleFontColor}
									onchange={() => applyStyle('fontColor', styleFontColor)}
									class="hidden-color-input"
								/>
								<button
									type="button"
									onclick={() => document.getElementById('style-font-color')?.click()}
									class="color-swatch-button"
									style="background-color: {styleFontColor || '#000000'}"
									title="Click to change color"
								>
									<span class="sr-only">Pick color</span>
								</button>
							</div>
							<input
								type="text"
								bind:value={styleFontColor}
								onchange={() => applyStyle('fontColor', styleFontColor)}
								placeholder="#000000"
								class="style-text-input"
							/>
						</div>

						<!-- Shadow -->
						<div class="style-field">
							<label for="style-shadow">Shadow:</label>
							<input
								id="style-shadow"
								type="checkbox"
								bind:checked={styleShadow}
								onchange={() => applyStyle('shadow', styleShadow)}
								class="style-checkbox"
							/>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		{#if errors.length > 0}
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
						{#each errors as error}
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
