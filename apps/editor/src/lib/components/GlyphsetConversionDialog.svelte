<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { editorState, updateCode } from '$lib/state/editorState.svelte';
	import { convertGlyphset } from '$lib/utils/glyphsetConversion';
	import Icon from '@iconify/svelte';

	interface Props {
		open: boolean;
		onOpenChange: (open: boolean) => void;
		fromType: string;
		toType: string;
		reason: string;
		canConvert?: boolean;
		onCancel?: () => void;
	}

	let {
		open = $bindable(),
		onOpenChange,
		fromType,
		toType,
		reason,
		canConvert = false,
		onCancel
	}: Props = $props();

	// Determine the type of conversion
	const isFlattening = $derived(
		fromType === 'groupedProcess' ||
			fromType === 'segmentedPyramid' ||
			fromType === 'hub' ||
			fromType === 'labeledHierarchy' ||
			fromType === 'tableHierarchy' ||
			['segmentedMatrix', 'titledMatrix', 'matrix2x2', 'matrix3x3'].includes(fromType)
	);
	const isExpanding = $derived(
		toType === 'groupedProcess' || toType === 'segmentedPyramid' || toType === 'hub'
	);

	// Handle convert with transform
	function handleConvertWithTransform() {
		const code = editorState.code;

		const result = convertGlyphset(code, toType);

		if (!result.success) {
			const errorMsg = result.errors.join('\n');
			alert(`Cannot convert glyphset:\n\n${errorMsg}`);
			return;
		}

		// Show warnings if any
		if (result.warnings.length > 0) {
			const warningMsg = result.warnings.join('\n• ');
			console.warn(`Glyphset conversion warnings:\n• ${warningMsg}`);
		}

		updateCode(result.newCode, true); // Add to history so it can be undone
		onOpenChange(false); // Close dialog
	}

	// Get structure examples for glyphset types
	function getStructureExample(type: string): string {
		const examples: Record<string, string> = {
			groupedProcess: `glyphset groupedProcess "Title" {
  group "Team A" {
    item "Task 1"
    item "Task 2"
  }
  group "Team B" {
    item "Task 3"
  }
  mergePoint "Result"
}`,
			basicProcess: `glyphset basicProcess "Title" {
  item "Step 1"
  item "Step 2"
  item "Step 3"
}`,
			basicList: `glyphset basicList "Title" {
  item "Item 1"
  item "Item 2"
  item "Item 3"
}`,
			equation: `glyphset equation "Title" {
  input "A"
  operator "+"
  input "B"
  result "C"
}`,
			balance: `glyphset balance "Title" {
  item"Left Option"
  item"Right Option"
}`,
			hub: `glyphset hub "Title" {
  center "Core"
  spoke "Branch 1"
  spoke "Branch 2"
  spoke "Branch 3"
}`,
			detailedProcess: `glyphset detailedProcess "Title" {
  item "Main | Sub 1 | Sub 2"
  item "Another | Detail"
}`,
			pictureProcess: `glyphset pictureProcess "Title" {
  image "url" label "Text"
  image "url" label "Text"
}`,
			segmentedPyramid: `glyphset segmentedPyramid "Title" {
  level "Top" {
    item "Expert Topic"
  }
  level "Middle" {
    item "Topic A"
    item "Topic B"
  }
}`,
			labeledHierarchy: `glyphset labeledHierarchy "Title" {
  root "Manager"
  child "Lead" oversees
  child "Dev" manages
}`,
			tableHierarchy: `glyphset tableHierarchy "Title" {
  level "UI Layer"
  level "Service A" BusinessLogic
  level "Service B" BusinessLogic
  level "Database" DataAccess
}`,
			circleHierarchy: `glyphset circleHierarchy "Title" {
  root "Core Concept"
  child "Related Topic"
  child "Another Topic"
  child "Third Topic"
}`
		};
		return examples[type] || `glyphset ${type} "Title" {\n  item "Example"\n}`;
	}

	// Get friendly name for glyphset type
	function getFriendlyName(type: string): string {
		const names: Record<string, string> = {
			groupedProcess: 'Grouped Process',
			basicProcess: 'Basic Process',
			basicList: 'Basic List',
			equation: 'Equation',
			balance: 'Balance',
			hub: 'Hub',
			detailedProcess: 'Detailed Process',
			pictureProcess: 'Picture Process',
			chevronList: 'Chevron List',
			pyramid: 'Pyramid',
			segmentedPyramid: 'Segmented Pyramid',
			labeledHierarchy: 'Labeled Hierarchy',
			tableHierarchy: 'Table Hierarchy',
			circleHierarchy: 'Circle Hierarchy',
			funnel: 'Funnel'
		};
		return names[type] || type;
	}

	function handleClose() {
		onCancel?.();
		onOpenChange(false);
	}
</script>

