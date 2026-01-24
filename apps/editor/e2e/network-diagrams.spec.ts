/**
 * Playwright Visual Regression Tests for Network Diagrams
 * Tests force-directed and other network layout algorithms
 */

import { expect, test, type Locator } from '@playwright/test';

test.describe('Network Diagrams - Visual Tests', () => {
	let syntaxEditor: Locator;

	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Wait for editor to be ready
		await page.waitForSelector('.cm-editor', { state: 'visible' });
		// Get reference to the Syntax tab editor
		syntaxEditor = page.locator('[data-value="syntax"] .cm-content');
		await syntaxEditor.click();
		await page.keyboard.press('Control+A');
		await page.keyboard.press('Delete');
	});

	test.describe('Force-Directed Layout', () => {
		test('01-force-simple-network: Basic network with 10 nodes', async ({ page }) => {
			await test.step('Enter simple force network diagram', async () => {
				const dsl = `diagram "Simple Network" {
  container "Network" algorithm: force spacing: 120 {
    shape n1 as @circle label:"Node 1"
    shape n2 as @circle label:"Node 2"
    shape n3 as @circle label:"Node 3"
    shape n4 as @circle label:"Node 4"
    shape n5 as @circle label:"Node 5"
    shape n6 as @circle label:"Node 6"
    shape n7 as @circle label:"Node 7"
    shape n8 as @circle label:"Node 8"
    shape n9 as @circle label:"Node 9"
    shape n10 as @circle label:"Node 10"
    
    n1 -> n2
    n1 -> n3
    n2 -> n3
    n2 -> n4
    n3 -> n5
    n4 -> n5
    n4 -> n6
    n5 -> n7
    n6 -> n7
    n6 -> n8
    n7 -> n9
    n8 -> n9
    n8 -> n10
    n9 -> n10
  }
}`;
				await syntaxEditor.fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('network-01-force-simple.png', {
					maxDiffPixels: 625,
					maxDiffPixelRatio: 0.03,
					fullPage: true
				});
			});
		});

		test('02-force-social-network: Social network with communities', async ({ page }) => {
			await test.step('Enter social network diagram', async () => {
				const dsl = `diagram "Social Network" {
  container "Friends" algorithm: force spacing: 130 {
    shape alice as @actor label:"Alice"
    shape bob as @actor label:"Bob"
    shape carol as @actor label:"Carol"
    shape david as @actor label:"David"
    shape eve as @actor label:"Eve"
    shape frank as @actor label:"Frank"
    shape grace as @actor label:"Grace"
    
    alice -> bob
    alice -> carol
    bob -> carol
    david -> eve
    david -> frank
    eve -> frank
    alice -> grace
    david -> grace
  }
}`;
				await syntaxEditor.fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('network-02-force-social.png', {
					maxDiffPixels: 500,
					fullPage: true
				});
			});
		});

		test('03-force-dependency-graph: Package dependencies', async ({ page }) => {
			await test.step('Enter dependency graph diagram', async () => {
				const dsl = `// Software Dependency Graph
// Visualizes package dependencies with force-directed layout

diagram "Package Dependencies" {
  container "Packages" algorithm: force spacing: 110 {
    // Core infrastructure (few dependencies)
    shape types as @rect label:"@core/types"
    shape utils as @rect label:"@core/utils"
    shape config as @rect label:"@core/config"
    
    // Mid-level libraries
    shape auth as @rect label:"@lib/auth"
    shape api as @rect label:"@lib/api"
    shape db as @rect label:"@lib/database"
    shape cache as @rect label:"@lib/cache"
    
    // UI components
    shape uiCore as @rect label:"@ui/core"
    shape uiIcons as @rect label:"@ui/icons"
    shape uiForms as @rect label:"@ui/forms"
    
    // Applications
    shape webApp as @rect label:"web-app"
    shape mobileApp as @rect label:"mobile-app"
    shape cli as @rect label:"cli"
    
    // Core dependencies (everything needs these)
    auth -> types
    api -> types
    db -> types
    cache -> types
    uiCore -> types
    uiForms -> types
    
    auth -> utils
    api -> utils
    db -> utils
    uiCore -> utils
    
    auth -> config
    api -> config
    db -> config
    
    // Library dependencies
    api -> auth label:"requires"
    api -> db label:"queries"
    api -> cache label:"caches"
    db -> cache label:"uses"
    
    // UI dependencies
    uiForms -> uiCore label:"extends"
    uiForms -> uiIcons label:"uses"
    uiIcons -> uiCore
    
    // App dependencies
    webApp -> api label:"calls"
    webApp -> uiForms label:"displays"
    webApp -> auth label:"authenticates"
    
    mobileApp -> api
    mobileApp -> auth
    mobileApp -> uiCore
    
    cli -> api
    cli -> utils
    cli -> config
  }
}
`;
				await syntaxEditor.fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('network-03-force-dependencies.png', {
					maxDiffPixels: 600,
					maxDiffPixelRatio: 0.03,
					fullPage: true
				});
			});
		});

		test('04-force-medium-network: 25-node collaboration network', async ({ page }) => {
			await test.step('Enter medium network diagram', async () => {
				const dsl = `diagram "Collaboration" {
  container "Team" algorithm: force spacing: 120 {
    shape ceo as @actor label:"CEO"
    shape cto as @actor label:"CTO"
    shape cfo as @actor label:"CFO"
    shape cmo as @actor label:"CMO"
    
    shape eng1 as @circle label:"Dev 1"
    shape eng2 as @circle label:"Dev 2"
    shape eng3 as @circle label:"Dev 3"
    shape eng4 as @circle label:"Dev 4"
    shape eng5 as @circle label:"Dev 5"
    
    shape des1 as @circle label:"Des 1"
    shape des2 as @circle label:"Des 2"
    shape des3 as @circle label:"Des 3"
    
    shape mkt1 as @circle label:"Mkt 1"
    shape mkt2 as @circle label:"Mkt 2"
    shape mkt3 as @circle label:"Mkt 3"
    
    shape fin1 as @circle label:"Fin 1"
    shape fin2 as @circle label:"Fin 2"
    
    shape pm1 as @circle label:"PM 1"
    shape pm2 as @circle label:"PM 2"
    shape pm3 as @circle label:"PM 3"
    
    shape sal1 as @circle label:"Sales 1"
    shape sal2 as @circle label:"Sales 2"
    shape sal3 as @circle label:"Sales 3"
    shape sal4 as @circle label:"Sales 4"
    
    ceo -> cto
    ceo -> cfo
    ceo -> cmo
    cto -> eng1
    cto -> eng2
    cto -> pm1
    cfo -> fin1
    cfo -> fin2
    cmo -> mkt1
    cmo -> sal1
    
    eng1 -> eng2
    eng2 -> eng3
    eng3 -> eng4
    eng4 -> eng5
    eng1 -> des1
    eng2 -> des2
    eng3 -> des3
    pm1 -> eng1
    pm2 -> eng3
    pm3 -> eng5
    pm1 -> des1
    pm2 -> des2
    pm3 -> des3
    mkt1 -> mkt2
    mkt2 -> mkt3
    sal1 -> sal2
    sal2 -> sal3
    sal3 -> sal4
    mkt1 -> sal1
    pm1 -> mkt1
  }
}`;
				await syntaxEditor.fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2500);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('network-04-force-medium.png', {
					maxDiffPixels: 600,
					maxDiffPixelRatio: 0.03,
					fullPage: true
				});
			});
		});

		test('05-force-knowledge-graph: Concept relationships', async ({ page }) => {
			await test.step('Enter knowledge graph diagram', async () => {
				const dsl = `diagram "Knowledge Graph" {
  container "Concepts" algorithm: force spacing: 110 {
    shape prog as @rect label:"Programming"
    shape web as @rect label:"Web Dev"
    shape mobile as @rect label:"Mobile Dev"
    shape db as @rect label:"Databases"
    shape ai as @rect label:"AI/ML"
    
    shape js as @circle label:"JavaScript"
    shape py as @circle label:"Python"
    shape java as @circle label:"Java"
    
    shape react as @roundedRect label:"React"
    shape vue as @roundedRect label:"Vue"
    shape django as @roundedRect label:"Django"
    shape flask as @roundedRect label:"Flask"
    shape tensorflow as @roundedRect label:"TensorFlow"
    
    prog -> web
    prog -> mobile
    prog -> db
    prog -> ai
    web -> js
    mobile -> java
    ai -> py
    js -> react
    js -> vue
    py -> django
    py -> flask
    py -> tensorflow
    web -> react
    web -> vue
  }
}`;
				await syntaxEditor.fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('network-05-force-knowledge-graph.png', {
					maxDiffPixels: 600,
					maxDiffPixelRatio: 0.03,
					fullPage: true
				});
			});
		});
	});

	test.describe('Algorithm Comparison', () => {
		test('06-comparison-layered-vs-force: Same data, different algorithms', async ({ page }) => {
			await test.step('Enter comparison diagram', async () => {
				const dsl = `diagram "Layout Comparison" {
  direction LR
  container "Layered" direction:TB {
    shape a as @circle label:"A"
    shape b as @circle label:"B"
    shape c as @circle label:"C"
    shape d as @circle label:"D"
    a -> b
    a -> c
    b -> d
    c -> d
  }
  
  container "Force" algorithm:force spacing:100 {
    shape e as @circle label:"E"
    shape f as @circle label:"F"
    shape g as @circle label:"G"
    shape h as @circle label:"H"
    e -> f
    e -> g
    f -> h
    g -> h
  }
}`;
				await syntaxEditor.fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('network-06-comparison-algorithms.png', {
					maxDiffPixels: 250,
					fullPage: true
				});
			});
		});
	});
});
