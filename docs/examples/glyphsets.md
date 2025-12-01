---
title: Glyphset Diagram Examples
description: Smart layouts and visual metaphors for presentations, reports, and strategic communication
lastUpdated: 2025-01-21
---

# Glyphset Diagram Examples

Glyphsets are pre-designed diagram templates that provide professional layouts for common business and communication needs. With 99+ templates available, they offer quick solutions for presentations, reports, and visual storytelling.

## What are Glyphsets?

Glyphsets are smart diagram layouts inspired by Microsoft PowerPoint's SmartArt feature. Each template automatically arranges shapes, text, and connectors to create visually appealing diagrams. They're perfect for:

- Business presentations and pitch decks
- Strategic planning and roadmaps
- Process documentation
- Organizational charts
- Decision-making frameworks
- Comparison and analysis

## Basic Syntax

Glyphsets use a simple, declarative syntax:

```runiq
glyphset <type> "<title>" {
  theme "<theme-name>"
  item "<content>"
  item "<content>"
  // ... more items
}
```

**Available themes:** `"forest"`, `"warm"`, `"cool"`, `"ocean"`, `"sunset"`

## Categories

### List Layouts

Structured sequences for steps, items, or hierarchies.

#### Alternating List

Alternating left/right layout for processes:

```runiq
glyphset alternatingList "Product Evolution" {
  theme forest
  item "v1.0: MVP Release"
  item "v2.0: User Feedback"
  item "v3.0: Enterprise Features"
  item "v4.0: AI Integration"
}
```

#### Chevron List

Forward-pointing chevrons for pipelines:

```runiq
glyphset chevronList "Sales Pipeline" {
  theme forest
  item "Lead Generation"
  item "Qualification"
  item "Proposal"
  item "Negotiation"
  item "Closed Won"
}
```

#### Horizontal List

Left-to-right progression:

```runiq
glyphset horizontalList "Project Phases" {
  theme forest
  item "Planning"
  item "Development"
  item "Testing"
  item "Deployment"
}
```

#### Column List

Multi-column list organization:

```runiq
glyphset columnList "Tech Stack" {
  theme forest
  item "Frontend: React"
  item "Backend: Node.js"
  item "Database: PostgreSQL"
  item "Deployment: AWS"
}
```

### Process Flows

Visualize workflows, cycles, and continuous processes.

#### Block Cycle

Circular continuous process (PDCA, etc.):

```runiq
glyphset blockCycle "PDCA Continuous Improvement" {
  theme forest
  item "Plan"
  item "Do"
  item "Check"
  item "Act"
}
```

#### Alternating Process

Back-and-forth workflow steps:

```runiq
glyphset alternatingProcess "Agile Workflow" {
  theme forest
  item "Sprint Planning"
  item "Development"
  item "Code Review"
  item "Testing"
  item "Deployment"
}
```

#### Continuous Block Process

Linear multi-stage process:

```runiq
glyphset continuousBlockProcess "Manufacturing Pipeline" {
  theme forest
  item "Raw Materials"
  item "Processing"
  item "Assembly"
  item "Quality Control"
  item "Packaging"
}
```

#### Stepped Process

Ascending/descending steps:

```runiq
glyphset stepProcess "Career Growth" {
  theme forest
  item "Junior Developer"
  item "Mid-Level Developer"
  item "Senior Developer"
  item "Tech Lead"
  item "Engineering Manager"
}
```

### Hierarchies

Organizational structures and nested relationships.

#### Organization Chart

Traditional org chart:

```runiq
glyphset orgchart "Engineering Team" {
  theme forest
  item "CTO"
  item "VP Engineering"
  item "Engineering Manager"
  item "Tech Lead"
  item "Senior Developer"
  item "Developer"
}
```

#### Pyramid List

Hierarchical levels:

```runiq
glyphset pyramidList "Learning Pyramid" {
  theme forest
  item "Master"
  item "Advanced"
  item "Intermediate"
  item "Beginner"
}
```

#### Circle Hierarchy

Radial organization:

```runiq
glyphset circle-hierarchy "Product Components" {
  theme forest
  item "Core Platform"
  item "Analytics Module"
  item "Reporting Module"
  item "Integration APIs"
}
```

#### Nested List

Grouped hierarchical items:

```runiq
glyphset nestedList "Feature Roadmap" {
  theme forest
  item "Phase 1: Foundation"
  item "Phase 2: Enhancement"
  item "Phase 3: Scale"
}
```

### Comparisons

Side-by-side analysis and decision frameworks.

#### Balance

Pros/cons, advantages/disadvantages:

```runiq
glyphset balance "Cloud Migration Decision" {
  theme forest
  side "Pros: Flexibility, Cost Savings, Innovation"
  side "Cons: Security Risk, Complexity, Vendor Lock-in"
}
```

