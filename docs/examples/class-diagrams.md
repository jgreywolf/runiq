---
title: Class Diagram Examples
description: UML class diagrams for object-oriented design, database modeling, and API documentation
lastUpdated: 2025-01-21
---

# Class Diagram Examples

Class diagrams are UML diagrams that show the structure of a system by modeling classes, their attributes, methods, and relationships. They're essential for object-oriented design, database schema modeling, and API documentation.

## Basic Class Structure

### Example 1: Simple Class

A basic class with attributes and methods:

```runiq
diagram "Simple Example" {
  shape User as @class label:"User"
    attributes:[
      {name:"id" type:"int" visibility:private},
      {name:"email" type:"string" visibility:private},
      {name:"name" type:"string" visibility:private}
    ]
    methods:[
      {name:"getId" returnType:"int" visibility:public},
      {name:"getEmail" returnType:"string" visibility:public},
      {name:"setName" params:[{name:"name" type:"string"}] returnType:"void" visibility:public}
    ]
}
```

**Visibility Modifiers:**
- `public` - `+` symbol (accessible from anywhere)
- `private` - `-` symbol (accessible only within class)
- `protected` - `#` symbol (accessible within class and subclasses)
- `package` - `~` symbol (accessible within package)

## Relationships

### Association

Basic relationship between classes:

```runiq
diagram "Association Example" {
  shape Teacher as @class label:"Teacher"
    attributes:[{name:"employeeId" type:"int" visibility:private}]
    methods:[{name:"teach" returnType:"void" visibility:public}]

  shape Student as @class label:"Student"
    attributes:[{name:"studentId" type:"int" visibility:private}]
    methods:[{name:"learn" returnType:"void" visibility:public}]

  Teacher -> Student label:"teaches" multiplicityTarget:"1..*"
}
```

### Inheritance

Parent-child "is-a" relationships:

```runiq
diagram "Inheritance Example" {
  shape Animal as @class label:"Animal"
    attributes:[{name:"name" type:"string" visibility:protected}]
    methods:[{name:"makeSound" returnType:"void" visibility:public abstract:true}]

  shape Dog as @class label:"Dog"
    methods:[{name:"makeSound" returnType:"void" visibility:public}]

  shape Cat as @class label:"Cat"
    methods:[{name:"makeSound" returnType:"void" visibility:public}]

  Dog -> Animal relationship: generalization
  Cat -> Animal relationship: generalization
}
```

### Aggregation

"Has-a" relationship where child can exist independently:

```runiq
diagram "Aggregation Example" {
  shape Department as @class label:"Department"
    attributes:[
      {name:"name" type:"string" visibility:private},
      {name:"employees" type:"List<Employee>" visibility:private}
    ]

  shape Employee as @class label:"Employee"
    attributes:[
      {name:"id" type:"int" visibility:private},
      {name:"name" type:"string" visibility:private}
    ]

  Department -> Employee relationship: aggregation multiplicityTarget:"1..*"
}
```

### Composition

Strong "owns-a" relationship where child cannot exist without parent:

```runiq
diagram "Composition Example" {
  shape House as @class label:"House"
    attributes:[
      {name:"address" type:"string" visibility:private},
      {name:"rooms" type:"List<Room>" visibility:private}
    ]

  shape Room as @class label:"Room"
    attributes:[
      {name:"name" type:"string" visibility:private},
      {name:"area" type:"double" visibility:private}
    ]

  House -> Room relationship: composition multiplicityTarget:"1..*"
}
```

### Interface Implementation

Classes implementing interfaces:

```runiq
diagram "Interface Example" {
  shape Drawable as @interface label:"<<interface>>\\nDrawable"
    methods:[
      {name:"draw" returnType:"void" visibility:public abstract:true}
    ]

  shape Circle as @class label:"Circle"
    attributes:[{name:"radius" type:"double" visibility:private}]
    methods:[{name:"draw" returnType:"void" visibility:public}]

  shape Rectangle as @class label:"Rectangle"
    attributes:[
      {name:"width" type:"double" visibility:private},
      {name:"height" type:"double" visibility:private}
    ]
    methods:[{name:"draw" returnType:"void" visibility:public}]

  Circle -> Drawable relationship: realization
  Rectangle -> Drawable relationship: realization
}
```

## Design Patterns

### Factory Pattern

```runiq
diagram "Factory Pattern" {
  shape ShapeFactory as @class label:"ShapeFactory"
    methods:[
      {name:"createShape" params:[{name:"type" type:"string"}] returnType:"Shape" visibility:public static:true}
    ]

  shape Shape as @interface label:"<<interface>>\\nShape"
    methods:[{name:"draw" returnType:"void" visibility:public abstract:true}]

  shape Circle as @class label:"Circle"
    methods:[{name:"draw" returnType:"void" visibility:public}]

  shape Square as @class label:"Square"
    methods:[{name:"draw" returnType:"void" visibility:public}]

  ShapeFactory -> Shape relationship: dependency lineStyle:"dashed" label:"creates"
  Circle -> Shape relationship: realization
  Square -> Shape relationship: realization
}
```

### Observer Pattern

