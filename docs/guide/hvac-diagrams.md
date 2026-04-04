---
title: HVAC Diagrams
description: Model HVAC equipment, ductwork, airflow distribution, and plant equipment using the hvac profile.
lastUpdated: 2026-04-04
---

# HVAC Diagrams

Use the `hvac` profile to describe HVAC equipment, ductwork, airflow distribution, and plant-side components using a schematic-style layout. The profile is designed for conceptual airside diagrams, equipment relationships, and control-oriented documentation rather than fabrication-level sheet-metal detailing.

## Supported HVAC Elements

Runiq currently supports:

- Air handling: `air-handling-unit`, `supply-fan`, `return-fan`, `exhaust-fan`, `filter`
- Conditioning: `heating-coil`, `cooling-coil`, `humidifier`, `dehumidifier`
- Distribution: `vav-box`, `diffuser-supply`, `diffuser-return`
- Dampers: `damper-motorized`, `damper-manual`, `damper-fire`
- Controls and sensing: `thermostat`, `temperature-sensor`, `pressure-sensor`
- Plant equipment: `chiller`, `boiler`, `cooling-tower`, `pump`, `heat-exchanger`
- Ducts: `supply`, `return`, `exhaust`

## Basic System

```runiq
hvac "Office HVAC System" {
  equipment AHU1 type:air-handling-unit cfm:5000
  equipment Coil1 type:cooling-coil capacity:"10 tons"
  equipment VAV1 type:vav-box cfm-max:1000
  equipment Diff1 type:diffuser-supply

  duct Supply type:supply size:"16x12"
  duct Return type:return size:"20x14"

  connect AHU1.out -> Supply -> VAV1.in
  connect VAV1.out -> Diff1.in
  connect Diff1.out -> Return -> AHU1.in
}
```

## Airside Example

```runiq
hvac "Airside AHU With Return And Exhaust" {
  equipment AHU1 type:air-handling-unit cfm:12000
  equipment SF1 type:supply-fan cfm:12000
  equipment RF1 type:return-fan cfm:10000
  equipment EF1 type:exhaust-fan cfm:2000
  equipment FILT1 type:filter
  equipment HCOIL1 type:heating-coil capacity:"250 kBtu/h"
  equipment CCOIL1 type:cooling-coil capacity:"30 tons"
  equipment DM1 type:damper-motorized
  equipment FD1 type:damper-fire
  equipment VAV1 type:vav-box cfm-max:1800
  equipment DIFF1 type:diffuser-supply
  equipment RET1 type:diffuser-return

  duct SA type:supply size:"30x20"
  duct RA type:return size:"26x18"
  duct EA type:exhaust size:"16x12"

  connect AHU1.out -> SF1.in
  connect SF1.out -> FILT1.in
  connect FILT1.out -> HCOIL1.in
  connect HCOIL1.out -> CCOIL1.in
  connect CCOIL1.out -> SA -> DM1.in
  connect DM1.out -> FD1.in
  connect FD1.out -> VAV1.in
  connect VAV1.out -> DIFF1.in
  connect RET1.out -> RA -> RF1.in
  connect RF1.out -> AHU1.in
  connect RF1.out -> EA -> EF1.in
}
```

## Plant Example

```runiq
hvac "Hydronic Plant Overview" {
  equipment CH1 type:chiller capacity:"120 tons"
  equipment CT1 type:cooling-tower capacity:"120 tons"
  equipment BLR1 type:boiler capacity:"500 kBtu/h"
  equipment P1 type:pump gpm:120
  equipment P2 type:pump gpm:120
  equipment HX1 type:heat-exchanger capacity:"300 kBtu/h"
  equipment TS1 type:temperature-sensor
  equipment PS1 type:pressure-sensor
  equipment TSTAT1 type:thermostat

  connect CH1.out -> P1.in
  connect P1.out -> HX1.in
  connect HX1.out -> CT1.in
  connect CT1.out -> CH1.in
  connect BLR1.out -> P2.in
  connect P2.out -> HX1.in
  connect HX1.out -> BLR1.in
}
```

## Notes

- **Equipment**: Use `equipment` with `type:` to select an HVAC symbol.
- **Ducts**: Use `duct` to define supply, return, or exhaust runs and assign sizes.
- **Connections**: Use `connect` chains to tie equipment and ducts together.
- **Ports**: Most equipment exposes `in` and `out`; sensors use `sense`. Ducts accept `in` and `out`.
- **Metadata**: Extra properties like `cfm`, `cfm-max`, `capacity`, or `gpm` are accepted as key/value pairs.
- **Labels**: Metadata values render below equipment when enabled in the schematic renderer.
- **Airflow**: HVAC connections render with flow arrows by default.

## Comparison with Other Tools

| Feature                      | Runiq                        | Visio HVAC Stencils | AutoCAD MEP | Revit MEP | Lucidchart |
| ---------------------------- | ---------------------------- | ------------------- | ----------- | --------- | ---------- |
| **Text-Based DSL**           | ✅                           | ❌                  | ❌          | ❌        | ❌         |
| **Version Control Friendly** | ✅                           | ❌                  | ⚠️ Limited  | ⚠️ Limited | ⚠️ Limited |
| **Airside Schematic Support**| ✅                           | ✅                  | ✅          | ✅        | ⚠️ Basic   |
| **Plant Equipment Diagrams** | ✅                           | ⚠️ Limited          | ✅          | ✅        | ⚠️ Basic   |
| **Fabrication Detailing**    | ❌                           | ❌                  | ✅          | ✅        | ❌         |
| **BIM / Coordination Model** | ❌                           | ❌                  | ⚠️ Partial  | ✅        | ❌         |
| **Documentation As Code**    | ✅                           | ❌                  | ❌          | ❌        | ❌         |

**Key Advantages of Runiq:**

- **Version-control native** - HVAC system documentation lives cleanly in Git
- **Fast conceptual modeling** - good for airside, plant, and controls-oriented diagrams
- **Unified language** - HVAC views sit beside P&ID, electrical, flowchart, and architecture diagrams
- **Readable metadata** - airflow and capacity information can render directly on symbols

**When to Use Alternatives:**

- **Revit MEP**: full BIM coordination, schedules, and multidisciplinary building design
- **AutoCAD MEP**: fabrication-oriented drafting and detailed building-system documentation
- **Visio / Lucidchart**: lightweight GUI-only diagramming when code-native workflows are not needed

See [Profiles](/guide/profiles) for the full profile list.
