<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Runiq Project Development Guidelines

Please also review the following files for additional context on Runiq development practices:
.github\svelte-instructions.md
.github\general-typescript-instructions.md
.github\remember-prompt.md

### ABSOLUTE MANDATORY RULES:

    1. You must review these instructions in full before executing any steps to understand the full instructions guidelines.
    2. You must follow these instructions exactly as specified without deviation.
    3. Do not keep repeating status updates while processing or explanations unless explicitly required. This is bad and will flood Copilot session context.
    4. NO phase announcements (no "# Phase X" headers in output)
    5. Phases must be executed one at a time and in the exact order specified.
    6. NO combining of phases in one response
    7. NO skipping of phases
    8. NO verbose explanations or commentary
    9. DO not commit unless all tests are passing
    10. All test failures must be fixed before proceeding to the next phase, even if they were not broken as a result of our work

### Test-Driven Development (TDD)

**ALWAYS use Test-Driven Development wherever possible:**

1. **Write tests FIRST** before implementing features
2. **Run tests** to see them fail (Red)
3. **Implement** the minimal code to make tests pass (Green)
4. **Refactor** while keeping tests passing (Refactor)
5. **Verify** all tests pass before committing

### Testing Standards

- All new features must have corresponding tests
- Test files: inline with the code \*.spec.ts
- Use Vitest for all testing
- Minimum test coverage targets:
  - Core logic: 90%+
  - Shape implementations: 80%+
  - DSL parsing: 95%+
- Run tests frequently during development: `pnpm test`
- Ensure all tests pass before committing
- Create appropriate playwright visual tests for rendering features

### Shape Implementation Pattern

When adding new shapes to `packages/core/src/shapes/`:

1. **Write tests first** in dedicated file
2. Test structure for each shape:
   - ID correctness
   - Bounds calculation
   - Anchor points (4-point system)
   - SVG rendering
   - Style application
3. Implement shape following `ShapeDefinition` interface:
   - `id: string` - unique shape identifier
   - `bounds(ctx): { width, height }` - calculate dimensions
   - `anchors(ctx): Anchor[]` - define connection points
   - `render(ctx, position): string` - generate SVG markup
4. Register shape in `shapes/index.ts`
5. Verify tests pass
6. Build and verify bundle size

### Code Quality Standards

- TypeScript strict mode enabled
- No `any` types (use `unknown` and type guards)
- ESLint and Prettier configured
- Follow existing code patterns
- Meaningful variable/function names
- Comment complex algorithms

### Build & Test Commands

Run all commands using the full path, instead of the relative path

```bash
# Run all tests across workspace
pnpm -r test

# Run tests for specific package
cd packages/core && pnpm test

# Build specific package
cd packages/core && pnpm build

# Build entire workspace
pnpm -r build
```

### Project Structure

- **packages/core**: Core types, shapes, registries (52 shapes)
- **packages/parser-dsl**: Langium-based DSL parser
- **packages/layout-base**: ELK layout engine (replaced Dagre Oct 2025)
- **packages/renderer-svg**: SVG rendering engine
- **packages/schematic**: Rendering engine specifically for electrical schematics
- **packages/io-json**: JSON import/export
- **packages/icons-fontawesome**: Icon library integration
- **packages/cli**: Command-line interface
- **apps/editor**: SvelteKit web editor

### Current Status

- ✅ 446 tests passing across 6 packages
- ✅ 52 shapes implemented (100% of goal! 🎉)
- ✅ Core DSL parser working (Langium-based)
- ✅ SVG renderer functional
- ✅ ELK layout engine integrated (superior to Dagre)
- ✅ Complete shape library across 8 categories

### Setup Checklist (Completed)

- [x] TypeScript monorepo with pnpm workspaces
- [x] Core packages scaffolded
- [x] SvelteKit editor app
- [x] Build system configured
- [x] Test framework setup
- [x] Documentation framework
