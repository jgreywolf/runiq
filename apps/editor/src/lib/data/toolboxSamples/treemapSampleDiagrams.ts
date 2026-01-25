import type { SampleCategory } from '../sample-data';

export const treemapSampleDiagrams: SampleCategory[] = [
	{
		id: 'treemap',
		label: 'Treemap',
		samples: [
			{
				name: 'Product Usage',
				description: 'Hierarchical usage breakdown by segment.',
				code: `treemap "Product Usage" {
  theme ocean
  node "Core" {
    node "Auth" value: 45
    node "Billing" value: 35
    node "Analytics" value: 25
  }
  node "Add-ons" {
    node "Exports" value: 20
    node "Integrations" value: 15
    node "AI Insights" value: 10
  }
}`
			}
		]
	}
];
