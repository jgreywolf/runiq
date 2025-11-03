import type { ShapeCategory } from '../toolbox-data';

export const pedigreeShapeIcons: ShapeCategory[] = [
	{
		id: 'pedigree',
		label: 'Pedigree Charts',
		profiles: ['diagram'],
		shapes: [
			{ id: 'pedigreeMale', label: 'Male', code: 'shape id as @pedigreeMale label:"M"' },
			{ id: 'pedigreeFemale', label: 'Female', code: 'shape id as @pedigreeFemale label:"F"' },
			{ id: 'pedigreeUnknown', label: 'Unknown', code: 'shape id as @pedigreeUnknown label:"?"' }
		]
	}
];
