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

### professional (default)

Classic blue tones for business and technical diagrams.

- **Colors**: Blue gradient (#5B9BD5 → #A5A5A5)
- **Best for**: Business presentations, technical documentation
- **Example**: `theme professional`

### forest

Natural greens and earth tones inspired by nature.

- **Colors**: Dark to light greens (#2D5016 → #B8D4A0)
- **Best for**: Environmental topics, growth concepts, organic processes
- **Example**: `theme forest`

### sunset

Warm oranges, reds, and purples.

- **Colors**: Vibrant warm palette (#E63946 → #D64161)
- **Best for**: Creative projects, energy, passion, urgency
- **Example**: `theme sunset`

### ocean

Cool blues and teals inspired by the sea.

- **Colors**: Deep to light blues (#023E8A → #90E0EF)
- **Best for**: Technology, trust, calm, stability
- **Example**: `theme ocean`

### monochrome

Sophisticated grayscale palette.

- **Colors**: Dark to light grays (#2C3E50 → #A8B4C0)
- **Best for**: Professional documents, minimalist designs, focus on structure
- **Example**: `theme monochrome`

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

### Radial Cycle with Sunset Theme

```runiq
glyphset radialCycle "Creative Process" {
  theme sunset
  item "Ideate"
  item "Design"
  item "Build"
  item "Test"
  item "Launch"
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
