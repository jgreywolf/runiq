---
title: Flowcharts
description: Create flowcharts with process steps, decisions, loops, and connectors for algorithm visualization and process documentation.
lastUpdated: 2025-01-09
---

# Flowcharts

Create professional flowcharts using ISO 5807 standard symbols with Runiq's diagram profile.

## Overview

Flowcharts visualize processes, algorithms, and workflows using standardized symbols. Runiq provides 14+ specialized flowchart shapes including documents, manual input, delays, displays, and more.

## Key Shapes

Flowcharts use a combination of basic shapes and specialized flowchart symbols:

- **Process**: `@rectangle` or `@predefinedProcess`
- **Decision**: `@rhombus`
- **Start/End**: `@roundedRectangle` or `@stadium`
- **Document**: `@document`, `@multiDocument`, `@linedDocument`
- **Input/Output**: `@parallelogram`, `@manualInput`
- **Display**: `@display`
- **Delay**: `@delay`
- **Off-Page Connector**: `@offPageConnector`

See the [Shape Reference - Flowchart Shapes](/reference/shapes#_2-flowchart-shapes-14-shapes) for the complete list.

## Basic Flowchart

```runiq
diagram "Simple Process" {
  direction TB

  shape start as @stadium label: "Start"
  shape input as @parallelogram label: "Get Input"
  shape process as @rectangle label: "Process Data"
  shape decision as @rhombus label: "Valid?"
  shape output as @document label: "Generate Report"
  shape end as @stadium label: "End"

  start -> input
  input -> process
  process -> decision
  decision -> output label: "Yes"
  decision -> input label: "No"
  output -> end
}
```

## Algorithm Flowchart

Example showing a bubble sort algorithm:

```runiq
diagram "Bubble Sort Algorithm" {
  direction TB

  shape start as @stadium label: "Start"
  shape init as @rectangle label: "i = 0"
  shape outerCheck as @rhombus label: "i < n-1?"
  shape innerInit as @rectangle label: "j = 0"
  shape innerCheck as @rhombus label: "j < n-i-1?"
  shape compare as @rhombus label: "arr[j] > arr[j+1]?"
  shape swap as @rectangle label: "Swap elements"
  shape innerInc as @rectangle label: "j++"
  shape outerInc as @rectangle label: "i++"
  shape end as @stadium label: "End"

  start -> init
  init -> outerCheck
  outerCheck -> innerInit label: "Yes"
  outerCheck -> end label: "No"
  innerInit -> innerCheck
  innerCheck -> compare label: "Yes"
  innerCheck -> outerInc label: "No"
  compare -> swap label: "Yes"
  compare -> innerInc label: "No"
  swap -> innerInc
  innerInc -> innerCheck
  outerInc -> outerCheck
}
```

## ETL Pipeline

Example showing data processing workflow:

```runiq
diagram "ETL Pipeline" {
  direction LR

  shape extract as @cylinder label: "Source DB"
  shape read as @rectangle label: "Extract Data"
  shape transform as @rectangle label: "Transform"
  shape validate as @rhombus label: "Valid?"
  shape load as @rectangle label: "Load to DW"
  shape error as @document label: "Error Log"
  shape success as @display label: "Success"

  extract -> read
  read -> transform
  transform -> validate
  validate -> load label: "Yes"
  validate -> error label: "No"
  load -> success
}
```

## State Machine

Flowcharts can represent state transitions:

```runiq
diagram "Order State Machine" {
  direction LR

  shape pending as @circle label: "Pending"
  shape processing as @circle label: "Processing"
  shape shipped as @circle label: "Shipped"
  shape delivered as @doubleCircle label: "Delivered"
  shape cancelled as @crossCircle label: "Cancelled"

  pending -> processing label: "confirm"
  processing -> shipped label: "dispatch"
  shipped -> delivered label: "complete"
  pending -> cancelled label: "cancel"
  processing -> cancelled label: "cancel"
}
```

## Styling

Apply consistent styling to flowchart elements:

```runiq
diagram "Styled Flowchart" {
  direction TB

  shape start as @stadium label: "Start" fill: "#4ade80" color: "#ffffff"
  shape process as @rectangle label: "Process" fill: "#60a5fa" color: "#ffffff"
  shape decision as @rhombus label: "Decision?" fill: "#fbbf24" color: "#000000"
  shape end as @stadium label: "End" fill: "#f87171" color: "#ffffff"

  start -> process
  process -> decision
  decision -> end label: "Done" style: { stroke: "#10b981", strokeWidth: 2 }
}
```

## Best Practices

1. **Use standard symbols** - Follow ISO 5807 conventions for clarity
2. **Clear flow direction** - Use `direction TB` (top-bottom) or `LR` (left-right)
3. **Label decision branches** - Always label Yes/No or conditions on decision edges
4. **Keep it simple** - Break complex flows into multiple diagrams
5. **Consistent styling** - Use color coding for different types of operations
6. **Document inputs/outputs** - Use `@parallelogram` or `@document` shapes

## Comparison with Other Tools

| Feature                      | Runiq                       | Mermaid      | PlantUML     | Lucidchart         | Draw.io        | Visio              |
| ---------------------------- | --------------------------- | ------------ | ------------ | ------------------ | -------------- | ------------------ |
| **Text-Based DSL**           | ✅ Yes                      | ✅ Yes       | ✅ Yes       | ❌ No (GUI)        | ❌ No (GUI)    | ❌ No (GUI)        |
| **Version Control Friendly** | ✅ Yes                      | ✅ Yes       | ✅ Yes       | ⚠️ Limited         | ⚠️ Limited     | ❌ No              |
| **ISO 5807 Compliance**      | ✅ Full standard shapes     | ⚠️ Basic     | ⚠️ Basic     | ✅ Yes             | ✅ Yes         | ✅ Yes             |
| **Auto-Layout**              | ✅ ELK (Hierarchical)       | ✅ Dagre     | ✅ GraphViz  | ✅ Manual+Auto     | ✅ Manual+Auto | ✅ Manual+Auto     |
| **14+ Flowchart Shapes**     | ✅ Yes (Document, Display+) | ❌ Limited   | ⚠️ 8 shapes  | ✅ 20+             | ✅ 20+         | ✅ 30+             |
| **Custom Styling**           | ✅ Per-shape & global       | ⚠️ Themes    | ⚠️ Limited   | ✅ Full control    | ✅ Full        | ✅ Full            |
| **Edge Labels**              | ✅ Yes/No + custom text     | ✅ Yes       | ✅ Yes       | ✅ Yes             | ✅ Yes         | ✅ Yes             |
| **Conditional Branching**    | ✅ Clear decision syntax    | ✅ Yes       | ✅ Yes       | ✅ Manual          | ✅ Manual      | ✅ Manual          |
| **Subprocesses**             | ✅ Via containers/profiles  | ⚠️ Subgraphs | ⚠️ Boxes     | ✅ Yes             | ✅ Yes         | ✅ Yes             |
| **Export Formats**           | ✅ SVG, PNG, PDF            | ✅ SVG, PNG  | ✅ PNG, SVG  | ✅ Many formats    | ✅ Many        | ✅ Many            |
| **Collaboration**            | ✅ Git-based                | ✅ Git-based | ✅ Git-based | ✅ Cloud (Paid)    | ✅ Cloud       | ❌ Desktop-based   |
| **Learning Curve**           | ⚠️ Moderate (DSL)           | ✅ Low       | ⚠️ Moderate  | ✅ Low (GUI)       | ✅ Low         | ⚠️ Moderate        |
| **Real-Time Collaboration**  | ⚠️ Via Git                  | ⚠️ Via tools | ⚠️ Via tools | ✅ Yes             | ✅ Yes         | ⚠️ SharePoint only |
| **Open Source**              | ✅ MIT License              | ✅ MIT       | ✅ GPL       | ❌ Commercial only | ✅ Apache 2.0  | ❌ Commercial only |

**Runiq Advantages:**

- **Unified language** for flowcharts, sequence, class, BPMN, and 15+ diagram types
- **ISO 5807 compliance** with all standard flowchart symbols
- **Advanced shapes** like `@multiDocument`, `@display`, `@delay`, `@offPageConnector`
- **ELK layout engine** for superior hierarchical layouts
- **Version control native** - perfect for CI/CD pipelines
- **Profile system** for diagram-specific conventions (flowchart, bpmn, sequence, etc.)

## Examples

See the [examples/flowcharts](../examples/flowcharts) directory for more complete examples:

- Bubble sort algorithm
- ETL pipeline
- Order state machine
- Three-tier web application

## Related

- [Shape Reference - Flowchart Shapes](/reference/shapes#_2-flowchart-shapes-14-shapes)
- [Shape Reference - Basic Shapes](/reference/shapes#_1-basic-shapes-19-shapes)
- [Edges & Connections](/guide/edges)
- [Styling](/guide/styling)
