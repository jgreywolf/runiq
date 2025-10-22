# UML Class Diagram Examples

This directory contains comprehensive examples of UML class diagrams using Runiq's class diagram syntax.

## Examples Overview

### 1. Simple Inheritance (`simple-inheritance.runiq`)

Demonstrates basic object-oriented inheritance with an abstract base class and concrete derived classes.

**Concepts:**

- Abstract classes with `stereotype:"abstract"`
- Abstract methods with `abstract:true`
- Inheritance relationships
- Protected and private visibility

**Classes:**

- `Animal` (abstract base class)
- `Dog`, `Cat`, `Bird` (concrete implementations)

### 2. Interface Implementation (`interface-implementation.runiq`)

Shows interface definitions and how multiple classes implement the same interface.

**Concepts:**

- Interface stereotypes with `stereotype:"interface"`
- Generic type parameters `genericTypes:["T"]`
- Implementation relationships (dashed lines)
- Method contracts

**Classes:**

- `IComparable<T>` (generic interface)
- `Integer`, `String`, `Date` (implementing classes)

### 3. Generic Collections (`generic-collections.runiq`)

Comprehensive demonstration of generic type parameters in various collection classes.

**Concepts:**

- Single type parameters: `List<T>`
- Multiple type parameters: `Map<K, V>`
- Nested generics: `Map<String, T>`
- Bounded type parameters: `T extends Comparable<T>`
- Generic method signatures

**Classes:**

- `List<T>`, `ArrayList<T>` (single generic)
- `Map<K,V>`, `HashMap<K,V>` (multiple generics)
- `Repository<T>` (nested generics)
- `SortedList<T extends Comparable<T>>` (bounded types)

### 4. Factory Pattern (`factory-pattern.runiq`)

Complete implementation of the Factory design pattern showing product hierarchy and factory methods.

**Concepts:**

- Abstract Factory pattern
- Product and Factory hierarchies
- Dependency injection via constructor
- Member-level dependencies with `Application.factory -> IButtonFactory`
- Labeled edges for "creates" relationships

**Classes:**

- `IButton`, `IButtonFactory` (interfaces)
- Platform-specific implementations (Windows, Mac, Linux)
- `Application` (client class)

### 5. Domain Model (`domain-model.runiq`)

E-commerce domain model demonstrating **member-level edge connections** for foreign key relationships.

**Concepts:**

- Database entity modeling
- **Foreign key relationships using member-level edges**: `Order.customerId -> Customer.id`
- Complex domain models with multiple relationships
- Business logic in entity methods

**Classes:**

- `Customer`, `Order`, `OrderItem` (core entities)
- `Product`, `Category` (catalog entities)
- `Payment` (transaction entity)

**Key Feature - Member-Level Edges:**

```runiq
Order.customerId -> Customer.id
OrderItem.orderId -> Order.id
OrderItem.productId -> Product.id
```

This innovative syntax allows edges to connect specific class members, perfect for showing:

- Foreign key relationships in databases
- Field-level dependencies
- Composition relationships at the attribute level

### 6. Observer Pattern (`observer-pattern.runiq`)

Implementation of the Observer design pattern with subject and multiple observers.

**Concepts:**

- Observer pattern architecture
- Subject-Observer relationships
- Collection of observers in subject
- Update notification mechanism

**Classes:**

- `ISubject`, `IObserver` (pattern interfaces)
- `WeatherStation` (concrete subject)
- Display classes (concrete observers)

## Syntax Guide

### Basic Class Declaration

```runiq
shape ClassName as @class label:"DisplayName"
```

### Attributes

```runiq
attributes:[
  {name:"fieldName" type:"FieldType" visibility:private},
  {name:"publicField" type:"int" visibility:public default:"0"}
]
```

**Visibility Options:**

- `public` → `+` symbol
- `private` → `-` symbol
- `protected` → `#` symbol
- `package` → `~` symbol

### Methods

```runiq
methods:[
  {name:"methodName" returnType:"ReturnType" visibility:public},
  {name:"withParams" params:[{name:"arg" type:"int"}] returnType:"void" visibility:public},
  {name:"abstractMethod" returnType:"void" visibility:public abstract:true}
]
```

### Generic Types

```runiq
// Single type parameter
genericTypes:["T"]

// Multiple parameters
genericTypes:["K", "V"]

// Bounded types
genericTypes:["T extends Comparable<T>"]
```

### Stereotypes

```runiq
stereotype:"interface"    // «interface»
stereotype:"abstract"     // «abstract»
```

### Relationships

```runiq
// Inheritance (solid arrow)
DerivedClass -> BaseClass

// Implementation (dashed arrow)
ConcreteClass -> IInterface lineStyle:dashed

// Association with label
ClassA -label-> ClassB

// Member-level connection (foreign key)
Order.customerId -> Customer.id

// Member to class
Controller.service -> ServiceClass
```

## Compartment Hiding

Classes automatically hide empty compartments:

- If no attributes are defined, the attributes section is omitted
- If no methods are defined, the methods section is omitted
- A class with only a name shows just the name compartment

## Layout Tips

1. **Direction**: Use `direction: TB` (top-bottom) for inheritance hierarchies, `direction: LR` (left-right) for compositions
2. **Grouping**: Place related classes near each other in the source file
3. **Member Edges**: Member-level connections help visualize specific field relationships without cluttering the diagram

## Member-Level Edge Benefits

The member-level edge syntax (`Class.field -> OtherClass.method`) is particularly useful for:

1. **Database Schemas**: Show foreign key relationships explicitly
2. **Dependency Injection**: Visualize which fields depend on which classes
3. **Composition**: Show field-level object composition
4. **API Integration**: Document which methods call which external services
5. **Data Flow**: Trace how data moves between specific class members

## Running Examples