#### Plus/Minus

Alternative balance notation:

```runiq
glyphset plusMinus "Remote Work Analysis" {
  theme forest
  side "Benefits: Flexibility, Cost Savings, Global Talent"
  side "Challenges: Communication, Collaboration, Timezone Issues"
}
```

#### Opposing

Two-sided comparison:

```runiq
glyphset opposing "Traditional vs Innovative" {
  theme forest
  side "Traditional: Proven, Stable, Lower Risk"
  side "Innovative: Modern, Flexible, Higher Growth"
}
```

#### Counterbalance

Weight comparison:

```runiq
glyphset counterbalance "Investment Decision" {
  theme forest
  side "Invest Now"
  side "Wait for Market"
}
```

### Relationships

Connections, flows, and interactions between elements.

#### Converging

Multiple inputs to single output:

```runiq
glyphset converging "Data Aggregation Flow" {
  theme forest
  item "Customer Database"
  item "Sales Records"
  item "Analytics Events"
  item "Third-Party APIs"
}
```

#### Diverging

Single input to multiple outputs:

```runiq
glyphset diverging "Content Distribution" {
  theme forest
  item "Blog Post"
  item "Social Media"
  item "Email Newsletter"
  item "Video Content"
}
```

#### Cluster

Grouped related items:

```runiq
glyphset cluster "Product Features" {
  theme forest
  item "Authentication"
  item "Dashboard"
  item "Reporting"
  item "Integrations"
}
```

#### Hub

Central node with spokes:

```runiq
glyphset hub "API Gateway" {
  theme forest
  item "Mobile App"
  item "Web App"
  item "Third-Party Services"
  item "Admin Portal"
}
```

#### Interconnected

Network of connections:

```runiq
glyphset interconnected "Microservices Architecture" {
  theme forest
  item "User Service"
  item "Order Service"
  item "Payment Service"
  item "Notification Service"
}
```

### Matrices & Grids

Multi-dimensional categorization and analysis.

#### Matrix 3×3

Nine-box grid:

```runiq
glyphset matrix3x3 "BCG Product Portfolio" {
  theme forest
  quadrant "Low Growth\nLow Share"
  quadrant "Low Growth\nMed Share"
  quadrant "Low Growth\nHigh Share"
  quadrant "Med Growth\nLow Share"
  quadrant "Med Growth\nMed Share"
  quadrant "Med Growth\nHigh Share"
  quadrant "High Growth\nLow Share"
  quadrant "High Growth\nMed Share"
  quadrant "High Growth\nHigh Share"
}
```

#### Segmented Matrix

Divided grid with labels:

```runiq
glyphset segmentedMatrix "Priority Matrix" {
  theme forest
  quadrant "Urgent & Important"
  quadrant "Not Urgent & Important"
  quadrant "Urgent & Not Important"
  quadrant "Not Urgent & Not Important"
}
```

#### Titled Matrix

Matrix with descriptive titles:

```runiq
glyphset titledMatrix "RACI Matrix" {
  theme forest
  quadrant "Responsible"
  quadrant "Accountable"
  quadrant "Consulted"
  quadrant "Informed"
}
```

### Visual Metaphors

Symbolic representations for concepts and processes.

#### Funnel

Conversion process (sales, marketing):

```runiq
glyphset funnel "Sales Funnel" {
  theme warm
  stage "Awareness"
  stage "Interest"
  stage "Consideration"
  stage "Intent"
  stage "Purchase"
}
```

Note: `funnel` is an alias for `invertedPyramid` and uses `stage` keyword.

#### Inverted Pyramid

Top-down filtering:

```runiq
glyphset invertedPyramid "Hiring Funnel" {
  theme forest
  item "Applicants: 1000"
  item "Phone Screens: 200"
  item "Interviews: 50"
  item "Offers: 10"
  item "Hires: 8"
}
```

#### Target

Goals and objectives (concentric circles):

```runiq
glyphset target "Market Segmentation" {
  theme forest
  circle "Core Market"
  circle "Secondary Market"
  circle "Emerging Market"
  circle "Future Opportunities"
}
```

Note: `target` uses `circle` keyword for each ring.

#### Puzzle

Solution components:

```runiq
glyphset puzzle "System Integration" {
  theme forest
  item "CRM System"
  item "Payment Gateway"
  item "Email Service"
  item "Analytics Platform"
}
```

#### Segmented Pyramid

Pyramid with divisions:

```runiq
glyphset segmentedPyramid "Organizational Structure" {
  theme forest
  item "Executive"
  item "Management"
  item "Operations"
  item "Support"
}
```

#### Gear Cycle

Interconnected systems:

