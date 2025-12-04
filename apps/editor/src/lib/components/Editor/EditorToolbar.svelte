<script lang="ts">
	import type { EditorMode } from '$lib/types/editor';
	import Icon from '@iconify/svelte';
	import { editorRefs, editorState, updateCode } from '$lib/state/editorState.svelte';
	import { getAvailableBaseThemes, getBaseTheme } from '@runiq/core';
	import { canvasState } from '$lib/state';

	interface Props {
		svgContainer?: HTMLDivElement | null;
		svgOutput?: string;
	}

	let { svgContainer, svgOutput }: Props = $props();

	let showThemeFlyout = $state(false);
	const availableThemes = getAvailableBaseThemes();

	// Mode handlers
	function handleModeChange(newMode: EditorMode) {
		canvasState.mode = newMode;
	}

	function handleAddShape() {
		// TODO: Open shape picker flyout
		console.log('Add shape clicked');
	}

	function handleAddContainer() {
		// TODO: Open container picker flyout
		console.log('Add container clicked');
	}

	function handleChangeTheme() {
		showThemeFlyout = !showThemeFlyout;
	}

	function applyTheme(themeId: string) {
		// Get current code from editorState
		const code = editorState.code || '';
		const lines = code.split('\n');

		if (lines.length === 0) return;

		// Check if second line already has a theme
		if (lines.length > 1 && lines[1].trim().startsWith('theme ')) {
			lines[1] = `  theme ${themeId}`;
		} else {
			lines.splice(1, 0, `  theme ${themeId}`);
		}

		const newCode = lines.join('\n');

		// Update the code using centralized updateCode function
		// Pass true to add to history so theme changes can be undone
		updateCode(newCode, true);

		showThemeFlyout = false;
	}

	// Zoom handlers
	function handleZoomIn() {
		editorRefs.viewport?.zoomIn();
	}

	function handleZoomOut() {
		editorRefs.viewport?.zoomOut();
	}

	function handleResetZoom() {
		editorRefs.viewport?.resetZoom();
	}

	function handleFitToScreen() {
		if (!editorRefs.viewport || !svgContainer || !svgOutput) return;

		// Reset pan
		editorRefs.viewport.translateX = 0;
		editorRefs.viewport.translateY = 0;

		const parser = new DOMParser();
		const svgDoc = parser.parseFromString(svgOutput, 'image/svg+xml');
		const svgElement = svgDoc.querySelector('svg');

		if (!svgElement) return;

		let svgWidth = 0;
		let svgHeight = 0;

		const viewBox = svgElement.getAttribute('viewBox');
		if (viewBox) {
			const [, , width, height] = viewBox.split(' ').map(Number);
			svgWidth = width;
			svgHeight = height;
		} else {
			svgWidth = parseFloat(svgElement.getAttribute('width') || '0');
			svgHeight = parseFloat(svgElement.getAttribute('height') || '0');
		}

		if (svgWidth === 0 || svgHeight === 0) {
			editorRefs.viewport.scale = 0.9;
			return;
		}

		const containerWidth = svgContainer.clientWidth;
		const containerHeight = svgContainer.clientHeight;

		editorRefs.viewport.fitToScreen(svgWidth, svgHeight, containerWidth, containerHeight);
	}
</script>

