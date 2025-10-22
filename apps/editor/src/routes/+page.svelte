<script lang="ts">
	import { onMount } from 'svelte';
	import { PaneGroup, Pane, PaneResizer } from 'paneforge';
	import Header from '$lib/components/Header.svelte';
	import Toolbox from '$lib/components/Toolbox.svelte';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import Preview from '$lib/components/Preview.svelte';
	import { registerDefaultShapes, layoutRegistry, iconRegistry } from '@runiq/core';
	import { ElkLayoutEngine } from '@runiq/layout-base';
	import { fontAwesome } from '@runiq/icons-fontawesome';

	// Register providers
	registerDefaultShapes();
	layoutRegistry.register(new ElkLayoutEngine());
	iconRegistry.register(fontAwesome);

	// Panel size state (persisted to localStorage)
	let toolboxSize = $state(20);
	let editorSize = $state(40);
	let previewSize = $state(40);

	let diagramName = $state('Untitled Diagram');
	let lastSaved = $state<Date | null>(null);
	let isDirty = $state(false);

	// Editor state
	let code = $state('');
	let errors = $state<string[]>([]);
	let layoutEngine = $state('elk');
	let autoSaveTimeout: ReturnType<typeof setTimeout> | null = null;
	let codeEditorRef: CodeEditor | null = null;

	// Auto-save configuration
	const AUTO_SAVE_DELAY = 2000; // 2 seconds after last change
	const AUTO_SAVE_KEY = 'runiq-autosave-code';

	// Handle code changes with auto-save
	function handleCodeChange(newCode: string) {
		code = newCode;
		isDirty = true;

		// Clear existing timeout
		if (autoSaveTimeout) {
			clearTimeout(autoSaveTimeout);
		}

		// Set new auto-save timeout
		autoSaveTimeout = setTimeout(() => {
			try {
				localStorage.setItem(AUTO_SAVE_KEY, code);
				lastSaved = new Date();
				console.log('Auto-saved at', lastSaved.toLocaleTimeString());
			} catch (e) {
				console.warn('Auto-save failed:', e);
			}
		}, AUTO_SAVE_DELAY);
	}

	// Handle editor errors
	function handleEditorErrors(editorErrors: string[]) {
		// These are syntax errors from the editor linter
		console.log('Editor errors:', editorErrors);
	}

	// Handle parse results from preview
	function handleParse(success: boolean, parseErrors: string[]) {
		errors = parseErrors;
	}

	// Handle shape insertion from toolbox
	function handleInsertShape(shapeCode: string) {
		if (codeEditorRef) {
			codeEditorRef.insertAtCursor(shapeCode);
		}
	}

	// Handle sample diagram insertion - replaces all content
	function handleInsertSample(sampleCode: string) {
		if (codeEditorRef) {
			codeEditorRef.setValue(sampleCode);
		}
		code = sampleCode;
		isDirty = true;
	}

	// Handle new diagram creation with type selection
	function handleNewDiagram(type: 'diagram' | 'electrical') {
		let defaultContent: string;
		let defaultName: string;

		if (type === 'electrical') {
			defaultContent = `electrical "My Circuit" {
  net VCC, GND
  
  // Add your electrical components here
  // Example: part R1 type:R value:"1k" pins:(VCC,GND)
}`;
			defaultName = 'Untitled Circuit';
		} else {
			defaultContent = 'diagram "My Diagram"\n\n// Add your shapes and connections here';
			defaultName = 'Untitled Diagram';
		}

		if (codeEditorRef) {
			codeEditorRef.setValue(defaultContent);
		}
		code = defaultContent;
		diagramName = defaultName;
		isDirty = false;

		// Clear auto-saved content
		localStorage.removeItem(AUTO_SAVE_KEY);
		lastSaved = null;

		console.log(`New ${type} created`);
	}

	// Load panel sizes and auto-saved code from localStorage
	onMount(() => {
		// Load panel sizes
		const saved = localStorage.getItem('runiq-panel-sizes');
		if (saved) {
			try {
				const sizes = JSON.parse(saved);
				toolboxSize = sizes.toolbox || 20;
				editorSize = sizes.editor || 40;
				previewSize = sizes.preview || 40;
			} catch (e) {
				console.warn('Failed to load panel sizes:', e);
			}
		}

		// Restore auto-saved code
		const autoSaved = localStorage.getItem(AUTO_SAVE_KEY);
		if (autoSaved) {
			code = autoSaved;
			isDirty = false;
			console.log('Restored auto-saved code');
		}
	});

	// Save panel sizes when they change
	function savePanelSizes() {
		localStorage.setItem(
			'runiq-panel-sizes',
			JSON.stringify({
				toolbox: toolboxSize,
				editor: editorSize,
				preview: previewSize
			})
		);
	}
</script>

<div class="flex h-screen flex-col overflow-hidden bg-neutral-50">
	<!-- Header -->
	<Header {diagramName} {lastSaved} {isDirty} onNewDiagram={handleNewDiagram} />

	<!-- Main Content: Three-Panel Layout -->
	<div class="flex-1 overflow-hidden">
		<PaneGroup direction="horizontal" class="flex h-full">
			<!-- Left Panel: Toolbox (20% default) -->
			<Pane
				defaultSize={toolboxSize}
				minSize={15}
				maxSize={35}
				onResize={(size) => {
					toolboxSize = size;
					savePanelSizes();
				}}
			>
				<div class="flex h-full flex-col border-r border-neutral-300 bg-white">
					<div class="border-b border-runiq-200 bg-runiq-500 px-4 py-3">
						<h2 class="text-sm font-semibold text-white">Toolbox</h2>
					</div>
					<div class="flex-1 overflow-auto">
						<Toolbox
							onInsertShape={handleInsertShape}
							onInsertSample={handleInsertSample}
							currentCode={code}
						/>
					</div>
				</div>
			</Pane>

			<PaneResizer
				class="w-1 bg-neutral-300 transition-colors hover:bg-runiq-400 active:bg-runiq-500"
			/>

			<!-- Center Panel: Code Editor (40% default) -->
			<Pane
				defaultSize={editorSize}
				minSize={30}
				maxSize={60}
				onResize={(size) => {
					editorSize = size;
					savePanelSizes();
				}}
			>
				<div class="flex h-full flex-col bg-white">
					<div class="border-b border-runiq-200 bg-runiq-500 px-4 py-3">
						<h2 class="text-sm font-semibold text-white">Code Editor</h2>
					</div>
					<div class="flex-1 overflow-hidden">
						<CodeEditor
							bind:this={codeEditorRef}
							value={code}
							onchange={handleCodeChange}
							onerror={handleEditorErrors}
						/>
					</div>
				</div>
			</Pane>

			<PaneResizer
				class="w-1 bg-neutral-300 transition-colors hover:bg-runiq-400 active:bg-runiq-500"
			/>

			<!-- Right Panel: Preview (40% default) -->
			<Pane
				defaultSize={previewSize}
				minSize={30}
				onResize={(size) => {
					previewSize = size;
					savePanelSizes();
				}}
			>
				<div class="flex h-full flex-col border-l border-neutral-300 bg-neutral-50">
					<div class="border-b border-runiq-200 bg-runiq-500 px-4 py-3">
						<h2 class="text-sm font-semibold text-white">Preview</h2>
					</div>
					<div class="flex-1 overflow-hidden">
						<Preview {code} {layoutEngine} onparse={handleParse} />
					</div>
				</div>
			</Pane>
		</PaneGroup>
	</div>
</div>
