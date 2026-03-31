import type { ShapeCategory } from '../toolbox-data';

export const pedigreeSyntaxShapeIcons: ShapeCategory[] = [
	{
		id: 'pedigreeSyntax',
		label: 'Pedigree Snippets',
		profiles: ['pedigree'],
		shapes: [
			{
				id: 'pedigree-people',
				label: 'People Block',
				code: 'people {\n  p1 "Alex Rivera" dob:"1970-01-10" sex:male\n  p2 "Jordan Lee" dob:"1972-05-22" sex:female\n}'
			},
			{
				id: 'pedigree-family',
				label: 'Family',
				code: 'families {\n  p1 + p2 date:"1995-06-12" -> c1, c2\n}'
			},
			{
				id: 'pedigree-modifier',
				label: 'Adopt/Step',
				code: 'families {\n  p1 + p2 -> c1 adopt, c2 step\n}'
			}
		]
	}
];
