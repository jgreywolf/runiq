---
title: ERD Diagrams
description: Create entity-relationship diagrams with Chen notation for database modeling including entities, relationships, attributes, and cardinality.
lastUpdated: 2025-01-09
---

# ERD Diagrams

Entity-Relationship Diagrams (ERD) are a visual representation of the data model for a database or information system. Runiq supports **Chen notation**, the classic ERD notation with rectangles for entities, diamonds for relationships, and ellipses for attributes.

## Quick Start

Here's a simple ERD showing two entities and their relationship:

```runiq
diagram "Simple ERD" {
  // Entities
  shape customer as @erdEntity label: "Customer"
  shape order as @erdEntity label: "Order"

  // Relationship
  shape places as @erdRelationship label: "places"

  // Connections
  customer -> places
  places -> order
}
```

## Core Concepts

### Entities

Entities represent real-world objects or concepts that have a distinct existence.

**Strong Entity:**

```runiq
diagram "Strong Entity" {
  shape student as @erdEntity label: "Student"
  shape course as @erdEntity label: "Course"
  shape instructor as @erdEntity label: "Instructor"
}
```

**Weak Entity:**
A weak entity depends on another entity for its existence. Rendered with a double border.

```runiq
diagram "Weak Entity Example" {
  shape order as @erdEntity label: "Order"
  shape orderItem as @erdWeakEntity label: "Order Item"
  shape contains as @erdRelationship label: "contains"

  order -> contains
  contains -> orderItem
}
```

### Relationships

Relationships connect entities and represent associations between them.

```runiq
diagram "Relationships" {
  shape employee as @erdEntity label: "Employee"
  shape department as @erdEntity label: "Department"
  shape project as @erdEntity label: "Project"

  shape worksIn as @erdRelationship label: "works in"
  shape manages as @erdRelationship label: "manages"
  shape worksOn as @erdRelationship label: "works on"

  employee -> worksIn -> department
  employee -> manages -> department
  employee -> worksOn -> project
}
```

### Attributes

Attributes describe properties of entities or relationships.

**Simple Attribute:**

```runiq
diagram "Entity with Attributes" {
  shape customer as @erdEntity label: "Customer"

  // Simple attributes
  shape name as @erdAttribute label: "name"
  shape email as @erdAttribute label: "email"
  shape address as @erdAttribute label: "address"

  customer -> name
  customer -> email
  customer -> address
}
```

**Key Attribute:**
Primary key attributes are underlined:

```runiq
diagram "Key Attributes" {
  shape student as @erdEntity label: "Student"

  shape studentId as @erdKeyAttribute label: "student_id"
  shape name as @erdAttribute label: "name"
  shape major as @erdAttribute label: "major"

  student -> studentId
  student -> name
  student -> major
}
```

**Multivalued Attribute:**
Attributes that can have multiple values (rendered as double ellipse):

```runiq
diagram "Multivalued Attributes" {
  shape personEntity as @erdEntity label: "Person"

  shape name as @erdAttribute label: "name"
  shape phoneNumbers as @erdMultivaluedAttribute label: "phone_numbers"
  shape emails as @erdMultivaluedAttribute label: "emails"

  personEntity -> name
  personEntity -> phoneNumbers
  personEntity -> emails
}
```

## Complete ERD Examples

### Example 1: University Database

