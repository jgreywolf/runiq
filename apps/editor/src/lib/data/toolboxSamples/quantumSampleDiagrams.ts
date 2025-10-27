import type { SampleCategory } from '../sample-data';

export const quantumSampleDiagrams: SampleCategory[] = [
	{
		id: 'quantum',
		label: 'Quantum Circuits',
		samples: [
			{
				name: 'Bell State',
				description: 'Quantum entanglement circuit',
				code: `diagram "Bell State Circuit"

shape q0 as @qubitWire label:"q0"
shape q1 as @qubitWire label:"q1"
shape h as @gateH label:"H"
shape cnot as @cnotTarget label:"⊕"
shape ctrl as @controlDot label:"●"
shape m0 as @measurement label:"M"
shape m1 as @measurement label:"M"

q0 -> h
h -> ctrl
ctrl -> m0
q1 -> cnot
cnot -> m1`
			},
			{
				name: 'Quantum Teleportation',
				description: 'Simplified teleportation circuit',
				code: `diagram "Quantum Teleportation"

shape q0 as @qubitWire label:"ψ"
shape q1 as @qubitWire label:"q1"
shape q2 as @qubitWire label:"q2"
shape h as @gateH label:"H"
shape cnot1 as @cnotTarget label:"⊕"
shape cnot2 as @cnotTarget label:"⊕"
shape barrier as @barrier label:"|"
shape m as @measurement label:"M"

q0 -> h
q1 -> cnot1
h -> cnot2
barrier -> m`
			}
		]
	}
];
