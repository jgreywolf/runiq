import type { SampleCategory } from '../sample-data';

export const pedigreeSampleDiagrams: SampleCategory[] = [
	{
		id: 'pedigree',
		label: 'Pedigree Charts',
		samples: [
			{
				name: 'Family Tree',
				description: 'Three generation family tree',
				code: `diagram "Family Tree"
direction TB

shape gf as @pedigreeMale label:"Grandfather"
shape gm as @pedigreeFemale label:"Grandmother"
shape f as @pedigreeMale label:"Father"
shape m as @pedigreeFemale label:"Mother"
shape s as @pedigreeMale label:"Son"
shape d as @pedigreeFemale label:"Daughter"

gf -> f
gm -> f
f -> s
f -> d
m -> s
m -> d`
			}
		]
	}
];
