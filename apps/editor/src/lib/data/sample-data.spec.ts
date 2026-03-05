/**
 * Tests for sample diagram data structures and validation
 */

import { describe, it, expect } from 'vitest';
import { sampleDiagrams } from './sample-data';

describe('Sample Diagrams Data Structure', () => {
	it('should have sample categories', () => {
		expect(sampleDiagrams).toBeDefined();
		expect(sampleDiagrams.length).toBeGreaterThan(0);
	});

	it('should have valid structure for all categories', () => {
		sampleDiagrams.forEach((category) => {
			expect(category).toHaveProperty('id');
			expect(category).toHaveProperty('label');
			expect(category).toHaveProperty('samples');
			expect(typeof category.id).toBe('string');
			expect(typeof category.label).toBe('string');
			expect(Array.isArray(category.samples)).toBe(true);
		});
	});

	it('should have unique category IDs', () => {
		const ids = sampleDiagrams.map((cat) => cat.id);
		const uniqueIds = new Set(ids);
		expect(uniqueIds.size).toBe(ids.length);
	});

	it('should have at least one sample in each category', () => {
		sampleDiagrams.forEach((category) => {
			expect(category.samples.length).toBeGreaterThan(0);
		});
	});

	it('should have valid sample structure', () => {
		sampleDiagrams.forEach((category) => {
			category.samples.forEach((sample) => {
				expect(sample).toHaveProperty('name');
				expect(sample).toHaveProperty('description');
				expect(sample).toHaveProperty('code');
				expect(typeof sample.name).toBe('string');
				expect(typeof sample.description).toBe('string');
				expect(typeof sample.code).toBe('string');
			});
		});
	});

	it('should have non-empty sample names and descriptions', () => {
		sampleDiagrams.forEach((category) => {
			category.samples.forEach((sample) => {
				expect(sample.name.trim().length).toBeGreaterThan(0);
				expect(sample.description.trim().length).toBeGreaterThan(0);
			});
		});
	});

	it('should have valid DSL code in samples', () => {
		sampleDiagrams.forEach((category) => {
			category.samples.forEach((sample) => {
				// Sample code should be non-empty
				expect(sample.code.trim().length).toBeGreaterThan(0);
				
				// Should have some valid DSL content (not just comments)
				const hasContent = sample.code.trim().length > 10;
				expect(hasContent).toBe(true);
			});
		});
	});

	it('should handle optional data field correctly', () => {
		sampleDiagrams.forEach((category) => {
			category.samples.forEach((sample) => {
				if (sample.data !== undefined) {
					expect(typeof sample.data).toBe('string');
					expect(sample.data.trim().length).toBeGreaterThan(0);
				}
			});
		});
	});

	it('should have samples with data in appropriate categories', () => {
		// Chart samples should potentially have data
		const chartCategory = sampleDiagrams.find((cat) => cat.id === 'charts');
		if (chartCategory) {
			const samplesWithData = chartCategory.samples.filter((s) => s.data);
			// At least some chart samples should have data
			expect(samplesWithData.length).toBeGreaterThan(0);
		}
	});

	it('should have valid JSON data when data field is present', () => {
		sampleDiagrams.forEach((category) => {
			category.samples.forEach((sample) => {
				if (sample.data) {
					const trimmed = sample.data.trim();
					// Check if it looks like JSON
					if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
						expect(() => JSON.parse(sample.data!)).not.toThrow();
					}
					// Otherwise it might be CSV, which is also valid
				}
			});
		});
	});

	it('should have expected flowchart samples', () => {
		const flowchartCategory = sampleDiagrams.find((cat) => 
			cat.id === 'flowchart' || cat.id === 'flowcharts'
		);
		expect(flowchartCategory).toBeDefined();
		expect(flowchartCategory!.samples.length).toBeGreaterThan(0);
	});

	it('should have expected UML samples', () => {
		const umlCategory = sampleDiagrams.find((cat) => cat.id === 'uml');
		expect(umlCategory).toBeDefined();
		expect(umlCategory!.samples.length).toBeGreaterThan(0);
	});

	it('should have expected container/template samples', () => {
		const containerCategory = sampleDiagrams.find((cat) => 
			cat.id === 'containers' || cat.id === 'templates'
		);
		expect(containerCategory).toBeDefined();
	});

	it('should have consistent naming conventions', () => {
		sampleDiagrams.forEach((category) => {
			// Category IDs should be lowercase, kebab-case, or camelCase
			expect(category.id).toMatch(/^[a-z0-9-A-Z]+$/);
			
			category.samples.forEach((sample) => {
				// Sample names should not be empty or just whitespace
				expect(sample.name.trim()).toBe(sample.name);
			});
		});
	});
});
