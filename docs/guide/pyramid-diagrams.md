---
title: Pyramid Diagrams
description: Create data-driven pyramid and hierarchy visualizations with proportional scaling and custom styling.
lastUpdated: 2025-11-17
---

# Pyramid Diagrams

Pyramid diagrams are hierarchical visualizations showing stacked layers with proportional widths based on values. Perfect for representing hierarchies, funnels, progression models, and structured concepts with quantitative relationships.

## Quick Start

### Simple Pyramid

```runiq
diagram "Basic Hierarchy" {
  shape id1 as @pyramid label:"Organizational Levels"
  data:[
    {"label":"Executive","value":5},
    {"label":"Management","value":20},
    {"label":"Staff","value":100}
  ]
}
```

**Output**: Three-tier pyramid with proportional widths - narrow top (5), medium middle (20), wide bottom (100).

## When to Use Pyramid Diagrams

Pyramids excel at:

- **Organizational Hierarchies** - Company structures with employee counts
- **Sales Funnels** - Lead progression through stages
- **Market Segmentation** - Customer distribution across tiers
- **Priority Frameworks** - Importance rankings
- **Population Demographics** - Age or income distributions
- **Learning Models** - Progression through knowledge levels
- **Food Pyramids** - Nutritional guidelines
- **Risk Assessment** - Severity levels

## Features

- **Proportional Scaling** - Each level's width automatically scaled by value
- **Stacked Trapezoids** - Smooth visual transition from top to bottom
- **Custom Colors** - 8-color default palette or custom schemes
- **Optional Values** - Toggle numeric display per level
- **Auto-Sizing** - Bounds calculated dynamically based on level count
- **Data-Driven** - Fully programmatic generation from JSON
- **Clean SVG** - Professional, accessible graphics

## Data Format

### Basic Structure

```typescript
// Data is provided as an array of level objects
[
  {
    label: string;    // Text displayed in the level
    value: number;    // Determines proportional width
  },
  // ... more levels
]

// Note: Colors and showValues are handled internally by the shape.
// The implementation supports these via the data object format in code,
// but the DSL syntax only accepts arrays.
```

### Default Color Palette

When colors are not specified, pyramids cycle through:

```typescript
[
  '#4299e1', // Blue
  '#48bb78', // Green
  '#ed8936', // Orange
  '#9f7aea', // Purple
  '#f56565', // Red
  '#38b2ac', // Teal
  '#ecc94b', // Yellow
  '#667eea', // Indigo
];
```

## Complete Example: Maslow's Hierarchy

```runiq

diagram "Psychological Needs" {

  style pyramidTitle fontSize:18 fontWeight:bold color:"#2d3748"

  shape maslow as @pyramid
    label:"Maslow's Hierarchy of Needs"
    data:[
      {"label": "Self-Actualization", "value": 10},
      {"label": "Esteem", "value": 30},
      {"label": "Love & Belonging", "value": 50},
      {"label": "Safety Needs", "value": 70},
      {"label": "Physiological Needs", "value": 100}
    ]
    style:pyramidTitle
}
```

**Visualization**: Classic psychological model showing human needs from advanced (narrow, 10%) to basic (wide, 100%).

## Complete Example: Organizational Structure

```runiq
diagram "Company Hierarchy" {

  style orgChart fontSize:16 fontWeight:600 color:"#1a202c"

  shape organization as @pyramid
    label:"Employee Distribution"
    data:[
      {"label": "CEO", "value": 1},
      {"label": "VP & Directors", "value": 5},
      {"label": "Senior Managers", "value": 15},
      {"label": "Team Leads", "value": 45},
      {"label": "Individual Contributors", "value": 180}
    ]
    style:orgChart
}
```

**Total Employees**: 246 (1 + 5 + 15 + 45 + 180)

## Complete Example: Sales Funnel

To create a "funnel", just reverse the order of the data:

