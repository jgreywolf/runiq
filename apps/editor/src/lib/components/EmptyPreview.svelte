<script lang="ts">
	import Icon from '@iconify/svelte';

	function openDocs() {
		window.open('https://www.runiq.org/guide/getting-started', '_blank');
	}

	function openExamples() {
		window.open('https://www.runiq.org/examples/', '_blank');
	}

	function openQuickStart() {
		window.open('https://www.runiq.org/guide/quick-start', '_blank');
	}
</script>

<div class="flex h-full w-full items-center justify-center bg-neutral-50 p-8">
	<div class="max-w-md text-center">
		<!-- Icon -->
		<div class="mb-6 flex justify-center">
			<div class="flex h-20 w-20 items-center justify-center rounded-full bg-runiq-100">
				<img src="/images/runiq.waving.png" alt="Runiq" class="h-16 w-16" />
			</div>
		</div>

		<!-- Heading -->
		<h2 class="mb-3 text-2xl font-bold text-neutral-800">Start Creating Diagrams</h2>
		<p class="mb-8 text-sm text-neutral-600">
			Type your diagram code on the left, and watch it come to life here. New to Runiq? We've got
			you covered!
		</p>

		<!-- Action Buttons -->
		<div class="flex flex-col gap-3">
			<button
				onclick={openQuickStart}
				class="inline-flex items-center justify-center gap-2 rounded-lg bg-runiq-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-runiq-600"
			>
				<Icon icon="lucide:lightbulb" width="16" height="16" />
				5-Minute Quick Start
			</button>

			<div class="flex gap-2">
				<button
					onclick={openDocs}
					class="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
				>
					<Icon icon="lucide:book-open" width="16" height="16" />
					Documentation
				</button>
				<button
					onclick={openExamples}
					class="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
				>
					<Icon icon="lucide:file-text" width="16" height="16" />
					Examples
				</button>
			</div>
		</div>

		<!-- Quick Tips -->
		<div class="mt-8 rounded-lg bg-white p-4 text-left shadow-sm">
			<p class="mb-2 text-xs font-semibold text-neutral-700">Quick Tips:</p>
			<ul class="space-y-1 text-xs text-neutral-600">
				<li class="flex items-start gap-2">
					<span class="text-runiq-500">•</span>
					<span
						>Start with <code class="rounded bg-neutral-100 px-1 py-0.5 text-xs"
							>diagram "My First Diagram"</code
						></span
					>
				</li>
				<li class="flex items-start gap-2">
					<span class="text-runiq-500">•</span>
					<span>Use the Toolbox on the left to browse available shapes</span>
				</li>
				<li class="flex items-start gap-2">
					<span class="text-runiq-500">•</span>
					<span
						>Press <kbd class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-semibold">F1</kbd> anytime
						for help</span
					>
				</li>
			</ul>
		</div>
	</div>
</div>
