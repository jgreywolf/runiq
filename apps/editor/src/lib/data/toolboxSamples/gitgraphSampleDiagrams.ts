import type { SampleCategory } from '../sample-data';

export const gitgraphSampleDiagrams: SampleCategory[] = [
	{
		id: 'gitgraph',
		label: 'GitGraph',
		samples: [
			{
				name: 'Release Flow',
				description: 'Branches, merges, and version tags.',
				code: `gitgraph "Release Flow" {
  theme runiq
  orientation vertical

  branch main label:"main" color:"#0f172a"
  branch feature label:"feature/login" parent:main color:"#2563eb"
  branch hotfix label:"hotfix/session" parent:main color:"#ef4444"

  commit c1 branch:main label:"Bootstrap repo"
  commit c2 branch:feature label:"Login form"
  commit c3 branch:feature label:"OAuth support"
  merge m1 from:feature into:main label:"Merge login" tag:"v1.0.0"

  commit c4 branch:hotfix label:"Patch session bug"
  merge m2 from:hotfix into:main label:"Merge hotfix" tag:"v1.0.1"
}`
			}
		]
	}
];
