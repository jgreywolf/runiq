import type { WarningDetail } from '@runiq/parser-dsl';
import type { SelectionState } from './SelectionState.svelte';

export function mergeWarnings(warningDetails: WarningDetail[], diagramWarnings: string[], lintWarnings: string[]): string[] {
	const detailMessages = new Set(warningDetails.map((warning) => warning.message));
	const merged = [...diagramWarnings, ...lintWarnings];
	const unique: string[] = [];

	for (const warning of merged) {
		if (!warning || detailMessages.has(warning) || unique.includes(warning)) {
			continue;
		}
		unique.push(warning);
	}

	return unique;
}

export function updateWarningVisibility(
	currentShowWarnings: boolean,
	lastWarningCount: number,
	nextWarningCount: number
): { showWarnings: boolean; lastWarningCount: number } {
	if (nextWarningCount === 0) {
		return { showWarnings: false, lastWarningCount: nextWarningCount };
	}

	if (nextWarningCount > lastWarningCount) {
		return { showWarnings: true, lastWarningCount: nextWarningCount };
	}

	return { showWarnings: currentShowWarnings, lastWarningCount: nextWarningCount };
}

export function collectSelectedIds(selection: SelectionState): string[] {
	return [
		...(selection.selectedNodeId ? [selection.selectedNodeId] : []),
		...(selection.selectedEdgeId ? [selection.selectedEdgeId] : []),
		...Array.from(selection.selectedNodeIds),
		...Array.from(selection.selectedEdgeIds)
	];
}

export function collectSelectedIdSet(selection: SelectionState): Set<string> {
	const ids = new Set<string>();
	if (selection.selectedNodeId) ids.add(selection.selectedNodeId);
	if (selection.selectedEdgeId) ids.add(selection.selectedEdgeId);
	selection.selectedNodeIds.forEach((id) => ids.add(id));
	selection.selectedEdgeIds.forEach((id) => ids.add(id));
	return ids;
}

export function mapStyleProperty(property: string): string {
	const propertyMap: Record<string, string> = {
		fill: 'fillColor',
		stroke: 'strokeColor',
		strokeWidth: 'strokeWidth',
		fontSize: 'fontSize',
		fontFamily: 'fontFamily',
		fontWeight: 'fontWeight',
		opacity: 'opacity'
	};

	return propertyMap[property] || property;
}

export function extractSelectedElementStyles(profile: any, elementId: string | null) {
	if (!elementId || !profile) return {};

	const element =
		profile.nodes?.find((n: any) => n.id === elementId) ||
		profile.edges?.find((e: any) => e.id === elementId || `${e.from}-${e.to}` === elementId);

	if (!element?.properties) return {};

	return {
		fill: element.properties.fillColor,
		stroke: element.properties.strokeColor,
		strokeWidth: element.properties.strokeWidth || 1,
		opacity: element.properties.opacity || 1,
		fontSize: element.properties.textSize,
		fontFamily: element.properties.fontFamily,
		color: element.properties.textColor
	};
}
