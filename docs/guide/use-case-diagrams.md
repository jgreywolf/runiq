---
title: Use Case Diagrams
---

# Use Case Diagrams

Create UML use case diagrams to capture functional requirements and actor interactions with Runiq's diagram profile.

## Overview

Use case diagrams show the relationships between actors (users, external systems) and use cases (system functionality). They're essential for requirements gathering and system analysis.

## Key Shapes

- **Actor**: `@actor` - Stick figure representing user or external system
- **System Boundary**: `@systemBoundary` - Container showing system scope
- **Use Case**: `@ellipse` or `@systemBoundary` - System functionality
- **Note**: `@note` - Additional documentation

See the [Shape Reference - UML Shapes](/reference/shapes#_10-uml-shapes-22-shapes) for the complete list.

## Relationship Types

| Relationship | Syntax | Description |
|--------------|--------|-------------|
| Association | `actor -> useCase` | Actor participates in use case |
| Include | `useCaseA -> useCaseB` | Always includes behavior (required) |
| Extend | `useCaseA -> useCaseB` | Conditionally extends behavior (optional) |
| Generalization | `specificActor -> generalActor` | Actor inheritance |

## Simple Use Case Diagram

```runiq
diagram "Banking System" {
  direction LR

  shape customer as @actor label: "Customer"
  shape system as @systemBoundary label: "Banking System" {
    shape login as @ellipse label: "Login"
    shape viewBalance as @ellipse label: "View Balance"
    shape transfer as @ellipse label: "Transfer Money"
    shape withdraw as @ellipse label: "Withdraw Cash"
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

  shape system as @systemBoundary label: "E-commerce System" {
    shape browse as @ellipse label: "Browse Products"
    shape search as @ellipse label: "Search"
    shape addCart as @ellipse label: "Add to Cart"
    shape checkout as @ellipse label: "Checkout"
    shape processPayment as @ellipse label: "Process Payment"
    shape manageOrders as @ellipse label: "Manage Orders"
    shape manageProducts as @ellipse label: "Manage Products"
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
  shape login as @ellipse label: "Login"
  shape authenticate as @ellipse label: "Authenticate"
  shape validateCredentials as @ellipse label: "Validate Credentials"

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
  shape placeOrder as @ellipse label: "Place Order"
  shape applyDiscount as @ellipse label: "Apply Discount Code"
  shape giftWrap as @ellipse label: "Add Gift Wrapping"

  customer -> placeOrder
  applyDiscount -> placeOrder label: "«extend»" relationship: dependency style: { strokeDasharray: "5,5" }
  giftWrap -> placeOrder label: "«extend»" relationship: dependency style: { strokeDasharray: "5,5" }
}
```

## Actor Generalization

Show actor inheritance:

```runiq
diagram "User Roles" {
  direction TB

  shape user as @actor label: "User"
  shape member as @actor label: "Member"
  shape admin as @actor label: "Admin"
  shape superAdmin as @actor label: "Super Admin"

  shape system as @systemBoundary label: "System" {
    shape login as @ellipse label: "Login"
    shape viewContent as @ellipse label: "View Content"
    shape editContent as @ellipse label: "Edit Content"
    shape manageUsers as @ellipse label: "Manage Users"
  }

  member -> user relationship: generalization
  admin -> member relationship: generalization
  superAdmin -> admin relationship: generalization

  user -> login
  member -> viewContent
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
  
  shape system as @systemBoundary label: "Healthcare Portal" {
    shape bookAppointment as @ellipse label: "Book Appointment"
    shape viewRecords as @ellipse label: "View Medical Records"
    shape prescribe as @ellipse label: "Prescribe Medication"
    shape checkInsurance as @ellipse label: "Check Insurance"
    shape submitClaim as @ellipse label: "Submit Claim"
  }

  shape note as @note label: "Insurance check is\nautomatically included\nin booking process"

  patient -> bookAppointment
  patient -> viewRecords
  doctor -> prescribe
  doctor -> viewRecords
  bookAppointment -> checkInsurance label: "«include»" relationship: dependency
  checkInsurance -> insurance
  doctor -> submitClaim
  submitClaim -> insurance
  
  note -> checkInsurance arrowType: none style: { strokeDasharray: "2,2" }
}
```

## Styling

Customize use case diagram appearance:

```runiq
diagram "Styled Use Case" {
  direction LR

  shape user as @actor label: "User" color: "#3b82f6"
  
  shape system as @systemBoundary label: "System" fill: "#f0f9ff" stroke: "#3b82f6" {
    shape useCase1 as @ellipse label: "Primary Use Case" fill: "#dbeafe" stroke: "#2563eb"
    shape useCase2 as @ellipse label: "Extended Use Case" fill: "#fef3c7" stroke: "#f59e0b"
  }

  user -> useCase1 style: { stroke: "#3b82f6", strokeWidth: 2 }
  useCase2 -> useCase1 label: "«extend»" relationship: dependency style: { stroke: "#f59e0b", strokeDasharray: "5,5" }
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

## Examples

See the [examples/use-case-diagram](https://github.com/jgreywolf/runiq/tree/main/examples/use-case-diagram) directory for complete examples:

- Simple banking system
- Advanced banking with relationships
- E-commerce platform
- Class relationship use cases

## Related

- [Shape Reference - UML Shapes](/reference/shapes#_10-uml-shapes-22-shapes)
- [UML Class Diagrams](/guide/class-diagrams)
- [Sequence Diagrams](/guide/sequence-diagrams)
- [Containers](/guide/containers)
