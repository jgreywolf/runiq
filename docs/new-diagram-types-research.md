# Research: New Diagram Type Support

**Date:** October 17, 2025  
**Status:** Feasibility analysis for 5 new diagram types

---

## Overview

This document analyzes the requirements, complexity, and implementation effort for supporting:

1. **Quantum Circuit Diagrams** - Quantum computing circuits
2. **Pedigree Charts** - Genealogy/family tree diagrams
3. **UML Timing Diagrams** - Signal timing with constraints
4. **Network Topology** - Computer network diagrams
5. **PowerPoint SmartArt** - Microsoft's structured graphics

---

## 1. Quantum Circuit Diagrams 🟡

### What It Is
Visual representation of quantum algorithms showing:
- Quantum bits (qubits) as horizontal lines
- Quantum gates applied to qubits
- Measurement operations
- Classical control flow

### Example Structure
```
|0⟩ ─── H ─── • ─── M
                │
|0⟩ ─────── X ─── M
```

### Current Runiq Capabilities

**✅ Already Have:**
- Horizontal layout (ELK algorithm with LR direction)
- Line rendering (edges between nodes)
- Custom shape support (could create gate shapes)
- Labels and annotations
- Multi-layer structure (parallel qubits)

**❌ Missing:**
- Quantum-specific gate symbols (H, X, Y, Z, CNOT, etc.)
- Wire-based layout (qubits as persistent horizontal lines, not edges)
- Gate-on-wire rendering paradigm
- Measurement symbol (meter icon)
- Classical wire notation (double lines)
- Controlled gate markers (dots and circles)

### Implementation Effort

**Complexity:** 🟡 MEDIUM (3-5 days)

**Phase 1: Core Gates (2 days)**
- [ ] Create quantum gate shapes:
  - Single-qubit gates: H (Hadamard), X, Y, Z, S, T
  - Measurement box (meter icon)
  - Control dot (filled circle)
  - Target symbol (⊕ for CNOT)
- [ ] Add quantum circuit diagram type to validation
- [ ] 15-20 tests for gate rendering

**Phase 2: Multi-Qubit Gates (1 day)**
- [ ] CNOT, SWAP, Toffoli gate rendering
- [ ] Vertical connection lines for controlled gates
- [ ] 10 tests for multi-qubit operations

**Phase 3: Layout Algorithm (1-2 days)**
- [ ] Custom "quantum wire" layout
  - Qubits as horizontal swimlanes
  - Gates positioned on time steps
  - Automatic vertical alignment
- [ ] 10-15 tests for layout

**Total Tests Needed:** ~35-45 tests

### Technical Approach

```typescript
// New shapes needed
export const hGateShape: ShapeDefinition = {
  id: 'h-gate',
  bounds: () => ({ width: 40, height: 40 }),
  render: (ctx, pos) => `
    <rect x="${pos.x}" y="${pos.y}" width="40" height="40" 
          fill="#fff" stroke="#000" stroke-width="2"/>
    <text x="${pos.x + 20}" y="${pos.y + 25}" 
          text-anchor="middle" font-size="18" font-weight="bold">H</text>
  `
};

// Special layout mode
const layoutOptions = {
  algorithm: 'quantum-wire', // Custom algorithm
  qubitCount: 3,
  timeSteps: 5
};
```

**Pros:**
- Growing field (quantum computing education)
- Clear visual standard (Qiskit, Cirq formats)
- Educational value for quantum courses
- Unique offering (few text-based quantum circuit tools)

**Cons:**
- Niche audience (quantum computing researchers/students)
- Need to learn quantum gate conventions
- Different paradigm than node-edge diagrams

**Recommendation:** 🟢 **GOOD FIT** - Moderate effort, unique offering, clear use case

---

## 2. Pedigree Charts 🟢

### What It Is
Family tree diagrams showing:
- Individuals (male/female/unknown)
- Marriages/partnerships
- Parent-child relationships
- Genetic traits or diseases
- Multiple generations

### Example Structure
```
    ┌─────┐     ┌─────┐
    │ ♂️   │─────│ ♀️   │
    └──┬──┘     └──┬──┘
       │     ────  │
       ├──────────┼──────┐
    ┌──┴──┐   ┌──┴──┐  ┌──┴──┐
    │ ♂️   │   │ ♀️   │  │ ♂️   │
    └─────┘   └─────┘  └─────┘
```

