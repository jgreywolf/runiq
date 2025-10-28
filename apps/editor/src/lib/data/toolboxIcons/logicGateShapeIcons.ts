import type { ShapeCategory } from '../toolbox-data';

export const logicGateShapeIcons: ShapeCategory[] = [
	{
		id: 'logicGates',
		label: 'Logic Gates',
		schematicOnly: true,
		shapes: [
			{ id: 'andGate', label: 'AND (2-input)', code: 'part id type:AND pins:(A,B,Y)' },
			{ id: 'orGate', label: 'OR (2-input)', code: 'part id type:OR pins:(A,B,Y)' },
			{ id: 'notGate', label: 'NOT', code: 'part id type:NOT pins:(A,Y)' },
			{ id: 'bufferGate', label: 'Buffer', code: 'part id type:BUFFER pins:(A,Y)' },
			{ id: 'xorGate', label: 'XOR', code: 'part id type:XOR pins:(A,B,Y)' },
			{ id: 'xnorGate', label: 'XNOR', code: 'part id type:XNOR pins:(A,B,Y)' },
			{ id: 'nandGate', label: 'NAND (2-input)', code: 'part id type:NAND pins:(A,B,Y)' },
			{ id: 'norGate', label: 'NOR (2-input)', code: 'part id type:NOR pins:(A,B,Y)' },
			{ id: 'and3Gate', label: 'AND (3-input)', code: 'part id type:AND3 pins:(A,B,C,Y)' },
			{ id: 'or3Gate', label: 'OR (3-input)', code: 'part id type:OR3 pins:(A,B,C,Y)' },
			{ id: 'nand3Gate', label: 'NAND (3-input)', code: 'part id type:NAND3 pins:(A,B,C,Y)' },
			{ id: 'nor3Gate', label: 'NOR (3-input)', code: 'part id type:NOR3 pins:(A,B,C,Y)' }
		]
	}
];
