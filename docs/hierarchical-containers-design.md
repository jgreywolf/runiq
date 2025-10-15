# Hierarchical Containers (Subgraphs) - Design Document

**Feature:** Support for nested containers/groups in diagrams  
**Priority:** 🔴 CRITICAL  
**Status:** Design Phase  
**Date:** October 14, 2025

---

## Overview

Hierarchical containers allow nodes to be grouped within parent containers, enabling:

- **C4 Diagrams** - System boundaries, containers
- **BPMN** - Pools and lanes
- **Architecture Diagrams** - Tier/layer grouping
- **Deployment Diagrams** - Physical/logical boundaries
- **Organizational Charts** - Department grouping

---

## Use Cases

### Use Case 1: C4 System Context

```runiq
diagram c4 "Online Banking System"

  container "Banking System" {
    node WebApp { shape: rect, label: "Web Application" }
    node API { shape: rect, label: "API Gateway" }
    node Database { shape: cyl, label: "PostgreSQL" }

    edge WebApp -> API
    edge API -> Database
  }

  node Customer { shape: actor, label: "Customer" }
  node EmailSystem { shape: rect, label: "Email System" }

  edge Customer -> WebApp
  edge API -> EmailSystem
```

**Visual Result:**

- Dashed rectangle around WebApp, API, Database with label "Banking System"
- Customer and EmailSystem outside the container
- Edges cross container boundaries

### Use Case 2: BPMN Process with Pools

```runiq
diagram bpmn "Order Process"

  container "Customer" {
    node PlaceOrder { shape: rounded, label: "Place Order" }
    node ReceiveGoods { shape: rounded, label: "Receive Goods" }
  }

  container "Warehouse" {
    node ProcessOrder { shape: rect, label: "Process Order" }
    node ShipGoods { shape: rect, label: "Ship Goods" }
  }

  edge PlaceOrder -> ProcessOrder { style: dashed }
  edge ShipGoods -> ReceiveGoods { style: dashed }
```

**Visual Result:**

- Two horizontal swim lanes labeled "Customer" and "Warehouse"
- Dashed message flows between containers

### Use Case 3: Nested Containers (3 levels)

```runiq
diagram architecture "Microservices"

  container "AWS Cloud" {
    container "VPC - Production" {
      container "Service Mesh" {
        node ServiceA { shape: rect }
        node ServiceB { shape: rect }
      }
      node Database { shape: cyl }
    }
    node LoadBalancer { shape: rect }
  }

  node User { shape: actor }
  edge User -> LoadBalancer
```

**Visual Result:**

- Three nested rectangles with labels
- Nodes properly contained within boundaries
- Clear visual hierarchy

---

## Proposed Syntax

### Option A: Block Syntax (RECOMMENDED)

```runiq
container "Label" {
  node A { shape: rect }
  node B { shape: rect }
  edge A -> B
}
```

**Pros:**

- Clear, readable
- Familiar to developers (like CSS, JSON)
- Natural nesting support

**Cons:**

- Slightly more verbose

### Option B: Indentation (Alternative)

```runiq
container SystemBoundary
  node A { shape: rect }
  node B { shape: rect }
  edge A -> B
```

**Pros:**

- Minimal syntax
- Python-like

**Cons:**

- Indentation-sensitive (harder to parse)
- Less explicit

### Option C: Grouping with Properties

```runiq
node A { shape: rect, container: "SystemBoundary" }
node B { shape: rect, container: "SystemBoundary" }
```

**Pros:**

- No new syntax

**Cons:**

- Doesn't support nested containers well
- Harder to visualize hierarchy

**DECISION: Use Option A (Block Syntax)** ✅

---

## AST Structure

### Extended Types

```typescript
// In @runiq/core/src/types.ts

export interface ContainerDeclaration {
  type: 'container';
  id: string;
  label?: string;
  style?: string;
  containerStyle?: ContainerStyle;
  children: DiagramElement[]; // Can include nodes, edges, and nested containers
}

export interface ContainerStyle {
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
  opacity?: number;
  padding?: number;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export type DiagramElement =
  | NodeDeclaration
  | EdgeDeclaration
  | ContainerDeclaration;

export interface DiagramAst {
  astVersion: string;
  type?: string;
  title?: string;
  direction?: Direction;
  nodes: NodeDeclaration[];
  edges: EdgeDeclaration[];
  containers: ContainerDeclaration[]; // NEW
  styles?: Record<string, StyleDeclaration>;
}
```