### Current Runiq Capabilities

**✅ Already Have:**
- Tree layout (ELK tree algorithm)
- Hierarchical structure (parent-child via containers)
- Node shapes (rectangles, circles for individuals)
- Edge routing (parent-child connections)
- Labels (names, dates, traits)
- Multiple children from same parents

**❌ Missing:**
- Gender-specific shapes (square=male, circle=female convention)
- Marriage/partnership connectors (horizontal lines between spouses)
- Sibling grouping (multiple children on same level)
- Genetic notation (affected/carrier/normal shading patterns)
- Deceased indicator (diagonal line through shape)
- Twins/multiples markers

### Implementation Effort

**Complexity:** 🟢 EASY (1-2 days)

**Phase 1: Pedigree Shapes (4 hours)**
- [ ] Male shape (square)
- [ ] Female shape (circle)
- [ ] Unknown sex shape (diamond)
- [ ] Affected/carrier/normal styles (fill patterns)
- [ ] Deceased marker (overlay)
- [ ] 10 tests for shapes

**Phase 2: Relationship Notation (4 hours)**
- [ ] Marriage edge type (horizontal connector)
- [ ] Sibling grouping syntax
- [ ] Parent-child vertical lines
- [ ] 8 tests for relationships

**Phase 3: Pedigree DSL (2-4 hours)**
- [ ] Extend parser for pedigree-specific syntax:
  ```runiq
  diagram pedigree "Smith Family"
    person John sex:male affected:true
    person Mary sex:female carrier:true
    marriage John-Mary
    child Alice parents:(John,Mary) sex:female
  ```
- [ ] 10 tests for DSL parsing

**Total Tests Needed:** ~28 tests

### Technical Approach

```typescript
// Leverage existing tree layout
const layoutOptions = {
  algorithm: 'mrtree', // ELK's tree algorithm
  direction: 'DOWN',
  spacing: 60
};

// New pedigree-specific shapes
export const maleShape: ShapeDefinition = {
  id: 'pedigree-male',
  bounds: () => ({ width: 40, height: 40 }),
  render: (ctx, pos) => {
    const fill = ctx.style?.affected ? '#000' : 
                 ctx.style?.carrier ? 'url(#half-fill)' : '#fff';
    return `<rect x="${pos.x}" y="${pos.y}" width="40" height="40"
                  fill="${fill}" stroke="#000" stroke-width="2"/>`;
  }
};
```

**Pros:**
- Very similar to existing tree layout
- Clear conventions (medical genetics standards)
- Wide audience (genealogy, genetics, medicine)
- Simple shapes and relationships
- Could use existing container system for generations

**Cons:**
- Need to support horizontal marriage connectors (different from tree edges)
- Sibling ordering can be complex

**Recommendation:** 🟢 **EXCELLENT FIT** - Low effort, high value, uses existing infrastructure

---

## 3. UML Timing Diagrams 🟡

### What It Is
Shows how object states change over time:
- Horizontal time axis
- Lifelines (objects) with state changes
- State transitions as waveforms
- Time constraints and durations
- Events and messages

### Example Structure
```
Object A:  ──────┐      ┌────────
           state1 └──────┘ state2
                  ^      ^
                  |      | event
Time:      0    2s     5s     10s
```

### Current Runiq Capabilities

**✅ Already Have:**
- Horizontal layout (ELK LR direction)
- Sequence diagram foundation (lifelines, messages)
- Time-based positioning (manual x-coordinates)
- State representation (rectangles)
- Edge labels (events, messages)
- Actor shapes for lifelines

**❌ Missing:**
- Waveform rendering (digital signal visualization)
- Time axis with tick marks and scale
- State duration bars (rectangle spans)
- Vertical swimlanes per object
- Time constraints notation (durations, intervals)
- Compact vs. robust notation styles

### Implementation Effort

**Complexity:** 🟡 MEDIUM-HIGH (4-6 days)