```runiq
diagram "University Database" {
  direction TB

  // Entities
  shape student as @erdEntity label: "Student"
  shape course as @erdEntity label: "Course"
  shape instructor as @erdEntity label: "Instructor"
  shape department as @erdEntity label: "Department"

  // Key attributes
  shape studentId as @erdKeyAttribute label: "student_id"
  shape courseId as @erdKeyAttribute label: "course_id"
  shape instructorId as @erdKeyAttribute label: "instructor_id"
  shape deptId as @erdKeyAttribute label: "dept_id"

  // Student attributes
  shape studentName as @erdAttribute label: "name"
  shape gpa as @erdAttribute label: "gpa"

  // Course attributes
  shape courseTitle as @erdAttribute label: "title"
  shape credits as @erdAttribute label: "credits"

  // Instructor attributes
  shape instructorName as @erdAttribute label: "name"
  shape salary as @erdAttribute label: "salary"

  // Department attributes
  shape deptName as @erdAttribute label: "name"
  shape building as @erdAttribute label: "building"

  // Relationships
  shape enrolls as @erdRelationship label: "enrolls"
  shape teaches as @erdRelationship label: "teaches"
  shape belongs as @erdRelationship label: "belongs to"
  shape offers as @erdRelationship label: "offers"

  // Entity-Attribute connections
  student -> studentId
  student -> studentName
  student -> gpa

  course -> courseId
  course -> courseTitle
  course -> credits

  instructor -> instructorId
  instructor -> instructorName
  instructor -> salary

  department -> deptId
  department -> deptName
  department -> building

  // Entity-Relationship connections
  student -> enrolls -> course
  instructor -> teaches -> course
  instructor -> belongs -> department
  department -> offers -> course
}
```

### Example 2: E-Commerce System

```runiq
diagram "E-Commerce Database" {
  direction LR

  // Entities
  shape customer as @erdEntity label: "Customer"
  shape order as @erdEntity label: "Order"
  shape product as @erdEntity label: "Product"
  shape orderItem as @erdWeakEntity label: "Order Item"

  // Customer attributes
  shape customerId as @erdKeyAttribute label: "customer_id"
  shape customerName as @erdAttribute label: "name"
  shape email as @erdAttribute label: "email"
  shape phones as @erdMultivaluedAttribute label: "phone_numbers"

  // Order attributes
  shape orderId as @erdKeyAttribute label: "order_id"
  shape orderDate as @erdAttribute label: "order_date"
  shape total as @erdAttribute label: "total"

  // Product attributes
  shape productId as @erdKeyAttribute label: "product_id"
  shape productName as @erdAttribute label: "name"
  shape price as @erdAttribute label: "price"
  shape stock as @erdAttribute label: "stock"

  // OrderItem attributes
  shape quantity as @erdAttribute label: "quantity"
  shape subtotal as @erdAttribute label: "subtotal"

  // Relationships
  shape places as @erdRelationship label: "places"
  shape contains as @erdRelationship label: "contains"
  shape ordersProduct as @erdRelationship label: "orders"

  // Customer connections
  customer -> customerId
  customer -> customerName
  customer -> email
  customer -> phones

  // Order connections
  order -> orderId
  order -> orderDate
  order -> total

  // Product connections
  product -> productId
  product -> productName
  product -> price
  product -> stock

  // OrderItem connections
  orderItem -> quantity
  orderItem -> subtotal

  // Relationships
  customer -> places -> order
  order -> contains -> orderItem
  orderItem -> ordersProduct -> product
}
```

### Example 3: Hospital Management System

```runiq
diagram "Hospital Management" {
  direction TB

  // Entities
  shape patient as @erdEntity label: "Patient"
  shape doctor as @erdEntity label: "Doctor"
  shape appointment as @erdWeakEntity label: "Appointment"
  shape prescription as @erdWeakEntity label: "Prescription"

  // Patient attributes
  shape patientId as @erdKeyAttribute label: "patient_id"
  shape patientName as @erdAttribute label: "name"
  shape dob as @erdAttribute label: "date_of_birth"
  shape allergies as @erdMultivaluedAttribute label: "allergies"

  // Doctor attributes
  shape doctorId as @erdKeyAttribute label: "doctor_id"
  shape doctorName as @erdAttribute label: "name"
  shape specialization as @erdAttribute label: "specialization"

  // Appointment attributes
  shape apptDate as @erdAttribute label: "appointment_date"
  shape reason as @erdAttribute label: "reason"

  // Prescription attributes
  shape medication as @erdAttribute label: "medication"
  shape dosage as @erdAttribute label: "dosage"
  shape duration as @erdAttribute label: "duration"

  // Relationships
  shape schedules as @erdRelationship label: "schedules"
  shape hasAppointment as @erdRelationship label: "has"
  shape writes as @erdRelationship label: "writes"
  shape receives as @erdRelationship label: "receives"

  // Patient connections
  patient -> patientId
  patient -> patientName
  patient -> dob
  patient -> allergies

  // Doctor connections
  doctor -> doctorId
  doctor -> doctorName
  doctor -> specialization

  // Appointment connections
  appointment -> apptDate
  appointment -> reason

  // Prescription connections
  prescription -> medication
  prescription -> dosage
  prescription -> duration

  // Relationships
  patient -> schedules -> appointment
  doctor -> hasAppointment -> appointment
  doctor -> writes -> prescription
  patient -> receives -> prescription
}
```

