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

export type HeaderActionId = 'newDiagram' | 'export' | 'settings' | 'help';
export type ExportFormatId = 'svg' | 'png';

export interface CanvasToolbarPreset {
	id: string;
	label: string;
	groups: readonly CanvasToolbarGroupId[];
}

export interface EditorHeaderPreset {
	id: string;
	label: string;
	actions: readonly HeaderActionId[];
}

export interface EditorToolboxPreset {
	id: string;
	label: string;
	showSampleBrowser: boolean;
	showShapeBrowser: boolean;
}

export interface EditorExportPreset {
	id: string;
	label: string;
	formats: readonly ExportFormatId[];
}

export interface EditorShellConfig {
	hostPreset: EditorHostPreset;
	toolbarPreset: CanvasToolbarPreset;
	headerPreset: EditorHeaderPreset;
	toolboxPreset: EditorToolboxPreset;
	exportPreset: EditorExportPreset;
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

export const OSS_HEADER_PRESET: EditorHeaderPreset = {
	id: 'oss',
	label: 'Open Source Header',
	actions: ['newDiagram', 'export', 'settings', 'help']
};

export const PREMIUM_HEADER_PRESET: EditorHeaderPreset = {
	id: 'premium',
	label: 'Premium Header',
	actions: ['newDiagram', 'export', 'settings', 'help']
};

export const OSS_TOOLBOX_PRESET: EditorToolboxPreset = {
	id: 'oss',
	label: 'Open Source Toolbox',
	showSampleBrowser: true,
	showShapeBrowser: true
};

export const PREMIUM_TOOLBOX_PRESET: EditorToolboxPreset = {
	id: 'premium',
	label: 'Premium Toolbox',
	showSampleBrowser: true,
	showShapeBrowser: true
};

export const OSS_EXPORT_PRESET: EditorExportPreset = {
	id: 'oss',
	label: 'Open Source Export',
	formats: ['svg', 'png']
};

export const PREMIUM_EXPORT_PRESET: EditorExportPreset = {
	id: 'premium',
	label: 'Premium Export',
	formats: ['svg', 'png']
};

export function resolveCanvasToolbarPreset(hostPreset: EditorHostPreset): CanvasToolbarPreset {
	return hostPreset.id === OSS_EDITOR_HOST_PRESET.id
		? OSS_CANVAS_TOOLBAR_PRESET
		: PREMIUM_CANVAS_TOOLBAR_PRESET;
}

export function createEditorShellConfig(hostPreset: EditorHostPreset): EditorShellConfig {
	const isOssHost = hostPreset.id === OSS_EDITOR_HOST_PRESET.id;
	return {
		hostPreset,
		toolbarPreset: resolveCanvasToolbarPreset(hostPreset),
		headerPreset: isOssHost ? OSS_HEADER_PRESET : PREMIUM_HEADER_PRESET,
		toolboxPreset: isOssHost ? OSS_TOOLBOX_PRESET : PREMIUM_TOOLBOX_PRESET,
		exportPreset: isOssHost ? OSS_EXPORT_PRESET : PREMIUM_EXPORT_PRESET
	};
}

export const OSS_EDITOR_SHELL_CONFIG = createEditorShellConfig(OSS_EDITOR_HOST_PRESET);
export const PREMIUM_EDITOR_SHELL_CONFIG = createEditorShellConfig(PREMIUM_EDITOR_HOST_PRESET);
