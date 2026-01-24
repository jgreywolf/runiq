import type { ShapeCategory } from '../toolbox-data';

export const controlShapeIcons: ShapeCategory[] = [
	{
		id: 'controlLadder',
		label: 'Ladder Logic',
		profiles: ['control'],
		shapes: [
			{
				id: 'control-no-contact',
				label: 'NO Contact',
				code: 'part X1 type:NO_CONTACT pins:(L1,M1)'
			},
			{
				id: 'control-nc-contact',
				label: 'NC Contact',
				code: 'part X2 type:NC_CONTACT pins:(M1,M2)'
			},
			{
				id: 'control-coil',
				label: 'Coil',
				code: 'part Y1 type:COIL pins:(M2,L2)'
			},
			{
				id: 'control-set-coil',
				label: 'Set Coil',
				code: 'part S1 type:SET_COIL pins:(M2,L2)'
			},
			{
				id: 'control-reset-coil',
				label: 'Reset Coil',
				code: 'part R1 type:RESET_COIL pins:(M2,L2)'
			},
			{
				id: 'control-timer-on',
				label: 'Timer On (TON)',
				code: 'part T1 type:TIMER_ON pins:(M2,L2) preset:500'
			}
		]
	}
];
