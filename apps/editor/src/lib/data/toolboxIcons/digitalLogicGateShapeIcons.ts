import type { ShapeCategory } from '../toolbox-data';

export const digitalLogicGateShapeIcons: ShapeCategory[] = [
	{
		id: 'digitalLogicGates',
		label: 'Digital Logic Gates',
		profiles: ['digital'],
		shapes: [
			{ id: 'andGate', label: 'AND Gate', code: 'inst id of:AND map:(A:A, B:B, Y:Y)' },
			{ id: 'orGate', label: 'OR Gate', code: 'inst id of:OR map:(A:A, B:B, Y:Y)' },
			{ id: 'notGate', label: 'NOT Gate', code: 'inst id of:NOT map:(A:A, Y:Y)' },
			{ id: 'xorGate', label: 'XOR Gate', code: 'inst id of:XOR map:(A:A, B:B, Y:Y)' },
			{ id: 'nandGate', label: 'NAND Gate', code: 'inst id of:NAND map:(A:A, B:B, Y:Y)' },
			{ id: 'norGate', label: 'NOR Gate', code: 'inst id of:NOR map:(A:A, B:B, Y:Y)' },
			{ id: 'xnorGate', label: 'XNOR Gate', code: 'inst id of:XNOR map:(A:A, B:B, Y:Y)' },
			{ id: 'bufferGate', label: 'Buffer', code: 'inst id of:BUFFER map:(A:A, Y:Y)' },
			{ id: 'and3Gate', label: 'AND (3-input)', code: 'inst id of:AND3 map:(A:A, B:B, C:C, Y:Y)' },
			{ id: 'or3Gate', label: 'OR (3-input)', code: 'inst id of:OR3 map:(A:A, B:B, C:C, Y:Y)' },
			{
				id: 'nand3Gate',
				label: 'NAND (3-input)',
				code: 'inst id of:NAND3 map:(A:A, B:B, C:C, Y:Y)'
			},
			{ id: 'nor3Gate', label: 'NOR (3-input)', code: 'inst id of:NOR3 map:(A:A, B:B, C:C, Y:Y)' }
		]
	}
];
