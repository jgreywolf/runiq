# Runiq Diagram Type Support Matrix

**Date:** October 14, 2025  
**Status:** Current architecture analysis and roadmap

---

## Current Architecture Capabilities

Runiq's architecture consists of:

- **52 shapes** across 8 categories (flowchart, data I/O, process, storage, specialized, etc.)
- **ELK layout engine** (layered, force, stress, tree, radial algorithms)
- **DSL parser** (Langium-based, extensible)
- **SVG renderer** with styling support
- **Generic node-edge model** (supports any directed graph)

---

## Diagram Type Analysis

### ✅ **Fully Supported (5 types)**

These work today with existing shapes and syntax:

#### 1. **Flowchart** ✅

- **Status:** ✅ Fully supported
- **Shapes:** All 52 shapes available
- **Layout:** ELK layered algorithm
- **Syntax:** Native DSL

```runiq
diagram flowchart "My Process"
  node Start { shape: rounded }
  node Process { shape: rect }
  edge Start -> Process
```

#### 2. **Sequence Diagram** ✅

- **Status:** ✅ Supported via vertical flowchart
- **Shapes:** Actors, lifelines (rectangles)
- **Layout:** ELK layered (TB direction)
- **Syntax:** Use vertical flowchart with actor shapes

```runiq
diagram sequence "User Login"
  direction: TB
  node User { shape: actor }
  node Server { shape: rect }
  edge User -> Server { label: "login()" }
```

#### 3. **Class Diagram** ✅

- **Status:** ✅ Supported via structured boxes
- **Shapes:** Rectangles, divided rectangles
- **Layout:** ELK layered
- **Syntax:** Use rect/div-rect shapes

```runiq
diagram class "System Architecture"
  node Person { shape: div-rect, label: "Person\n---\nname\nage" }
  node Student { shape: div-rect }
  edge Person -> Student { label: "extends" }
```

#### 4. **State Diagram** ✅

- **Status:** ✅ Supported
- **Shapes:** Rounded rectangles, circles, rhombus
- **Layout:** ELK layered
- **Syntax:** Native

```runiq
diagram state "Order Processing"
  node Initial { shape: fill-circ }
  node Processing { shape: rounded }
  edge Initial -> Processing
```

#### 5. **Entity Relationship Diagram** ✅

- **Status:** ✅ Supported
- **Shapes:** Rectangles (entities), rhombus (relationships)
- **Layout:** ELK layered
- **Syntax:** Native

```runiq
diagram er "Database Schema"
  node User { shape: rect }
  node Order { shape: rect }
  node Places { shape: rhombus }
  edge User -> Places -> Order
```

---

### 🟡 **Partially Supported (9 types)**

These can work with current architecture but need enhancements:

#### 6. **User Journey** 🟡

- **Status:** 🟡 Partially supported (can use flowchart)
- **Missing:** Timeline/sequential layout, emotion indicators
- **TODO:**
  - [ ] Add timeline layout option
  - [ ] Add journey-specific shapes (faces, emotions)
  - [ ] Add phase/stage grouping

#### 7. **Gantt Chart** 🟡

- **Status:** 🟡 Partially supported (horizontal bars)
- **Missing:** Time axis, dependencies, date ranges
- **TODO:**
  - [ ] Add timeline/calendar layout
  - [ ] Add bar chart shapes
  - [ ] Add date/duration syntax
  - [ ] Add milestone markers

#### 8. **Pie Chart** 🟡

- **Status:** 🟡 Can render with custom shapes
- **Missing:** Pie slice shapes, percentage calculations
- **TODO:**
  - [ ] Add pie/donut slice shapes
  - [ ] Add data-driven rendering (values → angles)
  - [ ] Add legend support
  - [ ] Add percentage labels

#### 9. **Block Diagram** 🟡

- **Status:** 🟡 Supported via rectangles
- **Missing:** Grid layout, alignment helpers
- **TODO:**
  - [ ] Add grid layout algorithm
  - [ ] Add auto-alignment constraints
  - [ ] Add container/grouping syntax

#### 10. **Quadrant Chart** 🟡

- **Status:** 🟡 Can simulate with positioned nodes
- **Missing:** Axes, quadrant backgrounds
- **TODO:**
  - [ ] Add 2D scatter plot layout
  - [ ] Add axis shapes (X/Y with labels)
  - [ ] Add quadrant background zones
  - [ ] Add coordinate syntax (x, y positions)

#### 11. **Requirement Diagram** 🟡

