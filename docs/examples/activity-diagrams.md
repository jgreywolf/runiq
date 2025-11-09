# Activity Diagram Examples

UML Activity Diagrams show workflows, business processes, and algorithmic logic with actions, decisions, and control flows.

## Action Pins Example

Activities with input and output pins for data flow.

### DSL Code

```runiq
diagram "UML Activity Diagram - Action Pins" {
  direction TB

  # Initial node
  shape start as @initialState

  # Activity nodes with pins
  shape readOrder as @activity label: "Read Order"
    outputPins: ["order", "customer"]

  shape validateOrder as @activity label: "Validate Order"
    inputPins: ["order"]
    outputPins: ["validOrder", "errors"]

  shape processPayment as @activity label: "Process Payment"
    inputPins: ["validOrder", "customer"]
    outputPins: ["receipt", "status"]

  shape sendConfirmation as @activity label: "Send Confirmation"
    inputPins: ["receipt", "customer"]
    outputPins: ["email"]

  shape logErrors as @activity label: "Log Errors"
    inputPins: ["errors"]

  # Final node - terminates entire activity
  shape end as @activityFinal

  # Control flows
  start -> readOrder
  readOrder -> validateOrder
  validateOrder -> processPayment label: "[valid]"
  validateOrder -> logErrors label: "[invalid]"
  processPayment -> sendConfirmation
  sendConfirmation -> end
  logErrors -> end
}
```

### Key Features

- **Input Pins**: Data inputs required by activities (`order`, `validOrder`, `customer`)
- **Output Pins**: Data outputs produced by activities (`validOrder`, `errors`, `receipt`)
- **Guard Conditions**: `[valid]` and `[invalid]` control which path executes
- **Activity Final**: Black bull's-eye circle terminates the entire workflow

### Use Cases

- Order processing workflows
- Data validation pipelines
- Multi-step form processing
- Request/response handling

---

## Object Nodes Example

Data objects flowing between activities with buffers and data stores.

### DSL Code

```runiq
diagram "UML Activity Diagram - Object Nodes" {
  direction TB

  # Activity nodes
  shape init as @initialState
  shape readInput as @activity label: "Read User Input"
  shape validateData as @activity label: "Validate Data"
  shape processOrder as @activity label: "Process Order"
  shape saveToDb as @activity label: "Save to Database"
  shape sendConfirmation as @activity label: "Send Confirmation"
  shape final as @activityFinal

  # Object nodes - data flowing through activities
  shape userInput as @objectNode label: "User Input"
  shape validatedData as @objectNode label: "Validated Data"
  shape orderData as @objectNode label: "Order Data"
  
  # Central buffer - temporary storage
  shape orderQueue as @centralBuffer label: "Order Queue"
  
  # Data store - persistent storage
  shape database as @dataStore label: "Order Database"
  shape customerDb as @dataStore label: "Customer DB"

  # Control flow
  init -> readInput
  readInput -> validateData
  validateData -> processOrder
  processOrder -> saveToDb
  saveToDb -> sendConfirmation
  sendConfirmation -> final

  # Object flows (data flows between activities and object nodes)
  readInput -> userInput label: "«output»"
  userInput -> validateData label: "«input»"
  
  validateData -> validatedData label: "«output»"
  validatedData -> processOrder label: "«input»"
  
  processOrder -> orderData label: "«output»"
  orderData -> orderQueue label: "enqueue"
  orderQueue -> saveToDb label: "dequeue"
  
  saveToDb -> database label: "store"
  customerDb -> processOrder label: "read"
}
```

### Key Features

- **Object Nodes**: Represent data or objects (`userInput`, `validatedData`, `orderData`)
- **Central Buffer**: Temporary storage queue (`orderQueue`) with enqueue/dequeue operations
- **Data Stores**: Persistent databases (`database`, `customerDb`) with read/write operations
- **Object Flows**: Show data movement between activities (stereotyped «input»/«output»)

### Data Flow Patterns

1. **Input → Validate → Process**: Standard validation pipeline
2. **Queue Buffering**: Orders stored temporarily before database persistence
3. **Database Access**: Read customer data, write order data
4. **Asynchronous Processing**: Queue enables decoupled processing

