/**
 * Playwright Visual Regression Tests for Railroad Diagrams
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

test.describe('Railroad Diagrams - Visual Tests', () => {
	test.beforeEach(async ({ page }) => {
		await resetEditor(page);
	});

	test('01-railroad-basic-sequence: Start/end markers and tokens', async ({ page }) => {
		const dsl = `railroad "Basic Markers" {
  theme ocean
  diagram Expr = "a" "b" "c"
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(1500);

		await expect(page).toHaveScreenshot('railroad-01-basic-sequence.png', {
			maxDiffPixels: 500,
			fullPage: true
		});
	});

	test('02-railroad-choices-and-loops: Choice + repetition', async ({ page }) => {
		const dsl = `railroad "Expr Grammar" {
  theme forest
  diagram Expr = Term (("+" | "-") Term)*
  diagram Term = Factor (("*" | "/") Factor)*
  diagram Factor = Number | "(" Expr ")"
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(1800);

		await expect(page).toHaveScreenshot('railroad-02-choices-loops.png', {
			maxDiffPixels: 500,
			fullPage: true
		});
	});
});
