# BPMN Diagram Examples

Business Process Model and Notation (BPMN) diagrams for modeling business workflows, cross-functional processes, and enterprise automation.

## Simple Pool Example

Basic BPMN pool with start event, tasks, and end event.

### DSL Code

```runiq
diagram "BPMN Pool Container Example"

# Pool as a container with shapes inside
container pool1 "Customer" as @bpmnPool {
  shape start as @bpmnEvent label:"Start" data:[{"eventType":"start"}]
  shape task1 as @bpmnTask label:"Place Order"
  shape task2 as @bpmnTask label:"Make Payment"
  shape end as @bpmnEvent label:"End" data:[{"eventType":"end"}]

  start -> task1
  task1 -> task2
  task2 -> end
}

# Another pool
container pool2 "System" as @bpmnPool {
  shape process as @bpmnTask label:"Process Order"
  shape notify as @bpmnTask label:"Send Confirmation"

  process -> notify
}

# Connection between pools - message flow
shape task1 -> process label:"Order Data"
```

### Key Features

- **Pools** (`@bpmnPool`): Represent participants or organizations
- **Start Event** (`@bpmnEvent` with `eventType: "start"`): Circle initiating process
- **Tasks** (`@bpmnTask`): Rounded rectangles for work activities
- **End Event** (`@bpmnEvent` with `eventType: "end"`): Bold circle terminating process
- **Message Flow**: Dashed line between pools showing communication

### Use Cases

- Simple customer workflows
- Two-party business processes
- Service provider interactions

---

## Cross-Functional Order Process

Multi-department process with parallel lanes and decision gateways.

### DSL Code

```runiq
diagram "Cross-Functional Order Process"

direction TB

# Customer swimlane - places order
container customer "Customer" as @bpmnPool {
  shape start as @bpmnEvent label:"Start" data:[{"eventType":"start"}]
  shape orderTask as @bpmnTask label:"Place Order"
  shape payTask as @bpmnTask label:"Make Payment"
  shape receiveTask as @bpmnTask label:"Receive Order"
  shape end as @bpmnEvent label:"End" data:[{"eventType":"end"}]

  start -> orderTask
  orderTask -> payTask
  payTask -> receiveTask
  receiveTask -> end
}

# Sales swimlane - processes order
container sales "Sales Department" as @bpmnPool {
  shape reviewTask as @bpmnTask label:"Review Order"
  shape approveGateway as @bpmnGateway label:"Approved?" data:[{"gatewayType":"exclusive"}]
  shape confirmTask as @bpmnTask label:"Send Confirmation"
  shape rejectTask as @bpmnTask label:"Reject Order"

  reviewTask -> approveGateway
  approveGateway -> confirmTask label:"Yes"
  approveGateway -> rejectTask label:"No"
}

# Warehouse swimlane - fulfills order
container warehouse "Warehouse" as @bpmnPool {
  shape pickTask as @bpmnTask label:"Pick Items"
  shape packTask as @bpmnTask label:"Pack Order"
  shape shipTask as @bpmnTask label:"Ship Order"

  pickTask -> packTask
  packTask -> shipTask
}

# Cross-lane connections showing handoffs
orderTask -> reviewTask label:"Order Info"
confirmTask -> payTask label:"Payment Request"
payTask -> pickTask label:"Fulfillment Request"
shipTask -> receiveTask label:"Shipment"
rejectTask -> end label:"Rejection Notice"
```

### Key Features

- **Multiple Pools**: Customer, Sales, Warehouse represent different participants
- **Exclusive Gateway** (`@bpmnGateway` with `gatewayType: "exclusive"`): Diamond shape for decisions
- **Cross-Pool Message Flows**: Show handoffs between departments
- **Parallel Flows**: Multiple activities happening across different pools
- **Alternative Paths**: Approval gateway leads to either confirmation or rejection

### Process Flow

1. **Customer**: Places order
2. **Sales**: Reviews and approves/rejects
3. **Customer**: Makes payment (if approved)
4. **Warehouse**: Picks, packs, ships
5. **Customer**: Receives order and completes

### Gateway Types

| Gateway Type | Symbol   | Purpose                 |
| ------------ | -------- | ----------------------- |
| Exclusive    | ◇ with X | One path chosen (OR)    |
| Parallel     | ◇ with + | All paths execute (AND) |
| Inclusive    | ◇ with O | Multiple paths possible |

---

## Nested Pools and Lanes

Hierarchical organization with departments nested in company pool.

