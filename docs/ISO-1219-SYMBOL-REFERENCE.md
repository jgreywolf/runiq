# ISO 1219 Pneumatic & Hydraulic Symbol Reference

**Standards:**

- ISO 1219-1:2012 - Pneumatic symbols
- ISO 1219-2:2012 - Hydraulic symbols
- DIN ISO 1219 - German implementation

## Symbol Architecture

Each symbol follows the same structure as electrical components:

```typescript
interface SymbolDefinition {
  id: string; // Unique identifier (e.g., 'CYL_SA', 'VALVE_32')
  width: number; // Symbol width in pixels
  height: number; // Symbol height in pixels
  terminals: Array<{
    // Connection points for nets
    x: number; // Relative X position
    y: number; // Relative Y position
    name: string; // Terminal name
  }>;
  render: (x: number, y: number) => string; // SVG markup generator
}
```

---

## Pneumatic Symbols (ISO 1219-1) - 12 Symbols

### 1. Single-Acting Cylinder (CYL_SA)

**Symbol ID:** `CYL_SA`  
**Dimensions:** 60 × 30  
**Terminals:** `piston`, `port_A`, `exhaust`  
**Description:** Cylinder with spring return, extends with pressure, retracts with spring

**SVG Elements:**

- Rectangle body (40×20)
- Piston rod line
- Spring coil (zigzag pattern)
- Port circle at bottom

---

### 2. Double-Acting Cylinder (CYL_DA)

**Symbol ID:** `CYL_DA`  
**Dimensions:** 60 × 30  
**Terminals:** `piston`, `port_A`, `port_B`  
**Description:** Cylinder with pressure on both sides, no spring

**SVG Elements:**

- Rectangle body (40×20)
- Piston rod line (extends left)
- Two port circles at bottom (left and right)

---

### 3. 3/2-Way Valve (VALVE_32)

**Symbol ID:** `VALVE_32`  
**Dimensions:** 40 × 50  
**Terminals:** `P` (pressure), `A` (output), `R` (exhaust)  
**Description:** 3 ports, 2 positions (normally closed)

**SVG Elements:**

- Two square boxes stacked (representing 2 positions)
- Internal flow arrows showing port connections in each position
- Actuator symbol at top (push button or solenoid)

---

### 4. 5/2-Way Valve (VALVE_52)

**Symbol ID:** `VALVE_52`  
**Dimensions:** 60 × 50  
**Terminals:** `P`, `A`, `B`, `R`, `S` (exhaust 2)  
**Terminals:** `P` (pressure), `A`, `B`, `R`, `S`  
**Description:** 5 ports, 2 positions (double solenoid control)

**SVG Elements:**

- Two rectangular boxes side-by-side (2 positions)
- Internal flow paths
- Solenoid actuators at both ends

---

### 5. Air Source (AIR_SOURCE)

**Symbol ID:** `AIR_SOURCE`  
**Dimensions:** 40 × 40  
**Terminals:** `out`  
**Description:** Compressed air supply

**SVG Elements:**

- Circle
- Internal triangle pointing down (pressure symbol)

---

### 6. Pressure Regulator (REGULATOR)

**Symbol ID:** `REGULATOR`  
**Dimensions:** 50 × 50  
**Terminals:** `in`, `out`  
**Description:** Reduces and maintains constant pressure

**SVG Elements:**

- Vertical line (main body)
- Spring symbol above (pressure adjust)
- Arrow showing adjustment direction
- Flow path

---

### 7. Filter (FILTER)

**Symbol ID:** `FILTER`  
**Dimensions:** 40 × 40  
**Terminals:** `in`, `out`  
**Description:** Air filtration

**SVG Elements:**

- Diamond shape
- Internal mesh pattern (diagonal lines)

---

### 8. Lubricator (LUBRICATOR)

**Symbol ID:** `LUBRICATOR`  
**Dimensions:** 40 × 50  
**Terminals:** `in`, `out`  
**Description:** Adds oil mist to air

**SVG Elements:**

- Circle body (reservoir)
- Upward tube with droplet symbol
- Flow path through body

---

