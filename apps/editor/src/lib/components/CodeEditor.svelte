<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { EditorView, basicSetup } from 'codemirror';
	import { EditorState, Compartment } from '@codemirror/state';
	import { javascript } from '@codemirror/lang-javascript';
	import { lintGutter, linter } from '@codemirror/lint';
	import type { Diagnostic } from '@codemirror/lint';

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
	let editorTheme = new Compartment();

	// Sample Runiq DSL code
	const sampleCode = `diagram "Parallel Signal Processing" {
  shape input as @box label:"Input"
  shape split as @small-circle label:""
  shape g1 as @gain label:"10"
  shape g2 as @gain label:"5"
  shape mult as @multiply-junction label:"×"
  shape output as @box label:"Output"

  input -> split
  split -> g1 label:"path 1"
  split -> g2 label:"path 2"
  g1 -> mult
  g2 -> mult
  mult -> output
}`;

	// Simple DSL linter (basic validation)
	function runiqLinter(view: EditorView): Diagnostic[] {
		const diagnostics: Diagnostic[] = [];
		const doc = view.state.doc;
		const text = doc.toString();

		// Basic syntax checking
		const lines = text.split('\n');
		lines.forEach((line, index) => {
			const lineNumber = index + 1;
			const trimmed = line.trim();

			// Check for common issues
			if (trimmed.startsWith('shape') && !trimmed.includes('as')) {
				diagnostics.push({
					from: doc.line(lineNumber).from,
					to: doc.line(lineNumber).to,
					severity: 'error',
					message: 'Shape definition must include "as @type"'
				});
			}

			if (trimmed.includes('->') && trimmed.split('->').length > 2) {
				diagnostics.push({
					from: doc.line(lineNumber).from,
					to: doc.line(lineNumber).to,
					severity: 'warning',
					message: 'Multiple arrows on one line may cause confusion'
				});
			}
		});

		return diagnostics;
	}

	// Custom theme for Runiq DSL
	const runiqTheme = EditorView.theme({
		'&': {
			height: '100%',
			fontSize: '14px',
			fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace'
		},
		'.cm-content': {
			padding: '10px 0',
			caretColor: '#5a819e'
		},
		'.cm-line': {
			padding: '0 10px'
		},
		'.cm-gutters': {
			backgroundColor: '#f9fafb',
			color: '#6b7280',
			border: 'none'
		},
		'.cm-activeLineGutter': {
			backgroundColor: '#e5e7eb'
		},
		'.cm-activeLine': {
			backgroundColor: '#f0f5f8'
		},
		'.cm-selectionBackground': {
			backgroundColor: '#dce8ef !important'
		},
		'&.cm-focused .cm-selectionBackground': {
			backgroundColor: '#b9d1df !important'
		},
		'.cm-cursor': {
			borderLeftColor: '#5a819e'
		}
	});

	onMount(() => {
		const startState = EditorState.create({
			doc: value || sampleCode,
			extensions: [
				basicSetup,
				javascript(), // Temporary - will create custom Runiq language later
				lintGutter(),
				linter(runiqLinter),
				editorTheme.of(runiqTheme),
				EditorView.updateListener.of((update) => {
					if (update.docChanged && onchange) {
						const newValue = update.state.doc.toString();
						onchange(newValue);

						// Extract errors for parent component
						const diagnostics = runiqLinter(update.view);
						if (onerror) {
							const errors = diagnostics
								.filter((d) => d.severity === 'error')
								.map((d) => d.message);
							onerror(errors);
						}
					}
				}),
				EditorView.editable.of(!readonly)
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
			editorView = null;
		}
	});

	// Export function to get current value
	export function getValue(): string {
		return editorView?.state.doc.toString() || '';
	}

	// Export function to set value
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
</script>

<div class="h-full w-full overflow-hidden" bind:this={editorContainer}></div>

<style>
	:global(.cm-editor) {
		height: 100%;
	}

	:global(.cm-scroller) {
		overflow: auto;
	}
</style>
