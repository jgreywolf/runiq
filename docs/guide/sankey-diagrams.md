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

::: note Data Panel parsing
If you see `Parser error ... found {` after pasting JSON, the editor is parsing the JSON as DSL. This usually means the JSON was entered in the Syntax panel or the Data panel is not enabled in your editor build. In that case, use the external JSON workflow below.
:::

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
flowWidth = (linkValue / maxLinkValue) * maxWidth;
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

### Ready-to-Use Examples

Below are complete examples you can copy directly into the Runiq editor. Each example includes both the DSL syntax and the JSON data.

#### Example 1: Simple Water Flow

Track water usage from supply to various endpoints.

**Syntax Tab:**

```runiq
diagram "Water Usage" {
  shape water as @sankeyChart label:"Household Water Distribution"
}
```

**Data Tab:**

```json
{
  "water": {
    "nodes": [
      { "id": "Supply", "label": "Water Supply", "color": "#3498db" },
      { "id": "Home", "label": "Home Use", "color": "#2ecc71" },
      { "id": "Garden", "label": "Garden", "color": "#27ae60" },
      { "id": "Waste", "label": "Waste Water", "color": "#95a5a6" }
    ],
    "links": [
      { "source": "Supply", "target": "Home", "value": 1000 },
      { "source": "Supply", "target": "Garden", "value": 500 },
      { "source": "Home", "target": "Waste", "value": 950 }
    ]
  }
}
```

#### Example 2: Marketing Funnel with Multiple Channels

Track user acquisition through different marketing channels.

**Syntax Tab:**

```runiq
diagram "Marketing Attribution" {
  shape marketing as @sankeyChart label:"User Acquisition Channels"
}
```

**Data Tab:**

```json
{
  "marketing": {
    "nodes": [
      { "id": "Organic", "label": "Organic Search", "color": "#2ecc71" },
      { "id": "Social", "label": "Social Media", "color": "#3498db" },
      { "id": "PPC", "label": "Paid Ads", "color": "#e74c3c" },
      { "id": "Email", "label": "Email Campaign", "color": "#9b59b6" },
      { "id": "Website", "label": "Website Visitors", "color": "#f39c12" },
      { "id": "Trial", "label": "Trial Users", "color": "#1abc9c" },
      { "id": "Customers", "label": "Paying Customers", "color": "#16a085" }
    ],
    "links": [
      { "source": "Organic", "target": "Website", "value": 5000 },
      { "source": "Social", "target": "Website", "value": 3000 },
      { "source": "PPC", "target": "Website", "value": 2000 },
      { "source": "Email", "target": "Website", "value": 1500 },
      { "source": "Website", "target": "Trial", "value": 4000 },
      { "source": "Trial", "target": "Customers", "value": 800 }
    ]
  }
}
```

#### Example 3: Food Chain Energy Transfer

Visualize energy flow through an ecosystem.

**Syntax Tab:**

```runiq
diagram "Food Chain" {
  shape ecosystem as @sankeyChart label:"Energy Flow in Ecosystem"
}
```

**Data Tab:**

```json
{
  "ecosystem": {
    "nodes": [
      { "id": "Sun", "label": "Sunlight", "color": "#FFD700" },
      { "id": "Plants", "label": "Plants (Producers)", "color": "#2ecc71" },
      { "id": "Herbivores", "label": "Herbivores", "color": "#3498db" },
      { "id": "Carnivores", "label": "Carnivores", "color": "#e74c3c" },
      { "id": "Decomposers", "label": "Decomposers", "color": "#8B4513" },
      { "id": "Heat", "label": "Heat Loss", "color": "#95a5a6" }
    ],
    "links": [
      { "source": "Sun", "target": "Plants", "value": 10000 },
      { "source": "Plants", "target": "Herbivores", "value": 1000 },
      { "source": "Plants", "target": "Heat", "value": 8500 },
      { "source": "Herbivores", "target": "Carnivores", "value": 100 },
      { "source": "Herbivores", "target": "Heat", "value": 850 },
      { "source": "Carnivores", "target": "Heat", "value": 85 },
      { "source": "Carnivores", "target": "Decomposers", "value": 10 },
      { "source": "Plants", "target": "Decomposers", "value": 500 },
      { "source": "Herbivores", "target": "Decomposers", "value": 50 }
    ]
  }
}
```

