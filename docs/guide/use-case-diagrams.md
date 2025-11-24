---
title: Use Case Diagrams
description: Model system functionality with UML use case diagrams including actors, use cases, relationships, and system boundaries.
lastUpdated: 2025-01-09
---

# Use Case Diagrams

Create UML use case diagrams to capture functional requirements and actor interactions with Runiq's diagram profile.

## Overview

Use case diagrams show the relationships between actors (users, external systems) and use cases (system functionality). They're essential for requirements gathering and system analysis.

## Key Shapes

- **Actor**: `@actor` - Stick figure representing user or external system
- **System Boundary**: `@systemBoundary` - Container showing system scope
- **Use Case**: `@ellipseWide` or `@systemBoundary` - System functionality
- **Note**: `@note` - Additional documentation

See the [Shape Reference - UML Shapes](/reference/shapes#_10-uml-shapes-22-shapes) for the complete list.

## Relationship Types

| Relationship   | Syntax                          | Description                               |
| -------------- | ------------------------------- | ----------------------------------------- |
| Association    | `actor -> useCase`              | Actor participates in use case            |
| Include        | `useCaseA -> useCaseB`          | Always includes behavior (required)       |
| Extend         | `useCaseA -> useCaseB`          | Conditionally extends behavior (optional) |
| Generalization | `specificActor -> generalActor` | Actor inheritance                         |

## Simple Use Case Diagram

```runiq
diagram "Banking System" {
  direction LR

  shape customer as @actor label: "Customer"
   container banking "Online Banking System" {
    shape login as @ellipseWide label: "Login"
    shape viewBalance as @ellipseWide label: "View Balance"
    shape transfer as @ellipseWide label: "Transfer Money"
    shape withdraw as @ellipseWide label: "Withdraw Cash"
  }

  customer -> login
  customer -> viewBalance
  customer -> transfer
  customer -> withdraw
}
```

## E-commerce System

```runiq
diagram "E-commerce Platform" {
  direction TB

  shape customer as @actor label: "Customer"
  shape admin as @actor label: "Administrator"
  shape payment as @actor label: "Payment Gateway"

  container system "E-commerce System" {
    shape browse as @ellipseWide label: "Browse Products"
    shape search as @ellipseWide label: "Search"
    shape addCart as @ellipseWide label: "Add to Cart"
    shape checkout as @ellipseWide label: "Checkout"
    shape processPayment as @ellipseWide label: "Process Payment"
    shape manageOrders as @ellipseWide label: "Manage Orders"
    shape manageProducts as @ellipseWide label: "Manage Products"
  }

  customer -> browse
  customer -> search
  customer -> addCart
  customer -> checkout
  checkout -> processPayment label: "«include»"
  processPayment -> payment
  admin -> manageOrders
  admin -> manageProducts
  browse -> search label: "«include»"
}
```

## Include Relationship

Use `«include»` for mandatory sub-functionality:

```runiq
diagram "Login System" {
  direction LR

  shape user as @actor label: "User"
  shape login as @ellipseWide label: "Login"
  shape authenticate as @ellipseWide label: "Authenticate"
  shape validateCredentials as @ellipseWide label: "Validate Credentials"

  user -> login
  login -> authenticate label: "«include»" relationship: dependency
  authenticate -> validateCredentials label: "«include»" relationship: dependency
}
```

## Extend Relationship

Use `«extend»` for optional behavior:

```runiq
diagram "Order System" {
  direction TB

  shape customer as @actor label: "Customer"
  shape placeOrder as @ellipseWide label: "Place Order"
  shape applyDiscount as @ellipseWide label: "Apply Discount Code"
  shape giftWrap as @ellipseWide label: "Add Gift Wrapping"

  customer -> placeOrder
  applyDiscount -> placeOrder label: "«extend»" relationship: dependency lineStyle: "dashed"
  giftWrap -> placeOrder label: "«extend»" relationship: dependency lineStyle: "dashed"
}
```

## Actor Generalization

Show actor inheritance:

```runiq
diagram "User Roles" {
  direction TB

  shape user as @actor label: "User"
  shape rmember as @actor label: "Member"
  shape admin as @actor label: "Admin"
  shape superAdmin as @actor label: "Super Admin"

  container system "System" {
    shape login as @ellipseWide label: "Login"
    shape viewContent as @ellipseWide label: "View Content"
    shape editContent as @ellipseWide label: "Edit Content"
    shape manageUsers as @ellipseWide label: "Manage Users"
  }

  rmember -> user relationship: generalization
  admin -> rmember relationship: generalization
  superAdmin -> admin relationship: generalization

  user -> login
  rmember -> viewContent
  admin -> editContent
  superAdmin -> manageUsers
}
```

## Complex Example with Notes

```runiq
diagram "Healthcare System" {
  direction LR

  shape patient as @actor label: "Patient"
  shape doctor as @actor label: "Doctor"
  shape insurance as @actor label: "Insurance Provider"

  container system "Healthcare Portal" {
    shape bookAppointment as @ellipseWide label: "Book Appointment"
    shape viewRecords as @ellipseWide label: "View Medical Records"
    shape prescribe as @ellipseWide label: "Prescribe Medication"
    shape checkInsurance as @ellipseWide label: "Check Insurance"
    shape submitClaim as @ellipseWide label: "Submit Claim"
  }

  shape insNote as @note label: "Insurance check is\nautomatically included\nin booking process"

  patient -> bookAppointment
  patient -> viewRecords
  doctor -> prescribe
  doctor -> viewRecords
  bookAppointment -> checkInsurance label: "«include»" relationship: dependency
  checkInsurance -> insurance
  doctor -> submitClaim
  submitClaim -> insurance

  insNote -> checkInsurance arrowType: none lineStyle: "dashed"
}
```

## Extension Points

Extension points define specific locations in a use case where optional behavior can be added via extend relationships. They make explicit **where** and **under what conditions** extensions occur.

### Why Use Extension Points?

- **Clarity**: Shows exactly where optional behavior can be inserted
- **Traceability**: Documents specific conditions for extensions
- **UML 2.5 Compliance**: Follows standard UML notation
- **Error Handling**: Ideal for documenting exception scenarios

### Syntax

```runiq
shape useCaseName as @ellipseWide label:"Use Case" extensionPoints:["Extension 1", "Extension 2"]
```

### E-commerce Example with Extension Points

```runiq
diagram "E-commerce Checkout - Extension Points" {

  shape customer as @actor label:"Customer"
  shape paymentGateway as @actor label:"Payment Gateway"

  // Use case with extension points for error handling
  shape checkout as @ellipseWide label:"Checkout" extensionPoints:["Payment Failed", "Invalid Shipping Address", "Promo Code Invalid"]

  shape processPayment as @ellipseWide label:"Process Payment" extensionPoints:["Card Declined", "Insufficient Funds", "Gateway Timeout"]

  // Extension use cases handle specific error conditions
  shape retryPayment as @ellipseWide label:"Retry Payment"
  shape updateAddress as @ellipseWide label:"Update Shipping Address"

  // Main flow
  customer -> checkout
  checkout -> processPayment
  processPayment -> paymentGateway stereotype:"include"

  // Extend relationships reference extension points
  retryPayment -> processPayment stereotype:"extend" label:"Card Declined"
  updateAddress -> checkout stereotype:"extend" label:"Invalid Shipping Address"
}
```

### ATM Withdrawal Example

```runiq
diagram "ATM Withdrawal" {

  shape customer as @actor label:"Customer"

  // Primary use case with multiple extension points
  shape enterPIN as @ellipseWide label:"Enter PIN" extensionPoints:["Invalid PIN", "Card Locked", "PIN Attempts Exceeded"]

  shape selectWithdrawal as @ellipseWide label:"Select Withdrawal Amount" extensionPoints:["Insufficient Balance", "Daily Limit Exceeded"]

  // Extension use cases
  shape retryPIN as @ellipseWide label:"Retry PIN Entry"
  shape contactSupport as @ellipseWide label:"Contact Customer Support"
  shape selectLowerAmount as @ellipseWide label:"Select Lower Amount"

  // Main flow
  customer -> enterPIN
  enterPIN -> selectWithdrawal

  // Extend relationships map to specific extension points
  retryPIN -> enterPIN stereotype:"extend" label:"Invalid PIN"
  contactSupport -> enterPIN stereotype:"extend" label:"Card Locked"
  selectLowerAmount -> selectWithdrawal stereotype:"extend" label:"Insufficient Balance"
}
```

### Extension Points Best Practices

1. **Be Specific**: Name extension points after specific conditions ("Card Declined", not "Error")
2. **Error Scenarios**: Extension points are ideal for documenting exception handling
3. **Match Labels**: Extend relationship labels should match extension point names
4. **Limit Quantity**: 2-5 extension points per use case keeps diagrams readable
5. **Alternative Flows**: Use for variations, not completely different functionality

### When to Use Extension Points

**Use extension points for:**

- Error handling and exception scenarios
- Optional features triggered by specific conditions
- Alternative paths based on validation failures
- Conditional behavior with clear trigger points

**Don't use extension points for:**

- Required functionality (use «include» instead)
- General alternatives without specific conditions
- Core behavior variations (consider separate use cases)

## Styling

Customize use case diagram appearance:

```runiq
diagram "Styled Use Case" {
  direction LR

  shape user as @actor label: "User" color: "#3b82f6"

  container system "System" fill: "#f0f9ff" borderColor: "#3b82f6" {
    shape useCase1 as @ellipseWide label: "Primary Use Case" fill: "#dbeafe" stroke: "#2563eb"
    shape useCase2 as @ellipseWide label: "Extended Use Case" fill: "#fef3c7" stroke: "#f59e0b"
  }

  user -> useCase1 stroke: "#3b82f6" strokeWidth: 2
  useCase2 -> useCase1 label: "«extend»" relationship: dependency stroke: "#f59e0b" lineStyle: "dashed"
}
```

## Best Practices

1. **Focus on user goals** - Use cases should represent complete user objectives
2. **Use meaningful names** - Start with verb (e.g., "Place Order", not "Order")
3. **Show system boundary** - Clearly define what's inside vs outside the system
4. **Limit includes/extends** - Only use when it clarifies the model
5. **Actor placement** - Primary actors on left, secondary actors on right
6. **Keep it high-level** - Don't include implementation details
7. **Use notes sparingly** - Add clarification only when needed

## Include vs Extend

**Use «include» when:**

- The behavior is always required
- It's a mandatory step in the use case
- Example: "Login" always includes "Authenticate"

**Use «extend» when:**

- The behavior is optional
- It adds extra functionality under certain conditions
- Example: "Place Order" optionally extends to "Apply Discount"

## Comparison with Other Tools

| Feature                      | Runiq          | Mermaid        | PlantUML       | Lucidchart  | Visual Paradigm | Enterprise Architect | StarUML        |
| ---------------------------- | -------------- | -------------- | -------------- | ----------- | --------------- | -------------------- | -------------- |
| **Basic support**            | ✅             | ✅             | ✅             | ✅          | ✅              | ✅                   | ✅             |
| **UML compliance**           | ✅             | ❌             | ✅             | ⚠️ Basic    | ✅              | ✅                   | ✅             |
| **Actor-use case**           | ✅             | ❌             | ✅             | ✅          | ✅              | ✅                   | ✅             |
| **Include/Extend**           | ✅             | ❌             | ✅             | ✅          | ✅              | ✅                   | ✅             |
| **Generalization**           | ✅             | ❌             | ✅             | ✅          | ✅              | ✅                   | ✅             |
| **System boundaries**        | ✅             | ❌             | ✅             | ✅          | ✅              | ✅                   | ✅             |
| **Custom actors**            | ✅             | ❌             | ✅             | ✅          | ✅              | ✅                   | ✅             |
| **Model integration**        | ❌             | ❌             | ❌             | ⚠️ Limited  | ✅              | ✅                   | ✅             |
| **Requirements tracing**     | ❌             | ❌             | ❌             | ⚠️ Limited  | ✅              | ✅                   | ⚠️ Limited     |
| **Text-based DSL**           | ✅             | ✅             | ✅             | ❌          | ⚠️ Partial      | ⚠️ Partial           | ⚠️ Partial     |
| **Automatic layout**         | ✅             | ✅             | ✅             | ❌          | ⚠️ Partial      | ⚠️ Partial           | ❌             |
| **Version control friendly** | ✅             | ✅             | ✅             | ⚠️ Partial  | ⚠️ Partial      | ⚠️ Partial           | ⚠️ Partial     |
| **Documentation generation** | ✅             | ✅             | ✅             | ⚠️ Partial  | ✅              | ✅                   | ⚠️ Partial     |
| **Interactive editing**      | ❌             | ❌             | ❌             | ✅          | ✅              | ✅                   | ✅             |
| **Export formats**           | SVG, PNG       | SVG, PNG       | SVG, PNG       | Multiple    | Multiple        | Multiple             | Multiple       |
| **Learning curve**           | Low            | Low            | Medium         | Low         | High            | High                 | Medium         |
| **Cost**                     | Free           | Free           | Free           | Paid        | Paid            | Paid                 | Free/Paid      |
| **Platform**                 | Cross-platform | Cross-platform | Cross-platform | Web/Desktop | Cross-platform  | Windows              | Cross-platform |

**Key Advantages of Runiq:**

- **UML Compliant**: Proper stereotypes for «include» and «extend» relationships
- **Version Control**: Track requirements evolution in Git with product code
- **Unified Language**: Consistent syntax with other UML diagrams
- **Clear Syntax**: Simple actor and use case notation

**When to Use Alternatives:**

- **Visual Paradigm/Enterprise Architect**: Full requirements management and traceability
- **PlantUML**: Established tool with extensive UML and documentation support
- **Lucidchart**: Real-time collaboration for requirements gathering workshops
- **StarUML**: Desktop UML modeling with model validation

## Examples

See the [use-case](/examples/use-case) directory for complete examples:

- Simple banking system
- Advanced banking with relationships
- E-commerce platform
- Class relationship use cases

## Related

- [Shape Reference - UML Shapes](/reference/shapes#_10-uml-shapes-22-shapes)
- [UML Class Diagrams](/guide/class-diagrams)
- [Sequence Diagrams](/guide/sequence-diagrams)
- [Containers](/guide/containers)
