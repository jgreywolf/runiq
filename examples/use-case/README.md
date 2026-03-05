# Use Case Diagram Examples

UML use case diagrams showing actors interacting with system functionality.

> **📸 Visual Outputs:** SVG visualizations are coming soon! For now, you can view the `.runiq` source files below. To generate SVGs, run through the Runiq CLI or renderer.

## ✨ NEW Features!

### UML Relationship Stereotypes

- **`<<include>>`** - Required dependency (dashed arrow, open head)
- **`<<extend>>`** - Optional extension (dashed arrow, open head)
- **`<<uses>>`** - Dependency (dashed arrow, open head)
- **`<<implements>>`** - Interface realization (dashed arrow, hollow head)

### Line Styles

- **solid** - Standard associations, generalizations
- **dashed** - Dependencies, includes, extends
- **dotted** - Alternative styling

### Arrow Types

- **standard** - Filled triangle (associations)
- **hollow** - Open triangle (generalization/inheritance, realization)
- **open** - V-shaped (dependencies)
- **none** - No arrow (bidirectional or undirected)

## Features Demonstrated

### Shapes Used

- **Actors**: `actor` - stick figure representing system users
- **Use Cases**: `ellipse-wide` - horizontal ovals representing system functionality
- **System Boundary**: `system-boundary` - dotted rectangle grouping related use cases
- **Actor Variants**: `actor-circle`, `actor-rect`, `person` - alternative actor styles

### Connections

- **Associations**: Simple arrows showing actor-use case relationships
- **Use Case Dependencies**: Arrows between use cases (include/extend relationships)
- **External System Interactions**: Labeled connections to external actors

## Examples

### banking.runiq

Customer banking system showing:

- Multiple actors (Customer, Bank Staff, Payment Gateway)
- System boundary containing use cases
- Association relationships
- External system integration

**Run:**

```bash
runiq banking.runiq -o banking.svg
```

### banking-advanced.runiq (NEW! 🎉)

Advanced banking system demonstrating:

- **`<<include>>`** relationships for shared functionality
- **`<<extend>>`** relationships for optional features
- All three UML use case relationship types
- Proper stereotype notation

**Run:**

```bash
runiq banking-advanced.runiq -o banking-advanced.svg
```

### class-relationships.runiq (NEW! 🎉)

Class diagram showing all relationship types:

- **Generalization** (inheritance): solid line, hollow arrow
- **Realization** (implements): dashed line, hollow arrow
- **Dependency**: dashed line, open arrow with stereotype
- **Association**: solid line, standard arrow

**Run:**

```bash
runiq class-relationships.runiq -o class-diagram.svg
```

### line-style-showcase.runiq (NEW! 🎉)

Complete showcase of all combinations:

- All line styles (solid, dashed, dotted)
- All arrow types (standard, hollow, open, none)
- With and without stereotypes
- Visual reference guide

**Run:**

```bash
runiq line-style-showcase.runiq -o styles.svg
```

### ecommerce.runiq

E-commerce platform showing:

- Customer, admin, and vendor actors
- Product management use cases
- Checkout workflow with payment processing
- Inventory synchronization with external vendor

**Run:**

```bash
runiq ecommerce.runiq -o ecommerce.svg
```

### simple.runiq

Minimal example for learning:

- Single actor
- Two use cases in system boundary
- Basic associations

**Run:**

```bash
runiq simple.runiq -o simple.svg
```

## Relationship Syntax

### Basic Association

```runiq
actor Customer "Customer"
ellipse-wide PlaceOrder "Place Order"

Customer -> PlaceOrder
```

### `<<include>>` Relationship

Required dependency - base use case ALWAYS includes the other:

```runiq
ellipse-wide Checkout "Checkout"
ellipse-wide ValidatePayment "Validate Payment"

Checkout -> ValidatePayment stereotype: "include" lineStyle: dashed arrowType: open
```

### `<<extend>>` Relationship

Optional extension - extending use case adds behavior to base:

```runiq
ellipse-wide CompletePurchase "Complete Purchase"
ellipse-wide PrintReceipt "Print Receipt"

PrintReceipt -> CompletePurchase stereotype: "extend" lineStyle: dashed arrowType: open
```

### Generalization (Inheritance)

Actor or use case specialization:

