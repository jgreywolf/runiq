import { resolveEditorCapabilities, type EditorCapabilitiesSnapshot } from '@runiq/editor-core';
import { ProfileName } from '$lib/types';
import { editorSettings } from './editorSettings.svelte';
import { editorHostPreset, editorShellConfig, editorToolbarPreset } from './editorShellConfig';

export interface EditorHostConfig {
	id: string;
	label: string;
	hostPreset: typeof editorHostPreset;
	shellConfig: typeof editorShellConfig;
	toolbarPreset: typeof editorToolbarPreset;
	settings: typeof editorSettings;
	getCapabilities: (profileName: ProfileName | null) => EditorCapabilitiesSnapshot;
}

export const editorHostConfig: EditorHostConfig = {
	id: 'editor-oss',
	label: 'Runiq OSS Editor',
	hostPreset: editorHostPreset,
	shellConfig: editorShellConfig,
	toolbarPreset: editorToolbarPreset,
	settings: editorSettings,
	getCapabilities(profileName: ProfileName | null) {
		return resolveEditorCapabilities(profileName, editorSettings.snapshot, editorHostPreset);
	}
};
