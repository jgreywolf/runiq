import { ProfileName } from '$lib/types';

const STORAGE_KEY = 'runiq-editor-settings';

export type LayoutEngineId = string;
export type CanvasDefaultMode = 'select' | 'connect';
export type LayoutStrategyId =
	| 'hierarchical'
	| 'force'
	| 'adaptive'
	| 'tree'
	| 'radial'
	| 'circular';
export type LayoutStrategyByProfile = Partial<Record<ProfileName, LayoutStrategyId>>;

export interface EditorSettingsSnapshot {
	autosaveEnabled: boolean;
	autosaveDelayMs: number;
	defaultCanvasMode: CanvasDefaultMode;
	defaultLayoutEngine: LayoutEngineId;
	defaultLayoutStrategy: LayoutStrategyId;
	defaultLayoutStrategyByProfile: LayoutStrategyByProfile;
	defaultDiagramTheme: string;
}

const DEFAULT_SETTINGS: EditorSettingsSnapshot = {
	autosaveEnabled: true,
	autosaveDelayMs: 2000,
	defaultCanvasMode: 'select',
	defaultLayoutEngine: 'elk',
	defaultLayoutStrategy: 'hierarchical',
	defaultLayoutStrategyByProfile: {},
	defaultDiagramTheme: 'runiq'
};

const LAYOUT_STRATEGY_PRESETS: Record<ProfileName, LayoutStrategyId> = {
	[ProfileName.diagram]: 'hierarchical',
	[ProfileName.glyphset]: 'hierarchical',
	[ProfileName.electrical]: 'hierarchical',
	[ProfileName.digital]: 'hierarchical',
	[ProfileName.control]: 'hierarchical',
	[ProfileName.pneumatic]: 'hierarchical',
	[ProfileName.hydraulic]: 'hierarchical',
	[ProfileName.hvac]: 'hierarchical',
	[ProfileName.wardley]: 'hierarchical',
	[ProfileName.sequence]: 'hierarchical',
	[ProfileName.timeline]: 'hierarchical',
	[ProfileName.pid]: 'hierarchical',
	[ProfileName.railroad]: 'hierarchical',
	[ProfileName.kanban]: 'hierarchical',
	[ProfileName.gitgraph]: 'hierarchical',
	[ProfileName.treemap]: 'hierarchical',
	[ProfileName.pedigree]: 'hierarchical'
};

function isCanvasMode(value: string): value is CanvasDefaultMode {
	return value === 'select' || value === 'connect';
}

function isLayoutStrategy(value: string): value is LayoutStrategyId {
	return (
		value === 'hierarchical' ||
		value === 'force' ||
		value === 'adaptive' ||
		value === 'tree' ||
		value === 'radial' ||
		value === 'circular'
	);
}

function normalizeLayoutStrategyByProfile(
	input: unknown
): LayoutStrategyByProfile {
	if (!input || typeof input !== 'object') return {};
	const normalized: LayoutStrategyByProfile = {};
	for (const profile of Object.values(ProfileName)) {
		const value = (input as Record<string, unknown>)[profile];
		if (typeof value === 'string' && isLayoutStrategy(value)) {
			normalized[profile] = value;
		}
	}
	return normalized;
}

function normalizeSettings(input: Partial<EditorSettingsSnapshot> | null | undefined): EditorSettingsSnapshot {
	if (!input) return { ...DEFAULT_SETTINGS };
	return {
		autosaveEnabled:
			typeof input.autosaveEnabled === 'boolean'
				? input.autosaveEnabled
				: DEFAULT_SETTINGS.autosaveEnabled,
		autosaveDelayMs:
			typeof input.autosaveDelayMs === 'number' && input.autosaveDelayMs >= 100
				? Math.round(input.autosaveDelayMs)
				: DEFAULT_SETTINGS.autosaveDelayMs,
		defaultCanvasMode:
			typeof input.defaultCanvasMode === 'string' && isCanvasMode(input.defaultCanvasMode)
				? input.defaultCanvasMode
				: DEFAULT_SETTINGS.defaultCanvasMode,
		defaultLayoutEngine:
			typeof input.defaultLayoutEngine === 'string' && input.defaultLayoutEngine.trim().length > 0
				? input.defaultLayoutEngine
				: DEFAULT_SETTINGS.defaultLayoutEngine,
		defaultLayoutStrategy:
			typeof input.defaultLayoutStrategy === 'string' && isLayoutStrategy(input.defaultLayoutStrategy)
				? input.defaultLayoutStrategy
				: DEFAULT_SETTINGS.defaultLayoutStrategy,
		defaultLayoutStrategyByProfile: normalizeLayoutStrategyByProfile(
			input.defaultLayoutStrategyByProfile
		),
		defaultDiagramTheme:
			typeof input.defaultDiagramTheme === 'string' && input.defaultDiagramTheme.trim().length > 0
				? input.defaultDiagramTheme.trim()
				: DEFAULT_SETTINGS.defaultDiagramTheme
	};
}

function loadFromStorage(): EditorSettingsSnapshot {
	if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS };
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { ...DEFAULT_SETTINGS };
		const parsed = JSON.parse(raw) as Partial<EditorSettingsSnapshot>;
		return normalizeSettings(parsed);
	} catch {
		return { ...DEFAULT_SETTINGS };
	}
}

function saveToStorage(snapshot: EditorSettingsSnapshot): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

