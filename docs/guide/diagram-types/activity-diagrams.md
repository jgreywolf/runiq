---
title: Activity Diagrams
description: Model workflows, business processes, and algorithms with UML 2.5 activity diagrams including action pins, object nodes, swimlanes, signals, and final nodes.
sidebar: guide
tags:
  - diagram-type
  - activity-diagram
lastUpdated: 2025-12-23
---

# Activity Diagrams

Activity diagrams model the flow of control and data through a system. They visualize workflows, business processes, and algorithms using activities, control flows, object flows, and swimlanes.

::: tip Profile Support
Activity diagrams are part of the **Diagram Profile** and support all UML 2.5 activity diagram elements including action pins, object nodes, swimlanes, signals, and final nodes.
:::

## Overview

Activity diagrams are ideal for:

  - **Business Process Modeling** - Order fulfillment, approval workflows
  - **Algorithm Visualization** - Data pipelines, decision trees
  - **Parallel Processing** - Fork/join, concurrent activities
  - **Data Flow Analysis** - Object nodes, central buffers, data stores
  - **Cross-Functional Workflows** - Horizontal and vertical swimlanes

## Basic Structure

```runiq
diagram "Basic Activity Flow" {
  direction TB

  shape start as @initialState
  shape activity1 as @activity label: "Process Data"
  shape decision as @diamond
  shape activity2 as @activity label: "Handle Success"
  shape activity3 as @activity label: "Handle Error"
  shape end as @activityFinal

  start -> activity1
  activity1 -> decision
  decision -> activity2 label: "[valid]"
  decision -> activity3 label: "[invalid]"
  activity2 -> end
  activity3 -> end
}
```

... (content truncated for brevity)
