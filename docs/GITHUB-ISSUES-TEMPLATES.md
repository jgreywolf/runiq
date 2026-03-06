# GitHub Issues Templates for Unimplemented Diagram Types

**Date:** February 8, 2026  
**Purpose:** Ready-to-use GitHub issue templates for all 46 unimplemented diagram types  
**Status:** Ready for bulk issue creation

---

### Issue 5: Kinematic Diagrams (Robotics/Mechanisms)

````markdown
## 🎯 Feature: Kinematic Diagram Support

### Description

Add kinematic diagram support for robotics and mechanism design. Shows motion relationships and linkages using topological (not geometric) approach.

### Current Status

- [x] Node-edge model fits perfectly
- [x] Layout algorithms available
- [x] Kinematic-specific shapes available

### Implementation Requirements

**Effort:** 2-3 days
**Priority:** High (Robotics applications)
**Complexity:** Low-Medium

#### Phase 1: Joint Shapes (1 day)

**20-25 Symbols:**

- [x] Revolute joint (pin/hinge)
- [x] Prismatic joint (slider)
- [x] Spherical joint (ball)
- [x] Universal joint
- [x] Fixed joint
- [x] Cylindrical joint
- [x] Planar joint

#### Phase 2: Link Shapes (4 hours)

- [x] Binary link (2 connections)
- [x] Ternary link (3 connections)
- [x] Quaternary link (4 connections)
- [x] Ground/fixed link

#### Phase 3: Actuators & End Effectors (4 hours)

- [x] Linear actuator
- [x] Rotary motor
- [x] Gripper (parallel jaw)
- [x] Gripper (angular)
- [x] Tool mount
- [x] Spring
- [x] Damper
- [x] Cam
- [x] Gear

#### Phase 4: DSL Syntax (2 hours)

```runiq
diagram kinematic "4-Bar Linkage"
  node Ground { type: fixed-link }
  node Link1 { type: binary-link, length: 100 }
  node Link2 { type: binary-link, length: 80 }
  node Link3 { type: binary-link, length: 90 }

  joint J1 { type: revolute } connects Ground, Link1
  joint J2 { type: revolute } connects Link1, Link2
  joint J3 { type: revolute } connects Link2, Link3
  joint J4 { type: revolute } connects Link3, Ground

  actuator Motor at J1
```
````

#### Phase 5: Examples (4 hours)

- [x] 4-bar linkage
- [x] Crank-slider mechanism
- [x] Robot arm (3-DOF)
- [x] Walking mechanism
- [x] Gripper mechanism

### Testing Requirements

- [ ] All joint symbols render
- [ ] Links connect properly
- [ ] Actuator placement
- [ ] DOF calculation (optional)
- [ ] Motion simulation (future)

### Acceptance Criteria

- [x] 25 kinematic symbols
- [x] Joint-link connections
- [x] 5+ example mechanisms
- [ ] 30+ tests passing
- [x] Documentation with robotics applications

### Export Options (Future)

- [ ] DH parameters (Denavit-Hartenberg)
- [ ] URDF (Unified Robot Description Format)
- [ ] Motion equations

### Estimated Effort

**Total: 2-3 days** (symbols + examples + tests)

````

---

### Issue 6: Control System Diagrams (Ladder Logic/FBD)

