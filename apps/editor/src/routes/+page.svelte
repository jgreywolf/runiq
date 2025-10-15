<script lang="ts">
	import { onMount } from 'svelte';
	import { parse } from '@runiq/parser-dsl';
	import { ElkLayoutEngine } from '@runiq/layout-base';
	import { renderSvg } from '@runiq/renderer-svg';
	import { registerDefaultShapes, layoutRegistry, iconRegistry } from '@runiq/core';
	import { fontAwesome } from '@runiq/icons-fontawesome';
	import type * as Monaco from 'monaco-editor';

	// Register providers
	registerDefaultShapes();
	layoutRegistry.register(new ElkLayoutEngine());
	iconRegistry.register(fontAwesome);

	let editorContainer: HTMLDivElement;
	let monaco: typeof Monaco;
	let editor: Monaco.editor.IStandaloneCodeEditor;
	
	let svgOutput = '';
	let errors: string[] = [];
	let strict = false;
	let layoutEngine = 'dagre';

	const sampleDsl = `diagram "Auth Flow" direction: LR

style default fill:#f7f7ff stroke:#444 font:Inter fontSize:14
style decision fill:#fff7e6 stroke:#aa7700
style link stroke:#2a6fdb strokeWidth:2

shape User     as @actor   label:"Visitor" icon:fa/user
shape Landing  as @rounded label:"Landing Page"
shape Check    as @rhombus label:"Signed up?" style:decision
shape Welcome  as @hex     label:"Welcome"
shape Pricing  as @doc     label:"Pricing" icon:fa/dollar link:"/pricing" tooltip:"See pricing"

User -> Landing : visits
Landing -> Check
Check[yes] -> Welcome style:link
Check[no]  -> Pricing  : reads`;

	onMount(async () => {
		// Import Monaco dynamically to avoid SSR issues
		monaco = await import('monaco-editor');
		
		// Configure Monaco for our DSL
		monaco.languages.register({ id: 'runiq' });
		monaco.languages.setLanguageConfiguration('runiq', {
			comments: {
				lineComment: '#'
			},
			brackets: [
				['{', '}'],
				['[', ']']
			],
			autoClosingPairs: [
				{ open: '{', close: '}' },
				{ open: '[', close: ']' },
				{ open: '"', close: '"' }
			]
		});
		
		monaco.languages.setMonarchTokensProvider('runiq', {
			tokenizer: {
				root: [
					[/#.*$/, 'comment'],
					[/"[^"]*"/, 'string'],
					[/\b(diagram|direction|style|shape|as|group|end|label|icon|link|tooltip)\b/, 'keyword'],
					[/\b(LR|RL|TB|BT)\b/, 'constant'],
					[/@\w+/, 'type'],
					[/->/, 'operator'],
					[/\w+/, 'identifier']
				]
			}
		});
		
		// Create editor
		editor = monaco.editor.create(editorContainer, {
			value: sampleDsl,
			language: 'runiq',
			theme: 'vs',
			automaticLayout: true,
			minimap: { enabled: false },
			scrollBeyondLastLine: false,
			wordWrap: 'on'
		});
		
		// Listen for changes
		editor.onDidChangeModelContent(() => {
			renderDiagram();
		});
		
		// Initial render
		renderDiagram();
	});

	async function renderDiagram() {
		try {
			errors = [];
			const content = editor.getValue();
			
			// Parse DSL
			const parseResult = parse(content);
			if (!parseResult.success) {
				errors = parseResult.errors;
				svgOutput = '';
				return;
			}
			
			// Layout
			const layoutEng = layoutRegistry.get(layoutEngine);
			if (!layoutEng) {
				errors = [`Unknown layout engine: ${layoutEngine}`];
				return;
			}
			
			const layout = await layoutEng.layout(parseResult.data);
			
			// Render
			const renderResult = renderSvg(parseResult.data, layout, { strict });
			svgOutput = renderResult.svg;
			
			if (renderResult.warnings.length > 0) {
				errors = renderResult.warnings;
			}
		} catch (error) {
			errors = [error instanceof Error ? error.message : 'Unknown error'];
			svgOutput = '';
		}
	}

	function exportSvg() {
		if (!svgOutput) return;
		
		const blob = new Blob([svgOutput], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'diagram.svg';
		a.click();
		URL.revokeObjectURL(url);
	}

	function copyToClipboard() {
		if (!svgOutput) return;
		navigator.clipboard.writeText(svgOutput);
	}
</script>

<div class="flex h-screen w-full">
	<div class="w-1/2 border-r border-gray-300">
		<div class="h-10 bg-white border-b border-gray-300 flex items-center px-4 gap-4">
			<button on:click={exportSvg} disabled={!svgOutput} class="px-3 py-1 bg-blue-600 text-white text-sm rounded disabled:bg-gray-300">
				Export SVG
			</button>
			<button on:click={copyToClipboard} disabled={!svgOutput} class="px-3 py-1 bg-blue-600 text-white text-sm rounded disabled:bg-gray-300">
				Copy SVG
			</button>
			
			<label class="text-sm">
				Layout:
				<select bind:value={layoutEngine} on:change={renderDiagram} class="ml-1 px-2 py-1 border rounded text-xs">
					<option value="dagre">Dagre</option>
				</select>
			</label>
			
			<label class="text-sm flex items-center gap-1">
				<input type="checkbox" bind:checked={strict} on:change={renderDiagram} />
				Strict SVG
			</label>
			
			<div class="text-xs text-gray-600">
				{#if errors.length > 0}
					{errors.length} error{errors.length === 1 ? '' : 's'}
				{:else if svgOutput}
					Ready
				{:else}
					Parsing...
				{/if}
			</div>
		</div>
		
		<div bind:this={editorContainer} class="h-[calc(100vh-2.5rem)]"></div>
	</div>
	
	<div class="w-1/2 p-4 overflow-auto bg-gray-50">
		<h3 class="text-lg font-semibold mb-4">Preview</h3>
		
		{#each errors as error}
			<div class="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded mb-2 text-sm font-mono">
				{error}
			</div>
		{/each}
		
		{#if svgOutput}
			<div class="bg-white border border-gray-300 rounded p-4 overflow-auto">
				{@html svgOutput}
			</div>
		{/if}
	</div>
</div>
