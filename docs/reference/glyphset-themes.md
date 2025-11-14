# Glyphset Themes

Glyphsets support predefined color themes to quickly apply professional color schemes to your visualizations.

## Using Themes

Add a `theme` parameter to your glyphset definition:

```runiq
glyphset spiralCycle "My Diagram" {
  theme forest
  item "Step 1"
  item "Step 2"
  item "Step 3"
}
```

## Available Themes

### colorful (default)

Classic Office color palette with blues, oranges, and complementary colors.

- **Colors**: Blue (#4472C4), Orange (#ED7D31), Gray (#A5A5A5), Gold (#FFC000), Light Blue (#5B9BD5), Green (#70AD47)
- **Best for**: General presentations, diverse content, eye-catching diagrams
- **Example**: `theme colorful`

### professional

Professional gray-blue palette for business and technical diagrams.

- **Colors**: Gray-blue gradient (#546E7A → #90A4AE)
- **Best for**: Business presentations, technical documentation, corporate materials
- **Example**: `theme professional`

### monochrome

Monochrome blue palette for consistent, focused designs.

- **Colors**: Blue gradient (#4472C4 → #003366)
- **Best for**: Professional documents, minimalist designs, focus on structure
- **Example**: `theme monochrome`

### vibrant

Vibrant multi-color palette for energetic, modern diagrams.

- **Colors**: Red (#E74C3C), Blue (#3498DB), Green (#2ECC71), Orange (#F39C12), Purple (#9B59B6), Teal (#1ABC9C)
- **Best for**: Creative projects, marketing materials, youth-oriented content
- **Example**: `theme vibrant`

### warm

Warm spectrum with corals, oranges, and yellows.

- **Colors**: Coral (#FF6B6B), Orange (#FFB347), Yellow (#FFD93D), Peach (#FF8C42), Pink (#C44569)
- **Best for**: Friendly communications, creative work, emotional content, approachable designs
- **Example**: `theme warm`

### cool

Cool spectrum with cyans, blues, and purples.

- **Colors**: Cyan (#00B8D4), Blue (#0288D1), Purple (#5E35B1), Teal (#00897B), Indigo (#1A237E)
- **Best for**: Technology, innovation, calm, analytical content
- **Example**: `theme cool`

### forest

Natural greens and earth tones inspired by nature.

- **Colors**: Forest Green (#2E7D32), Medium Green (#43A047), Light Green (#66BB6A), Pale Green (#81C784)
- **Best for**: Environmental topics, growth concepts, organic processes, sustainability
- **Example**: `theme forest`

### sunset

Warm oranges and ambers inspired by sunset colors.

- **Colors**: Dark Orange (#FF6F00), Orange (#FF8F00), Light Orange (#FFA726), Amber (#FFA000)
- **Best for**: Creative projects, energy, passion, warmth, dynamic content
- **Example**: `theme sunset`

### ocean

Cool blues and teals inspired by the sea.

- **Colors**: Deep Ocean (#006064), Cyan (#00ACC1), Teal (#00897B), Light Teal (#80CBC4)
- **Best for**: Technology, trust, calm, stability, maritime themes
- **Example**: `theme ocean`

## Examples

### Spiral Cycle with Forest Theme

```runiq
glyphset spiralCycle "Growth Journey" {
  theme forest
  item "Seed"
  item "Sprout"
  item "Sapling"
  item "Tree"
  item "Forest"
}
```

### Basic Process with Vibrant Theme

```runiq
glyphset basicProcess "Creative Workflow" {
  theme vibrant
  step "Ideate"
  step "Design"
  step "Build"
  step "Launch"
}
```

### Radial Cycle with Sunset Theme

```runiq
glyphset radialCycle "Innovation Cycle" {
  theme sunset
  item "Research"
  item "Prototype"
  item "Test"
  item "Launch"
  item "Iterate"
}
```

### Orbit Cycle with Ocean Theme

```runiq
glyphset orbitCycle "Tech Ecosystem" {
  theme ocean
  item "Core Platform"
  item "Services"
  item "APIs"
  item "Partners"
  item "Developers"
  item "Users"
}
```

### Matrix with Cool Theme

```runiq
glyphset matrix "Strategy Matrix" {
  theme cool
  quadrant "Invest"
  quadrant "Experiment"
  quadrant "Optimize"
  quadrant "Divest"
}
```

### Organization Chart with Professional Theme

```runiq
glyphset orgChart "Team Structure" {
  theme professional
  person "CEO" {
    person "CTO"
    person "CFO"
    person "CMO"
  }
}
```

## Theme Selection Guide

| Theme | Mood | Use Cases |
|-------|------|-----------|
| **colorful** | Diverse, balanced | General presentations, mixed content |
| **professional** | Formal, corporate | Business docs, reports, formal presentations |
| **monochrome** | Minimalist, focused | Clean designs, emphasis on structure |
| **vibrant** | Energetic, modern | Creative work, marketing, youth content |
| **warm** | Friendly, approachable | Communications, emotional topics |
| **cool** | Calm, analytical | Technology, innovation, data analysis |
| **forest** | Natural, organic | Environmental, growth, sustainability |
| **sunset** | Dynamic, energetic | Creative, passion, warmth |
| **ocean** | Trustworthy, stable | Maritime, technology, calm |

## Tips

1. **Match theme to message** - Use warm colors for friendly content, cool colors for technical content
2. **Consistency** - Use the same theme across related diagrams in a document
3. **Audience** - Consider your audience's preferences and cultural associations with colors
4. **Accessibility** - All themes provide sufficient contrast for readability
5. **Branding** - Choose themes that align with your organization's brand colors

## Color Accessibility

All theme colors have been chosen to ensure:
- Sufficient contrast between text and backgrounds
- Distinguishable differences between adjacent colors
- Compatibility with common forms of color blindness
- Professional appearance in both digital and print formats

## Theme Support by Glyphset

Currently, the following glyphsets support themes:

- ✅ spiralCycle
- 🔄 radialCycle (coming soon)
- 🔄 gearCycle (coming soon)
- 🔄 segmentedCycle (coming soon)
- 🔄 blockCycle (coming soon)
- 🔄 orbitCycle (coming soon)

## Future Enhancements

- Custom themes defined in DSL
- Theme inheritance and overrides
- Per-item color overrides
- Gradient themes
- Accessibility-focused themes (high contrast, colorblind-friendly)
