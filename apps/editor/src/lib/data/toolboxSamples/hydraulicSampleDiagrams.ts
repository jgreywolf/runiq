import type { SampleCategory } from '../sample-data';

export const hydraulicSampleDiagrams: SampleCategory[] = [
	{
		id: 'hydraulic',
		label: 'Hydraulic Circuits',
		samples: [
			{
				name: 'Power Unit',
				description: 'Basic hydraulic system with pump and reservoir',
				code: `hydraulic "Hydraulic Power Unit" {
  net TANK, PUMP_OUT, PRESSURE, RELIEF, RETURN
  
  pressure 210 bar operating
  flowRate 40 L/min
  fluid mineral "ISO VG 46" temp:(10, 60, degC)
  
  part TANK_RES type:RESERVOIR pins:(TANK,RETURN) doc:"Reservoir"
  part PUMP type:PUMP_FIXED pins:(TANK,PUMP_OUT) doc:"Fixed pump"
  part MOTOR type:MOTOR_HYD pins:(PUMP_OUT) doc:"Drive motor"
  part RELIEF type:RELIEF_VALVE pins:(PUMP_OUT,RELIEF,RETURN) doc:"Relief valve 210 bar"
  part FILTER type:FILTER pins:(RETURN,TANK) doc:"Return filter"
  part GAUGE type:GAUGE_P pins:(PRESSURE) doc:"Pressure gauge"
}`
			},
			{
				name: 'Cylinder Control',
				description: 'Directional control with 4/3 valve',
				code: `hydraulic "Cylinder Position Control" {
  net PUMP, PORT_A, PORT_B, TANK
  
  pressure 160 bar operating
  flowRate 30 L/min
  fluid mineral "ISO VG 32"
  
  part VALVE type:VALVE_43 pins:(PUMP,PORT_A,PORT_B,TANK) doc:"4/3-way valve"
  part CYLINDER type:CYL_HYD pins:(PORT_A,PORT_B) doc:"Hydraulic cylinder"
  part PILOT_A type:VALVE_32 pins:(PORT_A) doc:"Extend pilot"
  part PILOT_B type:VALVE_32 pins:(PORT_B) doc:"Retract pilot"
  part BALANCE type:CHECK_VALVE pins:(PORT_A,PORT_B) doc:"Counterbalance"
  part FLOW_CTRL type:CHECK_VALVE pins:(PORT_A) doc:"Flow control"
}`
			},
			{
				name: 'Motor Control',
				description: 'Hydraulic motor with speed control',
				code: `hydraulic "Motor Control Circuit" {
  net PUMP, MOTOR_IN, MOTOR_OUT, TANK
  
  pressure 200 bar operating
  flowRate 60 L/min
  fluid mineral "ISO VG 46"
  
  part PUMP_V type:PUMP_VAR pins:(TANK,PUMP) doc:"Variable pump"
  part VALVE type:VALVE_43 pins:(PUMP,MOTOR_IN,MOTOR_OUT,TANK) doc:"Directional valve"
  part MOTOR type:MOTOR_HYD pins:(MOTOR_IN,MOTOR_OUT) doc:"Hydraulic motor"
  part FLOW type:CHECK_VALVE pins:(MOTOR_IN) doc:"Flow control"
  part RELIEF type:RELIEF_VALVE pins:(PUMP,TANK) doc:"System relief"
}`
			},
			{
				name: 'Press System',
				description: 'Hydraulic press with sequence control',
				code: `hydraulic "Hydraulic Press System" {
  net SUPPLY, FAST, SLOW, PRESS, RETURN, TANK
  
  pressure 250 bar max
  pressure 200 bar operating
  flowRate 80 L/min
  fluid mineral "ISO VG 68"
  
  part PUMP_MAIN type:PUMP_FIXED pins:(TANK,SUPPLY) doc:"Main pump"
  part VALVE_SEQ type:VALVE_43 pins:(SUPPLY,FAST,SLOW,RETURN) doc:"Sequence valve"
  part CYL_PRESS type:CYL_HYD pins:(PRESS,RETURN) doc:"Press cylinder"
  part RELIEF_SYS type:RELIEF_VALVE pins:(SUPPLY,TANK) doc:"System relief 250 bar"
  part RELIEF_PRESS type:RELIEF_VALVE pins:(PRESS,RETURN) doc:"Press relief 200 bar"
  part PRESS_SENS type:SENSOR_PRESS pins:(PRESS) doc:"Pressure sensor"
  part POS_SENS type:SENSOR_PROX pins:(PRESS) doc:"Position sensor"
}`
			}
		]
	}
];
