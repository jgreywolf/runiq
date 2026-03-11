import type { ProfileName } from '$lib/types';
import type { ShapeCategory } from '$lib/data/toolbox-data';
import { getShapeIconDebugInfo, type IconDebugInfo } from './iconProvider';

export interface ShapeIconMetadataResult {
	byShapeId: Map<string, IconDebugInfo>;
	total: number;
	placeholderCount: number;
	bySource: Array<[string, number]>;
}

export function buildShapeIconMetadata(
	categories: ShapeCategory[],
	profileName: ProfileName | null,
	size = 24
): ShapeIconMetadataResult {
	const byShapeId = new Map<string, IconDebugInfo>();
	const sourceCounts = new Map<string, number>();
	let total = 0;
	let placeholderCount = 0;

	if (!profileName) {
		return { byShapeId, total, placeholderCount, bySource: [] };
	}

	for (const category of categories) {
		for (const shape of category.shapes) {
			total += 1;
			const debugInfo = getShapeIconDebugInfo({ shapeId: shape.id, profileName, size });
			byShapeId.set(shape.id, debugInfo);
			sourceCounts.set(debugInfo.source, (sourceCounts.get(debugInfo.source) ?? 0) + 1);
			if (debugInfo.source.startsWith('placeholder')) {
				placeholderCount += 1;
			}
		}
	}

	const bySource = [...sourceCounts.entries()].sort((a, b) => b[1] - a[1]);
	return { byShapeId, total, placeholderCount, bySource };
}
