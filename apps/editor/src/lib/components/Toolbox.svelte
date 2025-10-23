<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import ToolboxShapes from './ToolboxShapes.svelte';
	import ToolboxSamples from './ToolboxSamples.svelte';
	import { shapeCategories } from '$lib/data/toolbox-data';
	import { sampleDiagrams } from '$lib/data/sample-data';

	interface Props {
		onInsertShape: (shapeCode: string) => void;
		onInsertSample?: (sampleCode: string) => void;
		currentCode?: string;
	}

	let { onInsertShape, onInsertSample, currentCode = '' }: Props = $props();

	// Detect if current code is for electrical circuit or regular diagram
	let isElectricalMode = $derived(currentCode.trim().startsWith('electrical'));

	// Filter categories based on electrical mode
	let displayedCategories = $derived(
		isElectricalMode
			? shapeCategories.filter((cat) => cat.electricalOnly)
			: shapeCategories.filter((cat) => !cat.electricalOnly)
	);

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
		{/if}

		<Tabs.Root value="shapes" class="flex h-full flex-col">
			<Tabs.List class="m-2 grid w-auto grid-cols-2 gap-1 rounded-lg bg-neutral-100 p-1">
				<Tabs.Trigger
					value="shapes"
					class="rounded-md px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-runiq-700 data-[state=active]:shadow-sm data-[state=inactive]:text-neutral-600 data-[state=inactive]:hover:text-neutral-900"
				>
					Shapes
				</Tabs.Trigger>
				<Tabs.Trigger
					value="samples"
					class="rounded-md px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-runiq-700 data-[state=active]:shadow-sm data-[state=inactive]:text-neutral-600 data-[state=inactive]:hover:text-neutral-900"
				>
					Sample Diagrams
				</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="shapes" class="flex-1 overflow-auto">
				<ToolboxShapes categories={displayedCategories} {onInsertShape} />
			</Tabs.Content>

			<Tabs.Content value="samples" class="flex-1 overflow-auto">
				<ToolboxSamples categories={sampleDiagrams} onInsertSample={handleInsertSample} />
			</Tabs.Content>
		</Tabs.Root>

		<div class="mt-auto border-t border-neutral-200 bg-neutral-50 p-3">
			<p class="text-xs text-neutral-500">Click a shape to insert it at the cursor</p>
		</div>
	</div>
</Tooltip.Provider>
