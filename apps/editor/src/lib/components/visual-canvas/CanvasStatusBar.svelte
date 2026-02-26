<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import Icon from '@iconify/svelte';
	import type { WarningDetail } from '@runiq/parser-dsl';

	interface Props {
		isRendering: boolean;
		errorCount: number;
		hasSvgOutput: boolean;
		parseTime: number;
		renderTime: number;
		isConnectMode: boolean;
		connectModeHint: 'auto' | 'new' | 'existing';
		selectedNodeId: string | null;
		selectedEdgeId: string | null;
		selectedNodeCount: number;
		selectedEdgeCount: number;
		zoomPercentage: number;
		warningDetails: WarningDetail[];
		combinedWarnings: string[];
		showWarnings: boolean;
		onJumpToWarning: (warning: WarningDetail) => void;
	}

	let {
		isRendering,
		errorCount,
		hasSvgOutput,
		parseTime,
		renderTime,
		isConnectMode,
		connectModeHint,
		selectedNodeId,
		selectedEdgeId,
		selectedNodeCount,
		selectedEdgeCount,
		zoomPercentage,
		warningDetails,
		combinedWarnings,
		showWarnings = $bindable(),
		onJumpToWarning
	}: Props = $props();

	const warningCount = $derived(warningDetails.length + combinedWarnings.length);
	const hasAnySelection = $derived(
		!!selectedNodeId || !!selectedEdgeId || selectedNodeCount > 0 || selectedEdgeCount > 0
	);
</script>

<div class="flex items-center justify-between border-b border-runiq-200 bg-runiq-50 px-4 py-2">
	<div class="flex items-center gap-2">
		{#if isRendering}
			<Badge variant="secondary" class="gap-1">
				<svg class="h-3 w-3 animate-spin" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				Rendering...
			</Badge>
		{:else if errorCount > 0}
			<Badge variant="destructive" class="gap-1">
				<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
				{errorCount} Error{errorCount === 1 ? '' : 's'}
			</Badge>
		{:else if warningCount > 0}
			<button type="button" class="focus:outline-none" onclick={() => (showWarnings = !showWarnings)}>
				<Badge variant="outline" class="gap-1 border-warning text-warning">
					<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
					{warningCount} Warning{warningCount === 1 ? '' : 's'}
				</Badge>
			</button>
		{:else if hasSvgOutput}
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

		{#if isConnectMode}
			<Badge
				variant="outline"
				class="gap-1 border-blue-300 bg-blue-50 text-blue-700"
				data-testid="connect-mode-hint"
			>
				Connect: {connectModeHint === 'auto' ? 'Auto' : connectModeHint === 'new' ? 'New' : 'Existing'}
				<span class="text-[10px] text-blue-500">(Alt New / Shift Existing)</span>
			</Badge>
		{/if}

		{#if selectedNodeCount > 0 || selectedEdgeCount > 0}
			<Badge variant="outline" class="gap-1 border-purple-300 bg-purple-50 text-purple-700">
				<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
				Multi-Select: {selectedNodeCount + selectedEdgeCount} items
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

		{#if !hasAnySelection}
			<span class="text-xs text-neutral-400 italic">Tip: Ctrl+Click to multi-select, Ctrl+Drag for lasso</span>
		{/if}
	</div>

	<div class="flex items-center gap-1">
		<span class="min-w-[60px] text-center text-xs text-neutral-600">{zoomPercentage}%</span>
	</div>
</div>

{#if warningCount > 0 && showWarnings}
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
									onclick={() => onJumpToWarning(warning)}
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
				onclick={() => (showWarnings = false)}
			>
				<Icon icon="lucide:x" class="size-4" />
			</button>
		</div>
	</div>
{/if}

