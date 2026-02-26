<script lang="ts">
	import type { QuickConnectBehavior, QuickConnectDirection } from './quickConnect';
	import {
		QUICK_CONNECT_NEW_NODE_PREVIEW_HEIGHT,
		QUICK_CONNECT_NEW_NODE_PREVIEW_WIDTH,
		type QuickConnectHandle
	} from './quickConnectRuntime';

	interface Point {
		x: number;
		y: number;
	}

	interface Props {
		isDiagramConnectMode: boolean;
		connectPreviewStart: Point | null;
		connectPreviewEnd: Point | null;
		quickConnectNodeId: string | null;
		quickConnectHandles: QuickConnectHandle[];
		quickConnectActiveDirection: QuickConnectDirection | null;
		quickConnectPreviewStart: Point | null;
		quickConnectPreviewEnd: Point | null;
		quickConnectTargetNodeId: string | null;
		onActivateHandle: (
			nodeId: string,
			direction: QuickConnectDirection,
			behavior: QuickConnectBehavior
		) => void;
		onLeaveHandle: () => void;
		onRunHandle: (
			nodeId: string,
			direction: QuickConnectDirection,
			behavior: QuickConnectBehavior
		) => void;
		getBehaviorFromModifiers: (event: MouseEvent) => QuickConnectBehavior;
	}

	let {
		isDiagramConnectMode,
		connectPreviewStart,
		connectPreviewEnd,
		quickConnectNodeId,
		quickConnectHandles,
		quickConnectActiveDirection,
		quickConnectPreviewStart,
		quickConnectPreviewEnd,
		quickConnectTargetNodeId,
		onActivateHandle,
		onLeaveHandle,
		onRunHandle,
		getBehaviorFromModifiers
	}: Props = $props();
</script>

{#if isDiagramConnectMode && connectPreviewStart && connectPreviewEnd}
	<svg class="connect-preview-overlay" aria-hidden="true">
		<line
			class="connect-preview-line"
			x1={connectPreviewStart.x}
			y1={connectPreviewStart.y}
			x2={connectPreviewEnd.x}
			y2={connectPreviewEnd.y}
		/>
	</svg>
{/if}

{#if isDiagramConnectMode && !connectPreviewStart && quickConnectNodeId && quickConnectHandles.length > 0}
	<div class="quick-connect-layer" aria-hidden="true">
		{#each quickConnectHandles as handle}
			<button
				type="button"
				class="quick-connect-handle"
				class:is-active={quickConnectActiveDirection === handle.direction}
				style="left: {handle.x}px; top: {handle.y}px;"
				title={`Quick connect ${handle.direction} (Alt: force new, Shift: force existing)`}
				onmouseenter={(event) =>
					onActivateHandle(
						quickConnectNodeId as string,
						handle.direction,
						getBehaviorFromModifiers(event)
					)}
				onmouseleave={onLeaveHandle}
				onclick={(event) => {
					event.preventDefault();
					event.stopPropagation();
					onRunHandle(
						quickConnectNodeId as string,
						handle.direction,
						getBehaviorFromModifiers(event)
					);
				}}
			>
				<span class={`quick-connect-arrow quick-connect-arrow-${handle.direction}`}></span>
			</button>
		{/each}
	</div>
{/if}

{#if isDiagramConnectMode && quickConnectPreviewStart && quickConnectPreviewEnd}
	<svg class="connect-preview-overlay" aria-hidden="true">
		<line
			class="quick-connect-preview-line"
			x1={quickConnectPreviewStart.x}
			y1={quickConnectPreviewStart.y}
			x2={quickConnectPreviewEnd.x}
			y2={quickConnectPreviewEnd.y}
		/>
		{#if !quickConnectTargetNodeId}
			<rect
				class="quick-connect-new-node-preview"
				x={quickConnectPreviewEnd.x - QUICK_CONNECT_NEW_NODE_PREVIEW_WIDTH / 2}
				y={quickConnectPreviewEnd.y - QUICK_CONNECT_NEW_NODE_PREVIEW_HEIGHT / 2}
				width={QUICK_CONNECT_NEW_NODE_PREVIEW_WIDTH}
				height={QUICK_CONNECT_NEW_NODE_PREVIEW_HEIGHT}
				rx="6"
				ry="6"
			/>
		{/if}
	</svg>
{/if}

