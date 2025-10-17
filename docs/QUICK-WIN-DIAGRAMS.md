# Quick Win Diagram Types & Mechanical Engineering Support

## Executive Summary

Based on Runiq's current architecture with **ElectricalProfile**, here are the **top quick win diagram types** that could leverage the same pattern, plus an analysis of **mechanical/engineering diagrams**.

---

## 🚀 Top 5 Quick Wins (Using ElectricalProfile Pattern)

### 1. **Pneumatic/Hydraulic Circuits** ⭐⭐⭐⭐⭐
**Effort:** 2-3 days | **Value:** Very High | **Architecture:** Same as electrical!

**Why it's a perfect fit:**
- Uses same **node-edge-net model** as electrical circuits
- Components have terminals/ports (like electrical pins)
- Follows international standards (ISO 1219-1 for pneumatics, ISO 1219-2 for hydraulics)
- Same layout needs (orthogonal routing, junction dots)

**Implementation:**
```typescript
interface PneumaticProfile {
  type: 'pneumatic'; // or 'hydraulic'
  name: string;
  nets: NetAst[];      // Air/fluid lines (like electrical nets)
  parts: PartAst[];    // Valves, cylinders, pumps (like electrical parts)
  params?: {
    pressure?: string; // "6 bar", "100 psi"
    flow?: string;     // "10 L/min"
  };
}
```

**Symbol Library (20-30 symbols):**
- **Pneumatic:** Cylinders (single/double-acting), 3/2-way valve, 5/2-way valve, pressure regulator, filter, lubricator, air source
- **Hydraulic:** Pumps (fixed/variable), motors, directional control valves, pressure relief valves, cylinders, filters, reservoirs

**Export Formats:**
- ISO 1219 standard symbols
- FluidSim format
- Automation Studio format

**Real-world applications:**
- Manufacturing automation
- Heavy machinery
- Robotics pneumatics
- Industrial control systems

---

### 2. **Piping & Instrumentation Diagrams (P&ID)** ⭐⭐⭐⭐⭐
**Effort:** 3-4 days | **Value:** Extremely High | **Architecture:** Same pattern!

**Why it's a perfect fit:**
- Process industry standard (chemical plants, refineries, water treatment)
- Node-edge model (equipment connected by pipes)
- Components have ports/connections
- Follows ISA-5.1 standard

**Implementation:**
```typescript
interface PIDProfile {
  type: 'pid';
  name: string;
  nets: NetAst[];      // Pipes, signal lines
  parts: PartAst[];    // Valves, tanks, pumps, instruments
  instruments?: InstrumentAst[]; // Tag numbers (FT-101, PT-202)
  streams?: StreamAst[];         // Material flow info
}
```

**Symbol Library (40-60 symbols):**
- **Equipment:** Vessels, tanks, heat exchangers, pumps, compressors, reactors
- **Valves:** Gate, globe, ball, check, control, safety relief
- **Instruments:** Transmitters (P, T, F, L), control valves, analyzers
- **Lines:** Process, instrument, signal (electrical, pneumatic)

**Export Formats:**
- AutoCAD P&ID
- ISO 14617 symbols
- ISA-5.1 tags

**Industry value:** $$$$ (Chemical, oil & gas, pharmaceutical industries)

---

### 3. **Control System Diagrams (Ladder Logic / FBD)** ⭐⭐⭐⭐
**Effort:** 2-3 days | **Value:** High | **Architecture:** Perfect match!

**Why it's a perfect fit:**
- PLC programming standard (IEC 61131-3)
- Same node-edge structure
- Components (rungs, contacts, coils) have connections
- Used in every automated factory

**Implementation:**
```typescript
interface ControlProfile {
  type: 'control';
  variant: 'ladder' | 'fbd' | 'sfc'; // Ladder, Function Block, Sequential
  name: string;
  nets: NetAst[];      // Power rails, signal lines
  parts: PartAst[];    // Contacts, coils, timers, counters
  rungs?: RungAst[];   // Ladder-specific
}
```

**Symbol Library (30-40 symbols):**
- **Ladder Logic:** NO contact, NC contact, coil, latch, timer (TON/TOF/TP), counter, compare
- **Function Blocks:** AND, OR, NOT, SR flip-flop, timers, PID, math operations
- **SFC:** Steps, transitions, actions

**Export Formats:**
- Structured Text (ST)
- PLCopen XML
- Ladder diagram SVG

**Applications:**
- Factory automation
- SCADA systems
- Industrial control panels

---

### 4. **HVAC Diagrams** ⭐⭐⭐
**Effort:** 2-3 days | **Value:** Medium-High | **Architecture:** Same!

**Why it's a perfect fit:**
- Ductwork/piping follows node-edge model
- Equipment has inlet/outlet ports
- Similar to electrical single-line diagrams

**Implementation:**
```typescript
interface HVACProfile {
  type: 'hvac';
  name: string;
  nets: NetAst[];      // Ducts, pipes, refrigerant lines
  parts: PartAst[];    // AHU, VAV, fans, coils, dampers
  zones?: ZoneAst[];   // Thermal zones
}
```