---

## Swimlanes (Horizontal) Example

Activities organized by responsible party or system.

### DSL Code

```runiq
diagram "Order Fulfillment - Horizontal Swimlanes" {
  direction LR

  container customer "Customer" as @swimlane direction:horizontal {
    shape browseProducts as @activity label: "Browse Products"
    shape placeOrder as @activity label: "Place Order"
    shape receiveShipment as @activity label: "Receive Shipment"
    
    browseProducts -> placeOrder
  }

  container orderSystem "Order System" as @swimlane direction:horizontal {
    shape validateOrder as @activity label: "Validate Order"
    shape processPayment as @activity label: "Process Payment"
    shape createInvoice as @activity label: "Create Invoice"
    
    validateOrder -> processPayment
    processPayment -> createInvoice
  }

  container warehouse "Warehouse" as @swimlane direction:horizontal {
    shape pickItems as @activity label: "Pick Items"
    shape packOrder as @activity label: "Pack Order"
    shape shipOrder as @activity label: "Ship Order"
    
    pickItems -> packOrder
    packOrder -> shipOrder
  }

  # Cross-lane flows
  placeOrder -> validateOrder label: "order details"
  createInvoice -> pickItems label: "fulfill"
  shipOrder -> receiveShipment label: "delivery"
}
```

### Key Features

- **Horizontal Swimlanes**: Each participant gets a horizontal lane
- **Responsibility Boundaries**: Clear ownership of activities
- **Cross-Lane Flows**: Show interactions between participants
- **End-to-End Process**: Complete order fulfillment from browse to delivery

### Organizational View

- **Customer Lane**: User-facing activities
- **Order System Lane**: Backend business logic
- **Warehouse Lane**: Physical fulfillment operations

---

## Swimlanes (Vertical) Example

Release pipeline with vertical organization by team.

### DSL Code

```runiq
diagram "CI/CD Release Pipeline" {
  direction TB

  container devTeam "Development Team" as @swimlane direction:vertical {
    shape init as @initialState
    shape writeCode as @activity label: "Write Code"
    shape runLocalTests as @activity label: "Run Local Tests"
    shape commitCode as @activity label: "Commit to Repo"
    
    init -> writeCode
    writeCode -> runLocalTests
    runLocalTests -> commitCode
  }

  container ciServer "CI Server" as @swimlane direction:vertical {
    shape detectChange as @activity label: "Detect Change"
    shape runBuild as @activity label: "Run Build"
    shape runTests as @activity label: "Run Test Suite"
    shape buildArtifact as @activity label: "Build Artifact"
    shape decision as @decision label: "Tests Pass?"
    
    detectChange -> runBuild
    runBuild -> runTests
    runTests -> decision
    decision -> buildArtifact label: "[yes]"
  }

  container qaTeam "QA Team" as @swimlane direction:vertical {
    shape deployToQA as @activity label: "Deploy to QA"
    shape runE2ETests as @activity label: "Run E2E Tests"
    shape approveRelease as @activity label: "Approve Release"
    
    deployToQA -> runE2ETests
    runE2ETests -> approveRelease
  }

  container opsTeam "Operations Team" as @swimlane direction:vertical {
    shape deployProduction as @activity label: "Deploy to Prod"
    shape monitorHealth as @activity label: "Monitor Health"
    shape final as @activityFinal
    
    deployProduction -> monitorHealth
    monitorHealth -> final
  }

  # Pipeline flow
  commitCode -> detectChange
  buildArtifact -> deployToQA
  decision -> writeCode label: "[no] fix bugs"
  approveRelease -> deployProduction
}
```

### Key Features

- **Vertical Swimlanes**: Teams organized top-to-bottom
- **Pipeline Stages**: Dev → CI → QA → Ops
- **Decision Point**: Tests pass/fail determines flow
- **Feedback Loop**: Failed tests return to development

### DevOps Process

1. **Development**: Code, test, commit
2. **Continuous Integration**: Build, test, artifact creation
3. **Quality Assurance**: QA deployment, E2E testing, approval
4. **Operations**: Production deployment and monitoring

---

## Signal Events Example

