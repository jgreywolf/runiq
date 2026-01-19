---
title: HVAC Diagrams
description: Model HVAC equipment and ductwork using the hvac profile.
lastUpdated: 2025-02-08
---

# HVAC Diagrams

Use the `hvac` profile to describe HVAC equipment, ductwork, and airflow connections using a schematic-style layout.

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

## Notes

- **Equipment**: Use `equipment` with `type:` to select an HVAC symbol.
- **Ducts**: Use `duct` to define supply/return/exhaust runs and sizes.
- **Connections**: Use `connect` chains to tie equipment and ducts together.

See [Profiles](/guide/profiles) for the full profile list.
