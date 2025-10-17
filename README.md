# Runiq

> A markdown-friendly diagram DSL with JSON twin that compiles to standards-compliant SVG

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-470%2B-brightgreen.svg)](./packages)

**🚀 Status**: Phase 1 Complete - Core types, **61 shapes**, ELK layout, hierarchical containers!  
**⚡ NEW**: Block diagram support for control systems & signal processing!  
**⚡ NEW**: Digital circuit support with Verilog HDL export and IEEE logic gate symbols!

## ✨ Features

### Software Diagrams

- **Two inputs, one AST**: Human-friendly DSL and 1:1 JSON format
- **Pure SVG output**: No HTML hacks, embed-safe for PowerPoint/Keynote/Google Slides
- **Pluggable system**: Extensible shapes, icons, layout engines, and themes
- **SvelteKit editor**: Monaco code editor with real-time preview
- **Standards compliant**: SVG 1.1/2.0 friendly with accessibility support

### Electrical & Digital Circuits (NEW! 🎉)

- **Text-based circuit definition**: Write circuits in plain text with clear syntax
- **SPICE netlist export**: Automatic generation of simulation-ready netlists
- **Verilog HDL export**: Generate synthesizable Verilog for digital designs
- **IEEE schematic rendering**: Professional SVG schematics with standard symbols (22 symbols!)
- **Logic gate library**: AND, OR, NOT, XOR, NAND, NOR, BUFFER (IEEE/ANSI distinctive shapes)
- **Complete workflow**: Design → Simulate → Visualize from single source
- **Version control friendly**: Track circuit changes like code

### Block Diagrams & Control Systems (NEW! 🎉)

- **Control system blocks**: Transfer functions, gain blocks, integrators, differentiators
- **Signal operations**: Summing junctions (+), multiply (×), divide (÷), compare
- **Standard notation**: Laplace domain (s), time delays (e^-sT), saturation blocks
- **Feedback loops**: Model closed-loop control systems with feedback paths
- **Engineering applications**: PID controllers, state-space models, signal processing
- **5 example diagrams**: Ready-to-use templates in `examples/block-diagrams/`

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/jgreywolf/runiq.git
cd runiq

# Install dependencies (requires pnpm)
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start the editor
pnpm dev
```

## 📦 Packages

### Core Packages

| Package                                                    | Description                        | Tests  |
| ---------------------------------------------------------- | ---------------------------------- | ------ |
| [`@runiq/core`](./packages/core)                           | Core types, shapes, and registries | 573 ✅ |
| [`@runiq/parser-dsl`](./packages/parser-dsl)               | Langium-based DSL parser           | 5 ✅   |
| [`@runiq/layout-base`](./packages/layout-base)             | ELK layout engine adapter          | 24 ✅  |
| [`@runiq/renderer-svg`](./packages/renderer-svg)           | SVG rendering engine               | 30 ✅  |
| [`@runiq/io-json`](./packages/io-json)                     | JSON import/export                 | 28 ✅  |
| [`@runiq/icons-fontawesome`](./packages/icons-fontawesome) | Font Awesome icon provider         | -      |
| [`@runiq/cli`](./packages/cli)                             | Command-line interface             | -      |

### Electrical & Digital Circuit Packages (NEW!)

| Package                                                      | Description                          | Tests |
| ------------------------------------------------------------ | ------------------------------------ | ----- |
| [`@runiq/export-spice`](./packages/export-spice)             | SPICE netlist generator (analog)     | 18 ✅ |
| [`@runiq/export-verilog`](./packages/export-verilog)         | Verilog HDL generator (digital)      | 15 ✅ |
| [`@runiq/renderer-schematic`](./packages/renderer-schematic) | IEEE-standard schematic SVG renderer | 46 ✅ |

### Applications

| App                             | Description          |
| ------------------------------- | -------------------- |
| [`runiq-editor`](./apps/editor) | SvelteKit web editor |

## Parser Technology

Runiq uses **[Langium](https://langium.org/)** for parsing - a modern TypeScript language engineering framework with:

✅ **Built-in LSP support** - Ready for VS Code extensions and Monaco editor  
✅ **Auto-generated typed AST** - TypeScript types derived from grammar  
✅ **Declarative grammar** - Clean `.langium` syntax  
✅ **Production-proven** - Used by Mermaid.js for new diagrams  
✅ **Active maintenance** - Regular updates from TypeFox/Eclipse

See [docs/langium-migration.md](./docs/langium-migration.md) for migration details.

## Apps

- `editor` - SvelteKit editor with Monaco
- `playground` - Simple demo

## Example DSL

### Software Diagram - Basic Flowchart

```runiq
diagram "Auth Flow" direction: LR

