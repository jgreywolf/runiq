/**
 * Centralized editor actions using Svelte 5 runes
 *
 * This module provides a shared state and action handlers that can be imported
 * and used directly by any component, eliminating the need for prop drilling.
 */

import { ProfileName } from '$lib/types';
import { AutoSaveManager } from '../utils/autoSave.svelte';
import { HistoryManager } from '../utils/historyManager.svelte';
import { getTemplate } from '$lib/data/diagram-templates';
import { exportAsSvg, exportAsPng } from '../utils/diagramExport';
import * as DSL from '../utils/dslCodeManipulation';
import {
	convertGlyphset,
	flattenGroupedProcess,
	expandToGroupedProcess,
	flattenMatrix,
	expandToMatrix,
	flattenSegmentedPyramid,
	expandToSegmentedPyramid,
	flattenHub,
	expandToHub,
	flattenLabeledHierarchy,
	flattenTableHierarchy,
	flattenCircleHierarchy,
	expandToCircleHierarchy
} from '../utils/glyphsetConversion';
import { openGlyphsetConversionDialog } from '$lib/state/glyphsetConversionDialog.svelte';

// Type definitions
export interface EditorRefs {
	code: { setValue: (code: string) => void; insertAtCursor: (text: string) => void } | null;
	data: { setValue: (data: string) => void } | null;
	preview: { hasValidDiagram: () => boolean; getSvg: () => string } | null;
	viewport: {
		zoomIn: () => void;
		zoomOut: () => void;
		resetZoom: () => void;
		fitToScreen: (
			svgWidth: number,
			svgHeight: number,
			containerWidth: number,
			containerHeight: number
		) => void;
		translateX: number;
		translateY: number;
		scale: number;
	} | null;
}

export interface EditorState {
	code: string;
	dataContent: string;
	dataErrors: string[];
	errors: string[];
	diagramName: string;
	isDirty: boolean;
	activeTab: string;
	layoutEngine: string;
	shapeCounter: number;
	showCodeEditor: boolean;
	profileName: ProfileName | null;
}

/**
 * Detect profile type from current code
 * Official profiles: diagram, sequence, wardley, electrical, pneumatic, hydraulic, glyphset, timeline
 */
export function detectProfile(code: string): ProfileName {
	const trimmed = code.trim();
	if (trimmed.startsWith('electrical')) return ProfileName.electrical;
	if (trimmed.startsWith('pneumatic')) return ProfileName.pneumatic;
	if (trimmed.startsWith('hydraulic')) return ProfileName.hydraulic;
	if (trimmed.startsWith('wardley')) return ProfileName.wardley;
	if (trimmed.startsWith('sequence')) return ProfileName.sequence;
	if (trimmed.startsWith('timeline')) return ProfileName.timeline;
	if (trimmed.startsWith('glyphset')) return ProfileName.glyphset;
	return ProfileName.diagram;
}

// Auto-save and history managers (initialize early to restore state)
export const autoSave = new AutoSaveManager();
const { code: restoredCode, lastSaved: restoredLastSaved } = autoSave.restore();
export const history = new HistoryManager(restoredCode);

// Update autoSave's lastSaved timestamp
autoSave.lastSaved = restoredLastSaved;

// Create shared editor state (initialized with restored code and detected profile)
export const editorState = $state<EditorState>({
	code: restoredCode,
	dataContent: '',
	dataErrors: [],
	errors: [],
	diagramName: 'New Diagram',
	isDirty: false,
	activeTab: 'syntax',
	layoutEngine: 'elk',
	shapeCounter: 1,
	showCodeEditor: true,
	profileName: detectProfile(restoredCode)
});

// Create shared editor refs
export const editorRefs = $state<EditorRefs>({
	code: null,
	data: null,
	preview: null,
	viewport: null
});

/**
 * Initialize the editor with saved state
 * @deprecated State is now initialized at module load time
 */
export function initializeEditor() {
	// No-op: initialization happens at module load now
	// Kept for backwards compatibility
}

/**
 * Update code in the editor
 * @param newCode - The new code to set
 * @param addToHistory - If true, adds the change to undo/redo history (default: false)
 */
export function updateCode(newCode: string, addToHistory: boolean = false) {
	// Add to history first if requested
	if (addToHistory) {
		history.push(newCode);
	}

	// Update CodeMirror editor (single source of truth)
	// This will trigger handleCodeChange via updateListener, which updates state
	if (editorRefs.code) {
		editorRefs.code.setValue(newCode);
	} else {
		// Fallback if editor not mounted yet
		editorState.code = newCode;
		editorState.profileName = detectProfile(newCode);
	}
}

/**
 * Handle code changes with auto-save
 * Called by CodeMirror updateListener for user-initiated changes only
 */
export function handleCodeChange(newCode: string, addToHistory: boolean = true) {
	editorState.code = newCode;
	editorState.profileName = detectProfile(newCode);
	editorState.isDirty = true;

	// Add to history for user typing (not for undo/redo or programmatic changes)
	if (addToHistory && !history.isUndoRedoAction) {
		history.push(newCode);
	}

	autoSave.schedule(editorState.code, () => {
		editorState.isDirty = false;
	});
}

