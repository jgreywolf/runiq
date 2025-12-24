# Sequence Diagrams

Sequence diagrams show interactions between participants (actors, systems, services) over time. They're essential for documenting API flows, authentication sequences, and system interactions.

## Quick Start

```runiq
sequence "User Login" {
  participant "User" as actor
  participant "Web App" as boundary
  participant "Auth Service" as control
  participant "Database" as database

  message from:"User" to:"Web App" label:"Enter credentials" type:sync
  message from:"Web App" to:"Auth Service" label:"Validate" type:sync activate:true
  message from:"Auth Service" to:"Database" label:"Query user" type:sync
  message from:"Database" to:"Auth Service" label:"User data" type:return
  message from:"Auth Service" to:"Web App" label:"Auth token" type:return
  message from:"Web App" to:"User" label:"Success" type:return
}
```

## Key Concepts

### Participants

Participants represent the actors or systems in your sequence:

| Type       | Purpose                        | Example                          |
| ---------- | ------------------------------ | -------------------------------- |
| `actor`    | Human user or external actor   | User, Admin, Customer            |
| `entity`   | Business entity or data object | Order, Account, Document         |
| `boundary` | System boundary (UI, API)      | Web App, API Gateway, Mobile App |
| `control`  | Controller or service logic    | Auth Service, Payment Service    |
| `database` | Database or data store         | PostgreSQL, Redis, S3            |

**Syntax:**

```runiq
participant "Display Name" as type
```

**Examples:**

```runiq
participant "User" as actor
participant "API Gateway" as boundary
participant "Payment Service" as control
participant "PostgreSQL" as database
```

### Messages

Messages represent interactions between participants:

| Type      | Arrow Style     | Purpose                                |
| --------- | --------------- | -------------------------------------- |
| `sync`    | Solid `→`       | Synchronous call (waits for response)  |
| `async`   | Dashed `⇢`      | Asynchronous message (fire and forget) |
| `return`  | Dashed open `↤` | Return value                           |
| `create`  | Any             | Object creation                        |
| `destroy` | Any             | Object destruction                     |

**Syntax:**

```runiq
message from:"Source" to:"Target" label:"Message text" type:sync activate:true
```

**Properties:**

- `from:"name"` - Source participant (required)
- `to:"name"` - Target participant (required)
- `label:"text"` - Message description (required)
- `type:value` - Message type (optional, default: `sync`)
- `activate:true` - Show activation box on target (optional)

**Examples:**

```runiq
// Synchronous call with activation
message from:"Client" to:"Server" label:"GET /users" type:sync activate:true

// Async event
message from:"Service" to:"Queue" label:"user.created" type:async

// Return value
message from:"Server" to:"Client" label:"200 OK" type:return

// Object creation
message from:"Factory" to:"Object" label:"<<create>>" type:create

// Self-message
message from:"Service" to:"Service" label:"Validate data" type:sync
```

### Notes

Notes add explanatory text to your diagram:

**Syntax:**

```runiq
note "Note text" position:left participants:("ParticipantName")
note "Spanning note" position:over participants:("P1","P2")
```

**Position options:**

- `left` - Left of participant
- `right` - Right of participant
- `over` - Over one or more participants

**Examples:**

```runiq
note "Session stored in Redis" position:right participants:("Auth Service")
note "Async processing" position:over participants:("Queue","Worker")
```

### Fragments

Fragments show control flow (loops, conditions, parallel execution):

| Type       | Purpose                     | Example Use Case           |
| ---------- | --------------------------- | -------------------------- |
| `loop`     | Repeated execution          | Retry logic, polling       |
| `alt`      | Alternative paths (if/else) | Success/failure handling   |
| `opt`      | Optional execution          | Cache check, optional step |
| `par`      | Parallel execution          | Multiple async calls       |
| `critical` | Critical section            | Mutex, transaction         |
| `break`    | Break from loop             | Early exit condition       |

**Syntax:**

```runiq
// Simple fragment
fragment loop "Condition" from:0 to:3

// Alt fragment with alternatives
fragment alt "Decision" from:5 to:10 alternatives:("Success":5..7,"Failure":8..10)
```

**Properties:**

- `type` - Fragment type (required)
- `label` - Condition or description (optional)
- `from:N` - Starting message index (required)
- `to:N` - Ending message index (required)
- `alternatives:()` - For `alt` fragments, defines alternative paths

**Examples:**

```runiq
// Loop with retry
fragment loop "Retry up to 3 times" from:2 to:5

// Alternative paths
fragment alt "Response" from:6 to:9 alternatives:("2xx":6..7,"4xx":8..9)

// Optional cache check
fragment opt "Check cache" from:3 to:4

// Parallel async calls
fragment par "Parallel notification" from:10 to:12
```

## Complete Examples

### Authentication Flow

```runiq
sequence "User Authentication" {
  participant "User" as actor
  participant "Web App" as entity
  participant "Auth Service" as control
  participant "Database" as database

  message from:"User" to:"Web App" label:"Enter credentials" type:sync
  message from:"Web App" to:"Auth Service" label:"Validate login" type:sync activate:true
  message from:"Auth Service" to:"Database" label:"Query user" type:sync
  message from:"Database" to:"Auth Service" label:"User data" type:return
  message from:"Auth Service" to:"Web App" label:"Auth token" type:return
  message from:"Web App" to:"User" label:"Login success" type:return

  note "Token stored in session" position:right participants:("Web App")
}
```

### API with Error Handling

