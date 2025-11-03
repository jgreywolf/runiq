import type { SampleCategory } from '../sample-data';

export const pneumaticSampleDiagrams: SampleCategory[] = [
	{
		id: 'pneumatic',
		label: 'Pneumatic Circuits',
		samples: [
			{
				name: 'Single-Acting Cylinder',
				description: 'Basic cylinder control with 3/2-way valve',
				code: `pneumatic "Single Cylinder Control" {
  net SUPPLY, PORT_A, EXHAUST
  
  pressure 6 bar operating
  flowRate 500 L/min
  
  part VALVE type:VALVE_3_2 pins:(SUPPLY,PORT_A,EXHAUST) doc:"3/2-way valve"
  part CYLINDER type:CYL_SA pins:(PORT_A) doc:"Single-acting cylinder"
}`
			},
			{
				name: 'Double-Acting Cylinder',
				description: 'Complete extend/retract control with 5/2-way valve',
				code: `pneumatic "Double-Acting Cylinder Circuit" {
  net SUPPLY, PORT_A, PORT_B, EXHAUST_A, EXHAUST_B
  
  pressure 6 bar operating
  flowRate 800 L/min
  
  part VALVE type:VALVE_5_2 pins:(SUPPLY,PORT_A,PORT_B,EXHAUST_A,EXHAUST_B) doc:"5/2-way valve"
  part CYLINDER type:CYL_DA pins:(PORT_A,PORT_B) doc:"Double-acting cylinder"
  part SENSOR_EXT type:SENSOR_PROX pins:(PORT_A) doc:"Extended sensor"
  part SENSOR_RET type:SENSOR_PROX pins:(PORT_B) doc:"Retracted sensor"
  part FLOW_A type:VALVE_CHECK pins:(PORT_A) doc:"Flow control A"
  part FLOW_B type:VALVE_CHECK pins:(PORT_B) doc:"Flow control B"
}`
			},
			{
				name: 'FRL Unit',
				description: 'Filter-Regulator-Lubricator air preparation',
				code: `pneumatic "FRL Air Preparation" {
  net SUPPLY, FILTERED, REGULATED, OUTPUT
  
  pressure 10 bar max
  pressure 6 bar operating
  flowRate 1000 L/min
  
  part FILTER type:FILTER pins:(SUPPLY,FILTERED) doc:"Compressed air filter"
  part REGULATOR type:REGULATOR pins:(FILTERED,REGULATED) doc:"Pressure regulator"
  part LUBRICATOR type:LUBRICATOR pins:(REGULATED,OUTPUT) doc:"Air lubricator"
  part GAUGE type:GAUGE_PRESS pins:(REGULATED) doc:"Pressure gauge"
}`
			},
			{
				name: 'Sequential Control',
				description: 'Multi-cylinder sequence control circuit',
				code: `pneumatic "Sequential Control" {
  net SUPPLY, A_EXT, A_RET, B_EXT, B_RET, EXH_A, EXH_B
  
  pressure 6 bar operating
  flowRate 600 L/min
  
  part V1 type:VALVE_5_2 pins:(SUPPLY,A_EXT,A_RET,EXH_A,EXH_A) doc:"Cylinder A valve"
  part V2 type:VALVE_5_2 pins:(SUPPLY,B_EXT,B_RET,EXH_B,EXH_B) doc:"Cylinder B valve"
  part CYL_A type:CYL_DA pins:(A_EXT,A_RET) doc:"Cylinder A"
  part CYL_B type:CYL_DA pins:(B_EXT,B_RET) doc:"Cylinder B"
  part SENS_A0 type:SENSOR_PROX pins:(A_RET) doc:"A retracted"
  part SENS_A1 type:SENSOR_PROX pins:(A_EXT) doc:"A extended"
  part SENS_B0 type:SENSOR_PROX pins:(B_RET) doc:"B retracted"
  part SENS_B1 type:SENSOR_PROX pins:(B_EXT) doc:"B extended"
}`
			}
		]
	}
];
