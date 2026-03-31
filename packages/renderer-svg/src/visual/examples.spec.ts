import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderAndSetup } from './utils';

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
    await expect(svg).toHaveScreenshot('simple.png');
  });

  test('should render auth-flow.runiq', async ({ page }) => {
    const dsl = readExampleFile('auth-flow.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('auth-flow.png');
  });

  // Skipped: lean-r shape not yet implemented
  // test('should render simple-flowchart.runiq', async ({ page }) => {
  // 	const dsl = readExampleFile('simple-flowchart.runiq');
  // 	await renderAndSetup(page, dsl);
  //
  // 	const svg = page.locator('svg[role="img"]').first();
  // 	await expect(svg).toBeVisible();
  // 	await expect(svg).toHaveScreenshot('simple-flowchart.png');
  // });

  test('should render microservices.runiq', async ({ page }) => {
    const dsl = readExampleFile('microservices.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('microservices.png');
  });

  test('should render docker-stack.runiq', async ({ page }) => {
    const dsl = readExampleFile('docker-stack.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('docker-stack.png');
  });

  test('should render nested-containers-demo.runiq', async ({ page }) => {
    const dsl = readExampleFile('nested-containers-demo.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('nested-containers.png');
  });

  test('should render microservices-nested.runiq', async ({ page }) => {
    const dsl = readExampleFile('microservices-nested.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('microservices-nested.png');
  });

  // Skipped: Parser error - file uses older syntax
  // test('should render aws-vpc-example.runiq', async ({ page }) => {
  // 	const dsl = readExampleFile('aws-vpc-example.runiq');
  // 	await renderAndSetup(page, dsl);
  //
  // 	const svg = page.locator('svg[role="img"]').first();
  // 	await expect(svg).toBeVisible();
  // 	await expect(svg).toHaveScreenshot('aws-vpc.png');
  // });

  test('should render c4-context.runiq', async ({ page }) => {
    const dsl = readExampleFile('c4-context.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('c4-context.png');
  });

  test('should render simple-container.runiq', async ({ page }) => {
    const dsl = readExampleFile('simple-container.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('simple-container.png');
  });

  test('should render container-directions-test.runiq', async ({ page }) => {
    const dsl = readExampleFile('container-directions-test.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('container-directions.png');
  });

  test('should render radial-org.runiq', async ({ page }) => {
    const dsl = readExampleFile('radial-org.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('radial-org.png');
  });

  test('should render stress-graph.runiq', async ({ page }) => {
    const dsl = readExampleFile('stress-graph.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('stress-graph.png');
  });

  test('should render mindmaps/simple-mindmap-v2.runiq', async ({ page }) => {
    const dsl = readExampleFile('mindmaps/simple-mindmap-v2.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('mindmap-simple-v2.png');
  });

  test('should render mindmaps/minimal-auto-styled.runiq', async ({ page }) => {
    const dsl = readExampleFile('mindmaps/minimal-auto-styled.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('mindmap-minimal.png');
  });

  // Skipped: File doesn't exist
  // test('should render flowcharts/decision-tree.runiq', async ({ page }) => {
  // 	const dsl = readExampleFile('flowcharts/decision-tree.runiq');
  // 	await renderAndSetup(page, dsl);
  //
  // 	const svg = page.locator('svg[role="img"]').first();
  // 	await expect(svg).toBeVisible();
  // 	await expect(svg).toHaveScreenshot('flowchart-decision-tree.png');
  // });

  test('should render charts/pie-chart-simple.runiq', async ({ page }) => {
    const dsl = readExampleFile('charts/pie-chart-simple.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('pie-chart-simple.png');
  });

  test('should render pie-chart-labeled.runiq', async ({ page }) => {
    const dsl = readExampleFile('charts/pie-chart-labeled.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('pie-chart-labeled.png');
  });

  test('should render pie-chart-with-legend.runiq', async ({ page }) => {
    const dsl = readExampleFile('charts/pie-chart-with-legend.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('pie-chart-with-legend.png');
  });

  test('should render charts/bar-chart-vertical.runiq', async ({ page }) => {
    const dsl = readExampleFile('charts/bar-chart-vertical.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('bar-chart-vertical.png');
  });

  test('should render bar-chart-horizontal.runiq', async ({ page }) => {
    const dsl = readExampleFile('charts/bar-chart-horizontal.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('bar-chart-horizontal.png');
  });

  test('should render bar-chart-grouped-vertical.runiq', async ({ page }) => {
    const dsl = readExampleFile('charts/bar-chart-grouped-vertical.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('bar-chart-grouped-vertical.png');
  });

  test('should render component-microservices.runiq', async ({ page }) => {
    const dsl = readExampleFile('component-microservices.runiq');
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('component-microservices.png');
  });

  // Skipped: Parser error - file uses older syntax
  // test('should render bpmn-pool-example.runiq', async ({ page }) => {
  // 	const dsl = readExampleFile('bpmn-pool-example.runiq');
  // 	await renderAndSetup(page, dsl);
  //
  // 	const svg = page.locator('svg[role="img"]').first();
  // 	await expect(svg).toBeVisible();
  // 	await expect(svg).toHaveScreenshot('bpmn-pool.png');
  // });
});