- **Status:** 🟡 Supported via flowchart
- **Missing:** Requirement-specific shapes
- **TODO:**
  - [ ] Add requirement box shapes
  - [ ] Add traceability relationship types
  - [ ] Add requirement status indicators

#### 12. **GitGraph (Git) Diagram** 🟡

- **Status:** 🟡 Can use circles + edges
- **Missing:** Time-based layout, branch visualization
- **TODO:**
  - [ ] Add commit node shapes
  - [ ] Add branch/merge layout algorithm
  - [ ] Add timeline on X-axis
  - [ ] Add branch lane separation

#### 13. **Mindmaps** 🟡

- **Status:** 🟡 Can use tree layout
- **Missing:** Radial/organic layout, hierarchy
- **TODO:**
  - [ ] Add radial tree layout (ELK has this!)
  - [ ] Add organic/curved edges
  - [ ] Add hierarchy levels (root, branch, leaf)
  - [ ] Add auto-sizing based on content

#### 14. **Timeline** 🟡

- **Status:** 🟡 Can use horizontal flowchart
- **Missing:** Time scale, event markers
- **TODO:**
  - [ ] Add timeline layout with scale
  - [ ] Add event/milestone shapes
  - [ ] Add date/time syntax
  - [ ] Add era/period backgrounds

---

### 🔴 **Requires New Architecture (31 types)**

These need significant new features:

#### Advanced Hierarchical Diagrams (4)

##### 15. **C4 Diagram** 🔴

- **Status:** 🔴 Requires nested containers
- **Missing:** Context, container, component, code levels
- **TODO:**
  - [ ] Add hierarchical container support (subgraphs)
  - [ ] Add zoom levels (C4 layers)
  - [ ] Add container shapes (systems, containers)
  - [ ] Add boundary/zone rendering

##### 16. **Architecture Diagram with Tier Layers** 🔴

- **Status:** 🔴 Requires horizontal swim lanes
- **Missing:** Layer/tier containers, grouping
- **TODO:**
  - [ ] Add swim lane layout
  - [ ] Add tier/layer containers
  - [ ] Add zone labels
  - [ ] Add cross-layer connections

##### 17. **Deployment Diagram** 🔴

- **Status:** 🔴 Requires 3D cube shapes, containers
- **Missing:** Node boxes, artifact shapes
- **TODO:**
  - [ ] Add deployment node shapes (servers, devices)
  - [ ] Add artifact shapes
  - [ ] Add container nesting
  - [ ] Add physical topology layout

##### 18. **Hierarchy List** 🔴

- **Status:** 🔴 Requires tree layout with indentation
- **Missing:** Indented tree visualization
- **TODO:**
  - [ ] Add indented tree layout
  - [ ] Add expand/collapse indicators
  - [ ] Add hierarchy lines

---

#### Flow/Process Diagrams (3)

##### 19. **BPMN Support** 🔴

- **Status:** 🔴 Requires BPMN-specific shapes
- **Missing:** Pools, lanes, events, gateways
- **TODO:**
  - [ ] Add BPMN shape library (20+ shapes)
  - [ ] Add pool/lane containers
  - [ ] Add message flows
  - [ ] Add BPMN validation rules

##### 20. **Sequential Function Chart (SFC)** 🔴

- **Status:** 🔴 Requires vertical step layout
- **Missing:** Steps, transitions, parallel branches
- **TODO:**
  - [ ] Add SFC shape library
  - [ ] Add vertical step/transition layout
  - [ ] Add parallel branch support
  - [ ] Add IEC 61131-3 compliance

##### 21. **Ishikawa Diagram (Fishbone)** 🔴

- **Status:** 🔴 Requires radial branch layout
- **Missing:** Spine + branch structure
- **TODO:**
  - [ ] Add fishbone layout algorithm
  - [ ] Add cause-effect branch shapes
  - [ ] Add angled connectors

---

#### Data Visualization Charts (8)

##### 22. **Sankey Diagram** 🔴

- **Status:** 🔴 Requires flow-proportional edges
- **Missing:** Weighted flow visualization
- **TODO:**
  - [ ] Add Sankey layout algorithm
  - [ ] Add variable-width flow shapes
  - [ ] Add flow quantity syntax
  - [ ] Add color gradients for flows

##### 23. **XY Chart / Scatter Plot** 🔴

- **Status:** 🔴 Requires 2D coordinate system
- **Missing:** Axes, data points, scales
- **TODO:**
  - [ ] Add 2D chart layout
  - [ ] Add axis rendering (X/Y with ticks, labels)
  - [ ] Add data point shapes (dots, markers)
  - [ ] Add line/curve interpolation
  - [ ] Add legend support

