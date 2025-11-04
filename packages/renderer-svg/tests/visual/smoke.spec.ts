import { test, expect } from '@playwright/test';
import { renderAndSetup, createShapeTestDiagram } from './utils';

test.describe('Visual Regression - Smoke Tests', () => {
	test('should render a simple rectangle', async ({ page }) => {
		const dsl = createShapeTestDiagram('rectangle', 'Hello World');
		await renderAndSetup(page, dsl);
		
		// Verify SVG is present
		const svg = page.locator('svg');
		await expect(svg).toBeVisible();
		
		// Take screenshot for visual comparison
		await expect(svg).toHaveScreenshot('smoke-rectangle.png');
	});
	
	test('should render a circle', async ({ page }) => {
		const dsl = createShapeTestDiagram('circle', 'Circle Test');
		await renderAndSetup(page, dsl);
		
		const svg = page.locator('svg');
		await expect(svg).toBeVisible();
		await expect(svg).toHaveScreenshot('smoke-circle.png');
	});
	
	test('should render a diagram with edges', async ({ page }) => {
		const dsl = `diagram "test" {
  shape box1 as @rectangle label: "Box 1"
  shape box2 as @rectangle label: "Box 2"
  edge box1 -> box2
}`;
		await renderAndSetup(page, dsl);
		
		const svg = page.locator('svg');
		await expect(svg).toBeVisible();
		await expect(svg).toHaveScreenshot('smoke-edges.png');
	});
});
