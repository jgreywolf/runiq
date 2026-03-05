import type { ShapeCategory } from '../toolbox-data';

export const hvacShapeIcons: ShapeCategory[] = [
	{
		id: 'hvacEquipment',
		label: 'HVAC Equipment',
		profiles: ['hvac'],
		shapes: [
			{ id: 'hvac-ahu', label: 'Air Handling Unit', code: 'equipment AHU1 type:air-handling-unit cfm:5000' },
			{ id: 'hvac-fan-supply', label: 'Supply Fan', code: 'equipment Fan1 type:supply-fan cfm:5000' },
			{ id: 'hvac-cooling-coil', label: 'Cooling Coil', code: 'equipment Coil1 type:cooling-coil capacity:"10 tons"' },
			{ id: 'hvac-vav', label: 'VAV Box', code: 'equipment VAV1 type:vav-box cfm-max:1000' },
			{ id: 'hvac-diffuser', label: 'Diffuser', code: 'equipment Diff1 type:diffuser-supply' },
			{ id: 'hvac-thermostat', label: 'Thermostat', code: 'equipment TSTAT type:thermostat' }
		]
	},
	{
		id: 'hvacDucts',
		label: 'HVAC Ducts',
		profiles: ['hvac'],
		shapes: [
			{ id: 'hvac-duct-supply', label: 'Supply Duct', code: 'duct Supply type:supply size:"16x12"' },
			{ id: 'hvac-duct-return', label: 'Return Duct', code: 'duct Return type:return size:"20x14"' },
			{ id: 'hvac-duct-exhaust', label: 'Exhaust Duct', code: 'duct Exhaust type:exhaust size:"14x10"' },
			{ id: 'hvac-connect', label: 'Connect', code: 'connect AHU1.out -> Supply -> VAV1.in' }
		]
	}
];
