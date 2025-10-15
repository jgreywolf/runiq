# Shape Implementation Progress

## Overview

Implementing comprehensive flowchart and diagram shapes for Runiq DSL. Target: **52 total shapes** across 8 categories.

## Current Status: **14 of 52 shapes implemented** (27%)

---

## ✅ Implemented Shapes (14)

### Basic Geometric Shapes (5 of 8)

- ✅ **Rectangle** (`rect`) - Standard process box
- ✅ **Rounded Rectangle** (`rounded`) - Existing, events with rounded corners
- ✅ **Stadium** (`stadium`) - Pill shape for terminals/start/end
- ✅ **Diamond** (`rhombus`) - Existing, decision points
- ✅ **Circle** (`circ`) - Basic circle
- ✅ **Triangle** (`tri`) - Extract operations
- ✅ **Hexagon** (`hex`) - Existing, preparation steps
- ❌ **Odd** (`odd`) - Odd-sided shapes

### Storage/Data Shapes (2 of 7)

- ✅ **Database/Cylinder** (`cyl`) - Database storage
- ✅ **Parallelogram** (`lean-r`) - Data input/output
- ❌ **H-Cylinder** (`h-cyl`) - Horizontal cylinder
- ❌ **Disk Storage** (`lin-cyl`) - Magnetic disk
- ❌ **Stored Data** (`bow-rect`) - Bow-tie shape
- ❌ **Internal Storage** (`win-pane`) - Windowed rectangle
- ❌ **Lean Left** (`lean-l`) - Output/input data

### Process Shapes (2 of 8)

- ✅ **Trapezoid** (`trap-b`) - Priority operations
- ✅ **Flipped Trapezoid** (`trap-t`) - Manual operations
- ❌ **Framed Rectangle** (`fr-rect`) - Subprocess
- ❌ **Multi Rectangle** (`st-rect`) - Multiple processes
- ❌ **Tagged Rectangle** (`tag-rect`) - Tagged process
- ❌ **Lined Rectangle** (`lin-rect`) - Shaded process
- ❌ **Divided Rectangle** (`div-rect`) - Divided process
- ❌ **Notched Rectangle** (`notch-rect`) - Card/notched box

### Input/Output Shapes (1 of 3)

- ✅ **Manual Input** (`sl-rect`) - Manual data entry
- ❌ **Display** (`curv-trap`) - Display output
- ❌ **Paper Tape** (`flag`) - Paper tape I/O

### Specialized Shapes (1 of 8)

- ✅ **Delay** (`delay`) - Delay in process
- ❌ **Collate** (`hourglass`) - Sorting/collation
- ❌ **Loop Limit** (`notch-pent`) - Loop boundaries
- ❌ **Lightning Bolt** (`bolt`) - Communication link
- ❌ **Fork/Join** (`fork`) - Fork or join
- ❌ **Flipped Triangle** (`flip-tri`) - Manual file

### Document Shapes (1 of 4)

- ✅ **Document** (`doc`) - Existing, single document
- ❌ **Lined Document** (`lin-doc`) - Document with lines
- ❌ **Multi Document** (`docs`) - Multiple documents
- ❌ **Tagged Document** (`tag-doc`) - Tagged document

### Circle Variants (0 of 6)

- ❌ **Double Circle** (`dbl-circ`) - Nested circles
- ❌ **Small Circle** (`sm-circ`) - Small indicators
- ❌ **Framed Circle** (`fr-circ`) - Stop points
- ❌ **Cross Circle** (`cross-circ`) - Summary points
- ❌ **Filled Circle** (`f-circ`) - Junction points

### Annotation Shapes (0 of 3)

- ❌ **Text Block** (`text`) - Plain text
- ❌ **Comment Left** (`brace`) - Left brace
- ❌ **Comment Right** (`brace-r`) - Right brace

### Special (2 existing)

- ✅ **Actor** (`actor`) - Existing, stick figure for UML

---

## Shape Features Implemented

All implemented shapes include:

- ✅ **Bounds calculation** - Dynamic sizing based on text content
- ✅ **Anchor points** - 4-point anchors (top, right, bottom, left) for edge connections
- ✅ **SVG rendering** - Clean, accessible SVG markup
- ✅ **Style support** - Respects fill, stroke, strokeWidth, font properties
- ✅ **Text centering** - Proper text positioning within shape bounds
- ✅ **Padding** - Configurable padding around text content

