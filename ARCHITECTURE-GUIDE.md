# Runiq Architecture Guide

**Complete Technical Overview for New Contributors**

Last Updated: December 10, 2025

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Vision](#project-vision)
3. [Architecture Overview](#architecture-overview)
4. [Package Structure](#package-structure)
5. [Core Concepts](#core-concepts)
6. [Data Flow](#data-flow)
7. [Profile System](#profile-system)
8. [Shape System](#shape-system)
9. [Parser Architecture](#parser-architecture)
10. [Layout Engine](#layout-engine)
11. [Rendering Pipeline](#rendering-pipeline)
12. [Extension Points](#extension-points)
13. [Testing Strategy](#testing-strategy)
14. [Build System](#build-system)
15. [Development Workflow](#development-workflow)

---

## Executive Summary

**Runiq** is a markdown-friendly diagram DSL (Domain-Specific Language) that compiles to standards-compliant SVG. It provides a text-based alternative to visual diagram editors, supporting multiple diagram domains through a profile-based architecture.

### Key Statistics

- **15 packages** in monorepo (12 in `packages/`, 1 in `apps/`, 2 others)
- **52 shape definitions** across 8 categories
- **446+ passing tests** with comprehensive coverage
- **10+ profile types** (diagram, electrical, sequence, timeline, etc.)
- **56+ glyphset templates** (SmartArt-style patterns)

### Technology Stack

- **Language**: TypeScript 5.3+ (strict mode)
- **Parser**: Langium 4.1 (grammar-based DSL parser)
- **Layout**: ELK.js (replaced Dagre in Oct 2025)
- **Package Manager**: pnpm 8.15+ with workspaces
- **Testing**: Vitest + Playwright (visual tests)
- **Build**: tsup (fast TypeScript bundler)

---

## Project Vision

Runiq aims to be the **universal text-based diagramming solution** that:

1. **Markdown-friendly**: Works in documentation, READs, wikis
2. **Domain-specific**: Specialized profiles for different fields (electrical, UML, P&ID)
3. **Standards-compliant**: Produces valid SVG with proper semantics
4. **Extensible**: Plugin architecture for shapes, layouts, profiles
5. **Developer-focused**: Type-safe, testable, well-documented

### Design Principles

- **Separation of concerns**: Clear boundaries between parsing, layout, rendering
- **Profile-based extensibility**: Each domain gets its own grammar and semantics
- **Type safety**: Strict TypeScript with no `any` types
- **Test-driven**: Write tests before implementation
- **Tree-shakable**: Packages support selective imports

---

## Architecture Overview

Runiq follows a **pipeline architecture** with distinct stages:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   DSL Text  │ --> │  Parse AST  │ --> │   Layout    │ --> │  Render SVG │
│  (.runiq)   │     │  (parser)   │     │   (ELK)     │     │ (renderer)  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      │                    │                    │                    │
      │                    │                    │                    │
  Grammar              Type System         Positioning          Visual
  Langium             @runiq/core          @runiq/layout       @runiq/renderer
```

### Package Dependency Graph

```
@runiq/core (types, registries, shapes)
    ↑
    ├── @runiq/parser-dsl (Langium grammar)
    │       ↑
    ├── @runiq/glyphsets (template definitions)
    │       ↑
    ├── @runiq/layout-base (ELK adapter)
    │       ↑
    ├── @runiq/renderer-svg (SVG generation)
    │       ↑
    ├── @runiq/renderer-schematic (electrical schematics)
    │       ↑
    ├── @runiq/io-json (JSON import/export)
    │       ↑
    ├── @runiq/icons-fontawesome (icon library)
    │       ↑
    └── @runiq/cli (command-line interface)
            ↑
        @runiq/web (editor application)
```

**Key Insight**: `@runiq/core` is the foundation that all other packages depend on. It defines the type system, interfaces, and registries.

---

## Package Structure

### Core Packages (Business Logic)

#### 1. **@runiq/core** - Foundation

**Path**: `packages/core/`  
**Purpose**: Type definitions, shape registry, icon registry, layout registry  
**Key Files**:

- `src/types.ts` (1100+ lines) - All TypeScript interfaces and types
- `src/registries.ts` - Registry implementations for shapes, icons, layouts, data sources
- `src/shapes/` - 52 shape definitions across 8 categories
- `src/themes/` - Color themes for diagrams and glyphsets
- `src/validation/` - Validation utilities

**Exports**:

```typescript
// Type system
export type { DiagramAst, NodeAst, EdgeAst, ShapeDefinition, Profile }

// Registries
export { shapeRegistry, iconRegistry, layoutRegistry }

// Shape registration
export { registerDefaultShapes, registerBasicShapes, ... }

// Utilities
export { escapeXml, renderMultilineText, calculateGraphMetrics }
```

**Shape Categories**:

1. `basic/` - Rectangle, circle, ellipse, rhombus, hexagon, star (17 shapes)
2. `flowchart/` - Process, decision, document, database (8 shapes)
3. `uml/` - Class, package, state, activity, sequence (12 shapes)
4. `storage/` - Cylinder, stored data (2 shapes)
5. `charts/` - Bar, pie, line, scatter, radar (5 shapes)
6. `network/` - Server, cloud, router (3 shapes)
7. `special/` - Text, icon, image (3 shapes)
8. `glyphsets/` - 56 SmartArt-style template shapes

#### 2. **@runiq/parser-dsl** - Langium Parser

**Path**: `packages/parser-dsl/`  
**Purpose**: Parse `.runiq` DSL files into AST  
**Key Files**:

- `src/runiq.langium` (1458 lines) - Main grammar file
- `src/langium-parser.ts` (2716 lines) - Parser implementation
- `src/glyphset-expander.ts` (505 lines) - GlyphSet template expansion
- `src/validator.ts` - Semantic validation
- `src/generated/` - Auto-generated Langium code

**Grammar Structure**:

```plaintext
Document
├── Profile (multiple)
│   ├── DiagramProfile (visual diagrams)
│   ├── SequenceProfile (UML sequence diagrams)
│   ├── TimelineProfile (timelines)
│   ├── ElectricalProfile (schematics)
│   ├── PneumaticProfile (ISO 1219-1)
│   ├── HydraulicProfile (ISO 1219-2)
│   ├── PIDProfile (P&ID diagrams)
│   ├── WardleyProfile (Wardley maps)
│   ├── DigitalProfile (digital circuits)
│   └── GlyphSetProfile (template expansion)
```

**Build Process**:

```bash
pnpm langium:generate  # Generate AST types from grammar
pnpm build             # Compile TypeScript
```

#### 3. **@runiq/glyphsets** - Template Definitions

**Path**: `packages/glyphsets/`  
**Purpose**: SmartArt-style diagram templates (organizational charts, processes, etc.)  
**Key Files**:

- `src/registry.ts` - GlyphSet registry
- `src/types.ts` - GlyphSet type definitions
- `src/hierarchy/` - Org charts, hierarchies (8 glyphsets)
- `src/list/` - Lists, steps, processes (15 glyphsets)
- `src/process/` - Workflows, cycles (12 glyphsets)
- `src/relationship/` - Venn, balance, matrix (10 glyphsets)
- `src/visualization/` - Charts, graphics (11 glyphsets)

**GlyphSet Categories**:

```typescript
type GlyphSetCategory =
  | 'hierarchy' // Org charts, trees
  | 'list' // Linear lists, steps
  | 'process' // Workflows, cycles
  | 'relationship' // Venn, balance
  | 'comparison' // Side-by-side
  | 'visualization'; // Graphics, pictures
```

**Example GlyphSet**:

```typescript
export const orgChart: GlyphSetDefinition = {
  id: 'orgChart',
  name: 'Organization Chart',
  category: 'hierarchy',
  generate: (params: OrgChartParams): DiagramAst => {
    // Generate nodes and edges for org chart
  },
};
```

#### 4. **@runiq/layout-base** - Layout Engine

**Path**: `packages/layout-base/`  
**Purpose**: ELK.js integration for automatic layout  
**Key Files**:

- `src/elk-adapter.ts` - ELK layout engine adapter
- `src/circular-layout.ts` - Circular layout algorithm

**Layout Algorithms**:

- `layered` - Hierarchical (default, flowcharts)
- `force` - Force-directed (network graphs)
- `stress` - Stress minimization (reduce edge lengths)
- `radial` - Radial tree (org charts, mind maps)
- `mrtree` - Multi-rooted tree
- `circular` - Circular (workflows, lifecycles)

**ELK Integration**:

```typescript
export class ElkLayoutEngine implements LayoutEngine {
  id = 'elk';

  async layout(
    diagram: DiagramAst,
    opts?: LayoutOptions
  ): Promise<LaidOutDiagram> {
    const elkGraph = this.diagramToElkGraph(diagram, opts);
    const laidOut = await elk.layout(elkGraph);
    return this.elkGraphToLayout(laidOut, diagram);
  }
}
```

#### 5. **@runiq/renderer-svg** - SVG Generation

**Path**: `packages/renderer-svg/`  
**Purpose**: Convert laid-out diagrams to SVG  
**Key Files**:

- `src/index.ts` - Main renderer entry point
- `src/renderers/node.ts` - Node rendering
- `src/renderers/edge.ts` - Edge rendering with arrows
- `src/renderers/container.ts` - Container rendering
- `src/wardley-renderer.ts` - Wardley map renderer
- `src/sequence-renderer.ts` - UML sequence diagram renderer
- `src/timeline-renderer.ts` - Timeline renderer

**Rendering Pipeline**:

1. Apply theme colors
2. Render defs (markers, patterns, gradients)
3. Render containers (backgrounds)
4. Render edges (with arrows, labels)
5. Render nodes (shapes, labels, icons)
6. Apply graph metrics (if network analysis)

**Visual Tests**:

```bash
pnpm test:visual           # Run Playwright visual tests
pnpm test:visual:update    # Update snapshots
```

#### 6. **@runiq/renderer-schematic** - Electrical Diagrams

**Path**: `packages/renderer-schematic/`  
**Purpose**: Specialized renderer for electrical schematics  
**Status**: Under development

#### 7. **@runiq/io-json** - JSON Import/Export

**Path**: `packages/io-json/`  
**Purpose**: Serialize/deserialize diagrams to JSON  
**Use Case**: Alternative to DSL, programmatic diagram generation

#### 8. **@runiq/icons-fontawesome** - Icon Provider

**Path**: `packages/icons-fontawesome/`  
**Purpose**: FontAwesome icon integration  
**Usage**:

```runiq
diagram "Example" {
  A [shape:circle icon:fa:user label:"User"]
}
```

#### 9. **@runiq/cli** - Command-Line Interface

**Path**: `packages/cli/`  
**Purpose**: Render diagrams from command line  
**Commands**:

```bash
runiq render input.runiq -o output.svg
runiq parse input.runiq --validate
runiq convert input.runiq -o output.json
```

### Export Packages (Specialized Outputs)

- **@runiq/export-latex** - LaTeX/TikZ export
- **@runiq/export-simulink** - MATLAB Simulink export
- **@runiq/export-spice** - SPICE netlist export
- **@runiq/export-verilog** - Verilog HDL export

### Application

#### **runiq-editor** - Web Editor

**Path**: `apps/editor/`  
**Framework**: SvelteKit  
**Purpose**: Interactive web-based diagram editor  
**Features**:

- Monaco editor with syntax highlighting
- Live preview
- Export to SVG/PNG
- Share diagrams

---

## Core Concepts

### 1. **Abstract Syntax Tree (AST)**

Every diagram is represented as a typed AST:

```typescript
interface DiagramAst {
  astVersion: string;
  title?: string;
  direction?: 'LR' | 'RL' | 'TB' | 'BT';
  routing?: 'orthogonal' | 'polyline' | 'splines' | 'straight';
  theme?: string;
  styles?: Record<string, Style>;
  nodes: NodeAst[];
  edges: EdgeAst[];
  groups?: GroupAst[];
  containers?: ContainerDeclaration[];
  templates?: ContainerTemplate[];
  presets?: ContainerPreset[];
}
```

### 2. **Profile System**

Runiq supports **multiple diagram domains** through profiles:

```typescript
type Profile =
  | DiagramProfile // General visual diagrams
  | SequenceProfile // UML sequence diagrams
  | TimelineProfile // Timelines
  | ElectricalProfile // Electrical schematics
  | PneumaticProfile // Pneumatic systems (ISO 1219-1)
  | HydraulicProfile // Hydraulic systems (ISO 1219-2)
  | PIDProfile // P&ID diagrams (ISA-5.1)
  | WardleyProfile // Wardley maps
  | DigitalProfile; // Digital circuits
//| BlockDiagramProfile; // Block diagrams
```

Each profile has:

- **Unique grammar** in `runiq.langium`
- **Specific AST structure** in `types.ts`
- **Specialized renderer** in `renderer-svg/`

### 3. **Shape Registry**

All shapes are registered in a global registry:

```typescript
// Register a shape
shapeRegistry.register(rectangleShape, ['rect', 'box']);

// Get a shape
const shape = shapeRegistry.get('rectangle'); // or 'rect' or 'box'

// List all shapes
const allShapes = shapeRegistry.list();
```

### 4. **Container System**

Containers provide **hierarchical grouping** with visual boundaries:

```typescript
interface ContainerDeclaration {
  type: 'container';
  id?: string;
  label?: string;
  header?: string;
  icon?: string;
  badge?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  shape?: string; // e.g., 'awsVpc' (container-specific types; e.g., UML packages are represented as container types)
  style?: string;
  containerStyle?: ContainerStyle;
  children: string[]; // Node IDs
  containers?: ContainerDeclaration[]; // Nested containers
  layoutOptions?: ContainerLayoutOptions;
}
```

**Use Cases**:

- C4 architecture diagrams (system, container, component boundaries)
- BPMN processes (pools, lanes)
- UML packages
- AWS VPCs

### 5. **Theme System**

Themes provide consistent color palettes:

```typescript
interface DiagramTheme {
  primary: string; // Primary accent color
  secondary: string; // Secondary accent color
  background: string; // Background color
  text: string; // Text color
  border: string; // Border color
  success: string; // Success state
  warning: string; // Warning state
  error: string; // Error state
  info: string; // Info state
}
```

**Available Themes**:

- `runiq` (default blue/teal)
- `professional` (blue/gray)
- `forest` (green)
- `sunset` (orange/red)
- `ocean` (blue)
- `monochrome` (grayscale)
- `colorful` (vibrant multi-color)
- `warm` (red/orange/yellow)
- `cool` (blue/purple)

---

## Data Flow

### 1. **DSL to SVG Pipeline**

```
┌─────────────────────────────────────────────────────────────┐
│  Input: DSL Text (.runiq file)                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 1: Lexing & Parsing (Langium)                         │
│  - Tokenize input                                            │
│  - Build CST (Concrete Syntax Tree)                         │
│  - Transform to AST                                          │
│  Package: @runiq/parser-dsl                                  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Validation                                          │
│  - Check for undefined shapes                                │
│  - Validate edge endpoints                                   │
│  - Check container nesting                                   │
│  Package: @runiq/parser-dsl/validator.ts                     │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 3: GlyphSet Expansion (if applicable)                 │
│  - Detect glyphset profile                                   │
│  - Generate nodes/edges from template                        │
│  - Apply theme                                               │
│  Package: @runiq/parser-dsl/glyphset-expander.ts             │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 4: Layout (ELK)                                        │
│  - Convert AST to ELK graph                                  │
│  - Calculate node positions                                  │
│  - Route edges                                               │
│  - Handle containers                                         │
│  Package: @runiq/layout-base                                 │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 5: Rendering (SVG)                                     │
│  - Apply theme                                               │
│  - Render containers (backgrounds)                           │
│  - Render edges (arrows, labels)                             │
│  - Render nodes (shapes, icons, labels)                      │
│  - Add accessibility attributes                              │
│  Package: @runiq/renderer-svg                                │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Output: SVG String                                          │
└─────────────────────────────────────────────────────────────┘
```

### 2. **Profile-Specific Rendering**

Some profiles bypass the standard layout engine:

- **SequenceProfile**: Custom renderer with timeline-based layout
- **TimelineProfile**: Horizontal timeline with event positioning
- **WardleyProfile**: 2D grid with evolution/value axes

---

## Profile System

### Profile Architecture

Each profile is self-contained:

1. **Grammar Definition** (`runiq.langium`)

```plaintext
SequenceProfile:
    'sequence' name=STRING '{'
        statements+=SequenceStatement*
    '}';

SequenceStatement:
    ParticipantStatement | MessageStatement | NoteStatement | FragmentStatement;
```

2. **AST Type** (`types.ts`)

```typescript
export interface SequenceProfile {
  type: 'sequence';
  name: string;
  participants: SequenceParticipant[];
  messages: SequenceMessage[];
  notes: SequenceNote[];
  fragments: SequenceFragment[];
  theme?: string;
}
```

3. **Parser Logic** (`langium-parser.ts`)

```typescript
function convertSequenceProfile(
  prof: Langium.SequenceProfile
): SequenceProfile {
  return {
    type: 'sequence',
    name: prof.name,
    participants: prof.statements
      .filter(isParticipantStatement)
      .map(convertParticipant),
    messages: prof.statements.filter(isMessageStatement).map(convertMessage),
    // ...
  };
}
```

4. **Renderer** (`sequence-renderer.ts`)

```typescript
export function renderSequenceDiagram(
  profile: SequenceProfile,
  options?: SequenceRenderOptions
): SequenceRenderResult {
  // Custom rendering logic
}
```

### Adding a New Profile

To add a new profile (e.g., `gantt` for Gantt charts):

1. **Define grammar** in `packages/parser-dsl/src/runiq.langium`:

```plaintext
GanttProfile:
    'gantt' name=STRING '{'
        statements+=GanttStatement*
    '}';

GanttStatement:
    TaskStatement | MilestoneStatement | DependencyStatement;
```

2. **Add AST types** in `packages/core/src/types.ts`:

```typescript
export interface GanttProfile {
  type: 'gantt';
  name: string;
  tasks: GanttTask[];
  milestones: GanttMilestone[];
  dependencies: GanttDependency[];
}
```

3. **Implement parser** in `packages/parser-dsl/src/langium-parser.ts`

4. **Create renderer** in `packages/renderer-svg/src/gantt-renderer.ts`

5. **Write tests** in `packages/parser-dsl/src/gantt.spec.ts`

---

## Shape System

### Shape Definition Interface

Every shape implements:

```typescript
export interface ShapeDefinition {
  id: string; // Unique identifier

  // Calculate bounding box
  bounds(ctx: ShapeRenderContext): { width: number; height: number };

  // Define connection points (anchors)
  anchors?(ctx: ShapeRenderContext): { x: number; y: number; name?: string }[];

  // Generate SVG markup
  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string;
}
```

### Shape Render Context

```typescript
export interface ShapeRenderContext {
  node: NodeAst; // Node data
  style: Style; // Resolved style
  measureText: (
    text: string,
    style: Style
  ) => { width: number; height: number };
  renderLabel?: (label: string, x: number, y: number, style: any) => string;
}
```

### Example Shape Implementation

```typescript
export const rectangleShape: ShapeDefinition = {
  id: 'rectangle',

  bounds(ctx) {
    const label = ctx.node.label || '';
    const measured = ctx.measureText(label, ctx.style);
    const padding = ctx.style.padding || 10;
    return {
      width: measured.width + padding * 2,
      height: measured.height + padding * 2,
    };
  },

  anchors(ctx) {
    const { width, height } = this.bounds(ctx);
    return [
      { x: width / 2, y: 0, name: 'north' },
      { x: width / 2, y: height, name: 'south' },
      { x: 0, y: height / 2, name: 'west' },
      { x: width, y: height / 2, name: 'east' },
    ];
  },

  render(ctx, position) {
    const { width, height } = this.bounds(ctx);
    const fill = ctx.style.fill || '#e0e0e0';
    const stroke = ctx.style.stroke || '#000';
    const strokeWidth = ctx.style.strokeWidth || 1;

    let svg = `<rect x="${position.x}" y="${position.y}" 
                     width="${width}" height="${height}" 
                     fill="${fill}" stroke="${stroke}" 
                     stroke-width="${strokeWidth}"/>`;

    if (ctx.node.label && ctx.renderLabel) {
      const labelX = position.x + width / 2;
      const labelY = position.y + height / 2;
      svg += ctx.renderLabel(ctx.node.label, labelX, labelY, {
        textAnchor: 'middle',
        dominantBaseline: 'middle',
      });
    }

    return svg;
  },
};
```

### Shape Registration

Shapes are registered with the global registry:

```typescript
// packages/core/src/shapes/index.ts

export function registerDefaultShapes(): void {
  registerBasicShapes();
  registerFlowchartShapes();
  registerUMLShapes();
  registerChartShapes();
  registerNetworkShapes();
  registerStorageShapes();
  registerSpecialShapes();
  registerGlyphsetShapes();
  registerShapeAliases(); // Register common aliases
}
```

### Shape Aliases

Aliases allow multiple names for the same shape:

```typescript
// 'box' and 'rect' are aliases for 'rectangle'
shapeRegistry.registerAlias('box', 'rectangle');
shapeRegistry.registerAlias('rect', 'rectangle');
```

---

## Parser Architecture

### Langium Grammar System

Runiq uses **Langium** - a language engineering framework for building DSLs.

#### Grammar Structure

```plaintext
// Entry point
entry Document:
    profiles+=Profile*;

// Profile selection
Profile:
    DiagramProfile
    | ElectricalProfile
    | SequenceProfile
    | ...;

// Example profile
DiagramProfile:
    'diagram' name=STRING '{'
        statements+=DiagramStatement*
    '}';

// Statement types
DiagramStatement:
    DirectionDeclaration
    | ShapeDeclaration
    | EdgeDeclaration
    | ContainerBlock
    | ...;

// Node declaration
ShapeDeclaration:
    id=ID '[' properties+=NodeProperty* ']';

// Edge declaration
EdgeDeclaration:
    from=NodeRef arrow=Arrow to=NodeRef ('[' properties+=EdgeProperty* ']')?;
```

### Parser Workflow

1. **Lexical Analysis**: Text → Tokens
2. **Syntax Analysis**: Tokens → CST (Concrete Syntax Tree)
3. **AST Transformation**: CST → Typed AST
4. **Validation**: Check semantic rules
5. **Output**: Validated AST

### Validation System

Validators check semantic correctness:

```typescript
// packages/parser-dsl/src/validator.ts

export class RuniqValidator {
  checkShapeExists(node: NodeAst): ValidationIssue[] {
    if (!shapeRegistry.has(node.shape)) {
      return [
        {
          severity: 'error',
          message: `Unknown shape: ${node.shape}`,
          location: node,
        },
      ];
    }
    return [];
  }

  checkEdgeEndpoints(edge: EdgeAst, nodes: NodeAst[]): ValidationIssue[] {
    const nodeIds = new Set(nodes.map((n) => n.id));
    const issues: ValidationIssue[] = [];

    if (!nodeIds.has(edge.from)) {
      issues.push({
        severity: 'error',
        message: `Edge references unknown node: ${edge.from}`,
        location: edge,
      });
    }

    if (!nodeIds.has(edge.to)) {
      issues.push({
        severity: 'error',
        message: `Edge references unknown node: ${edge.to}`,
        location: edge,
      });
    }

    return issues;
  }
}
```

---

## Layout Engine

### ELK Integration

ELK (Eclipse Layout Kernel) provides automatic graph layout:

```typescript
// packages/layout-base/src/elk-adapter.ts

export class ElkLayoutEngine implements LayoutEngine {
  id = 'elk';

  async layout(
    diagram: DiagramAst,
    opts?: LayoutOptions
  ): Promise<LaidOutDiagram> {
    const elkGraph = this.convertToElkGraph(diagram, opts);
    const laidOut = await elk.layout(elkGraph);
    return this.convertFromElkGraph(laidOut, diagram);
  }

  private convertToElkGraph(
    diagram: DiagramAst,
    opts?: LayoutOptions
  ): ElkNode {
    return {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': opts?.algorithm || 'layered',
        'elk.direction': opts?.direction || diagram.direction || 'TB',
        'elk.spacing.nodeNode': String(opts?.spacing || 50),
      },
      children: diagram.nodes.map(this.nodeToElk),
      edges: diagram.edges.map(this.edgeToElk),
    };
  }
}
```

### Layout Algorithms

Each algorithm optimizes for different graph types:

| Algorithm  | Best For                | Description                         |
| ---------- | ----------------------- | ----------------------------------- |
| `layered`  | Flowcharts, hierarchies | Nodes arranged in horizontal layers |
| `force`    | Network graphs          | Force-directed physics simulation   |
| `stress`   | Dense graphs            | Minimize edge length stress         |
| `radial`   | Trees, hierarchies      | Radial layout from center           |
| `mrtree`   | Forests                 | Multiple tree roots                 |
| `circular` | Cycles, workflows       | Nodes arranged in circle            |

---

## Rendering Pipeline

### SVG Generation

```typescript
// packages/renderer-svg/src/index.ts

export function renderSvg(
  diagram: DiagramAst,
  layout: LaidOutDiagram,
  options: RenderOptions = {}
): RenderResult {
  const theme = getDiagramTheme(diagram.theme || options.theme || 'runiq');
  const graphMetrics = calculateGraphMetrics(diagram);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" 
                  width="${layout.size.width}" 
                  height="${layout.size.height}">`;

  // 1. Definitions (markers, patterns, gradients)
  svg += renderDefs();

  // 2. Containers (backgrounds)
  for (const container of layout.containers || []) {
    svg += renderContainer(container, diagram);
  }

  // 3. Edges (behind nodes)
  for (const edge of layout.edges) {
    svg += renderEdge(edge, diagram, theme);
  }

  // 4. Nodes (on top)
  for (const node of layout.nodes) {
    svg += renderNode(node, diagram, theme, graphMetrics);
  }

  svg += '</svg>';
  return { svg, warnings: [] };
}
```

### Edge Rendering

Edges support multiple arrow types and routing:

```typescript
function renderEdge(
  edge: RoutedEdge,
  diagram: DiagramAst,
  theme: DiagramTheme
): string {
  const edgeData = diagram.edges[edge.edgeIndex];
  const points = edge.points;

  // Generate path
  const pathData = generatePath(points, edgeData.routing);

  // Arrow markers
  const markerStart = getMarkerStart(edgeData);
  const markerEnd = getMarkerEnd(edgeData);

  let svg = `<path d="${pathData}" 
                   stroke="${edgeData.strokeColor || theme.border}" 
                   stroke-width="${edgeData.strokeWidth || 1.5}" 
                   fill="none" 
                   marker-start="${markerStart}" 
                   marker-end="${markerEnd}"/>`;

  // Edge label
  if (edgeData.label) {
    const labelPos = calculateLabelPosition(points);
    svg += renderEdgeLabel(edgeData.label, labelPos);
  }

  return svg;
}
```

### Node Rendering

Nodes delegate to registered shapes:

```typescript
function renderNode(
  node: PositionedNode,
  diagram: DiagramAst,
  theme: DiagramTheme,
  metrics?: GraphMetrics
): string {
  const nodeData = diagram.nodes.find((n) => n.id === node.id);
  const shape = shapeRegistry.get(nodeData.shape);

  if (!shape) {
    return renderFallbackNode(node, nodeData);
  }

  const ctx: ShapeRenderContext = {
    node: nodeData,
    style: resolveStyle(nodeData, diagram, theme),
    measureText,
    renderLabel: renderLabelWithIcons,
  };

  return `<g id="${node.id}" transform="translate(${node.x}, ${node.y})">
            ${shape.render(ctx, { x: 0, y: 0 })}
          </g>`;
}
```

---

## Extension Points

### 1. Adding Custom Shapes

```typescript
// Define shape
export const myCustomShape: ShapeDefinition = {
  id: 'myCustom',
  bounds(ctx) {
    /* ... */
  },
  anchors(ctx) {
    /* ... */
  },
  render(ctx, pos) {
    /* ... */
  },
};

// Register in package
// packages/core/src/shapes/custom/index.ts
export function registerCustomShapes(): void {
  shapeRegistry.register(myCustomShape);
}

// Import and register in main
import { registerCustomShapes } from './custom/index.js';
registerCustomShapes();
```

### 2. Adding Custom Layouts

```typescript
export class MyLayoutEngine implements LayoutEngine {
  id = 'myLayout';

  async layout(
    diagram: DiagramAst,
    opts?: LayoutOptions
  ): Promise<LaidOutDiagram> {
    // Custom layout algorithm
  }
}

// Register
layoutRegistry.register(new MyLayoutEngine());
```

### 3. Adding Custom Icon Providers

```typescript
export const myIconProvider: IconProvider = {
  id: 'myicons',

  getPath(name: string): { d: string; viewBox: string } | undefined {
    return myIconDatabase[name];
  },
};

// Register
iconRegistry.register(myIconProvider);
```

### 4. Adding Custom Themes

```typescript
// packages/core/src/themes/custom-themes.ts

export const customTheme: DiagramTheme = {
  primary: '#6200ea',
  secondary: '#03dac6',
  background: '#ffffff',
  text: '#000000',
  border: '#9e9e9e',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
};

// Register theme
baseThemes.custom = customTheme;
```

---

## Testing Strategy

### Unit Tests (Vitest)

All packages have comprehensive unit tests:

```typescript
// packages/core/src/shapes/basic/rectangle.spec.ts

import { describe, it, expect } from 'vitest';
import { rectangleShape } from './rectangle.js';

describe('rectangleShape', () => {
  it('should have correct ID', () => {
    expect(rectangleShape.id).toBe('rectangle');
  });

  it('should calculate bounds correctly', () => {
    const ctx = createMockContext({ label: 'Test' });
    const bounds = rectangleShape.bounds(ctx);
    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should define 4 anchor points', () => {
    const ctx = createMockContext({ label: 'Test' });
    const anchors = rectangleShape.anchors!(ctx);
    expect(anchors).toHaveLength(4);
    expect(anchors.map((a) => a.name)).toEqual([
      'north',
      'south',
      'west',
      'east',
    ]);
  });

  it('should render valid SVG', () => {
    const ctx = createMockContext({ label: 'Test' });
    const svg = rectangleShape.render(ctx, { x: 0, y: 0 });
    expect(svg).toContain('<rect');
    expect(svg).toContain('fill=');
    expect(svg).toContain('stroke=');
  });
});
```

### Visual Tests (Playwright)

Renderer has visual regression tests:

```typescript
// packages/renderer-svg/tests/visual/shapes.spec.ts

import { test, expect } from '@playwright/test';

test('rectangle shape renders correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/test-shapes');

  const shape = page.locator('#rectangle-test');
  await expect(shape).toHaveScreenshot('rectangle-shape.png');
});
```

### Integration Tests

CLI and parser have end-to-end tests:

```typescript
// packages/cli/src/cli.spec.ts

describe('CLI render command', () => {
  it('should render DSL file to SVG', async () => {
    const result = await runCLI(['render', 'test.runiq', '-o', 'output.svg']);
    expect(result.exitCode).toBe(0);
    expect(fs.existsSync('output.svg')).toBe(true);
  });
});
```

### Test Coverage Goals

- Core logic: **90%+**
- Shape implementations: **80%+**
- DSL parsing: **95%+**
- Overall: **85%+**

---

## Build System

### pnpm Workspaces

Runiq uses pnpm workspaces for monorepo management:

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

### Build Scripts

```json
{
  "scripts": {
    "build": "pnpm -r build", // Build all packages
    "build:packages": "pnpm --filter './packages/**' build", // Packages only
    "dev": "pnpm --filter runiq-editor dev", // Start editor
    "test": "pnpm -r test", // Run all tests
    "lint": "pnpm -r lint", // Lint all packages
    "typecheck": "pnpm -r typecheck", // Type check all
    "clean": "pnpm -r clean" // Clean all dist/
  }
}
```

### Package Build Scripts

Each package has:

```json
{
  "scripts": {
    "build": "tsup && tsc -p tsconfig.build.json",
    "dev": "tsup --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src/**/*.ts",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  }
}
```

### tsup Configuration

```typescript
// tsup.config.ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
});
```

### Build Order

Dependencies are built in the correct order:

1. `@runiq/core` (no dependencies)
2. `@runiq/glyphsets` (depends on core)
3. `@runiq/parser-dsl` (depends on core, glyphsets)
4. `@runiq/layout-base` (depends on core)
5. `@runiq/renderer-svg` (depends on core, parser-dsl)
6. `@runiq/cli` (depends on all above)

---

## Development Workflow

### Setting Up Development Environment

```bash
# Clone repository
git clone https://github.com/jgreywolf/runiq.git
cd runiq

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start editor in dev mode
pnpm dev:editor
```

### Adding a New Shape

1. **Create shape file**: `packages/core/src/shapes/custom/myshape.ts`

2. **Implement shape**:

```typescript
import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

export const myShape: ShapeDefinition = {
  id: 'myShape',
  bounds(ctx) {
    /* ... */
  },
  anchors(ctx) {
    /* ... */
  },
  render(ctx, pos) {
    /* ... */
  },
};
```

3. **Write tests**: `packages/core/src/shapes/custom/myshape.spec.ts`

4. **Register shape**: Update `packages/core/src/shapes/index.ts`

5. **Run tests**: `cd packages/core && pnpm test`

6. **Build**: `pnpm build`

### Adding a New Profile

1. **Define grammar**: `packages/parser-dsl/src/runiq.langium`

2. **Add AST types**: `packages/core/src/types.ts`

3. **Implement parser**: `packages/parser-dsl/src/langium-parser.ts`

4. **Create renderer**: `packages/renderer-svg/src/myprofile-renderer.ts`

5. **Write tests**: `packages/parser-dsl/src/myprofile.spec.ts`

6. **Update CLI**: `packages/cli/src/cli.ts`

### Debugging Tips

1. **Parser issues**: Enable Langium debug logging

```typescript
const services = createRuniqServices(EmptyFileSystem, { debug: true });
```

2. **Layout issues**: Use ELK debugger

```typescript
const elkGraph = adapter.diagramToElkGraph(diagram);
console.log(JSON.stringify(elkGraph, null, 2));
```

3. **Rendering issues**: Inspect generated SVG

```typescript
const svg = renderSvg(diagram, layout);
await fs.writeFile('debug.svg', svg);
```

4. **Visual tests**: Update snapshots

```bash
cd packages/renderer-svg
pnpm test:visual:update
```

### Committing Code

Follow Test-Driven Development:

1. **Write tests first** (Red)
2. **Implement feature** (Green)
3. **Refactor** while keeping tests passing
4. **Run all tests** before committing
5. **Commit with descriptive message**

```bash
# Run tests
pnpm test

# Lint code
pnpm lint

# Type check
pnpm typecheck

# Commit
git add .
git commit -m "feat: add myShape to custom shapes"
```

---

## Key Takeaways

1. **Runiq is profile-based**: Each diagram domain is a separate profile with its own grammar
2. **Shapes are modular**: Easy to add new shapes by implementing `ShapeDefinition`
3. **Layout is automatic**: ELK handles positioning; you focus on graph structure
4. **Type-safe throughout**: TypeScript strict mode enforces correctness
5. **Test-driven**: Write tests before implementation
6. **Well-structured**: Clear separation between parsing, layout, rendering
7. **Extensible**: Plugin architecture for shapes, layouts, icons, themes

---

## Next Steps for New Contributors

1. **Read this guide thoroughly**
2. **Explore the codebase** starting from `@runiq/core`
3. **Run the test suite** to understand coverage
4. **Pick a small task** (add a simple shape or alias)
5. **Follow TDD** - write tests first
6. **Submit a PR** with tests and documentation

Welcome to the Runiq project! 🎉
