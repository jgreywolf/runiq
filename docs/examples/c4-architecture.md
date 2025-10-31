# C4 Model Diagrams in Runiq

Runiq supports the **C4 model** for visualizing software architecture, created by Simon Brown. The C4 model provides a hierarchical way to describe software systems at different levels of abstraction.

> **Learn more**: [c4model.com](https://c4model.com/)

## Overview

The C4 model consists of 4 levels:

1. **System Context** - How your system fits in the world
2. **Container** - High-level technology choices
3. **Component** - Components within a container
4. **Code** - Class diagrams (use UML)

## C4 Shapes

Runiq provides 4 specialized C4 shapes with proper C4 color palette:

### `@c4-person`

Represents a human user - actor, role, or persona.

```runiq
shape customer as @c4-person label:"Customer"
```

**Styling**: Dark blue (`#08427B`) with white text and stick figure icon

### `@c4-system`

Represents a high-level software system.

```runiq
shape banking as @c4-system label:"Internet Banking\\nSystem"
```

**Styling**: Medium blue (`#1168BD`) with white text

### `@c4-container`

Represents an application or data store (web app, API, database, mobile app, etc.).

```runiq
shape webapp as @c4-container label:"Web Application\\n[JavaScript, React]"
```

**Styling**: Light blue (`#438DD5`) with white text  
**Multi-line labels**: Use `\\n` to separate title and technology

### `@c4-component`

Represents a grouping of related functionality (code module, service, etc.).

```runiq
shape controller as @c4-component label:"REST Controller"
```

**Styling**: Lightest blue (`#85BBF0`) with dark text

## Examples

### Level 1: System Context

Shows your system and how it fits in the world with external actors and systems.

```runiq
diagram "Banking System - Context"
direction TB

shape customer as @c4-person label:"Customer"
shape bankingSystem as @c4-system label:"Internet Banking\\nSystem"
shape emailSystem as @c4-system label:"Email System"
shape mainframe as @c4-system label:"Mainframe\\nBanking System"

customer -Uses-> bankingSystem
bankingSystem -Sends emails-> emailSystem
bankingSystem -Uses-> mainframe
```

### Generated SVG

![C4 System Context](/examples/c4-system-context.svg)

### Level 2: Container Diagram

Shows the high-level technology choices and how containers communicate.

```runiq
diagram "Banking System - Containers"
direction TB

shape customer as @c4-person label:"Customer"

container web "Web Container" backgroundColor:"#e3f2fd" borderColor:"#1976d2" borderWidth:2 {
  shape webapp as @c4-container label:"Single-Page App\\n[JavaScript, React]"
  shape api as @c4-container label:"API Application\\n[Java, Spring Boot]"
  shape db as @c4-container label:"Database\\n[Oracle]"
}

shape emailSystem as @c4-system label:"Email System"

customer -Uses [HTTPS]-> webapp
webapp -API calls [JSON/HTTPS]-> api
api -Reads/Writes [SQL/TCP]-> db
api -Sends emails [SMTP]-> emailSystem
```

### Generated SVG

![C4 Container Diagram](/examples/c4-container.svg)

### Level 3: Component Diagram

Shows components within a container.

```runiq
diagram "API Application - Components"
direction TB

shape webapp as @c4-container label:"Web Application"

container apiContainer "API Container" backgroundColor:"#e3f2fd" borderColor:"#1976d2" borderWidth:2 {
  shape controller as @c4-component label:"REST Controller"
  shape security as @c4-component label:"Security Component"
  shape emailComponent as @c4-component label:"Email Component"
  shape accountComponent as @c4-component label:"Account Component"
}

shape db as @c4-container label:"Database"

webapp -Makes API calls-> controller
controller -Uses-> security
controller -Uses-> emailComponent
controller -Uses-> accountComponent
accountComponent -Reads/Writes-> db
```

### Generated SVG

![C4 Component Diagram](/examples/c4-component.svg)

### Microservices Architecture

Practical example showing multiple containers organized by layer.

```runiq
diagram "E-Commerce Platform"
direction LR

shape customer as @c4-person label:"Customer"
shape admin as @c4-person label:"Admin"

container frontend "Frontend" backgroundColor:"#fce4ec" borderColor:"#c2185b" borderWidth:2 {
  shape web as @c4-container label:"Web UI\\n[React]"
  shape mobile as @c4-container label:"Mobile App\\n[Flutter]"
}

container backend "Backend Services" backgroundColor:"#e3f2fd" borderColor:"#1976d2" borderWidth:2 {
  shape gateway as @c4-container label:"API Gateway\\n[Node.js]"
  shape auth as @c4-container label:"Auth Service\\n[Java]"
  shape catalog as @c4-container label:"Catalog Service\\n[Python]"
  shape orders as @c4-container label:"Orders Service\\n[Go]"
}

container data "Data Layer" backgroundColor:"#f3e5f5" borderColor:"#7b1fa2" borderWidth:2 {
  shape userDb as @c4-container label:"User DB\\n[PostgreSQL]"
  shape catalogDb as @c4-container label:"Catalog DB\\n[MongoDB]"
  shape cache as @c4-container label:"Cache\\n[Redis]"
}

customer -Uses-> web
customer -Uses-> mobile
admin -Manages-> web

web -API Calls-> gateway
mobile -API Calls-> gateway

gateway -Authenticates-> auth
gateway -Fetches Products-> catalog
gateway -Places Orders-> orders

auth -Reads/Writes-> userDb
catalog -Reads-> catalogDb
orders -Writes-> cache
```

### Generated SVG

![C4 Microservices](/examples/c4-microservices.svg)

## Technology Labels

Add technology/protocol information to relationship arrows using label syntax:

```runiq
webapp -API calls [JSON/HTTPS]-> api
api -Reads/Writes [SQL/TCP]-> db
service -Sends emails [SMTP]-> emailSystem
```

The text in the arrow label describes the interaction and can include technical details.

## Containers

C4 diagrams use Runiq's container feature to group related elements:

```runiq
container name "Label" backgroundColor:"#color" borderColor:"#color" borderWidth:2 {
  shape element1 as @c4-container label:"Element 1"
  shape element2 as @c4-container label:"Element 2"
}
```

**Note**: Currently, containers use a **flat hierarchy** (multiple containers at the same level). Deep nesting (container within container) is a known limitation being addressed.

## Color Palette

Use the official C4 color scheme for consistency:

- **Person**: `#08427B` (dark blue)
- **Software System**: `#1168BD` (medium blue)
- **Container**: `#438DD5` (light blue)
- **Component**: `#85BBF0` (lightest blue)
- **External System**: `#999999` (gray)

For container boxes, use lighter complementary colors:

- Light blue: `backgroundColor:"#e3f2fd" borderColor:"#1976d2"`
- Light pink: `backgroundColor:"#fce4ec" borderColor:"#c2185b"`
- Light purple: `backgroundColor:"#f3e5f5" borderColor:"#7b1fa2"`
- Light yellow: `backgroundColor:"#fff8e1" borderColor:"#f57f17"`
- Light green: `backgroundColor:"#e8f5e9" borderColor:"#388e3c"`

## Best Practices

1. **Start with Context** - Begin with a System Context diagram showing your system and its environment
2. **One Container per Technology** - Each container should represent a single deployable/runnable unit
3. **Use Descriptive Labels** - Include technology stack in square brackets: `[JavaScript, React]`
4. **Technology on Arrows** - Add protocols/formats to relationship labels: `[HTTPS]`, `[SQL]`
5. **Layer Your Containers** - Group containers by architectural layer (frontend, backend, data)
6. **Consistent Colors** - Use the C4 color palette for professional-looking diagrams
7. **Direction Matters** - Use `direction TB` for vertical layouts, `direction LR` for horizontal

## Known Limitations

- **Nested Containers**: Deep container nesting (container within container) doesn't position correctly yet. Use flat hierarchies with multiple containers at the same level as a workaround.
- **Component Nesting**: Component diagrams should show components within ONE container, not multiple nested levels.

These limitations are being addressed - see the roadmap for updates.

## References

- Official C4 Model: https://c4model.com/
- C4 Model Book: https://leanpub.com/visualising-software-architecture
- Examples: Load the C4 samples from the Sample Diagrams tab in Runiq

## Quick Start

1. Open Runiq editor
2. Click "Sample Diagrams" tab
3. Select "C4 Architecture"
4. Choose a starting template:
   - System Context (Level 1)
   - Container Diagram (Level 2)
   - Component Diagram (Level 3)
   - Microservices Architecture (practical example)
5. Modify for your architecture!

---

**Next Steps:**

- [Container Guide](./containers.md) - Learn more about containers
- [Shape Reference](../reference/shapes.md) - All available shapes
- [UML Diagrams](./uml.md) - For Level 4 (Code) diagrams
