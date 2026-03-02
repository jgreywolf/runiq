import { ProfileName } from '$lib/types';
import { applyIconEdit, getBorderDraft, getFillDraft, getTextDraft } from './elementToolbarCommands';
import type { BorderDraft, FillDraft, TextDraft } from './elementToolbarCommands';
import {
	applyBorderDraftEdits,
	applyFillDraftEdit,
	applyTextDraftEdits
} from './elementToolbarCommands';

export function canUseElementToolbar(
	profileName: ProfileName | null,
	mode: 'select' | 'connect'
): boolean {
	return profileName === ProfileName.diagram && mode === 'select';
}

export function openBorderPanelDraft(
	selectedId: string | null,
	profile: any,
	extractSelectedElementStyles: (profile: any, selectedId: string) => Record<string, unknown>
): BorderDraft | null {
	if (!selectedId) return null;
	const styles = extractSelectedElementStyles(profile, selectedId);
	return getBorderDraft(styles);
}

export function openFillPanelDraft(
	selectedId: string | null,
	profile: any,
	extractSelectedElementStyles: (profile: any, selectedId: string) => Record<string, unknown>
): FillDraft | null {
	if (!selectedId) return null;
	const styles = extractSelectedElementStyles(profile, selectedId);
	return getFillDraft(styles);
}

export function openTextPanelDraft(
	selectedId: string | null,
	profile: any,
	extractSelectedElementStyles: (profile: any, selectedId: string) => Record<string, unknown>
): TextDraft | null {
	if (!selectedId) return null;
	const styles = extractSelectedElementStyles(profile, selectedId);
	return getTextDraft(styles);
}

export function openIconPanelDraft(
	selectedNodeId: string | null,
	profile: any,
	extractSelectedElementStyles: (profile: any, selectedId: string) => Record<string, unknown>
): { iconInputValue: string; iconSearchQuery: string } | null {
	if (!selectedNodeId) return null;
	const styles = extractSelectedElementStyles(profile, selectedNodeId);
	const iconInputValue =
		typeof styles.icon === 'string' && styles.icon !== 'mixed' ? String(styles.icon) : '';
	return {
		iconInputValue,
		iconSearchQuery: iconInputValue
	};
}

export function applyIconToSelectedNode(params: {
	profileName: ProfileName | null;
	mode: 'select' | 'connect';
	selectedNodeId: string | null;
	iconInputValue: string;
	edit: (id: string, property: string, value: string | number) => void;
}): boolean {
	if (!canUseElementToolbar(params.profileName, params.mode)) return false;
	if (!params.selectedNodeId) return false;
	const iconValue = params.iconInputValue.trim();
	if (!iconValue) return false;
	applyIconEdit(params.selectedNodeId, iconValue, (id, property, value) =>
		params.edit(id, property, value)
	);
	return true;
}

export function clearIconOnSelectedNode(params: {
	profileName: ProfileName | null;
	mode: 'select' | 'connect';
	selectedNodeId: string | null;
	edit: (id: string, property: string, value: string | number) => void;
}): { cleared: boolean; iconInputValue: string; iconSearchQuery: string } {
	if (!canUseElementToolbar(params.profileName, params.mode)) {
		return { cleared: false, iconInputValue: '', iconSearchQuery: '' };
	}
	if (!params.selectedNodeId) {
		return { cleared: false, iconInputValue: '', iconSearchQuery: '' };
	}
	applyIconEdit(params.selectedNodeId, '', (id, property, value) =>
		params.edit(id, property, value)
	);
	return { cleared: true, iconInputValue: '', iconSearchQuery: '' };
}

export function applyBorderDraftForSelected(params: {
	selectedId: string | null;
	isEdge: boolean;
	draft: BorderDraft;
	edit: (id: string, property: string, value: string | number) => void;
}): boolean {
	if (!params.selectedId) return false;
	applyBorderDraftEdits(params.selectedId, params.draft, params.isEdge, params.edit);
	return true;
}

export function applyFillDraftForSelected(params: {
	selectedId: string | null;
	selectedNodeId: string | null;
	draft: FillDraft;
	edit: (id: string, property: string, value: string | number) => void;
}): boolean {
	if (!params.selectedNodeId) return false;
	if (!params.selectedId) return false;
	applyFillDraftEdit(params.selectedId, params.draft, params.edit);
	return true;
}

export function applyTextDraftForSelected(params: {
	selectedId: string | null;
	selectedNodeId: string | null;
	draft: TextDraft;
	edit: (id: string, property: string, value: string | number) => void;
}): boolean {
	if (!params.selectedNodeId) return false;
	if (!params.selectedId) return false;
	applyTextDraftEdits(params.selectedId, params.draft, params.edit);
	return true;
}
