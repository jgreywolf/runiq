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

	test('sequence message drag reorders statements', async ({ page }) => {
		const dsl = `sequence "Auth Flow" {
  participant "User" as actor
  participant "App" as entity
  participant "DB" as database
  message from:"User" to:"App" label:"M1" type:sync
  message from:"App" to:"DB" label:"M2" type:sync
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(1100);

		const m2Edge = page.locator('svg [data-edge-id="seq-message-1"]').first();
		const m1Edge = page.locator('svg [data-edge-id="seq-message-0"]').first();
		await expect(m2Edge).toBeVisible({ timeout: 10000 });
		await expect(m1Edge).toBeVisible({ timeout: 10000 });
		const m2Point = await m2Edge.evaluate((edge) => {
			const line = edge.querySelector('line.message-hit-area') as SVGLineElement | null;
			if (!line) return null;
			const rect = line.getBoundingClientRect();
			return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
		});
		const m1Point = await m1Edge.evaluate((edge) => {
			const line = edge.querySelector('line.message-hit-area') as SVGLineElement | null;
			if (!line) return null;
			const rect = line.getBoundingClientRect();
			return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
		});
		expect(m2Point).not.toBeNull();
		expect(m1Point).not.toBeNull();
		await page.mouse.move(m2Point?.x ?? 0, m2Point?.y ?? 0);
		await page.mouse.down();
		await page.mouse.move(m1Point?.x ?? 0, (m1Point?.y ?? 0) - 70, { steps: 18 });
		await page.mouse.up();

		const editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		const m2Index = editorContent.indexOf('label:"M2"');
		const m1Index = editorContent.indexOf('label:"M1"');
		expect(m2Index).toBeGreaterThan(-1);
		expect(m1Index).toBeGreaterThan(-1);
		expect(m2Index).toBeLessThan(m1Index);
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

	test('electrical part context menu edits, duplicates, and deletes part', async ({ page }) => {
		const dsl = `electrical "RC Filter" {
  net IN, OUT, GND
  part R1 type:R value:"10k" pins:(IN,OUT)
  part C1 type:C value:"1n" pins:(OUT,GND)
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(1000);

		const resistorNode = page.locator('svg [data-node-id="sch-part-R1"]').first();
		await expect(resistorNode).toBeVisible({ timeout: 10000 });
		await resistorNode.dispatchEvent('contextmenu', { bubbles: true, cancelable: true, button: 2 });

		let menu = page.locator('.canvas-context-menu:visible').first();
		await expect(menu).toBeVisible();
		await menu.getByRole('button', { name: 'Edit Details' }).dispatchEvent('click');

		let flyout = page
			.locator('.canvas-context-menu:visible')
			.filter({ hasText: 'Edit part' })
			.first();
		await expect(flyout).toBeVisible();
		await flyout.locator('label:has-text("Value") input').fill('22k');
		await flyout.getByRole('button', { name: 'Apply' }).dispatchEvent('click');
		await page.waitForTimeout(250);

		let editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('part R1 type:R value:"22k" pins:(IN,OUT)');

		await resistorNode.dispatchEvent('contextmenu', { bubbles: true, cancelable: true, button: 2 });
		menu = page.locator('.canvas-context-menu:visible').first();
		await menu.getByRole('button', { name: 'Duplicate' }).dispatchEvent('click');
		await page.waitForTimeout(250);

		editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('part R1_copy');

		const capacitorNode = page.locator('svg [data-node-id="sch-part-C1"]').first();
		await expect(capacitorNode).toBeVisible({ timeout: 10000 });
		await capacitorNode.dispatchEvent('contextmenu', { bubbles: true, cancelable: true, button: 2 });
		menu = page.locator('.canvas-context-menu:visible').first();
		await menu.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
		await page.waitForTimeout(250);

		editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).not.toContain('part C1 type:C');
	});

	test('electrical toolbar adds part and net', async ({ page }) => {
		const dsl = `electrical "Starter" {
  net IN, OUT
  part R1 type:R value:"10k" pins:(IN,OUT)
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(900);

		const addPartButton = page.getByRole('button', { name: 'Add Electrical Part' });
		await expect(addPartButton).toBeVisible();
		await addPartButton.click();
		await page.waitForTimeout(250);

		let editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('part R2 type:R value:"1k"');

		const addNetButton = page.getByRole('button', { name: 'Add Electrical Net' });
		await expect(addNetButton).toBeVisible();
		await addNetButton.click();
		await page.waitForTimeout(250);

		editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('net N1');
	});

	test('electrical selection toolbar edits part fields inline', async ({ page }) => {
		const dsl = `electrical "Inline Edit" {
  net IN, OUT, GND
  part R1 type:R value:"10k" pins:(IN,OUT)
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(900);

		const resistorNode = page.locator('svg [data-node-id="sch-part-R1"]').first();
		await expect(resistorNode).toBeVisible({ timeout: 10000 });
		await resistorNode.click();

		const toolbar = page.locator('.sequence-toolbar:visible').first();
		await expect(toolbar).toBeVisible();
		const valueInput = toolbar.locator('label:has-text("Value") input').first();
		await expect(valueInput).toBeVisible();
		await valueInput.fill('47k');
		await valueInput.blur();
		await page.waitForTimeout(250);

		const editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('part R1 type:R value:"47k" pins:(IN,OUT)');
	});

	test('hvac toolbar adds part and net', async ({ page }) => {
		const dsl = `hvac "Simple Loop" {
  net SUPPLY, RETURN
  part F1 type:fan value:"1200cfm" pins:(SUPPLY,RETURN)
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(900);

		const addPartButton = page.getByRole('button', { name: 'Add HVAC Part' });
		await expect(addPartButton).toBeVisible();
		await addPartButton.click();
		await page.waitForTimeout(250);

		let editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('part R1 type:R value:"1k"');

		const addNetButton = page.getByRole('button', { name: 'Add HVAC Net' });
		await expect(addNetButton).toBeVisible();
		await addNetButton.click();
		await page.waitForTimeout(250);

		editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('net N1');
	});

	test('pneumatic selection toolbar edits part fields inline', async ({ page }) => {
		const dsl = `pneumatic "Air Loop" {
  net SUPPLY, RETURN
  part V1 type:R value:"2-way" pins:(SUPPLY,RETURN)
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(900);

		const partNode = page.locator('svg [data-node-id="sch-part-V1"]').first();
		await expect(partNode).toBeVisible({ timeout: 10000 });
		await partNode.click();

		const toolbar = page.locator('.sequence-toolbar:visible').first();
		await expect(toolbar).toBeVisible();
		const modelInput = toolbar.locator('label:has-text("Model") input').first();
		await expect(modelInput).toBeVisible();
		await modelInput.fill('ValveModel-A');
		await modelInput.blur();
		await page.waitForTimeout(250);

		const editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('model:"ValveModel-A"');
	});

	test('hydraulic toolbar adds part and net', async ({ page }) => {
		const dsl = `hydraulic "Power Loop" {
  net P, T
  part P1 type:R value:"100bar" pins:(P,T)
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(900);

		const addPartButton = page.getByRole('button', { name: 'Add Hydraulic Part' });
		await expect(addPartButton).toBeVisible();
		await addPartButton.click();
		await page.waitForTimeout(250);

		let editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('part R1 type:R value:"1k"');

		const addNetButton = page.getByRole('button', { name: 'Add Hydraulic Net' });
		await expect(addNetButton).toBeVisible();
		await addNetButton.click();
		await page.waitForTimeout(250);

		editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('net N1');
	});

	test('control selection toolbar edits part fields inline', async ({ page }) => {
		const dsl = `control "PLC Panel" {
  net L1, L2
  part K1 type:R value:"coil" pins:(L1,L2)
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(900);

		const partNode = page.locator('svg [data-node-id="sch-part-K1"]').first();
		await expect(partNode).toBeVisible({ timeout: 10000 });
		await partNode.dispatchEvent('click', { bubbles: true, cancelable: true });

		const toolbar = page.locator('.sequence-toolbar:visible').first();
		await expect(toolbar).toBeVisible();
		const sourceInput = toolbar.locator('label:has-text("Source") input').first();
		await expect(sourceInput).toBeVisible();
		await sourceInput.fill('LineFeed');
		await sourceInput.blur();
		await page.waitForTimeout(250);

		const editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		expect(editorContent).toContain('source:"LineFeed"');
	});

	test('electrical drag/drop reorders parts', async ({ page }) => {
		const dsl = `electrical "Drag Parts" {
  net IN, MID, OUT
  part R1 type:R value:"10k" pins:(IN,MID)
  part R2 type:R value:"22k" pins:(MID,OUT)
}`;
		await getSyntaxEditor(page).fill(dsl);
		await page.waitForTimeout(1000);

		const sourceNode = page.locator('svg [data-node-id="sch-part-R1"]').first();
		const targetNode = page.locator('svg [data-node-id="sch-part-R2"]').first();
		await expect(sourceNode).toBeVisible({ timeout: 10000 });
		await expect(targetNode).toBeVisible({ timeout: 10000 });

		const sourceBox = await sourceNode.boundingBox();
		const targetBox = await targetNode.boundingBox();
		expect(sourceBox).not.toBeNull();
		expect(targetBox).not.toBeNull();

		const sourceX = (sourceBox?.x ?? 0) + (sourceBox?.width ?? 0) / 2;
		const sourceY = (sourceBox?.y ?? 0) + (sourceBox?.height ?? 0) / 2;
		const targetX = (targetBox?.x ?? 0) + (targetBox?.width ?? 0) + 24;
		const targetY = (targetBox?.y ?? 0) + (targetBox?.height ?? 0) / 2;

		await page.mouse.move(sourceX, sourceY);
		await page.mouse.down();
		await page.mouse.move(targetX, targetY, { steps: 18 });
		await page.mouse.up();
		await page.waitForTimeout(250);

		const editorContent = (await getSyntaxEditor(page).textContent()) ?? '';
		const r1Index = editorContent.indexOf('part R1 type:R');
		const r2Index = editorContent.indexOf('part R2 type:R');
		expect(r1Index).toBeGreaterThan(-1);
		expect(r2Index).toBeGreaterThan(-1);
		expect(r2Index).toBeLessThan(r1Index);
	});
});
