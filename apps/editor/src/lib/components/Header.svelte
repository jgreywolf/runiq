<script lang="ts">
	import NewDiagramButton from './NewDiagramButton.svelte';
	import NewDiagramDialog from './NewDiagramDialog.svelte';
	import ExportButton from './ExportButton.svelte';
	import SettingsButton from './SettingsButton.svelte';
	import HelpMenu from './HelpMenu.svelte';

	interface Props {
		diagramName?: string;
		lastSaved?: Date | null;
		isDirty?: boolean;
	}

	let { diagramName = 'Untitled Diagram', lastSaved = null, isDirty = false }: Props = $props();

	let showNewDiagramDialog = $state(false);

	// Actions
	function handleNewDiagramClick() {
		if (isDirty) {
			const confirmed = confirm('You have unsaved changes. Create a new diagram?');
			if (!confirmed) return;
		}
		showNewDiagramDialog = true;
	}

	function handleSettings() {
		// TODO: Implement settings modal
		console.log('Settings clicked');
	}

	// Format last saved time
	function formatLastSaved(date: Date | null): string {
		if (!date) return 'Not saved';

		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffSec = Math.floor(diffMs / 1000);
		const diffMin = Math.floor(diffSec / 60);

		if (diffSec < 10) return 'Saved just now';
		if (diffSec < 60) return `Saved ${diffSec} seconds ago`;
		if (diffMin < 60) return `Saved ${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;

		return date.toLocaleTimeString();
	}
</script>

<header
	class="flex h-20 items-center justify-between border-b border-neutral-200 bg-white px-4 shadow-sm"
>
	<!-- Left: Logo & Brand -->
	<div class="flex items-center gap-3">
		<img src="/images/runiq.at.whiteboard.png" alt="Runiq" class="h-16 w-auto" />
		<div class="flex flex-col">
			<span class="text-lg leading-tight font-semibold text-neutral-800">Runiq</span>
			<span class="text-xs text-neutral-500">Diagram Editor</span>
		</div>
	</div>

	<!-- Center: Diagram Name & Save Status -->
	<div class="flex items-center gap-4">
		<div class="flex flex-col items-center">
			<input
				type="text"
				value={diagramName}
				class="border-b border-transparent bg-transparent px-2 py-1 text-center text-sm font-medium text-neutral-800 transition-colors outline-none hover:border-neutral-300 focus:border-runiq-500"
				placeholder="Diagram name"
			/>
			<span class="text-xs text-neutral-500">
				{#if isDirty}
					<span class="inline-flex items-center gap-1">
						<span class="h-1.5 w-1.5 rounded-full bg-warning"></span>
						Unsaved changes
					</span>
				{:else}
					<span class="inline-flex items-center gap-1">
						<span class="h-1.5 w-1.5 rounded-full bg-success"></span>
						{formatLastSaved(lastSaved)}
					</span>
				{/if}
			</span>
		</div>
	</div>

	<!-- Right: Actions -->
	<div class="flex items-center gap-2">
		<!-- New Diagram Button -->
		<NewDiagramButton onclick={handleNewDiagramClick} />

		<!-- Export Button -->
		<ExportButton />

		<!-- Settings Button -->
		<SettingsButton onclick={handleSettings} />

		<!-- Help Menu -->
		<HelpMenu />
	</div>
</header>

<!-- New Diagram Dialog -->
<NewDiagramDialog bind:open={showNewDiagramDialog} />
