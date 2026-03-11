<script lang="ts">
	import { onMount } from 'svelte';
	import NewDiagramButton from './NewDiagramButton.svelte';
	import NewDiagramDialog from './NewDiagramDialog.svelte';
	import EditorSettingsDialog from './EditorSettingsDialog.svelte';
	import ExportButton from './ExportButton.svelte';
	import SettingsButton from './SettingsButton.svelte';
	import HelpMenu from './HelpMenu.svelte';
	import { canvasState } from '$lib/state';
	import { autoSave, editorState, updateCode } from '$lib/state/editorState.svelte';
	import {
		editorSettings,
		getLayoutStrategyPresetForProfile,
		profileSupportsDefaultCanvasModeSelection,
		profileSupportsLayoutStrategySelection,
		type EditorSettingsSnapshot
	} from '$lib/state/editorSettings.svelte';
	import { applyThemeToDsl } from './Editor/editorToolbarActions';

	interface Props {
		diagramName?: string;
		lastSaved?: Date | null;
		isDirty?: boolean;
	}

	let { diagramName = 'Untitled Diagram', lastSaved = null, isDirty = false }: Props = $props();

	let showNewDiagramDialog = $state(false);
	let showSettingsDialog = $state(false);
	const canChangeLayoutStrategy = $derived(
		profileSupportsLayoutStrategySelection(editorState.profileName)
	);
	const canChangeDefaultCanvasMode = $derived(
		profileSupportsDefaultCanvasModeSelection(editorState.profileName)
	);

	// Actions
	function handleNewDiagramClick() {
		if (isDirty) {
			const confirmed = confirm('You have unsaved changes. Create a new diagram?');
			if (!confirmed) return;
		}
		showNewDiagramDialog = true;
	}

	function handleSettings() {
		showSettingsDialog = true;
	}

	function handleSaveSettings(
		next: Partial<EditorSettingsSnapshot> & {
			applyThemeToCurrentDiagram: boolean;
			applyModeNow: boolean;
			applyStrategyNow: boolean;
		}
	) {
		editorSettings.update(next);
		const strategyToApply =
			next.defaultLayoutStrategy ??
			editorSettings.getDefaultLayoutStrategyForProfile(editorState.profileName);
		editorSettings.setDefaultLayoutStrategyForProfile(editorState.profileName, strategyToApply);
		autoSave.setDelay(next.autosaveDelayMs ?? editorSettings.autosaveDelayMs);
		if (!next.autosaveEnabled && next.autosaveEnabled !== undefined) {
			autoSave.cancel();
		}
		if (next.applyModeNow) {
			canvasState.mode = next.defaultCanvasMode ?? editorSettings.defaultCanvasMode;
		}
		if (next.applyStrategyNow && canChangeLayoutStrategy) {
			editorState.layoutStrategy = strategyToApply;
		}
		if (next.applyThemeToCurrentDiagram) {
			const nextCode = applyThemeToDsl(
				editorState.code || '',
				next.defaultDiagramTheme ?? editorSettings.defaultDiagramTheme
			);
			updateCode(nextCode, true);
		}
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

	onMount(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			const isCtrlOrCmd = event.ctrlKey || event.metaKey;
			if (isCtrlOrCmd && event.key === ',') {
				event.preventDefault();
				showSettingsDialog = true;
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	});
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
<EditorSettingsDialog
	bind:open={showSettingsDialog}
	currentAutosaveEnabled={editorSettings.autosaveEnabled}
	currentAutosaveDelayMs={editorSettings.autosaveDelayMs}
	currentDefaultCanvasMode={editorSettings.defaultCanvasMode}
	currentDefaultLayoutEngine={editorSettings.defaultLayoutEngine}
	currentDefaultLayoutStrategy={editorSettings.getDefaultLayoutStrategyForProfile(editorState.profileName)}
	recommendedLayoutStrategy={getLayoutStrategyPresetForProfile(editorState.profileName)}
	currentDefaultDiagramTheme={editorSettings.defaultDiagramTheme}
	currentProfileName={editorState.profileName}
	{canChangeLayoutStrategy}
	{canChangeDefaultCanvasMode}
	onSave={handleSaveSettings}
/>
