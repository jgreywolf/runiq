/**
 * Compatibility barrel for editor state/actions.
 *
 * This keeps existing imports stable while implementation is split into:
 * - profileDetection.ts
 * - editorCore.svelte.ts
 * - editorActions.svelte.ts
 */

export { detectProfile } from './profileDetection';
export type { EditorRefs, EditorState } from './editorCore.svelte';
export { autoSave, editorRefs, editorState, history, initializeEditor } from './editorCore.svelte';
export {
	handleCodeChange,
	handleConvertWithTransform,
	handleDataChange,
	handleDataErrors,
	handleDelete,
	handleEdit,
	handleEditorErrors,
	handleEditorWarnings,
	handleExport,
	handleInsertEdge,
	handleInsertSample,
	handleInsertShape,
	handleKeyDown,
	handleNewDiagram,
	handleParse,
	handleRedo,
	handleReplaceGlyphset,
	handleResetStyles,
	handleThemeChange,
	handleUndo,
	updateCode
} from './editorActions.svelte';
