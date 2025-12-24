---
title: Data Flow Diagrams (DFD)
description: Create structured analysis diagrams showing data movement through systems using Gane-Sarson notation.
lastUpdated: 2025-11-17
---

# Data Flow Diagrams (DFD)

Data Flow Diagrams visualize how data moves through a system, showing processes, data stores, external entities, and the flow of information between them. Runiq implements the Gane-Sarson notation, one of the most widely used DFD standards.

## Quick Start

### Simple DFD Example

```runiq
diagram "Order Processing" {

  // External entities
  shape customer as @externalEntity label:"Customer"
  shape inventory as @externalEntity label:"Inventory System"

  // Processes
  shape process as @processCircle label:"1.0\nProcess Order"
  shape validate as @processCircle label:"2.0\nValidate Payment"

  // Data stores
  shape orders as @dataStoreLine label:"D1 Orders"
  shape payments as @dataStoreLine label:"D2 Payments"

  // Data flows
  customer -> process label: "Order process"
  process -> orders label: "Order Details"
  process -> validate label: "Payment Info"
  validate -> payments label: "Payment Records"
  inventory -> process label: "Stock Check"
}
```

... (content preserved)
