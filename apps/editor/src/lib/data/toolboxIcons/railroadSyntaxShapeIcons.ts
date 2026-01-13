import type { ShapeCategory } from '../toolbox-data';

export const railroadSyntaxShapeIcons: ShapeCategory[] = [
	{
		id: 'railroadSyntax',
		label: 'Railroad Snippets',
		profiles: ['railroad'],
		shapes: [
			{ id: 'railroad-rule', label: 'Diagram Rule', code: 'diagram Rule = Term' },
			{ id: 'railroad-theme', label: 'Theme', code: 'theme runiq' },
			{ id: 'railroad-choice', label: 'Choice', code: 'A | B' },
			{ id: 'railroad-sequence', label: 'Sequence', code: 'A B' },
			{ id: 'railroad-optional', label: 'Optional', code: 'A?' },
			{ id: 'railroad-zero-or-more', label: 'Zero Or More', code: 'A*' },
			{ id: 'railroad-one-or-more', label: 'One Or More', code: 'A+' },
			{ id: 'railroad-group', label: 'Group', code: '(A | B)' },
			{ id: 'railroad-literal', label: 'Literal', code: '"+"' },
			{ id: 'railroad-reference', label: 'Reference', code: 'Expr' }
		]
	}
];