/**
 * Handle editor errors
 */
export function handleEditorErrors(editorErrors: string[]) {
	console.log('Editor errors:', editorErrors);
}

/**
 * Handle data editor changes
 */
export function handleDataChange(newData: string) {
	editorState.dataContent = newData;
}

/**
 * Handle data editor errors
 */
export function handleDataErrors(errors: string[]) {
	editorState.dataErrors = errors;
	console.log('Data errors:', errors);
}

/**
 * Handle parse results from preview
 */
export function handleParse(success: boolean, parseErrors: string[]) {
	editorState.errors = parseErrors;
}

/**
 * Handle edit from visual canvas
 */
export function handleEdit(
	nodeOrEdgeId: string,
	property: string,
	value: string | number | boolean | { x: number; y: number }
) {
	let newCode = editorState.code;

	if (property === 'label') {
		newCode = DSL.editLabel(editorState.code, nodeOrEdgeId, String(value), false);
	} else if (property === 'edgeLabel') {
		newCode = DSL.editLabel(editorState.code, nodeOrEdgeId, String(value), true);
	} else if (property === 'position') {
		if (typeof value === 'object' && 'x' in value && 'y' in value) {
			newCode = DSL.editPosition(editorState.code, nodeOrEdgeId, value.x, value.y);
		}
	} else if (
		[
			'fillColor',
			'strokeColor',
			'strokeWidth',
			'fontSize',
			'textColor',
			'shadow',
			'routing'
		].includes(property)
	) {
		newCode = DSL.editStyleProperty(editorState.code, nodeOrEdgeId, property, value);
	}

	if (newCode !== editorState.code) {
		updateCode(newCode);
	}
}

/**
 * Handle shape insertion from toolbox
 */
export function handleInsertShape(shapeCode: string) {
	const newCode = DSL.insertShape(editorState.code, shapeCode, editorState.shapeCounter);
	if (newCode !== editorState.code) {
		editorState.shapeCounter++;
		updateCode(newCode);
	} else if (editorRefs.code) {
		// Replace 'id' with 'id{counter}' only when it's a standalone word boundary
		editorRefs.code.insertAtCursor(shapeCode.replace(/\bid\b/g, `id${editorState.shapeCounter++}`));
	}
}

/**
 * Handle glyphset type replacement from toolbox
 * Replaces the glyphset type while preserving name, items, theme, and other properties
 * Converts item keywords as needed and provides warnings for potential issues
 */
export function handleReplaceGlyphset(newGlyphsetType: string) {
	const code = editorState.code;

	// Use the conversion utility
	const result = convertGlyphset(code, newGlyphsetType);
	console.log('Glyphset conversion result:', result);
	if (!result.success) {
		// Extract current glyphset type from code
		const match = code.match(/glyphset\s+(\w+)/);
		const fromType = match?.[1] || 'unknown';

		// Always open the dialog for failed conversions
		openGlyphsetConversionDialog(
			fromType,
			newGlyphsetType,
			result.errors[0] || 'Cannot convert between these glyphset types',
			result.alternatives || [],
			result.canConvert || false
		);
		return;
	}

	// Show warnings if any
	if (result.warnings.length > 0) {
		const warningMsg = result.warnings.join('\n• ');
		console.warn(`Glyphset conversion warnings:\n• ${warningMsg}`);

		// For now, log to console. Could show toast notification in future
		// Optional: Uncomment to show warnings to user
		// const shouldContinue = confirm(
		// 	`Glyphset converted with warnings:\n\n• ${warningMsg}\n\nContinue?`
		// );
		// if (!shouldContinue) return;
	}

	updateCode(result.newCode, true); // Add to history so it can be undone
}

/**
 * Handle transforming and converting a glyphset
 * Used when converting from/to groupedProcess, matrix types, or other special structures
 */
