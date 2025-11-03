import type { ShapeCategory } from '../toolbox-data';

export const digitalComponentShapeIcons: ShapeCategory[] = [
	{
		id: 'digitalComponents',
		label: 'Digital Components',
		profiles: ['electrical', 'digital'],
		shapes: [
			{ id: 'dFlipFlop', label: 'D Flip-Flop', code: 'part id type:DFF pins:(D,CLK,Q,QB)' },
			{ id: 'jkFlipFlop', label: 'JK Flip-Flop', code: 'part id type:JKFF pins:(J,K,CLK,Q,QB)' },
			{ id: 'tFlipFlop', label: 'T Flip-Flop', code: 'part id type:TFF pins:(T,CLK,Q,QB)' },
			{
				id: 'register4',
				label: '4-bit Register',
				code: 'part id type:REG4 pins:(D0,D1,D2,D3,CLK,Q0,Q1,Q2,Q3)'
			},
			{
				id: 'register8',
				label: '8-bit Register',
				code: 'part id type:REG8 pins:(D0,D1,D2,D3,D4,D5,D6,D7,CLK,Q0,Q1,Q2,Q3,Q4,Q5,Q6,Q7)'
			},
			{
				id: 'mux4to1',
				label: '4-to-1 Mux',
				code: 'part id type:MUX4 pins:(D0,D1,D2,D3,S0,S1,Y)'
			},
			{
				id: 'mux8to1',
				label: '8-to-1 Mux',
				code: 'part id type:MUX8 pins:(D0,D1,D2,D3,D4,D5,D6,D7,S0,S1,S2,Y)'
			},
			{
				id: 'decoder2to4',
				label: '2-to-4 Decoder',
				code: 'part id type:DEC24 pins:(A0,A1,Y0,Y1,Y2,Y3)'
			},
			{
				id: 'decoder3to8',
				label: '3-to-8 Decoder',
				code: 'part id type:DEC38 pins:(A0,A1,A2,Y0,Y1,Y2,Y3,Y4,Y5,Y6,Y7)'
			}
		]
	}
];
