import { resolveEditorCapabilities, type EditorCapabilitiesSnapshot } from '@runiq/editor-core';
import { ProfileName } from '$lib/types';
import { editorSettings } from './editorSettings.svelte';
import { editorHostPreset, editorShellConfig, editorToolbarPreset } from './editorShellConfig';

export interface EditorHostConfig {
	id: string;
	label: string;
	brandName: string;
	productName: string;
	logoSrc: string;
	hostPreset: typeof editorHostPreset;
	shellConfig: typeof editorShellConfig;
	toolbarPreset: typeof editorToolbarPreset;
	headerPreset: typeof editorShellConfig.headerPreset;
	toolboxPreset: typeof editorShellConfig.toolboxPreset;
	exportPreset: typeof editorShellConfig.exportPreset;
	settings: typeof editorSettings;
	getCapabilities: (profileName: ProfileName | null) => EditorCapabilitiesSnapshot;
}

export const editorHostConfig: EditorHostConfig = {
	id: 'editor-oss',
	label: 'Runiq OSS Editor',
	brandName: 'Runiq',
	productName: 'Diagram Editor',
	logoSrc: '/images/runiq.at.whiteboard.png',
	hostPreset: editorHostPreset,
	shellConfig: editorShellConfig,
	toolbarPreset: editorToolbarPreset,
	headerPreset: editorShellConfig.headerPreset,
	toolboxPreset: editorShellConfig.toolboxPreset,
	exportPreset: editorShellConfig.exportPreset,
	settings: editorSettings,
	getCapabilities(profileName: ProfileName | null) {
		return resolveEditorCapabilities(profileName, editorSettings.snapshot, editorHostPreset);
	}
};