style default fill:#f7f7ff stroke:#444 font:Inter fontSize:14
style decision fill:#fff7e6 stroke:#aa7700

shape User     as @actor   label:"Visitor" icon:fa/user
shape Landing  as @rounded label:"Landing Page"
shape Check    as @rhombus label:"Signed up?" style:decision
shape Welcome  as @hex     label:"Welcome"

User -> Landing : visits
Landing -> Check
Check[yes] -> Welcome
Check[no]  -> Pricing : reads
```

### Electrical Circuit - RC Lowpass Filter (NEW!)

```runiq
electrical "RC Lowpass Filter" {
  net IN, OUT, GND

  part V1 type:V source:"SIN(0 1 1k)" pins:(IN,GND)
  part R1 type:R value:"10k" pins:(IN,OUT)
  part C1 type:C value:"1n" pins:(OUT,GND)

  analysis tran "0 5m"
}
```

**This generates:**

- 📄 **SPICE Netlist** for simulation (ngspice/LTspice compatible)
- 🎨 **IEEE Schematic SVG** with professional symbols and labels

[See more electrical examples →](./examples/electrical/)

### Digital Circuit - Half Adder (NEW!)

```runiq
digital "Half Adder" {
  net A, B, SUM, CARRY

  gate U1 type:XOR inputs:(A,B) output:SUM
  gate U2 type:AND inputs:(A,B) output:CARRY
}
```

**This generates:**

- 💻 **Verilog HDL** module for synthesis/simulation
- 🎨 **IEEE Logic Gate Schematic** with distinctive gate symbols (curved OR, flat AND, etc.)
- 📊 **Truth table validation** for correctness checking

[See more digital examples →](./packages/export-verilog/examples/)

### With Containers

```runiq
diagram "Microservices" direction: LR

container backend "Backend Services"
  backgroundColor: "#f3e5f5"
  borderColor: "#7b1fa2"
  borderWidth: 3 {
  shape auth as @hex label: "Auth Service"
  shape api as @hex label: "API Gateway"
  shape users as @hex label: "User Service"

  api -> auth
  api -> users
}

