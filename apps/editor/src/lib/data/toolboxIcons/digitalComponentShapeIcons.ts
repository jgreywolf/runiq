import type { ShapeCategory } from '../toolbox-data';

export const digitalComponentShapeIcons: ShapeCategory[] = [
	{
		id: 'digitalComponents',
		label: 'Digital Components',
		profiles: ['digital'],
		shapes: [
			{
				id: 'dFlipFlop',
				label: 'D Flip-Flop',
				code: 'inst id of:DFF map:(D:D, CLK:CLK, Q:Q, QN:QN)'
			},
			{
				id: 'jkFlipFlop',
				label: 'JK Flip-Flop',
				code: 'inst id of:JKFF map:(J:J, K:K, CLK:CLK, Q:Q, QN:QN)'
			},
			{
				id: 'tFlipFlop',
				label: 'T Flip-Flop',
				code: 'inst id of:TFF map:(T:T, CLK:CLK, Q:Q, QN:QN)'
			},
			{
				id: 'register4',
				label: '4-bit Register',
				code: 'inst id of:REG4 map:(D0:D0, D1:D1, D2:D2, D3:D3, CLK:CLK, EN:EN, Q0:Q0, Q1:Q1, Q2:Q2, Q3:Q3)'
			},
			{
				id: 'register8',
				label: '8-bit Register',
				code: 'inst id of:REG8 map:(D0:D0, D1:D1, D2:D2, D3:D3, D4:D4, D5:D5, D6:D6, D7:D7, CLK:CLK, EN:EN, Q0:Q0, Q1:Q1, Q2:Q2, Q3:Q3, Q4:Q4, Q5:Q5, Q6:Q6, Q7:Q7)'
			},
			{
				id: 'mux4to1',
				label: '4-to-1 Mux',
				code: 'inst id of:MUX41 map:(D0:D0, D1:D1, D2:D2, D3:D3, S0:S0, S1:S1, Y:Y)'
			},
			{
				id: 'mux8to1',
				label: '8-to-1 Mux',
				code: 'inst id of:MUX81 map:(D0:D0, D1:D1, D2:D2, D3:D3, D4:D4, D5:D5, D6:D6, D7:D7, S0:S0, S1:S1, S2:S2, Y:Y)'
			},
			{
				id: 'decoder2to4',
				label: '2-to-4 Decoder',
				code: 'inst id of:DEC24 map:(A0:A0, A1:A1, EN:EN, Y0:Y0, Y1:Y1, Y2:Y2, Y3:Y3)'
			},
			{
				id: 'decoder3to8',
				label: '3-to-8 Decoder',
				code: 'inst id of:DEC38 map:(A0:A0, A1:A1, A2:A2, EN:EN, Y0:Y0, Y1:Y1, Y2:Y2, Y3:Y3, Y4:Y4, Y5:Y5, Y6:Y6, Y7:Y7)'
			}
		]
	}
];
