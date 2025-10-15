# Shape Requirements & Implementation Plan

## Current Shape Inventory

### ✅ Implemented (6 shapes)

1. **rounded** - Rounded rectangle (default)
2. **rhombus** - Diamond shape (decisions)
3. **hex** - Hexagon
4. **actor** - Stick figure
5. **doc** - Document with wavy bottom
6. **rect** - Rectangle _(assumed, need to verify)_

### 📊 Shape Usage by Diagram Type

| Shape   | Flowchart        | Sequence      | ER          | State      | UML        | BPMN          |
| ------- | ---------------- | ------------- | ----------- | ---------- | ---------- | ------------- |
| rounded | ✅ (Start/End)   |               |             | ✅ (State) |            | ✅ (Task)     |
| rect    | ✅ (Process)     | ✅ (Lifeline) | ✅ (Entity) |            | ✅ (Class) | ✅ (Task)     |
| rhombus | ✅ (Decision)    |               |             |            |            | ✅ (Gateway)  |
| hexagon | ✅ (Preparation) |               |             |            |            |               |
| actor   |                  | ✅ (Actor)    |             |            | ✅ (Actor) | ✅ (Pool)     |
| doc     | ✅ (Document)    |               |             |            |            | ✅ (Document) |

---

## 🎯 High Priority Shapes (Standard Flowchart)

These are from ISO 5807 and widely used:

### 1. **Parallelogram** - Input/Output

```
    _________
   /        /
  /________/
```

**Use Cases:**

- Data input/output
- Generic I/O operations
- Reading/writing files
- User input

**Implementation:**

```typescript
export const parallelogramShape: ShapeDefinition = {
  id: 'parallelogram',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;
    return {
      width: textSize.width + padding * 4, // Extra width for skew
      height: textSize.height + padding * 2,
    };
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const skew = 15; // Skew amount in pixels

    // Path: top-left, top-right, bottom-right, bottom-left
    const path = `M ${x + skew},${y} 
                  L ${x + bounds.width},${y}
                  L ${x + bounds.width - skew},${y + bounds.height}
                  L ${x},${y + bounds.height} Z`;

    return `
      <path d="${path}" fill="${ctx.style.fill || '#e3f2fd'}" 
            stroke="${ctx.style.stroke || '#333'}" stroke-width="${ctx.style.strokeWidth || 1}" />
      <text x="${x + bounds.width / 2}" y="${y + bounds.height / 2}" 
            text-anchor="middle" dominant-baseline="middle">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
```

---

### 2. **Trapezoid** - Manual Operation

```
  __________
 /          \
