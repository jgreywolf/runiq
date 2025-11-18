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

## When to Use DFDs

DFDs excel at:

- **Requirements Analysis** - Understand existing or proposed systems
- **System Documentation** - Document data flows for maintenance
- **Process Modeling** - Map business processes and information flow
- **Communication** - Bridge gap between technical and non-technical stakeholders
- **System Design** - Plan data architecture before implementation
- **Gap Analysis** - Identify missing processes or data stores
- **Integration Planning** - Document system interfaces

## Available Shapes

### External Entities

**`@externalEntity`** - Simple rectangle

Represents external systems, users, or organizations that interact with your system but are outside its scope.

```runiq
shape user as @externalEntity label:"Customer"
shape vendor as @externalEntity label:"Supplier"
```

**`@externalEntityCorner`** - Corner overlap style

Alternative visual with depth effect, useful for distinguishing entity types.

```runiq
shape system as @externalEntityCorner label:"Legacy System"
```

### Processes

**`@processCircle`** - Circle (Gane-Sarson standard)

Represents data transformation or processing. Numbered for hierarchical decomposition.

```runiq
shape proc as @processCircle label:"1.0\nProcess Order"
shape sub as @processCircle label:"1.1\nValidate Items"
```

**Numbering Convention:**

- Context level: Single verb phrase ("Process Orders")
- Level 0: X.0 (1.0, 2.0, 3.0...)
- Level 1: X.Y (1.1, 1.2, 1.3...)
- Level 2: X.Y.Z (1.1.1, 1.1.2...)

### Data Stores

**`@dataStoreLine`** - Parallel lines

Standard representation for data at rest (databases, files, tables).

```runiq
shape db as @dataStoreLine label:"D1 Customer Database"
```

**`@dataStoreLeft`** - Rectangle with double line on left

Alternative style with visual emphasis.

```runiq
shape file as @dataStoreLeft label:"D2 Transaction Log"
```

**`@dataStoreOpen`** - U-shaped (open on right)

Represents temporary stores or files.

```runiq
shape temp as @dataStoreOpen label:"D3 Session Data"
```

**Naming Convention:**

- Prefix with D# (D1, D2, D3...)
- Describe content, not implementation ("Orders" not "orders_table")

## DFD Levels

### Context Diagram (Level -1)

Highest level showing system boundary with external entities.

```runiq
diagram "E-Commerce Context" {

  // External entities
  shape customer as @externalEntity label:"Customer"
  shape payment as @externalEntity label:"Payment Gateway"
  shape shipping as @externalEntity label:"Shipping Service"

  // System as single process
  shape system as @processCircle label:"E-Commerce\nSystem"

  // Data flows
  customer -Orders-> system
  system -> customer label: "Confirmations"
  system -> payment label: "Payment Requests"
  payment -> system label: "Payment Status"
  system -> shipping label: "Shipping Requests"
  shipping -> system label: "Tracking Info"
}
```

### Level 0 (Fundamental Diagram)

Shows major processes, data stores, and flows.

```runiq
diagram "Order Processing Level 0" {

  // External entities
  shape customer as @externalEntity label:"Customer"
  shape warehouse as @externalEntity label:"Warehouse"

  // Major processes
  shape receive as @processCircle label:"1.0\nReceive Order"
  shape validate as @processCircle label:"2.0\nValidate Order"
  shape fulfill as @processCircle label:"3.0\nFulfill Order"

  // Data stores
  shape orders as @dataStoreLine label:"D1 Orders"
  shape inventory as @dataStoreLine label:"D2 Inventory"

  // Flows
  customer -Order-> receive label: "Tracking Info"
  receive -> orders label: "Order Data"
  orders -> validate label: "Order Details"
  validate -> fulfill label: "Validated Order"
  fulfill -> inventory label: "Stock Query"
  inventory -> fulfill label: "Availability"
  fulfill -> warehouse label: "Pick List"
}
```

### Level 1+ (Detailed)

Decomposes processes into sub-processes.

```runiq
diagram "Validate Order Level 1" {

  // Sub-processes of "2.0 Validate Order"
  shape checkItems as @processCircle label:"2.1\nCheck Items"
  shape checkPayment as @processCircle label:"2.2\nCheck Payment"
  shape checkAddress as @processCircle label:"2.3\nCheck Address"

  // Data stores
  shape products as @dataStoreLine label:"D3 Products"
  shape customers as @dataStoreLine label:"D4 Customers"

  // Flows
  checkItems -> products
  products -> checkItems
  checkPayment -> customers
  checkAddress -> customers
}
```

## Complete Example: Library System

