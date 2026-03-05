import { ProfileName } from '$lib/types';

/**
 * Detect profile type from current code.
 * Official profiles: diagram, sequence, wardley, electrical, digital, control, pneumatic,
 * hydraulic, hvac, glyphset, timeline, railroad, kanban, gitgraph, treemap, pedigree
 */
export function detectProfile(code: string): ProfileName {
	const trimmed = code.trim().toLowerCase();
	if (trimmed.startsWith('digital')) return ProfileName.digital;
	if (trimmed.startsWith('electrical')) return ProfileName.electrical;
	if (trimmed.startsWith('control')) return ProfileName.control;
	if (trimmed.startsWith('pneumatic')) return ProfileName.pneumatic;
	if (trimmed.startsWith('hydraulic')) return ProfileName.hydraulic;
	if (trimmed.startsWith('hvac')) return ProfileName.hvac;
	if (trimmed.startsWith('wardley')) return ProfileName.wardley;
	if (trimmed.startsWith('sequence')) return ProfileName.sequence;
	if (trimmed.startsWith('timeline')) return ProfileName.timeline;
	if (trimmed.startsWith('pedigree')) return ProfileName.pedigree;
	if (trimmed.startsWith('glyphset')) return ProfileName.glyphset;
	if (trimmed.startsWith('kanban')) return ProfileName.kanban;
	if (trimmed.startsWith('gitgraph')) return ProfileName.gitgraph;
	if (trimmed.startsWith('treemap')) return ProfileName.treemap;
	return ProfileName.diagram;
}
