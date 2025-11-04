import { test, expect } from '@playwright/test';
import { renderAndSetup } from './utils';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Visual Regression Tests for Example Files
 * 
 * These tests ensure that real-world example diagrams continue to render correctly.
 * This catches regressions in complex diagram scenarios that unit tests might miss.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EXAMPLES_DIR = path.resolve(__dirname, '../../../../examples');

/**
 * Helper to read example file content
 */
function readExampleFile(filename: string): string {
	const filePath = path.join(EXAMPLES_DIR, filename);
	return fs.readFileSync(filePath, 'utf-8');
}

test.describe('Visual Regression - Example Files', () => {
	test('should render simple.runiq', async ({ page }) => {
		const dsl = readExampleFile('simple.runiq');
		await renderAndSetup(page, dsl);
		
		const svg = page.locator('svg[role="img"]').first();
		await expect(svg).toBeVisible();
		await expect(svg).toHaveScreenshot('example-simple.png');
	});

	test('should render auth-flow.runiq', async ({ page }) => {
		const dsl = readExampleFile('auth-flow.runiq');
		await renderAndSetup(page, dsl);
		
		const svg = page.locator('svg[role="img"]').first();
		await expect(svg).toBeVisible();
		await expect(svg).toHaveScreenshot('example-auth-flow.png');
	});

	// Skipped: lean-r shape not yet implemented
	// test('should render simple-flowchart.runiq', async ({ page }) => {
	// 	const dsl = readExampleFile('simple-flowchart.runiq');
	// 	await renderAndSetup(page, dsl);
	// 	
	// 	const svg = page.locator('svg[role="img"]').first();
	// 	await expect(svg).toBeVisible();
	// 	await expect(svg).toHaveScreenshot('example-simple-flowchart.png');
	// });

	test('should render microservices.runiq', async ({ page }) => {
		const dsl = readExampleFile('microservices.runiq');
		await renderAndSetup(page, dsl);
		
		const svg = page.locator('svg[role="img"]').first();
		await expect(svg).toBeVisible();
		await expect(svg).toHaveScreenshot('example-microservices.png');
	});

	test('should render docker-stack.runiq', async ({ page }) => {
		const dsl = readExampleFile('docker-stack.runiq');
		await renderAndSetup(page, dsl);
		
		const svg = page.locator('svg[role="img"]').first();
		await expect(svg).toBeVisible();
		await expect(svg).toHaveScreenshot('example-docker-stack.png');
	});

	test('should render nested-containers-demo.runiq', async ({ page }) => {
		const dsl = readExampleFile('nested-containers-demo.runiq');
		await renderAndSetup(page, dsl);
		
		const svg = page.locator('svg[role="img"]').first();
		await expect(svg).toBeVisible();
		await expect(svg).toHaveScreenshot('example-nested-containers.png');
	});

	test('should render microservices-nested.runiq', async ({ page }) => {
		const dsl = readExampleFile('microservices-nested.runiq');
		await renderAndSetup(page, dsl);
		
		const svg = page.locator('svg[role="img"]').first();
		await expect(svg).toBeVisible();
		await expect(svg).toHaveScreenshot('example-microservices-nested.png');
	});

	// Skipped: Parser error - file uses older syntax
	// test('should render aws-vpc-example.runiq', async ({ page }) => {
	// 	const dsl = readExampleFile('aws-vpc-example.runiq');
	// 	await renderAndSetup(page, dsl);
	// 	
	// 	const svg = page.locator('svg[role="img"]').first();
	// 	await expect(svg).toBeVisible();
	// 	await expect(svg).toHaveScreenshot('example-aws-vpc.png');
	// });

	test('should render c4-context.runiq', async ({ page }) => {
		const dsl = readExampleFile('c4-context.runiq');
		await renderAndSetup(page, dsl);
		
		const svg = page.locator('svg[role="img"]').first();
		await expect(svg).toBeVisible();
		await expect(svg).toHaveScreenshot('example-c4-context.png');
	});

	test('should render simple-container.runiq', async ({ page }) => {
		const dsl = readExampleFile('simple-container.runiq');
		await renderAndSetup(page, dsl);
		
		const svg = page.locator('svg[role="img"]').first();
		await expect(svg).toBeVisible();
		await expect(svg).toHaveScreenshot('example-simple-container.png');
	});

	test('should render container-directions-test.runiq', async ({ page }) => {
		const dsl = readExampleFile('container-directions-test.runiq');
		await renderAndSetup(page, dsl);
		
		const svg = page.locator('svg[role="img"]').first();
		await expect(svg).toBeVisible();
		await expect(svg).toHaveScreenshot('example-container-directions.png');
	});

	test('should render radial-org.runiq', async ({ page }) => {
		const dsl = readExampleFile('radial-org.runiq');
		await renderAndSetup(page, dsl);
		
		const svg = page.locator('svg[role="img"]').first();
		await expect(svg).toBeVisible();
		await expect(svg).toHaveScreenshot('example-radial-org.png');
	});

	test('should render stress-graph.runiq', async ({ page }) => {
		const dsl = readExampleFile('stress-graph.runiq');
		await renderAndSetup(page, dsl);
		
		const svg = page.locator('svg[role="img"]').first();
		await expect(svg).toBeVisible();
		await expect(svg).toHaveScreenshot('example-stress-graph.png');
	});

	test('should render mindmaps/simple-mindmap-v2.runiq', async ({ page }) => {
		const dsl = readExampleFile('mindmaps/simple-mindmap-v2.runiq');
		await renderAndSetup(page, dsl);
		
		const svg = page.locator('svg[role="img"]').first();
		await expect(svg).toBeVisible();
		await expect(svg).toHaveScreenshot('example-mindmap-simple-v2.png');
	});

	test('should render mindmaps/minimal-auto-styled.runiq', async ({ page }) => {
		const dsl = readExampleFile('mindmaps/minimal-auto-styled.runiq');
		await renderAndSetup(page, dsl);
		
		const svg = page.locator('svg[role="img"]').first();
		await expect(svg).toBeVisible();
		await expect(svg).toHaveScreenshot('example-mindmap-minimal.png');
	});

	// Skipped: File doesn't exist
	// test('should render flowcharts/decision-tree.runiq', async ({ page }) => {
	// 	const dsl = readExampleFile('flowcharts/decision-tree.runiq');
	// 	await renderAndSetup(page, dsl);
	// 	
	// 	const svg = page.locator('svg[role="img"]').first();
	// 	await expect(svg).toBeVisible();
	// 	await expect(svg).toHaveScreenshot('example-flowchart-decision-tree.png');
	// });

	// Skipped: Chart shapes not yet implemented
	// test('should render charts/pie-chart-simple.runiq', async ({ page }) => {
	// 	const dsl = readExampleFile('pie-chart-simple.runiq');
	// 	await renderAndSetup(page, dsl);
	// 	
	// 	const svg = page.locator('svg[role="img"]').first();
	// 	await expect(svg).toBeVisible();
	// 	await expect(svg).toHaveScreenshot('example-pie-chart-simple.png');
	// });

	// Skipped: Chart shapes not yet implemented
	// test('should render charts/bar-chart-vertical.runiq', async ({ page }) => {
	// 	const dsl = readExampleFile('bar-chart-vertical.runiq');
	// 	await renderAndSetup(page, dsl);
	// 	
	// 	const svg = page.locator('svg[role="img"]').first();
	// 	await expect(svg).toBeVisible();
	// 	await expect(svg).toHaveScreenshot('example-bar-chart-vertical.png');
	// });

	test('should render component-microservices.runiq', async ({ page }) => {
		const dsl = readExampleFile('component-microservices.runiq');
		await renderAndSetup(page, dsl);
		
		const svg = page.locator('svg[role="img"]').first();
		await expect(svg).toBeVisible();
		await expect(svg).toHaveScreenshot('example-component-microservices.png');
	});

	// Skipped: Parser error - file uses older syntax
	// test('should render bpmn-pool-example.runiq', async ({ page }) => {
	// 	const dsl = readExampleFile('bpmn-pool-example.runiq');
	// 	await renderAndSetup(page, dsl);
	// 	
	// 	const svg = page.locator('svg[role="img"]').first();
	// 	await expect(svg).toBeVisible();
	// 	await expect(svg).toHaveScreenshot('example-bpmn-pool.png');
	// });
});
