<script lang="ts">
	import { getShapeCategoryByProfile } from '$lib/data/toolbox-data';
	import { ProfileName } from '$lib/types';
	import ShapeIcon from './ShapeIcon.svelte';

	interface Props {
		profileName: ProfileName;
		iconSize?: number;
		onSelect: (shapeCode: string) => void;
	}

	let { profileName, iconSize = 12, onSelect }: Props = $props();

	const HIDDEN_CATEGORY_IDS = new Set(['containers', 'special']);
	const categories = $derived(
		getShapeCategoryByProfile(profileName).filter((category) => !HIDDEN_CATEGORY_IDS.has(category.id))
	);
</script>

<div class="shape-picker-flyout">
	{#each categories as category (category.id)}
		<div class="shape-picker-category">
			<div class="shape-picker-category-title">{category.label}</div>
			<div class="shape-picker-grid">
				{#each category.shapes as shape (`${profileName}-${category.id}-${shape.id}`)}
					<button
						type="button"
						class="shape-picker-item"
						title={shape.label}
						onclick={() => onSelect(shape.code)}
					>
						<ShapeIcon shapeId={shape.id} size={iconSize} profileName={profileName} />
					</button>
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	.shape-picker-flyout {
		max-height: min(62vh, 480px);
		width: 320px;
		overflow: auto;
		padding: 0.5rem;
	}

	.shape-picker-category + .shape-picker-category {
		margin-top: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid #e5e7eb;
	}

	.shape-picker-category-title {
		margin: 0 0 0.25rem 0.1rem;
		font-size: 11px;
		font-weight: 600;
		color: #4b5563;
	}

	.shape-picker-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(22px, 1fr));
		gap: 0.25rem;
	}

	.shape-picker-item {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 22px;
		width: 22px;
		border: 1px solid #e5e7eb;
		border-radius: 4px;
		background: #fff;
		padding: 0;
	}

	.shape-picker-item:hover {
		border-color: #93c5fd;
		background: #eff6ff;
	}
</style>
