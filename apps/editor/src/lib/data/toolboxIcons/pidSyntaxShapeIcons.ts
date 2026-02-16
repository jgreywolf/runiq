import type { ShapeCategory } from '../toolbox-data';

export const pidSyntaxShapeIcons: ShapeCategory[] = [
	{
		id: 'pidSyntax',
		label: 'P&ID Snippets',
		profiles: ['pid'],
		shapes: [
			{ id: 'pid-equipment', label: 'Equipment', code: 'equipment TK1 type:storageTank volume:"5000 L"' },
			{ id: 'pid-instrument', label: 'Instrument', code: 'instrument FT1 type:flowTransmitter' },
			{ id: 'pid-line', label: 'Process Line', code: 'line process from:TK1.outlet to:P1.inlet size:4 schedule:40 material:SS316' },
			{ id: 'pid-signal', label: 'Signal Line', code: 'line signal from:FT1.out to:V1.signal' }
		]
	}
];