```runiq
actor OnlineCustomer "Online Customer"
actor Customer "Customer"

OnlineCustomer -> Customer lineStyle: solid arrowType: hollow
```

### Custom Combinations

```runiq
# Dependency with custom stereotype
A -> B stereotype: "uses" lineStyle: dashed arrowType: open label: "invokes"

# Association with label
A -> B lineStyle: solid arrowType: standard label: "manages"

# Generalization
Child -> Parent lineStyle: solid arrowType: hollow
```

## Use Case Diagram Best Practices

### When to Use

- **Requirements Analysis**: Capture functional requirements from user perspective
- **Stakeholder Communication**: Visual overview of system capabilities
- **Scope Definition**: Define system boundaries and external interfaces
- **Test Planning**: Identify scenarios for acceptance testing

### Diagram Structure

1. **Actors** (External entities):
   - Primary actors: Initiate use cases (customers, users)
   - Secondary actors: Respond to system (external systems, services)
   - Use descriptive role names

2. **System Boundary**:
   - Contains all use cases provided by the system
   - Label with system name
   - Keep boundary simple and rectangular

3. **Use Cases** (System functionality):
   - Name with verb phrases (e.g., "Place Order", "Generate Report")
   - Keep granularity consistent
   - Focus on user goals, not implementation

4. **Relationships**:
   - **Association**: Actor uses functionality (solid line)
   - **Include**: One use case always includes another (dashed arrow with `<<include>>`)
   - **Extend**: Optional extension of use case (dashed arrow with `<<extend>>`)
   - **Generalization**: Actor/use case specialization (solid arrow)

### Tips

- **Keep it Simple**: 5-10 use cases per diagram maximum
- **Actor Placement**: Primary actors on left, secondary on right
- **Consistent Naming**: Use active voice for use cases
- **Avoid Implementation Details**: Focus on "what" not "how"
- **Group Related Use Cases**: Use system boundaries to organize

## Shape Reference

### Actor Shapes

```
actor A1 "Customer"           # Standard stick figure
actor-circle A2 "Admin"       # Actor in circle
actor-rect A3 "System"        # Actor in rectangle
person P1 "User"              # Alternative person icon
```

### Use Case Shapes

```
ellipse-wide UC1 "Login"      # Horizontal oval (standard)
rounded UC2 "Process"         # Rounded rectangle (alternative)
```

### System Boundary

```
system-boundary Sys "My System" {
  # Use cases go here
  ellipse-wide UC1 "Feature 1"
  ellipse-wide UC2 "Feature 2"
}
```

## UML Relationship Reference

### Association (Actor to Use Case)

**Visual**: Solid line with filled arrow  
**Syntax**: `Actor -> UseCase`  
**Meaning**: Actor participates in or initiates the use case

```runiq
Customer -> PlaceOrder lineStyle: solid arrowType: standard
```

### `<<include>>` (Use Case Dependency)

**Visual**: Dashed line with open arrow  
**Syntax**: `BaseUseCase -> IncludedUseCase stereotype: "include" lineStyle: dashed arrowType: open`  
**Meaning**: Base use case always includes the behavior of included use case  
**Direction**: From base → to included

```runiq
Checkout -> ValidatePayment stereotype: "include" lineStyle: dashed arrowType: open
```

### `<<extend>>` (Use Case Extension)

**Visual**: Dashed line with open arrow  
**Syntax**: `ExtendingUseCase -> BaseUseCase stereotype: "extend" lineStyle: dashed arrowType: open`  
**Meaning**: Extending use case adds optional behavior to base use case  
**Direction**: From extending → to base (opposite of include!)

```runiq
PrintReceipt -> CompletePurchase stereotype: "extend" lineStyle: dashed arrowType: open
```

### Generalization (Inheritance)

**Visual**: Solid line with hollow arrow  
**Syntax**: `SpecializedActor -> GeneralActor lineStyle: solid arrowType: hollow`  
**Meaning**: Specialized actor/use case inherits from general actor/use case  
**Direction**: From child → to parent

```runiq
OnlineCustomer -> Customer lineStyle: solid arrowType: hollow
```

## Related Diagram Types

- **Sequence Diagrams**: Show detailed interaction flows (fully supported)
- **Class Diagrams**: Show system structure with all relationship types (fully supported)
- **Activity Diagrams**: Show workflow logic (use flowchart type)
- **State Diagrams**: Show state transitions (use state-machine type)
