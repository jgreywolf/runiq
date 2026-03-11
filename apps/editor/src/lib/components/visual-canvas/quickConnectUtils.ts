import { ProfileName } from '$lib/types';

export function shouldShowQuickConnect(
	profileName: ProfileName | null,
	mode: 'select' | 'connect',
	connectPreviewStart: { x: number; y: number } | null
): boolean {
	return profileName === ProfileName.diagram && mode === 'connect' && connectPreviewStart === null;
}

export function containerPointToSvgPoint(
	svgContainer: HTMLDivElement | null,
	point: { x: number; y: number }
): { x: number; y: number } | null {
	if (!svgContainer) return null;
	const svg = svgContainer.querySelector('svg');
	if (!svg) return null;
	const rect = svg.getBoundingClientRect();
	const viewBox = svg.viewBox?.baseVal;
	if (!viewBox || rect.width === 0 || rect.height === 0) return null;
	return {
		x: Math.round((point.x / rect.width) * viewBox.width + viewBox.x),
		y: Math.round((point.y / rect.height) * viewBox.height + viewBox.y)
	};
}

export function buildPositionedRectangleShapeCode(
	newNodeId: string,
	svgPoint: { x: number; y: number } | null
): string {
	return svgPoint
		? `shape ${newNodeId} as @rectangle label:"New Node" position:(${svgPoint.x},${svgPoint.y})`
		: `shape ${newNodeId} as @rectangle label:"New Node"`;
}