##### 24. **Radar Chart** 🔴

- **Status:** 🔴 Requires radial axes
- **Missing:** Circular grid, multiple axes
- **TODO:**
  - [ ] Add radial chart layout
  - [ ] Add spider web grid
  - [ ] Add polygon overlay shapes
  - [ ] Add multi-series support

##### 25. **Treemap** 🔴

- **Status:** 🔴 Requires space-filling rectangles
- **Missing:** Hierarchical area allocation
- **TODO:**
  - [ ] Add treemap layout algorithm (ELK rectpacking!)
  - [ ] Add nested rectangle rendering
  - [ ] Add value-to-area mapping
  - [ ] Add color scales

##### 26. **Roadmap** 🔴

- **Status:** 🔴 Requires timeline + swim lanes
- **Missing:** Time-based swim lane layout
- **TODO:**
  - [ ] Add timeline swim lane layout
  - [ ] Add initiative/epic bars
  - [ ] Add milestone markers
  - [ ] Add dependency lines

##### 27. **Kanban Board** 🔴

- **Status:** 🔴 Requires column layout
- **Missing:** Columns, cards, WIP limits
- **TODO:**
  - [ ] Add column layout
  - [ ] Add card shapes
  - [ ] Add WIP limit indicators
  - [ ] Add drag-and-drop order

##### 28. **Circular Flow** 🔴

- **Status:** 🔴 Requires circular layout
- **Missing:** Circular node arrangement
- **TODO:**
  - [ ] Add circular layout algorithm (ELK has radial!)
  - [ ] Add curved edges
  - [ ] Add directional flow indicators

##### 29. **Packet Diagram** 🔴

- **Status:** 🔴 Requires bit-field layout
- **Missing:** Bit fields, header structure
- **TODO:**
  - [ ] Add packet header shapes
  - [ ] Add bit field grid layout
  - [ ] Add byte/bit labels
  - [ ] Add protocol layer stacking

---

#### Network/Graph Diagrams (3)

##### 30. **Graph Theory / Network Topology** 🔴

- **Status:** 🔴 Partially supported (can use force layout)
- **Missing:** Force-directed layout, graph metrics
- **TODO:**
  - [ ] Enable ELK force algorithm
  - [ ] Add graph theory node labels (degree, etc.)
  - [ ] Add edge weights
  - [ ] Add graph analysis overlays

##### 31. **Electrical Circuits** 🔴

- **Status:** 🔴 Requires electrical symbols
- **Missing:** Circuit component shapes, grid layout
- **TODO:**
  - [ ] Add electrical component shape library (20+ symbols)
  - [ ] Add orthogonal grid layout
  - [ ] Add wire routing
  - [ ] Add component labels (R, C, L values)

##### 32. **Wardley Map** 🔴

- **Status:** 🔴 Requires 2D evolution/value axes
- **Missing:** Value chain + evolution positioning
- **TODO:**
  - [ ] Add 2D scatter layout (value vs evolution)
  - [ ] Add chain connections (vertical)
  - [ ] Add evolution axis (genesis → commodity)
  - [ ] Add movement indicators

---

#### Analysis Diagrams (5)

##### 33. **Causal Loop Diagrams** 🔴

- **Status:** 🔴 Requires feedback loops
- **Missing:** Positive/negative feedback indicators
- **TODO:**
  - [ ] Add causal loop shapes
  - [ ] Add polarity indicators (+/-)
  - [ ] Add delay markers
  - [ ] Add circular reference detection

##### 34. **Critical Path Analysis** 🔴

- **Status:** 🔴 Requires PERT/CPM layout
- **Missing:** Duration calculations, critical path highlighting
- **TODO:**
  - [ ] Add activity-on-node/edge support
  - [ ] Add duration syntax
  - [ ] Add critical path calculation
  - [ ] Add float/slack display

##### 35. **PERT Chart** 🔴

- **Status:** 🔴 Requires probabilistic estimates
- **Missing:** Three-point estimates, probability
- **TODO:**
  - [ ] Add PERT node shapes (optimistic/likely/pessimistic)
  - [ ] Add probabilistic calculations
  - [ ] Add critical path analysis
  - [ ] Add variance display

##### 36. **Path Diagram (Statistical)** 🔴

- **Status:** 🔴 Requires structural equation modeling
- **Missing:** Latent/observed variables, coefficients
- **TODO:**
  - [ ] Add SEM node shapes (circles for latent, rectangles for observed)
  - [ ] Add coefficient labels on edges
  - [ ] Add error terms
  - [ ] Add covariance indicators

