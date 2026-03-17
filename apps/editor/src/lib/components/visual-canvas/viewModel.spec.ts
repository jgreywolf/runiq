import { describe, expect, it } from 'vitest';
import { collectSelectedIdSet, collectSelectedIds, mapStyleProperty, mergeWarnings, updateWarningVisibility } from './viewModel';

describe('visual-canvas viewModel', () => {
	it('merges warnings while removing duplicates and warningDetail matches', () => {
		const warningDetails = [{ message: 'detail-warning' }] as any;
		const result = mergeWarnings(warningDetails, ['diagram-warning', 'detail-warning'], ['lint-warning', 'diagram-warning']);

		expect(result).toEqual(['diagram-warning', 'lint-warning']);
	});

	it('collects selected ids as list and set', () => {
		const selection = {
			selectedNodeId: 'n1',
			selectedEdgeId: 'e1',
			selectedNodeIds: new Set(['n2']),
			selectedEdgeIds: new Set(['e2'])
		} as any;

		expect(collectSelectedIds(selection)).toEqual(['n1', 'e1', 'n2', 'e2']);
		expect(Array.from(collectSelectedIdSet(selection))).toEqual(['n1', 'e1', 'n2', 'e2']);
	});

	it('maps style property aliases and preserves unknown properties', () => {
		expect(mapStyleProperty('fill')).toBe('fillColor');
		expect(mapStyleProperty('stroke')).toBe('strokeColor');
		expect(mapStyleProperty('custom')).toBe('custom');
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
