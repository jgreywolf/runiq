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

| Type | Syntax | Description | Arrow |
|------|--------|-------------|-------|
| Synchronous | `type:sync` | Blocking call, waits for response | Solid arrow →
 |
| Asynchronous | `type:async` | Non-blocking, fire-and-forget | Open arrow → |
| Return | `type:return` | Response message | Dashed arrow ← |
| Create | `type:create` | Object instantiation | Solid arrow → |
| Destroy | `type:destroy` | Object deletion | X symbol |

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

- Authentication flow
- API error handling
- Async messaging
- Object lifecycle
- Retry loops

## Related

- [Profiles](/guide/profiles)
- [Shape Reference - UML Shapes](/reference/shapes#_10-uml-shapes-22-shapes)
- [UML Class Diagrams](/guide/class-diagrams)
- [Use Case Diagrams](/guide/use-case-diagrams)

## Resources

- [UML 2.5 Specification](https://www.omg.org/spec/UML/2.5/)
- [Sequence Diagram Tutorial](https://www.visual-paradigm.com/guide/uml-unified-modeling-language/what-is-sequence-diagram/)
- [OMG UML](https://www.omg.org/spec/UML/)
