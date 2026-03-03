// SVG rendering utilities for the visual canvas
import { parse, type NodeLocation, type WarningDetail } from '@runiq/parser-dsl';
import {
	applyDataSourcesToCharts,
	applyDataSourcesToDiagram,
	applyDataSourcesToTimeline,
	applyDataSourcesToTreemap,
	injectDataIntoCode
} from './dataMappings';
import { getProfileTypeForCanvas, renderProfileSvg } from './profileRenderers';
import { applySankeyDataFromContent } from './sankeyDataBinding';

export interface RenderResult {
	success: boolean;
	svg: string;
	errors: string[];
	warnings: string[];
	warningDetails?: WarningDetail[];
	parseTime: number;
	renderTime: number;
	nodeLocations?: Map<string, NodeLocation>;
	profile?: any;
}

function appendHint(message: string, hint: string): string {
	if (message.includes('Hint:')) return message;
	return `${message} Hint: ${hint}`;
}

function getLineText(text: string, lineOneBased: number): string {
	const lines = text.split(/\r?\n/);
	return lines[lineOneBased - 1] ?? '';
}

function enrichCanvasParseError(message: string, sourceText: string): string {
	const lineMatch = message.match(/line\s+(\d+),\s*column\s+\d+/i);
	const lineOneBased = lineMatch ? Number(lineMatch[1]) : undefined;
	const lineText =
		lineOneBased && Number.isFinite(lineOneBased) && lineOneBased > 0
			? getLineText(sourceText, lineOneBased)
			: '';

	const likelyMissingColonBeforeString =
		!!lineText &&
		/\b[a-zA-Z_][a-zA-Z0-9_]*\s*"[^"]*"/.test(lineText) &&
		!/\b[a-zA-Z_][a-zA-Z0-9_]*\s*:\s*"[^"]*"/.test(lineText);

	const arrowExpectation = message.includes('[ARROW]') || message.includes('[LABELED_ARROW]');
	const foundQuotedString = /but found:\s*'"[^']*'/.test(message);
	if (likelyMissingColonBeforeString && (arrowExpectation || foundQuotedString)) {
		return appendHint(
			message,
			'Missing ":" between attribute name and value (example: label:"My Label").'
		);
	}

	return message;
}

export async function renderDiagram(
	code: string,
	dataContent: string,
	layoutEngine: string,
	layoutStrategy = 'hierarchical'
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
		const codeWithData = injectDataIntoCode(code, dataContent);
		const parseResult = parse(codeWithData);
		result.parseTime = Math.round(performance.now() - parseStart);

		if (parseResult.errors && parseResult.errors.length > 0) {
			result.errors = parseResult.errors.map((e: any) =>
				enrichCanvasParseError(
					typeof e === 'string' ? e : e.message || String(e),
					codeWithData
				)
			);
			return result;
		}

		if (parseResult.warnings && parseResult.warnings.length > 0) {
			result.warnings = parseResult.warnings.map((w: any) =>
				typeof w === 'string' ? w : w.message || String(w)
			);
		}
		result.nodeLocations = parseResult.nodeLocations;

		if (parseResult.warningDetails && parseResult.warningDetails.length > 0) {
			result.warningDetails = parseResult.warningDetails;
		}

		const renderStart = performance.now();
		const profile = parseResult.diagram || parseResult.document?.profiles?.[0];
		result.profile = profile;

		if (!profile) {
			result.errors = ['No profile found in parse result'];
			return result;
		}

		const profileType = getProfileTypeForCanvas(profile);
		const diagramProfile = profile as any;

		if (profileType === 'diagram') {
			applyDataSourcesToCharts(diagramProfile, result.warnings);
			applyDataSourcesToDiagram(diagramProfile, result.warnings);
		} else if (profileType === 'timeline') {
			applyDataSourcesToTimeline(diagramProfile, result.warnings);
		} else if (profileType === 'treemap') {
			applyDataSourcesToTreemap(diagramProfile, result.warnings);
		}

		if (profileType === 'diagram' && dataContent) {
			applySankeyDataFromContent(diagramProfile, dataContent, result.warnings);
		}

		result.svg = await renderProfileSvg(diagramProfile, layoutEngine, layoutStrategy);

		result.renderTime = Math.round(performance.now() - renderStart);
		result.success = !result.errors.length && !!result.svg;
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

	const allSvgs = svgContainer.querySelectorAll('svg');
	let diagramSvg: SVGSVGElement | null = null;

	for (const svg of allSvgs) {
		if (svg.querySelector('[data-node-id], [data-edge-id]')) {
			diagramSvg = svg as SVGSVGElement;
			break;
		}
	}

	if (!diagramSvg) return;

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
		fill?: string;
		stroke?: string;
		color?: string;
		routing?: string;
	}
): void {
	if (!svgContainer) return;

	const svgElement = svgContainer.querySelector('svg');
	if (!svgElement) return;

	const attribute = isNode ? 'data-node-id' : 'data-edge-id';
	let element: Element | null = null;

	if (!isNode) {
		element = svgElement.querySelector(`[${attribute}="${elementId}"]`);
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

	const mainElement = element.querySelector('rect, circle, ellipse, polygon, path, line, text');
	if (!mainElement) return;

	const fill = styles.fillColor ?? styles.fill;
	const stroke = styles.strokeColor ?? styles.stroke;
	const textColor = styles.textColor ?? styles.color;

	if (fill) mainElement.setAttribute('fill', fill);
	if (stroke) mainElement.setAttribute('stroke', stroke);
	if (styles.strokeWidth) mainElement.setAttribute('stroke-width', styles.strokeWidth);

	if (textColor) {
		const textElements = element.querySelectorAll('text');
		textElements.forEach((text) => text.setAttribute('fill', textColor));
	}
}
