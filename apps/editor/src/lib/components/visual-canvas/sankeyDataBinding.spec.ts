import { describe, expect, it } from 'vitest';
import { applySankeyDataFromContent } from './sankeyDataBinding';

describe('sankeyDataBinding', () => {
	it('applies JSON data using matching node id', () => {
		const profile: any = {
			nodes: [{ id: 'flow1', shape: 'sankeyChart' }]
		};
		const warnings: string[] = [];
		applySankeyDataFromContent(
			profile,
			JSON.stringify({
				flow1: [{ source: 'A', target: 'B', value: 10 }]
			}),
			warnings
		);
		expect(profile.nodes[0].data).toEqual([{ source: 'A', target: 'B', value: 10 }]);
	});

	it('falls back to first JSON key when node id is not present', () => {
		const profile: any = {
			nodes: [{ id: 'flow2', shape: 'sankeyChart' }]
		};
		const warnings: string[] = [];
		applySankeyDataFromContent(
			profile,
			JSON.stringify({
				anyKey: [{ source: 'X', target: 'Y', value: 5 }]
			}),
			warnings
		);
		expect(profile.nodes[0].data).toEqual([{ source: 'X', target: 'Y', value: 5 }]);
	});

	it('parses CSV and assigns sankey data', () => {
		const profile: any = {
			nodes: [{ id: 'flow3', shape: 'sankeyChart' }]
		};
		const warnings: string[] = [];
		const csv = `source,target,value
A,B,7
B,C,3`;
		applySankeyDataFromContent(profile, csv, warnings);
		expect(profile.nodes[0].data).toMatchObject({
			links: [
				{ source: 'A', target: 'B', value: 7 },
				{ source: 'B', target: 'C', value: 3 }
			],
			nodes: [{ id: 'A' }, { id: 'B' }, { id: 'C' }]
		});
	});
});