```runiq
diagram "Lead Conversion" {

  style funnel fontSize:14 fontWeight:500

  shape sales as @pyramid
    label:"Sales Pipeline"
    data:[
      {"label": "Total Visitors", "value": 1000},
      {"label": "Marketing Leads", "value": 300},
      {"label": "Qualified Leads", "value": 120},
      {"label": "Negotiations", "value": 45},
      {"label": "Closed Deals", "value": 15}
    ]
}
```

**Conversion Rate**: 1.5% (15 deals from 1000 visitors)

## Styling Pyramids

### Color Schemes

**Professional (default):**

```runiq
colors:["#4299e1", "#48bb78", "#ed8936", "#9f7aea", "#f56565"]
```

**Corporate:**

```runiq
colors:["#1e3a8a", "#1e40af", "#3b82f6", "#60a5fa", "#93c5fd"]
```

**Earth Tones:**

```runiq
colors:["#78350f", "#92400e", "#b45309", "#d97706", "#f59e0b"]
```

**Monochrome Blue:**

```runiq
colors:["#1e3a8a", "#1e40af", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"]
```

**Warm Gradient:**

```runiq
colors:["#991b1b", "#dc2626", "#f97316", "#fb923c", "#fbbf24"]
```

### Typography

```runiq
style pyramidHeader fontSize:20 fontWeight:bold color:"#1a202c"
style pyramidText fontSize:14 fontWeight:500 color:"#4a5568"

shape pyramid as @pyramid
  label:"Title"
  data:{...}
  style:pyramidHeader
```

## Best Practices

### 1. Order Levels Appropriately

```runiq
// ✅ Good: Smallest to largest (top to bottom)
levels: [
  {"label": "Top Tier", "value": 10},
  {"label": "Middle Tier", "value": 50},
  {"label": "Base Tier", "value": 100}
]

// ❌ Bad: Random ordering loses pyramid meaning
levels: [
  {"label": "Middle", "value": 50},
  {"label": "Top", "value": 10},
  {"label": "Base", "value": 100}
]
```

### 2. Use Meaningful Values

```runiq
// ✅ Good: Real quantities
{"label": "Executives", "value": 12}
{"label": "Managers", "value": 48}
{"label": "Staff", "value": 240}

// ❌ Bad: Arbitrary numbers
{"label": "Top", "value": 1}
{"label": "Middle", "value": 2}
{"label": "Bottom", "value": 3}
```

### 3. Limit Level Count

- **3-5 levels**: Optimal readability
- **6-7 levels**: Acceptable for detailed hierarchies
- **8+ levels**: Consider grouping or alternative visualizations

### 4. Choose Contrasting Colors

```runiq
// ✅ Good: Clear visual distinction
colors:["#1e3a8a", "#22c55e", "#f59e0b", "#ef4444"]

// ❌ Bad: Similar shades hard to distinguish
colors:["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"]
```

### 5. Show Values for Quantitative Data

```runiq
// ✅ Good: Enable showValues for concrete numbers
data:{
  "levels": [...],
  "showValues": true
}

// ⚠️ Optional: Hide values for qualitative hierarchies
data:{
  "levels": [
    {"label": "High Priority", "value": 100},
    {"label": "Medium Priority", "value": 60},
    {"label": "Low Priority", "value": 30}
  ],
  "showValues": false
}
```

## Use Cases

### Business

**Employee Distribution:**

```runiq
diagram "Org Chart" {
  shape org as @pyramid data:[
    {"label": "C-Suite", "value": 5},
    {"label": "VPs", "value": 12},
    {"label": "Directors", "value": 35},
    {"label": "Managers", "value": 120},
    {"label": "Staff", "value": 450}
  ]
}
```

**Market Segmentation:**

```runiq
diagram "Customer Tiers" {
  shape market as @pyramid data:[
    {"label": "Premium", "value": 500},
    {"label": "Standard", "value": 2000},
    {"label": "Basic", "value": 8000}
  ]
}
```

### Education

