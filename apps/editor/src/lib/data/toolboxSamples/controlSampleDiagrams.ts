import type { SampleCategory } from './sample-data';

export const controlSampleDiagrams: SampleCategory[] = [
	{
		id: 'control',
		label: 'Control Systems (PLC)',
		description: 'Ladder logic and function block samples',
		diagrams: [
			{
				id: 'control-start-stop',
				label: 'Start/Stop Motor',
				description: 'Basic ladder rung with seal-in contact',
				code: `control "Motor Start-Stop" {
  variant ladder
  net L1, L2, M1, M2

  part Start type:NO_CONTACT pins:(L1,M1) doc:"Start PB"
  part Stop type:NC_CONTACT pins:(M1,M2) doc:"Stop PB"
  part Motor type:COIL pins:(M2,L2) doc:"Motor coil"
}`
			}
		]
	}
];
