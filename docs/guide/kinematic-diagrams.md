---
title: Kinematic Diagrams
description: Model linkages, joints, and actuators with kinematic shapes in the diagram profile.
lastUpdated: 2025-02-01
---

# Kinematic Diagrams

Kinematic diagrams model motion relationships and mechanical linkages. In Runiq, kinematic shapes live in the **diagram** profile, so you can mix them with standard diagram shapes when needed.

## When to Use Kinematic Shapes

Use kinematic shapes when you want to:

- Illustrate mechanisms (four-bar linkages, slider-cranks)
- Explain joints and degrees of freedom
- Document actuator placement (motors, linear actuators)
- Create motion overviews without geometric CAD detail

## Core Shape Groups

**Joints**

- `@revoluteJoint`, `@prismaticJoint`, `@sphericalJoint`
- `@universalJoint`, `@cylindricalJoint`, `@planarJoint`
- `@fixedJoint`

**Links**

- `@binaryLink`, `@ternaryLink`, `@quaternaryLink`
- `@groundLink`

**Actuators and Elements**

- `@rotaryMotor`, `@linearActuator`
- `@spring`, `@damper`, `@gear`

Full list: see [Shape Reference](/reference/shapes).

## Basic Syntax

Kinematic diagrams are standard `diagram` blocks with kinematic shapes:

```runiq
diagram "Joint Types" {
  direction LR

  shape Rev as @revoluteJoint label: "Revolute"
  shape Pris as @prismaticJoint label: "Prismatic"
  shape Sph as @sphericalJoint label: "Spherical"
  shape Univ as @universalJoint label: "Universal"
  shape Cyl as @cylindricalJoint label: "Cylindrical"
  shape Plan as @planarJoint label: "Planar"

  Rev -> Pris -> Sph -> Univ -> Cyl -> Plan
}
```

## Common Patterns

### Four-Bar Linkage

```runiq
diagram "Four-Bar Linkage" {
  direction LR

  style link fillColor: "#dbeafe" strokeColor: "#2563eb"
  style joint fillColor: "#ffedd5" strokeColor: "#c2410c"
  style ground fillColor: "#e2e8f0" strokeColor: "#475569"

  shape Ground as @groundLink label: "Ground" style:ground
  shape J1 as @revoluteJoint label: "J1" style:joint
  shape L1 as @binaryLink label: "Crank" style:link
  shape J2 as @revoluteJoint label: "J2" style:joint
  shape L2 as @binaryLink label: "Coupler" style:link
  shape J3 as @revoluteJoint label: "J3" style:joint
  shape L3 as @binaryLink label: "Rocker" style:link
  shape J4 as @revoluteJoint label: "J4" style:joint

  Ground -> J1 -> L1 -> J2 -> L2 -> J3 -> L3 -> J4 -> Ground
}
```

### Slider-Crank

```runiq
diagram "Slider-Crank" {
  direction LR

  style link fillColor: "#e0f2fe" strokeColor: "#0284c7"
  style joint fillColor: "#fef3c7" strokeColor: "#b45309"
  style actuator fillColor: "#dcfce7" strokeColor: "#15803d"

  shape Motor as @rotaryMotor label: "Motor" style:actuator
  shape J1 as @revoluteJoint label: "J1" style:joint
  shape Crank as @binaryLink label: "Crank" style:link
  shape J2 as @revoluteJoint label: "J2" style:joint
  shape Rod as @binaryLink label: "Rod" style:link
  shape J3 as @prismaticJoint label: "J3" style:joint
  shape Slider as @linearActuator label: "Slider" style:actuator

  Motor -> J1 -> Crank -> J2 -> Rod -> J3 -> Slider
}
```

### Two-DOF Arm

```runiq
diagram "Two-DOF Arm" {
  direction LR

  style link fillColor: "#ede9fe" strokeColor: "#6d28d9"
  style joint fillColor: "#fee2e2" strokeColor: "#b91c1c"
  style ground fillColor: "#e2e8f0" strokeColor: "#475569"

  shape Base as @groundLink label: "Base" style:ground
  shape J1 as @revoluteJoint label: "Shoulder" style:joint
  shape Link1 as @binaryLink label: "Link 1" style:link
  shape J2 as @revoluteJoint label: "Elbow" style:joint
  shape Link2 as @binaryLink label: "Link 2" style:link
  shape Tool as @ternaryLink label: "Tool" style:link

  Base -> J1 -> Link1 -> J2 -> Link2 -> Tool
}
```

## Tips

- Use `direction LR` for left-to-right kinematic chains.
- Apply styles to separate joints, links, and actuators visually.
- Keep labels short to avoid crowding.
- Mix in standard diagram shapes if you need notes or callouts.

## Examples

See [Kinematic Examples](/examples/kinematic-diagrams) for rendered SVGs and additional DSL samples.
