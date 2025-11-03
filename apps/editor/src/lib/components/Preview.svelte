<script lang="ts">
	import { onMount } from 'svelte';
	import { parse } from '@runiq/parser-dsl';
	import { layoutRegistry } from '@runiq/core';
	import { renderSvg, renderWardleyMap, renderSequenceDiagram } from '@runiq/renderer-svg';
	import { renderSchematic } from '@runiq/renderer-schematic';
	import { Badge } from '$lib/components/ui/badge';

	// Props
	interface Props {
		code: string;
		layoutEngine?: string;
		onparse?: (success: boolean, errors: string[]) => void;
	}

	let { code = '', layoutEngine = 'elk', onparse }: Props = $props();

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

	// Debounce timer
	let debounceTimer: ReturnType<typeof setTimeout>;

	// Watch for code changes with debounce
	$effect(() => {
		if (code !== lastCode) {
			lastCode = code;
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

			// Parse DSL
			const parseResult = parse(dslCode);
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

			// Start render timer
			const startRender = performance.now();

			// Handle schematic profiles (electrical, pneumatic, hydraulic)
			if (
				profile.type === 'electrical' ||
				profile.type === 'pneumatic' ||
				profile.type === 'hydraulic'
			) {
				const renderResult = renderSchematic(profile as any, {
					gridSize: 50,
					routing: 'orthogonal',
					showNetLabels: true,
					showValues: true,
					showReferences: true
				});

				svgOutput = renderResult.svg;
				warnings = renderResult.warnings;
				renderTime = Math.round(performance.now() - startRender);
				isRendering = false;
				if (onparse) onparse(true, []);
				return;
			}

			// Handle Wardley Map profiles
			if (profile.type === 'wardley') {
				const renderResult = renderWardleyMap(profile as any, {
					width: 800,
					height: 600,
					showGrid: true,
					showEvolutionLabels: true,
					showValueLabels: true
				});

				svgOutput = renderResult.svg;
				warnings = renderResult.warnings;
				renderTime = Math.round(performance.now() - startRender);
				isRendering = false;
				if (onparse) onparse(true, []);
				return;
			}

			// Handle Sequence Diagram profiles
			if (profile.type === 'sequence') {
				const renderResult = renderSequenceDiagram(profile as any, {
					width: 800,
					participantSpacing: 150,
					messageSpacing: 60,
					showActivations: true,
					showReturns: true
				});

				svgOutput = renderResult.svg;
				warnings = renderResult.warnings;
				renderTime = Math.round(performance.now() - startRender);
				isRendering = false;
				if (onparse) onparse(true, []);
				return;
			}

			// Handle diagram profiles
			if (profile.type !== 'diagram') {
				errors = [
					`Profile type '${profile.type}' is not yet supported in the preview.`,
					`Currently 'diagram', 'electric', 'pneumatic', 'hydraulic', 'sequence', and 'wardley' profiles can be rendered.`
				];
				svgOutput = '';
				isRendering = false;
				if (onparse) onparse(false, errors);
				return;
			}

			// Add astVersion for compatibility with DiagramAst
			const diagram = {
				...profile,
				astVersion: parseResult.document.astVersion
			};

			// Debug: Log the nodes to see their shapes
			console.log(
				'Diagram nodes:',
				JSON.stringify(
					diagram.nodes.map((n) => ({ id: n.id, shape: n.shape, label: n.label })),
					null,
					2
				)
			);

			// Layout
			const layoutEng = layoutRegistry.get(layoutEngine);
			if (!layoutEng) {
				errors = [`Unknown layout engine: ${layoutEngine}`];
				isRendering = false;
				return;
			}

			const layout = await layoutEng.layout(diagram);

			// Render
			const renderResult = renderSvg(diagram, layout, { strict: false });
			svgOutput = renderResult.svg;
			warnings = renderResult.warnings;
			renderTime = Math.round(performance.now() - startRender);

			isRendering = false;
			if (onparse) onparse(true, []);
		} catch (error) {
			errors = [error instanceof Error ? error.message : 'Unknown error'];
			svgOutput = '';
			isRendering = false;
			if (onparse) onparse(false, errors);
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
				class="absolute left-2 top-2 z-10 rounded-md bg-black/75 px-3 py-2 font-mono text-xs text-white shadow-lg backdrop-blur-sm"
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
