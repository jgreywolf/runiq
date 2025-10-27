import type { SampleCategory } from '../sample-data';

export const electricalSampleDiagrams: SampleCategory[] = [
	{
		id: 'electrical',
		label: 'Electrical Circuits',
		samples: [
			{
				name: 'Simple LED Circuit',
				description: 'Basic LED with current-limiting resistor',
				code: `electrical "LED Circuit" {
  net VCC, GND, N1

  part V1 type:V value:"5V" pins:(VCC,GND)
  part R1 type:R value:"220" pins:(VCC,N1)
  part D1 type:LED pins:(N1,GND)
  part GND1 type:GND pins:(GND)
}`
			},
			{
				name: 'RC Low-Pass Filter',
				description: 'First-order passive filter',
				code: `electrical "RC Filter" {
  net IN, OUT, GND

  part R1 type:R value:"1k" pins:(IN,OUT)
  part C1 type:C value:"100n" pins:(OUT,GND)
  part GND1 type:GND pins:(GND)
}`
			},
			{
				name: 'Voltage Divider',
				description: 'Basic voltage divider circuit',
				code: `electrical "Voltage Divider" {
  net VCC, VOUT, GND

  part V1 type:V value:"12V" pins:(VCC,GND)
  part R1 type:R value:"10k" pins:(VCC,VOUT)
  part R2 type:R value:"10k" pins:(VOUT,GND)
  part GND1 type:GND pins:(GND)
}`
			},
			{
				name: 'NPN Transistor Switch',
				description: 'Transistor as a switch',
				code: `electrical "Transistor Switch" {
  net VCC, BASE, COLL, GND

  part V1 type:V value:"5V" pins:(VCC,GND)
  part R1 type:R value:"1k" pins:(BASE,GND)
  part Q1 type:NPN pins:(COLL,BASE,GND)
  part R2 type:R value:"470" pins:(VCC,COLL)
  part LED1 type:LED pins:(COLL,GND)
  part GND1 type:GND pins:(GND)
}`
			}
		]
	}
];