#### Example 4: Supply Chain Flow

Track product movement through a supply chain.

**Syntax Tab:**

```runiq
diagram "Supply Chain" {
  shape supply as @sankeyChart label:"Product Supply Chain"
}
```

**Data Tab:**

```json
{
  "supply": {
    "nodes": [
      { "id": "Supplier1", "label": "Supplier A", "color": "#3498db" },
      { "id": "Supplier2", "label": "Supplier B", "color": "#2ecc71" },
      { "id": "Warehouse", "label": "Warehouse", "color": "#f39c12" },
      {
        "id": "DistCenter",
        "label": "Distribution Center",
        "color": "#9b59b6"
      },
      { "id": "Retail1", "label": "Retail North", "color": "#e74c3c" },
      { "id": "Retail2", "label": "Retail South", "color": "#e67e22" },
      { "id": "Returns", "label": "Returns/Defects", "color": "#95a5a6" }
    ],
    "links": [
      { "source": "Supplier1", "target": "Warehouse", "value": 5000 },
      { "source": "Supplier2", "target": "Warehouse", "value": 3000 },
      { "source": "Warehouse", "target": "DistCenter", "value": 7500 },
      { "source": "Warehouse", "target": "Returns", "value": 500 },
      { "source": "DistCenter", "target": "Retail1", "value": 4000 },
      { "source": "DistCenter", "target": "Retail2", "value": 3000 },
      { "source": "Retail1", "target": "Returns", "value": 200 },
      { "source": "Retail2", "target": "Returns", "value": 150 }
    ]
  }
}
```

#### Example 5: Data Center Traffic

Show network traffic distribution in a data center.

**Syntax Tab:**

```runiq
diagram "Data Center Traffic" {
  shape traffic as @sankeyChart label:"Network Traffic Flow"
}
```

**Data Tab:**

```json
{
  "traffic": {
    "nodes": [
      { "id": "Internet", "label": "Internet Gateway", "color": "#3498db" },
      { "id": "LoadBalancer", "label": "Load Balancer", "color": "#2ecc71" },
      { "id": "WebServers", "label": "Web Servers", "color": "#f39c12" },
      { "id": "AppServers", "label": "App Servers", "color": "#9b59b6" },
      { "id": "Database", "label": "Database Cluster", "color": "#e74c3c" },
      { "id": "Cache", "label": "Cache Layer", "color": "#1abc9c" },
      { "id": "CDN", "label": "CDN", "color": "#34495e" }
    ],
    "links": [
      { "source": "Internet", "target": "LoadBalancer", "value": 100000 },
      { "source": "LoadBalancer", "target": "CDN", "value": 40000 },
      { "source": "LoadBalancer", "target": "WebServers", "value": 60000 },
      { "source": "WebServers", "target": "AppServers", "value": 45000 },
      { "source": "WebServers", "target": "Cache", "value": 15000 },
      { "source": "AppServers", "target": "Database", "value": 15000 },
      { "source": "AppServers", "target": "Cache", "value": 30000 }
    ]
  }
}
```

#### Example 6: Financial Transaction Flow

Track money flow between accounts and services.

**Syntax Tab:**

```runiq
diagram "Financial Transactions" {
  shape finance as @sankeyChart label:"Monthly Transaction Flow"
}
```

**Data Tab:**

```json
{
  "finance": {
    "nodes": [
      { "id": "Income", "label": "Income", "color": "#2ecc71" },
      { "id": "Checking", "label": "Checking Account", "color": "#3498db" },
      { "id": "Savings", "label": "Savings", "color": "#1abc9c" },
      { "id": "Investment", "label": "Investments", "color": "#9b59b6" },
      { "id": "Rent", "label": "Rent/Mortgage", "color": "#e74c3c" },
      { "id": "Bills", "label": "Utilities & Bills", "color": "#e67e22" },
      { "id": "Food", "label": "Groceries", "color": "#f39c12" },
      { "id": "Entertainment", "label": "Entertainment", "color": "#16a085" }
    ],
    "links": [
      { "source": "Income", "target": "Checking", "value": 5000 },
      { "source": "Checking", "target": "Savings", "value": 1000 },
      { "source": "Checking", "target": "Investment", "value": 500 },
      { "source": "Checking", "target": "Rent", "value": 1500 },
      { "source": "Checking", "target": "Bills", "value": 400 },
      { "source": "Checking", "target": "Food", "value": 600 },
      { "source": "Checking", "target": "Entertainment", "value": 300 }
    ]
  }
}
```

