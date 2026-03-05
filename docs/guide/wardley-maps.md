---
title: Wardley Maps
description: Create strategic Wardley maps for technology and business strategy with evolution axes and component positioning.
lastUpdated: 2025-01-09
---

# Wardley Maps

Create strategic Wardley Maps to visualize business landscapes, technology evolution, and competitive positioning with Runiq's Wardley profile.

## Overview

Wardley Maps are strategic planning tools that visualize the value chain and evolution of components in a business or technology landscape. Unlike traditional diagrams, Wardley Maps use a 2D coordinate system:

- **Y-axis (Value)**: 0 (invisible to user) → 1 (visible to user)
- **X-axis (Evolution)**: 0 (genesis) → 1 (commodity)

## Key Concepts

### Evolution Stages

Components evolve through four stages:

| Stage                 | Evolution Range | Characteristics                            |
| --------------------- | --------------- | ------------------------------------------ |
| **Genesis**           | 0.00 - 0.25     | Novel, uncertain, rapidly changing         |
| **Custom Built**      | 0.25 - 0.50     | Bespoke solutions, competitive advantage   |
| **Product/Rental**    | 0.50 - 0.75     | Standardized, off-the-shelf products       |
| **Commodity/Utility** | 0.75 - 1.00     | Ubiquitous, highly standardized, automated |

### Value Chain Position

- **High Value (0.8-1.0)**: Visible to users, differentiating
- **Mid Value (0.4-0.7)**: Supporting capabilities
- **Low Value (0.0-0.3)**: Infrastructure, invisible to users

## Basic Syntax

```runiq
wardley "Map Title" {
  anchor "User Need" value: 0.95

  component "Visible Service" evolution: 0.75 value: 0.85
  component "Infrastructure" evolution: 0.95 value: 0.30

  dependency from: "Visible Service" to: "Infrastructure"
}
```

## Tea Shop Example

Classic Wardley Map showing a tea shop business:

```runiq
wardley "Tea Shop" {
  anchor "Customer" value: 0.95

  component "Cup of Tea" evolution: 0.45 value: 0.9
  component "Tea" evolution: 0.85 value: 0.7
  component "Hot Water" evolution: 0.95 value: 0.6
  component "Water" evolution: 1.0 value: 0.4
  component "Kettle" evolution: 0.8 value: 0.5
  component "Power" evolution: 1.0 value: 0.2

  dependency from: "Customer" to: "Cup of Tea"
  dependency from: "Cup of Tea" to: "Tea"
  dependency from: "Cup of Tea" to: "Hot Water"
  dependency from: "Hot Water" to: "Water"
  dependency from: "Hot Water" to: "Kettle"
  dependency from: "Kettle" to: "Power"
}
```

## Technology Evolution

Mapping software development technologies:

```runiq
wardley "Software Development Stack" {
  anchor "User Needs" value: 0.95

  component "Web Application" evolution: 0.55 value: 0.9
  component "API Layer" evolution: 0.65 value: 0.75
  component "Business Logic" evolution: 0.45 value: 0.6
  component "Framework" evolution: 0.75 value: 0.5
  component "Programming Language" evolution: 0.85 value: 0.4
  component "Cloud Infrastructure" evolution: 0.9 value: 0.2
  component "Compute" evolution: 0.95 value: 0.1

  dependency from: "User Needs" to: "Web Application"
  dependency from: "Web Application" to: "API Layer"
  dependency from: "API Layer" to: "Business Logic"
  dependency from: "Business Logic" to: "Framework"
  dependency from: "Framework" to: "Programming Language"
  dependency from: "Business Logic" to: "Cloud Infrastructure"
  dependency from: "Cloud Infrastructure" to: "Compute"
}
```

## Strategic Gameplay

Use inertia and evolution properties to show strategic moves:

```runiq
wardley "Cloud Migration Strategy" {
  anchor "Business Services" value: 0.95

  component "Legacy System" evolution: 0.3 value: 0.7 inertia: true
  component "Modernized App" evolution: 0.6 value: 0.7
  component "On-Premise Servers" evolution: 0.4 value: 0.3 inertia: true
  component "Cloud Platform" evolution: 0.9 value: 0.3

  evolve "Legacy System" to evolution: 0.6
  evolve "On-Premise Servers" to evolution: 0.9

  dependency from: "Business Services" to: "Legacy System"
  dependency from: "Business Services" to: "Modernized App"
  dependency from: "Legacy System" to: "On-Premise Servers"
  dependency from: "Modernized App" to: "Cloud Platform"
}
```

## Competitive Landscape

Show multiple players and their positions using labels:

```runiq
wardley "Market Analysis - Streaming Services" {
  anchor "Customer Entertainment" value: 0.95

  component "Streaming Platform" evolution: 0.75 value: 0.9 label: "Netflix, Disney+"
  component "Content Library" evolution: 0.65 value: 0.8
  component "Original Content" evolution: 0.4 value: 0.75 label: "Differentiator"
  component "Licensed Content" evolution: 0.8 value: 0.7
  component "CDN" evolution: 0.95 value: 0.5
  component "Encoding" evolution: 0.85 value: 0.4
  component "Broadband" evolution: 1.0 value: 0.2

  dependency from: "Customer Entertainment" to: "Streaming Platform"
  dependency from: "Streaming Platform" to: "Content Library"
  dependency from: "Content Library" to: "Original Content"
  dependency from: "Content Library" to: "Licensed Content"
  dependency from: "Streaming Platform" to: "CDN"
  dependency from: "Streaming Platform" to: "Encoding"
  dependency from: "CDN" to: "Broadband"
}
```

## Enterprise Architecture

Map technology stack evolution:

```runiq
wardley "Enterprise Architecture" {
  anchor "Business Capabilities" value: 0.95

  component "Customer Portal" evolution: 0.6 value: 0.85
  component "Microservices" evolution: 0.5 value: 0.65
  component "APIs" evolution: 0.7 value: 0.6
  component "Containers" evolution: 0.8 value: 0.4
  component "Orchestration" evolution: 0.75 value: 0.35
  component "Cloud Platform" evolution: 0.9 value: 0.2

  dependency from: "Business Capabilities" to: "Customer Portal"
  dependency from: "Customer Portal" to: "Microservices"
  dependency from: "Microservices" to: "APIs"
  dependency from: "Microservices" to: "Containers"
  dependency from: "Containers" to: "Orchestration"
  dependency from: "Orchestration" to: "Cloud Platform"
}
```

> **Note**: Custom styling for Wardley maps is not yet implemented. The current version supports basic positioning and dependencies.

## Supported Features

The current Wardley profile supports:

- **Components**: `component "Name" evolution: X value: Y`
- **Anchors**: `anchor "User Need" value: Y`
- **Dependencies**: `dependency from: "A" to: "B"`
- **Evolution**: `evolve "Component" to evolution: X`
- **Inertia**: `inertia: true` property on components
- **Labels**: `label: "Text"` property on components

> **Note**: Advanced features like `pipeline`, `market_signal`, `ecosystem`, `pattern`, `annotation`, and `note` are not yet implemented.

## Best Practices

1. **Start with user needs** - Always anchor map to user-visible value
2. **Map the value chain** - Follow dependencies from anchor downward
3. **Position accurately** - Use evolution stages consistently
4. **Show movement** - Indicate strategic moves with evolve arrows
5. **Mark inertia** - Highlight components resistant to change
6. **Multiple maps** - Create series showing progression over time
7. **Collaborate** - Maps are discussion tools, not final artifacts
8. **Challenge assumptions** - Question component positions

## Strategic Patterns

### Industrialization

- Components move right (toward commodity)
- Enables new genesis activities
- Drives efficiency and scale

### Componentization

