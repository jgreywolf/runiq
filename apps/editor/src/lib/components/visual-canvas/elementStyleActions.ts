import {
	deleteStyleDeclaration,
	insertStyleDeclaration,
	parseStyleDeclarations,
	updateStyleDeclaration,
	type ParsedStyleDeclaration
} from '$lib/utils/dslCodeManipulation';
import {
	createStyleDraftFromExisting,
	filterStyleDeclarations,
	type StyleDraft
} from './elementToolbarState';
import { getStylePropertiesFromDraft } from './elementToolbarCommands';

export type ExistingStyleSeed = { name: string; properties: Record<string, string> } | undefined;

export function getFilteredStyleDeclarations(
	code: string,
	query: string
): ParsedStyleDeclaration[] {
	return filterStyleDeclarations(parseStyleDeclarations(code), query);
}

export function createStyleDialogState(existing?: ExistingStyleSeed): {
	editingStyleName: string | null;
	newStyleName: string;
	newStyleDraft: StyleDraft;
	showCreateStyleDialog: boolean;
} {
	return {
		editingStyleName: existing?.name ?? null,
		newStyleName: existing?.name ?? '',
		newStyleDraft: createStyleDraftFromExisting(existing),
		showCreateStyleDialog: true
	};
}

export function applyStyleRefToNode(
	selectedNodeId: string,
	styleName: string,
	resetStyles: (ids: string[]) => void,
	edit: (id: string, property: string, value: string | number) => void
): void {
	// Ensure style ref is the active source of truth by clearing inline style props first.
	resetStyles([selectedNodeId]);
	edit(selectedNodeId, 'style', styleName);
}

export function clearStyleRefFromNode(
	selectedNodeId: string,
	edit: (id: string, property: string, value: string | number) => void
): void {
	edit(selectedNodeId, 'style', '');
}

export function buildStyleDeclarationCode(
	code: string,
	params: {
		editingStyleName: string | null;
		newStyleName: string;
		newStyleDraft: StyleDraft;
	}
): { nextCode: string; styleName: string } | null {
	const styleName = params.newStyleName.trim();
	if (!styleName) return null;

	const properties = getStylePropertiesFromDraft(params.newStyleDraft);
	const nextCode = params.editingStyleName
		? updateStyleDeclaration(code, params.editingStyleName, properties)
		: insertStyleDeclaration(code, styleName, properties);

	return { nextCode, styleName };
}

export function buildDeleteStyleDeclarationCode(code: string, styleName: string): string {
	return deleteStyleDeclaration(code, styleName);
}
