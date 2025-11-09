# Sankey Diagrams

Sankey diagrams are flow diagrams that visualize the flow of materials, energy, money, or other quantities between processes, with the width of arrows proportional to the flow quantity.

## Quick Start

### Using the Data Panel (Recommended)

In the Runiq editor, you have two panels:

**DSL Editor (Syntax):**
```runiq
diagram "Energy Flow" {
  shape energy as @sankeyChart label:"Energy Distribution"
}
```

**Data Panel (JSON):**
```json
{
  "energy": {
    "nodes": [
      { "id": "Coal", "label": "Coal Power", "color": "#8B4513" },
      { "id": "Solar", "label": "Solar Energy", "color": "#FFD700" },
      { "id": "Grid", "label": "Power Grid", "color": "#32CD32" },
      { "id": "Homes", "label": "Residential", "color": "#FF69B4" }
    ],
    "links": [
      { "source": "Coal", "target": "Grid", "value": 300 },
      { "source": "Solar", "target": "Grid", "value": 100 },
      { "source": "Grid", "target": "Homes", "value": 380 }
    ]
  }
}
```

The shape ID (`energy`) automatically matches the key in your JSON data. The Sankey shape looks for `nodes` and `links` arrays within that data object.

### Using External Files (Alternative)

For standalone `.runiq` files, you can reference external JSON:

```runiq
diagram "Energy Flow" {
  datasource "json" key:energyData from:"energy-flow.json"
  shape energy as @sankeyChart from:energyData
}
```

## Data Format

Sankey diagrams use a structured data format with two main components:

### Nodes Array

Each node represents a step or entity in the flow:

```javascript
{
  id: "unique-id",          // Required: unique identifier
  label: "Display Name",    // Optional: shown on diagram
  color: "#4a90e2"          // Optional: node color (hex or CSS color name)
}
```

### Links Array

Each link represents a flow between two nodes:

```javascript
{
  source: "source-node-id",  // Required: ID of source node
  target: "target-node-id",  // Required: ID of target node
  value: 100,                // Required: flow quantity (determines width)
  color: "#e74c3c"           // Optional: flow color
}
```

## Features

### Variable Width Flows

Flow widths automatically scale based on their values. The thickest flow represents the maximum value, and all others scale proportionally:

**DSL:**
```runiq
diagram "Water Usage" {
  shape water as @sankeyChart label:"Water Distribution"
}
```

**Data:**
```json
{
  "water": {
    "nodes": [
      { "id": "Supply", "label": "Water Supply" },
      { "id": "Home", "label": "Home Use" },
      { "id": "Garden", "label": "Garden" },
      { "id": "Waste", "label": "Waste" }
    ],
    "links": [
      { "source": "Supply", "target": "Home", "value": 1000 },
      { "source": "Supply", "target": "Garden", "value": 500 },
      { "source": "Home", "target": "Waste", "value": 50 }
    ]
  }
}
```

### Automatic Layout

Sankey diagrams automatically organize nodes into columns (layers) based on the flow direction:

- **Source nodes** (no incoming flows) appear on the left
- **Intermediate nodes** appear in the middle
- **Sink nodes** (no outgoing flows) appear on the right

The algorithm uses topological sorting to ensure flows always go left-to-right.

### Custom Colors

You can customize colors for both nodes and flows:

**DSL:**
```runiq
diagram "Colored Flows" {
  shape flows as @sankeyChart label:"Hot & Cold Water Mixing"
}
```

**Data:**
```json
{
  "flows": {
    "nodes": [
      { "id": "A", "label": "Hot Water", "color": "#e74c3c" },
      { "id": "B", "label": "Cold Water", "color": "#3498db" },
      { "id": "C", "label": "Mixed", "color": "#9b59b6" }
    ],
    "links": [
      { "source": "A", "target": "C", "value": 60, "color": "#e74c3c" },
      { "source": "B", "target": "C", "value": 40, "color": "#3498db" }
    ]
  }
}
```

### Custom Dimensions

You can specify custom dimensions in your data:

**Data:**
```json
{
  "large": {
    "width": 1200,
    "height": 800,
    "nodes": [...],
    "links": [...]
  }
}
```

## Use Cases

