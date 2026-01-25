// SVG rendering utilities for the visual canvas

import { parse, type NodeLocation, type WarningDetail } from '@runiq/parser-dsl';
import { layoutRegistry } from '@runiq/core';
import {
	renderRailroadDiagram,
	renderSvg,
	renderWardleyMap,
	renderSequenceDiagram,
	renderTimeline,
	renderKanban,
	renderGitGraph,
	renderTreemap
} from '@runiq/renderer-svg';
import { renderDigital, renderSchematic, renderPID } from '@runiq/renderer-schematic';

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

function injectDataIntoCode(syntaxCode: string, data: string): string {
	if (!data || !data.trim()) {
		return syntaxCode;
	}

	const trimmedData = data.trim();
	const looksLikeJson = trimmedData.startsWith('{') || trimmedData.startsWith('[');

	let parsedData: any;

	if (looksLikeJson) {
		try {
			parsedData = JSON.parse(trimmedData);
		} catch {
			return syntaxCode;
		}
	} else {
		const lines = trimmedData
			.split('\n')
			.map((l) => l.trim())
			.filter((l) => l);

		if (lines.length > 0) {
			const headers = lines[0].split(',').map((h) => h.trim());
			const rows = lines.slice(1).map((line) => {
				const values = line.split(',').map((v) => v.trim());
				const obj: any = {};
				headers.forEach((header, i) => {
					const value = values[i];
					obj[header] = isNaN(Number(value)) ? value : Number(value);
				});
				return obj;
			});

			parsedData = { dataset: rows };
		}
	}

	if (!parsedData) {
		return syntaxCode;
	}

	let modifiedCode = syntaxCode;

	const chartShapePattern =
		/shape\s+(\w+)\s+as\s+@(lineChart|radarChart|pieChart|barChart|pyramidShape|venn\dShape|sankeyChart)/g;

	let match;
	const replacements: Array<{ from: number; to: number; replacement: string }> = [];

	while ((match = chartShapePattern.exec(syntaxCode)) !== null) {
		const fullMatch = match[0];
		const shapeId = match[1];
		const shapeType = match[2];
		const matchStart = match.index;

		if (shapeType === 'sankeyChart') {
			continue;
		}

		const afterMatch = syntaxCode.substring(matchStart + fullMatch.length);
		const endMatch = afterMatch.match(/(?:\r?\n|$)/);
		const lineEnd = endMatch
			? matchStart + fullMatch.length + endMatch.index!
			: syntaxCode.length;

		const currentLine = syntaxCode.substring(matchStart, lineEnd);

		const propsMatch = currentLine.match(/as\s+@\w+\s+(.*)$/);
		const existingProps = propsMatch ? propsMatch[1].trim() : '';

		const withoutData = existingProps.replace(/\bdata:\[.*?\]|\bdata:\{.*?\}/g, '').trim();

		let dataToInject: any;

		if (typeof parsedData === 'object' && !Array.isArray(parsedData)) {
			const dataKeys = Object.keys(parsedData);
			if (dataKeys.length > 0) {
				dataToInject = parsedData[dataKeys[0]];
			}
		} else {
			dataToInject = parsedData;
		}

		if (!dataToInject) continue;

		let chartData: any;
		let chartLabels: string[] | null = null;

		if (
			Array.isArray(dataToInject) &&
			dataToInject.length > 0 &&
			typeof dataToInject[0] === 'object'
		) {
			const firstObj = dataToInject[0];
			const keys = Object.keys(firstObj);

			const numericKey = keys.find((k) => typeof firstObj[k] === 'number');
			const labelKey = keys.find((k) => typeof firstObj[k] === 'string');

			if (numericKey) {
				chartData = dataToInject.map((item: any) => item[numericKey]);

				if (labelKey) {
					chartLabels = dataToInject.map((item: any) => item[labelKey]);
				}
			} else {
				chartData = dataToInject;
			}
		} else {
			chartData = dataToInject;
		}

		const dataStr = JSON.stringify(chartData);
		let newProps = withoutData;

		if (chartLabels && chartLabels.length > 0) {
			const labelsStr = JSON.stringify(chartLabels);
			newProps = newProps
				? `${newProps} labels:${labelsStr} data:${dataStr}`
				: `labels:${labelsStr} data:${dataStr}`;
		} else {
			newProps = newProps ? `${newProps} data:${dataStr}` : `data:${dataStr}`;
		}

		const newShapeDecl = `shape ${shapeId} as @${shapeType} ${newProps}`;

		replacements.push({
			from: matchStart,
			to: lineEnd,
			replacement: newShapeDecl
		});
	}

	replacements.reverse().forEach(({ from, to, replacement }) => {
		modifiedCode = modifiedCode.substring(0, from) + replacement + modifiedCode.substring(to);
	});

	return modifiedCode;
}

