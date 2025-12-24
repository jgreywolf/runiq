---
title: Getting Started
description: Get Runiq up and running in minutes with installation, basic usage, and next steps.
lastUpdated: 2025-01-09
---

# Getting Started

<div style="text-align:center; margin: 1.5rem 0;">
  <img src="/images/runiq.waving.png" alt="Runiq waving" style="max-width: 520px; width: 100%;" />
  <div style="color:#6b7280; font-size: 0.95rem; margin-top: .5rem;">Say hello to Runiq!</div>
</div>

This guide will help you get Runiq up and running in minutes.

## Installation

### Prerequisites

- **Node.js** >= 20.19 (or >= 22.12)
- **pnpm** >= 8.15.0 (recommended) or npm

### Use in your web app (npm)

If you just want to render diagrams in your own application, install the browser SDK:

```bash
npm install @runiq/web
```

Quick start in code:

```ts
import { renderRuniqToSvg } from '@runiq/web';

const text = `diagram "Hello" {\n  shape A as @rect label:"Hi"\n  shape B as @rect label:"There"\n  A -link-> B\n}`;
const { svg } = await renderRuniqToSvg(text);
document.querySelector('#out')!.innerHTML = svg;
```

### Install via pnpm (monorepo dev)

```bash
# Install pnpm globally if you haven't
npm install -g pnpm

# Clone the repository
git clone https://github.com/jgreywolf/runiq.git
cd runiq

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests to verify
pnpm test
```

## Project Structure

```
Runiq/
├── packages/              # Core packages
│   ├── core/             # Types, shapes, registries
│   ├── parser-dsl/       # Langium parser
│   ├── layout-base/      # ELK layout engine
│   ├── renderer-svg/     # SVG renderer
│   ├── renderer-schematic/# IEEE schematic renderer
│   ├── io-json/          # JSON I/O
│   ├── web/              # Browser SDK
│   ├── export-spice/     # SPICE exporter
│   ├── export-verilog/   # Verilog exporter
│   ├── export-latex/     # LaTeX exporter
│   ├── export-simulink/  # Simulink exporter
│   └── cli/              # CLI tool
├── apps/
│   └── editor/           # SvelteKit editor
├── examples/             # Example diagrams
└── docs/                 # Documentation
```

## Your First Diagram

Runiq offers two ways to create diagrams:

1. **Glyphsets (Smart Art)** - Pre-built templates for quick diagrams
2. **Diagram Profile** - Full control with custom shapes and connections

### Quick Start with Glyphsets

Glyphsets are the fastest way to create professional diagrams. Just provide your data:

```runiq
glyphset basicProcess "Development Workflow" {
  step "Requirements"
  step "Design"
  step "Implementation"
  step "Testing"
  step "Deployment"

  theme professional
  orientation "horizontal"
}
```

That's it! Runiq generates a complete process flow diagram automatically.

**More glyphset examples:**

```runiq
// Organization chart
glyphset orgChart "Company Structure" {
  person "CEO" {
    person "CTO" {
      person "Dev Team Lead"
      person "QA Manager"
    }
    person "CFO"
  }
}

// Comparison matrix
glyphset matrix "Feature Comparison" {
  quadrant "High Priority / Easy" label: "Quick Wins"
  quadrant "High Priority / Hard" label: "Strategic"
  quadrant "Low Priority / Easy" label: "Nice to Have"
  quadrant "Low Priority / Hard" label: "Avoid"

  horizontalAxis "Priority"
  verticalAxis "Difficulty"
}
```

[Learn more about glyphsets →](/guide/glyphsets)

### Full Control with Diagram Profile

For detailed diagrams with custom layouts, use the diagram profile:

### 1. Create a `.runiq` file

Create a file named `hello.runiq`:

```runiq
diagram "Hello Runiq" {
  theme ocean
  direction TB

  shape Start as @rounded label: "Start"
  shape Process as @rect label: "Process Data"
  shape Decision as @rhombus label: "Valid?"
  shape Success as @hexagon label: "Success"
  shape Error as @doc label: "Error"

  Start -> Process
  Process -> Decision
  Decision -yes-> Success
  Decision -no-> Error
}
```

**Pro tip**: Add a `theme` declaration to automatically apply professional color schemes. [Learn more about themes →](/guide/themes)

### 2. Generate SVG (via CLI - coming soon)

```bash
# Once CLI is ready
runiq hello.runiq -o hello.svg
```

### 3. Use in Code

```typescript
import { parse } from '@runiq/parser-dsl';
import { layoutDiagram } from '@runiq/layout-base';
import { renderSvg } from '@runiq/renderer-svg';
import { readFileSync, writeFileSync } from 'fs';

// Read the .runiq file
const dslContent = readFileSync('hello.runiq', 'utf-8');

// Parse
const parseResult = parse(dslContent);
if (!parseResult.success) {
  console.error('Parse errors:', parseResult.errors);
  process.exit(1);
}

// Layout
const diagram = parseResult.document!.diagrams[0];
const laidOut = await layoutDiagram(diagram, {
  direction: 'TB',
  spacing: 80,
});

// Render
const result = renderSvg(diagram, laidOut, {
  title: 'Hello Runiq',
});

// Save
writeFileSync('hello.svg', result.svg, 'utf-8');
console.log('✅ Generated hello.svg');
```

## Development Workflow

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for specific package
cd packages/core && pnpm test

# Watch mode for development
cd packages/core && pnpm test:watch
```

### Building Packages

```bash
# Build all packages
pnpm -r build

# Build specific package
cd packages/core && pnpm build

# Watch mode for development
cd packages/core && pnpm build:watch
```

### Running the Editor

```bash
# Start the SvelteKit editor
cd apps/editor
pnpm dev

# Open http://localhost:5173
```

## Common Tasks

### Adding a New Shape

1. Create shape definition in `packages/core/src/shapes/my-shape.ts`
2. Register in `packages/core/src/shapes/index.ts`
3. Add tests in `packages/core/src/__tests__/my-shape.test.ts`
4. Update documentation

### Creating an Export Format

1. Create package: `packages/export-myformat/`
2. Implement exporter following existing patterns
3. Add tests
4. Document format and usage

### Contributing

See [Contributing Guide](/contributing) for:

- Code style guidelines
- Pull request process
- Test requirements
- Documentation standards

## Troubleshooting

### Build Errors

**Problem:** `Cannot find module '@runiq/core'`

**Solution:** Build dependencies first:

```bash
cd packages/core && pnpm build
```

### Test Failures

**Problem:** Tests failing after changes

**Solution:** Rebuild and re-run:

```bash
pnpm -r build
pnpm test
```

### Parser Errors

**Problem:** Langium parser not working

**Solution:** Regenerate Langium artifacts:

```bash
cd packages/parser-dsl
pnpm langium:generate
pnpm build
```

## Next Steps

- [Quick Start Tutorial →](/guide/quick-start) - Build your first diagram
- [Core Concepts →](/guide/shapes) - Understand shapes and edges
- [Examples →](/examples/) - See real-world diagrams
- [API Reference →](/reference/api/core) - Deep dive into the API

## Getting Help

- [GitHub Issues](https://github.com/jgreywolf/runiq/issues) - Bug reports and feature requests
- [Discussions](https://github.com/jgreywolf/runiq/issues) - Questions and community
- [Contributing](/contributing) - How to contribute

---

::: tip Development Setup Complete?
Once you have Runiq running, try the [Quick Start →](/guide/quick-start) tutorial to create your first diagram!
:::
