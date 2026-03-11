export type ElementToolbarPosition = { x: number; y: number };

export function getSelectedElementDomRect(
	svgContainer: HTMLDivElement | null,
	selectedNodeId: string | null,
	selectedEdgeId: string | null
): DOMRect | null {
	if (!svgContainer) return null;

	if (selectedNodeId) {
		const nodeEl = svgContainer.querySelector(`[data-node-id="${selectedNodeId}"]`) as
			| SVGGraphicsElement
			| null;
		return nodeEl?.getBoundingClientRect() ?? null;
	}

	if (selectedEdgeId) {
		const edgeEl = svgContainer.querySelector(`[data-edge-id="${selectedEdgeId}"]`) as
			| SVGGraphicsElement
			| null;
		return edgeEl?.getBoundingClientRect() ?? null;
	}

	return null;
}

export function getSelectedEdgeMidpointInContainer(
	svgContainer: HTMLDivElement | null,
	selectedEdgeId: string | null
): ElementToolbarPosition | null {
	if (!svgContainer || !selectedEdgeId) return null;
	const edgeRoot = svgContainer.querySelector(`[data-edge-id="${selectedEdgeId}"]`);
	if (!edgeRoot) return null;

	const pathEl = edgeRoot.querySelector('path') as SVGPathElement | null;
	if (!pathEl || typeof pathEl.getTotalLength !== 'function') return null;

	const totalLength = pathEl.getTotalLength();
	if (!Number.isFinite(totalLength) || totalLength <= 0) return null;

	const midpoint = pathEl.getPointAtLength(totalLength / 2);
	const containerRect = svgContainer.getBoundingClientRect();
	const pathRect = pathEl.getBoundingClientRect();
	const localX = midpoint.x + (pathRect.left - containerRect.left);
	const localY = midpoint.y + (pathRect.top - containerRect.top);
	return { x: localX, y: localY };
}

export function computeElementToolbarPosition(
	svgContainer: HTMLDivElement | null,
	selectedNodeId: string | null,
	selectedEdgeId: string | null
): ElementToolbarPosition | null {
	if (!svgContainer) return null;

	if (selectedEdgeId && !selectedNodeId) {
		const midpoint = getSelectedEdgeMidpointInContainer(svgContainer, selectedEdgeId);
		if (midpoint) {
			return { x: midpoint.x, y: Math.max(8, midpoint.y - 16) };
		}
	}

	const rect = getSelectedElementDomRect(svgContainer, selectedNodeId, selectedEdgeId);
	if (!rect) {
		return null;
	}

	const containerRect = svgContainer.getBoundingClientRect();
	const centerX = rect.left - containerRect.left + rect.width / 2;
	const topY = rect.top - containerRect.top;
	return { x: centerX, y: Math.max(8, topY - 12) };
}

export function constrainToolbarPosition(
	position: ElementToolbarPosition,
	containerRect: DOMRect,
	toolbarRect: DOMRect
): ElementToolbarPosition {
	const toolbarHalfWidth = toolbarRect.width / 2;
	const minCenterX = toolbarHalfWidth + 10;
	const maxCenterX = Math.max(minCenterX, containerRect.width - toolbarHalfWidth - 10);
	const clampedX = Math.max(minCenterX, Math.min(maxCenterX, position.x));

	const minAnchorY = toolbarRect.height + 10;
	const maxAnchorY = Math.max(minAnchorY, containerRect.height - 10);
	const clampedY = Math.max(minAnchorY, Math.min(maxAnchorY, position.y));

	return { x: clampedX, y: clampedY };
}

