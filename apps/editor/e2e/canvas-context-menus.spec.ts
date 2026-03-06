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

async function getCanvas(page: Page) {
	const canvas = page.locator('div.relative.flex-1.overflow-hidden.bg-white[tabindex="0"]');
	await expect(canvas).toBeVisible();
	return canvas;
}

test.describe('Visual canvas context menus', () => {
	test.beforeEach(async ({ page }) => {
		await resetEditor(page);
	});

	test('opens empty-canvas menu and inserts text block', async ({ page }) => {
		const dsl = `diagram "Context Menu" {
  shape a as @rectangle label:"A"
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(900);

		const canvas = await getCanvas(page);
		const box = await canvas.boundingBox();
		expect(box).not.toBeNull();
		await canvas.click({
			button: 'right',
			position: {
				x: Math.max(40, Math.floor((box?.width ?? 200) * 0.7)),
				y: Math.max(60, Math.floor((box?.height ?? 200) * 0.7))
			}
		});

		const menu = page.locator('.canvas-context-menu:visible').first();
		await expect(menu).toBeVisible();
		await expect(menu.getByRole('button', { name: 'Add Text' })).toBeVisible();

		await menu.getByRole('button', { name: 'Add Text' }).dispatchEvent('click');
		await page.waitForTimeout(300);

		const editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('@textBlock');
	});

	test('opens element menu and duplicates selected node', async ({ page }) => {
		const dsl = `diagram "Element Menu" {
  shape a as @rectangle label:"Node A"
  shape b as @rectangle label:"Node B"
  a -> b
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(1000);

		await page.locator('svg [data-node-id="a"]').click({ button: 'right' });

		const menu = page.locator('.canvas-context-menu:visible').first();
		await expect(menu).toBeVisible();
		await expect(menu.getByRole('button', { name: 'Duplicate' })).toBeVisible();

		await menu.getByRole('button', { name: 'Duplicate' }).dispatchEvent('click');
		await page.waitForTimeout(350);

		const editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		const shapeCount = (editorContent.match(/\bshape\b/g) ?? []).length;
		expect(shapeCount).toBeGreaterThanOrEqual(3);
		expect(editorContent).toContain('Copy');
	});

	test('timeline element context menu can duplicate and delete events', async ({ page }) => {
		const dsl = `timeline "Launch" {
  event kickoff date:"2024-01-15" label:"Kickoff"
  event alpha date:"2024-02-01" label:"Alpha"
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(900);

		await page
			.locator('svg [data-node-id="kickoff"]')
			.dispatchEvent('contextmenu', { bubbles: true, cancelable: true, button: 2 });
		const menu = page.locator('.canvas-context-menu:visible').first();
		await expect(menu.getByRole('button', { name: 'Duplicate' })).toBeVisible();
		await menu.getByRole('button', { name: 'Duplicate' }).dispatchEvent('click');
		await page.waitForTimeout(250);

		let editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('event kickoff_copy');

		await page
			.locator('svg [data-node-id="alpha"]')
			.dispatchEvent('contextmenu', { bubbles: true, cancelable: true, button: 2 });
		const deleteMenu = page.locator('.canvas-context-menu:visible').first();
		await expect(deleteMenu.getByRole('button', { name: 'Delete' })).toBeVisible();
		await deleteMenu.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
		await page.waitForTimeout(250);

		editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).not.toContain('event alpha ');
	});

	test('timeline empty canvas opens context menu with theme actions', async ({ page }) => {
		const dsl = `timeline "Launch" {
  event kickoff date:"2024-01-15" label:"Kickoff"
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(700);

		const canvas = await getCanvas(page);
		const box = await canvas.boundingBox();
		expect(box).not.toBeNull();
		await canvas.click({
			button: 'right',
			position: {
				x: Math.max(40, Math.floor((box?.width ?? 200) * 0.75)),
				y: Math.max(40, Math.floor((box?.height ?? 200) * 0.75))
			}
		});

		const menu = page.locator('.canvas-context-menu:visible').first();
		await expect(menu).toBeVisible();
		await expect(menu.getByRole('button', { name: 'Select Mode' })).toBeVisible();
		await expect(menu.getByText('Theme')).toBeVisible();
	});
});
