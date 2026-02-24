import type { ParsedStyleDeclaration } from '$lib/utils/dslCodeManipulation';

export type ElementPanelKey = 'changeShape' | 'styles' | 'border' | 'fill' | 'text' | 'icon';

export type BorderDraft = {
	strokeColor: string;
	strokeWidth: number;
	lineStyle: 'solid' | 'dashed' | 'dotted' | 'none';
};

export type FillDraft = { fillColor: string };

export type TextDraft = {
	textColor: string;
	fontSize: number;
	fontFamily: string;
};

export type StyleDraft = {
	fillColor: string;
	strokeColor: string;
	strokeWidth: number;
	textColor: string;
	fontSize: number;
	fontFamily: string;
	lineStyle: string;
};

export function createInitialPanelOpen(): Record<ElementPanelKey, boolean> {
	return {
		changeShape: false,
		styles: false,
		border: false,
		fill: false,
		text: false,
		icon: false
	};
}

export function closeAllPanels(
	panelOpen: Record<ElementPanelKey, boolean>,
	except?: ElementPanelKey
): void {
	(['changeShape', 'styles', 'border', 'fill', 'text', 'icon'] as ElementPanelKey[]).forEach(
		(key) => {
			if (key !== except && panelOpen[key]) {
				panelOpen[key] = false;
			}
		}
	);
}

export function getFilteredIconTokens(
	availableIconTokens: string[],
	iconSearchQuery: string,
	limit = 200
): string[] {
	const query = iconSearchQuery.trim().toLowerCase();
	if (!query) return availableIconTokens.slice(0, limit);
	return availableIconTokens
		.filter((token) => token.toLowerCase().includes(query))
		.slice(0, limit);
}

export function createBorderDraftFromStyles(styles: Record<string, unknown>): BorderDraft {
	const lineStyle = styles.lineStyle as string | undefined;
	return {
		strokeColor: (styles.stroke as string) || '#48677e',
		strokeWidth: Number(styles.strokeWidth || 2),
		lineStyle:
			lineStyle === 'dashed' || lineStyle === 'dotted' || lineStyle === 'none'
				? lineStyle
				: 'solid'
	};
}

export function createFillDraftFromStyles(styles: Record<string, unknown>): FillDraft {
	return { fillColor: (styles.fill as string) || '#ffffff' };
}

export function createTextDraftFromStyles(styles: Record<string, unknown>): TextDraft {
	return {
		textColor: (styles.text as string) || '#1f2937',
		fontSize: Number(styles.fontSize || 14),
		fontFamily: (styles.fontFamily as string) || 'sans-serif'
	};
}

export function filterStyleDeclarations(
	declarations: ParsedStyleDeclaration[],
	query: string
): ParsedStyleDeclaration[] {
	const normalized = query.trim().toLowerCase();
	if (!normalized) return declarations;
	return declarations.filter((style) => style.name.toLowerCase().includes(normalized));
}

export function createStyleDraftFromExisting(
	existing?: { name: string; properties: Record<string, string> }
): StyleDraft {
	return {
		fillColor: existing?.properties.fillColor ?? '',
		strokeColor: existing?.properties.strokeColor ?? '',
		strokeWidth: Number(existing?.properties.strokeWidth ?? 2),
		textColor: existing?.properties.textColor ?? '',
		fontSize: Number(existing?.properties.fontSize ?? 14),
		fontFamily: existing?.properties.fontFamily ?? '',
		lineStyle: existing?.properties.lineStyle ?? 'solid'
	};
}

export function createStylePropertiesFromDraft(
	draft: StyleDraft
): Record<string, string | number> {
	return {
		fillColor: draft.fillColor,
		strokeColor: draft.strokeColor,
		strokeWidth: draft.strokeWidth,
		textColor: draft.textColor,
		fontSize: draft.fontSize,
		fontFamily: draft.fontFamily,
		lineStyle: draft.lineStyle
	};
}

