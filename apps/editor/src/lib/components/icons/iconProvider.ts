/**
 * Icon Provider System
 * Centralized system to get icon SVG content for any shape based on profile context
 */

import { ProfileName } from '$lib/types';
import { shapeRegistry } from '@runiq/core';
import { getBpmnShapeIcon, isBpmnEvent, isBpmnGateway } from './bpmnIcons';
import { getDiagramShapeIcon, isDiagramSpecialIcon } from './diagramIcons';
import { getGlyphsetShapeIcon, isGlyphsetShape } from './glyphsetIcons';
import { createMockContext } from './mockContext';
import { getEntryExitIcon, getTextIcon, hasTextIcon } from './textIcons';

interface IconRequest {
	shapeId: string;
	profileName?: ProfileName | null;
	size?: number;
}

/**
 * Get icon SVG content for a shape based on profile context
 * Returns null if no icon can be generated
 */
export function getShapeIconSvg(request: IconRequest): string | null {
	const { shapeId, profileName, size = 48 } = request;

	// Profile-specific routing
	switch (profileName) {
		case ProfileName.glyphset:
			return getGlyphsetIcon(shapeId, size);

		case ProfileName.diagram:
		case ProfileName.sequence:
		case ProfileName.electrical:
		case ProfileName.digital:
		case ProfileName.pneumatic:
		case ProfileName.hydraulic:
		case ProfileName.hvac:
			return getDiagramProfileIcon(shapeId, size);
		case ProfileName.railroad:
			return getRailroadSnippetIcon(shapeId, size);

		default:
			// Fallback: try all sources
			//return getGlyphsetIcon(shapeId, size) || getDiagramProfileIcon(shapeId, size) || null;
			return generatePlaceholderIcon(shapeId, size);
	}
}

/**
 * Get glyphset icon
 */
function getGlyphsetIcon(shapeId: string, size: number): string | null {
	if (isGlyphsetShape(shapeId)) {
		return getGlyphsetShapeIcon(shapeId, size);
	}
	return null;
}

/**
 * Get diagram profile icon (diagram, sequence, electrical, pneumatic, hydraulic, hvac)
 */
function getDiagramProfileIcon(shapeId: string, size: number): string | null {
	// Check for entry/exit point special icons
	const entryExitIcon = getEntryExitIcon(shapeId, size);
	if (entryExitIcon) {
		return entryExitIcon;
	}

	// Check for text-based icons (electrical, hydraulic, pneumatic, sequence)
	if (hasTextIcon(shapeId)) {
		return getTextIcon(shapeId, size);
	}

	// Check diagram special icons
	if (isDiagramSpecialIcon(shapeId)) {
		return getDiagramShapeIcon(shapeId, size);
	}

	// Check BPMN icons
	if (isBpmnEvent(shapeId) || isBpmnGateway(shapeId)) {
		return getBpmnShapeIcon(shapeId, size);
	}

	// Try to render from shape registry
	return renderShapeFromRegistry(shapeId, size);
}

/**
 * Render a shape from the registry
 */
function renderShapeFromRegistry(shapeId: string, size: number): string | null {
	// Map some toolbox IDs to registry IDs
	const shapeIdMap: Record<string, string> = {
		paperTape: 'flag',
		package: 'umlPackage',
		erdMultiValuedAttribute: 'erdMultivaluedAttribute'
	};

	// Container/template shapes don't exist in registry - they're code snippets
	const snippetShapes = [
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
	];

	if (snippetShapes.includes(shapeId)) {
		return generatePlaceholderIcon(shapeId, size);
	}

	const actualShapeId = shapeIdMap[shapeId] || shapeId;
	const shape = shapeRegistry.get(actualShapeId);

	if (!shape) {
		return generatePlaceholderIcon(shapeId, size);
	}

	// Create mock context for rendering
	const mockContext = createMockContext(shapeId);
	const bounds = shape.bounds(mockContext);
	const shapeContent = shape.render(mockContext, { x: 0, y: 0 });

	// Chart shapes need larger display size
	const isChartShape = ['pieChart', 'barChart', 'pyramid'].includes(shapeId);
	const displaySize = isChartShape ? size * 3 : size;

	return `
		<svg 
			width="${displaySize}" 
			height="${displaySize}" 
			viewBox="0 0 ${bounds.width} ${bounds.height}"
			xmlns="http://www.w3.org/2000/svg"
			style="display: block;"
		>
			${shapeContent}
		</svg>
	`;
}

/**
 * Render a railroad snippet icon (text-based).
 */
function getRailroadSnippetIcon(shapeId: string, size: number): string | null {
	const snippetLabels: Record<string, string> = {
		'railroad-rule': 'rule',
		'railroad-theme': 'theme',
		'railroad-choice': 'A|B',
		'railroad-sequence': 'A B',
		'railroad-optional': 'A?',
		'railroad-zero-or-more': 'A*',
		'railroad-one-or-more': 'A+',
		'railroad-group': '(A|B)',
		'railroad-literal': '"+"',
		'railroad-reference': 'Expr'
	};

	const label = snippetLabels[shapeId];
	if (!label) {
		return generatePlaceholderIcon(shapeId, size);
	}

	const fontSize = Math.max(8, Math.floor(size * 0.28));
	const padding = Math.max(2, Math.floor(size * 0.08));
	const width = size - padding * 2;
	const height = size - padding * 2;

	return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
		<rect x="${padding}" y="${padding}" width="${width}" height="${height}" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" />
		<text x="${size / 2}" y="${size / 2 + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}" fill="#0f172a" font-family="monospace">${label}</text>
	</svg>`;
}

/**
 * Generate a placeholder icon for shapes that cannot be rendered
 */
function generatePlaceholderIcon(shapeId: string, size: number): string {
	const abbreviation = shapeId
		.replace(/([A-Z])/g, ' $1')
		.trim()
		.split(' ')
		.map((word) => word[0])
		.join('')
		.slice(0, 3)
		.toUpperCase();

	return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="${size - 4}" height="${size - 4}" fill="white" stroke="#ccc" stroke-width="1" rx="2"/>
        <text x="${size / 2}" y="${size / 2 + 3}" text-anchor="middle" font-size="8" fill="#666" font-family="monospace">${abbreviation}</text>
    </svg>`;
}
