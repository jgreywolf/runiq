export function injectDataIntoCode(syntaxCode: string, data: string): string {
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

	const chartShapePattern = /shape\s+(\w+)\s+as\s+@(lineChart|radarChart|pieChart|barChart|pyramidShape|venn\dShape|sankeyChart)/g;

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
		const lineEnd = endMatch ? matchStart + fullMatch.length + endMatch.index! : syntaxCode.length;

		const currentLine = syntaxCode.substring(matchStart, lineEnd);
		const propsMatch = currentLine.match(/as\s+@\w+\s+(.*)$/);
		const existingProps = propsMatch ? propsMatch[1].trim() : '';
		const withoutData = existingProps.replace(/\bdata:\[.*?\]|\bdata:\{.*?\}/g, '').trim();

		let dataToInject: any;
		if (typeof parsedData === 'object' && !Array.isArray(parsedData)) {
			const dataKeys = Object.keys(parsedData);
			if (dataKeys.length > 0) dataToInject = parsedData[dataKeys[0]];
		} else {
			dataToInject = parsedData;
		}

		if (!dataToInject) continue;

		let chartData: any;
		let chartLabels: string[] | null = null;

		if (Array.isArray(dataToInject) && dataToInject.length > 0 && typeof dataToInject[0] === 'object') {
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
			newProps = newProps ? `${newProps} labels:${labelsStr} data:${dataStr}` : `labels:${labelsStr} data:${dataStr}`;
		} else {
			newProps = newProps ? `${newProps} data:${dataStr}` : `data:${dataStr}`;
		}

		replacements.push({
			from: matchStart,
			to: lineEnd,
			replacement: `shape ${shapeId} as @${shapeType} ${newProps}`
		});
	}

	replacements.reverse().forEach(({ from, to, replacement }) => {
		modifiedCode = modifiedCode.substring(0, from) + replacement + modifiedCode.substring(to);
	});

	return modifiedCode;
}

function normalizeDataSourceOptions(
	options?: Array<{ name: string; value: string | number | boolean }> | Record<string, unknown>
): Record<string, unknown> {
	const normalized: Record<string, unknown> = {};
	if (!options) return normalized;
	if (Array.isArray(options)) {
		for (const option of options) normalized[option.name] = option.value;
		return normalized;
	}
	if (typeof options === 'object') return { ...options };
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
			if (char === '\r' && next === '\n') i += 1;
			row.push(current.trim());
			if (row.some((cell) => cell.length > 0)) rows.push(row);
			row = [];
			current = '';
			continue;
		}

		current += char;
	}

	if (current.length > 0 || row.length > 0) {
		row.push(current.trim());
		if (row.some((cell) => cell.length > 0)) rows.push(row);
	}

	return rows;
}

export function parseCsvToObjects(
	content: string,
	options: Record<string, unknown>,
	warnings: string[],
	sourceKey: string
): Array<Record<string, unknown>> | null {
	const delimiter = (typeof options.sep === 'string' && options.sep) || (typeof options.delimiter === 'string' && options.delimiter) || ',';
	const hasHeader = (options.hasHeader === undefined ? options.header : options.hasHeader) ?? true;

	const rows = parseCsvRows(content, delimiter);
	if (rows.length === 0) return [];

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

	warnings.push(`Datasource "${sourceKey}" uses CSV without headers; chart mappings may be limited.`);
	return rows.map((row, index) => ({ index: index + 1, values: row }));
}

