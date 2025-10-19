<script lang="ts">
	import { writable } from 'svelte/store';

	// Props
	interface Props {
		diagramName?: string;
		lastSaved?: Date | null;
		isDirty?: boolean;
	}

	let { diagramName = 'Untitled Diagram', lastSaved = null, isDirty = false }: Props = $props();

	// Actions
	function handleExport() {
		// TODO: Implement export menu
		console.log('Export clicked');
	}

	function handleSettings() {
		// TODO: Implement settings modal
		console.log('Settings clicked');
	}

	function handleHelp() {
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
</script>

<header class="flex h-20 items-center justify-between border-b border-neutral-200 bg-white px-4 shadow-sm">
	<!-- Left: Logo & Brand -->
	<div class="flex items-center gap-3">
		<img src="/images/runiq.at.whiteboard.png" alt="Runiq" class="h-16 w-auto" />
		<div class="flex flex-col">
			<span class="text-lg font-semibold leading-tight text-neutral-800">Runiq</span>
			<span class="text-xs text-neutral-500">Diagram Editor</span>
		</div>
	</div>

	<!-- Center: Diagram Name & Save Status -->
	<div class="flex items-center gap-4">
		<div class="flex flex-col items-center">
			<input
				type="text"
				value={diagramName}
				class="bg-transparent border-b border-transparent px-2 py-1 text-center text-sm font-medium text-neutral-800 outline-none transition-colors hover:border-neutral-300 focus:border-runiq-500"
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
		<!-- Export Button -->
		<button
			onclick={handleExport}
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
		</button>

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
			title="Help & Documentation"
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
	</div>
</header>