### Example AST Output

For:

```runiq
container "System" {
  node A { shape: rect }
  node B { shape: rect }
}
```

Produces:

```json
{
  "astVersion": "1.0",
  "nodes": [
    { "id": "A", "shape": "rect", "container": "System" },
    { "id": "B", "shape": "rect", "container": "System" }
  ],
  "edges": [],
  "containers": [
    {
      "type": "container",
      "id": "System",
      "label": "System",
      "children": ["A", "B"]
    }
  ]
}
```

---

## ELK Integration

### ELK Compound Graph Support

ELK natively supports hierarchical graphs via the `children` property:

```javascript
{
  id: 'root',
  children: [
    {
      id: 'container1',
      children: [
        { id: 'node1', width: 100, height: 60 },
        { id: 'node2', width: 100, height: 60 }
      ],
      // Container layout options
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.padding': '[top=30,left=10,bottom=10,right=10]'
      }
    }
  ],
  edges: [
    { id: 'e1', sources: ['node1'], targets: ['node2'] }
  ]
}
```

### Layout Strategy

1. **Top-Level Layout** - Position containers relative to each other
2. **Container-Level Layout** - Position nodes within each container
3. **Cross-Boundary Edges** - Route edges that cross container boundaries

**ELK Options:**

```javascript
{
  'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
  'elk.padding': '[top=30,left=10,bottom=10,right=10]',
  'elk.spacing.nodeNode': '50',
  'org.eclipse.elk.compoundNode': 'true'
}
```

---

## Implementation Plan

### Phase 1: Core Types & AST (Week 1)

**Tasks:**

- [ ] Add `ContainerDeclaration` type to `@runiq/core`
- [ ] Update `DiagramAst` to include `containers` array
- [ ] Add `ContainerStyle` type
- [ ] Add container validation (no circular references)
- [ ] Write 20+ tests for container types

**Files to Modify:**

- `packages/core/src/types.ts`
- `packages/core/src/__tests__/types.test.ts`

### Phase 2: Parser Support (Week 1-2)

**Tasks:**

- [ ] Extend Langium grammar with `container` keyword
- [ ] Add block syntax parsing `{ ... }`
- [ ] Support nested containers
- [ ] Parse container styles
- [ ] Write 30+ parser tests

**Files to Modify:**

- `packages/parser-dsl/src/language/runiq.langium`
- `packages/parser-dsl/src/__tests__/containers.test.ts`

**Grammar Addition:**

```langium
Container:
  'container' name=STRING '{'
    elements+=DiagramElement*
  '}'
  (style=StyleBlock)?;

DiagramElement:
  Node | Edge | Container;
```

### Phase 3: ELK Layout (Week 2-3)

**Tasks:**

- [ ] Update `elk-adapter.ts` to handle containers
- [ ] Convert containers to ELK compound nodes
- [ ] Implement nested layout
- [ ] Handle cross-boundary edges
- [ ] Calculate container sizes
- [ ] Write 25+ layout tests

**Files to Modify:**

- `packages/layout-base/src/elk-adapter.ts`
- `packages/layout-base/src/__tests__/elk-containers.test.ts`

**Key Algorithm:**

```typescript
function convertToElkGraph(diagram: DiagramAst): ElkNode {
  // Recursive function to build hierarchy
  function buildElkNode(container: ContainerDeclaration): ElkNode {
    return {
      id: container.id,
      children: [
        ...container.children.filter(isNode).map(toElkNode),
        ...container.children.filter(isContainer).map(buildElkNode),
      ],
      layoutOptions: {
        'elk.padding': '[top=30,left=10,bottom=10,right=10]',
      },
    };
  }
}
```

### Phase 4: SVG Rendering (Week 3-4)

**Tasks:**

