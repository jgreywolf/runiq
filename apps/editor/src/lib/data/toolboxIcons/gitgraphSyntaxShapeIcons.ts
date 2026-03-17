import type { ShapeCategory } from '../toolbox-data';

export const gitgraphSyntaxShapeIcons: ShapeCategory[] = [
	{
		id: 'gitgraphSyntax',
		label: 'GitGraph Snippets',
		profiles: ['gitgraph'],
		shapes: [
			{
				id: 'gitgraph-branch',
				label: 'Branch',
				code: 'branch feature label:"feature/login" parent:main color:"#2563eb"'
			},
			{
				id: 'gitgraph-commit',
				label: 'Commit',
				code: 'commit c1 branch:main label:"Bootstrap repo"'
			},
			{
				id: 'gitgraph-merge',
				label: 'Merge',
				code: 'merge m1 from:feature into:main label:"Merge login" tag:"v1.0.0"'
			},
			{
				id: 'gitgraph-skeleton',
				label: 'Graph Header',
				code: 'gitgraph "Release Flow" {\n  branch main label:"main"\n  commit c1 branch:main label:"Init"\n}'
			}
		]
	}
];
