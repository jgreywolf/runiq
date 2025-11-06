<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { EditorView, basicSetup } from 'codemirror';
	import { EditorState } from '@codemirror/state';
	import { json, jsonParseLinter } from '@codemirror/lang-json';
	import { lintGutter, linter } from '@codemirror/lint';
	import type { Diagnostic } from '@codemirror/lint';
	import { Upload } from 'lucide-svelte';

	// Props
	interface Props {
		value?: string;
		onchange?: (value: string) => void;
		onerror?: (errors: string[]) => void;
		readonly?: boolean;
	}

	let { value = '', onchange, onerror, readonly = false }: Props = $props();

	let editorContainer: HTMLDivElement;
	let editorView: EditorView | null = null;
	let fileInput: HTMLInputElement;

	// Custom linter for JSON/CSV detection and validation
	function dataFormatLinter(view: EditorView): Diagnostic[] {
		const diagnostics: Diagnostic[] = [];
		const text = view.state.doc.toString().trim();

		if (!text) {
			return diagnostics; // Empty is valid
		}

		// Detect if it's JSON
		const looksLikeJson = text.startsWith('{') || text.startsWith('[');
		
		// Detect if it has CSV-like content (commas, no braces)
		const hasCommas = text.includes(',');
		const hasBraces = text.includes('{') || text.includes('[');

		if (looksLikeJson) {
			// Validate JSON syntax
			try {
				JSON.parse(text);
			} catch (e: any) {
				// JSON syntax error
				diagnostics.push({
					from: 0,
					to: text.length,
					severity: 'error',
					message: `JSON syntax error: ${e.message}`
				});
			}
		} else if (hasCommas && !hasBraces) {
			// Looks like CSV - basic validation
			const lines = text.split('\n').filter(l => l.trim());
			if (lines.length > 0) {
				const firstLineCommas = (lines[0].match(/,/g) || []).length;
				
				// Check if all lines have roughly the same number of commas
				for (let i = 1; i < lines.length; i++) {
					const lineCommas = (lines[i].match(/,/g) || []).length;
					if (Math.abs(lineCommas - firstLineCommas) > 1) {
						const lineStart = text.split('\n').slice(0, i).join('\n').length + 1;
						diagnostics.push({
							from: lineStart,
							to: lineStart + lines[i].length,
							severity: 'warning',
							message: `Inconsistent column count: line ${i + 1} has ${lineCommas + 1} columns, expected ${firstLineCommas + 1}`
						});
					}
				}
			}
		} else if (hasBraces && hasCommas) {
			// Mixed content - likely a mistake
			diagnostics.push({
				from: 0,
				to: text.length,
				severity: 'error',
				message: 'Mixed JSON and CSV content detected. Please use either JSON or CSV format, not both.'
			});
		}

		return diagnostics;
	}

	// Initialize CodeMirror
	onMount(() => {
		const startState = EditorState.create({
			doc: value,
			extensions: [
				basicSetup,
				json(),
				lintGutter(),
				linter(jsonParseLinter()),
				linter(dataFormatLinter),
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						const newValue = update.state.doc.toString();
						if (onchange) {
							onchange(newValue);
						}

						// Extract errors
						if (onerror) {
							const diagnostics = dataFormatLinter(update.view);
							const errors = diagnostics
								.filter(d => d.severity === 'error')
								.map(d => d.message);
							onerror(errors);
						}
					}
				}),
				EditorView.editable.of(!readonly),
				EditorView.theme({
					'&': { height: '100%' },
					'.cm-scroller': { overflow: 'auto' },
					'.cm-content': {
						fontFamily: "'Fira Code', 'Courier New', monospace",
						fontSize: '14px'
					}
				})
			]
		});

		editorView = new EditorView({
			state: startState,
			parent: editorContainer
		});
	});

	onDestroy(() => {
		if (editorView) {
			editorView.destroy();
		}
	});

	// Public methods (exposed via binding)
	export function setValue(newValue: string) {
		if (editorView) {
			editorView.dispatch({
				changes: {
					from: 0,
					to: editorView.state.doc.length,
					insert: newValue
				}
			});
		}
	}

	export function getValue(): string {
		return editorView?.state.doc.toString() || '';
	}

	// Handle file upload
	function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		
		if (!file) return;

		// Check file extension
		const fileName = file.name.toLowerCase();
		const isJson = fileName.endsWith('.json');
		const isCsv = fileName.endsWith('.csv');

		if (!isJson && !isCsv) {
			alert('Please upload a .json or .csv file');
			target.value = ''; // Reset input
			return;
		}

		const reader = new FileReader();
		
		reader.onload = (e) => {
			const content = e.target?.result as string;
			
			if (isJson) {
				// Validate JSON
				try {
					JSON.parse(content);
					setValue(content);
					if (onchange) onchange(content);
				} catch (err: any) {
					alert(`Invalid JSON file: ${err.message}`);
				}
			} else {
				// CSV - just load it
				setValue(content);
				if (onchange) onchange(content);
			}
			
			target.value = ''; // Reset input for next upload
		};

		reader.onerror = () => {
			alert('Failed to read file');
			target.value = '';
		};

		reader.readAsText(file);
	}

	function triggerFileUpload() {
		fileInput?.click();
	}
</script>

<div class="flex h-full flex-col">
	<!-- Toolbar -->
	<div class="border-b border-neutral-200 bg-neutral-50 px-4 py-2">
		<button
			type="button"
			onclick={triggerFileUpload}
			class="inline-flex items-center gap-2 rounded-md bg-runiq-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-runiq-600 focus:outline-none focus:ring-2 focus:ring-runiq-500 focus:ring-offset-2"
		>
			<Upload class="h-4 w-4" />
			Upload JSON/CSV
		</button>
		<input
			bind:this={fileInput}
			type="file"
			accept=".json,.csv"
			onchange={handleFileUpload}
			class="hidden"
		/>
	</div>

	<!-- Editor -->
	<div bind:this={editorContainer} class="flex-1"></div>
</div>

<style>
	:global(.cm-editor) {
		height: 100%;
	}
</style>
