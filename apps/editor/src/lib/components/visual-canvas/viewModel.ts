import type { WarningDetail } from '@runiq/parser-dsl';
import type { SelectionState } from './SelectionState.svelte';

export function mergeWarnings(
	warningDetails: WarningDetail[],
	diagramWarnings: string[],
	lintWarnings: string[]
): string[] {
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
		opacity: 'opacity',
		icon: 'icon'
	};

	return propertyMap[property] || property;
}

export function extractSelectedElementStyles(profile: any, elementId: string | null) {
	if (!elementId || !profile) return {};

	const stylesByName = profile.styles || {};
	const resolveNamedStyle = (styleName: string | undefined) =>
		styleName && typeof styleName === 'string' ? stylesByName[styleName] || {} : {};
	const pick = (obj: any, ...keys: string[]) => {
		for (const key of keys) {
			if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
		}
		return undefined;
	};

	const node = profile.nodes?.find((n: any) => n.id === elementId);
	if (node) {
		const named = resolveNamedStyle(node.style);
		const data = node.data || {};
		const fill = pick(data, 'fillColor', 'fill') ?? pick(named, 'fillColor', 'fill');
		const stroke = pick(data, 'strokeColor', 'stroke') ?? pick(named, 'strokeColor', 'stroke');
		const text = pick(data, 'textColor', 'color') ?? pick(named, 'textColor', 'color');
		const strokeWidth = pick(data, 'strokeWidth') ?? pick(named, 'strokeWidth');
		const fontSize = pick(data, 'fontSize') ?? pick(named, 'fontSize');
		const fontFamily = pick(data, 'fontFamily') ?? pick(named, 'fontFamily', 'font');
		const opacity = pick(data, 'opacity') ?? pick(named, 'opacity');
		const iconObj = node.icon;
		const icon =
			typeof iconObj === 'string'
				? iconObj
				: iconObj?.provider && iconObj?.name
					? `${iconObj.provider}/${iconObj.name}`
					: '';
		return {
			fill,
			stroke,
			strokeWidth: strokeWidth ?? 1,
			opacity: opacity ?? 1,
			fontSize,
			fontFamily,
			text,
			icon
		};
	}

	const edge =
		profile.edges?.find((e: any) => e.id === elementId) ||
		profile.edges?.find((e: any) => `${e.from}-${e.to}` === elementId);
	if (edge) {
		const named = resolveNamedStyle(edge.style);
		const data = edge.data || {};
		const stroke =
			pick(data, 'strokeColor', 'stroke') ??
			pick(edge, 'strokeColor', 'color') ??
			pick(named, 'strokeColor', 'stroke', 'color');
		const strokeWidth =
			pick(data, 'strokeWidth') ?? pick(edge, 'strokeWidth') ?? pick(named, 'strokeWidth');
		const lineStyle = pick(edge, 'lineStyle') ?? pick(named, 'lineStyle');
		return {
			stroke,
			strokeWidth: strokeWidth ?? 1,
			lineStyle
		};
	}

	return {};
}
