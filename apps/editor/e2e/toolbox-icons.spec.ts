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

test.describe('Toolbox icon rendering', () => {
	test.beforeEach(async ({ page }) => {
		await resetEditor(page);
	});

	test('diagram toolbox shows icon previews with consistent footprint', async ({ page }) => {
		const dsl = `diagram "Icon Smoke" {
  shape a as @rectangle label:"A"
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(1200);

		// Expand all shape categories so icon wrappers are visible in the DOM.
		const categoryTriggers = page.locator('[data-slot="accordion-trigger"]');
		const triggerCount = await categoryTriggers.count();
		for (let i = 0; i < triggerCount; i++) {
			await categoryTriggers.nth(i).click();
		}

		const iconWrappers = page.locator('.shape-icon-wrapper:visible');
		await expect(iconWrappers.first()).toBeVisible();
		const iconCount = await iconWrappers.count();
		expect(iconCount).toBeGreaterThan(20);

		const firstIconBox = iconWrappers.first();
		const box = await firstIconBox.boundingBox();
		expect(box).not.toBeNull();
		expect(Math.round(box!.width)).toBeGreaterThanOrEqual(20);
		expect(Math.round(box!.height)).toBeGreaterThanOrEqual(20);

		await expect(iconWrappers.first()).toHaveScreenshot(
			'toolbox-icon-first-preview.png',
			{ maxDiffPixels: 100 }
		);
	});
});
