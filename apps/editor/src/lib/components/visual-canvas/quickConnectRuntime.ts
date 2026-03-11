import {
	findNonOverlappingPreviewPoint,
	offsetPointInDirection,
	selectDirectionalTarget,
	type CanvasNodeBox,
	type QuickConnectBehavior,
	type QuickConnectDirection
} from './quickConnect';

export const QUICK_CONNECT_NODE_HITBOX_PADDING = 24;
export const QUICK_CONNECT_NEW_NODE_PREVIEW_WIDTH = 112;
export const QUICK_CONNECT_NEW_NODE_PREVIEW_HEIGHT = 44;
export const QUICK_CONNECT_NEW_NODE_STEP = 96;
export const QUICK_CONNECT_NEW_NODE_MAX_STEPS = 8;

export interface QuickConnectHandle {
	direction: QuickConnectDirection;
	x: number;
	y: number;
}

export interface QuickConnectPreviewResult {
	point: { x: number; y: number };
	targetNodeId: string | null;
}

export function listCanvasNodeBoxes(svgContainer: HTMLDivElement | null): CanvasNodeBox[] {
	if (!svgContainer) return [];
	const containerRect = svgContainer.getBoundingClientRect();
	const nodes = Array.from(svgContainer.querySelectorAll('[data-node-id]')) as SVGGraphicsElement[];
	return nodes
		.map((nodeEl) => {
			const id = nodeEl.getAttribute('data-node-id');
			if (!id) return null;
			const rect = nodeEl.getBoundingClientRect();
			const left = rect.left - containerRect.left;
			const top = rect.top - containerRect.top;
			const right = left + rect.width;
			const bottom = top + rect.height;
			return {
				id,
				left,
				right,
				top,
				bottom,
				centerX: left + rect.width / 2,
				centerY: top + rect.height / 2
			};
		})
		.filter((node): node is CanvasNodeBox => node !== null);
}

export function getNodeIdAtContainerPoint(
	svgContainer: HTMLDivElement | null,
	point: { x: number; y: number },
	padding = QUICK_CONNECT_NODE_HITBOX_PADDING
): string | null {
	const boxes = listCanvasNodeBoxes(svgContainer);
	const candidates = boxes
		.filter(
			(box) =>
				point.x >= box.left - padding &&
				point.x <= box.right + padding &&
				point.y >= box.top - padding &&
				point.y <= box.bottom + padding
		)
		.sort((a, b) => {
			const da = Math.abs(point.x - a.centerX) + Math.abs(point.y - a.centerY);
			const db = Math.abs(point.x - b.centerX) + Math.abs(point.y - b.centerY);
			return da - db;
		});
	return candidates[0]?.id ?? null;
}

export function getQuickConnectHandles(
	svgContainer: HTMLDivElement | null,
	nodeId: string
): QuickConnectHandle[] {
	const node = listCanvasNodeBoxes(svgContainer).find((candidate) => candidate.id === nodeId);
	if (!node) return [];
	return [
		{ direction: 'top', x: node.centerX, y: node.top - 12 },
		{ direction: 'right', x: node.right + 12, y: node.centerY },
		{ direction: 'bottom', x: node.centerX, y: node.bottom + 12 },
		{ direction: 'left', x: node.left - 12, y: node.centerY }
	];
}

export function getConnectedTargets(profile: any, sourceNodeId: string): Set<string> {
	const edges = Array.isArray(profile?.edges) ? profile.edges : [];
	const targets = new Set<string>();
	for (const edge of edges) {
		if (edge?.from === sourceNodeId && typeof edge?.to === 'string') {
			targets.add(edge.to);
		}
	}
	return targets;
}

export function getPreviewEndpointForDirection(
	svgContainer: HTMLDivElement | null,
	profile: any,
	sourceNodeId: string,
	direction: QuickConnectDirection,
	behavior: QuickConnectBehavior
): QuickConnectPreviewResult | null {
	const nodeBoxes = listCanvasNodeBoxes(svgContainer);
	const connectedTargets = getConnectedTargets(profile, sourceNodeId);
	return selectDirectionalTarget({
		sourceNodeId,
		direction,
		nodeBoxes,
		connectedTargets,
		behavior
	});
}

export function computeNonOverlappingNewNodePreviewEnd(
	svgContainer: HTMLDivElement | null,
	source: { x: number; y: number },
	direction: QuickConnectDirection,
	sourceNodeId: string,
	distance = 170
): { x: number; y: number } {
	const end = offsetPointInDirection(source, direction, distance);
	return findNonOverlappingPreviewPoint({
		initialPoint: end,
		direction,
		sourceNodeId,
		nodeBoxes: listCanvasNodeBoxes(svgContainer),
		previewWidth: QUICK_CONNECT_NEW_NODE_PREVIEW_WIDTH,
		previewHeight: QUICK_CONNECT_NEW_NODE_PREVIEW_HEIGHT,
		stepDistance: QUICK_CONNECT_NEW_NODE_STEP,
		maxSteps: QUICK_CONNECT_NEW_NODE_MAX_STEPS
	});
}

