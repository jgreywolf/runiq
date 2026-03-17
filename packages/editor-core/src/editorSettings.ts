import { EditorProfileName } from './editorCapabilities.js';

export { EditorProfileName } from './editorCapabilities.js';

export type LayoutEngineId = string;
export type CanvasDefaultMode = 'select' | 'connect';
export type LayoutStrategyId =
	| 'hierarchical'
	| 'force'
	| 'adaptive'
	| 'tree'
	| 'radial'
	| 'circular';

export type LayoutStrategyByProfile = Partial<Record<EditorProfileName, LayoutStrategyId>>;

export interface EditorSettingsSnapshot {
	autosaveEnabled: boolean;
	autosaveDelayMs: number;
	enableVisualCanvasEditing: boolean;
	defaultCanvasMode: CanvasDefaultMode;
	defaultLayoutEngine: LayoutEngineId;
	defaultLayoutStrategy: LayoutStrategyId;
	defaultLayoutStrategyByProfile: LayoutStrategyByProfile;
	defaultDiagramTheme: string;
}

export const DEFAULT_EDITOR_SETTINGS: EditorSettingsSnapshot = {
	autosaveEnabled: true,
	autosaveDelayMs: 2000,
	enableVisualCanvasEditing: false,
	defaultCanvasMode: 'select',
	defaultLayoutEngine: 'elk',
	defaultLayoutStrategy: 'hierarchical',
	defaultLayoutStrategyByProfile: {},
	defaultDiagramTheme: 'runiq'
};

export const LAYOUT_STRATEGY_PRESETS: Record<EditorProfileName, LayoutStrategyId> = {
	[EditorProfileName.diagram]: 'hierarchical',
	[EditorProfileName.glyphset]: 'hierarchical',
	[EditorProfileName.electrical]: 'hierarchical',
	[EditorProfileName.digital]: 'hierarchical',
	[EditorProfileName.control]: 'hierarchical',
	[EditorProfileName.pneumatic]: 'hierarchical',
	[EditorProfileName.hydraulic]: 'hierarchical',
	[EditorProfileName.hvac]: 'hierarchical',
	[EditorProfileName.wardley]: 'hierarchical',
	[EditorProfileName.sequence]: 'hierarchical',
	[EditorProfileName.timeline]: 'hierarchical',
	[EditorProfileName.pid]: 'hierarchical',
	[EditorProfileName.railroad]: 'hierarchical',
	[EditorProfileName.kanban]: 'hierarchical',
	[EditorProfileName.gitgraph]: 'hierarchical',
	[EditorProfileName.treemap]: 'hierarchical',
	[EditorProfileName.pedigree]: 'hierarchical'
};

export function isCanvasMode(value: string): value is CanvasDefaultMode {
	return value === 'select' || value === 'connect';
}

export function isLayoutStrategy(value: string): value is LayoutStrategyId {
	return (
		value === 'hierarchical' ||
		value === 'force' ||
		value === 'adaptive' ||
		value === 'tree' ||
		value === 'radial' ||
		value === 'circular'
	);
}

export function getDefaultProfileForSettings(
	profile: EditorProfileName | null
): EditorProfileName {
	return profile ?? EditorProfileName.diagram;
}

export function normalizeLayoutStrategyByProfile(input: unknown): LayoutStrategyByProfile {
	if (!input || typeof input !== 'object') return {};
	const normalized: LayoutStrategyByProfile = {};
	for (const profile of Object.values(EditorProfileName)) {
		const value = (input as Record<string, unknown>)[profile];
		if (typeof value === 'string' && isLayoutStrategy(value)) {
			normalized[profile] = value;
		}
	}
	return normalized;
}

export function normalizeEditorSettings(
	input: Partial<EditorSettingsSnapshot> | null | undefined
): EditorSettingsSnapshot {
	if (!input) return { ...DEFAULT_EDITOR_SETTINGS };
	return {
		autosaveEnabled:
			typeof input.autosaveEnabled === 'boolean'
				? input.autosaveEnabled
				: DEFAULT_EDITOR_SETTINGS.autosaveEnabled,
		autosaveDelayMs:
			typeof input.autosaveDelayMs === 'number' && input.autosaveDelayMs >= 100
				? Math.round(input.autosaveDelayMs)
				: DEFAULT_EDITOR_SETTINGS.autosaveDelayMs,
		enableVisualCanvasEditing:
			typeof input.enableVisualCanvasEditing === 'boolean'
				? input.enableVisualCanvasEditing
				: DEFAULT_EDITOR_SETTINGS.enableVisualCanvasEditing,
		defaultCanvasMode:
			typeof input.defaultCanvasMode === 'string' && isCanvasMode(input.defaultCanvasMode)
				? input.defaultCanvasMode
				: DEFAULT_EDITOR_SETTINGS.defaultCanvasMode,
		defaultLayoutEngine:
			typeof input.defaultLayoutEngine === 'string' && input.defaultLayoutEngine.trim().length > 0
				? input.defaultLayoutEngine
				: DEFAULT_EDITOR_SETTINGS.defaultLayoutEngine,
		defaultLayoutStrategy:
			typeof input.defaultLayoutStrategy === 'string' && isLayoutStrategy(input.defaultLayoutStrategy)
				? input.defaultLayoutStrategy
				: DEFAULT_EDITOR_SETTINGS.defaultLayoutStrategy,
		defaultLayoutStrategyByProfile: normalizeLayoutStrategyByProfile(
			input.defaultLayoutStrategyByProfile
		),
		defaultDiagramTheme:
			typeof input.defaultDiagramTheme === 'string' && input.defaultDiagramTheme.trim().length > 0
				? input.defaultDiagramTheme.trim()
				: DEFAULT_EDITOR_SETTINGS.defaultDiagramTheme
	};
}

export function getLayoutStrategyPresetForProfile(
	profile: EditorProfileName | null
): LayoutStrategyId {
	const effective = getDefaultProfileForSettings(profile);
	return LAYOUT_STRATEGY_PRESETS[effective] ?? DEFAULT_EDITOR_SETTINGS.defaultLayoutStrategy;
}

export function getDefaultLayoutStrategyForProfile(
	profile: EditorProfileName | null,
	settings: Pick<EditorSettingsSnapshot, 'defaultLayoutStrategyByProfile' | 'defaultLayoutStrategy'>
): LayoutStrategyId {
	const effective = getDefaultProfileForSettings(profile);
	return (
		settings.defaultLayoutStrategyByProfile[effective] ??
		LAYOUT_STRATEGY_PRESETS[effective] ??
		settings.defaultLayoutStrategy
	);
}

export function profileSupportsLayoutEngineSelection(profile: EditorProfileName | null): boolean {
	return getDefaultProfileForSettings(profile) === EditorProfileName.diagram;
}

export function profileSupportsLayoutStrategySelection(
	profile: EditorProfileName | null
): boolean {
	return getDefaultProfileForSettings(profile) === EditorProfileName.diagram;
}

export function profileSupportsDefaultCanvasModeSelection(
	profile: EditorProfileName | null
): boolean {
	return getDefaultProfileForSettings(profile) !== EditorProfileName.glyphset;
}
