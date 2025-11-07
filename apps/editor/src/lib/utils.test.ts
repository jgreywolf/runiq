/**
 * Smoke test for editor app to ensure test framework is working
 */

import { describe, it, expect } from 'vitest';

describe('Editor App - Smoke Test', () => {
	it('should have a working test environment', () => {
		expect(true).toBe(true);
	});

	it('should be able to perform basic assertions', () => {
		const value = 'runiq-editor';
		expect(value).toBeDefined();
		expect(value).toBe('runiq-editor');
	});
});
