import { basicShapeIcons } from './toolboxIcons/basicShapeIcons';
import { flowchartShapeIcons } from './toolboxIcons/flowchartShapeIcons';
import { logicGateShapeIcons } from './toolboxIcons/logicGateShapeIcons';
// import { pedigreeShapeIcons } from './toolboxIcons/pedigreeShapeIcons';
import { specialShapeIcons } from './toolboxIcons/specialShapeIcons';
import { umlShapeIcons } from './toolboxIcons/umlShapeIcons';
import { c4ShapeIcons } from './toolboxIcons/c4ShapeIcons';
import { bpmnShapeIcons } from './toolboxIcons/bpmnShapeIcons';
import { storageShapeIcons } from './toolboxIcons/storageShapeIcons';
import { controlSystemsShapeIcons } from './toolboxIcons/controlSystemsShapeIcons';
import { electricalShapeIcons } from './toolboxIcons/electricalShapeIcons';
import { pneumaticShapeIcons } from './toolboxIcons/pneumaticShapeIcons';
import { hydraulicShapeIcons } from './toolboxIcons/hydraulicShapeIcons';
import { digitalComponentShapeIcons } from './toolboxIcons/digitalComponentShapeIcons';
import { awsShapeIcons } from './toolboxIcons/awsShapeIcons';
import { networkShapeIcons } from './toolboxIcons/networkShapeIcons';
import { erdShapeIcons } from './toolboxIcons/erdShapeIcons';
import { chartShapeIcons } from './toolboxIcons/chartShapeIcons';
import { quantumShapeIcons } from './toolboxIcons/quantumShapeIcons';
import { containerTemplateShapeIcons } from './toolboxIcons/containerTemplateShapeIcons';
import { sequenceShapeIcons } from './toolboxIcons/sequenceShapeIcons';
import { glyphsetIcons } from './toolboxIcons/glyphsetIcons';
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
	 * Official profiles: diagram (default), sequence, wardley, electrical, digital, pneumatic, hydraulic
	 * If undefined or contains 'diagram', category is shown in general diagram mode.
	 */
	profiles?: string[];
}

export const shapeCategories: ShapeCategory[] = [
	...basicShapeIcons,
	...flowchartShapeIcons,
	...containerTemplateShapeIcons,
	...umlShapeIcons,
	...erdShapeIcons,
	...storageShapeIcons,
	...bpmnShapeIcons,
	...c4ShapeIcons,
	...controlSystemsShapeIcons,
	...awsShapeIcons,
	...networkShapeIcons,
	//...pedigreeShapeIcons,
	...chartShapeIcons,
	...quantumShapeIcons,
	...specialShapeIcons,
	...sequenceShapeIcons,
	...electricalShapeIcons,
	...logicGateShapeIcons,
	...digitalComponentShapeIcons,
	...pneumaticShapeIcons,
	...hydraulicShapeIcons,
	...glyphsetIcons
];

export const diagramShapes: ShapeCategory[] = [
	...basicShapeIcons,
	...flowchartShapeIcons,
	...containerTemplateShapeIcons,
	...umlShapeIcons,
	...erdShapeIcons,
	...storageShapeIcons,
	...bpmnShapeIcons,
	...c4ShapeIcons,
	...controlSystemsShapeIcons,
	...awsShapeIcons,
	...networkShapeIcons,
	...chartShapeIcons,
	...quantumShapeIcons,
	...specialShapeIcons
];

export const glyphsets: ShapeCategory[] = [...glyphsetIcons];
export const sequenceShapes: ShapeCategory[] = [...sequenceShapeIcons];
export const hydraulicShapes: ShapeCategory[] = [...hydraulicShapeIcons];
export const pneumaticShapes: ShapeCategory[] = [...pneumaticShapeIcons];
export const electricalShapes: ShapeCategory[] = [
	...electricalShapeIcons,
	...logicGateShapeIcons,
	...digitalComponentShapeIcons
];

export const getShapeCategoryByProfile = (profileName: ProfileName): ShapeCategory[] => {
	switch (profileName) {
		case ProfileName.sequence:
			return sequenceShapes;
		case ProfileName.electrical:
			return electricalShapes;
		case ProfileName.pneumatic:
			return pneumaticShapes;
		case ProfileName.hydraulic:
			return hydraulicShapes;
		case ProfileName.diagram:
			return diagramShapes;
		case ProfileName.glyphset:
			return glyphsets;
		default:
			return [];
	}
};
