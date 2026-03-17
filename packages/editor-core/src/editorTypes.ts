export interface SourceNodeLocation {
	startLine: number;
	startColumn: number;
	endLine?: number;
	endColumn?: number;
}

export type EditorMode = 'select' | 'connect';

export interface SelectionState {
	selectedIds: Set<string>;
	hoveredId: string | null;
	lassoBox: BoundingBox | null;
}

export interface ViewportState {
	panOffset: Point;
	zoom: number;
	isDragging: boolean;
	isPanning: boolean;
}

export interface DiagramElement {
	id: string;
	type: 'node' | 'edge';
	label?: string;
	shapeType?: string;
	position?: Point;
	properties?: Record<string, unknown>;
	location?: SourceNodeLocation;
}

export interface DiagramData {
	profile: unknown | null;
	elements: Map<string, DiagramElement>;
	code: string;
	dataContent: string;
	errors: string[];
	warnings: string[];
}

export interface StyleProperties {
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
	opacity?: number;
	fontSize?: number;
	fontFamily?: string;
	fontWeight?: string;
	[key: string]: unknown;
}

export interface EditorStyleState {
	currentStyles: StyleProperties;
	isVisible: boolean;
	hasMixedValues: boolean;
}

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

export interface HistoryState {
	history: string[];
	index: number;
	maxSize: number;
}

export interface DocumentState {
	name: string;
	lastSaved: Date | null;
	isDirty: boolean;
	autoSaveTimeout: ReturnType<typeof setTimeout> | null;
}
