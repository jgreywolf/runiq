import type { SampleCategory } from '../sample-data';

export const quantumSampleDiagrams: SampleCategory[] = [
	{
		id: 'quantum',
		label: 'Quantum Circuits',
		samples: [
			{
				name: 'Bell State',
				description: 'Quantum entanglement circuit',
				code: `diagram "Bell State Circuit" {
  direction LR
  
  shape q0 as @qubitWire label: "q0"
  shape q1 as @qubitWire label: "q1"
  shape h as @gateH label: "H" fillColor: "#e8f5e9" strokeColor: "#000"
  shape cnot as @cnotTarget label: "⊕" fillColor: "#fff" strokeColor: "#000"
  shape ctrl as @controlDot label: "●" fillColor: "#000" strokeColor: "#000"
  shape m0 as @measurement label: "M" fillColor: "#e3f2fd" strokeColor: "#000"
  shape m1 as @measurement label: "M" fillColor: "#e3f2fd" strokeColor: "#000"

  q0 -> h -> ctrl -> m0
  q1 -> cnot -> m1
  ctrl -> cnot
}`
			},
			{
				name: 'Quantum Teleportation',
				description: 'Simplified teleportation circuit',
				code: `diagram "Quantum Teleportation" {
  direction LR
  
  shape q0 as @qubitWire label: "ψ"
  shape q1 as @qubitWire label: "q1"
  shape q2 as @qubitWire label: "q2"
  shape h as @gateH label: "H" fillColor: "#e8f5e9" strokeColor: "#000"
  shape cnot1 as @cnotTarget label: "⊕" fillColor: "#fff" strokeColor: "#000"
  shape cnot2 as @cnotTarget label: "⊕" fillColor: "#fff" strokeColor: "#000"
  shape barrier as @barrier label: "|"
  shape m as @measurement label: "M" fillColor: "#e3f2fd" strokeColor: "#000"

  q0 -> h -> cnot2
  q1 -> cnot1
  q2 -> barrier -> m
}`
			}
		]
	}
];