### DSL Code

```runiq
diagram "BPMN Nested Pools" {
  direction LR

  // Customer swimlane
  container customerPool "Customer" fillColor:"#e3f2fd" strokeColor:"#1976d2" {
    shape start as @circle label:"Order Product"
    shape review as @rounded label:"Review Order"
    shape pay as @rounded label:"Make Payment"

    start -> review
    review -> pay
  }

  // Company swimlane with nested departments
  container companyPool "Company" fillColor:"#f3e5f5" strokeColor:"#7b1fa2" {

    container salesDept "Sales Department" fillColor:"#fff9c4" strokeColor:"#f57c00" {
      shape receiveOrder as @rounded label:"Receive Order"
      shape validateOrder as @rhombus label:"Valid?"
      shape confirmOrder as @rounded label:"Confirm Order"

      receiveOrder -> validateOrder
      validateOrder -> confirmOrder
    }

    container fulfillmentDept "Fulfillment Department" fillColor:"#e8f5e9" strokeColor:"#388e3c" {
      shape pickItems as @rounded label:"Pick Items"
      shape packItems as @rounded label:"Pack Order"
      shape shipOrder as @rounded label:"Ship Order"

      pickItems -> packItems
      packItems -> shipOrder
    }

    confirmOrder -> pickItems
  }

  // Cross-pool edges
  pay -> receiveOrder
  confirmOrder -> review
  shipOrder -> review
}
```

### Key Features

- **Nested Containers**: Departments (Sales, Fulfillment) nested within Company pool
- **Color Coding**: Background and border colors distinguish organizational units
- **Hierarchical Structure**: Company contains sub-departments
- **Internal Flows**: Flow between nested departments (confirmOrder → pickItems)
- **External Flows**: Flow between Customer and Company pools

### Organizational Hierarchy

```
Customer (External)
Company (Organization)
  ├── Sales Department
  │   ├── Receive Order
  │   ├── Validate Order
  │   └── Confirm Order
  └── Fulfillment Department
      ├── Pick Items
      ├── Pack Order
      └── Ship Order
```

### Styling Options

- `fillColor`: Fill color for pool/lane
- `strokeColor`: Border color for visual distinction
- Use consistent color schemes for related departments

---

## Event Types Example

Different BPMN event types (start, intermediate, end).

### DSL Code

```runiq
diagram "BPMN Event Types" {
  direction LR

  # Start events
  shape normalStart as @bpmnEvent
    label:"Start"
    data:[{"eventType":"start"}]

  shape messageStart as @bpmnEvent
    label:"Message\nReceived"
    data:[{"eventType":"start", "eventTrigger":"message"}]

  shape timerStart as @bpmnEvent
    label:"Timer"
    data:[{"eventType":"start", "eventTrigger":"timer"}]

  # Tasks
  shape task1 as @bpmnTask label:"Process Data"
  shape task2 as @bpmnTask label:"Handle Event"
  shape task3 as @bpmnTask label:"Complete"

  # Intermediate events
  shape timerIntermediate as @bpmnEvent
    label:"Wait 24h"
    data:[{"eventType":"intermediate", "eventTrigger":"timer"}]

  shape messageIntermediate as @bpmnEvent
    label:"Receive\nConfirmation"
    data:[{"eventType":"intermediate", "eventTrigger":"message"}]

  # End events
  shape normalEnd as @bpmnEvent
    label:"End"
    data:[{"eventType":"end"}]

  shape messageEnd as @bpmnEvent
    label:"Send\nNotification"
    data:[{"eventType":"end", "eventTrigger":"message"}]

  shape errorEnd as @bpmnEvent
    label:"Error"
    data:[{"eventType":"end", "eventTrigger":"error"}]

  # Flows
  normalStart -> task1
  task1 -> timerIntermediate
  timerIntermediate -> task2
  task2 -> messageIntermediate
  messageIntermediate -> task3
  task3 -> normalEnd

  messageStart -> task2 label:"alt start"
  timerStart -> task1 label:"scheduled"

  task2 -> messageEnd label:"notify"
  task2 -> errorEnd label:"[error]"
}
```

### Event Types

#### Start Events (Thin border circle)

| Trigger     | Icon            | Description                   |
| ----------- | --------------- | ----------------------------- |
| None        | ○               | Generic start                 |
| Message     | ○ with envelope | Triggered by message receipt  |
| Timer       | ○ with clock    | Scheduled or time-based start |
| Signal      | ○ with triangle | Broadcast signal received     |
| Conditional | ○ with document | Condition becomes true        |

