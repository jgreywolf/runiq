# Venn Diagram Examples

Venn diagrams for showing overlaps and intersections between sets. Perfect for:

- Market analysis and customer segmentation
- Skill overlap analysis
- Feature comparisons
- Statistical set analysis

## 📊 Available Shapes

### `venn-2` - Two-Circle Venn Diagram

Shows overlap between two sets.

**Data Format:**

```json
{
  "setA": <number>,           // Total size of set A
  "setB": <number>,           // Total size of set B
  "intersection": <number>,   // Size of overlap (A ∩ B)
  "labelA": <string>,         // Label for set A (optional, default: "Set A")
  "labelB": <string>,         // Label for set B (optional, default: "Set B")
  "colors": [<color1>, <color2>]  // Custom colors (optional)
}
```

**Calculations:**

- Only A = setA - intersection
- Only B = setB - intersection
- Both = intersection

### `venn-3` - Three-Circle Venn Diagram

Shows overlaps between three sets with all possible intersections.

**Data Format:**

```json
{
  "setA": <number>,           // Total size of set A
  "setB": <number>,           // Total size of set B
  "setC": <number>,           // Total size of set C
  "AB": <number>,             // Size of A ∩ B (including ABC)
  "AC": <number>,             // Size of A ∩ C (including ABC)
  "BC": <number>,             // Size of B ∩ C (including ABC)
  "ABC": <number>,            // Size of A ∩ B ∩ C (center intersection)
  "labelA": <string>,         // Label for set A (optional)
  "labelB": <string>,         // Label for set B (optional)
  "labelC": <string>,         // Label for set C (optional)
  "colors": [<color1>, <color2>, <color3>]  // Custom colors (optional)
}
```

**Calculations:**

- Only A = setA - AB - AC + ABC
- Only B = setB - AB - BC + ABC
- Only C = setC - AC - BC + ABC
- Only AB (not C) = AB - ABC
- Only AC (not B) = AC - ABC
- Only BC (not A) = BC - ABC
- ABC = center intersection

## 📁 Examples

### Market Overlap Analysis (2-circle)

**File:** `market-overlap.json`

Analyzes customer overlap between two products.

**Data:**

- Product A Users: 500 total (350 unique + 150 shared)
- Product B Users: 450 total (300 unique + 150 shared)
- Both Products: 150 users

**Rendering:**

```bash
node packages/cli/dist/cli.js render examples/venn-diagrams/market-overlap.json > output.svg
```

### Developer Skills Analysis (3-circle)

**File:** `developer-skills.json`

Shows overlapping skills among developers knowing JavaScript, Python, and TypeScript.

**Data:**

- JavaScript: 1200 total
- Python: 1000 total
- TypeScript: 800 total
- Various overlaps including 150 developers knowing all three

**Rendering:**

```bash
node packages/cli/dist/cli.js render examples/venn-diagrams/developer-skills.json > output.svg
```

## 🎨 Customization

### Colors

Both Venn diagram types support custom colors:

```json
"colors": ["#4299e1", "#48bb78", "#ed8936"]
```

Default palette:

- Blue: `#4299e1`
- Green: `#48bb78`
- Orange: `#ed8936`

### Transparency

Circles are rendered with semi-transparency to show overlapping regions:

- 2-circle: 50% opacity
- 3-circle: 40% opacity (more transparent for better visibility with 3 overlaps)

## 🔍 Use Cases

### Business & Marketing

- Customer segment overlap
- Market share analysis
- Product feature comparison
- Target audience analysis

### Education & Research

- Survey response overlap
- Experimental group analysis
- Classification systems
- Literature review coverage

### Technology & Development

- Skill set analysis (as shown in example)
- Feature compatibility matrices
- Test coverage overlap
- Technology stack commonality

## 📊 Visual Features

✅ Semi-transparent overlapping circles  
✅ Automatic calculation of exclusive regions  
✅ Value labels in each region  
✅ Set labels positioned outside circles  
✅ Custom color support  
✅ Responsive sizing  
✅ Clean, professional SVG output

## 🆚 Comparison with Other Tools

| Feature                | Runiq | Mermaid    | Draw.io   | Lucidchart |
| ---------------------- | ----- | ---------- | --------- | ---------- |
| Data-driven 2-circle   | ✅    | ⚠️ Basic   | ❌ Manual | ❌ Manual  |
| Data-driven 3-circle   | ✅    | ❌         | ❌ Manual | ❌ Manual  |
| Auto-calculate regions | ✅    | ❌         | ❌        | ❌         |
| Custom colors          | ✅    | ⚠️ Limited | ✅        | ✅         |
| DSL syntax             | ✅    | ✅         | ❌        | ❌         |
| JSON API               | ✅    | ❌         | ❌        | ❌         |

**Runiq Advantages:**

- Fully data-driven (just provide numbers, get diagram)
- Automatic calculation of exclusive regions
- Both JSON and DSL support
- Programmatic generation via API
- Clean, accessible SVG output

## 🚀 Next Steps

1. Try modifying the example data values
2. Experiment with custom colors
3. Create your own Venn diagrams for your use cases
4. Combine with other Runiq shapes in larger diagrams

For DSL syntax support (coming soon), see task #15 in the roadmap.
