import type { ShapeCategory } from '../toolbox-data';

export const c4ShapeIcons: ShapeCategory[] = [
	{
		id: 'c4',
		label: 'C4 Architecture',
		profiles: ['diagram'],
		shapes: [
			{
				id: 'c4Person',
				label: 'Person',
				code: 'shape id as @c4Person label:"User"'
			},
			{
				id: 'c4System',
				label: 'Software System',
				code: 'shape id as @c4System label:"System Name"'
			},
			{
				id: 'c4Container',
				label: 'Container',
				code: 'shape id as @c4Container label:"Web App\\n[React, TypeScript]"'
			},
			{
				id: 'c4Component',
				label: 'Component',
				code: 'shape id as @c4Component label:"Controller"'
			}
		]
	}
];
