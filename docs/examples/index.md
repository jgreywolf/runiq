# Examples Overview

Runiq diagrams span multiple domains. Browse by category:

## Visual Communication

Smart diagram layouts for presentations, reports, and visual storytelling.

### [Glyphset Diagrams](/examples/glyphsets)

- **List Layouts**: Vertical, horizontal, alternating, chevron, bending picture
- **Process Flows**: Linear, circular, alternating, stepped, continuous cycles
- **Hierarchies**: Pyramids, stacked lists, organizational charts, nested blocks
- **Comparisons**: Balance scales, opposing lists, pros/cons, comparison tables
- **Relationships**: Venn overlaps, converging/diverging flows, connected blocks
- **Matrices**: 2×2 grids, quadrants, segmented cycles, grouped lists
- **Visual Metaphors**: Funnels, targets, gears, puzzles, containers
- **Applications**: Presentations, reports, infographics, strategic planning

## Software Engineering

Build architecture diagrams, UML models, and process flows.

### [Flowcharts](/examples/flowcharts)

- Authentication flows with validation
- State machines and decision logic
- Algorithm visualization
- Multi-container architectures
- **Visual Examples**: Auth flow, ETL pipeline, bubble sort

### [Mindmap Diagrams](/examples/mindmap-diagrams)

- Radial layout for visual thinking
- Automatic shape assignment with `type:mindmap`
- Hierarchical project breakdown
- Learning roadmaps and knowledge mapping
- **Examples**: Simple mindmap, project planning, learning roadmap, business strategy

### [Data Flow Diagrams](/examples/dfd-diagrams)

- Gane-Sarson notation for system analysis
- Processes, data stores, external entities
- Requirements documentation and integration planning
- **Examples**: Order processing, library system, user registration, payment integration

### [State Machine Diagrams](/examples/state-machines)

- UML statecharts modeling object lifecycles
- Entry/exit actions and do-activities
- Event-driven transitions with guards
- Composite states and history states
- **Examples**: Traffic light, door lock, vending machine, media player
- Applications: UI states, device controllers, protocol implementations

### [Activity Diagrams](/examples/activity-diagrams)

- UML activity diagrams for workflow modeling
- Action pins and object nodes
- Swimlanes (horizontal and vertical)
- Signal events and time events
- Fork/join, decision/merge nodes
- **Examples**: Order processing, CI/CD pipeline, microservices communication
- Applications: Business processes, data pipelines, parallel workflows

### [BPMN Diagrams](/examples/bpmn-diagrams)

- Business Process Model and Notation (BPMN 2.0)
- Pools, lanes, and nested containers
- Event types (start, intermediate, end)
- Gateway types (exclusive, parallel, inclusive)
- Message flows between participants
- **Examples**: Order fulfillment, purchase order process, cross-functional workflows
- Applications: Business process automation, enterprise workflows

### [Sequence Diagrams](/examples/sequence-diagrams)

- UML interaction diagrams showing message exchanges
- Synchronous and asynchronous messaging
- Activation boxes and lifelines
- Return messages and self-calls
- Fragment operators (loop, alt, opt, par)
- Timing constraints and delays
- **Visual Examples**: Auth flow, API error handling, async messaging
- Applications: API design, protocol documentation, user stories

### [Class Diagrams](/examples/class-diagrams)

- UML class modeling with relationships
- Attributes, methods, and visibility modifiers
- Association, aggregation, and composition
- Inheritance and interface implementation
- Generic types and collections
- Design patterns (factory, strategy, observer)
- Applications: Object-oriented design, database schema, API modeling

### [Use Case Diagrams](/examples/use-case)

- UML actor interactions
- System boundaries
- `<<include>>` and `<<extend>>` stereotypes
- Banking, e-commerce examples
- 8 actor shape styles

### [C4 Architecture Diagrams](/examples/c4-architecture)

- C4 architecture model (context, container, component)
- Microservices topology
- Multi-tier applications (3-tier)
- System context and container views
- Component-level detail
- **Visual Examples**: E-commerce system, banking platform, microservices
- Applications: Architecture documentation, system design reviews

## Data Visualization

Create charts and visual analytics for presentations and reports.

### [Chart Diagrams](/examples/chart-diagrams)

- Bar charts (vertical, horizontal, grouped, stacked)
- Pie charts with labeled slices and percentages
- Line charts for time series and trends
- Radar/spider charts for multi-dimensional metrics
- Sankey diagrams for flow visualization
- Applications: Business reporting, data analysis, KPI tracking

### [Venn Diagrams](/examples/venn-diagrams)

- Set overlap analysis (2-circle and 3-circle)
- Automatic region calculations and intersection labels
- Market segmentation and skill assessment
- **Visual Examples**: Market overlap, developer skills, customer segments, feature adoption
- Applications: Set theory, competitive analysis, skill mapping

### [Pyramid Diagrams](/examples/pyramid-diagrams)

