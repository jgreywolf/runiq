<script lang="ts">
	interface Point {
		x: number;
		y: number;
	}

	interface Props {
		isLassoActive: boolean;
		lassoStartX: number;
		lassoStartY: number;
		lassoEndX: number;
		lassoEndY: number;
		editingNodeId: string | null;
		editingEdgeId: string | null;
		editInputPosition: Point | null;
		editingLabel: string;
		svgOutput: string;
		translateX: number;
		translateY: number;
		scale: number;
		onEditKeyPress: (event: KeyboardEvent) => void;
		onEditBlur: () => void;
	}

	let {
		isLassoActive,
		lassoStartX,
		lassoStartY,
		lassoEndX,
		lassoEndY,
		editingNodeId,
		editingEdgeId,
		editInputPosition,
		editingLabel = $bindable(),
		svgOutput,
		translateX,
		translateY,
		scale,
		onEditKeyPress,
		onEditBlur
	}: Props = $props();
</script>

{#if isLassoActive}
	<div
		class="lasso-rectangle"
		style="left: {Math.min(lassoStartX, lassoEndX)}px; top: {Math.min(lassoStartY, lassoEndY)}px; width: {Math.abs(
			lassoEndX - lassoStartX
		)}px; height: {Math.abs(lassoEndY - lassoStartY)}px;"
	></div>
{/if}

{#if (editingNodeId || editingEdgeId) && editInputPosition}
	<input
		type="text"
		bind:value={editingLabel}
		onkeydown={onEditKeyPress}
		onblur={onEditBlur}
		class="edit-input"
		style="left: {editInputPosition.x}px; top: {editInputPosition.y}px;"
	/>
{/if}

{#if svgOutput}
	<div
		class="absolute inset-0 flex items-center justify-center transition-transform"
		style="transform: translate({translateX}px, {translateY}px) scale({scale})"
	>
		<div class="rounded-lg bg-transparent p-4">
			{@html svgOutput}
		</div>
	</div>
{/if}
