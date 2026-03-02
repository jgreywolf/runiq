import { ProfileName } from '$lib/types';
import type { QuickConnectBehavior, QuickConnectDirection } from './quickConnect';
import {
	computeNonOverlappingNewNodePreviewEnd,
	getNodeIdAtContainerPoint,
	getPreviewEndpointForDirection,
	getQuickConnectHandles,
	type QuickConnectHandle
} from './quickConnectRuntime';
import {
	buildPositionedRectangleShapeCode,
	containerPointToSvgPoint,
	shouldShowQuickConnect
} from './quickConnectUtils';

export interface QuickConnectState {
	quickConnectNodeId: string | null;
	quickConnectHandles: QuickConnectHandle[];
	quickConnectActiveDirection: QuickConnectDirection | null;
	quickConnectPreviewStart: { x: number; y: number } | null;
	quickConnectPreviewEnd: { x: number; y: number } | null;
	quickConnectTargetNodeId: string | null;
	quickConnectNewNodePosition: { x: number; y: number } | null;
}

export function resetQuickConnectState(state: QuickConnectState): void {
	state.quickConnectNodeId = null;
	state.quickConnectHandles = [];
	state.quickConnectActiveDirection = null;
	state.quickConnectPreviewStart = null;
	state.quickConnectPreviewEnd = null;
	state.quickConnectTargetNodeId = null;
	state.quickConnectNewNodePosition = null;
}

export function activateQuickConnectPreview(params: {
	state: QuickConnectState;
	svgContainer: HTMLDivElement | null;
	profile: any;
	nodeId: string;
	direction: QuickConnectDirection;
	behavior: QuickConnectBehavior;
}): void {
	const { state, svgContainer, profile, nodeId, direction, behavior } = params;
	const sourceHandle = state.quickConnectHandles.find((handle) => handle.direction === direction);
	if (!sourceHandle) return;

	state.quickConnectActiveDirection = direction;
	state.quickConnectPreviewStart = { x: sourceHandle.x, y: sourceHandle.y };

	const targetPreview =
		behavior === 'new'
			? null
			: getPreviewEndpointForDirection(svgContainer, profile, nodeId, direction, behavior);
	if (targetPreview && behavior !== 'new') {
		state.quickConnectTargetNodeId = targetPreview.targetNodeId;
		state.quickConnectPreviewEnd = targetPreview.point;
		state.quickConnectNewNodePosition = null;
		return;
	}

	const nonOverlappingEnd = computeNonOverlappingNewNodePreviewEnd(
		svgContainer,
		{ x: sourceHandle.x, y: sourceHandle.y },
		direction,
		nodeId
	);
	state.quickConnectTargetNodeId = null;
	state.quickConnectPreviewEnd = nonOverlappingEnd;
	state.quickConnectNewNodePosition = containerPointToSvgPoint(svgContainer, nonOverlappingEnd);
}

export function runQuickConnect(params: {
	state: QuickConnectState;
	svgContainer: HTMLDivElement | null;
	profile: any;
	nodeId: string;
	direction: QuickConnectDirection;
	behavior: QuickConnectBehavior;
	newNodeId: string;
	onInsertEdge: (from: string, to: string) => void;
	onInsertShapeAndEdge: (shapeCode: string, sourceId: string, targetId: string) => void;
}): void {
	const {
		state,
		svgContainer,
		profile,
		nodeId,
		direction,
		behavior,
		newNodeId,
		onInsertEdge,
		onInsertShapeAndEdge
	} = params;

	activateQuickConnectPreview({ state, svgContainer, profile, nodeId, direction, behavior });
	if (!state.quickConnectPreviewStart || !state.quickConnectPreviewEnd) return;

	if (state.quickConnectTargetNodeId) {
		onInsertEdge(nodeId, state.quickConnectTargetNodeId);
		resetQuickConnectState(state);
		return;
	}
	if (behavior === 'existing') {
		resetQuickConnectState(state);
		return;
	}

	const svgPoint =
		state.quickConnectNewNodePosition ??
		containerPointToSvgPoint(svgContainer, state.quickConnectPreviewEnd);
	const shapeCode = buildPositionedRectangleShapeCode(newNodeId, svgPoint);
	onInsertShapeAndEdge(shapeCode, nodeId, newNodeId);
	resetQuickConnectState(state);
}

export function updateQuickConnectFromMouseEvent(params: {
	state: QuickConnectState;
	event: MouseEvent;
	profileName: ProfileName | null;
	mode: 'select' | 'connect';
	connectPreviewStart: { x: number; y: number } | null;
	svgContainer: HTMLDivElement | null;
}): void {
	const { state, event, profileName, mode, connectPreviewStart, svgContainer } = params;
	const canShow = shouldShowQuickConnect(profileName, mode, connectPreviewStart);
	if (!canShow) {
		resetQuickConnectState(state);
		return;
	}

	const target = event.target as Element | null;
	if (!target) {
		resetQuickConnectState(state);
		return;
	}

	// Keep current quick-connect state while interacting with handle UI.
	if (target.closest('.quick-connect-layer')) {
		return;
	}

	let nodeId: string | null = target.closest('[data-node-id]')?.getAttribute('data-node-id') ?? null;
	if (!nodeId && svgContainer) {
		const containerRect = svgContainer.getBoundingClientRect();
		const point = {
			x: event.clientX - containerRect.left,
			y: event.clientY - containerRect.top
		};
		nodeId = getNodeIdAtContainerPoint(svgContainer, point);
	}
	if (!nodeId) {
		resetQuickConnectState(state);
		return;
	}

	if (state.quickConnectNodeId !== nodeId) {
		state.quickConnectNodeId = nodeId;
		state.quickConnectHandles = getQuickConnectHandles(svgContainer, nodeId);
		state.quickConnectActiveDirection = null;
		state.quickConnectPreviewStart = null;
		state.quickConnectPreviewEnd = null;
		state.quickConnectTargetNodeId = null;
		state.quickConnectNewNodePosition = null;
	}
}
