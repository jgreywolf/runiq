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
				code: 'part C1 type:CYL_SA pins:(PORT_A) doc:"Single-acting cylinder"'
			},
			{
				id: 'cylDoubleActing',
				label: 'Double-Acting Cylinder',
				code: 'part C1 type:CYL_DA pins:(PORT_A,PORT_B) doc:"Double-acting cylinder"'
			},
			{
				id: 'valve32',
				label: '3/2-Way Valve',
				code: 'part V1 type:VALVE_32 pins:(SUPPLY,OUTPUT,EXHAUST) doc:"3/2-way valve"'
			},
			{
				id: 'valve52',
				label: '5/2-Way Valve',
				code: 'part V1 type:VALVE_52 pins:(SUPPLY,PORT_A,PORT_B,EXH_A,EXH_B) doc:"5/2-way valve"'
			},
			{
				id: 'airSource',
				label: 'Air Source',
				code: 'part AS type:AIR_SOURCE pins:(SUPPLY) doc:"Compressed air supply"'
			},
			{
				id: 'regulator',
				label: 'Pressure Regulator',
				code: 'part R1 type:REGULATOR pins:(INLET,OUTLET) doc:"Pressure regulator"'
			},
			{
				id: 'filterAir',
				label: 'Air Filter',
				code: 'part F1 type:FILTER pins:(INLET,OUTLET) doc:"Air filter"'
			},
			{
				id: 'lubricator',
				label: 'Lubricator',
				code: 'part L1 type:LUBRICATOR pins:(INLET,OUTLET) doc:"Air lubricator"'
			},
			{
				id: 'flowControl',
				label: 'Flow Control Valve',
				code: 'part FC1 type:FLOW_CONTROL pins:(INLET,OUTLET) doc:"Flow control"'
			},
			{
				id: 'checkValve',
				label: 'Check Valve',
				code: 'part CV1 type:CHECK_VALVE pins:(INLET,OUTLET) doc:"One-way valve"'
			},
			{
				id: 'exhaust',
				label: 'Exhaust Muffler',
				code: 'part EX1 type:EXHAUST pins:(INLET) doc:"Exhaust to atmosphere"'
			},
			{
				id: 'gaugeP',
				label: 'Pressure Gauge',
				code: 'part G1 type:GAUGE_P pins:(SENSE) doc:"Pressure gauge"'
			},
			{
				id: 'sensorProx',
				label: 'Proximity Sensor',
				code: 'part Prox1 type:SENSOR_PROX pins:(SENSOR_B0) doc:"Proximity Sensor"'
			},
			{
				id: 'sensorPress',
				label: 'Pressure Sensor',
				code: 'part press1 type:SENSOR_PRESS pins:(SENSOR_B0) doc:"Pressure Sensor"'
			}
		]
	}
];
