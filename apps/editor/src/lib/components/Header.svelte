<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';

	// Props
	interface Props {
		diagramName?: string;
		lastSaved?: Date | null;
		isDirty?: boolean;
		onNewDiagram?: (type: 'diagram' | 'schematic' | 'wardley' | 'sequence') => void;
		onExport?: (format: 'svg' | 'png') => void;
	}

	let {
		diagramName = 'Untitled Diagram',
		lastSaved = null,
		isDirty = false,
		onNewDiagram,
		onExport
	}: Props = $props();

	let showNewDiagramDialog = $state(false);
	let showExportMenu = $state(false);

	// Actions
	function handleNewDiagramClick() {
		if (isDirty) {
			const confirmed = confirm('You have unsaved changes. Create a new diagram?');
			if (!confirmed) return;
		}
		showNewDiagramDialog = true;
	}

	function createDiagram(type: 'diagram' | 'schematic' | 'wardley' | 'sequence') {
		showNewDiagramDialog = false;
		onNewDiagram?.(type);
	}

	function handleExport(format: 'svg' | 'png') {
		showExportMenu = false;
		onExport?.(format);
	}

	function handleSettings() {
		// TODO: Implement settings modal
		console.log('Settings clicked');
	}

	function handleHelp() {
		window.open('https://jgreywolf.github.io/runiq/', '_blank');
	}

	function handleGitHub() {
		window.open('https://github.com/jgreywolf/runiq', '_blank');
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

	// Close export menu when clicking outside
	onMount(() => {
		function handleClickOutside(event: MouseEvent) {
			if (showExportMenu) {
				const target = event.target as HTMLElement;
				if (!target.closest('.export-menu-container')) {
					showExportMenu = false;
				}
			}
		}

		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
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
		<button
			onclick={handleNewDiagramClick}
			class="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
			title="New diagram (Ctrl+N)"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				/>
			</svg>
			New
		</button>

		<!-- Export Button -->
		<div class="export-menu-container relative">
			<button
				onclick={() => (showExportMenu = !showExportMenu)}
				class="inline-flex items-center gap-2 rounded-md bg-runiq-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-runiq-600"
				title="Export diagram (Ctrl+E)"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
					/>
				</svg>
				Export
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-3 w-3"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{#if showExportMenu}
				<div
					class="absolute top-full right-0 z-50 mt-1 w-40 rounded-md border border-neutral-200 bg-white shadow-lg"
				>
					<button
						onclick={() => handleExport('svg')}
						class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
							/>
						</svg>
						Export as SVG
					</button>
					<button
						onclick={() => handleExport('png')}
						class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						Export as PNG
					</button>
				</div>
			{/if}
		</div>

		<!-- Settings Button -->
		<button
			onclick={handleSettings}
			class="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-neutral-100"
			title="Settings (Ctrl+,)"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
		</button>

		<!-- Help Button -->
		<button
			onclick={handleHelp}
			class="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-neutral-100"
			title="Documentation"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		</button>

		<!-- GitHub Button -->
		<button
			onclick={handleGitHub}
			class="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-neutral-100"
			title="View on GitHub"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
				/>
			</svg>
		</button>
	</div>
</header>

<!-- New Diagram Type Selection Dialog -->
<Dialog.Root bind:open={showNewDiagramDialog}>
	<Dialog.Content class="bg-white sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="text-neutral-900">Create New Diagram</Dialog.Title>
			<Dialog.Description class="text-neutral-600"
				>Choose the type of diagram you want to create.</Dialog.Description
			>
		</Dialog.Header>

		<div class="grid gap-4 py-4">
			<!-- Regular Diagram Option -->
			<button
				onclick={() => createDiagram('diagram')}
				class="group flex flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-runiq-400 hover:bg-runiq-50"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-runiq-100 text-runiq-600 transition-colors group-hover:bg-runiq-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
							/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Diagram</h3>
						<p class="text-sm text-neutral-600">Flowcharts, UML, network diagrams</p>
					</div>
				</div>
			</button>

			<!-- Sequence Diagram Option -->
			<button
				onclick={() => createDiagram('sequence')}
				class="group flex flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-blue-400 hover:bg-blue-50"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
							/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Sequence Diagram</h3>
						<p class="text-sm text-neutral-600">Interactions, messages, lifelines</p>
					</div>
				</div>
			</button>

			<!-- Electrical Circuit Option -->
			<button
				onclick={() => createDiagram('schematic')}
				class="group flex flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-amber-400 hover:bg-amber-50"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600 transition-colors group-hover:bg-amber-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Schematics</h3>
						<p class="text-sm text-neutral-600">Electrical circuit, logic gates, components</p>
					</div>
				</div>
			</button>

			<!-- Wardley Map Option -->
			<button
				onclick={() => createDiagram('wardley')}
				class="group flex flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-purple-400 hover:bg-purple-50"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Wardley Map</h3>
						<p class="text-sm text-neutral-600">Strategic mapping, evolution, value chain</p>
					</div>
				</div>
			</button>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (showNewDiagramDialog = false)}>Cancel</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
