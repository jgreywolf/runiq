---
title: Sequence Diagrams
---

# Sequence Diagrams

Create UML sequence diagrams to visualize interactions between objects over time with Runiq's sequence profile.

## Overview

Sequence diagrams show how objects interact through messages exchanged over time. They're essential for documenting API flows, authentication sequences, and system interactions.

## Key Concepts

### Participants

Define the actors/objects in the interaction:

```runiq
sequence "Message Flow" {
  participant "User" as actor
  participant "Web App" as boundary
  participant "API" as control
  participant "Database" as database
}
```

**Stereotypes:**

- `actor` - External user or system
- `boundary` - User interface, API gateway
- `control` - Business logic, controllers
- `entity` - Data objects
- `database` - Data stores

### Message Types

| Type         | Syntax         | Description                       | Arrow          |
| ------------ | -------------- | --------------------------------- | -------------- |
| Synchronous  | `type:sync`    | Blocking call, waits for response | Solid arrow →  |
|  |
| Asynchronous | `type:async`   | Non-blocking, fire-and-forget     | Open arrow →   |
| Return       | `type:return`  | Response message                  | Dashed arrow ← |
| Create       | `type:create`  | Object instantiation              | Solid arrow →  |
| Destroy      | `type:destroy` | Object deletion                   | X symbol       |

## Basic Sequence Diagram

```runiq
sequence "User Login" {
  participant "User" as actor
  participant "Web App" as boundary
  participant "Auth Service" as control
  participant "Database" as database

  message from: "User" to: "Web App" label: "Enter credentials" type: sync
  message from: "Web App" to: "Auth Service" label: "Validate" type: sync activate: true
  message from: "Auth Service" to: "Database" label: "Query user" type: sync
  message from: "Database" to: "Auth Service" label: "User data" type: return
  message from: "Auth Service" to: "Web App" label: "Auth token" type: return
  message from: "Web App" to: "User" label: "Success" type: return
}
```

## Activation Boxes

Show when objects are actively processing:

```runiq
sequence "Order Processing" {
  participant "Customer" as actor
  participant "Order Service" as control
  participant "Payment Service" as control
  participant "Inventory" as entity

  message from: "Customer" to: "Order Service" label: "Place order" type: sync activate: true
  message from: "Order Service" to: "Payment Service" label: "Process payment" type: sync activate: true
  message from: "Payment Service" to: "Order Service" label: "Payment confirmed" type: return deactivate: true
  message from: "Order Service" to: "Inventory" label: "Reserve items" type: sync
  message from: "Inventory" to: "Order Service" label: "Reserved" type: return
  message from: "Order Service" to: "Customer" label: "Order confirmed" type: return deactivate: true
}
```

## Asynchronous Messages

Fire-and-forget operations:

```runiq
sequence "Async Messaging" {
  participant "Producer" as control
  participant "Message Queue" as entity
  participant "Consumer" as control
  participant "Database" as database

  message from: "Producer" to: "Message Queue" label: "Publish event" type: async
  message from: "Message Queue" to: "Consumer" label: "Event delivered" type: async activate: true
  message from: "Consumer" to: "Database" label: "Store data" type: sync
  message from: "Database" to: "Consumer" label: "Success" type: return deactivate: true
}
```

## Self-Messages

Object calling itself:

```runiq
sequence "Recursive Processing" {
  participant "Service" as control
  participant "Database" as database

  message from: "Service" to: "Service" label: "Validate input" type: sync
  message from: "Service" to: "Database" label: "Save" type: sync
  message from: "Database" to: "Service" label: "Saved" type: return
  message from: "Service" to: "Service" label: "Log success" type: sync
}
```

## Object Lifecycle

Create and destroy objects:

```runiq
sequence "Session Management" {
  participant "Client" as actor
  participant "Server" as control
  participant "Session" as entity

  message from: "Client" to: "Server" label: "Login" type: sync
  message from: "Server" to: "Session" label: "Create" type: create
  message from: "Session" to: "Server" label: "Session ID" type: return
  message from: "Server" to: "Client" label: "Token" type: return

  message from: "Client" to: "Server" label: "Logout" type: sync
  message from: "Server" to: "Session" label: "Destroy" type: destroy
  message from: "Server" to: "Client" label: "Success" type: return
}
```

## Alternative Flows (Alt Fragment)

Conditional branching:

