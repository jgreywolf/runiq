<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import ShapeBrowser from './ShapeBrowser.svelte';
	import ToolboxSamples from './ToolboxSamples.svelte';
	import { shapeCategories } from '$lib/data/toolbox-data';
	import { sampleDiagrams, wardleySamples } from '$lib/data/sample-data';

	interface Props {
		onInsertShape: (shapeCode: string) => void;
		onInsertSample?: (sampleCode: string) => void;
		currentCode?: string;
	}

	let { onInsertShape, onInsertSample, currentCode = '' }: Props = $props();

	// Detect profile type from current code
	let isElectricalMode = $derived(currentCode.trim().startsWith('electrical'));
	let isWardleyMode = $derived(currentCode.trim().startsWith('wardley'));

	// Filter categories based on mode
	let displayedCategories = $derived(
		isElectricalMode
			? shapeCategories.filter((cat) => cat.electricalOnly)
			: shapeCategories.filter((cat) => !cat.electricalOnly)
	);

	// Select appropriate samples
	let displayedSamples = $derived(isWardleyMode ? wardleySamples : sampleDiagrams);

	// Handler for inserting samples - use provided handler or fallback to shape handler
	function handleInsertSample(sampleCode: string) {
		if (onInsertSample) {
			onInsertSample(sampleCode);
		} else {
			onInsertShape(sampleCode);
		}
	}
</script>

<Tooltip.Provider delayDuration={200}>
	<div class="flex h-full flex-col">
		{#if isElectricalMode}
			<div class="border-b border-amber-200 bg-amber-50 px-4 py-2">
				<p class="text-xs font-medium text-amber-900">⚡ Electrical Circuit Mode</p>
			</div>
		{:else if isWardleyMode}
			<div class="border-b border-purple-200 bg-purple-50 px-4 py-2">
				<p class="text-xs font-medium text-purple-900">📊 Wardley Map Mode</p>
			</div>
		{/if}

		<Tabs.Root value={isWardleyMode ? 'samples' : 'shapes'} class="flex h-full flex-col">
			<Tabs.List class="m-2 grid w-auto grid-cols-2 gap-1 rounded-lg bg-neutral-100 p-1">
				<Tabs.Trigger
					value="shapes"
					class="rounded-md px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-runiq-700 data-[state=active]:shadow-sm data-[state=inactive]:text-neutral-600 data-[state=inactive]:hover:text-neutral-900"
					disabled={isWardleyMode}
				>
					Shapes
				</Tabs.Trigger>
				<Tabs.Trigger
					value="samples"
					class="rounded-md px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-runiq-700 data-[state=active]:shadow-sm data-[state=inactive]:text-neutral-600 data-[state=inactive]:hover:text-neutral-900"
				>
					{isWardleyMode ? 'Templates' : 'Sample Diagrams'}
				</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="shapes" class="flex-1 overflow-auto">
				{#if !isWardleyMode}
					<ShapeBrowser categories={displayedCategories} {onInsertShape} />
				{:else}
					<div class="flex h-full items-center justify-center p-4 text-center">
						<p class="text-sm text-neutral-500">
							Wardley Maps use uniform components.<br />
							See Templates for examples.
						</p>
					</div>
				{/if}
			</Tabs.Content>

			<Tabs.Content value="samples" class="flex-1 overflow-auto">
				<ToolboxSamples categories={displayedSamples} onInsertSample={handleInsertSample} />
			</Tabs.Content>
		</Tabs.Root>

		<div class="mt-auto border-t border-neutral-200 bg-neutral-50 p-3">
			<p class="text-xs text-neutral-500">
				{isWardleyMode ? 'Click a template to insert' : 'Click a shape to insert it at the cursor'}
			</p>
		</div>
	</div>
</Tooltip.Provider>
