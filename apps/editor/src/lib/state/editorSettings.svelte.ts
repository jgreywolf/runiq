import { ProfileName } from '$lib/types';
import {
	DEFAULT_EDITOR_SETTINGS,
	getDefaultLayoutStrategyForProfile as getSharedDefaultLayoutStrategyForProfile,
	getDefaultProfileForSettings as getSharedDefaultProfileForSettings,
	getLayoutStrategyPresetForProfile as getSharedLayoutStrategyPresetForProfile,
	normalizeEditorSettings,
	profileSupportsDefaultCanvasModeSelection as profileSupportsDefaultCanvasModeSelectionShared,
	profileSupportsLayoutStrategySelection as profileSupportsLayoutStrategySelectionShared,
	type CanvasDefaultMode,
	type EditorSettingsSnapshot,
	type LayoutEngineId,
	type LayoutStrategyByProfile,
	type LayoutStrategyId
} from '@runiq/editor-core';
export type {
	CanvasDefaultMode,
	EditorSettingsSnapshot,
	LayoutEngineId,
	LayoutStrategyByProfile,
	LayoutStrategyId
} from '@runiq/editor-core';

const STORAGE_KEY = 'runiq-editor-settings';

function loadFromStorage(): EditorSettingsSnapshot {
	if (typeof window === 'undefined') return { ...DEFAULT_EDITOR_SETTINGS };
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { ...DEFAULT_EDITOR_SETTINGS };
		const parsed = JSON.parse(raw) as Partial<EditorSettingsSnapshot>;
		return normalizeEditorSettings(parsed);
	} catch {
		return { ...DEFAULT_EDITOR_SETTINGS };
	}
}

function saveToStorage(snapshot: EditorSettingsSnapshot): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

class EditorSettingsState {
	autosaveEnabled = $state(DEFAULT_EDITOR_SETTINGS.autosaveEnabled);
	autosaveDelayMs = $state(DEFAULT_EDITOR_SETTINGS.autosaveDelayMs);
	enableVisualCanvasEditing = $state(DEFAULT_EDITOR_SETTINGS.enableVisualCanvasEditing);
	defaultCanvasMode = $state<CanvasDefaultMode>(DEFAULT_EDITOR_SETTINGS.defaultCanvasMode);
	defaultLayoutEngine = $state<LayoutEngineId>(DEFAULT_EDITOR_SETTINGS.defaultLayoutEngine);
	defaultLayoutStrategy = $state<LayoutStrategyId>(DEFAULT_EDITOR_SETTINGS.defaultLayoutStrategy);
	defaultLayoutStrategyByProfile = $state<LayoutStrategyByProfile>(
		DEFAULT_EDITOR_SETTINGS.defaultLayoutStrategyByProfile
	);
	defaultDiagramTheme = $state(DEFAULT_EDITOR_SETTINGS.defaultDiagramTheme);

	constructor() {
		const saved = loadFromStorage();
		this.autosaveEnabled = saved.autosaveEnabled;
		this.autosaveDelayMs = saved.autosaveDelayMs;
		this.enableVisualCanvasEditing = saved.enableVisualCanvasEditing;
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
			enableVisualCanvasEditing: this.enableVisualCanvasEditing,
			defaultCanvasMode: this.defaultCanvasMode,
			defaultLayoutEngine: this.defaultLayoutEngine,
			defaultLayoutStrategy: this.defaultLayoutStrategy,
			defaultLayoutStrategyByProfile: this.defaultLayoutStrategyByProfile,
			defaultDiagramTheme: this.defaultDiagramTheme
		};
	}

	update(next: Partial<EditorSettingsSnapshot>): EditorSettingsSnapshot {
		const normalized = normalizeEditorSettings({ ...this.snapshot, ...next });
		this.autosaveEnabled = normalized.autosaveEnabled;
		this.autosaveDelayMs = normalized.autosaveDelayMs;
		this.enableVisualCanvasEditing = normalized.enableVisualCanvasEditing;
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
		this.autosaveEnabled = DEFAULT_EDITOR_SETTINGS.autosaveEnabled;
		this.autosaveDelayMs = DEFAULT_EDITOR_SETTINGS.autosaveDelayMs;
		this.enableVisualCanvasEditing = DEFAULT_EDITOR_SETTINGS.enableVisualCanvasEditing;
		this.defaultCanvasMode = DEFAULT_EDITOR_SETTINGS.defaultCanvasMode;
		this.defaultLayoutEngine = DEFAULT_EDITOR_SETTINGS.defaultLayoutEngine;
		this.defaultLayoutStrategy = DEFAULT_EDITOR_SETTINGS.defaultLayoutStrategy;
		this.defaultLayoutStrategyByProfile = DEFAULT_EDITOR_SETTINGS.defaultLayoutStrategyByProfile;
		this.defaultDiagramTheme = DEFAULT_EDITOR_SETTINGS.defaultDiagramTheme;
		saveToStorage(this.snapshot);
		return this.snapshot;
	}

	getDefaultLayoutStrategyForProfile(profile: ProfileName | null): LayoutStrategyId {
		return getSharedDefaultLayoutStrategyForProfile(profile, {
			defaultLayoutStrategyByProfile: this.defaultLayoutStrategyByProfile,
			defaultLayoutStrategy: this.defaultLayoutStrategy
		});
	}
}

export const editorSettings = new EditorSettingsState();

export function getDefaultProfileForSettings(profile: ProfileName | null): ProfileName {
	return getSharedDefaultProfileForSettings(profile) as ProfileName;
}

export function profileSupportsLayoutEngineSelection(profile: ProfileName | null): boolean {
	return profileSupportsLayoutStrategySelection(profile);
}

export function profileSupportsLayoutStrategySelection(profile: ProfileName | null): boolean {
	return profileSupportsLayoutStrategySelectionShared(profile);
}

export function getLayoutStrategyPresetForProfile(profile: ProfileName | null): LayoutStrategyId {
	return getSharedLayoutStrategyPresetForProfile(profile);
}

export function getDefaultLayoutStrategyForProfile(
	profile: ProfileName | null
): LayoutStrategyId {
	return editorSettings.getDefaultLayoutStrategyForProfile(profile);
}

export function profileSupportsDefaultCanvasModeSelection(profile: ProfileName | null): boolean {
	return profileSupportsDefaultCanvasModeSelectionShared(profile);
}
