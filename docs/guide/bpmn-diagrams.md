---
title: BPMN Diagrams
description: Model business processes with BPMN 2.0 including pools, lanes, events, gateways, tasks, and message flows.
lastUpdated: 2025-01-09
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

| Feature           | BPMN                                    | Activity Diagrams          |
| ----------------- | --------------------------------------- | -------------------------- |
| **Purpose**       | Business process modeling               | Software workflow modeling |
| **Audience**      | Business analysts, stakeholders         | Developers, architects     |
| **Notation**      | BPMN 2.0 standard                       | UML 2.5 activity notation  |
| **Pools**         | Required for cross-organizational       | Not used                   |
| **Message Flows** | Explicit message passing                | Implicit communication     |
| **Events**        | Rich event types (timer, error, signal) | Basic start/end nodes      |

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

## Pools and Lanes

### Pools

Pools represent different organizations, systems, or participants. Use `@bpmnPool` as the container type:

```runiq
diagram "Multi-Pool Process" {
  direction TB

  container "Customer" as @bpmnPool {
    shape c1 as @bpmnEvent label: "Start" data: [{"eventType": "start"}]
    shape c2 as @bpmnTask label: "Place Order"
    shape c3 as @bpmnTask label: "Receive Product"
    shape c4 as @bpmnEvent label: "End" data: [{"eventType": "end"}]

    c1 -> c2
    c2 -> c3
    c3 -> c4
  }

  container "Vendor" as @bpmnPool {
    shape v1 as @bpmnTask label: "Receive Order"
    shape v2 as @bpmnTask label: "Process Order"
    shape v3 as @bpmnTask label: "Ship Product"

    v1 -> v2
    v2 -> v3
  }

  # Message flows between pools
  c2 -> v1 label: "Order Request"
  v3 -> c3 label: "Shipment"
}
```

::: tip Pool Usage

- Each pool represents an independent participant (organization, system, or role)
- Sequence flows (solid arrows) only connect shapes **within** a pool
- Message flows (dashed arrows) connect shapes **between** pools
- Pools are mandatory for cross-organizational processes
  :::

### Lanes

Lanes subdivide pools by department, role, or responsibility:

```runiq
diagram "Process with Lanes" {
  direction LR

  container "Order Fulfillment" as @bpmnPool {
    # Sales lane
    container "Sales" {
      shape s1 as @bpmnTask label: "Review Order"
      shape s2 as @bpmnTask label: "Approve Order"
    }

    # Warehouse lane
    container "Warehouse" {
      shape w1 as @bpmnTask label: "Pick Items"
      shape w2 as @bpmnTask label: "Pack Items"
    }

    # Shipping lane
    container "Shipping" {
      shape sh1 as @bpmnTask label: "Generate Label"
      shape sh2 as @bpmnTask label: "Ship Package"
    }

    # Flow across lanes
    s1 -> s2
    s2 -> w1
    w1 -> w2
    w2 -> sh1
    sh1 -> sh2
  }
}
```

## Events

Events represent something that happens during the process.

### Event Types

Events are created with `@bpmnEvent` and use the `data` property to specify type:

```runiq
# Start event
shape start as @bpmnEvent label: "Start" data: [{"eventType": "start"}]

# End event
shape end as @bpmnEvent label: "End" data: [{"eventType": "end"}]

# Intermediate event (timer, message, error, etc.)
shape timer as @bpmnEvent label: "Wait 5 Days" data: [{"eventType": "timer"}]
shape msg as @bpmnEvent label: "Receive Approval" data: [{"eventType": "message"}]
shape error as @bpmnEvent label: "Handle Error" data: [{"eventType": "error"}]
```

### Common Event Types

| Event Type    | Usage               | Symbol         |
| ------------- | ------------------- | -------------- |
| `start`       | Process start point | Thin circle    |
| `end`         | Process termination | Thick circle   |
| `timer`       | Time-based trigger  | Clock icon     |
| `message`     | Message receipt     | Envelope icon  |
| `error`       | Error handling      | Lightning bolt |
| `signal`      | Signal broadcast    | Triangle       |
| `conditional` | Condition-based     | Document icon  |

