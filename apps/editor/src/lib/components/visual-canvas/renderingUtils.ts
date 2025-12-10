// SVG rendering utilities for the visual canvas

import { parse, type NodeLocation } from '@runiq/parser-dsl';
import { layoutRegistry } from '@runiq/core';
import {
	renderSvg,
	renderWardleyMap,
	renderSequenceDiagram,
	renderTimeline
} from '@runiq/renderer-svg';
import { renderSchematic, renderPID } from '@runiq/renderer-schematic';

export interface RenderResult {
	success: boolean;
	svg: string;
	errors: string[];
	warnings: string[];
	parseTime: number;
	renderTime: number;
	nodeLocations?: Map<string, NodeLocation>;
	profile?: any;
}

export async function renderDiagram(
	code: string,
	dataContent: string,
	layoutEngine: string
): Promise<RenderResult> {
	const result: RenderResult = {
		svg: '',
		errors: [],
		warnings: [],
		parseTime: 0,
		renderTime: 0,
		success: false
	};

	if (!code || code.trim() === '') {
		return result;
	}

	const parseStart = performance.now();

	try {
		const parseResult = parse(code);
		result.parseTime = Math.round(performance.now() - parseStart);

		if (parseResult.errors && parseResult.errors.length > 0) {
			result.errors = parseResult.errors.map((e: any) =>
				typeof e === 'string' ? e : e.message || String(e)
			);
			return result;
		}

		if (parseResult.warnings && parseResult.warnings.length > 0) {
			result.warnings = parseResult.warnings.map((w: any) =>
				typeof w === 'string' ? w : w.message || String(w)
			);
		}

		const renderStart = performance.now();

		// Extract profile from parse result - could be in diagram (legacy) or document.profiles[0]
		const profile = parseResult.diagram || parseResult.document?.profiles?.[0];
		result.profile = profile;

		if (!profile) {
			result.errors = ['No profile found in parse result'];
			return result;
		}

		// For DiagramAst (from parseResult.diagram), treat as 'diagram' type
		const profileType = 'type' in profile ? profile.type : 'diagram';

		if (profileType === 'wardley') {
			result.svg = renderWardleyMap(profile as any).svg;
		} else if (profileType === 'sequence') {
			result.svg = renderSequenceDiagram(profile as any).svg;
		} else if (profileType === 'timeline') {
			result.svg = renderTimeline(profile as any).svg;
		} else if (
			profileType === 'electrical' ||
			profileType === 'pneumatic' ||
			profileType === 'hydraulic'
		) {
			result.svg = renderSchematic(profile as any).svg;
		} else if (profileType === 'pid') {
			result.svg = renderPID(profile as any).svg;
		} else {
			// Standard diagram with layout
			const layoutAlgorithm = layoutRegistry.get(layoutEngine || 'elk');

			if (!layoutAlgorithm) {
				result.errors = [`Layout engine "${layoutEngine}" not found`];
				return result;
			}

			const laidOutProfile = await layoutAlgorithm.layout(profile as any);
			const renderResult = renderSvg(profile as any, laidOutProfile);
			result.svg = renderResult.svg;
		}

		result.renderTime = Math.round(performance.now() - renderStart);
	} catch (error: any) {
		result.errors = [error.message || String(error)];
	}

	return result;
}

export function attachInteractiveHandlers(
	svgContainer: HTMLDivElement | null,
	handlers: {
		onMouseEnter: (event: Event) => void;
		onMouseLeave: (event: Event) => void;
		onClick: (event: Event) => void;
		onDoubleClick: (event: Event) => void;
	}
): void {
	if (!svgContainer) return;

	// Find the diagram SVG (not toolbar icon SVGs)
	const allSvgs = svgContainer.querySelectorAll('svg');
	let diagramSvg: SVGSVGElement | null = null;

	for (const svg of allSvgs) {
		// The diagram SVG contains elements with data-node-id or data-edge-id
		if (svg.querySelector('[data-node-id], [data-edge-id]')) {
			diagramSvg = svg as SVGSVGElement;
			break;
		}
	}

	if (!diagramSvg) return;

	// Attach event listeners to all interactive elements
	const interactiveElements = diagramSvg.querySelectorAll(
		'[data-node-id], [data-edge-id], [data-container-id]'
	);

	interactiveElements.forEach((element) => {
		element.addEventListener('mouseenter', handlers.onMouseEnter);
		element.addEventListener('mouseleave', handlers.onMouseLeave);
		element.addEventListener('click', handlers.onClick);
		element.addEventListener('dblclick', handlers.onDoubleClick);
	});
}

export function updateElementStyles(
	svgContainer: HTMLDivElement | null,
	elementId: string,
	isNode: boolean,
	styles: {
		fillColor?: string;
		strokeColor?: string;
		strokeWidth?: string;
		textColor?: string;
		routing?: string;
	}
): void {
	if (!svgContainer) return;

	const svgElement = svgContainer.querySelector('svg');
	if (!svgElement) return;

	const attribute = isNode ? 'data-node-id' : 'data-edge-id';

	// Handle edge ID suffix matching
	let element: Element | null = null;
	if (!isNode) {
		// Try exact match first
		element = svgElement.querySelector(`[${attribute}="${elementId}"]`);

		// If not found, try suffix matching
		if (!element) {
			const allEdges = svgElement.querySelectorAll(`[${attribute}]`);
			for (const edge of allEdges) {
				const edgeId = edge.getAttribute(attribute);
				if (edgeId && edgeId.startsWith(elementId + '-')) {
					element = edge;
					break;
				}
			}
		}
	} else {
		element = svgElement.querySelector(`[${attribute}="${elementId}"]`);
	}

	if (!element) return;

	// Apply styles based on element type
	if (isNode) {
		const rect = element.querySelector('rect, circle, ellipse, path');
		const text = element.querySelector('text');

		if (rect && styles.fillColor) {
			rect.setAttribute('fill', styles.fillColor);
		}
		if (rect && styles.strokeColor) {
			rect.setAttribute('stroke', styles.strokeColor);
		}
		if (rect && styles.strokeWidth) {
			rect.setAttribute('stroke-width', styles.strokeWidth);
		}
		if (text && styles.textColor) {
			text.setAttribute('fill', styles.textColor);
		}
	} else {
		// Edge styling
		const path = element.querySelector('path, line, polyline');
		if (path && styles.strokeColor) {
			path.setAttribute('stroke', styles.strokeColor);
		}
		if (path && styles.strokeWidth) {
			path.setAttribute('stroke-width', styles.strokeWidth);
		}
	}
}