### 9. Flow Control Valve (FLOW_CONTROL)

**Symbol ID:** `FLOW_CONTROL`  
**Dimensions:** 40 × 40  
**Terminals:** `in`, `out`  
**Description:** Variable flow restriction (one direction)

**SVG Elements:**

- Diamond shape
- Arrow through center (adjustable)
- Bypass check valve (parallel path)

---

### 10. Check Valve (CHECK_VALVE)

**Symbol ID:** `CHECK_VALVE`  
**Dimensions:** 40 × 30  
**Terminals:** `in`, `out`  
**Description:** One-way valve (allows flow in one direction)

**SVG Elements:**

- Circle
- Internal ball and seat (triangle + circle)
- Arrow showing flow direction

---

### 11. Exhaust (EXHAUST)

**Symbol ID:** `EXHAUST`  
**Dimensions:** 30 × 30  
**Terminals:** `in`  
**Description:** Exhaust to atmosphere

**SVG Elements:**

- Small triangle pointing outward
- Three short lines (exhaust symbol)

---

### 12. Pressure Gauge (GAUGE_P)

**Symbol ID:** `GAUGE_P`  
**Dimensions:** 30 × 30  
**Terminals:** `in`  
**Description:** Pressure measurement display

**SVG Elements:**

- Circle
- Internal "P" label
- Connection line at bottom

---

## Hydraulic Symbols (ISO 1219-2) - 13 Symbols

### 13. Hydraulic Pump - Fixed (PUMP_FIXED)

**Symbol ID:** `PUMP_FIXED`  
**Dimensions:** 50 × 50  
**Terminals:** `in`, `out`  
**Description:** Fixed displacement pump

**SVG Elements:**

- Circle
- Internal arrow (single, pointing clockwise)
- Solid triangle (fixed displacement indicator)

---

### 14. Hydraulic Pump - Variable (PUMP_VAR)

**Symbol ID:** `PUMP_VAR`  
**Dimensions:** 50 × 50  
**Terminals:** `in`, `out`, `control`  
**Description:** Variable displacement pump

**SVG Elements:**

- Circle
- Internal arrow with adjustment line through it
- Diagonal line (variable displacement indicator)

---

### 15. Hydraulic Motor (MOTOR_HYD)

**Symbol ID:** `MOTOR_HYD`  
**Dimensions:** 50 × 50  
**Terminals:** `in`, `out`, `shaft`  
**Description:** Hydraulic motor (fluid to mechanical)

**SVG Elements:**

- Circle
- Internal arrow (clockwise)
- Shaft line extending from center

---

### 16. Hydraulic Cylinder (CYL_HYD)

**Symbol ID:** `CYL_HYD`  
**Dimensions:** 60 × 30  
**Terminals:** `piston`, `port_A`, `port_B`  
**Description:** Double-acting hydraulic cylinder

**SVG Elements:**

- Rectangle body (thicker walls than pneumatic)
- Piston rod line
- Two port connections
- Cushioning indicators (optional)

---

### 17. Directional Control Valve 4/3 (VALVE_43)

**Symbol ID:** `VALVE_43`  
**Dimensions:** 70 × 50  
**Terminals:** `P`, `A`, `B`, `T` (tank)  
**Description:** 4 ports, 3 positions (center position options)

**SVG Elements:**

- Three rectangular boxes (3 positions)
- Center box shows closed-center, open-center, or tandem-center
- Solenoid actuators at both ends

---

### 18. Pressure Relief Valve (RELIEF_VALVE)

**Symbol ID:** `RELIEF_VALVE`  
**Dimensions:** 40 × 50  
**Terminals:** `in`, `tank`  
**Description:** Limits maximum system pressure

**SVG Elements:**

- Valve body (rectangle)
- Spring symbol above (pressure setting)
- Arrow showing flow to tank when open
- Adjustment screw indicator

---

### 19. Pressure Reducing Valve (REDUCING_VALVE)

**Symbol ID:** `REDUCING_VALVE`  
**Dimensions:** 40 × 50  
**Terminals:** `in`, `out`  
**Description:** Maintains lower pressure downstream

**SVG Elements:**

