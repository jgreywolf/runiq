import type { ShapeCategory } from '../toolbox-data';

export const digitalSyntaxShapeIcons: ShapeCategory[] = [
	{
		id: 'digitalSyntax',
		label: 'Digital Syntax',
		profiles: ['digital'],
		shapes: [
			{ id: 'digitalModule', label: 'Module', code: 'module id ports:(clk, reset, out)' },
			{
				id: 'digitalInstance',
				label: 'Instance',
				code: 'inst id of:Module map:(clk:clk, reset:reset, out:out)'
			},
			{ id: 'digitalNet', label: 'Net', code: 'net id' },
			{ id: 'digitalBusNet', label: 'Bus Net', code: 'net bus[7:0]' }
		]
	}
];