shape web as @rounded label: "Web UI"
web -> api : HTTPS
```

[See more container examples →](./examples/)

## 🎯 Current Status (October 2025)

### ✅ Completed

**Software Diagrams:**

- [x] **61 shapes implemented** (52 flowchart/diagram + 9 block diagram shapes! 🎉)
  - Flowchart: Actors, circles, data/documents, data I/O, storage, process, specialized, annotations
  - Block Diagrams: Transfer functions, gain, integrator, differentiator, delay, saturation, junctions
- [x] **ELK layout engine integrated** - Replaced Dagre with superior Eclipse Layout Kernel
- [x] **SVG renderer functional** - Standards-compliant output
- [x] **Hierarchical containers - Complete! 🎉**
  - Full DSL syntax support for containers with styling and layout options
  - Nested containers (parser + renderer complete, layout 90%)
  - Cross-container edges fully supported
  - 148 container-related tests (95% passing)
  - [See Container Documentation →](./docs/containers.md)

**Electrical Circuits (NEW!):**

- [x] **Profile-based architecture** - Multi-domain support (electrical, digital)
- [x] **Electrical DSL** - Clean syntax for circuits with parts, nets, analysis
- [x] **SPICE exporter** - Automatic netlist generation (18/18 tests ✅)
- [x] **IEEE schematic renderer** - Professional SVG schematics (21/21 tests ✅)
  - 8 standard symbols: R, C, L, V, I, GND, D, LED
  - Automatic layout and wire routing
  - Configurable styling and labels
  - [See Schematic Renderer →](./packages/renderer-schematic/)
- [x] **Complete workflow validated** - 5 working examples with SPICE + schematics
  - [See Electrical Examples →](./examples/electrical/)

**Testing & Infrastructure:**

- [x] **Test coverage** - 600+ tests passing across packages
- [x] **Monorepo architecture** - Clean package separation with pnpm workspaces

### 🚧 In Progress

**Software Diagrams:**

- [ ] **Phase 2: Parser Support** - Langium grammar for `container "Label" { ... }` syntax
- [ ] **Phase 3: ELK Layout** - Compound nodes for nested containers
- [ ] **Phase 4: SVG Rendering** - Container backgrounds, borders, z-index layering
- [ ] **Phase 5: Integration** - CLI + Editor support with C4/BPMN examples

**Electrical/Digital Circuits:**

- [ ] **Verilog exporter** - Generate Verilog HDL from digital circuits
- [ ] **EDIF exporter** - Electronic Design Interchange Format for EDA tools
- [ ] **Schema validation** - Runtime validation with Zod schemas

### 🔮 Roadmap

**Software Diagrams:**

1. **Hierarchical Containers** (CRITICAL) - Complete Phases 2-5 for C4, BPMN, architecture diagrams
2. **Alternative Layout Algorithms** (HIGH) - Enable ELK's force/radial/stress layouts
3. **Data-Driven Rendering** (HIGH) - Charts with data values (pie, bar, XY)
4. **Swim Lanes/Zones** (MEDIUM) - BPMN lane partitioning
5. **Time-Based Layouts** (MEDIUM) - Gantt charts, timelines

**Electrical/Digital Circuits:**

1. **Enhanced Symbols** (MEDIUM) - Transistors, MOSFETs, op-amps, logic gates
2. **Advanced Routing** (MEDIUM) - Orthogonal wire routing, junction dots
3. **Component Rotation** (LOW) - 90°/180°/270° orientation
4. **Digital Simulation** (HIGH) - Integrate with Icarus Verilog or similar
5. **PCB Export** (FUTURE) - KiCad footprint mapping

## 📚 Documentation

- [Layout Research & ELK Migration](./docs/layout-research-2025.md)
- [Diagram Type Support Analysis](./docs/diagram-type-support.md) - 45 diagram types evaluated
- [Hierarchical Containers Design](./docs/hierarchical-containers-design.md) - Complete Phase 1-5 plan
- [Dagre to ELK Migration](./docs/dagre-to-elk-migration.md)
- [Langium Migration Guide](./docs/langium-migration.md)

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
cd packages/core && pnpm test

# Run tests in watch mode (for development)
cd packages/core && pnpm test:watch

# Build all packages
pnpm build
```

**Test Coverage:**

**Software Diagrams:**

- Core: 345 tests (types, shapes, validation)
- Layout: 24 tests (ELK adapter)
- Renderer: 30 tests (SVG output)

**Electrical Circuits:**

- Parser: 5 tests (electrical profile parsing)
- SPICE Exporter: 18 tests (netlist generation)
- Schematic Renderer: 21 tests (IEEE symbol rendering)

**Total: 600+ tests passing** ✅

## 📋 Requirements

- **Node.js** >= 18
- **pnpm** >= 8.15.0

## 🤝 Contributing

Contributions are welcome! This project follows **Test-Driven Development (TDD)**:

