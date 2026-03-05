/**
 * Playwright Visual Regression Tests for Phase 4: Chart Shapes
 * Tests line chart and radar chart rendering
 */

import { expect, test } from '@playwright/test';

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
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-01-line-chart-simple.png', {
					maxDiffPixels: 500,
					fullPage: true
				});
			});
		});

		test('02-line-chart-performance: Performance trend data', async ({ page }) => {
			await test.step('Enter performance line chart diagram', async () => {
				const dsl = `diagram "System Performance" {
  shape perf as @lineChart label:"System Performance Trend" data:[65, 68, 72, 70, 75, 78, 82, 80, 85, 88, 86, 90]
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-02-line-chart-performance.png', {
					maxDiffPixels: 500,
					fullPage: true
				});
			});
		});

		test('03-line-chart-temperature: Temperature data with points', async ({ page }) => {
			await test.step('Enter temperature line chart diagram', async () => {
				const dsl = `diagram "Weekly Temperature" {
  shape temp as @lineChart label:"Weekly Temperature (°F)" data:[72, 75, 78, 76, 79, 82, 80]
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-03-line-chart-temperature.png', {
					maxDiffPixels: 500,
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
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-04-radar-chart-simple.png', {
					maxDiffPixels: 500,
					fullPage: true
				});
			});
		});

		test('05-radar-chart-performance: System performance metrics', async ({ page }) => {
			await test.step('Enter system performance radar chart diagram', async () => {
				const dsl = `diagram "System Metrics" {
  shape metrics as @radarChart label:"System Performance" data:[80, 90, 70, 85, 75, 88]
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-05-radar-chart-performance.png', {
					maxDiffPixels: 600,
					maxDiffPixelRatio: 0.03,
					fullPage: true
				});
			});
		});

		test('06-radar-chart-quality: Product quality scores', async ({ page }) => {
			await test.step('Enter product quality radar chart diagram', async () => {
				const dsl = `diagram "Product Quality" {
  shape quality as @radarChart label:"Quality Assessment" data:[85, 92, 78, 88, 95, 82, 90]
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-06-radar-chart-quality.png', {
					maxDiffPixels: 500,
					fullPage: true
				});
			});
		});

		test('07-radar-chart-tech-stack: Connected tech stack comparison', async ({ page }) => {
			await test.step('Enter tech stack radar chart diagram', async () => {
				const dsl = `diagram "Tech Stack Comparison" {
  shape frontend as @radarChart label:"Frontend Stack" data:[90, 85, 75, 80, 70]
  shape backend as @radarChart label:"Backend Stack" data:[85, 80, 90, 75, 85]
  
   frontend -> backend label:"API"
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-07-radar-chart-tech-stack.png', {
					maxDiffPixels: 500,
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
  
   trend -> metrics label:"analysis"
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-08-mixed-charts.png', {
					maxDiffPixels: 500,
					fullPage: true
				});
			});
		});
	});

	test.describe('Sankey Diagrams', () => {
		test('09-sankey-simple: Basic energy flow', async ({ page }) => {
			await test.step('Enter simple Sankey diagram', async () => {
				const dsl = `diagram "Energy Flow" {
  shape energy as @sankeyChart label:"Energy Distribution"
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Switch to Data tab and enter data', async () => {
				await page.click('[data-value="data"]');
				const dataEditor = page.locator('[data-value="data"] .cm-content');
				const data = `{
  "energy": {
    "nodes": [
      { "id": "Coal", "label": "Coal Power", "color": "#8B4513" },
      { "id": "Solar", "label": "Solar Energy", "color": "#FFD700" },
      { "id": "Grid", "label": "Power Grid", "color": "#32CD32" },
      { "id": "Homes", "label": "Residential", "color": "#FF69B4" }
    ],
    "links": [
      { "source": "Coal", "target": "Grid", "value": 300 },
      { "source": "Solar", "target": "Grid", "value": 100 },
      { "source": "Grid", "target": "Homes", "value": 380 }
    ]
  }
}`;
				await dataEditor.fill(data);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-09-sankey-simple.png', {
					maxDiffPixels: 500,
					fullPage: true
				});
			});
		});

		test('10-sankey-material-flow: Manufacturing material flow', async ({ page }) => {
			await test.step('Enter material flow Sankey diagram', async () => {
				const dsl = `diagram "Manufacturing" {
  shape materials as @sankeyChart label:"Production Material Flow"
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Switch to Data tab and enter data', async () => {
				await page.click('[data-value="data"]');
				const dataEditor = page.locator('[data-value="data"] .cm-content');
				const data = `{
  "materials": {
    "nodes": [
      { "id": "RawMat", "label": "Raw Materials" },
      { "id": "Proc1", "label": "Processing A" },
      { "id": "Proc2", "label": "Processing B" },
      { "id": "Assembly", "label": "Assembly" },
      { "id": "QA", "label": "Quality Check" },
      { "id": "Shipping", "label": "Shipping" },
      { "id": "Waste", "label": "Waste/Recycling" }
    ],
    "links": [
      { "source": "RawMat", "target": "Proc1", "value": 1000 },
      { "source": "RawMat", "target": "Proc2", "value": 800 },
      { "source": "Proc1", "target": "Assembly", "value": 900 },
      { "source": "Proc1", "target": "Waste", "value": 100 },
      { "source": "Proc2", "target": "Assembly", "value": 700 },
      { "source": "Proc2", "target": "Waste", "value": 100 },
      { "source": "Assembly", "target": "QA", "value": 1600 },
      { "source": "QA", "target": "Shipping", "value": 1500 },
      { "source": "QA", "target": "Waste", "value": 100 }
    ]
  }
}`;
				await dataEditor.fill(data);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-10-sankey-material-flow.png', {
					maxDiffPixels: 300,
					fullPage: true
				});
			});
		});

		test('11-sankey-colored-flows: Hot and cold water mixing', async ({ page }) => {
			await test.step('Enter colored flows Sankey diagram', async () => {
				const dsl = `diagram "Water Mixing" {
  shape flows as @sankeyChart label:"Hot & Cold Water Mixing"
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Switch to Data tab and enter data', async () => {
				await page.click('[data-value="data"]');
				const dataEditor = page.locator('[data-value="data"] .cm-content');
				const data = `{
  "flows": {
    "nodes": [
      { "id": "Hot", "label": "Hot Water", "color": "#e74c3c" },
      { "id": "Cold", "label": "Cold Water", "color": "#3498db" },
      { "id": "Mixed", "label": "Mixed Output", "color": "#9b59b6" }
    ],
    "links": [
      { "source": "Hot", "target": "Mixed", "value": 60, "color": "#e74c3c" },
      { "source": "Cold", "target": "Mixed", "value": 40, "color": "#3498db" }
    ]
  }
}`;
				await dataEditor.fill(data);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-11-sankey-colored-flows.png', {
					maxDiffPixels: 500,
					fullPage: true
				});
			});
		});

		test('12-sankey-conversion-funnel: E-commerce conversion flow', async ({ page }) => {
			await test.step('Enter conversion funnel Sankey diagram', async () => {
				const dsl = `diagram "Conversion Funnel" {
  shape funnel as @sankeyChart label:"E-commerce Conversion Flow"
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Switch to Data tab and enter data', async () => {
				await page.click('[data-value="data"]');
				const dataEditor = page.locator('[data-value="data"] .cm-content');
				const data = `{
  "funnel": {
    "nodes": [
      { "id": "Visitors", "label": "Website Visitors" },
      { "id": "Landing", "label": "Landing Page" },
      { "id": "Product", "label": "Product Page" },
      { "id": "Cart", "label": "Shopping Cart" },
      { "id": "Checkout", "label": "Checkout" },
      { "id": "Purchase", "label": "Purchase Complete" },
      { "id": "Bounce", "label": "Bounced" }
    ],
    "links": [
      { "source": "Visitors", "target": "Landing", "value": 10000 },
      { "source": "Landing", "target": "Product", "value": 6000 },
      { "source": "Landing", "target": "Bounce", "value": 4000 },
      { "source": "Product", "target": "Cart", "value": 3000 },
      { "source": "Product", "target": "Bounce", "value": 3000 },
      { "source": "Cart", "target": "Checkout", "value": 1500 },
      { "source": "Cart", "target": "Bounce", "value": 1500 },
      { "source": "Checkout", "target": "Purchase", "value": 1200 },
      { "source": "Checkout", "target": "Bounce", "value": 300 }
    ]
  }
}`;
				await dataEditor.fill(data);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-12-sankey-conversion-funnel.png', {
					maxDiffPixels: 600,
					maxDiffPixelRatio: 0.03,
					fullPage: true
				});
			});
		});

		test('13-sankey-budget-allocation: Budget distribution', async ({ page }) => {
			await test.step('Enter budget allocation Sankey diagram', async () => {
				const dsl = `diagram "Budget Flow" {
  shape budget as @sankeyChart label:"Annual Budget Allocation"
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Switch to Data tab and enter data', async () => {
				await page.click('[data-value="data"]');
				const dataEditor = page.locator('[data-value="data"] .cm-content');
				const data = `{
  "budget": {
    "nodes": [
      { "id": "Revenue", "label": "Total Revenue" },
      { "id": "OpEx", "label": "Operating Expenses" },
      { "id": "CapEx", "label": "Capital Expenses" },
      { "id": "Engineering", "label": "Engineering" },
      { "id": "Marketing", "label": "Marketing" },
      { "id": "Sales", "label": "Sales" },
      { "id": "Infrastructure", "label": "Infrastructure" },
      { "id": "RnD", "label": "R&D Projects" }
    ],
    "links": [
      { "source": "Revenue", "target": "OpEx", "value": 5000000 },
      { "source": "Revenue", "target": "CapEx", "value": 2000000 },
      { "source": "OpEx", "target": "Engineering", "value": 2000000 },
      { "source": "OpEx", "target": "Marketing", "value": 1500000 },
      { "source": "OpEx", "target": "Sales", "value": 1500000 },
      { "source": "CapEx", "target": "Infrastructure", "value": 1200000 },
      { "source": "CapEx", "target": "RnD", "value": 800000 }
    ]
  }
}`;
				await dataEditor.fill(data);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-13-sankey-budget-allocation.png', {
					maxDiffPixels: 600,
					maxDiffPixelRatio: 0.03,
					fullPage: true
				});
			});
		});

		test('14-sankey-single-node: Edge case - single node', async ({ page }) => {
			await test.step('Enter single node Sankey diagram', async () => {
				const dsl = `diagram "Single Node Test" {
  shape single as @sankeyChart label:"Single Node"
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Switch to Data tab and enter data', async () => {
				await page.click('[data-value="data"]');
				const dataEditor = page.locator('[data-value="data"] .cm-content');
				const data = `{
  "single": {
    "nodes": [
      { "id": "Only", "label": "Single Node", "color": "#3498db" }
    ],
    "links": []
  }
}`;
				await dataEditor.fill(data);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-14-sankey-single-node.png', {
					maxDiffPixels: 600,
					maxDiffPixelRatio: 0.03,
					fullPage: true
				});
			});
		});

		test('15-sankey-complex-energy-grid: Multi-layer energy distribution', async ({ page }) => {
			await test.step('Enter complex energy grid Sankey diagram', async () => {
				const dsl = `diagram "Energy Grid" {
  shape energy as @sankeyChart label:"Energy Distribution Network"
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Switch to Data tab and enter data', async () => {
				await page.click('[data-value="data"]');
				const dataEditor = page.locator('[data-value="data"] .cm-content');
				const data = `{
  "energy": {
    "nodes": [
      { "id": "Coal", "label": "Coal", "color": "#8B4513" },
      { "id": "Gas", "label": "Natural Gas", "color": "#4682B4" },
      { "id": "Solar", "label": "Solar", "color": "#FFD700" },
      { "id": "Wind", "label": "Wind", "color": "#87CEEB" },
      { "id": "Power", "label": "Power Plant", "color": "#DC143C" },
      { "id": "Grid", "label": "Grid", "color": "#32CD32" },
      { "id": "Residential", "label": "Residential", "color": "#FF69B4" },
      { "id": "Industrial", "label": "Industrial", "color": "#FF8C00" }
    ],
    "links": [
      { "source": "Coal", "target": "Power", "value": 300 },
      { "source": "Gas", "target": "Power", "value": 200 },
      { "source": "Solar", "target": "Grid", "value": 100 },
      { "source": "Wind", "target": "Grid", "value": 80 },
      { "source": "Power", "target": "Grid", "value": 480 },
      { "source": "Grid", "target": "Residential", "value": 250 },
      { "source": "Grid", "target": "Industrial", "value": 310 }
    ]
  }
}`;
				await dataEditor.fill(data);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase4-15-sankey-complex-energy-grid.png', {
					maxDiffPixels: 600,
					maxDiffPixelRatio: 0.03,
					fullPage: true
				});
			});
		});
	});
});