```markdown
## Feature: PLC Control System Diagrams (Ladder Logic & Function Block)

### Description
Add support for PLC programming diagrams following IEC 61131-3 standard. Reuses schematic renderer infrastructure.

### Current Status
- [x] Control profile added (ladder/FBD variants)
- [x] Schematic renderer wiring via parts + nets
- [x] Basic IEC ladder symbols (NO/NC contacts, coil, set/reset, TON)
- [x] Documentation updated for control profile (legacy control system block diagrams retired)
- [ ] Expanded IEC 61131-3 symbol library (timers, counters, compare, math)

### Implementation Requirements

**Effort:** 2-3 days
**Priority:** High (Factory automation, SCADA)
**Complexity:** Low (architecture reuse)

#### Phase 1: Ladder Logic Symbols
**30-40 Symbols:**
- [x] Normally Open (NO) contact
- [x] Normally Closed (NC) contact
- [x] Output coil
- [x] Latch coil (Set)
- [x] Unlatch coil (Reset)
- [x] Timer On-Delay (TON)
- [ ] Timer Off-Delay (TOF)
- [ ] Timer Pulse (TP)
- [ ] Counter Up (CTU)
- [ ] Counter Down (CTD)
- [ ] Counter Up-Down (CTUD)
- [ ] Compare (=, <, >, <=, >=, <>)
- [ ] Math operations (+, -, *, /)
- [ ] Move (MOV)

#### Phase 2: Function Block Symbols
- [ ] AND block
- [ ] OR block
- [ ] NOT block
- [ ] XOR block
- [ ] SR flip-flop
- [ ] RS flip-flop
- [ ] PID controller
- [ ] Scale function
- [ ] Limit function

#### Phase 3: Profile Type
```typescript
interface ControlProfile {
  type: 'control';
  variant: 'ladder' | 'fbd' | 'sfc';
  name: string;
  nets: NetAst[];
  parts: PartAst[];
}
```

#### Phase 4: DSL Syntax

```runiq
control "Motor Start-Stop" {
  variant ladder
  net L1, L2, M1, M2

  part Start type:NO_CONTACT pins:(L1,M1) doc:"Start PB"
  part Stop type:NC_CONTACT pins:(M1,M2) doc:"Stop PB"
  part Motor type:COIL pins:(M2,L2) doc:"Motor coil"
}
```

#### Phase 5: Examples

- [x] Start-Stop motor control
- [x] Timer enable
- [ ] Traffic light sequence
- [ ] Conveyor belt control
- [ ] Tank filling with timers
- [ ] Batch process control

### Testing Requirements

- [x] Core ladder symbols render
- [ ] Rung layout (horizontal)
- [ ] Power rail rendering
- [ ] Contact/coil connections
- [ ] FBD block connections

### Acceptance Criteria

- [ ] 40+ ladder/FBD symbols
- [ ] IEC 61131-3 compliance
- [x] 2+ example programs
- [ ] 40+ tests passing
- [ ] Export to Structured Text (future)

### Industry Standards

- IEC 61131-3 (PLC Programming Languages)
- PLCopen XML (exchange format)

### Estimated Effort

**Total: 2-3 days** (symbols + ladder layout + tests)
```

---

### Issue 7: HVAC Diagrams

```markdown
## 🎯 Feature: HVAC System Diagrams

### Description
Add support for HVAC (Heating, Ventilation, Air Conditioning) system diagrams following ASHRAE standards.

### Implementation Requirements

**Effort:** 2-3 days
**Priority:** Medium (Building systems)
**Complexity:** Low (node-edge model)

#### Phase 1: HVAC Equipment Symbols (1 day)
**25-35 Symbols:**
- [x] Air Handling Unit (AHU)
- [x] Fan (supply, return, exhaust)
- [x] Filter
- [x] Heating coil
- [x] Cooling coil
- [x] Humidifier
- [x] Dehumidifier
- [x] VAV box (Variable Air Volume)
- [x] Diffuser (supply, return)
- [x] Damper (motorized, manual, fire)
- [x] Ductwork (supply, return, exhaust)
- [x] Thermostat
- [x] Temperature sensor
- [x] Pressure sensor
- [x] Chiller
- [x] Boiler
- [x] Cooling tower
- [x] Pump
- [x] Heat exchanger

#### Phase 2: DSL Syntax (4 hours)
```runiq
diagram hvac "Office HVAC System"
  equipment AHU1 type:air-handling-unit cfm:5000
  equipment Fan1 type:supply-fan cfm:5000
  equipment Coil1 type:cooling-coil capacity:"10 tons"
  equipment VAV1 type:vav-box cfm-max:1000

  duct Supply type:supply size:"16x12"
  duct Return type:return size:"20x14"

  connect AHU1.out -> Supply -> VAV1.in
  connect VAV1.out -> Zone1
````

#### Phase 3: Examples (4 hours)

- [x] Simple office HVAC
- [x] Multi-zone system
- [x] Rooftop unit (RTU)
- [x] Chilled water system
- [x] Heat pump system

### Testing Requirements

- [x] All HVAC symbols render
- [x] Duct routing
- [x] Airflow direction indicators
- [x] Equipment labels (CFM, BTU, tonnage)
- [x] Equipment metadata labels (flow, capacity, pressure)

### Acceptance Criteria

- [x] 30+ HVAC symbols
- [ ] ASHRAE standard compliance (partial)
- [x] 5+ example systems
- [x] 35+ tests passing

### Standards

- ASHRAE symbols
- ISO 10628 (Process diagrams)

### Estimated Effort

**Total: 2-3 days**

````

---

### Issue 9-12: Simple Visual Enhancements (1-2 days each)

