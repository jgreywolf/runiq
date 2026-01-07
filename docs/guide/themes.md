---
title: Themes
description: Apply professional color schemes across all diagram types including diagrams, sequences, timelines, and glyphsets.
lastUpdated: 2025-11-30
---

# Themes

Runiq provides a consistent theming system across all diagram profiles, allowing you to apply professional color schemes with a single keyword.

## Overview

Themes automatically style your diagrams with coordinated color palettes. All profile types support the same set of themes, ensuring visual consistency across your documentation.

## Supported Profiles

Themes work with all diagram profile types:

- **diagram** - Standard node-and-edge diagrams
- **sequence** - UML sequence diagrams
- **timeline** - Chronological event timelines
- **glyphset** - Specialized visualizations (pyramids, funnels, cycles, etc.)

## Using Themes

Add a `theme` declaration to any diagram profile (no quotes needed):

### Standard Diagrams

```runiq
diagram "System Architecture" {
  theme ocean
  direction LR

  shape frontend as @rounded label:"Frontend"
  shape backend as @hexagon label:"Backend"
  shape db as @cylinder label:"Database"

  frontend -> backend
  backend -> db
}
```

### Sequence Diagrams

```runiq
sequence "User Login" {
  theme forest

  participant "User" as actor
  participant "App" as boundary
  participant "Auth" as control

  message from: "User" to: "App" label: "Login" type: sync
  message from: "App" to: "Auth" label: "Validate" type: sync
  message from: "Auth" to: "App" label: "Token" type: return
}
```

### Timeline Diagrams

```runiq
timeline "Project Roadmap" {
  theme sunset

  event kickoff date:"2024-01-15" label:"Project Kickoff"
  event design date:"2024-02-20" label:"Design Complete"
  event launch date:"2024-06-01" label:"Product Launch"

  orientation horizontal
}
```

### Glyphset Diagrams

```runiq
glyphset funnel "Sales Pipeline" {
  theme vibrant

  level "Awareness"
  level "Interest"
  level "Decision"
  level "Action"
}
```

## Available Themes

### runiq (default)

Official Runiq brand theme with professional blue-gray palette.

