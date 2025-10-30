/**
 * Playwright E2E tests for Phase 5: Templates & Presets
 * Tests editor integration for template/preset creation, autocomplete, and usage
 */

import { test, expect } from '@playwright/test';

test.describe('Phase 5: Templates & Presets Editor Integration', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Wait for editor to be ready
		await page.waitForSelector('.cm-editor', { state: 'visible' });
	});

	test.describe('Template & Preset Sample Insertion', () => {
		test('Sample Diagrams tab should include Templates & Presets category', async ({ page }) => {
			await test.step('Navigate to Sample Diagrams tab', async () => {
				await page.getByRole('tab', { name: 'Sample Diagrams' }).click();
			});

			await test.step('Verify Templates & Presets category exists', async () => {
				const categoryButton = page.getByRole('button', {
					name: /Templates & Presets \(Phase 5\)/i
				});
				await expect(categoryButton).toBeVisible();
			});
		});

		test('Should insert Basic Template sample', async ({ page }) => {
			await test.step('Open Templates & Presets samples', async () => {
				await page.getByRole('tab', { name: 'Sample Diagrams' }).click();
				await page.getByRole('button', { name: /Templates & Presets/ }).click();
			});

			await test.step('Insert Basic Template sample', async () => {
				await page.getByRole('button', { name: 'Basic Template' }).click();
			});

			await test.step('Verify code contains template syntax', async () => {
				const editorContent = await page.locator('.cm-content').textContent();
				expect(editorContent).toContain('template "service-template"');
				expect(editorContent).toContain('templateId: "service-template"');
			});
		});

		test('Should insert Style Preset sample', async ({ page }) => {
			await test.step('Open Templates & Presets samples', async () => {
				await page.getByRole('tab', { name: 'Sample Diagrams' }).click();
				await page.getByRole('button', { name: /Templates & Presets/ }).click();
			});

			await test.step('Insert Style Preset sample', async () => {
				await page.getByRole('button', { name: 'Style Preset' }).click();
			});

			await test.step('Verify code contains preset syntax', async () => {
				const editorContent = await page.locator('.cm-content').textContent();
				expect(editorContent).toContain('preset "card"');
				expect(editorContent).toContain('preset: "card"');
			});
		});

		test('Should insert Combined Template + Preset sample', async ({ page }) => {
			await test.step('Open Templates & Presets samples', async () => {
				await page.getByRole('tab', { name: 'Sample Diagrams' }).click();
				await page.getByRole('button', { name: /Templates & Presets/ }).click();
			});

			await test.step('Insert Combined sample', async () => {
				await page.getByRole('button', { name: 'Combined: Template + Preset' }).click();
			});

			await test.step('Verify code contains both template and preset', async () => {
				const editorContent = await page.locator('.cm-content').textContent();
				expect(editorContent).toContain('template "microservice"');
				expect(editorContent).toContain('preset "highlighted"');
				expect(editorContent).toContain('templateId: "microservice"');
				expect(editorContent).toContain('preset: "highlighted"');
			});
		});

		test('Should insert Container Inheritance sample', async ({ page }) => {
			await test.step('Open Templates & Presets samples', async () => {
				await page.getByRole('tab', { name: 'Sample Diagrams' }).click();
				await page.getByRole('button', { name: /Templates & Presets/ }).click();
			});

			await test.step('Insert Inheritance sample', async () => {
				await page.getByRole('button', { name: 'Container Inheritance' }).click();
			});

			await test.step('Verify code contains extends syntax', async () => {
				const editorContent = await page.locator('.cm-content').textContent();
				expect(editorContent).toContain('extends: "Base Container"');
			});
		});
	});

	test.describe('Template & Preset Autocomplete', () => {
		test('Should autocomplete "template" keyword', async ({ page }) => {
			await test.step('Type template keyword', async () => {
				await page.locator('.cm-content').click();
				await page.keyboard.type('temp');
				// Trigger autocomplete
				await page.keyboard.press('Control+Space');
			});

			await test.step('Verify template in autocomplete', async () => {
				// Wait for autocomplete menu
				await page.waitForSelector('.cm-tooltip-autocomplete', { state: 'visible' });
				const autocompleteText = await page.locator('.cm-tooltip-autocomplete').textContent();
				expect(autocompleteText).toContain('template');
			});
		});

		test('Should autocomplete "preset" keyword', async ({ page }) => {
			await test.step('Type preset keyword', async () => {
				await page.locator('.cm-content').click();
				await page.keyboard.type('pres');
				await page.keyboard.press('Control+Space');
			});

			await test.step('Verify preset in autocomplete', async () => {
				await page.waitForSelector('.cm-tooltip-autocomplete', { state: 'visible' });
				const autocompleteText = await page.locator('.cm-tooltip-autocomplete').textContent();
				expect(autocompleteText).toContain('preset');
			});
		});

		test('Should autocomplete "templateId:" property', async ({ page }) => {
			await test.step('Type templateId property', async () => {
				await page.locator('.cm-content').click();
				await page.keyboard.type('container "Test" {');
				await page.keyboard.press('Enter');
				await page.keyboard.type('  templa');
				await page.keyboard.press('Control+Space');
			});

			await test.step('Verify templateId in autocomplete', async () => {
				await page.waitForSelector('.cm-tooltip-autocomplete', { state: 'visible' });
				const autocompleteText = await page.locator('.cm-tooltip-autocomplete').textContent();
				expect(autocompleteText).toContain('templateId:');
			});
		});

		test('Should autocomplete "extends:" property', async ({ page }) => {
			await test.step('Type extends property', async () => {
				await page.locator('.cm-content').click();
				await page.keyboard.type('container "Test" {');
				await page.keyboard.press('Enter');
				await page.keyboard.type('  exte');
				await page.keyboard.press('Control+Space');
			});

			await test.step('Verify extends in autocomplete', async () => {
				await page.waitForSelector('.cm-tooltip-autocomplete', { state: 'visible' });
				const autocompleteText = await page.locator('.cm-tooltip-autocomplete').textContent();
				expect(autocompleteText).toContain('extends:');
			});
		});

		test('Should autocomplete container style properties', async ({ page }) => {
			await test.step('Type style property', async () => {
				await page.locator('.cm-content').click();
				await page.keyboard.type('container "Test" {');
				await page.keyboard.press('Enter');
				await page.keyboard.type('  backgr');
				await page.keyboard.press('Control+Space');
			});

			await test.step('Verify backgroundColor in autocomplete', async () => {
				await page.waitForSelector('.cm-tooltip-autocomplete', { state: 'visible' });
				const autocompleteText = await page.locator('.cm-tooltip-autocomplete').textContent();
				expect(autocompleteText).toContain('backgroundColor:');
			});
		});
	});

	test.describe('Template & Preset Syntax Validation', () => {
		test('Should validate template definition syntax', async ({ page }) => {
			await test.step('Enter template definition', async () => {
				await page.locator('.cm-content').click();
				await page.keyboard.type('diagram "Test"\n');
				await page.keyboard.type('template "my-template" {\n');
				await page.keyboard.type('  label: "My Template"\n');
				await page.keyboard.type('  backgroundColor: "#e3f2fd"\n');
				await page.keyboard.type('  padding: 20\n');
				await page.keyboard.type('}');
			});

			await test.step('Verify no syntax errors', async () => {
				// Wait a moment for linting
				await page.waitForTimeout(1000);
				// Check for error indicators in gutter
				const errorGutter = page.locator('.cm-lint-marker-error');
				await expect(errorGutter).toHaveCount(0);
			});
		});

		test('Should validate preset definition syntax', async ({ page }) => {
			await test.step('Enter preset definition', async () => {
				await page.locator('.cm-content').click();
				await page.keyboard.type('diagram "Test"\n');
				await page.keyboard.type('preset "card" {\n');
				await page.keyboard.type('  label: "Card Style"\n');
				await page.keyboard.type('  padding: 15\n');
				await page.keyboard.type('  shadow: true\n');
				await page.keyboard.type('}');
			});

			await test.step('Verify no syntax errors', async () => {
				await page.waitForTimeout(1000);
				const errorGutter = page.locator('.cm-lint-marker-error');
				await expect(errorGutter).toHaveCount(0);
			});
		});

		test('Should validate container with templateId', async ({ page }) => {
			await test.step('Enter container with template reference', async () => {
				await page.locator('.cm-content').click();
				await page.keyboard.type('diagram "Test"\n');
				await page.keyboard.type('template "service" {\n');
				await page.keyboard.type('  backgroundColor: "#f0f0f0"\n');
				await page.keyboard.type('}\n\n');
				await page.keyboard.type('container "My Service" templateId: "service" {\n');
				await page.keyboard.type('  shape api as @rectangle label: "API"\n');
				await page.keyboard.type('}');
			});

			await test.step('Verify no syntax errors', async () => {
				await page.waitForTimeout(1000);
				const errorGutter = page.locator('.cm-lint-marker-error');
				await expect(errorGutter).toHaveCount(0);
			});
		});

		test('Should validate container with preset', async ({ page }) => {
			await test.step('Enter container with preset reference', async () => {
				await page.locator('.cm-content').click();
				await page.keyboard.type('diagram "Test"\n');
				await page.keyboard.type('preset "card" {\n');
				await page.keyboard.type('  padding: 15\n');
				await page.keyboard.type('}\n\n');
				await page.keyboard.type('container "My Container" preset: "card" {\n');
				await page.keyboard.type('  shape node as @rectangle label: "Node"\n');
				await page.keyboard.type('}');
			});

			await test.step('Verify no syntax errors', async () => {
				await page.waitForTimeout(1000);
				const errorGutter = page.locator('.cm-lint-marker-error');
				await expect(errorGutter).toHaveCount(0);
			});
		});
	});

	test.describe('Complete Template & Preset Workflow', () => {
		test('Should create and use template with preset combination', async ({ page }) => {
			await test.step('Enter complete diagram with templates and presets', async () => {
				await page.locator('.cm-content').click();
				await page.keyboard.type('diagram "Architecture"\n\n');
				
				await page.keyboard.type('template "microservice" {\n');
				await page.keyboard.type('  backgroundColor: "#e3f2fd"\n');
				await page.keyboard.type('  padding: 20\n');
				await page.keyboard.type('}\n\n');
				
				await page.keyboard.type('preset "card" {\n');
				await page.keyboard.type('  shadow: true\n');
				await page.keyboard.type('  borderWidth: 1\n');
				await page.keyboard.type('}\n\n');
				
				await page.keyboard.type('container "API Service" templateId: "microservice" preset: "card" {\n');
				await page.keyboard.type('  shape api as @server label: "API Gateway"\n');
				await page.keyboard.type('}');
			});

			await test.step('Verify diagram renders without errors', async () => {
				await page.waitForTimeout(1500);
				const errorGutter = page.locator('.cm-lint-marker-error');
				await expect(errorGutter).toHaveCount(0);
			});
		});

		test('Should handle container inheritance with extends', async ({ page }) => {
			await test.step('Enter diagram with inheritance', async () => {
				await page.locator('.cm-content').click();
				await page.keyboard.type('diagram "Inheritance"\n\n');
				
				await page.keyboard.type('container "Base" {\n');
				await page.keyboard.type('  backgroundColor: "#f0f0f0"\n');
				await page.keyboard.type('  padding: 20\n');
				await page.keyboard.type('  shape base as @rectangle label: "Base"\n');
				await page.keyboard.type('}\n\n');
				
				await page.keyboard.type('container "Extended" extends: "Base" {\n');
				await page.keyboard.type('  borderColor: "#2196f3"\n');
				await page.keyboard.type('  shape child as @rectangle label: "Child"\n');
				await page.keyboard.type('}\n\n');
				
				await page.keyboard.type('base -> child');
			});

			await test.step('Verify no errors with inheritance', async () => {
				await page.waitForTimeout(1500);
				const errorGutter = page.locator('.cm-lint-marker-error');
				await expect(errorGutter).toHaveCount(0);
			});
		});
	});
});
