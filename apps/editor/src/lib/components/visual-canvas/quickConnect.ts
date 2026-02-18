export type QuickConnectDirection = 'top' | 'right' | 'bottom' | 'left';
export type QuickConnectBehavior = 'auto' | 'new' | 'existing';

export type CanvasNodeBox = {
	id: string;
	left: number;
	right: number;
	top: number;
	bottom: number;
	centerX: number;
	centerY: number;
};

export function getQuickConnectBehaviorFromModifiers(mods?: {
	altKey?: boolean;
	shiftKey?: boolean;
}): QuickConnectBehavior {
	if (!mods) return 'auto';
	if (mods.altKey) return 'new';
	if (mods.shiftKey) return 'existing';
	return 'auto';
}

export function offsetPointInDirection(
	point: { x: number; y: number },
	direction: QuickConnectDirection,
	distance: number
): { x: number; y: number } {
	return direction === 'right'
		? { x: point.x + distance, y: point.y }
		: direction === 'left'
			? { x: point.x - distance, y: point.y }
			: direction === 'bottom'
				? { x: point.x, y: point.y + distance }
				: { x: point.x, y: point.y - distance };
}

export function selectDirectionalTarget(params: {
	sourceNodeId: string;
	direction: QuickConnectDirection;
	nodeBoxes: CanvasNodeBox[];
	connectedTargets: Set<string>;
	behavior: QuickConnectBehavior;
	minPrimaryDistance?: number;
}): { point: { x: number; y: number }; targetNodeId: string | null } | null {
	const {
		sourceNodeId,
		direction,
		nodeBoxes,
		connectedTargets,
		behavior,
		minPrimaryDistance = 24
	} = params;
	const source = nodeBoxes.find((node) => node.id === sourceNodeId);
	if (!source) return null;

	const candidates = nodeBoxes
		.filter((node) => node.id !== sourceNodeId)
		.map((node) => {
			const dx = node.centerX - source.centerX;
			const dy = node.centerY - source.centerY;
			const primary =
				direction === 'right'
					? dx
					: direction === 'left'
						? -dx
						: direction === 'bottom'
							? dy
							: -dy;
			const secondary =
				direction === 'right' || direction === 'left' ? Math.abs(dy) : Math.abs(dx);
			return {
				node,
				primary,
				secondary,
				isAlreadyConnected: connectedTargets.has(node.id)
			};
		})
		.filter((candidate) => candidate.primary > minPrimaryDistance)
		.sort((a, b) => {
			if (behavior === 'auto' && a.isAlreadyConnected !== b.isAlreadyConnected) {
				return a.isAlreadyConnected ? 1 : -1;
			}
			return a.primary + a.secondary * 0.45 - (b.primary + b.secondary * 0.45);
		});

	if (candidates.length === 0) return null;

	const best = candidates[0].node;
	const point =
		direction === 'right'
			? { x: best.left, y: best.centerY }
			: direction === 'left'
				? { x: best.right, y: best.centerY }
				: direction === 'bottom'
					? { x: best.centerX, y: best.top }
					: { x: best.centerX, y: best.bottom };
	return { point, targetNodeId: best.id };
}

export function doesPreviewNodeOverlapAnyNode(params: {
	point: { x: number; y: number };
	sourceNodeId: string;
	nodeBoxes: CanvasNodeBox[];
	previewWidth: number;
	previewHeight: number;
	margin?: number;
}): boolean {
	const { point, sourceNodeId, nodeBoxes, previewWidth, previewHeight, margin = 10 } = params;
	const previewLeft = point.x - previewWidth / 2;
	const previewRight = point.x + previewWidth / 2;
	const previewTop = point.y - previewHeight / 2;
	const previewBottom = point.y + previewHeight / 2;

	return nodeBoxes.some((node) => {
		if (node.id === sourceNodeId) return false;
		const nodeLeft = node.left - margin;
		const nodeRight = node.right + margin;
		const nodeTop = node.top - margin;
		const nodeBottom = node.bottom + margin;
		return !(
			previewRight < nodeLeft ||
			previewLeft > nodeRight ||
			previewBottom < nodeTop ||
			previewTop > nodeBottom
		);
	});
}

export function findNonOverlappingPreviewPoint(params: {
	initialPoint: { x: number; y: number };
	direction: QuickConnectDirection;
	sourceNodeId: string;
	nodeBoxes: CanvasNodeBox[];
	previewWidth: number;
	previewHeight: number;
	stepDistance?: number;
	maxSteps?: number;
	margin?: number;
}): { x: number; y: number } {
	const {
		initialPoint,
		direction,
		sourceNodeId,
		nodeBoxes,
		previewWidth,
		previewHeight,
		stepDistance = 96,
		maxSteps = 8,
		margin = 10
	} = params;

	let candidate = initialPoint;
	for (let i = 0; i < maxSteps; i++) {
		if (
			!doesPreviewNodeOverlapAnyNode({
				point: candidate,
				sourceNodeId,
				nodeBoxes,
				previewWidth,
				previewHeight,
				margin
			})
		) {
			return candidate;
		}
		candidate = offsetPointInDirection(candidate, direction, stepDistance);
	}
	return candidate;
}
