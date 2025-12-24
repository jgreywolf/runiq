---
title: UML Class Diagrams
description: Model object-oriented system structures with classes, interfaces, relationships, visibility, multiplicities, and generalization hierarchies.
lastUpdated: 2025-01-09
---

# UML Class Diagrams

Create UML class diagrams to model object-oriented system structures with Runiq's diagram profile.

## Overview

Class diagrams show classes, their attributes, methods, and relationships (inheritance, composition, aggregation, associations). Runiq supports UML 2.5 notation with proper relationship styling.

## Key Shapes

- **Class**: `@class` - Standard class box
- **Abstract Class**: `@abstract` - Abstract class (italic name)
- **Interface**: `@interface` - Interface definition
- **Enum**: `@enum` - Enumeration type
- **Package**: `@package` - Package/namespace container
- **Note**: `@note` - UML annotation

See the [Shape Reference - UML Shapes](/reference/shapes#_10-uml-shapes-22-shapes) for the complete list.

## Relationship Types

Runiq supports all standard UML relationships with proper arrow styling:

| Relationship                 | Syntax                   | Edge Type                             |
| ---------------------------- | ------------------------ | ------------------------------------- |
| Generalization (Inheritance) | `subclass -> superclass` | `relationship: generalization`        |
| Realization (Interface)      | `class -> interface`     | `relationship: realization`           |
| Composition                  | `whole -> part`          | `relationship: composition`           |
| Aggregation                  | `container -> element`   | `relationship: aggregation`           |
| Association                  | `class1 -> class2`       | `relationship: association` (default) |
| Dependency                   | `client -> supplier`     | `relationship: dependency`            |

## Class Definition Syntax

Define classes with attributes and methods using structured syntax:

```runiq
shape ClassName as @class label: "ClassName"
  stereotype: "«interface»"
  genericTypes: ["T", "K", "V"]
  attributes: [
    {name: "fieldName" type: "string" visibility: private static: true},
    {name: "count" type: "int" visibility: protected default: "0"}
  ]
  methods: [
    {name: "methodName" params: [{name: "arg" type: "T"}] returnType: "void" visibility: public},
    {name: "staticMethod" returnType: "bool" visibility: public static: true abstract: true}
  ]
```

::: tip Shape IDs vs Labels
Each shape must have a **unique ID** within the diagram (e.g., `shape person`, `shape class1`). However, multiple shapes can have the **same label** for display purposes. This allows you to show different variations of a class with the same name but different generic parameters:

```runiq
diagram "Generic Variations" {
  shape classGeneric as @class label: "ClassName<T,K,V>"
    genericTypes: ["T", "K", "V"]

  shape classSimple as @class label: "ClassName<T>"
    genericTypes: ["T"]
}
```

The shape IDs (`classGeneric`, `classSimple`) are used for edges and references, while labels control what is displayed in the rendered diagram.
:::

**Visibility:**

- `public` - `+` prefix
- `private` - `-` prefix
- `protected` - `#` prefix
- `package` - `~` prefix

**Modifiers:**

- `static: true` - Underlined
- `abstract: true` - Italicized
- `derived: true` - `/` prefix (derived attribute)

**Generic Types:**
Support for generics including nested types:

- Simple: `List<T>`
- Multiple: `Map<K,V>`
- Nested: `List<Map<String,Integer>>`
- Bounded: `List<? extends Number>`

## Simple Class Diagram

```runiq
diagram "Domain Model" {
  direction TB

  shape personClass as @class label: "Person"
    attributes: [
      {name: "name" type: "string" visibility: private},
      {name: "age" type: "int" visibility: private}
    ]
    methods: [
      {name: "getName" returnType: "string" visibility: public}
    ]

  shape student as @class label: "Student"
    attributes: [
      {name: "studentId" type: "string" visibility: private}
    ]
    methods: [
      {name: "enroll" returnType: "void" visibility: public}
    ]

  shape teacher as @class label: "Teacher"
    attributes: [
      {name: "employeeId" type: "string" visibility: private}
    ]
    methods: [
      {name: "teach" returnType: "void" visibility: public}
    ]

  student -> personClass relationship: generalization
  teacher -> personClass relationship: generalization
}
```

## Interface Implementation

```runiq
diagram "Interface Pattern" {
  direction TB

  shape drawable as @interface label: "Drawable"
    stereotype: "«interface»"
    methods: [
      {name: "draw" returnType: "void" visibility: public abstract: true}
    ]

  shape circleClass as @class label: "Circle"
    attributes: [
      {name: "radius" type: "float" visibility: private}
    ]
    methods: [
      {name: "draw" returnType: "void" visibility: public}
    ]

  shape rectangle as @class label: "Rectangle"
    attributes: [
      {name: "width" type: "float" visibility: private},
      {name: "height" type: "float" visibility: private}
    ]
    methods: [
      {name: "draw" returnType: "void" visibility: public}
    ]

  circleClass -> drawable relationship: realization
  rectangle -> drawable relationship: realization
}
```

## Composition vs Aggregation

```runiq
diagram "Relationships" {
  direction LR

  shape car as @class label: "Car"
    attributes: [
      {name: "vin" type: "string" visibility: private}
    ]

  shape engine as @class label: "Engine"
    attributes: [
      {name: "horsepower" type: "int" visibility: private}
    ]

  shape wheel as @class label: "Wheel"
    attributes: [
      {name: "size" type: "int" visibility: private}
    ]

  shape driver as @class label: "Driver"
    attributes: [
      {name: "license" type: "string" visibility: private}
    ]

  car -> engine relationship: composition multiplicitySource: "1" multiplicityTarget: "1"
  car -> wheel relationship: composition multiplicitySource: "1" multiplicityTarget: "4"
  car -> driver relationship: aggregation multiplicitySource: "1" multiplicityTarget: "0..1"
}
```

**Composition** (filled diamond): Strong ownership, part cannot exist without whole
**Aggregation** (hollow diamond): Weak ownership, part can exist independently

## Design Pattern Example

Factory pattern implementation:

```runiq
diagram "Factory Pattern" {
  direction TB

  shape product as @interface label: "Product"
    stereotype: "«interface»"
    methods: [
      {name: "operation" returnType: "void" visibility: public abstract: true}
    ]

  shape concreteA as @class label: "ConcreteProductA"
    methods: [
      {name: "operation" returnType: "void" visibility: public}
    ]

  shape concreteB as @class label: "ConcreteProductB"
    methods: [
      {name: "operation" returnType: "void" visibility: public}
    ]

  shape factory as @abstract label: "Creator"
    stereotype: "«abstract»"
    methods: [
      {name: "factoryMethod" returnType: "Product" visibility: public abstract: true},
      {name: "operation" returnType: "void" visibility: public}
    ]

  shape concreteFactory as @class label: "ConcreteCreator"
    methods: [
      {name: "factoryMethod" returnType: "Product" visibility: public}
    ]

  concreteA -> product relationship: realization
  concreteB -> product relationship: realization
  concreteFactory -> factory relationship: generalization
  factory -> product relationship: dependency
}
```

## Generics/Templates

```runiq
diagram "Generic Collections" {
  direction TB

  shape list as @class label: "List"
    genericTypes: ["T"]
    attributes: [
      {name: "items" type: "T[]" visibility: private}
    ]
    methods: [
      {name: "add" params: [{name: "item" type: "T"}] returnType: "void" visibility: public},
      {name: "get" params: [{name: "index" type: "int"}] returnType: "T" visibility: public},
      {name: "size" returnType: "int" visibility: public}
    ]

  shape stringList as @class label: "List<String>"
  shape intList as @class label: "List<Integer>"

  stringList -> list relationship: generalization label: "«bind» <String>"
  intList -> list relationship: generalization label: "«bind» <Integer>"
}
```

**Generic Type Examples:**

- Single type parameter: `genericTypes: ["T"]`
- Multiple parameters: `genericTypes: ["K", "V"]`
- Bounded generics: `genericTypes: ["T extends Comparable"]`
- Complex nested types in attributes/methods: `type: "Map<String,List<Integer>>"`

## Observer Pattern

```runiq
diagram "Observer Pattern" {
  direction TB

  shape subject as @class label: "Subject"
    attributes: [
      {name: "observers" type: "Observer[]" visibility: private}
    ]
    methods: [
      {name: "attach" params: [{name: "o" type: "Observer"}] returnType: "void" visibility: public},
      {name: "detach" params: [{name: "o" type: "Observer"}] returnType: "void" visibility: public},
      {name: "notify" returnType: "void" visibility: public}
    ]

  shape observer as @interface label: "Observer"
    stereotype: "«interface»"
    methods: [
      {name: "update" returnType: "void" visibility: public abstract: true}
    ]

  shape concreteSubject as @class label: "ConcreteSubject"
    attributes: [
      {name: "state" type: "int" visibility: private}
    ]
    methods: [
      {name: "getState" returnType: "int" visibility: public},
      {name: "setState" params: [{name: "s" type: "int"}] returnType: "void" visibility: public}
    ]

  shape concreteObserver as @class label: "ConcreteObserver"
    attributes: [
      {name: "observerState" type: "int" visibility: private}
    ]
    methods: [
      {name: "update" returnType: "void" visibility: public}
    ]

  concreteSubject -> subject relationship: generalization
  concreteObserver -> observer relationship: realization
  concreteObserver -> concreteSubject relationship: dependency
  subject -> observer relationship: aggregation multiplicityTarget: "0..*"
}
```

## Styling

Customize class diagram appearance:

```runiq
diagram "Styled Classes" {
  direction TB

  shape base as @abstract label: "BaseClass"
    stereotype: "«abstract»"
    fillColor: "#fef3c7"
    strokeColor: "#f59e0b"
    methods: [
      {name: "abstractMethod" returnType: "void" visibility: public abstract: true}
    ]

  shape derived as @class label: "DerivedClass"
    fillColor: "#dbeafe"
    strokeColor: "#3b82f6"
    methods: [
      {name: "abstractMethod" returnType: "void" visibility: public}
    ]

  shape util as @class label: "Helper"
    stereotype: "«utility»"
    fillColor: "#d1fae5"
    strokeColor: "#10b981"
    methods: [
      {name: "helperMethod" returnType: "void" visibility: public static: true}
    ]

  derived -> base relationship: generalization strokeColor: "#f59e0b" strokeWidth: 2
  derived -> util relationship: dependency lineStyle: "dashed"
}
```

## Complete UML Class Syntax Reference

### Attribute Properties

```runiq
diagram "Attribute Example" {
  shape MyClass as @class label: "MyClass"
    attributes: [
      {
        name: "attributeName"      // Required
        type: "TypeName"            // Required (supports generics)
        visibility: private         // public | private | protected | package
        static: true               // Underlined in display
        derived: true              // Prefixed with /
        default: "defaultValue"    // Default value
        constraints: ["OCL expr"]  // OCL constraints
      }
    ]
}
```

### Method Properties

```runiq
diagram "Method Example" {
  shape MyClass as @class label: "MyClass"
    methods: [
      {
        name: "methodName"         // Required
        params: [                  // Optional
          {name: "param1" type: "Type1"},
          {name: "param2" type: "Type2<Generic>"}
        ]
        returnType: "ReturnType"   // Optional
        visibility: public         // public | private | protected | package
        static: true              // Underlined in display
        abstract: true            // Italicized in display
        constraints: ["pre: ...", "post: ..."]  // Pre/post conditions
      }
    ]
}
```

### Generic Type Support

Full support for complex generic types:

**Simple Generics:**

```runiq
diagram "Simple Generics" {
  shape list as @class label: "List"
    genericTypes: ["T"]                    // Class<T>

  shape map as @class label: "Map"
    genericTypes: ["K", "V"]               // Map<K, V>
}
```

**Nested Generics:**

```runiq
diagram "Nested Generics" {
  shape complexList as @class label: "ComplexList"
    attributes: [
      {name: "data" type: "List<Map<String,Integer>>" visibility: private},      // Fully nested
      {name: "optional" type: "Optional<? extends Number>" visibility: private}, // Bounded wildcards
      {name: "func" type: "Function<T, R>" visibility: private}                  // Function types
    ]
}
```

**Language-Specific Generics:**

```runiq
diagram "Language-Specific Generics" {
  shape pythonClass as @class label: "PythonClass"
    attributes: [
      {name: "data" type: "Dict[str, List[int]]" visibility: private}          // Python
    ]

  shape tsClass as @class label: "TypeScriptClass"
    attributes: [
      {name: "matrix" type: "Array<Array<number>>" visibility: private}        // TypeScript
    ]

  shape rustStruct as @class label: "RustStruct"
    attributes: [
      {name: "boxed" type: "Vec<Box<dyn Trait>>" visibility: private}          // Rust
    ]

  shape scalaClass as @class label: "ScalaClass"
    attributes: [
      {name: "optional" type: "List[Option[Int]]" visibility: private}         // Scala
    ]
}
```

### Stereotypes

Stereotypes are UML extension mechanisms shown with guillemets (« »). Runiq supports both single and multiple stereotypes:

**Single Stereotype:**

```runiq
shape myInterface as @class label: "MyInterface"
  stereotype: "interface"
```

**Multiple Stereotypes:**

```runiq
shape repository as @class label: "UserRepository"
  stereotypes: ["entity", "persistent", "auditable"]
```

**Common UML Stereotypes:**

```runiq
diagram "Stereotypes" {
  shape myInterface as @class label: "MyInterface"
    stereotype: "interface"

  shape myAbstract as @class label: "MyAbstract"
    stereotype: "abstract"

  shape myUtility as @class label: "MyUtility"
    stereotype: "utility"

  shape myEntity as @class label: "MyEntity"
    stereotype: "entity"

  shape myBoundary as @class label: "MyBoundary"
    stereotype: "boundary"

  shape myControl as @class label: "MyControl"
    stereotype: "control"

  shape myEnum as @class label: "MyEnum"
    stereotype: "enumeration"

  # Multiple stereotypes for JPA entity
  shape userEntity as @class label: "User"
    stereotypes: ["entity", "persistent", "transactional"]
    attributes: [
      {name: "id" type: "Long" visibility: private},
      {name: "username" type: "String" visibility: private}
    ]
}
```

::: tip Stereotype Rendering

- Single stereotypes: `stereotype: "entity"` → renders as `«entity»`
- Multiple stereotypes: `stereotypes: ["entity", "persistent"]` → renders as `«entity» «persistent»`
- Guillemets (« ») are added automatically - just provide the text
  :::

### Display Behavior

- **Empty sections hidden**: If no attributes defined, attribute section not shown
- **Empty sections hidden**: If no methods defined, methods section not shown
- **Only name shown**: If neither attributes nor methods, only class name displayed
- **Visibility symbols**: Automatically rendered (`+` `-` `#` `~`)
- **Modifiers**: Static (underlined), Abstract (italicized), Derived (`/` prefix)

## Best Practices

1. **Use proper relationship types** - Choose correct relationships for semantics
2. **Show key members** - Don't include trivial getters/setters
3. **Package organization** - Group related classes with containers
4. **Consistent layout** - Base classes at top, derived classes below
5. **Visibility markers** - Always specify visibility for clarity
6. **Stereotypes** - Use standard UML stereotypes
7. **Multiplicity** - Add cardinality labels (1, 0..1, 0.._, 1.._)
8. **Generic types** - Use `genericTypes` for type parameters
9. **Constraints** - Add OCL constraints for invariants

## Advanced Features

### Constraints

Add OCL constraints with note shapes:

```runiq
diagram "With Constraints" {
  shape class as @class label: "BankAccount"
    attributes: [
      {name: "balance" type: "float" visibility: private constraints: ["balance >= 0"]}
    ]
    methods: [
      {name: "withdraw" params: [{name: "amount" type: "float"}] returnType: "bool" visibility: public constraints: ["amount > 0", "amount <= balance"]}
    ]

  shape noteShape as @note label: "{balance >= 0}"

  noteShape -> class arrowType: none lineStyle: "dotted"
}
```

**Constraints can be specified:**

- On attributes: `constraints: ["balance >= 0"]`
- On methods: `constraints: ["amount > 0", "amount <= balance"]`
- As attached notes for complex OCL expressions

::: tip
Note attachments use `arrowType: none` since they are not UML relationships.
:::

### Association Classes

Model attributes on relationships:

```runiq
diagram "Association Class" {
  direction LR

  shape student as @class label: "Student"
    attributes: [
      {name: "studentId" type: "string" visibility: private}
    ]

  shape course as @class label: "Course"
    attributes: [
      {name: "courseId" type: "string" visibility: private}
    ]

  shape enrollment as @class label: "Enrollment"
    attributes: [
      {name: "grade" type: "char" visibility: private},
      {name: "date" type: "Date" visibility: private}
    ]

  student -> course relationship: association roleSource: "enrolls in" multiplicitySource: "*" multiplicityTarget: "*"
  enrollment -> student arrowType: none lineStyle: "dotted"
  enrollment -> course arrowType: none lineStyle: "dotted"
}
```

## Comparison with Other Tools

| Feature                       | Runiq             | Mermaid      | PlantUML     | Lucidchart         | Draw.io       | Enterprise Architect |
| ----------------------------- | ----------------- | ------------ | ------------ | ------------------ | ------------- | -------------------- |
| **Text-Based DSL**            | ✅                | ✅           | ✅           | ❌ No (GUI)        | ❌ No (GUI)   | ⚠️ Hybrid            |
| **Version Control Friendly**  | ✅                | ✅           | ✅           | ⚠️ Limited         | ⚠️ Limited    | ❌ No                |
| **UML 2.5 Compliance**        | ✅                | ⚠️ Basic     | ✅           | ⚠️ Partial         | ⚠️ Partial    | ✅                   |
| **Relationship Types**        | ✅                | ⚠️ 4 types   | ✅           | ✅ Manual styling  | ✅ Manual     | ✅                   |
| **Visibility Modifiers**      | ✅                | ✅           | ✅           | ✅ Manual          | ✅ Manual     | ✅                   |
| **Generic Types**             | ✅                | ⚠️ Limited   | ✅           | ⚠️ Manual text     | ⚠️ Manual     | ✅                   |
| **Abstract/Static Modifiers** | ✅                | ✅           | ✅           | ⚠️ Manual styling  | ⚠️ Manual     | ✅                   |
| **Stereotypes**               | ✅                | ⚠️ Limited   | ✅           | ⚠️ Manual          | ⚠️ Manual     | ✅                   |
| **Multiplicity**              | ✅                | ⚠️ Basic     | ✅           | ✅ Manual          | ✅ Manual     | ✅                   |
| **Composition/Aggregation**   | ✅                | ✅           | ✅           | ✅                 | ✅            | ✅                   |
| **Packages/Namespaces**       | ✅ Via containers | ✅           | ✅           | ✅                 | ✅            | ✅                   |
| **Association Classes**       | ✅                | ✅           | ✅           | ⚠️ Manual          | ⚠️ Manual     | ✅                   |
| **Auto-Layout**               | ✅                | ✅           | ✅           | ⚠️ Manual          | ⚠️ Manual     | ✅                   |
| **Export Formats**            | ✅                | ✅ SVG, PNG  | ✅ PNG, SVG  | ✅ Many formats    | ✅ Many       | ✅ Many              |
| **Collaboration**             | ✅ Git-based      | ✅ Git-based | ✅ Git-based | ✅ Cloud (Paid)    | ✅ Cloud      | ⚠️ Database-based    |
| **Learning Curve**            | ⚠️ Moderate (DSL) | ✅ Low       | ⚠️ Moderate  | ✅ Low (GUI)       | ✅ Low        | ❌ High              |
| **Open Source**               | ✅ MIT License    | ✅ MIT       | ✅ GPL       | ❌ Commercial only | ✅ Apache 2.0 | ❌ Commercial only   |

**Runiq Advantages:**

- **UML 2.5 compliant** with full relationship type support
- **Unified language** for class, sequence, use case, state machine, and 15+ diagram types
- **Structured attribute/method syntax** with visibility, modifiers, generics
- **Generic type parameters** displayed clearly (e.g., `List<T>`, `Map<K,V>`)
- **Version control native** - perfect for documenting APIs in repositories
- **ELK layout engine** for superior layered layouts
- **Association classes** with proper dotted-line notation
- **Profile system** for diagram-specific conventions

## Examples

See the [class diagram examples](/examples/class-diagrams) directory for complete examples:

- Simple inheritance
- Interface implementation
- Factory pattern
- Observer pattern
- Generic collections
- Aggregation and composition
- Domain models

## Related

- [Shape Reference - UML Shapes](/reference/shapes#_10-uml-shapes-22-shapes)
- [Use Case Diagrams](/guide/use-case-diagrams)
- [Edges & Connections](/guide/edges)
- [Styling](/guide/styling)
