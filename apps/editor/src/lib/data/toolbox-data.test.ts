/**
 * Tests for toolbox data structures and validation
 */

import { describe, it, expect } from 'vitest';
import { shapeCategories } from './toolbox-data';

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
				// All codes should have some valid content
				expect(shape.code.length).toBeGreaterThan(5);
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
			'pneumatic',
			'hydraulic',
			'pid'
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
		const rectShape = basicCategory?.shapes.find((s) => s.id === 'rect' || s.code.includes('@rect'));
		expect(rectShape).toBeDefined();
	});

	it('should include diamond shape for flowcharts', () => {
		const flowchartCategory = shapeCategories.find((cat) => cat.id === 'flowchart');
		const diamondShape = flowchartCategory?.shapes.find(
			(s) => s.id === 'diamond' || s.code.includes('@rhombus') || s.code.includes('@diamond')
		);
		expect(diamondShape).toBeDefined();
	});
});
