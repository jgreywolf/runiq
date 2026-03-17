import { describe, expect, it } from 'vitest';
import {
	DEFAULT_EDITOR_SETTINGS,
	EditorProfileName,
	getDefaultLayoutStrategyForProfile,
	getLayoutStrategyPresetForProfile,
	normalizeEditorSettings,
	profileSupportsDefaultCanvasModeSelection,
	profileSupportsLayoutStrategySelection
} from './editorSettings.js';

describe('editorSettings helpers', () => {
	it('normalizes incomplete settings with defaults', () => {
		const normalized = normalizeEditorSettings({
			enableVisualCanvasEditing: true,
			defaultLayoutStrategy: 'adaptive',
			defaultLayoutStrategyByProfile: {
				[EditorProfileName.diagram]: 'force',
				invalid: 'tree'
			}
		});

		expect(normalized.autosaveEnabled).toBe(DEFAULT_EDITOR_SETTINGS.autosaveEnabled);
		expect(normalized.enableVisualCanvasEditing).toBe(true);
		expect(normalized.defaultLayoutStrategy).toBe('adaptive');
		expect(normalized.defaultLayoutStrategyByProfile[EditorProfileName.diagram]).toBe('force');
	});

	it('resolves per-profile layout strategies with preset fallback', () => {
		expect(
			getDefaultLayoutStrategyForProfile(EditorProfileName.diagram, {
				defaultLayoutStrategyByProfile: {
					[EditorProfileName.diagram]: 'force'
				},
				defaultLayoutStrategy: 'hierarchical'
			})
		).toBe('force');

		expect(getLayoutStrategyPresetForProfile(EditorProfileName.sequence)).toBe('hierarchical');
	});

	it('reports profile-specific settings support', () => {
		expect(profileSupportsLayoutStrategySelection(EditorProfileName.diagram)).toBe(true);
		expect(profileSupportsLayoutStrategySelection(EditorProfileName.timeline)).toBe(false);
		expect(profileSupportsDefaultCanvasModeSelection(EditorProfileName.glyphset)).toBe(false);
		expect(profileSupportsDefaultCanvasModeSelection(EditorProfileName.diagram)).toBe(true);
	});
});
