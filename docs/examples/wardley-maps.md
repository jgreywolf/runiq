# Wardley Maps

Wardley Maps are strategic mapping tools for visualizing business landscapes, technology evolution, and value chains. Created by Simon Wardley, they help organizations understand their competitive position and plan strategic moves.

## What is a Wardley Map?

A Wardley Map uses two axes to position components:

- **Evolution Axis (X)** - How evolved a component is from Genesis (novel, unique) to Commodity (standardized, utility)
- **Value Chain Axis (Y)** - How visible a component is to users, from Infrastructure (invisible) to User-facing (visible)

Components are connected by dependencies, showing how value flows through the system. Evolution arrows indicate future strategic movements.

## Evolution Stages

| Stage            | Evolution Range | Characteristics                   | Examples                            |
| ---------------- | --------------- | --------------------------------- | ----------------------------------- |
| **Genesis**      | 0.0 - 0.25      | Novel, uncertain, experimental    | New research, prototypes, R&D       |
| **Custom Built** | 0.25 - 0.50     | Bespoke solutions, artisanal      | Custom software, MVP, beta versions |
| **Product**      | 0.50 - 0.75     | Standardized, competitive market  | Commercial products, SaaS platforms |
| **Commodity**    | 0.75 - 1.0      | Utility, standardized, ubiquitous | Cloud compute, electricity, APIs    |

## Tea Shop Example

Simon Wardley's classic example showing a simple business value chain:

### DSL Code

```runiq
wardley "Tea Shop"

# Customer need
anchor "Cup of Tea" value:0.9

# Visible components
component "Cup of Tea" evolution:0.8 value:0.9 label:"What customer sees"
component "Tea" evolution:0.9 value:0.8
component "Cup" evolution:1.0 value:0.7
component "Hot Water" evolution:0.95 value:0.6

# Infrastructure
component "Water" evolution:1.0 value:0.3
component "Kettle" evolution:0.9 value:0.4
component "Power" evolution:1.0 value:0.1

# Dependencies showing value chain
dependency from:"Cup of Tea" to:"Tea"
dependency from:"Cup of Tea" to:"Cup"
dependency from:"Cup of Tea" to:"Hot Water"
dependency from:"Hot Water" to:"Water"
dependency from:"Hot Water" to:"Kettle"
dependency from:"Kettle" to:"Power"
```

### Generated SVG

![Tea Shop Wardley Map](/examples/tea-shop-wardley.svg)

### Explanation

**Components:**

- **Cup of Tea** (evolution: 0.8, value: 0.9) - The visible product customers want
- **Tea, Cup** (evolution: 0.9-1.0, value: 0.7-0.8) - Commoditized ingredients
- **Hot Water, Kettle** (evolution: 0.9-0.95, value: 0.4-0.6) - Supporting infrastructure
- **Water, Power** (evolution: 1.0, value: 0.1-0.3) - Complete commodities (utilities)

**Value Chain:**

- Flows from bottom (invisible infrastructure) to top (visible product)
- Shows all dependencies needed to deliver the final product
- Power and Water are complete utilities (evolution = 1.0)

## Technology Evolution

Modern web application stack with strategic evolution indicators:

```runiq
wardley "Web Application Stack"

# User anchor
anchor "User Experience" value:0.95 evolution:0.7

# Frontend (visible)
component "Web Interface" evolution:0.75 value:0.9 label:"User-facing"
component "Mobile App" evolution:0.7 value:0.85 inertia:true

# Backend services
component "API Gateway" evolution:0.65 value:0.7
component "Business Logic" evolution:0.6 value:0.6
component "Data Store" evolution:0.8 value:0.5

# Infrastructure
component "Container Platform" evolution:0.7 value:0.35
component "Cloud Compute" evolution:0.9 value:0.2
component "Network" evolution:1.0 value:0.15

# Emerging technologies
component "Serverless" evolution:0.5 value:0.4 label:"Emerging"
component "Edge Computing" evolution:0.3 value:0.3

# Dependencies
dependency from:"Web Interface" to:"API Gateway"
dependency from:"Mobile App" to:"API Gateway"
dependency from:"API Gateway" to:"Business Logic"
dependency from:"Business Logic" to:"Data Store"
dependency from:"API Gateway" to:"Serverless"
dependency from:"Data Store" to:"Container Platform"
dependency from:"Container Platform" to:"Cloud Compute"
dependency from:"Cloud Compute" to:"Network"

# Evolution indicators
evolve "Mobile App" to evolution:0.85
evolve "Serverless" to evolution:0.75
evolve "Edge Computing" to evolution:0.6
```

