<script lang="ts">
	import ExportButton from './ExportButton.svelte';
	import HelpMenu from './HelpMenu.svelte';
	import NewDiagramButton from './NewDiagramButton.svelte';
	import NewDiagramDialog from './NewDiagramDialog.svelte';

	interface Props {
		isDirty?: boolean;
	}

	let { isDirty = false }: Props = $props();

	let showNewDiagramDialog = $state(false);

	// Actions
	function handleNewDiagramClick() {
		if (isDirty) {
			const confirmed = confirm('You have unsaved changes. Create a new diagram?');
			if (!confirmed) return;
		}
		showNewDiagramDialog = true;
	}
</script>

<header class="flex h-20 items-center justify-between border-b border-neutral-200 bg-white px-4 shadow-sm">
	<!-- Left: Logo & Brand -->
	<div class="flex items-center gap-3">
		<img src="/images/runiq.icon.png" alt="Runiq" class="h-16 w-auto" />
		<div class="flex flex-col">
			<span class="text-lg leading-tight font-semibold text-neutral-800">Runiq</span>
			<span class="text-xs text-neutral-500">Diagram Editor</span>
		</div>
	</div>

	<!-- Center: Diagram Name & Save Status -->
	<div class="flex items-center gap-4">
		<div class="flex flex-col items-center">
			<!-- New Diagram Dialog -->
			<NewDiagramDialog bind:open={showNewDiagramDialog} />
		</div>
	</div>

	<!-- Right: Actions -->
	<div class="flex items-center gap-2">
		<NewDiagramButton onclick={handleNewDiagramClick} />

		<!-- Export Button -->
		<ExportButton />

		<!-- Help Menu -->
		<HelpMenu />
	</div>
</header>
