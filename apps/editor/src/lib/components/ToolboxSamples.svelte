<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import { Search, X, ChevronDown, ChevronRight } from 'lucide-svelte';

	interface Sample {
		name: string;
		description: string;
		code: string;
	}

	interface SampleCategory {
		id: string;
		label: string;
		samples: Sample[];
	}

	interface Props {
		categories: SampleCategory[];
		onInsertSample: (sampleCode: string) => void;
	}

	let { categories, onInsertSample }: Props = $props();

	// Search state
	let searchQuery = $state('');
	let expandedCategories = $state<string[]>([]);

	// Filter categories and samples based on search
	let filteredCategories = $derived.by(() => {
		if (!searchQuery.trim()) return categories;

		const query = searchQuery.toLowerCase();
		return categories
			.map((cat) => ({
				...cat,
				samples: cat.samples.filter(
					(sample) =>
						sample.name.toLowerCase().includes(query) ||
						sample.description.toLowerCase().includes(query)
				)
			}))
			.filter((cat) => cat.samples.length > 0);
	});

	// Total samples count
	let totalSamples = $derived(
		filteredCategories.reduce((sum, cat) => sum + cat.samples.length, 0)
	);

	// Auto-expand categories when searching
	$effect(() => {
		if (searchQuery.trim()) {
			expandedCategories = filteredCategories.map((cat) => cat.id);
		}
	});

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
	<!-- Search bar -->
	<div class="border-b border-neutral-200 p-3">
		<div class="relative">
			<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search samples..."
				class="w-full rounded-md border border-neutral-300 py-2 pl-9 pr-9 text-sm focus:border-runiq-500 focus:outline-none focus:ring-1 focus:ring-runiq-500"
			/>
			{#if searchQuery}
				<button
					onclick={clearSearch}
					class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
				>
					<X class="h-4 w-4" />
				</button>
			{/if}
		</div>
	</div>

	<!-- Stats and controls -->
	<div class="flex items-center justify-between border-b border-neutral-200 px-3 py-2">
		<p class="text-xs text-neutral-600">
			{totalSamples} sample{totalSamples !== 1 ? 's' : ''} across {filteredCategories.length} categor{filteredCategories.length !==
			1
				? 'ies'
				: 'y'}
		</p>
		<div class="flex gap-1">
			<button
				onclick={expandAll}
				class="rounded px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
			>
				Expand All
			</button>
			<button
				onclick={collapseAll}
				class="rounded px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
			>
				Collapse All
			</button>
		</div>
	</div>

	<!-- Sample categories -->
	<div class="flex-1 overflow-auto">
		<Accordion.Root type="multiple" bind:value={expandedCategories} class="w-full">
			{#each filteredCategories as category}
				<Accordion.Item value={category.id}>
					<Accordion.Trigger class="px-4 py-2 text-sm font-medium hover:bg-neutral-50">
						<span class="flex items-center gap-2">
							{category.label}
							<span class="text-xs text-neutral-500">({category.samples.length})</span>
						</span>
					</Accordion.Trigger>
					<Accordion.Content>
						<div class="space-y-2 p-2">
							{#each category.samples as sample}
								<button
									class="w-full rounded-md border border-neutral-200 bg-white p-3 text-left transition-colors hover:border-runiq-200 hover:bg-runiq-50 cursor-pointer"
									onclick={() => onInsertSample(sample.code)}
								>
									<p class="text-sm font-medium text-neutral-900">{sample.name}</p>
									<p class="mt-1 text-xs text-neutral-600">{sample.description}</p>
								</button>
							{/each}
						</div>
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</div>
</div>
