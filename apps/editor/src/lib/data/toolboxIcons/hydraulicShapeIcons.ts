import type { ShapeCategory } from '../toolbox-data';

export const hydraulicShapeIcons: ShapeCategory[] = [
	{
		id: 'hydraulic',
		label: 'Basic',
		profiles: ['hydraulic'],
		shapes: [
			{
				id: 'reservoir',
				label: 'Reservoir (Tank)',
				code: 'part T1 type:RESERVOIR pins:(RETURN,SUCTION) doc:"Hydraulic reservoir"'
			},
			{
				id: 'accumulator',
				label: 'Accumulator',
				code: 'part AC1 type:ACCUMULATOR pins:(PORT) doc:"Hydraulic accumulator"'
			},
			{
				id: 'gaugePHyd',
				label: 'Pressure Gauge',
				code: 'part G1 type:GAUGE_P_HYD pins:(SENSE) doc:"Pressure gauge"'
			}
		]
	},
	{
		id: 'hydraulic-pumps',
		label: 'Pumps',
		profiles: ['hydraulic'],
		shapes: [
			{
				id: 'pumpFixed',
				label: 'Fixed Displacement Pump',
				code: 'part P1 type:PUMP_FIXED pins:(INLET,OUTLET) doc:"Fixed pump"'
			},
			{
				id: 'pumpVariable',
				label: 'Variable Displacement Pump',
				code: 'part P1 type:PUMP_VAR pins:(INLET,OUTLET) doc:"Variable pump"'
			},
			{
				id: 'pumpGear',
				label: 'Gear Pump',
				code: 'part P1 type:PUMP_GEAR pins:(INLET,OUTLET) doc:"Gear pump"'
			},
			{
				id: 'pumpVane',
				label: 'Vane Pump',
				code: 'part P1 type:PUMP_VANE pins:(INLET,OUTLET) doc:"Vane pump"'
			},
			{
				id: 'pumpPistonAxial',
				label: 'Axial Piston Pump',
				code: 'part P1 type:PUMP_PISTON_AXIAL pins:(INLET,OUTLET) doc:"Axial piston pump"'
			},
			{
				id: 'pumpPistonRadial',
				label: 'Radial Piston Pump',
				code: 'part P1 type:PUMP_PISTON_RADIAL pins:(INLET,OUTLET) doc:"Radial piston pump"'
			},
			{
				id: 'pumpScrew',
				label: 'Screw Pump',
				code: 'part P1 type:PUMP_SCREW pins:(INLET,OUTLET) doc:"Screw pump"'
			},
			{
				id: 'pumpHand',
				label: 'Hand Pump',
				code: 'part P1 type:PUMP_HAND pins:(INLET,OUTLET) doc:"Manual hand pump"'
			},
			{
				id: 'pumpPistonVar',
				label: 'Variable Piston Pump',
				code: 'part P1 type:PUMP_PISTON_VAR pins:(INLET,OUTLET) doc:"Variable piston pump"'
			}
		]
	},
	{
		id: 'hydraulic-motors',
		label: 'Hydraulic Motors',
		profiles: ['hydraulic'],
		shapes: [
			{
				id: 'motorHyd',
				label: 'Hydraulic Motor',
				code: 'part M1 type:MOTOR_HYD pins:(INLET,OUTLET) doc:"Hydraulic motor"'
			},
			{
				id: 'motorGear',
				label: 'Gear Motor',
				code: 'part M1 type:MOTOR_GEAR pins:(INLET,OUTLET) doc:"Gear motor"'
			},
			{
				id: 'motorVane',
				label: 'Vane Motor',
				code: 'part M1 type:MOTOR_VANE pins:(INLET,OUTLET) doc:"Vane motor"'
			},
			{
				id: 'motorPistonAxial',
				label: 'Axial Piston Motor',
				code: 'part M1 type:MOTOR_PISTON_AXIAL pins:(INLET,OUTLET) doc:"Axial piston motor"'
			},
			{
				id: 'motorPistonRadial',
				label: 'Radial Piston Motor',
				code: 'part M1 type:MOTOR_PISTON_RADIAL pins:(INLET,OUTLET) doc:"Radial piston motor"'
			},
			{
				id: 'motorOrbit',
				label: 'Orbit Motor',
				code: 'part M1 type:MOTOR_ORBIT pins:(INLET,OUTLET) doc:"Orbit motor"'
			}
		]
	},
	{
		id: 'hydraulic-valves',
		label: 'Hydraulic Valves',
		profiles: ['hydraulic'],
		shapes: [
			{
				id: 'valve22',
				label: '2/2-Way Valve',
				code: 'part V1 type:VALVE_22 pins:(P,A) doc:"2/2-way on/off valve"'
			},
			{
				id: 'valve32Hyd',
				label: '3/2-Way Valve',
				code: 'part V1 type:VALVE_32_HYD pins:(P,A,T) doc:"3/2-way control valve"'
			},
			{
				id: 'valve42',
				label: '4/2-Way Valve',
				code: 'part V1 type:VALVE_42 pins:(P,A,B,T) doc:"4/2-way reversing valve"'
			},
			{
				id: 'valve43',
				label: '4/3-Way Valve',
				code: 'part V1 type:VALVE_43 pins:(PUMP,PORT_A,PORT_B,TANK) doc:"4/3-way directional valve"'
			},
			{
				id: 'valve43Closed',
				label: '4/3 Closed Center',
				code: 'part V1 type:VALVE_43_CLOSED pins:(P,A,B,T) doc:"4/3 closed center valve"'
			},
			{
				id: 'valve43Open',
				label: '4/3 Open Center',
				code: 'part V1 type:VALVE_43_OPEN pins:(P,A,B,T) doc:"4/3 open center valve"'
			},
			{
				id: 'valve43Tandem',
				label: '4/3 Tandem Center',
				code: 'part V1 type:VALVE_43_TANDEM pins:(P,A,B,T) doc:"4/3 tandem center valve"'
			},
			{
				id: 'valve43Float',
				label: '4/3 Float Center',
				code: 'part V1 type:VALVE_43_FLOAT pins:(P,A,B,T) doc:"4/3 float center valve"'
			},
			{
				id: 'valveProportional',
				label: 'Proportional Valve',
				code: 'part V1 type:VALVE_PROPORTIONAL pins:(P,A,B,T,CONTROL) doc:"Proportional valve"'
			},
			{
				id: 'valveServo',
				label: 'Servo Valve',
				code: 'part V1 type:VALVE_SERVO pins:(P,A,B,T,CONTROL) doc:"Servo valve"'
			},
			{
				id: 'reliefValve',
				label: 'Pressure Relief Valve',
				code: 'part RV1 type:RELIEF_VALVE pins:(INLET,TANK) doc:"Relief valve"'
			},
			{
				id: 'reducingValve',
				label: 'Pressure Reducing Valve',
				code: 'part RD1 type:REDUCING_VALVE pins:(INLET,OUTLET) doc:"Reducing valve"'
			},
			{
				id: 'flowControlHyd',
				label: 'Flow Control Valve',
				code: 'part FC1 type:FLOW_CONTROL_HYD pins:(INLET,OUTLET) doc:"Flow control"'
			},
			{
				id: 'checkValveHyd',
				label: 'Check Valve',
				code: 'part CV1 type:CHECK_VALVE_HYD pins:(INLET,OUTLET) doc:"One-way valve"'
			},
			{
				id: 'reliefValveDirect',
				label: 'Direct Relief Valve',
				code: 'part RV1 type:RELIEF_DIRECT pins:(INLET,TANK) doc:"Direct-acting relief valve"'
			},
			{
				id: 'reliefValvePilot',
				label: 'Pilot Relief Valve',
				code: 'part RV1 type:RELIEF_PILOT pins:(INLET,TANK) doc:"Pilot-operated relief valve"'
			},
			{
				id: 'unloadingValve',
				label: 'Unloading Valve',
				code: 'part UV1 type:UNLOADING_VALVE pins:(PUMP,TANK,PILOT) doc:"Pump unloading valve"'
			},
			{
				id: 'sequenceValve',
				label: 'Sequence Valve',
				code: 'part SV1 type:SEQUENCE_VALVE pins:(INLET,OUTLET,SENSE) doc:"Pressure sequence valve"'
			},
			{
				id: 'counterbalanceValve',
				label: 'Counterbalance Valve',
				code: 'part CB1 type:COUNTERBALANCE_VALVE pins:(LOAD,DIRECTIONAL,PILOT) doc:"Load holding valve"'
			},
			{
				id: 'brakeValve',
				label: 'Brake Valve',
				code: 'part BV1 type:BRAKE_VALVE pins:(MOTOR_A,VALVE_A,PILOT_B) doc:"Motor brake valve"'
			},
			{
				id: 'throttleValve',
				label: 'Throttle Valve',
				code: 'part TV1 type:THROTTLE_VALVE pins:(INLET,OUTLET) doc:"Fixed orifice throttle"'
			},
			{
				id: 'needleValve',
				label: 'Needle Valve',
				code: 'part NV1 type:NEEDLE_VALVE pins:(INLET,OUTLET) doc:"Adjustable needle valve"'
			},
			{
				id: 'flowCompensated',
				label: 'Pressure Compensated Flow',
				code: 'part FC1 type:FLOW_COMPENSATED pins:(INLET,OUTLET) doc:"Pressure compensated flow control"'
			},
			{
				id: 'flowTempComp',
				label: 'Temp Compensated Flow',
				code: 'part FT1 type:FLOW_TEMP_COMP pins:(INLET,OUTLET) doc:"Temperature compensated flow"'
			},
			{
				id: 'priorityValve',
				label: 'Priority Valve',
				code: 'part PV1 type:PRIORITY_VALVE pins:(INLET,PRIORITY,EXCESS) doc:"Priority flow valve"'
			},
			{
				id: 'flowDivider',
				label: 'Flow Divider',
				code: 'part FD1 type:FLOW_DIVIDER pins:(INLET,OUTLET_A,OUTLET_B) doc:"Equal flow divider"'
			},
			{
				id: 'checkValvePilot',
				label: 'Pilot Check Valve',
				code: 'part PC1 type:CHECK_PILOT pins:(INLET,OUTLET,PILOT) doc:"Pilot-operated check valve"'
			},
			{
				id: 'shuttleValve',
				label: 'Shuttle Valve',
				code: 'part SH1 type:SHUTTLE_VALVE pins:(INLET_A,INLET_B,OUTLET) doc:"OR shuttle valve"'
			},
			{
				id: 'checkValvePilotOpen',
				label: 'Pilot-to-Open Check',
				code: 'part PO1 type:CHECK_PILOT_OPEN pins:(INLET,OUTLET,PILOT) doc:"Pilot to open check valve"'
			}
		]
	},
	{
		id: 'hydraulic-filters',
		label: 'Hydraulic Filters',
		profiles: ['hydraulic'],
		shapes: [
			{
				id: 'filterHyd',
				label: 'Hydraulic Filter',
				code: 'part F1 type:FILTER_HYD pins:(INLET,OUTLET) doc:"Hydraulic filter"'
			},
			{
				id: 'filterSuction',
				label: 'Suction Filter',
				code: 'part FS1 type:FILTER_SUCTION pins:(INLET,OUTLET) doc:"Suction line filter"'
			},
			{
				id: 'filterPressure',
				label: 'Pressure Filter',
				code: 'part FP1 type:FILTER_PRESSURE pins:(INLET,OUTLET) doc:"Pressure line filter"'
			},
			{
				id: 'filterReturn',
				label: 'Return Filter',
				code: 'part FR1 type:FILTER_RETURN pins:(INLET,TANK) doc:"Return line filter"'
			},
			{
				id: 'filterOffline',
				label: 'Offline Filter',
				code: 'part FO1 type:FILTER_OFFLINE pins:(INLET,OUTLET) doc:"Kidney-loop filter"'
			},
			{
				id: 'filterBreather',
				label: 'Breather Filter',
				code: 'part FB1 type:FILTER_BREATHER pins:(TANK) doc:"Reservoir breather filter"'
			},
			{
				id: 'filterSpinOn',
				label: 'Spin-On Filter',
				code: 'part FSO1 type:FILTER_SPIN_ON pins:(INLET,OUTLET) doc:"Spin-on cartridge filter"'
			}
		]
	},
	{
		id: 'hydraulic-cylinders',
		label: 'Hydraulic Cylinders',
		profiles: ['hydraulic'],
		shapes: [
			{
				id: 'cylinderHyd',
				label: 'Hydraulic Cylinder',
				code: 'part C1 type:CYL_HYD pins:(PORT_A,PORT_B) doc:"Hydraulic cylinder"'
			},
			{
				id: 'cylinderSingleRod',
				label: 'Single Rod Cylinder',
				code: 'part C1 type:CYL_SINGLE_ROD pins:(PISTON,PORT_A,PORT_B) doc:"Single rod cylinder"'
			},
			{
				id: 'cylinderDoubleRod',
				label: 'Double Rod Cylinder',
				code: 'part C1 type:CYL_DOUBLE_ROD pins:(ROD_LEFT,ROD_RIGHT,PORT_A,PORT_B) doc:"Double rod cylinder"'
			},
			{
				id: 'cylinderTelescopic',
				label: 'Telescopic Cylinder',
				code: 'part C1 type:CYL_TELESCOPIC pins:(PISTON,PORT_A,PORT_B) doc:"Telescopic cylinder"'
			},
			{
				id: 'cylinderMill',
				label: 'Mill Cylinder',
				code: 'part C1 type:CYL_MILL pins:(PISTON,PORT_A,PORT_B) doc:"Heavy duty mill cylinder"'
			},
			{
				id: 'cylinderTieRod',
				label: 'Tie-Rod Cylinder',
				code: 'part C1 type:CYL_TIE_ROD pins:(PISTON,PORT_A,PORT_B) doc:"Tie-rod cylinder"'
			},
			{
				id: 'cylinderWelded',
				label: 'Welded Cylinder',
				code: 'part C1 type:CYL_WELDED pins:(PISTON,PORT_A,PORT_B) doc:"Welded cylinder"'
			},
			{
				id: 'cylinderFeedback',
				label: 'Position Feedback Cylinder',
				code: 'part C1 type:CYL_FEEDBACK pins:(PISTON,PORT_A,PORT_B,FEEDBACK) doc:"Cylinder with position sensor"'
			}
		]
	},
	{
		id: 'hydraulic-actuators',
		label: 'Hydraulic Actuators',
		profiles: ['hydraulic'],
		shapes: [
			{
				id: 'rotaryVane',
				label: 'Vane Rotary Actuator',
				code: 'part RA1 type:ROTARY_VANE pins:(PORT_A,PORT_B,SHAFT) doc:"Vane rotary actuator"'
			},
			{
				id: 'rotaryPiston',
				label: 'Piston Rotary Actuator',
				code: 'part RA1 type:ROTARY_PISTON pins:(PORT_A,PORT_B,SHAFT) doc:"Piston rotary actuator"'
			},
			{
				id: 'rackPinion',
				label: 'Rack & Pinion',
				code: 'part RP1 type:RACK_PINION pins:(PORT_A,PORT_B,SHAFT) doc:"Rack and pinion actuator"'
			},
			{
				id: 'helicalActuator',
				label: 'Helical Actuator',
				code: 'part HA1 type:HELICAL_ACTUATOR pins:(PORT_IN,SHAFT) doc:"Helical rotary actuator"'
			}
		]
	},
	{
		id: 'hydraulic-accumulator',
		label: 'Hydraulic Accumulators',
		profiles: ['hydraulic'],
		shapes: [
			{
				id: 'accumulatorBladder',
				label: 'Bladder Accumulator',
				code: 'part AB1 type:ACCUMULATOR_BLADDER pins:(PORT) doc:"Bladder-type accumulator"'
			},
			{
				id: 'accumulatorPiston',
				label: 'Piston Accumulator',
				code: 'part AP1 type:ACCUMULATOR_PISTON pins:(PORT) doc:"Piston-type accumulator"'
			},
			{
				id: 'accumulatorDiaphragm',
				label: 'Diaphragm Accumulator',
				code: 'part AD1 type:ACCUMULATOR_DIAPHRAGM pins:(PORT) doc:"Diaphragm accumulator"'
			},
			{
				id: 'accumulatorWeight',
				label: 'Weight-Loaded Accumulator',
				code: 'part AW1 type:ACCUMULATOR_WEIGHT pins:(PORT) doc:"Weight-loaded accumulator"'
			}
		]
	},
	{
		id: 'hydraulic-coolers',
		label: 'Heat Exchangers',
		profiles: ['hydraulic'],
		shapes: [
			{
				id: 'coolerAir',
				label: 'Air Cooler',
				code: 'part CA1 type:COOLER_AIR pins:(INLET,OUTLET) doc:"Air-cooled heat exchanger"'
			},
			{
				id: 'coolerWater',
				label: 'Water Cooler',
				code: 'part CW1 type:COOLER_WATER pins:(OIL_IN,OIL_OUT,WATER_IN,WATER_OUT) doc:"Water-cooled heat exchanger"'
			},
			{
				id: 'coolerOilAir',
				label: 'Oil-to-Air Cooler',
				code: 'part COA1 type:COOLER_OIL_AIR pins:(INLET,OUTLET) doc:"Oil-to-air cooler"'
			},
			{
				id: 'coolerOilWater',
				label: 'Oil-to-Water Cooler',
				code: 'part COW1 type:COOLER_OIL_WATER pins:(OIL_IN,OIL_OUT,WATER_IN,WATER_OUT) doc:"Shell and tube cooler"'
			}
		]
	},
	{
		id: 'hydraulic-manifolds',
		label: 'Hydraulic Manifolds',
		profiles: ['hydraulic'],
		shapes: [
			{
				id: 'manifoldSandwich',
				label: 'Sandwich Manifold',
				code: 'part MS1 type:MANIFOLD_SANDWICH pins:(P_IN,P_OUT,PORT_A,PORT_B) doc:"Sandwich plate manifold"'
			},
			{
				id: 'manifoldMonoblock',
				label: 'Monoblock Manifold',
				code: 'part MM1 type:MANIFOLD_MONOBLOCK pins:(P,A,B,T) doc:"Monoblock manifold"'
			},
			{
				id: 'manifoldModular',
				label: 'Modular Manifold',
				code: 'part MD1 type:MANIFOLD_MODULAR pins:(PORT_1,PORT_2,PORT_3) doc:"Modular manifold"'
			},
			{
				id: 'manifoldCartridge',
				label: 'Cartridge Manifold',
				code: 'part MC1 type:MANIFOLD_CARTRIDGE pins:(PORT_A,PORT_P,PORT_T,PORT_B) doc:"Cartridge valve manifold"'
			}
		]
	}
];
