import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for visual regression testing
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './src/visual',

  // Timeout for each test
  timeout: 30 * 1000,

  // Expect timeout for assertions
  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      // Maximum pixel difference allowed
      maxDiffPixels: 475,
      // Maximum percentage of pixels that can differ
      maxDiffPixelRatio: 0.02,
      // Generate diffs for failed comparisons
      animations: 'disabled',
      // Use consistent anti-aliasing
      scale: 'css',
    },
  },

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ...(process.env.CI ? [['github' as const]] : []),
  ],

  use: {
    // Viewport size for screenshots
    viewport: { width: 1280, height: 720 },

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Force consistent rendering
        deviceScaleFactor: 1,
      },
    },

    // Uncomment to test on Firefox and WebKit
    // {
    // 	name: 'firefox',
    // 	use: {
    // 		...devices['Desktop Firefox'],
    // 		deviceScaleFactor: 1
    // 	}
    // },

    // {
    // 	name: 'webkit',
    // 	use: {
    // 		...devices['Desktop Safari'],
    // 		deviceScaleFactor: 1
    // 	}
    // }
  ],
});
