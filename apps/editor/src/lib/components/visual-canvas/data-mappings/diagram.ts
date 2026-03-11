import { buildSankeyDataFromRows, getMappedValue, resolveDataSources } from './shared';

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

