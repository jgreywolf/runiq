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
		const svg = getTextIcon(shapeId, size);
		if (svg) return { svg, source: 'text-icon' };
	}

	if (isDiagramSpecialIcon(shapeId)) {
		const svg = getDiagramShapeIcon(shapeId, size);
		if (svg) return { svg, source: 'diagram-special' };
	}

	if (isBpmnEvent(shapeId) || isBpmnGateway(shapeId)) {
		const svg = getBpmnShapeIcon(shapeId, size);
		if (svg) return { svg, source: 'bpmn' };
	}

	return resolveRegistryIcon(shapeId, size);
}
