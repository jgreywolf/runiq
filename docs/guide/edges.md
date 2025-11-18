---
title: Edges & Connections
description: Connect shapes with arrows, lines, and edges using flexible syntax with anchors, labels, and styling.
lastUpdated: 2025-01-09
---

# Edges & Connections

Edges connect shapes to show relationships, data flow, and dependencies in your diagrams.

## Basic Edge Syntax

### Simple Connection

```runiq
diagram "Basic Connection" {

  shape A as @rect label: "Start"
  shape B as @rect label: "End"

  A -> B
}
```

### Labeled Edges

```runiq
diagram "Labeled Edges" {

  shape Login as @rounded label: "Login"
  shape Validate as @rect label: "Validate"
  shape Dashboard as @hexagon label: "Dashboard"

  Login -> Validate label: "submit credentials"
  Validate -> Dashboard label: "success"
}
```

## Conditional Edges

For decision points and branching logic:

```runiq
diagram "Decision Flow" {

  shape Check as @rhombus label: "Valid?"
  shape Success as @hexagon label: "Success"
  shape Error as @doc label: "Error"

  Check -yes-> Success
  Check -no-> Error
}
```

## Edge Styles

### Line Styles

```runiq
diagram "Line Styles"{

  shape A as @rect label: "A"
  shape B as @rect label: "B"
  shape C as @rect label: "C"
  shape D as @rect label: "D"

  A -> B lineStyle: "solid"
  A -> C lineStyle: "dashed"
  A -> D lineStyle: "dotted"
}
```

Available line styles:

- `solid` (default)
- `dashed`
- `dotted`

### Arrow Types

```runiq
diagram "Arrow Types" {

  shape A as @rect label: "A"
  shape B as @rect label: "B"
  shape C as @rect label: "C"

  A -> B  # Standard arrow // default
  A -> C arrowType: hollow // Hollow arrow
  B -> D arrowType: open   // Open arrow
}
```

### Colors

```runiq
diagram "Colored Edges" {

  shape A as @rect label: "A"
  shape B as @rect label: "B"
  shape C as @rect label: "C"

  A -> B stroke: "#2196f3"
  A -> C stroke: "#4caf50" lineStyle: "dashed"
}
```

## UML Relationships

### Association Types

```runiq
diagram "UML Associations" {

  shape ClassA as @rect label: "ClassA"
  shape ClassB as @rect label: "ClassB"
  shape ClassC as @rect label: "ClassC"
  shape ClassD as @rect label: "ClassD"

  ClassA -> ClassB relationship: association
  ClassA -> ClassC relationship: aggregation
  ClassA -> ClassD relationship: composition
}
```

### Stereotypes

```runiq
diagram "Use Case Stereotypes" {

  shape Login as @actor label: "User"
  shape UseCase as @ellipseWide label: "Login"
  shape Extended as @ellipseWide label: "Validate Token"

  Login -> UseCase
  UseCase -> Extended stereotype: "extend"
}
```

Common stereotypes:

- `<<include>>` - Required behavior
- `<<extend>>` - Optional extension
- `<<implements>>` - Interface implementation
- `<<uses>>` - Dependency

## Edge Direction

### Bidirectional

```runiq
diagram "Bidirectional" {

  shape Client as @rect label: "Client"
  shape Server as @rect label: "Server"

  Client <-> Server label: "TCP Connection"
}
```

### Multiple Connections

```runiq
diagram "Multiple Paths" {

  shape A as @rect label: "A"
  shape B as @rect label: "B"
  shape C as @rect label: "C"

  A -> B label: "data"
  A -> C label: "control"
  B -> C label: "sync"
}
```

## Advanced Features

### Feedback Loops

```runiq
diagram "Feedback System" {
  direction LR

  shape Input as @doc label: "Input"
  shape Controller as @rect label: "Controller"
  shape Plant as @rect label: "Plant"
  shape Output as @doc label: "Output"

  Input -> Controller
  Controller -> Plant
  Plant -> Output
  Output -> Controller label: "feedback" lineStyle: "dashed"
}
```

### Container Crossing Edges

Edges can connect shapes across different containers:

```runiq
diagram "Cross-Container" {

  container "Frontend" {
    shape UI as @rect label: "UI"
  }

  container "Backend" {
    shape API as @rect label: "API"
  }

  UI -> API label: "HTTP Request"
}
```

## Best Practices

### 1. **Use Meaningful Labels**

❌ Bad:

```runiq
A -> B label: "goes to"
```