#### Example 7: Recycling Process

Show material flow through a recycling facility.

**Syntax Tab:**

```runiq
diagram "Recycling Facility" {
  shape recycling as @sankeyChart label:"Material Recycling Flow"
}
```

**Data Tab:**

```json
{
  "recycling": {
    "nodes": [
      { "id": "Input", "label": "Mixed Waste Input", "color": "#95a5a6" },
      { "id": "Sorting", "label": "Sorting Station", "color": "#3498db" },
      { "id": "Paper", "label": "Paper/Cardboard", "color": "#f39c12" },
      { "id": "Plastic", "label": "Plastics", "color": "#e74c3c" },
      { "id": "Metal", "label": "Metals", "color": "#7f8c8d" },
      { "id": "Glass", "label": "Glass", "color": "#1abc9c" },
      { "id": "Recycle", "label": "Recycled Products", "color": "#2ecc71" },
      { "id": "Landfill", "label": "Landfill", "color": "#34495e" }
    ],
    "links": [
      { "source": "Input", "target": "Sorting", "value": 10000 },
      { "source": "Sorting", "target": "Paper", "value": 3000 },
      { "source": "Sorting", "target": "Plastic", "value": 2500 },
      { "source": "Sorting", "target": "Metal", "value": 1500 },
      { "source": "Sorting", "target": "Glass", "value": 1000 },
      { "source": "Sorting", "target": "Landfill", "value": 2000 },
      { "source": "Paper", "target": "Recycle", "value": 2800 },
      { "source": "Plastic", "target": "Recycle", "value": 2000 },
      { "source": "Metal", "target": "Recycle", "value": 1400 },
      { "source": "Glass", "target": "Recycle", "value": 950 }
    ]
  }
}
```

#### Example 8: Student Enrollment Flow

Track student progression through academic programs.

**Syntax Tab:**

```runiq
diagram "Student Flow" {
  shape students as @sankeyChart label:"Student Enrollment & Retention"
}
```

**Data Tab:**

```json
{
  "students": {
    "nodes": [
      { "id": "Applicants", "label": "Applications", "color": "#3498db" },
      { "id": "Accepted", "label": "Accepted", "color": "#2ecc71" },
      { "id": "Enrolled", "label": "Enrolled", "color": "#1abc9c" },
      { "id": "Year1", "label": "1st Year Completed", "color": "#f39c12" },
      { "id": "Year2", "label": "2nd Year Completed", "color": "#e67e22" },
      { "id": "Year3", "label": "3rd Year Completed", "color": "#d35400" },
      { "id": "Graduated", "label": "Graduated", "color": "#9b59b6" },
      { "id": "Dropout", "label": "Withdrew/Transfer", "color": "#95a5a6" }
    ],
    "links": [
      { "source": "Applicants", "target": "Accepted", "value": 8000 },
      { "source": "Accepted", "target": "Enrolled", "value": 5000 },
      { "source": "Enrolled", "target": "Year1", "value": 4500 },
      { "source": "Enrolled", "target": "Dropout", "value": 500 },
      { "source": "Year1", "target": "Year2", "value": 4200 },
      { "source": "Year1", "target": "Dropout", "value": 300 },
      { "source": "Year2", "target": "Year3", "value": 4000 },
      { "source": "Year2", "target": "Dropout", "value": 200 },
      { "source": "Year3", "target": "Graduated", "value": 3900 },
      { "source": "Year3", "target": "Dropout", "value": 100 }
    ]
  }
}
```

### Tips for Creating Your Own Sankey Diagrams

