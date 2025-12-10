/**
 * Editor Type Definitions
 * Centralized types for the Runiq visual editor
 */

import type { DiagramProfile, NodeLocation } from '@runiq/parser-dsl';

// ============================================================================
// Editor Modes
// ============================================================================

export type EditorMode = 'select' | 'connect';

// ============================================================================
// Selection State
// ============================================================================

export interface SelectionState {
	/** Set of selected element IDs (nodes or edges) */
	selectedIds: Set<string>;
	/** Currently hovered element ID */
	hoveredId: string | null;
	/** Active lasso selection box (if any) */
	lassoBox: BoundingBox | null;
}

// ============================================================================
// Canvas State
// ============================================================================

export interface ViewportState {
	/** Current pan offset in pixels */
	panOffset: Point;
	/** Current zoom level (1.0 = 100%) */
	zoom: number;
	/** Whether user is currently dragging */
	isDragging: boolean;
	/** Whether user is currently panning the canvas */
	isPanning: boolean;
}

// ============================================================================
// Diagram State
// ============================================================================

export interface DiagramElement {
	id: string;
	type: 'node' | 'edge';
	label?: string;
	shapeType?: string;
	position?: Point;
	properties?: Record<string, any>;
	location?: NodeLocation;
}

export interface DiagramData {
	/** Parsed diagram profile */
	profile: DiagramProfile | null;
	/** Map of elements by ID */
	elements: Map<string, DiagramElement>;
	/** Current diagram code */
	code: string;
	/** Data content (JSON/CSV) */
	dataContent: string;
	/** Parse errors */
	errors: string[];
	/** Parse warnings */
	warnings: string[];
}

// ============================================================================
// Style State
// ============================================================================

export interface StyleProperties {
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
	opacity?: number;
	fontSize?: number;
	fontFamily?: string;
	fontWeight?: string;
	[key: string]: any;
}

export interface StyleState {
	/** Current style values (for selected elements) */
	currentStyles: StyleProperties;
	/** Whether style panel is visible */
	isVisible: boolean;
	/** Whether styles are mixed (multi-selection with different values) */
	hasMixedValues: boolean;
}

// ============================================================================
// Geometry Types
// ============================================================================

export interface Point {
	x: number;
	y: number;
}

export interface BoundingBox {
	x: number;
	y: number;
	width: number;
	height: number;
}

// ============================================================================
// History Management
// ============================================================================

export interface HistoryState {
	/** Stack of code states */
	history: string[];
	/** Current position in history */
	index: number;
	/** Maximum history size */
	maxSize: number;
}

// ============================================================================
// Document State
// ============================================================================

export interface DocumentState {
	/** Diagram name */
	name: string;
	/** Last save timestamp */
	lastSaved: Date | null;
	/** Whether document has unsaved changes */
	isDirty: boolean;
	/** Auto-save timeout ID */
	autoSaveTimeout: ReturnType<typeof setTimeout> | null;
}
