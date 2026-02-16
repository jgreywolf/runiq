import { ProfileName } from '$lib/types';
import { AutoSaveManager } from '../utils/autoSave.svelte';
import { HistoryManager } from '../utils/historyManager.svelte';
import { detectProfile } from './profileDetection';

export interface EditorRefs {
	code: {
		setValue: (code: string) => void;
		insertAtCursor: (text: string) => void;
		jumpTo: (line: number, column: number) => void;
	} | null;
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
	lintWarnings: string[];
	diagramName: string;
	isDirty: boolean;
	activeTab: string;
	layoutEngine: string;
	shapeCounter: number;
	showCodeEditor: boolean;
	profileName: ProfileName | null;
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
	lintWarnings: [],
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
