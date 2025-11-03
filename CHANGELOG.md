# Changelog

All notable changes to the Runiq project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - UML Class Diagram Relationship Features

- **Priority 1 Relationship Features (ALL COMPLETE):**
  - Multiplicity (Cardinality): `0..1`, `1`, `1..*`, `0..*`, `*`, `1..5` patterns
  - Aggregation: Hollow diamond markers (◇) for shared ownership relationships
  - Composition: Filled diamond markers (◆) for strong ownership relationships
  - Role Names: Labels at source and target ends of associations
  - Edge Types: `association`, `aggregation`, `composition`, `dependency`, `generalization`, `realization`

- **Grammar & Parser:**
  - `multiplicitySource` and `multiplicityTarget` properties on edges
  - `roleSource` and `roleTarget` properties on edges
  - `edgeType` property with 6 UML relationship types
  - `navigability` property (source, target, bidirectional, none) - parsing complete
  - `constraints` property (array of strings) - parsing complete

- **SVG Rendering:**
  - Hollow diamond markers for aggregation (white fill, stroke outline)
  - Filled diamond markers for composition (solid fill)
  - Multiplicity text positioned at 15%/85% along edge (font-size: 11)
  - Role name text in italics below multiplicity (font-size: 10)
  - Vertical stacking when both multiplicity and role present

- **Testing:**
  - 13 new comprehensive tests in `uml-relationships.test.ts`
  - All 564 parser tests passing (no regressions)
  - Test coverage: multiplicity patterns, role names, edge types, navigability parsing, constraints parsing
  - Example diagrams: `aggregation-example.runiq`, `composition-example.runiq`

- **Documentation:**
  - Updated `class-diagram-uml-compliance.md` with implementation status
  - Marked Priority 1 and Priority 2 features as complete
  - Documented pending work: navigability rendering, constraint rendering

### Planned

- Navigability arrow rendering (open arrows, crosses)
- Constraint text rendering in braces notation
- Nested container layout (critical for C4, BPMN, org charts)
- Container grid layout
- UML timing diagrams for embedded systems

## [0.1.0] - 2025-10-17

### Added - Use Case Diagrams & UML Relationships

- **Use Case Diagram Support:**
  - `ellipse-wide` shape for use cases (horizontal oval with auto-sizing)
  - `system-boundary` shape for system containers (dotted rectangle)
  - Use case diagram type with validation
  - 18 tests for use case shapes
  - 4 example diagrams (banking, ecommerce, simple, advanced)

- **UML Relationship Features:**
  - Stereotypes: `<<include>>`, `<<extend>>`, `<<uses>>`, `<<implements>>`, custom stereotypes
  - Line styles: `solid` (default), `dashed`, `dotted`
  - Arrow types: `standard` (filled), `hollow` (inheritance), `open` (dependencies), `none` (undirected)
  - Stereotype rendering in guillemets above edges
  - 31 tests for edge enhancements (20 core + 11 renderer)
  - 3 advanced example files showcasing all UML relationships

### Added - Block Diagram Export Packages

- **LaTeX/TikZ Export (`@runiq/export-latex`):**
  - Export block diagrams to LaTeX/TikZ format
  - Transfer function conversion with proper fraction notation
  - Academic paper integration
  - 8 tests

- **Simulink MDL Export (`@runiq/export-simulink`):**
  - Export block diagrams to MATLAB Simulink format
  - Transfer function blocks with proper notation
  - Control system modeling integration
  - 8 tests

### Changed

- Updated README with latest feature set and test counts (705+ tests)
- Improved edge rendering to use SVG markers instead of separate paths
- Enhanced test coverage across all packages

### Documentation

- Created comprehensive use case diagram guide (300+ lines)
- Added 7 example files demonstrating UML features
- Updated all documentation with latest accomplishments
- Created research document for new diagram types (pedigree, quantum, network, timing, SmartArt)

## [0.0.9] - 2025-10-15

### Added - Hierarchical Containers (All Phases Complete!)

- **Phase 1: Core Types**
  - `ContainerDeclaration`, `ContainerStyle`, `ContainerLayoutOptions` types
  - Validation utilities (circular refs, nesting depth, membership)
  - 50 tests

