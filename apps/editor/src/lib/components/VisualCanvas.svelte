<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { diagramState } from '$lib/state';
	import { editorRefs, editorState, handleParse } from '$lib/state/editorState.svelte';
	import Icon from '@iconify/svelte';
	import { type WarningDetail } from '@runiq/parser-dsl';
	import { onMount, tick } from 'svelte';
	import EditorToolbar from './Editor/EditorToolbar.svelte';
	import { createDebouncedRunner, runRenderCycle } from './visual-canvas/renderController';
	import { renderDiagram as renderDiagramUtil } from './visual-canvas/renderingUtils';
	import { mergeWarnings, updateWarningVisibility } from './visual-canvas/viewModel';
	import { ViewportState } from './visual-canvas/ViewportState.svelte';

	let svgOutput = $state('');
	let isRendering = $state(false);
	let parseTime = $state(0);
	let renderTime = $state(0);
	let showWarnings = $state(false);
	let lastWarningCount = $state(0);
	let warningDetails = $state<WarningDetail[]>([]);
	let combinedWarnings = $state<string[]>([]);
	let svgContainer = $state<HTMLDivElement | null>(null);

	const viewport = new ViewportState({
		minScale: 0.1,
		maxScale: 5
	});

	editorRefs.viewport = viewport;

	$effect(() => {
		const warningCount = warningDetails.length + combinedWarnings.length;
		const next = updateWarningVisibility(showWarnings, lastWarningCount, warningCount);
		showWarnings = next.showWarnings;
		lastWarningCount = next.lastWarningCount;
	});

	$effect(() => {
		combinedWarnings = mergeWarnings(warningDetails, diagramState.warnings, editorState.lintWarnings);
	});

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

	$effect(() => {
		const currentCode = editorState.code;
		const currentDataContent = editorState.dataContent;

		if (currentCode !== lastCode || currentDataContent !== lastDataContent) {
			lastCode = currentCode;
			lastDataContent = currentDataContent;
			debouncedRender.schedule(currentCode);
		}

		return () => {
			debouncedRender.cancel();
		};
	});

	function handleMouseDown(event: MouseEvent) {
		if (event.button !== 0) return;
		if ((event.target as HTMLElement).closest('button, input, select, textarea, a')) return;
		viewport.startPan(event.clientX, event.clientY);
	}

	function handleMouseMove(event: MouseEvent) {
		if (!svgContainer) return;
		const rect = svgContainer.getBoundingClientRect();
		viewport.updateMousePosition(event.clientX, event.clientY, rect);
		if (viewport.isPanning) {
			viewport.updatePan(event.clientX, event.clientY);
		}
	}

	function handleMouseUp() {
		viewport.endPan();
	}

	function handleWheel(event: WheelEvent) {
		event.preventDefault();
		const delta = event.deltaY > 0 ? 0.9 : 1.1;
		viewport.zoom(delta);
	}

	onMount(() => {
		editorRefs.preview = {
			hasValidDiagram,
			getSvg
		};

		return () => {
			editorRefs.preview = null;
		};
	});
</script>

<div class="flex h-full flex-col">
	<div class="flex items-center justify-between border-b border-runiq-200 bg-runiq-50 px-4 py-2">
		<div class="flex items-center gap-2">
			{#if isRendering}
				<Badge variant="secondary" class="gap-1">
					<svg class="h-3 w-3 animate-spin" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Rendering...
				</Badge>
			{:else if diagramState.errors.length > 0}
				<Badge variant="destructive" class="gap-1">
					<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
					{diagramState.errors.length} Error{diagramState.errors.length === 1 ? '' : 's'}
				</Badge>
			{:else if warningDetails.length + combinedWarnings.length > 0}
				<button
					type="button"
					class="focus:outline-none"
					onclick={() => {
						showWarnings = !showWarnings;
					}}>
					<Badge variant="outline" class="gap-1 border-warning text-warning">
						<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
						{warningDetails.length + combinedWarnings.length}
						Warning
						{warningDetails.length + combinedWarnings.length === 1 ? '' : 's'}
					</Badge>
				</button>
			{:else if svgOutput}
				<Badge variant="default" class="gap-1 bg-success text-white">
					<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
					Ready
				</Badge>
			{/if}

			{#if parseTime > 0 && renderTime > 0}
				<span class="text-xs text-neutral-500">Parse: {parseTime}ms · Render: {renderTime}ms</span>
			{/if}
		</div>

		<div class="flex items-center gap-1">
			<span class="min-w-[60px] text-center text-xs text-neutral-600">{viewport.zoomPercentage}%</span>
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
										}}>
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
					}}>
					<Icon icon="lucide:x" class="size-4" />
				</button>
			</div>
		</div>
	{/if}

	<div class="absolute left-4 z-10 flex gap-2" style="top: {showWarnings ? '120px' : '66px'};">
		<EditorToolbar {svgContainer} {svgOutput} />
	</div>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="relative flex-1 overflow-hidden bg-neutral-50"
		bind:this={svgContainer}
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={handleMouseUp}
		onmouseleave={handleMouseUp}
		onwheel={handleWheel}
		style="cursor: {viewport.isPanning ? 'grabbing' : 'grab'}; outline: none;">
		{#if diagramState.errors.length > 0}
			<div class="absolute inset-0 flex items-center justify-center p-8">
				<div class="max-w-2xl rounded-lg border-2 border-error bg-white p-6 shadow-lg">
					<div class="mb-4 flex items-center gap-2 text-error">
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
					<p class="mt-4 text-sm text-neutral-600">Fix the errors in the code editor to see the preview.</p>
				</div>
			</div>
		{:else if svgOutput}
			<div
				class="absolute inset-0 flex items-center justify-center transition-transform"
				style="transform: translate({viewport.translateX}px, {viewport.translateY}px) scale({viewport.scale})">
				<div class="rounded-lg border border-neutral-300 bg-white p-4 shadow-sm">
					{@html svgOutput}
				</div>
			</div>
		{:else}
			<div class="absolute inset-0 flex items-center justify-center p-8 text-center">
				<div class="max-w-md">
					<svg class="mx-auto mb-4 h-16 w-16 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					<h3 class="mb-2 text-lg font-medium text-neutral-700">No Diagram</h3>
					<p class="text-sm text-neutral-500">Start typing in the code editor to see your diagram here.</p>
				</div>
			</div>
		{/if}
	</div>
</div>
