import type { ShapeCategory } from '../toolbox-data';

export const storageShapeIcons: ShapeCategory[] = [
	{
		id: 'storage',
		label: 'Data Storage',
		shapes: [
			{ id: 'cylinder', label: 'Database', code: 'shape id as @cylinder label:"Database"' },
			{
				id: 'hCylinder',
				label: 'Horizontal Cylinder',
				code: 'shape id as @hCylinder label:"Storage"'
			},
			{ id: 'diskStorage', label: 'Disk Storage', code: 'shape id as @diskStorage label:"Disk"' },
			{ id: 'storedData', label: 'Stored Data', code: 'shape id as @storedData label:"Data"' },
			{
				id: 'internalStorage',
				label: 'Internal Storage',
				code: 'shape id as @internalStorage label:"Storage"'
			},
			{
				id: 'sequentialStorage',
				label: 'Sequential Storage',
				code: 'shape id as @sequentialStorage label:"Tape"'
			},
			{
				id: 'directStorage',
				label: 'Direct Storage',
				code: 'shape id as @directStorage label:"Direct"'
			}
		]
	}
];