<div class="toolbar-wrapper">
	<div class="editor-toolbar">
		<!-- Mode Tools -->
		<div class="toolbar-section">
			<button
				class="toolbar-btn"
				class:active={canvasState.mode === 'select'}
				onclick={() => handleModeChange('select')}
				title="Select Mode (V)"
				aria-label="Select Mode (V)"
			>
				<Icon icon="lucide:pointer" class="icon" />
			</button>

			<button
				class="toolbar-btn"
				class:active={canvasState.mode === 'connect'}
				onclick={() => handleModeChange('connect')}
				title="Connect Mode (C)"
				aria-label="Connect Mode (C)"
			>
				<Icon icon="lucide:git-branch" class="icon" />
			</button>
		</div>

		<div class="toolbar-divider"></div>

		<!-- Shape Tools -->
		<div class="toolbar-section">
			<button class="toolbar-btn" onclick={handleAddShape} title="Add Shape" aria-label="Add Shape">
				<Icon icon="lucide:square-plus" class="icon" />
			</button>

			<button
				class="toolbar-btn"
				onclick={handleAddContainer}
				title="Add Container"
				aria-label="Add Container"
			>
				<Icon icon="lucide:box" class="icon" />
			</button>
		</div>

		<div class="toolbar-divider"></div>

		<!-- View Tools -->
		<div class="toolbar-section">
			<button
				class="toolbar-btn"
				onclick={handleChangeTheme}
				title="Change Theme"
				aria-label="Change Theme"
			>
				<Icon icon="lucide:palette" class="icon" />
			</button>

			<button
				class="toolbar-btn"
				onclick={() => console.log('Export clicked')}
				title="Export Diagram"
				aria-label="Export"
			>
				<Icon icon="lucide:download" class="icon" />
			</button>
		</div>

		<div class="toolbar-divider"></div>

		<!-- Zoom Tools -->
		<div class="toolbar-section">
			<button
				class="toolbar-btn"
				onclick={handleZoomIn}
				title="Zoom In"
				aria-label="Zoom In"
				disabled={!editorRefs.viewport}
			>
				<Icon icon="lucide:zoom-in" class="icon" />
			</button>
			<button
				class="toolbar-btn"
				onclick={handleZoomOut}
				title="Zoom Out"
				aria-label="Zoom Out"
				disabled={!editorRefs.viewport}
			>
				<Icon icon="lucide:zoom-out" class="icon" />
			</button>

			<button
				class="toolbar-btn"
				onclick={handleResetZoom}
				title="Reset Zoom (100%)"
				aria-label="Reset Zoom"
				disabled={!editorRefs.viewport}
			>
				<Icon icon="lucide:scan" class="icon" />
			</button>

			<button
				class="toolbar-btn"
				onclick={handleFitToScreen}
				title="Fit to Screen"
				aria-label="Fit to Screen"
				disabled={!editorRefs.viewport}
			>
				<Icon icon="lucide:maximize" class="size-5" />
			</button>
		</div>
	</div>

	<!-- Theme Flyout -->
	{#if showThemeFlyout}
		<div class="theme-flyout">
			<div class="mb-1 px-2 py-1">
				<h3 class="text-xs font-semibold text-neutral-700">Select Theme</h3>
			</div>
			{#each availableThemes as themeId}
				{@const theme = getBaseTheme(themeId)}
				<button
					onclick={() => applyTheme(themeId)}
					class="flex items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-neutral-100"
					title={theme.description}
				>
					<div
						class="h-4 w-4 rounded border border-neutral-300"
						style="background-color: {theme.primaryColor};"
					></div>
					<span class="text-xs">{theme.name}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.toolbar-wrapper {
		position: relative;
		display: flex;
		gap: 0.5rem;
	}

	.editor-toolbar {
		display: flex;
		flex-direction: column;
		gap: 0;
		background: white;
		border: 1px solid hsl(var(--border));
		border-radius: 0.5rem;
		padding: 0.5rem;
		min-width: 3rem;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
	}

	.toolbar-section {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.toolbar-divider {
		height: 1px;
		background: hsl(var(--border));
		margin: 0.5rem 0;
	}

	.toolbar-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 0.375rem;
		color: hsl(var(--foreground));
		cursor: pointer;
		transition: all 0.15s ease;
		user-select: none;
		min-width: 2rem;
		min-height: 2rem;
	}

	.toolbar-btn:hover {
		background: hsl(var(--accent));
		border-color: hsl(var(--border));
		color: hsl(var(--accent-foreground));
	}

	.toolbar-btn.active {
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
		border-color: hsl(var(--primary));
		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
	}

	.toolbar-btn:focus-visible {
		outline: 2px solid hsl(var(--ring));
		outline-offset: 2px;
	}

	.toolbar-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.theme-flyout {
		position: absolute;
		left: 100%;
		top: 0;
		margin-left: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 180px;
		max-height: 400px;
		overflow-y: auto;
		background: white;
		border: 1px solid hsl(var(--border));
		border-radius: 0.5rem;
		padding: 0.5rem;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
	}

	:global(.theme-flyout button) {
		width: 100%;
	}
</style>
