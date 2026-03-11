import { describe, expect, it } from 'vitest';
import {
	closeAllPanels,
	createBorderDraftFromStyles,
	createFillDraftFromStyles,
	createInitialPanelOpen,
	createStyleDraftFromExisting,
	createStylePropertiesFromDraft,
	createTextDraftFromStyles,
	filterStyleDeclarations,
	getFilteredIconTokens
} from './elementToolbarState';

describe('elementToolbarState', () => {
	it('creates and closes panel state with optional exception', () => {
		const panelState = createInitialPanelOpen();
		panelState.changeShape = true;
		panelState.styles = true;
		panelState.icon = true;

		closeAllPanels(panelState, 'styles');

		expect(panelState.changeShape).toBe(false);
		expect(panelState.styles).toBe(true);
		expect(panelState.icon).toBe(false);
	});

	it('filters icon tokens by query and applies limit', () => {
		const tokens = ['brand/github', 'brand/gitlab', 'iconify/mdi_cloud', 'iconify/fa_user'];

		expect(getFilteredIconTokens(tokens, '')).toEqual(tokens);
		expect(getFilteredIconTokens(tokens, 'git')).toEqual(['brand/github', 'brand/gitlab']);
		expect(getFilteredIconTokens(tokens, 'iconify', 1)).toEqual(['iconify/mdi_cloud']);
	});

	it('creates draft values from styles and supports fallbacks', () => {
		expect(createBorderDraftFromStyles({ stroke: '#123456', strokeWidth: 4, lineStyle: 'dashed' })).toEqual({
			strokeColor: '#123456',
			strokeWidth: 4,
			lineStyle: 'dashed'
		});
		expect(createBorderDraftFromStyles({ lineStyle: 'unknown' })).toEqual({
			strokeColor: '#48677e',
			strokeWidth: 2,
			lineStyle: 'solid'
		});

		expect(createFillDraftFromStyles({ fill: '#abcdef' })).toEqual({ fillColor: '#abcdef' });
		expect(createFillDraftFromStyles({})).toEqual({ fillColor: '#ffffff' });

		expect(createTextDraftFromStyles({ text: '#111111', fontSize: 18, fontFamily: 'mono' })).toEqual({
			textColor: '#111111',
			fontSize: 18,
			fontFamily: 'mono'
		});
		expect(createTextDraftFromStyles({})).toEqual({
			textColor: '#1f2937',
			fontSize: 14,
			fontFamily: 'sans-serif'
		});
	});

	it('filters style declarations and maps style draft properties', () => {
		const declarations = [
			{ name: 'primary', properties: { fillColor: '#fff' } },
			{ name: 'danger', properties: { fillColor: '#f00' } },
			{ name: 'muted', properties: { fillColor: '#999' } }
		];

		expect(filterStyleDeclarations(declarations, 'da')).toEqual([declarations[1]]);
		expect(filterStyleDeclarations(declarations, '')).toEqual(declarations);

		const draft = createStyleDraftFromExisting({
			name: 'primary',
			properties: {
				fillColor: '#fff',
				strokeColor: '#000',
				strokeWidth: '3',
				textColor: '#111',
				fontSize: '16',
				fontFamily: 'Inter',
				lineStyle: 'dotted'
			}
		});
		expect(draft).toEqual({
			fillColor: '#fff',
			strokeColor: '#000',
			strokeWidth: 3,
			textColor: '#111',
			fontSize: 16,
			fontFamily: 'Inter',
			lineStyle: 'dotted'
		});
		expect(createStylePropertiesFromDraft(draft)).toEqual({
			fillColor: '#fff',
			strokeColor: '#000',
			strokeWidth: 3,
			textColor: '#111',
			fontSize: 16,
			fontFamily: 'Inter',
			lineStyle: 'dotted'
		});
	});
});

