<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { EditorView, basicSetup } from 'codemirror';
	import { EditorState, Compartment } from '@codemirror/state';
	import { javascript } from '@codemirror/lang-javascript';
	import { lintGutter, linter } from '@codemirror/lint';
	import type { Diagnostic } from '@codemirror/lint';
	import { autocompletion, type CompletionContext } from '@codemirror/autocomplete';

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

	// Default blank diagram
	const defaultCode = `diagram "My Diagram" {\n  // Add your shapes and connections here\n}`;

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

	// Autocompletion for Runiq DSL
	function runiqCompletions(context: CompletionContext) {
		const word = context.matchBefore(/\w*/);
		if (!word || (word.from === word.to && !context.explicit)) return null;

		const completions = [
			// Keywords
			{ label: 'diagram', type: 'keyword', detail: 'diagram "name" { ... }' },
			{ label: 'shape', type: 'keyword', detail: 'shape id as @type' },
			{ label: 'group', type: 'keyword', detail: 'group id [...]' },
			{ label: 'style', type: 'keyword', detail: 'style id {...}' },
			{ label: 'as', type: 'keyword' },
			{ label: 'label:', type: 'property' },
			{ label: 'icon:', type: 'property' },
			{ label: 'link:', type: 'property' },
			{ label: 'tooltip:', type: 'property' },
			{ label: 'direction:', type: 'property' },
			{ label: 'TB', type: 'constant', detail: 'Top to Bottom' },
			{ label: 'BT', type: 'constant', detail: 'Bottom to Top' },
			{ label: 'LR', type: 'constant', detail: 'Left to Right' },
			{ label: 'RL', type: 'constant', detail: 'Right to Left' },
			// Basic shapes
			{ label: '@rectangle', type: 'type', detail: 'Basic rectangle' },
			{ label: '@roundedRectangle', type: 'type', detail: 'Rounded rectangle' },
			{ label: '@circle', type: 'type', detail: 'Circle' },
			{ label: '@ellipseWide', type: 'type', detail: 'Wide ellipse' },
			{ label: '@rhombus', type: 'type', detail: 'Diamond shape' },
			{ label: '@hex', type: 'type', detail: 'Hexagon' },
			{ label: '@stadium', type: 'type', detail: 'Stadium (pill shape)' },
			{ label: '@triangle', type: 'type', detail: 'Triangle' },
			{ label: '@parallelogram', type: 'type', detail: 'Parallelogram' },
			// Flowchart shapes
			{ label: '@doc', type: 'type', detail: 'Document' },
			{ label: '@cylinder', type: 'type', detail: 'Database/Cylinder' },
			{ label: '@predefined-process', type: 'type', detail: 'Predefined process' },
			{ label: '@manual-input', type: 'type', detail: 'Manual input' },
			{ label: '@delay', type: 'type', detail: 'Delay' },
			// UML shapes
			{ label: '@class', type: 'type', detail: 'UML Class' },
			{ label: '@actor', type: 'type', detail: 'UML Actor' },
			{ label: '@system-boundary', type: 'type', detail: 'System boundary' },
			// Network shapes
			{ label: '@server', type: 'type', detail: 'Server' },
			{ label: '@router', type: 'type', detail: 'Router' },
			{ label: '@switch', type: 'type', detail: 'Network switch' },
			{ label: '@firewall', type: 'type', detail: 'Firewall' },
			{ label: '@cloud', type: 'type', detail: 'Cloud' },
			// Block diagram shapes
			{ label: '@transfer-function', type: 'type', detail: 'Transfer function' },
			{ label: '@gain', type: 'type', detail: 'Gain block' },
			{ label: '@integrator', type: 'type', detail: 'Integrator' },
			{ label: '@summing-junction', type: 'type', detail: 'Summing junction' },
			// Chart shapes
			{ label: '@pie-chart', type: 'type', detail: 'Pie chart' },
			{ label: '@bar-chart-vertical', type: 'type', detail: 'Vertical bar chart' },
			{ label: '@bar-chart-horizontal', type: 'type', detail: 'Horizontal bar chart' },
			// UML properties
			{ label: 'attributes:', type: 'property', detail: 'Class attributes array' },
			{ label: 'methods:', type: 'property', detail: 'Class methods array' },
			{ label: 'visibility:', type: 'property', detail: 'public|private|protected' },
			{ label: 'public', type: 'constant' },
			{ label: 'private', type: 'constant' },
			{ label: 'protected', type: 'constant' },
			{ label: 'static:', type: 'property', detail: 'Static member flag' },
			{ label: 'abstract:', type: 'property', detail: 'Abstract method flag' },
			{ label: 'derived:', type: 'property', detail: 'Derived attribute flag' },
			// Edge properties
			{ label: 'edgeType:', type: 'property', detail: 'UML relationship type' },
			{ label: 'aggregation', type: 'constant' },
			{ label: 'composition', type: 'constant' },
			{ label: 'generalization', type: 'constant' },
			{ label: 'multiplicitySource:', type: 'property', detail: 'Source multiplicity' },
			{ label: 'multiplicityTarget:', type: 'property', detail: 'Target multiplicity' },
			{ label: 'navigability:', type: 'property', detail: 'Navigation direction' },
			{ label: 'source', type: 'constant' },
			{ label: 'target', type: 'constant' },
			{ label: 'bidirectional', type: 'constant' },
			{ label: 'constraints:', type: 'property', detail: 'Constraints array' }
		];

		return {
			from: word.from,
			options: completions
		};
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
			doc: value || defaultCode,
			extensions: [
				basicSetup,
				javascript(), // Temporary - will create custom Runiq language later
				lintGutter(),
				linter(runiqLinter),
				autocompletion({ override: [runiqCompletions] }),
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

			// Position cursor at the end of the "Add your shapes" comment line
			const doc = editorView.state.doc;
			const text = doc.toString();
			const lines = text.split('\n');

			// Find the line with the comment
			const commentLineIndex = lines.findIndex((line) =>
				line.includes('Add your shapes and connections here')
			);

			if (commentLineIndex !== -1 && commentLineIndex + 1 < lines.length) {
				// Position cursor at the start of the line after the comment
				const targetLine = doc.line(commentLineIndex + 2); // +2 because lines are 1-indexed
				const indent = targetLine.text.match(/^\s*/)?.[0] || '';

				editorView.dispatch({
					selection: { anchor: targetLine.from + indent.length }
				});

				// Focus the editor
				editorView.focus();
			}
		}
	}

	// Export function to insert text at cursor position
	export function insertAtCursor(text: string) {
		if (!editorView) return;

		const cursor = editorView.state.selection.main.head;
		const currentLine = editorView.state.doc.lineAt(cursor);

		// Check if we're at the end of a line or in whitespace
		let insertText = text;
		if (cursor === currentLine.to || currentLine.text.trim() === '') {
			// Insert at end of line or on empty line - add indentation if needed
			const indent = currentLine.text.match(/^\s*/)?.[0] || '';
			if (cursor === currentLine.to && currentLine.text.trim() !== '') {
				// Add newline before if there's content on the line
				insertText = '\n' + indent + text;
			}
		}

		editorView.dispatch({
			changes: {
				from: cursor,
				insert: insertText
			},
			selection: { anchor: cursor + insertText.length }
		});

		// Focus the editor
		editorView.focus();
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