**Symbol Library (25-35 symbols):**
- **Equipment:** AHU, fan, filter, heating/cooling coil, humidifier, VAV box
- **Ductwork:** Supply, return, exhaust, flex duct
- **Controls:** Damper (motorized/manual), thermostat, sensor
- **Piping:** Chilled water, hot water, steam, condensate

**Standards:** ASHRAE, ISO 10628

---

### 5. **Block Diagrams (Control/Signal Flow)** ⭐⭐⭐⭐
**Effort:** 1-2 days | **Value:** High | **Architecture:** Simplified electrical!

**Why it's a perfect fit:**
- Signal flow diagrams used in control theory
- Nodes = blocks (transfer functions), edges = signals
- Same layout algorithms

**Implementation:**
```typescript
interface BlockDiagramProfile {
  type: 'block-diagram';
  name: string;
  nets: NetAst[];      // Signal paths
  parts: PartAst[];    // Transfer functions, summing junctions, gain blocks
  feedbackLoops?: boolean;
}
```

**Symbol Library (15-20 symbols):**
- **Blocks:** Transfer function, gain, integrator, differentiator, delay
- **Operations:** Sum, multiply, divide, compare
- **Special:** Saturation, dead zone, switch, lookup table

**Export:** Simulink-compatible, LaTeX (TikZ)

**Applications:**
- Control system design
- Signal processing
- System modeling

---

## 🔧 Mechanical Engineering Diagrams

### **Option A: Mechanical Schematics** ⭐⭐⭐⭐
**Effort:** 4-5 days | **Value:** High | **Different architecture needed**

Mechanical systems have unique characteristics:
- **2D technical drawings** (top/front/side views)
- **Dimensioning** (lengths, diameters, tolerances)
- **Assembly relationships** (mates, constraints)
- **Bill of Materials (BOM)** linkage

**Implementation approach:**
```typescript
interface MechanicalProfile {
  type: 'mechanical';
  name: string;
  view: 'front' | 'top' | 'side' | 'isometric';
  components: MechComponentAst[];
  assemblies?: AssemblyAst[];
  dimensions?: DimensionAst[];
  bom?: BOMEntry[];
}

interface MechComponentAst {
  id: string;
  type: 'shaft' | 'bearing' | 'gear' | 'belt' | 'spring' | 'fastener';
  position: { x: number; y: number; z?: number };
  dimensions: { length?: number; diameter?: number; width?: number };
  material?: string;
  partNumber?: string;
}
```

**Symbol Types:**
- **Power transmission:** Gears (spur, helical, bevel), belts, chains, shafts, couplings
- **Motion components:** Bearings, bushings, slides, rails
- **Fasteners:** Bolts, nuts, washers, pins
- **Springs:** Compression, tension, torsion
- **Standard parts:** ISO/DIN/ANSI symbols

**Key Challenge:** Mechanical diagrams are more **geometric** than **topological**
- Need exact positioning (not just layout)
- Need dimensioning system
- Need multiple view support

**Recommendation:** Start with **kinematic diagrams** (simpler, more schematic)

---

### **Option B: Kinematic Diagrams** ⭐⭐⭐⭐⭐
**Effort:** 2-3 days | **Value:** High | **BETTER FIT!**

Kinematic diagrams show **motion relationships** without geometry details.

**Why it's a better fit:**
- **Topological** (like electrical) rather than geometric
- Shows **linkages and joints** (like electrical connections)
- Used in robotics, mechanisms, machine design

**Implementation:**
```typescript
interface KinematicProfile {
  type: 'kinematic';
  name: string;
  nets: NetAst[];      // Motion paths, linkages
  parts: PartAst[];    // Links, joints, actuators
  dof?: number;        // Degrees of freedom
}
```

**Symbol Library (20-25 symbols):**
- **Joints:** Revolute (pin), prismatic (slider), spherical (ball), universal, fixed
- **Links:** Binary, ternary, quaternary (rigid bodies)
- **Actuators:** Linear actuator, rotary motor
- **End effectors:** Gripper, tool mount
- **Special:** Spring, damper, cam, gear set

**Applications:**
- Robot arm design
- Four-bar linkages
- Crank-slider mechanisms
- Walking mechanisms

**Export:** DH parameters, URDF (robot description), motion equations

---

## 📊 Comparison Matrix

| Diagram Type | Effort | ElectricalProfile Reuse | Industry Value | Quick Win Score |
|--------------|--------|------------------------|----------------|-----------------|
| **Pneumatic/Hydraulic** | 2-3 days | ✅ 95% | $$$$$ | ⭐⭐⭐⭐⭐ |
| **P&ID** | 3-4 days | ✅ 90% | $$$$$ | ⭐⭐⭐⭐⭐ |
| **Control Diagrams** | 2-3 days | ✅ 85% | $$$$ | ⭐⭐⭐⭐ |
| **Kinematic** | 2-3 days | ✅ 80% | $$$ | ⭐⭐⭐⭐⭐ |
| **HVAC** | 2-3 days | ✅ 85% | $$$ | ⭐⭐⭐ |
| **Block Diagrams** | 1-2 days | ✅ 90% | $$$ | ⭐⭐⭐⭐ |
| Mechanical Drawings | 5-7 days | ❌ 20% | $$$$ | ⭐⭐ |