##### 37. **Threat Modeling** 🔴

- **Status:** 🔴 Requires security-specific shapes
- **Missing:** Trust boundaries, data flows, threats
- **TODO:**
  - [ ] Add STRIDE/DREAD shapes
  - [ ] Add trust boundary containers
  - [ ] Add threat indicators
  - [ ] Add mitigation annotations

---

#### Low Priority / Specialized (8)

##### 38. **Timing Diagram (UML)** 🔴 LOW PRIORITY

- **Status:** 🔴 Requires timeline + state changes
- **Missing:** Parallel timelines, state lifelines
- **TODO:**
  - [ ] Add timeline layout with parallel lanes
  - [ ] Add state change indicators
  - [ ] Add timing constraints

##### 39. **Event Modeling** 🔴 LOW PRIORITY

- **Status:** 🔴 Requires event storming layout
- **Missing:** Commands, events, views
- **TODO:**
  - [ ] Add event modeling shapes (sticky notes)
  - [ ] Add timeline layout
  - [ ] Add actor swim lanes

##### 40. **Railroad Diagrams (BNF/EBNF)** 🔴 LOW PRIORITY

- **Status:** 🔴 Requires syntax diagram layout
- **Missing:** Grammar flow visualization
- **TODO:**
  - [ ] Add railroad diagram shapes
  - [ ] Add choice/repetition indicators
  - [ ] Add syntax path routing

##### 41. **Universal Process Notation** 🔴 LOW PRIORITY

- **Status:** 🔴 Requires UPN-specific shapes
- **Missing:** UPN symbol library
- **TODO:**
  - [ ] Add UPN shape library
  - [ ] Add UPN layout rules
  - [ ] Add validation

##### 42. **Transit System Diagrams** 🔴 LOW PRIORITY

- **Status:** 🔴 Requires geographic/schematic layout
- **Missing:** Station nodes, line routing
- **TODO:**
  - [ ] Add transit line shapes
  - [ ] Add station markers
  - [ ] Add line color coding
  - [ ] Add geographic vs schematic modes

##### 43. **N x M Matrix** 🔴 LOW PRIORITY

- **Status:** 🔴 Requires grid layout
- **Missing:** Table/grid rendering
- **TODO:**
  - [ ] Add grid layout
  - [ ] Add cell shapes
  - [ ] Add row/column labels
  - [ ] Add value display in cells

##### 44. **Treemap** 🔴 (duplicate - see #25)

##### 45. **Graph Theory** 🔴 (duplicate - see #30)

---

## Summary Statistics

| Status                       | Count  | Percentage |
| ---------------------------- | ------ | ---------- |
| ✅ Fully Supported           | 5      | 11%        |
| 🟡 Partially Supported       | 9      | 20%        |
| 🔴 Requires New Architecture | 31     | 69%        |
| **TOTAL**                    | **45** | **100%**   |

---

## Implementation Priority

### Phase 1: Quick Wins (Partially Supported) 🟡

**Estimated:** 2-4 weeks

1. **User Journey** - Add timeline layout + emotion shapes
2. **Mindmaps** - Enable ELK radial layout (already available!)
3. **Timeline** - Add timeline layout mode
4. **Block Diagram** - Add grid layout
5. **GitGraph** - Add branch visualization
6. **Quadrant Chart** - Add 2D scatter layout
7. **Pie Chart** - Add pie slice shapes
8. **Gantt Chart** - Add timeline + bars
9. **Requirement Diagram** - Add traceability shapes

### Phase 2: High-Value New Features 🔴

**Estimated:** 2-3 months

10. **XY Chart** - Axes + data points (high demand)
11. **Sankey Diagram** - Flow visualization (unique)
12. **C4 Diagram** - Hierarchical containers (architectural)
13. **BPMN** - Business process (industry standard)
14. **Kanban Board** - Agile workflow (popular)

### Phase 3: Specialized Diagrams 🔴

**Estimated:** 3-6 months

15. **Network Topology** - Force-directed layout
16. **Wardley Map** - Strategic planning
17. **Critical Path Analysis** - Project management
18. **Electrical Circuits** - Engineering
19. **Deployment Diagram** - Infrastructure

### Phase 4: Low Priority 🔴

**Estimated:** As needed

20. Remaining specialized/niche diagram types

---

## Architecture Enhancements Needed

To support more diagram types, we need:

### 1. **Hierarchical Containers (Subgraphs)** 🔴 CRITICAL

