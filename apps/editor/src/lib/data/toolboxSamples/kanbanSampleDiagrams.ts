import type { SampleCategory } from '../sample-data';

export const kanbanSampleDiagrams: SampleCategory[] = [
	{
		id: 'kanban',
		label: 'Kanban Boards',
		samples: [
			{
				name: 'Product Roadmap',
				description: 'Swimlane board with WIP limits and tags.',
				code: `kanban "Product Roadmap" {
  theme runiq
  swimlane "Q1 Focus" {
    column backlog "Backlog" wip:6 {
      card K1 "Customer interviews" priority:high tags:["research"]
      card K2 "Design refresh" priority:medium tags:["design"]
    }
    column progress "In Progress" wip:3 {
      card K3 "Mobile onboarding" priority:high assignee:"Avery" estimate:"5d"
      card K4 "Billing optimizations" priority:medium assignee:"Noah"
    }
    column review "Review" wip:2 {
      card K5 "New pricing page" priority:medium tags:["marketing"]
    }
    column completed "Done" {
      card K6 "Stability sprint" priority:low
    }
  }
}`
			}
		]
	}
];