**Phase 1: Time Axis & Grid (1 day)**
- [ ] Time axis shape (horizontal ruler with ticks)
- [ ] Grid overlay option
- [ ] Time scale support (ms, s, min)
- [ ] 8 tests

**Phase 2: State Waveforms (2 days)**
- [ ] State duration shape (horizontal bar with label)
- [ ] Waveform transition rendering (vertical edges)
- [ ] Multi-state lifelines (stacked swimlanes)
- [ ] 15 tests

**Phase 3: Timing Layout Algorithm (1-2 days)**
- [ ] Custom "timing" layout:
  - Objects as vertical lanes
  - States positioned by time
  - Automatic alignment
- [ ] Support for manual time positions
- [ ] 12 tests

**Phase 4: Time Constraints (1 day)**
- [ ] Duration annotations
- [ ] Time constraint syntax: `{t=5s..10s}`
- [ ] Occurrence specifications
- [ ] 10 tests

**Total Tests Needed:** ~45 tests

### Technical Approach

```typescript
// Timing-specific DSL
diagram timing "Protocol Handshake"
  timeline 0-10s grid:1s
  
  lifeline Client {
    state idle 0-2s
    state connecting 2-3s
    state connected 3-10s
  }
  
  lifeline Server {
    state listening 0-2.5s
    state processing 2.5-3s
    state active 3-10s
  }
  
  event "SYN" at:2s from:Client to:Server
  event "ACK" at:2.5s from:Server to:Client
  
  constraint "Response time" duration:0.5s

// Custom layout for timing diagrams
const timingLayout = {
  algorithm: 'timing',
  timeScale: 1000, // 1s = 1000px
  laneHeight: 80,
  showGrid: true
};
```

**Pros:**
- UML standard (well-documented)
- Useful for embedded systems, protocols, real-time systems
- Combines state + sequence concepts
- Educational value (UML completeness)

**Cons:**
- Complex layout (time-based positioning)
- Need waveform rendering (new paradigm)
- Less common than sequence/state diagrams
- Requires time scale understanding

**Recommendation:** 🟡 **MODERATE FIT** - Medium effort, specialized audience, fills UML gap

---

## 4. Network Topology Diagrams 🟢

### What It Is
Computer network diagrams showing:
- Devices (routers, switches, servers, computers, firewalls)
- Connections (Ethernet, fiber, wireless)
- Network segments (subnets, VLANs)
- IP addresses and hostnames
- Cloud/internet connections

### Example Structure
```
    [Internet Cloud]
           |
      [Firewall]
           |
      [Router] ─── [Switch] ─── [Server]
                      |  |  |
                     PC PC PC
```

### Current Runiq Capabilities

**✅ Already Have:**
- Network device shapes (cloud, hexagon for routers)
- Hierarchical structure (subnets as containers)
- Edge labels (connection types, bandwidth)
- Icon support (Font Awesome has network icons)
- Multiple layout algorithms (force for mesh networks)
- Grouping (containers for subnets)

**❌ Missing:**
- Network-specific device shapes:
  - Router icon (distinct from hex)
  - Switch/hub shapes
  - Firewall shape
  - Access point (wireless)
  - Server rack visualization
- Connection line styles (Ethernet, fiber, wireless)
- IP address notation (in labels)
- Port numbering

### Implementation Effort

**Complexity:** 🟢 EASY (1-2 days)

**Phase 1: Network Device Shapes (4 hours)**
- [ ] Router shape (with antenna icon)
- [ ] Switch shape (rectangular with ports)
- [ ] Firewall shape (brick wall pattern)
- [ ] Access point shape (wireless icon)
- [ ] Server rack shape (stacked rectangles)
- [ ] 12 tests

**Phase 2: Connection Types (2 hours)**
- [ ] Ethernet line (solid)
- [ ] Fiber line (double line)
- [ ] Wireless line (wavy/dashed)
- [ ] Use existing lineStyle feature!
- [ ] 6 tests

**Phase 3: Network DSL Syntax (2-4 hours)**
- [ ] Extend parser for network-specific syntax:
  ```runiq
  diagram network "Office Network"
    device router1 type:router label:"Main Router\n192.168.1.1"
    device switch1 type:switch label:"Core Switch"
    subnet DMZ {
      device web type:server label:"Web Server"
    }
    connect router1 -> switch1 type:gigabit-ethernet
    connect switch1 -> web type:fiber port:"24"
  ```