```runiq
sequence "Authentication with Validation" {
  participant "User" as actor
  participant "System" as control
  participant "Database" as database

  message from: "User" to: "System" label: "Login" type: sync

  alt "Valid credentials" {
    message from: "System" to: "Database" label: "Check user" type: sync
    message from: "Database" to: "System" label: "User found" type: return
    message from: "System" to: "User" label: "Success" type: return
  }
  else "Invalid credentials" {
    message from: "System" to: "User" label: "Error" type: return
  }
}
```

## Loop Fragment

Repeated operations:

```runiq
sequence "Batch Processing" {
  participant "Scheduler" as control
  participant "Processor" as control
  participant "Database" as database

  loop "For each item" times: 100 {
    message from: "Scheduler" to: "Processor" label: "Process item" type: sync activate: true
    message from: "Processor" to: "Database" label: "Save result" type: sync
    message from: "Database" to: "Processor" label: "Saved" type: return deactivate: true
  }
}
```

## Parallel Processing (Par Fragment)

Concurrent operations:

```runiq
sequence "Parallel API Calls" {
  participant "Client" as actor
  participant "Gateway" as control
  participant "Service A" as control
  participant "Service B" as control
  participant "Service C" as control

  message from: "Client" to: "Gateway" label: "Request" type: sync activate: true

  par {
    message from: "Gateway" to: "Service A" label: "Fetch data" type: async
    message from: "Service A" to: "Gateway" label: "Data A" type: return
  }
  and {
    message from: "Gateway" to: "Service B" label: "Fetch data" type: async
    message from: "Service B" to: "Gateway" label: "Data B" type: return
  }
  and {
    message from: "Gateway" to: "Service C" label: "Fetch data" type: async
    message from: "Service C" to: "Gateway" label: "Data C" type: return
  }

  message from: "Gateway" to: "Client" label: "Combined result" type: return deactivate: true
}
```

## Error Handling

```runiq
sequence "API with Error Handling" {
  participant "Client" as actor
  participant "API" as control
  participant "Database" as database

  message from: "Client" to: "API" label: "Request" type: sync activate: true

  try {
    message from: "API" to: "Database" label: "Query" type: sync
    message from: "Database" to: "API" label: "Result" type: return
    message from: "API" to: "Client" label: "Success" type: return deactivate: true
  }
  catch "Database Error" {
    message from: "API" to: "API" label: "Log error" type: sync
    message from: "API" to: "Client" label: "500 Error" type: return deactivate: true
  }
}
```

## Retry Logic

```runiq
sequence "Retry Pattern" {
  participant "Client" as actor
  participant "Service" as control
  participant "External API" as boundary

  message from: "Client" to: "Service" label: "Request" type: sync activate: true

  loop "Retry up to 3 times" {
    message from: "Service" to: "External API" label: "API call" type: sync

    opt "If timeout" {
      message from: "Service" to: "Service" label: "Wait & retry" type: sync
    }
  }

  message from: "External API" to: "Service" label: "Response" type: return
  message from: "Service" to: "Client" label: "Result" type: return deactivate: true
}
```

## Complex OAuth Flow

```runiq
sequence "OAuth 2.0 Authorization Code Flow" {
  participant "User" as actor
  participant "Client App" as boundary
  participant "Auth Server" as control
  participant "Resource Server" as entity

  message from: "User" to: "Client App" label: "Initiate login" type: sync
  message from: "Client App" to: "Auth Server" label: "Authorization request" type: sync
  message from: "Auth Server" to: "User" label: "Login prompt" type: return
  message from: "User" to: "Auth Server" label: "Credentials" type: sync
  message from: "Auth Server" to: "User" label: "Authorization code" type: return
  message from: "User" to: "Client App" label: "Code" type: sync
  message from: "Client App" to: "Auth Server" label: "Exchange code for token" type: sync activate: true
  message from: "Auth Server" to: "Client App" label: "Access token" type: return deactivate: true
  message from: "Client App" to: "Resource Server" label: "API request + token" type: sync
  message from: "Resource Server" to: "Client App" label: "Protected resource" type: return
  message from: "Client App" to: "User" label: "Display data" type: return
}
```

## Advanced Features (UML 2.5)

Runiq supports advanced UML 2.5 sequence diagram features for production-ready specifications.

### Gates

Gates are connection points at fragment boundaries that define where messages can enter or exit a combined fragment. They're essential for complex message routing in microservices and distributed systems.

**Syntax:**
```runiq
fragment <type> "<label>" from:<start> to:<end> gates:["gateName1", "gateName2", ...]
```

