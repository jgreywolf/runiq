# Wardley Map Examples

This directory contains example Wardley Maps demonstrating strategic mapping capabilities.

## What Are Wardley Maps?

Wardley Maps are strategic mapping tools created by Simon Wardley for visualizing business landscapes, technology evolution, and value chains. They help organizations:

- Understand competitive positioning
- Plan strategic moves
- Identify build vs. buy decisions
- Map technology evolution
- Analyze value chain dependencies

## Examples in This Directory

### tea-shop.runiq

The classic Simon Wardley "Tea Shop" example demonstrating a simple business value chain.

**Components:**
- 7 components from user-visible (Cup of Tea) to infrastructure (Power)
- Evolution from custom-built (0.8) to complete commodity (1.0)
- Clear value chain showing all dependencies

**Key Concepts:**
- User anchor at top (high value)
- Commodity utilities at bottom (low value)
- Dependencies flow upward through value chain

**Render:**
```bash
runiq render tea-shop.runiq -o tea-shop.svg
```

### technology-evolution.runiq

Modern web application stack showing strategic technology evolution.

**Components:**
- 13 components including emerging technologies (Serverless, Edge Computing)
- Multiple evolution stages from genesis to commodity
- Inertia indicator on Mobile App (resistance to change)
- 3 evolution arrows showing strategic movements

**Key Concepts:**
- Emerging technologies (evolution: 0.3-0.5)
- Product stage platforms (evolution: 0.6-0.8)
- Commodity infrastructure (evolution: 0.9-1.0)
- Strategic evolution planning

**Render:**
```bash
runiq render technology-evolution.runiq -o tech-evolution.svg
```

## Coordinate System

### Evolution Axis (X-axis)

| Range | Stage | Characteristics |
|-------|-------|----------------|
| 0.0 - 0.25 | Genesis | Novel, uncertain, experimental |
| 0.25 - 0.50 | Custom Built | Bespoke, artisanal solutions |
| 0.50 - 0.75 | Product | Standardized, competitive |
| 0.75 - 1.00 | Commodity | Utility, ubiquitous |

### Value Chain Axis (Y-axis)

| Range | Visibility | Description |
|-------|-----------|-------------|
| 0.0 - 0.3 | Invisible | Deep infrastructure |
| 0.3 - 0.6 | Supporting | Backend services |
| 0.6 - 0.9 | Visible | User-facing features |
| 0.9 - 1.0 | Anchor | User needs |

## Quick Syntax Reference

```runiq
wardley "Map Title"

# User need (rendered as star)
anchor "Need" value:0.95

# Components (rendered as circles)
component "Name" evolution:0.75 value:0.85 label:"Description" inertia:true

# Dependencies (rendered as arrows)
dependency from:"Source" to:"Target"

# Evolution movement (rendered as dashed arrow)
evolve "Component" to evolution:0.9
```

## Visual Elements

- **Components**: Circles positioned at (evolution, value) coordinates
- **Dependencies**: Solid arrows showing value chain connections
- **Anchors**: 5-pointed stars for user needs
- **Evolution Indicators**: Dashed arrows showing strategic movement
- **Inertia**: Dotted component borders indicating resistance to change
- **Grid**: 4×4 reference grid with axis labels

## Creating Your Own Maps

1. **Start with user needs** - Define anchors at high value (0.9+)
2. **Add visible components** - User-facing features (value: 0.7-0.9)
3. **Map dependencies** - Show value chain connections
4. **Position by evolution** - Be honest about maturity (0.0-1.0)
5. **Add strategic moves** - Use evolve statements for planned evolution
6. **Mark inertia** - Identify resistance to change

## Strategic Analysis Tips

### Identify Opportunities

- **Commodities**: Can you switch from build to buy?
- **Genesis**: Where can you innovate and differentiate?
- **Product Stage**: Should you standardize or customize?
- **Inertia**: What organizational changes are needed?

### Common Patterns

**Technical Debt:**
```runiq
component "Legacy System" evolution:0.85 value:0.5 inertia:true
evolve "Legacy System" to evolution:0.95  # Migrate to commodity
```

**Innovation:**
```runiq
component "Novel Feature" evolution:0.15 value:0.8 label:"Differentiator"
evolve "Novel Feature" to evolution:0.45  # Move to custom-built
```

**Platform Strategy:**
```runiq
component "Custom Platform" evolution:0.55 value:0.6
component "Cloud Service" evolution:0.95 value:0.3
dependency from:"Custom Platform" to:"Cloud Service"
```

## Learn More

For complete documentation, see:
- [Wardley Maps Documentation](/docs/examples/wardley-maps.md)
- [Simon Wardley's Book (free)](https://medium.com/wardleymaps)
- [LearnWardleyMapping.com](https://learnwardleymapping.com/)

## CLI Usage

```bash
# Render to SVG
runiq render <input.runiq> -o <output.svg>

# Customize dimensions
runiq render map.runiq -o map.svg --width 1200 --height 800

# View help
runiq render --help
```

## Web Editor

Open the Runiq web editor and select "Wardley Map" from the New Diagram dialog:

1. Choose purple "Wardley Map" option
2. Edit the default template or start from scratch
3. Live preview updates as you type
4. Access 5 template examples in the Toolbox

## File Format

All `.runiq` files are plain text DSL files that can be:
- Edited in any text editor
- Version controlled with git
- Shared and collaborated on
- Rendered to SVG via CLI or web editor

Example:
```runiq
wardley "My Strategy"
anchor "User Goal" value:0.95
component "Feature" evolution:0.6 value:0.85
dependency from:"Feature" to:"Infrastructure"
```
