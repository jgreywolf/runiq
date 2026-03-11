import { describe, expect, it } from 'vitest';
import { repairMojibake } from './encoding';

describe('repairMojibake', () => {
	it('keeps normal ASCII unchanged', () => {
		expect(repairMojibake('hello')).toBe('hello');
	});

	it('repairs mojibake glyph strings', () => {
		expect(repairMojibake('\u00C3\u00A9')).toBe('é');
	});
});