### Generated SVG

![Technology Evolution](/examples/tech-evolution-wardley.svg)

### Strategic Insights

**Inertia:**

- `Mobile App` has `inertia:true` - resistance to change despite evolution pressure
- Often due to organizational constraints, technical debt, or market forces

**Evolution Arrows:**

- Show planned strategic movements
- Mobile App evolving from custom (0.7) toward product (0.85)
- Serverless evolving from genesis (0.5) toward product (0.75)
- Edge Computing still in genesis (0.3) but moving to custom-built (0.6)

**Component Positioning:**

- Network is complete commodity (evolution: 1.0)
- Edge Computing is novel/emerging (evolution: 0.3)
- Clear progression from genesis → custom → product → commodity

## Business Strategy Map

Strategic mapping for digital transformation:

```runiq
wardley "Digital Transformation Strategy"

# Customer need
anchor "Customer Satisfaction" value:0.95

# Customer-facing
component "Customer Portal" evolution:0.6 value:0.9 label:"Differentiator"
component "Mobile Experience" evolution:0.5 value:0.85 inertia:true
component "Customer Data" evolution:0.7 value:0.75

# Core capabilities
component "CRM System" evolution:0.75 value:0.65
component "Analytics Platform" evolution:0.55 value:0.55 label:"Investment area"
component "Integration Layer" evolution:0.65 value:0.45

# Commodity services
component "Email Service" evolution:0.95 value:0.35
component "Cloud Storage" evolution:0.9 value:0.25
component "Compute Resources" evolution:1.0 value:0.15

# Legacy
component "Legacy Database" evolution:0.85 value:0.5 inertia:true label:"Tech debt"

dependency from:"Customer Portal" to:"CRM System"
dependency from:"Mobile Experience" to:"Customer Data"
dependency from:"Customer Data" to:"Analytics Platform"
dependency from:"CRM System" to:"Integration Layer"
dependency from:"CRM System" to:"Legacy Database"
dependency from:"Analytics Platform" to:"Cloud Storage"
dependency from:"Integration Layer" to:"Email Service"
dependency from:"Integration Layer" to:"Compute Resources"

# Strategic moves
evolve "Mobile Experience" to evolution:0.8
evolve "Analytics Platform" to evolution:0.75
evolve "Legacy Database" to evolution:0.95 # Migrate to commodity
```

### Strategic Analysis

**Investment Priorities:**

1. **Customer Portal** (evolution: 0.6) - Custom-built differentiator
2. **Analytics Platform** (evolution: 0.55) - Key investment area
3. **Mobile Experience** (evolution: 0.5) - Has inertia, needs attention

**Technical Debt:**

- **Legacy Database** (evolution: 0.85, inertia: true) - Old product-stage tech
- Evolution arrow to 0.95 indicates migration to commodity/cloud strategy

**Commodity Usage:**

- Email Service, Cloud Storage, Compute Resources already commoditized
- Strategic decision: buy not build for utilities

## Product Development Journey

Mapping a product's evolution from genesis to commodity:

