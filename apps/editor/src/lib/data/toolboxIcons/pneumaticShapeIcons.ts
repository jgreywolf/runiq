import type { ShapeCategory } from '../toolbox-data';

export const pneumaticShapeIcons: ShapeCategory[] = [
	{
		id: 'pneumatic',
		label: 'Pneumatic Components',
		profiles: ['pneumatic'],
		shapes: [
			{
				id: 'cylSingleActing',
				label: 'Single-Acting Cylinder',
				code: 'part C1 CYL_SA pins:(PORT_A) doc:"Single-acting cylinder"'
			},
			{
				id: 'cylDoubleActing',
				label: 'Double-Acting Cylinder',
				code: 'part C1 CYL_DA pins:(PORT_A,PORT_B) doc:"Double-acting cylinder"'
			},
			{
				id: 'valve32',
				label: '3/2-Way Valve',
				code: 'part V1 VALVE_32 pins:(SUPPLY,OUTPUT,EXHAUST) doc:"3/2-way valve"'
			},
			{
				id: 'valve52',
				label: '5/2-Way Valve',
				code: 'part V1 VALVE_52 pins:(SUPPLY,PORT_A,PORT_B,EXH_A,EXH_B) doc:"5/2-way valve"'
			},
			{
				id: 'airSource',
				label: 'Air Source',
				code: 'part AS AIR_SOURCE pins:(SUPPLY) doc:"Compressed air supply"'
			},
			{
				id: 'regulator',
				label: 'Pressure Regulator',
				code: 'part R1 REGULATOR pins:(INLET,OUTLET) doc:"Pressure regulator"'
			},
			{
				id: 'filterAir',
				label: 'Air Filter',
				code: 'part F1 FILTER pins:(INLET,OUTLET) doc:"Air filter"'
			},
			{
				id: 'lubricator',
				label: 'Lubricator',
				code: 'part L1 LUBRICATOR pins:(INLET,OUTLET) doc:"Air lubricator"'
			},
			{
				id: 'flowControl',
				label: 'Flow Control Valve',
				code: 'part FC1 FLOW_CONTROL pins:(INLET,OUTLET) doc:"Flow control"'
			},
			{
				id: 'checkValve',
				label: 'Check Valve',
				code: 'part CV1 CHECK_VALVE pins:(INLET,OUTLET) doc:"One-way valve"'
			},
			{
				id: 'exhaust',
				label: 'Exhaust Muffler',
				code: 'part EX1 EXHAUST pins:(INLET) doc:"Exhaust to atmosphere"'
			},
			{
				id: 'gaugeP',
				label: 'Pressure Gauge',
				code: 'part G1 GAUGE_P pins:(SENSE) doc:"Pressure gauge"'
			}
		]
	}
];
