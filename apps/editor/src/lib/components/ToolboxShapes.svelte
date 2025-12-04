<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import type { ShapeCategory } from '$lib/data/toolbox-data';
	import ShapeIcon from './ShapeIcon.svelte';

	interface Props {
		categories: ShapeCategory[];
		onInsertShape: (shapeCode: string) => void;
	}

	let { categories, onInsertShape }: Props = $props();

	let shapeCounter = $state(1);

	function insertShape(shapeCode: string) {
		// Replace placeholder ID with unique ID (word boundary to avoid replacing 'id' in 'pyramid')
		const uniqueCode = shapeCode.replace(/\bid\b/g, `id${shapeCounter}`);
		shapeCounter++;
		onInsertShape(uniqueCode);
	}
</script>

<Accordion.Root type="multiple" class="w-full">
	{#each categories as category}
		<Accordion.Item value={category.id}>
			<Accordion.Trigger class="px-4 py-2 text-sm font-medium hover:bg-neutral-50">
				{category.label}
			</Accordion.Trigger>
			<Accordion.Content>
				<div class="grid grid-cols-4 gap-0.5 p-1">
					{#each category.shapes as shape}
						<Tooltip.Root>
							<Tooltip.Trigger
								class="flex h-14 w-14 items-center justify-center rounded-md border border-transparent transition-colors hover:border-runiq-200 hover:bg-runiq-50 hover:text-runiq-700"
								onclick={() => insertShape(shape.code)}
							>
								<ShapeIcon shapeId={shape.id} size={32} />
							</Tooltip.Trigger>
							<Tooltip.Content
								side="top"
								class="max-w-xs border border-neutral-300 bg-white text-neutral-900 shadow-lg"
								sideOffset={4}
								arrowClasses="bg-white border-r border-b border-neutral-300"
							>
								<p class="text-xs font-medium">{shape.label}</p>
							</Tooltip.Content>
						</Tooltip.Root>
					{/each}
				</div>
			</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
