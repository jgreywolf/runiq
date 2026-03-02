import type { ProfileName } from '$lib/types';
import type { ShapeCategory } from '$lib/data/toolbox-data';

export function filterShapeCategories(
	categories: ShapeCategory[],
	searchQuery: string
): ShapeCategory[] {
	const trimmed = searchQuery.trim().toLowerCase();
	if (!trimmed) return categories;

	return categories
		.map((category) => ({
			...category,
			shapes: category.shapes.filter(
				(shape) =>
					shape.id.toLowerCase().includes(trimmed) || shape.label.toLowerCase().includes(trimmed)
			)
		}))
		.filter((category) => category.shapes.length > 0);
}

export function countShapes(categories: ShapeCategory[]): number {
	return categories.reduce((sum, category) => sum + category.shapes.length, 0);
}

export function getShapeItemLabelPlural(profileName: ProfileName | null): 'glyphsets' | 'shapes' {
	return profileName === 'glyphset' ? 'glyphsets' : 'shapes';
}

export function getExpandedCategoryIds(categories: ShapeCategory[], searchQuery: string): string[] {
	return searchQuery.trim() ? categories.map((category) => category.id) : [];
}
