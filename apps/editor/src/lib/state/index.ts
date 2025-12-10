/**
 * Store Exports
 * Centralized exports for all editor states
 */

// State management
export { DiagramState, diagramState } from './diagramState.svelte';
export { StyleState, styleState } from './styleState.svelte';
export { CanvasState, canvasState } from './canvasState.svelte';
export { editorState } from './editorState.svelte';

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
