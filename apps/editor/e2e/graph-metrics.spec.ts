/**
 * Playwright E2E tests for Graph Metrics Visualization
 * Tests metric badge display, positioning, and different metric types
 */

import { test, expect } from '@playwright/test';

test.describe('Graph Metrics Visualization', () => {
	test('Should display degree centrality metrics on social network', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Load the social network example
		await page.getByRole('tab', { name: 'Sample Diagrams' }).click();
		await page.waitForTimeout(500);
		await page.getByRole('button', { name: /Network Analysis/ }).click();
		await page.getByRole('button', { name: 'Social Network (Degree)' }).click();

		// Wait for diagram to render
		await page.waitForTimeout(2000);

		// Wait for the diagram SVG (not UI icons) - it's inside the preview panel
		const diagramContainer = page.locator('.rounded-lg.border.border-neutral-300.bg-white');
		await diagramContainer.waitFor({ state: 'visible' });

		// Check for metric badges
		const badges = diagramContainer.locator('.runiq-metric-badge');
		await expect(badges).toHaveCount(6); // 6 nodes in social network

		// Check that degree values are displayed
		const svgContent = await diagramContainer.locator('svg').textContent();
		expect(svgContent).toContain('D:'); // Degree metric label

		// Visual snapshot
		await expect(page).toHaveScreenshot('graph-metrics-01-social-degree.png', {
			maxDiffPixels: 250,
			fullPage: true
		});
	});

	test('Should display betweenness centrality on citation network', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await page.getByRole('tab', { name: 'Sample Diagrams' }).click();
		await page.waitForTimeout(500);
		await page.getByRole('button', { name: /Network Analysis/ }).click();
		await page.getByRole('button', { name: 'Citation Network (Betweenness)' }).click();

		await page.waitForTimeout(2000);

		const diagramContainer = page.locator('.rounded-lg.border.border-neutral-300.bg-white');
		await diagramContainer.waitFor({ state: 'visible' });

		// Check for metric badges
		const badges = diagramContainer.locator('.runiq-metric-badge');
		await expect(badges).toHaveCount(7); // 7 papers

		// Check that betweenness values are displayed
		const svgContent = await diagramContainer.locator('svg').textContent();
		expect(svgContent).toContain('B:'); // Betweenness metric label

		// Visual snapshot
		await expect(page).toHaveScreenshot('graph-metrics-02-citation-betweenness.png', {
			maxDiffPixels: 250,
			fullPage: true
		});
	});

	test('Should display closeness centrality on infrastructure network', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await page.getByRole('tab', { name: 'Sample Diagrams' }).click();
		await page.waitForTimeout(500);
		await page.getByRole('button', { name: /Network Analysis/ }).click();
		await page.getByRole('button', { name: 'Infrastructure (Closeness)' }).click();

		await page.waitForTimeout(2000);

		const diagramContainer = page.locator('.rounded-lg.border.border-neutral-300.bg-white');
		await diagramContainer.waitFor({ state: 'visible' });

		// Check for metric badges
		const badges = diagramContainer.locator('.runiq-metric-badge');
		await expect(badges).toHaveCount(8); // 8 servers

		// Check that closeness values are displayed
		const svgContent = await diagramContainer.locator('svg').textContent();
		expect(svgContent).toContain('C:'); // Closeness metric label

		// Visual snapshot
		await expect(page).toHaveScreenshot('graph-metrics-03-infrastructure-closeness.png', {
			maxDiffPixels: 250,
			fullPage: true
		});
	});

	test('Should position metric badges correctly', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Create diagram with different badge positions
		const syntax = `diagram "Badge Positions" {
  shape a as @circle label: "Top-Right" showMetrics: true metricPosition: top-right
  shape b as @circle label: "Top-Left" showMetrics: true metricPosition: top-left
  shape c as @circle label: "Bottom-Right" showMetrics: true metricPosition: bottom-right
  shape d as @circle label: "Bottom-Left" showMetrics: true metricPosition: bottom-left
  
  a -> b
  b -> c
  c -> d
  d -> a
}`;

		// Type into syntax editor
		const editor = page.locator('[data-value="syntax"] .cm-content');
		await editor.click();
		await page.keyboard.press('Control+A');
		await editor.fill(syntax);

		await page.waitForTimeout(2000);

		const diagramContainer = page.locator('.rounded-lg.border.border-neutral-300.bg-white');
		await diagramContainer.waitFor({ state: 'visible' });

		// Check all badges are rendered
		const badges = diagramContainer.locator('.runiq-metric-badge');
		await expect(badges).toHaveCount(4);

		// Visual snapshot to verify positioning
		await expect(page).toHaveScreenshot('graph-metrics-04-badge-positions.png', {
			maxDiffPixels: 250,
			fullPage: true
		});
	});

	test('Should handle mixed metric types', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const syntax = `diagram "Mixed Metrics" {
  shape a as @circle label: "Degree" showMetrics: true metricType: degree
  shape b as @circle label: "Betweenness" showMetrics: true metricType: betweenness
  shape c as @circle label: "Closeness" showMetrics: true metricType: closeness
  shape d as @circle label: "Clustering" showMetrics: true metricType: clustering
  
  a -> b
  b -> c
  c -> d
  d -> a
  a -> c
  b -> d
}`;

		const editor = page.locator('[data-value="syntax"] .cm-content');
		await editor.click();
		await page.keyboard.press('Control+A');
		await editor.fill(syntax);

		await page.waitForTimeout(2000);

		const diagramContainer = page.locator('.rounded-lg.border.border-neutral-300.bg-white');
		await diagramContainer.waitFor({ state: 'visible' });

		const svgContent = await diagramContainer.locator('svg').textContent();

		// Verify all metric types are present
		expect(svgContent).toContain('D:'); // Degree
		expect(svgContent).toContain('B:'); // Betweenness
		expect(svgContent).toContain('C:'); // Closeness
		expect(svgContent).toContain('CC:'); // Clustering Coefficient

		// Visual snapshot
		await expect(page).toHaveScreenshot('graph-metrics-05-mixed-types.png', {
			maxDiffPixels: 250,
			fullPage: true
		});
	});

	test('Should not display badges when showMetrics is false', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const syntax = `diagram "No Metrics" {
  shape a as @circle label: "A"
  shape b as @circle label: "B"
  shape c as @circle label: "C"
  
  a -> b
  b -> c
}`;

		const editor = page.locator('[data-value="syntax"] .cm-content');
		await editor.click();
		await page.keyboard.press('Control+A');
		await editor.fill(syntax);

		await page.waitForTimeout(2000);
		await page.waitForSelector('svg', { state: 'visible' });

		// Should not have any metric badges
		const badges = page.locator('.runiq-metric-badge');
		await expect(badges).toHaveCount(0);
	});
});
