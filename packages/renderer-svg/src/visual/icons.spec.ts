import { test, expect } from '@playwright/test';
import { renderAndSetup } from './utils';

test.describe('Visual Regression - Icon Tests', () => {
  test('should render shape with icon property', async ({ page }) => {
    const dsl = `
diagram "Icon Property Test" {
  shape user as @rectangle label:"User" icon:fa/user
  shape server as @rectangle label:"Server" icon:fa/server
  user -connects-> server
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('icon-property-basic.png');
  });

  test('should render multiple shapes with different icons', async ({
    page,
  }) => {
    const dsl = `
diagram "Multiple Icons" {
  shape codeNode as @rounded label:"Code" icon:fa/code
  shape dataNode as @rounded label:"Data" icon:fa/server
  shape cloudNode as @rounded label:"Cloud" icon:fa/cloud
  shape securityNode as @rounded label:"Security" icon:fa/lock
  
  codeNode -to-> dataNode
  dataNode -to-> cloudNode
  cloudNode -to-> securityNode
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('icon-multiple-icons.png');
  });

  test('should render inline icon syntax in labels', async ({ page }) => {
    const dsl = `
diagram "Inline Icon Syntax" {
  shape launch as @rounded label:"fa:fa-rocket Launch Campaign"
  shape twitter as @rounded label:"fa:fa-twitter Twitter"
  shape facebook as @rounded label:"fa:fa-facebook Facebook"
  
  launch -to-> twitter
  launch -to-> facebook
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('icon-inline-syntax.png');
  });

  test('should render icon with custom colors', async ({ page }) => {
    const dsl = `
diagram "Colored Icons" {
  shape node1 as @rectangle label:"Node 1" icon:fa/heart fill:"#ec4899" strokeColor:"#db2777"
  shape node2 as @rectangle label:"Node 2" icon:fa/star fill:"#f59e0b" strokeColor:"#d97706"
  shape node3 as @rectangle label:"Node 3" icon:fa/check fill:"#10b981" strokeColor:"#059669"
  
  node1 -to-> node2
  node2 -to-> node3
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('icon-colored.png');
  });

  test('should render common FontAwesome icons', async ({ page }) => {
    const dsl = `
diagram "Common FA Icons" {
  shape homeIcon as @rounded label:"Home" icon:fa/home
  shape settingsIcon as @rounded label:"Settings" icon:fa/gear
  shape profileIcon as @rounded label:"Profile" icon:fa/user
  shape filesIcon as @rounded label:"Files" icon:fa/folder
  shape searchIcon as @rounded label:"Search" icon:fa/search
  
  homeIcon -to-> settingsIcon
  homeIcon -to-> profileIcon
  homeIcon -to-> filesIcon
  homeIcon -to-> searchIcon
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('icon-common-fa-icons.png');
  });

  test('should render tech stack icons', async ({ page }) => {
    const dsl = `
diagram "Tech Stack Icons" {
  shape frontendLayer as @rounded label:"Frontend" icon:fa/desktop
  shape backendLayer as @rounded label:"Backend" icon:fa/server
  shape dbLayer as @rounded label:"Database" icon:fa/table
  shape apiLayer as @rounded label:"API" icon:fa/code
  
  frontendLayer -calls-> apiLayer
  apiLayer -queries-> dbLayer
  backendLayer -manages-> dbLayer
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('icon-tech-stack.png');
  });

  test('should render business process icons', async ({ page }) => {
    const dsl = `
diagram "Business Process Icons" {
  shape planPhase as @rounded label:"Planning" icon:fa/calendar
  shape execPhase as @rounded label:"Execution" icon:fa/gears
  shape testPhase as @rounded label:"Testing" icon:fa/flask
  shape shipPhase as @rounded label:"Delivery" icon:fa/truck
  
  planPhase -to-> execPhase
  execPhase -to-> testPhase
  testPhase -to-> shipPhase
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('icon-business-process.png');
  });

  test('should render icons with different shape types', async ({ page }) => {
    const dsl = `
diagram "Icons with Different Shapes" {
  shape circle1 as @circle label:"Circle" icon:fa/info
  shape hex1 as @hexagon label:"Hexagon" icon:fa/stop
  shape diamond1 as @rhombus label:"Diamond" icon:fa/gem
  shape rect1 as @rectangle label:"Rectangle" icon:fa/square
  
  circle1 -to-> hex1
  hex1 -to-> diamond1
  diamond1 -to-> rect1
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('icon-different-shapes.png');
  });

  test('should render icons in container', async ({ page }) => {
    const dsl = `
diagram "Icons in Container" {
  container "Services" fillColor:"#e3f2fd" strokeColor:"#1976d2" {
    shape webLayer as @rounded label:"Web" icon:fa/globe
    shape apiLayer as @rounded label:"API" icon:fa/plug
    shape cacheLayer as @rounded label:"Cache" icon:fa/bolt
    
    webLayer -to-> apiLayer
    apiLayer -to-> cacheLayer
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('icon-in-container.png');
  });

  test('should render social media icons', async ({ page }) => {
    const dsl = `
diagram "Social Media Icons" {
  shape twitterIcon as @rounded label:"Twitter" icon:fa/twitter
  shape facebookIcon as @rounded label:"Facebook" icon:fa/facebook
  shape linkedinIcon as @rounded label:"LinkedIn" icon:fa/linkedin
  shape githubIcon as @rounded label:"GitHub" icon:fa/github
  
  twitterIcon -links-> facebookIcon
  facebookIcon -links-> linkedinIcon
  linkedinIcon -links-> githubIcon
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('icon-social-media.png');
  });

  test('should render data flow icons', async ({ page }) => {
    const dsl = `
diagram "Data Flow Icons" {
  shape inputNode as @rounded label:"Input" icon:fa/download
  shape processNode as @rounded label:"Process" icon:fa/gears
  shape outputNode as @rounded label:"Output" icon:fa/upload
  shape storageNode as @rounded label:"Storage" icon:fa/save
  
  inputNode -to-> processNode
  processNode -to-> outputNode
  processNode -to-> storageNode
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('icon-data-flow.png');
  });

  test('should render security icons', async ({ page }) => {
    const dsl = `
diagram "Security Icons" {
  shape authNode as @rounded label:"Auth" icon:fa/user
  shape certNode as @rounded label:"Certificate" icon:fa/certificate
  shape encryptNode as @rounded label:"Encrypt" icon:fa/lightbulb
  shape monitorNode as @rounded label:"Monitor" icon:fa/search
  
  authNode -to-> certNode
  certNode -to-> encryptNode
  encryptNode -to-> monitorNode
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('icon-security.png');
  });
});
