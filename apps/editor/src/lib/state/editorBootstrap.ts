import { iconRegistry, layoutRegistry, registerDefaultShapes } from '@runiq/core';
import { brandIcons } from '@runiq/icons-brand';
import { fontAwesome } from '@runiq/icons-fontawesome';
import { iconify } from '@runiq/icons-iconify';
import { ElkLayoutEngine } from '@runiq/layout-base';
import { editorHostConfig, type EditorHostConfig } from './editorHostConfig';
import { initializeEditor } from './editorState.svelte';

let initialized = false;

/**
 * One-time editor bootstrapping for shape/layout/icon registries and editor state.
 */
export function bootstrapEditor(hostConfig: EditorHostConfig = editorHostConfig): EditorHostConfig {
	if (initialized) return hostConfig;

	registerDefaultShapes();
	layoutRegistry.register(new ElkLayoutEngine());
	iconRegistry.register(brandIcons);
	iconRegistry.register(fontAwesome);
	iconRegistry.register(iconify);
	initializeEditor();

	initialized = true;
	return hostConfig;
}
