import { describe, it, expect } from 'vitest';

describe('Data injection for charts', () => {
	it('should extract labels and data from JSON with string and numeric fields', () => {
		const testData = [
			{ skill: 'JavaScript', level: 85 },
			{ skill: 'TypeScript', level: 72 },
			{ skill: 'React', level: 90 }
		];

		const firstObj = testData[0];
		const keys = Object.keys(firstObj);

		// Find first numeric property for values
		const numericKey = keys.find((k) => typeof firstObj[k as keyof typeof firstObj] === 'number');
		// Find first string property for labels
		const labelKey = keys.find((k) => typeof firstObj[k as keyof typeof firstObj] === 'string');

		expect(numericKey).toBe('level');
		expect(labelKey).toBe('skill');

		const chartData = testData.map((item) => item[numericKey as keyof typeof item]);
		const chartLabels = testData.map((item) => item[labelKey as keyof typeof item]);

		expect(chartData).toEqual([85, 72, 90]);
		expect(chartLabels).toEqual(['JavaScript', 'TypeScript', 'React']);
	});

	it('should handle data with only numeric fields', () => {
		const testData = [
			{ q1: 100, q2: 120 },
			{ q1: 110, q2: 130 }
		];

		const firstObj = testData[0];
		const keys = Object.keys(firstObj);

		const numericKey = keys.find((k) => typeof firstObj[k as keyof typeof firstObj] === 'number');
		const labelKey = keys.find((k) => typeof firstObj[k as keyof typeof firstObj] === 'string');

		expect(numericKey).toBe('q1'); // Should find first numeric
		expect(labelKey).toBeUndefined(); // No string fields

		const chartData = testData.map((item) => item[numericKey as keyof typeof item]);
		expect(chartData).toEqual([100, 110]);
	});

	it('should generate correct DSL with labels', () => {
		const chartLabels = ['JavaScript', 'TypeScript', 'React'];
		const chartData = [85, 72, 90];

		const dataStr = JSON.stringify(chartData);
		const labelsStr = JSON.stringify(chartLabels);

		const withoutData = 'label:"Team Skills" showGrid:true';
		const newProps = `${withoutData} labels:${labelsStr} data:${dataStr}`;

		expect(newProps).toContain('labels:["JavaScript","TypeScript","React"]');
		expect(newProps).toContain('data:[85,72,90]');

		const shapeDecl = `shape skills as @radarChart ${newProps}`;
		expect(shapeDecl).toBe(
			'shape skills as @radarChart label:"Team Skills" showGrid:true labels:["JavaScript","TypeScript","React"] data:[85,72,90]'
		);
	});
});