Example with multiple event types:

```runiq
diagram "Event-Driven Process" {
  direction TB

  container "Approval Process" as @bpmnPool {
    shape start as @bpmnEvent label: "Start" data: [{"eventType": "start"}]
    shape submitTask as @bpmnTask label: "Submit Request"

    # Timer event - wait 2 days
    shape waitTimer as @bpmnEvent label: "Wait 2 Days" data: [{"eventType": "timer"}]

    # Message event - wait for approval
    shape waitApproval as @bpmnEvent label: "Wait for Approval" data: [{"eventType": "message"}]

    shape processTask as @bpmnTask label: "Process Request"

    # End events
    shape endSuccess as @bpmnEvent label: "Approved" data: [{"eventType": "end"}]
    shape endError as @bpmnEvent label: "Error" data: [{"eventType": "error"}]

    start -> submitTask
    submitTask -> waitTimer
    waitTimer -> waitApproval
    waitApproval -> processTask
    processTask -> endSuccess
    processTask -> endError label: "[error]"
  }
}
```

## Gateways

Gateways control the flow of the process based on conditions.

### Gateway Types

Use `@bpmnGateway` with the `data` property:

```runiq
# Exclusive gateway (XOR) - one path taken
shape xorGateway as @bpmnGateway label: "Approved?"
  data: [{"gatewayType": "exclusive"}]

# Parallel gateway (AND) - all paths taken
shape andGateway as @bpmnGateway label: "Split"
  data: [{"gatewayType": "parallel"}]

# Inclusive gateway (OR) - one or more paths
shape orGateway as @bpmnGateway label: "Conditions?"
  data: [{"gatewayType": "inclusive"}]
```

### Gateway Types

| Gateway Type  | Symbol             | Behavior         | Use Case            |
| ------------- | ------------------ | ---------------- | ------------------- |
| `exclusive`   | Empty diamond or X | One path (XOR)   | Single decision     |
| `parallel`    | + inside diamond   | All paths (AND)  | Parallel processing |
| `inclusive`   | O inside diamond   | One or more (OR) | Multiple conditions |
| `event-based` | Pentagon inside    | Wait for event   | Event selection     |

Example with different gateways:

```runiq
diagram "Gateway Types" {
  direction TB

  container "Process Flow" as @bpmnPool {
    shape start as @bpmnEvent label: "Start" data: [{"eventType": "start"}]
    shape task1 as @bpmnTask label: "Receive Order"

    # Exclusive gateway - one path
    shape checkAmount as @bpmnGateway label: "Amount?"
      data: [{"gatewayType": "exclusive"}]

    shape smallOrder as @bpmnTask label: "Auto-Approve"
    shape largeOrder as @bpmnTask label: "Manual Review"

    # Parallel gateway - fork
    shape splitWork as @bpmnGateway label: "Split"
      data: [{"gatewayType": "parallel"}]

    shape pickItems as @bpmnTask label: "Pick Items"
    shape prepareInvoice as @bpmnTask label: "Prepare Invoice"

    # Parallel gateway - join
    shape mergeWork as @bpmnGateway label: "Merge"
      data: [{"gatewayType": "parallel"}]

    shape ship as @bpmnTask label: "Ship Order"
    shape end as @bpmnEvent label: "End" data: [{"eventType": "end"}]

    # Flow
    start -> task1
    task1 -> checkAmount
    checkAmount -> smallOrder label: "< $1000"
    checkAmount -> largeOrder label: ">= $1000"

    smallOrder -> splitWork
    largeOrder -> splitWork

    splitWork -> pickItems
    splitWork -> prepareInvoice

    pickItems -> mergeWork
    prepareInvoice -> mergeWork

    mergeWork -> ship
    ship -> end
  }
}
```

## Tasks

Tasks represent work performed in the process.

### Basic Task

