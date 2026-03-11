<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { getAvailableBaseThemes } from '@runiq/core';
	import { ProfileName } from '$lib/types';
	import type {
		CanvasDefaultMode,
		EditorSettingsSnapshot,
		LayoutEngineId,
		LayoutStrategyId
	} from '$lib/state/editorSettings.svelte';

	interface Props {
		open: boolean;
		currentAutosaveEnabled: boolean;
		currentAutosaveDelayMs: number;
		currentDefaultCanvasMode: CanvasDefaultMode;
		currentDefaultLayoutEngine: LayoutEngineId;
		currentDefaultLayoutStrategy: LayoutStrategyId;
		recommendedLayoutStrategy: LayoutStrategyId;
		currentDefaultDiagramTheme: string;
		currentProfileName: ProfileName | null;
		canChangeLayoutStrategy: boolean;
		canChangeDefaultCanvasMode: boolean;
		onSave: (
			next: Partial<EditorSettingsSnapshot> & {
				applyThemeToCurrentDiagram: boolean;
				applyModeNow: boolean;
				applyStrategyNow: boolean;
			}
		) => void;
	}

	let {
		open = $bindable(),
		currentAutosaveEnabled,
		currentAutosaveDelayMs,
		currentDefaultCanvasMode,
		currentDefaultLayoutEngine,
		currentDefaultLayoutStrategy,
		recommendedLayoutStrategy,
		currentDefaultDiagramTheme,
		currentProfileName,
		canChangeLayoutStrategy,
		canChangeDefaultCanvasMode,
		onSave
	}: Props = $props();

	const availableThemes = getAvailableBaseThemes();

	let autosaveEnabled = $state(true);
	let autosaveDelayMs = $state(2000);
	let defaultCanvasMode = $state<CanvasDefaultMode>('select');
	let defaultLayoutStrategy = $state<LayoutStrategyId>('hierarchical');
	let defaultDiagramTheme = $state('runiq');
	let applyThemeToCurrentDiagram = $state(false);
	let applyModeNow = $state(true);
	let applyStrategyNow = $state(true);
	let lastInitializedOpen = $state(false);

	const strategyMetadata: Record<
		LayoutStrategyId,
		{ label: string; hint: string; details: string }
	> = {
		hierarchical: {
			label: 'Hierarchical',
			hint: 'ELK layered',
			details: 'Best for top-down flows and process diagrams.'
		},
		force: {
			label: 'Force-directed',
			hint: 'ELK force',
			details: 'Best for network-style graphs and relationship maps.'
		},
		adaptive: {
			label: 'Adaptive',
			hint: 'ELK stress',
			details: 'Balances node spacing automatically for mixed structures.'
		},
		tree: {
			label: 'Tree',
			hint: 'ELK mrtree',
			details: 'Best for strict parent-child tree structures.'
		},
		radial: {
			label: 'Radial',
			hint: 'ELK radial',
			details: 'Places nodes around a center point.'
		},
		circular: {
			label: 'Circular',
			hint: 'Custom circular',
			details: 'Places nodes around a ring with equal angular spacing.'
		}
	};

	$effect(() => {
		if (open && !lastInitializedOpen) {
			autosaveEnabled = currentAutosaveEnabled;
			autosaveDelayMs = currentAutosaveDelayMs;
			defaultCanvasMode = currentDefaultCanvasMode;
			defaultLayoutStrategy = currentDefaultLayoutStrategy;
			defaultDiagramTheme = currentDefaultDiagramTheme;
			applyThemeToCurrentDiagram = false;
			applyModeNow = true;
			applyStrategyNow = true;
		}
		lastInitializedOpen = open;
	});

	function save() {
		const clampedDelay = Math.max(100, Math.round(autosaveDelayMs || 0));
		onSave({
			autosaveEnabled,
			autosaveDelayMs: clampedDelay,
			defaultCanvasMode,
			defaultLayoutEngine: currentDefaultLayoutEngine,
			defaultLayoutStrategy,
			defaultDiagramTheme: defaultDiagramTheme.trim() || 'runiq',
			applyThemeToCurrentDiagram,
			applyModeNow: canChangeDefaultCanvasMode ? applyModeNow : false,
			applyStrategyNow: canChangeLayoutStrategy ? applyStrategyNow : false
		});
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="bg-white sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title class="text-neutral-900">Editor Settings</Dialog.Title>
			<Dialog.Description class="text-neutral-600"
				>Configure editor preferences and default canvas behavior.</Dialog.Description
			>
		</Dialog.Header>

		<div class="grid gap-4 py-2 text-sm">
			<div class="flex items-center justify-between rounded border border-neutral-200 p-3">
				<div>
					<div class="font-medium text-neutral-900">Auto-save</div>
					<div class="text-xs text-neutral-600">Automatically persist DSL changes.</div>
				</div>
				<input type="checkbox" bind:checked={autosaveEnabled} />
			</div>

			<div>
				<label class="mb-1 block text-xs font-medium text-neutral-700" for="autosave-delay"
					>Auto-save delay (ms)</label
				>
				<input
					id="autosave-delay"
					type="number"
					min="100"
					step="100"
					bind:value={autosaveDelayMs}
					disabled={!autosaveEnabled}
					class="w-full rounded border border-neutral-300 px-2 py-1.5 disabled:bg-neutral-100"
				/>
			</div>

			{#if canChangeLayoutStrategy}
				<div>
					<label class="mb-1 block text-xs font-medium text-neutral-700" for="default-layout"
						>Default layout strategy</label
					>
					<div class="mb-2 rounded border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-xs text-neutral-600">
						<span class="font-medium text-neutral-700">Profile:</span>
						{currentProfileName ?? 'diagram'}
						<span class="mx-1">|</span>
						<span class="font-medium text-neutral-700">Recommended:</span>
						{strategyMetadata[recommendedLayoutStrategy].label}
						<span class="text-neutral-500">
							({strategyMetadata[recommendedLayoutStrategy].hint})
						</span>
					</div>
					<select
						id="default-layout"
						bind:value={defaultLayoutStrategy}
						class="w-full rounded border border-neutral-300 px-2 py-1.5"
					>
						<option value="hierarchical" title={strategyMetadata.hierarchical.details}
							>{strategyMetadata.hierarchical.label} ({strategyMetadata.hierarchical.hint})</option
						>
						<option value="force" title={strategyMetadata.force.details}
							>{strategyMetadata.force.label} ({strategyMetadata.force.hint})</option
						>
						<option value="adaptive" title={strategyMetadata.adaptive.details}
							>{strategyMetadata.adaptive.label} ({strategyMetadata.adaptive.hint})</option
						>
						<option value="tree" title={strategyMetadata.tree.details}
							>{strategyMetadata.tree.label} ({strategyMetadata.tree.hint})</option
						>
						<option value="radial" title={strategyMetadata.radial.details}
							>{strategyMetadata.radial.label} ({strategyMetadata.radial.hint})</option
						>
						<option value="circular" title={strategyMetadata.circular.details}
							>{strategyMetadata.circular.label} ({strategyMetadata.circular.hint})</option
						>
					</select>
					<div class="mt-2 text-xs text-neutral-600">
						{strategyMetadata[defaultLayoutStrategy].details}
					</div>
					<label class="mt-2 flex items-center gap-2 text-xs text-neutral-600">
						<input type="checkbox" bind:checked={applyStrategyNow} />
						Apply to current diagram now
					</label>
				</div>
			{:else}
				<div class="rounded border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600">
					Layout strategy is fixed for this profile and cannot be changed from settings.
				</div>
			{/if}

			{#if canChangeDefaultCanvasMode}
				<div>
					<label class="mb-1 block text-xs font-medium text-neutral-700" for="default-canvas-mode"
						>Default canvas mode</label
					>
					<select
						id="default-canvas-mode"
						bind:value={defaultCanvasMode}
						class="w-full rounded border border-neutral-300 px-2 py-1.5"
					>
						<option value="select">Select</option>
						<option value="connect">Connect</option>
					</select>
					<label class="mt-2 flex items-center gap-2 text-xs text-neutral-600">
						<input type="checkbox" bind:checked={applyModeNow} />
						Apply to canvas now
					</label>
				</div>
			{:else}
				<div class="rounded border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600">
					Canvas mode is fixed for this profile and cannot be changed from settings.
				</div>
			{/if}

			<div>
				<label class="mb-1 block text-xs font-medium text-neutral-700" for="default-diagram-theme"
					>Default diagram theme</label
				>
				<select
					id="default-diagram-theme"
					bind:value={defaultDiagramTheme}
					class="w-full rounded border border-neutral-300 px-2 py-1.5"
				>
					{#each availableThemes as themeId}
						<option value={themeId}>{themeId}</option>
					{/each}
				</select>
				<label class="mt-2 flex items-center gap-2 text-xs text-neutral-600">
					<input type="checkbox" bind:checked={applyThemeToCurrentDiagram} />
					Apply to current diagram now
				</label>
			</div>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
			<Button onclick={save}>Save Settings</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
