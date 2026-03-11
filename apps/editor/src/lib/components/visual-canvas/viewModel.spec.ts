import { describe, expect, it } from 'vitest';
import {
	collectSelectedIdSet,
	collectSelectedIds,
	extractSelectedElementStyles,
	mapStyleProperty,
	mergeWarnings,
	updateWarningVisibility
} from './viewModel';

describe('visual-canvas viewModel', () => {
	it('merges warnings while removing duplicates and warningDetail matches', () => {
		const warningDetails = [{ message: 'detail-warning' }] as any;
		const result = mergeWarnings(
			warningDetails,
			['diagram-warning', 'detail-warning'],
			['lint-warning', 'diagram-warning']
		);

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
		expect(updateWarningVisibility(true, 2, 0)).toEqual({ showWarnings: false, lastWarningCount: 0 });
		expect(updateWarningVisibility(false, 1, 3)).toEqual({ showWarnings: true, lastWarningCount: 3 });
		expect(updateWarningVisibility(false, 3, 3)).toEqual({ showWarnings: false, lastWarningCount: 3 });
	});

	it('extracts node styles from style ref + inline data with inline precedence', () => {
		const profile = {
			styles: {
				shared: {
					fillColor: '#111111',
					strokeColor: '#222222',
					textColor: '#333333',
					strokeWidth: 3,
					fontSize: 12,
					fontFamily: 'serif'
				}
			},
			nodes: [
				{
					id: 'n1',
					style: 'shared',
					data: {
						fillColor: '#abcdef',
						fontSize: 16
					},
					icon: { provider: 'brand', name: 'aws' }
				}
			]
		};

		const styles = extractSelectedElementStyles(profile, 'n1') as any;
		expect(styles.fill).toBe('#abcdef');
		expect(styles.stroke).toBe('#222222');
		expect(styles.text).toBe('#333333');
		expect(styles.fontSize).toBe(16);
		expect(styles.fontFamily).toBe('serif');
		expect(styles.icon).toBe('brand/aws');
	});

	it('extracts edge styles from style ref + inline edge fields', () => {
		const profile = {
			styles: {
				edgeStyle: {
					strokeColor: '#0088cc',
					strokeWidth: 2,
					lineStyle: 'dashed'
				}
			},
			edges: [
				{
					from: 'a',
					to: 'b',
					style: 'edgeStyle',
					strokeWidth: 5
				}
			]
		};

		const styles = extractSelectedElementStyles(profile, 'a-b') as any;
		expect(styles.stroke).toBe('#0088cc');
		expect(styles.strokeWidth).toBe(5);
		expect(styles.lineStyle).toBe('dashed');
	});
});
