# Control Logic Diagram Examples

PLC-style control logic diagrams using the control profile.

## Start/Stop Motor (Ladder)

```runiq
control "Motor Start-Stop" {
  variant ladder
  net L1, L2, M1, M2

  part Start type:NO_CONTACT pins:(L1,M1) doc:"Start button"
  part Stop type:NC_CONTACT pins:(M1,M2) doc:"Stop button"
  part Motor type:COIL pins:(M2,L2) doc:"Motor coil"
}
```

## Timer Enable (Function Block)

```runiq
control "Timer Enable" {
  variant fbd
  net L1, L2, EN, DONE

  part Enable type:NO_CONTACT pins:(L1,EN) doc:"Enable"
  part Timer type:TIMER_ON pins:(EN,DONE) doc:"TON 2s"
  part Coil type:COIL pins:(DONE,L2) doc:"Output"
}
```

## Notes

- Use `variant ladder` or `variant fbd` to switch layout intent.
- Control diagrams render through the schematic engine, so nets and parts drive layout.

## Legacy block diagrams

Control system block diagrams with transfer functions are still supported in the diagram profile for compatibility, but they are no longer the primary control documentation path.