```runiq
shape processOrder as @bpmnTask label: "Process Order"
```

### Task Types

BPMN supports different task types (user task, service task, etc.):

```runiq
diagram "Task Types" {
  direction TB

  container "Order Process" as @bpmnPool {
    shape start as @bpmnEvent label: "Start" data: [{"eventType": "start"}]

    # User task - human interaction
    shape reviewTask as @bpmnTask label: "Review Order (User)"

    # Service task - automated
    shape validateTask as @bpmnTask label: "Validate Data (Service)"

    # Script task - code execution
    shape calculateTask as @bpmnTask label: "Calculate Total (Script)"

    # Manual task - outside system
    shape packTask as @bpmnTask label: "Pack Items (Manual)"

    shape end as @bpmnEvent label: "End" data: [{"eventType": "end"}]

    start -> reviewTask
    reviewTask -> validateTask
    validateTask -> calculateTask
    calculateTask -> packTask
    packTask -> end
  }
}
```

## Message Flows

Message flows show communication between different pools (participants):

```runiq
diagram "Cross-Organizational Process" {
  direction TB

  container "Customer" as @bpmnPool {
    shape c1 as @bpmnEvent label: "Start" data: [{"eventType": "start"}]
    shape c2 as @bpmnTask label: "Place Order"
    shape c3 as @bpmnTask label: "Make Payment"
    shape c4 as @bpmnTask label: "Receive Goods"
    shape c5 as @bpmnEvent label: "End" data: [{"eventType": "end"}]

    c1 -> c2
    c2 -> c3
    c3 -> c4
    c4 -> c5
  }

  container "Vendor" as @bpmnPool {
    shape v1 as @bpmnTask label: "Receive Order"
    shape v2 as @bpmnGateway label: "In Stock?"
      data: [{"gatewayType": "exclusive"}]
    shape v3 as @bpmnTask label: "Ship Goods"
    shape v4 as @bpmnTask label: "Order Supplies"

    v1 -> v2
    v2 -> v3 label: "Yes"
    v2 -> v4 label: "No"
    v4 -> v3
  }

  container "Payment Gateway" as @bpmnPool {
    shape p1 as @bpmnTask label: "Process Payment"
    shape p2 as @bpmnTask label: "Send Receipt"
  }

  # Message flows between pools
  c2 -> v1 label: "Order Details"
  c3 -> p1 label: "Payment Info"
  p2 -> c3 label: "Receipt"
  v3 -> c4 label: "Shipment"
}
```

::: warning Message Flow Rules

- Message flows (dashed arrows) **only** connect shapes in **different** pools
- Sequence flows (solid arrows) **only** connect shapes in the **same** pool
- Message flows represent asynchronous communication
  :::

## Complete Example: Cross-Functional Order Process