```runiq
sequence "API Request with Error Handling" {
  participant "Client" as actor
  participant "API Gateway" as boundary
  participant "Service" as control
  participant "Cache" as database

  message from:"Client" to:"API Gateway" label:"GET /data" type:sync
  message from:"API Gateway" to:"Service" label:"Process request" type:sync activate:true
  message from:"Service" to:"Cache" label:"Check cache" type:sync

  fragment alt "Cache Status" from:3 to:7 alternatives:("Cache Hit":3..4,"Cache Miss":5..6)

  message from:"Cache" to:"Service" label:"Cache hit" type:return
  message from:"Service" to:"API Gateway" label:"200 OK" type:return
  message from:"Cache" to:"Service" label:"Cache miss" type:return
  message from:"Service" to:"API Gateway" label:"404 Not Found" type:return

  message from:"API Gateway" to:"Client" label:"Response" type:return
}
```

### Async Event-Driven

```runiq
sequence "Event-Driven Async Processing" {
  participant "User Service" as control
  participant "Message Queue" as boundary
  participant "Email Service" as control
  participant "Notification Service" as control

  message from:"User Service" to:"Message Queue" label:"Publish user.created event" type:async

  note "Services consume events asynchronously" position:over participants:("Message Queue")

  message from:"Message Queue" to:"Email Service" label:"user.created" type:async activate:true
  message from:"Email Service" to:"Email Service" label:"Send welcome email" type:sync

  message from:"Message Queue" to:"Notification Service" label:"user.created" type:async activate:true
  message from:"Notification Service" to:"Notification Service" label:"Send push notification" type:sync
}
```

### Retry Logic

```runiq
sequence "API with Retry Logic" {
  participant "Client" as actor
  participant "Load Balancer" as boundary
  participant "Service Instance" as control
  participant "Database" as database

  message from:"Client" to:"Load Balancer" label:"POST /order" type:sync
  message from:"Load Balancer" to:"Service Instance" label:"Create order" type:sync activate:true

  fragment loop "Retry up to 3 times" from:2 to:5

  message from:"Service Instance" to:"Database" label:"BEGIN transaction" type:sync
  message from:"Database" to:"Service Instance" label:"ACK" type:return
  message from:"Service Instance" to:"Database" label:"INSERT order" type:sync
  message from:"Database" to:"Service Instance" label:"Success/Failure" type:return

  message from:"Service Instance" to:"Load Balancer" label:"Order created" type:return
  message from:"Load Balancer" to:"Client" label:"201 Created" type:return

  note "Exponential backoff between retries" position:right participants:("Service Instance")
}
```

## Best Practices

### 1. Participant Naming

- Use descriptive names that clearly identify roles
- Group related participants (all databases, all services)
- Use consistent naming across diagrams

### 2. Message Labels

- Use action verbs: "Login", "Validate", "Query"
- Be specific: "GET /users" better than "Request"
- Include important parameters: "Retry (attempt 3/3)"

### 3. Activation Boxes

- Use sparingly for important processing blocks
- Shows when a participant is "active" or "processing"
- Helps identify synchronous vs background processing

### 4. Notes

- Clarify complex logic or business rules
- Document assumptions or constraints
- Add technical implementation details

### 5. Fragments

- **Loop**: Always include iteration condition
- **Alt**: Provide clear condition labels for each path
- **Opt**: Explain when the optional step executes
- Keep fragments small and focused

### 6. Message Order

- Messages flow from top to bottom (time flows down)
- Index fragments by message order (0-based)
- Group related messages logically

## Technical Details

### Participant ID Generation

Participant IDs are automatically generated from display names:

- Convert to lowercase
- Replace spaces with underscores
- Remove special characters

```runiq
participant "API Gateway"  // ID: api_gateway
participant "Auth-Service" // ID: auth-service
participant "db_primary"   // ID: db_primary
```

### Fragment Message Indices

Fragments reference messages by 0-based index:

```runiq
message from:"A" to:"B" label:"M1" // Index 0
message from:"B" to:"A" label:"M2" // Index 1
message from:"A" to:"B" label:"M3" // Index 2

fragment loop "Process" from:0 to:2  // Covers M1, M2, M3
```

### Alternative Syntax

For `alt` fragments, use `..` to specify message ranges:

```runiq
fragment alt "Check" from:5 to:10 alternatives:("Success":5..7,"Failure":8..10)
// Success path: messages 5, 6, 7
// Failure path: messages 8, 9, 10
```

## Rendering

Sequence diagrams are rendered with:

- **Participants** at the top with type-specific styling
- **Lifelines** as vertical dashed lines
- **Messages** with appropriate arrow styles
- **Activation boxes** showing active processing
- **Notes** with folded corner styling
- **Fragments** as colored boxes with labeled tabs

### Customization

```typescript
import { renderSequenceDiagram } from '@runiq/renderer-svg';

const options = {
  width: 1000,
  height: 800,
  participantSpacing: 200,
  messageSpacing: 80,
  participantColor: '#4A90E2',
  messageColor: '#333333',
  noteColor: '#FFFACD',
  fragmentColor: '#E8F4F8',
};

const result = renderSequenceDiagram(profile, options);
```

## Future Enhancements

Planned features:

- Nested fragments
- Time constraints and timing marks
- State invariants
- Interaction use (sub-sequences)
- Continuation markers
- Participant destruction visualization
- Interactive SVG (collapsible fragments, hover details)

## See Also

- [Sequence Diagrams Guide](/guide/diagram-types/sequence-diagrams)
- [Profile System](/guide/profiles)
- [DSL Syntax Reference](/reference/dsl)
- [UML Sequence Diagram Specification](https://www.omg.org/spec/UML/2.5.1/)