#### Intermediate Events (Double border circle)

| Trigger | Icon            | Description                        |
| ------- | --------------- | ---------------------------------- |
| Timer   | ◎ with clock    | Wait for time period               |
| Message | ◎ with envelope | Wait for message                   |
| Signal  | ◎ with triangle | Wait for signal                    |
| Link    | ◎ with arrow    | Connect to another part of diagram |

#### End Events (Thick border circle)

| Trigger    | Icon                 | Description                |
| ---------- | -------------------- | -------------------------- |
| None       | ●                    | Generic end                |
| Message    | ● with envelope      | Send message on completion |
| Error      | ● with lightning     | Terminate with error       |
| Escalation | ● with arrow up      | Escalate to higher level   |
| Terminate  | ● with filled circle | Terminate entire process   |

### Event Triggers

Specify event triggers in the `data` property:

```runiq
data:[{"eventType":"start", "eventTrigger":"message"}]
data:[{"eventType":"intermediate", "eventTrigger":"timer"}]
data:[{"eventType":"end", "eventTrigger":"error"}]
```

---

## Gateway Types Example

Exclusive, parallel, and inclusive gateways.

### DSL Code

```runiq
diagram "BPMN Gateway Types" {
  direction TB

  shape start as @bpmnEvent label:"Start" data:[{"eventType":"start"}]

  # Exclusive Gateway (XOR) - one path
  shape exclusiveGateway as @bpmnGateway
    label:"Credit Check"
    data:[{"gatewayType":"exclusive"}]

  shape approvedTask as @bpmnTask label:"Approve Order"
  shape rejectedTask as @bpmnTask label:"Reject Order"

  # Parallel Gateway (AND) - all paths
  shape parallelSplit as @bpmnGateway
    label:"Process in Parallel"
    data:[{"gatewayType":"parallel"}]

  shape inventoryTask as @bpmnTask label:"Check Inventory"
  shape paymentTask as @bpmnTask label:"Process Payment"
  shape shippingTask as @bpmnTask label:"Prepare Shipping"

  shape parallelJoin as @bpmnGateway
    label:"Wait for All"
    data:[{"gatewayType":"parallel"}]

  # Inclusive Gateway (OR) - one or more paths
  shape inclusiveGateway as @bpmnGateway
    label:"Notifications"
    data:[{"gatewayType":"inclusive"}]

  shape emailTask as @bpmnTask label:"Send Email"
  shape smsTask as @bpmnTask label:"Send SMS"
  shape pushTask as @bpmnTask label:"Push Notification"

  shape inclusiveJoin as @bpmnGateway
    label:"Notifications Sent"
    data:[{"gatewayType":"inclusive"}]

  shape finalTask as @bpmnTask label:"Complete Order"
  shape end as @bpmnEvent label:"End" data:[{"eventType":"end"}]

  # Flows
  start -> exclusiveGateway
  exclusiveGateway -> approvedTask label:"Score > 700"
  exclusiveGateway -> rejectedTask label:"Score ≤ 700"

  approvedTask -> parallelSplit
  parallelSplit -> inventoryTask
  parallelSplit -> paymentTask
  parallelSplit -> shippingTask

  inventoryTask -> parallelJoin
  paymentTask -> parallelJoin
  shippingTask -> parallelJoin

  parallelJoin -> inclusiveGateway
  inclusiveGateway -> emailTask label:"[email preferred]"
  inclusiveGateway -> smsTask label:"[phone provided]"
  inclusiveGateway -> pushTask label:"[app installed]"

  emailTask -> inclusiveJoin
  smsTask -> inclusiveJoin
  pushTask -> inclusiveJoin

  inclusiveJoin -> finalTask
  finalTask -> end

  rejectedTask -> end
}
```

### Gateway Comparison

| Gateway Type        | Symbol          | Behavior                              | Use Case                           |
| ------------------- | --------------- | ------------------------------------- | ---------------------------------- |
| **Exclusive** (XOR) | ◇ with X        | Exactly one path taken                | Credit approval, routing decisions |
| **Parallel** (AND)  | ◇ with +        | All paths taken simultaneously        | Concurrent activities              |
| **Inclusive** (OR)  | ◇ with O        | One or more paths taken               | Multiple optional notifications    |
| **Event-Based**     | ◇ with pentagon | First occurring event determines path | Race conditions, timeouts          |
| **Complex**         | ◇ with \*       | Custom logic expression               | Complex business rules             |

