---
title: Architecture Diagrams
description: Build layered block and subsystem architecture diagrams using the diagram profile with architecture containers and block connectors.
lastUpdated: 2026-04-04
---

# Architecture Diagrams

Runiq supports block and layered architecture diagrams directly in the
`diagram` profile using specialized container and block shapes.

## Overview

This notation is useful for:

- operating system architecture
- platform and subsystem diagrams
- layered enterprise architecture
- embedded system structure
- hardware/software boundary views

## Key Shapes

- `@architectureLayer` - layered container band with a title header
- `@subsystemBlock` - subsystem or service block
- `@platformBlock` - platform/service area block
- `@externalSystemBlock` - external or hardware block

## Block Connectors

Architecture diagrams often read better with broader block arrows instead of
thin generic edges.

Use:

```runiq
lineStyle:"block"
```

on an edge to render a thick block-style connector.

## Basic Example

```runiq
diagram "Layered Architecture" {
  direction TB

  container userMode "User mode" as @architectureLayer {
    shape workstation as @subsystemBlock label:"Workstation service"
    shape security as @subsystemBlock label:"Security"
  }

  container executive "Executive" as @architectureLayer {
    shape io as @platformBlock label:"I/O Manager"
    shape ipc as @platformBlock label:"IPC Manager"
    shape memory as @platformBlock label:"Virtual Memory Manager"
  }

  container kernel "Kernel mode" as @architectureLayer {
    shape drivers as @platformBlock label:"Kernel mode drivers"
    shape micro as @platformBlock label:"Microkernel"
    shape hal as @platformBlock label:"Hardware Abstraction Layer"
  }

  shape hardware as @externalSystemBlock label:"Hardware"

  workstation -> io lineStyle:"block"
  security -> ipc lineStyle:"block"
  memory -> hal lineStyle:"block"
  hal -> hardware lineStyle:"block"
}
```

## Nested Subsystems

```runiq
diagram "Platform Services" {
  direction TB

  container appLayer "Application Layer" as @architectureLayer {
    shape ui as @subsystemBlock label:"UI Shell"
    shape auth as @subsystemBlock label:"Auth Service"
  }

  container platformLayer "Platform Services" as @architectureLayer {
    shape identity as @platformBlock label:"Identity"
    shape search as @platformBlock label:"Search"
    shape billing as @platformBlock label:"Billing"
  }

  container dataLayer "Data Layer" as @architectureLayer {
    shape postgres as @platformBlock label:"PostgreSQL"
    shape cache as @platformBlock label:"Redis Cache"
  }

  ui -> auth lineStyle:"block"
  auth -> identity lineStyle:"block"
  auth -> billing lineStyle:"block"
  billing -> postgres lineStyle:"block"
  search -> cache lineStyle:"block"
}
```

## Styling

```runiq
diagram "Styled Architecture" {
  direction TB

  container presentation "Presentation" as @architectureLayer
    fillColor:"#dbeafe"
    strokeColor:"#2563eb" {
    shape web as @subsystemBlock label:"Web UI"
  }

  container services "Services" as @architectureLayer
    fillColor:"#ede9fe"
    strokeColor:"#7c3aed" {
    shape api as @platformBlock label:"API"
  }

  shape hardware as @externalSystemBlock
    label:"Edge Device"
    fillColor:"#92400e"
    strokeColor:"#78350f"

  web -> api lineStyle:"block"
  api -> hardware lineStyle:"block"
}
```

## Best Practices

1. Use one container per major layer.
2. Keep subsystem blocks short and readable.
3. Use `lineStyle:"block"` for primary architecture relationships.
4. Reserve `@externalSystemBlock` for boundaries outside the platform.
5. Prefer nested containers only when the hierarchy matters semantically.

## Comparison with Other Tools

| Feature                      | Runiq      | Mermaid    | PlantUML   | Structurizr | Draw.io    |
| ---------------------------- | ---------- | ---------- | ---------- | ----------- | ---------- |
| **Text-based DSL**           | ✅         | ✅         | ✅         | ✅          | ❌         |
| **Layered containers**       | ✅         | ⚠️ Limited | ✅         | ✅          | ✅         |
| **Block-style connectors**   | ✅         | ❌         | ⚠️ Limited | ⚠️ Limited  | ✅         |
| **Version control friendly** | ✅         | ✅         | ✅         | ✅          | ⚠️ Partial |
| **Mixed architecture depth** | ✅         | ⚠️ Basic   | ✅         | ✅          | ✅         |

**Key Advantages of Runiq**

- direct layered-container syntax without leaving the core `diagram` profile
- block-style architecture connectors for clearer system diagrams
- easy mixing with cloud, network, C4, and UML shapes when needed

**When to Use Alternatives**

- **Structurizr** when you want a dedicated C4 workspace workflow
- **Draw.io** when manual pixel-level placement matters more than DSL reuse
- **PlantUML** if your organization already standardizes on PlantUML notation

## Related

- [Containers](/guide/containers)
- [C4 Architecture](/guide/c4-architecture)
- [Network Diagrams](/guide/network-diagrams)
- [AWS Diagrams](/guide/aws-diagrams)
