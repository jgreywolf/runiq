---
title: DSL Syntax
---

# DSL Syntax Reference

This page shows the core DSL constructs with concise examples and rendered outputs when available.

## Diagram header

```runiq
diagram "My Diagram" {
  direction LR
}
```

Options:

- direction TB | LR | BT | RL
- title: optional string (used by renderers)

## Shapes

```runiq
shape Start   as @terminator label:"Start"
shape Action  as @rect       label:"Do work"
shape Decide  as @rhombus    label:"OK?"
shape Note    as @doc        label:"Note"
shape Actor   as @actor      label:"User"
shape DB      as @cylinder   label:"Database"
```

## Edges

```runiq
Start -> Action : begins
Action -> Decide
Decide -yes-> DB : write
Decide[no]  -> Note : warn
```

Edge adornments:

- Labels: `: text`
- Branches: `[yes]`, `[no]`, or custom `[label]`
- Styles via named styles or direct style on edge (see Styles)

## Styles

```runiq
style default fill:#f7f7ff strokeColor:#444
style decision fill:#fff7e6 strokeColor:#aa7700

shape Decide as @rhombus label:"OK?" style:decision
```

Supported style keys vary by renderer; common keys include `fill`, `stroke`, `strokeWidth`, `fontSize`.

## Containers

```runiq
container System {
  children: [Web, API]
}

shape Web as @rect label:"Web"
shape API as @rect label:"API"

Web -> API
```

Nested containers are supported. See the Containers guide for layout details.

## Electrical profile

```runiq
electrical"LED Circuit" {
  net VCC, GND, N1

  part V1 type:V value:"5V" pins:(VCC,GND)
  part R1 type:R value:"220" pins:(VCC,N1)
  part D1 type:LED pins:(N1,GND)
  part GND1 type:GND pins:(GND)
}
```

The electrical profile uses electrical circuit symbols and enables SPICE/Verilog export.

---

## Examples (rendered)

### Flowchart

```runiq
diagram "Auth Flow" {
  direction LR

  style default fill:"#f7f7ff" strokeColor:"#444"
  style decisionStyle fill:"#fff7e6" strokeColor:"#aa7700"

  shape User     as @actor   label:"Visitor"
  shape Landing  as @rounded label:"Landing Page"
  shape Check    as @rhombus label:"Signed up?" style:decisionStyle
  shape Welcome  as @hexagon     label:"Welcome"

  User -> Landing
  Landing -> Check
  Check -yes-> Welcome
  Check -no-> Landing
}
```

<img src="/examples/auth-flow.svg" alt="Auth Flow" style="max-width: 700px;" />

### Electrical (analog)

```runiq
electrical"Voltage Divider" {
  net VCC, VOUT, GND

  part V1 type:V value:"12V" pins:(VCC,GND)
  part R1 type:R value:"10k" pins:(VCC,VOUT)
  part R2 type:R value:"10k" pins:(VOUT,GND)
}
```

<img src="/examples/voltage-divider.svg" alt="Voltage Divider" style="max-width: 700px;" />
