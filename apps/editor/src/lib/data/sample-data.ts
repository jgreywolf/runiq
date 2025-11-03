import { c4SampleDiagrams } from './toolboxSamples/c4SampleDiagrams';
import { containerSampleDiagrams } from './toolboxSamples/containerSampleDiagrams';
import { controlSystemsSampleDiagrams } from './toolboxSamples/controlSystemsSampleDiagrams';
import { digitalSampleDiagrams } from './toolboxSamples/digitalSampleDiagrams';
import { electricalSampleDiagrams } from './toolboxSamples/electricalSampleDiagrams';
import { flowchartSampleDiagrams } from './toolboxSamples/flowchartSampleDiagrams';
import { networkSampleDiagrams } from './toolboxSamples/networkSampleDiagrams';
import { pedigreeSampleDiagrams } from './toolboxSamples/pedigreeSampleDiagrams';
import { sequenceSampleDiagrams } from './toolboxSamples/sequenceSampleDiagrams';
import { umlSampleDiagrams } from './toolboxSamples/umlSampleDiagrams';
import { quantumSampleDiagrams } from './toolboxSamples/quantumSampleDiagrams';
import { logicGateSampleDiagrams } from './toolboxSamples/logicGateSampleDiagrams';
import { chartSampleDiagrams } from './toolboxSamples/chartSampleDiagrams';
import { wardleySampleDiagrams } from './toolboxSamples/wardleySampleDiagrams';
import { pneumaticSampleDiagrams } from './toolboxSamples/pneumaticSampleDiagrams';
import { hydraulicSampleDiagrams } from './toolboxSamples/hydraulicSampleDiagrams';

export interface Sample {
	name: string;
	description: string;
	code: string;
}

export interface SampleCategory {
	id: string;
	label: string;
	samples: Sample[];
}

export const sampleDiagrams: SampleCategory[] = [
	...flowchartSampleDiagrams,
	...containerSampleDiagrams,
	...umlSampleDiagrams,
	...sequenceSampleDiagrams,
	...networkSampleDiagrams,
	...c4SampleDiagrams,
	...controlSystemsSampleDiagrams,
	...pedigreeSampleDiagrams,
	...chartSampleDiagrams,
	...quantumSampleDiagrams,
	...electricalSampleDiagrams,
	...digitalSampleDiagrams,
	...logicGateSampleDiagrams,
	...pneumaticSampleDiagrams,
	...hydraulicSampleDiagrams,
	...wardleySampleDiagrams
];