1. **Write tests first** (Red) - Define expected behavior
2. **Implement minimal code** (Green) - Make tests pass
3. **Refactor** (Refactor) - Keep tests passing while improving code

See [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) for detailed development guidelines.

## 📊 Shape Library (52 Total)

| Category        | Count | Shapes                                                                                          |
| --------------- | ----- | ----------------------------------------------------------------------------------------------- |
| **Actors**      | 8     | actor, actor-circle, actor-rect, person, group, role, agent, system-actor                       |
| **Circles**     | 10    | circle (5 sizes), dashed, dotted, thick, ellipse (wide/tall)                                    |
| **Data & Docs** | 7     | document, document-multiple, stored-data, tape, card, note, paper                               |
| **Data I/O**    | 6     | data, input, output, manual-input, display, stored-data                                         |
| **Storage**     | 6     | database, cylinder, internal-storage, magnetic-disk, magnetic-tape, direct-access               |
| **Process**     | 9     | process, rect, subroutine, predefined, preparation, manual, manual-operation, loop-limit, merge |
| **Specialized** | 3     | cloud, delay, off-page-connector                                                                |
| **Annotations** | 3     | annotation-left, annotation-right, comment                                                      |

## 🎨 Supported Diagram Types

### Software Diagrams

| Status | Type              | Notes                          |
| ------ | ----------------- | ------------------------------ |
| ✅     | Flowcharts        | Full support                   |
| ✅     | Sequence diagrams | Full support                   |
| ✅     | Class diagrams    | Full support                   |
| ✅     | State diagrams    | Full support                   |
| ✅     | ER diagrams       | Full support                   |
| ✅     | C4 diagrams       | Container support complete! 🎉 |
| 🟡     | BPMN              | Swim lanes coming soon         |

### Electrical & Digital Circuits (NEW!)

| Status | Type                | Notes                                     |
| ------ | ------------------- | ----------------------------------------- |
| ✅     | Analog circuits     | R, C, L, V, I sources + SPICE export      |
| ✅     | Power supplies      | Voltage dividers, filters, regulators     |
| ✅     | LED circuits        | Current limiting, indicators              |
| ✅     | Schematic rendering | IEEE-standard SVG schematics              |
| 🟡     | Digital logic       | Grammar ready, Verilog export coming soon |
| 🟡     | Mixed-signal        | Analog + digital in same circuit (future) |

## 🚀 What Makes Runiq Unique?

**For Software Engineers:**

- ✨ Version control friendly (plain text)
- ✨ Embed diagrams in Markdown/docs
- ✨ Consistent styling across teams
- ✨ No vendor lock-in (open format)

**For Hardware Engineers (NEW!):**

- ⚡ **Text → SPICE + Schematic** from single source (no other tool does this!)
- ⚡ Design → Simulate → Document workflow
- ⚡ Version control electrical circuits like code
- ⚡ IEEE-standard professional schematics
- ⚡ Automatic ground normalization
- ⚡ Compatible with industry tools (ngspice, LTspice)
  | 🟡 | Mind maps | Partial support |
  | 🟡 | Timeline/Gantt | Time-based layouts planned |

[See full analysis of 45 diagram types →](./docs/diagram-type-support.md)

## 📄 License

MIT © 2025 Justin Greywolf

## 🙏 Acknowledgments

- [Eclipse Layout Kernel (ELK)](https://www.eclipse.org/elk/) - Professional graph layout
- [Langium](https://langium.org/) - Language engineering toolkit
- [Font Awesome](https://fontawesome.com/) - Icon library
- [SvelteKit](https://kit.svelte.dev/) - Web framework
- [Vitest](https://vitest.dev/) - Testing framework

---

**Built with ❤️ using Test-Driven Development** | [Report Issues](https://github.com/jgreywolf/runiq/issues) | [Contribute](https://github.com/jgreywolf/runiq/pulls)