```runiq
wardley "Product Evolution Map"

anchor "Market Need" value:0.92

# Genesis - Novel innovation
component "Novel Feature" evolution:0.15 value:0.85 label:"R&D phase"
component "Prototype" evolution:0.2 value:0.75

# Custom Built
component "MVP" evolution:0.35 value:0.8 label:"Custom solution"
component "Beta Version" evolution:0.45 value:0.75

# Product
component "Released Product" evolution:0.65 value:0.85 label:"Product phase"
component "Feature Set" evolution:0.7 value:0.7

# Commodity
component "Standard Components" evolution:0.9 value:0.5
component "Open Source Libs" evolution:0.95 value:0.4
component "Cloud Services" evolution:1.0 value:0.3

dependency from:"Prototype" to:"Novel Feature"
dependency from:"MVP" to:"Prototype"
dependency from:"Beta Version" to:"MVP"
dependency from:"Released Product" to:"Beta Version"
dependency from:"Released Product" to:"Feature Set"
dependency from:"Feature Set" to:"Standard Components"
dependency from:"Standard Components" to:"Open Source Libs"
dependency from:"Open Source Libs" to:"Cloud Services"

# Evolution path
evolve "Novel Feature" to evolution:0.5
evolve "MVP" to evolution:0.65
evolve "Standard Components" to evolution:1.0
```

### Product Lifecycle

**Genesis Stage (0.15-0.2):**

- Novel Feature, Prototype
- High uncertainty, experimental
- R&D investment required

**Custom Built Stage (0.35-0.45):**

- MVP, Beta Version
- Bespoke solutions, early adopters
- Iteration and refinement

**Product Stage (0.65-0.7):**

- Released Product, Feature Set
- Competitive market, standardization
- Scaling and growth focus

**Commodity Stage (0.9-1.0):**

- Standard Components, Open Source, Cloud Services
- Utilities, buy not build
- Focus on integration not creation

## DSL Syntax Reference

### Profile Declaration

```runiq
wardley "Map Title"
```

### Anchor (User Need)

Defines the top-level user need or outcome (rendered as a star):

```runiq
anchor "Name" value:0.95 evolution:0.7
```

- `value` (required): 0.0-1.0 (0 = invisible, 1 = visible to user)
- `evolution` (optional): 0.0-1.0 (position on evolution axis)

### Component

Defines a component in your value chain (rendered as a circle):

```runiq
component "Name" evolution:0.75 value:0.85 label:"Description" inertia:true
```

- `evolution` (required): 0.0-1.0 (0 = genesis, 1 = commodity)
- `value` (required): 0.0-1.0 (0 = invisible infrastructure, 1 = visible to user)
- `label` (optional): Descriptive text shown on hover
- `inertia` (optional): Boolean - indicates resistance to change

### Dependency

Shows value chain connection between components (rendered as arrow):

```runiq
dependency from:"Component A" to:"Component B"
```

- `from` (required): Source component name (exact match)
- `to` (required): Target component name (exact match)

### Evolution Indicator

Shows strategic movement direction (rendered as dashed arrow):

```runiq
evolve "Component Name" to evolution:0.8
```

- Component must exist
- `to evolution` (required): Target evolution position (0.0-1.0)

## Coordinate System

### Evolution Axis (X-axis, Horizontal)

| Value      | Stage        | Description                            |
| ---------- | ------------ | -------------------------------------- |
| 0.0 - 0.25 | Genesis      | Novel, unique, uncertain, chaotic      |
| 0.25 - 0.5 | Custom Built | Bespoke, artisanal, emerging patterns  |
| 0.5 - 0.75 | Product      | Competitive market, standardizing      |
| 0.75 - 1.0 | Commodity    | Utility, standardized, well-understood |

### Value Chain Axis (Y-axis, Vertical)

| Value     | Visibility | Description                    |
| --------- | ---------- | ------------------------------ |
| 0.0 - 0.3 | Invisible  | Deep infrastructure, utilities |
| 0.3 - 0.6 | Supporting | Backend services, middleware   |
| 0.6 - 0.9 | Visible    | User-facing features, products |
| 0.9 - 1.0 | Anchor     | User needs, outcomes           |

## Visual Elements

### Components (Circles)

- Positioned at `(evolution, value)` coordinates
- Component name displayed
- Optional label text on hover
- Inertia indicated by special styling (dotted border)

### Dependencies (Arrows)

