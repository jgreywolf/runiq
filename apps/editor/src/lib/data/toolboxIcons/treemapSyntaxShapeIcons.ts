import type { ShapeCategory } from '../toolbox-data';

export const treemapSyntaxShapeIcons: ShapeCategory[] = [
	{
		id: 'treemapSyntax',
		label: 'Treemap Snippets',
		profiles: ['treemap'],
		shapes: [
			{ id: 'treemap-header', label: 'Treemap Header', code: 'treemap "Product Usage" {\n  layout slice-dice\n  padding 10\n  gap 6\n}' },
			{ id: 'treemap-group', label: 'Group', code: 'group "North America" value:60 color:"#bfdbfe" {\n  item "Enterprise" value:40\n  item "SMB" value:20\n}' },
			{ id: 'treemap-item', label: 'Item', code: 'item "Enterprise" value:40' }
		]
	}
];
