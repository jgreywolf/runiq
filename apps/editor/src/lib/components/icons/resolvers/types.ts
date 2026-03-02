import type { ProfileName } from '$lib/types';

export interface IconRequest {
	shapeId: string;
	profileName?: ProfileName | null;
	size?: number;
}

export interface IconResolution {
	svg: string;
	source: string;
}
