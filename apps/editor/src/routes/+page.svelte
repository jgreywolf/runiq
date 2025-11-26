<script lang="ts">
	import { onMount } from 'svelte';
	import { PaneGroup, Pane, PaneResizer } from 'paneforge';
	import Header from '$lib/components/Header.svelte';
	import WelcomeBanner from '$lib/components/WelcomeBanner.svelte';
	import Toolbox from '$lib/components/Toolbox.svelte';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import DataEditor from '$lib/components/DataEditor.svelte';
	import Preview from '$lib/components/Preview.svelte';
	import EmptyPreview from '$lib/components/EmptyPreview.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { registerDefaultShapes, layoutRegistry, iconRegistry } from '@runiq/core';
	import { ElkLayoutEngine } from '@runiq/layout-base';
	import { fontAwesome } from '@runiq/icons-fontawesome';
	import VisualCanvas from '$lib/components/VisualCanvas.svelte';
	import { ProfileName } from '$lib/types';

	// Register providers
	registerDefaultShapes();
	layoutRegistry.register(new ElkLayoutEngine());
	iconRegistry.register(fontAwesome);

	// Panel size state (persisted to localStorage)
	let toolboxSize = $state(20);
	let editorSize = $state(40);
	let previewSize = $state(40);

	// Code editor visibility state
	let showCodeEditor = $state(true);

	let diagramName = $state('New Diagram');
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
	let shapeCounter = $state(1); // Counter for generating unique shape IDs

	// History management for undo/redo
	let history = $state<string[]>([initialCode]); // Stack of code states
	let historyIndex = $state(0); // Current position in history
	let isUndoRedoAction = false; // Flag to prevent undo/redo from adding to history
	let isProgrammaticChange = false; // Flag to prevent programmatic changes from adding to history

	// Initialize lastSaved after state declaration
	lastSaved = initialLastSaved;

	// Handle code changes with auto-save
	function handleCodeChange(newCode: string) {
		code = newCode;
		isDirty = true;

		// Add to history if this is not an undo/redo or programmatic action
		if (!isUndoRedoAction && !isProgrammaticChange) {
			// Remove any "future" history if we're not at the end
			if (historyIndex < history.length - 1) {
				history = history.slice(0, historyIndex + 1);
			}

			// Add new state to history
			history.push(newCode);
			historyIndex = history.length - 1;

			// Limit history size to prevent memory issues (keep last 100 states)
			if (history.length > 100) {
				history = history.slice(-100);
				historyIndex = history.length - 1;
			}
		}

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

	// Handle edit from visual canvas
	function handleEdit(nodeOrEdgeId: string, property: string, value: any, location?: any) {
		const lines = code.split('\n');

		if (property === 'label') {
			// Handle node label editing
			let shapeLineIndex = -1;

			// Look for: shape nodeId as @shapeName ...
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i];
				const shapeRegex = new RegExp(`^\\s*shape\\s+${nodeOrEdgeId}\\s+as\\s+@\\w+`);
				if (shapeRegex.test(line)) {
					shapeLineIndex = i;
					break;
				}
			}

			if (shapeLineIndex === -1) {
				console.warn('Could not find shape declaration for node:', nodeOrEdgeId);
				return;
			}

			const line = lines[shapeLineIndex];

			// Check if label property already exists
			const hasLabel = /label:\s*"[^"]*"/.test(line);

			let updatedLine: string;
			if (hasLabel) {
				// Replace existing label: label:"old" -> label:"new"
				updatedLine = line.replace(/label:\s*"[^"]*"/, `label:"${value}"`);
			} else {
				// Add new label property after the shape name
				// shape nodeId as @shapeName -> shape nodeId as @shapeName label:"value"
				updatedLine = line.replace(
					new RegExp(`(shape\\s+${nodeOrEdgeId}\\s+as\\s+@\\w+)`),
					`$1 label:"${value}"`
				);
			}

			lines[shapeLineIndex] = updatedLine;
			const newCode = lines.join('\n');

			// Update the code editor (this will trigger handleCodeChange via the editor's onchange event)
			if (codeEditorRef) {
				codeEditorRef.setValue(newCode);
			} else {
				// Fallback if editor ref is not available
				code = newCode;
			}
		} else if (property === 'edgeLabel') {
			// Handle edge label editing
			// Edge ID format: "from-to" or "from-to-index"
			const edgeParts = nodeOrEdgeId.split('-');
			if (edgeParts.length < 2) {
				console.warn('Invalid edge ID format:', nodeOrEdgeId);
				return;
			}

			const fromNode = edgeParts[0];
			const toNode = edgeParts[1];

			// Find the edge declaration: from -> to
			let edgeLineIndex = -1;
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i];
				// Match: from -> to or from -label-> to
				const edgeRegex = new RegExp(`^\\s*${fromNode}\\s+(-\\w*->|->)\\s+${toNode}(?:\\s|$)`);
				if (edgeRegex.test(line)) {
					edgeLineIndex = i;
					break;
				}
			}

			if (edgeLineIndex === -1) {
				console.warn('Could not find edge declaration:', nodeOrEdgeId);
				return;
			}

			const line = lines[edgeLineIndex];

			// Check if label property already exists at end of line
			const hasLabel = /label:\s*"[^"]*"/.test(line);

			let updatedLine: string;
			if (hasLabel) {
				// Replace existing label: label:"old" -> label:"new"
				updatedLine = line.replace(/label:\s*"[^"]*"/, `label:"${value}"`);
			} else {
				// Add label property at end of line
				updatedLine = line.trim() + ` label:"${value}"`;
			}

			lines[edgeLineIndex] = updatedLine;
			const newCode = lines.join('\n');

			// Update the code editor (this will trigger handleCodeChange via the editor's onchange event)
			if (codeEditorRef) {
				codeEditorRef.setValue(newCode);
			} else {
				// Fallback if editor ref is not available
				code = newCode;
			}
		} else if (property === 'position') {
			// Handle node position update (drag-and-drop)
			let shapeLineIndex = -1;

			// Look for: shape nodeId as @shapeName ...
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i];
				const shapeRegex = new RegExp(`^\\s*shape\\s+${nodeOrEdgeId}\\s+as\\s+@\\w+`);
				if (shapeRegex.test(line)) {
					shapeLineIndex = i;
					break;
				}
			}

			if (shapeLineIndex === -1) {
				console.warn('Could not find shape declaration for node:', nodeOrEdgeId);
				return;
			}

			const line = lines[shapeLineIndex];
			const { x, y } = value;

			// Check if position property already exists
			const hasPosition = /position:\s*\([^)]+\)/.test(line);

			let updatedLine: string;
			if (hasPosition) {
				// Replace existing position: position:(x,y) -> position:(newX,newY)
				updatedLine = line.replace(/position:\s*\([^)]+\)/, `position:(${x},${y})`);
			} else {
				// Add position property after the shape name
				updatedLine = line.replace(
					new RegExp(`(shape\\s+${nodeOrEdgeId}\\s+as\\s+@\\w+)`),
					`$1 position:(${x},${y})`
				);
			}

			lines[shapeLineIndex] = updatedLine;
			const newCode = lines.join('\n');

			// Update the code editor (this will trigger handleCodeChange via the editor's onchange event)
			if (codeEditorRef) {
				codeEditorRef.setValue(newCode);
			} else {
				// Fallback if editor ref is not available
				code = newCode;
			}
		} else {
			console.warn('Unsupported property for editing:', property);
		}
	}

	// Handle shape insertion from toolbox
	function handleInsertShape(shapeCode: string) {
		// Replace placeholder ID with unique ID
		const uniqueCode = shapeCode.replace('id', `id${shapeCounter}`);
		shapeCounter++;

		// Find the profile/diagram block and insert at the end (before closing brace)
		const lines = code.split('\n');

		// Find the last closing brace that belongs to a profile/diagram block
		let insertLineIndex = -1;
		let indentation = '  '; // Default indentation

		// Look for profile/diagram block types
		const profileTypes = [
			'diagram',
			'pid',
			'electrical',
			'pneumatic',
			'hydraulic',
			'sequence',
			'timeline',
			'wardley',
			'glyphset'
		];
		let inProfileBlock = false;
		let braceDepth = 0;
		let profileStartIndent = '';

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const trimmed = line.trim();

			// Check if this is a profile declaration
			const isProfileStart = profileTypes.some((type) => new RegExp(`^${type}\\s+`).test(trimmed));

			if (isProfileStart && trimmed.endsWith('{')) {
				inProfileBlock = true;
				braceDepth = 1;
				// Calculate indentation (profile indent + 2 spaces)
				const match = line.match(/^(\s*)/);
				profileStartIndent = match ? match[1] : '';
				indentation = profileStartIndent + '  ';
			} else if (inProfileBlock) {
				// Track brace depth
				if (trimmed.includes('{')) braceDepth++;
				if (trimmed.includes('}')) braceDepth--;

				// If we found the closing brace of the profile block
				if (braceDepth === 0 && trimmed === '}') {
					insertLineIndex = i;
					break;
				}
			}
		}

		if (insertLineIndex === -1) {
			// No profile block found, fall back to cursor insertion
			if (codeEditorRef) {
				codeEditorRef.insertAtCursor(uniqueCode);
			}
			return;
		}

		// Insert the shape before the closing brace with proper indentation
		lines.splice(insertLineIndex, 0, `${indentation}${uniqueCode}`);
		const newCode = lines.join('\n');

		// Update the code editor (this will trigger handleCodeChange via the editor's onchange event)
		if (codeEditorRef) {
			codeEditorRef.setValue(newCode);
		} else {
			// Fallback if editor ref is not available
			code = newCode;
		}
	}

	// Handle edge insertion from visual canvas (Shift+Click workflow)
	function handleInsertEdge(fromNodeId: string, toNodeId: string) {
		// Create edge declaration: fromId -> toId
		const edgeCode = `${fromNodeId} -> ${toNodeId}`;

		// Find the profile/diagram block and insert at the end (before closing brace)
		const lines = code.split('\n');

		// Find the last closing brace that belongs to a profile/diagram block
		let insertLineIndex = -1;
		let indentation = '  '; // Default indentation

		// Look for profile/diagram block types
		const profileTypes = [
			'diagram',
			'pid',
			'electrical',
			'pneumatic',
			'hydraulic',
			'sequence',
			'timeline',
			'wardley',
			'glyphset'
		];
		let inProfileBlock = false;
		let braceDepth = 0;
		let profileStartIndent = '';

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const trimmed = line.trim();

			// Check if this is a profile declaration
			const isProfileStart = profileTypes.some((type) => new RegExp(`^${type}\\s+`).test(trimmed));

			if (isProfileStart && trimmed.endsWith('{')) {
				inProfileBlock = true;
				braceDepth = 1;
				// Calculate indentation (profile indent + 2 spaces)
				const match = line.match(/^(\s*)/);
				profileStartIndent = match ? match[1] : '';
				indentation = profileStartIndent + '  ';
			} else if (inProfileBlock) {
				// Track brace depth
				if (trimmed.includes('{')) braceDepth++;
				if (trimmed.includes('}')) braceDepth--;

				// If we found the closing brace of the profile block
				if (braceDepth === 0 && trimmed === '}') {
					insertLineIndex = i;
					break;
				}
			}
		}

		if (insertLineIndex === -1) {
			// No profile block found, fall back to cursor insertion
			if (codeEditorRef) {
				codeEditorRef.insertAtCursor(edgeCode);
			}
			return;
		}

		// Insert the edge before the closing brace with proper indentation
		lines.splice(insertLineIndex, 0, `${indentation}${edgeCode}`);
		const newCode = lines.join('\n');

		// Update the code editor (this will trigger handleCodeChange via the editor's onchange event)
		if (codeEditorRef) {
			codeEditorRef.setValue(newCode);
		} else {
			// Fallback if editor ref is not available
			code = newCode;
		}
	}

	// Handle undo (Ctrl+Z)
	function handleUndo() {
		if (historyIndex > 0) {
			historyIndex--;
			isUndoRedoAction = true;
			const previousCode = history[historyIndex];
			if (codeEditorRef) {
				codeEditorRef.setValue(previousCode);
			}
			code = previousCode;
			isUndoRedoAction = false;
		}
	}

	// Handle redo (Ctrl+Y or Ctrl+Shift+Z)
	function handleRedo() {
		if (historyIndex < history.length - 1) {
			historyIndex++;
			isUndoRedoAction = true;
			const nextCode = history[historyIndex];
			if (codeEditorRef) {
				codeEditorRef.setValue(nextCode);
			}
			code = nextCode;
			isUndoRedoAction = false;
		}
	}

	// Handle keyboard shortcuts (Ctrl+Z for undo, Ctrl+Y or Ctrl+Shift+Z for redo)
	function handleKeyDown(event: KeyboardEvent) {
		// Check if Ctrl (or Cmd on Mac) is pressed
		const isCtrlOrCmd = event.ctrlKey || event.metaKey;

		if (isCtrlOrCmd && event.key === 'z' && !event.shiftKey) {
			// Undo: Ctrl+Z
			event.preventDefault();
			handleUndo();
		} else if (isCtrlOrCmd && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
			// Redo: Ctrl+Y or Ctrl+Shift+Z
			event.preventDefault();
			handleRedo();
		}
	}

	// Handle element deletion from visual canvas (Delete/Backspace)
	function handleDelete(nodeId: string | null, edgeId: string | null) {
		const lines = code.split('\n');
		const linesToRemove: number[] = [];

		if (nodeId) {
			// Find and remove the shape declaration
			// Look for: shape nodeId as @shapeName ...
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i];
				const shapeRegex = new RegExp(`^\\s*shape\\s+${nodeId}\\s+as\\s+@\\w+`);
				if (shapeRegex.test(line)) {
					linesToRemove.push(i);
					break;
				}
			}

			// Also find and remove any edges connected to this node
			// Match edges like: nodeId -> otherNode or otherNode -> nodeId
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i];
				// Match: nodeId -> ... or ... -> nodeId
				const edgeRegex = new RegExp(
					`^\\s*(${nodeId}\\s+(-\\w*->|->)\\s+\\w+|\\w+\\s+(-\\w*->|->)\\s+${nodeId})`
				);
				if (edgeRegex.test(line)) {
					linesToRemove.push(i);
				}
			}
		} else if (edgeId) {
			// Find and remove the edge declaration
			// Edge ID format: "from-to" or "from-to-index"
			const edgeParts = edgeId.split('-');
			if (edgeParts.length >= 2) {
				const fromNode = edgeParts[0];
				const toNode = edgeParts[1];

				// Find the edge: from -> to or from -label-> to
				for (let i = 0; i < lines.length; i++) {
					const line = lines[i];
					const edgeRegex = new RegExp(`^\\s*${fromNode}\\s+(-\\w*->|->)\\s+${toNode}`);
					if (edgeRegex.test(line)) {
						linesToRemove.push(i);
						break;
					}
				}
			}
		}

		if (linesToRemove.length > 0) {
			// Remove lines in reverse order to maintain correct indices
			const sortedLines = [...linesToRemove].sort((a, b) => b - a);
			for (const lineIndex of sortedLines) {
				lines.splice(lineIndex, 1);
			}

			const newCode = lines.join('\n');

			// Update the code editor (this will trigger handleCodeChange via the editor's onchange event)
			if (codeEditorRef) {
				codeEditorRef.setValue(newCode);
			} else {
				// Fallback if editor ref is not available
				code = newCode;
			}
		}
	}

	// Handle sample diagram insertion - replaces all content
	function handleInsertSample(sampleCode: string, sampleData?: string) {
		if (codeEditorRef) {
			codeEditorRef.setValue(sampleCode);
		}
		code = sampleCode;

		// Load sample data if provided
		if (sampleData && dataEditorRef) {
			dataEditorRef.setValue(sampleData);
			dataContent = sampleData;
		} else if (dataEditorRef) {
			// Clear data if no sample data
			dataEditorRef.setValue('');
			dataContent = '';
		}

		// Reset history for new sample
		history = [sampleCode];
		historyIndex = 0;

		isDirty = true;
	}

	// Handle new diagram creation with type selection
	function handleNewDiagram(type: ProfileName) {
		let defaultContent: string;
		let defaultName = 'Untitled Diagram';

		if (type === ProfileName.pid) {
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
		} else if (type === ProfileName.sequence) {
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
		} else if (type === ProfileName.timeline) {
			defaultContent = `timeline "My Timeline" {
  // Events with dates and descriptions
  event start date:"2024-01-01" label:"Project Start" 
    description:"Project kickoff meeting" 
    color:"#3B82F6"
  
  event milestone1 date:"2024-03-15" label:"First Milestone" 
    description:"Initial release" 
    icon:"rocket" 
    color:"#10B981"
  
  event milestone2 date:"2024-06-01" label:"Second Milestone" 
    description:"Feature complete" 
    color:"#F59E0B"
  
  event complete date:"2024-09-01" label:"Project Complete" 
    description:"Final delivery" 
    icon:"star" 
    color:"#EF4444"
  
  // Optional: Define periods
  period phase1 startDate:"2024-01-01" endDate:"2024-03-15" 
    label:"Phase 1" 
    color:"#DBEAFE" 
    opacity:0.3
  
  period phase2 startDate:"2024-03-15" endDate:"2024-09-01" 
    label:"Phase 2" 
    color:"#D1FAE5" 
    opacity:0.3
  
  // Timeline orientation (horizontal or vertical)
  orientation horizontal
}
`;
			defaultName = 'Untitled Timeline';
		} else if (type === ProfileName.electrical) {
			defaultContent = `electrical "My Circuit" {
  net VCC, GND
  
  // Add your electrical components here
  // Example: part R1 type:R value:"1k" pins:(VCC,GND)
}`;
			defaultName = 'Untitled Circuit';
		} else if (type === ProfileName.pneumatic) {
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
		} else if (type === ProfileName.hydraulic) {
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
		} else if (type === ProfileName.wardley) {
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
		} else if (type === ProfileName.glyphset) {
			defaultContent = `glyphset columnList "Our Tech Stack" {
	theme "forest"
	item "TypeScript"
	item "React"
	item "Node.js"
	item "PostgreSQL"
	item "Redis"
	item "Docker"
	item "Kubernetes"
	item "AWS"

	columns 2
}`;
		} else {
			defaultContent = 'diagram "My Diagram"\n\n// Add your shapes and connections here';
		}

		if (codeEditorRef) {
			codeEditorRef.setValue(defaultContent);
		}
		code = defaultContent;
		diagramName = defaultName;
		isDirty = false;

		// Reset history
		history = [defaultContent];
		historyIndex = 0;

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

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="flex h-screen flex-col overflow-hidden bg-neutral-50" onkeydown={handleKeyDown}>
	<!-- Header -->
	<Header
		{diagramName}
		{lastSaved}
		{isDirty}
		onNewDiagram={handleNewDiagram}
		onExport={handleExport}
	/>

	<!-- Welcome Banner (dismissible) -->
	<WelcomeBanner />

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

			{#if showCodeEditor}
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
						<div class="flex flex-1 flex-col overflow-hidden">
							<Tabs.Root bind:value={activeTab} class="flex flex-1 flex-col">
								<Tabs.List class="border-b border-neutral-200 bg-neutral-50 px-2">
									<Tabs.Trigger value="syntax" class="px-4 py-2 text-sm font-medium">
										Syntax
									</Tabs.Trigger>
									<Tabs.Trigger value="data" class="px-4 py-2 text-sm font-medium"
										>Data</Tabs.Trigger
									>
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
			{/if}

			<!-- Right Panel: Visual Editor (40% default) -->
			<Pane
				defaultSize={previewSize}
				minSize={30}
				onResize={(size) => {
					previewSize = size;
					savePanelSizes();
				}}
			>
				<div class="flex h-full flex-col border-l border-neutral-300 bg-neutral-50">
					<div
						class="flex items-center justify-between border-b border-runiq-200 bg-runiq-500 px-4 py-3"
					>
						<h2 class="text-sm font-semibold text-white">Preview</h2>
						<button
							onclick={() => (showCodeEditor = !showCodeEditor)}
							class="rounded bg-runiq-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-runiq-700"
							title={showCodeEditor ? 'Hide code editor' : 'Show code editor'}
						>
							{showCodeEditor ? 'Hide Code' : 'Show Code'}
						</button>
					</div>
					<div class="flex-1 overflow-hidden">
						{#if code.trim() === ''}
							<EmptyPreview />
						{:else}
							<VisualCanvas
								bind:this={previewRef}
								{code}
								{dataContent}
								{layoutEngine}
								onparse={handleParse}
								onedit={handleEdit}
								oninsertshape={handleInsertShape}
								oninsertedge={handleInsertEdge}
								ondelete={handleDelete}
							/>
							<!-- <Preview
								bind:this={previewRef}
								{code}
								{dataContent}
								{layoutEngine}
								onparse={handleParse}
							/> -->
						{/if}
					</div>
				</div>
			</Pane>
		</PaneGroup>
	</div>
</div>
