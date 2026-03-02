import {
	createBorderDraftFromStyles,
	createFillDraftFromStyles,
	createStylePropertiesFromDraft,
	createTextDraftFromStyles
} from './elementToolbarState';

export type BorderDraft = {
	strokeColor: string;
	strokeWidth: number;
	lineStyle: 'solid' | 'dashed' | 'dotted' | 'none';
};

export type FillDraft = { fillColor: string };
export type TextDraft = { textColor: string; fontSize: number; fontFamily: string };
export type StyleDraft = {
	fillColor: string;
	strokeColor: string;
	strokeWidth: number;
	textColor: string;
	fontSize: number;
	fontFamily: string;
	lineStyle: string;
};

export function getBorderDraft(styles: Record<string, unknown>): BorderDraft {
	return createBorderDraftFromStyles(styles);
}

export function getFillDraft(styles: Record<string, unknown>): FillDraft {
	return createFillDraftFromStyles(styles);
}

export function getTextDraft(styles: Record<string, unknown>): TextDraft {
	return createTextDraftFromStyles(styles);
}

export function applyBorderDraftEdits(
	selectedId: string,
	draft: BorderDraft,
	isEdge: boolean,
	edit: (id: string, property: string, value: string | number) => void
): void {
	edit(selectedId, 'strokeColor', draft.strokeColor);
	edit(selectedId, 'strokeWidth', Math.max(0, Number(draft.strokeWidth) || 0));
	if (isEdge) {
		edit(selectedId, 'lineStyle', draft.lineStyle === 'none' ? 'solid' : draft.lineStyle);
	}
	if (draft.lineStyle === 'none') {
		edit(selectedId, 'strokeWidth', 0);
	}
}

export function applyFillDraftEdit(
	selectedId: string,
	draft: FillDraft,
	edit: (id: string, property: string, value: string | number) => void
): void {
	edit(selectedId, 'fillColor', draft.fillColor);
}

export function applyTextDraftEdits(
	selectedId: string,
	draft: TextDraft,
	edit: (id: string, property: string, value: string | number) => void
): void {
	edit(selectedId, 'textColor', draft.textColor);
	edit(selectedId, 'fontSize', Math.max(8, Number(draft.fontSize) || 14));
	edit(selectedId, 'fontFamily', draft.fontFamily || 'sans-serif');
}

export function applyIconEdit(
	selectedNodeId: string,
	iconValue: string,
	edit: (id: string, property: string, value: string) => void
): void {
	edit(selectedNodeId, 'icon', iconValue);
}

export function getStylePropertiesFromDraft(draft: StyleDraft): Record<string, string | number> {
	return createStylePropertiesFromDraft(draft);
}

