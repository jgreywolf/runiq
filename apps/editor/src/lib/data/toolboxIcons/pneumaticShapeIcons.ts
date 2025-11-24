import type { ShapeCategory } from '../toolbox-data';

export const pneumaticShapeIcons: ShapeCategory[] = [
	{
		id: 'pneumatic-valves',
		label: 'Pneumatic Valves',
		profiles: ['pneumatic'],
		shapes: [
			{
				id: 'valve22',
				label: '2/2-Way Valve',
				code: 'part V1 type:VALVE_22_P pins:(P,A) doc:"2/2-way valve"'
			},
			{
				id: 'valve32',
				label: '3/2-Way Valve',
				code: 'part V1 type:VALVE_32 pins:(P,A,R) doc:"3/2-way valve"'
			},
			{
				id: 'valve42',
				label: '4/2-Way Valve',
				code: 'part V1 type:VALVE_42_P pins:(P,A,B,R) doc:"4/2-way valve"'
			},
			{
				id: 'valve52',
				label: '5/2-Way Valve',
				code: 'part V1 type:VALVE_52 pins:(P,A,B,R,S) doc:"5/2-way valve"'
			},
			{
				id: 'valve53Closed',
				label: '5/3 Closed Center',
				code: 'part V1 type:VALVE_53_CLOSED pins:(P,A,B,R,S) doc:"5/3-way closed center"'
			},
			{
				id: 'valve53Exhaust',
				label: '5/3 Exhaust Center',
				code: 'part V1 type:VALVE_53_EXHAUST pins:(P,A,B,R,S) doc:"5/3-way exhaust center"'
			},
			{
				id: 'valve53Pressure',
				label: '5/3 Pressure Center',
				code: 'part V1 type:VALVE_53_PRESSURE pins:(P,A,B,R,S) doc:"5/3-way pressure center"'
			}
		]
	},
	{
		id: 'pneumatic-actuators',
		label: 'Pneumatic Actuators',
		profiles: ['pneumatic'],
		shapes: [
			{
				id: 'cylSingleActing',
				label: 'Single-Acting Cylinder',
				code: 'part C1 type:CYL_SA pins:(piston,port_A,exhaust) doc:"Single-acting cylinder"'
			},
			{
				id: 'cylDoubleActing',
				label: 'Double-Acting Cylinder',
				code: 'part C1 type:CYL_DA pins:(piston,port_A,port_B) doc:"Double-acting cylinder"'
			},
			{
				id: 'cylRodless',
				label: 'Rodless Cylinder',
				code: 'part C1 type:CYL_RODLESS pins:(carriage,port_A,port_B) doc:"Rodless cylinder"'
			},
			{
				id: 'cylTelescopic',
				label: 'Telescopic Cylinder',
				code: 'part C1 type:CYL_TELESCOPIC_P pins:(rod,port_A,port_B) doc:"Telescopic cylinder"'
			},
			{
				id: 'rotaryActuator',
				label: 'Rotary Actuator',
				code: 'part RA1 type:ROTARY_ACTUATOR pins:(shaft,port_A,port_B) doc:"Rotary actuator"'
			},
			{
				id: 'motorPneumatic',
				label: 'Pneumatic Motor',
				code: 'part M1 type:MOTOR_PNEUMATIC pins:(shaft,inlet,exhaust) doc:"Pneumatic motor"'
			},
			{
				id: 'gripperParallel',
				label: 'Parallel Gripper',
				code: 'part G1 type:GRIPPER_PARALLEL pins:(jaw_A,jaw_B,port_open,port_close) doc:"Parallel jaw gripper"'
			},
			{
				id: 'gripperAngular',
				label: 'Angular Gripper',
				code: 'part G1 type:GRIPPER_ANGULAR pins:(jaw_A,jaw_B,port_open,port_close) doc:"Angular gripper"'
			},
			{
				id: 'gripperVacuum',
				label: 'Vacuum Gripper',
				code: 'part G1 type:GRIPPER_VACUUM pins:(vacuum_port) doc:"Vacuum gripper"'
			}
		]
	},
	{
		id: 'pneumatic-accessories',
		label: 'Air Prep & Control',
		profiles: ['pneumatic'],
		shapes: [
			{
				id: 'airSource',
				label: 'Air Source',
				code: 'part AS type:AIR_SOURCE pins:(out) doc:"Compressed air supply"'
			},
			{
				id: 'regulator',
				label: 'Pressure Regulator',
				code: 'part R1 type:REGULATOR pins:(IN,OUT) doc:"Pressure regulator"'
			},
			{
				id: 'filterAir',
				label: 'Air Filter',
				code: 'part F1 type:FILTER pins:(IN,OUT) doc:"Air filter"'
			},
			{
				id: 'lubricator',
				label: 'Lubricator',
				code: 'part L1 type:LUBRICATOR pins:(IN,OUT) doc:"Air lubricator"'
			},
			{
				id: 'frlUnit',
				label: 'FRL Unit',
				code: 'part FRL1 type:FRL pins:(IN,OUT,DRAIN) doc:"Filter-Regulator-Lubricator unit"'
			},
			{
				id: 'airDryer',
				label: 'Air Dryer',
				code: 'part AD1 type:AIR_DRYER pins:(IN,OUT,DRAIN) doc:"Air dryer"'
			},
			{
				id: 'compressor',
				label: 'Compressor',
				code: 'part COMP1 type:COMPRESSOR pins:(out) doc:"Air compressor"'
			},
			{
				id: 'flowControl',
				label: 'Flow Control Valve',
				code: 'part FC1 type:FLOW_CONTROL pins:(IN,OUT) doc:"Flow control"'
			},
			{
				id: 'checkValve',
				label: 'Check Valve',
				code: 'part CV1 type:CHECK_VALVE pins:(IN,OUT) doc:"One-way valve"'
			},
			{
				id: 'throttle',
				label: 'Throttle Valve',
				code: 'part TV1 type:THROTTLE pins:(IN,OUT) doc:"Throttle valve"'
			},
			{
				id: 'quickExhaust',
				label: 'Quick Exhaust',
				code: 'part QE1 type:QUICK_EXHAUST pins:(SUPPLY,OUTPUT,EXHAUST) doc:"Quick exhaust valve"'
			},
			{
				id: 'exhaust',
				label: 'Exhaust Port',
				code: 'part EX1 type:EXHAUST pins:(IN) doc:"Exhaust to atmosphere"'
			},
			{
				id: 'muffler',
				label: 'Muffler',
				code: 'part MF1 type:MUFFLER pins:(IN) doc:"Exhaust muffler"'
			}
		]
	},
	{
		id: 'pneumatic-sensors',
		label: 'Sensors & Gauges',
		profiles: ['pneumatic'],
		shapes: [
			{
				id: 'gaugeP',
				label: 'Pressure Gauge',
				code: 'part G1 type:GAUGE_P pins:(SENSE) doc:"Pressure gauge"'
			},
			{
				id: 'sensorProx',
				label: 'Proximity Sensor',
				code: 'part Prox1 type:SENSOR_PROX pins:(SENSOR_B0) doc:"Proximity sensor"'
			},
			{
				id: 'sensorPress',
				label: 'Pressure Sensor',
				code: 'part PS1 type:SENSOR_PRESS pins:(SENSOR_B0) doc:"Pressure sensor"'
			},
			{
				id: 'flowSensor',
				label: 'Flow Sensor',
				code: 'part FS1 type:FLOW_SENSOR pins:(IN,OUT,SIGNAL) doc:"Flow sensor"'
			}
		]
	},
	{
		id: 'pneumatic-vacuum',
		label: 'Vacuum Components',
		profiles: ['pneumatic'],
		shapes: [
			{
				id: 'vacuumGenerator',
				label: 'Vacuum Generator',
				code: 'part VG1 type:VACUUM_GENERATOR pins:(AIR_IN,EXHAUST,VACUUM_OUT) doc:"Venturi vacuum generator"'
			},
			{
				id: 'vacuumPump',
				label: 'Vacuum Pump',
				code: 'part VP1 type:VACUUM_PUMP pins:(VACUUM_OUT) doc:"Vacuum pump"'
			},
			{
				id: 'vacuumReservoir',
				label: 'Vacuum Reservoir',
				code: 'part VR1 type:VACUUM_RESERVOIR pins:(IN,OUT) doc:"Vacuum reservoir"'
			},
			{
				id: 'suctionCup',
				label: 'Suction Cup',
				code: 'part SC1 type:SUCTION_CUP pins:(vacuum_port) doc:"Vacuum suction cup"'
			},
			{
				id: 'vacuumFilter',
				label: 'Vacuum Filter',
				code: 'part VF1 type:VACUUM_FILTER pins:(IN,OUT) doc:"Vacuum filter"'
			},
			{
				id: 'vacuumSwitch',
				label: 'Vacuum Switch',
				code: 'part VS1 type:VACUUM_SWITCH pins:(IN,SIGNAL) doc:"Vacuum pressure switch"'
			},
			{
				id: 'blowOff',
				label: 'Blow-Off Valve',
				code: 'part BO1 type:BLOW_OFF pins:(VACUUM,EXHAUST) doc:"Blow-off valve"'
			}
		]
	}
];
