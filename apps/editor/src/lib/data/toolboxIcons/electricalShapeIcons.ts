import type { ShapeCategory } from '../toolbox-data';

export const electricalShapeIcons: ShapeCategory[] = [
	{
		id: 'electrical',
		label: 'Electrical Components',
		profiles: ['electrical'],
		shapes: [
			{ id: 'resistor', label: 'Resistor', code: 'part id type:R value:"1k" pins:(N1,N2)' },
			{ id: 'capacitor', label: 'Capacitor', code: 'part id type:C value:"1u" pins:(N1,N2)' },
			{ id: 'inductor', label: 'Inductor', code: 'part id type:L value:"1m" pins:(N1,N2)' },
			{ id: 'transformer', label: 'Transformer', code: 'part id type:XFMR pins:(P1,P2,S1,S2)' },
			{ id: 'battery', label: 'Battery', code: 'part id type:BATTERY value:"9V" pins:(NEG,POS)' },
			{
				id: 'voltageSource',
				label: 'Voltage Source',
				code: 'part id type:V value:"5" pins:(VCC,GND)'
			},
			{
				id: 'currentSource',
				label: 'Current Source',
				code: 'part id type:I value:"1m" pins:(N1,N2)'
			},
			{ id: 'ground', label: 'Ground', code: 'part id type:GND pins:(GND)' },
			{ id: 'junction', label: 'Junction', code: 'part id type:JUNC pins:(N1)' },
			{ id: 'fuse', label: 'Fuse', code: 'part id type:FUSE value:"1A" pins:(N1,N2)' },
			{ id: 'lamp', label: 'Lamp', code: 'part id type:LAMP value:"12V" pins:(N1,N2)' },
			{ id: 'switchSpst', label: 'SPST Switch', code: 'part id type:SW_SPST pins:(N1,N2)' },
			{
				id: 'switchSpdt',
				label: 'SPDT Switch',
				code: 'part id type:SW_SPDT pins:(COMMON,THROW_A,THROW_B)'
			},
			{ id: 'diode', label: 'Diode', code: 'part id type:D pins:(N1,N2)' },
			{ id: 'led', label: 'LED', code: 'part id type:LED pins:(N1,N2)' },
			{ id: 'npnTransistor', label: 'NPN Transistor', code: 'part id type:Q_NPN pins:(C,B,E)' },
			{ id: 'pnpTransistor', label: 'PNP Transistor', code: 'part id type:Q_PNP pins:(C,B,E)' },
			{ id: 'nmosTransistor', label: 'NMOS', code: 'part id type:M_NMOS pins:(D,G,S)' },
			{ id: 'pmosTransistor', label: 'PMOS', code: 'part id type:M_PMOS pins:(D,G,S)' },
			{ id: 'opamp', label: 'Op-Amp', code: 'part id type:OPAMP pins:(OUT,INP,INN,VCC,GND)' }
		]
	}
];
