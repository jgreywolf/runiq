import { test, expect } from '@playwright/test';
import { renderAndSetup, createShapeTestDiagram } from './utils';

// List of all core shapes to test (52 shapes total)
const coreShapes = [
	// Basic shapes (18)
	'rectangle', 'roundedRectangle', 'circle', 'smallCircle', 'doubleCircle', 
	'framedCircle', 'crossCircle', 'filledCircle', 'ellipseWide', 'rhombus',
	'hexagon', 'stadium', 'triangle', 'flippedTriangle', 'parallelogram',
	'trapezoid', 'flippedTrapezoid', 'star',
	
	// Flowchart shapes (14)
	'document', 'display', 'delay', 'decisionManual', 'card', 
	'taggedDocument', 'preparation', 'predefinedProcess', 'flag',
	'offPageConnector', 'multiDocument', 'manualInput', 'linedDocument', 'leanLeft',
	
	// Storage shapes (7)
	'cylinder', 'diskStorage', 'directStorage', 'hCylinder', 'internalStorage',
	'sequentialStorage', 'storedData',
	
	// Rect variants (7)
	'dividedRectangle', 'framedRectangle', 'linedRectangle', 'multiRectangle',
	'notchedPentagon', 'notchedRectangle', 'taggedRectangle',
	
	// Special shapes (5) - 'or' is reserved keyword in parser
	'braceLeft', 'braceRight', 'fork', 'hourglass', 'lightning'
];

test.describe('Visual Regression - Core Shapes', () => {
	// Test each shape individually
	for (const shapeId of coreShapes) {
		test(`should render ${shapeId} correctly`, async ({ page }) => {
			const dsl = createShapeTestDiagram(shapeId, shapeId);
			await renderAndSetup(page, dsl);
			
			const svg = page.locator('svg');
			await expect(svg).toBeVisible();
			
			// Generate baseline screenshot with shape-specific name
			await expect(svg).toHaveScreenshot(`shape-${shapeId}.png`);
		});
	}
});

test.describe('Visual Regression - Control System Shapes', () => {
	const controlShapes = [
		'transferFunction', 'summingJunction', 'gain', 'integrator', 'differentiator',
		'multiplyJunction', 'divideJunction', 'compareJunction', 'saturation', 'timeDelay'
	];
	
	for (const shapeId of controlShapes) {
		test(`should render ${shapeId} correctly`, async ({ page }) => {
			const dsl = createShapeTestDiagram(shapeId, shapeId);
			await renderAndSetup(page, dsl);
			
			const svg = page.locator('svg');
			await expect(svg).toBeVisible();
			await expect(svg).toHaveScreenshot(`shape-${shapeId}.png`);
		});
	}
});

test.describe('Visual Regression - Network Shapes', () => {
	const networkShapes = [
		'server', 'router', 'switch', 'firewall', 'loadBalancer', 'storage', 'cloud'
	];
	
	for (const shapeId of networkShapes) {
		test(`should render ${shapeId} correctly`, async ({ page }) => {
			const dsl = createShapeTestDiagram(shapeId, shapeId);
			await renderAndSetup(page, dsl);
			
			const svg = page.locator('svg');
			await expect(svg).toBeVisible();
			await expect(svg).toHaveScreenshot(`shape-${shapeId}.png`);
		});
	}
});
