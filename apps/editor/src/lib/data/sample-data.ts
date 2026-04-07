import { activitySampleDiagrams } from './toolboxSamples/activitySampleDiagrams';
import { classSampleDiagrams } from './toolboxSamples/classSampleDiagrams';
import { c4SampleDiagrams } from './toolboxSamples/c4SampleDiagrams';
import { chartSampleDiagrams } from './toolboxSamples/chartSampleDiagrams';
import { containerSampleDiagrams } from './toolboxSamples/containerSampleDiagrams';
import { controlSampleDiagrams } from './toolboxSamples/controlSampleDiagrams';
import { digitalSampleDiagrams } from './toolboxSamples/digitalSampleDiagrams';
import { electricalSampleDiagrams } from './toolboxSamples/electricalSampleDiagrams';
import { faultTreeSampleDiagrams } from './toolboxSamples/faultTreeSampleDiagrams';
import { flowchartSampleDiagrams } from './toolboxSamples/flowchartSampleDiagrams';
import { gitgraphSampleDiagrams } from './toolboxSamples/gitgraphSampleDiagrams';
import { hydraulicSampleDiagrams } from './toolboxSamples/hydraulicSampleDiagrams';
import { hvacSampleDiagrams } from './toolboxSamples/hvacSampleDiagrams';
import { kanbanSampleDiagrams } from './toolboxSamples/kanbanSampleDiagrams';
import { logicGateSampleDiagrams } from './toolboxSamples/logicGateSampleDiagrams';
import { mindmapSampleDiagrams } from './toolboxSamples/mindmapSampleDiagrams';
import { networkSampleDiagrams } from './toolboxSamples/networkSampleDiagrams';
import { pedigreeSampleDiagrams } from './toolboxSamples/pedigreeSampleDiagrams';
import { pidSampleDiagrams } from './toolboxSamples/pidSampleDiagrams';
import { pneumaticSampleDiagrams } from './toolboxSamples/pneumaticSampleDiagrams';
import { quantumSampleDiagrams } from './toolboxSamples/quantumSampleDiagrams';
import { railroadSampleDiagrams } from './toolboxSamples/railroadSampleDiagrams';
import { sequenceSampleDiagrams } from './toolboxSamples/sequenceSampleDiagrams';
import { stateMachineSampleDiagrams } from './toolboxSamples/stateMachineSampleDiagrams';
import { templatePresetSampleDiagrams } from './toolboxSamples/templatePresetSampleDiagrams';
import { threatModelSampleDiagrams } from './toolboxSamples/threatModelSampleDiagrams';
import { timelineSampleDiagrams } from './toolboxSamples/timelineSampleDiagrams';
import { treemapSampleDiagrams } from './toolboxSamples/treemapSampleDiagrams';
import { umlSampleDiagrams } from './toolboxSamples/umlSampleDiagrams';
import { wardleySampleDiagrams } from './toolboxSamples/wardleySampleDiagrams';
import { wbsSampleDiagrams } from './toolboxSamples/wbsSampleDiagrams';
import { requirementsSampleDiagrams } from './toolboxSamples/requirementsSampleDiagrams';
import { glyphsetSampleDiagrams } from './toolboxSamples/glyphsetSampleDiagrams';

export interface Sample {
	name: string;
	description: string;
	code: string;
	data?: string; // Optional JSON or CSV data for data-driven diagrams
	badges?: string[];
}

export interface SampleCategory {
	id: string;
	label: string;
	samples: Sample[];
}

export const sampleDiagrams: SampleCategory[] = [
	...flowchartSampleDiagrams,
	...classSampleDiagrams,
	...containerSampleDiagrams,
	...templatePresetSampleDiagrams,
	...umlSampleDiagrams,
	...activitySampleDiagrams,
	...stateMachineSampleDiagrams,
	...sequenceSampleDiagrams,
	...timelineSampleDiagrams,
	...faultTreeSampleDiagrams,
	...mindmapSampleDiagrams,
	...networkSampleDiagrams,
	...threatModelSampleDiagrams,
	...wbsSampleDiagrams,
	...requirementsSampleDiagrams,
	...pedigreeSampleDiagrams,
	...c4SampleDiagrams,
	...controlSampleDiagrams,
	...chartSampleDiagrams,
	...quantumSampleDiagrams,
	...electricalSampleDiagrams,
	...digitalSampleDiagrams,
	...logicGateSampleDiagrams,
	...pneumaticSampleDiagrams,
	...hydraulicSampleDiagrams,
	...hvacSampleDiagrams,
	...pidSampleDiagrams,
	...wardleySampleDiagrams,
	...glyphsetSampleDiagrams,
	...railroadSampleDiagrams,
	...kanbanSampleDiagrams,
	...gitgraphSampleDiagrams,
	...treemapSampleDiagrams
];