- **Primary Color**: #5a819e (Runiq blue from mascot scarf)
- **Palette**: Blue-gray gradient (#5a819e → #121a20)
- **Best for**: Runiq-branded content, professional documentation
- **Mood**: Modern, trustworthy, professional

### professional

Classic business gray-blue palette for corporate environments.

- **Colors**: Gray-blue gradient (#546E7A → #90A4AE)
- **Best for**: Business presentations, technical documentation, corporate materials
- **Mood**: Formal, neutral, traditional

### forest

Natural greens and earth tones inspired by nature.

- **Colors**: Forest Green (#2E7D32), Medium Green (#43A047), Light Green (#66BB6A), Pale Green (#81C784)
- **Best for**: Environmental topics, growth concepts, organic processes, sustainability
- **Mood**: Natural, growing, sustainable

### sunset

Warm oranges and ambers inspired by sunset colors.

- **Colors**: Dark Orange (#FF6F00), Orange (#FF8F00), Light Orange (#FFA726), Amber (#FFA000)
- **Best for**: Creative projects, energy, passion, warmth, dynamic content
- **Mood**: Energetic, warm, creative

### ocean

Cool blues and teals inspired by the sea.

- **Colors**: Deep Ocean (#006064), Cyan (#00ACC1), Teal (#00897B), Light Teal (#80CBC4)
- **Best for**: Technology, trust, calm, stability, maritime themes
- **Mood**: Calm, stable, trustworthy

### monochrome

Focused monochrome blue palette for minimalist designs.

- **Colors**: Blue gradient (#4472C4 → #003366)
- **Best for**: Professional documents, minimalist designs, focus on structure
- **Mood**: Simple, focused, clean

### colorful

Classic Office color palette with diverse, balanced colors.

- **Colors**: Blue (#4472C4), Orange (#ED7D31), Gray (#A5A5A5), Gold (#FFC000), Light Blue (#5B9BD5), Green (#70AD47)
- **Best for**: General presentations, diverse content, eye-catching diagrams
- **Mood**: Balanced, diverse, accessible

### vibrant

Modern multi-color palette for energetic, contemporary designs.

- **Colors**: Red (#E74C3C), Blue (#3498DB), Green (#2ECC71), Orange (#F39C12), Purple (#9B59B6), Teal (#1ABC9C)
- **Best for**: Creative projects, marketing materials, youth-oriented content
- **Mood**: Energetic, modern, bold

### warm

Warm spectrum with corals, oranges, and yellows.

- **Colors**: Coral (#FF6B6B), Orange (#FFB347), Yellow (#FFD93D), Peach (#FF8C42), Pink (#C44569)
- **Best for**: Friendly communications, creative work, emotional content, approachable designs
- **Mood**: Friendly, warm, approachable

### cool

Cool spectrum with cyans, blues, and purples.

- **Colors**: Cyan (#00B8D4), Blue (#0288D1), Purple (#5E35B1), Teal (#00897B), Indigo (#1A237E)
- **Best for**: Technology, innovation, calm, analytical content
- **Mood**: Analytical, cool, innovative

## Theme Selection Guide

| Theme            | Mood                   | Use Cases                                    |
| ---------------- | ---------------------- | -------------------------------------------- |
| **runiq**        | Modern, trustworthy    | Official Runiq content, professional docs    |
| **professional** | Formal, corporate      | Business docs, reports, formal presentations |
| **colorful**     | Diverse, balanced      | General presentations, mixed content         |
| **monochrome**   | Minimalist, focused    | Clean designs, emphasis on structure         |
| **vibrant**      | Energetic, modern      | Creative work, marketing, youth content      |
| **warm**         | Friendly, approachable | Communications, emotional topics             |
| **cool**         | Calm, analytical       | Technology, innovation, data analysis        |
| **forest**       | Natural, organic       | Environmental, growth, sustainability        |
| **sunset**       | Dynamic, energetic     | Creative, passion, warmth                    |
| **ocean**        | Trustworthy, stable    | Maritime, technology, calm                   |

## Examples

### Architecture Diagram with Ocean Theme

```runiq
diagram "Microservices Architecture" {
  theme ocean
  direction TB

  container frontend "Frontend Layer" {
    shape web as @rounded label:"Web App"
    shape mobile as @rounded label:"Mobile App"
  }

  container services "Service Layer" {
    shape auth as @hexagon label:"Auth Service"
    shape user as @hexagon label:"User Service"
    shape order as @hexagon label:"Order Service"
  }

  container data "Data Layer" {
    shape db as @cylinder label:"PostgreSQL"
    shape cache as @cylinder label:"Redis"
  }

  web -> auth
  mobile -> auth
  auth -> db
  user -> db
  order -> db
  order -> cache
}
```

### Sequence Diagram with Vibrant Theme

```runiq
sequence "Payment Processing" {
  theme vibrant

  participant "Customer" as actor
  participant "Web App" as boundary
  participant "Payment Service" as control
  participant "Bank API" as entity

  message from: "Customer" to: "Web App" label: "Submit payment" type: sync
  message from: "Web App" to: "Payment Service" label: "Process" type: sync activate: true
  message from: "Payment Service" to: "Bank API" label: "Charge card" type: sync
  message from: "Bank API" to: "Payment Service" label: "Success" type: return
  message from: "Payment Service" to: "Web App" label: "Confirmed" type: return activate: false
  message from: "Web App" to: "Customer" label: "Receipt" type: return
}
```

### Timeline with Forest Theme

```runiq
timeline "Sustainability Initiative" {
  theme forest

  event assessment date:"2024-01-15" label:"Initial Assessment"
    description:"Carbon footprint analysis"
    icon:"leaf"

  event planning date:"2024-03-01" label:"Action Plan"
    description:"Define sustainability goals"

  event implementation date:"2024-06-01" label:"Start Implementation"
    description:"Begin green initiatives"
    color:"#2E7D32"

  event review date:"2024-12-01" label:"Annual Review"
    description:"Measure impact and progress"
    icon:"chart-bar"

  period phase1 startDate:"2024-01-15" endDate:"2024-05-31"
    label:"Planning Phase"
    color:"#C8E6C9"

  period phase2 startDate:"2024-06-01" endDate:"2024-12-31"
    label:"Implementation Phase"
    color:"#A5D6A7"

  orientation horizontal
}
```

### Glyphset with Sunset Theme

```runiq
glyphset pyramid "Product Maturity" {
  theme sunset

  level "Innovators"
  level "Early Adopters"
  level "Early Majority"
  level "Late Majority"
  level "Laggards"
}
```

## Theme Behavior by Profile

### Standard Diagrams

- **Nodes**: Theme colors cycle through nodes automatically
- **Edges**: Use theme's default edge color
- **Containers**: Subtle theme-based backgrounds
- **Override**: Individual node `fill` and `stroke` properties override theme

### Sequence Diagrams

- **Participants**: Each participant gets a unique theme color
- **Messages**: Theme-based arrow colors
- **Activation boxes**: Highlighted with theme colors
- **Lifelines**: Theme-coordinated styling

### Timeline Diagrams

- **Events**: Default marker colors from theme
- **Periods**: Background colors from theme palette
- **Milestones**: Accent colors for key events
- **Override**: Individual `color` properties override theme

### Glyphsets

- **Levels/Steps**: Sequential colors from theme palette
- **Backgrounds**: Theme-coordinated fills
- **Text**: Contrasting colors for readability
- **Icons**: Theme-tinted when applicable

## Best Practices

### 1. Match Theme to Content

Choose themes that reinforce your message:

```runiq
// Technical documentation
diagram "API Architecture" {
  theme cool  // Analytical, tech-focused
  // ...
}

// Growth metrics
glyphset funnel "User Adoption" {
  theme forest  // Growing, positive
  // ...
}

// Creative workflow
sequence "Design Process" {
  theme vibrant  // Creative, energetic
  // ...
}
```

### 2. Consistency Across Documents

Use the same theme for related diagrams:

```runiq
// Document: "Q4 Roadmap"

diagram "Q4 Architecture" {
  theme ocean
  // ...
}

timeline "Q4 Milestones" {
  theme ocean  // Same theme
  // ...
}

sequence "Q4 Deployment Flow" {
  theme ocean  // Same theme
  // ...
}
```

### 3. Consider Your Audience

- **Executive presentations**: `professional`, `runiq`
- **Technical teams**: `cool`, `monochrome`
- **Marketing materials**: `vibrant`, `warm`
- **Environmental reports**: `forest`, `ocean`
- **Creative teams**: `sunset`, `colorful`

### 4. Accessibility

All themes provide:

- Sufficient contrast between text and backgrounds
- Distinguishable color differences
- Compatibility with common forms of color blindness
- Professional appearance in both digital and print

### 5. Override When Needed

Themes provide defaults, but you can override specific colors:

```runiq
diagram "Mixed Styling" {
  theme ocean  // Base theme

  shape important as @rect label:"Critical" fillColor:"#DC2626"  // Override with red
  shape normal as @rect label:"Normal"  // Uses ocean theme color
  shape info as @rect label:"Info" fillColor:"#3B82F6"  // Override with blue
}
```

## Syntax Note

Theme names are unquoted keywords:

```runiq
diagram "My Diagram" {
  theme ocean
}
```

## Future Enhancements

Planned theme features:

- Custom theme definitions in DSL
- Theme inheritance and composition
- Per-element theme overrides
- Gradient and pattern themes
- Accessibility-focused themes (high contrast, colorblind-friendly)
- Theme import/export
- Theme preview in editor

## Related Documentation

- [Glyphset Themes](/reference/glyphset-themes) - Glyphset-specific theme details
- [DSL Syntax Reference](/DSL-SYNTAX-REFERENCE) - Complete syntax guide
- [Styling](/guide/styling) - Advanced styling options