### Gateway Patterns

#### 1. Exclusive (XOR) - Decision Point

```
One input → Multiple outputs (one chosen based on condition)
```

- Credit check: approve or reject
- Order routing: standard or express shipping

#### 2. Parallel (AND) - Fork/Join

```
One input → Multiple outputs (all execute in parallel)
Multiple inputs → One output (wait for all to complete)
```

- Fork: Split order processing into inventory, payment, shipping
- Join: Wait for all tasks before proceeding

#### 3. Inclusive (OR) - Multiple Choices

```
One input → Multiple outputs (one or more based on conditions)
```

- Send email AND/OR SMS AND/OR push notification
- Multiple optional approvals

---

## Subprocess Example

Collapsed and expanded subprocesses.

### DSL Code

```runiq
diagram "BPMN Subprocess" {
  direction LR

  shape start as @bpmnEvent label:"Start" data:[{"eventType":"start"}]

  # Collapsed subprocess - shown as single box with +
  shape orderSubprocess as @bpmnTask
    label:"Order Processing\n[+]"
    data:[{"subprocess": true, "expanded": false}]

  shape decision as @bpmnGateway
    label:"Success?"
    data:[{"gatewayType":"exclusive"}]

  shape shipTask as @bpmnTask label:"Ship Order"
  shape refundTask as @bpmnTask label:"Process Refund"

  shape end as @bpmnEvent label:"End" data:[{"eventType":"end"}]

  # Main flow
  start -> orderSubprocess
  orderSubprocess -> decision
  decision -> shipTask label:"Yes"
  decision -> refundTask label:"No"
  shipTask -> end
  refundTask -> end
}

# Expanded subprocess definition (separate diagram)
diagram "Order Processing Subprocess" {
  direction TB

  shape subStart as @bpmnEvent
    label:"Start"
    data:[{"eventType":"start"}]

  shape validateTask as @bpmnTask label:"Validate Order"
  shape checkInventory as @bpmnTask label:"Check Inventory"
  shape reserveItems as @bpmnTask label:"Reserve Items"
  shape processPayment as @bpmnTask label:"Process Payment"

  shape errorBoundary as @bpmnEvent
    label:"Payment\nError"
    data:[{"eventType":"boundary", "eventTrigger":"error"}]

  shape handleError as @bpmnTask label:"Handle Payment Error"

  shape subEnd as @bpmnEvent
    label:"End"
    data:[{"eventType":"end"}]

  # Subprocess internal flow
  subStart -> validateTask
  validateTask -> checkInventory
  checkInventory -> reserveItems
  reserveItems -> processPayment
  processPayment -> subEnd

  # Error handling
  processPayment -> errorBoundary label:"error"
  errorBoundary -> handleError
  handleError -> subEnd
}
```

### Subprocess Types

#### Collapsed Subprocess

- Shown as rounded rectangle with **+** symbol
- Hides internal complexity
- Used for high-level process views
- Details defined in separate diagram

#### Expanded Subprocess

- Shows internal flow within boundary
- Embedded in parent diagram
- Has own start/end events
- Can have boundary events (timer, error, signal)

### Boundary Events

Events attached to activity boundary:

| Event      | Purpose                  |
| ---------- | ------------------------ |
| Error      | Exception handling       |
| Timer      | Timeout conditions       |
| Message    | Interrupting message     |
| Signal     | External signal          |
| Escalation | Escalate to higher level |

---

## Message Flow Example

Inter-pool communication with message passing.

### DSL Code

