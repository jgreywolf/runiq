import { basicShapeIcons } from './toolboxIcons/basicShapeIcons';
import { flowchartShapeIcons } from './toolboxIcons/flowchartShapeIcons';
import { logicGateShapeIcons } from './toolboxIcons/logicGateShapeIcons';
import { specialShapeIcons } from './toolboxIcons/specialShapeIcons';
import { decorativeShapeIcons } from './toolboxIcons/decorativeShapeIcons';
import { umlShapeIcons } from './toolboxIcons/umlShapeIcons';
import { c4ShapeIcons } from './toolboxIcons/c4ShapeIcons';
import { bpmnShapeIcons } from './toolboxIcons/bpmnShapeIcons';
import { storageShapeIcons } from './toolboxIcons/storageShapeIcons';
import { kinematicShapeIcons } from './toolboxIcons/kinematicShapeIcons';
import { electricalShapeIcons } from './toolboxIcons/electricalShapeIcons';
import { controlShapeIcons } from './toolboxIcons/controlShapeIcons';
import { pneumaticShapeIcons } from './toolboxIcons/pneumaticShapeIcons';
import { hydraulicShapeIcons } from './toolboxIcons/hydraulicShapeIcons';
import { hvacShapeIcons } from './toolboxIcons/hvacShapeIcons';
import { digitalComponentShapeIcons } from './toolboxIcons/digitalComponentShapeIcons';
import { digitalLogicGateShapeIcons } from './toolboxIcons/digitalLogicGateShapeIcons';
import { digitalSyntaxShapeIcons } from './toolboxIcons/digitalSyntaxShapeIcons';
import { railroadSyntaxShapeIcons } from './toolboxIcons/railroadSyntaxShapeIcons';
import { awsShapeIcons } from './toolboxIcons/awsShapeIcons';
import { networkShapeIcons } from './toolboxIcons/networkShapeIcons';
import { erdShapeIcons } from './toolboxIcons/erdShapeIcons';
import { chartShapeIcons } from './toolboxIcons/chartShapeIcons';
import { quantumShapeIcons } from './toolboxIcons/quantumShapeIcons';
import { containerTemplateShapeIcons } from './toolboxIcons/containerTemplateShapeIcons';
import { sequenceShapeIcons } from './toolboxIcons/sequenceShapeIcons';
import { glyphsetIcons } from './toolboxIcons/glyphsetIcons';
import { timelineSyntaxShapeIcons } from './toolboxIcons/timelineSyntaxShapeIcons';
import { kanbanSyntaxShapeIcons } from './toolboxIcons/kanbanSyntaxShapeIcons';
import { gitgraphSyntaxShapeIcons } from './toolboxIcons/gitgraphSyntaxShapeIcons';
import { treemapSyntaxShapeIcons } from './toolboxIcons/treemapSyntaxShapeIcons';
import { wardleySyntaxShapeIcons } from './toolboxIcons/wardleySyntaxShapeIcons';
import { pidSyntaxShapeIcons } from './toolboxIcons/pidSyntaxShapeIcons';
import { pedigreeSyntaxShapeIcons } from './toolboxIcons/pedigreeSyntaxShapeIcons';
import { ProfileName } from '$lib/types';

export interface Shape {
	id: string;
	label: string;
	code: string;
}

export interface ShapeCategory {
	id: string;
	label: string;
	shapes: Shape[];
	/**
	 * Profile(s) this shape category belongs to.
	 * Official profiles: diagram (default), sequence, wardley, electrical, digital, control, pneumatic, hydraulic, hvac, railroad
	 * If undefined or contains 'diagram', category is shown in general diagram mode.
	 */
	profiles?: string[];
}

const combine = (...groups: ShapeCategory[][]): ShapeCategory[] => groups.flat();

const diagramProfileCategories: ShapeCategory[] = combine(
	basicShapeIcons,
	flowchartShapeIcons,
	containerTemplateShapeIcons,
	umlShapeIcons,
	erdShapeIcons,
	storageShapeIcons,
	bpmnShapeIcons,
	c4ShapeIcons,
	kinematicShapeIcons,
	awsShapeIcons,
	networkShapeIcons,
	chartShapeIcons,
	quantumShapeIcons,
	specialShapeIcons,
	decorativeShapeIcons
);

const profileCategoryMap: Record<ProfileName, ShapeCategory[]> = {
	[ProfileName.diagram]: diagramProfileCategories,
	[ProfileName.sequence]: [...sequenceShapeIcons],
	[ProfileName.wardley]: [...wardleySyntaxShapeIcons],
	[ProfileName.timeline]: [...timelineSyntaxShapeIcons],
	[ProfileName.kanban]: [...kanbanSyntaxShapeIcons],
	[ProfileName.gitgraph]: [...gitgraphSyntaxShapeIcons],
	[ProfileName.treemap]: [...treemapSyntaxShapeIcons],
	[ProfileName.pid]: [...pidSyntaxShapeIcons],
	[ProfileName.pedigree]: [...pedigreeSyntaxShapeIcons],
	[ProfileName.hydraulic]: [...hydraulicShapeIcons],
	[ProfileName.pneumatic]: [...pneumaticShapeIcons],
	[ProfileName.electrical]: [...electricalShapeIcons, ...logicGateShapeIcons],
	[ProfileName.control]: [...controlShapeIcons],
	[ProfileName.hvac]: [...hvacShapeIcons],
	[ProfileName.digital]: [
		...digitalSyntaxShapeIcons,
		...digitalLogicGateShapeIcons,
		...digitalComponentShapeIcons
	],
	[ProfileName.railroad]: [...railroadSyntaxShapeIcons],
	[ProfileName.glyphset]: [...glyphsetIcons]
};

export const getAllShapeCategories = (): ShapeCategory[] => {
	return combine(
		diagramProfileCategories,
		[...sequenceShapeIcons],
		[...wardleySyntaxShapeIcons],
		[...timelineSyntaxShapeIcons],
		[...kanbanSyntaxShapeIcons],
		[...gitgraphSyntaxShapeIcons],
		[...treemapSyntaxShapeIcons],
		[...pidSyntaxShapeIcons],
		[...pedigreeSyntaxShapeIcons],
		[...electricalShapeIcons],
		[...logicGateShapeIcons],
		[...controlShapeIcons],
		[...digitalComponentShapeIcons],
		[...digitalLogicGateShapeIcons],
		[...digitalSyntaxShapeIcons],
		[...railroadSyntaxShapeIcons],
		[...pneumaticShapeIcons],
		[...hydraulicShapeIcons],
		[...hvacShapeIcons],
		[...glyphsetIcons]
	);
};

export const getShapeCategoryByProfile = (profileName: ProfileName): ShapeCategory[] => {
	return profileCategoryMap[profileName] ?? [];
};
