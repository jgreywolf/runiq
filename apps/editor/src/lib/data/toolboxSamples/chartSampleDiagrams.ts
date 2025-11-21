import type { SampleCategory } from '../sample-data';

export const chartSampleDiagrams: SampleCategory[] = [
	{
		id: 'charts',
		label: 'Data Visualizations',
		samples: [
			{
				name: 'Sales Dashboard',
				description: 'Multiple chart types',
				code: `diagram "Sales Dashboard" {
shape pieChart as @pieChart label:"Market Share" data:[35,25,40]
shape barVert as @barChart label:"Quarterly Sales" data:[120,150,180,200]
shape pyramid as @pyramid label:"Sales Funnel" data:[{"label":"Leads","value":1000},{"label":"Qualified","value":500},{"label":"Closed","value":150}]
}`
			},
			{
				name: 'Monthly Sales Trend',
				description: 'Line chart with data from Data tab',
				code: `diagram "Monthly Sales Trend" {
  shape trend as @lineChart label:"Monthly Sales (2024)"
}`,
				data: JSON.stringify(
					{
						monthlySales: [
							{ month: 'Jan', sales: 45000 },
							{ month: 'Feb', sales: 52000 },
							{ month: 'Mar', sales: 48000 },
							{ month: 'Apr', sales: 61000 },
							{ month: 'May', sales: 58000 },
							{ month: 'Jun', sales: 65000 },
							{ month: 'Jul', sales: 72000 },
							{ month: 'Aug', sales: 68000 },
							{ month: 'Sep', sales: 75000 },
							{ month: 'Oct', sales: 80000 },
							{ month: 'Nov', sales: 78000 },
							{ month: 'Dec', sales: 85000 }
						]
					},
					null,
					2
				)
			},
			{
				name: 'Team Skills Assessment',
				description: 'Radar chart with skills data',
				code: `diagram "Team Skills Assessment" {
  shape skills as @radarChart label:"Development Team Skills"
}`,
				data: JSON.stringify(
					{
						teamSkills: [
							{ skill: 'Frontend', level: 85 },
							{ skill: 'Backend', level: 90 },
							{ skill: 'Database', level: 75 },
							{ skill: 'DevOps', level: 70 },
							{ skill: 'Testing', level: 80 }
						]
					},
					null,
					2
				)
			},
			{
				name: 'Product Quality Metrics',
				description: 'Multiple radar charts with CSV data',
				code: `diagram "Product Quality Comparison" {
  shape productA as @radarChart label:"Product A"
  shape productB as @radarChart label:"Product B"
  
  productA -> productB label:"comparison"
}`,
				data: `metric,productA,productB
Performance,85,90
Reliability,92,88
Usability,78,82
Features,88,85
Support,95,90
Value,82,87`
			},
			{
				name: 'Venn Diagram',
				description: 'Set relationships',
				code: `diagram "Skills Overlap" {
  shape skills as @venn
    label:"Programming vs Design"
    data:[1, 1]
    labels:["Frontend", "Backend"]
    colors:["#4299e1", "#48bb78"]
}`
			}
		]
	}
];
