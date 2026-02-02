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
			},
			{
				name: 'Data-Driven Usage',
				description: 'Rows mapped into a treemap hierarchy.',
				badges: ['Data'],
				code: `treemap "Data-Driven Usage" {
  datasource "json" key:usage from:"[{\"id\":\"core\",\"label\":\"Core\",\"value\":70},{\"id\":\"auth\",\"label\":\"Auth\",\"value\":40,\"parent\":\"core\"},{\"id\":\"billing\",\"label\":\"Billing\",\"value\":30,\"parent\":\"core\"},{\"id\":\"addons\",\"label\":\"Add-ons\",\"value\":30},{\"id\":\"exports\",\"label\":\"Exports\",\"value\":20,\"parent\":\"addons\"},{\"id\":\"insights\",\"label\":\"AI Insights\",\"value\":10,\"parent\":\"addons\"}]"

  data use usage
  map usage as treemap {
    id: "id"
    parentId: "parent"
    label: "label"
    value: "value"
  }
}`
			}
		]
	}
];
