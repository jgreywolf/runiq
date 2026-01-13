<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { getShapeCategoryByProfile } from '$lib/data/toolbox-data';
	import {
		editorState,
		handleInsertShape,
		handleReplaceGlyphset
	} from '$lib/state/editorState.svelte';
	import { ProfileName } from '$lib/types';
	import Icon from '@iconify/svelte';
	import ShapeIcon from './ShapeIcon.svelte';

	const categories = $derived(
		editorState.profileName ? getShapeCategoryByProfile(editorState.profileName) : []
	);

	let searchQuery = $state('');
	let expandedCategories = $state<string[]>([]);

	// Filter shapes based on search query
	let filteredCategories = $derived.by(() => {
		if (!searchQuery.trim()) {
			return categories;
		}

		const query = searchQuery.toLowerCase();
		return categories
			.map((category) => ({
				...category,
				shapes: category.shapes.filter(
					(shape) =>
						shape.id.toLowerCase().includes(query) || shape.label.toLowerCase().includes(query)
				)
			}))
			.filter((category) => category.shapes.length > 0);
	});

	// Count total shapes
	let totalShapes = $derived(filteredCategories.reduce((sum, cat) => sum + cat.shapes.length, 0));

	// Auto-expand all categories when searching
	$effect(() => {
		if (searchQuery.trim()) {
			expandedCategories = filteredCategories.map((cat) => cat.id);
		}
	});

	// Handle shape click based on profile type
	function handleShapeClick(shapeCode: string) {
		if (editorState.profileName === ProfileName.glyphset) {
			handleReplaceGlyphset(shapeCode);
		} else {
			handleInsertShape(shapeCode);
		}
	}

	// Determine search placeholder text
	const itemLabelPlural = $derived(
		editorState.profileName === ProfileName.glyphset ? 'glyphsets' : 'shapes'
	);
</script>

<div class="flex h-full flex-col">
	<!-- Search bar -->
	<div class="border-b border-neutral-200 p-3">
		<div class="relative">
			<Icon icon="material-symbols:search" class="absolute top-2.5 left-3 h-4 w-4 text-gray-500" />
			<input
				type="text"
				placeholder="Search shapes..."
				bind:value={searchQuery}
				class="w-full rounded-md border border-neutral-300 py-2 pr-3 pl-9 text-sm ring-runiq-500 outline-none focus:border-runiq-500 focus:ring-1"
			/>
		</div>
		{#if searchQuery.trim()}
			<div class="mt-2 text-xs text-gray-500">
				{totalShapes}
				{totalShapes === 1 ? 'shape' : 'shapes'} found
			</div>
		{/if}
	</div>

	<!-- Shape categories -->
	<div class="flex-1 overflow-y-auto">
		<Accordion.Root type="multiple" bind:value={expandedCategories} class="w-full px-2">
			{#each filteredCategories as category (category.id)}
				<Accordion.Item value={category.id} class="border-none">
					<Accordion.Trigger
						class="flex w-full items-center justify-between rounded px-2 py-2 text-sm font-medium hover:bg-neutral-100"
					>
						<span>{category.label}</span>
						<span class="text-xs text-gray-500">({category.shapes.length})</span>
					</Accordion.Trigger>
					<Accordion.Content class="pb-2">
						<div
							class="grid grid-cols-[repeat(auto-fit,minmax(60px,1fr))] gap-2 px-2"
							style="grid-template-columns: repeat(auto-fit, minmax(60px, calc(25% - 0.5rem))); max-width: 100%;"
						>
							{#each category.shapes as shape (`${editorState.profileName}-${shape.id}`)}
								<Tooltip.Root>
									<Tooltip.Trigger
										onclick={() => handleShapeClick(shape.code)}
										class="flex flex-col items-center gap-1 rounded border border-neutral-200 p-2 hover:border-runiq-500 hover:bg-runiq-50 active:scale-95"
									>
										<ShapeIcon shapeId={shape.id} size={24} profileName={editorState.profileName} />
									</Tooltip.Trigger>
									<Tooltip.Content
										side="right"
										sideOffset={8}
										class="max-w-xs bg-slate-900 text-white shadow-lg pointer-events-none"
									>
										<p class="text-xs">{shape.label}</p>
									</Tooltip.Content>
								</Tooltip.Root>
							{/each}
						</div>
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>

		{#if filteredCategories.length === 0}
			<div class="px-4 py-8 text-center text-sm text-gray-500">
				No {itemLabelPlural} found for "{searchQuery}"
			</div>
		{/if}
	</div>
</div>
