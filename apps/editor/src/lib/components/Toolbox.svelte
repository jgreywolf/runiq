<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import ShapeBrowser from './ShapeBrowser.svelte';
	import SampleBrowserDialog from './SampleBrowserDialog.svelte';
	import { sampleDiagrams } from '$lib/data/sample-data';
	import { editorState, handleInsertSample } from '$lib/state/editorState.svelte';
	import { getToolboxProfileMeta } from './toolboxProfileMeta';

	let showSampleDialog = $state(false);

	function openSampleBrowser() {
		showSampleDialog = true;
	}

	const profileMeta = $derived(getToolboxProfileMeta(editorState.profileName));
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
				{:else}
					<div class={`px-4 py-2 ${profileMeta.bannerClass}`}>
						<p class="text-xs font-medium">{profileMeta.label}</p>
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
					{:else if profileMeta.contentMode === 'samples-only'}
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
					<p class="text-xs text-neutral-500">{profileMeta.footerHint}</p>
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
