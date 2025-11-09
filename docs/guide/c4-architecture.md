---
title: C4 Architecture
---

---
title: C4 Architecture Diagrams
description: Create C4 model architecture diagrams showing system context, containers, components, and code with automatic hierarchy.
lastUpdated: 2025-01-09
---

# C4 Architecture Diagrams

Create C4 model architecture diagrams to visualize software systems at different levels of abstraction with Runiq's diagram profile.

## Overview

The C4 model provides a hierarchical approach to documenting software architecture through four levels:

1. **Context** - System and its users/dependencies
2. **Container** - High-level technology choices (apps, databases, etc.)
3. **Component** - Components within containers
4. **Code** - Class diagrams (use UML class diagrams)

## Key Shapes

- **C4 Person**: `@c4Person` - Users or actors
- **C4 System**: `@c4System` - Software systems
- **C4 Container**: `@c4Container` - Applications, databases, services
- **C4 Component**: `@c4Component` - Components within containers

See the [Shape Reference - C4 Shapes](/reference/shapes#_12-c4-architecture-shapes-4-shapes) for the complete list.

## Level 1: System Context

Shows the system under development and its relationships with users and other systems.

```runiq
diagram "Banking System - Context" {
  direction TB

  shape customer as @c4Person label: "Personal Banking\nCustomer\n\n[Person]\n\nA customer of the bank"
  shape system as @c4System label: "Internet Banking\nSystem\n\n[Software System]\n\nProvides banking services"
  shape email as @c4System label: "Email System\n\n[Software System]\n\nSends emails to customers"
  shape mainframe as @c4System label: "Mainframe Banking\nSystem\n\n[Software System]\n\nStores account data"

  customer -> system label: "Uses"
  system -> email label: "Sends email using"
  system -> mainframe label: "Gets account\ndata from"
}
```

## Level 2: Container Diagram

Shows the high-level technology choices and how containers communicate.

```runiq
diagram "Banking System - Containers" {
  direction TB

  shape customer as @c4Person label: "Customer\n\n[Person]"

  container banking as @systemBoundary label: "Internet Banking System" {
    shape web as @c4Container label: "Web Application\n\n[Container: React]\n\nDelivers static content"
    shape api as @c4Container label: "API Application\n\n[Container: Node.js]\n\nProvides banking API"
    shape db as @c4Container label: "Database\n\n[Container: PostgreSQL]\n\nStores user data"
  }

  shape email as @c4System label: "Email System\n\n[Software System]"
  shape mainframe as @c4System label: "Mainframe\n\n[Software System]"

  customer -> web label: "Uses\n[HTTPS]"
  web -> api label: "Makes API calls\n[JSON/HTTPS]"
  api -> db label: "Reads/Writes\n[SQL/TCP]"
  api -> email label: "Sends email\n[SMTP]"
  api -> mainframe label: "Uses\n[XML/HTTPS]"
}
```

## Level 3: Component Diagram

Shows components within a container and their interactions.

```runiq
diagram "API Application - Components" {
  direction TB

  shape web as @c4Container label: "Web Application\n\n[Container]"

  container api as @systemBoundary label: "API Application" {
    shape controller as @c4Component label: "Sign In Controller\n\n[Component: Express Controller]\n\nHandles authentication"
    shape security as @c4Component label: "Security Component\n\n[Component: Security Module]\n\nProvides auth logic"
    shape accountService as @c4Component label: "Account Service\n\n[Component: Service]\n\nBusiness logic"
    shape repository as @c4Component label: "Account Repository\n\n[Component: Repository]\n\nData access"
  }

  shape db as @c4Container label: "Database\n\n[Container]"
  shape mainframe as @c4System label: "Mainframe\n\n[System]"

  web -> controller label: "Makes API calls\n[JSON/HTTPS]"
  controller -> security label: "Uses"
  controller -> accountService label: "Uses"
  accountService -> repository label: "Uses"
  repository -> db label: "Reads/Writes\n[SQL/TCP]"
  accountService -> mainframe label: "Makes API calls\n[XML/HTTPS]"
}
```

## Microservices Architecture

```runiq
diagram "Microservices - Containers" {
  direction TB

  shape user as @c4Person label: "User\n\n[Person]"
  shape admin as @c4Person label: "Administrator\n\n[Person]"

  container system as @systemBoundary label: "E-commerce Platform" {
    shape gateway as @c4Container label: "API Gateway\n\n[Container: Kong]\n\nRoutes requests"
    shape auth as @c4Container label: "Auth Service\n\n[Container: Node.js]\n\nHandles authentication"
    shape catalog as @c4Container label: "Product Catalog\n\n[Container: Java/Spring]\n\nManages products"
    shape orders as @c4Container label: "Order Service\n\n[Container: Python/Flask]\n\nProcesses orders"
    shape payments as @c4Container label: "Payment Service\n\n[Container: Node.js]\n\nHandles payments"
    shape redis as @c4Container label: "Cache\n\n[Container: Redis]\n\nSession storage"
    shape postgres as @c4Container label: "Database\n\n[Container: PostgreSQL]\n\nPersistent storage"
  }

  shape stripe as @c4System label: "Stripe\n\n[External System]\n\nPayment processing"

  user -> gateway label: "Uses [HTTPS]"
  admin -> gateway label: "Manages [HTTPS]"
  gateway -> auth label: "Authenticates [HTTP]"
  gateway -> catalog label: "Queries [HTTP]"
  gateway -> orders label: "Creates [HTTP]"
  auth -> redis label: "Stores sessions"
  catalog -> postgres label: "Reads/Writes [SQL]"
  orders -> postgres label: "Reads/Writes [SQL]"
  orders -> payments label: "Requests payment [HTTP]"
  payments -> stripe label: "Processes [HTTPS]"
}
```

## Cloud Infrastructure

```runiq
diagram "AWS Deployment" {
  direction TB

  shape users as @c4Person label: "Users\n\n[People]"

  container aws as @systemBoundary label: "AWS Cloud" {
    shape cloudfront as @c4Container label: "CloudFront\n\n[AWS Service]\n\nCDN"
    shape alb as @c4Container label: "Application Load\nBalancer\n\n[AWS Service]\n\nLoad balancing"
    shape web as @c4Container label: "Web Tier\n\n[EC2/ECS]\n\nWeb servers"
    shape api as @c4Container label: "API Tier\n\n[EC2/ECS]\n\nApplication servers"
    shape rds as @c4Container label: "Database\n\n[RDS PostgreSQL]\n\nRelational data"
    shape s3 as @c4Container label: "Object Storage\n\n[S3]\n\nStatic assets"
    shape elasticache as @c4Container label: "Cache\n\n[ElastiCache]\n\nRedis cluster"
  }

  users -> cloudfront label: "Access [HTTPS]"
  cloudfront -> alb label: "Routes to [HTTPS]"
  cloudfront -> s3 label: "Serves from"
  alb -> web label: "Distributes to"
  web -> api label: "Calls [HTTP]"
  api -> rds label: "Queries [SQL]"
  api -> elasticache label: "Caches in"
  api -> s3 label: "Stores files in"
}
```

## Styling

Apply C4 model color conventions:

```runiq
diagram "Styled C4 Diagram" {
  direction LR

  shape person as @c4Person label: "User" fill: "#08427b" color: "#ffffff"
  shape internalSystem as @c4System label: "Internal System" fill: "#1168bd" color: "#ffffff"
  shape externalSystem as @c4System label: "External System" fill: "#999999" color: "#ffffff"
  shape container as @c4Container label: "Container" fill: "#438dd5" color: "#ffffff"

  person -> internalSystem style: { stroke: "#707070", strokeWidth: 2 }
  internalSystem -> externalSystem style: { stroke: "#707070", strokeDasharray: "5,5" }
}
```

**Standard C4 Colors:**

- Person: `#08427b` (dark blue)
- Internal System: `#1168bd` (blue)
- External System: `#999999` (gray)
- Container: `#438dd5` (light blue)
- Component: `#85bbf0` (lighter blue)

## Best Practices

1. **Use consistent notation** - Follow C4 model conventions for shape types
2. **Add context** - Include technology choices in brackets [Container: Node.js]
3. **Show protocols** - Label edges with communication protocols [HTTPS], [SQL]
4. **Layer abstractions** - Create separate diagrams for each level
5. **Use containers** - Group related elements with systemBoundary
6. **Color code** - Internal (blue) vs external (gray) systems
7. **Keep it simple** - Each diagram should fit on one page
8. **Add descriptions** - Brief explanation of each element's responsibility

## Diagram Levels

### When to use each level:

**Context (Level 1)**:

- Stakeholder presentations
- High-level system overview
- External dependencies

**Container (Level 2)**:

- Technical architecture overview
- Technology stack decisions
- Deployment planning

**Component (Level 3)**:

- Detailed design discussions
- Developer onboarding
- Component responsibilities

**Code (Level 4)**:

- Use UML class diagrams instead
- Implementation details
- Code-level documentation

## Examples

See the [examples/c4-architecture](https://github.com/jgreywolf/runiq/tree/main/examples/c4-architecture) directory for complete examples:

- System context diagram
- Container diagram
- Component diagram
- Microservices architecture

## Related

- [Shape Reference - C4 Shapes](/reference/shapes#_12-c4-architecture-shapes-4-shapes)
- [Containers](/guide/containers)
- [Network Diagrams](/guide/network-diagrams)
- [AWS Diagrams](/guide/aws-diagrams)

## Resources

- [C4 Model Official Site](https://c4model.com/)
- [Structurizr](https://structurizr.com/) - C4 model tooling by Simon Brown
