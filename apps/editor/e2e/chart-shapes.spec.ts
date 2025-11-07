/**
 * Playwright Visual Regression Tests for Phase 4: Chart Shapes
 * Tests line chart and radar chart rendering
 */

import { test, expect } from '@playwright/test';

test.describe('Phase 4: Chart Shapes - Visual Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Wait for editor to be ready
		await page.waitForSelector('.cm-editor', { state: 'visible' });
		// Clear the Syntax tab editor
		const syntaxEditor = page.locator('[data-value="syntax"] .cm-content');
		await syntaxEditor.click();
		await page.keyboard.press('Control+A');
		await page.keyboard.press('Delete');
	});

	test.describe('Line Charts', () => {
		test('01-line-chart-simple: Basic monthly sales data', async ({ page }) => {
			await test.step('Enter simple line chart diagram', async () => {
				const dsl = `diagram "Monthly Sales" {
  shape sales as @lineChart label:"Monthly Sales (2024)" data:[45, 52, 48, 61, 58, 65, 72, 68, 75, 80, 78, 85]
}`;
				await page.locator('.cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-01-line-chart-simple.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});

		test('02-line-chart-performance: Performance trend data', async ({ page }) => {
			await test.step('Enter performance line chart diagram', async () => {
				const dsl = `diagram "System Performance" {
  shape perf as @lineChart label:"System Performance Trend" data:[65, 68, 72, 70, 75, 78, 82, 80, 85, 88, 86, 90]
}`;
				await page.locator('.cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-02-line-chart-performance.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});

		test('03-line-chart-temperature: Temperature data with points', async ({ page }) => {
			await test.step('Enter temperature line chart diagram', async () => {
				const dsl = `diagram "Weekly Temperature" {
  shape temp as @lineChart label:"Weekly Temperature (°F)" data:[72, 75, 78, 76, 79, 82, 80]
}`;
				await page.locator('.cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-03-line-chart-temperature.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});
	});

	test.describe('Radar Charts', () => {
		test('04-radar-chart-simple: Character skill stats', async ({ page }) => {
			await test.step('Enter simple radar chart diagram', async () => {
				const dsl = `diagram "RPG Character" {
  shape skills as @radarChart label:"Warrior Stats" data:[90, 70, 40, 50, 60]
}`;
				await page.locator('.cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-04-radar-chart-simple.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});

		test('05-radar-chart-performance: System performance metrics', async ({ page }) => {
			await test.step('Enter system performance radar chart diagram', async () => {
				const dsl = `diagram "System Metrics" {
  shape metrics as @radarChart label:"System Performance" data:[80, 90, 70, 85, 75, 88]
}`;
				await page.locator('.cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-05-radar-chart-performance.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});

		test('06-radar-chart-quality: Product quality scores', async ({ page }) => {
			await test.step('Enter product quality radar chart diagram', async () => {
				const dsl = `diagram "Product Quality" {
  shape quality as @radarChart label:"Quality Assessment" data:[85, 92, 78, 88, 95, 82, 90]
}`;
				await page.locator('.cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-06-radar-chart-quality.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});

		test('07-radar-chart-tech-stack: Connected tech stack comparison', async ({ page }) => {
			await test.step('Enter tech stack radar chart diagram', async () => {
				const dsl = `diagram "Tech Stack Comparison" {
  shape frontend as @radarChart label:"Frontend Stack" data:[90, 85, 75, 80, 70]
  shape backend as @radarChart label:"Backend Stack" data:[85, 80, 90, 75, 85]
  
  edge frontend -> backend label:"API"
}`;
				await page.locator('.cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-07-radar-chart-tech-stack.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});
	});

	test.describe('Chart Integration', () => {
		test('08-mixed-charts: Line and radar charts together', async ({ page }) => {
			await test.step('Enter diagram with both chart types', async () => {
				const dsl = `diagram "Performance Dashboard" {
  shape trend as @lineChart label:"Monthly Trend" data:[60, 65, 70, 75, 80, 85]
  shape metrics as @radarChart label:"Current Metrics" data:[80, 75, 85, 70, 90]
  
  edge trend -> metrics label:"analysis"
}`;
				await page.locator('.cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-08-mixed-charts.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});
	});
});
