import type { SampleCategory } from '../sample-data';

export const digitalSampleDiagrams: SampleCategory[] = [
	{
		id: 'digital',
		label: 'Digital Systems',
		samples: [
			{
				name: '4-bit Counter',
				description: 'Synchronous 4-bit counter',
				code: `digital "4-bit Counter" {
  net CLK, T, Q0, Q1, Q2, Q3, QB0, QB1, QB2, QB3

  inst FF0 of:TFF map:(T:T, CLK:CLK, Q:Q0, QN:QB0)
  inst FF1 of:TFF map:(T:T, CLK:Q0, Q:Q1, QN:QB1)
  inst FF2 of:TFF map:(T:T, CLK:Q1, Q:Q2, QN:QB2)
  inst FF3 of:TFF map:(T:T, CLK:Q2, Q:Q3, QN:QB3)
}`
			},
			{
				name: '2-to-4 Decoder',
				description: 'Address decoder circuit',
				code: `digital "2-to-4 Decoder" {
  net A0, A1, EN, Y0, Y1, Y2, Y3

  inst DEC1 of:DEC24 map:(A0:A0, A1:A1, EN:EN, Y0:Y0, Y1:Y1, Y2:Y2, Y3:Y3)
}`
			},
			{
				name: '4-to-1 Multiplexer',
				description: 'Data selector circuit',
				code: `digital "4-to-1 Multiplexer" {
  net D0, D1, D2, D3, S0, S1, Y

  inst MUX1 of:MUX41 map:(D0:D0, D1:D1, D2:D2, D3:D3, S0:S0, S1:S1, Y:Y)
}`
			}
		]
	}
];