- Hierarchical stacked visualizations
- Proportional width scaling from data
- Organizational hierarchies and sales funnels
- **Visual Examples**: Maslow's hierarchy, org structure, sales funnel, learning levels
- Applications: Hierarchical data, process stages, organizational charts

## Control Systems

Design control loops and signal processing.

### [Control system Diagrams](/examples/control-diagrams)

- PID controllers with feedback
- Multi-stage transfer functions
- State-space representation
- Motor speed control, aircraft pitch
- Export to LaTeX/TikZ and Simulink MDL
- **Supports**: Summing junctions, gain blocks, integrators

## Electrical Engineering

Create professional IEEE-standard circuit diagrams.

### [Analog Circuits](/examples/electrical)

- RC/RL/RLC filters
- Op-amp amplifiers (inverting, non-inverting)
- Voltage dividers and regulators
- LED circuits, bridge rectifiers
- Full SPICE support (R, L, C, V, I, D, Q, M, OPAMP)
- **Visual Examples**: RC filter, voltage divider, op-amp
- Export to SPICE netlist for simulation

## Digital Design

Design logic circuits with Verilog HDL export.

### [Digital Circuits](/examples/digital)

- Combinational: Half/full adders, multiplexers, ALU
- Sequential: D/T/JK flip-flops, counters, shift registers
- All basic gates: AND, OR, NOT, NAND, NOR, XOR, XNOR
- Truth tables and timing diagrams
- 4-bit ALU and 8-bit shift register examples
- Export to Verilog for synthesis and simulation

## Quantum Computing

Visualize quantum circuits and algorithms.

### [Quantum Circuits](/examples/quantum-circuits)

- IBM Qiskit-style quantum circuit diagrams
- Single-qubit gates: Pauli (X, Y, Z), Hadamard, Phase (S, T)
- Multi-qubit operations: CNOT, SWAP, controlled gates
- Measurement and barriers
- Qubit register visualization
- Applications: Quantum algorithm design, education, research papers

## Fluid Power Systems

Design pneumatic and hydraulic circuits following ISO 1219-1 standards.

### [P&ID Diagrams](/examples/pid-diagrams)

- Piping & Instrumentation Diagrams (P&ID) following ISA-5.1
- Equipment: Tanks, pumps, compressors, heat exchangers, separators
- Instruments: Transmitters (pressure, temperature, level, flow)
- Control loops: PID control, cascade control, anti-surge
- Safety systems: PSVs, interlocks, emergency shutdown
- **Examples**: Tank-pump transfer, heat exchanger control, 3-phase separator, compressor package
- Applications: Oil & gas, chemical processing, power generation

### [Pneumatic Circuits](/examples/pneumatic-circuits)

- Cylinders: Single-acting (spring return), double-acting
- Valves: 3/2-way, 5/2-way, check valves
- Air preparation: FRL units (filter, regulator, lubricator)
- Flow control and speed regulation
- Pressure specification (bar, psi, kPa, MPa)
- Flow rate specification (L/min, CFM, m³/h)
- **Visual Examples**: FRL unit, cylinder control, sequential A+B+B-A-
- Applications: Factory automation, material handling, assembly

### [Hydraulic Circuits](/examples/hydraulic-circuits)

- Power generation: Fixed/variable pumps, reservoirs
- Actuators: Hydraulic motors and cylinders
- Valves: 4/3-way directional control, relief, reducing
- Flow control and load sensing
- Fluid specifications: Mineral, synthetic, biodegradable, fire-resistant
- Temperature ranges and viscosity grades (ISO VG)
- **Visual Examples**: Power unit, press system, motor control
- Applications: Heavy machinery, presses, mobile equipment

<!-- ## Medical & Genetics

Professional pedigree charts following medical standards.

### [Pedigree Charts](/examples/pedigree)

- Male (square), female (circle), unknown sex (diamond) symbols
- Affected (black fill), carrier (half-fill), normal (white) individuals
- Deceased notation (diagonal line)
- Marriage relationships (horizontal line, no arrow)
- Consanguineous marriages (double line)
- Three-generation families, autosomal inheritance patterns
- **Visual Examples**: Genetic trait inheritance, consanguinity -->

## Strategy & Planning

Strategic mapping tools for business analysis and decision-making.

### [Wardley Maps](/examples/wardley-maps)

- 2D strategic mapping: Evolution × Value Chain axes
- Component positioning: Genesis → Custom → Product → Commodity
- Value chain dependencies and flow visualization
- Evolution indicators showing strategic movements
- Inertia markers for organizational resistance
- Anchor points for user needs and outcomes
- **Visual Examples**: Tea shop, technology evolution, business strategy
- Export to SVG for presentations and documentation

## Timelines & Chronology

Visualize events and milestones over time.

### [Timeline Diagrams](/examples/timeline-diagrams)

