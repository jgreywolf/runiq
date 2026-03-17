import { OSS_EDITOR_SHELL_CONFIG } from '@runiq/editor-core';

export {
	createEditorShellConfig,
	OSS_CANVAS_TOOLBAR_PRESET,
	type CanvasToolbarPreset,
	type EditorShellConfig
} from '@runiq/editor-core';

export const editorShellConfig = OSS_EDITOR_SHELL_CONFIG;

export const editorHostPreset = editorShellConfig.hostPreset;
export const editorToolbarPreset = editorShellConfig.toolbarPreset;