Activities triggered by external signals and time events.

### DSL Code

```runiq
diagram "Microservices with Signals" {
  direction TB

  shape start as @initialState
  
  # Order Service activities
  shape receiveOrder as @activity label: "Receive Order"
  shape validateOrder as @activity label: "Validate Order"
  
  # Send signal to inventory
  shape sendInventoryCheck as @sendSignal label: "«signal»\nCheckInventory"
  
  # Accept signal from inventory
  shape receiveInventoryResult as @acceptSignal label: "«signal»\nInventoryConfirmed"
  
  # Send signal to payment
  shape sendPaymentRequest as @sendSignal label: "«signal»\nProcessPayment"
  
  # Time event - wait for payment response
  shape waitForPayment as @acceptTimeEvent label: "«time event»\nwait(30s)"
  
  # Accept signal from payment
  shape receivePaymentResult as @acceptSignal label: "«signal»\nPaymentCompleted"
  
  shape confirmOrder as @activity label: "Confirm Order"
  shape cancelOrder as @activity label: "Cancel Order"
  
  shape end as @activityFinal

  # Main flow
  start -> receiveOrder
  receiveOrder -> validateOrder
  validateOrder -> sendInventoryCheck
  sendInventoryCheck -> receiveInventoryResult
  receiveInventoryResult -> sendPaymentRequest label: "[available]"
  sendPaymentRequest -> waitForPayment
  waitForPayment -> receivePaymentResult
  receivePaymentResult -> confirmOrder label: "[success]"
  receivePaymentResult -> cancelOrder label: "[failed]"
  receiveInventoryResult -> cancelOrder label: "[unavailable]"
  confirmOrder -> end
  cancelOrder -> end
}
```

### Key Features

- **Send Signals**: `@sendSignal` broadcasts events to other services
- **Accept Signals**: `@acceptSignal` waits for external signals
- **Time Events**: `@acceptTimeEvent` waits for timeout or deadline
- **Asynchronous Communication**: Microservices interact via signals

### Signal Types

| Shape Type | Purpose | Example |
|------------|---------|---------|
| `@sendSignal` | Broadcast signal | Notify inventory service |
| `@acceptSignal` | Wait for signal | Receive payment confirmation |
| `@acceptTimeEvent` | Wait for time | Timeout after 30 seconds |

### Microservices Pattern

This example demonstrates:
- **Event-Driven Architecture**: Services communicate via signals
- **Timeout Handling**: Time events ensure responsiveness
- **Saga Pattern**: Distributed transaction with compensating actions (cancel order)

---

## Final Nodes Example

Activity final vs. flow final nodes.

### DSL Code

```runiq
diagram "Order Processing with Final Nodes" {
  direction TB

  shape start as @initialState
  
  # Parallel processing - fork
  shape fork as @fork
  
  # Order processing branch
  shape validateOrder as @activity label: "Validate Order"
  shape processPayment as @activity label: "Process Payment"
  shape orderFlowFinal as @flowFinal label: "Order Complete"
  
  # Notification branch
  shape sendEmailNotification as @activity label: "Send Email"
  shape sendSMSNotification as @activity label: "Send SMS"
  shape notificationFlowFinal as @flowFinal label: "Notifications Sent"
  
  # Logging branch (always runs)
  shape logTransaction as @activity label: "Log Transaction"
  shape auditCompliance as @activity label: "Audit Compliance"
  
  # Join all branches
  shape join as @join
  
  # Activity final - terminates everything
  shape activityEnd as @activityFinal

  # Fork into 3 parallel branches
  start -> fork
  fork -> validateOrder label: "order branch"
  fork -> sendEmailNotification label: "notification branch"
  fork -> logTransaction label: "logging branch"
  
  # Order branch - ends with flow final
  validateOrder -> processPayment
  processPayment -> orderFlowFinal
  
  # Notification branch - ends with flow final
  sendEmailNotification -> sendSMSNotification
  sendSMSNotification -> notificationFlowFinal
  
  # Logging branch - continues to join
  logTransaction -> auditCompliance
  auditCompliance -> join
  
  # Join and terminate
  join -> activityEnd
}
```

