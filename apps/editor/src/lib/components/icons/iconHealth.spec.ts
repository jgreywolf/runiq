import { describe, expect, it } from 'vitest';
import { getShapeCategoryByProfile } from '$lib/data/toolbox-data';
import { ProfileName } from '$lib/types';
import { getShapeIconDebugInfo } from './iconProvider';

function placeholderRatio(profile: ProfileName): { ratio: number; total: number; placeholders: number } {
	const categories = getShapeCategoryByProfile(profile);
	let total = 0;
	let placeholders = 0;
	for (const category of categories) {
		for (const shape of category.shapes) {
			total += 1;
			const info = getShapeIconDebugInfo({ shapeId: shape.id, profileName: profile, size: 24 });
			if (info.source.startsWith('placeholder')) {
				placeholders += 1;
			}
		}
	}

	return {
		ratio: total === 0 ? 0 : placeholders / total,
		total,
		placeholders
	};
}

describe('toolbox icon health', () => {
	it('keeps placeholder ratio within expected bounds for key browser profiles', () => {
		const thresholds: Array<[ProfileName, number]> = [
			[ProfileName.diagram, 0.98],
			[ProfileName.glyphset, 0.2],
			[ProfileName.railroad, 0.3]
		];

		for (const [profile, maxRatio] of thresholds) {
			const { ratio, total, placeholders } = placeholderRatio(profile);
			expect(
				ratio,
				`${profile}: placeholder ratio ${placeholders}/${total} (${ratio.toFixed(2)}) exceeds ${maxRatio}`
			).toBeLessThanOrEqual(maxRatio);
			expect(
				total - placeholders,
				`${profile}: expected at least one non-placeholder icon in browser catalog`
			).toBeGreaterThan(0);
		}
	});
});
