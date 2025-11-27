<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	const STORAGE_KEY = 'runiq-welcome-banner-dismissed';

	let isVisible = $state(false);

	onMount(() => {
		// Check if user has dismissed the banner before
		const dismissed = localStorage.getItem(STORAGE_KEY);
		isVisible = !dismissed;
	});

	function dismiss() {
		isVisible = false;
		localStorage.setItem(STORAGE_KEY, 'true');
	}

	function openDocs() {
		window.open('https://www.runiq.org/guide/getting-started', '_blank');
	}

	function openExamples() {
		window.open('https://www.runiq.org/examples/', '_blank');
	}
</script>

{#if isVisible}
	<div
		class="relative flex items-center justify-between gap-4 border-b border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 shadow-sm"
		role="alert"
	>
		<div class="flex items-center gap-3">
			<div class="flex h-8 w-8 items-center justify-center rounded-full bg-runiq-500 text-white">
				<Icon icon="lucide:book-open" width="16" height="16" />
			</div>
			<div class="flex flex-col">
				<p class="text-sm font-semibold text-neutral-800">Welcome to Runiq! 👋</p>
				<p class="text-xs text-neutral-600">
					New to diagramming with code? Check out our documentation to get started.
				</p>
			</div>
		</div>

		<div class="flex items-center gap-2">
			<button
				onclick={openDocs}
				class="inline-flex items-center gap-1.5 rounded-md bg-runiq-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-runiq-600"
			>
				<Icon icon="lucide:book-open" width="14" height="14" />
				Get Started
			</button>
			<button
				onclick={openExamples}
				class="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
			>
				<Icon icon="lucide:file-text" width="14" height="14" />
				View Examples
			</button>
			<button
				onclick={dismiss}
				class="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-white hover:text-neutral-700"
				title="Dismiss"
			>
				<Icon icon="lucide:x" width="16" height="16" />
			</button>
		</div>
	</div>
{/if}
