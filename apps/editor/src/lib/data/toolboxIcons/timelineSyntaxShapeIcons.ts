import type { ShapeCategory } from '../toolbox-data';

export const timelineSyntaxShapeIcons: ShapeCategory[] = [
	{
		id: 'timelineSyntax',
		label: 'Timeline Snippets',
		profiles: ['timeline'],
		shapes: [
			{
				id: 'timeline-title',
				label: 'Timeline Header',
				code: 'timeline "Project Timeline" {\n  event kickoff date:"2024-01-15" label:"Kickoff"\n}'
			},
			{
				id: 'timeline-event',
				label: 'Event',
				code: 'event launch date:"2024-06-01" label:"Launch"'
			},
			{
				id: 'timeline-period',
				label: 'Period',
				code: 'period planning startDate:"2024-01-15" endDate:"2024-02-28" label:"Planning"'
			},
			{
				id: 'timeline-milestone',
				label: 'Milestone',
				code: 'milestone beta date:"2024-05-01" label:"Beta"'
			}
		]
	}
];
