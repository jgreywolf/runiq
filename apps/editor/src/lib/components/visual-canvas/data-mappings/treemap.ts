import { getMappedValue, normalizeDataRows, resolveDataSources } from './shared';

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

