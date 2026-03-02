import { describe, expect, it, vi } from 'vitest';
import {
	applyStyleRefToNode,
	buildDeleteStyleDeclarationCode,
	buildStyleDeclarationCode,
	clearStyleRefFromNode,
	createStyleDialogState,
	getFilteredStyleDeclarations
} from './elementStyleActions';

describe('elementStyleActions', () => {
	it('filters style declarations by query', () => {
		const code = `diagram "x" {
  style primary fillColor:"#fff"
  style warning fillColor:"#f00"
}`;
		const filtered = getFilteredStyleDeclarations(code, 'warn');
		expect(filtered).toHaveLength(1);
		expect(filtered[0].name).toBe('warning');
	});

	it('creates default create-style dialog state', () => {
		const state = createStyleDialogState();
		expect(state.editingStyleName).toBeNull();
		expect(state.newStyleName).toBe('');
		expect(state.showCreateStyleDialog).toBe(true);
	});

	it('applies and clears style refs', () => {
		const resetStyles = vi.fn();
		const edit = vi.fn();

		applyStyleRefToNode('n1', 'primary', resetStyles, edit);
		expect(resetStyles).toHaveBeenCalledWith(['n1']);
		expect(edit).toHaveBeenCalledWith('n1', 'style', 'primary');

		clearStyleRefFromNode('n1', edit);
		expect(edit).toHaveBeenCalledWith('n1', 'style', '');
	});

	it('builds style declaration code for insert and update', () => {
		const code = `diagram "x" {
  style primary fillColor:"#fff"
  shape a as @rectangle label:"A"
}`;

		const inserted = buildStyleDeclarationCode(code, {
			editingStyleName: null,
			newStyleName: 'secondary',
			newStyleDraft: {
				fillColor: '#eee',
				strokeColor: '#111',
				strokeWidth: 2,
				textColor: '#222',
				fontSize: 14,
				fontFamily: 'sans-serif',
				lineStyle: 'solid'
			}
		});
		expect(inserted).not.toBeNull();
		expect(inserted!.nextCode).toContain('style secondary');
		expect(inserted!.styleName).toBe('secondary');

		const updated = buildStyleDeclarationCode(code, {
			editingStyleName: 'primary',
			newStyleName: 'primary',
			newStyleDraft: {
				fillColor: '#000',
				strokeColor: '#111',
				strokeWidth: 1,
				textColor: '#fff',
				fontSize: 12,
				fontFamily: 'sans-serif',
				lineStyle: 'dashed'
			}
		});
		expect(updated).not.toBeNull();
		expect(updated!.nextCode).toContain('style primary');
		expect(updated!.nextCode).toContain('lineStyle:dashed');
	});

	it('deletes style declaration code', () => {
		const code = `diagram "x" {
  style primary fillColor:"#fff"
  shape a as @rectangle label:"A"
}`;
		const next = buildDeleteStyleDeclarationCode(code, 'primary');
		expect(next).not.toContain('style primary');
	});
});
