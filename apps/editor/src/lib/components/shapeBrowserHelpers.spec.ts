import { describe, expect, it } from 'vitest';
import { ProfileName } from '$lib/types';
import type { ShapeCategory } from '$lib/data/toolbox-data';
import {
	countShapes,
	filterShapeCategories,
	getExpandedCategoryIds,
	getShapeItemLabelPlural
} from './shapeBrowserHelpers';

const categories: ShapeCategory[] = [
	{
		id: 'basic',
		label: 'Basic',
		shapes: [
			{ id: 'rect', label: 'Rectangle', code: 'shape a as @rectangle' },
			{ id: 'circle', label: 'Circle', code: 'shape b as @circle' }
		]
	},
	{
		id: 'flow',
		label: 'Flowchart',
		shapes: [{ id: 'decision', label: 'Decision', code: 'shape c as @rhombus' }]
	}
];

describe('shapeBrowserHelpers', () => {
	it('filters categories by query', () => {
		const filtered = filterShapeCategories(categories, 'rect');
		expect(filtered).toHaveLength(1);
		expect(filtered[0].id).toBe('basic');
		expect(filtered[0].shapes).toHaveLength(1);
	});

	it('counts shapes across categories', () => {
		expect(countShapes(categories)).toBe(3);
	});

	it('returns glyphset label for glyphset profile', () => {
		expect(getShapeItemLabelPlural(ProfileName.glyphset)).toBe('glyphsets');
		expect(getShapeItemLabelPlural(ProfileName.diagram)).toBe('shapes');
	});

	it('expands all filtered category ids when search query is present', () => {
		expect(getExpandedCategoryIds(categories, 'x')).toEqual(['basic', 'flow']);
		expect(getExpandedCategoryIds(categories, '')).toEqual([]);
	});
});