function normalizeDataSourceOptions(
	options?: Array<{ name: string; value: string | number | boolean }>
): Record<string, unknown> {
	const normalized: Record<string, unknown> = {};
	if (!options) return normalized;
	for (const option of options) {
		normalized[option.name] = option.value;
	}
	return normalized;
}

function parseCsvRows(content: string, delimiter: string): string[][] {
	const rows: string[][] = [];
	let row: string[] = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < content.length; i++) {
		const char = content[i];
		const next = content[i + 1];

		if (char === '"') {
			if (inQuotes && next === '"') {
				current += '"';
				i += 1;
			} else {
				inQuotes = !inQuotes;
			}
			continue;
		}

		if (!inQuotes && char === delimiter) {
			row.push(current.trim());
			current = '';
			continue;
		}

		if (!inQuotes && (char === '\n' || char === '\r')) {
			if (char === '\r' && next === '\n') {
				i += 1;
			}
			row.push(current.trim());
			if (row.some((cell) => cell.length > 0)) {
				rows.push(row);
			}
			row = [];
			current = '';
			continue;
		}

		current += char;
	}

	if (current.length > 0 || row.length > 0) {
		row.push(current.trim());
		if (row.some((cell) => cell.length > 0)) {
			rows.push(row);
		}
	}

	return rows;
}

function parseCsvToObjects(
	content: string,
	options: Record<string, unknown>,
	warnings: string[],
	sourceKey: string
): Array<Record<string, unknown>> | null {
	const delimiter =
		(typeof options.sep === 'string' && options.sep) ||
		(typeof options.delimiter === 'string' && options.delimiter) ||
		',';
	const hasHeader =
		(options.hasHeader === undefined ? options.header : options.hasHeader) ?? true;

	const rows = parseCsvRows(content, delimiter);
	if (rows.length === 0) {
		return [];
	}

	if (hasHeader) {
		const headers = rows[0].map((h) => h.trim());
		return rows.slice(1).map((row) => {
			const obj: Record<string, unknown> = {};
			headers.forEach((header, index) => {
				const value = row[index] ?? '';
				const numberValue = Number(value);
				obj[header] = Number.isNaN(numberValue) ? value : numberValue;
			});
			return obj;
		});
	}

	warnings.push(
		`Datasource "${sourceKey}" uses CSV without headers; chart mappings may be limited.`
	);

	return rows.map((row, index) => ({
		index: index + 1,
		values: row
	}));
}

function extractChartValues(data: unknown): { values: unknown[]; labels?: string[] } | null {
	if (Array.isArray(data)) {
		if (data.length === 0) {
			return { values: [] };
		}

		if (typeof data[0] === 'object' && data[0] !== null) {
			const firstObj = data[0] as Record<string, unknown>;
			const keys = Object.keys(firstObj);
			const numericKey = keys.find((k) => typeof firstObj[k] === 'number');
			const labelKey = keys.find((k) => typeof firstObj[k] === 'string');

			if (numericKey) {
				const values = data.map((item: any) => item[numericKey]);
				const labels =
					labelKey !== undefined ? data.map((item: any) => item[labelKey]) : undefined;
				return { values, labels };
			}
		}

		return { values: data };
	}

	if (data && typeof data === 'object') {
		const obj = data as Record<string, unknown>;
		if (Array.isArray(obj.values)) {
			return { values: obj.values, labels: Array.isArray(obj.labels) ? obj.labels : undefined };
		}
		const firstKey = Object.keys(obj)[0];
		if (firstKey && Array.isArray(obj[firstKey])) {
			return extractChartValues(obj[firstKey]);
		}
	}

	return null;
}

