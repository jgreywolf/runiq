import type { ShapeCategory } from '../toolbox-data';

export const hydraulicShapeIcons: ShapeCategory[] = [
	{
		id: 'hydraulic',
		label: 'Hydraulic Components',
		profiles: ['hydraulic'],
		shapes: [
			{
				id: 'reservoir',
				label: 'Reservoir (Tank)',
				code: 'part T1 type:RESERVOIR pins:(RETURN,SUCTION) doc:"Hydraulic reservoir"'
			},
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
				id: 'motorHyd',
				label: 'Hydraulic Motor',
				code: 'part M1 type:MOTOR_HYD pins:(INLET,OUTLET) doc:"Hydraulic motor"'
			},
			{
				id: 'cylinderHyd',
				label: 'Hydraulic Cylinder',
				code: 'part C1 type:CYL_HYD pins:(PORT_A,PORT_B) doc:"Hydraulic cylinder"'
			},
			{
				id: 'valve43',
				label: '4/3-Way Valve',
				code: 'part V1 type:VALVE_43 pins:(PUMP,PORT_A,PORT_B,TANK) doc:"4/3-way directional valve"'
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
				id: 'filterHyd',
				label: 'Hydraulic Filter',
				code: 'part F1 type:FILTER_HYD pins:(INLET,OUTLET) doc:"Hydraulic filter"'
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
	}
];