**Example - API Gateway with Conditional Routing:**
```runiq
sequence "API Gateway with Gates" {
  participant "Client" as actor
  participant "API Gateway" as boundary
  participant "Auth Service" as control
  participant "Data Service" as control

  message from: "Client" to: "API Gateway" label: "POST /api/data" type: sync

  // Fragment with gates for authentication routing
  fragment alt "Authentication Flow" from: 1 to: 4 
    gates: ["authIn", "authSuccess", "authFail"]
    alternatives: ("Valid Token": 1..2, "Invalid Token": 2..4)
  
  message from: "API Gateway" to: "Auth Service" label: "validateToken()" type: sync
  message from: "Auth Service" to: "API Gateway" label: "valid" type: return
  message from: "API Gateway" to: "Client" label: "401 Unauthorized" type: return

  message from: "API Gateway" to: "Data Service" label: "fetchData()" type: sync
  message from: "Data Service" to: "API Gateway" label: "data" type: return
  message from: "API Gateway" to: "Client" label: "200 OK" type: return
}
```

**Gate Names:**
- Use descriptive names: `"authIn"`, `"errorExit"`, `"dataFlow"`
- Common patterns: `"in"/"out"`, `"entry"/"success"/"error"`
- Multiple gates per fragment supported

**Use Cases:**
- **Microservices routing**: Define entry/exit points for service boundaries
- **Error handling paths**: Specify where exceptions propagate
- **Parallel execution**: Track which concurrent path messages flow through
- **Transaction boundaries**: Mark transaction start/commit/rollback points

### Duration Constraints

Duration constraints specify timing requirements between messages, documenting SLAs and performance requirements.

**Syntax:**
```runiq
durationConstraint from:<messageIndex> to:<messageIndex> constraint:"<timing requirement>"
```

**Example - E-Commerce Order Processing:**
```runiq
sequence "Order Processing with SLAs" {
  participant "Customer" as actor
  participant "Order Service" as control
  participant "Inventory Service" as control
  participant "Payment Gateway" as control

  message from: "Customer" to: "Order Service" label: "Place Order" type: sync
  
  message from: "Order Service" to: "Inventory Service" label: "checkAvailability()" type: sync
  message from: "Inventory Service" to: "Order Service" label: "available" type: return
  
  message from: "Order Service" to: "Payment Gateway" label: "processPayment()" type: sync
  message from: "Payment Gateway" to: "Order Service" label: "confirmed" type: return
  
  message from: "Order Service" to: "Customer" label: "success" type: return

  // Inventory check must be fast (< 100ms)
  durationConstraint from: 1 to: 2 constraint: "< 100ms"
  
  // Payment processing SLA (500ms to 2 seconds is acceptable)
  durationConstraint from: 3 to: 4 constraint: "{500ms..2s}"
  
  // Total end-to-end response time (P99 SLA < 3 seconds)
  durationConstraint from: 0 to: 5 constraint: "< 3s (P99)"
}
```

**Constraint Formats:**
- **Upper bound**: `"< 100ms"`, `"< 2s"`
- **Range**: `"{500ms..2s}"`, `"{1s..5s}"`
- **Percentile**: `"< 3s (P99)"`, `"< 500ms (P95)"`
- **Descriptive**: `"Real-time (< 50ms)"`, `"Batch processing (< 5min)"`

**Message Indexing:**
- Messages are **zero-indexed** (first message = 0)
- Use `from: 0 to: 5` to span from first to sixth message
- Constraints can **overlap** to track different SLAs

**Use Cases:**
- **API SLAs**: Document response time requirements
- **Performance budgets**: Specify timing for critical paths
- **Timeout configuration**: Show maximum wait times
- **Real-time systems**: Express hard real-time constraints

### Interaction Use (ref Fragments)

Interaction use allows referencing other sequence diagrams, promoting modularity and reusability. In UML 2.5, this is called "interaction occurrence" or "ref" fragment.

**Syntax:**
```runiq
fragment ref "<description>" from:<start> to:<end> ref:"<SequenceName>"
```

**With gates:**
```runiq
fragment ref "<description>" from:<start> to:<end> ref:"<SequenceName>" gates:["in", "out"]
```

