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
				id: 'barChart',
				label: 'Bar Chart',
				code: 'shape id as @barChart label:"Data" data:[10,20,15]'
			},
			{
				id: 'venn',
				label: 'Venn Diagram',
				code: 'shape id as @venn label:"Sets" data:[100, 80] labels: ["Set A","Set B"]'
			},
			{
				id: 'pyramid',
				label: 'Pyramid',
				code: 'shape id as @pyramid label:"Hierarchy" data:[{"label":"Top","value":100},{"label":"Middle","value":200},{"label":"Bottom","value":300}]'
			}
		]
	}
];
