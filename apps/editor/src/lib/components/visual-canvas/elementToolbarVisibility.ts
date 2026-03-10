import { ProfileName } from '$lib/types';
import { isSchematicProfile } from './interactiveProfiles';

export function hasPrimarySelection(selectedNodeId: string | null, selectedEdgeId: string | null): boolean {
	return !!(selectedNodeId || selectedEdgeId);
}

export function shouldClearElementToolbar(params: {
	selectedNodeId: string | null;
	selectedEdgeId: string | null;
	profileName: ProfileName | null;
	mode: 'select' | 'connect';
}): boolean {
	return (
		!hasPrimarySelection(params.selectedNodeId, params.selectedEdgeId) ||
		(params.profileName !== ProfileName.diagram &&
			params.profileName !== ProfileName.sequence &&
			params.profileName !== ProfileName.timeline &&
			!isSchematicProfile(params.profileName)) ||
		params.mode !== 'select'
	);
}

export function shouldRepositionElementToolbar(params: {
	selectedNodeId: string | null;
	selectedEdgeId: string | null;
	profileName: ProfileName | null;
	mode: 'select' | 'connect';
}): boolean {
	return (
		(params.profileName === ProfileName.diagram ||
			params.profileName === ProfileName.sequence ||
			params.profileName === ProfileName.timeline ||
			isSchematicProfile(params.profileName)) &&
		params.mode === 'select' &&
		hasPrimarySelection(params.selectedNodeId, params.selectedEdgeId)
	);
}

export function hasAnySelection(params: {
	selectedNodeId: string | null;
	selectedEdgeId: string | null;
	selectedNodeIdsSize: number;
	selectedEdgeIdsSize: number;
}): boolean {
	return (
		params.selectedNodeId !== null ||
		params.selectedEdgeId !== null ||
		params.selectedNodeIdsSize > 0 ||
		params.selectedEdgeIdsSize > 0
	);
}
