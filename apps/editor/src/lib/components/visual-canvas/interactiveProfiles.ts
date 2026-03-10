import { ProfileName } from '$lib/types';

export function isSchematicProfile(profileName: ProfileName | null): boolean {
	return (
		profileName === ProfileName.electrical ||
		profileName === ProfileName.control ||
		profileName === ProfileName.pneumatic ||
		profileName === ProfileName.hydraulic ||
		profileName === ProfileName.hvac ||
		profileName === ProfileName.digital
	);
}

export function supportsCanvasSelection(profileName: ProfileName | null): boolean {
	return (
		profileName === ProfileName.diagram ||
		profileName === ProfileName.timeline ||
		profileName === ProfileName.sequence ||
		isSchematicProfile(profileName)
	);
}

export function supportsCanvasContextMenus(profileName: ProfileName | null): boolean {
	return (
		profileName === ProfileName.diagram ||
		profileName === ProfileName.timeline ||
		profileName === ProfileName.sequence ||
		isSchematicProfile(profileName)
	);
}