## Cardinality and Participation

While Chen notation traditionally uses symbols on edges to show cardinality, in Runiq you can use edge labels to document cardinality constraints:

```runiq
diagram "Cardinality Example" {
  shape employee as @erdEntity label: "Employee"
  shape department as @erdEntity label: "Department"

  shape worksIn as @erdRelationship label: "works in"

  employee -> worksIn label: "1"
  worksIn -> department label: "1"
}
```

**Common cardinality notations:**

- `1` - Exactly one
- `0..1` - Zero or one
- `1..*` or `1..N` - One or many
- `0..*` or `*` - Zero or many

## Relationship Attributes

Relationships themselves can have attributes:

```runiq
diagram "Relationship Attributes" {
  shape student as @erdEntity label: "Student"
  shape course as @erdEntity label: "Course"

  shape enrolls as @erdRelationship label: "enrolls"

  // Relationship attribute
  shape grade as @erdAttribute label: "grade"
  shape enrollmentDate as @erdAttribute label: "enrollment_date"

  student -> enrolls -> course
  enrolls -> grade
  enrolls -> enrollmentDate
}
```

## Integration with UML Class Diagrams

For modern database modeling, you can also use UML Class Diagrams which offer more detail for implementation:

```runiq
diagram "Class Diagram ERD Alternative" {
  shape Customer as @class label: "Customer"
    attributes: [
      {name: "customerId" type: "int" visibility: private},
      {name: "name" type: "string" visibility: private},
      {name: "email" type: "string" visibility: private}
    ]

  shape Order as @class label: "Order"
    attributes: [
      {name: "orderId" type: "int" visibility: private},
      {name: "customerId" type: "int" visibility: private},
      {name: "orderDate" type: "Date" visibility: private},
      {name: "total" type: "decimal" visibility: private}
    ]

  // Show foreign key relationship
  Order.customerId -> Customer.customerId
}
```

## Best Practices

### 1. Entity Design

- **Use descriptive names**: "Customer" instead of "Cust"
- **Singular nouns**: "Employee" not "Employees"
- **Strong vs weak**: Use weak entities only when they depend on another entity
- **Limit entity count**: 5-10 entities per diagram for readability

### 2. Attribute Selection

- **Identify keys first**: Mark all primary keys with `@erdKeyAttribute`
- **Multivalued attributes**: Use `@erdMultivaluedAttribute` for arrays/collections
- **Atomic attributes**: Keep attributes simple (avoid composite attributes)
- **Consistent naming**: Use snake_case or camelCase consistently

### 3. Relationship Modeling

- **Verb phrases**: Name relationships with verbs ("enrolls", "manages", "owns")
- **Clear direction**: Order matters: "Student enrolls in Course"
- **Document cardinality**: Add edge labels to show 1:1, 1:N, N:M relationships
- **Minimize many-to-many**: Consider breaking into junction entities

### 4. Diagram Organization

- **Logical layout**: Group related entities together
- **Consistent direction**: Use `direction TB` or `direction LR` for flow
- **Avoid crossing lines**: Arrange entities to minimize edge crossings
- **White space**: Don't overcrowd the diagram

