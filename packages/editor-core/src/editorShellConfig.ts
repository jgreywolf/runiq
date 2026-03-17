import {
	type EditorHostPreset,
	OSS_EDITOR_HOST_PRESET,
	PREMIUM_EDITOR_HOST_PRESET
} from './editorCapabilities.js';

export type CanvasToolbarGroupId =
	| 'mode'
	| 'insert'
	| 'theme'
	| 'export'
	| 'viewport';

export interface CanvasToolbarPreset {
	id: string;
	label: string;
	groups: readonly CanvasToolbarGroupId[];
}

export interface EditorShellConfig {
	hostPreset: EditorHostPreset;
	toolbarPreset: CanvasToolbarPreset;
}

export const OSS_CANVAS_TOOLBAR_PRESET: CanvasToolbarPreset = {
	id: 'oss',
	label: 'Open Source Toolbar',
	groups: ['viewport']
};

export const PREMIUM_CANVAS_TOOLBAR_PRESET: CanvasToolbarPreset = {
	id: 'premium',
	label: 'Premium Toolbar',
	groups: ['mode', 'insert', 'theme', 'export', 'viewport']
};

export function resolveCanvasToolbarPreset(hostPreset: EditorHostPreset): CanvasToolbarPreset {
	return hostPreset.id === OSS_EDITOR_HOST_PRESET.id
		? OSS_CANVAS_TOOLBAR_PRESET
		: PREMIUM_CANVAS_TOOLBAR_PRESET;
}

export function createEditorShellConfig(hostPreset: EditorHostPreset): EditorShellConfig {
	return {
		hostPreset,
		toolbarPreset: resolveCanvasToolbarPreset(hostPreset)
	};
}

export const OSS_EDITOR_SHELL_CONFIG = createEditorShellConfig(OSS_EDITOR_HOST_PRESET);
export const PREMIUM_EDITOR_SHELL_CONFIG = createEditorShellConfig(PREMIUM_EDITOR_HOST_PRESET);
