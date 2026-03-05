// SVG rendering utilities for the visual canvas

import { layoutRegistry } from '@runiq/core';
import { parse, type NodeLocation, type WarningDetail } from '@runiq/parser-dsl';
import { renderDigital, renderPID, renderSchematic } from '@runiq/renderer-schematic';
import {
	renderGitGraph,
	renderKanban,
	renderPedigree,
	renderRailroadDiagram,
	renderSequenceDiagram,
	renderSvg,
	renderTimeline,
	renderTreemap,
	renderWardleyMap
} from '@runiq/renderer-svg';
import {
	applyDataSourcesToCharts,
	applyDataSourcesToDiagram,
	applyDataSourcesToTimeline,
	applyDataSourcesToTreemap,
	buildSankeyDataFromRows,
	injectDataIntoCode,
	parseCsvToObjects
} from './dataMappings';

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
		const codeWithData = injectDataIntoCode(code, dataContent);
		const parseResult = parse(codeWithData);
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

		const profileType = 'type' in profile ? profile.type : 'diagram';
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
			try {
				const data = JSON.parse(dataContent);
				if (Array.isArray(diagramProfile.nodes)) {
					for (const node of diagramProfile.nodes) {
						if (node.shape !== 'sankeyChart') continue;
						if (data[node.id]) {
							node.data = data[node.id];
						} else {
							const dataKeys = Object.keys(data);
							if (dataKeys.length > 0) {
								node.data = data[dataKeys[0]];
							}
						}
					}
				}
			} catch {
				const rows = parseCsvToObjects(dataContent, {}, result.warnings, 'data panel');
				if (rows && Array.isArray(diagramProfile.nodes)) {
					for (const node of diagramProfile.nodes) {
						if (node.shape !== 'sankeyChart') continue;
						const sankeyData = buildSankeyDataFromRows(rows, result.warnings, 'data panel');
						if (sankeyData) node.data = sankeyData;
					}
				}
			}
		}

		if (profileType === 'wardley') {
			result.svg = renderWardleyMap(diagramProfile).svg;
		} else if (profileType === 'sequence') {
			result.svg = renderSequenceDiagram(diagramProfile).svg;
		} else if (profileType === 'timeline') {
			result.svg = renderTimeline(diagramProfile).svg;
		} else if (profileType === 'kanban') {
			result.svg = renderKanban(diagramProfile).svg;
		} else if (profileType === 'gitgraph') {
			result.svg = renderGitGraph(diagramProfile).svg;
		} else if (profileType === 'treemap') {
			result.svg = renderTreemap(diagramProfile).svg;
		} else if (profileType === 'pedigree') {
			result.svg = renderPedigree(diagramProfile).svg;
		} else if (
			profileType === 'electrical' ||
			profileType === 'pneumatic' ||
			profileType === 'hydraulic' ||
			profileType === 'hvac' ||
			profileType === 'control'
		) {
			result.svg = renderSchematic(diagramProfile).svg;
		} else if (profileType === 'pid') {
			result.svg = renderPID(diagramProfile).svg;
		} else if (profileType === 'railroad') {
			result.svg = renderRailroadDiagram(diagramProfile).svg;
		} else if (profileType === 'digital') {
			result.svg = renderDigital(diagramProfile, {
				gridSize: 50,
				routing: 'orthogonal',
				showNetLabels: true,
				showValues: false,
				showReferences: true
			}).svg;
		} else {
			const layoutAlgorithm = layoutRegistry.get(layoutEngine || 'elk');
			if (!layoutAlgorithm) {
				result.errors = [`Layout engine "${layoutEngine}" not found`];
				return result;
			}

			const laidOutProfile = await layoutAlgorithm.layout(diagramProfile);
			const renderResult = renderSvg(diagramProfile, laidOutProfile);
			result.svg = renderResult.svg;
		}

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

	if (styles.fillColor) mainElement.setAttribute('fill', styles.fillColor);
	if (styles.strokeColor) mainElement.setAttribute('stroke', styles.strokeColor);
	if (styles.strokeWidth) mainElement.setAttribute('stroke-width', styles.strokeWidth);

	if (styles.textColor) {
		const textElements = element.querySelectorAll('text');
		textElements.forEach((text) => text.setAttribute('fill', styles.textColor!));
	}
}
