import type { ShapeCategory } from '../toolbox-data';

export const chartShapeIcons: ShapeCategory[] = [
	{
		id: 'charts',
		label: 'Charts & Diagrams',
		profiles: ['diagram'],
		shapes: [
			{
				id: 'lineChart',
				label: 'Line Chart',
				code: 'shape id as @lineChart label:"Trend" data:[45,52,48,61,58,67,72]'
			},
			{
				id: 'radarChart',
				label: 'Radar Chart',
				code: 'shape id as @radarChart label:"Skills" data:[85,72,90,68,78]'
			},
			{
				id: 'pieChart',
				label: 'Pie Chart',
				code: 'shape id as @pieChart label:"Sales" data:[30,20,50]'
			},
			{
				id: 'barChartVertical',
				label: 'Bar Chart (Vertical)',
				code: 'shape id as @barChartVertical label:"Data" data:[10,20,15]'
			},
			{
				id: 'barChartHorizontal',
				label: 'Bar Chart (Horizontal)',
				code: 'shape id as @barChartHorizontal label:"Data" data:[10,20,15]'
			},
			{
				id: 'venn2',
				label: 'Venn Diagram (2)',
				code: 'shape id as @venn2 label:"Sets" data:[{"setA":100},{"setB":80},{"intersection":30},{"labelA":"Set A"},{"labelB":"Set B"}]'
			},
			{
				id: 'venn3',
				label: 'Venn Diagram (3)',
				code: 'shape id as @venn3 label:"Sets" data:[{"setA":120},{"setB":100},{"setC":80},{"AB":35},{"AC":28},{"BC":22},{"ABC":15},{"labelA":"Set A"},{"labelB":"Set B"},{"labelC":"Set C"}]'
			},
			{
				id: 'venn4',
				label: 'Venn Diagram (4)',
				code: 'shape id as @venn4 label:"Sets" data:[{"setA":100},{"setB":100},{"setC":100},{"setD":100}]'
			},
			{
				id: 'pyramid',
				label: 'Pyramid',
				code: 'shape id as @pyramid label:"Hierarchy" data:[{"label":"Top","value":100},{"label":"Middle","value":200},{"label":"Bottom","value":300}]'
			}
		]
	}
];
