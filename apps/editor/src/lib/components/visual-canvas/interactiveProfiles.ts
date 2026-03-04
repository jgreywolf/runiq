import { ProfileName } from '$lib/types';

export function supportsCanvasSelection(profileName: ProfileName | null): boolean {
	return profileName === ProfileName.diagram || profileName === ProfileName.timeline;
}

