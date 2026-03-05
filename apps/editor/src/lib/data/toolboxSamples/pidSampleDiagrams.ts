import type { SampleCategory } from '../sample-data';

export const pidSampleDiagrams: SampleCategory[] = [
	{
		id: 'pid',
		label: 'P&ID',
		samples: [
			{
				name: 'Tank and Pump',
				description: 'Basic tank, pump, and process line.',
				code: `pid "Simple Pump Loop" {
  equipment TK1 type:storageTank volume:"5000 L"
  equipment P1 type:pumpCentrifugal flowRate:"120 L/min"
  equipment V1 type:valveControl

  instrument FT1 type:flowTransmitter

  line process from:TK1.outlet to:P1.inlet size:4 schedule:40 material:SS316
  line process from:P1.outlet to:V1.inlet size:4 schedule:40 material:SS316
  line signal from:FT1.out to:V1.signal
}`
			}
		]
	}
];
