import type { ShapeCategory } from '../toolbox-data';

export const chartShapeIcons: ShapeCategory[] = [
	{
		id: 'charts',
		label: 'Charts',
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
				id: 'ringChart',
				label: 'Ring Chart',
				code: 'shape id as @ringChart label:"Revenue Mix" data:[42,38,20] labels:["Services","Subscriptions","Support"]'
			},
			{
				id: 'barChart',
				label: 'Bar Chart',
				code: 'shape id as @barChart label:"Data" data:[10,20,15]'
			},
			{
				id: 'scatterChart',
				label: 'Scatter Chart',
				code: 'shape id as @scatterChart label:"Cost vs Latency" data:[{"x":20,"y":120,"label":"A"},{"x":55,"y":60,"label":"B"},{"x":80,"y":210,"label":"C"}] showPointLabels:true'
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
