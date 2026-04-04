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
			},
			{
				id: 'control-timer-off',
				label: 'Timer Off (TOF)',
				code: 'part T2 type:TIMER_OFF pins:(M2,L2) preset:500'
			},
			{
				id: 'control-counter-up',
				label: 'Counter Up (CTU)',
				code: 'part C1 type:COUNTER_UP pins:(M2,L2) preset:10'
			},
			{
				id: 'control-counter-down',
				label: 'Counter Down (CTD)',
				code: 'part C2 type:COUNTER_DOWN pins:(M2,L2) preset:10'
			}
		]
	}
];