- Breaking monoliths into reusable parts
- Creates markets for components
- Enables ecosystem development

### Ecosystem Play

- Commoditize complements
- Build on commodity layers
- Create switching costs higher up

## Doctrine Principles

Simon Wardley's doctrine (best practices):

**Phase I - Stop Self-Harm**

- Know your users
- Use appropriate methods
- Think small (iterative)
- Be transparent

**Phase II - Become More Context Aware**

- Understand what's happening
- Use suitable methods
- Challenge assumptions
- Focus on user needs

**Phase III - Better for Less**

- Optimize flows
- Think fast, inexpensive, simple
- Manage inertia
- Use ecosystems

## Comparison with Other Tools

| Feature                      | Runiq          | Lucidchart  | OnlineWardleyMaps | MapScript  | Wardley Maps Canvas |
| ---------------------------- | -------------- | ----------- | ----------------- | ---------- | ------------------- |
| **Text-based DSL**           | ✅             | ❌          | ⚠️ Partial        | ✅         | ❌                  |
| **Version control friendly** | ✅             | ⚠️ Partial  | ⚠️ Partial        | ✅         | ❌                  |
| **Evolution axis**           | ✅             | ⚠️ Manual   | ✅                | ✅         | ✅                  |
| **Value chain**              | ✅             | ⚠️ Manual   | ✅                | ✅         | ✅                  |
| **Component positioning**    | ✅             | ✅          | ✅                | ✅         | ✅                  |
| **Dependencies**             | ✅             | ✅          | ✅                | ✅         | ✅                  |
| **Anchors**                  | ✅             | ⚠️ Manual   | ✅                | ✅         | ✅                  |
| **Annotations**              | ✅             | ✅          | ✅                | ✅         | ✅                  |
| **Movement indicators**      | ✅             | ⚠️ Manual   | ✅                | ✅         | ✅                  |
| **Pipeline stages**          | ✅             | ⚠️ Manual   | ✅                | ✅         | ✅                  |
| **Automatic layout**         | ⚠️ Partial     | ❌          | ❌                | ❌         | ❌                  |
| **Documentation generation** | ✅             | ⚠️ Partial  | ⚠️ Partial        | ⚠️ Partial | ❌                  |
| **Export formats**           | SVG, PNG       | Multiple    | PNG, SVG          | SVG        | PNG                 |
| **Interactive editing**      | ❌             | ✅          | ✅                | ❌         | ✅                  |
| **Learning curve**           | Low            | Low         | Medium            | Low        | Medium              |
| **Cost**                     | Free           | Paid        | Free              | Free       | Free                |
| **Platform**                 | Cross-platform | Web/Desktop | Web               | CLI/Code   | Web                 |

**Key Advantages of Runiq:**

- **Version Control**: Track strategic evolution over time in Git
- **Unified Language**: Use with other diagram types in same repository
- **Documentation**: Natural fit for strategy documents and ADRs
- **Profile System**: Dedicated Wardley profile with proper terminology

**When to Use Alternatives:**

- **OnlineWardleyMaps**: De facto standard tool in Wardley Maps community
- **MapScript**: Python-based automation and batch processing
- **Wardley Maps Canvas**: Quick sketching and iteration for workshops
- **Lucidchart**: Collaborative strategic planning sessions

## Examples

See the [examples/wardley](/examples/wardley-maps) directory for complete examples:

- Tea shop example
- Technology evolution
- Strategic gameplay

## Related

- [Profiles](/guide/profiles)
- [Containers](/guide/containers)

## Resources

- [Wardley Maps Official](https://learnwardleymapping.com/)
- [Wardley Maps Book](https://medium.com/wardleymaps) - Free online book by Simon Wardley
- [Wardley Maps Community](https://discord.gg/wardleymaps)
- [Map Camp Conference](https://www.map-camp.com/)
- [OnlineWardleyMaps](https://onlinewardleymaps.com/) - Alternative mapping tool