To parse and visualize these examples:

```bash
# Parse a specific example
pnpm --filter @runiq/cli run dev examples/class-diagrams/domain-model.runiq

# Generate SVG output
pnpm --filter @runiq/cli run dev examples/class-diagrams/factory-pattern.runiq -o output.svg
```

### 7. Aggregation Example (`aggregation-example.runiq`)

Demonstrates shared aggregation with hollow diamond notation.

**Concepts:**

- Aggregation relationship (hollow diamond)
- Shared ownership semantics
- Independent lifecycle of parts
- Role names on associations
- Multiplicity notation

**Classes:**

- `Department` (container/whole)
- `Employee` (part that can exist independently)

**Key Point:** Employees can exist without the Department (transferred, laid off, etc.)

### 8. Composition Example (`composition-example.runiq`)

Shows composite aggregation with filled diamond notation.

**Concepts:**

- Composition relationship (filled diamond)
- Exclusive ownership semantics
- Dependent lifecycle of parts
- Multiple composition examples

**Classes:**

- `House` → `Room` (rooms destroyed with house)
- `Car` → `Engine`, `Wheel` (parts destroyed with car)

**Key Point:** Parts cannot exist without the container (strong "death" relationship)

### 9. Complete UML Relationships (`uml-relationships-complete.runiq`)

Comprehensive example showcasing all Phase 1 UML relationship features.

**Concepts:**

- Composition (University → Department)
- Aggregation (Department → Professor)
- Association with multiplicity (Professor → Course, Student → Course)
- Role names on all relationships
- Multiple multiplicity patterns (1, 0..1, 1.._, 0.._, etc.)

**Classes:**

- University system with 5 interconnected classes
- Full relationship spectrum demonstration

## UML Relationship Types

### Aggregation (Hollow Diamond ◇)

- **Syntax:** `edgeType: aggregation`
- **Rendering:** White-filled diamond on container side
- **Semantics:** Shared ownership, parts can exist independently
- **Example:** Department has Employees (employees can transfer)

### Composition (Filled Diamond ◆)

- **Syntax:** `edgeType: composition`
- **Rendering:** Black-filled diamond on container side
- **Semantics:** Exclusive ownership, parts destroyed with container
- **Example:** House has Rooms (rooms destroyed when house demolished)

### Multiplicity Notation

- `1` - Exactly one
- `0..1` - Zero or one (optional)
- `0..*` or `*` - Zero or more
- `1..*` - One or more (at least one required)
- `2..5` - Specific range
- `4` - Exact count

### Role Names

- **Syntax:** `roleSource: "employer"` and `roleTarget: "employee"`
- **Rendering:** Italicized text near association ends
- **Purpose:** Clarify the role each class plays in the relationship

## Usage Examples

```runiq
// Aggregation: hollow diamond on source
Department -> Employee
  edgeType: aggregation
  multiplicitySource: "1"
  multiplicityTarget: "0..*"
  roleSource: "employer"
  roleTarget: "member"

// Composition: filled diamond on source
House -> Room
  edgeType: composition
  multiplicitySource: "1"
  multiplicityTarget: "1..*"

// Simple association with multiplicity
Professor -teaches-> Course
  multiplicitySource: "1..*"
  multiplicityTarget: "1..*"
  roleSource: "instructor"
  roleTarget: "subject"
```

## Best Practices

1. **Use stereotypes** to clearly indicate interfaces and abstract classes
2. **Leverage generics** for type-safe collection and container classes
3. **Apply visibility modifiers** consistently (prefer private fields, public methods)
4. **Use member-level edges** to document foreign keys and field dependencies
5. **Add method parameters** for important operations to show contracts
6. **Group related classes** in the same diagram (5-10 classes max for readability)
7. **Use labeled edges** to clarify relationship semantics ("creates", "uses", "contains")
8. **Choose correct relationship type:**
   - Composition for strong ownership (filled diamond)
   - Aggregation for catalog relationships (hollow diamond)
   - Simple association for general relationships
9. **Always specify multiplicity** on both ends for clarity
10. **Use role names** to document the perspective of each class
11. **Use visual modifiers** to make diagrams more UML-compliant:
    - Mark static members with `static:true` (renders underlined)
    - Mark abstract methods with `abstract:true` (renders italicized)
    - Mark derived/calculated attributes with `derived:true` (renders with `/` prefix)

## Phase 2: Visual Enhancements (UML 2.5 Compliance)

### Static Members (Underlined)

Static attributes and methods are rendered with an underline, following UML standard:

```runiq
shape MathUtils as @class
  attributes:[
    {name:"PI" type:"double" visibility:public static:true} // Renders: + __PI__: double
  ]
  methods:[
    {name:"max" params:[...] returnType:"int" visibility:public static:true} // Underlined
  ]
```

### Abstract Methods (Italics)

Abstract methods are rendered in italics:

```runiq
shape Shape as @class stereotype:"abstract"
  methods:[
    {name:"calculateArea" returnType:"double" visibility:public abstract:true} // _Italicized_
  ]
```

### Derived Attributes (/ Prefix)

Computed or calculated attributes use the `/` prefix:

```runiq
shape Person as @class
  attributes:[
    {name:"birthDate" type:"Date" visibility:private},
    {name:"age" type:"int" visibility:public derived:true} // Renders: + /age: int
  ]
```

**When to use derived:**

- Calculated from other attributes (age from birthDate)
- Properties with getters but no setters
- Cached or memoized values
- Aggregated data (total from items)

## Next Steps

- Try creating your own class diagrams
- Experiment with complex generic types
- Use member-level edges to document your database schema
- Combine multiple patterns in a single architecture diagram
- Practice distinguishing composition from aggregation
- Apply visual modifiers (static, abstract, derived) for UML compliance
