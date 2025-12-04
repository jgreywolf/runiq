<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import {
		flattenGroupedProcess,
		expandToGroupedProcess,
		flattenSegmentedPyramid,
		flattenMatrix,
		convertGlyphset
	} from '$lib/utils/glyphsetConversion';
	import { editorState, updateCode } from '$lib/state/editorState.svelte';

	interface Props {
		open: boolean;
		onOpenChange: (open: boolean) => void;
		fromType: string;
		toType: string;
		reason: string;
		alternatives?: string[];
		canConvert?: boolean;
		onSelectAlternative?: (altType: string) => void;
		onCancel?: () => void;
	}

	let {
		open = $bindable(),
		onOpenChange,
		fromType,
		toType,
		reason,
		alternatives = [],
		canConvert = false,
		onSelectAlternative,
		onCancel
	}: Props = $props();

	// Determine the type of conversion
	const isFlattening = $derived(
		fromType === 'groupedProcess' ||
			fromType === 'segmentedPyramid' ||
			['segmentedMatrix', 'titledMatrix', 'matrix2x2', 'matrix3x3'].includes(fromType)
	);
	const isExpanding = $derived(toType === 'groupedProcess');

	// Handle convert with transform
	function handleConvertWithTransform() {
		const code = editorState.code;
		let result;

		// Flatten if converting FROM groupedProcess
		if (fromType === 'groupedProcess') {
			result = flattenGroupedProcess(code, toType);
		}
		// Flatten if converting FROM segmentedPyramid
		else if (fromType === 'segmentedPyramid') {
			result = flattenSegmentedPyramid(code, toType);
		}
		// Flatten if converting FROM/TO matrix types
		else if (
			['segmentedMatrix', 'titledMatrix', 'matrix2x2', 'matrix3x3'].includes(fromType) ||
			['segmentedMatrix', 'titledMatrix', 'matrix2x2', 'matrix3x3'].includes(toType)
		) {
			result = flattenMatrix(code, toType);
		}
		// Expand if converting TO groupedProcess
		else if (toType === 'groupedProcess') {
			result = expandToGroupedProcess(code);
		} else {
			// Fallback to regular conversion
			result = convertGlyphset(code, toType);
		}

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
  side "Left Option"
  side "Right Option"
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
			funnel: 'Funnel'
		};
		return names[type] || type;
	}

	function handleAlternativeClick(altType: string) {
		onSelectAlternative?.(altType);
		onOpenChange(false);
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
								Flatten and Convert to {getFriendlyName(toType)}
							{:else if isExpanding}
								<Icon icon="mdi:folder-multiple-outline" class="mr-2" width="18" />
								Group and Convert to {getFriendlyName(toType)}
							{:else}
								<Icon icon="mdi:swap-horizontal" class="mr-2" width="18" />
								Convert to {getFriendlyName(toType)}
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
					{:else}
						<li>These glyphset types have incompatible structural requirements</li>
						<li>Manual conversion would require restructuring your data</li>
					{/if}
				</ul>
			</div>

			<!-- Alternatives -->
			{#if alternatives.length > 0}
				<div class="space-y-3">
					<h3
						class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100"
					>
						<Icon icon="mdi:lightbulb-outline" class="text-green-600 dark:text-green-400" />
						{toType === 'groupedProcess' ? 'Recommended Alternatives' : 'Compatible Alternatives'}
					</h3>
					<p class="text-sm text-gray-700 dark:text-gray-300">
						{#if toType === 'groupedProcess'}
							Instead of Grouped Process, try one of these similar glyphset types:
						{:else}
							These glyphset types have similar structures and can be converted:
						{/if}
					</p>
					<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
						{#each alternatives as alt}
							<Button
								variant="outline"
								class="h-auto justify-start border-gray-300 bg-white px-4 py-3 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
								onclick={() => handleAlternativeClick(alt)}
							>
								<div class="flex flex-col items-start gap-1">
									<span class="font-medium text-gray-900 dark:text-gray-100"
										>{getFriendlyName(alt)}</span
									>
									<span class="text-xs text-gray-600 dark:text-gray-400">Click to convert</span>
								</div>
							</Button>
						{/each}
					</div>
				</div>
			{/if}
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
			{#if alternatives.length === 0 && !canConvert}
				<Button
					variant="default"
					onclick={handleClose}
					class="flex-1 bg-runiq-500 hover:bg-runiq-600 sm:flex-none"
				>
					<Icon icon="mdi:check" class="mr-2" width="18" />
					OK
				</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