---

## 🎯 Recommended Implementation Order

### Phase 1: Maximum Reuse (2-4 weeks)
1. **Pneumatic/Hydraulic** (Week 1) - Identical pattern, huge industrial demand
2. **Control Diagrams** (Week 2) - Ladder logic, factory automation
3. **Kinematic** (Week 3) - Robotics, mechanism design
4. **Block Diagrams** (Week 4) - Control theory, signal processing

### Phase 2: High Value (4-6 weeks)
5. **P&ID** (Weeks 5-6) - Process industries, very high value
6. **HVAC** (Weeks 7-8) - Building systems

### Phase 3: Advanced Features
7. **Mechanical Drawings** - Requires new architecture (dimensioning, multi-view)

---

## 💡 Key Insights

### Why These Are Quick Wins:

1. **Same Architecture**
   - All use `nets` (connections) + `parts` (components)
   - Same ElectricalProfile pattern
   - Reuse existing schematic renderer (95%+ code reuse!)

2. **Same Layout Needs**
   - Orthogonal routing (already implemented!)
   - Junction dots (already working!)
   - Component rotation (already done!)

3. **Same Export Pattern**
   - Text-based formats (like SPICE/Verilog)
   - Symbol libraries (like electrical symbols)
   - Netlist-style output

### Implementation Strategy:

```typescript
// Unified rendering function
function renderSchematic(profile: 
  | ElectricalProfile 
  | PneumaticProfile 
  | PIDProfile 
  | KinematicProfile
): { svg: string } {
  // 95% shared code!
  const symbolLibrary = getSymbolLibrary(profile.type);
  const layout = layoutComponents(profile.parts, profile.nets);
  return renderSVG(layout, symbolLibrary);
}
```

**Code Reuse:**
- ✅ Layout engine: 100%
- ✅ Wire routing: 100%
- ✅ Orthogonal paths: 100%
- ✅ Junction dots: 100%
- ✅ Component rotation: 100%
- 🟡 Symbol library: 0% (need new symbols, but same rendering logic)
- 🟡 Export format: 50% (similar netlist pattern)

---

## 🎨 Example: Pneumatic Circuit

```typescript
const pneumaticCircuit: PneumaticProfile = {
  type: 'pneumatic',
  name: 'Dual Cylinder Control',
  nets: [
    { name: 'P' },        // Pressure supply
    { name: 'A1' },       // Cylinder 1 extend
    { name: 'B1' },       // Cylinder 1 retract
    { name: 'A2' },       // Cylinder 2 extend
    { name: 'B2' },       // Cylinder 2 retract
    { name: 'EXHAUST' },
  ],
  parts: [
    { ref: 'V1', type: 'VALVE_52', pins: ['P', 'A1', 'B1', 'EXHAUST'] },
    { ref: 'C1', type: 'CYL_DA', pins: ['A1', 'B1'] },
    { ref: 'V2', type: 'VALVE_52', pins: ['P', 'A2', 'B2', 'EXHAUST'] },
    { ref: 'C2', type: 'CYL_DA', pins: ['A2', 'B2'] },
    { ref: 'FRL1', type: 'FRL_UNIT', pins: ['P', 'GND'] },
  ],
};

// Renders using SAME schematic renderer!
const { svg } = renderSchematic(pneumaticCircuit);
```

---

## 🏆 Top Recommendation

**START WITH: Pneumatic/Hydraulic Circuits**

**Rationale:**
1. ✅ **Perfect architecture match** (95%+ code reuse)
2. ✅ **Huge industrial demand** (manufacturing, robotics, heavy equipment)
3. ✅ **Clear standards** (ISO 1219)
4. ✅ **Proven market** (FluidSim, Automation Studio are $$$)
5. ✅ **2-3 day implementation**
6. ✅ **Validates pattern** for P&ID, HVAC, control diagrams

**Deliverables:**
- 25 pneumatic symbols (ISO 1219-1)
- 25 hydraulic symbols (ISO 1219-2)
- Same orthogonal routing
- Text export (component list, BOM)
- Example circuits (pick-and-place, press control, robot gripper)

**After that:** Control diagrams (ladder logic) → Kinematic diagrams → P&ID

---

## 📝 Next Steps

1. **Prototype pneumatic symbols** (2-3 hours)
2. **Validate with sample circuit** (1 hour)
3. **Implement full symbol library** (1-2 days)
4. **Add export format** (0.5 days)
5. **Write tests & examples** (0.5 days)

**Total:** ~2-3 days to complete pneumatic/hydraulic support! 🚀
