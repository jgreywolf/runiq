/**
 * Playwright visual regression tests for recent bug fixes.
 */

import { expect, test, type Page } from '@playwright/test';

function getSyntaxEditor(page: Page) {
	return page.locator('[data-value="syntax"] .cm-content');
}

async function resetEditor(page: Page) {
	await page.goto('/');
	await page.waitForSelector('.cm-editor', { state: 'visible' });
	const editor = getSyntaxEditor(page);
	await editor.click();
	await page.keyboard.press('Control+A');
	await page.keyboard.press('Delete');
}

test.describe('Bugfix regressions', () => {
	test.beforeEach(async ({ page }) => {
		await resetEditor(page);
	});

	test('01-container-padding-label-overlap', async ({ page }) => {
		const dsl = `diagram "Container Padding" {
  direction TB

  container "Backend Services" padding:20 {
    shape API as @rect label:"API Server"
    shape DB as @cylinder label:"Database"
    API -> DB
  }
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(2000);

		await expect(page).toHaveScreenshot('bugfix-01-container-padding-label-overlap.png', {
			maxDiffPixels: 600,
			maxDiffPixelRatio: 0.03,
			fullPage: true
		});
	});

	test('02-class-text-bounds', async ({ page }) => {
		const dsl = `diagram "Class Text Bounds" {
  direction TB

  shape Animal as @class label:"Animal"
    stereotype:"abstract"
    attributes:[
      {name:"name" type:"string" visibility:protected},
      {name:"age" type:"int" visibility:protected}
    ]
    methods:[
      {name:"eat" returnType:"void" visibility:public},
      {name:"sleep" returnType:"void" visibility:public},
      {name:"makeSound" returnType:"void" visibility:public abstract:true}
    ]
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(2000);

		await expect(page).toHaveScreenshot('bugfix-02-class-text-bounds.png', {
			maxDiffPixels: 600,
			maxDiffPixelRatio: 0.03,
			fullPage: true
		});
	});

	test('03-hover-selection-highlight', async ({ page }) => {
		const dsl = `diagram "Hover Highlight" {
  shape Focus as @rect label:"Hover Me"
  shape Other as @rect label:"Other"

  Focus -> Other
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(1500);

		await page.waitForSelector('svg [data-node-id="Focus"]');
		await page.locator('svg [data-node-id="Focus"]').hover();
		await page.waitForTimeout(300);

		await expect(page).toHaveScreenshot('bugfix-03-hover-selection-highlight.png', {
			maxDiffPixels: 600,
			maxDiffPixelRatio: 0.03,
			fullPage: true
		});
	});

	test('04-auto-contrast-text-color', async ({ page }) => {
		const dsl = `diagram "Auto Contrast" {
  shape darkNode as @rect label:"Dark" fillColor:"#111827"
  shape lightNode as @rect label:"Light" fillColor:"#f3f4f6"

  darkNode -> lightNode
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(1500);

		const darkText = page.locator('svg [data-node-id="darkNode"] text').first();
		const lightText = page.locator('svg [data-node-id="lightNode"] text').first();
		await expect(darkText).toHaveAttribute('fill', '#ffffff');
		await expect(lightText).toHaveAttribute('fill', '#0f172a');

		await expect(page).toHaveScreenshot('bugfix-04-auto-contrast-text-color.png', {
			maxDiffPixels: 500,
			fullPage: true
		});
	});

	test('05-pyramid-glyphset-positioning', async ({ page }) => {
		const dsl = `glyphset pyramidList "Project Phases" {
  item "Discovery"
  item "Design"
  item "Build"
  item "Launch"

  columns 1
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(2000);

		await expect(page).toHaveScreenshot('bugfix-05-pyramid-glyphset-positioning.png', {
			maxDiffPixels: 250,
			fullPage: true
		});
	});

	test('06-railroad-start-end-markers', async ({ page }) => {
		const dsl = `railroad "Marker Test" {
  theme ocean
  diagram Expr = "a" "b"
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(1500);

		const diagramSvg = page.locator('svg[data-id="runiq-diagram"]');
		await expect(diagramSvg).toHaveCount(1);

		const svgContent = await diagramSvg.evaluate((el) => el.outerHTML);
		expect(svgContent).toContain('railroad-arrow');

		const markerFillMatch = svgContent.match(
			/marker id="railroad-arrow"[\s\S]*?<path d="M0,0 L8,3 L0,6 Z" fill="([^"]+)"/
		);
		const circleFillMatch = svgContent.match(/<circle[^>]*r="4"[^>]*fill="([^"]+)"/);
		expect(markerFillMatch).not.toBeNull();
		expect(circleFillMatch).not.toBeNull();
		expect(markerFillMatch![1]).toBe(circleFillMatch![1]);
	});
});
