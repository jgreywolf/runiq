import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Exclude Playwright visual regression tests
    // Those should only run with 'pnpm test:visual'
    exclude: ['**/node_modules/**', '**/dist/**', '**/src/visual/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/src/visual/**',
        '**/src/index.ts',
        '**/test-*.js',
        '**/*.spec.ts',
        '**/*.test.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
