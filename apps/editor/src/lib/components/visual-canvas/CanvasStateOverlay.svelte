<script lang="ts">
	interface Props {
		errors: string[];
		hasSvgOutput: boolean;
	}

	let { errors, hasSvgOutput }: Props = $props();
</script>

{#if errors.length > 0}
	<div class="absolute inset-0 flex items-center justify-center bg-black/5 p-8">
		<div class="max-w-2xl rounded-lg border-2 border-error bg-white/95 p-6 shadow-lg backdrop-blur-sm">
			<div class="mb-4 flex items-center gap-2 text-error">
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<h3 class="text-lg font-semibold">Parsing Errors</h3>
			</div>
			{#if hasSvgOutput}
				<p class="mb-3 text-xs text-neutral-600">Showing last valid render.</p>
			{/if}
			<div class="space-y-2">
				{#each errors as error}
					<div class="rounded bg-error/10 px-3 py-2 font-mono text-sm text-error">
						{error}
					</div>
				{/each}
			</div>
			<p class="mt-4 text-sm text-neutral-600">Fix the errors in the code editor to update the preview.</p>
		</div>
	</div>
{:else if !hasSvgOutput}
	<div class="absolute inset-0 flex items-center justify-center p-8 text-center">
		<div class="max-w-md">
			<svg
				class="mx-auto mb-4 h-16 w-16 text-neutral-300"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
					d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				/>
			</svg>
			<h3 class="mb-2 text-lg font-medium text-neutral-700">No Diagram</h3>
			<p class="text-sm text-neutral-500">Start typing in the code editor to see your diagram here.</p>
		</div>
	</div>
{/if}