function buildSankeyDataFromRows(
	rows: Array<Record<string, unknown>>,
	warnings: string[],
	sourceKey: string
): Record<string, unknown> | null {
	if (rows.length === 0) {
		return { nodes: [], links: [] };
	}

	const links: Array<Record<string, unknown>> = [];
	const nodes = new Map<string, { id: string; label?: string; color?: string }>();

	for (const row of rows) {
		const rowLower: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(row)) {
			rowLower[key.toLowerCase()] = value;
		}

		const source = String(rowLower.source ?? rowLower.from ?? '');
		const target = String(rowLower.target ?? rowLower.to ?? '');
		const valueRaw = rowLower.value ?? rowLower.amount ?? rowLower.size;
		const value = Number(valueRaw);

		if (!source || !target || Number.isNaN(value)) {
			warnings.push(
				`Datasource "${sourceKey}" missing required sankey fields (source, target, value).`
			);
			return null;
		}

		const link: Record<string, unknown> = {
			source,
			target,
			value
		};

		if (rowLower.label || rowLower.linklabel) {
			link.label = String(rowLower.label ?? rowLower.linklabel);
		}
		if (rowLower.color || rowLower.linkcolor) {
			link.color = String(rowLower.color ?? rowLower.linkcolor);
		}

		links.push(link);

		const sourceLabel = rowLower.sourcelabel ? String(rowLower.sourcelabel) : undefined;
		const targetLabel = rowLower.targetlabel ? String(rowLower.targetlabel) : undefined;
		const sourceColor = rowLower.sourcecolor ? String(rowLower.sourcecolor) : undefined;
		const targetColor = rowLower.targetcolor ? String(rowLower.targetcolor) : undefined;

		if (!nodes.has(source)) {
			nodes.set(source, { id: source, label: sourceLabel, color: sourceColor });
		}
		if (!nodes.has(target)) {
			nodes.set(target, { id: target, label: targetLabel, color: targetColor });
		}
	}

	return { nodes: Array.from(nodes.values()), links };
}

function normalizeSankeyData(
	data: unknown,
	warnings: string[],
	sourceKey: string
): Record<string, unknown> | null {
	if (!data) return null;

	if (Array.isArray(data)) {
		return buildSankeyDataFromRows(data as Array<Record<string, unknown>>, warnings, sourceKey);
	}

	if (typeof data === 'object') {
		const obj = data as Record<string, unknown>;
		const nodes = obj.nodes;
		const links = obj.links;

		if (Array.isArray(links)) {
			const sanitizedLinks = links
				.map((link: any) => ({
					...link,
					value: Number(link.value)
				}))
				.filter((link: any) => link.source && link.target && !Number.isNaN(link.value));

			if (sanitizedLinks.length !== links.length) {
				warnings.push(
					`Datasource "${sourceKey}" has Sankey links missing source, target, or numeric value.`
				);
			}

			const normalizedNodes = Array.isArray(nodes)
				? nodes
				: Array.from(
						new Set(
							sanitizedLinks
								.flatMap((link: any) => [link.source, link.target])
								.filter(Boolean)
						)
				  ).map((id) => ({ id }));

			return { ...obj, nodes: normalizedNodes, links: sanitizedLinks };
		}
	}

	warnings.push(`Datasource "${sourceKey}" does not match Sankey data format.`);
	return null;
}

function resolveDataSources(
	profile: any,
	warnings: string[]
): Map<string, { format: string; data: unknown }> {
	const resolved = new Map<string, { format: string; data: unknown }>();
	const sources = profile?.dataSources;

	if (!Array.isArray(sources)) {
		return resolved;
	}

	for (const source of sources) {
		const format = source.format;
		const key = source.key;
		const src = source.source;
		const options = normalizeDataSourceOptions(source.options);

		if (!format || !key || !src) continue;

		if (format === 'json') {
			if (src.trim().startsWith('{') || src.trim().startsWith('[')) {
				try {
					const parsed = JSON.parse(src);
					resolved.set(key, { format, data: parsed });
				} catch {
					warnings.push(`Datasource "${key}" has invalid JSON content.`);
				}
			} else {
				warnings.push(
					`Datasource "${key}" uses external JSON files, which are not supported in the editor.`
				);
			}
		} else if (format === 'csv') {
			const hasInline =
				src.includes('\n') || src.includes('\r') || src.includes(',');
			if (hasInline) {
				const rows = parseCsvToObjects(src, options, warnings, key);
				if (rows) {
					resolved.set(key, { format, data: rows });
				}
			} else {
				warnings.push(
					`Datasource "${key}" uses external CSV files, which are not supported in the editor.`
				);
			}
		} else {
			warnings.push(`Datasource "${key}" uses unsupported format "${format}".`);
		}
	}

	return resolved;
}