- Chronological event visualization
- Project roadmaps and milestones
- Company history and growth phases
- Product release schedules
- Career progression tracking
- Horizontal or vertical orientation
- Period backgrounds with opacity
- Custom colors and icons
- **Visual Examples**: Software project, company history, product releases, career journey
- Applications: Project planning, historical narratives, version tracking

---

## Coming Soon

::: info Under Development

- **Network Topology** - Routers, switches, firewalls, cloud infrastructure
- **Timing Diagrams** - Digital waveforms and signal timing
- **Block Diagrams** - System-level architectural blocks
  :::

## Quick Navigation

<div class="example-grid">
  <a href="/examples/glyphsets" class="example-card">
    <h3>✨ Glyphsets</h3>
    <p>99+ smart layouts & visual metaphors</p>
  </a>

  <a href="/examples/flowcharts" class="example-card">
    <h3>🔄 Flowcharts</h3>
    <p>Process flows and decision logic</p>
  </a>

  <a href="/examples/mindmap-diagrams" class="example-card">
    <h3>🧠 Mindmaps</h3>
    <p>Visual thinking & brainstorming</p>
  </a>

  <a href="/examples/venn-diagrams" class="example-card">
    <h3>⭕ Venn Diagrams</h3>
    <p>Set overlaps & relationships</p>
  </a>

  <a href="/examples/pyramid-diagrams" class="example-card">
    <h3>🔺 Pyramids</h3>
    <p>Hierarchical stacked data</p>
  </a>

  <a href="/examples/dfd-diagrams" class="example-card">
    <h3>🔀 Data Flow</h3>
    <p>Gane-Sarson system analysis</p>
  </a>

  <a href="/examples/state-machines" class="example-card">
    <h3>🔀 State Machines</h3>
    <p>UML statecharts & object lifecycles</p>
  </a>
  
  <a href="/examples/activity-diagrams" class="example-card">
    <h3>📊 Activity Diagrams</h3>
    <p>UML workflows & business processes</p>
  </a>
  
  <a href="/examples/bpmn-diagrams" class="example-card">
    <h3>🔁 BPMN</h3>
    <p>Business process notation</p>
  </a>

  <a href="/examples/sequence-diagrams" class="example-card">
    <h3>💬 Sequence Diagrams</h3>
    <p>UML message exchanges & interactions</p>
  </a>

  <a href="/examples/class-diagrams" class="example-card">
    <h3>📐 Class Diagrams</h3>
    <p>UML object-oriented modeling</p>
  </a>

  <a href="/examples/use-case" class="example-card">
    <h3>👤 Use Case</h3>
    <p>UML actor interactions</p>
  </a>

  <a href="/examples/c4-architecture" class="example-card">
    <h3>📦 C4 Architecture</h3>
    <p>Context, container, component views</p>
  </a>

  <a href="/examples/chart-diagrams" class="example-card">
    <h3>📊 Charts</h3>
    <p>Bar, pie, line, radar & more</p>
  </a>
  
  <a href="/examples/control-diagrams" class="example-card">
    <h3>🎛️ Control system Diagrams</h3>
    <p>Control systems & signal flow</p>
  </a>
  
  <a href="/examples/electrical" class="example-card">
    <h3>⚡ Analog Circuits</h3>
    <p>Electrical circuits with SPICE export</p>
  </a>
  
  <a href="/examples/digital" class="example-card">
    <h3>🔢 Digital Logic</h3>
    <p>Gates & HDL export</p>
  </a>

  <a href="/examples/quantum-circuits" class="example-card">
    <h3>⚛️ Quantum Circuits</h3>
    <p>Quantum gates & algorithms</p>
  </a>

  <a href="/examples/pid-diagrams" class="example-card">
    <h3>🏭 P&ID Diagrams</h3>
    <p>Process instrumentation (ISA-5.1)</p>
  </a>
  
  <a href="/examples/pneumatic-circuits" class="example-card">
    <h3>💨 Pneumatic</h3>
    <p>Compressed air circuits (ISO 1219-1)</p>
  </a>
  
  <a href="/examples/hydraulic-circuits" class="example-card">
    <h3>🔧 Hydraulic</h3>
    <p>Fluid power systems (ISO 1219-1)</p>
  </a>

  <!-- <a href="/examples/pedigree" class="example-card">
    <h3>🧬 Pedigree Charts</h3>
    <p>Medical family trees</p>
  </a> -->

  <a href="/examples/wardley-maps" class="example-card">
    <h3>📊 Wardley Maps</h3>
    <p>Strategic evolution mapping</p>
  </a>
  
  <a href="/examples/timeline-diagrams" class="example-card">
    <h3>⏱️ Timelines</h3>
    <p>Chronological events & milestones</p>
  </a>
</div>

<style>
.example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.example-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
  text-decoration: none;
  transition: all 0.2s;
}

.example-card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.example-card h3 {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-brand);
}

.example-card p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}
</style>