### 5. Documentation

- **Add comments**: Explain complex relationships or business rules
- **Version control**: Track schema evolution over time
- **Naming conventions**: Document your naming standards
- **Cardinality**: Always specify participation constraints

## Shape Reference

| Shape                 | Syntax                     | Chen Notation  | Description                    |
| --------------------- | -------------------------- | -------------- | ------------------------------ |
| Entity                | `@erdEntity`               | Rectangle      | Strong entity                  |
| Weak Entity           | `@erdWeakEntity`           | Double Rect    | Existence-dependent entity     |
| Relationship          | `@erdRelationship`         | Diamond        | Association between entities   |
| Attribute             | `@erdAttribute`            | Ellipse        | Simple attribute               |
| Key Attribute         | `@erdKeyAttribute`         | Underlined     | Primary key attribute          |
| Multivalued Attribute | `@erdMultivaluedAttribute` | Double Ellipse | Attribute with multiple values |

## Conceptual vs Logical vs Physical Models

### Conceptual (ERD - Chen Notation)

Use ERD shapes for **conceptual modeling**:

- High-level business entities
- Relationships without implementation details
- Attributes without data types
- Good for stakeholder communication

### Logical (UML Class Diagrams)

Use UML Class Diagrams for **logical modeling**:

- Detailed attributes with types
- Methods and behavior
- Foreign key relationships
- Closer to implementation

### Physical (Database Schema)

For physical database design, consider:

- Table names and column types
- Indexes and constraints
- Normalization (1NF, 2NF, 3NF, BCNF)
- Performance considerations

## Common ERD Patterns

### Pattern 1: One-to-Many

```runiq
diagram "One-to-Many Pattern" {
  shape department as @erdEntity label: "Department"
  shape employee as @erdEntity label: "Employee"

  shape employs as @erdRelationship label: "employs"

  department -> employs label: "1"
  employs -> employee label: "*"
}
```

### Pattern 2: Many-to-Many with Junction Entity

```runiq
diagram "Many-to-Many Pattern" {
  shape student as @erdEntity label: "Student"
  shape course as @erdEntity label: "Course"
  shape enrollment as @erdWeakEntity label: "Enrollment"

  shape enrolls as @erdRelationship label: "enrolls"
  shape offered as @erdRelationship label: "offered in"

  shape grade as @erdAttribute label: "grade"

  student -> enrolls -> enrollment
  enrollment -> offered -> course
  enrollment -> grade
}
```

### Pattern 3: Hierarchical (Supertype/Subtype)

```runiq
diagram "Inheritance Pattern" {
  shape personEntity as @erdEntity label: "Person"
  shape employee as @erdEntity label: "Employee"
  shape customer as @erdEntity label: "Customer"

  shape isA1 as @erdRelationship label: "is a"
  shape isA2 as @erdRelationship label: "is a"

  employee -> isA1 -> personEntity
  customer -> isA2 -> personEntity
}
```

### Pattern 4: Recursive Relationship

```runiq
diagram "Recursive Pattern" {
  shape employee as @erdEntity label: "Employee"

  shape manages as @erdRelationship label: "manages"

  shape empId as @erdKeyAttribute label: "emp_id"
  shape name as @erdAttribute label: "name"
  shape managerId as @erdAttribute label: "manager_id"

  employee -> empId
  employee -> name
  employee -> managerId

  // Self-referencing relationship
  employee -> manages label: "manager"
  manages -> employee label: "subordinate"
}
```

## Tips for Effective ERD Diagrams

1. **Start with major entities**: Identify the core business objects first
2. **Add relationships**: Connect entities with meaningful relationships
3. **Refine attributes**: Add key attributes, then supporting attributes
4. **Validate cardinality**: Ensure multiplicities match business rules
5. **Normalize design**: Apply normalization rules to reduce redundancy
6. **Review with stakeholders**: Validate against business requirements
7. **Iterate**: ERDs evolve - refine based on feedback
8. **Consider future needs**: Design for extensibility