```runiq
diagram "Library Management System" {

  style entityd fill:"#e3f2fd" stroke:"#1976d2" strokeWidth:2
  style processd fill:"#f3e5f5" stroke:"#7b1fa2" strokeWidth:2
  style store fill:"#fff3e0" stroke:"#f57c00" strokeWidth:2

  // External Entities
  shape memberEntity as @externalEntity label:"Library Member"
  shape staff as @externalEntity label:"Library Staff"

  // Processes
  shape checkout as @processCircle label:"1.0\nCheckout Book"
  shape returnProcess as @processCircle label:"2.0\nReturn Book"
  shape search as @processCircle label:"3.0\nSearch Catalog"

  // Data Stores
  shape books as @dataStoreLine label:"D1 Books Catalog" style:store
  shape loans as @dataStoreLine label:"D2 Active Loans" style:store
  shape members as @dataStoreLine label:"D3 Members" style:store

  // Member interactions
  memberEntity -> search label: "Search Request"
  search -> memberEntity label: "Search Results"
  memberEntity -> checkout label: "Checkout Request"
  checkout -> memberEntity label: "Confirmation"
  memberEntity -> returnProcess label: "Return Request"
  returnProcess -> memberEntity label: "Receipt"

  // Process-to-store flows
  search -> books label: "Query"
  books -> search label: "Book Info"
  checkout -> loans label: "Loan Record"
  checkout -> books label: "Update Availability"
  checkout -> membersEntity label: "Member Lookup"
  returnProcess -> loans label: "Close Loan"
  returnProcess -> books label: "Update Availability"

  // Staff interactions
  staff -> books label: "Book Update"
  staff -> membersEntity label: "Member Update"
}
```

## Styling DFDs

### Color Coding by Type

```runiq
style entities fill:"#e3f2fd" stroke:"#1976d2" strokeWidth:2
style processes fill:"#f3e5f5" stroke:"#7b1fa2" strokeWidth:2
style stores fill:"#fff3e0" stroke:"#f57c00" strokeWidth:2
style flows stroke:"#4a5568" strokeWidth:1.5

shape user as @externalEntity label:"User" style:entities
shape proc as @processCircle label:"1.0\nProcess" style:processes
shape db as @dataStoreLine label:"D1 Database" style:stores
```

### Emphasis with strokeWidth

```runiq
style criticalStyle strokeWidth:3 stroke:"#dc2626"
style normal strokeWidth:1.5 stroke:"#4a5568"

shape important as @processCircle label:"Critical\nProcess" style:criticalStyle
```

## Best Practices

### 1. Follow Numbering Conventions

```runiq
// ✅ Good: Hierarchical numbering
shape main as @processCircle label:"1.0\nMain Process"
shape sub1 as @processCircle label:"1.1\nSub-Process"
shape sub2 as @processCircle label:"1.2\nSub-Process"

// ❌ Bad: Inconsistent numbering
shape proc1 as @processCircle label:"A\nProcess"
shape proc2 as @processCircle label:"2\nProcess"
```

### 2. Name Data Stores Consistently

```runiq
// ✅ Good: D# prefix + descriptive name
shape db1 as @dataStoreLine label:"D1 Customer Records"
shape db2 as @dataStoreLine label:"D2 Order History"

// ❌ Bad: No prefix or technical names
shape db as @dataStoreLine label:"customers_table"
```

### 3. Use Meaningful Edge Labels

```runiq
// ✅ Good: Describes the data
customer -> process label: "Order Details"
process -> database label: "Validated Order"

// ❌ Bad: Generic or missing labels
customer -> process
process -> database
```

### 4. Keep Consistent Level of Detail

```runiq
// ✅ Good: All processes at same abstraction level
shape p1 as @processCircle label:"1.0\nProcess Order"
shape p2 as @processCircle label:"2.0\nUpdate Inventory"
shape p3 as @processCircle label:"3.0\nNotify Customer"

// ❌ Bad: Mixed abstraction levels
shape p1 as @processCircle label:"1.0\nProcess Order"
shape p2 as @processCircle label:"2.0\nValidate Card Number"  // Too detailed
```

### 5. Avoid Crossing Lines

Use containers or careful layout to minimize crossed data flows:

```runiq
diagram "Clean Layout" {
  direction LR  // Left-to-right can reduce crossings

  container "Processing" {
    shape p1 as @processCircle label:"1.0"
    shape p2 as @processCircle label:"2.0"
  }
}
```

### 6. Limit Diagram Complexity

