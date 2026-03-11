import { beforeAll, describe, expect, it } from 'vitest';
import { layoutRegistry } from '@runiq/core';
import { renderDiagram, updateElementStyles } from './renderingUtils';

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

describe('updateElementStyles aliases', () => {
	function createFakeElementHarness() {
		const mainAttrs: Record<string, string> = {};
		const textAttrs: Record<string, string>[] = [{}, {}];
		const mainElement = {
			setAttribute: (name: string, value: string) => {
				mainAttrs[name] = value;
			}
		};
		const textElements = textAttrs.map((attrs) => ({
			setAttribute: (name: string, value: string) => {
				attrs[name] = value;
			}
		}));
		const targetElement = {
			querySelector: () => mainElement,
			querySelectorAll: () => textElements
		};
		const svgElement = {
			querySelector: () => targetElement,
			querySelectorAll: () => []
		};
		const svgContainer = {
			querySelector: (selector: string) => (selector === 'svg' ? svgElement : null)
		};
		return { svgContainer, mainAttrs, textAttrs };
	}

	it('supports canonical style keys (fill/stroke/color)', () => {
		const { svgContainer, mainAttrs, textAttrs } = createFakeElementHarness();
		updateElementStyles(svgContainer as any, 'n1', true, {
			fill: '#111111',
			stroke: '#222222',
			color: '#333333',
			strokeWidth: '4'
		});

		expect(mainAttrs.fill).toBe('#111111');
		expect(mainAttrs.stroke).toBe('#222222');
		expect(mainAttrs['stroke-width']).toBe('4');
		expect(textAttrs[0].fill).toBe('#333333');
		expect(textAttrs[1].fill).toBe('#333333');
	});

	it('prefers alias keys when both alias and canonical are provided', () => {
		const { svgContainer, mainAttrs, textAttrs } = createFakeElementHarness();
		updateElementStyles(svgContainer as any, 'n1', true, {
			fill: '#111111',
			fillColor: '#aaaaaa',
			stroke: '#222222',
			strokeColor: '#bbbbbb',
			color: '#333333',
			textColor: '#cccccc'
		});

		expect(mainAttrs.fill).toBe('#aaaaaa');
		expect(mainAttrs.stroke).toBe('#bbbbbb');
		expect(textAttrs[0].fill).toBe('#cccccc');
	});
});
