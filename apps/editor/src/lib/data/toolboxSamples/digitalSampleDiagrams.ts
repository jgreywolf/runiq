import type { SampleCategory } from '../sample-data';

export const digitalSampleDiagrams: SampleCategory[] = [
	{
		id: 'digital',
		label: 'Digital Systems',
		samples: [
			{
				name: '4-bit Counter',
				description: 'Synchronous 4-bit counter',
				code: `electrical"4-bit Counter" {
  net CLK, Q0, Q1, Q2, Q3, GND

  part FF0 type:DFF pins:(Q3,CLK,Q0,QB0)
  part FF1 type:DFF pins:(Q0,CLK,Q1,QB1)
  part FF2 type:DFF pins:(Q1,CLK,Q2,QB2)
  part FF3 type:DFF pins:(Q2,CLK,Q3,QB3)
  part GND1 type:GND pins:(GND)
}`
			},
			{
				name: '2-to-4 Decoder',
				description: 'Address decoder circuit',
				code: `electrical"2-to-4 Decoder" {
  net A0, A1, Y0, Y1, Y2, Y3, GND

  part DEC1 type:DEC24 pins:(A0,A1,Y0,Y1,Y2,Y3)
  part GND1 type:GND pins:(GND)
}`
			},
			{
				name: '4-to-1 Multiplexer',
				description: 'Data selector circuit',
				code: `electrical"4-to-1 Multiplexer" {
  net D0, D1, D2, D3, S0, S1, Y, GND

  part MUX1 type:MUX4 pins:(D0,D1,D2,D3,S0,S1,Y)
  part GND1 type:GND pins:(GND)
}`
			}
		]
	}
];
