import { describe, expect, it } from 'vitest';
import {
	OSS_CANVAS_TOOLBAR_PRESET,
	OSS_EDITOR_SHELL_CONFIG,
	PREMIUM_CANVAS_TOOLBAR_PRESET,
	PREMIUM_EDITOR_SHELL_CONFIG,
	resolveCanvasToolbarPreset
} from './editorShellConfig.js';
import { OSS_EDITOR_HOST_PRESET, PREMIUM_EDITOR_HOST_PRESET } from './editorCapabilities.js';

describe('editorShellConfig', () => {
	it('resolves oss host to viewport-only toolbar', () => {
		expect(resolveCanvasToolbarPreset(OSS_EDITOR_HOST_PRESET)).toEqual(OSS_CANVAS_TOOLBAR_PRESET);
		expect(OSS_EDITOR_SHELL_CONFIG.toolbarPreset.groups).toEqual(['viewport']);
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
	});
});
