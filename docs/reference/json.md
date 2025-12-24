---
title: JSON Format
description: Complete reference for Runiq's 1:1 JSON representation of diagram DSL with conversion utilities and examples.
lastUpdated: 2025-11-17
---

# JSON Format

Runiq provides a 1:1 JSON representation of its DSL, enabling programmatic diagram generation and seamless integration with data sources. Every DSL diagram can be represented as JSON, and vice versa.

## Overview

The JSON format mirrors the DSL structure exactly:

- **DSL** → Human-readable text format for authoring
- **JSON** → Machine-readable format for programmatic generation
- **1:1 Mapping** → Perfect equivalence between both formats

## Why Use JSON Format?

- ✅ **Programmatic Generation** - Create diagrams from database queries, APIs, or computed data
- ✅ **Data Integration** - Bind diagrams to application state
- ✅ **Version Control** - JSON diff-friendly for change tracking
- ✅ **Type Safety** - Full TypeScript support for AST structure
- ✅ **Templating** - Generate dynamic diagrams from templates
- ✅ **Serialization** - Store/transmit diagrams efficiently

## Basic Structure

### Minimal Example

**DSL:**

```runiq
diagram "Simple" {
  shape A as @rect label:"Node A"
  shape B as @rect label:"Node B"
  A -> B
}
```

**JSON:**

```json
{
  "type": "diagram",
  "title": "Simple",
  "direction": "TB",
  "shapes": [
    {
      "id": "A",
      "type": "rect",
      "properties": {
        "label": "Node A"
      }
    },
    {
      "id": "B",
      "type": "rect",
      "properties": {
        "label": "Node B"
      }
    }
  ],
  "edges": [
    {
      "from": "A",
      "to": "B"
    }
  ]
}
```

## Complete JSON Schema

### Diagram Object

```typescript
interface Diagram {
  type:
    | 'diagram'
    | 'electrical'
    | 'digital'
    | 'wardley'
    | 'sequence'
    | 'pneumatic'
    | 'hydraulic'
    | 'pid';
  title: string;
  direction?: 'TB' | 'BT' | 'LR' | 'RL';
  shapes: Shape[];
  edges: Edge[];
  styles?: Style[];
  containers?: Container[];
}
```

### Shape Object

```typescript
interface Shape {
  id: string; // Unique identifier
  type: string; // Shape type (rect, circ, hexagon, etc.)
  properties?: {
    label?: string; // Display text
    fill?: string; // Background color
    stroke?: string; // Border color
    strokeWidth?: number; // Border width
    color?: string; // Text color
    style?: string; // Named style reference
    icon?: string; // Icon name (e.g., "fa/user")
    link?: string; // Hyperlink URL
    tooltip?: string; // Hover tooltip
    data?: any; // Custom data (charts, etc.)
    [key: string]: any; // Additional properties
  };
}
```

### Edge Object

```typescript
interface Edge {
  from: string; // Source shape ID
  to: string; // Target shape ID
  label?: string; // Edge label
  properties?: {
    lineStyle?: 'solid' | 'dashed' | 'dotted';
    arrowType?: 'standard' | 'hollow' | 'open' | 'none';
    stereotype?: string; // UML stereotype (e.g., "<<include>>")
    weight?: number; // Edge weight for algorithms
    edgeType?:
      | 'association'
      | 'aggregation'
      | 'composition'
      | 'dependency'
      | 'generalization'
      | 'realization';
    multiplicitySource?: string; // UML multiplicity (e.g., "1..*")
    multiplicityTarget?: string;
    roleSource?: string; // UML role name
    roleTarget?: string;
    [key: string]: any;
  };
}
```

### Style Object

```typescript
interface Style {
  name: string; // Style identifier
  properties: {
    fill?: string; // Background color
    stroke?: string; // Border color
    strokeWidth?: number; // Border width (px)
    fontSize?: number; // Font size (px)
    fontFamily?: string; // Font family
    fontWeight?: number; // Font weight
    color?: string; // Text color
    textAlign?: 'left' | 'center' | 'right';
    [key: string]: any;
  };
}
```

### Container Object

```typescript
interface Container {
  id: string; // Unique identifier
  label: string; // Display text
  properties?: {
    backgroundColor?: string; // Background color
    borderColor?: string; // Border color
    strokeWidth?: number; // Border width (px)
    borderStyle?: 'solid' | 'dashed' | 'dotted';
    padding?: number; // Internal padding (px)
    algorithm?: 'layered' | 'force' | 'stress' | 'radial' | 'mrtree';
    spacing?: number; // Node spacing (px)
    type?: string; // Container type (e.g., "mindmap")
    [key: string]: any;
  };
  shapes: Shape[]; // Nested shapes
  edges: Edge[]; // Internal edges
  containers?: Container[]; // Nested containers
}
```

