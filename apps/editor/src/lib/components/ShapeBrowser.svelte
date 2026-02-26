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
	import { getShapeIconDebugInfo } from './icons/iconProvider';

	const categories = $derived(
		editorState.profileName ? getShapeCategoryByProfile(editorState.profileName) : []
	);

	let searchQuery = $state('');
	let expandedCategories = $state<string[]>([]);
	let showIconDiagnostics = $state(false);

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

	let iconDiagnostics = $derived.by(() => {
		if (!import.meta.env.DEV || !editorState.profileName) {
			return { total: 0, placeholderCount: 0, bySource: [] as Array<[string, number]> };
		}

		const counts = new Map<string, number>();
		let total = 0;
		let placeholderCount = 0;

		for (const category of filteredCategories) {
			for (const shape of category.shapes) {
				total += 1;
				const info = getShapeIconDebugInfo({
					shapeId: shape.id,
					profileName: editorState.profileName,
					size: 24
				});
				counts.set(info.source, (counts.get(info.source) ?? 0) + 1);
				if (info.source.startsWith('placeholder')) {
					placeholderCount += 1;
				}
			}
		}

		const bySource = [...counts.entries()].sort((a, b) => b[1] - a[1]);
		return { total, placeholderCount, bySource };
	});

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
		{#if import.meta.env.DEV}
			<div class="mt-2">
				<button
					type="button"
					class="rounded border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-100"
					onclick={() => (showIconDiagnostics = !showIconDiagnostics)}
				>
					{showIconDiagnostics ? 'Hide' : 'Show'} icon diagnostics
				</button>
			</div>
			{#if showIconDiagnostics}
				<div class="mt-2 rounded border border-amber-300 bg-amber-50 p-2 text-[11px] text-amber-900">
					<div>Total: {iconDiagnostics.total}</div>
					<div>Placeholders: {iconDiagnostics.placeholderCount}</div>
					{#each iconDiagnostics.bySource as [source, count]}
						<div>{source}: {count}</div>
					{/each}
				</div>
			{/if}
		{/if}
	</div>

	<!-- Shape categories -->
	<div class="flex-1 overflow-y-auto">
		<Accordion.Root type="multiple" bind:value={expandedCategories} class="w-full px-2">
			{#each filteredCategories as category (category.id)}
				<Accordion.Item value={category.id} class="border-none">
					<Accordion.Trigger
						class="flex w-full items-center gap-2 rounded px-2 py-2 text-sm font-medium hover:bg-neutral-100"
					>
						<div class="flex min-w-0 flex-1 items-center gap-2">
							<span class="min-w-0 flex-1 truncate">{category.label}</span>
							<span class="w-10 text-right text-xs text-gray-500 tabular-nums"
								>({category.shapes.length})</span
							>
						</div>
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
										{#if import.meta.env.DEV}
											<p class="mt-1 text-[10px] opacity-80">
												{getShapeIconDebugInfo({
													shapeId: shape.id,
													profileName: editorState.profileName,
													size: 24
												}).source}
											</p>
										{/if}
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
