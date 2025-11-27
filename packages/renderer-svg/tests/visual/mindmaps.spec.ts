import { test, expect } from '@playwright/test';
import { renderAndSetup } from './utils';

test.describe('Visual Regression - Mindmap Tests', () => {
  test('should render a simple mindmap with automatic styling', async ({
    page,
  }) => {
    const dsl = `
diagram "Simple Mindmap" {
  container "Mindmap" type:mindmap algorithm:radial spacing:70 {
    shape main label:"Main Topic"
    shape idea1 label:"First Idea"
    shape idea2 label:"Second Idea"
    shape idea3 label:"Third Idea"
    
    main -to-> idea1
    main -to-> idea2
    main -to-> idea3
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('mindmap-simple.png');
  });

  test('should render mindmap with hierarchical levels (3 levels)', async ({
    page,
  }) => {
    const dsl = `
diagram "Hierarchical Mindmap" {
  container "Mindmap" type:mindmap algorithm:radial spacing:80 {
    shape root label:"Root"
    
    shape branch1 label:"Branch 1"
    shape branch2 label:"Branch 2"
    
    shape leaf1 label:"Leaf 1"
    shape leaf2 label:"Leaf 2"
    shape leaf3 label:"Leaf 3"
    shape leaf4 label:"Leaf 4"
    
    root -to-> branch1
    root -to-> branch2
    
    branch1 -to-> leaf1
    branch1 -to-> leaf2
    branch2 -to-> leaf3
    branch2 -to-> leaf4
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('mindmap-hierarchical.png');
  });

  test('should render mindmap with explicit shapes', async ({ page }) => {
    const dsl = `
diagram "Mindmap with Shapes" {
  container "Mindmap" type:mindmap algorithm:radial spacing:90 {
    shape hub as @circle label:"Central"
    shape node1 as @roundedRectangle label:"Topic 1"
    shape node2 as @roundedRectangle label:"Topic 2"
    shape detail1 as @rectangle label:"Detail A"
    shape detail2 as @rectangle label:"Detail B"
    
    hub -to-> node1
    hub -to-> node2
    node1 -to-> detail1
    node2 -to-> detail2
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('mindmap-explicit-shapes.png');
  });

  test('should render mindmap with custom colors', async ({ page }) => {
    const dsl = `
diagram "Colored Mindmap" {
  container "Mindmap" type:mindmap algorithm:radial spacing:85 {
    shape core as @circle label:"Core" fill:"#6366f1" strokeColor:"#4338ca" strokeWidth:3
    shape topic1 as @roundedRectangle label:"Topic 1" fill:"#10b981" strokeColor:"#059669" strokeWidth:2
    shape topic2 as @roundedRectangle label:"Topic 2" fill:"#3b82f6" strokeColor:"#2563eb" strokeWidth:2
    shape topic3 as @roundedRectangle label:"Topic 3" fill:"#f59e0b" strokeColor:"#d97706" strokeWidth:2
    
    core -to-> topic1
    core -to-> topic2
    core -to-> topic3
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('mindmap-colored.png');
  });

  test('should render mindmap with radial layout', async ({ page }) => {
    const dsl = `
diagram "Radial Mindmap" {
  container "Mindmap" algorithm:radial spacing:100 {
    shape core label:"Core Concept"
    shape n1 label:"Node 1"
    shape n2 label:"Node 2"
    shape n3 label:"Node 3"
    shape n4 label:"Node 4"
    shape n5 label:"Node 5"
    
    core -to-> n1
    core -to-> n2
    core -to-> n3
    core -to-> n4
    core -to-> n5
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('mindmap-radial-layout.png');
  });

  test('should render mindmap with different spacing', async ({ page }) => {
    const dsl = `
diagram "Tight Spacing Mindmap" {
  container "Mindmap" type:mindmap algorithm:radial spacing:50 {
    shape main label:"Main"
    shape a label:"A"
    shape b label:"B"
    shape c label:"C"
    
    main -to-> a
    main -to-> b
    main -to-> c
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('mindmap-tight-spacing.png');
  });

  test('should render mindmap with container styling', async ({ page }) => {
    const dsl = `
diagram "Styled Container Mindmap" {
  container "Mindmap" type:mindmap algorithm:radial spacing:80 fillColor:"#e8f5e9" strokeColor:"#4caf50" borderWidth:2 {
    shape root label:"Root"
    shape child1 label:"Child 1"
    shape child2 label:"Child 2"
    
    root -to-> child1
    root -to-> child2
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('mindmap-container-styled.png');
  });

  test('should render mindmap with asymmetric branches', async ({ page }) => {
    const dsl = `
diagram "Asymmetric Mindmap" {
  container "Mindmap" type:mindmap algorithm:radial spacing:75 {
    shape central label:"Central"
    
    shape left1 label:"Left 1"
    shape left2 label:"Left 2"
    
    shape right1 label:"Right 1"
    shape right2 label:"Right 2"
    shape right3 label:"Right 3"
    
    shape detail1 label:"Detail"
    
    central -to-> left1
    central -to-> left2
    central -to-> right1
    central -to-> right2
    central -to-> right3
    
    right1 -to-> detail1
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('mindmap-asymmetric.png');
  });

  test('should render mindmap with multiline labels', async ({ page }) => {
    const dsl = `
diagram "Multiline Mindmap" {
  container "Mindmap" type:mindmap algorithm:radial spacing:90 {
    shape root label:"Main\\nTopic"
    shape branch1 label:"First\\nBranch"
    shape branch2 label:"Second\\nBranch"
    
    root -to-> branch1
    root -to-> branch2
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('mindmap-multiline-labels.png');
  });

  test('should render deep mindmap hierarchy (4 levels)', async ({ page }) => {
    const dsl = `
diagram "Deep Mindmap" {
  container "Mindmap" type:mindmap algorithm:radial spacing:70 {
    shape l1 label:"Level 1"
    shape l2a label:"Level 2A"
    shape l2b label:"Level 2B"
    shape l3a label:"Level 3A"
    shape l3b label:"Level 3B"
    shape l4 label:"Level 4"
    
    l1 -to-> l2a
    l1 -to-> l2b
    l2a -to-> l3a
    l2b -to-> l3b
    l3a -to-> l4
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('mindmap-deep-hierarchy.png');
  });

  test('should render mindmap with stress algorithm', async ({ page }) => {
    const dsl = `
diagram "Stress Layout Mindmap" {
  container "Mindmap" algorithm:stress spacing:60 {
    shape nodeA label:"A"
    shape nodeB label:"B"
    shape nodeC label:"C"
    shape nodeD label:"D"
    shape nodeE label:"E"
    
    nodeA -to-> nodeB
    nodeA -to-> nodeC
    nodeB -to-> nodeD
    nodeC -to-> nodeE
    nodeD -to-> nodeE
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('mindmap-stress-algorithm.png');
  });

  test('should render mindmap with wide branching (6+ branches)', async ({
    page,
  }) => {
    const dsl = `
diagram "Wide Branching Mindmap" {
  container "Mindmap" type:mindmap algorithm:radial spacing:80 {
    shape core label:"Core"
    shape b1 label:"Branch 1"
    shape b2 label:"Branch 2"
    shape b3 label:"Branch 3"
    shape b4 label:"Branch 4"
    shape b5 label:"Branch 5"
    shape b6 label:"Branch 6"
    shape b7 label:"Branch 7"
    
    core -to-> b1
    core -to-> b2
    core -to-> b3
    core -to-> b4
    core -to-> b5
    core -to-> b6
    core -to-> b7
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('mindmap-wide-branching.png');
  });
});
