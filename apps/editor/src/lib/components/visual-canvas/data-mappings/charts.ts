import { extractChartValues, normalizeSankeyData, resolveDataSources } from './shared';

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

		node.data = { ...(node.data || {}), values: chartData.values, labels: chartData.labels ?? node.data?.labels };
	}
}

