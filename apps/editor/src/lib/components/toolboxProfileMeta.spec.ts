import { describe, expect, it } from 'vitest';
import { ProfileName } from '$lib/types';
import { getToolboxProfileMeta } from './toolboxProfileMeta';

describe('toolboxProfileMeta', () => {
	it('returns sample-only mode for wardley profile', () => {
		const meta = getToolboxProfileMeta(ProfileName.wardley);
		expect(meta.contentMode).toBe('samples-only');
		expect(meta.footerHint).toContain('Sample');
	});

	it('returns shape mode for diagram profile', () => {
		const meta = getToolboxProfileMeta(ProfileName.diagram);
		expect(meta.contentMode).toBe('shapes');
		expect(meta.label).toContain('Diagram');
	});

	it('returns fallback metadata for null profile', () => {
		const meta = getToolboxProfileMeta(null);
		expect(meta.label).toBe('No diagram detected');
		expect(meta.contentMode).toBe('shapes');
	});
});