### Key Features

- **Activity Final** (`@activityFinal`): Bull's-eye circle terminates **entire** activity
- **Flow Final** (`@flowFinal`): Circle with X terminates **one flow** only
- **Fork/Join**: Parallel execution with synchronization
- **Partial Termination**: Order and notification branches end early with flow finals

### Final Node Comparison

| Node Type | Symbol | Effect | Use Case |
|-----------|--------|--------|----------|
| Activity Final | ⊙ (bull's-eye) | Ends entire activity | Process completion |
| Flow Final | ⊗ (circle-X) | Ends single flow | Branch termination |

### When to Use Each

- **Activity Final**: End of main workflow (e.g., order fully processed and logged)
- **Flow Final**: Early termination of parallel branch (e.g., notifications sent while logging continues)

---

## Decision and Merge Example

Branching logic with guard conditions.

### DSL Code

```runiq
diagram "User Authentication Flow" {
  direction TB

  shape start as @initialState
  shape enterCredentials as @activity label: "Enter Credentials"
  
  # Decision node
  shape checkAuth as @decision label: "Valid?"
  
  shape loadProfile as @activity label: "Load User Profile"
  shape checkRole as @decision label: "Has Admin Role?"
  
  shape showAdminPanel as @activity label: "Show Admin Panel"
  shape showUserPanel as @activity label: "Show User Panel"
  
  # Merge nodes
  shape merge1 as @merge
  
  shape logSuccess as @activity label: "Log Success"
  shape showError as @activity label: "Show Error"
  shape logFailure as @activity label: "Log Failure"
  
  shape end as @activityFinal

  # Main flow
  start -> enterCredentials
  enterCredentials -> checkAuth
  
  # Auth decision
  checkAuth -> loadProfile label: "[valid]"
  checkAuth -> showError label: "[invalid]"
  
  # Role decision
  loadProfile -> checkRole
  checkRole -> showAdminPanel label: "[yes]"
  checkRole -> showUserPanel label: "[no]"
  
  # Merge successful paths
  showAdminPanel -> merge1
  showUserPanel -> merge1
  merge1 -> logSuccess
  logSuccess -> end
  
  # Error path
  showError -> logFailure
  logFailure -> end
}
```

### Key Features

- **Decision Nodes** (`@decision`): Diamond shapes with guard conditions
- **Merge Nodes** (`@merge`): Combine multiple flows back together
- **Guard Conditions**: `[valid]`, `[invalid]`, `[yes]`, `[no]`
- **Multiple Paths**: Success and error paths through workflow

### Decision Patterns

1. **Binary Decision**: Valid/invalid authentication
2. **Multi-Way Decision**: Admin vs. user role check
3. **Merge After Decision**: Successful paths merge before logging
4. **Separate Error Path**: Failed authentication follows different route

---

## Related Resources

- [Activity Diagrams Guide](/guide/activity-diagrams) - Complete syntax reference
- [UML Activity Specification](https://www.omg.org/spec/UML/) - Official UML 2.5 specification
- [Diagram Profile](/guide/profiles#diagram-profile) - Overview of diagram capabilities

## Best Practices

### Activity Organization

- **Use Swimlanes**: When multiple actors or systems are involved
- **Direction**: Horizontal for cross-functional, vertical for time-based
- **Granularity**: Keep activities at consistent level of detail

### Control Flow

- **Initial State**: Always start with `@initialState`
- **Final Nodes**: 
  - Use `@activityFinal` to end entire process
  - Use `@flowFinal` to end parallel branches early
- **Guard Conditions**: Make conditions mutually exclusive and complete

### Data Flow

- **Object Nodes**: Show data transformation between activities
- **Pins**: Use input/output pins for complex data dependencies
- **Data Stores**: Distinguish temporary buffers from persistent databases

### Signal Usage

- **Send Signals**: Broadcast events to external systems
- **Accept Signals**: Wait for external events or responses
- **Time Events**: Add timeouts to prevent indefinite waiting

### Parallel Processing

- **Fork**: Split into concurrent branches with `@fork`
- **Join**: Synchronize branches with `@join`
- **Flow Finals**: Allow some branches to complete early
