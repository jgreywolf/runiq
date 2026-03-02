import { describe, expect, it, vi } from 'vitest';
import {
	applyShapeToSelection,
	deleteSelectionFromToolbar,
	handlePanelOpenChange
} from './elementToolbarOrchestrator';
import type { ElementPanelKey } from './elementToolbarState';

function createPanelOpenState(): Record<ElementPanelKey, boolean> {
	return {
		changeShape: false,
		styles: false,
		border: false,
		fill: false,
		text: false,
		icon: false
	};
}

describe('elementToolbarOrchestrator', () => {
	it('opens requested panel and triggers corresponding hooks', () => {
		const panelOpen = createPanelOpenState();
		const closeAllPanels = vi.fn();
		const onOpenBorderPanel = vi.fn();
		const onOpenFillPanel = vi.fn();
		const onOpenTextPanel = vi.fn();

		handlePanelOpenChange({
			panel: 'border',
			open: true,
			panelOpen,
			closeAllPanels,
			onOpenBorderPanel,
			onOpenFillPanel,
			onOpenTextPanel,
			getIconDraft: () => null
		});

		expect(closeAllPanels).toHaveBeenCalledWith('border');
		expect(onOpenBorderPanel).toHaveBeenCalled();
		expect(panelOpen.border).toBe(true);
	});

	it('returns icon draft when icon panel opens', () => {
		const panelOpen = createPanelOpenState();
		const draft = handlePanelOpenChange({
			panel: 'icon',
			open: true,
			panelOpen,
			closeAllPanels: vi.fn(),
			onOpenBorderPanel: vi.fn(),
			onOpenFillPanel: vi.fn(),
			onOpenTextPanel: vi.fn(),
			getIconDraft: () => ({ iconInputValue: 'brand/github', iconSearchQuery: 'brand/github' })
		});
		expect(draft).toEqual({ iconInputValue: 'brand/github', iconSearchQuery: 'brand/github' });
	});

	it('applies shape only when a node is selected', () => {
		const edit = vi.fn();
		expect(applyShapeToSelection(null, 'circle', edit)).toBe(false);
		expect(applyShapeToSelection('n1', 'circle', edit)).toBe(true);
		expect(edit).toHaveBeenCalledWith('n1', 'shapeType', 'circle');
	});

	it('deletes selection and closes panels', () => {
		const deleteFn = vi.fn();
		const clearSelection = vi.fn();
		const closeAllPanels = vi.fn();
		deleteSelectionFromToolbar({
			selectedNodeId: 'n1',
			selectedEdgeId: null,
			deleteFn,
			clearSelection,
			closeAllPanels
		});
		expect(deleteFn).toHaveBeenCalledWith('n1', null);
		expect(clearSelection).toHaveBeenCalled();
		expect(closeAllPanels).toHaveBeenCalled();
	});
});
