### Issue 6: Control System Diagrams (Ladder Logic/FBD)

````markdown
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
- [ ] Math operations (+, -, \*, /)
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
````

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

`````

---


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
`````

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

```

```
