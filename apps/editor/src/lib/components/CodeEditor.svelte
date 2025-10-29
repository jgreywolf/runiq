<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { EditorView, basicSetup } from 'codemirror';
	import { EditorState, Compartment } from '@codemirror/state';
	import { javascript } from '@codemirror/lang-javascript';
	import { lintGutter, linter } from '@codemirror/lint';
	import type { Diagnostic, Action } from '@codemirror/lint';
	import { autocompletion, type CompletionContext } from '@codemirror/autocomplete';
	import { createRuniqServices } from '@runiq/parser-dsl';
	import { EmptyFileSystem, URI } from 'langium';
	import type { Diagnostic as LangiumDiagnostic } from 'vscode-languageserver-types';

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

	// Initialize Langium services for validation
	const langiumServices = createRuniqServices(EmptyFileSystem).Runiq;

	// Enhanced DSL linter with Langium validation
	async function runiqLinter(view: EditorView): Promise<Diagnostic[]> {
		const diagnostics: Diagnostic[] = [];
		const doc = view.state.doc;
		const text = doc.toString();

		try {
			// Create a temporary Langium document with proper URI
			const uri = URI.parse('inmemory://temp.runiq');
			const langiumDoc = langiumServices.shared.workspace.LangiumDocumentFactory.fromString(
				text,
				uri
			);

			// Build the document (resolve cross-references, etc.)
			await langiumServices.shared.workspace.DocumentBuilder.build([langiumDoc], {});

			// Get validation diagnostics
			const validationDiagnostics =
				await langiumServices.validation.DocumentValidator.validateDocument(langiumDoc);

			// Convert Langium diagnostics to CodeMirror format
			for (const diagnostic of validationDiagnostics) {
				const from = offsetAt(doc, diagnostic.range.start);
				const to = offsetAt(doc, diagnostic.range.end);

				// Map Langium severity to CodeMirror severity
				let severity: 'error' | 'warning' | 'info' = 'error';
				if (diagnostic.severity === 1) severity = 'error';
				else if (diagnostic.severity === 2) severity = 'warning';
				else if (diagnostic.severity === 3 || diagnostic.severity === 4) severity = 'info';

				// Extract suggestions from the diagnostic message if present
				const actions = extractQuickFixes(diagnostic, view, from, to);

				diagnostics.push({
					from,
					to,
					severity,
					message: diagnostic.message,
					actions: actions.length > 0 ? actions : undefined
				});
			}
		} catch (err) {
			console.error('Validation error:', err);
		}

		return diagnostics;
	}

	// Convert LSP position to CodeMirror offset
	function offsetAt(doc: any, position: { line: number; character: number }): number {
		const line = doc.line(position.line + 1); // LSP lines are 0-based, CodeMirror is 1-based
		return line.from + position.character;
	}

	// Extract quick-fix actions from diagnostic messages
	function extractQuickFixes(
		diagnostic: LangiumDiagnostic,
		view: EditorView,
		from: number,
		to: number
	): Action[] {
		const actions: Action[] = [];
		const message = diagnostic.message;

		// Look for "Did you mean: X, Y, Z?" pattern
		const didYouMeanMatch = message.match(/Did you mean: ([^?]+)\?/);
		if (didYouMeanMatch) {
			const suggestions = didYouMeanMatch[1].split(',').map((s) => s.trim());

			// Create quick-fix action for each suggestion
			for (const suggestion of suggestions.slice(0, 3)) {
				// Limit to top 3
				actions.push({
					name: `Replace with '${suggestion}'`,
					apply: (view, from, to) => {
						const doc = view.state.doc;
						const lineStart = doc.lineAt(from);
						const lineText = lineStart.text;

						// Find the shape type in the line (after "as")
						const asMatch = lineText.match(/as\s+(@?\w+)/);
						if (asMatch && asMatch[1]) {
							const shapeStart = lineStart.from + lineText.indexOf(asMatch[1]);
							const shapeEnd = shapeStart + asMatch[1].length;

							view.dispatch({
								changes: { from: shapeStart, to: shapeEnd, insert: suggestion }
							});
						}
					}
				});
			}
		}

		return actions;
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
			{ label: '@transferFunction', type: 'type', detail: 'Transfer function' },
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
				linter(runiqLinter), // Now async - CodeMirror handles promises
				autocompletion({ override: [runiqCompletions] }),
				editorTheme.of(runiqTheme),
				EditorView.updateListener.of((update) => {
					if (update.docChanged && onchange) {
						const newValue = update.state.doc.toString();
						onchange(newValue);

						// Extract errors asynchronously
						if (onerror) {
							runiqLinter(update.view).then((diagnostics) => {
								const errors = diagnostics
									.filter((d) => d.severity === 'error')
									.map((d) => d.message);
								onerror(errors);
							});
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
				line.includes('// Add your shapes and connections here')
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