function applyDataSourcesToCharts(profile: any, warnings: string[]): void {
	const dataSources = resolveDataSources(profile, warnings);
	if (dataSources.size === 0 || !Array.isArray(profile.nodes)) {
		return;
	}

	const chartShapes = new Set([
		'lineChart',
		'radarChart',
		'pieChart',
		'barChart',
		'pyramidShape',
		'venn2Shape',
		'venn3Shape',
		'sankeyChart'
	]);

	for (const node of profile.nodes) {
		if (!node.dataSource || !chartShapes.has(node.shape)) continue;
		const source = dataSources.get(node.dataSource);
		if (!source) {
			warnings.push(`Datasource "${node.dataSource}" not found for shape "${node.id}".`);
			continue;
		}

		if (node.shape === 'sankeyChart') {
			const sankeyData = normalizeSankeyData(source.data, warnings, node.dataSource);
			if (sankeyData) {
				node.data = { ...(node.data || {}), ...sankeyData };
			}
			continue;
		}

		const chartData = extractChartValues(source.data);
		if (!chartData) {
			warnings.push(`Datasource "${node.dataSource}" could not map to chart values.`);
			continue;
		}

		node.data = {
			...(node.data || {}),
			values: chartData.values,
			labels: chartData.labels ?? node.data?.labels
		};
	}
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

		// Extract profile from parse result - could be in diagram (legacy) or document.profiles[0]
		const profile = parseResult.diagram || parseResult.document?.profiles?.[0];
		result.profile = profile;

		if (!profile) {
			result.errors = ['No profile found in parse result'];
			return result;
		}

		// For DiagramAst (from parseResult.diagram), treat as 'diagram' type
		const profileType = 'type' in profile ? profile.type : 'diagram';

		if (profileType === 'diagram') {
			applyDataSourcesToCharts(profile as any, result.warnings);
		}

		if (profileType === 'diagram' && dataContent) {
			try {
				const data = JSON.parse(dataContent);
				if (profile.nodes) {
					for (const node of profile.nodes) {
						if (node.shape === 'sankeyChart') {
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
				}
			} catch {
				const rows = parseCsvToObjects(dataContent, {}, result.warnings, 'data panel');
				if (rows && profile.nodes) {
					for (const node of profile.nodes) {
						if (node.shape === 'sankeyChart') {
							const sankeyData = buildSankeyDataFromRows(rows, result.warnings, 'data panel');
							if (sankeyData) {
								node.data = sankeyData;
							}
						}
					}
				}
			}
		}

		if (profileType === 'wardley') {
			result.svg = renderWardleyMap(profile as any).svg;
		} else if (profileType === 'sequence') {
			result.svg = renderSequenceDiagram(profile as any).svg;
		} else if (profileType === 'timeline') {
			result.svg = renderTimeline(profile as any).svg;
		} else if (profileType === 'kanban') {
			result.svg = renderKanban(profile as any).svg;
		} else if (profileType === 'gitgraph') {
			result.svg = renderGitGraph(profile as any).svg;
		} else if (profileType === 'treemap') {
			result.svg = renderTreemap(profile as any).svg;
		} else if (
			profileType === 'electrical' ||
			profileType === 'pneumatic' ||
			profileType === 'hydraulic' ||
			profileType === 'hvac' ||
			profileType === 'control'
		) {
			result.svg = renderSchematic(profile as any).svg;
		} else if (profileType === 'pid') {
			result.svg = renderPID(profile as any).svg;
		} else if (profileType === 'railroad') {
			result.svg = renderRailroadDiagram(profile as any).svg;
		} else if (profileType === 'digital') {
			result.svg = renderDigital(profile as any, {
				gridSize: 50,
				routing: 'orthogonal',
				showNetLabels: true,
				showValues: false,
				showReferences: true
			}).svg;
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