- **Phase 2: Parser Support**
  - Langium grammar extended with `container "Label" { ... }` syntax
  - Nested container syntax support
  - Inline styling and layout options
  - 24 parser tests

- **Phase 3: ELK Layout**
  - Flat layout with container placeholders
  - Recursive container positioning
  - Cross-boundary edge routing
  - 40 layout tests (36 passing, 4 skipped for deep nesting edge cases)

- **Phase 4: SVG Rendering**
  - Container backgrounds with styling
  - Z-index layering (containers → edges → nodes)
  - Container labels with positioning
  - Nested container rendering
  - 34 renderer tests

- **Phase 5: Integration & Documentation**
  - 4 end-to-end integration tests
  - Comprehensive container documentation
  - 4 example .runiq files (microservices, C4, multi-region, docker)

### Total: 148 container tests (143 passing, 4 skipped)

## [0.0.8] - 2025-10-14

### Added - Digital Circuits & Verilog Export

- **Digital Circuit Support:**
  - Verilog HDL export (`@runiq/export-verilog`) - 15 tests
  - IEEE logic gate symbols (AND, OR, NOT, XOR, NAND, NOR, BUFFER)
  - Schematic rendering (`@runiq/renderer-schematic`) - 68 tests
  - Digital circuit examples

### Added - Analog Circuits & SPICE Export

- **Analog Circuit Support:**
  - SPICE netlist export (`@runiq/export-spice`) - 18 tests
  - Electrical circuit DSL
  - Ground normalization
  - Component library (R, C, L, voltage/current sources)
  - Electrical circuit examples

## [0.0.7] - 2025-10-14

### Added - Block Diagrams

- **Control System Blocks:**
  - Transfer function shape with Laplace notation
  - Gain block (K multiplier)
  - Integrator (1/s)
  - Differentiator (s)
  - Time delay (e^-sT)
  - Saturation block
  - Summing junction (+/-)
  - Multiply junction (×)
  - Divide junction (÷)
  - Compare junction (comparator)
  - 5 example block diagrams (PID, feedback, cascade, feedforward, state-space)

## [0.0.6] - 2025-10-14

### Added - Shape Library Expansion

- **54 shapes total** across 9 categories:
  - Actors (8 shapes)
  - Circles (10 shapes)
  - UML (2 shapes)
  - Data & Docs (7 shapes)
  - Data I/O (6 shapes)
  - Storage (6 shapes)
  - Process (9 shapes)
  - Specialized (3 shapes)
  - Annotations (3 shapes)

### Added - Chart Shapes

- Pie chart shapes (simple, labeled, with legend)
- Bar chart shapes (vertical, horizontal, grouped)
- Venn diagram shapes (2-circle, 3-circle, 4-circle)
- Pyramid shape

## [0.0.5] - 2025-10-14

### Added - Parser Migration

- **Langium Parser:**
  - Migrated from custom parser to Langium framework
  - LSP support ready for VS Code extensions
  - Auto-generated typed AST
  - Declarative grammar syntax
  - Production-proven technology (used by Mermaid.js)

## [0.0.4] - 2025-10-14

### Added - Layout Engine Migration

- **ELK Layout Engine:**
  - Migrated from Dagre to Eclipse Layout Kernel (ELK 0.9.3)
  - 5 layout algorithms: layered, force, stress, tree, radial
  - Superior performance and quality
  - Better container support
  - Active maintenance

## [0.0.3] - 2025-10-14

### Added - Core Functionality

- Core types and shape definitions
- SVG rendering engine
- JSON import/export
- Icon support (Font Awesome)
- Command-line interface

## [0.0.2] - 2025-10-14

### Added - Project Structure

- Monorepo architecture with pnpm workspaces
- TypeScript configuration with strict mode
- Test framework (Vitest) with TDD approach
- Build system (tsup)
- Documentation framework

## [0.0.1] - 2025-10-14

### Initial Release

- Project inception
- Basic project structure
- Core type definitions
- Initial shape registry

---

## Legend

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Features that will be removed
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security vulnerability fixes
