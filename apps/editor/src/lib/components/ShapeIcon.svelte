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

	// Get icon SVG content
	let svgContent = $derived.by(() => {
		const svg = getShapeIconSvg({ shapeId, profileName, size });

		if (!svg) {
			console.warn(`[ShapeIcon] No icon found for shapeId="${shapeId}"`);
			return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
				<text x="20" y="25" text-anchor="middle" font-size="12" fill="#999">?</text>
			</svg>`;
		}

		return svg;
	});

	// Manually update the DOM when svgContent changes
	// This bypasses Svelte's {@html} caching issues
	$effect(() => {
		if (containerElement && svgContent) {
			containerElement.innerHTML = svgContent;
		}
	});
</script>

<div bind:this={containerElement} class="shape-icon-wrapper"></div>

<style>
	.shape-icon-wrapper {
		display: contents;
	}
</style>
