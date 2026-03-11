import { buildSankeyDataFromRows, parseCsvToObjects } from './dataMappings';

function getSankeyNodes(profile: any): any[] {
	if (!Array.isArray(profile?.nodes)) return [];
	return profile.nodes.filter((node: any) => node?.shape === 'sankeyChart');
}

export function applySankeyDataFromContent(
	profile: any,
	dataContent: string,
	warnings: string[]
): void {
	if (!dataContent) return;

	const sankeyNodes = getSankeyNodes(profile);
	if (sankeyNodes.length === 0) return;

	try {
		const data = JSON.parse(dataContent);
		for (const node of sankeyNodes) {
			if (data[node.id]) {
				node.data = data[node.id];
			} else {
				const dataKeys = Object.keys(data);
				if (dataKeys.length > 0) {
					node.data = data[dataKeys[0]];
				}
			}
		}
		return;
	} catch {
		// Fall through to CSV parsing
	}

	const rows = parseCsvToObjects(dataContent, {}, warnings, 'data panel');
	if (!rows) return;

	for (const node of sankeyNodes) {
		const sankeyData = buildSankeyDataFromRows(rows, warnings, 'data panel');
		if (sankeyData) node.data = sankeyData;
	}
}
