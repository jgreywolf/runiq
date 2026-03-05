import type { ShapeCategory } from '../toolbox-data';

export const wardleySyntaxShapeIcons: ShapeCategory[] = [
	{
		id: 'wardleySyntax',
		label: 'Wardley Snippets',
		profiles: ['wardley'],
		shapes: [
			{ id: 'wardley-anchor', label: 'Anchor', code: 'anchor "User Need" value:0.95' },
			{ id: 'wardley-component', label: 'Component', code: 'component "Platform" evolution:0.65 value:0.55' },
			{ id: 'wardley-dependency', label: 'Dependency', code: 'dependency from:"Visible Service" to:"Platform"' },
			{ id: 'wardley-evolve', label: 'Evolve', code: 'evolve "Platform" to evolution:0.8' }
		]
	}
];