## Converting ERD to Class Diagram

Chen notation ERDs are great for conceptual modeling, but for implementation, you can convert to UML Class Diagrams:

**ERD (Conceptual):**

```runiq
diagram "ERD Version" {
  shape customer as @erdEntity label: "Customer"
  shape customerId as @erdKeyAttribute label: "customer_id"
  shape name as @erdAttribute label: "name"

  customer -> customerId
  customer -> name
}
```

**Class Diagram (Logical/Physical):**

```runiq
diagram "Class Version" {
  shape Customer as @class label: "Customer"
    attributes: [
      {name: "customerId" type: "int" visibility: private},
      {name: "name" type: "string" visibility: private}
    ]
    methods: [
      {name: "getCustomerId" returnType: "int" visibility: public},
      {name: "getName" returnType: "string" visibility: public}
    ]
}
```

The class diagram adds:

- Data types for attributes
- Visibility modifiers (public/private)
- Methods/operations
- More precise relationships (composition, aggregation)

## Comparison with Other Tools

How do Runiq ERD diagrams compare to other database modeling tools?

| Feature                 | Runiq | Mermaid | PlantUML | Lucidchart | Draw.io | dbdiagram.io | MySQL Workbench |
| ----------------------- | ----- | ------- | -------- | ---------- | ------- | ------------ | --------------- |
| **Text-Based DSL**      | ✅    | ✅      | ✅       | ❌         | ❌      | ✅           | ❌              |
| **Chen Notation**       | ✅    | ❌      | ✅       | ✅         | ✅      | ❌           | ❌              |
| **Crow's Foot**         | ❌    | ✅      | ✅       | ✅         | ✅      | ✅           | ✅              |
| **Weak Entities**       | ✅    | ❌      | ✅       | ✅         | ✅      | ❌           | ❌              |
| **Multi-Attributes**    | ✅    | ❌      | ✅       | ✅         | ✅      | ❌           | ❌              |
| **Auto-Layout**         | ✅    | ✅      | ✅       | ❌         | ❌      | ✅           | ❌              |
| **Version Control**     | ✅    | ✅      | ✅       | ❌         | ❌      | ✅           | ❌              |
| **SQL Generation**      | ❌    | ❌      | ❌       | ❌         | ❌      | ✅           | ✅              |
| **Reverse Engineering** | ❌    | ❌      | ❌       | ❌         | ❌      | ❌           | ✅              |
| **Integrated w/ UML**   | ✅    | ✅      | ✅       | ✅         | ❌      | ❌           | ❌              |
| **Free/Open Source**    | ✅    | ✅      | ✅       | ❌         | ✅      | ✅           | ✅              |
| **Learning Curve**      | Low   | Low     | Med      | Med        | Low     | Low          | Med             |

**Why choose Runiq for ERD?**

- **Classic Chen notation** - Academic and conceptual modeling standard
- **Version control friendly** - Text-based format works with Git
- **Unified language** - Mix ERD with class diagrams, sequence diagrams, etc.
- **Auto-layout** - No manual positioning of entities
- **Documentation as code** - Keep data models with your application code
- **Quick iteration** - Rapidly refine your data model
- **Educational** - Excellent for teaching database design concepts

## Next Steps

- Explore **[UML Class Diagrams](/guide/class-diagrams)** for detailed implementation models
- Review **[Shape Reference](/reference/shapes#erd-shapes)** for all ERD shapes
- See **[Database Examples](/examples/)** for more ERD patterns
- Learn about **[Data-Driven Diagrams](/reference/data-driven)** for generating ERDs from CSV/JSON

## Further Reading

- **Chen Notation**: The original ERD notation by Peter Chen (1976)
- **Database Normalization**: 1NF, 2NF, 3NF, BCNF principles
- **UML vs ERD**: When to use each notation
- **ERD Tools**: Comparison of ERD modeling approaches