class EditorSettingsState {
	autosaveEnabled = $state(DEFAULT_SETTINGS.autosaveEnabled);
	autosaveDelayMs = $state(DEFAULT_SETTINGS.autosaveDelayMs);
	defaultCanvasMode = $state<CanvasDefaultMode>(DEFAULT_SETTINGS.defaultCanvasMode);
	defaultLayoutEngine = $state<LayoutEngineId>(DEFAULT_SETTINGS.defaultLayoutEngine);
	defaultLayoutStrategy = $state<LayoutStrategyId>(DEFAULT_SETTINGS.defaultLayoutStrategy);
	defaultLayoutStrategyByProfile = $state<LayoutStrategyByProfile>(
		DEFAULT_SETTINGS.defaultLayoutStrategyByProfile
	);
	defaultDiagramTheme = $state(DEFAULT_SETTINGS.defaultDiagramTheme);

	constructor() {
		const saved = loadFromStorage();
		this.autosaveEnabled = saved.autosaveEnabled;
		this.autosaveDelayMs = saved.autosaveDelayMs;
		this.defaultCanvasMode = saved.defaultCanvasMode;
		this.defaultLayoutEngine = saved.defaultLayoutEngine;
		this.defaultLayoutStrategy = saved.defaultLayoutStrategy;
		this.defaultLayoutStrategyByProfile = saved.defaultLayoutStrategyByProfile;
		this.defaultDiagramTheme = saved.defaultDiagramTheme;
	}

	get snapshot(): EditorSettingsSnapshot {
		return {
			autosaveEnabled: this.autosaveEnabled,
			autosaveDelayMs: this.autosaveDelayMs,
			defaultCanvasMode: this.defaultCanvasMode,
			defaultLayoutEngine: this.defaultLayoutEngine,
			defaultLayoutStrategy: this.defaultLayoutStrategy,
			defaultLayoutStrategyByProfile: this.defaultLayoutStrategyByProfile,
			defaultDiagramTheme: this.defaultDiagramTheme
		};
	}

	update(next: Partial<EditorSettingsSnapshot>): EditorSettingsSnapshot {
		const normalized = normalizeSettings({ ...this.snapshot, ...next });
		this.autosaveEnabled = normalized.autosaveEnabled;
		this.autosaveDelayMs = normalized.autosaveDelayMs;
		this.defaultCanvasMode = normalized.defaultCanvasMode;
		this.defaultLayoutEngine = normalized.defaultLayoutEngine;
		this.defaultLayoutStrategy = normalized.defaultLayoutStrategy;
		this.defaultLayoutStrategyByProfile = normalized.defaultLayoutStrategyByProfile;
		this.defaultDiagramTheme = normalized.defaultDiagramTheme;
		saveToStorage(this.snapshot);
		return this.snapshot;
	}

	setDefaultLayoutStrategyForProfile(
		profile: ProfileName | null,
		strategy: LayoutStrategyId
	): EditorSettingsSnapshot {
		const effective = getDefaultProfileForSettings(profile);
		this.defaultLayoutStrategyByProfile = {
			...this.defaultLayoutStrategyByProfile,
			[effective]: strategy
		};
		this.defaultLayoutStrategy = strategy;
		saveToStorage(this.snapshot);
		return this.snapshot;
	}

	reset(): EditorSettingsSnapshot {
		this.autosaveEnabled = DEFAULT_SETTINGS.autosaveEnabled;
		this.autosaveDelayMs = DEFAULT_SETTINGS.autosaveDelayMs;
		this.defaultCanvasMode = DEFAULT_SETTINGS.defaultCanvasMode;
		this.defaultLayoutEngine = DEFAULT_SETTINGS.defaultLayoutEngine;
		this.defaultLayoutStrategy = DEFAULT_SETTINGS.defaultLayoutStrategy;
		this.defaultLayoutStrategyByProfile = DEFAULT_SETTINGS.defaultLayoutStrategyByProfile;
		this.defaultDiagramTheme = DEFAULT_SETTINGS.defaultDiagramTheme;
		saveToStorage(this.snapshot);
		return this.snapshot;
	}

	getDefaultLayoutStrategyForProfile(profile: ProfileName | null): LayoutStrategyId {
		const effective = getDefaultProfileForSettings(profile);
		return (
			this.defaultLayoutStrategyByProfile[effective] ??
			LAYOUT_STRATEGY_PRESETS[effective] ??
			this.defaultLayoutStrategy
		);
	}
}

export const editorSettings = new EditorSettingsState();

export function getDefaultProfileForSettings(profile: ProfileName | null): ProfileName {
	return profile ?? ProfileName.diagram;
}

export function profileSupportsLayoutEngineSelection(profile: ProfileName | null): boolean {
	const effective = getDefaultProfileForSettings(profile);
	return effective === ProfileName.diagram;
}

export function profileSupportsLayoutStrategySelection(profile: ProfileName | null): boolean {
	const effective = getDefaultProfileForSettings(profile);
	return effective === ProfileName.diagram;
}

export function getLayoutStrategyPresetForProfile(profile: ProfileName | null): LayoutStrategyId {
	const effective = getDefaultProfileForSettings(profile);
	return LAYOUT_STRATEGY_PRESETS[effective] ?? DEFAULT_SETTINGS.defaultLayoutStrategy;
}

export function profileSupportsDefaultCanvasModeSelection(profile: ProfileName | null): boolean {
	const effective = getDefaultProfileForSettings(profile);
	return effective !== ProfileName.glyphset;
}
