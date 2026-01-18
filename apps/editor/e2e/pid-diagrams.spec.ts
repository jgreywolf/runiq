/**
 * Playwright E2E tests for P&ID (Piping & Instrumentation Diagrams)
 * Tests visual rendering and parsing of all P&ID example diagrams
 */

import { expect, test, type Page } from '@playwright/test';

// Helper to get the syntax editor (not the data editor)
function getSyntaxEditor(page: Page) {
	// Make sure we're on the syntax tab first, then get its editor
	return page.locator('[data-value="syntax"] .cm-content');
}

test.describe('P&ID Diagram Rendering', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Wait for editor to be ready
		await page.waitForSelector('.cm-editor', { state: 'visible' });
		await page.waitForTimeout(1000);
	});

	test('Create new P&ID diagram from New Diagram dialog', async ({ page }) => {
		await test.step('Open New Diagram dialog', async () => {
			const newDiagramButton = page.getByRole('button', { name: 'New' });
			await expect(newDiagramButton).toBeVisible({ timeout: 10000 });
			await newDiagramButton.click();
		});

		await test.step('Select P&ID diagram type', async () => {
			const pidOption = page.getByRole('button', { name: /P&ID Diagram/i });
			await expect(pidOption).toBeVisible();
			await pidOption.click();
		});

		await test.step('Verify P&ID template inserted', async () => {
			const editorContent = await getSyntaxEditor(page).textContent();
			expect(editorContent).toContain('pid "');
			expect(editorContent).toContain('equipment');
			expect(editorContent).toContain('instrument');
		});

		await test.step('Verify preview renders without errors', async () => {
			// Wait for SVG to be rendered
			const svgElement = page.locator('svg').first();
			await expect(svgElement).toBeVisible({ timeout: 10000 });
		});
	});

	test('01-simple-tank-pump: Render simple tank and pump system', async ({ page }) => {
		await test.step('Load example code', async () => {
			const pidCode = `pid "Simple Tank and Pump" {
  equipment T-101 type:storageTank volume:1000 unit:L material:CS rating:150#
  equipment P-101 type:pumpCentrifugal flowRate:50 unit:m³/h material:CS
  equipment FCV-101 type:valveControl rating:150#
  equipment V-201 type:valveGate rating:150#

  instrument FT-101 type:flowTransmitter range:(0,100) unit:m³/h loop:101 location:field
  instrument FIC-101 type:flowIndicatorController range:(0,100) unit:m³/h loop:101 location:panel
  instrument LT-401 type:levelTransmitter range:(0,100) unit:% loop:401 location:field
  instrument LIC-401 type:levelIndicatorController range:(0,100) unit:% loop:401 location:panel

  line process from:T-101.outlet to:P-101.inlet size:3 unit:in schedule:SCH40 material:CS
  line process from:P-101.discharge to:FCV-101.inlet size:2 unit:in schedule:SCH40 material:CS
  line process from:FCV-101.outlet to:V-201.inlet size:2 unit:in schedule:SCH40 material:CS
  line process from:V-201.outlet to:PRODUCT-1.tank size:2 unit:in schedule:SCH40 material:CS

  line signal from:FT-101 to:FIC-101
  line signal from:FIC-101 to:FCV-101
  line signal from:LT-401 to:LIC-401

  loop 101 controlled_variable:flow setpoint:40 unit:m³/h controller:FIC-101 mode:auto
  loop 401 controlled_variable:level setpoint:70 unit:% controller:LIC-401 mode:auto

  fluid mineral
  pressure 6 bar operating
  flowRate 50 m³/h
}`;

			// Clear editor and insert code
			await getSyntaxEditor(page).fill(pidCode);
			await page.waitForTimeout(500);
		});

		await test.step('Verify rendering produces valid SVG', async () => {
			// Wait for SVG to be rendered (it's injected via @html)
			const svgElement = page.locator('svg').first();
			await expect(svgElement).toBeVisible({ timeout: 10000 });

			// Check SVG has viewBox or dimensions
			const viewBox = await svgElement.getAttribute('viewBox');
			expect(viewBox).toBeTruthy();
		});

		await test.step('Take screenshot for visual regression', async () => {
			await expect(page).toHaveScreenshot('pid-01-simple-tank-pump.png', {
				maxDiffPixels: 600,
				maxDiffPixelRatio: 0.03,
				fullPage: true
			});
		});
	});

	test('02-heat-exchanger: Render shell-and-tube heat exchanger with control', async ({ page }) => {
		await test.step('Load example code', async () => {
			const pidCode = `pid "Shell and Tube Heat Exchanger" {
  equipment E-101 type:heatExchangerShellTube material:SS316 rating:300#
  equipment P-101 type:pumpCentrifugal flowRate:75 unit:m³/h material:CS
  equipment P-102 type:pumpCentrifugal flowRate:100 unit:m³/h material:CS
  equipment TCV-201 type:valveControl rating:150#

  instrument TT-201 type:temperatureTransmitter range:(0,200) unit:degC loop:201 location:field
  instrument TT-202 type:temperatureTransmitter range:(0,200) unit:degC loop:201 location:field
  instrument TT-203 type:temperatureTransmitter range:(10,50) unit:degC location:field
  instrument TIC-201 type:temperatureIndicatorController range:(0,200) unit:degC loop:201 location:panel
  instrument FT-101 type:flowTransmitter range:(0,150) unit:m³/h location:field
  instrument FT-102 type:flowTransmitter range:(0,200) unit:m³/h location:field
  instrument PI-101 type:pressureIndicator range:(0,10) unit:bar location:local
  instrument PI-102 type:pressureIndicator range:(0,5) unit:bar location:local

  line process from:P-101.discharge to:E-101.tubeIn size:4 unit:in schedule:SCH40 material:CS
  line process from:E-101.tubeOut to:TT-202 size:4 unit:in schedule:SCH40 material:CS
  line utility from:CW-1.supply to:P-102.inlet size:6 unit:in schedule:STD material:CS
  line utility from:P-102.discharge to:TCV-201.inlet size:4 unit:in schedule:STD material:CS
  line utility from:TCV-201.outlet to:E-101.shellIn size:4 unit:in schedule:STD material:CS
  line utility from:E-101.shellOut to:CW-1.returnLine size:6 unit:in schedule:STD material:CS
  line signal from:TT-201 to:TIC-201
  line signal from:TIC-201 to:TCV-201

  loop 201 controlled_variable:temperature setpoint:80 unit:degC controller:TIC-201 mode:auto

  fluid synthetic
  pressure 8 bar operating
  flowRate 75 m³/h
}`;

			await getSyntaxEditor(page).fill(pidCode);
			await page.waitForTimeout(2000);
		});

		await test.step('Verify rendering shows heat exchanger symbol', async () => {
			const svgElement = page.locator('svg').first();
			await expect(svgElement).toBeVisible({ timeout: 10000 });
		});

		await test.step('Take screenshot for visual regression', async () => {
			await expect(page).toHaveScreenshot('pid-02-heat-exchanger.png', {
				maxDiffPixels: 600,
				maxDiffPixelRatio: 0.03,
				fullPage: true
			});
		});
	});

	test('03-distillation-column: Render complex distillation system', async ({ page }) => {
		await test.step('Load distillation column code', async () => {
			// Use abbreviated version due to size
			const pidCode = `pid "Distillation Column" {
  equipment C-101 type:distillationColumn volume:50000 unit:L material:CS rating:300#
  equipment E-101 type:reboiler material:SS316 rating:300#
  equipment E-102 type:reboiler material:SS316 rating:300#
  equipment COND-1 type:condenser material:SS316 rating:300#
  equipment D-101 type:refluxDrum volume:5000 unit:L material:CS rating:300#
  equipment P-101 type:pumpCentrifugal flowRate:30 unit:m³/h material:CS
  equipment P-102 type:pumpCentrifugal flowRate:30 unit:m³/h material:CS
  equipment P-103 type:pumpCentrifugal flowRate:50 unit:m³/h material:CS

  instrument TT-201 type:temperatureTransmitter range:(0,250) unit:degC loop:201 location:field
  instrument TIC-201 type:temperatureIndicatorController range:(0,250) unit:degC loop:201 location:panel
  instrument PT-301 type:pressureTransmitter range:(0,5) unit:bar loop:301 location:field
  instrument PIC-301 type:pressureIndicatorController range:(0,5) unit:bar loop:301 location:panel
  instrument LT-401 type:levelTransmitter range:(0,100) unit:% loop:401 location:field
  instrument LIC-401 type:levelIndicatorController range:(0,100) unit:% loop:401 location:panel

  line process from:FEED-1.supply to:C-101.feedMid size:4 unit:in schedule:XS material:CS
  line process from:C-101.overhead to:COND-1.tubeIn size:6 unit:in schedule:SCH40 material:CS
  line process from:COND-1.tubeOut to:D-101.inlet size:6 unit:in schedule:SCH40 material:CS
  line signal from:TT-201 to:TIC-201
  line signal from:PT-301 to:PIC-301
  line signal from:LT-401 to:LIC-401

  loop 201 controlled_variable:temperature setpoint:180 unit:degC controller:TIC-201 mode:auto
  loop 301 controlled_variable:pressure setpoint:2.5 unit:bar controller:PIC-301 mode:auto
  loop 401 controlled_variable:level setpoint:60 unit:% controller:LIC-401 mode:auto

  fluid synthetic
  pressure 2.5 bar operating
}`;

			await getSyntaxEditor(page).fill(pidCode);
			await page.waitForTimeout(500);
		});

		await test.step('Verify complex system renders', async () => {
			const svgElement = page.locator('svg').first();
			await expect(svgElement).toBeVisible({ timeout: 10000 });
		});

		await test.step('Take screenshot for visual regression', async () => {
			await expect(page).toHaveScreenshot('pid-03-distillation-column.png', {
				maxDiffPixels: 600,
				maxDiffPixelRatio: 0.03,
				fullPage: true
			});
		});
	});

	test('04-reactor-safety: Render reactor with safety systems', async ({ page }) => {
		await test.step('Load reactor safety code', async () => {
			const pidCode = `pid "Batch Reactor with Safety Systems" {
  equipment R-101 type:reactor volume:10000 unit:L material:SS316L rating:600#
  equipment J-101 type:jacket material:SS316L rating:600#
  equipment P-101 type:pumpCentrifugal flowRate:30 unit:m³/h material:SS316L
  equipment PSV-801 type:valveSafetyRelief rating:600#
  equipment RD-801 type:ruptureDisk rating:600#

  instrument TT-501 type:temperatureTransmitter range:(0,200) unit:degC loop:501 location:field
  instrument TIC-501 type:temperatureIndicatorController range:(0,200) unit:degC loop:501 location:panel
  instrument TAH-901 type:temperatureAlarmHigh range:(0,200) unit:degC location:panel
  instrument TAHH-902 type:temperatureAlarmHighHigh range:(0,200) unit:degC location:panel
  instrument PT-601 type:pressureTransmitter range:(0,10) unit:bar loop:601 location:field
  instrument PAH-903 type:pressureAlarmHigh range:(0,10) unit:bar location:panel
  instrument PAHH-904 type:pressureAlarmHighHigh range:(0,10) unit:bar location:panel

  line process from:R-101.relief to:PSV-801.inlet size:3 unit:in schedule:XXS material:SS316L
  line process from:PSV-801.outlet to:RD-801.inlet size:3 unit:in schedule:XXS material:SS316L
  line signal from:TT-501 to:TIC-501
  line signal from:PT-601 to:PAH-903
  line signal from:PT-601 to:PAHH-904

  loop 501 controlled_variable:temperature setpoint:85 unit:degC controller:TIC-501 mode:auto
  loop 601 controlled_variable:pressure setpoint:4 unit:bar controller:PT-601 mode:auto

  fluid biodegradable
  pressure 4 bar operating
}`;

			await getSyntaxEditor(page).fill(pidCode);
			await page.waitForTimeout(500);
		});

		await test.step('Verify safety equipment renders', async () => {
			const svgElement = page.locator('svg').first();
			await expect(svgElement).toBeVisible({ timeout: 10000 });
		});

		await test.step('Take screenshot for visual regression', async () => {
			await expect(page).toHaveScreenshot('pid-04-reactor-safety.png', {
				maxDiffPixels: 600,
				maxDiffPixelRatio: 0.03,
				fullPage: true
			});
		});
	});

	test('05-compressor-system: Render two-stage compressor with anti-surge', async ({ page }) => {
		await test.step('Load compressor system code', async () => {
			const pidCode = `pid "Two-Stage Compressor System" {
  equipment K-101 type:compressorCentrifugal material:CS rating:600#
  equipment K-102 type:compressorCentrifugal material:CS rating:900#
  equipment E-101 type:cooler material:CS rating:600#
  equipment E-102 type:cooler material:CS rating:900#
  equipment D-101 type:separator volume:500 unit:L material:CS rating:600#
  equipment ASV-801 type:valveControl rating:600#
  equipment ASV-802 type:valveControl rating:900#

  instrument PT-601 type:pressureTransmitter range:(0,50) unit:bar loop:601 location:field
  instrument PIC-601 type:pressureIndicatorController range:(0,50) unit:bar loop:601 location:panel
  instrument FT-101 type:flowTransmitter range:(0,5000) unit:m³/h location:field
  instrument ASC-801 type:flowController range:(0,5000) unit:m³/h loop:801 location:panel
  instrument SC-701 type:speedController range:(0,15000) unit:rpm loop:701 location:panel
  instrument VT-901 type:vibrationTransmitter range:(0,50) unit:mm/s location:field

  line process from:FEED-1.supply to:K-101.inlet size:8 unit:in schedule:XS material:CS
  line process from:K-101.discharge to:E-101.tubeIn size:6 unit:in schedule:XS material:CS
  line process from:D-101.outlet to:K-102.inlet size:6 unit:in schedule:XS material:CS
  line signal from:PT-601 to:PIC-601
  line signal from:FT-101 to:ASC-801
  line signal from:ASC-801 to:ASV-801

  loop 601 controlled_variable:pressure setpoint:40 unit:bar controller:PIC-601 mode:auto
  loop 701 controlled_variable:speed setpoint:12000 unit:rpm controller:SC-701 mode:cascade
  loop 801 controlled_variable:flow setpoint:3000 unit:m³/h controller:ASC-801 mode:auto

  fluid mineral
  pressure 40 bar operating
}`;

			await getSyntaxEditor(page).fill(pidCode);
			await page.waitForTimeout(500);
		});

		await test.step('Verify compressor system renders', async () => {
			const svgElement = page.locator('svg').first();
			await expect(svgElement).toBeVisible({ timeout: 10000 });
		});

		await test.step('Take screenshot for visual regression', async () => {
			await expect(page).toHaveScreenshot('pid-05-compressor-system.png', {
				maxDiffPixels: 600,
				maxDiffPixelRatio: 0.03,
				fullPage: true
			});
		});
	});

	test('P&ID rendering performance with large diagram', async ({ page }) => {
		await test.step('Load large diagram', async () => {
			// Use the distillation column as it has the most complexity
			const pidCode = `pid "Performance Test" {
  equipment E-1 type:heatExchangerShellTube material:CS rating:150#
  equipment E-2 type:heatExchangerShellTube material:CS rating:150#
  equipment E-3 type:heatExchangerShellTube material:CS rating:150#
  equipment P-1 type:pumpCentrifugal flowRate:100 unit:m³/h material:CS
  equipment P-2 type:pumpCentrifugal flowRate:100 unit:m³/h material:CS
  equipment V-1 type:valveControl rating:150#
  equipment V-2 type:valveControl rating:150#
  equipment V-3 type:valveControl rating:150#
  equipment T-1 type:storageTank volume:5000 unit:L material:CS rating:150#
  equipment T-2 type:storageTank volume:5000 unit:L material:CS rating:150#

  instrument FT-101 type:flowTransmitter range:(0,200) unit:m³/h loop:101 location:field
  instrument FT-102 type:flowTransmitter range:(0,200) unit:m³/h loop:102 location:field
  instrument TT-201 type:temperatureTransmitter range:(0,200) unit:degC loop:201 location:field
  instrument TT-202 type:temperatureTransmitter range:(0,200) unit:degC loop:202 location:field
  instrument PT-301 type:pressureTransmitter range:(0,10) unit:bar loop:301 location:field

  line process from:T-1.outlet to:P-1.inlet size:4 unit:in schedule:SCH40 material:CS
  line process from:P-1.discharge to:E-1.tubeIn size:4 unit:in schedule:SCH40 material:CS
  line process from:E-1.tubeOut to:V-1.inlet size:4 unit:in schedule:SCH40 material:CS
  line signal from:FT-101 to:V-1
  line signal from:TT-201 to:V-2

  loop 101 controlled_variable:flow setpoint:100 unit:m³/h controller:FT-101 mode:auto
  loop 201 controlled_variable:temperature setpoint:80 unit:degC controller:TT-201 mode:auto

  fluid water-glycol
  pressure 6 bar operating
}`;

			await getSyntaxEditor(page).fill(pidCode);
			await page.waitForTimeout(2000);
		});

		await test.step('Verify rendering completed successfully', async () => {
			const svgElement = page.locator('svg').first();
			await expect(svgElement).toBeVisible({ timeout: 10000 });
		});
	});
});