- [ ] Render container backgrounds
- [ ] Render container borders
- [ ] Render container labels
- [ ] Handle z-index (containers behind nodes)
- [ ] Support container styles
- [ ] Write 20+ rendering tests

**Files to Modify:**

- `packages/renderer-svg/src/renderer.ts`
- `packages/renderer-svg/src/__tests__/container-rendering.test.ts`

**Rendering Order:**

1. Container backgrounds (z-index: 0)
2. Container borders (z-index: 1)
3. Nodes (z-index: 2)
4. Edges (z-index: 3)
5. Container labels (z-index: 4)

**SVG Structure:**

```xml
<g class="container" data-container-id="System">
  <rect class="container-background" ... />
  <rect class="container-border" ... />
  <text class="container-label" ...>System</text>

  <!-- Nodes inside container -->
  <g class="node" data-node-id="A">...</g>
  <g class="node" data-node-id="B">...</g>
</g>
```

### Phase 5: Integration & Testing (Week 4)

**Tasks:**

- [ ] Update CLI to support containers
- [ ] Update editor to support containers
- [ ] Create example diagrams
- [ ] Documentation
- [ ] End-to-end tests

---

## Container Styles

### Default Style

```typescript
const DEFAULT_CONTAINER_STYLE: ContainerStyle = {
  borderStyle: 'dashed',
  borderColor: '#666666',
  borderWidth: 2,
  backgroundColor: 'transparent',
  opacity: 1.0,
  padding: 20,
  labelPosition: 'top',
};
```

### Style Examples

```runiq
// Dashed border (default)
container "System Boundary" {
  node A { shape: rect }
}

// Solid border with background
container "Secure Zone" {
  style: {
    borderStyle: solid,
    borderColor: red,
    backgroundColor: "#fff0f0",
    opacity: 0.2
  }
  node B { shape: rect }
}

// Named style
style secureZone {
  containerStyle: {
    borderColor: red,
    borderWidth: 3
  }
}

container "DMZ" {
  style: secureZone
  node C { shape: rect }
}
```

---

## Edge Routing Across Containers

### Challenge

Edges that cross container boundaries need special handling:

```runiq
container "System A" {
  node N1 { shape: rect }
}

container "System B" {
  node N2 { shape: rect }
}

edge N1 -> N2  // Crosses boundary
```

### Solution

ELK automatically handles this with proper configuration:

```javascript
{
  'elk.edge.routing': 'ORTHOGONAL',  // or 'POLYLINE', 'SPLINES'
  'elk.hierarchyHandling': 'INCLUDE_CHILDREN'
}
```

**Rendering Strategy:**

- Edges rendered **after** all containers
- Edges clip at container boundaries
- Optional: Show edge entry/exit points

---

## Validation Rules

### Container Validation

1. **No Circular References**

   ```
   container "A" {
     container "B" {
       container "A" { }  // ERROR: Circular reference
     }
   }
   ```

2. **No Duplicate IDs**

   ```
   container "System" { }
   container "System" { }  // ERROR: Duplicate ID
   ```

3. **No Empty Containers** (Warning)

   ```
   container "Empty" { }  // WARNING: Empty container
   ```

4. **Nodes Must Exist**
   ```
   container "System" {
     node Missing { }  // Must be defined
   }
   ```

---

## Performance Considerations

### ELK Performance with Hierarchy

- **Small diagrams** (< 50 nodes): No impact
- **Medium diagrams** (50-200 nodes): 10-20% slower
- **Large diagrams** (200+ nodes): 20-30% slower

**Optimization:**

- Cache container bounds
- Incremental layout updates
- Lazy rendering for collapsed containers (future)

---

## Examples

### C4 System Context

