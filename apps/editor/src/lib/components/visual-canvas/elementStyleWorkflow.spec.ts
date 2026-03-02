import { describe, expect, it, vi } from 'vitest';
import {
	applyStyleRefForSelection,
	clearStyleRefForSelection,
	openCreateStyleDialogWorkflow,
	removeStyleDeclarationWorkflow,
	saveStyleDeclarationAndApplyWorkflow
} from './elementStyleWorkflow';

describe('elementStyleWorkflow', () => {
	it('applies and clears style refs for selected node', () => {
		const resetStyles = vi.fn();
		const edit = vi.fn();
		expect(
			applyStyleRefForSelection({
				selectedNodeId: 'n1',
				styleName: 'primary',
				resetStyles,
				edit
			})
		).toBe(true);
		expect(resetStyles).toHaveBeenCalledWith(['n1']);
		expect(edit).toHaveBeenCalledWith('n1', 'style', 'primary');

		expect(clearStyleRefForSelection({ selectedNodeId: 'n1', edit })).toBe(true);
		expect(edit).toHaveBeenCalledWith('n1', 'style', '');
	});

	it('creates style dialog state', () => {
		const state = openCreateStyleDialogWorkflow({
			name: 'primary',
			properties: { fillColor: '#fff' }
		});
		expect(state.showCreateStyleDialog).toBe(true);
		expect(state.editingStyleName).toBe('primary');
		expect(state.newStyleName).toBe('primary');
	});

	it('saves style declaration and applies it', () => {
		const updateCode = vi.fn();
		const edit = vi.fn();
		const ok = saveStyleDeclarationAndApplyWorkflow({
			selectedNodeId: 'n1',
			code: `diagram "x" {\n  shape a as @rectangle label:"A"\n}`,
			editingStyleName: null,
			newStyleName: 'primary',
			newStyleDraft: {
				fillColor: '#eee',
				strokeColor: '#111',
				strokeWidth: 2,
				textColor: '#222',
				fontSize: 14,
				fontFamily: 'sans-serif',
				lineStyle: 'solid'
			},
			updateCode,
			edit
		});
		expect(ok).toBe(true);
		expect(updateCode).toHaveBeenCalled();
		expect(edit).toHaveBeenCalledWith('n1', 'style', 'primary');
	});

	it('removes style declaration', () => {
		const updateCode = vi.fn();
		removeStyleDeclarationWorkflow({
			code: `diagram "x" {\n  style primary fillColor:"#fff"\n}`,
			styleName: 'primary',
			updateCode
		});
		expect(updateCode).toHaveBeenCalled();
	});
});