/____________\
```

**Use Cases:**

- Manual operations
- Human-performed steps
- Review processes

**Implementation:**

```typescript
export const trapezoidShape: ShapeDefinition = {
  id: 'trapezoid',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;
    return {
      width: textSize.width + padding * 3,
      height: textSize.height + padding * 2,
    };
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const indent = 20;

    const path = `M ${x + indent},${y}
                  L ${x + bounds.width - indent},${y}
                  L ${x + bounds.width},${y + bounds.height}
                  L ${x},${y + bounds.height} Z`;

    return `
      <path d="${path}" fill="${ctx.style.fill || '#fff9c4'}" 
            stroke="${ctx.style.stroke || '#333'}" stroke-width="${ctx.style.strokeWidth || 1}" />
      <text x="${x + bounds.width / 2}" y="${y + bounds.height / 2}" 
            text-anchor="middle" dominant-baseline="middle">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
```

---

### 3. **Cylinder** - Database/Storage

```
   _____
  /     \
 |       |
 |       |
  \_____/
```

**Use Cases:**

- Databases
- Data stores
- Persistent storage

**Implementation:**

```typescript
export const cylinderShape: ShapeDefinition = {
  id: 'cylinder',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;
    return {
      width: textSize.width + padding * 2,
      height: textSize.height + padding * 3, // Extra for ellipse
    };
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const ellipseHeight = 12;

    return `
      <!-- Top ellipse -->
      <ellipse cx="${x + bounds.width / 2}" cy="${y + ellipseHeight / 2}"
               rx="${bounds.width / 2}" ry="${ellipseHeight / 2}"
               fill="${ctx.style.fill || '#e1f5fe'}" 
               stroke="${ctx.style.stroke || '#333'}" stroke-width="${ctx.style.strokeWidth || 1}" />
      
      <!-- Sides -->
      <rect x="${x}" y="${y + ellipseHeight / 2}" 
            width="${bounds.width}" height="${bounds.height - ellipseHeight}"
            fill="${ctx.style.fill || '#e1f5fe'}" stroke="none" />
      <line x1="${x}" y1="${y + ellipseHeight / 2}" 
            x2="${x}" y2="${y + bounds.height - ellipseHeight / 2}"
            stroke="${ctx.style.stroke || '#333'}" stroke-width="${ctx.style.strokeWidth || 1}" />
      <line x1="${x + bounds.width}" y1="${y + ellipseHeight / 2}" 
            x2="${x + bounds.width}" y2="${y + bounds.height - ellipseHeight / 2}"
            stroke="${ctx.style.stroke || '#333'}" stroke-width="${ctx.style.strokeWidth || 1}" />
      
      <!-- Bottom ellipse -->
      <ellipse cx="${x + bounds.width / 2}" cy="${y + bounds.height - ellipseHeight / 2}"
               rx="${bounds.width / 2}" ry="${ellipseHeight / 2}"
               fill="${ctx.style.fill || '#e1f5fe'}" 
               stroke="${ctx.style.stroke || '#333'}" stroke-width="${ctx.style.strokeWidth || 1}" />
      
      <text x="${x + bounds.width / 2}" y="${y + bounds.height / 2}" 
            text-anchor="middle" dominant-baseline="middle">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
```

---

### 4. **Circle** - Connector/Junction

```
   ___
  /   \
 |  •  |
  \___/
```

**Use Cases:**

- Connectors
- Junction points
- On-page references

**Implementation:**

```typescript
export const circleShape: ShapeDefinition = {
  id: 'circle',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;
    const diameter = Math.max(textSize.width, textSize.height) + padding * 2;
    return { width: diameter, height: diameter };
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const radius = bounds.width / 2;

    return `
      <circle cx="${x + radius}" cy="${y + radius}" r="${radius}"
              fill="${ctx.style.fill || '#f5f5f5'}" 
              stroke="${ctx.style.stroke || '#333'}" stroke-width="${ctx.style.strokeWidth || 1}" />
      <text x="${x + radius}" y="${y + radius}" 
            text-anchor="middle" dominant-baseline="middle">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
```

---

## 🎯 Medium Priority Shapes

### 5. **Stadium** - Terminator (alternate style)

Pill-shaped rounded rectangle (like rounded but more extreme curves)

### 6. **Pentagon** - Process (alternate)

Five-sided shape used in some flowchart styles

### 7. **Octagon** - Stop/Halt

Eight-sided shape for stop operations

### 8. **Triangle** - Extract/Filter

Pointing down for filtering operations

### 9. **Inverted Triangle** - Merge

Pointing up for merging operations

### 10. **Ellipse** - Annotation

Oval shape for comments/notes

---

## 🏢 Business Process (BPMN) Shapes

### 11. **Gateway Diamond** (already have rhombus)

- Exclusive (X)
- Parallel (||)
- Inclusive (O)
- Event-based (pentagon inside)

### 12. **Event Circles**

- Start (single line)
- Intermediate (double line)
- End (bold line)

### 13. **Task Rectangles**

- User Task (person icon)
- Service Task (gear icon)
- Script Task (scroll icon)

---

## 📊 UML/ER Shapes

### 14. **Class Box** (three sections)

```
┌─────────────┐
│   ClassName │
├─────────────┤
│  attributes │
├─────────────┤
│   methods   │
└─────────────┘
```

### 15. **Interface** (Circle with lollipop)

### 16. **Component** (Rectangle with tabs)

### 17. **Note** (Dog-eared rectangle)

---

## 🎭 Sequence Diagram Shapes

### 18. **Lifeline** (rectangle + dashed line)

### 19. **Activation Box** (thin vertical rectangle)

### 20. **Destruction** (large X)

---

## 🔧 Implementation Priority

### Phase 1: Essential Flowchart (Week 1)

- ✅ Circle
- ✅ Parallelogram
- ✅ Trapezoid
- ✅ Cylinder

### Phase 2: Extended Flowchart (Week 2)

- Stadium
- Pentagon
- Octagon
- Triangle
- Inverted Triangle

### Phase 3: BPMN Support (Week 3)

- Gateway variants
- Event variants
- Task variants

### Phase 4: UML/ER Support (Week 4)

- Class box
- Interface
- Component
- Note

---

## 🎨 Shape Naming Convention

```typescript
// DSL syntax options:
node A { shape: "rounded" }     // Current (name only)
node A { shape: @rounded }      // With @ prefix
node A as @rounded              // Shorthand

// Proposed aliases:
"rounded" = "terminator" = "stadium"
"rhombus" = "diamond" = "decision"
"parallelogram" = "io" = "input-output"
"trapezoid" = "manual"
"cylinder" = "database" = "storage"
```

---

## 🧪 Shape Testing Strategy

```typescript
// packages/core/src/shapes/__tests__/shapes.test.ts
describe('Shape Definitions', () => {
  const mockCtx: ShapeRenderContext = {
    node: { id: 'test', shape: 'rounded', label: 'Test' },
    style: { fill: '#fff', stroke: '#000' },
    measureText: (text) => ({ width: text.length * 8, height: 16 }),
  };

  describe('roundedShape', () => {
    it('calculates bounds correctly', () => {
      const bounds = roundedShape.bounds(mockCtx);
      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('renders valid SVG', () => {
      const svg = roundedShape.render(mockCtx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
      expect(svg).toContain('<text');
    });

    it('includes label text', () => {
      const svg = roundedShape.render(mockCtx, { x: 0, y: 0 });
      expect(svg).toContain('Test');
    });
  });

  // ... test all shapes
});
```

---

## 📐 Anchor Points for Edge Routing

Important for better edge connections:

```typescript
// Add anchors method to ShapeDefinition
anchors(ctx: ShapeRenderContext): { x: number, y: number, name?: string }[] {
  const bounds = this.bounds(ctx);
  return [
    { x: bounds.width / 2, y: 0, name: 'top' },
    { x: bounds.width, y: bounds.height / 2, name: 'right' },
    { x: bounds.width / 2, y: bounds.height, name: 'bottom' },
    { x: 0, y: bounds.height / 2, name: 'left' },
  ];
}
```

This helps layout engines know where edges should attach.

---

## 🎯 Shape Registry Enhancements

```typescript
// Add shape categories for better organization
interface ShapeMetadata {
  id: string;
  category: 'flowchart' | 'bpmn' | 'uml' | 'er' | 'sequence' | 'custom';
  tags: string[];
  aliases: string[];
  description: string;
}

// Enhanced registry:
shapeRegistry.register(roundedShape, {
  category: 'flowchart',
  tags: ['terminator', 'start', 'end'],
  aliases: ['stadium', 'terminator'],
  description: 'Rounded rectangle for start/end nodes',
});

// Query shapes:
const flowchartShapes = shapeRegistry.getByCategory('flowchart');
const ioShapes = shapeRegistry.getByTag('input-output');
```

---

## 📊 Visual Shape Catalog

Consider generating a visual catalog:

```bash
# CLI command to generate shape showcase
pnpm runiq shapes --output shapes.svg

# Generates SVG with all available shapes in a grid
```

---

## ✅ Action Items

1. **Verify existing shapes** - Check if rect, circle, cylinder, etc. already exist
2. **Implement high-priority shapes** - Circle, Parallelogram, Trapezoid, Cylinder
3. **Add anchor points** - For better edge routing
4. **Create shape tests** - Unit tests for each shape
5. **Add shape metadata** - Categories, tags, aliases
6. **Update grammar** - Support shape aliases
7. **Generate catalog** - Visual documentation of all shapes

---

## 🎨 Example Enhanced Shape

```typescript
// packages/core/src/shapes/parallelogram.ts
import type { ShapeDefinition } from '@runiq/core';

export const parallelogramShape: ShapeDefinition = {
  id: 'parallelogram',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;
    const skew = 15;

    return {
      width: textSize.width + padding * 2 + skew * 2,
      height: textSize.height + padding * 2,
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const skew = 15;

    return [
      { x: bounds.width / 2, y: 0, name: 'top' },
      { x: bounds.width - skew / 2, y: bounds.height / 2, name: 'right' },
      { x: bounds.width / 2, y: bounds.height, name: 'bottom' },
      { x: skew / 2, y: bounds.height / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const skew = 15;

    const fill = ctx.style.fill || '#e3f2fd';
    const stroke = ctx.style.stroke || '#1976d2';
    const strokeWidth = ctx.style.strokeWidth || 2;

    const path = `M ${x + skew},${y} 
                  L ${x + bounds.width},${y}
                  L ${x + bounds.width - skew},${y + bounds.height}
                  L ${x},${y + bounds.height} Z`;

    return `
      <path d="${path}" 
            fill="${fill}" 
            stroke="${stroke}" 
            stroke-width="${strokeWidth}"
            class="runiq-shape runiq-shape-parallelogram" />
      
      <text x="${x + bounds.width / 2}" 
            y="${y + bounds.height / 2}" 
            text-anchor="middle" 
            dominant-baseline="middle"
            class="runiq-node-text"
            font-family="${ctx.style.font || 'sans-serif'}" 
            font-size="${ctx.style.fontSize || 14}">
        ${escapeXml(ctx.node.label || ctx.node.id)}
      </text>
    `;
  },
};

// Register with metadata
export const parallelogramMetadata = {
  category: 'flowchart' as const,
  tags: ['io', 'input', 'output', 'data'],
  aliases: ['io', 'input-output'],
  description: 'Parallelogram shape for input/output operations',
};
```

---

**Next Step:** Should I start implementing these shapes, or would you prefer to begin with the unit test infrastructure first?
