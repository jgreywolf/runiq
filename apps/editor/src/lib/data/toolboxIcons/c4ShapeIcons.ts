import type { ShapeCategory } from '../toolbox-data';

export const c4ShapeIcons: ShapeCategory[] = [
	{
		id: 'c4',
		label: 'C4 Architecture',
		profiles: ['diagram'],
		shapes: [
			{
				id: 'c4-person',
				label: 'Person',
				code: 'shape id as @c4-person label:"User"'
			},
			{
				id: 'c4-system',
				label: 'Software System',
				code: 'shape id as @c4-system label:"System Name"'
			},
			{
				id: 'c4-container',
				label: 'Container',
				code: 'shape id as @c4-container label:"Web App\\n[React, TypeScript]"'
			},
			{
				id: 'c4-component',
				label: 'Component',
				code: 'shape id as @c4-component label:"Controller"'
			}
		]
	}
];