## Conversion Utilities

### Using @runiq/io-json

The `@runiq/io-json` package provides utilities for converting between DSL and JSON:

```typescript
import { astToJson, jsonToAst } from '@runiq/io-json';
import { parse } from '@runiq/parser-dsl';

// DSL → AST → JSON
const dsl = `diagram "Example" {
  shape A as @rect label:"Hello"
}`;

const parseResult = parse(dsl);
const diagram = parseResult.document!.diagrams[0];

const jsonResult = astToJson(diagram);
if (jsonResult.success) {
  console.log(jsonResult.data); // JSON string
}

// JSON → AST → DSL
const json = `{ "type": "diagram", "title": "Example", ... }`;

const astResult = jsonToAst(json);
if (astResult.success) {
  const diagram = astResult.data;
  // Use diagram with layout/renderer
}
```

### Validation

```typescript
import { validateDiagram } from '@runiq/core';

const json = JSON.parse(jsonString);
const validation = validateDiagram(json);

if (validation.success) {
  console.log('Valid diagram:', validation.data);
} else {
  console.error('Validation errors:', validation.problems);
}
```

## Practical Examples

### Example 1: Flowchart

**DSL:**

```runiq
diagram "Process Flow" {
  direction LR

  style default fillColor:"#e3f2fd" strokeColor:"#1976d2"

  shape start as @rounded label:"Start"
  shape process as @rect label:"Process Data"
  shape end as @rounded label:"End"

  start -> process label:"begin"
  process -> end label:"complete"
}
```

**JSON:**

```json
{
  "type": "diagram",
  "title": "Process Flow",
  "direction": "LR",
  "styles": [
    {
      "name": "default",
      "properties": {
        "fill": "#e3f2fd",
        "stroke": "#1976d2"
      }
    }
  ],
  "shapes": [
    {
      "id": "start",
      "type": "rounded",
      "properties": {
        "label": "Start"
      }
    },
    {
      "id": "process",
      "type": "rect",
      "properties": {
        "label": "Process Data"
      }
    },
    {
      "id": "end",
      "type": "rounded",
      "properties": {
        "label": "End"
      }
    }
  ],
  "edges": [
    {
      "from": "start",
      "to": "process",
      "label": "begin"
    },
    {
      "from": "process",
      "to": "end",
      "label": "complete"
    }
  ]
}
```

### Example 2: Container with Nested Shapes

**DSL:**

```runiq
diagram "Microservices" {
  container backend "Backend Services" fillColor:"#f3e5f5" strokeColor:"#7b1fa2" {
    shape api as @hexagon label:"API"
    shape db as @cylinder label:"Database"
    api -> db
  }
}
```

**JSON:**

```json
{
  "type": "diagram",
  "title": "Microservices",
  "containers": [
    {
      "id": "backend",
      "label": "Backend Services",
      "properties": {
        "backgroundColor": "#f3e5f5",
        "borderColor": "#7b1fa2"
      },
      "shapes": [
        {
          "id": "api",
          "type": "hexagon",
          "properties": {
            "label": "API"
          }
        },
        {
          "id": "db",
          "type": "cylinder",
          "properties": {
            "label": "Database"
          }
        }
      ],
      "edges": [
        {
          "from": "api",
          "to": "db"
        }
      ]
    }
  ],
  "shapes": [],
  "edges": []
}
```

### Example 3: Chart with Data

**DSL:**

```runiq
diagram "Sales Chart" {
  shape sales as @pieChart
    label:"Q1-Q4 Sales"
    data:[100, 150, 120, 180]
    labels:["Q1", "Q2", "Q3", "Q4"]
    showLegend:true
}
```

**JSON:**

```json
{
  "type": "diagram",
  "title": "Sales Chart",
  "shapes": [
    {
      "id": "sales",
      "type": "pieChart",
      "properties": {
        "label": "Q1-Q4 Sales",
        "data": [100, 150, 120, 180],
        "labels": ["Q1", "Q2", "Q3", "Q4"],
        "showLegend": true
      }
    }
  ],
  "edges": []
}
```

## Programmatic Generation

### Generating Diagrams from Data

```typescript
interface OrgNode {
  id: string;
  name: string;
  role: string;
  reports: OrgNode[];
}

function generateOrgChart(data: OrgNode): Diagram {
  const shapes: Shape[] = [];
  const edges: Edge[] = [];

  function traverse(node: OrgNode, parent?: string) {
    shapes.push({
      id: node.id,
      type: 'rect',
      properties: {
        label: `${node.name}\n${node.role}`,
      },
    });

    if (parent) {
      edges.push({
        from: parent,
        to: node.id,
      });
    }

    node.reports.forEach((child) => traverse(child, node.id));
  }

  traverse(data);

  return {
    type: 'diagram',
    title: 'Organization Chart',
    direction: 'TB',
    shapes,
    edges,
  };
}

// Usage
const orgData = {
  id: 'ceo',
  name: 'Alice Smith',
  role: 'CEO',
  reports: [
    {
      id: 'cto',
      name: 'Bob Jones',
      role: 'CTO',
      reports: [],
    },
  ],
};

const diagram = generateOrgChart(orgData);
const json = JSON.stringify(diagram, null, 2);
```

