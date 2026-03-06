<script lang="ts">
	import { getShapeCategoryByProfile } from '$lib/data/toolbox-data';
	import { ProfileName } from '$lib/types';
	import Icon from '@iconify/svelte';

	interface Props {
		profileName: ProfileName;
		onSelect: (shapeCode: string) => void;
	}

	let { profileName, onSelect }: Props = $props();

	const categories = $derived(
		getShapeCategoryByProfile(profileName).filter((category) => category.id === 'containers')
	);
</script>

<div class="container-picker-flyout">
	{#each categories as category (category.id)}
		<div class="container-picker-category">
			<div class="container-picker-category-title">{category.label}</div>
			<div class="container-picker-list">
				{#each category.shapes as shape (`${profileName}-${category.id}-${shape.id}`)}
					<button
						type="button"
						class="container-picker-item"
						title={shape.label}
						onclick={() => onSelect(shape.code.trim())}
					>
						<Icon icon="lucide:box" width="12" height="12" />
						<span>{shape.label}</span>
					</button>
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	.container-picker-flyout {
		max-height: min(62vh, 480px);
		width: 320px;
		overflow: auto;
		padding: 0.5rem;
	}

	.container-picker-category-title {
		margin: 0 0 0.25rem 0.1rem;
		font-size: 11px;
		font-weight: 600;
		color: #4b5563;
	}

	.container-picker-list {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.container-picker-item {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		border: 1px solid #e5e7eb;
		background: #fff;
		border-radius: 6px;
		padding: 0.35rem 0.45rem;
		font-size: 11px;
		color: #1f2937;
		text-align: left;
	}

	.container-picker-item:hover {
		border-color: #93c5fd;
		background: #eff6ff;
	}
</style>
