import { shapeRegistry } from '@runiq/core';
import { createMockContext } from '../mockContext';
import { generatePlaceholderIcon } from './placeholder';
import type { IconResolution } from './types';

const shapeIdMap: Record<string, string> = {
	paperTape: 'flag',
	package: 'umlPackage',
	erdMultiValuedAttribute: 'erdMultivaluedAttribute'
};

const snippetShapes = new Set([
	'basic-container',
	'styled-container',
	'template-definition',
	'template-with-params',
	'template-usage',
	'preset-definition',
	'preset-usage',
	'themed-presets',
	'container-inheritance',
	'combined-template-preset',
	'collapsible-container',
	'nested-containers'
]);

export function resolveRegistryIcon(shapeId: string, size: number): IconResolution {
	if (snippetShapes.has(shapeId)) {
		return { svg: generatePlaceholderIcon(shapeId, size), source: 'placeholder-snippet' };
	}

	const actualShapeId = shapeIdMap[shapeId] || shapeId;
	const shape = shapeRegistry.get(actualShapeId);
	if (!shape) {
		return { svg: generatePlaceholderIcon(shapeId, size), source: 'placeholder-missing-shape' };
	}

	const mockContext = createMockContext(shapeId);
	const bounds = shape.bounds(mockContext);
	const shapeContent = shape.render(mockContext, { x: 0, y: 0 });

	return {
		source: 'shape-registry',
		svg: `
		<svg 
			width="${size}" 
			height="${size}" 
			viewBox="0 0 ${bounds.width} ${bounds.height}"
			xmlns="http://www.w3.org/2000/svg"
			style="display: block;"
		>
			${shapeContent}
		</svg>
	`
	};
}
