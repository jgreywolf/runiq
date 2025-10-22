<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';

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
</script>

<Accordion.Root type="multiple" class="w-full">
	{#each categories as category}
		<Accordion.Item value={category.id}>
			<Accordion.Trigger class="px-4 py-2 text-sm font-medium hover:bg-neutral-50">
				{category.label}
			</Accordion.Trigger>
			<Accordion.Content>
				<div class="space-y-2 p-2">
					{#each category.samples as sample}
						<button
							class="w-full rounded-md border border-neutral-200 bg-white p-3 text-left transition-colors hover:border-runiq-200 hover:bg-runiq-50"
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
