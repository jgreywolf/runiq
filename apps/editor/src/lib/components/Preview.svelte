<script lang="ts">
	import { onMount } from 'svelte';
	import { parse } from '@runiq/parser-dsl';
	import { layoutRegistry } from '@runiq/core';
	import {
		renderSvg,
		renderWardleyMap,
		renderSequenceDiagram,
		renderTimeline
	} from '@runiq/renderer-svg';
	import { renderSchematic, renderPID } from '@runiq/renderer-schematic';
	import { Badge } from '$lib/components/ui/badge';

	// Props
	interface Props {
		code: string;
		dataContent?: string;
		layoutEngine?: string;
		onparse?: (success: boolean, errors: string[]) => void;
	}

	let { code = '', dataContent = '', layoutEngine = 'elk', onparse }: Props = $props();

	let svgOutput = $state('');
	let errors = $state<string[]>([]);
	let warnings = $state<string[]>([]);
	let isRendering = $state(false);
	let parseTime = $state(0);
	let renderTime = $state(0);

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

	// Process data content and inject into DSL
	function injectDataIntoCode(syntaxCode: string, data: string): string {
		if (!data || !data.trim()) {
			return syntaxCode; // No data to inject
		}

		const trimmedData = data.trim();

		// Detect format
		const looksLikeJson = trimmedData.startsWith('{') || trimmedData.startsWith('[');

		let parsedData: any;

		if (looksLikeJson) {
			// Parse JSON
			try {
				parsedData = JSON.parse(trimmedData);
			} catch (e: any) {
				console.error('Failed to parse JSON data:', e);
				return syntaxCode; // Return original code if JSON is invalid
			}
		} else {
			// Treat as CSV - parse and convert to JSON
			const lines = trimmedData
				.split('\n')
				.map((l) => l.trim())
				.filter((l) => l);

			if (lines.length > 0) {
				// Parse CSV headers and rows
				const headers = lines[0].split(',').map((h) => h.trim());
				const rows = lines.slice(1).map((line) => {
					const values = line.split(',').map((v) => v.trim());
					const obj: any = {};
					headers.forEach((header, i) => {
						// Try to parse as number if possible
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

		// Inject data directly into chart shapes by adding/replacing data property
		let modifiedCode = syntaxCode;

		// Find all chart shapes (lineChart, radarChart, pieChart, barChart, sankeyChart, etc.)
		const chartShapePattern =
			/shape\s+(\w+)\s+as\s+@(lineChart|radarChart|pieChart|barChart|pyramidShape|venn\dShape|sankeyChart)/g;

		let match;
		const replacements: Array<{ from: number; to: number; replacement: string }> = [];

		while ((match = chartShapePattern.exec(syntaxCode)) !== null) {
			const fullMatch = match[0];
			const shapeId = match[1];
			const shapeType = match[2];
			const matchStart = match.index;

			// Skip data injection for sankeyChart - it uses a different mechanism
			if (shapeType === 'sankeyChart') {
				continue;
			}

			// Find the end of this shape declaration (either newline or next shape/edge/})
			const afterMatch = syntaxCode.substring(matchStart + fullMatch.length);
			const endMatch = afterMatch.match(/(?:\r?\n|$)/);
			const lineEnd = endMatch
				? matchStart + fullMatch.length + endMatch.index!
				: syntaxCode.length;

			const currentLine = syntaxCode.substring(matchStart, lineEnd);

			// Extract existing properties
			const propsMatch = currentLine.match(/as\s+@\w+\s+(.*)$/);
			const existingProps = propsMatch ? propsMatch[1].trim() : '';

			// Remove existing data: property if present
			const withoutData = existingProps.replace(/\bdata:\[.*?\]|\bdata:\{.*?\}/g, '').trim();

			// Determine which data to use
			let dataToInject: any;

			// If parsedData is an object with named datasets, try to find matching data
			if (typeof parsedData === 'object' && !Array.isArray(parsedData)) {
				// Check if there's a dataset with a matching name or use the first one
				const dataKeys = Object.keys(parsedData);
				if (dataKeys.length > 0) {
					// Use first dataset
					dataToInject = parsedData[dataKeys[0]];
				}
			} else {
				dataToInject = parsedData;
			}

			if (!dataToInject) continue;

			// For charts, extract both numeric values and labels from array of objects
			let chartData: any;
			let chartLabels: string[] | null = null;

			if (
				Array.isArray(dataToInject) &&
				dataToInject.length > 0 &&
				typeof dataToInject[0] === 'object'
			) {
				const firstObj = dataToInject[0];
				const keys = Object.keys(firstObj);

				// Find first numeric property for values
				const numericKey = keys.find((k) => typeof firstObj[k] === 'number');
				// Find first string property for labels
				const labelKey = keys.find((k) => typeof firstObj[k] === 'string');

				if (numericKey) {
					chartData = dataToInject.map((item: any) => item[numericKey]);

					// Extract labels if available
					if (labelKey) {
						chartLabels = dataToInject.map((item: any) => item[labelKey]);
					}
				} else {
					chartData = dataToInject;
				}
			} else {
				chartData = dataToInject;
			}

			// Build new shape declaration with data and labels
			const dataStr = JSON.stringify(chartData);
			let newProps = withoutData;

			// Add labels if we extracted them
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

		// Apply replacements in reverse order to maintain positions
		replacements.reverse().forEach(({ from, to, replacement }) => {
			modifiedCode = modifiedCode.substring(0, from) + replacement + modifiedCode.substring(to);
		});

		return modifiedCode;
	}

	// Helper function to create P&ID preview SVG
	function createPIDPreviewSvg(profile: any): string {
		const equipmentCount = profile.equipment?.length || 0;
		const instrumentCount = profile.instruments?.length || 0;
		const lineCount = profile.lines?.length || 0;
		const loopCount = profile.loops?.length || 0;

		let y = 40;
		const lineHeight = 25;

		let content = `
			<text x="20" y="${y}" font-size="20" font-weight="bold" fill="#059669">${profile.name || 'P&ID Diagram'}</text>
		`;
		y += 40;

		content += `<text x="20" y="${y}" font-size="14" fill="#666">✓ Parsed successfully</text>`;
		y += lineHeight + 10;

		// Equipment summary
		content += `<text x="20" y="${y}" font-size="16" font-weight="bold" fill="#333">Equipment (${equipmentCount})</text>`;
		y += lineHeight;

		if (profile.equipment && profile.equipment.length > 0) {
			profile.equipment.slice(0, 10).forEach((eq: any) => {
				const props = [];
				if (eq.properties?.material) props.push(`material: ${eq.properties.material}`);
				if (eq.properties?.volume)
					props.push(`volume: ${eq.properties.volume} ${eq.properties.volumeUnit || ''}`);
				if (eq.properties?.flowRate)
					props.push(`flowRate: ${eq.properties.flowRate} ${eq.properties.flowRateUnit || ''}`);
				const propsStr = props.length > 0 ? ` (${props.join(', ')})` : '';
				content += `<text x="40" y="${y}" font-size="12" fill="#555">${eq.tag}: ${eq.type}${propsStr}</text>`;
				y += lineHeight;
			});
			if (equipmentCount > 10) {
				content += `<text x="40" y="${y}" font-size="12" fill="#999" font-style="italic">... and ${equipmentCount - 10} more</text>`;
				y += lineHeight;
			}
		}
		y += 10;

		// Instruments summary
		content += `<text x="20" y="${y}" font-size="16" font-weight="bold" fill="#333">Instruments (${instrumentCount})</text>`;
		y += lineHeight;

		if (profile.instruments && profile.instruments.length > 0) {
			profile.instruments.slice(0, 10).forEach((inst: any) => {
				const props = [];
				if (inst.properties?.rangeMin !== undefined && inst.properties?.rangeMax !== undefined) {
					props.push(
						`range: ${inst.properties.rangeMin}-${inst.properties.rangeMax} ${inst.properties.rangeUnit || ''}`
					);
				}
				if (inst.properties?.location) props.push(`location: ${inst.properties.location}`);
				if (inst.properties?.loop) props.push(`loop: ${inst.properties.loop}`);
				const propsStr = props.length > 0 ? ` (${props.join(', ')})` : '';
				content += `<text x="40" y="${y}" font-size="12" fill="#555">${inst.tag}: ${inst.type}${propsStr}</text>`;
				y += lineHeight;
			});
			if (instrumentCount > 10) {
				content += `<text x="40" y="${y}" font-size="12" fill="#999" font-style="italic">... and ${instrumentCount - 10} more</text>`;
				y += lineHeight;
			}
		}
		y += 10;

		// Lines summary
		content += `<text x="20" y="${y}" font-size="16" font-weight="bold" fill="#333">Lines (${lineCount})</text>`;
		y += lineHeight;

		const lineTypes =
			profile.lines?.reduce((acc: any, line: any) => {
				acc[line.type] = (acc[line.type] || 0) + 1;
				return acc;
			}, {}) || {};

		Object.entries(lineTypes).forEach(([type, count]) => {
			content += `<text x="40" y="${y}" font-size="12" fill="#555">${type}: ${count}</text>`;
			y += lineHeight;
		});
		y += 10;

		// Loops summary
		content += `<text x="20" y="${y}" font-size="16" font-weight="bold" fill="#333">Control Loops (${loopCount})</text>`;
		y += lineHeight;

		if (profile.loops && profile.loops.length > 0) {
			profile.loops.forEach((loop: any) => {
				content += `<text x="40" y="${y}" font-size="12" fill="#555">Loop ${loop.id}: ${loop.controlledVariable} @ ${loop.setpoint} ${loop.unit || ''} (${loop.mode || 'manual'})</text>`;
				y += lineHeight;
			});
		}
		y += 10;

		// Process specs
		if (profile.processSpecs) {
			content += `<text x="20" y="${y}" font-size="16" font-weight="bold" fill="#333">Process Specifications</text>`;
			y += lineHeight;

			if (profile.processSpecs.fluid) {
				content += `<text x="40" y="${y}" font-size="12" fill="#555">Fluid: ${profile.processSpecs.fluid}</text>`;
				y += lineHeight;
			}
			if (profile.processSpecs.pressure) {
				content += `<text x="40" y="${y}" font-size="12" fill="#555">Pressure: ${profile.processSpecs.pressure} ${profile.processSpecs.pressureUnit || ''}</text>`;
				y += lineHeight;
			}
			if (profile.processSpecs.flowRate) {
				content += `<text x="40" y="${y}" font-size="12" fill="#555">Flow Rate: ${profile.processSpecs.flowRate} ${profile.processSpecs.flowRateUnit || ''}</text>`;
				y += lineHeight;
			}
		}
		y += 20;

		// Note about full rendering
		content += `<text x="20" y="${y}" font-size="12" fill="#059669" font-style="italic">Full P&ID rendering with symbols and lines coming soon!</text>`;

		return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${y + 40}" viewBox="0 0 800 ${y + 40}">
			<rect width="800" height="${y + 40}" fill="#f9fafb"/>
			${content}
		</svg>`;
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

			// Inject data from Data tab (overrides any data source blocks in syntax)
			const codeWithData = injectDataIntoCode(dslCode, dataContent);

			// Parse DSL
			const parseResult = parse(codeWithData);
			parseTime = Math.round(performance.now() - startParse);

			if (!parseResult.success || !parseResult.document) {
				errors = parseResult.errors;
				svgOutput = '';
				isRendering = false;
				if (onparse) onparse(false, errors);
				return;
			}

			// Get the first profile
			const profile = parseResult.document.profiles[0];
			if (!profile) {
				errors = ['No profile found in document'];
				svgOutput = '';
				isRendering = false;
				if (onparse) onparse(false, errors);
				return;
			}

			// Inject Sankey chart data from data panel (after parsing, directly into AST)
			if (profile.type === 'diagram' && dataContent) {
				try {
					const data = JSON.parse(dataContent);
					// Find sankeyChart shapes and inject their data
					if (profile.nodes) {
						for (const node of profile.nodes) {
							if (node.shape === 'sankeyChart') {
								// Use first available data key (Sankey data is usually the only dataset)
								const dataKeys = Object.keys(data);
								if (dataKeys.length > 0) {
									node.data = data[dataKeys[0]];
								}
							}
						}
					}
				} catch (e) {
					// Ignore JSON parse errors for Sankey injection
				}
			}

			// Start render timer
			const startRender = performance.now();

			// Declare renderResult variable
			let renderResult: { svg: string; warnings: string[] };

			// Handle different profile types
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
					// P&ID rendering with ISA-5.1 symbols
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
					// Add astVersion for compatibility with DiagramAst
					const diagram = {
						...profile,
						astVersion: parseResult.document.astVersion
					};

					// Layout
					const layoutEng = layoutRegistry.get(layoutEngine);
					if (!layoutEng) {
						errors = [`Unknown layout engine: ${layoutEngine}`];
						isRendering = false;
						return;
					}

					const layout = await layoutEng.layout(diagram);

					// Render
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

			// Common post-render logic
			svgOutput = renderResult.svg;
			warnings = renderResult.warnings;
			renderTime = Math.round(performance.now() - startRender);
			isRendering = false;
			if (onparse) {
				onparse(true, []);
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

	// Zoom controls
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

		// Reset translate first
		translateX = 0;
		translateY = 0;

		// Parse SVG to get dimensions
		const parser = new DOMParser();
		const svgDoc = parser.parseFromString(svgOutput, 'image/svg+xml');
		const svgElement = svgDoc.querySelector('svg');

		if (!svgElement) return;

		// Get SVG dimensions from viewBox or width/height attributes
		let svgWidth = 0;
		let svgHeight = 0;

		const viewBox = svgElement.getAttribute('viewBox');
		if (viewBox) {
			const [, , width, height] = viewBox.split(' ').map(Number);
			svgWidth = width;
			svgHeight = height;
		} else {
			// Fallback to width/height attributes
			svgWidth = parseFloat(svgElement.getAttribute('width') || '0');
			svgHeight = parseFloat(svgElement.getAttribute('height') || '0');
		}

		if (svgWidth === 0 || svgHeight === 0) {
			// Fallback to hardcoded scale if we can't determine dimensions
			scale = 0.9;
			return;
		}

		// Get container dimensions
		const containerWidth = svgContainer.clientWidth;
		const containerHeight = svgContainer.clientHeight;

		// Calculate scale to fit with 10% padding
		const padding = 0.9; // 90% of container size
		const scaleX = (containerWidth * padding) / svgWidth;
		const scaleY = (containerHeight * padding) / svgHeight;

		// Use the smaller scale to ensure entire diagram fits
		scale = Math.min(scaleX, scaleY, 5); // Cap at max zoom of 5x
	}

	// Pan controls
	function handleMouseDown(e: MouseEvent) {
		if (e.button === 0) {
			// Left click
			isDragging = true;
			dragStartX = e.clientX - translateX;
			dragStartY = e.clientY - translateY;
		}
	}

	function handleMouseMove(e: MouseEvent) {
		// Update mouse coordinates (screen space)
		const rect = svgContainer.getBoundingClientRect();
		mouseX = Math.round(e.clientX - rect.left);
		mouseY = Math.round(e.clientY - rect.top);

		// Calculate SVG space coordinates (accounting for pan and zoom)
		svgMouseX = Math.round((mouseX - translateX) / scale);
		svgMouseY = Math.round((mouseY - translateY) / scale);

		if (isDragging) {
			translateX = e.clientX - dragStartX;
			translateY = e.clientY - dragStartY;
		}
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		const delta = e.deltaY > 0 ? 0.9 : 1.1;
		scale = Math.max(0.1, Math.min(5, scale * delta));
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
	<div
		class="relative flex-1 overflow-hidden bg-neutral-50"
		bind:this={svgContainer}
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={handleMouseUp}
		onmouseleave={handleMouseUp}
		onwheel={handleWheel}
		style="cursor: {isDragging ? 'grabbing' : 'grab'}"
	>
		<!-- Mouse Coordinates Display (Top-Left Corner) -->
		{#if svgOutput}
			<div
				class="absolute top-2 left-2 z-10 rounded-md bg-black/75 px-3 py-2 font-mono text-xs text-white shadow-lg backdrop-blur-sm"
			>
				<div class="space-y-1">
					<div class="text-neutral-300">Screen: x={mouseX}, y={mouseY}</div>
					<div class="text-white">SVG: x={svgMouseX}, y={svgMouseY}</div>
					<div class="text-neutral-400">Zoom: {(scale * 100).toFixed(0)}%</div>
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