export function handleConvertWithTransform(fromType: string, targetGlyphsetType: string) {
	const code = editorState.code;
	let result;

	const matrixTypes = ['matrix2x2', 'matrix3x3', 'segmentedMatrix', 'titledMatrix'];

	// Flatten if converting FROM groupedProcess
	if (fromType === 'groupedProcess') {
		result = flattenGroupedProcess(code, targetGlyphsetType);
	}
	// Expand if converting TO groupedProcess
	else if (targetGlyphsetType === 'groupedProcess') {
		result = expandToGroupedProcess(code);
	}
	// Flatten if converting FROM matrix types
	else if (matrixTypes.includes(fromType) && !matrixTypes.includes(targetGlyphsetType)) {
		result = flattenMatrix(code, targetGlyphsetType);
	}
	// Expand if converting TO matrix types
	else if (!matrixTypes.includes(fromType) && matrixTypes.includes(targetGlyphsetType)) {
		result = expandToMatrix(code, targetGlyphsetType);
	}
	// Flatten if converting FROM segmentedPyramid
	else if (fromType === 'segmentedPyramid') {
		result = flattenSegmentedPyramid(code, targetGlyphsetType);
	}
	// Expand if converting TO segmentedPyramid
	else if (targetGlyphsetType === 'segmentedPyramid') {
		result = expandToSegmentedPyramid(code);
	}
	// Flatten if converting FROM hub
	else if (fromType === 'hub') {
		result = flattenHub(code, targetGlyphsetType);
	}
	// Expand if converting TO hub
	else if (targetGlyphsetType === 'hub') {
		result = expandToHub(code);
	}
	// Flatten if converting FROM labeledHierarchy
	else if (fromType === 'labeledHierarchy') {
		result = flattenLabeledHierarchy(code, targetGlyphsetType);
	}
	// Flatten if converting FROM tableHierarchy
	else if (fromType === 'tableHierarchy') {
		result = flattenTableHierarchy(code, targetGlyphsetType);
	}
	// Flatten if converting FROM circleHierarchy
	else if (fromType === 'circleHierarchy') {
		result = flattenCircleHierarchy(code, targetGlyphsetType);
	}
	// Expand if converting TO circleHierarchy
	else if (targetGlyphsetType === 'circleHierarchy') {
		result = expandToCircleHierarchy(code);
	} else {
		// Fallback to regular conversion
		result = convertGlyphset(code, targetGlyphsetType);
	}

	if (!result.success) {
		const errorMsg = result.errors.join('\n');
		alert(`Cannot convert glyphset:\n\n${errorMsg}`);
		return;
	}

	// Show warnings if any
	if (result.warnings.length > 0) {
		const warningMsg = result.warnings.join('\n• ');
		console.warn(`Glyphset conversion warnings:\n• ${warningMsg}`);
	}

	updateCode(result.newCode, true); // Add to history so it can be undone
}

/**
 * Handle edge insertion from visual canvas
 */
export function handleInsertEdge(fromNodeId: string, toNodeId: string) {
	const newCode = DSL.insertEdge(editorState.code, fromNodeId, toNodeId);
	if (newCode !== editorState.code) {
		updateCode(newCode);
	} else if (editorRefs.code) {
		editorRefs.code.insertAtCursor(`${fromNodeId} -> ${toNodeId}`);
	}
}

/**
 * Handle undo (Ctrl+Z)
 */
export function handleUndo() {
	const previousCode = history.undo();
	if (previousCode !== null) {
		updateCode(previousCode);
		history.resetFlag();
	}
}

/**
 * Handle redo (Ctrl+Y or Ctrl+Shift+Z)
 */
export function handleRedo() {
	const nextCode = history.redo();
	if (nextCode !== null) {
		updateCode(nextCode);
		history.resetFlag();
	}
}

/**
 * Handle keyboard shortcuts
 */
export function handleKeyDown(event: KeyboardEvent) {
	const isCtrlOrCmd = event.ctrlKey || event.metaKey;

	if (isCtrlOrCmd && event.key === 'z' && !event.shiftKey) {
		event.preventDefault();
		handleUndo();
	} else if (isCtrlOrCmd && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
		event.preventDefault();
		handleRedo();
	}
}

/**
 * Handle element deletion
 */
export function handleDelete(nodeId: string | null, edgeId: string | null) {
	const newCode = DSL.deleteElement(editorState.code, nodeId, edgeId);
	if (newCode !== editorState.code) {
		updateCode(newCode);
	}
}

/**
 * Handle resetting styles
 */
export function handleResetStyles(elementIds: string[]) {
	const newCode = DSL.resetStyles(editorState.code, elementIds);
	updateCode(newCode);
}

/**
 * Handle theme change
 */
export function handleThemeChange(newCode: string) {
	updateCode(newCode);
	editorState.isDirty = true;
}

/**
 * Handle sample diagram insertion
 */
export function handleInsertSample(sampleCode: string, sampleData?: string) {
	updateCode(sampleCode);
	editorState.code = sampleCode;
	editorState.profileName = detectProfile(sampleCode);

	if (sampleData && editorRefs.data) {
		editorRefs.data.setValue(sampleData);
		editorState.dataContent = sampleData;
	} else if (editorRefs.data) {
		editorRefs.data.setValue('');
		editorState.dataContent = '';
	}

	history.reset(sampleCode);
	editorState.isDirty = true;
}

/**
 * Handle new diagram creation
 */
export function handleNewDiagram(type: ProfileName) {
	const template = getTemplate(type);
	updateCode(template.content);
	editorState.code = template.content;
	editorState.profileName = type;
	editorState.diagramName = template.name;
	editorState.isDirty = false;
	history.reset(template.content);
	autoSave.clear();
	console.log(`New ${type} created`);
}

/**
 * Handle export
 */
export async function handleExport(format: 'svg' | 'png') {
	if (!editorRefs.preview || !editorRefs.preview.hasValidDiagram()) {
		alert('No valid diagram to export. Please fix any errors first.');
		return;
	}

	const svg = editorRefs.preview.getSvg();

	try {
		if (format === 'svg') {
			exportAsSvg(svg, editorState.diagramName);
		} else {
			await exportAsPng(svg, editorState.diagramName);
		}
	} catch (error) {
		alert(error instanceof Error ? error.message : 'Export failed');
	}
}