```markdown
## 🎯 Feature: User Journey Diagrams

**Effort:** 1-2 days
**Complexity:** Low

### Requirements
- [ ] Timeline layout mode
- [ ] Emotion indicator shapes (😊 😐 😞)
- [ ] Phase/stage grouping
- [ ] Touchpoint markers

---

## 🎯 Feature: Pie Chart Support

**Effort:** 1-2 days
**Complexity:** Low

### Requirements
- [x] Pie slice shapes
- [x] Data-to-angle conversion
- [x] Percentage labels
- [x] Legend support
- [ ] Donut chart variant

---


## 🎯 Feature: Quadrant Chart (2x2 Matrix)

**Effort:** 1-2 days
**Complexity:** Low

### Requirements
- [ ] 2D scatter layout
- [ ] Quadrant backgrounds
- [ ] Axis labels (X/Y)
- [ ] Item positioning by coordinates
- [ ] Example: Eisenhower matrix, BCG matrix
````

---

## TIER 2: MEDIUM EFFORT (3-7 days each)

### Issue 13: UML Timing Diagrams

````markdown
## 🎯 Feature: UML Timing Diagrams

### Description

Add support for UML timing diagrams showing how object states change over time with timing constraints.

### Implementation Requirements

**Effort:** 4-6 days  
**Priority:** Medium (Completes UML suite)  
**Complexity:** Medium-High

#### Phase 1: Time Axis & Grid (1 day)

- [ ] Horizontal time axis with tick marks
- [ ] Time scale (ms, s, min, h)
- [ ] Grid overlay option
- [ ] Time labels

#### Phase 2: State Lifelines (1-2 days)

- [ ] Vertical swimlanes per object
- [ ] State visualization (digital waveform)
- [ ] State transition rendering
- [ ] State duration bars

#### Phase 3: Events & Messages (1 day)

- [ ] Event markers
- [ ] Message arrows between lifelines
- [ ] Timing constraints notation
- [ ] Duration constraints

#### Phase 4: DSL Syntax (1 day)

```runiq
diagram timing "Door Controller"
  timeline scale:ms range:0-10000

  object DoorSensor {
    state Closed at 0-2000
    state Open at 2000-8000
    state Closed at 8000-10000
  }

  object DoorMotor {
    state Off at 0-2500
    state Opening at 2500-3000
    state On at 3000-7500
    state Closing at 7500-8000
    state Off at 8000-10000
  }

  event SensorTriggered at 2000
  constraint "Motor starts within 500ms" from:2000 to:2500
```
````

#### Phase 5: Examples & Tests (1 day)

- [ ] Digital signal timing
- [ ] State machine timing
- [ ] Protocol timing (UART, SPI)
- [ ] 45+ tests

### Acceptance Criteria

- [ ] Time axis rendering
- [ ] Multiple object lifelines
- [ ] State changes visualized
- [ ] Timing constraints shown
- [ ] 3+ examples
- [ ] 45+ tests passing

### Estimated Effort

**Total: 4-6 days**

````

---

### Issue 14: P&ID (Piping & Instrumentation Diagrams)

```markdown
## 🎯 Feature: P&ID Diagrams

### Description
Add support for Piping & Instrumentation Diagrams (P&ID) following ISA-5.1 standard. **Extremely high industry value!**

### Current Status
- [x] P&ID profile implemented with equipment, instrumentation, lines, and control loops

### Implementation Requirements

**Effort:** 3-4 days
**Priority:** Very High (Process industry $$$$)
**Complexity:** Medium

#### Phase 1: Equipment Symbols (1.5 days)
**40-60 Symbols:**

**Vessels & Tanks:**
- [x] Pressure vessel (vertical/horizontal)
- [x] Storage tank
- [x] Reactor
- [x] Separator (horizontal/vertical)
- [x] Knockout drum
- [x] Flash drum

**Rotating Equipment:**
- [x] Centrifugal pump
- [x] Positive displacement pump
- [x] Compressor (centrifugal/reciprocating)
- [x] Fan/blower
- [x] Turbine

**Heat Transfer:**
- [x] Shell & tube heat exchanger
- [x] Plate heat exchanger
- [x] Air cooler
- [x] Fired heater/furnace
- [x] Condenser
- [x] Reboiler

**Valves (20+ types):**
- [x] Gate valve
- [x] Globe valve
- [x] Ball valve
- [x] Butterfly valve
- [x] Check valve
- [x] Control valve
- [x] Safety relief valve
- [ ] Pressure reducing valve
- [x] Three-way valve
- [x] Plug valve

**Instrumentation:**
- [x] Pressure transmitter (PT)
- [x] Temperature transmitter (TT)
- [x] Flow transmitter (FT)
- [x] Level transmitter (LT)
- [x] Analyzer (AT)
- [ ] Control valve with positioner
- [x] Pressure indicator (PI)
- [x] Temperature indicator (TI)

#### Phase 2: Line Types (4 hours)
- [x] Process piping (thick solid)
- [x] Instrument signal (thin dashed)
- [x] Electrical signal
- [ ] Pneumatic signal
- [ ] Hydraulic signal
- [ ] Software/data link
- [x] Utility lines (steam, cooling water, etc.)

