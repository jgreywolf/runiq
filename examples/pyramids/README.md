# Pyramid Diagrams

Pyramid diagrams are hierarchical visualizations showing stacked layers with proportional widths based on values. Perfect for representing hierarchies, funnels, and structured concepts.

## Examples

### 1. Maslow's Hierarchy (`maslow-hierarchy.json`)
Classic psychological model showing human needs from basic (physiological) to advanced (self-actualization).

```json
{
  "levels": [
    { "label": "Self-Actualization", "value": 10 },
    { "label": "Esteem", "value": 30 },
    { "label": "Love & Belonging", "value": 50 },
    { "label": "Safety Needs", "value": 70 },
    { "label": "Physiological Needs", "value": 100 }
  ],
  "colors": ["#9f7aea", "#ed8936", "#48bb78", "#4299e1", "#f56565"],
  "showValues": true
}
```

### 2. Organizational Structure (`organizational-structure.json`)
Company hierarchy showing employee distribution across levels.

```json
{
  "levels": [
    { "label": "CEO", "value": 1 },
    { "label": "VP & Directors", "value": 5 },
    { "label": "Senior Managers", "value": 15 },
    { "label": "Team Leads", "value": 45 },
    { "label": "Individual Contributors", "value": 180 }
  ],
  "showValues": true
}
```

## Data Format

```typescript
{
  levels: Array<{
    label: string;    // Text displayed in the level
    value: number;    // Determines proportional width
  }>;
  colors?: string[];  // Optional custom colors (cycles if fewer than levels)
  showValues?: boolean; // Display numeric values (default: false)
}
```

## Features

- **Proportional Scaling**: Each level's width is scaled based on its value relative to the maximum
- **Stacked Trapezoids**: Smooth transition from narrow top to wide bottom
- **Custom Colors**: 8-color default palette, or provide your own
- **Optional Values**: Toggle numeric display per level
- **Auto-Sizing**: Bounds calculated dynamically based on level count

## Use Cases

### Business
- Organizational hierarchies
- Sales funnels (use with inverted colors)
- Market segmentation
- Customer lifetime value stages

### Education
- Maslow's hierarchy of needs
- Bloom's taxonomy
- Learning progression models
- Knowledge depth levels

### Analysis
- Food pyramids
- Population demographics
- Priority frameworks
- Risk assessment levels

## Comparison with Competitors

| Feature | Runiq | Mermaid | PlantUML | Draw.io |
|---------|-------|---------|----------|---------|
| Data-driven rendering | ✅ Yes | ❌ No | ❌ No | ❌ Manual |
| Proportional widths | ✅ Auto | ❌ Manual | ❌ Manual | ❌ Manual |
| Programmatic API | ✅ Yes | ❌ No | ❌ No | ❌ No |
| Custom colors | ✅ Yes | ⚠️ Limited | ⚠️ Limited | ✅ Yes |
| Value display | ✅ Toggle | ❌ No | ❌ No | ⚠️ Manual |

**Runiq Advantage**: Fully data-driven with automatic proportional scaling. Competitors require manual adjustment of each level's width.

## Customization

### Color Schemes

**Professional** (default):
```json
["#4299e1", "#48bb78", "#ed8936", "#9f7aea", "#f56565", "#38b2ac", "#ecc94b", "#667eea"]
```

**Corporate**:
```json
["#1e3a8a", "#1e40af", "#3b82f6", "#60a5fa", "#93c5fd"]
```

**Earth Tones**:
```json
["#78350f", "#92400e", "#b45309", "#d97706", "#f59e0b"]
```

### Level Count
- **Minimum**: 1 level (single box)
- **Recommended**: 3-7 levels for readability
- **Maximum**: No hard limit, but >10 levels may become cramped
- Bounds auto-scale: `height = levelCount * 40 + 40`
