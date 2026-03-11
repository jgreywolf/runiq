import {
	applyStyleRefToNode,
	buildDeleteStyleDeclarationCode,
	buildStyleDeclarationCode,
	clearStyleRefFromNode,
	createStyleDialogState,
	type ExistingStyleSeed
} from './elementStyleActions';
import type { StyleDraft } from './elementToolbarState';

export function applyStyleRefForSelection(params: {
	selectedNodeId: string | null;
	styleName: string;
	resetStyles: (ids: string[]) => void;
	edit: (id: string, property: string, value: string | number) => void;
}): boolean {
	if (!params.selectedNodeId) return false;
	applyStyleRefToNode(params.selectedNodeId, params.styleName, params.resetStyles, params.edit);
	return true;
}

export function clearStyleRefForSelection(params: {
	selectedNodeId: string | null;
	edit: (id: string, property: string, value: string | number) => void;
}): boolean {
	if (!params.selectedNodeId) return false;
	clearStyleRefFromNode(params.selectedNodeId, params.edit);
	return true;
}

export function openCreateStyleDialogWorkflow(existing?: ExistingStyleSeed) {
	return createStyleDialogState(existing);
}

export function saveStyleDeclarationAndApplyWorkflow(params: {
	selectedNodeId: string | null;
	code: string;
	editingStyleName: string | null;
	newStyleName: string;
	newStyleDraft: StyleDraft;
	updateCode: (nextCode: string, pushHistory: boolean) => void;
	edit: (id: string, property: string, value: string | number) => void;
}): boolean {
	if (!params.selectedNodeId) return false;
	const next = buildStyleDeclarationCode(params.code, {
		editingStyleName: params.editingStyleName,
		newStyleName: params.newStyleName,
		newStyleDraft: params.newStyleDraft
	});
	if (!next) return false;
	params.updateCode(next.nextCode, true);
	params.edit(params.selectedNodeId, 'style', next.styleName);
	return true;
}

export function removeStyleDeclarationWorkflow(params: {
	code: string;
	styleName: string;
	updateCode: (nextCode: string, pushHistory: boolean) => void;
}): void {
	params.updateCode(buildDeleteStyleDeclarationCode(params.code, params.styleName), true);
}
