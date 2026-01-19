# HVAC Diagrams

HVAC diagrams show equipment and duct connections for air handling systems.

## Office HVAC System

```runiq
hvac "Office HVAC System" {
  equipment AHU1 type:air-handling-unit cfm:5000
  equipment Fan1 type:supply-fan cfm:5000
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

## Rooftop Unit

```runiq
hvac "Rooftop Unit" {
  equipment RTU type:air-handling-unit cfm:3500
  equipment Diff1 type:diffuser-supply
  equipment Therm1 type:thermostat

  duct Supply type:supply size:"14x10"
  duct Return type:return size:"18x12"

  connect RTU.out -> Supply -> Diff1.in
  connect Diff1.out -> Return -> RTU.in
}
```

## Zoned VAV System

```runiq
hvac "Zoned VAV System" {
  equipment AHU1 type:air-handling-unit cfm:6000
  equipment VAV1 type:vav-box cfm-max:1200
  equipment VAV2 type:vav-box cfm-max:900
  equipment DiffA type:diffuser-supply
  equipment DiffB type:diffuser-supply

  duct Supply type:supply size:"18x12"
  duct Return type:return size:"22x16"

  connect AHU1.out -> Supply -> VAV1.in
  connect AHU1.out -> Supply -> VAV2.in
  connect VAV1.out -> DiffA.in
  connect VAV2.out -> DiffB.in
  connect DiffA.out -> Return -> AHU1.in
  connect DiffB.out -> Return -> AHU1.in
}
```

## Economizer Loop

```runiq
hvac "Economizer Loop" {
  equipment AHU1 type:air-handling-unit
  equipment OA type:damper-motorized label:"Outside Air Damper"
  equipment RA type:damper-motorized label:"Return Air Damper"
  equipment EXH type:damper-motorized label:"Exhaust Damper"
  equipment Temp type:temperature-sensor label:"Mixed Air Sensor"

  duct Supply type:supply size:"16x10"
  duct Return type:return size:"20x12"
  duct Exhaust type:exhaust size:"16x10"

  connect OA.out -> Supply -> AHU1.in
  connect AHU1.out -> Supply
  connect Return -> RA.in
  connect RA.out -> AHU1.in
  connect AHU1.out -> Exhaust -> EXH.in
  connect Temp.sense -> AHU1.in
}
```