- **Impact:** C4, BPMN, Architecture diagrams
- **Implementation:**
  - Add container/group syntax to DSL
  - Add nested layout support in ELK
  - Add container rendering in SVG
  - Add z-index/layering

**Example Syntax:**

```runiq
diagram c4 "System Context"
  container SystemBoundary {
    node API { shape: rect }
    node DB { shape: cyl }
  }
  node User { shape: actor }
  edge User -> API
```

### 2. **Alternative Layout Algorithms** 🔴 HIGH

- **Impact:** Mindmaps, network topology, circular flows
- **Implementation:**
  - Enable ELK force algorithm
  - Enable ELK radial algorithm
  - Enable ELK stress algorithm
  - Add layout selection in DSL

**Example Syntax:**

```runiq
diagram mindmap "Project Plan"
  layout: radial
  node Root { shape: rounded }
  node Branch1 { shape: rounded }
```

### 3. **Data-Driven Rendering** 🔴 HIGH

- **Impact:** Charts (pie, XY, Sankey, radar)
- **Implementation:**
  - Add data value syntax
  - Add value-to-visual mapping (size, position, color)
  - Add axis/scale rendering
  - Add legend support

**Example Syntax:**

```runiq
diagram pie "Sales by Region"
  type: pie
  data {
    North: 45
    South: 30
    East: 15
    West: 10
  }
```

### 4. **Swim Lanes / Zones** 🔴 MEDIUM

- **Impact:** BPMN, roadmaps, architecture tiers
- **Implementation:**
  - Add lane/zone containers
  - Add horizontal/vertical lane layout
  - Add lane labels
  - Add cross-lane edges

**Example Syntax:**

```runiq
diagram bpmn "Order Process"
  lane Customer {
    node PlaceOrder { shape: rect }
  }
  lane System {
    node ProcessOrder { shape: rect }
  }
```

### 5. **Time-Based Layouts** 🔴 MEDIUM

- **Impact:** Gantt, timeline, roadmap, GitGraph
- **Implementation:**
  - Add timeline layout algorithm
  - Add date/duration syntax
  - Add time scale rendering
  - Add milestone markers

**Example Syntax:**

```runiq
diagram gantt "Project Timeline"
  task Design { start: 2025-01-01, duration: 2w }
  task Build { start: 2025-01-15, duration: 4w }
```

### 6. **Custom Shape Libraries** 🔴 MEDIUM

- **Impact:** BPMN, electrical, UPN, transit
- **Implementation:**
  - Add shape plugin system
  - Add shape library packages
  - Add shape discovery/registration
  - Document shape creation API

---

## Recommendations

### Immediate Actions (This Quarter)

1. **Enable ELK Radial Layout** - Supports mindmaps immediately ✅
2. **Document Current Capabilities** - Show what works today ✅
3. **Implement Hierarchical Containers** - Unlocks 5+ diagram types
4. **Add Grid Layout** - Supports block diagrams, matrices

### Short-Term (Next Quarter)

5. **Implement XY Chart** - High demand, widely useful
6. **Add Pie Chart Shapes** - Common visualization need
7. **Implement Gantt/Timeline** - Project management use case
8. **Add Sankey Diagram** - Unique, high-value feature

### Medium-Term (6 months)

9. **BPMN Support** - Industry standard, high demand
10. **C4 Diagrams** - Software architecture standard
11. **Network Topology** - Force-directed layout
12. **Kanban Board** - Agile workflow visualization

---

## Documentation Needs

Create guides for:

1. ✅ **Supported Diagrams** - What works today (flowchart, state, class, ER, sequence)
2. 📝 **Workarounds** - How to simulate other diagram types with current shapes
3. 📝 **Roadmap** - When new diagram types will be available
4. 📝 **Custom Shapes** - How to extend Runiq with new shapes
5. 📝 **Layout Algorithms** - When to use layered vs force vs radial

---

## Next Steps

**Immediate TODO:**

- [ ] Enable ELK radial algorithm (1 day)
- [ ] Document supported diagram types (1 day)
- [ ] Create diagram type examples (2 days)
- [ ] Design hierarchical container syntax (1 week)
- [ ] Implement container support (2 weeks)
- [ ] Create XY chart prototype (1 week)

**Questions to Answer:**

1. Which 3 diagram types are highest priority for users?
2. Should we focus on breadth (many diagram types) or depth (perfect existing ones)?
3. What's the timeline for hierarchical containers?
4. Should we create a plugin system for custom diagram types?

---

**Document Version:** 1.0  
**Last Updated:** October 14, 2025  
**Status:** Roadmap defined, implementation pending