```runiq
diagram "E-Commerce Order Fulfillment" {
  direction TB

  # Customer pool
  container "Customer" as @bpmnPool {
    shape start as @bpmnEvent label: "Start" data: [{"eventType": "start"}]
    shape browseTask as @bpmnTask label: "Browse Products"
    shape orderTask as @bpmnTask label: "Place Order"
    shape payTask as @bpmnTask label: "Make Payment"
    shape receiveTask as @bpmnTask label: "Receive Order"
    shape end as @bpmnEvent label: "End" data: [{"eventType": "end"}]

    start -> browseTask
    browseTask -> orderTask
    orderTask -> payTask
    payTask -> receiveTask
    receiveTask -> end
  }

  # Sales department pool
  container "Sales Department" as @bpmnPool {
    shape reviewTask as @bpmnTask label: "Review Order"
    shape approveGateway as @bpmnGateway label: "Approved?"
      data: [{"gatewayType": "exclusive"}]
    shape confirmTask as @bpmnTask label: "Send Confirmation"
    shape rejectTask as @bpmnTask label: "Reject Order"

    reviewTask -> approveGateway
    approveGateway -> confirmTask label: "Yes"
    approveGateway -> rejectTask label: "No"
  }

  # Warehouse pool with lanes
  container "Warehouse" as @bpmnPool {
    container "Inventory" {
      shape checkStock as @bpmnTask label: "Check Stock"
      shape reserveItems as @bpmnTask label: "Reserve Items"
    }

    container "Picking" {
      shape pickTask as @bpmnTask label: "Pick Items"
    }

    container "Packing" {
      shape packTask as @bpmnTask label: "Pack Order"
      shape labelTask as @bpmnTask label: "Generate Label"
    }

    container "Shipping" {
      shape shipTask as @bpmnTask label: "Ship Order"
    }

    checkStock -> reserveItems
    reserveItems -> pickTask
    pickTask -> packTask
    packTask -> labelTask
    labelTask -> shipTask
  }

  # Payment system pool
  container "Payment Gateway" as @bpmnPool {
    shape processPayment as @bpmnTask label: "Process Payment"
    shape paymentCheck as @bpmnGateway label: "Success?"
      data: [{"gatewayType": "exclusive"}]
    shape sendReceipt as @bpmnTask label: "Send Receipt"
    shape refund as @bpmnTask label: "Refund"

    processPayment -> paymentCheck
    paymentCheck -> sendReceipt label: "Approved"
    paymentCheck -> refund label: "Declined"
  }

  # Message flows between pools
  orderTask -> reviewTask label: "Order Info"
  confirmTask -> payTask label: "Order Confirmed"
  rejectTask -> end label: "Rejection Notice"

  payTask -> processPayment label: "Payment Request"
  sendReceipt -> confirmTask label: "Payment Confirmed"

  confirmTask -> checkStock label: "Fulfillment Request"
  shipTask -> receiveTask label: "Tracking Info"
}
```

## Nested Pools

Pools can be nested to show hierarchical relationships:

```runiq
diagram "Nested Organization" {
  direction TB

  container "Enterprise" as @bpmnPool {
    container "Division A" as @bpmnPool {
      shape a1 as @bpmnTask label: "Task A1"
      shape a2 as @bpmnTask label: "Task A2"
      a1 -> a2
    }

    container "Division B" as @bpmnPool {
      shape b1 as @bpmnTask label: "Task B1"
      shape b2 as @bpmnTask label: "Task B2"
      b1 -> b2
    }

    # Cross-division communication
    a2 -> b1 label: "Handoff"
  }
}
```

## Styling BPMN Diagrams

Customize pools, lanes, and shapes with styling options:

```runiq
diagram "Styled BPMN Process" {
  direction TB

  container "Sales Process" as @bpmnPool
    fill: "#e3f2fd"
    borderColor: "#1976d2"
    borderWidth: 2
    borderStyle: dashed {

    shape start as @bpmnEvent label: "Start"
      data: [{"eventType": "start"}]
      fill: "#4caf50"

    shape task as @bpmnTask label: "Process Lead"
      fill: "#fff9c4"
      stroke: "#f57c00"
      strokeWidth: 2

    shape end as @bpmnEvent label: "End"
      data: [{"eventType": "end"}]
      fill: "#f44336"

    start -> task
    task -> end
  }
}
```

## Best Practices

### 1. Use Pools for Different Organizations

```runiq
container "Our Company" as @bpmnPool { ... }
container "Partner Company" as @bpmnPool { ... }
container "Customer" as @bpmnPool { ... }
```

### 2. Use Lanes for Departments/Roles

```runiq
container "Order Fulfillment" as @bpmnPool {
  container "Sales" { ... }
  container "Warehouse" { ... }
  container "Shipping" { ... }
}
```

### 3. Label Message Flows Clearly

```runiq
customerPool_task -> vendorPool_task label: "Purchase Order"
vendorPool_ship -> customerPool_receive label: "Shipment Notification"
```

### 4. Choose the Right Gateway

- **Exclusive** (`exclusive`) - Business decisions with one outcome
- **Parallel** (`parallel`) - Work that must happen concurrently
- **Inclusive** (`inclusive`) - Multiple possible outcomes