- [ ] 10 tests

**Total Tests Needed:** ~28 tests

### Technical Approach

```typescript
// Reuse cloud, add network shapes
export const routerShape: ShapeDefinition = {
  id: 'router',
  bounds: () => ({ width: 60, height: 50 }),
  render: (ctx, pos) => `
    <rect x="${pos.x}" y="${pos.y}" width="60" height="40" 
          fill="#e8f4f8" stroke="#2196F3" stroke-width="2" rx="5"/>
    <path d="M${pos.x+10},${pos.y+40} l10,-5 l10,5" 
          fill="none" stroke="#2196F3" stroke-width="2"/>
    <text...>${ctx.label}</text>
  `
};

// Use existing container system for subnets
container "DMZ" {
  style {
    backgroundColor: "#ffe8e8"
    borderColor: "#f44336"
    borderStyle: "dashed"
  }
  devices...
}

// Leverage ELK force layout for mesh networks
const layoutOptions = {
  algorithm: 'force', // For complex network topologies
  direction: 'DOWN'   // Or 'layered' for hierarchical
};
```

**Pros:**
- High demand (IT, DevOps, networking courses)
- We already have cloud shape and icons
- Can reuse container system for subnets/VLANs
- Force layout works well for mesh networks
- Icon library (Font Awesome) has network icons

**Cons:**
- Need many device shape variants
- Network diagrams can be very large

**Recommendation:** 🟢 **EXCELLENT FIT** - Low effort, high demand, leverages existing features

---

## 5. PowerPoint SmartArt 🔴

### What It Is
Microsoft's structured graphics for:
- Lists (bullet, vertical, horizontal)
- Processes (step-by-step flows)
- Cycles (continuous processes)
- Hierarchies (org charts, trees)
- Relationships (Venn, matrix, pyramid)
- Matrices (2x2, 3x3 grids)
- Pyramids (layered triangles)

### Current Runiq Capabilities

**✅ Already Have:**
- List layouts (vertical stacking)
- Process flows (flowcharts with arrows)
- Hierarchies (tree layout, containers)
- Venn diagrams (overlapping circles in examples/venn-diagrams/)
- Pyramid shapes (pyramid.ts)
- Matrix layouts (can simulate with grid positioning)