- **Context**: 5-9 external entities
- **Level 0**: 5-7 major processes
- **Level 1+**: 5-9 sub-processes per parent
- If more complex, decompose further

## Use Cases

### Software Requirements

```runiq
diagram "User Registration" {
  shape user as @externalEntity label:"New User"
  shape email as @externalEntity label:"Email Service"

  shape validate as @processCircle label:"1.0\nValidate Input"
  shape createAccount as @processCircle label:"2.0\nCreate Account"
  shape notify as @processCircle label:"3.0\nSend Confirmation"

  shape users as @dataStoreLine label:"D1 Users"

  user -> validate label: "Registration Form"
  validate -> createAccount label: "Valid Data"
  createAccount -> users label: "User Record"
  createAccount -> notify label: "User Info"
  notify -> email label: "Confirmation Email"
  email -> user label: "Email Sent"
}
```

## Comparison with Other Tools

| Feature                    | Runiq       | Mermaid    | PlantUML   | Visio     | Lucidchart  |
| -------------------------- | ----------- | ---------- | ---------- | --------- | ----------- |
| **Gane-Sarson notation**   | ✅ Full     | ⚠️ Basic   | ❌ No      | ✅ Yes    | ✅ Yes      |
| **Text-based**             | ✅ DSL+JSON | ✅ Yes     | ✅ Yes     | ❌ GUI    | ❌ GUI      |
| **Auto-layout**            | ✅ ELK      | ⚠️ Limited | ✅ Yes     | ❌ Manual | ⚠️ Assisted |
| **Data stores (3 types)**  | ✅ Yes      | ❌ No      | ❌ No      | ✅ Yes    | ✅ Yes      |
| **Edge labels**            | ✅ Full     | ✅ Yes     | ✅ Yes     | ✅ Yes    | ✅ Yes      |
| **Custom styling**         | ✅ CSS-like | ⚠️ Limited | ⚠️ Limited | ✅ Full   | ✅ Full     |
| **Version control**        | ✅ Git      | ✅ Yes     | ✅ Yes     | ❌ Binary | ❌ Cloud    |
| **Programmatic API**       | ✅ Yes      | ❌ No      | ❌ No      | ⚠️ VBA    | ❌ No       |
| **SVG export**             | ✅ Pure SVG | ✅ Yes     | ✅ Yes     | ✅ Yes    | ✅ Yes      |
| **Hierarchical numbering** | ✅ Manual   | ❌ No      | ❌ No      | ✅ Yes    | ✅ Yes      |

**Runiq Advantages:**

- ✅ **Complete Gane-Sarson** - All standard DFD shape variations
- ✅ **Text-based workflow** - Perfect for version control and CI/CD
- ✅ **Automatic layout** - Eclipse Layout Kernel handles positioning
- ✅ **Programmatic generation** - Create DFDs from database schemas
- ✅ **Clean SVG output** - Professional, accessible diagrams

## DFD Notation Reference

### Shape Summary

| Element         | Shape            | Represents          | Naming         |
| --------------- | ---------------- | ------------------- | -------------- |
| External Entity | Rectangle        | People, systems     | Noun phrases   |
| Process         | Circle           | Data transformation | Numbered (X.Y) |
| Data Store      | Parallel lines   | Data at rest        | D# + name      |
| Data Flow       | Arrow with label | Data movement       | Data name      |

### Common Mistakes to Avoid

❌ **Process to Process** (missing data store/flow label)
❌ **Unlabeled flows** (always label what data moves)
❌ **Control flows** (DFDs show data, not control logic)
❌ **Physical implementation** (don't show "MySQL" or "POST request")
❌ **Mixed levels** (keep abstraction consistent)

## Related Documentation

- [Flowcharts](/guide/flowcharts) - Control flow and logic diagrams
- [Activity Diagrams](/guide/activity-diagrams) - UML activity flows
- [BPMN Diagrams](/guide/bpmn-diagrams) - Business process modeling
- [Layout Algorithms](/guide/layout) - Understanding auto-layout
- [Styling Guide](/guide/styling) - Advanced styling techniques

## Resources

- [Structured Analysis (DeMarco)](https://en.wikipedia.org/wiki/Structured_analysis) - Original DFD methodology
- [Gane-Sarson Notation](https://en.wikipedia.org/wiki/Data-flow_diagram#Gane_and_Sarson_notation) - Standard used by Runiq
- [DFD Best Practices](https://www.visual-paradigm.com/guide/data-flow-diagram/what-is-data-flow-diagram/) - Modeling guidelines

---

**Next Steps**: Start with a context diagram to identify your system boundary, then create a Level 0 DFD to show major processes and data stores.
