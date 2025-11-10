/**
 * Playwright Visual Regression Tests for Phase 3: Data-Driven Rendering
 * Tests dynamic shape generation, style mappings, and legend rendering
 */

import { test, expect } from '@playwright/test';

test.describe('Phase 3: Data-Driven Rendering - Visual Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Wait for editor to be ready
		await page.waitForSelector('.cm-editor', { state: 'visible' });
		// Clear the Syntax tab editor
		const syntaxEditor = page.locator('[data-value="syntax"] .cm-content');
		await syntaxEditor.click();
		await page.keyboard.press('Control+A');
		await page.keyboard.press('Delete');
	});

	test.describe('Dynamic Shape Generation', () => {
		test('01-basic-template-nodes: Generate nodes from template', async ({ page }) => {
			await test.step('Enter diagram with template', async () => {
				const dsl = `diagram "User Cards"

data source:users [
  { id: "u1", name: "Alice", role: "Admin" },
  { id: "u2", name: "Bob", role: "User" },
  { id: "u3", name: "Charlie", role: "User" }
]

template "userCard" from:users {
  node "\${user.name}" shape:rect
    label: "\${user.name}"
    subtitle: "\${user.role}"
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase3-01-basic-template-nodes.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});

		test('02-template-edges: Generate edges from relationships', async ({ page }) => {
			await test.step('Enter diagram with edge template', async () => {
				const dsl = `diagram "Network Topology"

data source:nodes [
  { id: "server1", name: "Web Server" },
  { id: "server2", name: "App Server" },
  { id: "db1", name: "Database" }
]

data source:connections [
  { from: "server1", to: "server2", protocol: "HTTP" },
  { from: "server2", to: "db1", protocol: "SQL" }
]

template "nodes" from:nodes {
  node "\${node.id}" shape:rect label: "\${node.name}"
}

template "edges" from:connections {
  edge "\${conn.from}" -> "\${conn.to}"
    label: "\${conn.protocol}"
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase3-02-template-edges.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});
	});

	test.describe('Category Style Mappings', () => {
		test('03-category-colors: Map status to fill colors', async ({ page }) => {
			await test.step('Enter diagram with category style mapping', async () => {
				const dsl = `diagram "Server Status"

data source:servers [
  { id: "s1", name: "API", status: "healthy", cpu: 45 },
  { id: "s2", name: "Database", status: "warning", cpu: 75 },
  { id: "s3", name: "Cache", status: "error", cpu: 95 }
]

template "serverNodes" from:servers {
  node "\${server.id}" shape:rounded
    label: "\${server.name}"
    subtitle: "CPU: \${server.cpu}%"
    fill: @map(server.status) {
      healthy: "#22c55e"
      warning: "#eab308"
      error: "#ef4444"
    }
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase3-03-category-colors.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});

		test('04-category-shapes: Map types to different shapes', async ({ page }) => {
			await test.step('Enter diagram with shape mapping', async () => {
				const dsl = `diagram "Component Types"

data source:components [
  { id: "c1", name: "Web Server", type: "server" },
  { id: "c2", name: "Database", type: "database" },
  { id: "c3", name: "Storage", type: "storage" }
]

template "components" from:components {
  node "\${comp.id}"
    shape: @map(comp.type) {
      server: @server
      database: @database
      storage: @storage
    }
    label: "\${comp.name}"
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase3-04-category-shapes.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});
	});

	test.describe('Scale Style Mappings', () => {
		test('05-scale-opacity: Map load percentage to opacity', async ({ page }) => {
			await test.step('Enter diagram with opacity scale', async () => {
				const dsl = `diagram "Server Load"

data source:servers [
  { id: "s1", name: "Server 1", load: 20 },
  { id: "s2", name: "Server 2", load: 50 },
  { id: "s3", name: "Server 3", load: 80 },
  { id: "s4", name: "Server 4", load: 100 }
]

template "loadServers" from:servers {
  node "\${server.id}" shape:rect
    label: "\${server.name}"
    subtitle: "Load: \${server.load}%"
    fill: "#3b82f6"
    opacity: @scale(server.load, 0, 100, 0.3, 1.0)
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase3-05-scale-opacity.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});

		test('06-scale-color-gradient: Map temperature to color gradient', async ({ page }) => {
			await test.step('Enter diagram with color gradient', async () => {
				const dsl = `diagram "Temperature Sensors"

data source:sensors [
  { id: "t1", name: "Zone A", temp: 0 },
  { id: "t2", name: "Zone B", temp: 25 },
  { id: "t3", name: "Zone C", temp: 50 },
  { id: "t4", name: "Zone D", temp: 75 },
  { id: "t5", name: "Zone E", temp: 100 }
]

template "tempSensors" from:sensors {
  node "\${sensor.id}" shape:circle
    label: "\${sensor.name}"
    subtitle: "\${sensor.temp}°C"
    fill: @scale(sensor.temp, 0, 100, "#0000ff", "#ff0000")
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase3-06-scale-color-gradient.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});

		test('07-scale-stroke-width: Map bandwidth to edge thickness', async ({ page }) => {
			await test.step('Enter diagram with edge thickness mapping', async () => {
				const dsl = `diagram "Network Bandwidth"

data source:nodes [
  { id: "n1", name: "Node 1" },
  { id: "n2", name: "Node 2" },
  { id: "n3", name: "Node 3" }
]

data source:links [
  { from: "n1", to: "n2", bandwidth: 10 },
  { from: "n2", to: "n3", bandwidth: 50 },
  { from: "n1", to: "n3", bandwidth: 100 }
]

template "nodes" from:nodes {
  node "\${node.id}" shape:rect label: "\${node.name}"
}

template "links" from:links {
  edge "\${link.from}" -> "\${link.to}"
    label: "\${link.bandwidth} Mbps"
    strokeWidth: @scale(link.bandwidth, 0, 100, 1, 5)
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase3-07-scale-stroke-width.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});
	});

	test.describe('Threshold Style Mappings', () => {
		test('08-threshold-colors: Map score ranges to colors', async ({ page }) => {
			await test.step('Enter diagram with threshold mapping', async () => {
				const dsl = `diagram "Test Scores"

data source:students [
  { id: "s1", name: "Alice", score: 95 },
  { id: "s2", name: "Bob", score: 75 },
  { id: "s3", name: "Charlie", score: 55 },
  { id: "s4", name: "Diana", score: 35 }
]

template "scores" from:students {
  node "\${student.id}" shape:rect
    label: "\${student.name}"
    subtitle: "Score: \${student.score}"
    fill: @threshold(student.score) {
      80: "#22c55e"
      60: "#eab308"
      0: "#ef4444"
    }
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase3-08-threshold-colors.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});
	});

	test.describe('Combined Features', () => {
		test('09-combined-mappings: Multiple style mappings on same diagram', async ({ page }) => {
			await test.step('Enter complex diagram', async () => {
				const dsl = `diagram "Service Architecture"

data source:services [
  { id: "api", name: "API Gateway", health: "healthy", load: 45, priority: "high" },
  { id: "auth", name: "Auth Service", health: "warning", load: 75, priority: "high" },
  { id: "db", name: "Database", health: "healthy", load: 60, priority: "critical" },
  { id: "cache", name: "Cache", health: "error", load: 90, priority: "medium" }
]

template "services" from:services {
  node "\${svc.id}" shape:rounded
    label: "\${svc.name}"
    subtitle: "Load: \${svc.load}%"
    fill: @map(svc.health) {
      healthy: "#22c55e"
      warning: "#eab308"
      error: "#ef4444"
    }
    opacity: @scale(svc.load, 0, 100, 0.4, 1.0)
    stroke: @map(svc.priority) {
      critical: "#ff0000"
      high: "#ff9900"
      medium: "#3b82f6"
    }
    strokeWidth: @map(svc.priority) {
      critical: 3
      high: 2
      medium: 1
    }
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase3-09-combined-mappings.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});

		test('10-conditional-filtering: Filter and map data', async ({ page }) => {
			await test.step('Enter diagram with filtering', async () => {
				const dsl = `diagram "Active Users Only"

data source:users [
  { id: "u1", name: "Alice", active: true, role: "admin" },
  { id: "u2", name: "Bob", active: false, role: "user" },
  { id: "u3", name: "Charlie", active: true, role: "user" },
  { id: "u4", name: "Diana", active: true, role: "admin" }
]

template "activeUsers" from:users filter: user.active {
  node "\${user.id}" shape:rect
    label: "\${user.name}"
    fill: @map(user.role) {
      admin: "#ff9900"
      user: "#3b82f6"
    }
}`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase3-10-conditional-filtering.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});
	});

	test.describe('Legend Generation (Phase 3.4)', () => {
		test('11-category-legend: Auto-generate category legend', async ({ page }) => {
			await test.step('Enter diagram with legend', async () => {
				const dsl = `diagram "Status Dashboard"

data source:services [
  { id: "s1", name: "API", status: "running" },
  { id: "s2", name: "DB", status: "stopped" },
  { id: "s3", name: "Cache", status: "error" }
]

template "services" from:services {
  node "\${svc.id}" shape:rect
    label: "\${svc.name}"
    fill: @map(svc.status) {
      running: "#22c55e"
      stopped: "#6b7280"
      error: "#ef4444"
    }
}

legend for fill:status position:bottom-right title:"Service Status"`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase3-11-category-legend.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});

		test('12-scale-legend: Auto-generate scale legend', async ({ page }) => {
			await test.step('Enter diagram with scale legend', async () => {
				const dsl = `diagram "Temperature Map"

data source:zones [
  { id: "z1", name: "Zone 1", temp: 20 },
  { id: "z2", name: "Zone 2", temp: 40 },
  { id: "z3", name: "Zone 3", temp: 60 },
  { id: "z4", name: "Zone 4", temp: 80 }
]

template "zones" from:zones {
  node "\${zone.id}" shape:rect
    label: "\${zone.name}"
    subtitle: "\${zone.temp}°C"
    fill: @scale(zone.temp, 0, 100, "#0000ff", "#ff0000")
}

legend for fill:temp position:bottom-right title:"Temperature (°C)" steps:5`;
				await page.locator('[data-value="syntax"] .cm-content').fill(dsl);
			});

			await test.step('Wait for rendering', async () => {
				await page.waitForTimeout(2000);
			});

			await test.step('Take screenshot for visual regression', async () => {
				await expect(page).toHaveScreenshot('phase3-12-scale-legend.png', {
					maxDiffPixels: 200,
					fullPage: true
				});
			});
		});
	});
});
