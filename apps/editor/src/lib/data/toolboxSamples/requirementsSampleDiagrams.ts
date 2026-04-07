import type { SampleCategory } from '../sample-data';

export const requirementsSampleDiagrams: SampleCategory[] = [
	{
		id: 'requirements',
		label: 'Requirements Diagrams',
		samples: [
			{
				name: 'Brake System Requirements',
				description: 'SysML-style requirements, derivation, satisfaction, and verification in the diagram profile.',
				code: `diagram "Brake System Requirements" {
  direction LR

  container sysReqs "Brake System" as @requirementPackage {
    shape stopping as @requirement title:"REQ-001" label:"Stopping distance under 40m"
    shape abs as @requirement title:"REQ-002" label:"ABS shall engage on wheel slip"
    shape pressure as @requirement title:"REQ-003" label:"Hydraulic pressure shall remain above 2.5 MPa"
  }

  shape ecu as @subsystemBlock label:"Brake ECU"
  shape hpu as @subsystemBlock label:"Hydraulic Unit"
  shape bench as @testCase label:"BrakeBenchTest"

  abs -> stopping stereotype:"deriveReqt" lineStyle:"dashed" arrowType:open
  ecu -> abs stereotype:"satisfy" lineStyle:"solid"
  hpu -> pressure stereotype:"satisfy" lineStyle:"solid"
  bench -> abs stereotype:"verify" lineStyle:"dashed" arrowType:open
}`
			}
		]
	}
];