- Solid lines with arrowheads
- Connect components to show value chain
- Flow generally from bottom (infrastructure) to top (user-facing)

### Anchors (Stars)

- 5-pointed stars
- Represent user needs or desired outcomes
- Typically positioned high on value chain (value > 0.9)

### Evolution Indicators (Dashed Arrows)

- Dashed/dotted lines
- Show strategic movement direction
- Indicate future evolution plans

### Grid & Axes

- 4x4 grid for visual reference
- X-axis labels: Genesis, Custom Built, Product, Commodity
- Y-axis labels: Invisible, Visible
- Background grid helps with component positioning

## Best Practices

### Component Positioning

1. **Evolution (X)**: Be honest about maturity
   - Don't wishfully place components in commodity when they're still genesis
   - Use market standards as reference (e.g., cloud compute is commodity)

2. **Value (Y)**: Think from user perspective
   - User-facing = high value (0.8-1.0)
   - Infrastructure = low value (0.1-0.3)
   - Dependencies should generally flow upward

3. **Spacing**: Leave room for readability
   - Don't cluster components too tightly
   - Use the full map space (0.0-1.0 range)

### Strategic Analysis

1. **Identify Commodities**: Move to buy/rent instead of build
2. **Spot Genesis Opportunities**: Where can you innovate?
3. **Recognize Inertia**: What's blocking evolution?
4. **Plan Movement**: Use evolve statements to show strategy
5. **Map Competitors**: Overlay different maps to compare positions

### Common Patterns

**Build-Measure-Learn:**

```runiq
component "Experiment" evolution:0.15 value:0.8
evolve "Experiment" to evolution:0.35  # Move to MVP
```

**Technical Debt:**

```runiq
component "Legacy System" evolution:0.85 value:0.5 inertia:true
evolve "Legacy System" to evolution:0.95  # Migrate to commodity
```

**Platform Strategy:**

```runiq
component "Custom Platform" evolution:0.55 value:0.6
component "Cloud Service" evolution:0.95 value:0.4
dependency from:"Custom Platform" to:"Cloud Service"
```

## Exporting

Wardley Maps can be exported from the CLI:

```bash
# Render to SVG
runiq render examples/wardley/tea-shop.runiq -o tea-shop.svg

# Customize dimensions
runiq render business-strategy.runiq -o strategy.svg --width 1200 --height 800
```

## Use Cases

### Business Strategy

- Competitive landscape analysis
- Market positioning
- Investment priorities
- Build vs. buy decisions

### Technology Planning

- Architecture evolution
- Technical debt identification
- Platform strategy
- Technology adoption roadmaps

### Product Management

- Feature prioritization
- Component evolution tracking
- Dependency mapping
- Strategic roadmapping

### Organizational Design

- Capability mapping
- Team structure alignment
- Skill gap analysis
- Outsourcing decisions

## Learn More

- [Simon Wardley's Book (free)](https://medium.com/wardleymaps)
- [Wardley Mapping Canvas](https://www.wardleymaps.com/)
- [LearnWardleyMapping.com](https://learnwardleymapping.com/)
- [Wardley Maps Community](https://github.com/wardley-maps-community)

## Quick Reference

### Minimal Example

```runiq
wardley "Simple Map"

anchor "User Need" value:0.95
component "Visible Service" evolution:0.7 value:0.85
component "Infrastructure" evolution:0.95 value:0.3
dependency from:"Visible Service" to:"Infrastructure"
```

### Complete Example

```runiq
wardley "Complete Map"

# User needs
anchor "Customer Satisfaction" value:0.95

# User-facing
component "App" evolution:0.6 value:0.9 label:"Mobile application"
component "API" evolution:0.75 value:0.7

# Infrastructure
component "Database" evolution:0.85 value:0.5 inertia:true
component "Cloud" evolution:1.0 value:0.2

# Connections
dependency from:"App" to:"API"
dependency from:"API" to:"Database"
dependency from:"Database" to:"Cloud"

# Strategy
evolve "Database" to evolution:0.95
```
