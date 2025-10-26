import type { ShapeCategory } from '../toolbox-data';

export const quantumShapeIcons: ShapeCategory[] = [
	{
		id: 'quantum',
		label: 'Quantum Circuits',
		shapes: [
			{ id: 'gateX', label: 'X Gate (Pauli-X)', code: 'shape id as @gateX label:"X"' },
			{ id: 'gateY', label: 'Y Gate (Pauli-Y)', code: 'shape id as @gateY label:"Y"' },
			{ id: 'gateZ', label: 'Z Gate (Pauli-Z)', code: 'shape id as @gateZ label:"Z"' },
			{ id: 'gateH', label: 'H Gate (Hadamard)', code: 'shape id as @gateH label:"H"' },
			{ id: 'gateS', label: 'S Gate (Phase)', code: 'shape id as @gateS label:"S"' },
			{ id: 'gateT', label: 'T Gate (π/8)', code: 'shape id as @gateT label:"T"' },
			{ id: 'controlDot', label: 'Control Dot', code: 'shape id as @controlDot label:""' },
			{ id: 'cnotTarget', label: 'CNOT Target', code: 'shape id as @cnotTarget label:""' },
			{ id: 'swapX', label: 'Swap Gate', code: 'shape id as @swapX label:""' },
			{ id: 'measurement', label: 'Measurement', code: 'shape id as @measurement label:"M"' },
			{ id: 'qubitWire', label: 'Qubit Wire', code: 'shape id as @qubitWire label:""' },
			{ id: 'barrier', label: 'Barrier', code: 'shape id as @barrier label:""' }
		]
	}
];
