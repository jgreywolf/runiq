<script lang="ts">
	interface Props {
		defaultUrl?: string;
		onInsert: (src: string) => void;
	}

	let { defaultUrl = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6', onInsert }: Props =
		$props();
	let imageUrlInput = $state(defaultUrl);

	function handleInsert() {
		const value = imageUrlInput.trim();
		if (!value) return;
		onInsert(value);
	}
</script>

<div class="image-flyout">
	<div class="mb-1 px-2 py-1">
		<h3 class="text-xs font-semibold text-neutral-700">Insert Image</h3>
	</div>
	<input
		class="rounded border border-neutral-300 px-2 py-1 text-xs"
		bind:value={imageUrlInput}
		placeholder="https://..."
	/>
	<button
		onclick={handleInsert}
		class="mt-1 rounded bg-neutral-900 px-2 py-1.5 text-xs text-white hover:bg-neutral-700"
	>
		Add Image Node
	</button>
</div>

<style>
	.image-flyout {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 320px;
		padding: 0.5rem;
	}
</style>
