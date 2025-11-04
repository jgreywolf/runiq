import { activitySampleDiagrams } from './toolboxSamples/activitySampleDiagrams';
import { c4SampleDiagrams } from './toolboxSamples/c4SampleDiagrams';
import { chartSampleDiagrams } from './toolboxSamples/chartSampleDiagrams';
import { containerSampleDiagrams } from './toolboxSamples/containerSampleDiagrams';
import { controlSystemsSampleDiagrams } from './toolboxSamples/controlSystemsSampleDiagrams';
import { digitalSampleDiagrams } from './toolboxSamples/digitalSampleDiagrams';
import { electricalSampleDiagrams } from './toolboxSamples/electricalSampleDiagrams';
import { flowchartSampleDiagrams } from './toolboxSamples/flowchartSampleDiagrams';
import { hydraulicSampleDiagrams } from './toolboxSamples/hydraulicSampleDiagrams';
import { logicGateSampleDiagrams } from './toolboxSamples/logicGateSampleDiagrams';
import { mindmapSampleDiagrams } from './toolboxSamples/mindmapSampleDiagrams';
import { networkSampleDiagrams } from './toolboxSamples/networkSampleDiagrams';
import { pedigreeSampleDiagrams } from './toolboxSamples/pedigreeSampleDiagrams';
import { pneumaticSampleDiagrams } from './toolboxSamples/pneumaticSampleDiagrams';
import { quantumSampleDiagrams } from './toolboxSamples/quantumSampleDiagrams';
import { sequenceSampleDiagrams } from './toolboxSamples/sequenceSampleDiagrams';
import { stateMachineSampleDiagrams } from './toolboxSamples/stateMachineSampleDiagrams';
import { umlSampleDiagrams } from './toolboxSamples/umlSampleDiagrams';
import { wardleySampleDiagrams } from './toolboxSamples/wardleySampleDiagrams';

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
	...activitySampleDiagrams,
	...stateMachineSampleDiagrams,
	...sequenceSampleDiagrams,
	...mindmapSampleDiagrams,
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
