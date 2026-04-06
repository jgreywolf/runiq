import type { SampleCategory } from '../sample-data';

export const faultTreeSampleDiagrams: SampleCategory[] = [
	{
		id: 'faultTree',
		label: 'Fault Trees',
		samples: [
			{
				name: 'Brake Failure Analysis',
				description: 'Basic OR/AND decomposition of a braking-system failure',
				code: `faultTree "Brake Failure" {
  topEvent loss "Brake system fails"

  gate g1 type:or under:loss
  event hydLoss "Hydraulic pressure lost" under:g1
  event controlFailure "Controller failure" under:g1

  gate g2 type:and under:hydLoss
  event pump "Pump failure" under:g2
  event leak "Major line leak" under:g2
}`
			},
			{
				name: 'Backup Power Loss',
				description: 'Undeveloped event example with an AND gate',
				code: `faultTree "Backup Power Loss" {
  topEvent outage "Facility loses power"

  gate root type:and under:outage
  event mainFeedLoss "Main feed unavailable" under:root probability:0.2
  undevelopedEvent backup "Backup generator unavailable" under:root
}`
			}
		]
	}
];
