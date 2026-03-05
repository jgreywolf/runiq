---
title: Control Logic Diagrams
description: Create PLC-style ladder and function block diagrams using the control profile.
lastUpdated: 2026-02-08
---

# Control Logic Diagrams

The control profile targets PLC-style ladder and function block diagrams using the schematic renderer. It shares the same `part` and `net` syntax as electrical and hydraulic profiles, but with control-specific symbols.

## Supported elements

- Contacts and coils: normally open, normally closed, set/reset coils
- Timers: timer-on (TON) blocks
- Nets: named rails and rungs

## Example: Ladder rung

```runiq
control "Motor Start-Stop" {
  variant ladder
  net L1, L2, M1, M2

  part Start type:NO_CONTACT pins:(L1,M1) doc:"Start button"
  part Stop type:NC_CONTACT pins:(M1,M2) doc:"Stop button"
  part Motor type:COIL pins:(M2,L2) doc:"Motor coil"
}
```

## Example: Function block diagram

```runiq
control "Timer Enable" {
  variant fbd
  net L1, L2, EN, DONE

  part Enable type:NO_CONTACT pins:(L1,EN) doc:"Enable"
  part Timer type:TIMER_ON pins:(EN,DONE) doc:"TON 2s"
  part Coil type:COIL pins:(DONE,L2) doc:"Output"
}
```

## Layout tips

- Prefer short net names for cleaner rungs.
- Add `variant ladder` or `variant fbd` to signal the intended style.

## Legacy control system blocks

Block-diagram control system shapes (transfer functions, summing junctions) remain available in the diagram profile for backward compatibility, but new control logic work should use the control profile.

## Examples

See the [examples/control-diagrams](../examples/control-diagrams) page for more examples.
