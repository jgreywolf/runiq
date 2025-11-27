<script lang="ts">
	import { onMount } from 'svelte';
	import { parse, type NodeLocation } from '@runiq/parser-dsl';
	import { layoutRegistry } from '@runiq/core';
	import {
		renderSvg,
		renderWardleyMap,
		renderSequenceDiagram,
		renderTimeline
	} from '@runiq/renderer-svg';
	import { renderSchematic, renderPID } from '@runiq/renderer-schematic';
	import { Badge } from '$lib/components/ui/badge';
	import Icon from '@iconify/svelte';

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

	// Selection state
	let selectedNodeId = $state<string | null>(null);
	let selectedEdgeId = $state<string | null>(null);
	let selectedNodeIds = $state<Set<string>>(new Set());
	let selectedEdgeIds = $state<Set<string>>(new Set());
	let hoveredElementId = $state<string | null>(null);

	// Lasso selection state
	let lassoStartX = $state(0);
	let lassoStartY = $state(0);
	let lassoEndX = $state(0);
	let lassoEndY = $state(0);
	let isLassoActive = $state(false);
	let isLassoPending = $state(false);
	const LASSO_THRESHOLD = 5; // pixels to drag before activating lasso

	// Edge creation state (Shift+Click workflow)
	let edgeCreationMode = $state(false);
	let edgeCreationStartNode = $state<string | null>(null);

	// Label editing state
	let editingNodeId = $state<string | null>(null);
	let editingEdgeId = $state<string | null>(null);
	let editingLabel = $state<string>('');
	let editInputPosition = $state<{ x: number; y: number } | null>(null);
	let editInputElement = $state<HTMLInputElement | null>(null);

	// Style editing state
	let showStylePanel = $state(false);
	let styleBackground = $state<string>('');
	let styleStroke = $state<string>('');
	let styleFontSize = $state<string>('');
	let styleFontColor = $state<string>('');
	let styleShadow = $state<boolean>(false);

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
		if (editInputElement && (editingNodeId || editingEdgeId)) {
			editInputElement.select();
		}
	});

	// Effect to load style values when selection changes
	$effect(() => {
		const elementId = selectedNodeId || selectedEdgeId;
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
				// Edge ID might be "from-to" format
				const edgeId = `${e.from}-${e.to}`;
				return edgeId === elementId || e.id === elementId;
			});
		}

		if (element) {
			// Load current style values from node.data or edge properties
			// For nodes, properties are in node.data: fillColor, textColor, strokeColor, strokeWidth, fontSize
			// For edges, properties are directly on edge: strokeColor, strokeWidth
			if (element.data) {
				// Node properties
				styleBackground = element.data.fillColor || '';
				styleStroke = element.data.strokeColor || '';
				styleFontSize = element.data.fontSize ? String(element.data.fontSize) : '';
				styleFontColor = element.data.textColor || '';
				styleShadow = element.data.shadow === true || element.data.shadow === 'true';
			} else {
				// Edge properties (directly on edge)
				styleBackground = '';
				styleStroke = element.strokeColor || '';
				styleFontSize = '';
				styleFontColor = '';
				styleShadow = false;
			}
		} else {
			// Reset to defaults if element not found
			styleBackground = '';
			styleStroke = '';
			styleFontSize = '';
			styleFontColor = '';
			styleShadow = false;
		}
	});

	// Export function to get current SVG
	export function getSvg(): string {
		return svgOutput;
	}

	// Export function to check if diagram is valid
	export function hasValidDiagram(): boolean {
		return svgOutput.length > 0 && errors.length === 0;
	}

	// Pan and zoom state
	let scale = $state(1);
	let translateX = $state(0);
	let translateY = $state(0);
	let isDragging = $state(false);
	let dragStartX = $state(0);
	let dragStartY = $state(0);

	// Mouse coordinates for troubleshooting
	let mouseX = $state(0);
	let mouseY = $state(0);
	let svgMouseX = $state(0);
	let svgMouseY = $state(0);

	let svgContainer: HTMLDivElement;
	let lastCode = '';
	let lastDataContent = '';

	// Debounce timer
	let debounceTimer: ReturnType<typeof setTimeout>;

	// Process data content and inject into DSL (same as Preview.svelte)
	function injectDataIntoCode(syntaxCode: string, data: string): string {
		if (!data || !data.trim()) {
			return syntaxCode;
		}

		const trimmedData = data.trim();
		const looksLikeJson = trimmedData.startsWith('{') || trimmedData.startsWith('[');

		let parsedData: any;

		if (looksLikeJson) {
			try {
				parsedData = JSON.parse(trimmedData);
			} catch (e: any) {
				console.error('Failed to parse JSON data:', e);
				return syntaxCode;
			}
		} else {
			const lines = trimmedData
				.split('\n')
				.map((l) => l.trim())
				.filter((l) => l);

			if (lines.length > 0) {
				const headers = lines[0].split(',').map((h) => h.trim());
				const rows = lines.slice(1).map((line) => {
					const values = line.split(',').map((v) => v.trim());
					const obj: any = {};
					headers.forEach((header, i) => {
						const value = values[i];
						obj[header] = isNaN(Number(value)) ? value : Number(value);
					});
					return obj;
				});

				parsedData = { dataset: rows };
			}
		}

		if (!parsedData) {
			return syntaxCode;
		}

		// Inject data into chart shapes (same logic as Preview.svelte)
		let modifiedCode = syntaxCode;

		const chartShapePattern =
			/shape\s+(\w+)\s+as\s+@(lineChart|radarChart|pieChart|barChart|pyramidShape|venn\dShape|sankeyChart)/g;

		let match;
		const replacements: Array<{ from: number; to: number; replacement: string }> = [];

		while ((match = chartShapePattern.exec(syntaxCode)) !== null) {
			const fullMatch = match[0];
			const shapeId = match[1];
			const shapeType = match[2];
			const matchStart = match.index;

			if (shapeType === 'sankeyChart') {
				continue;
			}

			const afterMatch = syntaxCode.substring(matchStart + fullMatch.length);
			const endMatch = afterMatch.match(/(?:\r?\n|$)/);
			const lineEnd = endMatch
				? matchStart + fullMatch.length + endMatch.index!
				: syntaxCode.length;

			const currentLine = syntaxCode.substring(matchStart, lineEnd);
			const propsMatch = currentLine.match(/as\s+@\w+\s+(.*)$/);
			const existingProps = propsMatch ? propsMatch[1].trim() : '';
			const withoutData = existingProps.replace(/\bdata:\[.*?\]|\bdata:\{.*?\}/g, '').trim();

			let dataToInject: any;

			if (typeof parsedData === 'object' && !Array.isArray(parsedData)) {
				const dataKeys = Object.keys(parsedData);
				if (dataKeys.length > 0) {
					dataToInject = parsedData[dataKeys[0]];
				}
			} else {
				dataToInject = parsedData;
			}

			if (!dataToInject) continue;

			let chartData: any;
			let chartLabels: string[] | null = null;

			if (
				Array.isArray(dataToInject) &&
				dataToInject.length > 0 &&
				typeof dataToInject[0] === 'object'
			) {
				const firstObj = dataToInject[0];
				const keys = Object.keys(firstObj);

				const numericKey = keys.find((k) => typeof firstObj[k] === 'number');
				const labelKey = keys.find((k) => typeof firstObj[k] === 'string');

				if (numericKey) {
					chartData = dataToInject.map((item: any) => item[numericKey]);

					if (labelKey) {
						chartLabels = dataToInject.map((item: any) => item[labelKey]);
					}
				} else {
					chartData = dataToInject;
				}
			} else {
				chartData = dataToInject;
			}

			const dataStr = JSON.stringify(chartData);
			let newProps = withoutData;

			if (chartLabels && chartLabels.length > 0) {
				const labelsStr = JSON.stringify(chartLabels);
				newProps = newProps
					? `${newProps} labels:${labelsStr} data:${dataStr}`
					: `labels:${labelsStr} data:${dataStr}`;
			} else {
				newProps = newProps ? `${newProps} data:${dataStr}` : `data:${dataStr}`;
			}

			const newShapeDecl = `shape ${shapeId} as @${shapeType} ${newProps}`;

			replacements.push({
				from: matchStart,
				to: lineEnd,
				replacement: newShapeDecl
			});
		}

		replacements.reverse().forEach(({ from, to, replacement }) => {
			modifiedCode = modifiedCode.substring(0, from) + replacement + modifiedCode.substring(to);
		});

		return modifiedCode;
	}

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
			const startParse = performance.now();

			const codeWithData = injectDataIntoCode(dslCode, dataContent);
			const parseResult = parse(codeWithData);
			parseTime = Math.round(performance.now() - startParse);

			if (!parseResult.success || !parseResult.document) {
				errors = parseResult.errors;
				svgOutput = '';
				isRendering = false;
				if (onparse) onparse(false, errors);
				return;
			}

			// Store node locations for code highlighting
			if (parseResult.nodeLocations) {
				nodeLocations = parseResult.nodeLocations;
			}

			const profile = parseResult.document.profiles[0];
			if (!profile) {
				errors = ['No profile found in document'];
				svgOutput = '';
				isRendering = false;
				if (onparse) onparse(false, errors);
				return;
			}

			// Store the profile for accessing node/edge properties
			currentProfile = profile;

			// Inject Sankey chart data (same as Preview.svelte)
			if (profile.type === 'diagram' && dataContent) {
				try {
					const data = JSON.parse(dataContent);
					if (profile.nodes) {
						for (const node of profile.nodes) {
							if (node.shape === 'sankeyChart') {
								const dataKeys = Object.keys(data);
								if (dataKeys.length > 0) {
									node.data = data[dataKeys[0]];
								}
							}
						}
					}
				} catch (e) {
					// Ignore JSON parse errors
				}
			}

			const startRender = performance.now();
			let renderResult: { svg: string; warnings: string[] };

			// Handle different profile types (same as Preview.svelte)
			switch (profile.type) {
				case 'electrical':
				case 'pneumatic':
				case 'hydraulic':
					renderResult = renderSchematic(profile as any, {
						gridSize: 50,
						routing: 'orthogonal',
						showNetLabels: true,
						showValues: true,
						showReferences: true
					});
					break;
				case 'wardley':
					renderResult = renderWardleyMap(profile as any, {
						width: 800,
						height: 600,
						showGrid: true,
						showEvolutionLabels: true,
						showValueLabels: true
					});
					break;
				case 'sequence':
					renderResult = renderSequenceDiagram(profile as any, {
						width: 800,
						participantSpacing: 150,
						messageSpacing: 60
					});
					break;
				case 'timeline':
					renderResult = renderTimeline(profile as any, {
						width: 1600,
						height: 500,
						padding: 100,
						showDates: true,
						labelFontSize: 13,
						dateFontSize: 11
					});
					break;
				case 'pid':
					renderResult = renderPID(profile as any, {
						width: 1200,
						height: 800,
						gridSize: 50,
						showGrid: false,
						showTags: true,
						showProperties: true,
						spacing: 180
					});
					break;
				case 'diagram': {
					const diagram = {
						...profile,
						astVersion: parseResult.document.astVersion
					};

					const layoutEng = layoutRegistry.get(layoutEngine);
					if (!layoutEng) {
						errors = [`Unknown layout engine: ${layoutEngine}`];
						isRendering = false;
						return;
					}

					const layout = await layoutEng.layout(diagram);
					renderResult = renderSvg(diagram, layout, { strict: false });
					break;
				}
				default:
					errors = [
						`Profile type '${profile.type}' is not yet supported in the preview.`,
						`Currently 'diagram', 'electrical', 'pneumatic', 'hydraulic', 'sequence', 'timeline', 'wardley', and 'pid' profiles can be rendered.`
					];
					svgOutput = '';
					isRendering = false;
					if (onparse) onparse(false, errors);
					return;
			}

			svgOutput = renderResult.svg;
			warnings = renderResult.warnings;
			renderTime = Math.round(performance.now() - startRender);
			isRendering = false;
			if (onparse) {
				onparse(true, []);
			}

			// After rendering, set up event listeners for interactive elements
			setTimeout(attachInteractiveHandlers, 0);
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

		const svgElement = svgContainer.querySelector('svg');
		if (!svgElement) return;

		// Add hover handlers to all nodes, edges, and containers
		const interactiveElements = svgElement.querySelectorAll(
			'[data-node-id], [data-edge-id], [data-container-id]'
		);

		interactiveElements.forEach((element) => {
			// Remove existing listeners to avoid duplicates
			element.removeEventListener('mouseenter', handleElementMouseEnter as any);
			element.removeEventListener('mouseleave', handleElementMouseLeave as any);
			element.removeEventListener('click', handleElementClick as any);
			element.removeEventListener('dblclick', handleElementDoubleClick as any);

			// Add new listeners
			element.addEventListener('mouseenter', handleElementMouseEnter as any);
			element.addEventListener('mouseleave', handleElementMouseLeave as any);
			element.addEventListener('click', handleElementClick as any);
			element.addEventListener('dblclick', handleElementDoubleClick as any);
		});

		// Restore selection state after re-rendering
		restoreSelection();
	}

	// Restore selection styling after SVG re-render
	function restoreSelection() {
		if (!svgContainer) return;

		const svgElement = svgContainer.querySelector('svg');
		if (!svgElement) return;

		// Re-apply selection to the selected node or edge
		if (selectedNodeId) {
			const nodeElement = svgElement.querySelector(`[data-node-id="${selectedNodeId}"]`);
			if (nodeElement) {
				nodeElement.classList.add('runiq-selected');
				if (edgeCreationMode && edgeCreationStartNode === selectedNodeId) {
					nodeElement.classList.add('runiq-edge-start');
				}
			}
		}

		if (selectedEdgeId) {
			const edgeElement = svgElement.querySelector(`[data-edge-id="${selectedEdgeId}"]`);
			if (edgeElement) {
				edgeElement.classList.add('runiq-selected');
			}
		}
	}

	// Handle element mouse enter (hover)
	function handleElementMouseEnter(event: Event) {
		const target = event.currentTarget as SVGElement;
		const nodeId = target.getAttribute('data-node-id');
		const edgeId = target.getAttribute('data-edge-id');
		const containerId = target.getAttribute('data-container-id');

		hoveredElementId = nodeId || edgeId || containerId || null;

		// Add hover class
		target.classList.add('runiq-hovered');
	}

	// Handle element mouse leave
	function handleElementMouseLeave(event: Event) {
		const target = event.currentTarget as SVGElement;
		hoveredElementId = null;

		// Remove hover class
		target.classList.remove('runiq-hovered');
	}

	// Handle element click (selection and edge creation)
	function handleElementClick(event: Event) {
		event.stopPropagation();
		const target = event.currentTarget as SVGElement;
		const nodeId = target.getAttribute('data-node-id');
		const edgeId = target.getAttribute('data-edge-id');
		const mouseEvent = event as MouseEvent;

		// Handle Ctrl+Click for multi-select
		if ((mouseEvent.ctrlKey || mouseEvent.metaKey) && !mouseEvent.shiftKey) {
			if (nodeId) {
				const newSet = new Set(selectedNodeIds);

				// If we have a single selected node, add it to multi-select first
				if (selectedNodeId && selectedNodeIds.size === 0) {
					newSet.add(selectedNodeId);
				}

				if (newSet.has(nodeId)) {
					newSet.delete(nodeId);
				} else {
					newSet.add(nodeId);
				}

				// Clear single selection
				selectedNodeId = null;
				selectedEdgeId = null;

				selectedNodeIds = newSet;
				updateMultiSelection();
			} else if (edgeId) {
				const newSet = new Set(selectedEdgeIds);

				// If we have a single selected edge, add it to multi-select first
				if (selectedEdgeId && selectedEdgeIds.size === 0) {
					newSet.add(selectedEdgeId);
				}

				if (newSet.has(edgeId)) {
					newSet.delete(edgeId);
				} else {
					newSet.add(edgeId);
				}

				// Clear single selection
				selectedNodeId = null;
				selectedEdgeId = null;

				selectedEdgeIds = newSet;
				updateMultiSelection();
			}
			return;
		}

		// Handle Shift+Click for edge creation (nodes only)
		if (mouseEvent.shiftKey && nodeId) {
			if (!edgeCreationMode) {
				// Start edge creation
				edgeCreationMode = true;
				edgeCreationStartNode = nodeId;
				// Highlight the start node
				clearSelection();
				selectedNodeId = nodeId;
				target.classList.add('runiq-selected', 'runiq-edge-start');
			} else if (edgeCreationStartNode && edgeCreationStartNode !== nodeId) {
				// Complete edge creation
				if (oninsertedge) {
					oninsertedge(edgeCreationStartNode, nodeId);
				}
				// Reset edge creation mode
				cancelEdgeCreation();
			} else {
				// Clicked the same node - cancel
				cancelEdgeCreation();
			}
			return;
		}

		// Normal selection behavior (no modifiers)
		clearSelection();

		if (nodeId) {
			selectedNodeId = nodeId;
			selectedEdgeId = null;
			target.classList.add('runiq-selected');
			if (onselect) onselect(nodeId, null);
		} else if (edgeId) {
			selectedEdgeId = edgeId;
			selectedNodeId = null;
			target.classList.add('runiq-selected');
			if (onselect) onselect(null, edgeId);
		}
	}

	// Update visual styling for multi-selected elements
	function updateMultiSelection() {
		if (!svgContainer) return;

		const svgElement = svgContainer.querySelector('svg');
		if (!svgElement) return;

		// Clear all selection classes first (both single and multi)
		svgElement.querySelectorAll('.runiq-selected, .runiq-multi-selected').forEach((el) => {
			el.classList.remove('runiq-selected', 'runiq-multi-selected');
		});

		// Add multi-selection class to selected nodes
		selectedNodeIds.forEach((nodeId) => {
			const nodeElement = svgElement.querySelector(`[data-node-id="${nodeId}"]`);
			if (nodeElement) {
				nodeElement.classList.add('runiq-multi-selected');
			}
		});

		// Add multi-selection class to selected edges
		selectedEdgeIds.forEach((edgeId) => {
			const edgeElement = svgElement.querySelector(`[data-edge-id="${edgeId}"]`);
			if (edgeElement) {
				edgeElement.classList.add('runiq-multi-selected');
			}
		});
	}

	// Cancel edge creation mode
	function cancelEdgeCreation() {
		edgeCreationMode = false;
		edgeCreationStartNode = null;
		clearSelection();
	}

	// Apply style to selected node or edge
	function applyStyle(property: string, value: any) {
		const elementId = selectedNodeId || selectedEdgeId;
		if (!elementId || !onedit) return;

		// Map the UI property to the DSL property name
		// For nodes: fillColor, textColor, strokeColor, strokeWidth, fontSize
		// For edges: strokeColor, strokeWidth
		let dslProperty: string;
		switch (property) {
			case 'background':
				dslProperty = 'fillColor'; // background color
				break;
			case 'stroke':
				dslProperty = 'strokeColor'; // border/stroke color
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
			default:
				return;
		}

		onedit(elementId, dslProperty, value);
	}

	// Handle element double-click (start editing)
	function handleElementDoubleClick(event: Event) {
		event.stopPropagation();
		event.preventDefault();

		const target = event.currentTarget as SVGElement;
		const nodeId = target.getAttribute('data-node-id');
		const edgeId = target.getAttribute('data-edge-id');

		// Find the text element within this element group
		const textElement = target.querySelector('text');
		if (!textElement) return;

		// Get the current label text and trim whitespace
		const currentLabel = (textElement.textContent || '').trim();

		// Get the position of the text element in screen space
		const svgElement = svgContainer.querySelector('svg');
		if (!svgElement) return;

		const textRect = textElement.getBoundingClientRect();
		const containerRect = svgContainer.getBoundingClientRect();

		// Calculate position relative to container
		const inputX = textRect.left - containerRect.left;
		const inputY = textRect.top - containerRect.top;

		// Start editing mode
		if (nodeId) {
			editingNodeId = nodeId;
			editingEdgeId = null;
		} else if (edgeId) {
			editingEdgeId = edgeId;
			editingNodeId = null;
		}
		editingLabel = currentLabel;
		editInputPosition = { x: inputX, y: inputY };
	}

	// Clear all selections
	function clearSelection() {
		if (!svgContainer) return;

		const svgElement = svgContainer.querySelector('svg');
		if (!svgElement) return;

		// Remove selection class from all elements
		svgElement.querySelectorAll('.runiq-selected, .runiq-multi-selected').forEach((el) => {
			el.classList.remove('runiq-selected', 'runiq-multi-selected');
		});

		selectedNodeId = null;
		selectedEdgeId = null;
		selectedNodeIds = new Set();
		selectedEdgeIds = new Set();
	}

	// Handle canvas click (deselect)
	function handleCanvasClick(event: MouseEvent) {
		// Only deselect if clicking on the canvas itself, not on an element
		if (event.target === event.currentTarget || (event.target as HTMLElement).tagName === 'svg') {
			// If we're in multi-select mode (have multiple items selected), only clear if NOT holding Ctrl
			const hasMultiSelection = selectedNodeIds.size > 1 || selectedEdgeIds.size > 1 ||
			                          (selectedNodeIds.size === 1 && selectedEdgeIds.size === 1);

			if (hasMultiSelection && (event.ctrlKey || event.metaKey)) {
				// Don't clear multi-selection when Ctrl+clicking empty space
				return;
			}

			clearSelection();
			cancelEdgeCreation(); // Cancel edge creation if clicking on empty canvas
			if (onselect) onselect(null, null);
		}
	}

	// Handle keyboard events for the canvas
	function handleCanvasKeyDown(event: KeyboardEvent) {
		// Don't intercept if we're editing text
		if (editingNodeId || editingEdgeId) return;

		if (event.key === 'Escape') {
			// Cancel edge creation mode
			if (edgeCreationMode) {
				cancelEdgeCreation();
				event.preventDefault();
			}
		} else if (event.key === 'Delete' || event.key === 'Backspace') {
			// Delete selected elements (single or multi)
			if (selectedNodeIds.size > 0 || selectedEdgeIds.size > 0) {
				// Delete all multi-selected items
				selectedNodeIds.forEach((nodeId) => {
					if (ondelete) ondelete(nodeId, null);
				});
				selectedEdgeIds.forEach((edgeId) => {
					if (ondelete) ondelete(null, edgeId);
				});
				clearSelection();
				event.preventDefault();
			} else if ((selectedNodeId || selectedEdgeId) && ondelete) {
				// Delete single selected item
				ondelete(selectedNodeId, selectedEdgeId);
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
		if (selectedNodeIds.size > 0 || selectedEdgeIds.size > 0) {
			selectedNodeIds.forEach((nodeId) => {
				const element = svgElement.querySelector(`[data-node-id="${nodeId}"]`);
				if (element) {
					clipboard.push({
						type: 'node',
						id: nodeId,
						data: extractElementData(element, 'node')
					});
				}
			});

			selectedEdgeIds.forEach((edgeId) => {
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
		else if (selectedNodeId) {
			const element = svgElement.querySelector(`[data-node-id="${selectedNodeId}"]`);
			if (element) {
				clipboard.push({
					type: 'node',
					id: selectedNodeId,
					data: extractElementData(element, 'node')
				});
			}
		} else if (selectedEdgeId) {
			const element = svgElement.querySelector(`[data-edge-id="${selectedEdgeId}"]`);
			if (element) {
				clipboard.push({
					type: 'edge',
					id: selectedEdgeId,
					data: extractElementData(element, 'edge')
				});
			}
		}
	}

	// Cut selected elements (copy + delete)
	function handleCut() {
		handleCopy();

		// Delete after copying
		if (selectedNodeIds.size > 0 || selectedEdgeIds.size > 0) {
			selectedNodeIds.forEach((nodeId) => {
				if (ondelete) ondelete(nodeId, null);
			});
			selectedEdgeIds.forEach((edgeId) => {
				if (ondelete) ondelete(null, edgeId);
			});
		} else if (selectedNodeId || selectedEdgeId) {
			if (ondelete) ondelete(selectedNodeId, selectedEdgeId);
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
		if (!svgContainer) return;

		const svgElement = svgContainer.querySelector('svg');
		if (!svgElement) return;

		const newSelectedNodes = new Set<string>();
		const newSelectedEdges = new Set<string>();

		svgElement.querySelectorAll('[data-node-id]').forEach((element) => {
			const nodeId = element.getAttribute('data-node-id');
			if (nodeId) newSelectedNodes.add(nodeId);
		});

		svgElement.querySelectorAll('[data-edge-id]').forEach((element) => {
			const edgeId = element.getAttribute('data-edge-id');
			if (edgeId) newSelectedEdges.add(edgeId);
		});

		selectedNodeIds = newSelectedNodes;
		selectedEdgeIds = newSelectedEdges;
		updateMultiSelection();
	}

	// Extract element data from SVG element
	function extractElementData(element: Element, type: 'node' | 'edge'): any {
		// This is a simplified version - in a real implementation,
		// you would extract all the node/edge properties from the AST
		return {
			id: element.getAttribute(`data-${type}-id`),
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
				if (editingNodeId) {
					const location = nodeLocations.get(editingNodeId);
					onedit(editingNodeId, 'label', editingLabel, location);
				} else if (editingEdgeId) {
					// For edges, we don't have location info yet (could be added later)
					onedit(editingEdgeId, 'edgeLabel', editingLabel);
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
		editingNodeId = null;
		editingEdgeId = null;
		editingLabel = '';
		editInputPosition = null;
	}

	// Zoom controls (same as Preview.svelte)
	function zoomIn() {
		scale = Math.min(scale * 1.2, 5);
	}

	function zoomOut() {
		scale = Math.max(scale / 1.2, 0.1);
	}

	function resetZoom() {
		scale = 1;
		translateX = 0;
		translateY = 0;
	}

	function fitToScreen() {
		if (!svgContainer || !svgOutput) return;

		translateX = 0;
		translateY = 0;

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
			scale = 0.9;
			return;
		}

		const containerWidth = svgContainer.clientWidth;
		const containerHeight = svgContainer.clientHeight;

		const padding = 0.9;
		const scaleX = (containerWidth * padding) / svgWidth;
		const scaleY = (containerHeight * padding) / svgHeight;

		scale = Math.min(scaleX, scaleY, 5);
	}

	// Pan controls and lasso selection
	function handleMouseDown(e: MouseEvent) {
		// Don't start panning/lasso if we're editing
		if (editingNodeId || editingEdgeId) return;

		// Don't start lasso/pan if clicking on an element (let the element click handler deal with it)
		const target = e.target as HTMLElement;
		if (target.closest('[data-node-id], [data-edge-id]')) {
			return;
		}

		if (e.button === 0) {
			const rect = svgContainer.getBoundingClientRect();
			const clientX = e.clientX - rect.left;
			const clientY = e.clientY - rect.top;

			// Ctrl+Drag for lasso selection (pending until drag threshold)
			if (e.ctrlKey || e.metaKey) {
				isLassoPending = true;
				lassoStartX = clientX;
				lassoStartY = clientY;
				lassoEndX = clientX;
				lassoEndY = clientY;
			} else {
				// Regular panning
				isDragging = true;
				dragStartX = e.clientX - translateX;
				dragStartY = e.clientY - translateY;
			}
		}
	}

	function handleMouseMove(e: MouseEvent) {
		const rect = svgContainer.getBoundingClientRect();
		mouseX = Math.round(e.clientX - rect.left);
		mouseY = Math.round(e.clientY - rect.top);

		svgMouseX = Math.round((mouseX - translateX) / scale);
		svgMouseY = Math.round((mouseY - translateY) / scale);

		if (isLassoPending) {
			// Check if we've dragged far enough to activate lasso
			const dx = mouseX - lassoStartX;
			const dy = mouseY - lassoStartY;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance > LASSO_THRESHOLD) {
				isLassoPending = false;
				isLassoActive = true;
			}
		}

		if (isLassoActive) {
			// Update lasso rectangle
			lassoEndX = mouseX;
			lassoEndY = mouseY;
		} else if (isDragging) {
			// Handle canvas panning
			translateX = e.clientX - dragStartX;
			translateY = e.clientY - dragStartY;
		}
	}

	function handleMouseUp() {
		if (isLassoActive) {
			// Complete lasso selection
			selectElementsInLasso();
			isLassoActive = false;
		}
		isLassoPending = false;
		isDragging = false;
	}

	// Select all elements within the lasso rectangle
	function selectElementsInLasso() {
		if (!svgContainer) return;

		const svgElement = svgContainer.querySelector('svg');
		if (!svgElement) return;

		// Calculate lasso bounds in screen coordinates
		const minX = Math.min(lassoStartX, lassoEndX);
		const maxX = Math.max(lassoStartX, lassoEndX);
		const minY = Math.min(lassoStartY, lassoEndY);
		const maxY = Math.max(lassoStartY, lassoEndY);

		const newSelectedNodes = new Set<string>();
		const newSelectedEdges = new Set<string>();

		// Check all interactive elements
		const elements = svgElement.querySelectorAll('[data-node-id], [data-edge-id]');
		elements.forEach((element) => {
			const bbox = (element as SVGGraphicsElement).getBBox();
			const svgRect = svgElement.getBoundingClientRect();
			const containerRect = svgContainer.getBoundingClientRect();

			// Transform SVG coordinates to screen coordinates
			const elemX = (bbox.x * scale) + translateX;
			const elemY = (bbox.y * scale) + translateY;
			const elemWidth = bbox.width * scale;
			const elemHeight = bbox.height * scale;

			// Check if element intersects with lasso
			if (
				elemX < maxX &&
				elemX + elemWidth > minX &&
				elemY < maxY &&
				elemY + elemHeight > minY
			) {
				const nodeId = element.getAttribute('data-node-id');
				const edgeId = element.getAttribute('data-edge-id');

				if (nodeId) newSelectedNodes.add(nodeId);
				if (edgeId) newSelectedEdges.add(edgeId);
			}
		});

		// Update selection
		selectedNodeIds = newSelectedNodes;
		selectedEdgeIds = newSelectedEdges;

		// Update visual selection
		updateMultiSelection();
	}

	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		const delta = e.deltaY > 0 ? 0.9 : 1.1;
		scale = Math.max(0.1, Math.min(5, scale * delta));
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

<style>
	/* Add CSS for interactive states */
	:global(.runiq-hovered) {
		cursor: pointer;
	}

	/* Hover effect for nodes (groups with rectangles, circles, etc) */
	:global(.runiq-hovered rect),
	:global(.runiq-hovered circle),
	:global(.runiq-hovered ellipse),
	:global(.runiq-hovered polygon),
	:global(.runiq-hovered polyline) {
		filter: brightness(1.1);
	}

	/* Hover effect for edges (paths with strokes) */
	:global(.runiq-hovered path) {
		stroke: #3b82f6 !important;
		stroke-width: 3 !important;
	}

	/* Make edges clickable with cursor feedback */
	:global([data-edge-id]) {
		cursor: pointer;
	}

	:global(.runiq-selected) {
		filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.8));
		border-color: #3b82f6;
		stroke-width: 2;
	}

	/* Edge creation mode - start node highlight */
	:global(.runiq-edge-start) {
		filter: drop-shadow(0 0 6px rgba(34, 197, 94, 0.9));
		animation: pulse-edge-start 1.5s ease-in-out infinite;
	}

	@keyframes pulse-edge-start {
		0%, 100% {
			filter: drop-shadow(0 0 6px rgba(34, 197, 94, 0.9));
		}
		50% {
			filter: drop-shadow(0 0 10px rgba(34, 197, 94, 1));
		}
	}

	/* Multi-selection styling */
	:global(.runiq-multi-selected) {
		filter: drop-shadow(0 0 3px rgba(168, 85, 247, 0.7));
		stroke: #a855f7;
		stroke-width: 2;
	}

	/* Floating toolbar at top center */
	.floating-toolbar {
		position: absolute;
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1000;
		display: flex;
		gap: 8px;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		padding: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.toolbar-button {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 16px;
		background: white;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 500;
		color: #374151;
		cursor: pointer;
		transition: all 0.15s;
	}

	.toolbar-button:hover {
		background: #f9fafb;
		border-color: #3b82f6;
		color: #3b82f6;
	}

	.toolbar-button:active {
		transform: scale(0.98);
	}

	/* Lasso selection rectangle */
	.lasso-rectangle {
		position: absolute;
		border: 2px dashed #3b82f6;
		background: rgba(59, 130, 246, 0.1);
		pointer-events: none;
		z-index: 999;
	}

	.edit-input {
		position: absolute;
		z-index: 1000;
		border: 2px solid #3b82f6;
		border-radius: 4px;
		padding: 4px 8px;
		font-family: inherit;
		font-size: 14px;
		background: white;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	/* Style Panel */
	.style-panel {
		position: absolute;
		top: 60px;
		right: 20px;
		width: 280px;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		overflow: hidden;
	}

	.style-panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		border-bottom: 1px solid #e5e7eb;
		background: #f9fafb;
	}

	.style-panel-body {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.style-field {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.style-field label {
		flex: 0 0 80px;
		font-size: 13px;
		font-weight: 500;
		color: #374151;
	}

	.style-color-input {
		width: 40px;
		height: 32px;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		cursor: pointer;
	}

	.style-text-input {
		flex: 1;
		padding: 6px 8px;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 13px;
		font-family: monospace;
	}

	.style-text-input:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.style-number-input {
		width: 80px;
		padding: 6px 8px;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 13px;
	}

	.style-number-input:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.style-checkbox {
		width: 18px;
		height: 18px;
		cursor: pointer;
	}

	.close-button {
		padding: 4px;
		border-radius: 4px;
		background: transparent;
		border: none;
		color: #6b7280;
		cursor: pointer;
		transition: all 0.15s;
	}

	.close-button:hover {
		background: #f3f4f6;
		color: #374151;
	}
</style>

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

			{#if selectedNodeIds.size > 0 || selectedEdgeIds.size > 0}
				<Badge variant="outline" class="gap-1 bg-purple-50 border-purple-300 text-purple-700">
					<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					Multi-Select: {selectedNodeIds.size + selectedEdgeIds.size} items
				</Badge>
			{:else if selectedNodeId}
				<Badge variant="outline" class="gap-1">
					<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
						/>
					</svg>
					Selected: {selectedNodeId}
				</Badge>
			{:else if selectedEdgeId}
				<Badge variant="outline" class="gap-1">
					<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					Selected: {selectedEdgeId}
				</Badge>
			{/if}

			<!-- Multi-select help hint -->
			{#if !selectedNodeId && !selectedEdgeId && selectedNodeIds.size === 0 && selectedEdgeIds.size === 0}
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
				{Math.round(scale * 100)}%
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
		style="cursor: {isDragging ? 'grabbing' : (editingNodeId || editingEdgeId) ? 'default' : 'grab'}; outline: none;"
	>
		<!-- Floating Toolbar at Top Center -->
		{#if selectedNodeId || selectedEdgeId}
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
		{#if isLassoActive}
			<div
				class="lasso-rectangle"
				style="left: {Math.min(lassoStartX, lassoEndX)}px; top: {Math.min(lassoStartY, lassoEndY)}px; width: {Math.abs(lassoEndX - lassoStartX)}px; height: {Math.abs(lassoEndY - lassoStartY)}px;"
			></div>
		{/if}

		<!-- Label Edit Input -->
		{#if (editingNodeId || editingEdgeId) && editInputPosition}
			<input
				type="text"
				bind:this={editInputElement}
				bind:value={editingLabel}
				onkeydown={handleEditKeyPress}
				class="edit-input"
				style="left: {editInputPosition.x}px; top: {editInputPosition.y}px;"
				autofocus
			/>
		{/if}

		<!-- Style Editing Panel -->
		{#if showStylePanel && (selectedNodeId || selectedEdgeId)}
			<div class="style-panel">
				<div class="style-panel-header">
					<h3 class="font-semibold text-sm">
						Style {selectedNodeId ? 'Node' : 'Edge'}
					</h3>
					<button
						onclick={() => (showStylePanel = false)}
						class="close-button"
						title="Close"
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div class="style-panel-body">
					<!-- Background Color -->
					<div class="style-field">
						<label for="style-background">Background:</label>
						<input
							id="style-background"
							type="color"
							bind:value={styleBackground}
							onchange={() => applyStyle('background', styleBackground)}
							class="style-color-input"
						/>
						<input
							type="text"
							bind:value={styleBackground}
							onchange={() => applyStyle('background', styleBackground)}
							placeholder="#FFFFFF"
							class="style-text-input"
						/>
					</div>

					<!-- Stroke Color -->
					<div class="style-field">
						<label for="style-stroke">Stroke:</label>
						<input
							id="style-stroke"
							type="color"
							bind:value={styleStroke}
							onchange={() => applyStyle('stroke', styleStroke)}
							class="style-color-input"
						/>
						<input
							type="text"
							bind:value={styleStroke}
							onchange={() => applyStyle('stroke', styleStroke)}
							placeholder="#000000"
							class="style-text-input"
						/>
					</div>

					{#if selectedNodeId}
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
							<input
								id="style-font-color"
								type="color"
								bind:value={styleFontColor}
								onchange={() => applyStyle('fontColor', styleFontColor)}
								class="style-color-input"
							/>
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
				style="transform: translate({translateX}px, {translateY}px) scale({scale})"
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
