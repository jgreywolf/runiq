const STORAGE_KEY = 'runiq-panel-sizes';

export interface PanelSizes {
	toolbox: number;
	editor: number;
	preview: number;
}

export const DEFAULT_PANEL_SIZES: PanelSizes = {
	toolbox: 20,
	editor: 40,
	preview: 40
};

export function loadPanelSizes(): PanelSizes {
	if (typeof localStorage === 'undefined') {
		return { ...DEFAULT_PANEL_SIZES };
	}

	const saved = localStorage.getItem(STORAGE_KEY);
	if (!saved) {
		return { ...DEFAULT_PANEL_SIZES };
	}

	try {
		const parsed = JSON.parse(saved) as Partial<PanelSizes>;
		return {
			toolbox: parsed.toolbox ?? DEFAULT_PANEL_SIZES.toolbox,
			editor: parsed.editor ?? DEFAULT_PANEL_SIZES.editor,
			preview: parsed.preview ?? DEFAULT_PANEL_SIZES.preview
		};
	} catch (e) {
		console.warn('Failed to load panel sizes:', e);
		return { ...DEFAULT_PANEL_SIZES };
	}
}

export function savePanelSizes(sizes: PanelSizes): void {
	if (typeof localStorage === 'undefined') {
		return;
	}
	localStorage.setItem(STORAGE_KEY, JSON.stringify(sizes));
}