function extractChartValues(data: unknown): { values: unknown[]; labels?: string[] } | null {
	if (Array.isArray(data)) {
		if (data.length === 0) return { values: [] };
		if (typeof data[0] === 'object' && data[0] !== null) {
			const firstObj = data[0] as Record<string, unknown>;
			const keys = Object.keys(firstObj);
			const numericKey = keys.find((k) => typeof firstObj[k] === 'number');
			const labelKey = keys.find((k) => typeof firstObj[k] === 'string');
			if (numericKey) {
				const values = data.map((item: any) => item[numericKey]);
				const labels = labelKey !== undefined ? data.map((item: any) => item[labelKey]) : undefined;
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
		if (firstKey && Array.isArray(obj[firstKey])) return extractChartValues(obj[firstKey]);
	}

	return null;
}

export function buildSankeyDataFromRows(
	rows: Array<Record<string, unknown>>,
	warnings: string[],
	sourceKey: string
): Record<string, unknown> | null {
	if (rows.length === 0) return { nodes: [], links: [] };

	const links: Array<Record<string, unknown>> = [];
	const nodes = new Map<string, { id: string; label?: string; color?: string }>();

	for (const row of rows) {
		const rowLower: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(row)) rowLower[key.toLowerCase()] = value;

		const source = String(rowLower.source ?? rowLower.from ?? '');
		const target = String(rowLower.target ?? rowLower.to ?? '');
		const valueRaw = rowLower.value ?? rowLower.amount ?? rowLower.size;
		const value = Number(valueRaw);

		if (!source || !target || Number.isNaN(value)) {
			warnings.push(`Datasource "${sourceKey}" missing required sankey fields (source, target, value).`);
			return null;
		}

		const link: Record<string, unknown> = { source, target, value };
		if (rowLower.label || rowLower.linklabel) link.label = String(rowLower.label ?? rowLower.linklabel);
		if (rowLower.color || rowLower.linkcolor) link.color = String(rowLower.color ?? rowLower.linkcolor);
		links.push(link);

		const sourceLabel = rowLower.sourcelabel ? String(rowLower.sourcelabel) : undefined;
		const targetLabel = rowLower.targetlabel ? String(rowLower.targetlabel) : undefined;
		const sourceColor = rowLower.sourcecolor ? String(rowLower.sourcecolor) : undefined;
		const targetColor = rowLower.targetcolor ? String(rowLower.targetcolor) : undefined;

		if (!nodes.has(source)) nodes.set(source, { id: source, label: sourceLabel, color: sourceColor });
		if (!nodes.has(target)) nodes.set(target, { id: target, label: targetLabel, color: targetColor });
	}

	return { nodes: Array.from(nodes.values()), links };
}

function normalizeSankeyData(data: unknown, warnings: string[], sourceKey: string): Record<string, unknown> | null {
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
				.map((link: any) => ({ ...link, value: Number(link.value) }))
				.filter((link: any) => link.source && link.target && !Number.isNaN(link.value));

			if (sanitizedLinks.length !== links.length) {
				warnings.push(`Datasource "${sourceKey}" has Sankey links missing source, target, or numeric value.`);
			}

			const normalizedNodes = Array.isArray(nodes)
				? nodes
				: Array.from(new Set(sanitizedLinks.flatMap((link: any) => [link.source, link.target]).filter(Boolean))).map((id) => ({ id }));

			return { ...obj, nodes: normalizedNodes, links: sanitizedLinks };
		}
	}

	warnings.push(`Datasource "${sourceKey}" does not match Sankey data format.`);
	return null;
}

function resolveDataSources(profile: any, warnings: string[]): Map<string, { format: string; data: unknown }> {
	const resolved = new Map<string, { format: string; data: unknown }>();
	const sources = profile?.dataSources;
	if (!Array.isArray(sources)) return resolved;

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
				warnings.push(`Datasource "${key}" uses external JSON files, which are not supported in the editor.`);
			}
		} else if (format === 'csv') {
			const hasInline = src.includes('\n') || src.includes('\r') || src.includes(',');
			if (hasInline) {
				const rows = parseCsvToObjects(src, options, warnings, key);
				if (rows) resolved.set(key, { format, data: rows });
			} else {
				warnings.push(`Datasource "${key}" uses external CSV files, which are not supported in the editor.`);
			}
		} else {
			warnings.push(`Datasource "${key}" uses unsupported format "${format}".`);
		}
	}

	return resolved;
}