```runiq
diagram "Observer Pattern" {
  shape Subject as @class label:"Subject"
    attributes:[{name:"observers" type:"List<Observer>" visibility:private}]
    methods:[
      {name:"attach" params:[{name:"o" type:"Observer"}] returnType:"void" visibility:public},
      {name:"detach" params:[{name:"o" type:"Observer"}] returnType:"void" visibility:public},
      {name:"notify" returnType:"void" visibility:public}
    ]

  shape Observer as @interface label:"<<interface>>\\nObserver"
    methods:[{name:"update" returnType:"void" visibility:public abstract:true}]

  shape ConcreteObserver as @class label:"ConcreteObserver"
    methods:[{name:"update" returnType:"void" visibility:public}]

  Subject -> Observer relationship: dependency multiplicityTarget:"*"
  ConcreteObserver -> Observer relationship: realization
}
```

## Domain Modeling

### E-Commerce Domain Model

Complete domain model with foreign key relationships:

```runiq
diagram "E-Commerce Domain Model" {
  direction TB

  shape Customer as @class label:"Customer"
    attributes:[
      {name:"id" type:"int" visibility:private},
      {name:"email" type:"string" visibility:private},
      {name:"name" type:"string" visibility:private}
    ]
    methods:[
      {name:"placeOrder" params:[{name:"cart" type:"ShoppingCart"}] returnType:"Order" visibility:public}
    ]

  shape Order as @class label:"Order"
    attributes:[
      {name:"id" type:"int" visibility:private},
      {name:"customerId" type:"int" visibility:private},
      {name:"orderDate" type:"Date" visibility:private},
      {name:"total" type:"decimal" visibility:private}
    ]
    methods:[
      {name:"calculateTotal" returnType:"decimal" visibility:public},
      {name:"addItem" params:[{name:"item" type:"OrderItem"}] returnType:"void" visibility:public}
    ]

  shape OrderItem as @class label:"OrderItem"
    attributes:[
      {name:"id" type:"int" visibility:private},
      {name:"orderId" type:"int" visibility:private},
      {name:"productId" type:"int" visibility:private},
      {name:"quantity" type:"int" visibility:private}
    ]

  shape Product as @class label:"Product"
    attributes:[
      {name:"id" type:"int" visibility:private},
      {name:"name" type:"string" visibility:private},
      {name:"price" type:"decimal" visibility:private}
    ]

  // Relationships
  Customer -> Order relationship: association multiplicityTarget:"1..*"
  Order -> OrderItem relationship: composition multiplicityTarget:"1..*"
  OrderItem -> Product relationship: aggregation
}
```

## Generic Types

```runiq
diagram "Generic Collections" {
  shape List as @class label:"List<T>"
    methods:[
      {name:"add" params:[{name:"item" type:"T"}] returnType:"void" visibility:public},
      {name:"get" params:[{name:"index" type:"int"}] returnType:"T" visibility:public},
      {name:"size" returnType:"int" visibility:public}
    ]

  shape ArrayList as @class label:"ArrayList<T>"
    attributes:[{name:"elements" type:"T[]" visibility:private}]
    methods:[
      {name:"add" params:[{name:"item" type:"T"}] returnType:"void" visibility:public},
      {name:"get" params:[{name:"index" type:"int"}] returnType:"T" visibility:public}
    ]

  shape LinkedList as @class label:"LinkedList<T>"
    attributes:[{name:"head" type:"Node<T>" visibility:private}]
    methods:[
      {name:"add" params:[{name:"item" type:"T"}] returnType:"void" visibility:public},
      {name:"get" params:[{name:"index" type:"int"}] returnType:"T" visibility:public}
    ]

  ArrayList -> List relationship: realization
  LinkedList -> List relationship: realization
}
```

## Member-Level Connections

Connect specific attributes for database foreign keys:

```runiq
diagram "Database Foreign Keys" {
  shape Order as @class label:"Order"
    attributes:[
      {name:"id" type:"int" visibility:private},
      {name:"customerId" type:"int" visibility:private}
    ]

  shape Customer as @class label:"Customer"
    attributes:[
      {name:"id" type:"int" visibility:private},
      {name:"name" type:"string" visibility:private}
    ]

  // Foreign key relationship
  Order.customerId -> Customer.id
}
```

## Best Practices

1. **Keep It Focused**: Show only relevant attributes and methods for the diagram's purpose
2. **Use Visibility Correctly**: Follow UML conventions for +, -, #, ~ symbols
3. **Name Relationships**: Add labels to edges when the relationship isn't obvious
4. **Show Multiplicities**: Use `1`, `*`, `0..1`, `1..*` to indicate cardinality
5. **Abstract Classes**: Use italics or add `{abstract}` constraint
6. **Static Members**: Underline static attributes and methods
7. **Direction Matters**: Use `direction TB` or `direction LR` for better layouts

## UML Relationship Types

| Relationship | Arrow Type | Meaning | Example |
|--------------|------------|---------|---------|
| Association | `->` | General relationship | Teacher teaches Student |
| Inheritance | `relationship: generalization` | "is-a" relationship | Dog is an Animal |
| Implementation | `relationship: realization` | Implements interface | Circle implements Shape |
| Aggregation | `relationship: aggregation` | "has-a" (weak) | Department has Employees |
| Composition | `relationship: composition` | "owns-a" (strong) | House owns Rooms |
| Dependency | `..>` | Uses/depends on | Controller uses Service |

## Next Steps

- See [Sequence Diagrams](/examples/sequence-diagrams) for interaction modeling
- Check [Use Case Diagrams](/examples/use-case) for system requirements
- Explore [State Machine Diagrams](/examples/state-machines) for behavior modeling
- Browse the [examples/class-diagrams](https://github.com/anthropics/runiq/tree/main/examples/class-diagrams) directory for more patterns