**Example - User Registration with Modular Sub-sequences:**
```runiq
sequence "User Registration Flow" {
  participant "User" as actor
  participant "Registration Page" as boundary
  participant "User Service" as control
  participant "Email Service" as control
  participant "Database" as database

  message from: "User" to: "Registration Page" label: "Submit registration" type: sync
  message from: "Registration Page" to: "User Service" label: "registerUser()" type: sync

  // Reference to validation sequence diagram
  fragment ref "Input Validation" from: 2 to: 3 ref: "ValidationSequence"
  
  message from: "User Service" to: "Database" label: "checkEmailExists()" type: sync
  message from: "Database" to: "User Service" label: "not exists" type: return

  // Reference to authentication setup with error handling gates
  fragment ref "Create Auth Credentials" from: 5 to: 6 
    ref: "AuthCredentialCreationSequence" 
    gates: ["authIn", "authSuccess", "authFail"]
  
  message from: "User Service" to: "Database" label: "insertUser()" type: sync
  message from: "Database" to: "User Service" label: "success" type: return

  // Reference to email verification flow
  fragment ref "Send Verification Email" from: 8 to: 9 ref: "EmailVerificationSequence"
  
  message from: "User Service" to: "Email Service" label: "sendWelcomeEmail()" type: async

  message from: "User Service" to: "Registration Page" label: "success" type: return
  message from: "Registration Page" to: "User" label: "Show success message" type: return
}
```

**Benefits:**
- **Reusability**: Define common sequences once (authentication, validation, error handling)
- **Maintainability**: Update sub-sequences independently
- **Readability**: Keep main sequence focused on high-level flow
- **Modularity**: Break complex interactions into manageable pieces

**Referenced Sequence Examples:**
- `"ValidationSequence"` - Input validation logic
- `"AuthCredentialCreationSequence"` - User credential setup
- `"EmailVerificationSequence"` - Email verification flow
- `"ErrorHandlingSequence"` - Common error handling
- `"LoggingSequence"` - Audit logging

**Use Cases:**
- **Authentication flows**: Reuse login/logout sequences
- **Validation**: Common input validation patterns
- **Error handling**: Standard error response sequences
- **Audit trails**: Logging sub-sequences
- **Payment processing**: Reusable payment flows

### State Invariants

State invariants express conditions that **must be true** at specific points in the sequence. They document preconditions, postconditions, and system state during execution.

**Syntax:**
```runiq
message from: "A" to: "B" label: "operation()" type: sync stateInvariant: "<condition>"
```

**Example - Secure Authentication:**
```runiq
sequence "Authentication with State Invariants" {
  participant "User" as actor
  participant "Auth Service" as control
  participant "Session Store" as database
  participant "User Database" as database

  message from: "User" to: "Auth Service" label: "login(username, password)" type: sync 
    stateInvariant: "user.isAuthenticated == false"
  
  message from: "Auth Service" to: "User Database" label: "verifyCredentials()" type: sync
  message from: "User Database" to: "Auth Service" label: "valid" type: return 
    stateInvariant: "user.exists && user.passwordMatches"
  
  message from: "Auth Service" to: "Session Store" label: "createSession()" type: sync 
    stateInvariant: "credentials.validated"
  message from: "Session Store" to: "Auth Service" label: "sessionId" type: return 
    stateInvariant: "session.created && session.active"
  
  message from: "Auth Service" to: "User" label: "auth success" type: return 
    stateInvariant: "user.isAuthenticated && session.active"
}
```

**Example - Bank Transfer:**
```runiq
sequence "Bank Transfer" {
  participant "Account A" as database
  participant "Account B" as database
  
  message from: "Account A" to: "Account B" label: "transfer($100)" type: sync 
    stateInvariant: "accountA.balance >= 100"
  
  message from: "Account B" to: "Account A" label: "confirmed" type: return 
    stateInvariant: "accountB.balance >= 0 && accountA.balance >= 0"
}
```

**Invariant Formats:**
- **Boolean expressions**: `"user.isAuthenticated == false"`
- **Logical operators**: `"balance >= 0 && status == 'active'"`
- **Comparisons**: `"count > 0"`, `"age >= 18"`
- **OCL-style**: `"self.items->size() > 0"`
- **Descriptive**: `"session.active"`, `"credentials.validated"`

**Use Cases:**
- **Security**: Document authentication/authorization states
- **Financial transactions**: Verify account balances
- **Resource management**: Ensure availability constraints
- **Concurrency**: Express locking and synchronization states
- **Validation**: Document preconditions and postconditions

### Combining Advanced Features

All four advanced features work together seamlessly:

```runiq
sequence "Microservices Request with All Features" {
  participant "Client" as actor
  participant "API Gateway" as boundary
  participant "Auth Service" as control
  participant "Data Service" as control

  message from: "Client" to: "API Gateway" label: "GET /data" type: sync 
    stateInvariant: "client.hasValidToken"

  // Gates for routing with state validation
  fragment alt "Auth Check" from: 1 to: 3 
    gates: ["authIn", "authSuccess", "authFail"]
    alternatives: ("Valid": 1..2, "Invalid": 2..3)
  
  message from: "API Gateway" to: "Auth Service" label: "validate()" type: sync 
    stateInvariant: "request.hasAuthHeader"
  message from: "Auth Service" to: "API Gateway" label: "valid" type: return 
    stateInvariant: "token.verified"
  message from: "API Gateway" to: "Client" label: "401" type: return

  // Reference to data fetching with timing constraint
  fragment ref "Data Retrieval" from: 4 to: 5 ref: "DataFetchSequence" gates: ["dataIn", "dataOut"]
  
  message from: "API Gateway" to: "Data Service" label: "fetchData()" type: sync
  message from: "Data Service" to: "API Gateway" label: "data" type: return 
    stateInvariant: "data.valid && data.complete"

  message from: "API Gateway" to: "Client" label: "200 OK" type: return

  // Auth validation must be fast
  durationConstraint from: 1 to: 2 constraint: "< 50ms"
  
  // Total request time SLA
  durationConstraint from: 0 to: 6 constraint: "< 200ms (P95)"
}
```

**Feature Interaction:**
- **Gates + State Invariants**: Define state conditions at gate entry/exit points
- **Duration Constraints + ref**: Specify timing for referenced sub-sequences
- **Gates + ref**: Control message flow into/out of referenced sequences
- **State Invariants + Duration**: Verify state within time bounds

## Styling

Customize sequence diagram appearance:

```runiq
sequence "Styled Sequence" {
  style: {
    participantBackground: "#f0f9ff",
    participantBorder: "#3b82f6",
    activationBackground: "#dbeafe",
    messageColor: "#1e40af",
    messageFont: "Arial, sans-serif"
  }

  participant "User" as actor style: { fill: "#dbeafe", stroke: "#3b82f6" }
  participant "System" as control style: { fill: "#d1fae5", stroke: "#10b981" }

  message from: "User" to: "System" label: "Request" type: sync
    style: { stroke: "#3b82f6", strokeWidth: 2 }
}
```

## Best Practices

1. **Order participants logically** - Left to right by interaction order
2. **Use stereotypes** - Indicate participant types (actor, boundary, control, entity)
3. **Show activation** - Use activation boxes to show processing time
4. **Label messages clearly** - Use verb phrases (e.g., "Get user data")
5. **Use fragments wisely** - Alt, loop, par for control flow
6. **Include return messages** - Show responses explicitly
7. **Keep it focused** - One scenario per diagram
8. **Show timing** - Use activation boxes to indicate duration

## Message Numbering

Add sequence numbers for complex diagrams:

```runiq
sequence "Numbered Messages" {
  participant "A" as control
  participant "B" as control
  participant "C" as control

  message from: "A" to: "B" label: "1: Request" type: sync
  message from: "B" to: "C" label: "1.1: Sub-request" type: sync
  message from: "C" to: "B" label: "1.1.1: Response" type: return
  message from: "B" to: "A" label: "1.2: Response" type: return
}
```

## Examples

See the [examples/sequence](https://github.com/jgreywolf/runiq/tree/main/examples/sequence) directory for complete examples:

**Basic Examples:**
- `auth-flow.runiq` - Authentication flow
- `api-error-handling.runiq` - API error handling
- `async-messaging.runiq` - Async messaging
- `object-lifecycle.runiq` - Object lifecycle
- `retry-loop.runiq` - Retry loops

**Advanced Features (UML 2.5):**
- `gates-example.runiq` - API Gateway with conditional routing gates
- `duration-constraints-example.runiq` - E-commerce order processing with SLAs
- `interaction-use-example.runiq` - User registration with modular sub-sequences
- `advanced-timing-example.runiq` - Payment processing with timing constraints
- `state-invariants-auth.runiq` - Authentication flow with security state checks
- `state-invariants-transaction.runiq` - Bank transfer with balance invariants
- `state-invariants-locking.runiq` - Resource locking with mutex properties
- `combined-features-example.runiq` - Microservices showing gates, constraints, refs, and invariants together

## Related

- [Profiles](/guide/profiles)
- [Shape Reference - UML Shapes](/reference/shapes#_10-uml-shapes-22-shapes)
- [UML Class Diagrams](/guide/class-diagrams)
- [Use Case Diagrams](/guide/use-case-diagrams)

## Resources

- [UML 2.5 Specification](https://www.omg.org/spec/UML/2.5/)
- [Sequence Diagram Tutorial](https://www.visual-paradigm.com/guide/uml-unified-modeling-language/what-is-sequence-diagram/)
- [OMG UML](https://www.omg.org/spec/UML/)