**Bloom's Taxonomy:**

```runiq
diagram "Learning Levels" {
  shape bloom as @pyramid data:[
    {"label": "Create", "value": 10},
    {"label": "Evaluate", "value": 20},
    {"label": "Analyze", "value": 35},
    {"label": "Apply", "value": 50},
    {"label": "Understand", "value": 75},
    {"label": "Remember", "value": 100}
  ]
}
```

### Health & Nutrition

**Food Pyramid:**

```runiq
diagram "Nutritional Guidelines" {
  shape food as @pyramid data:[
    {"label": "Fats & Sweets (Use Sparingly)", "value": 5},
    {"label": "Dairy & Protein", "value": 20},
    {"label": "Vegetables & Fruits", "value": 40},
    {"label": "Grains & Cereals", "value": 50}
  ]
}
```

## Advanced Patterns

### Dynamic Generation from Data

```typescript
interface HierarchyLevel {
  name: string;
  count: number;
}

function generatePyramid(levels: HierarchyLevel[], title: string) {
  return {
    type: 'diagram',
    title: title,
    shapes: [
      {
        id: 'pyramid1',
        type: 'pyramid',
        properties: {
          label: title,
          data: {
            levels: levels.map((l) => ({
              label: l.name,
              value: l.count,
            })),
            showValues: true,
          },
        },
      },
    ],
    edges: [],
  };
}

// Usage
const orgLevels = [
  { name: 'CEO', count: 1 },
  { name: 'VPs', count: 4 },
  { name: 'Directors', count: 12 },
  { name: 'Managers', count: 50 },
  { name: 'Staff', count: 200 },
];

const diagram = generatePyramid(orgLevels, 'Organization');
```

### Database-Driven Hierarchies

```typescript
async function generateOrgPyramid(companyId: string) {
  const levels = await db.query(
    `
    SELECT role_level, COUNT(*) as count
    FROM employees
    WHERE company_id = ?
    GROUP BY role_level
    ORDER BY role_level
  `,
    [companyId]
  );

  return {
    type: 'diagram',
    title: 'Company Structure',
    shapes: [
      {
        id: 'org',
        type: 'pyramid',
        properties: {
          data: {
            levels: levels.map((l) => ({
              label: l.role_level,
              value: l.count,
            })),
            showValues: true,
          },
        },
      },
    ],
  };
}
```

## Sizing Guidelines

### Level Count vs Readability

```typescript
height = levelCount * 40 + 40; // Auto-calculated
```

- **1-3 levels**: Excellent readability, clear proportions
- **4-5 levels**: Good balance of detail and clarity
- **6-7 levels**: Acceptable, monitor text size
- **8+ levels**: Consider grouping similar levels

### Recommended Value Ranges

For best visual proportions:

- **Minimum ratio**: 1:10 (top vs bottom)
- **Optimal ratio**: 1:5 to 1:20
- **Maximum ratio**: 1:100 (beyond this, top becomes too narrow)

```runiq
// ✅ Good: Clear proportional differences
levels: [
  {"label": "Top", "value": 10},
  {"label": "Middle", "value": 50},
  {"label": "Bottom", "value": 100}
]

// ⚠️ Acceptable: Large ratio still works
levels: [
  {"label": "Top", "value": 1},
  {"label": "Bottom", "value": 100}
]

// ❌ Poor: Values too similar, pyramid looks flat
levels: [
  {"label": "Top", "value": 95},
  {"label": "Middle", "value": 98},
  {"label": "Bottom", "value": 100}
]
```

## Examples

Explore complete pyramid diagram examples:

**[View Pyramid Examples →](/examples/pyramid-diagrams)**

Includes:

- Maslow's Hierarchy of Needs (psychology)
- Organizational structure (business)
- Sales funnel (marketing)
- Learning progression (education)

## Comparison with Other Tools