```runiq
diagram "Purchase Order Process - Message Flow" {
  direction TB

  # Buyer pool
  container buyer "Buyer" as @bpmnPool {
    shape start as @bpmnEvent label:"Need\nSupplies" data:[{"eventType":"start"}]
    shape createPO as @bpmnTask label:"Create Purchase Order"
    shape sendPO as @bpmnTask label:"Send PO"
    shape waitConfirm as @bpmnEvent
      label:"Wait for\nConfirmation"
      data:[{"eventType":"intermediate", "eventTrigger":"message"}]
    shape receiveGoods as @bpmnTask label:"Receive Goods"
    shape processInvoice as @bpmnTask label:"Process Invoice"
    shape end as @bpmnEvent label:"End" data:[{"eventType":"end"}]

    start -> createPO
    createPO -> sendPO
    sendPO -> waitConfirm
    waitConfirm -> receiveGoods
    receiveGoods -> processInvoice
    processInvoice -> end
  }

  # Supplier pool
  container supplier "Supplier" as @bpmnPool {
    shape receivePO as @bpmnEvent
      label:"PO\nReceived"
      data:[{"eventType":"start", "eventTrigger":"message"}]
    shape reviewPO as @bpmnTask label:"Review PO"
    shape acceptGateway as @bpmnGateway
      label:"Accept?"
      data:[{"gatewayType":"exclusive"}]
    shape confirmOrder as @bpmnTask label:"Confirm Order"
    shape prepareGoods as @bpmnTask label:"Prepare Goods"
    shape shipGoods as @bpmnTask label:"Ship Goods"
    shape sendInvoice as @bpmnTask label:"Send Invoice"
    shape supplierEnd as @bpmnEvent label:"End" data:[{"eventType":"end"}]

    receivePO -> reviewPO
    reviewPO -> acceptGateway
    acceptGateway -> confirmOrder label:"Yes"
    confirmOrder -> prepareGoods
    prepareGoods -> shipGoods
    shipGoods -> sendInvoice
    sendInvoice -> supplierEnd
    acceptGateway -> supplierEnd label:"No"
  }

  # Message flows (dashed lines across pools)
  sendPO -> receivePO label:"Purchase Order"
  confirmOrder -> waitConfirm label:"Order Confirmation"
  shipGoods -> receiveGoods label:"Shipment"
  sendInvoice -> processInvoice label:"Invoice"
}
```

### Key Features

- **Message Events**: Start, intermediate, and end events triggered by messages
- **Asynchronous Communication**: Buyer and supplier operate independently
- **Message Flows**: Dashed lines show messages between pools
- **Two-Way Communication**: Purchase order, confirmation, shipment, invoice

### Message Flow vs. Sequence Flow

| Flow Type         | Visual         | Purpose                     | Scope                  |
| ----------------- | -------------- | --------------------------- | ---------------------- |
| **Sequence Flow** | Solid arrow →  | Control flow within pool    | Same participant       |
| **Message Flow**  | Dashed arrow ⇢ | Communication between pools | Different participants |

---

## Related Resources

- [BPMN Diagrams Guide](/guide/diagram-types/bpmn-diagrams) - Complete syntax reference
- [BPMN 2.0 Specification](https://www.omg.org/spec/BPMN/) - Official OMG standard
- [Diagram Profile](/guide/profiles#diagram-profile) - Overview of diagram capabilities

## Best Practices

### Pool and Lane Organization

- **Pools**: Use for different organizations or systems (Customer, Supplier, Company)
- **Lanes**: Use for departments or roles within same organization (Sales, Warehouse)
- **Nesting**: Nest lanes within pools to show organizational hierarchy
- **Naming**: Use clear, descriptive names for participants

### Event Usage

- **Start Events**:
  - Use simple start event for user-initiated processes
  - Use message start for processes triggered by external systems
  - Use timer start for scheduled processes
- **Intermediate Events**:
  - Place on sequence flow for process delays or waits
  - Attach to activity boundary for exceptions and interruptions
- **End Events**:
  - Use simple end for normal completion
  - Use message end to send final notification
  - Use error end for abnormal termination

### Gateway Selection

Choose appropriate gateway type:

1. **Exclusive (XOR)**: When exactly one path should be taken
   - Credit approval decisions
   - Order routing logic
2. **Parallel (AND)**: When all paths must execute simultaneously
   - Fork work into concurrent tasks
   - Wait for all tasks before proceeding
3. **Inclusive (OR)**: When one or more paths may be taken
   - Multiple optional notifications
   - Conditional approvals

### Message Flow Best Practices

- Use **message start events** when process triggered by external message
- Use **message intermediate events** when waiting for response
- Label message flows with message names (e.g., "Purchase Order", "Invoice")
- Keep message flows horizontal when possible for readability

### Subprocess Guidelines

- **Collapsed**: Use for high-level process maps to reduce complexity
- **Expanded**: Use when internal flow needs to be visible
- **Reusability**: Define reusable subprocesses for common patterns
- **Boundary Events**: Add error, timer, or signal events for exception handling

### Styling and Layout

- **Direction**: `direction TB` for top-to-bottom, `direction LR` for left-to-right
- **Colors**: Use consistent color schemes for organizational units
- **Alignment**: Align pools horizontally or vertically for clean layouts
- **Whitespace**: Leave adequate space between elements for clarity
