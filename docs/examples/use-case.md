# Use Case Diagram Examples

Use case diagrams show interactions between actors (users, systems) and use cases (functionality) within a system boundary.

## Simple ATM System

A classic use case diagram showing a bank customer interacting with an ATM.

### DSL Code

```runiq
diagram: use-case
title: "Simple ATM Example"

# Actor
actor User "Bank Customer"

# System
system-boundary ATM "ATM System" {
  ellipse-wide Withdraw "Withdraw Cash"
  ellipse-wide CheckBalance "Check Balance"
  ellipse-wide PrintReceipt "Print Receipt"
}

# Relationships
User -> Withdraw
User -> CheckBalance
Withdraw -> PrintReceipt "optional"
```

### Key Concepts

**Actors**: Represent users or external systems

- Use `actor <ID> "<Label>"` syntax
- Rendered as stick figures

**System Boundaries**: Container for use cases

- `system-boundary <ID> "<Label>" { ... }`
- Groups related functionality

**Use Cases**: System functionality

- `ellipse-wide <ID> "<Label>"`
- Oval shapes for actions

**Relationships**: Connections between actors and use cases

- Simple: `Actor -> UseCase`
- Labeled: `UseCase1 -> UseCase2 "stereotype"`

## Banking System with Stereotypes

Advanced example showing UML stereotypes for include/extend relationships.

### DSL Code

```runiq
diagram: use-case
title: "Advanced Banking System"

# Actors
actor Customer "Bank Customer"
actor Admin "System Admin"
actor BackOffice "Back Office"

# System boundary
system-boundary Banking "Online Banking" {
  # Core use cases
  ellipse Login "Login"
  ellipse ViewAccount "View Account"
  ellipse Transfer "Transfer Money"
  ellipse PayBills "Pay Bills"

  # Extended use cases
  ellipse TwoFactor "Two-Factor Auth"
  ellipse ValidateAccount "Validate Account"
  ellipse SendNotification "Send Notification"
  ellipse AuditLog "Audit Log"
}

# Actor relationships
Customer -> Login
Customer -> ViewAccount
Customer -> Transfer
Customer -> PayBills

Admin -> AuditLog
BackOffice -> ValidateAccount

# Include relationships (mandatory)
edge Login -> TwoFactor stereotype: "<<include>>" lineStyle: dashed arrowType: open
edge Transfer -> ValidateAccount stereotype: "<<include>>" lineStyle: dashed arrowType: open
edge PayBills -> ValidateAccount stereotype: "<<include>>" lineStyle: dashed arrowType: open

# Extend relationships (optional)
edge SendNotification -> Transfer stereotype: "<<extend>>" lineStyle: dashed arrowType: open
edge SendNotification -> PayBills stereotype: "<<extend>>" lineStyle: dashed arrowType: open
```

### UML Stereotypes

`<<include>>`: Mandatory behavior

- The base use case **requires** the included use case
- Example: Login requires Two-Factor Auth
- Use `stereotype: "<<include>>"` with `lineStyle: dashed`

`<<extend>>`: Optional behavior

- The base use case **may** use the extending use case
- Example: Transfer may trigger SendNotification
- Use `stereotype: "<<extend>>"` with `lineStyle: dashed`

### Line Styles

```runiq
# Solid line (default)
Actor -> UseCase

# Dashed line (for stereotypes)
edge UseCase1 -> UseCase2 stereotype: "<<include>>" lineStyle: dashed arrowType: open

# Dotted line
edge UseCase1 -> UseCase2 lineStyle: dotted

# Custom colors
edge UseCase1 -> UseCase2 strokeColor: "#4caf50" lineStyle: dashed
```

## E-Commerce System

A more complex example with multiple actors and relationships.

### DSL Code

```runiq
diagram: use-case
title: "E-Commerce Platform"

# Actors
actor Visitor "Guest User"
actor Customer "Registered User"
actor Seller "Product Seller"
actor Admin "Administrator"

# System boundary
system-boundary Shop "E-Commerce System" {
  # Guest capabilities
  ellipse Browse "Browse Products"
  ellipse Search "Search Products"
  ellipse ViewDetails "View Product Details"

  # Customer capabilities
  ellipse Register "Register Account"
  ellipse Login "Login"
  ellipse AddCart "Add to Cart"
  ellipse Checkout "Checkout"
  ellipse Payment "Process Payment"
  ellipse TrackOrder "Track Order"

  # Seller capabilities
  ellipse ListProduct "List Product"
  ellipse ManageInventory "Manage Inventory"
  ellipse ViewSales "View Sales"

  # Admin capabilities
  ellipse ManageUsers "Manage Users"
  ellipse ViewAnalytics "View Analytics"
}

# Guest interactions
Visitor -> Browse
Visitor -> Search
Visitor -> ViewDetails
Visitor -> Register

# Customer interactions (inherits Guest + more)
Customer -> Login
Customer -> AddCart
Customer -> Checkout
Customer -> TrackOrder

# Seller interactions
Seller -> ListProduct
Seller -> ManageInventory
Seller -> ViewSales

# Admin interactions
Admin -> ManageUsers
Admin -> ViewAnalytics

# Include relationships
edge Checkout -> Payment stereotype: "\u003c\u003cinclude\u003e\u003e" lineStyle: dashed arrowType: open
edge ListProduct -> ManageInventory stereotype: "\u003c\u003cinclude\u003e\u003e" lineStyle: dashed arrowType: open
```

## Actor Styles

Runiq provides **8 actor shapes** for different visualizations:

```runiq
actor User1 as @actor              # Classic stick figure
actor User2 as @box-actor          # Simplified box
actor User3 as @circle-actor       # Circle head with body
actor User4 as @rounded-actor      # Rounded corners
actor User5 as @square-actor       # Square body
actor User6 as @tall-actor         # Tall proportions
actor User7 as @wide-actor         # Wide proportions
actor User8 as @custom-actor       # Configurable
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
