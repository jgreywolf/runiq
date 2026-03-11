import { describe, expect, it, vi } from 'vitest';
import { ProfileName } from '$lib/types';
import {
	applyBorderDraftForSelected,
	applyFillDraftForSelected,
	applyIconToSelectedNode,
	applyTextDraftForSelected,
	canUseElementToolbar,
	clearIconOnSelectedNode,
	openIconPanelDraft
} from './elementPanelActions';

describe('elementPanelActions', () => {
	it('enforces diagram/select mode for element toolbar actions', () => {
		expect(canUseElementToolbar(ProfileName.diagram, 'select')).toBe(true);
		expect(canUseElementToolbar(ProfileName.timeline, 'select')).toBe(false);
		expect(canUseElementToolbar(ProfileName.diagram, 'connect')).toBe(false);
	});

	it('applies and clears icon for selected node', () => {
		const edit = vi.fn();
		const applied = applyIconToSelectedNode({
			profileName: ProfileName.diagram,
			mode: 'select',
			selectedNodeId: 'n1',
			iconInputValue: 'brand/github',
			edit
		});
		expect(applied).toBe(true);
		expect(edit).toHaveBeenCalledWith('n1', 'icon', 'brand/github');

		const cleared = clearIconOnSelectedNode({
			profileName: ProfileName.diagram,
			mode: 'select',
			selectedNodeId: 'n1',
			edit
		});
		expect(cleared.cleared).toBe(true);
		expect(edit).toHaveBeenCalledWith('n1', 'icon', '');
	});

	it('derives icon panel draft from element styles', () => {
		const draft = openIconPanelDraft('n1', {}, () => ({ icon: 'brand/github' }));
		expect(draft).toEqual({ iconInputValue: 'brand/github', iconSearchQuery: 'brand/github' });
	});

	it('applies border/fill/text drafts for selected elements', () => {
		const edit = vi.fn();
		const borderApplied = applyBorderDraftForSelected({
			selectedId: 'n1',
			isEdge: false,
			draft: { strokeColor: '#000', strokeWidth: 2, lineStyle: 'solid' },
			edit
		});
		expect(borderApplied).toBe(true);

		const fillApplied = applyFillDraftForSelected({
			selectedId: 'n1',
			selectedNodeId: 'n1',
			draft: { fillColor: '#fff' },
			edit
		});
		expect(fillApplied).toBe(true);

		const textApplied = applyTextDraftForSelected({
			selectedId: 'n1',
			selectedNodeId: 'n1',
			draft: { textColor: '#111', fontSize: 14, fontFamily: 'sans-serif' },
			edit
		});
		expect(textApplied).toBe(true);
	});
});
