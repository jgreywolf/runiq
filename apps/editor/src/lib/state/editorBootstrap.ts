import { iconRegistry, layoutRegistry, registerDefaultShapes } from '@runiq/core';
import { brandIcons } from '@runiq/icons-brand';
import { fontAwesome } from '@runiq/icons-fontawesome';
import { iconify } from '@runiq/icons-iconify';
import { ElkLayoutEngine } from '@runiq/layout-base';
import { initializeEditor } from './editorState.svelte';

let initialized = false;

/**
 * One-time editor bootstrapping for shape/layout/icon registries and editor state.
 */
export function bootstrapEditor() {
	if (initialized) return;

	registerDefaultShapes();
	layoutRegistry.register(new ElkLayoutEngine());
	iconRegistry.register(brandIcons);
	iconRegistry.register(fontAwesome);
	iconRegistry.register(iconify);
	initializeEditor();

	initialized = true;
}
