# CI/CD Pipeline Setup

This document describes the Continuous Integration pipeline for Runiq.

## Overview

The CI pipeline runs on every push to `main` and on all pull requests. It performs:

1. **Testing** - Unit tests across Node 20.x and 22.x
2. **Coverage** - Code coverage reporting with Codecov integration
3. **Visual Tests** - Playwright visual regression tests
4. **Security** - Dependency vulnerability scanning
5. **Type Checking** - TypeScript compilation verification

## Workflow Jobs

### 1. Test & Lint

- **Matrix Strategy:** Tests run on Node 20.x and 22.x
- **Steps:**
  - Checkout code
  - Install dependencies with pnpm
  - Type check all packages
  - Build all packages
  - Run unit tests

### 2. Coverage Report

- **Node Version:** 20.x
- **Steps:**
  - Run tests with coverage enabled (`--coverage`)
  - Upload coverage to Codecov
  - Check coverage thresholds (80% lines/functions, 75% branches)

### 3. Visual Tests

- **Node Version:** 20.x
- **Browser:** Chromium (via Playwright)
- **Steps:**
  - Install Playwright browsers
  - Build packages
  - Run visual regression tests
  - Upload test results/screenshots on failure

### 4. Security Audit

- **Node Version:** 20.x
- **Steps:**
  - Run `pnpm audit` to check for vulnerabilities
  - Reports moderate+ severity issues

### 5. Status Check

- **Dependencies:** All jobs above
- **Purpose:** Final gate that fails if any job fails

## Coverage Configuration

Coverage is configured in each package's `vitest.config.ts`:

```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html', 'lcov'],
  exclude: [
    '**/node_modules/**',
    '**/dist/**',
    '**/*.spec.ts',
    '**/*.test.ts',
  ],
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 75,
    statements: 80,
  },
}
```

## Bundle Size Monitoring

Bundle sizes are tracked in `.size-limit.json`:

- `@runiq/core`: 50 KB
- `@runiq/parser-dsl`: 200 KB (includes Langium)
- `@runiq/layout-base`: 100 KB (includes ELK)
- `@runiq/renderer-svg`: 75 KB
- Other packages: 25-50 KB

Run locally: `pnpm size`

## Required Secrets

Configure these in GitHub repository settings:

- `CODECOV_TOKEN` - For uploading coverage reports (get from codecov.io)

## Local Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run visual tests
pnpm --filter @runiq/renderer-svg test:visual

# Check bundle sizes
pnpm size

# Security audit
pnpm audit
```

## Status Badges

Add to README.md:

```markdown
[![CI](https://github.com/jgreywolf/runiq/actions/workflows/ci.yml/badge.svg)](https://github.com/jgreywolf/runiq/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/jgreywolf/runiq/branch/main/graph/badge.svg)](https://codecov.io/gh/jgreywolf/runiq)
```

## Next Steps

1. **Enable Codecov:** Sign up at codecov.io and add the `CODECOV_TOKEN` secret
2. **Add Status Badges:** Update README.md with CI and coverage badges
3. **Configure Branch Protection:** Require CI to pass before merging PRs
4. **Optional:** Add deployment workflows for docs and editor

## Troubleshooting

### Coverage Upload Fails

- Ensure `CODECOV_TOKEN` secret is set
- Check that coverage files are being generated in `packages/*/coverage/`

### Visual Tests Fail

- Review uploaded artifacts (available for 7 days)
- Update snapshots if intentional: `pnpm test:visual:update`

### Security Audit Warnings

- Review `pnpm audit` output
- Update dependencies or add overrides if needed
- High/critical vulnerabilities should be addressed ASAP

## Related Documents

- [CI-CD-IMPLEMENTATION-PLAN.md](CI-CD-IMPLEMENTATION-PLAN.md) - Detailed implementation guide
- [COMPREHENSIVE-ANALYSIS-REPORT.md](COMPREHENSIVE-ANALYSIS-REPORT.md) - Full analysis report