✅ Good:

```runiq
Login -> Authenticate label: "submit credentials"
```

### 2. **Keep It Simple**

- Avoid too many edges from one node (max 4-5)
- Use containers to group related connections
- Consider splitting complex diagrams

### 3. **Consistent Styling**

```runiq
diagram "Styled Edges" {
  // Define styles for edge types
  style error_edge stroke:"#d32f2f" lineStyle:"dashed"
  style success_edge stroke:"#388e3c"

  shape A as @rectangle label:"Label"
  shape B as @rectangle label:"B"
  shape C as @rectangle label:"C"

  A -> B style:success_edge
  A -> C style:error_edge
}
```

### 4. **Layout Direction**

Choose direction based on flow:

- `TB` (Top-Bottom) - Sequential processes
- `LR` (Left-Right) - Signal flow, timelines
- `BT` (Bottom-Top) - Hierarchy
- `RL` (Right-Left) - Reverse flow

```runiq
diagram "Signal Flow" {
  direction LR

  shape Input as @doc label: "Input"
  shape Process as @rect label: "Process"
  shape Output as @doc label: "Output"

  Input -> Process -> Output
}
```

## Common Patterns

### Decision Trees

```runiq
diagram "Decision Tree" {
  direction TB

  shape Root as @decision label: "Condition 1?"
  shape Branch1 as @decision label: "Condition 2?"
  // @decision and @rhombus are the same
  shape Branch2 as @rhombus label: "Condition 3?"
  shape Result1 as @hexagon label: "Result A"
  shape Result2 as @hexagon label: "Result B"
  shape Result3 as @hexagon label: "Result C"

  Root -yes-> Branch1
  Root -no-> Branch2
  Branch1 -yes-> Result1
  Branch1 -no-> Result2
  Branch2 -yes-> Result2
  Branch2 -no-> Result3
}
```

### State Machines

```runiq
diagram "State Machine" {

  shape Idle as @rounded label: "Idle"
  shape Processing as @rect label: "Processing"
  shape Complete as @hexagon label: "Complete"
  shape Error as @doc label: "Error"

  Idle -> Processing label: "start"
  Processing -> Complete label: "success"
  Processing -> Error label: "failure"
  Error -> Idle label: "reset"
  Complete -> Idle label: "reset"
}
```

### Sequence Flow

```runiq
diagram "Sequence" {
direction LR

  shape Step1 as @rounded label: "Step 1"
  shape Step2 as @rect label: "Step 2"
  shape Step3 as @rect label: "Step 3"
  shape Step4 as @hexagon label: "Complete"

  Step1 -> Step2 -> Step3 -> Step4
}
```

## Edge Properties Reference

| Property       | Type                                                                                     | Default | Example                       |
| -------------- | ---------------------------------------------------------------------------------------- | ------- | ----------------------------- |
| `label`        | string                                                                                   | -       | `label: "submit"`             |
| `weight`       | number                                                                                   | -       | `weight: 10`                  |
| `lineStyle`    | solid \| dashed \| dotted                                                                | solid   | `lineStyle: dashed`           |
| `stroke`       | color                                                                                    | #444    | `stroke: "#2196f3"`           |
| `strokeWidth`  | number                                                                                   | 2       | `strokeWidth: 3`              |
| `relationship` | association \| aggregation \| composition \| dependency \| generalization \| realization | -       | `relationship: composition`   |
| `stereotype`   | string                                                                                   | -       | `stereotype: "<<include>>"`   |
| `navigability` | source \| target \| bidirectional \| none                                                | -       | `navigability: bidirectional` |

### Weighted Edges

Use the `weight` property for weighted graphs (costs, distances, capacities):

```runiq
diagram "Weighted Network" {
  container "Network" algorithm: force {
    shape a as @circle label:"A"
    shape b as @circle label:"B"
    shape c as @circle label:"C"

    a -> b weight: 10 label:"10 mi"
    b -> c weight: 5 label:"5 mi"
    a -> c weight: 15 label:"15 mi"
  }
}
```

See [Weighted Graphs Guide](./weighted-graphs.md) for more examples and use cases.

## See Also

- [Shapes Overview](/guide/shapes) - Available shape types
- [Styling](/guide/styling) - Customize appearance
- [Layout](/guide/layout) - Control diagram layout
- [Weighted Graphs](/guide/weighted-graphs) - Weighted graph examples
- [Edge Reference](/reference/edges) - Complete edge syntax reference
