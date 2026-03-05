import type { SampleCategory } from '../sample-data';

export const controlSampleDiagrams: SampleCategory[] = [
	{
		id: 'control',
		label: 'Control Logic',
		samples: [
			{
				name: 'Start/Stop Motor',
				description: 'Basic ladder rung with seal-in contact',
				code: `control "Motor Start-Stop" {
  variant ladder
  net L1, L2, M1, M2

  part Start type:NO_CONTACT pins:(L1,M1) doc:"Start PB"
  part Stop type:NC_CONTACT pins:(M1,M2) doc:"Stop PB"
  part Motor type:COIL pins:(M2,L2) doc:"Motor coil"
}`
			},
			{
				name: 'Timer Enable',
				description: 'Function block diagram with TON and output coil',
				code: `control "Timer Enable" {
  variant fbd
  net L1, L2, EN, DONE

  part Enable type:NO_CONTACT pins:(L1,EN) doc:"Enable"
  part Timer type:TIMER_ON pins:(EN,DONE) doc:"TON 2s"
  part Coil type:COIL pins:(DONE,L2) doc:"Output"
}`
			}
		]
	}
];
