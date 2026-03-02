import { layoutRegistry } from '@runiq/core';
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

function getProfileType(profile: any): string {
	return 'type' in profile ? profile.type : 'diagram';
}

export async function renderProfileSvg(profile: any, layoutEngine: string): Promise<string> {
	const profileType = getProfileType(profile);

	if (profileType === 'wardley') return renderWardleyMap(profile).svg;
	if (profileType === 'sequence') return renderSequenceDiagram(profile).svg;
	if (profileType === 'timeline') return renderTimeline(profile).svg;
	if (profileType === 'kanban') return renderKanban(profile).svg;
	if (profileType === 'gitgraph') return renderGitGraph(profile).svg;
	if (profileType === 'treemap') return renderTreemap(profile).svg;
	if (profileType === 'pedigree') return renderPedigree(profile).svg;
	if (
		profileType === 'electrical' ||
		profileType === 'pneumatic' ||
		profileType === 'hydraulic' ||
		profileType === 'hvac' ||
		profileType === 'control'
	) {
		return renderSchematic(profile).svg;
	}
	if (profileType === 'pid') return renderPID(profile).svg;
	if (profileType === 'railroad') return renderRailroadDiagram(profile).svg;
	if (profileType === 'digital') {
		return renderDigital(profile, {
			gridSize: 50,
			routing: 'orthogonal',
			showNetLabels: true,
			showValues: false,
			showReferences: true
		}).svg;
	}

	const layoutAlgorithm = layoutRegistry.get(layoutEngine || 'elk');
	if (!layoutAlgorithm) {
		throw new Error(`Layout engine "${layoutEngine}" not found`);
	}
	const laidOutProfile = await layoutAlgorithm.layout(profile);
	return renderSvg(profile, laidOutProfile).svg;
}

export function getProfileTypeForCanvas(profile: any): string {
	return getProfileType(profile);
}
