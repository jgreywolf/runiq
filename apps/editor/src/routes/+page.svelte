<script lang="ts">
	import { onMount } from 'svelte';
	import { PaneGroup, Pane, PaneResizer } from 'paneforge';
	import Header from '$lib/components/Header.svelte';
	import WelcomeBanner from '$lib/components/WelcomeBanner.svelte';
	import Toolbox from '$lib/components/Toolbox.svelte';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import DataEditor from '$lib/components/DataEditor.svelte';
	import EmptyPreview from '$lib/components/EmptyPreview.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { registerDefaultShapes, layoutRegistry, iconRegistry } from '@runiq/core';
	import { ElkLayoutEngine } from '@runiq/layout-base';
	import { brandIcons } from '@runiq/icons-brand';
	import { fontAwesome } from '@runiq/icons-fontawesome';
	import { iconify } from '@runiq/icons-iconify';
	import VisualCanvas from '$lib/components/VisualCanvas.svelte';
	import {
		editorState,
		editorRefs,
		autoSave,
		initializeEditor,
		handleCodeChange,
		handleEditorErrors,
		handleDataChange,
		handleDataErrors,
		handleParse,
		handleInsertShape,
		handleReplaceGlyphset,
		handleInsertSample,
		handleNewDiagram,
		handleExport,
		handleKeyDown
	} from '$lib/state/editorState.svelte';
	import GlyphsetConversionDialog from '$lib/components/GlyphsetConversionDialog.svelte';
	import {
		glyphsetConversionDialogState,
		closeGlyphsetConversionDialog
	} from '$lib/state/glyphsetConversionDialog.svelte';

	// Register providers
	registerDefaultShapes();
	layoutRegistry.register(new ElkLayoutEngine());
	iconRegistry.register(brandIcons);
	iconRegistry.register(fontAwesome);
	iconRegistry.register(iconify);

	// Initialize editor state
	initializeEditor();

	// Local panel state
	const panelSizes = $state({ toolbox: 20, editor: 40, preview: 40 });

	// Load and save panel sizes
	onMount(() => {
		const saved = localStorage.getItem('runiq-panel-sizes');
		if (saved) {
			try {
				const sizes = JSON.parse(saved);
				panelSizes.toolbox = sizes.toolbox || 20;
				panelSizes.editor = sizes.editor || 40;
				panelSizes.preview = sizes.preview || 40;
			} catch (e) {
				console.warn('Failed to load panel sizes:', e);
			}
		}
	});

	function savePanelSizes() {
		localStorage.setItem('runiq-panel-sizes', JSON.stringify(panelSizes));
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="flex h-screen flex-col overflow-hidden bg-neutral-50" onkeydown={handleKeyDown}>
	<!-- Header -->
	<Header
		diagramName={editorState.diagramName}
		lastSaved={autoSave.lastSaved}
		isDirty={editorState.isDirty}
	/>

	<!-- Welcome Banner (dismissible) -->
	<WelcomeBanner />

	<!-- Main Content: Three-Panel Layout -->
	<div class="flex-1 overflow-hidden">
		<PaneGroup direction="horizontal" class="flex h-full">
			<!-- Left Panel: Toolbox (20% default) -->
			<Pane
				defaultSize={panelSizes.toolbox}
				minSize={10}
				maxSize={40}
				onResize={(size) => {
					panelSizes.toolbox = size;
					savePanelSizes();
				}}
			>
				<Toolbox />
			</Pane>
			{#if editorState.showCodeEditor}
				<PaneResizer
					class="w-1 bg-neutral-300 transition-colors hover:bg-runiq-400 active:bg-runiq-500"
				/>

				<!-- Center Panel: Code Editor (40% default) -->
				<Pane
					defaultSize={panelSizes.editor}
					minSize={30}
					maxSize={60}
					onResize={(size) => {
						panelSizes.editor = size;
						savePanelSizes();
					}}
				>
					<div class="flex h-full flex-col bg-white">
						<div class="border-b border-runiq-200 bg-runiq-500 px-4 py-3">
							<h2 class="text-sm font-semibold text-white">Editor</h2>
						</div>
						<div class="flex flex-1 flex-col overflow-hidden">
							<Tabs.Root bind:value={editorState.activeTab} class="flex flex-1 flex-col">
								<Tabs.List class="border-b border-neutral-200 bg-neutral-50 px-2">
									<Tabs.Trigger value="syntax" class="px-4 py-2 text-sm font-medium">
										Syntax
									</Tabs.Trigger>
									<Tabs.Trigger value="data" class="px-4 py-2 text-sm font-medium"
										>Data</Tabs.Trigger
									>
								</Tabs.List>
								<Tabs.Content value="syntax" class="flex-1 overflow-hidden">
									<CodeEditor bind:this={editorRefs.code} value={editorState.code} />
								</Tabs.Content>
								<Tabs.Content value="data" class="flex-1 overflow-hidden">
									<DataEditor bind:this={editorRefs.data} value={editorState.dataContent} />
								</Tabs.Content>
							</Tabs.Root>
						</div>
					</div>
				</Pane>

				<PaneResizer
					class="w-1 bg-neutral-300 transition-colors hover:bg-runiq-400 active:bg-runiq-500"
				/>
			{/if}

			<!-- Right Panel: Visual Editor (40% default) -->
			<Pane
				defaultSize={panelSizes.preview}
				minSize={30}
				onResize={(size) => {
					panelSizes.preview = size;
					savePanelSizes();
				}}
			>
				<div class="flex h-full flex-col border-l border-neutral-300 bg-neutral-50">
					<div
						class="flex items-center justify-between border-b border-runiq-200 bg-runiq-500 px-4 py-3"
					>
						<h2 class="text-sm font-semibold text-white">Preview</h2>
						<button
							onclick={() => (editorState.showCodeEditor = !editorState.showCodeEditor)}
							class="rounded bg-runiq-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-runiq-700"
							title={editorState.showCodeEditor ? 'Hide code editor' : 'Show code editor'}
						>
							{editorState.showCodeEditor ? 'Hide Code' : 'Show Code'}
						</button>
					</div>
					<div class="relative flex-1 overflow-hidden">
						{#if editorState.code.trim() === ''}
							<EmptyPreview />
						{:else}
							<!-- Canvas -->
							<VisualCanvas bind:this={editorRefs.preview} />
						{/if}
					</div>
				</div>
			</Pane>
		</PaneGroup>
	</div>
</div>

<!-- Glyphset Conversion Incompatibility Dialog -->
<GlyphsetConversionDialog
	bind:open={glyphsetConversionDialogState.open}
	onOpenChange={closeGlyphsetConversionDialog}
	fromType={glyphsetConversionDialogState.fromType}
	toType={glyphsetConversionDialogState.toType}
	reason={glyphsetConversionDialogState.reason}
	alternatives={glyphsetConversionDialogState.alternatives}
	canConvert={glyphsetConversionDialogState.canConvert}
	onSelectAlternative={handleReplaceGlyphset}
	onCancel={closeGlyphsetConversionDialog}
/>
