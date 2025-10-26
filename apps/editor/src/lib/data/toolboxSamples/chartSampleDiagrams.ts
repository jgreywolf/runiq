import type { SampleCategory } from '../sample-data';

export const chartSampleDiagrams: SampleCategory[] = [
	{
		id: 'charts',
		label: 'Data Visualizations',
		samples: [
			{
				name: 'Sales Dashboard',
				description: 'Multiple chart types',
				code: `diagram "Sales Dashboard"

shape pie as @pieChart label:"Market Share" data:[35,25,40]
shape bar as @barChartVertical label:"Quarterly Sales" data:[120,150,180,200]
shape pyramid as @pyramid label:"Sales Funnel" data:[{"label":"Leads","value":1000},{"label":"Qualified","value":500},{"label":"Closed","value":150}]`
			},
			{
				name: 'Venn Diagram',
				description: 'Set relationships',
				code: `diagram "Feature Comparison"

shape venn as @venn2 label:"Products" data:[{"setA":100,"setB":80,"intersection":30,"labelA":"Product A","labelB":"Product B"}]`
			}
		]
	}
];
