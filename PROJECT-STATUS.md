# Runiq - Project Status Summary

**Repository**: https://github.com/jgreywolf/runiq  
**Created**: October 14, 2025  
**Updated**: October 20, 2025  
**License**: MIT  
**Author**: Justin Greywolf

## 🎉 Current Status: v0.1.0 Complete + Mindmaps!

### Latest Accomplishments (Oct 20, 2025)

**✅ NEW: Mindmap Support** 🧠

- Radial layout algorithm enabled
- 10 comprehensive tests
- 4 example mindmaps (simple, project planning, learning, business strategy)
- Complete documentation guide
- No new shapes needed - uses existing shapes

### Previous Accomplishments (Oct 17-19, 2025)

**✅ Complete:**

- **71 professionally designed shapes** (exceeded goal of 52!)
  - 59 existing shapes + 12 quantum circuit gates
- **ELK layout engine** integration (replaced Dagre)
- **Hierarchical containers** - ALL PHASES COMPLETE! 🎉
- **UML relationships** - Stereotypes, line styles, arrow types
- **Use case diagrams** - Actors, use cases, system boundaries
- **Block diagrams** - Control systems with transfer functions
- **Quantum circuits** - 12 IBM Qiskit-style gates for quantum computing ⚛️
- **Network topology** - Routers, switches, firewalls, clouds, servers 🌐
- **Pedigree charts** - Medical genetics and genealogy diagrams 🧬
- **Export packages** - LaTeX/TikZ and Simulink MDL exporters
- **728+ tests passing** across all packages
- **Comprehensive documentation** (12+ major docs)
- **Monorepo architecture** with 11 packages + 2 apps

**📦 Packages (11 total):**

Core Packages:

1. `@runiq/core` - 743 tests ✅ (+10 mindmap tests)
2. `@runiq/layout-base` - 44 tests (40 passing, 4 skipped) ✅
3. `@runiq/renderer-svg` - 45 tests ✅
4. `@runiq/parser-dsl` - 114 tests ✅ (Langium-based, +90 fixed)
5. `@runiq/io-json` - 28 tests ✅
6. `@runiq/icons-fontawesome` - Font Awesome integration
7. `@runiq/cli` - Command-line interface

Circuit Packages: 8. `@runiq/export-spice` - 18 tests ✅ (analog circuits) 9. `@runiq/export-verilog` - 15 tests ✅ (digital circuits) 10. `@runiq/renderer-schematic` - 68 tests ✅ (IEEE schematics)

Block Diagram Packages: 11. `@runiq/export-latex` - 8 tests ✅ (NEW!) 12. `@runiq/export-simulink` - 8 tests ✅ (NEW!)

Applications:

- `runiq-editor` - SvelteKit web editor

### Key Features

- **Two Input Formats**: DSL syntax + JSON (1:1 mapping)
- **Professional Layouts**: ELK with layered/force/radial/stress/tree algorithms
- **Pure SVG Output**: Standards-compliant, embed-safe
- **Extensible System**: Pluggable shapes, icons, layouts, themes
- **Type-Safe**: Full TypeScript with strict mode
- **Well-Tested**: TDD approach with 705+ tests

### Technical Highlights

1. **Modern Parser**: Langium framework with LSP support
2. **Superior Layout**: Eclipse Layout Kernel (ELK 0.9.3)
3. **Container Support**: Full implementation with styling, nesting, cross-container edges! 🎉
4. **UML Relationships**: Stereotypes, line styles (solid/dashed/dotted), arrow types (standard/hollow/open)
5. **Export Formats**: SPICE, Verilog, LaTeX/TikZ, Simulink MDL
6. **Validation System**: Circular ref detection, nesting depth checks
7. **Shape Library**: 71 shapes in 11 categories
   - Quantum circuits: 12 gates (Pauli, Hadamard, phase, multi-qubit, measurement)
   - Network topology: 7 shapes (routers, switches, firewalls, servers, clouds)
   - Pedigree charts: 3 shapes (male, female, unknown sex)
   - Plus: Flowchart, UML, circuit, block diagram shapes
