import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Exclude Playwright visual regression tests
    // Those should only run with 'pnpm test:visual'
    exclude: ['**/node_modules/**', '**/dist/**', '**/src/visual/**'],
  },
});
