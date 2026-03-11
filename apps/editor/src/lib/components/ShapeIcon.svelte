<script lang="ts">
	import { getShapeIconSvg } from './icons/iconProvider';
	import type { ProfileName } from '$lib/types';

	interface Props {
		shapeId: string;
		profileName?: ProfileName | null;
		size?: number;
	}

	let { shapeId, profileName, size = 48 }: Props = $props();

	let containerElement: HTMLDivElement;

	// Icon provider always returns an SVG string (real icon or deterministic placeholder).
	let svgContent = $derived(getShapeIconSvg({ shapeId, profileName, size }));

	// Manually update the DOM when svgContent changes
	// This bypasses Svelte's {@html} caching issues
	$effect(() => {
		if (containerElement && svgContent) {
			containerElement.innerHTML = svgContent;
		}
	});
</script>

<div
	bind:this={containerElement}
	class="shape-icon-wrapper"
	style="width: {size}px; height: {size}px;"
></div>

<style>
	.shape-icon-wrapper {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.shape-icon-wrapper :global(svg) {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
