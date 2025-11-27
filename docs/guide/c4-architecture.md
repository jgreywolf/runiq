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

  shape customer as @c4Person label:"Customer"

  container web "Web Container" fillColor:"#e3f2fd" strokeColor:"#1976d2" borderWidth:2 {
    shape webapp as @c4Container label:"Single-Page App
[JavaScript, React]"
    shape api as @c4Container label:"API Application
[Java, Spring Boot]"
    shape db as @c4Container label:"Database
[Oracle]"
  }

  shape emailSystem as @c4System label:"Email System"

  customer -> webapp label:"Uses [HTTPS]"
  webapp -> api label:"API calls [JSON/HTTPS]"
  api -> db label:"Reads/Writes [SQL/TCP]"
  api -> emailSystem label:"Sends emails [SMTP]"
}
```

## Level 3: Component Diagram

Shows components within a container and their interactions.

```runiq
diagram "API Application - Components" {
  direction TB

  shape webapp as @c4Container label:"Web Application"

  container apiContainer "API Container" fillColor:"#e3f2fd" strokeColor:"#1976d2" borderWidth:2 {
    shape controller as @c4Component label:"REST Controller"
    shape security as @c4Component label:"Security Component"
    shape emailComponent as @c4Component label:"Email Component"
    shape accountComponent as @c4Component label:"Account Component"
  }

  shape db as @c4Container label:"Database"

  webapp -> controller label:"Makes API calls"
  controller -> security label:"Uses"
  controller -> emailComponent label:"Uses"
  controller -> accountComponent label:"Uses"
  accountComponent -> db label:"Reads/Writes"
}
```

## Microservices Architecture

```runiq
diagram "E-Commerce Platform" {
  direction LR

  shape customer as @c4Person label:"Customer"
  shape admin as @c4Person label:"Admin"

  container frontend "Frontend" fillColor:"#fce4ec" strokeColor:"#c2185b" borderWidth:2 {
    shape web as @c4Container label:"Web UI
[React]"
    shape mobile as @c4Container label:"Mobile App
[Flutter]"
  }

  container backend "Backend Services" fillColor:"#e3f2fd" strokeColor:"#1976d2" borderWidth:2 {
    shape gateway as @c4Container label:"API Gateway
[Node.js]"
    shape auth as @c4Container label:"Auth Service
[Java]"
    shape catalog as @c4Container label:"Catalog Service
[Python]"
    shape orders as @c4Container label:"Orders Service
[Go]"
  }

  container data "Data Layer" fillColor:"#f3e5f5" strokeColor:"#7b1fa2" borderWidth:2 {
    shape userDb as @c4Container label:"User DB
[PostgreSQL]"
    shape catalogDb as @c4Container label:"Catalog DB
[MongoDB]"
    shape cache as @c4Container label:"Cache
[Redis]"
  }

  customer -> web label:"Uses"
  customer -> mobile label:"Uses"
  admin -> web label:"Manages"

  web -> gateway label:"API Calls"
  mobile -> gateway label:"API Calls"

  gateway -> auth label:"Authenticates"
  gateway -> catalog label:"Fetches Products"
  gateway -> orders label:"Places Orders"

  auth -> userDb label:"Reads/Writes"
  catalog -> catalogDb label:"Reads"
  orders -> cache label:"Writes"
}
```

## Cloud Infrastructure

```runiq
diagram "AWS Deployment" {
  direction TB

  shape users as @c4Person label: "Users\n\n[People]"

  container aws "AWS Cloud" {
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

  shape personShape as @c4Person label: "User" fill: "#08427b" color: "#ffffff"
  shape internalSystem as @c4System label: "Internal System" fill: "#1168bd" color: "#ffffff"
  shape externalSystem as @c4System label: "External System" fill: "#999999" color: "#ffffff"
  shape containerShape as @c4Container label: "Container" fill: "#438dd5" color: "#ffffff"

  personShape -> internalSystem strokeColor: "#707070" strokeWidth: 2
  internalSystem -> externalSystem strokeColor: "#707070" lineStyle: "dashed"
}
```

**Standard C4 Colors:**

- Person: `#08427b` (dark blue)
- Internal System: `#1168bd` (blue)
- External System: `#999999` (gray)
- Container: `#438dd5` (light blue)
- Component: `#85bbf0` (lighter blue)

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

## Best Practices

1. **Use consistent notation** - Follow C4 model conventions for shape types
2. **Add context** - Include technology choices in brackets [Container: Node.js]
3. **Show protocols** - Label edges with communication protocols [HTTPS], [SQL]
4. **Layer abstractions** - Create separate diagrams for each level
5. **Use containers** - Group related elements with systemBoundary
6. **Color code** - Internal (blue) vs external (gray) systems
7. **Keep it simple** - Each diagram should fit on one page
8. **Add descriptions** - Brief explanation of each element's responsibility

## Comparison with Other Tools

| Feature                      | Runiq                      | Mermaid        | PlantUML       | Lucidchart         | Draw.io       | Structurizr     |
| ---------------------------- | -------------------------- | -------------- | -------------- | ------------------ | ------------- | --------------- |
| **Text-Based DSL**           | ✅                         | ⚠️ C4 plugin   | ✅ C4-PlantUML | ❌ No (GUI)        | ❌ No (GUI)   | ✅              |
| **Version Control Friendly** | ✅                         | ✅             | ✅             | ⚠️ Limited         | ⚠️ Limited    | ✅              |
| **C4 Model Support**         | ✅ Native shapes           | ✅             | ✅             | ⚠️ Manual shapes   | ⚠️ Manual     | ✅              |
| **All 4 Levels**             | ✅ Context to Code         | ⚠️ Limited     | ✅             | ✅ Manual          | ✅ Manual     | ✅              |
| **Person Shape**             | ✅ `@c4Person`             | ⚠️ Basic       | ✅             | ⚠️ Manual styling  | ⚠️ Manual     | ✅              |
| **System Boundaries**        | ✅ Via containers          | ⚠️             | ✅             | ✅ Manual          | ✅ Manual     | ✅              |
| **Technology Labels**        | ✅ `[Tech Stack]` notation | ⚠️ Manual text | ✅             | ✅ Manual          | ✅ Manual     | ✅              |
| **Relationship Labels**      | ✅ Protocol/description    | ✅             | ✅             | ✅                 | ✅            | ✅              |
| **Color Coding**             | ✅ Internal/external       | ⚠️ Manual      | ✅ Auto        | ✅ Manual          | ✅ Manual     | ✅ Auto         |
| **Unified with UML**         | ✅ Same DSL as class/seq   | ❌ Separate    | ✅ Same syntax | ❌ Different tools | ❌ Different  | ❌ C4-only      |
| **Auto-Layout**              | ✅ ELK (Hierarchical)      | ✅ Dagre       | ✅ GraphViz    | ⚠️ Manual          | ⚠️ Manual     | ✅ GraphViz     |
| **Export Formats**           | ✅ SVG, PNG, PDF           | ✅ SVG, PNG    | ✅ PNG, SVG    | ✅ Many formats    | ✅ Many       | ✅ Many         |
| **Collaboration**            | ✅ Git-based               | ✅ Git-based   | ✅ Git-based   | ✅ Cloud (Paid)    | ✅ Cloud      | ✅ Cloud (Paid) |
| **Learning Curve**           | ⚠️ Moderate (DSL)          | ✅ Low         | ⚠️ Moderate    | ✅ Low (GUI)       | ✅ Low        | ⚠️ Moderate     |
| **Open Source**              | ✅ MIT License             | ✅ MIT         | ✅ Apache 2.0  | ❌ Commercial only | ✅ Apache 2.0 | ⚠️ Freemium     |

**Runiq Advantages:**

- **C4 native shapes** - Dedicated `@c4Person`, `@c4System`, `@c4Container`, `@c4Component`
- **Unified language** - Use same DSL for C4, UML, flowcharts, BPMN, and 15+ diagram types
- **Technology annotations** - Built-in support for `[Technology Stack]` labels
- **System boundaries** - Use containers with custom styling
- **Color coding** - Automatic or manual differentiation of internal/external systems
- **Version control native** - Perfect for architecture documentation in repositories
- **ELK layout engine** - Superior hierarchical layouts for context and container diagrams
- **Profile system** - Consistent with other diagram types

**Use Structurizr when:**

- You need the official C4 tooling with Simon Brown's endorsement
- Workspace management for large enterprise architectures
- ADR (Architecture Decision Records) integration
- Multiple related diagrams with shared model

## Related

- [Shape Reference - C4 Shapes](/reference/shapes#_12-c4-architecture-shapes-4-shapes)
- [Containers](/guide/containers)
- [Network Diagrams](/guide/network-diagrams)
- [AWS Diagrams](/guide/aws-diagrams)

## Resources

- [C4 Model Official Site](https://c4model.com/)
- [Structurizr](https://structurizr.com/) - C4 model tooling by Simon Brown
