<script lang="ts">
	import { X, BookOpen, FileText } from 'lucide-svelte';
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
				<BookOpen class="h-4 w-4" />
			</div>
			<div class="flex flex-col">
				<p class="text-sm font-semibold text-neutral-800">
					Welcome to Runiq! 👋
				</p>
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
				<BookOpen class="h-3.5 w-3.5" />
				Get Started
			</button>
			<button
				onclick={openExamples}
				class="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
			>
				<FileText class="h-3.5 w-3.5" />
				View Examples
			</button>
			<button
				onclick={dismiss}
				class="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-white hover:text-neutral-700"
				title="Dismiss"
			>
				<X class="h-4 w-4" />
			</button>
		</div>
	</div>
{/if}
