import { describe, expect, it } from 'vitest';
import {
	OSS_EXPORT_PRESET,
	OSS_HEADER_PRESET,
	OSS_CANVAS_TOOLBAR_PRESET,
	OSS_EDITOR_SHELL_CONFIG,
	OSS_TOOLBOX_PRESET,
	PREMIUM_EXPORT_PRESET,
	PREMIUM_HEADER_PRESET,
	PREMIUM_CANVAS_TOOLBAR_PRESET,
	PREMIUM_EDITOR_SHELL_CONFIG,
	PREMIUM_TOOLBOX_PRESET,
	resolveCanvasToolbarPreset
} from './editorShellConfig.js';
import { OSS_EDITOR_HOST_PRESET, PREMIUM_EDITOR_HOST_PRESET } from './editorCapabilities.js';

describe('editorShellConfig', () => {
	it('resolves oss host to viewport-only toolbar', () => {
		expect(resolveCanvasToolbarPreset(OSS_EDITOR_HOST_PRESET)).toEqual(OSS_CANVAS_TOOLBAR_PRESET);
		expect(OSS_EDITOR_SHELL_CONFIG.toolbarPreset.groups).toEqual(['viewport']);
		expect(OSS_EDITOR_SHELL_CONFIG.headerPreset).toEqual(OSS_HEADER_PRESET);
		expect(OSS_EDITOR_SHELL_CONFIG.toolboxPreset).toEqual(OSS_TOOLBOX_PRESET);
		expect(OSS_EDITOR_SHELL_CONFIG.exportPreset).toEqual(OSS_EXPORT_PRESET);
	});

	it('resolves premium host to premium toolbar', () => {
		expect(resolveCanvasToolbarPreset(PREMIUM_EDITOR_HOST_PRESET)).toEqual(
			PREMIUM_CANVAS_TOOLBAR_PRESET
		);
		expect(PREMIUM_EDITOR_SHELL_CONFIG.toolbarPreset.groups).toEqual([
			'mode',
			'insert',
			'theme',
			'export',
			'viewport'
		]);
		expect(PREMIUM_EDITOR_SHELL_CONFIG.headerPreset).toEqual(PREMIUM_HEADER_PRESET);
		expect(PREMIUM_EDITOR_SHELL_CONFIG.toolboxPreset).toEqual(PREMIUM_TOOLBOX_PRESET);
		expect(PREMIUM_EDITOR_SHELL_CONFIG.exportPreset).toEqual(PREMIUM_EXPORT_PRESET);
	});
});
