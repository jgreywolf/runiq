import { describe, expect, it } from 'vitest';
import { mergeWarnings, updateWarningVisibility } from './viewModel';

describe('visual-canvas viewModel', () => {
	it('merges warnings while removing duplicates and warningDetail matches', () => {
		const warningDetails = [{ message: 'detail-warning' }] as any;
		const result = mergeWarnings(warningDetails, ['diagram-warning', 'detail-warning'], ['lint-warning', 'diagram-warning']);

		expect(result).toEqual(['diagram-warning', 'lint-warning']);
	});

	it('updates warning visibility state deterministically', () => {
		expect(updateWarningVisibility(true, 2, 0)).toEqual({
			showWarnings: false,
			lastWarningCount: 0
		});
		expect(updateWarningVisibility(false, 1, 3)).toEqual({
			showWarnings: true,
			lastWarningCount: 3
		});
		expect(updateWarningVisibility(false, 3, 3)).toEqual({
			showWarnings: false,
			lastWarningCount: 3
		});
	});
});