### 1. Energy Distribution

Track energy sources through generation, transmission, and consumption:

**DSL:**
```runiq
diagram "Energy Grid" {
  shape energy as @sankeyChart label:"Energy Distribution Network"
}
```

**Data:**
```json
{
  "energy": {
    "nodes": [
      { "id": "Coal", "label": "Coal", "color": "#8B4513" },
      { "id": "Gas", "label": "Natural Gas", "color": "#4682B4" },
      { "id": "Solar", "label": "Solar", "color": "#FFD700" },
      { "id": "Wind", "label": "Wind", "color": "#87CEEB" },
      { "id": "Power", "label": "Power Plant", "color": "#DC143C" },
      { "id": "Grid", "label": "Grid", "color": "#32CD32" },
      { "id": "Residential", "label": "Residential", "color": "#FF69B4" },
      { "id": "Industrial", "label": "Industrial", "color": "#FF8C00" }
    ],
    "links": [
      { "source": "Coal", "target": "Power", "value": 300 },
      { "source": "Gas", "target": "Power", "value": 200 },
      { "source": "Solar", "target": "Grid", "value": 100 },
      { "source": "Wind", "target": "Grid", "value": 80 },
      { "source": "Power", "target": "Grid", "value": 480 },
      { "source": "Grid", "target": "Residential", "value": 250 },
      { "source": "Grid", "target": "Industrial", "value": 310 }
    ]
  }
}
```

### 2. Material Flow

Visualize material movement through manufacturing processes:

**DSL:**
```runiq
diagram "Manufacturing" {
  shape materials as @sankeyChart label:"Production Material Flow"
}
```

**Data:**
```json
{
  "materials": {
    "nodes": [
      { "id": "RawMat", "label": "Raw Materials" },
      { "id": "Proc1", "label": "Processing A" },
      { "id": "Proc2", "label": "Processing B" },
      { "id": "Assembly", "label": "Assembly" },
      { "id": "QA", "label": "Quality Check" },
      { "id": "Shipping", "label": "Shipping" },
      { "id": "Waste", "label": "Waste/Recycling" }
    ],
    "links": [
      { "source": "RawMat", "target": "Proc1", "value": 1000 },
      { "source": "RawMat", "target": "Proc2", "value": 800 },
      { "source": "Proc1", "target": "Assembly", "value": 900 },
      { "source": "Proc1", "target": "Waste", "value": 100 },
      { "source": "Proc2", "target": "Assembly", "value": 700 },
      { "source": "Proc2", "target": "Waste", "value": 100 },
      { "source": "Assembly", "target": "QA", "value": 1600 },
      { "source": "QA", "target": "Shipping", "value": 1500 },
      { "source": "QA", "target": "Waste", "value": 100 }
    ]
  }
}
```

### 3. User Journey Conversion

Show user drop-off through a conversion funnel:

**DSL:**
```runiq
diagram "Conversion Funnel" {
  shape funnel as @sankeyChart label:"E-commerce Conversion Flow"
}
```

**Data:**
```json
{
  "funnel": {
    "nodes": [
      { "id": "Visitors", "label": "Website Visitors" },
      { "id": "Landing", "label": "Landing Page" },
      { "id": "Product", "label": "Product Page" },
      { "id": "Cart", "label": "Shopping Cart" },
      { "id": "Checkout", "label": "Checkout" },
      { "id": "Purchase", "label": "Purchase Complete" },
      { "id": "Bounce", "label": "Bounced" }
    ],
    "links": [
      { "source": "Visitors", "target": "Landing", "value": 10000 },
      { "source": "Landing", "target": "Product", "value": 6000 },
      { "source": "Landing", "target": "Bounce", "value": 4000 },
      { "source": "Product", "target": "Cart", "value": 3000 },
      { "source": "Product", "target": "Bounce", "value": 3000 },
      { "source": "Cart", "target": "Checkout", "value": 1500 },
      { "source": "Cart", "target": "Bounce", "value": 1500 },
      { "source": "Checkout", "target": "Purchase", "value": 1200 },
      { "source": "Checkout", "target": "Bounce", "value": 300 }
    ]
  }
}
```

### 4. Budget Allocation