1. **Start Simple**: Begin with 3-5 nodes and add complexity gradually
2. **Use the Data Panel**: The editor's data panel makes it easy to iterate on your data
3. **Color Coding**: Use colors to group related flows or highlight important paths
4. **Balance Flows**: Try to ensure conservation of flow (inputs = outputs) for cleaner visuals
5. **Test Edge Cases**: Try your diagram with different value ranges to ensure it scales well

## API Reference

```typescript
interface SankeyNode {
  id: string; // Unique node identifier
  label?: string; // Display label (defaults to id)
  color?: string; // Node color (CSS color or hex)
}

interface SankeyLink {
  source: string; // Source node ID
  target: string; // Target node ID
  value: number; // Flow quantity
  color?: string; // Flow color (optional)
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
  width?: number; // Chart width (default: 800)
  height?: number; // Chart height (default: 600)
}
```

## Comparison with Other Tools

| Feature                      | Runiq          | Mermaid        | PlantUML | Lucidchart  | SankeyMATIC | D3.js Sankey | RAWGraphs  | Google Charts |
| ---------------------------- | -------------- | -------------- | -------- | ----------- | ----------- | ------------ | ---------- | ------------- |
| **Basic Support**            | ✅             | ✅             | ❌       | ✅          | ✅          | ✅           | ✅         | ✅            |
| **Flow proportions**         | ✅             | ⚠️ Limited     | ❌       | ✅          | ✅          | ✅           | ✅         | ✅            |
| **Multi-level flows**        | ✅             | ❌             | ❌       | ✅          | ✅          | ✅           | ✅         | ✅            |
| **Custom node colors**       | ✅             | ⚠️ Limited     | ❌       | ✅          | ✅          | ✅           | ✅         | ⚠️ Limited    |
| **Flow labels**              | ✅             | ❌             | ❌       | ✅          | ✅          | ✅           | ✅         | ✅            |
| **Interactive features**     | ❌             | ❌             | ❌       | ✅          | ❌          | ✅           | ⚠️ Limited | ✅            |
| **Data import**              | ✅ JSON        | ❌             | ❌       | ✅ CSV      | ✅ Text     | ✅ JSON      | ✅ CSV     | ✅ CSV        |
| **Circular flows**           | ✅             | ❌             | ❌       | ✅          | ✅          | ✅           | ⚠️ Limited | ❌            |
| **Documentation generation** | ✅             | ✅             | ❌       | ⚠️ Partial  | ❌          | ❌           | ❌         | ❌            |
| **Energy diagrams**          | ✅             | ❌             | ❌       | ✅          | ✅          | ✅           | ✅         | ✅            |
| **Text-based DSL**           | ✅             | ✅             | ❌       | ❌          | ✅          | ⚠️ JSON      | ❌         | ⚠️ JSON       |
| **Version control friendly** | ✅             | ✅             | ❌       | ⚠️ Partial  | ⚠️ Partial  | ✅           | ❌         | ❌            |
| **Automatic layout**         | ✅             | ✅             | ❌       | ❌          | ✅          | ✅           | ✅         | ✅            |
| **Export formats**           | SVG, PNG       | SVG, PNG       | ❌       | Multiple    | PNG, SVG    | SVG          | PNG, SVG   | PNG, SVG      |
| **Learning curve**           | Low            | Low            | ❌       | Low         | Very Low    | High         | Low        | Medium        |
| **Cost**                     | Free           | Free           | ❌       | Paid        | Free        | Free         | Free       | Free          |
| **Platform**                 | Cross-platform | Cross-platform | ❌       | Web/Desktop | Web         | Web/Code     | Web        | Web           |

**Key Advantages of Runiq:**

- **Version Control**: Track flow changes over time in Git
- **Data-Driven**: Generate from process data, energy meters, or analytics
- **Documentation**: Natural integration with technical documentation
- **Programmatic**: Easy to automate from databases or APIs

**When to Use Alternatives:**

- **SankeyMATIC**: Quick, simple web-based Sankey generation for one-off diagrams
- **D3.js Sankey**: Custom interactive web visualizations with full control
- **RAWGraphs**: Rapid exploratory data visualization from CSV files
- **Lucidchart**: Real-time collaboration with stakeholders on process flows
