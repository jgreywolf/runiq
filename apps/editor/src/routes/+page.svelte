<script lang="ts">
	import { onMount } from 'svelte';
	import { PaneGroup, Pane, PaneResizer } from 'paneforge';
	import Header from '$lib/components/Header.svelte';
	import Toolbox from '$lib/components/Toolbox.svelte';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import DataEditor from '$lib/components/DataEditor.svelte';
	import Preview from '$lib/components/Preview.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
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

	// Auto-save configuration
	const AUTO_SAVE_DELAY = 2000; // 2 seconds after last change
	const AUTO_SAVE_KEY = 'runiq-autosave-code';
	const AUTO_SAVE_TIME_KEY = 'runiq-autosave-time';

	// Restore auto-saved code immediately (before component mounts)
	// This must happen before the CodeEditor component initializes
	const { initialCode, initialLastSaved } = (() => {
		if (typeof window !== 'undefined') {
			const autoSaved = localStorage.getItem(AUTO_SAVE_KEY);
			const autoSavedTime = localStorage.getItem(AUTO_SAVE_TIME_KEY);
			if (autoSaved) {
				console.log('Restored auto-saved code');
				return {
					initialCode: autoSaved,
					initialLastSaved: autoSavedTime ? new Date(autoSavedTime) : new Date()
				};
			}
		}
		return { initialCode: '', initialLastSaved: null };
	})();

	// Editor state
	let code = $state(initialCode);
	let dataContent = $state('');
	let dataErrors = $state<string[]>([]);
	let activeTab = $state('syntax');
	let errors = $state<string[]>([]);
	let layoutEngine = $state('elk');
	let autoSaveTimeout: ReturnType<typeof setTimeout> | null = null;
	let codeEditorRef: CodeEditor | null = null;
	let dataEditorRef: DataEditor | null = null;
	let previewRef: Preview | null = null;

	// Initialize lastSaved after state declaration
	lastSaved = initialLastSaved;

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
				const now = new Date();
				localStorage.setItem(AUTO_SAVE_KEY, code);
				localStorage.setItem(AUTO_SAVE_TIME_KEY, now.toISOString());
				lastSaved = now;
				isDirty = false;
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

	// Handle data editor changes
	function handleDataChange(newData: string) {
		dataContent = newData;
		// Note: Data changes don't affect isDirty/auto-save since they're separate
	}

	// Handle data editor errors
	function handleDataErrors(errors: string[]) {
		dataErrors = errors;
		console.log('Data errors:', errors);
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
	function handleNewDiagram(
		type: 'diagram' | 'electrical' | 'pneumatic' | 'hydraulic' | 'wardley' | 'sequence' | 'pid'
	) {
		let defaultContent: string;
		let defaultName: string;

		if (type === 'pid') {
			defaultContent = `pid "My P&ID" {
  // Equipment
  equipment TK-101 type:storageTank volume:5000 unit:L material:CS
  equipment P-101 type:pumpCentrifugal flowRate:50 unit:m³/h material:SS316
  
  // Instruments
  instrument FT-101 type:flowTransmitter range:(0,100) unit:m³/h location:field
  instrument FIC-101 type:flowIndicatorController range:(0,100) unit:m³/h location:panel
  
  // Process Lines
  line process from:TK-101.outlet to:P-101.inlet size:4 unit:in schedule:STD material:CS
  
  // Signal Lines
  line signal from:FT-101 to:FIC-101
  
  // Control Loop
  loop 101 controlled_variable:flow setpoint:50 unit:m³/h controller:FIC-101 mode:auto
  
  // Process Specifications
  fluid "Water"
  pressure 3 unit:bar
}`;
			defaultName = 'Untitled P&ID';
		} else if (type === 'sequence') {
			defaultContent = `sequence "My Sequence Diagram" {

  participant "User" as actor
  participant "System" as entity
  participant "Database" as database

  message from:"User" to:"System" label:"Request" type:sync
  message from:"System" to:"Database" label:"Query" type:sync
  message from:"Database" to:"System" label:"Data" type:return
  message from:"System" to:"User" label:"Response" type:return
	}
`;
			defaultName = 'Untitled Sequence';
		} else if (type === 'electrical') {
			defaultContent = `electrical "My Circuit" {
  net VCC, GND
  
  // Add your electrical components here
  // Example: part R1 type:R value:"1k" pins:(VCC,GND)
}`;
			defaultName = 'Untitled Circuit';
		} else if (type === 'pneumatic') {
			defaultContent = `pneumatic "My Pneumatic Circuit" {
  pressure 6 bar operating
  flowRate 500 L/min
  
  net SUPPLY
  net PORT_A
  net PORT_B
  
  // Add your pneumatic components here
  // Example: part C1 CYL_DA pins:(PORT_A,PORT_B) doc:"Cylinder"
}`;
			defaultName = 'Untitled Pneumatic';
		} else if (type === 'hydraulic') {
			defaultContent = `hydraulic "My Hydraulic Circuit" {
  pressure 210 bar operating
  flowRate 40 L/min
  fluid mineral "ISO VG 46"
  
  net TANK
  net PUMP
  net PORT_A
  net PORT_B
  
  // Add your hydraulic components here
  // Example: part P1 PUMP_FIXED pins:(TANK,PUMP) doc:"Main pump"
}`;
			defaultName = 'Untitled Hydraulic';
		} else if (type === 'wardley') {
			defaultContent = `wardley "My Strategy Map" {
  // Define user needs at the top
  anchor "User Need" value:0.95
  
  // Add components with evolution (0=genesis, 1=commodity) and value (0=invisible, 1=visible)
  component "Product" evolution:0.7 value:0.8
  component "Platform" evolution:0.5 value:0.6
  component "Infrastructure" evolution:0.9 value:0.3
  
  // Define dependencies
  dependency from:"User Need" to:"Product"
  dependency from:"Product" to:"Platform"
  dependency from:"Platform" to:"Infrastructure"
}`;
			defaultName = 'Untitled Wardley Map';
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

		// Clear auto-saved content and timestamp
		localStorage.removeItem(AUTO_SAVE_KEY);
		localStorage.removeItem(AUTO_SAVE_TIME_KEY);
		lastSaved = null;

		console.log(`New ${type} created`);
	}

	// Handle export to SVG
	function handleExportSvg() {
		if (!previewRef || !previewRef.hasValidDiagram()) {
			alert('No valid diagram to export. Please fix any errors first.');
			return;
		}

		const svg = previewRef.getSvg();
		const blob = new Blob([svg], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${diagramName.replace(/\s+/g, '-')}.svg`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	// Handle export to PNG
	async function handleExportPng() {
		if (!previewRef || !previewRef.hasValidDiagram()) {
			alert('No valid diagram to export. Please fix any errors first.');
			return;
		}

		const svg = previewRef.getSvg();

		// Create a temporary container to parse SVG dimensions
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = svg;
		const svgElement = tempDiv.querySelector('svg');

		if (!svgElement) {
			alert('Failed to parse SVG content');
			return;
		}

		// Get SVG dimensions
		const width = parseInt(svgElement.getAttribute('width') || '800');
		const height = parseInt(svgElement.getAttribute('height') || '600');

		// Create canvas
		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			alert('Failed to create canvas context');
			return;
		}

		// Create image from SVG
		const img = new Image();
		const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(svgBlob);

		img.onload = () => {
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, width, height);
			ctx.drawImage(img, 0, 0);
			URL.revokeObjectURL(url);

			// Convert canvas to PNG and download
			canvas.toBlob((blob) => {
				if (blob) {
					const pngUrl = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = pngUrl;
					a.download = `${diagramName.replace(/\s+/g, '-')}.png`;
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					URL.revokeObjectURL(pngUrl);
				}
			}, 'image/png');
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			alert('Failed to render SVG to PNG');
		};

		img.src = url;
	}

	// Handle export button click
	function handleExport(format: 'svg' | 'png') {
		if (format === 'svg') {
			handleExportSvg();
		} else {
			handleExportPng();
		}
	}

	// Load panel sizes from localStorage
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
	<Header
		{diagramName}
		{lastSaved}
		{isDirty}
		onNewDiagram={handleNewDiagram}
		onExport={handleExport}
	/>

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
						<h2 class="text-sm font-semibold text-white">Editor</h2>
					</div>
					<div class="flex-1 overflow-hidden flex flex-col">
						<Tabs.Root bind:value={activeTab} class="flex-1 flex flex-col">
							<Tabs.List class="border-b border-neutral-200 bg-neutral-50 px-2">
								<Tabs.Trigger value="syntax" class="px-4 py-2 text-sm font-medium">
									Syntax
								</Tabs.Trigger>
								<Tabs.Trigger value="data" class="px-4 py-2 text-sm font-medium">
									Data
								</Tabs.Trigger>
							</Tabs.List>
							<Tabs.Content value="syntax" class="flex-1 overflow-hidden">
								<CodeEditor
									bind:this={codeEditorRef}
									value={code}
									onchange={handleCodeChange}
									onerror={handleEditorErrors}
								/>
							</Tabs.Content>
							<Tabs.Content value="data" class="flex-1 overflow-hidden">
								<DataEditor
									bind:this={dataEditorRef}
									value={dataContent}
									onchange={handleDataChange}
									onerror={handleDataErrors}
								/>
							</Tabs.Content>
						</Tabs.Root>
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
						<Preview bind:this={previewRef} {code} {layoutEngine} onparse={handleParse} />
					</div>
				</div>
			</Pane>
		</PaneGroup>
	</div>
</div>
