import { describe, expect, it } from 'vitest';
import { ProfileName } from '$lib/types';
import { editorHostConfig } from './editorHostConfig';

describe('editorHostConfig', () => {
	it('uses the OSS viewport-only toolbar preset', () => {
		expect(editorHostConfig.toolbarPreset.groups).toEqual(['viewport']);
	});

	it('disables visual canvas editing capabilities for the OSS host', () => {
		const capabilities = editorHostConfig.getCapabilities(ProfileName.diagram);
		expect(capabilities.canvasSelection).toBe(true);
		expect(capabilities.visualCanvasEditing).toBe(false);
		expect(capabilities.elementToolbar).toBe(false);
	});
});
