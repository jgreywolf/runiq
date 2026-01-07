# Use Case Diagram Examples

Use case diagrams show interactions between actors (users, systems) and use cases (functionality) within a system boundary.

## Simple ATM System

A classic use case diagram showing a bank customer interacting with an ATM.

### DSL Code

```runiq
diagram "Simple ATM Example" {
  shape user as @actor label: "Bank Customer"

  container "ATM System" as @systemBoundary {
    shape withdraw as @ellipseWide label: "Withdraw Cash"
    shape checkBalance as @ellipseWide label: "Check Balance"
    shape printReceipt as @ellipseWide label: "Print Receipt"
  }

  user -> withdraw
  user -> checkBalance
  withdraw -> printReceipt label: "optional"
}
```

### Generated SVG

![Simple ATM Use Case](/examples/use-case-simple.svg)

### Key Concepts

**Actors**: Represent users or external systems

- Use a `shape <id> as @actor label: "<Label>"` declaration
- Rendered as stick figures

**System Boundaries**: Container for use cases

- Use a `container "<Label>" as @systemBoundary { ... }` block
- Place use case shapes inside the container

**Use Cases**: System functionality

- Use a `shape <id> as @ellipseWide label: "<Label>"` declaration

**Relationships**: Connections between actors and use cases

- Simple: `actorId -> useCaseId`
- Labeled: `useCase1 -> useCase2 label: "..."`

## Banking System with Stereotypes

Advanced example showing UML stereotypes for include/extend relationships.

### DSL Code

```runiq
diagram "Advanced Banking System" {
  shape customer as @actor label: "Bank Customer"
  shape admin as @actor label: "System Admin"
  shape backOffice as @actor label: "Back Office"

  container "Online Banking" as @systemBoundary {
    shape login as @ellipseWide label: "Login"
    shape viewAccount as @ellipseWide label: "View Account"
    shape transfer as @ellipseWide label: "Transfer Money"
    shape payBills as @ellipseWide label: "Pay Bills"

    shape twoFactor as @ellipseWide label: "Two-Factor Auth"
    shape validateAccount as @ellipseWide label: "Validate Account"
    shape sendNotification as @ellipseWide label: "Send Notification"
    shape auditLog as @ellipseWide label: "Audit Log"
  }

  customer -> login
  customer -> viewAccount
  customer -> transfer
  customer -> payBills

  admin -> auditLog
  backOffice -> validateAccount

  login -> twoFactor label: "<<include>>" lineStyle: "dashed" arrowType: open
  transfer -> validateAccount label: "<<include>>" lineStyle: "dashed" arrowType: open
  payBills -> validateAccount label: "<<include>>" lineStyle: "dashed" arrowType: open

  sendNotification -> transfer label: "<<extend>>" lineStyle: "dashed" arrowType: open
  sendNotification -> payBills label: "<<extend>>" lineStyle: "dashed" arrowType: open
}
```

### UML Stereotypes

`<<include>>`: Mandatory behavior

- The base use case **requires** the included use case
- Example: Login requires Two-Factor Auth
- Use `label: "<<include>>"` with `lineStyle: "dashed"`

`<<extend>>`: Optional behavior

- The base use case **may** use the extending use case
- Example: Transfer may trigger SendNotification
- Use `label: "<<extend>>"` with `lineStyle: "dashed"`

### Line Styles

```runiq
diagram "Line Styles" {
  shape actor as @actor label: "Actor"
  shape useCase1 as @ellipseWide label: "Use Case 1"
  shape useCase2 as @ellipseWide label: "Use Case 2"

  actor -> useCase1
  useCase1 -> useCase2 label: "<<include>>" lineStyle: "dashed" arrowType: open
  useCase2 -> useCase1 lineStyle: "dotted"
  useCase1 -> useCase2 strokeColor: "#4caf50" lineStyle: "dashed"
}
```

## E-Commerce System

A more complex example with multiple actors and relationships.

### DSL Code

```runiq
diagram "E-Commerce Platform" {
  shape visitor as @actor label: "Guest User"
  shape customer as @actor label: "Registered User"
  shape seller as @actor label: "Product Seller"
  shape admin as @actor label: "Administrator"

  container "E-Commerce System" as @systemBoundary {
    shape browse as @ellipseWide label: "Browse Products"
    shape search as @ellipseWide label: "Search Products"
    shape viewDetails as @ellipseWide label: "View Product Details"

    shape register as @ellipseWide label: "Register Account"
    shape login as @ellipseWide label: "Login"
    shape addCart as @ellipseWide label: "Add to Cart"
    shape checkout as @ellipseWide label: "Checkout"
    shape payment as @ellipseWide label: "Process Payment"
    shape trackOrder as @ellipseWide label: "Track Order"

    shape listProduct as @ellipseWide label: "List Product"
    shape manageInventory as @ellipseWide label: "Manage Inventory"
    shape viewSales as @ellipseWide label: "View Sales"

    shape manageUsers as @ellipseWide label: "Manage Users"
    shape viewAnalytics as @ellipseWide label: "View Analytics"
  }

  visitor -> browse
  visitor -> search
  visitor -> viewDetails
  visitor -> register

  customer -> login
  customer -> addCart
  customer -> checkout
  customer -> trackOrder

  seller -> listProduct
  seller -> manageInventory
  seller -> viewSales

  admin -> manageUsers
  admin -> viewAnalytics

  checkout -> payment label: "<<include>>" lineStyle: "dashed" arrowType: open
  listProduct -> manageInventory label: "<<include>>" lineStyle: "dashed" arrowType: open
}
```

## Actor Styles

Use the built-in `@actor` shape for stick-figure actors:

```runiq
diagram "Actors" {
  shape user as @actor label: "User"
  shape admin as @actor label: "Admin"
}
```

## Best Practices

::: tip Actor Placement

- Place primary actors (users) on the left
- Place secondary actors (systems, admins) on the right
- Group related use cases within system boundaries
  :::

::: tip Stereotypes

- **`<<include>>`**: When behavior is always required
  - Login → Two-Factor Auth
  - Checkout → Process Payment
- **`<<extend>>`**: When behavior is optional
  - Transfer → Send Notification
  - Purchase → Apply Coupon
    :::

::: tip Relationship Lines

- **Solid line**: Actor to use case (standard association)
- **Dashed line with arrow**: Stereotype relationships (include/extend)
- **Label on arrow**: Describe the relationship type
  :::

## Use Case Diagram Checklist

- [ ] Identify all actors (users, external systems)
- [ ] Define system boundary (what's inside your system)
- [ ] List all use cases (system functionality)
- [ ] Connect actors to their use cases
- [ ] Add `<<include>>` for mandatory shared behavior
- [ ] Add `<<extend>>` for optional enhancements
- [ ] Use meaningful labels for all elements
- [ ] Group related use cases logically

## Next Steps

- [Container Diagrams →](/examples/containers) - C4 architecture
- [Flowcharts →](/examples/flowcharts) - Process flows
- [Shape Reference →](/reference/shapes) - Actor shape options

---

## Download Examples

All example `.runiq` files are available in the [GitHub repository](https://github.com/jgreywolf/runiq/tree/main/examples/use-case-diagram).

```bash
git clone https://github.com/jgreywolf/runiq.git
cd runiq/examples/use-case-diagram
```