8. **Test Coverage**: 728+ tests with TDD approach

### Documentation

- [Container Guide](./docs/containers.md) - Complete container documentation
- [Quantum Circuits Guide](./docs/guide/quantum-circuits.md) - Quantum computing visualization ⚛️
- [Use Case Diagram Guide](./examples/use-case-diagram/README.md) - UML use case documentation
- [Block Diagram Guide](./examples/block-diagrams/README.md) - Control systems examples
- [New Diagram Types Research](./docs/new-diagram-types-research.md) - Feasibility analysis
- [Layout Research](./docs/layout-research-2025.md) - Why ELK?
- [Diagram Type Support](./docs/diagram-type-support.md) - 45 types analyzed
- [Container Design](./docs/hierarchical-containers-design.md) - Original design doc
- [ELK Migration](./docs/dagre-to-elk-migration.md) - Migration guide
- [Langium Migration](./docs/langium-migration.md) - Parser switch

### Example Files

Software Diagrams:

- [Microservices Architecture](./examples/microservices.runiq)
- [C4 System Context](./examples/c4-context.runiq)
- [Multi-Region Deployment](./examples/multi-region.runiq)
- [Docker Compose Stack](./examples/docker-stack.runiq)
- [Use Case Diagrams](./examples/use-case-diagram/) - 4 examples
- [Block Diagrams](./examples/block-diagrams/) - 5 control system examples

Circuits:

- [Electrical Circuits](./examples/electrical/) - Analog circuits with SPICE
- [Digital Circuits](./examples/digital/) - Logic circuits with Verilog

Quantum Computing:

- [Quantum Circuits](./examples/quantum-circuits/) - 4 quantum algorithm examples
  - Bell State (entanglement)
  - Quantum Teleportation (3-qubit protocol)
  - Grover's Search (amplitude amplification)
  - Quantum Fourier Transform (QFT)

Network & Pedigree:

- Network Topology - Coming soon
- Pedigree Charts - 5 genetics/genealogy examples

## ✅ Container Implementation Complete! (Oct 15, 2025)

All phases of hierarchical container support are now complete:

### Phase 1: Core Types ✅

- `ContainerDeclaration`, `ContainerStyle`, `ContainerLayoutOptions` types
- Validation utilities (circular refs, nesting depth, membership)
- 50 tests passing

### Phase 2: Parser Support ✅

- Langium grammar extended: `container "Label" { ... }`
- Nested container syntax
- Inline styling and layout options
- 24 parser tests passing

### Phase 3: ELK Layout ✅

- Flat layout with container placeholders (avoiding ELK compound node issues)
- Recursive container positioning
- Cross-boundary edge routing
- 40 layout tests (36 passing, 4 skipped for deep nesting edge cases)

### Phase 4: SVG Rendering ✅

- Container backgrounds with styling (backgroundColor, borderColor, borderWidth)
- Z-index layering (containers → edges → nodes)
- Container labels with positioning
- Nested container rendering
- 34 renderer tests passing

### Phase 5: Integration & Documentation ✅

- 4 end-to-end integration tests
- Comprehensive [container documentation](./docs/containers.md)
- 4 example .runiq files (microservices, C4, multi-region, docker)
- README and PROJECT-STATUS updates

**Total Container Tests**: 148 tests (143 passing, 4 skipped, 1 known limitation)

## 🚀 Next Steps

### Immediate (Oct 17-20, 2025)

- [x] Research new diagram types (pedigree, quantum, network, timing, SmartArt)
- [x] **Implement Pedigree Charts** ✅ COMPLETE (Oct 17, 2025)
  - [x] Gender-specific shapes (male=square, female=circle, unknown=diamond)
  - [x] Affected/carrier/normal styles with fill patterns
  - [x] Marriage/partnership connectors (arrowType:none, lineStyle:double)
  - [x] Parent-child relationships with tree layout
  - [x] DSL syntax for pedigree properties (affected, carrier, deceased)
  - [x] 32 tests passing
  - [x] Complete documentation and examples