Track financial flows from sources to departments to projects:

**DSL:**
```runiq
diagram "Budget Flow" {
  shape budget as @sankeyChart label:"Annual Budget Allocation"
}
```

**Data:**
```json
{
  "budget": {
    "nodes": [
      { "id": "Revenue", "label": "Total Revenue" },
      { "id": "OpEx", "label": "Operating Expenses" },
      { "id": "CapEx", "label": "Capital Expenses" },
      { "id": "Engineering", "label": "Engineering" },
      { "id": "Marketing", "label": "Marketing" },
      { "id": "Sales", "label": "Sales" },
      { "id": "Infrastructure", "label": "Infrastructure" },
      { "id": "R&D", "label": "R&D Projects" }
    ],
    "links": [
      { "source": "Revenue", "target": "OpEx", "value": 5000000 },
      { "source": "Revenue", "target": "CapEx", "value": 2000000 },
      { "source": "OpEx", "target": "Engineering", "value": 2000000 },
      { "source": "OpEx", "target": "Marketing", "value": 1500000 },
      { "source": "OpEx", "target": "Sales", "value": 1500000 },
      { "source": "CapEx", "target": "Infrastructure", "value": 1200000 },
      { "source": "CapEx", "target": "R&D", "value": 800000 }
    ]
  }
}
```

## Best Practices

### 1. Keep It Simple

**DON'T**: Create overly complex diagrams with too many nodes (limit to 8-12 nodes for clarity)

**DO**: Focus on the most important flows and group minor ones together

### 2. Use Meaningful Colors

Group related flows with similar colors. For example, use warm colors for traditional energy sources and cool colors for renewable sources.

### 3. Balance Flow Conservation

Ensure flows balance (what goes in equals what goes out):

```javascript
// ✅ Balanced
{ source: "A", target: "C", value: 100 },
{ source: "B", target: "C", value: 50 },
{ source: "C", target: "D", value: 150 }  // 100 + 50 = 150

// ⚠️ Unbalanced (acceptable but may look odd)
{ source: "A", target: "C", value: 100 },
{ source: "C", target: "D", value: 80 }   // Where did 20 go?
```

### 4. Handle Cycles Carefully

The layout algorithm supports cycles, but they can reduce readability. If you need to show recycling or feedback loops, consider adding visual indicators or labels to clarify the flow direction.

## Technical Details

### Layout Algorithm

1. **Topological Sort**: Assigns nodes to layers (columns) based on dependencies
2. **Value Calculation**: Computes total flow through each node
3. **Vertical Positioning**: Distributes nodes within each layer
4. **Flow Rendering**: Draws curved paths with widths proportional to values

### Flow Width Calculation

```javascript
flowWidth = (linkValue / maxLinkValue) * maxWidth
```

where `maxWidth = 80` pixels

### SVG Rendering

Flows use SVG `<path>` elements with cubic Bezier curves:

```svg
<path d="M x1 y1 C cx1 cy1, cx2 cy2, x2 y2 ..." fill="color" opacity="0.4" />
```

## Limitations

1. **Not Interactive**: Current implementation is static SVG (no hover/click)
2. **Fixed Layout**: Nodes are automatically positioned (no manual control)
3. **Left-to-Right Only**: Flows always go left-to-right
4. **No Multi-Level**: Doesn't support nested or hierarchical Sankey diagrams

## Related Diagram Types

- **Bar Charts** - for comparing quantities across categories
- **Line Charts** - for showing trends over time
- **Venn Diagrams** - for showing set relationships
- **Network Diagrams** - for showing graph structures

## Examples

See example files:

- `examples/sankey-energy-flow.runiq` - Energy distribution system
- `examples/sankey-material-flow.runiq` - Manufacturing material flow

## API Reference

```typescript
interface SankeyNode {
  id: string;              // Unique node identifier
  label?: string;          // Display label (defaults to id)
  color?: string;          // Node color (CSS color or hex)
}

interface SankeyLink {
  source: string;          // Source node ID
  target: string;          // Target node ID
  value: number;           // Flow quantity
  color?: string;          // Flow color (optional)
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
  width?: number;          // Chart width (default: 800)
  height?: number;         // Chart height (default: 600)
}
```
