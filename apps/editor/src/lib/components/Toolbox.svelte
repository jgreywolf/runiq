<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Button } from '$lib/components/ui/button';
	import { FileText } from 'lucide-svelte';
	import ShapeBrowser from './ShapeBrowser.svelte';
	import SampleBrowserDialog from './SampleBrowserDialog.svelte';
	import { shapeCategories } from '$lib/data/toolbox-data';
	import { sampleDiagrams } from '$lib/data/sample-data';

	interface Props {
		onInsertShape: (shapeCode: string) => void;
		onInsertSample?: (sampleCode: string, sampleData?: string) => void;
		currentCode?: string;
	}

	let { onInsertShape, onInsertSample, currentCode = '' }: Props = $props();

	let showSampleDialog = $state(false);

	// Detect profile type from current code
	// Official profiles: diagram, sequence, wardley, electrical, digital, pneumatic, hydraulic
	let currentProfile = $derived.by(() => {
		const code = currentCode.trim();
		if (code.startsWith('electrical')) return 'electrical';
		if (code.startsWith('digital')) return 'digital';
		if (code.startsWith('pneumatic')) return 'pneumatic';
		if (code.startsWith('hydraulic')) return 'hydraulic';
		if (code.startsWith('wardley')) return 'wardley';
		if (code.startsWith('sequence')) return 'sequence';
		return 'diagram'; // default
	});

	// Convenience flags for UI
	let isWardleyMode = $derived(currentProfile === 'wardley');
	let isElectricalMode = $derived(currentProfile === 'electrical');
	let isDigitalMode = $derived(currentProfile === 'digital');
	let isPneumaticMode = $derived(currentProfile === 'pneumatic');
	let isHydraulicMode = $derived(currentProfile === 'hydraulic');
	let isSequenceMode = $derived(currentProfile === 'sequence');

	// Filter categories based on current profile
	let displayedCategories = $derived(
		shapeCategories.filter((cat) => {
			// If category has no profiles defined, show in diagram mode only
			if (!cat.profiles || cat.profiles.length === 0) {
				return currentProfile === 'diagram';
			}
			// Show if current profile matches any of the category's profiles
			return cat.profiles.includes(currentProfile);
		})
	);

	// All samples are always available - inserting a sample changes the profile
	let displayedSamples = $derived(sampleDiagrams);

	// Handler for inserting samples
	function handleInsertSample(sampleCode: string, sampleData?: string) {
		if (onInsertSample) {
			onInsertSample(sampleCode, sampleData);
		} else {
			onInsertShape(sampleCode);
		}
	}

	function openSampleBrowser() {
		showSampleDialog = true;
	}
</script>

<Tooltip.Provider delayDuration={200}>
	<div class="flex h-full flex-col">
		{#if isSequenceMode}
			<div class="border-b border-amber-200 bg-amber-50 px-4 py-2">
				<p class="text-xs font-medium text-amber-900">⚡ Sequence Diagram Mode</p>
			</div>
		{:else if isElectricalMode}
			<div class="border-b border-amber-200 bg-amber-50 px-4 py-2">
				<p class="text-xs font-medium text-amber-900">⚡ Electrical Circuit Mode</p>
			</div>
		{:else if isDigitalMode}
			<div class="border-b border-blue-200 bg-blue-50 px-4 py-2">
				<p class="text-xs font-medium text-blue-900">🔌 Digital Circuit Mode</p>
			</div>
		{:else if isPneumaticMode}
			<div class="border-b border-sky-200 bg-sky-50 px-4 py-2">
				<p class="text-xs font-medium text-sky-900">💨 Pneumatic Circuit Mode</p>
			</div>
		{:else if isHydraulicMode}
			<div class="border-b border-cyan-200 bg-cyan-50 px-4 py-2">
				<p class="text-xs font-medium text-cyan-900">💧 Hydraulic Circuit Mode</p>
			</div>
		{:else if isWardleyMode}
			<div class="border-b border-purple-200 bg-purple-50 px-4 py-2">
				<p class="text-xs font-medium text-purple-900">📊 Wardley Map Mode</p>
			</div>
		{/if}

		<!-- Sample Browser Button -->
		<div class="border-b border-neutral-200 p-3">
			<Button
				onclick={openSampleBrowser}
				class="w-full justify-start gap-2 bg-gradient-to-r from-runiq-500 to-runiq-600 text-white hover:from-runiq-600 hover:to-runiq-700"
			>
				<FileText class="h-4 w-4" />
				Browse Sample Diagrams
			</Button>
		</div>

		<!-- Shape Browser -->
		<div class="flex-1 overflow-auto">
			{#if !isWardleyMode}
				<ShapeBrowser categories={displayedCategories} {onInsertShape} />
			{:else}
				<div class="flex h-full items-center justify-center p-4 text-center">
					<p class="text-sm text-neutral-500">
						Wardley Maps use uniform components.<br />
						See Sample Diagrams for examples.
					</p>
				</div>
			{/if}
		</div>

		<div class="mt-auto border-t border-neutral-200 bg-neutral-50 p-3">
			<p class="text-xs text-neutral-500">
				{isWardleyMode
					? 'Use Sample Diagrams for templates'
					: 'Click a shape to insert it at the cursor'}
			</p>
		</div>
	</div>
</Tooltip.Provider>

<!-- Sample Browser Dialog -->
<SampleBrowserDialog
	bind:open={showSampleDialog}
	onOpenChange={(open) => (showSampleDialog = open)}
	categories={displayedSamples}
	onInsertSample={handleInsertSample}
/>
