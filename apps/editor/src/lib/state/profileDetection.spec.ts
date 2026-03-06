import { describe, expect, it } from 'vitest';
import { ProfileName } from '$lib/types';
import { detectProfile } from './profileDetection';

describe('detectProfile', () => {
	it('detects timeline even with leading line comments', () => {
		const code = `// comment
// another
timeline "T" {
  event e1 date:"2024-01-01" label:"A"
}`;
		expect(detectProfile(code)).toBe(ProfileName.timeline);
	});

	it('detects timeline even with leading block comments', () => {
		const code = `/* comment block
   with multiple lines */
timeline "T" {
  event e1 date:"2024-01-01" label:"A"
}`;
		expect(detectProfile(code)).toBe(ProfileName.timeline);
	});
});