- [x] **Implement Network Topology** ✅ COMPLETE (Oct 17, 2025)
  - [x] 7 network shapes (router, switch, firewall, server, cloud, wan, load-balancer)
  - [x] Infrastructure diagram support
  - [x] 33 tests passing
  - [x] Documentation and examples
- [x] **Implement Quantum Circuits** ✅ COMPLETE (Oct 17, 2025)
  - [x] 12 quantum gates (Pauli X/Y/Z, Hadamard, Phase S/T, multi-qubit primitives)
  - [x] IBM Qiskit visual standard
  - [x] Control dots, CNOT targets, SWAP, measurement, barriers
  - [x] 52 tests passing
  - [x] 4 quantum algorithm examples (Bell, Teleportation, Grover, QFT)
  - [x] Comprehensive documentation guide
- [ ] Test CLI with all diagram types
- [ ] Update editor with new features

### Short-Term (Next 2 weeks)

- [ ] **Network Topology Diagrams** (1-2 days) - IT infrastructure visualization
- [ ] Enable ELK force/radial layouts for all diagram types
- [ ] BPMN swim lanes using container foundation

## 🎯 Long-Term Roadmap

**Specialized Diagram Types:**

1. **Pedigree Charts** ✅ COMPLETE - Genealogy, medical genetics (57 shapes total)
2. **Network Topology** (NEXT) - IT infrastructure, cloud architecture
3. **Quantum Circuits** (FUTURE) - Quantum computing education
4. **UML Timing Diagrams** (FUTURE) - Real-time systems, protocols

**Layout & Rendering Enhancements:**

1. **Alternative Layout Algorithms** (HIGH) - Enable ELK force/radial/stress for all types
2. **Data-Driven Rendering** (HIGH) - Charts with actual data values
3. **Swim Lanes/Zones** (MEDIUM) - BPMN lane partitioning
4. **Time-Based Layouts** (MEDIUM) - Gantt charts, timelines

**Circuit Enhancements:**

1. **Enhanced Symbols** (MEDIUM) - Transistors, MOSFETs, op-amps
2. **Advanced Routing** (MEDIUM) - Orthogonal routing, junction dots
3. **Component Rotation** (LOW) - 90°/180°/270° orientation
4. **Digital Simulation** (HIGH) - Icarus Verilog integration

## 📊 Test Coverage (Oct 17, 2025)

```
Package                    Tests    Status
──────────────────────────────────────────────
@runiq/core                 611     ✅ (8 skipped)
@runiq/renderer-svg          45     ✅ All passing
@runiq/layout-base           44     ✅ (4 skipped)
@runiq/parser-dsl            24     ✅ All passing
@runiq/io-json               28     ✅ All passing
@runiq/export-spice          18     ✅ All passing
@runiq/export-verilog        15     ✅ All passing
@runiq/export-latex           8     ✅ All passing (NEW!)
@runiq/export-simulink        8     ✅ All passing (NEW!)
@runiq/renderer-schematic    68     ✅ All passing
──────────────────────────────────────────────
TOTAL                       705+    ✅ All passing
```

## 📈 Recent Milestones

**October 17, 2025:**

- ✅ Comprehensive research on 5 new diagram types
- ✅ Created feasibility analysis document
- ✅ Updated all documentation and roadmaps
- ✅ Ready to implement pedigree charts

**October 16, 2025:**

- ✅ LaTeX/TikZ export package (8 tests)
- ✅ Simulink MDL export package (8 tests)
- ✅ Use case diagram enhancements
- ✅ UML relationship features complete

**October 15, 2025:**

- ✅ UML stereotypes, line styles, arrow types (31 tests)
- ✅ Use case diagram shapes (18 tests)
- ✅ Comprehensive examples and documentation

