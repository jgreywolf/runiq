# Sequence Diagram Advanced Features Guide

This guide documents the UML 2.5 sequence diagram features implemented in Runiq: Gates, Duration Constraints, and Interaction Use (ref fragments).

## Feature Overview

These three features work together to create production-ready sequence diagrams:

- **Gates**: Define connection points for fragment boundaries (data flow routing)
- **Duration Constraints**: Specify timing requirements and SLAs
- **Interaction Use (ref)**: Reference modular sub-sequences for reusability

## Syntax Rules

### Statement Ordering

Sequence diagrams must follow this specific order:

1. **Participants** (required, must come first)
2. **Messages, Notes, and Fragments** (can be interspersed in any order)
3. **Duration Constraints** (must come last)

**Example:**
```
sequence "My Sequence" {
  // 1. Participants first
  participant user "User"
  participant api "API"
  
  // 2. Messages, notes, fragments can be mixed
  user -> api: "request"
  note over api: "Processing"
  fragment alt "Check" from:1 to:2 {
    // ...
  }
  api -> user: "response"
  
  // 3. Duration constraints last
  durationConstraint from:1 to:2 constraint:"< 100ms"
}
```

## 1. Gates

Gates are connection points at fragment boundaries that show data flow routing.

### Syntax

```
fragment <type> "<label>" from:<msg> to:<msg> gates:["gate1", "gate2", ...]
```

**Important**: Fragment statements come AFTER the messages they annotate. The `from` and `to` indices reference already-defined messages.

### Example

```runiq
sequence "API Gateway Routing" {
  participant client "Client"
  participant gateway "API Gateway"
  participant authSvc "Auth Service"
  
  // First define the messages
  client -> gateway: "GET /profile"
  gateway -> authSvc: "validate(token)"
  authSvc -> gateway: "valid"
  gateway -> client: "200 OK"
  
  // Then annotate them with a fragment showing gates
  fragment alt "Auth Check" from:1 to:3 gates:["request", "valid", "invalid"]
}
```

### Use Cases

- **Routing logic**: Show which path data takes through conditional branches
- **Parallel flows**: Label entry/exit points for concurrent operations
- **Integration points**: Document interface boundaries between systems

## 2. Duration Constraints

Duration constraints specify timing requirements between messages (SLAs, performance targets).

### Syntax

```
durationConstraint from:<msgIndex> to:<msgIndex> constraint:"<expression>"
```

### Message Indices

Messages are zero-indexed. Use the index to specify which messages the constraint applies to:

```
msg 0: A -> B
msg 1: B -> C
msg 2: C -> A

durationConstraint from:0 to:2 constraint:"< 100ms"  // A->B to C->A must be < 100ms
```

### Constraint Formats

All formats are supported (stored as strings for flexibility):

1. **Simple**: `"< 100ms"`, `"≤ 500ms"`, `"> 50ms"`
2. **UML Intervals**: `"[50..100]ms"`, `"{0..50}ms"`
3. **Mathematical**: `"t < 100ms"`, `"50ms < t < 100ms"`
4. **Ranges**: `"50-100ms"`, `"100-200 milliseconds"`
5. **Descriptive**: `"< 100ms P95 SLA"`, `"less than 500ms average"`

### Example

```runiq
sequence "E-Commerce Order Processing" {
  participant user "Customer"
  participant web "Web Server"
  participant db "Database"
  participant payment "Payment Gateway"
  
  user -> web: "Place Order"
  web -> db: "Create Order Record"
  db -> web: "Order ID: 12345"
  web -> payment: "Process Payment"
  payment -> web: "Payment Confirmed"
  web -> db: "Update Order Status"
  db -> web: "Success"
  web -> user: "Order Confirmed"
  
  note right of web: "All timing constraints must meet P95 SLA targets"
  
  // Duration constraints (must be at end)
  durationConstraint from:0 to:1 constraint:"< 100ms"
  durationConstraint from:3 to:4 constraint:"< 2000ms"
  durationConstraint from:0 to:7 constraint:"< 3000ms P95 SLA"
}
```

