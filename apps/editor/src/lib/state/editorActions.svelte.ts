import { getTemplate } from '$lib/data/diagram-templates';
import { openGlyphsetConversionDialog } from '$lib/state/glyphsetConversionDialog.svelte';
import { ProfileName } from '$lib/types';
import { exportAsPng, exportAsSvg } from '../utils/diagramExport';
import { convertGlyphset } from '../utils/glyphsetConversion';
import { autoSave, editorRefs, editorState, history } from './editorCore.svelte';
import { diagramState } from './diagramState.svelte';
import { applyDraftOperation, type DraftOperation } from './draftOperations';
import { detectProfile } from './profileDetection';

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
 * Handle editor warnings
 */
export function handleEditorWarnings(editorWarnings: string[]) {
	editorState.lintWarnings = editorWarnings;
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
	const op: DraftOperation = {
		type: 'edit',
		targetId: nodeOrEdgeId,
		property,
		value
	};
	const { newCode } = applyDraftOperation(
		editorState.code,
		editorState.shapeCounter,
		op,
		diagramState.nodeLocations
	);

	if (newCode !== editorState.code) {
		updateCode(newCode);
	}
}

/**
 * Handle shape insertion from toolbox
 */
export function handleInsertShape(shapeCode: string) {
	const { newCode, shapeCounterDelta } = applyDraftOperation(
		editorState.code,
		editorState.shapeCounter,
		{
			type: 'insert-shape',
			shapeCode
		}
	);
	if (newCode !== editorState.code) {
		editorState.shapeCounter += shapeCounterDelta;
		updateCode(newCode);
	}
}

/**
 * Handle inserting a shape and immediately connecting it from an existing node.
 */
export function handleInsertShapeAndEdge(
	shapeCode: string,
	fromNodeId: string,
	toNodeId: string
) {
	const { newCode, shapeCounterDelta } = applyDraftOperation(
		editorState.code,
		editorState.shapeCounter,
		{
			type: 'insert-shape-and-edge',
			shapeCode,
			fromNodeId,
			toNodeId
		}
	);
	if (newCode === editorState.code) {
		return;
	}

	editorState.shapeCounter += shapeCounterDelta;
	updateCode(newCode);
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
	if (!result.success) {
		// Extract current glyphset type from code
		const match = code.match(/glyphset\s+(\w+)/);
		const fromType = match?.[1] || 'unknown';

		// Always open the dialog for failed conversions
		openGlyphsetConversionDialog(
			fromType,
			newGlyphsetType,
			result.errors[0] || 'Cannot convert between these glyphset types',
			result.canConvert || false
		);
		return;
	}

	// Show warnings if any
	if (result.warnings.length > 0) {
		const warningMsg = result.warnings.join('\nâ€¢ ');
		console.warn(`Glyphset conversion warnings:\nâ€¢ ${warningMsg}`);
	}

	updateCode(result.newCode, true); // Add to history so it can be undone
}

/**
 * Handle transforming and converting a glyphset
 * Used when converting from/to groupedProcess, matrix types, or other special structures
 */
export function handleConvertWithTransform(fromType: string, targetGlyphsetType: string) {
	const code = editorState.code;

	// Use centralized routing logic
	const result = convertGlyphset(code, targetGlyphsetType);

	if (!result.success) {
		const errorMsg = result.errors.join('\n');
		alert(`Cannot convert glyphset:\n\n${errorMsg}`);
		return;
	}

	// Show warnings if any
	if (result.warnings.length > 0) {
		const warningMsg = result.warnings.join('\nâ€¢ ');
		console.warn(`Glyphset conversion warnings:\nâ€¢ ${warningMsg}`);
	}

	updateCode(result.newCode, true); // Add to history so it can be undone
}

/**
 * Handle edge insertion from visual canvas
 */
export function handleInsertEdge(fromNodeId: string, toNodeId: string) {
	const { newCode } = applyDraftOperation(editorState.code, editorState.shapeCounter, {
		type: 'insert-edge',
		fromNodeId,
		toNodeId
	});
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
	const { newCode } = applyDraftOperation(editorState.code, editorState.shapeCounter, {
		type: 'delete',
		nodeId,
		edgeId
	});
	if (newCode !== editorState.code) {
		updateCode(newCode);
	}
}

/**
 * Handle resetting styles
 */
export function handleResetStyles(elementIds: string[]) {
	const { newCode } = applyDraftOperation(editorState.code, editorState.shapeCounter, {
		type: 'reset-styles',
		elementIds
	});
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