| Feature                      | Runiq          | Mermaid | PlantUML | Lucidchart  | SmartDraw    | PowerPoint  | Canva        |
| ---------------------------- | -------------- | ------- | -------- | ----------- | ------------ | ----------- | ------------ |
| **Basic Support**            | ✅             | ❌      | ❌       | ✅          | ✅           | ✅          | ✅           |
| **Data-driven pyramids**     | ✅             | ❌      | ❌       | ⚠️ Manual   | ⚠️ Manual    | ⚠️ Manual   | ⚠️ Manual    |
| **Automatic proportions**    | ✅             | ❌      | ❌       | ❌          | ❌           | ❌          | ❌           |
| **Custom levels**            | ✅             | ❌      | ❌       | ✅          | ✅           | ✅          | ✅           |
| **Value-based sizing**       | ✅             | ❌      | ❌       | ❌          | ❌           | ❌          | ❌           |
| **Color customization**      | ✅             | ❌      | ❌       | ✅          | ✅           | ✅          | ✅           |
| **Inverted pyramids**        | ✅             | ❌      | ❌       | ✅          | ✅           | ✅          | ✅           |
| **Percentage labels**        | ✅             | ❌      | ❌       | ⚠️ Manual   | ⚠️ Manual    | ⚠️ Manual   | ⚠️ Manual    |
| **Automatic layout**         | ✅             | ❌      | ❌       | ❌          | ⚠️ Templates | ❌          | ⚠️ Templates |
| **Documentation generation** | ✅             | ❌      | ❌       | ⚠️ Partial  | ❌           | ❌          | ❌           |
| **Animation support**        | ❌             | ❌      | ❌       | ✅          | ⚠️ Limited   | ✅          | ✅           |
| **Text-based DSL**           | ✅             | ❌      | ❌       | ❌          | ❌           | ❌          | ❌           |
| **Version control friendly** | ✅             | ❌      | ❌       | ⚠️ Partial  | ❌           | ❌          | ❌           |
| **Export formats**           | SVG, PNG       | ❌      | ❌       | Multiple    | PDF, Image   | Multiple    | Multiple     |
| **Learning curve**           | Low            | ❌      | ❌       | Low         | Low          | Very Low    | Very Low     |
| **Cost**                     | Free           | ❌      | ❌       | Paid        | Paid         | Included    | Free/Paid    |
| **Platform**                 | Cross-platform | ❌      | ❌       | Web/Desktop | Windows/Mac  | Windows/Mac | Web          |

**Key Advantages of Runiq:**

- **Data-Driven**: Specify values, get perfectly proportioned pyramids automatically
- **Version Control**: Track hierarchy changes over time in Git
- **Programmatic**: Generate from business data, surveys, or analytics
- **Consistent**: Maintain standardized pyramid layouts across documentation

**When to Use Alternatives:**

- **PowerPoint/Canva**: Presentation-focused with animations and themes
- **SmartDraw**: Extensive template library for business users
- **Lucidchart**: Real-time collaboration with stakeholders
- **Mermaid/PlantUML**: Simple hierarchies in existing markdown documentation

## Related Documentation

- [Charts & Graphs](/guide/charts) - Other data visualization shapes
- [Hierarchy Glyphsets](/guide/glyphsets-hierarchy) - Pre-built hierarchy templates
- [Data-Driven Diagrams](/reference/data-driven) - Dynamic data binding
- [JSON Format](/reference/json) - Programmatic generation
- [Styling Guide](/guide/styling) - Advanced styling techniques

## Resources

- [Maslow's Hierarchy](https://en.wikipedia.org/wiki/Maslow%27s_hierarchy_of_needs) - Classic psychology model
- [Organizational Charts](https://en.wikipedia.org/wiki/Organizational_chart) - Business structures
- [Information Hierarchy](https://www.nngroup.com/articles/information-architecture-sitemaps-and-hierarchies/) - Design principles

---

**Next Steps**: Try creating a simple 3-level pyramid with your own data, then experiment with custom color schemes and value display options.
