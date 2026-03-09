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

		const kickoffNode = page.locator('svg [data-node-id="kickoff"]').first();
		await expect(kickoffNode).toBeVisible({ timeout: 10000 });
		await kickoffNode.dispatchEvent('contextmenu', { bubbles: true, cancelable: true, button: 2 });
		const menu = page.locator('.canvas-context-menu:visible').first();
		await expect(menu.getByRole('button', { name: 'Duplicate' })).toBeVisible();
		await menu.getByRole('button', { name: 'Duplicate' }).dispatchEvent('click');
		await page.waitForTimeout(250);

		let editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('event kickoff_copy');

		const alphaNode = page.locator('svg [data-node-id="alpha"]').first();
		await expect(alphaNode).toBeVisible({ timeout: 10000 });
		await alphaNode.dispatchEvent('contextmenu', { bubbles: true, cancelable: true, button: 2 });
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

	test('timeline inline edit persists label on Enter', async ({ page }) => {
		const dsl = `timeline "Launch" {
  event kickoff date:"2024-01-15" label:"Kickoff"
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(700);

		await page
			.locator('svg [data-node-id="kickoff"]')
			.dispatchEvent('dblclick', { bubbles: true, cancelable: true });
		const editInput = page.locator('input.edit-input');
		await expect(editInput).toBeVisible();
		await editInput.fill('Kickoff Updated');
		await editInput.press('Enter');
		await page.waitForTimeout(250);

		const editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('label:"Kickoff Updated"');
	});

	test('sequence floating toolbar edits participant and message fields', async ({
		page
	}) => {
		const dsl = `sequence "Auth Flow" {
  participant "User" as actor
  participant "App" as entity
  message from:"User" to:"App" label:"Login" type:sync
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(900);

		const participantNode = page.locator('svg [data-node-id="seq-participant-user"]').first();
		await expect(participantNode).toBeVisible({ timeout: 10000 });
		await participantNode.dispatchEvent('click', { bubbles: true, cancelable: true });
		const toolbar = page.locator('.sequence-toolbar:visible').first();
		await expect(toolbar).toBeVisible();
		await toolbar.getByRole('button', { name: 'Details' }).dispatchEvent('click');

		let flyout = page
			.locator('.canvas-context-menu:visible')
			.filter({ hasText: 'Edit sequence participant' })
			.first();
		await expect(flyout).toBeVisible();
		await flyout.locator('label:has-text("Participant type") select').selectOption('boundary');
		await flyout.getByRole('button', { name: 'Apply' }).dispatchEvent('click');
		await page.waitForTimeout(250);

		let editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('participant "User" as boundary');

		const messageEdge = page.locator('svg [data-edge-id="seq-message-0"]').first();
		await expect(messageEdge).toBeVisible({ timeout: 10000 });
		await messageEdge.dispatchEvent('click', { bubbles: true, cancelable: true });

		await expect(toolbar).toBeVisible();
		await toolbar.getByRole('button', { name: 'Details' }).dispatchEvent('click');

		flyout = page
			.locator('.canvas-context-menu:visible')
			.filter({ hasText: 'Edit sequence message' })
			.first();
		await expect(flyout).toBeVisible();
		await flyout.locator('label:has-text("Label") input').fill('Submit Login');
		await flyout.locator('label:has-text("Type") select').selectOption('async');
		await flyout.locator('label:has-text("Guard") input').fill('isValid');
		await flyout.locator('label:has-text("Timing") input').fill('t < 50ms');
		await flyout.getByRole('button', { name: 'Apply' }).dispatchEvent('click');
		await page.waitForTimeout(250);

		editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('label:"Submit Login"');
		expect(editorContent).toContain('type:async');
		expect(editorContent).toContain('guard:"isValid"');
		expect(editorContent).toContain('timing:"t < 50ms"');
	});

	test('sequence message activation checkbox persists from toolbar', async ({ page }) => {
		const dsl = `sequence "Auth Flow" {
  participant "User" as actor
  participant "App" as entity
  message from:"User" to:"App" label:"Login" type:sync activate:false
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(900);

		const messageEdge = page.locator('svg [data-edge-id="seq-message-0"]').first();
		await expect(messageEdge).toBeVisible({ timeout: 10000 });
		await messageEdge.click();

		const toolbar = page.locator('.sequence-toolbar:visible').first();
		await expect(toolbar).toBeVisible();
		const activateCheckbox = toolbar.locator('label.sequence-inline-check input[type="checkbox"]');
		await activateCheckbox.check();
		await page.waitForTimeout(250);

		const editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('activate:true');
	});

	test.fixme('sequence message drag shows reorder preview guide', async ({ page }) => {
		const dsl = `sequence "Auth Flow" {
  participant "User" as actor
  participant "App" as entity
  participant "DB" as database
  message from:"User" to:"App" label:"M1" type:sync
  message from:"App" to:"DB" label:"M2" type:sync
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(1100);

		const m2Label = page.locator('svg [data-edge-id="seq-message-1"] text.message-text').first();
		const m1Label = page.locator('svg [data-edge-id="seq-message-0"] text.message-text').first();
		await expect(m2Label).toBeVisible({ timeout: 10000 });
		await expect(m1Label).toBeVisible({ timeout: 10000 });
		const m2Box = await m2Label.boundingBox();
		const m1Box = await m1Label.boundingBox();
		expect(m2Box).not.toBeNull();
		expect(m1Box).not.toBeNull();
		await page.mouse.move((m2Box?.x ?? 0) + 20, (m2Box?.y ?? 0) + (m2Box?.height ?? 0) / 2);
		await page.mouse.down();
		await page.mouse.move((m1Box?.x ?? 0) + 20, (m1Box?.y ?? 0) - 30, { steps: 12 });
		await expect(page.locator('.sequence-reorder-guide-horizontal')).toBeVisible();
		await expect(page.locator('.sequence-reorder-badge-horizontal')).toContainText('Insert');
		await page.mouse.up();
	});

	test('sequence note supports inline label editing', async ({ page }) => {
		const dsl = `sequence "Auth Flow" {
  participant "User" as actor
  participant "App" as entity
  note "Original note" position:right participants:("App")
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(900);

		const noteNode = page.locator('svg [data-node-id="seq-note-0"]').first();
		await expect(noteNode).toBeVisible({ timeout: 10000 });
		await noteNode.dispatchEvent('dblclick', { bubbles: true, cancelable: true });
		const editInput = page.locator('input.edit-input');
		await expect(editInput).toBeVisible();
		await editInput.fill('Updated note');
		await editInput.press('Enter');
		await page.waitForTimeout(250);

		const editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('note "Updated note"');
	});
});
