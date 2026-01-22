<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import ShapeBrowser from './ShapeBrowser.svelte';
	import SampleBrowserDialog from './SampleBrowserDialog.svelte';
	import { sampleDiagrams } from '$lib/data/sample-data';
	import { editorState, handleInsertSample } from '$lib/state/editorState.svelte';
	import { ProfileName } from '$lib/types';

	let showSampleDialog = $state(false);

	function openSampleBrowser() {
		showSampleDialog = true;
	}
</script>

<div class="flex h-full flex-col border-r border-neutral-300 bg-white">
	<div class="border-b border-runiq-200 bg-runiq-500 px-4 py-3">
		<h2 class="text-sm font-semibold text-white">Toolbox</h2>
	</div>
	<div class="flex-1 overflow-auto">
		<Tooltip.Provider delayDuration={200}>
			<div class="flex h-full flex-col">
				{#if editorState.profileName === null}
					<div class="flex flex-1 items-center justify-center p-4">
						<p class="text-sm text-neutral-500">Loading...</p>
					</div>
				{:else if editorState.profileName === ProfileName.diagram}
					<div class="border-b border-runiq-200 bg-runiq-50 px-4 py-2">
						<p class="text-xs font-medium text-runiq-900">📊 Diagram Mode</p>
					</div>
				{:else if editorState.profileName === ProfileName.glyphset}
					<div class="border-b border-runiq-200 bg-runiq-50 px-4 py-2">
						<p class="text-xs font-medium text-runiq-900">🔣 Glyphset Mode</p>
					</div>
				{:else if editorState.profileName === ProfileName.sequence}
					<div class="border-b border-blue-200 bg-blue-50 px-4 py-2">
						<p class="text-xs font-medium text-blue-900">⚡ Sequence Diagram Mode</p>
					</div>
				{:else if editorState.profileName === ProfileName.timeline}
					<div class="border-b border-indigo-200 bg-indigo-50 px-4 py-2">
						<p class="text-xs font-medium text-indigo-900">📅 Timeline Mode</p>
					</div>
				{:else if editorState.profileName === ProfileName.railroad}
					<div class="border-b border-slate-200 bg-slate-50 px-4 py-2">
						<p class="text-xs font-medium text-slate-900">Railroad Diagram Mode</p>
					</div>
				{:else if editorState.profileName === ProfileName.electrical}
					<div class="border-b border-amber-200 bg-amber-50 px-4 py-2">
						<p class="text-xs font-medium text-amber-900">⚡ Electrical Circuit Mode</p>
					</div>
				{:else if editorState.profileName === ProfileName.digital}
					<div class="border-b border-lime-200 bg-lime-50 px-4 py-2">
						<p class="text-xs font-medium text-lime-900">Digital Circuit Mode</p>
					</div>
				{:else if editorState.profileName === ProfileName.pneumatic}
					<div class="border-b border-sky-200 bg-sky-50 px-4 py-2">
						<p class="text-xs font-medium text-sky-900">💨 Pneumatic Circuit Mode</p>
					</div>
				{:else if editorState.profileName === ProfileName.hydraulic}
					<div class="border-b border-teal-200 bg-teal-50 px-4 py-2">
						<p class="text-xs font-medium text-teal-900">💧 Hydraulic Circuit Mode</p>
					</div>				{:else if editorState.profileName === ProfileName.hvac}
					<div class="border-b border-cyan-200 bg-cyan-50 px-4 py-2">
						<p class="text-xs font-medium text-cyan-900">HVAC System Mode</p>
					</div>
				{:else if editorState.profileName === ProfileName.wardley}
					<div class="border-b border-purple-200 bg-purple-50 px-4 py-2">
						<p class="text-xs font-medium text-purple-900">📊 Wardley Map Mode</p>
					</div>
				{:else}
					<div class="border-b border-purple-200 bg-purple-50 px-4 py-2">
						<p class="text-xs font-medium text-purple-900">No diagram detected</p>
					</div>
				{/if}

				<!-- Sample Browser Button -->
				<div class="border-b border-neutral-200 p-3">
					<Button
						onclick={openSampleBrowser}
						class="w-full justify-start gap-2 bg-gradient-to-r from-runiq-500 to-runiq-600 text-white hover:from-runiq-600 hover:to-runiq-700"
					>
						<Icon icon="lucide:file-text" width="16" height="16" />
						Browse Sample Diagrams
					</Button>
				</div>

				<!-- Profile-specific Shape Browser -->
				<div class="flex-1 overflow-auto">
					{#if editorState.profileName === null}
						<!-- Loading state already shown above -->
					{:else if editorState.profileName === ProfileName.wardley}
						<div class="flex h-full items-center justify-center p-4 text-center">
							<p class="text-sm text-neutral-500">
								Wardley Maps use uniform components.<br />
								See Sample Diagrams for examples.
							</p>
						</div>
					{:else}
						<ShapeBrowser />
					{/if}
				</div>

				<div class="mt-auto border-t border-neutral-200 bg-neutral-50 p-3">
					<p class="text-xs text-neutral-500">
						{editorState.profileName === ProfileName.wardley
							? 'Use Sample Diagrams for templates'
							: 'Click a shape to insert it'}
					</p>
				</div>
			</div>
		</Tooltip.Provider>
	</div>
</div>
<!-- Sample Browser Dialog -->
<SampleBrowserDialog
	bind:open={showSampleDialog}
	onOpenChange={(open) => (showSampleDialog = open)}
	categories={sampleDiagrams}
	onInsertSample={handleInsertSample}
/>

