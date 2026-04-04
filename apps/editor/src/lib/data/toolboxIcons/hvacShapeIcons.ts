import type { ShapeCategory } from '../toolbox-data';

export const hvacShapeIcons: ShapeCategory[] = [
	{
		id: 'hvacEquipment',
		label: 'Air Handling',
		profiles: ['hvac'],
		shapes: [
			{
				id: 'hvac-ahu',
				label: 'Air Handling Unit',
				code: 'equipment AHU1 type:air-handling-unit cfm:5000'
			},
			{
				id: 'hvac-fan-supply',
				label: 'Supply Fan',
				code: 'equipment SF1 type:supply-fan cfm:5000'
			},
			{
				id: 'hvac-fan-return',
				label: 'Return Fan',
				code: 'equipment RF1 type:return-fan cfm:4500'
			},
			{
				id: 'hvac-fan-exhaust',
				label: 'Exhaust Fan',
				code: 'equipment EF1 type:exhaust-fan cfm:2000'
			},
			{
				id: 'hvac-filter',
				label: 'Filter',
				code: 'equipment FILT1 type:filter'
			},
			{
				id: 'hvac-heating-coil',
				label: 'Heating Coil',
				code: 'equipment HCOIL1 type:heating-coil capacity:"120 kBtu/h"'
			},
			{
				id: 'hvac-cooling-coil',
				label: 'Cooling Coil',
				code: 'equipment CCOIL1 type:cooling-coil capacity:"10 tons"'
			},
			{
				id: 'hvac-humidifier',
				label: 'Humidifier',
				code: 'equipment HUM1 type:humidifier capacity:"50 lb/h"'
			},
			{
				id: 'hvac-dehumidifier',
				label: 'Dehumidifier',
				code: 'equipment DH1 type:dehumidifier capacity:"30 lb/h"'
			},
			{
				id: 'hvac-vav',
				label: 'VAV Box',
				code: 'equipment VAV1 type:vav-box cfm-max:1000'
			}
		]
	},
	{
		id: 'hvacDistribution',
		label: 'Distribution',
		profiles: ['hvac'],
		shapes: [
			{
				id: 'hvac-diffuser-supply',
				label: 'Supply Diffuser',
				code: 'equipment Diff1 type:diffuser-supply'
			},
			{
				id: 'hvac-diffuser-return',
				label: 'Return Diffuser',
				code: 'equipment Diff2 type:diffuser-return'
			},
			{
				id: 'hvac-damper-motorized',
				label: 'Motorized Damper',
				code: 'equipment DM1 type:damper-motorized'
			},
			{
				id: 'hvac-damper-manual',
				label: 'Manual Damper',
				code: 'equipment DM2 type:damper-manual'
			},
			{
				id: 'hvac-damper-fire',
				label: 'Fire Damper',
				code: 'equipment FD1 type:damper-fire'
			},
			{
				id: 'hvac-duct-supply',
				label: 'Supply Duct',
				code: 'duct Supply type:supply size:"16x12"'
			},
			{
				id: 'hvac-duct-return',
				label: 'Return Duct',
				code: 'duct Return type:return size:"20x14"'
			},
			{
				id: 'hvac-duct-exhaust',
				label: 'Exhaust Duct',
				code: 'duct Exhaust type:exhaust size:"14x10"'
			},
			{
				id: 'hvac-connect',
				label: 'Connect Chain',
				code: 'connect AHU1.out -> Supply -> VAV1.in'
			}
		]
	},
	{
		id: 'hvacControls',
		label: 'Controls And Plant',
		profiles: ['hvac'],
		shapes: [
			{
				id: 'hvac-thermostat',
				label: 'Thermostat',
				code: 'equipment TSTAT1 type:thermostat'
			},
			{
				id: 'hvac-temp-sensor',
				label: 'Temperature Sensor',
				code: 'equipment TS1 type:temperature-sensor'
			},
			{
				id: 'hvac-pressure-sensor',
				label: 'Pressure Sensor',
				code: 'equipment PS1 type:pressure-sensor'
			},
			{
				id: 'hvac-chiller',
				label: 'Chiller',
				code: 'equipment CH1 type:chiller capacity:"120 tons"'
			},
			{
				id: 'hvac-boiler',
				label: 'Boiler',
				code: 'equipment BLR1 type:boiler capacity:"500 kBtu/h"'
			},
			{
				id: 'hvac-cooling-tower',
				label: 'Cooling Tower',
				code: 'equipment CT1 type:cooling-tower capacity:"120 tons"'
			},
			{
				id: 'hvac-pump',
				label: 'Pump',
				code: 'equipment P1 type:pump gpm:120'
			},
			{
				id: 'hvac-heat-exchanger',
				label: 'Heat Exchanger',
				code: 'equipment HX1 type:heat-exchanger capacity:"300 kBtu/h"'
			}
		]
	}
];