export function applyDataSourcesToCharts(profile: any, warnings: string[]): void {
	const dataSources = resolveDataSources(profile, warnings);
	if (dataSources.size === 0 || !Array.isArray(profile.nodes)) return;

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
			if (sankeyData) node.data = { ...(node.data || {}), ...sankeyData };
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

function getMappedValue(row: Record<string, unknown>, fields: Record<string, string>, key: string): unknown {
	const sourceKey = fields[key] ?? key;
	return row[sourceKey];
}

function normalizeDataRows(data: unknown, target: string, warnings: string[], sourceKey: string): Array<Record<string, unknown>> | null {
	if (Array.isArray(data)) return data as Array<Record<string, unknown>>;
	if (data && typeof data === 'object') {
		const obj = data as Record<string, unknown>;
		const nested = obj[target];
		if (Array.isArray(nested)) return nested as Array<Record<string, unknown>>;
	}
	warnings.push(`Datasource "${sourceKey}" does not provide rows for ${target}.`);
	return null;
}

export function applyDataSourcesToTimeline(profile: any, warnings: string[]): void {
	const dataSources = resolveDataSources(profile, warnings);
	if (dataSources.size === 0 || !Array.isArray(profile.dataMaps)) return;

	const events: any[] = Array.isArray(profile.events) ? [...profile.events] : [];
	const tasks: any[] = Array.isArray(profile.tasks) ? [...profile.tasks] : [];
	const milestones: any[] = Array.isArray(profile.milestones) ? [...profile.milestones] : [];

	for (const map of profile.dataMaps) {
		const target = map.target;
		if (!['timeline', 'events', 'tasks', 'milestones'].includes(target)) continue;

		const fields: Record<string, string> = map.fields ?? {};
		const hasLabel = !!(fields.label || fields.name);
		const missingFields: string[] = [];
		if (!fields.date && (target === 'timeline' || target === 'events' || target === 'milestones')) missingFields.push('date');
		if (target === 'tasks') {
			if (!fields.startDate) missingFields.push('startDate');
			if (!fields.endDate) missingFields.push('endDate');
		}
		if (!hasLabel) missingFields.push('label/name');
		if (missingFields.length > 0) {
			warnings.push(`Datasource "${map.source}" is missing ${missingFields.join(', ')} mapping for ${target}.`);
			continue;
		}

		const source = dataSources.get(map.source);
		if (!source) {
			warnings.push(`Datasource "${map.source}" not found for ${target} mapping.`);
			continue;
		}

		const rows = normalizeDataRows(source.data, target, warnings, map.source);
		if (!rows) continue;
		let skipped = 0;

		if (target === 'tasks') {
			rows.forEach((row, index) => {
				const label = getMappedValue(row, fields, 'label') ?? getMappedValue(row, fields, 'name');
				const startDate = getMappedValue(row, fields, 'startDate');
				const endDate = getMappedValue(row, fields, 'endDate');
				if (!label || !startDate || !endDate) {
					skipped += 1;
					return;
				}

				const task: any = {
					id: String(getMappedValue(row, fields, 'id') ?? `task-${index + 1}`),
					label: String(label),
					startDate: String(startDate),
					endDate: String(endDate)
				};
				const description = getMappedValue(row, fields, 'description');
				const color = getMappedValue(row, fields, 'fillColor') ?? getMappedValue(row, fields, 'color');
				const lane = getMappedValue(row, fields, 'lane') ?? getMappedValue(row, fields, 'laneId');
				if (description) task.description = String(description);
				if (color) task.fillColor = String(color);
				if (lane) task.lane = String(lane);
				tasks.push(task);
			});
			if (skipped > 0) warnings.push(`Datasource "${map.source}" skipped ${skipped} task row(s) missing required fields.`);
			continue;
		}

		if (target === 'milestones') {
			rows.forEach((row, index) => {
				const label = getMappedValue(row, fields, 'label') ?? getMappedValue(row, fields, 'name');
				const date = getMappedValue(row, fields, 'date');
				if (!label || !date) {
					skipped += 1;
					return;
				}

				const milestone: any = {
					id: String(getMappedValue(row, fields, 'id') ?? `milestone-${index + 1}`),
					label: String(label),
					date: String(date)
				};
				const description = getMappedValue(row, fields, 'description');
				const color = getMappedValue(row, fields, 'fillColor') ?? getMappedValue(row, fields, 'color');
				const lane = getMappedValue(row, fields, 'lane') ?? getMappedValue(row, fields, 'laneId');
				if (description) milestone.description = String(description);
				if (color) milestone.fillColor = String(color);
				if (lane) milestone.lane = String(lane);
				milestones.push(milestone);
			});
			if (skipped > 0) warnings.push(`Datasource "${map.source}" skipped ${skipped} milestone row(s) missing required fields.`);
			continue;
		}

		rows.forEach((row, index) => {
			const label = getMappedValue(row, fields, 'label') ?? getMappedValue(row, fields, 'name');
			const date = getMappedValue(row, fields, 'date');
			if (!label || !date) {
				skipped += 1;
				return;
			}

			const event: any = {
				id: String(getMappedValue(row, fields, 'id') ?? `event-${index + 1}`),
				label: String(label),
				date: String(date)
			};
			const description = getMappedValue(row, fields, 'description');
			const icon = getMappedValue(row, fields, 'icon');
			const color = getMappedValue(row, fields, 'fillColor') ?? getMappedValue(row, fields, 'color');
			if (description) event.description = String(description);
			if (icon) event.icon = String(icon);
			if (color) event.fillColor = String(color);
			events.push(event);
		});

		if (skipped > 0) warnings.push(`Datasource "${map.source}" skipped ${skipped} event row(s) missing required fields.`);
	}

	if (events.length > 0) profile.events = events;
	if (tasks.length > 0) profile.tasks = tasks;
	if (milestones.length > 0) profile.milestones = milestones;
}

export function applyDataSourcesToTreemap(profile: any, warnings: string[]): void {
	const dataSources = resolveDataSources(profile, warnings);
	if (dataSources.size === 0 || !Array.isArray(profile.dataMaps)) return;

	for (const map of profile.dataMaps) {
		if (map.target !== 'treemap') continue;
		const fields: Record<string, string> = map.fields ?? {};
		const hasLabel = !!(fields.label || fields.name);
		if (!fields.value || !hasLabel) {
			const missing = [!fields.value ? 'value' : null, !hasLabel ? 'label/name' : null].filter(Boolean);
			warnings.push(`Datasource "${map.source}" is missing ${missing.join(', ')} mapping for treemap.`);
			continue;
		}

		const source = dataSources.get(map.source);
		if (!source) {
			warnings.push(`Datasource "${map.source}" not found for treemap mapping.`);
			continue;
		}

		const rows = normalizeDataRows(source.data, 'treemap', warnings, map.source);
		if (!rows) continue;

		const nodesById = new Map<string, any>();
		let skipped = 0;

		rows.forEach((row, index) => {
			const label = getMappedValue(row, fields, 'label') ?? getMappedValue(row, fields, 'name');
			if (!label) {
				skipped += 1;
				return;
			}
			const valueRaw = getMappedValue(row, fields, 'value');
			const value = valueRaw !== undefined ? Number(valueRaw) : undefined;
			if (value === undefined || Number.isNaN(value)) {
				skipped += 1;
				return;
			}

			const color = getMappedValue(row, fields, 'color');
			const id = getMappedValue(row, fields, 'id') ?? `node-${index + 1}`;
			const parentId = getMappedValue(row, fields, 'parentId');
			const node: any = { label: String(label) };
			if (value !== undefined && !Number.isNaN(value)) node.value = value;
			if (color) node.color = String(color);
			node.__id = String(id);
			if (parentId) node.__parentId = String(parentId);
			nodesById.set(node.__id, node);
		});

		if (skipped > 0) warnings.push(`Datasource "${map.source}" skipped ${skipped} treemap row(s) missing required fields.`);

		const roots: any[] = [];
		for (const node of nodesById.values()) {
			if (node.__parentId && nodesById.has(node.__parentId)) {
				const parent = nodesById.get(node.__parentId);
				parent.children = parent.children ?? [];
				parent.children.push(node);
			} else {
				roots.push(node);
			}
		}

		for (const node of nodesById.values()) {
			delete node.__id;
			delete node.__parentId;
		}

		if (roots.length > 0) profile.nodes = roots;
	}
}

export function applyDataSourcesToDiagram(profile: any, warnings: string[]): void {
	const dataSources = resolveDataSources(profile, warnings);
	if (dataSources.size === 0 || !Array.isArray(profile.dataMaps)) return;

	const sankeyMaps = profile.dataMaps.filter((map: any) => map.target === 'sankey');
	if (sankeyMaps.length === 0 || !Array.isArray(profile.nodes)) return;

	for (const map of sankeyMaps) {
		const fields: Record<string, string> = map.fields ?? {};
		const hasSource = !!(fields.source || fields.from);
		const hasTarget = !!(fields.target || fields.to);
		const hasValue = !!fields.value;
		if (!hasSource || !hasTarget || !hasValue) {
			const missing = [!hasSource ? 'source/from' : null, !hasTarget ? 'target/to' : null, !hasValue ? 'value' : null].filter(Boolean);
			warnings.push(`Datasource "${map.source}" is missing ${missing.join(', ')} mapping for sankey.`);
			continue;
		}

		const source = dataSources.get(map.source);
		if (!source) {
			warnings.push(`Datasource "${map.source}" not found for sankey mapping.`);
			continue;
		}

		let sankeyData: Record<string, unknown> | null = null;
		if (Array.isArray(source.data)) {
			const rows = source.data as Array<Record<string, unknown>>;
			const normalizedRows = rows.map((row) => ({
				source: getMappedValue(row, fields, 'source') ?? getMappedValue(row, fields, 'from'),
				target: getMappedValue(row, fields, 'target') ?? getMappedValue(row, fields, 'to'),
				value: getMappedValue(row, fields, 'value'),
				label: getMappedValue(row, fields, 'label'),
				color: getMappedValue(row, fields, 'color')
			}));
			sankeyData = buildSankeyDataFromRows(normalizedRows as Array<Record<string, unknown>>, warnings, map.source);
		} else if (source.data && typeof source.data === 'object') {
			const obj = source.data as Record<string, unknown>;
			const nodesKey = fields.nodes ?? 'nodes';
			const linksKey = fields.links ?? 'links';
			const rawNodes = obj[nodesKey];
			const rawLinks = obj[linksKey];

			if (Array.isArray(rawLinks)) {
				const normalizedLinks = rawLinks.map((link: any) => ({
					source: link[fields.source ?? fields.from ?? 'source'],
					target: link[fields.target ?? fields.to ?? 'target'],
					value: link[fields.value ?? 'value'],
					label: link[fields.label ?? 'label'],
					color: link[fields.color ?? 'color']
				}));

				const linkData = buildSankeyDataFromRows(normalizedLinks as Array<Record<string, unknown>>, warnings, map.source);
				if (linkData) {
					if (Array.isArray(rawNodes)) {
						const nodeIdKey = fields.nodeId ?? fields.id ?? 'id';
						const nodes = rawNodes.map((node: any) => ({
							id: String(node[nodeIdKey]),
							label: node[fields.label ?? 'label'],
							color: node[fields.color ?? 'color']
						}));
						sankeyData = { ...linkData, nodes };
					} else {
						sankeyData = linkData;
					}
				}
			}
		}

		if (!sankeyData) continue;
		for (const node of profile.nodes) {
			if (node.shape !== 'sankeyChart') continue;
			node.data = { ...(node.data || {}), ...sankeyData };
		}
	}
}