**October 14, 2025:**

- ✅ Hierarchical containers complete (148 tests)
- ✅ Project inception and initial setup

## 🏗️ Architecture

```
Input Layer          Core Layer        Output Layer
───────────         ──────────        ────────────
DSL Parser     ─→   DiagramAst   ─→   ELK Layout   ─→   SVG
JSON Parser    ─→                 ─→                 ─→   Renderer
```

### Design Principles

1. **Separation of Concerns** - Each package has single responsibility
2. **Test-Driven Development** - Write tests first, then implementation
3. **Type Safety** - Full TypeScript with strict mode enabled
4. **Extensibility** - Plugin architecture for shapes, icons, layouts
5. **Standards Compliance** - Pure SVG 1.1/2.0 output

## 🎨 Shape Categories

| Category    | Count  | Purpose                       |
| ----------- | ------ | ----------------------------- |
| Actors      | 8      | People, systems, agents       |
| Circles     | 10     | State indicators, endpoints   |
| UML         | 2      | Use case, component diagrams  |
| Data & Docs | 7      | Documents, notes, cards       |
| Data I/O    | 6      | Input/output operations       |
| Storage     | 6      | Databases, persistent storage |
| Process     | 9      | Operations, transformations   |
| Specialized | 3      | Cloud, delays, connectors     |
| Annotations | 3      | Comments, notes               |
| Pedigree    | 3      | Medical family trees          |
| **Total**   | **57** | **10 categories**             |

## 🔧 Development Commands

```bash
# Setup
pnpm install          # Install dependencies
pnpm build           # Build all packages

# Testing
pnpm test            # Run all tests once
pnpm test:watch      # Watch mode for development

# Development
pnpm dev             # Start editor in dev mode
cd packages/X && pnpm test:watch  # Package-specific dev

# Maintenance
pnpm clean           # Remove build artifacts
pnpm typecheck       # TypeScript type checking
pnpm lint            # ESLint
pnpm format          # Prettier
```

## 📈 Project Metrics

- **Lines of Code**: ~27,000+
- **Test Files**: 12
- **Test Cases**: 478+ (32 pedigree tests added)
- **Packages**: 7
- **Apps**: 2
- **Documentation Files**: 12+
- **Shapes**: 57 (across 10 categories)
- **Diagram Types Supported**: 6 full + 9 partial

## 🤝 Contributing

See [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) for:

- TDD workflow (Red → Green → Refactor)
- Testing standards (90%+ core, 80%+ shapes)
- Shape implementation pattern
- Code quality standards
- Build & test commands

## 📝 Commit Convention

```
type(scope): subject

feat: new feature
fix: bug fix
docs: documentation
test: tests only
refactor: code improvement
perf: performance
chore: maintenance
```

## � Future Enhancements

### Priority: Low (Nice-to-Have)

#### 1. Pie Chart Slice Labels

**Status**: Current implementation acceptable  
**Current Behavior**: Labels shown in legend (when `showLegend:true`), not on slices  
**Enhancement**: Add optional labels directly on pie slices

**Implementation Plan**:

- Calculate midpoint angle for each slice
- Position text at `radius * 0.7` from center
- Only show label if `percentage > 5%` to avoid overlap on small slices
- Add `showSliceLabels` option to toggle feature
- Test with various slice sizes and label lengths

**File**: `packages/core/src/shapes/charts/pie.ts`  
**Estimated Effort**: 2-3 hours

#### 2. DSL Syntax for Edge Routing Preference

**Status**: Currently defaults to orthogonal routing  
**Enhancement**: Allow users to specify routing style per diagram or per edge

**Proposed Syntax**:

```runiq
diagram "My Diagram" edgeRouting:"orthogonal" {
  // All edges use orthogonal routing
}

// Or per-edge:
a -> b routing:"straight"
c -> d routing:"orthogonal"
e -> f routing:"splines"
```

**Options**:

- `"straight"` - Direct line from source to target
- `"orthogonal"` - Right-angle bends (current default)
- `"polyline"` - Multi-segment lines
- `"splines"` - Smooth curved lines

**Files**:

- `packages/parser-dsl/src/runiq.langium` - Add grammar rules
- `packages/layout-base/src/elk-adapter.ts` - Respect routing preference
- `packages/core/src/types.ts` - Add EdgeRouting type

**Estimated Effort**: 4-6 hours

#### 3. Shape Alias System

**Status**: Users must know exact shape IDs  
**Current Issue**: Common names don't work (`@database` vs `@cyl`, `@service` vs `@server`, `@browser` vs `@curv-trap`)

**Enhancement**: Allow intuitive aliases for shapes

**Proposed Implementation**:

```typescript
// In shape registration:
registerShape(shape, {
  id: 'cyl',
  aliases: ['cylinder', 'database', 'db'],
});

registerShape(shape, {
  id: 'server',
  aliases: ['service', 'backend'],
});

registerShape(shape, {
  id: 'curv-trap',
  aliases: ['browser', 'display', 'monitor'],
});
```

**Benefits**:

- More intuitive for users
- Backwards compatibility with old examples
- Better discoverability
- Reduces "shape not found" errors

**Files**:

- `packages/core/src/registries/shape-registry.ts` - Add alias lookup
- `SHAPE-ID-REFERENCE.md` - Document aliases
- Tests for alias resolution

**Estimated Effort**: 3-4 hours

#### 4. Shape Validation in Parser

**Status**: Unknown shapes only detected at render time  
**Enhancement**: Validate shape IDs during parsing with helpful error messages

**Proposed Implementation**:

- Pass shape registry to parser validation phase
- Check if shape ID exists (including aliases)
- Provide suggestions for typos using Levenshtein distance
- List available shapes matching pattern

**Example Error**:

```
Error: Unknown shape '@servr'
Did you mean: @server, @curv-trap, @servlet?
Available shapes: @server, @service, @actor, ...
```

**Files**:

- `packages/parser-dsl/src/validator.ts` - Add shape validation
- `packages/core/src/registries/shape-registry.ts` - Export shape list
- Integration test for validation

**Estimated Effort**: 4-5 hours

#### 5. Editor: "Shape Not Found" Error Handling

**Status**: Diagrams with invalid shapes fail silently  
**Enhancement**: Show visual error in editor preview with helpful message

**Proposed UI**:

- Overlay on preview showing which shapes are invalid
- Inline markers in code editor at shape declarations
- Quick-fix suggestions in context menu
- List of available shapes in sidebar

**Files**:

- `apps/editor/src/lib/components/Preview.svelte` - Error overlay
- `apps/editor/src/lib/components/CodeEditor.svelte` - Inline markers
- Consider Monaco editor diagnostics integration

**Estimated Effort**: 6-8 hours

#### 6. Generate Shape Catalog Documentation

**Status**: Manual shape documentation  
**Enhancement**: Auto-generate shape catalog from registry

**Output**:

- Markdown file with all shapes
- SVG thumbnails of each shape
- Shape IDs, aliases, categories
- Usage examples
- Searchable/filterable catalog

**Script**:

```bash
pnpm run generate:catalog
# Outputs: docs/SHAPE-CATALOG.md
```

**Files**:

- `scripts/generate-shape-catalog.ts` - Generator script
- `docs/SHAPE-CATALOG.md` - Generated output
- Add to build pipeline

**Estimated Effort**: 5-6 hours

---

## �🔗 Links

- **Repository**: https://github.com/jgreywolf/runiq
- **Issues**: https://github.com/jgreywolf/runiq/issues
- **Pull Requests**: https://github.com/jgreywolf/runiq/pulls

---

**Status**: ✅ Editor MVP Complete | ✅ All Critical Issues Resolved | 🔮 Enhancements Listed  
**Last Updated**: October 19, 2025