#### Phase 3: Tag Numbering (4 hours)
```typescript
interface InstrumentTag {
  function: 'P' | 'T' | 'F' | 'L' | 'A'; // Pressure, Temp, Flow, Level, Analyzer
  modifier?: 'I' | 'T' | 'C'; // Indicator, Transmitter, Controller
  loop: number; // 101, 102, 103...
}
// Example: FT-101 = Flow Transmitter, loop 101
````

#### Phase 4: DSL Syntax (1 day)

```runiq
diagram pid "Distillation Column"

  equipment T-101 type:vessel label:"Column T-101"
  equipment E-101 type:heat-exchanger label:"Reboiler E-101"
  equipment P-101 type:pump label:"Bottoms Pump P-101"

  instrument FT-101 type:flow-transmitter on:line-1
  instrument LT-101 type:level-transmitter on:T-101
  instrument TT-101 type:temp-transmitter on:T-101
  instrument FCV-101 type:control-valve controlled-by:FT-101

  line Feed type:process from:battery-limit to:T-101.in
  line Distillate type:process from:T-101.top to:condenser
  line Bottoms type:process from:T-101.bottom to:E-101

  signal FT-101 -> FCV-101 type:pneumatic
```

#### Phase 5: Examples (4 hours)

- [x] Simple heat exchanger loop
- [x] Distillation column
- [x] Pump with instrumentation
- [ ] Tank farm
- [x] Chemical reactor system

### Testing Requirements

- [x] All 60 symbols render correctly
- [ ] ISA-5.1 tag compliance
- [x] Line type differentiation
- [x] Instrument connection logic

### Acceptance Criteria

- [x] 60+ P&ID symbols
- [ ] ISA-5.1 standard compliance
- [ ] Tag numbering system
- [x] 5+ example P&IDs
- [ ] 50+ tests passing

### Industry Standards

- ISA-5.1 (Instrumentation symbols)
- ISO 14617 (Graphical symbols)
- ISA-5.4 (Instrument loop diagrams)

### Market Value

- AutoCAD P&ID: $2000+/year
- SmartPlant P&ID: $10,000+
- **Runiq: Open source!** 🎉

### Estimated Effort

**Total: 3-4 days**

`````

---

### Issue 15-20: More Medium Effort Diagrams

```markdown
## 🎯 Feature: XY Chart / Scatter Plot

**Effort:** 3-5 days
**Complexity:** Medium

### Requirements
- [ ] 2D coordinate system
- [ ] X/Y axes with ticks and labels
- [ ] Data point shapes
- [ ] Line/curve interpolation
- [ ] Legend support
- [ ] Multiple data series
- [ ] Grid lines

---

## 🎯 Feature: Gantt Chart

**Effort:** 3-5 days
**Complexity:** Medium

### Requirements
- [ ] Timeline layout
- [ ] Task bars with durations
- [ ] Dependencies (FS, SS, FF, SF)
- [ ] Milestones
- [ ] Resource assignments
- [ ] Critical path highlighting
- [ ] Date/time scale

---

## 🎯 Feature: Treemap Diagram

**Effort:** 2-4 days (ELK has rectpacking!)
**Complexity:** Medium

### Requirements
- [x] Enable ELK rectpacking algorithm
- [x] Hierarchical nesting
- [x] Value-to-area mapping
- [x] Color scales
- [ ] Hover labels

---

## 🎯 Feature: Kanban Board

**Effort:** 3-5 days
**Complexity:** Medium

### Requirements
- [x] Column layout
- [x] Card shapes
- [x] WIP limits per column
- [x] Swimlanes (optional)
- [ ] Card priority indicators

---

## 🎯 Feature: Packet Diagram (Network Protocol)

**Effort:** 3-4 days
**Complexity:** Medium

### Requirements
- [ ] Bit-field grid layout
- [ ] Byte/bit labels
- [ ] Header structure
- [ ] Multi-layer protocol stacking
- [ ] Bit numbering (0-31, etc.)


---

## TIER 3: HIGH EFFORT (1-3 weeks each)

---

### Issue 23-30: Additional High-Effort Diagrams

Due to length constraints, I'll provide abbreviated templates for the remaining high-effort items:

```markdown

## 🎯 Feature: Critical Path Analysis (1-2 weeks)
- PERT/CPM layout
- Duration calculations
- Critical path highlighting
- Float/slack display

## 🎯 Feature: Sequential Function Chart (1-2 weeks)
- IEC 61131-3 SFC
- Step/transition layout
- Parallel branches
- PLC programming

## 🎯 Feature: Architecture Tiers (1 week)
- Horizontal swim lanes
- Layer/tier containers
- Cross-layer connections
- Common in IT architecture

## 🎯 Feature: Deployment Diagram (1-2 weeks)
- UML deployment nodes
- 3D cube shapes
- Artifact deployment
- Physical topology

## 🎯 Feature: Hierarchy List (1 week)
- Indented tree layout
- Expand/collapse indicators
- Org chart alternative
````
`````
