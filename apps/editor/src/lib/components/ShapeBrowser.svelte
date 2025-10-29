<script lang="ts">
	import { Search, X } from 'lucide-svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import ShapeIcon from './ShapeIcon.svelte';
	import type { ShapeCategory } from '$lib/data/toolbox-data';

	interface Props {
		categories: ShapeCategory[];
		onInsertShape: (shapeCode: string) => void;
	}

	let { categories, onInsertShape }: Props = $props();

	let searchQuery = $state('');
	let shapeCounter = $state(1);
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

	function insertShape(shapeCode: string) {
		// Replace placeholder ID with unique ID
		const uniqueCode = shapeCode.replace('id', `id${shapeCounter}`);
		shapeCounter++;
		onInsertShape(uniqueCode);
	}

	function clearSearch() {
		searchQuery = '';
	}

	function expandAll() {
		expandedCategories = categories.map((cat) => cat.id);
	}

	function collapseAll() {
		expandedCategories = [];
	}
</script>

<div class="flex h-full flex-col">
	<!-- Search Bar -->
	<div class="border-b border-neutral-200 bg-white p-3">
		<div class="relative">
			<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search shapes..."
				class="w-full rounded-md border border-neutral-300 py-2 pr-9 pl-10 text-sm transition-colors focus:border-runiq-400 focus:ring-2 focus:ring-runiq-200 focus:outline-none"
			/>
			{#if searchQuery}
				<button
					onclick={clearSearch}
					class="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
					aria-label="Clear search"
				>
					<X class="h-4 w-4" />
				</button>
			{/if}
		</div>

		<!-- Search Stats & Controls -->
		<div class="mt-2 flex items-center justify-between text-xs text-neutral-500">
			<span>
				{#if searchQuery}
					{totalShapes} result{totalShapes !== 1 ? 's' : ''} found
				{:else}
					{categories.length} categories, {categories.reduce(
						(sum, cat) => sum + cat.shapes.length,
						0
					)}
					shapes
				{/if}
			</span>
			{#if !searchQuery}
				<div class="flex gap-2">
					<button onclick={expandAll} class="text-runiq-600 hover:text-runiq-700 hover:underline">
						Expand All
					</button>
					<span>|</span>
					<button onclick={collapseAll} class="text-runiq-600 hover:text-runiq-700 hover:underline">
						Collapse All
					</button>
				</div>
			{/if}
		</div>
	</div>

	<!-- Shape Categories -->
	<div class="flex-1 overflow-y-auto">
		{#if filteredCategories.length === 0}
			<div class="flex flex-col items-center justify-center p-8 text-center">
				<Search class="mb-3 h-12 w-12 text-neutral-300" />
				<p class="text-sm font-medium text-neutral-700">No shapes found</p>
				<p class="mt-1 text-xs text-neutral-500">Try a different search term</p>
			</div>
		{:else}
			<Accordion.Root type="multiple" bind:value={expandedCategories} class="w-full">
				{#each filteredCategories as category (category.id)}
					<Accordion.Item value={category.id}>
						<Accordion.Trigger class="px-4 py-2 text-sm font-medium hover:bg-neutral-50">
							<span class="flex items-center gap-2">
								{category.label}
								<span class="rounded-full bg-neutral-200 px-2 py-0.5 text-xs text-neutral-600">
									{category.shapes.length}
								</span>
							</span>
						</Accordion.Trigger>
						<Accordion.Content>
							<div class="grid grid-cols-4 gap-1 p-2">
								{#each category.shapes as shape (shape.id)}
									<Tooltip.Root>
										<Tooltip.Trigger
											class="group flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-md border border-transparent p-1 transition-all hover:border-runiq-300 hover:bg-runiq-50 hover:shadow-sm active:scale-95"
											onclick={() => insertShape(shape.code)}
										>
											<ShapeIcon shapeId={shape.id} size={24} />
											<span
												class="line-clamp-1 max-w-full text-[10px] text-neutral-500 group-hover:text-runiq-700"
											>
												{shape.id}
											</span>
										</Tooltip.Trigger>
										<Tooltip.Content
											side="right"
											class="max-w-xs border border-neutral-300 bg-white text-neutral-900 shadow-lg"
											sideOffset={8}
											arrowClasses="bg-white border-l border-t border-neutral-300"
										>
											<div class="space-y-1">
												<p class="text-xs font-semibold">{shape.label}</p>
												<p class="font-mono text-xs text-neutral-500">@{shape.id}</p>
												<p class="text-xs text-neutral-400 italic">Click to insert</p>
											</div>
										</Tooltip.Content>
									</Tooltip.Root>
								{/each}
							</div>
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
		{/if}
	</div>
</div>
