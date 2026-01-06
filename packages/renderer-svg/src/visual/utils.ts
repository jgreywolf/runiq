import { Page } from '@playwright/test';
import {
  iconRegistry,
  layoutRegistry,
  registerDefaultShapes,
} from '@runiq/core';
import { fontAwesome } from '@runiq/icons-fontawesome';
import { ElkLayoutEngine } from '@runiq/layout-base';
import { parse } from '@runiq/parser-dsl';
import { renderSvg } from '../../src/index.js';

// Initialize Runiq registries once
let initialized = false;
function initializeRuniq() {
  if (!initialized) {
    registerDefaultShapes();
    layoutRegistry.register(new ElkLayoutEngine());
    iconRegistry.register(fontAwesome);
    initialized = true;
  }
}

/**
 * Renders a Runiq diagram from DSL source code
 */
export async function renderDiagram(dslCode: string): Promise<string> {
  // Ensure registries are initialized
  initializeRuniq();

  const parseResult = parse(dslCode);

  if (!parseResult.success || !parseResult.diagram) {
    const errorMessages =
      parseResult.errors
        ?.map((e: unknown) => {
          if (typeof e === 'string') return e;
          if (e && typeof e === 'object' && 'message' in e)
            return String(e.message);
          return JSON.stringify(e);
        })
        .join(', ') || 'Unknown error';
    throw new Error(`Failed to parse diagram: ${errorMessages}`);
  }

  // Layout the diagram using ELK
  const layoutEngine = new ElkLayoutEngine();
  const layout = await layoutEngine.layout(parseResult.diagram, {});

  // Render to SVG
  const result = renderSvg(parseResult.diagram, layout);
  return result.svg;
}

/**
 * Sets up a test page with SVG content
 */
export async function setupTestPage(
  page: Page,
  svgContent: string
): Promise<void> {
  // Directly set the SVG content in the page
  const html = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<style>
		* { margin: 0; padding: 0; box-sizing: border-box; }
		body { background: white; padding: 20px; }
		svg { display: block; }
	</style>
</head>
<body>
	${svgContent}
</body>
</html>`;

  await page.setContent(html);

  // Wait for SVG to be rendered
  await page.waitForSelector('svg', { timeout: 5000 });

  // Wait for any animations/transitions to complete
  await page.waitForTimeout(100);
}

/**
 * Renders a diagram and sets up the page
 */
export async function renderAndSetup(
  page: Page,
  dslCode: string
): Promise<void> {
  const svg = await renderDiagram(dslCode);
  await setupTestPage(page, svg);
}

/**
 * Takes a screenshot of the SVG element
 */
export async function screenshotSVG(page: Page, name: string): Promise<Buffer> {
  const svgElement = page.locator('svg').first();
  return await svgElement.screenshot({
    path: `tests/visual/__snapshots__/${name}.png`,
    animations: 'disabled',
  });
}

/**
 * Utility to create a simple diagram with a single shape
 */
export function createShapeTestDiagram(
  shapeId: string,
  label: string = 'Test'
): string {
  return `diagram "test" {
  shape testShape as @${shapeId} label: "${label}"
}`;
}

/**
 * Utility to create a diagram with multiple shapes and edges
 */
export function createComplexDiagram(
  shapes: Array<{ id: string; shape: string; label: string }>,
  edges?: Array<{ from: string; to: string }>
): string {
  const shapeDeclarations = shapes
    .map((s) => `  shape ${s.id} as @${s.shape} label: "${s.label}"`)
    .join('\n');

  const edgeDeclarations = edges
    ? '\n' + edges.map((e) => `  ${e.from} -> ${e.to}`).join('\n')
    : '';

  return `diagram "test" {
${shapeDeclarations}${edgeDeclarations}
}`;
}

/**
 * Bulk screenshot generation for all shapes
 */
export async function generateShapeBaselines(
  page: Page,
  shapes: string[]
): Promise<void> {
  for (const shape of shapes) {
    const dsl = createShapeTestDiagram(shape, shape);
    await renderAndSetup(page, dsl);
    await screenshotSVG(page, `shape-${shape}`);
  }
}

/**
 * Compare two screenshots
 */
export async function compareScreenshots(
  page: Page,
  dslCode: string,
  snapshotName: string
): Promise<void> {
  await renderAndSetup(page, dslCode);
  await page
    .locator('svg')
    .first()
    .screenshot({
      path: `tests/visual/__snapshots__/${snapshotName}.png`,
    });
}
