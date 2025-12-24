---
title: BPMN Diagrams
description: Model business processes with BPMN 2.0 including pools, lanes, events, gateways, tasks, and message flows.
sidebar: guide
tags:
  - diagram-type
  - bpmn
lastUpdated: 2025-12-23
---

# BPMN Diagrams

Business Process Model and Notation (BPMN) provides a standardized graphical notation for modeling business processes. BPMN diagrams focus on business workflows with pools, lanes, events, gateways, and tasks.

::: tip Profile Support
BPMN diagrams are part of the **Diagram Profile** and support BPMN 2.0 core elements including pools, lanes, events, gateways, tasks, and message flows.
:::

## Overview

BPMN diagrams are ideal for:

  - **Business Process Documentation** - Standard notation for business analysts
  - **Cross-Organizational Workflows** - Communication between different entities
  - **Process Automation** - Executable business processes
  - **Compliance and Auditing** - Regulatory process documentation
  - **Process Improvement** - Identifying bottlenecks and optimization opportunities

## Key Differences: BPMN vs Activity Diagrams

| Feature           | BPMN                              | Activity Diagrams          |
| ----------------- | --------------------------------- | -------------------------- |
| **Purpose**       | Business process modeling         | Software workflow modeling |
| **Audience**      | Business analysts, stakeholders   | Developers, architects     |
| **Notation**      | BPMN 2.0 standard                 | UML 2.5 activity notation  |
| **Pools**         | Required for cross-organizational | Not used                   |
| **Message Flows** | Explicit message passing          | Implicit communication     |

::: info When to Use BPMN
Choose BPMN when:

  - Modeling business processes for non-technical stakeholders
  - Documenting cross-organizational workflows
  - Requiring BPMN 2.0 compliance
  - Planning process automation with BPMN execution engines

Choose Activity Diagrams when:

  - Modeling software algorithms and control flow
  - Focusing on action pins and data flow
  - Working with technical teams familiar with UML
  :::

## Basic Structure

```runiq
diagram "Simple BPMN Process" {
  direction TB

  container "Process Pool" as @bpmnPool {
    shape start as @bpmnEvent label: "Start" data: [{"eventType": "start"}]
    shape task1 as @bpmnTask label: "Process Order"
    shape task2 as @bpmnTask label: "Send Confirmation"
    shape end as @bpmnEvent label: "End" data: [{"eventType": "end"}]

    start -> task1
    task1 -> task2
    task2 -> end
  }
}
```

... (content preserved from original guide)