**❌ Missing:**
- SmartArt is a **collection of 200+ templates**, not a single diagram type
- Automatic text-to-visual conversion (SmartArt's key feature)
- Dynamic resizing based on content
- Built-in color themes
- Automatic shape arrangement
- Text wrapping and fitting

### Implementation Effort

**Complexity:** 🔴 VERY HIGH (3-6 weeks) - NOT RECOMMENDED

**Why This Is Hard:**
SmartArt is not a diagram type - it's a **productivity feature** that:
1. Takes structured text (bullets, lists)
2. Applies pre-designed templates (200+ layouts)
3. Automatically sizes/positions elements
4. Handles text overflow intelligently
5. Provides theme variations

**What We'd Need to Build:**
- [ ] 200+ layout templates (massive effort)
- [ ] Text-to-diagram AI/rules engine
- [ ] Automatic shape sizing based on text length
- [ ] Theme system (colors, fonts, effects)
- [ ] Dynamic layout adjustments
- [ ] Bullet list parser
- [ ] Estimated: 500+ tests

**Problems:**
1. **Scope Creep**: SmartArt is an entire product category
2. **Unclear Target**: Users want "SmartArt" for convenience, not specific diagram types
3. **Reinventing Wheel**: Microsoft has 20+ years of SmartArt development
4. **Patent Issues**: SmartArt layouts may be patented/copyrighted

### Alternative Approach

Instead of "SmartArt", support the **underlying diagram types**:

| SmartArt Category | Runiq Equivalent | Status |
|-------------------|------------------|--------|
| List | Vertical flowchart | ✅ Already supported |
| Process | Flowchart with arrows | ✅ Already supported |
| Cycle | Circular layout | 🟡 Partial (use radial) |
| Hierarchy | Tree layout, org chart | ✅ Already supported |
| Relationship | Venn, matrix | 🟡 Partial (examples exist) |
| Matrix | Grid layout | 🟡 Can simulate |
| Pyramid | Pyramid shape | ✅ Already have shape |

**Technical Approach:**

Rather than "PowerPoint SmartArt support", we could:
1. **Create preset templates** for common patterns
2. **Improve our matrix layout** (2x2, 3x3 grids)
3. **Add circular/cycle layout** algorithm
4. **Create a template library** (`examples/templates/`)

```runiq
// Instead of SmartArt, provide templates
diagram process "Project Phases" template:horizontal-process
  step "Research"
  step "Design"  
  step "Develop"
  step "Test"
  step "Deploy"

// Or use our existing syntax
diagram flowchart "Project Phases" direction:LR
  shape s1 as @rounded label:"Research"
  shape s2 as @rounded label:"Design"
  // ... automatic arrow generation
```

**Estimated Effort for Alternative (Preset Templates):**
- 🟡 MEDIUM (2-3 days)
- [ ] Create 10-15 common templates
- [ ] Template system in parser
- [ ] Automatic arrow generation
- [ ] 20-25 tests

**Pros:**
- "SmartArt" is a recognized brand (users search for it)
- Could attract PowerPoint users looking for code alternative
- Templates lower barrier to entry

**Cons:**
- Impossible to fully replicate (200+ layouts)
- Users expect WYSIWYG convenience
- Would always be "inferior" to PowerPoint
- Not a clear diagram type definition

**Recommendation:** 🔴 **POOR FIT** - Unclear scope, massive effort, better to focus on specific diagram types

**Better Alternative:** 🟢 Focus on improving **specific diagram types** SmartArt covers:
- Matrix/Grid layouts (EASY, 1 day)
- Circular/Cycle layouts (EASY-MEDIUM, 1-2 days)
- Template library (MEDIUM, 2-3 days)

---

## Summary & Recommendations

| Diagram Type | Complexity | Effort | Tests | Value | Recommendation |
|--------------|------------|--------|-------|-------|----------------|
| **Quantum Circuits** | 🟡 Medium | 3-5 days | ~40 | Medium | 🟢 **YES** - Unique offering |
| **Pedigree Charts** | 🟢 Easy | 1-2 days | ~28 | High | 🟢 **YES** - Low effort, high value |
| **UML Timing** | 🟡 Medium-High | 4-6 days | ~45 | Medium | 🟡 Maybe - Fills UML gap |
| **Network Topology** | 🟢 Easy | 1-2 days | ~28 | High | 🟢 **YES** - High demand |
| **PowerPoint SmartArt** | 🔴 Very High | 3-6 weeks | 500+ | Low | 🔴 **NO** - Use templates instead |

### Recommended Priority Order

**Phase 1: Quick Wins (3-4 days total)** 🏆
1. **Pedigree Charts** (1-2 days) - Easy, uses tree layout
2. **Network Topology** (1-2 days) - Easy, high demand

**Phase 2: Moderate Effort (3-5 days)** 🎯
3. **Quantum Circuits** (3-5 days) - Unique, growing field

**Phase 3: Specialized (4-6 days)** 🔬
4. **UML Timing Diagrams** (4-6 days) - Completes UML suite

**Phase 4: Alternative to SmartArt (2-3 days)** 📊
5. **Template Library** (2-3 days) - Common patterns, not full SmartArt

### Total Estimated Effort
- **Phases 1-2:** ~8 days → All 4 recommended diagram types
- **With templates:** ~10 days → Complete package

---

## Next Steps

If you want to proceed, I recommend:

1. **Start with Pedigree Charts** (1-2 days)
   - Easiest to implement
   - Uses existing tree layout
   - Immediate value for genealogy/genetics

2. **Then Network Topology** (1-2 days)  
   - High demand from IT/DevOps
   - Leverages existing shapes and containers

3. **Then decide:** Quantum Circuits vs. UML Timing vs. Templates
   - Based on your target audience
   - Quantum → Education, research
   - Timing → UML completeness, embedded systems
   - Templates → General productivity, ease-of-use

Would you like me to start implementing any of these?
