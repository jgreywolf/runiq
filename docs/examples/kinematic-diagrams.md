# Kinematic Diagram Examples

Kinematic diagrams focus on motion relationships, joints, links, and actuators. These examples use the standard `diagram` profile with kinematic shapes.

## Four-Bar Linkage

### DSL Code

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

### Generated SVG

![Four-Bar Linkage](/examples/kinematic/four-bar-linkage.svg)

## Slider-Crank

### DSL Code

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

### Generated SVG

![Slider-Crank](/examples/kinematic/slider-crank.svg)

## Two-DOF Arm

### DSL Code

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

### Generated SVG

![Two-DOF Arm](/examples/kinematic/two-dof-arm.svg)

## Walking Mechanism

### DSL Code

```runiq
diagram "Walking Mechanism" {
  direction LR

  style link fillColor: "#e2e8f0" strokeColor: "#475569"
  style joint fillColor: "#fee2e2" strokeColor: "#b91c1c"
  style actuator fillColor: "#dcfce7" strokeColor: "#15803d"

  shape Hip as @revoluteJoint label: "Hip" style:joint
  shape Leg as @binaryLink label: "Upper Leg" style:link
  shape Knee as @revoluteJoint label: "Knee" style:joint
  shape Shin as @binaryLink label: "Lower Leg" style:link
  shape Ankle as @revoluteJoint label: "Ankle" style:joint
  shape Foot as @binaryLink label: "Foot" style:link
  shape Spring as @spring label: "Spring" style:actuator

  Hip -> Leg -> Knee -> Shin -> Ankle -> Foot
  Knee -> Spring
}
```

### Generated SVG

![Walking Mechanism](/examples/kinematic/walking-mechanism.svg)

## Gripper Mechanism

### DSL Code

```runiq
diagram "Gripper Mechanism" {
  direction LR

  style link fillColor: "#e0f2fe" strokeColor: "#0284c7"
  style joint fillColor: "#fef3c7" strokeColor: "#b45309"
  style actuator fillColor: "#dcfce7" strokeColor: "#15803d"

  shape Base as @groundLink label: "Base"
  shape J1 as @revoluteJoint label: "J1" style:joint
  shape Link1 as @binaryLink label: "Link" style:link
  shape Gripper as @gripperParallel label: "Gripper" style:actuator
  shape Mount as @toolMount label: "Tool Mount" style:actuator

  Base -> J1 -> Link1 -> Gripper
  Gripper -> Mount
}
```

### Generated SVG

![Gripper Mechanism](/examples/kinematic/gripper-mechanism.svg)

## Next Steps

- [Kinematic Diagrams Guide](/guide/kinematic-diagrams)
- [Shape Reference](/reference/shapes)
