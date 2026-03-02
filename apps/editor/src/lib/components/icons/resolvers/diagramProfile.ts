import { getBpmnShapeIcon, isBpmnEvent, isBpmnGateway } from '../bpmnIcons';
import { getDiagramShapeIcon, isDiagramSpecialIcon } from '../diagramIcons';
import { getEntryExitIcon, getTextIcon, hasTextIcon } from '../textIcons';
import { resolveRegistryIcon } from './registry';
import type { IconResolution } from './types';

export function resolveDiagramProfileIcon(shapeId: string, size: number): IconResolution {
	const entryExitIcon = getEntryExitIcon(shapeId, size);
	if (entryExitIcon) {
		return { svg: entryExitIcon, source: 'entry-exit' };
	}

	if (hasTextIcon(shapeId)) {
		return { svg: getTextIcon(shapeId, size), source: 'text-icon' };
	}

	if (isDiagramSpecialIcon(shapeId)) {
		return { svg: getDiagramShapeIcon(shapeId, size), source: 'diagram-special' };
	}

	if (isBpmnEvent(shapeId) || isBpmnGateway(shapeId)) {
		return { svg: getBpmnShapeIcon(shapeId, size), source: 'bpmn' };
	}

	return resolveRegistryIcon(shapeId, size);
}
