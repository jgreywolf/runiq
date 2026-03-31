<script lang="ts">
	import Icon from '@iconify/svelte';
	import { editorRefs } from '$lib/state/editorState.svelte';

	interface Props {
		svgContainer?: HTMLDivElement | null;
		svgOutput?: string;
	}

	let { svgContainer, svgOutput }: Props = $props();

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
		<div class="toolbar-section">
			<button class="toolbar-btn" onclick={handleZoomIn} title="Zoom In" aria-label="Zoom In" disabled={!editorRefs.viewport}>
				<Icon icon="lucide:zoom-in" class="icon" />
			</button>
			<button class="toolbar-btn" onclick={handleZoomOut} title="Zoom Out" aria-label="Zoom Out" disabled={!editorRefs.viewport}>
				<Icon icon="lucide:zoom-out" class="icon" />
			</button>
			<button
				class="toolbar-btn"
				onclick={handleResetZoom}
				title="Reset Zoom (100%)"
				aria-label="Reset Zoom"
				disabled={!editorRefs.viewport}>
				<Icon icon="lucide:scan" class="icon" />
			</button>
			<button
				class="toolbar-btn"
				onclick={handleFitToScreen}
				title="Fit to Screen"
				aria-label="Fit to Screen"
				disabled={!editorRefs.viewport}>
				<Icon icon="lucide:maximize" class="size-5" />
			</button>
		</div>
	</div>
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

	.toolbar-btn:focus-visible {
		outline: 2px solid hsl(var(--ring));
		outline-offset: 2px;
	}

	.toolbar-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