<Dialog.Root bind:open {onOpenChange}>
	<Dialog.Content class="max-h-[90vh] max-w-3xl overflow-y-auto bg-white dark:bg-gray-900">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2 text-gray-900 dark:text-gray-100">
				<Icon icon="mdi:alert-circle-outline" class="text-yellow-500" width="24" />
				Cannot Convert Glyphset Structure
			</Dialog.Title>
			<Dialog.Description class="text-base text-gray-700 dark:text-gray-300">
				{reason}
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-6 py-4">
			<!-- Structure Comparison -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<!-- Current Structure -->
				<div class="space-y-2">
					<h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
						Current: {getFriendlyName(fromType)}
					</h3>
					<div class="overflow-x-auto rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
						<pre
							class="font-mono text-xs whitespace-pre text-gray-800 dark:text-gray-200">{getStructureExample(
								fromType
							)}</pre>
					</div>
				</div>

				<!-- Target Structure -->
				<div class="space-y-2">
					<h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
						Target: {getFriendlyName(toType)}
					</h3>
					<div class="overflow-x-auto rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
						<pre
							class="font-mono text-xs whitespace-pre text-gray-800 dark:text-gray-200">{getStructureExample(
								toType
							)}</pre>
					</div>

					<!-- Convert Button -->
					{#if canConvert}
						<Button
							variant="default"
							class="w-full bg-runiq-500 hover:bg-runiq-600"
							onclick={handleConvertWithTransform}
						>
							{#if isFlattening}
								<Icon icon="mdi:unfold-less-horizontal" class="mr-2" width="18" />
								Flatten and Convert
							{:else if isExpanding}
								<Icon icon="mdi:folder-multiple-outline" class="mr-2" width="18" />
								Group and Convert
							{:else}
								<Icon icon="mdi:swap-horizontal" class="mr-2" width="18" />
								Convert
							{/if}
						</Button>
						<p class="text-xs text-gray-600 dark:text-gray-400">
							{#if isFlattening}
								This will remove group blocks and merge all items into a flat list.
							{:else if isExpanding}
								This will split items into two groups with a merge point.
							{/if}
						</p>
					{/if}
				</div>
			</div>

			<!-- Key Differences -->
			<div class="space-y-2 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/50">
				<h3 class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
					<Icon icon="mdi:information-outline" class="text-blue-600 dark:text-blue-400" />
					Key Differences
				</h3>
				<ul class="ml-6 list-disc space-y-1 text-sm text-gray-800 dark:text-gray-200">
					{#if fromType === 'groupedProcess'}
						<li>
							Grouped Process uses nested <code class="rounded bg-gray-200 px-1 dark:bg-gray-700"
								>group</code
							> blocks with items inside
						</li>
						<li>Most glyphsets use a flat list of items without grouping</li>
						<li>
							The <code class="rounded bg-gray-200 px-1 dark:bg-gray-700">mergePoint</code> feature is
							unique to Grouped Process
						</li>
					{:else if toType === 'groupedProcess'}
						<li>
							Grouped Process requires nested structure with <code
								class="rounded bg-gray-200 px-1 dark:bg-gray-700">group</code
							> blocks
						</li>
						<li>Simple item lists cannot be automatically grouped without context</li>
						<li>Consider which items should belong to which group</li>
						<li class="font-semibold text-blue-700 dark:text-blue-300">
							💡 Tip: Choose an alternative below, or manually edit your code to add group blocks
						</li>
					{:else if fromType === 'equation' || toType === 'equation'}
						<li>Equation uses a fixed structure: inputs, operator, and result</li>
						<li>Cannot be converted to/from other glyphset types</li>
					{:else if fromType === 'hub' || toType === 'hub'}
						<li>
							Hub requires a central <code class="rounded bg-gray-200 px-1 dark:bg-gray-700"
								>center</code
							>
							item and <code class="rounded bg-gray-200 px-1 dark:bg-gray-700">spoke</code> items
						</li>
						<li>This radial structure differs from sequential or hierarchical layouts</li>
					{:else if fromType === 'labeledHierarchy' || toType === 'labeledHierarchy'}
						<li>
							Labeled Hierarchy uses <code class="rounded bg-gray-200 px-1 dark:bg-gray-700"
								>root</code
							>
							and <code class="rounded bg-gray-200 px-1 dark:bg-gray-700">child</code> with edge labels
						</li>
						<li>Edge labels define relationships between nodes (e.g., 'manages', 'oversees')</li>
						<li>Most glyphsets don't support relationship labels</li>
					{:else if fromType === 'tableHierarchy' || toType === 'tableHierarchy'}
						<li>
							Table Hierarchy uses <code class="rounded bg-gray-200 px-1 dark:bg-gray-700"
								>level</code
							>
							items with category tags (e.g., BusinessLogic, DataAccess)
						</li>
						<li>Category tags organize items into architectural layers</li>
						<li>Most glyphsets don't support categorization</li>
					{:else if fromType === 'circleHierarchy' || toType === 'circleHierarchy'}
						<li>
							Circle Hierarchy uses <code class="rounded bg-gray-200 px-1 dark:bg-gray-700"
								>root</code
							>
							and <code class="rounded bg-gray-200 px-1 dark:bg-gray-700">child</code> in a circular
							layout
						</li>
						<li>First item is the root (center), others are children (around the circle)</li>
						<li>This hierarchical structure differs from flat lists</li>
					{:else if fromType === 'segmentedPyramid' || toType === 'segmentedPyramid'}
						<li>
							Segmented Pyramid uses nested <code class="rounded bg-gray-200 px-1 dark:bg-gray-700"
								>level</code
							> blocks with items inside
						</li>
						<li>Each level can contain multiple items</li>
						<li>Most glyphsets use a flat list without levels</li>
					{:else}
						<li>These glyphset types have incompatible structural requirements</li>
						<li>Manual conversion would require restructuring your data</li>
						<li class="font-semibold text-blue-700 dark:text-blue-300">
							💡 Tip: You may need to manually edit your code to match the target structure
						</li>
					{/if}
				</ul>
			</div>
		</div>

		<Dialog.Footer
			class="flex-col gap-2 border-t border-gray-200 pt-4 sm:flex-row dark:border-gray-700"
		>
			<Button
				variant="outline"
				onclick={handleClose}
				class="flex-1 border-gray-300 bg-white hover:bg-gray-50 sm:flex-none dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
			>
				<Icon icon="mdi:close" class="mr-2" width="18" />
				Cancel
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
