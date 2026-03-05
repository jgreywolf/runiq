<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { SampleCategory } from '$lib/data/sample-data';
	import Icon from '@iconify/svelte';

	interface Props {
		open: boolean;
		onOpenChange: (open: boolean) => void;
		categories: SampleCategory[];
		onInsertSample: (sampleCode: string, sampleData?: string) => void;
	}

	let { open = $bindable(), onOpenChange, categories, onInsertSample }: Props = $props();

	// Profile grouping
	interface ProfileGroup {
		id: string;
		label: string;
		description: string;
		color: string;
		icon: string;
		categoryIds: string[];
	}

	const profileGroups: ProfileGroup[] = [
		{
			id: 'basic',
			label: 'Basic Diagrams',
			description: 'Flowcharts, containers, templates',
			color: 'runiq',
			icon: 'diagram',
			categoryIds: [
				'flowcharts',
				'containers',
				'templatesPresets',
				'templates',
				'network',
				'c4'
			]
		},
		{
			id: 'glyphsets',
			label: 'Smart Templates',
			description: 'Pre-built patterns for common diagrams',
			color: 'pink',
			icon: 'template',
			categoryIds: [
				'glyphsetsProcess',
				'glyphsetsHierarchy',
				'glyphsetsComparison',
				'glyphsetsRelationship',
				'glyphsetsList',
				'glyphsetsVisualization'
			]
		},
		{
			id: 'uml',
			label: 'UML Diagrams',
			description: 'Activity, state, sequence, use case',
			color: 'blue',
			icon: 'uml',
			categoryIds: ['class', 'uml', 'activity', 'stateMachine', 'sequence']
		},
		{
			id: 'technical',
			label: 'Technical Schematics',
			description: 'Electrical, pneumatic, hydraulic, HVAC',
			color: 'amber',
			icon: 'circuit',
			categoryIds: [
				'electrical',
				'control',
				'digital',
				'logicGates',
				'pneumatic',
				'hydraulic',
				'hvac',
				'railroad'
			]
		},
		{
			id: 'data',
			label: 'Data Visualization',
			description: 'Charts, mindmaps, quantum',
			color: 'purple',
			icon: 'chart',
			categoryIds: ['charts', 'mindmap', 'quantum']
		},
		{
			id: 'specialized',
			label: 'Specialized',
			description: 'Wardley, timeline, pedigree',
			color: 'emerald',
			icon: 'specialized',
			categoryIds: ['wardley', 'timeline', 'pedigree']
		}
	];

	let selectedProfile = $state<string | null>(null);
	let searchQuery = $state('');
	let globalSearchQuery = $state('');

	// Get categories for selected profile
	let displayedCategories = $derived.by(() => {
		if (!selectedProfile) return [];
		const profile = profileGroups.find((p) => p.id === selectedProfile);
		if (!profile) return [];
		return categories.filter((cat) => profile.categoryIds.includes(cat.id));
	});

	// Filter samples within displayed categories
	let filteredCategories = $derived.by(() => {
		if (!searchQuery.trim()) return displayedCategories;
		const query = searchQuery.toLowerCase();
		return displayedCategories
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

	// Global search across all categories
	let globalFilteredCategories = $derived.by(() => {
		if (!globalSearchQuery.trim()) return [];
		const query = globalSearchQuery.toLowerCase();
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

	function selectProfile(profileId: string) {
		selectedProfile = profileId;
		searchQuery = '';
		globalSearchQuery = '';
	}

	function goBack() {
		selectedProfile = null;
		searchQuery = '';
		globalSearchQuery = '';
	}

	function handleInsertSample(code: string, data?: string) {
		onInsertSample(code, data);
		open = false;
	}

	function getIconSvg(iconType: string) {
		switch (iconType) {
			case 'diagram':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />`;
			case 'uml':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />`;
			case 'circuit':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />`;
			case 'chart':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />`;
			case 'specialized':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />`;
			case 'template':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />`;
			default:
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`;
		}
	}
</script>

<Dialog.Root bind:open {onOpenChange}>
	<Dialog.Content class="bg-white sm:max-w-4xl">
		<Dialog.Header>
			<Dialog.Title class="text-neutral-900">
				{selectedProfile ? 'Browse Samples' : 'Sample Diagram Library'}
			</Dialog.Title>
			<Dialog.Description class="text-neutral-600">
				{selectedProfile
					? 'Click a sample to insert it into your diagram'
					: 'Choose a category to explore sample diagrams'}
			</Dialog.Description>
		</Dialog.Header>

		{#if !selectedProfile}
			<div class="flex items-center gap-3 py-2">
				<div class="relative flex-1">
					<Icon
						icon="lucide:search"
						width="16"
						height="16"
						class="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
					/>
					<input
						type="text"
						bind:value={globalSearchQuery}
						placeholder="Search all samples..."
						class="w-full rounded-md border border-neutral-300 py-2 pr-9 pl-9 text-sm focus:border-runiq-500 focus:ring-1 focus:ring-runiq-500 focus:outline-none"
					/>
					{#if globalSearchQuery}
						<button
							onclick={() => (globalSearchQuery = '')}
							class="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
						>
							<Icon icon="lucide:x" class="h-4 w-4" />
						</button>
					{/if}
				</div>
			</div>

			{#if globalFilteredCategories.length > 0}
				<div class="max-h-[520px] space-y-4 overflow-auto py-2">
					{#each globalFilteredCategories as category}
						<div>
							<h4 class="mb-2 px-1 text-sm font-semibold text-neutral-700">
								{category.label}
								<span class="ml-1 text-xs font-normal text-neutral-500"
									>({category.samples.length})</span
								>
							</h4>
							<div class="grid gap-2 sm:grid-cols-2">
								{#each category.samples as sample}
									<button
										onclick={() => handleInsertSample(sample.code, sample.data)}
										class="flex cursor-pointer flex-col rounded-md border border-neutral-200 bg-white p-3 text-left transition-colors hover:border-runiq-300 hover:bg-runiq-50"
									>
										<p class="text-sm font-medium text-neutral-900">{sample.name}</p>
										<p class="mt-1 text-xs text-neutral-600">{sample.description}</p>
										{#if sample.badges?.length}
											<div class="mt-2 flex flex-wrap gap-1">
												{#each sample.badges as badge}
													<span
														class="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-700"
													>
														{badge}
													</span>
												{/each}
											</div>
										{/if}
									</button>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{:else if globalSearchQuery.trim().length > 0}
				<div class="flex flex-col items-center justify-center py-12 text-center">
					<Icon icon="lucide:file-text" width="48" height="48" class="mb-3 text-neutral-300" />
					<p class="text-sm text-neutral-600">No samples found</p>
					<p class="mt-1 text-xs text-neutral-500">Try a different search term</p>
				</div>
			{:else}
			<!-- Profile Grid View -->
			<div class="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3">
				{#each profileGroups as profile}
					<button
						onclick={() => selectProfile(profile.id)}
						class="group flex cursor-pointer flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-{profile.color}-400 hover:bg-{profile.color}-50"
					>
						<div
							class="flex h-12 w-12 items-center justify-center rounded-lg bg-{profile.color}-100 text-{profile.color}-600 transition-colors group-hover:bg-{profile.color}-200"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								{@html getIconSvg(profile.icon)}
							</svg>
						</div>
						<div>
							<h3 class="font-semibold text-neutral-900">{profile.label}</h3>
							<p class="mt-1 text-xs text-neutral-600">{profile.description}</p>
							<p class="mt-2 text-xs font-medium text-{profile.color}-600">
								{categories.filter((cat) => profile.categoryIds.includes(cat.id)).length} categories
							</p>
						</div>
					</button>
				{/each}
			</div>
			{/if}
		{:else}
			<!-- Sample List View -->
			<div class="flex flex-col gap-4 py-4">
				<!-- Back button and search -->
				<div class="flex items-center gap-3">
					<Button variant="outline" size="sm" onclick={goBack}>← Back</Button>
					<div class="relative flex-1">
						<Icon
							icon="lucide:search"
							width="16"
							height="16"
							class="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
						/>
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Search samples..."
							class="w-full rounded-md border border-neutral-300 py-2 pr-9 pl-9 text-sm focus:border-runiq-500 focus:ring-1 focus:ring-runiq-500 focus:outline-none"
						/>
						{#if searchQuery}
							<button
								onclick={() => (searchQuery = '')}
								class="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
							>
								<Icon icon="lucide:x" class="h-4 w-4" />
							</button>
						{/if}
					</div>
				</div>

				<!-- Sample categories -->
				<div class="max-h-[500px] space-y-4 overflow-auto">
					{#if filteredCategories.length === 0}
						<div class="flex flex-col items-center justify-center py-12 text-center">
							<Icon icon="lucide:file-text" width="48" height="48" class="mb-3 text-neutral-300" />
							<p class="text-sm text-neutral-600">No samples found</p>
							<p class="mt-1 text-xs text-neutral-500">Try a different search term</p>
						</div>
					{:else}
						{#each filteredCategories as category}
							<div>
								<h4 class="mb-2 px-1 text-sm font-semibold text-neutral-700">
									{category.label}
									<span class="ml-1 text-xs font-normal text-neutral-500"
										>({category.samples.length})</span
									>
								</h4>
								<div class="grid gap-2 sm:grid-cols-2">
									{#each category.samples as sample}
										<button
											onclick={() => handleInsertSample(sample.code, sample.data)}
											class="flex cursor-pointer flex-col rounded-md border border-neutral-200 bg-white p-3 text-left transition-colors hover:border-runiq-300 hover:bg-runiq-50"
										>
											<p class="text-sm font-medium text-neutral-900">{sample.name}</p>
											<p class="mt-1 text-xs text-neutral-600">{sample.description}</p>
											{#if sample.badges?.length}
												<div class="mt-2 flex flex-wrap gap-1">
													{#each sample.badges as badge}
														<span
															class="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-700"
														>
															{badge}
														</span>
													{/each}
												</div>
											{/if}
											{#if sample.data}
												<p class="mt-1 text-xs font-medium text-runiq-600">
													📊 Includes sample data
												</p>
											{/if}
										</button>
									{/each}
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		{/if}

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
