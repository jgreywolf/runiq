import type { SampleCategory } from '../sample-data';

export const logicGateSampleDiagrams: SampleCategory[] = [
	{
		id: 'logicGate',
		label: 'Logic Circuits',
		samples: [
			{
				name: 'Half Adder',
				description: 'Single-bit adder without carry-in',
				code: `electrical"Half Adder" {
  net A, B, SUM, CARRY, GND

  part XOR1 type:XOR pins:(A,B,SUM)
  part AND1 type:AND pins:(A,B,CARRY)
  part GND1 type:GND pins:(GND)
}`
			},
			{
				name: 'Full Adder',
				description: 'Single-bit adder with carry',
				code: `electrical"Full Adder" {
  net A, B, CIN, S1, C1, SUM, COUT, GND

  part XOR1 type:XOR pins:(A,B,S1)
  part XOR2 type:XOR pins:(S1,CIN,SUM)
  part AND1 type:AND pins:(A,B,C1)
  part AND2 type:AND pins:(S1,CIN,C2)
  part OR1 type:OR pins:(C1,C2,COUT)
  part GND1 type:GND pins:(GND)
}`
			},
			{
				name: 'SR Latch',
				description: 'Set-Reset latch using NOR gates',
				code: `electrical"SR Latch" {
  net S, R, Q, QB, GND

  part NOR1 type:NOR pins:(S,QB,Q)
  part NOR2 type:NOR pins:(R,Q,QB)
  part GND1 type:GND pins:(GND)
}`
			}
		]
	}
];
