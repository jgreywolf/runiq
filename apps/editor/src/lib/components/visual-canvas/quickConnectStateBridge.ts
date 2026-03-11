import type { QuickConnectState } from './quickConnectActions';

export interface QuickConnectBindings {
	read: () => QuickConnectState;
	write: (state: QuickConnectState) => void;
}

function samePoint(
	a: { x: number; y: number } | null,
	b: { x: number; y: number } | null
): boolean {
	if (a === b) return true;
	if (!a || !b) return false;
	return a.x === b.x && a.y === b.y;
}

function sameHandles(
	a: QuickConnectState['quickConnectHandles'],
	b: QuickConnectState['quickConnectHandles']
): boolean {
	if (a === b) return true;
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		const ah = a[i];
		const bh = b[i];
		if (
			ah.direction !== bh.direction ||
			ah.x !== bh.x ||
			ah.y !== bh.y
		) {
			return false;
		}
	}
	return true;
}

function hasQuickConnectStateChanged(before: QuickConnectState, after: QuickConnectState): boolean {
	return !(
		before.quickConnectNodeId === after.quickConnectNodeId &&
		sameHandles(before.quickConnectHandles, after.quickConnectHandles) &&
		before.quickConnectActiveDirection === after.quickConnectActiveDirection &&
		samePoint(before.quickConnectPreviewStart, after.quickConnectPreviewStart) &&
		samePoint(before.quickConnectPreviewEnd, after.quickConnectPreviewEnd) &&
		before.quickConnectTargetNodeId === after.quickConnectTargetNodeId &&
		samePoint(before.quickConnectNewNodePosition, after.quickConnectNewNodePosition)
	);
}

export function withQuickConnectState<T>(
	bindings: QuickConnectBindings,
	action: (state: QuickConnectState) => T
): T {
	const state = bindings.read();
	const before: QuickConnectState = {
		quickConnectNodeId: state.quickConnectNodeId,
		quickConnectHandles: state.quickConnectHandles.map((handle) => ({ ...handle })),
		quickConnectActiveDirection: state.quickConnectActiveDirection,
		quickConnectPreviewStart: state.quickConnectPreviewStart
			? { ...state.quickConnectPreviewStart }
			: null,
		quickConnectPreviewEnd: state.quickConnectPreviewEnd ? { ...state.quickConnectPreviewEnd } : null,
		quickConnectTargetNodeId: state.quickConnectTargetNodeId,
		quickConnectNewNodePosition: state.quickConnectNewNodePosition
			? { ...state.quickConnectNewNodePosition }
			: null
	};
	const result = action(state);
	if (hasQuickConnectStateChanged(before, state)) {
		bindings.write(state);
	}
	return result;
}
