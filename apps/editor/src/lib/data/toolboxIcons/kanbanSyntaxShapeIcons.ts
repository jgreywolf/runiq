import type { ShapeCategory } from '../toolbox-data';

export const kanbanSyntaxShapeIcons: ShapeCategory[] = [
	{
		id: 'kanbanSyntax',
		label: 'Kanban Snippets',
		profiles: ['kanban'],
		shapes: [
			{
				id: 'kanban-board',
				label: 'Board',
				code: 'kanban "Product Board" {\n  swimlane "Q1 Focus" {\n    column backlog "Backlog" {\n      card C1 "New feature"\n    }\n  }\n}'
			},
			{
				id: 'kanban-column',
				label: 'Column',
				code: 'column progress "In Progress" wip:3 {\n  card C2 "Implement auth"\n}'
			},
			{
				id: 'kanban-card',
				label: 'Card',
				code: 'card C3 "Fix billing" priority:high tags:["backend"]'
			}
		]
	}
];
