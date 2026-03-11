function normalizeDataSourceOptions(
	options?:
		| Array<{ name: string; value: string | number | boolean }>
		| Record<string, unknown>
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
	const delimiter =
		(typeof options.sep === 'string' && options.sep) ||
		(typeof options.delimiter === 'string' && options.delimiter) ||
		',';
	const hasHeader =
		(options.hasHeader === undefined ? options.header : options.hasHeader) ?? true;

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

export function extractChartValues(data: unknown): { values: unknown[]; labels?: string[] } | null {
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

export function normalizeSankeyData(
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
				.map((link: any) => ({ ...link, value: Number(link.value) }))
				.filter((link: any) => link.source && link.target && !Number.isNaN(link.value));

			if (sanitizedLinks.length !== links.length) {
				warnings.push(`Datasource "${sourceKey}" has Sankey links missing source, target, or numeric value.`);
			}

			const normalizedNodes = Array.isArray(nodes)
				? nodes
				: Array.from(
						new Set(sanitizedLinks.flatMap((link: any) => [link.source, link.target]).filter(Boolean))
				  ).map((id) => ({ id }));

			return { ...obj, nodes: normalizedNodes, links: sanitizedLinks };
		}
	}

	warnings.push(`Datasource "${sourceKey}" does not match Sankey data format.`);
	return null;
}

export function resolveDataSources(
	profile: any,
	warnings: string[]
): Map<string, { format: string; data: unknown }> {
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

export function getMappedValue(
	row: Record<string, unknown>,
	fields: Record<string, string>,
	key: string
): unknown {
	const sourceKey = fields[key] ?? key;
	return row[sourceKey];
}

export function normalizeDataRows(
	data: unknown,
	target: string,
	warnings: string[],
	sourceKey: string
): Array<Record<string, unknown>> | null {
	if (Array.isArray(data)) return data as Array<Record<string, unknown>>;
	if (data && typeof data === 'object') {
		const obj = data as Record<string, unknown>;
		const nested = obj[target];
		if (Array.isArray(nested)) return nested as Array<Record<string, unknown>>;
	}
	warnings.push(`Datasource "${sourceKey}" does not provide rows for ${target}.`);
	return null;
}

