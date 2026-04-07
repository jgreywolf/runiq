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
	const chartPreviewIcon = getChartPreviewIcon(shapeId, size);
	if (chartPreviewIcon) {
		return chartPreviewIcon;
	}

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

function getChartPreviewIcon(shapeId: string, size: number): string | null {
	const stroke = '#48677e';
	const axis = '#cbd5e1';
	const px = (value: number) => Number(((value / 48) * size).toFixed(2));
	const displaySize = size * 3;
	const wrap = (content: string) =>
		`<svg viewBox="0 0 ${size} ${size}" width="${displaySize}" height="${displaySize}" xmlns="http://www.w3.org/2000/svg" style="display: block;">
			${content}
		</svg>`;

	switch (shapeId) {
		case 'lineChart':
			return wrap(`
				<line x1="${px(8)}" y1="${px(38)}" x2="${px(40)}" y2="${px(38)}" stroke="${axis}" stroke-width="${px(1.5)}" />
				<line x1="${px(10)}" y1="${px(8)}" x2="${px(10)}" y2="${px(40)}" stroke="${axis}" stroke-width="${px(1.5)}" />
				<polyline points="${px(10)},${px(30)} ${px(18)},${px(24)} ${px(25)},${px(27)} ${px(33)},${px(17)} ${px(40)},${px(21)}" fill="none" stroke="${stroke}" stroke-width="${px(2.25)}" stroke-linecap="round" stroke-linejoin="round" />
				<circle cx="${px(18)}" cy="${px(24)}" r="${px(1.8)}" fill="${stroke}" />
				<circle cx="${px(25)}" cy="${px(27)}" r="${px(1.8)}" fill="${stroke}" />
				<circle cx="${px(33)}" cy="${px(17)}" r="${px(1.8)}" fill="${stroke}" />
				<circle cx="${px(40)}" cy="${px(21)}" r="${px(1.8)}" fill="${stroke}" />
			`);
		case 'ringChart':
			return wrap(`
				<circle cx="${size / 2}" cy="${size / 2}" r="${px(12)}" fill="none" stroke="#60a5fa" stroke-width="${px(7)}" stroke-dasharray="${px(22)} ${px(10)} ${px(14)} ${px(6)} ${px(18)} ${px(30)}" transform="rotate(-90 ${size / 2} ${size / 2})" />
				<circle cx="${size / 2}" cy="${size / 2}" r="${px(7)}" fill="white" />
			`);
		case 'scatterChart':
			return wrap(`
				<line x1="${px(8)}" y1="${px(38)}" x2="${px(40)}" y2="${px(38)}" stroke="${axis}" stroke-width="${px(1.5)}" />
				<line x1="${px(10)}" y1="${px(8)}" x2="${px(10)}" y2="${px(40)}" stroke="${axis}" stroke-width="${px(1.5)}" />
				<circle cx="${px(17)}" cy="${px(28)}" r="${px(2.5)}" fill="#60a5fa" />
				<circle cx="${px(26)}" cy="${px(21)}" r="${px(2.5)}" fill="#34d399" />
				<circle cx="${px(34)}" cy="${px(14)}" r="${px(2.5)}" fill="#f59e0b" />
				<circle cx="${px(40)}" cy="${px(25)}" r="${px(2.5)}" fill="#f97316" />
			`);
		case 'venn':
			return wrap(`
				<circle cx="${px(20)}" cy="${px(24)}" r="${px(9)}" fill="#93c5fd" fill-opacity="0.75" stroke="${stroke}" stroke-width="${px(1)}" />
				<circle cx="${px(28)}" cy="${px(24)}" r="${px(9)}" fill="#86efac" fill-opacity="0.75" stroke="${stroke}" stroke-width="${px(1)}" />
			`);
		default:
			return null;
	}
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
	const isChartShape = ['pieChart', 'barChart', 'pyramid', 'radarChart'].includes(shapeId);
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