### Dynamic Database Queries

```typescript
async function generateERDiagram(database: string): Promise<Diagram> {
  // Query database schema
  const tables = await queryTables(database);

  const shapes: Shape[] = tables.map((table) => ({
    id: table.name,
    type: 'rect',
    properties: {
      label: table.name,
      tooltip: `${table.rowCount} rows`,
    },
  }));

  const edges: Edge[] = [];
  for (const table of tables) {
    for (const fk of table.foreignKeys) {
      edges.push({
        from: table.name,
        to: fk.references,
        properties: {
          label: fk.column,
          lineStyle: 'dashed',
        },
      });
    }
  }

  return {
    type: 'diagram',
    title: `${database} Schema`,
    direction: 'TB',
    shapes,
    edges,
  };
}
```

## Advanced Patterns

### Template System

```typescript
interface ProcessTemplate {
  steps: string[];
  theme: 'blue' | 'green' | 'orange';
}

const themes = {
  blue: { fillColor: '#e3f2fd', stroke: '#1976d2' },
  green: { fillColor: '#e8f5e9', stroke: '#388e3c' },
  orange: { fillColor: '#fff3e0', stroke: '#f57c00' },
};

function generateProcess(template: ProcessTemplate): Diagram {
  const theme = themes[template.theme];

  return {
    type: 'diagram',
    title: 'Process Flow',
    direction: 'LR',
    shapes: template.steps.map((step, i) => ({
      id: `step${i}`,
      type: 'rounded',
      properties: {
        label: step,
        fillColor: theme.fill,
        stroke: theme.stroke,
      },
    })),
    edges: template.steps.slice(0, -1).map((_, i) => ({
      from: `step${i}`,
      to: `step${i + 1}`,
    })),
  };
}

// Usage
const process = generateProcess({
  steps: ['Research', 'Design', 'Develop', 'Test', 'Deploy'],
  theme: 'blue',
});
```

### Conditional Rendering

```typescript
function generateDashboard(metrics: Metric[]): Diagram {
  const shapes: Shape[] = [];

  metrics.forEach((metric, i) => {
    const status = metric.value >= metric.target ? 'success' : 'warning';
    const fill = status === 'success' ? '#c8e6c9' : '#ffccbc';

    shapes.push({
      id: `metric${i}`,
      type: 'rect',
      properties: {
        label: `${metric.name}\n${metric.value}/${metric.target}`,
        fill,
        stroke: status === 'success' ? '#388e3c' : '#d84315',
      },
    });
  });

  return {
    type: 'diagram',
    title: 'KPI Dashboard',
    shapes,
    edges: [],
  };
}
```

## Type Definitions

Full TypeScript types are available in `@runiq/core`:

```typescript
import type { DiagramAst, Shape, Edge, Container, Style } from '@runiq/core';
```

## Best Practices

### 1. Use TypeScript for Type Safety

```typescript
import type { Diagram } from '@runiq/core';

const diagram: Diagram = {
  type: 'diagram',
  title: 'Example',
  shapes: [],
  edges: [],
};
```

### 2. Validate Generated JSON

```typescript
import { validateDiagram } from '@runiq/core';

const json = generateMyDiagram();
const validation = validateDiagram(json);

if (!validation.success) {
  throw new Error(`Invalid diagram: ${validation.problems.join(', ')}`);
}
```

### 3. Keep IDs Unique

```typescript
// Use UUID or sequential IDs
import { v4 as uuid } from 'uuid';

const shape = {
  id: uuid(),
  type: 'rect',
  properties: { label: 'Node' },
};
```

### 4. Separate Data from Presentation

```typescript
// Data layer
interface Node {
  id: string;
  label: string;
  data: any;
}

// Presentation layer
function nodeToShape(node: Node, style: Style): Shape {
  return {
    id: node.id,
    type: 'rect',
    properties: {
      label: node.label,
      ...style.properties,
    },
  };
}
```

## Related Documentation

- [DSL Syntax Reference](/reference/dsl) - Complete DSL syntax
- [Web SDK Integration](/guide/web-sdk) - Using JSON with the browser SDK
- [Data-Driven Diagrams](/reference/data-driven) - External data sources
- [API Reference](/reference/api/parser) - Parsing and conversion APIs

---

**Next Steps**: Try converting an existing DSL diagram to JSON using `@runiq/io-json`, then experiment with programmatic generation using the template examples above.
