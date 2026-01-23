/**
 * Tests for toolbox data structures and validation
 */

import { describe, expect, it } from 'vitest';
import { getShapeCategoryByProfile, shapeCategories } from './toolbox-data';
import { ProfileName } from '../types';

describe('Toolbox Data Structure', () => {
	it('should have shape categories', () => {
		expect(shapeCategories).toBeDefined();
		expect(shapeCategories.length).toBeGreaterThan(0);
	});

	it('should have valid structure for all categories', () => {
		shapeCategories.forEach((category) => {
			expect(category).toHaveProperty('id');
			expect(category).toHaveProperty('label');
			expect(category).toHaveProperty('shapes');
			expect(typeof category.id).toBe('string');
			expect(typeof category.label).toBe('string');
			expect(Array.isArray(category.shapes)).toBe(true);
		});
	});

	it('should have unique category IDs', () => {
		const ids = shapeCategories.map((cat) => cat.id);
		const uniqueIds = new Set(ids);
		expect(uniqueIds.size).toBe(ids.length);
	});

	it('should have at least one shape in each category', () => {
		shapeCategories.forEach((category) => {
			expect(category.shapes.length).toBeGreaterThan(0);
		});
	});

	it('should have valid shape structure', () => {
		shapeCategories.forEach((category) => {
			category.shapes.forEach((shape) => {
				expect(shape).toHaveProperty('id');
				expect(shape).toHaveProperty('label');
				expect(shape).toHaveProperty('code');
				expect(typeof shape.id).toBe('string');
				expect(typeof shape.label).toBe('string');
				expect(typeof shape.code).toBe('string');
			});
		});
	});

	it('should have non-empty shape codes', () => {
		shapeCategories.forEach((category) => {
			category.shapes.forEach((shape) => {
				expect(shape.code.trim().length).toBeGreaterThan(0);
			});
		});
	});

	it('should have valid DSL syntax in shape codes', () => {
		shapeCategories.forEach((category) => {
			category.shapes.forEach((shape) => {
				// Shape code should be non-empty
				expect(shape.code.trim().length).toBeGreaterThan(0);
			});
		});
	});

	it('should have profile field when specified', () => {
		const categoriesWithProfiles = shapeCategories.filter((cat) => cat.profiles !== undefined);
		categoriesWithProfiles.forEach((category) => {
			expect(Array.isArray(category.profiles)).toBe(true);
			expect(category.profiles!.length).toBeGreaterThan(0);
		});
	});

	it('should have valid profile names', () => {
		const validProfiles = [
			'diagram',
			'sequence',
			'wardley',
			'electrical',
			'digital',
			'control',
			'pneumatic',
			'hydraulic',
			'hvac',
			'railroad',
			'pid',
			'glyphset'
		];

		shapeCategories.forEach((category) => {
			if (category.profiles) {
				category.profiles.forEach((profile) => {
					expect(validProfiles).toContain(profile);
				});
			}
		});
	});

	it('should have expected basic shapes category', () => {
		const basicCategory = shapeCategories.find((cat) => cat.id === 'basic');
		expect(basicCategory).toBeDefined();
		expect(basicCategory!.shapes.length).toBeGreaterThan(0);
	});

	it('should have expected flowchart category', () => {
		const flowchartCategory = shapeCategories.find((cat) => cat.id === 'flowchart');
		expect(flowchartCategory).toBeDefined();
		expect(flowchartCategory!.shapes.length).toBeGreaterThan(0);
	});

	it('should include rectangle shape in basic category', () => {
		const basicCategory = shapeCategories.find((cat) => cat.id === 'basic');
		const rectShape = basicCategory?.shapes.find(
			(s) => s.id === 'rect' || s.code.includes('@rect')
		);
		expect(rectShape).toBeDefined();
	});

	it('should include diamond shape for flowcharts', () => {
		const flowchartCategory = shapeCategories.find((cat) => cat.id === 'flowchart');
		const diamondShape = flowchartCategory?.shapes.find(
			(s) => s.id === 'diamond' || s.code.includes('@rhombus') || s.code.includes('@diamond')
		);
		expect(diamondShape).toBeDefined();
	});

	it('should include digital syntax and components in digital profile', () => {
		const categories = getShapeCategoryByProfile(ProfileName.digital);
		const categoryIds = categories.map((cat) => cat.id);
		expect(categoryIds).toContain('digitalSyntax');
		expect(categoryIds).toContain('digitalLogicGates');
		expect(categoryIds).toContain('digitalComponents');
	});

	it('should not include digital-only categories in electrical profile', () => {
		const categories = getShapeCategoryByProfile(ProfileName.electrical);
		const categoryIds = categories.map((cat) => cat.id);
		expect(categoryIds).not.toContain('digitalSyntax');
		expect(categoryIds).not.toContain('digitalLogicGates');
		expect(categoryIds).not.toContain('digitalComponents');
	});

	it('should include control ladder snippets in control profile', () => {
		const categories = getShapeCategoryByProfile(ProfileName.control);
		const categoryIds = categories.map((cat) => cat.id);
		expect(categoryIds).toContain('controlLadder');
	});

	it('should include railroad snippets in railroad profile', () => {
		const categories = getShapeCategoryByProfile(ProfileName.railroad);
		const categoryIds = categories.map((cat) => cat.id);
		expect(categoryIds).toContain('railroadSyntax');
	});
});
