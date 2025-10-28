import { basicShapeIcons } from './toolboxIcons/basicShapeIcons';
import { flowchartShapeIcons } from './toolboxIcons/flowchartShapeIcons';
import { logicGateShapeIcons } from './toolboxIcons/logicGateShapeIcons';
import { pedigreeShapeIcons } from './toolboxIcons/pedigreeShapeIcons';
import { specialShapeIcons } from './toolboxIcons/specialShapeIcons';
import { umlShapeIcons } from './toolboxIcons/umlShapeIcons';
import { c4ShapeIcons } from './toolboxIcons/c4ShapeIcons';
import { bpmnShapeIcons } from './toolboxIcons/bpmnShapeIcons';
import { storageShapeIcons } from './toolboxIcons/storageShapeIcons';
import { controlSystemsShapeIcons } from './toolboxIcons/controlSystemsShapeIcons';
import { electricalShapeIcons } from './toolboxIcons/electricalShapeIcons';
import { digitalComponentShapeIcons } from './toolboxIcons/digitalComponentShapeIcons';
import { awsShapeIcons } from './toolboxIcons/awsShapeIcons';
import { networkShapeIcons } from './toolboxIcons/networkShapeIcons';
import { erdShapeIcons } from './toolboxIcons/erdShapeIcons';
import { chartShapeIcons } from './toolboxIcons/chartShapeIcons';
import { quantumShapeIcons } from './toolboxIcons/quantumShapeIcons';

export interface Shape {
	id: string;
	label: string;
	code: string;
}

export interface ShapeCategory {
	id: string;
	label: string;
	shapes: Shape[];
	schematicOnly?: boolean;
}

export const shapeCategories: ShapeCategory[] = [
	...basicShapeIcons,
	...flowchartShapeIcons,
	...umlShapeIcons,
	...erdShapeIcons,
	...storageShapeIcons,
	...bpmnShapeIcons,
	...c4ShapeIcons,
	...controlSystemsShapeIcons,
	...awsShapeIcons,
	...networkShapeIcons,
	...pedigreeShapeIcons,
	...chartShapeIcons,
	...quantumShapeIcons,
	...specialShapeIcons,
	...electricalShapeIcons,
	...logicGateShapeIcons,
	...digitalComponentShapeIcons
];