- Valve body
- Spring with external pilot line
- Flow arrow
- Pressure control symbol

---

### 20. Flow Control Valve (FLOW_CONTROL_HYD)

**Symbol ID:** `FLOW_CONTROL_HYD`  
**Dimensions:** 40 × 40  
**Terminals:** `in`, `out`  
**Description:** Variable flow restriction for hydraulics

**SVG Elements:**

- Square valve body
- Adjustable orifice (arrow through restriction)
- Bypass check valve (optional)

---

### 21. Check Valve (CHECK_VALVE_HYD)

**Symbol ID:** `CHECK_VALVE_HYD`  
**Dimensions:** 40 × 30  
**Terminals:** `in`, `out`  
**Description:** One-way valve for hydraulics

**SVG Elements:**

- Similar to pneumatic but heavier line weight
- Ball and seat design
- Spring preload indicator

---

### 22. Filter (FILTER_HYD)

**Symbol ID:** `FILTER_HYD`  
**Dimensions:** 40 × 40  
**Terminals:** `in`, `out`  
**Description:** Hydraulic fluid filtration

**SVG Elements:**

- Diamond shape (thicker lines)
- Internal mesh pattern
- Drain connection (optional)

---

### 23. Reservoir/Tank (RESERVOIR)

**Symbol ID:** `RESERVOIR`  
**Dimensions:** 50 × 60  
**Terminals:** `return`, `suction`, `vent`  
**Description:** Hydraulic fluid reservoir

**SVG Elements:**

- Rectangle (open top)
- Fluid level line
- Vent line at top
- Return and suction ports

---

### 24. Accumulator (ACCUMULATOR)

**Symbol ID:** `ACCUMULATOR`  
**Dimensions:** 40 × 50  
**Terminals:** `in`  
**Description:** Stores hydraulic energy (gas-charged)

**SVG Elements:**

- Vertical cylinder
- Horizontal dividing line (piston or bladder)
- Gas symbol above line (spring or "N2")
- Fluid connection below

---

### 25. Pressure Gauge (GAUGE_P_HYD)

**Symbol ID:** `GAUGE_P_HYD`  
**Dimensions:** 30 × 30  
**Terminals:** `in`  
**Description:** Hydraulic pressure measurement

**SVG Elements:**

- Circle
- Internal "P" label
- Connection line at bottom

---

## Implementation Notes

### Line Styles

- **Pneumatic:** Thin lines (stroke-width: 1.5-2)
- **Hydraulic:** Thicker lines (stroke-width: 2-2.5)
- **Pilot Lines:** Dashed lines
- **Drain Lines:** Dotted lines

### Color Coding (Optional)

- **Pressure:** Red
- **Return/Exhaust:** Blue
- **Pilot:** Green
- **Drain:** Yellow

### Terminal Naming Convention

- Use descriptive names: `port_A`, `port_B`, `piston`, `tank`
- Maintain consistency with electrical circuit terminals
- Support orthogonal routing (reuse existing code)

### Testing Strategy

1. **Symbol rendering** - Each symbol generates valid SVG
2. **Dimensions** - Width/height match specification
3. **Terminals** - Correct count and positions
4. **ISO compliance** - Visual comparison with standard
5. **Integration** - Works with existing schematic renderer

---

## Market Comparison

| Tool                      | License Cost   | Symbol Count | Standards        |
| ------------------------- | -------------- | ------------ | ---------------- |
| FluidSim (Festo)          | $500+          | 100+         | ISO 1219         |
| Automation Studio (Famic) | $2000+         | 200+         | ISO 1219, CETOP  |
| SmartDraw                 | $300/year      | 50+          | Basic            |
| **Runiq**                 | **Free (MIT)** | **25**       | **ISO 1219-1/2** |

---

## References

- ISO 1219-1:2012 - Fluid power systems and components — Graphic symbols and circuit diagrams — Part 1: Graphic symbols for conventional use and data-processing applications
- ISO 1219-2:2012 - Part 2: Circuit diagrams
- DIN ISO 1219 - German implementation
- IEC 60617 - Graphical symbols for diagrams (electrical equivalents)