### 5. Use Event Types Appropriately

- **Timer events** for time-based triggers
- **Message events** for external communication
- **Error events** for exception handling
- **Signal events** for broadcast notifications

## Common Patterns

### Approval Workflow

```runiq
shape submit as @bpmnTask label: "Submit Request"
shape review as @bpmnTask label: "Review"
shape decision as @bpmnGateway label: "Approved?"
  data: [{"gatewayType": "exclusive"}]
shape approve as @bpmnTask label: "Approve"
shape reject as @bpmnTask label: "Reject"

submit -> review
review -> decision
decision -> approve label: "Yes"
decision -> reject label: "No"
```

### Parallel Processing with Synchronization

```runiq
shape fork as @bpmnGateway label: "Fork"
  data: [{"gatewayType": "parallel"}]
shape join as @bpmnGateway label: "Join"
  data: [{"gatewayType": "parallel"}]

start -> fork
fork -> task1
fork -> task2
task1 -> join
task2 -> join
join -> complete
```

### Error Handling

```runiq
shape process as @bpmnTask label: "Process Order"
shape errorEvent as @bpmnEvent label: "Error"
  data: [{"eventType": "error"}]
shape handleError as @bpmnTask label: "Handle Error"

process -> success
process -> errorEvent label: "[exception]"
errorEvent -> handleError
```

## Comparison with Other Tools

How do Runiq BPMN diagrams compare to other business process modeling tools?

| Feature                  | Runiq | Mermaid | PlantUML | Lucidchart | Draw.io | Camunda Modeler | Bizagi |
| ------------------------ | ----- | ------- | -------- | ---------- | ------- | --------------- | ------ |
| **Text-Based DSL**       | ✅    | ✅      | ✅       | ❌         | ❌      | ❌              | ❌     |
| **BPMN 2.0 Core**        | ✅    | ❌      | ✅       | ✅         | ✅      | ✅              | ✅     |
| **Pools & Lanes**        | ✅    | ❌      | ✅       | ✅         | ✅      | ✅              | ✅     |
| **Message Flows**        | ✅    | ❌      | ✅       | ✅         | ✅      | ✅              | ✅     |
| **Events (Timer/Error)** | ✅    | ❌      | ✅       | ✅         | ✅      | ✅              | ✅     |
| **Auto-Layout**          | ✅    | ✅      | ✅       | ❌         | ❌      | ❌              | ❌     |
| **Process Execution**    | ❌    | ❌      | ❌       | ❌         | ❌      | ✅              | ✅     |
| **Version Control**      | ✅    | ✅      | ✅       | ❌         | ❌      | ✅              | ❌     |
| **Collaboration**        | ✅    | ❌      | ❌       | ✅         | ❌      | ✅              | ✅     |
| **Integrated w/ UML**    | ✅    | ✅      | ✅       | ✅         | ❌      | ❌              | ❌     |
| **Free/Open Source**     | ✅    | ✅      | ✅       | ❌         | ✅      | ✅              | ❌     |
| **Learning Curve**       | Low   | Low     | Med      | Med        | Low     | Med             | Med    |

**Why choose Runiq for BPMN?**

- **Documentation as code** - Version control your process models
- **Unified language** - Mix BPMN with ERD, sequence diagrams, architecture diagrams
- **Auto-layout** - No manual positioning needed
- **Simple syntax** - Focus on process logic, not drawing
- **Quick prototyping** - Rapidly iterate on process designs
- **Standards compliance** - BPMN 2.0 core elements supported

## See Also

- [Activity Diagrams](/guide/activity-diagrams) - UML activity modeling
- [Sequence Diagrams](/guide/sequence-diagrams) - Interaction flows
- [State Machine Diagrams](/guide/state-machine-diagrams) - State-based processes

## References

- [BPMN 2.0 Specification](https://www.omg.org/spec/BPMN/2.0/)
- Examples: `/examples/bpmn-*.runiq`