```runiq
diagram c4-context "Banking System"

  container "Internet Banking System" {
    node WebApp { shape: rect, label: "Web Application\n[React]" }
    node API { shape: rect, label: "API Application\n[Node.js]" }
    node Database { shape: cyl, label: "Database\n[PostgreSQL]" }
  }

  node Customer { shape: actor, label: "Personal Banking Customer" }
  node EmailSystem { shape: rect, label: "Email System\n[SendGrid]" }
  node MainframeBankingSystem { shape: rect, label: "Mainframe Banking System" }

  edge Customer -> WebApp { label: "Uses" }
  edge WebApp -> API { label: "Makes API calls to" }
  edge API -> Database { label: "Reads/Writes" }
  edge API -> EmailSystem { label: "Sends email using" }
  edge API -> MainframeBankingSystem { label: "Gets account info from" }
```

### BPMN Process

```runiq
diagram bpmn "Order Fulfillment"
  layout: horizontal

  container "Customer" {
    node Start { shape: fill-circ }
    node PlaceOrder { shape: rounded }
    node ReceiveGoods { shape: rounded }
    node End { shape: d-circ }
  }

  container "Sales" {
    node ReceiveOrder { shape: rounded }
    node CheckInventory { shape: rhombus }
    node SendInvoice { shape: rounded }
  }

  container "Warehouse" {
    node PickItems { shape: rounded }
    node PackItems { shape: rounded }
    node ShipGoods { shape: rounded }
  }

  edge Start -> PlaceOrder
  edge PlaceOrder -> ReceiveOrder { style: dashed }
  edge ReceiveOrder -> CheckInventory
  // ... more edges
```

### Architecture Diagram

```runiq
diagram architecture "3-Tier Web App"
  layout: vertical

  container "Presentation Layer" {
    node WebServer { shape: rect, label: "Nginx" }
    node StaticFiles { shape: doc, label: "HTML/CSS/JS" }
  }

  container "Application Layer" {
    node AppServer1 { shape: rect, label: "Node.js 1" }
    node AppServer2 { shape: rect, label: "Node.js 2" }
    node LoadBalancer { shape: rect, label: "HAProxy" }
  }

  container "Data Layer" {
    node PrimaryDB { shape: cyl, label: "PostgreSQL Primary" }
    node ReplicaDB { shape: cyl, label: "PostgreSQL Replica" }
    node Cache { shape: cyl, label: "Redis" }
  }
```

---

## Open Questions

1. **Container IDs:** Auto-generate from label or require explicit ID?
   - **Decision:** Auto-generate from label, allow override

2. **Container Collapse/Expand:** Support in future?
   - **Decision:** Phase 2 feature

3. **Maximum Nesting Level:** Limit to 5 levels?
   - **Decision:** No hard limit, but warn at 5+

4. **Container Minimum Size:** Should containers expand to fit?
   - **Decision:** Yes, auto-size based on children

5. **Edge Clipping:** Clip edges at container boundaries?
   - **Decision:** No clipping, show full edge routing

---

## Testing Strategy

### Unit Tests (75+ tests)

**Core Types (20 tests):**

- Container creation
- Nested containers
- Container validation
- Style application

**Parser (30 tests):**

- Block syntax parsing
- Nested container parsing
- Container styles
- Error cases

**Layout (25 tests):**

- Single container layout
- Nested container layout
- Cross-boundary edges
- Container sizing

**Rendering (20 tests):**

- Container backgrounds
- Container borders
- Container labels
- Z-index ordering

### Integration Tests (10 tests)

- End-to-end: Parse → Layout → Render
- C4 diagram example
- BPMN diagram example
- Nested 3-level hierarchy

---

## Documentation

### User Guide Sections

1. **Container Basics** - Syntax and usage
2. **Container Styles** - Customization options
3. **Nested Containers** - Hierarchy examples
4. **C4 Diagrams** - Architectural patterns
5. **BPMN Diagrams** - Process modeling
6. **Best Practices** - When to use containers

---

## Success Criteria

✅ Containers can be defined in DSL  
✅ Nested containers (3+ levels) work  
✅ ELK layouts containers correctly  
✅ SVG renders containers with proper z-index  
✅ Cross-boundary edges route correctly  
✅ All 75+ tests passing  
✅ Documentation complete  
✅ C4 example diagram works  
✅ BPMN example diagram works

---

**Next Step:** Implement Phase 1 (Core Types & AST) using TDD approach! 🚀

**Estimated Timeline:** 4 weeks for full implementation
