import type { ElementPanelKey } from './elementToolbarState';

export type IconPanelDraft = { iconInputValue: string; iconSearchQuery: string } | null;

export function handlePanelOpenChange(params: {
	panel: ElementPanelKey;
	open: boolean;
	panelOpen: Record<ElementPanelKey, boolean>;
	closeAllPanels: (except?: ElementPanelKey) => void;
	onOpenBorderPanel: () => void;
	onOpenFillPanel: () => void;
	onOpenTextPanel: () => void;
	getIconDraft: () => IconPanelDraft;
}): IconPanelDraft {
	const {
		panel,
		open,
		panelOpen,
		closeAllPanels,
		onOpenBorderPanel,
		onOpenFillPanel,
		onOpenTextPanel,
		getIconDraft
	} = params;

	let iconDraft: IconPanelDraft = null;
	if (open) {
		closeAllPanels(panel);
		if (panel === 'border') onOpenBorderPanel();
		else if (panel === 'fill') onOpenFillPanel();
		else if (panel === 'text') onOpenTextPanel();
		else if (panel === 'icon') {
			iconDraft = getIconDraft();
		}
	}
	panelOpen[panel] = open;
	return iconDraft;
}

export function applyShapeToSelection(
	selectedNodeId: string | null,
	shapeId: string,
	edit: (id: string, property: string, value: string | number) => void
): boolean {
	if (!selectedNodeId) return false;
	edit(selectedNodeId, 'shapeType', shapeId);
	return true;
}

export function deleteSelectionFromToolbar(params: {
	selectedNodeId: string | null;
	selectedEdgeId: string | null;
	deleteFn: (nodeId: string | null, edgeId: string | null) => void;
	clearSelection: () => void;
	closeAllPanels: () => void;
}): void {
	params.deleteFn(params.selectedNodeId, params.selectedEdgeId);
	params.clearSelection();
	params.closeAllPanels();
}
