# Examples Overview

Runiq diagrams span multiple domains. Browse by category:

## Software Engineering

Build architecture diagrams, UML models, and process flows.

### [Flowcharts](/examples/flowcharts)

- Authentication flows with validation
- State machines and decision logic
- Algorithm visualization
- Multi-container architectures
- **Visual Examples**: Auth flow, ETL pipeline, bubble sort

### [Use Case Diagrams](/examples/use-case)

- UML actor interactions
- System boundaries
- `<<include>>` and `<<extend>>` stereotypes
- Banking, e-commerce examples
- 8 actor shape styles

### [Container Diagrams](/examples/containers)

- C4 architecture model (context, container, component)
- Microservices topology
- Multi-tier applications (3-tier)
- BPMN swimlanes
- Multi-region deployments

## Control Systems

Design control loops and signal processing.

### [Block Diagrams](/examples/block-diagrams)

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

## Fluid Power Systems

Design pneumatic and hydraulic circuits following ISO 1219-1 standards.

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

## Medical & Genetics

Professional pedigree charts following medical standards.

### [Pedigree Charts](/examples/pedigree)

- Male (square), female (circle), unknown sex (diamond) symbols
- Affected (black fill), carrier (half-fill), normal (white) individuals
- Deceased notation (diagonal line)
- Marriage relationships (horizontal line, no arrow)
- Consanguineous marriages (double line)
- Three-generation families, autosomal inheritance patterns
- **Visual Examples**: Genetic trait inheritance, consanguinity

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

---

## Coming Soon

::: info Under Development

- **Quantum Circuits** - Quantum gates and measurements
- **Network Diagrams** - Topology and infrastructure
- **Timing Diagrams** - Waveforms and signals
- **SmartArt** - Lists, hierarchies, matrices
  :::

## Quick Navigation

<div class="example-grid">
  <a href="/examples/flowcharts" class="example-card">
    <h3>🔄 Flowcharts</h3>
    <p>Process flows and decision logic</p>
  </a>
  
  <a href="/examples/use-case" class="example-card">
    <h3>👤 Use Case</h3>
    <p>UML actor interactions</p>
  </a>
  
  <a href="/examples/containers" class="example-card">
    <h3>📦 Containers</h3>
    <p>C4 architecture diagrams</p>
  </a>
  
  <a href="/examples/block-diagrams" class="example-card">
    <h3>🎛️ Block Diagrams</h3>
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
  
  <a href="/examples/pneumatic-circuits" class="example-card">
    <h3>💨 Pneumatic</h3>
    <p>Compressed air circuits (ISO 1219-1)</p>
  </a>
  
  <a href="/examples/hydraulic-circuits" class="example-card">
    <h3>🔧 Hydraulic</h3>
    <p>Fluid power systems (ISO 1219-1)</p>
  </a>
  
  <a href="/examples/pedigree" class="example-card">
    <h3>🧬 Pedigree Charts</h3>
    <p>Medical family trees</p>
  </a>
  
  <a href="/examples/wardley-maps" class="example-card">
    <h3>📊 Wardley Maps</h3>
    <p>Strategic evolution mapping</p>
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
