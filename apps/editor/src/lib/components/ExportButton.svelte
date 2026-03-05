<script lang="ts">
	import { handleExport } from '$lib/state/editorState.svelte';
	import { onMount } from 'svelte';

	let showMenu = $state(false);

	function handleExportClick(format: 'svg' | 'png') {
		showMenu = false;
		handleExport(format);
	}

	// Close menu when clicking outside
	onMount(() => {
		function handleClickOutside(event: MouseEvent) {
			if (showMenu) {
				const target = event.target as HTMLElement;
				if (!target.closest('.export-menu-container')) {
					showMenu = false;
				}
			}
		}

		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<div class="export-menu-container relative">
	<button
		onclick={() => (showMenu = !showMenu)}
		class="inline-flex cursor-pointer items-center gap-2 rounded-md bg-runiq-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-runiq-600"
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
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if showMenu}
		<div
			class="absolute top-full right-0 z-50 mt-1 w-40 rounded-md border border-neutral-200 bg-white shadow-lg"
		>
			<button
				onclick={() => handleExportClick('svg')}
				class="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
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
				onclick={() => handleExportClick('png')}
				class="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
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