```runiq
glyphset gearCycle "Manufacturing System" {
  theme forest
  item "Supply Chain"
  item "Production"
  item "Quality Control"
  item "Distribution"
}
```

#### Orbit Cycle

Satellite elements around core:

```runiq
glyphset orbitCycle "Enterprise Ecosystem" {
  theme forest
  item "Core Platform"
  item "Mobile Apps"
  item "Partner APIs"
  item "Admin Tools"
}
```

#### Radial Cycle

Radial arrangement with center:

```runiq
glyphset radialCycle "System Architecture" {
  theme forest
  item "Frontend"
  item "API Layer"
  item "Business Logic"
  item "Data Layer"
}
```

#### Segmented Cycle

Circular with divisions:

```runiq
glyphset segmentedCycle "24-Hour Timeline" {
  theme forest
  item "Morning: 6am-12pm"
  item "Afternoon: 12pm-6pm"
  item "Evening: 6pm-12am"
  item "Night: 12am-6am"
}
```

#### Spiral Cycle

Growth spiral:

```runiq
glyphset spiralCycle "Maturity Model" {
  theme forest
  item "Initial"
  item "Managed"
  item "Defined"
  item "Quantitatively Managed"
  item "Optimizing"
}
```

### Special Purpose

#### Equation

Mathematical or conceptual equations:

```runiq
glyphset equation "Success Formula" {
  theme forest
  item "Vision"
  item "Execution"
  item "Success"
}
```

#### Equation Process

Process as equation:

```runiq
glyphset equationProcess "Product Development" {
  theme forest
  item "Ideas"
  item "Validation"
  item "Development"
  item "Launch"
}
```

#### Table Hierarchy

Table-like structure:

```runiq
glyphset table-hierarchy "Feature Comparison" {
  theme forest
  item "Feature A: Basic"
  item "Feature B: Standard"
  item "Feature C: Premium"
}
```

## Use Cases

### Business Strategy

- SWOT analysis with balance or opposing glyphsets
- Value chain with continuous process
- Strategic roadmaps with chevronList
- Market segmentation with target

### Project Management

- Gantt alternatives with horizontalList
- Milestone tracking with steppedProcess
- Resource allocation with cluster
- Stakeholder mapping with hub

### Decision Making

- Decision trees with pyramidList
- Option comparison with balance
- Risk assessment with matrix3x3
- Impact-effort with segmentedMatrix

### Process Documentation

- Workflow diagrams with alternatingProcess
- Quality frameworks (PDCA) with blockCycle
- Manufacturing pipelines with continuousBlockProcess
- Change management with spiralCycle

## Tips for Using Glyphsets

1. **Choose the Right Template**: Match the glyphset type to your content structure
2. **Keep It Simple**: Don't overcrowd diagrams - 4-7 items per glyphset works best
3. **Use Themes**: Apply consistent themes across related diagrams
4. **Clear Labels**: Short, descriptive labels are more effective than long text
5. **Combine Glyphsets**: Use multiple glyphsets in presentations for different topics

## Available Glyphset Types

| Category          | Templates                                                                                                                                | Use Cases                           |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **Lists**         | alternatingList, chevronList, columnList, horizontalList, nestedList, numberedChevronList, increasingList                                | Steps, sequences, progressions      |
| **Processes**     | alternatingProcess, blockCycle, continuousBlockProcess, stepProcess, phasedProcess, groupedProcess, detailedProcess                      | Workflows, cycles, procedures       |
| **Hierarchies**   | orgchart, pyramidList, circle-hierarchy, nestedList, labeled-hierarchy, team-hierarchy                                                   | Org charts, classifications, levels |
| **Comparisons**   | balance, plusMinus, opposing, counterbalance                                                                                             | Analysis, decisions, trade-offs     |
| **Relationships** | converging, diverging, cluster, hub, interconnected, linear-venn, stepped-venn                                                           | Connections, groupings, flows       |
| **Matrices**      | matrix3x3, segmentedMatrix, titledMatrix                                                                                                 | Multi-dimensional analysis          |
| **Metaphors**     | funnel, invertedPyramid, target, puzzle, segmentedPyramid, gearCycle, orbitCycle, radialCycle, segmentedCycle, spiralCycle               | Concepts, goals, systems            |
| **Special**       | equation, equationProcess, table-hierarchy, framed-picture, picture-blocks, picture-callout, picture-grid, picture-list, picture-process | Formulas, visual layouts            |

## Next Steps

- See [glyphsets](/guide/glyphsets)
- See [Venn Diagrams](/examples/venn-diagrams) for set overlap analysis
- Check [Pyramid Diagrams](/examples/pyramid-diagrams) for hierarchical data visualization
- Explore [Timeline Diagrams](/examples/timeline-diagrams) for chronological sequences
