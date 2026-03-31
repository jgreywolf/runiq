/**
 * Store Exports
 * Centralized exports for all editor states
 */

// State management
export { DiagramState, diagramState } from './diagramState.svelte';
export {
	autoSave,
	detectProfile,
	editorRefs,
	editorState,
	handleCodeChange,
	handleConvertWithTransform,
	handleDataChange,
	handleDataErrors,
	handleEditorErrors,
	handleEditorWarnings,
	handleExport,
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
	history,
	initializeEditor,
	updateCode
} from './editorState.svelte';

// Types
export type {
	ViewportState,
	DiagramElement,
	DiagramData,
	StyleProperties,
	Point,
	BoundingBox,
	HistoryState,
	DocumentState
} from '../types/editor';
