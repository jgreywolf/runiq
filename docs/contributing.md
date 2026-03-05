---
title: Contributing Guide
---

# Contributing to Runiq

We welcome contributions! This guide explains how to set up your environment, coding standards, and the PR process.

## Environment

- Node: >= 20.19.0 < 21 or >= 22.12.0
- Package manager: pnpm (v8+)
- OS: Windows, macOS, or Linux

```bash
pnpm -v
node -v
```

## Repository Setup

```bash
git clone https://github.com/jgreywolf/runiq.git
cd runiq
pnpm install
pnpm -r build
pnpm -r test
```

## Packages overview

- packages/core – Core types, shapes, registries
- packages/parser-dsl – Langium parser
- packages/layout-base – ELK layout engine adapter
- packages/renderer-svg – SVG renderer
- packages/io-json – JSON import/export
- packages/icons-fontawesome – Icon library
- packages/cli – Command-line interface (WIP)
- apps/editor – SvelteKit web editor

## Coding standards

- TypeScript strict mode; no `any` (prefer `unknown` + type guards)
- ESLint + Prettier enforced
- Meaningful names; comment complex algorithms

## Test-Driven Development

- Write tests first where practical
- Use Vitest; minimum coverage targets per package
- Run tests frequently

```bash
pnpm -r test
```

## Running the docs

```bash
pnpm -C docs dev
pnpm -C docs build
```

## Pull Requests

1. Create a feature branch from `main`
2. Ensure build, lint, and tests pass
3. Update docs if behavior changes
4. Open PR with a clear description and screenshots (for visual changes)

## Issue triage

- Use labels: bug, enhancement, docs, good first issue
- Provide minimal repros when reporting bugs

## Code of Conduct

Be respectful, constructive, and inclusive. We follow the Contributor Covenant.
