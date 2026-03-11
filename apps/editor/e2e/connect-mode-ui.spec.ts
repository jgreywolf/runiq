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

async function enterConnectMode(page: Page) {
	const connectButton = page.getByRole('button', { name: 'Connect Mode (C)' });
	await expect(connectButton).toBeVisible({ timeout: 60000 });
	await expect(connectButton).toBeEnabled({ timeout: 60000 });
	await connectButton.click();
	await expect(connectButton).toHaveClass(/active/);
}

test.describe('Connect mode UI', () => {
	test.beforeEach(async ({ page }) => {
		await resetEditor(page);
	});

	test('shows quick-connect handles and preview; Alt shows new-node ghost preview', async ({
		page
	}) => {
		const dsl = `diagram "Quick Connect" {
  shape a as @rectangle label:"Node A"
  shape b as @rectangle label:"Node B"
  a -> b
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(1200);

		await enterConnectMode(page);
		await expect(page.getByTestId('connect-mode-hint')).toContainText('Connect: Auto');

		await page.locator('svg [data-node-id="a"]').hover();
		await expect(page.locator('.quick-connect-handle')).toHaveCount(4);

		const rightHandle = page.locator('.quick-connect-handle[title*="right"]').first();
		await rightHandle.hover();
		await expect(page.locator('.quick-connect-preview-line')).toHaveCount(1);

		await page.keyboard.down('Alt');
		await rightHandle.hover();
		await expect(page.getByTestId('connect-mode-hint')).toContainText('Connect: New');
		await expect(page.locator('.quick-connect-new-node-preview')).toHaveCount(1);
		await page.keyboard.up('Alt');
		await rightHandle.hover();
		await expect(page.getByTestId('connect-mode-hint')).toContainText('Connect: Auto');
	});

	test('Shift forced-existing does not create a new node when no target exists', async ({ page }) => {
		const dsl = `diagram "Quick Connect Existing Only" {
  shape a as @rectangle label:"Node A" position:(140,120)
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(1200);

		await enterConnectMode(page);
		await page.locator('svg [data-node-id="a"]').hover();

		const rightHandle = page.locator('.quick-connect-handle[title*="right"]').first();
		await page.keyboard.down('Shift');
		await rightHandle.hover();
		await expect(page.getByTestId('connect-mode-hint')).toContainText('Connect: Existing');
		await page.keyboard.up('Shift');
		await rightHandle.hover();
		await expect(page.getByTestId('connect-mode-hint')).toContainText('Connect: Auto');
		await rightHandle.click({ modifiers: ['Shift'] });
		await page.waitForTimeout(250);

		const editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		const shapeCount = (editorContent.match(/\bshape\b/g) ?? []).length;
		const edgeCount = (editorContent.match(/->/g) ?? []).length;
		expect(shapeCount).toBe(1);
		expect(edgeCount).toBe(0);
	});

	test('Auto mode connects to existing target and inserts only edge DSL', async ({ page }) => {
		const dsl = `diagram "Quick Connect Auto" {
  shape a as @rectangle label:"Node A"
  shape b as @rectangle label:"Node B"
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(1200);

		await enterConnectMode(page);
		await page.locator('svg [data-node-id="a"]').hover();

		const handles = page.locator('.quick-connect-handle');
		const handleCount = await handles.count();
		let connectingHandleIndex = -1;
		for (let i = 0; i < handleCount; i++) {
			await handles.nth(i).hover();
			await page.waitForTimeout(120);
			const hasGhostPreview = (await page.locator('.quick-connect-new-node-preview').count()) > 0;
			if (!hasGhostPreview) {
				connectingHandleIndex = i;
				break;
			}
		}
		expect(connectingHandleIndex).toBeGreaterThanOrEqual(0);
		await handles.nth(connectingHandleIndex).click();
		await page.waitForTimeout(350);

		const editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('a -> b');
		const shapeCount = (editorContent.match(/\bshape\b/g) ?? []).length;
		expect(shapeCount).toBe(2);
	});
});