---

## Next Steps

### Priority 1: Common Flowchart Shapes (10 shapes)

These are essential for basic flowcharts:

1. **Display** (`curv-trap`) - Output display
2. **Paper Tape** (`flag`) - Legacy I/O
3. **Lean Left** (`lean-l`) - Output data
4. **Framed Rectangle** (`fr-rect`) - Subprocess/subroutine
5. **Collate** (`hourglass`) - Sorting operations
6. **Loop Limit** (`notch-pent`) - Loop markers
7. **Flipped Triangle** (`flip-tri`) - Manual file operations
8. **Lined Document** (`lin-doc`) - Document with content
9. **Multi Document** (`docs`) - Stack of documents
10. **Odd** (`odd`) - Odd-sided polygons

### Priority 2: Storage & Advanced (15 shapes)

For data flow and storage diagrams:

- H-Cylinder, Disk Storage, Stored Data, Internal Storage
- Multi Rectangle, Tagged Rectangle, Lined Rectangle, Divided Rectangle, Notched Rectangle
- Lightning Bolt, Fork/Join
- Tagged Document

### Priority 3: Circle Variants (6 shapes)

For state machines and UML:

- Double Circle, Small Circle, Framed Circle
- Cross Circle, Filled Circle

### Priority 4: Annotations (3 shapes)

For documentation:

- Text Block, Comment Left, Comment Right

---

## Technical Details

### File Structure

```
packages/core/src/shapes/
├── index.ts          # Registry and exports
├── actor.ts          # Existing
├── rounded.ts        # Existing
├── rhombus.ts        # Existing (diamond)
├── hex.ts            # Existing (hexagon)
├── doc.ts            # Existing (document)
├── rectangle.ts      # ✅ NEW
├── stadium.ts        # ✅ NEW
├── circle.ts         # ✅ NEW
├── triangle.ts       # ✅ NEW
├── parallelogram.ts  # ✅ NEW (lean-r)
├── trapezoid.ts      # ✅ NEW (trap-b, trap-t)
├── manual-input.ts   # ✅ NEW (sl-rect)
├── delay.ts          # ✅ NEW
└── cylinder.ts       # ✅ NEW (database)
```

### Shape Definition Pattern

```typescript
export const shapeNameShape: ShapeDefinition = {
  id: 'shape-id',
  bounds(ctx) {
    // Calculate width/height based on text
    // Add padding and shape-specific spacing
    return { width, height };
  },
  anchors(ctx) {
    // Define connection points
    // Typically: top, right, bottom, left
    return [{ x, y, name }];
  },
  render(ctx, position) {
    // Generate SVG markup
    // Apply styles from ctx.style
    // Center text within bounds
    return `<svg>...</svg>`;
  },
};
```

### Registration

All shapes are automatically registered via `registerDefaultShapes()` in `packages/core/src/shapes/index.ts`.

### Testing

Build verification: ✅ All 14 shapes compile successfully
Runtime tests: ⏳ Pending (to be added to `core/__tests__/shapes.test.ts`)

---

## Usage Examples

```runiq
diagram "Shapes Demo"

// Basic shapes
shape Start as @stadium label:"Start"
shape Process as @rect label:"Process"
shape Decision as @rhombus label:"Decision?"

// Data I/O
shape Input as @lean-r label:"Get Data"
shape Output as @lean-l label:"Output" // TODO: Not yet implemented

// Storage
shape Database as @cyl label:"Users DB"

// Specialized
shape ManualEntry as @sl-rect label:"Enter Data"
shape Wait as @delay label:"Wait"
shape Priority as @trap-b label:"High Priority"

// Connections
Start -> Process
Process -> Decision
Decision -yes-> Database
Decision -no-> ManualEntry
Database -> Output
ManualEntry -> Wait
Wait -> Priority
```

---

## Build Status

✅ **Build successful** - All implemented shapes compile without errors
✅ **Type safe** - All shapes properly typed with `ShapeDefinition` interface
✅ **Registered** - All shapes available via `shapeRegistry.get(id)`

## Next Action

Continue implementing Priority 1 shapes (common flowchart shapes) to reach 50%+ coverage.