## 3. Interaction Use (ref fragments)

Ref fragments reference other sequence diagrams, enabling modular design and reusability.

### Syntax

```
fragment ref "<label>" from:<msg> to:<msg> ref:"<SequenceName>" [gates:[...]]
```

**Important**: Like all fragments, `ref` statements come AFTER the messages they reference. The `from` and `to` indices point to already-defined messages.

### Example

```runiq
sequence "User Registration Flow" {
  participant user "User"
  participant app "App"
  participant auth "Auth Service"
  participant db "Database"
  
  // First define all the messages
  user -> app: "Register"
  app -> auth: "Create Account"
  auth -> db: "Store User"
  db -> auth: "Success"
  auth -> app: "Account Created"
  app -> user: "Welcome!"
  
  // Then reference the email verification sub-sequence
  fragment ref "Email Verification" from:2 to:3 ref:"EmailVerificationSequence"
}
```

### Use Cases

- **Modular design**: Break complex flows into manageable sub-sequences
- **Reusability**: Reference common patterns (authentication, error handling)
- **Documentation**: Keep high-level flows readable while linking to detailed sub-flows

## Combining Features

All three features work together seamlessly:

```runiq
sequence "Microservices Request Processing" {
  participant mobile_app "Mobile App"
  participant api_gateway "API Gateway"
  participant auth_service "Auth Service"
  participant product_service "Product Service"
  participant recommendation_engine "Recommendation Engine"
  
  // Define all messages first
  mobile_app -> api_gateway: "GET /products"
  api_gateway -> auth_service: "validateJWT(token)"
  api_gateway -> product_service: "getProducts()"
  product_service -> api_gateway: "product list"
  api_gateway -> recommendation_engine: "getRecommendations()"
  recommendation_engine -> api_gateway: "recommendations"
  api_gateway -> mobile_app: "200 OK"
  
  // Then annotate with fragments
  fragment ref "JWT Validation" from:1 to:2 ref:"JWTValidationSequence" gates:["jwtIn", "validOut", "invalidOut"]
  fragment par "Fetch Data" from:2 to:5 gates:["parallelIn", "productGate", "recoGate", "mergeGate"]
  
  // Finally add timing constraints
  durationConstraint from:1 to:2 constraint:"< 50ms"
  durationConstraint from:2 to:5 constraint:"< 200ms"
  durationConstraint from:0 to:6 constraint:"< 300ms P95 SLA"
}
```

## Example Files

See the following complete examples:

1. **`gates-example.runiq`**: API Gateway with conditional routing gates
2. **`duration-constraints-example.runiq`**: E-commerce order processing with SLAs
3. **`interaction-use-example.runiq`**: User registration with modular sub-sequences
4. **`advanced-timing-example.runiq`**: Payment processing with all constraint formats
5. **`combined-features-example.runiq`**: Microservices request showing all three features

## Implementation Notes

- **Grammar regeneration**: After modifying fragment types, run `pnpm langium:generate`
- **Message indexing**: Messages are zero-indexed (first message = 0)
- **Gates**: Stored as string arrays, can be any descriptive names
- **Constraints**: Stored as strings, no validation (allows flexibility)
- **References**: String identifiers for other sequences (not validated at parse time)

## Testing

All features have comprehensive test coverage:

- `sequence-gates.spec.ts`: 9 tests
- `sequence-duration-constraints.spec.ts`: 10 tests
- `sequence-ref-fragments.spec.ts`: 10 tests

Run tests: `cd packages/parser-dsl && pnpm test`

## UML 2.5 Compliance

These features align with UML 2.5 Sequence Diagram specification:

- **Gates** (Section 17.4.5): Connection points for fragment boundaries
- **Duration Constraints** (Section 17.4.6): Timing constraints between events
- **Interaction Use** (Section 17.4.7): Reference to another interaction

## Commits

- Task 17 (Gates): Commit 676565d
- Task 18 (Duration Constraints): Commit 9481d83
- Task 19 (Interaction Use): Commit 82fafd1
