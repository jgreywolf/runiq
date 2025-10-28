---
title: Changelog
---

# Changelog

All notable changes to this project will be documented in this file.

This project adheres to Keep a Changelog and Semantic Versioning (pre-1.0 minor versions may include breaking changes).

## [0.1.0] - 2025-10-17

### Added
- 54 shapes across 9 categories (flowcharts, UML actors, containers, charts, electrical, digital, blocks, icons, misc)
- Hierarchical containers with nested layout (ELK integration)
- UML relationships: stereotypes, line styles, arrow types
- Parser DSL (Langium-based) producing a shared AST (DSL/JSON twin)
- SVG renderer with modular renderers and orchestration
- Docs site (VitePress) with Getting Started, Profiles, Shapes, Examples, and Reference

### Fixed
- Nested container layout sizing bug (parent expands to include nested containers)
- Parser grammar reserved-word collision ("default")

### Tooling
- Node engines pinned to >=20.19.0 <21 || >=22.12.0, .nvmrc added
- 700+ tests via Vitest; CI lockfile refresh for Vercel deploy

[0.1.0]: https://github.com/jgreywolf/runiq/releases/tag/v0.1.0
