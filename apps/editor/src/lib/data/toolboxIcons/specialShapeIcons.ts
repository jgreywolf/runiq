import type { ShapeCategory } from '../toolbox-data';

export const specialShapeIcons: ShapeCategory[] = [
	{
		id: 'special',
		label: 'Special',
		profiles: ['diagram'],
		shapes: [
			{ id: 'textBlock', label: 'Text Block', code: 'shape id as @textBlock label:"Note"' },
			{ id: 'braceLeft', label: 'Brace Left', code: 'shape id as @braceLeft label:""' },
			{ id: 'braceRight', label: 'Brace Right', code: 'shape id as @braceRight label:""' },
			{ id: 'lightning', label: 'Lightning Bolt', code: 'shape id as @lightning label:""' },
			{ id: 'hourglass', label: 'Hourglass', code: 'shape id as @hourglass label:""' },
			{ id: 'fork', label: 'Fork/Join', code: 'shape id as @fork label:""' },
			{ id: 'or', label: 'OR Symbol', code: 'shape id as @or label:""' }
		]
	}
];
