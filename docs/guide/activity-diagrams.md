---
title: Activity Diagrams
description: Model workflows, business processes, and algorithms with UML 2.5 activity diagrams including action pins, object nodes, swimlanes, signals, and final nodes.
lastUpdated: 2025-01-09
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

## Key Shapes

### Activity Nodes

The `@activity` shape represents an action or task:

```runiq
shape processOrder as @activity label: "Process Order"
shape validateInput as @activity label: "Validate Input"
```

### Initial and Final Nodes

- `@initialState` - Start point (filled circle)
- `@activityFinal` - Activity terminator (bull's eye: circle with filled center)
- `@flowFinal` - Flow terminator (circle with X)

```runiq
shape start as @initialState
shape end as @activityFinal      # Terminates entire activity
shape flowEnd as @flowFinal       # Terminates one flow only
```

::: info Final Node Types

- **Activity Final** (`@activityFinal`) terminates the entire activity and all concurrent flows
- **Flow Final** (`@flowFinal`) terminates only one specific flow path while others continue
  :::

### Decision Nodes

The `@diamond` shape creates decision points with conditional branches:

```runiq
shape check as @diamond

validate -> check
check -> success label: "[valid]"
check -> error label: "[invalid]"
```

### Fork and Join Nodes

Use `@fork` and `@join` for parallel processing:

```runiq
shape split as @fork
shape merge as @join

process -> split
split -> task1
split -> task2
task1 -> merge
task2 -> merge
merge -> done
```

## Action Pins

Action pins enable data flow between activities using `inputPins` and `outputPins`:

```runiq
diagram "Action Pins Example" {
  direction TB

  shape start as @initialState

  # Activity with output pins
  shape readOrder as @activity label: "Read Order"
    outputPins: ["order", "customer"]

  # Activity with input and output pins
  shape validateOrder as @activity label: "Validate Order"
    inputPins: ["order"]
    outputPins: ["validOrder", "errors"]

  # Activity with multiple input pins
  shape processPayment as @activity label: "Process Payment"
    inputPins: ["validOrder", "customer"]
    outputPins: ["receipt"]

  shape end as @activityFinal

  start -> readOrder
  readOrder -> validateOrder
  validateOrder -> processPayment label: "[valid]"
  processPayment -> end
}
```

::: tip When to Use Action Pins

- Complex data transformations with multiple inputs/outputs
- Type-safe data flow modeling
- Integration with structured analysis tools
- Detailed data dependency tracking
  :::

## Object Nodes

Object nodes represent data that flows through the activity:

### Object Node Types

- `@objectNode` - General data object
- `@centralBuffer` - Temporary storage queue
- `@dataStore` - Persistent database

```runiq
diagram "Object Flow Example" {
  direction TB

  shape init as @initialState
  shape readInput as @activity label: "Read User Input"
  shape processData as @activity label: "Process Data"
  shape saveData as @activity label: "Save to Database"
  shape final as @activityFinal

  # Object nodes for data
  shape userInput as @objectNode label: "User Input"
  shape processedData as @objectNode label: "Processed Data"

  # Central buffer for queuing
  shape dataQueue as @centralBuffer label: "Data Queue"

  # Data store for persistence
  shape dataStoreShape as @dataStore label: "Database"

  # Control flow
  init -> readInput
  readInput -> processData
  processData -> saveData
  saveData -> final

  # Object flow (data movement)
  readInput -> userInput label: "«output»"
  userInput -> processData label: "«input»"
  processData -> processedData label: "«output»"
  processedData -> dataQueue label: "enqueue"
  dataQueue -> saveData label: "dequeue"
  saveData -> dataStoreShape label: "store"
}
```

::: info Object Flow vs Control Flow

- **Control Flow** (solid arrow) - Sequencing of activities
- **Object Flow** (dashed arrow) - Movement of data between activities
- Use `label: "«input»"` or `label: "«output»"` to annotate data direction
  :::

## Swimlanes

Swimlanes organize activities by role, department, or system component.

### Horizontal Swimlanes

```runiq
diagram "Horizontal Swimlanes" {
  direction LR

  container "Customer" fillColor: "#e3f2fd" {
    shape c1 as @initialState
    shape c2 as @activity label: "Place Order"
    shape c3 as @activity label: "Receive Confirmation"
    shape c4 as @activityFinal
  }

  container "Sales" fillColor: "#fff3e0" {
    shape s1 as @activity label: "Review Order"
    shape s2 as @activity label: "Approve Order"
  }

  container "Warehouse" fillColor: "#e8f5e9" {
    shape w1 as @activity label: "Pick Items"
    shape w2 as @activity label: "Ship Order"
  }

  # Cross-lane flows
  c1 -> c2
  c2 -> s1
  s1 -> s2
  s2 -> w1
  w1 -> w2
  w2 -> c3
  c3 -> c4
}
```

### Vertical Swimlanes

For side-by-side comparisons, use `orientation: vertical`:

```runiq
diagram "Vertical Swimlanes" {
  direction TB

  container "Frontend Team" orientation: vertical fillColor: "#e3f2fd" {
    shape fe1 as @initialState
    shape fe2 as @activity label: "Design UI"
    shape fe3 as @activity label: "Implement"
    shape fe4 as @activity label: "Test"
  }

  container "Backend Team" orientation: vertical fillColor: "#fff3e0" {
    shape be1 as @initialState
    shape be2 as @activity label: "Design API"
    shape be3 as @activity label: "Implement"
    shape be4 as @activity label: "Test"
  }

  container "DevOps" orientation: vertical fillColor: "#e8f5e9" {
    shape ops1 as @activity label: "Deploy"
    shape ops2 as @activityFinal
  }

  # Parallel flows
  fe1 -> fe2
  fe2 -> fe3
  fe3 -> fe4
  fe4 -> ops1

  be1 -> be2
  be2 -> be3
  be3 -> be4
  be4 -> ops1

  ops1 -> ops2
}
```

::: tip Swimlane Orientation

- **Horizontal** (default) - Activities flow within horizontal bands (good for sequential handoffs)
- **Vertical** (`orientation: vertical`) - Activities flow within vertical columns (good for parallel teams)
  :::

### Nested Swimlanes

Containers can be nested for hierarchical organization:

```runiq
container "Engineering Department" {
  container "Development Team" {
    shape dev1 as @activity label: "Write Code"
    shape dev2 as @activity label: "Review Code"
  }

  container "QA Team" {
    shape qa1 as @activity label: "Test"
    shape qa2 as @activity label: "Report Bugs"
  }
}
```

## Signal Shapes

Signals represent communication with external systems or asynchronous events.

### Signal Types

- `@sendSignal` - Send notification or event (convex pentagon)
- `@receiveSignal` - Wait for incoming signal (concave pentagon)
- `@acceptEvent` - Wait for event with timeout (concave pentagon with clock)

```runiq
diagram "Signal Communication" {
  direction TB

  shape start as @initialState
  shape process as @activity label: "Process Order"

  # Send notification to external system
  shape notify as @sendSignal label: "Send Email"

  # Wait for external confirmation
  shape waitConfirm as @receiveSignal label: "Wait for Approval"

  # Accept event with timeout handling
  shape waitPayment as @acceptEvent label: "Wait for Payment"

  shape complete as @activity label: "Complete Order"
  shape timeout as @activity label: "Cancel Order"
  shape end as @activityFinal

  start -> process
  process -> notify
  notify -> waitConfirm
  waitConfirm -> waitPayment
  waitPayment -> complete label: "[received]"
  waitPayment -> timeout label: "[timeout]"
  complete -> end
  timeout -> end
}
```

::: warning Signal vs Object Flow

- **Signals** are for asynchronous, event-based communication
- **Object Flows** are for direct data passing between activities
- Use signals when timing is uncertain or external systems are involved
  :::

## Flow Types

Activity diagrams support two types of flows:

### Control Flow (Default)

Sequences the execution order of activities:

```runiq
activity1 -> activity2
activity2 -> activity3
```

### Object Flow (Data Movement)

Represents data passing between activities and object nodes:

```runiq
activity -> dataObject label: "«output»"
dataObject -> nextActivity label: "«input»"
```

Use stereotypes like `«input»`, `«output»`, `«parameter»` to annotate object flows.

## Complete Example: Order Processing

```runiq
diagram "E-Commerce Order Processing" {
  direction TB

  container "Customer Interface" fill: "#e3f2fd" {
    shape start as @initialState
    shape browse as @activity label: "Browse Products"
    shape addToCart as @activity label: "Add to Cart"
    shape checkout as @activity label: "Checkout"
    shape receiveOrder as @activity label: "Receive Order"
    shape end as @activityFinal
  }

  container "Order Processing" fill: "#fff3e0" {
    shape validateOrder as @activity label: "Validate Order"
      inputPins: ["order", "customer"]
      outputPins: ["validOrder", "errors"]

    shape checkInventory as @activity label: "Check Inventory"
    shape reserveItems as @activity label: "Reserve Items"

    shape inventoryCheck as @diamond
  }

  container "Payment Gateway" fill: "#f3e5f5" {
    shape processPayment as @activity label: "Process Payment"
    shape paymentCheck as @diamond
    shape refund as @activity label: "Issue Refund"
  }

  container "Fulfillment" fill: "#e8f5e9" {
    shape pickItems as @activity label: "Pick Items"
    shape packOrder as @activity label: "Pack Order"
    shape shipOrder as @activity label: "Ship Order"

    shape sendNotification as @sendSignal label: "Send Tracking Email"
  }

  # Object nodes
  shape orderData as @objectNode label: "Order Data"
  shape orderQueue as @centralBuffer label: "Order Queue"
  shape orderDb as @dataStore label: "Order Database"

  # Customer flow
  start -> browse
  browse -> addToCart
  addToCart -> checkout
  checkout -> validateOrder
  receiveOrder -> end

  # Order processing flow
  validateOrder -> checkInventory label: "[valid]"
  checkInventory -> inventoryCheck
  inventoryCheck -> reserveItems label: "[available]"
  inventoryCheck -> refund label: "[out of stock]"
  reserveItems -> processPayment

  # Payment flow
  processPayment -> paymentCheck
  paymentCheck -> pickItems label: "[approved]"
  paymentCheck -> refund label: "[declined]"

  # Fulfillment flow
  pickItems -> packOrder
  packOrder -> shipOrder
  shipOrder -> sendNotification
  sendNotification -> receiveOrder

  # Object flows
  checkout -> orderData label: "«output»"
  orderData -> orderQueue label: "enqueue"
  orderQueue -> validateOrder label: "«input»"
  reserveItems -> orderDb label: "store"

  # Error handling
  refund -> end
}
```

## Best Practices

### 1. Use Meaningful Labels

```runiq
# Good - Clear and action-oriented
shape validate as @activity label: "Validate Customer Data"

# Avoid - Vague or technical
shape step1 as @activity label: "Step 1"
```

### 2. Group Related Activities with Swimlanes

Use swimlanes to show responsibility boundaries:

```runiq
container "User"
container "System"
container "Database"
```

### 3. Distinguish Control Flow from Object Flow

- Use object nodes (`@objectNode`, `@centralBuffer`, `@dataStore`) for data
- Use action pins for complex data transformations
- Label object flows with stereotypes: `«input»`, `«output»`

### 4. Choose the Right Final Node

- Use `@activityFinal` to end the entire activity
- Use `@flowFinal` to end one branch while others continue

### 5. Document Decision Criteria

Always label decision branches with conditions:

```runiq
decision -> successPath label: "[amount < $1000]"
decision -> approvalPath label: "[amount >= $1000]"
```

## Common Patterns

### Fork/Join for Parallel Processing

```runiq
shape fork as @fork
shape join as @join

start -> fork
fork -> parallelTask1
fork -> parallelTask2
fork -> parallelTask3
parallelTask1 -> join
parallelTask2 -> join
parallelTask3 -> join
join -> continue
```

### Decision Diamond with Multiple Branches

```runiq
shape decision as @diamond

process -> decision
decision -> lowPriority label: "[priority = low]"
decision -> mediumPriority label: "[priority = medium]"
decision -> highPriority label: "[priority = high]"
```

### Error Handling with Exception Flow

```runiq
shape process as @activity label: "Process Data"
shape errorHandler as @activity label: "Handle Error"
shape logError as @activity label: "Log Error"

process -> success label: "[no error]"
process -> errorHandler label: "[exception]"
errorHandler -> logError
logError -> end
```

## Styling

Customize appearance with fill colors, borders, and padding:

```runiq
container "Production System"
  fillColor: "#ffebee"
  strokeColor: "#c62828"
  padding: 30 {

  shape criticalProcess as @activity
    label: "Critical Process"
    fillColor: "#ef5350"
    textColor: "white"
}
```

## Comparison with Other Tools

| Feature                      | Runiq                              | PlantUML     | Lucidchart         | Draw.io       | Enterprise Architect |
| ---------------------------- | ---------------------------------- | ------------ | ------------------ | ------------- | -------------------- |
| **Text-Based DSL**           | ✅                                 | ✅           | ❌ (GUI)           | ❌ (GUI)      | ⚠️ Hybrid            |
| **Version Control Friendly** | ✅                                 | ✅           | ⚠️ Limited         | ⚠️ Limited    | ❌                   |
| **Automatic Layout**         | ✅ ELK (Layered)                   | ✅ GraphViz  | ⚠️ Manual          | ⚠️ Manual     | ✅                   |
| **UML 2.5 Compliance**       | ✅                                 | ✅           | ⚠️ Partial         | ⚠️ Partial    | ✅                   |
| **Action Pins**              | ✅ Input/output pins               | ✅           | ⚠️ Manual          | ⚠️ Manual     | ✅                   |
| **Object Nodes**             | ✅ Data flow support               | ✅           | ⚠️ Manual          | ⚠️ Manual     | ✅                   |
| **Central Buffers**          | ✅ `@centralBuffer`                | ✅           | ⚠️ Manual          | ⚠️ Manual     | ✅                   |
| **Data Stores**              | ✅ `@dataStore`                    | ✅           | ⚠️ Manual          | ⚠️ Manual     | ✅                   |
| **Swimlanes**                | ✅ Horizontal & vertical           | ✅           | ✅                 | ✅            | ✅                   |
| **Fork/Join Nodes**          | ✅ Parallel flow notation          | ✅           | ⚠️ Manual          | ⚠️ Manual     | ✅                   |
| **Send/Receive Signals**     | ✅ `@sendSignal`, `@receiveSignal` | ✅           | ⚠️ Manual          | ⚠️ Manual     | ✅                   |
| **Conditional Nodes**        | ✅ `@diamond` decision             | ✅           | ✅                 | ✅            | ✅                   |
| **Final Nodes**              | ✅ Activity & flow final           | ✅           | ⚠️ Manual          | ⚠️ Manual     | ✅                   |
| **Expansion Regions**        | ✅ Container-based                 | ✅           | ❌                 | ❌            | ✅                   |
| **Export Formats**           | ✅ SVG (PNG/PDF via conversion)    | ✅ PNG, SVG  | ✅ Many formats    | ✅ Many       | ✅ Many              |
| **Collaboration**            | ✅ Git-based                       | ✅ Git-based | ✅ Cloud (Paid)    | ✅ Cloud      | ⚠️ Database-based    |
| **Learning Curve**           | ⚠️ Moderate (DSL)                  | ⚠️ Moderate  | ✅ Low (GUI)       | ✅ Low        | ❌ High              |
| **Open Source**              | ✅ MIT License                     | ✅ GPL       | ❌ Commercial only | ✅ Apache 2.0 | ❌ Commercial only   |

**Runiq Advantages:**

- **UML 2.5 compliant** with all activity diagram elements
- **Unified language** for activity, sequence, class, state machine, and 15+ diagram types
- **Advanced data flow** with action pins, object nodes, central buffers, data stores
- **Swimlanes** for cross-functional workflows (horizontal and vertical)
- **Fork/join nodes** for parallel processing
- **Send/receive signals** for asynchronous communication
- **Version control native** - perfect for process documentation in repositories
- **ELK layout engine** for superior layered layouts
- **Profile system** for diagram-specific conventions

## See Also

- [BPMN Diagrams](/guide/bpmn-diagrams) - Business process modeling notation
- [State Machine Diagrams](/guide/state-machine-diagrams) - State-based behavior
- [Sequence Diagrams](/guide/sequence-diagrams) - Interaction modeling
- [UML Class Diagrams](/guide/class-diagrams) - Structural modeling

## References

- [UML 2.5 Activity Diagrams Specification](https://www.omg.org/spec/UML/2.5/)
- Examples: `/examples/activity-*.runiq`
