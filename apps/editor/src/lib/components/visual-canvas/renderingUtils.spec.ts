import { beforeAll, describe, expect, it } from 'vitest';
import { layoutRegistry } from '@runiq/core';
import { renderDiagram } from './renderingUtils';

describe('renderDiagram data mapping', () => {
	beforeAll(() => {
		if (!layoutRegistry.has('elk')) {
			layoutRegistry.register({
				id: 'elk',
				async layout(diagram) {
					const nodes = diagram.nodes.map((node, index) => ({
						id: node.id,
						x: 40 + index * 240,
						y: 40,
						width: 220,
						height: 140
					}));
					return {
						nodes,
						edges: [],
						size: { width: 600, height: 300 }
					};
				}
			});
		}
	});

	it('maps timeline tasks from csv datasource', async () => {
		const code = `
			timeline "Roadmap" {
				datasource "csv" key:tasks from:"id,label,startDate,endDate\\nT1,Plan,2024-01-01,2024-01-10"
				map tasks as tasks {
					id: "id"
					label: "label"
					startDate: "startDate"
					endDate: "endDate"
				}
			}
		`;
		const result = await renderDiagram(code, '', 'elk');
		expect(result.errors).toHaveLength(0);
		expect(result.profile?.tasks).toHaveLength(1);
		expect(result.profile.tasks[0].label).toBe('Plan');
		expect(result.svg).toContain('Plan');
	});

	it('maps treemap nodes from json datasource', async () => {
		const code = `
			treemap "Usage" {
				datasource "json" key:usage from:"[{\\"label\\":\\"Core\\",\\"value\\":30},{\\"label\\":\\"Edge\\",\\"value\\":20}]"
				map usage as treemap {
					label: "label"
					value: "value"
				}
			}
		`;
		const result = await renderDiagram(code, '', 'elk');
		expect(result.errors).toHaveLength(0);
		expect(result.profile?.nodes).toHaveLength(2);
		expect(result.svg).toContain('Core');
	});

	it('maps sankey data into chart nodes', async () => {
		const code = `
			diagram "Energy" {
				datasource "json" key:energy from:"{\\"nodes\\":[{\\"id\\":\\"A\\"},{\\"id\\":\\"B\\"}],\\"links\\":[{\\"source\\":\\"A\\",\\"target\\":\\"B\\",\\"value\\":5}]}"
				map energy as sankey {
					nodes: "nodes"
					links: "links"
					source: "source"
					to: "target"
					value: "value"
				}
				shape flow as @sankeyChart label:"Flow"
			}
		`;
		const result = await renderDiagram(code, '', 'elk');
		expect(result.errors).toHaveLength(0);
		const sankeyNode = result.profile?.nodes?.find((node: any) => node.id === 'flow');
		expect(sankeyNode?.data?.nodes).toHaveLength(2);
		expect(sankeyNode?.data?.links).toHaveLength(1);
	});
});
