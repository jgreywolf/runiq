/**
 * Store Exports
 * Centralized exports for all editor states
 */

// State management
export { DiagramState, diagramState } from './diagramState.svelte';
export { StyleState, styleState } from './styleState.svelte';
export { CanvasState, canvasState } from './canvasState.svelte';
export { editorHostConfig } from './editorHostConfig';
export {
	editorSettings,
	getDefaultLayoutStrategyForProfile,
	getDefaultProfileForSettings,
	getLayoutStrategyPresetForProfile,
	profileSupportsDefaultCanvasModeSelection,
	profileSupportsLayoutEngineSelection,
	profileSupportsLayoutStrategySelection
} from './editorSettings.svelte';
export { editorHostPreset, editorShellConfig, editorToolbarPreset } from './editorShellConfig';
export {
	autoSave,
	detectProfile,
	editorRefs,
	editorState,
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
	history,
	initializeEditor,
	updateCode
} from './editorState.svelte';

// Types
export type {
	EditorMode,
	SelectionState,
	ViewportState,
	DiagramElement,
	DiagramData,
	StyleProperties,
	StyleState as StyleStateType,
	Point,
	BoundingBox,
	HistoryState,
	DocumentState
} from '../types/editor';
