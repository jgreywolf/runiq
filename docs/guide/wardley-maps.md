---
title: Wardley Maps
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

| Stage | Evolution Range | Characteristics |
|-------|----------------|-----------------|
| **Genesis** | 0.00 - 0.25 | Novel, uncertain, rapidly changing |
| **Custom Built** | 0.25 - 0.50 | Bespoke solutions, competitive advantage |
| **Product/Rental** | 0.50 - 0.75 | Standardized, off-the-shelf products |
| **Commodity/Utility** | 0.75 - 1.00 | Ubiquitous, highly standardized, automated |

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

Use inertia, movement, and notes to show strategic moves:

```runiq
wardley "Cloud Migration Strategy" {
  anchor "Business Services" value: 0.95

  component "Legacy System" evolution: 0.3 value: 0.7 inertia: 16
  component "Modernized App" evolution: 0.6 value: 0.7
  component "On-Premise Servers" evolution: 0.4 value: 0.3 inertia: 12
  component "Cloud Platform" evolution: 0.9 value: 0.3

  evolve "Legacy System" to: "Modernized App" label: "Rewrite"
  evolve "On-Premise Servers" to: "Cloud Platform" label: "Lift & Shift"

  dependency from: "Business Services" to: "Legacy System"
  dependency from: "Business Services" to: "Modernized App"
  dependency from: "Legacy System" to: "On-Premise Servers"
  dependency from: "Modernized App" to: "Cloud Platform"

  note "High inertia - difficult to change" at: "Legacy System"
  note "Target state - 18 months" at: "Modernized App"
}
```

## Competitive Landscape

Show multiple players and their positions:

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

  ecosystem "Content Providers" at: { evolution: 0.5, value: 0.6 }
  ecosystem "ISPs" at: { evolution: 0.95, value: 0.25 }
}
```

## Doctrine and Climate Patterns

Add strategic principles and patterns:

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

  pattern "ILC" at: { evolution: 0.3, value: 0.5 } label: "Innovation-Leverage-Commodity"
  annotation "Use appropriate methods\nfor evolution stage" at: { evolution: 0.5, value: 0.95 }
}
```

## Styling

Customize Wardley Map appearance:

```runiq
wardley "Styled Map" {
  style: {
    background: "#f8fafc",
    gridColor: "#e2e8f0",
    componentColor: "#3b82f6",
    dependencyColor: "#64748b",
    evolutionLabels: true,
    valueChainLabels: true
  }

  anchor "User" value: 0.95

  component "Service" evolution: 0.7 value: 0.8 
    style: { fill: "#10b981", stroke: "#059669" }
}
```

## Advanced Features

### Pipelines

Show multiple components moving together:

```runiq
wardley "Platform Evolution" {
  pipeline "Data Platform" {
    component "Custom ETL" evolution: 0.3 value: 0.5
    component "Data Lake" evolution: 0.5 value: 0.4
    component "Analytics" evolution: 0.4 value: 0.6
  }

  evolve pipeline: "Data Platform" to: 0.7 timeframe: "2 years"
}
```

### Market Signals

Indicate external forces:

```runiq
wardley "Market Forces" {
  component "Legacy Tech" evolution: 0.3 value: 0.5
  component "Emerging Tech" evolution: 0.4 value: 0.5

  market_signal "Regulation" affects: "Legacy Tech" impact: "increases inertia"
  market_signal "Open Source" affects: "Emerging Tech" impact: "accelerates evolution"
}
```

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

## Examples

See the [examples/wardley](https://github.com/jgreywolf/runiq/tree/main/examples/wardley) directory for complete examples:

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
