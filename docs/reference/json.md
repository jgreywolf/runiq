---
title: JSON Format
description: Complete reference for Runiq's JSON Diagram AST format with conversion utilities and examples.
lastUpdated: 2025-11-17
---

# JSON Format

Runiq provides a JSON representation of its Diagram AST, enabling programmatic diagram generation and seamless integration with data sources. This format mirrors the structure used by the renderer and `@runiq/io-json`.

## Overview

The JSON format mirrors the Diagram AST structure used by the renderer:

- **DSL** -> Human-readable text format for authoring
- **JSON** -> Machine-readable format for programmatic generation
- **1:1 Mapping** -> Diagram AST and JSON are equivalent for supported fields

**Note:** JSON conversion uses `DiagramAst` (e.g., `astVersion`, `nodes`, `edges`) and does not include a top-level `type` field. Profile-specific DSL (timeline, glyphset, sequence, etc.) is converted to `DiagramAst` before JSON conversion.

## Why Use JSON Format?

- **Programmatic Generation** - Create diagrams from database queries, APIs, or computed data
- **Data Integration** - Bind diagrams to application state
- **Version Control** - JSON diff-friendly for change tracking
- **Type Safety** - Full TypeScript support for AST structure
- **Templating** - Generate dynamic diagrams from templates
- **Serialization** - Store/transmit diagrams efficiently

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
  "astVersion": "1.0",
  "title": "Simple",
  "direction": "TB",
  "nodes": [
    {
      "id": "A",
      "shape": "rect",
      "label": "Node A"
    },
    {
      "id": "B",
      "shape": "rect",
      "label": "Node B"
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

### DiagramAst Object

```typescript
interface DiagramAst {
  astVersion: string;
  title?: string;
  direction?: 'TB' | 'BT' | 'LR' | 'RL';
  styles?: Record<string, Style>;
  nodes: Node[];
  edges: Edge[];
  groups?: Group[];
}
```

### Node Object

```typescript
interface Node {
  id: string; // Unique identifier
  shape: string; // Shape type (rect, circ, hexagon, etc.)
  label?: string; // Display text
  style?: string; // Named style reference
  icon?: { provider: string; name: string }; // Icon reference
  link?: { href: string; target?: string; rel?: string }; // Hyperlink
  tooltip?: string; // Hover tooltip
  data?: Record<string, unknown>; // Custom data (charts, etc.)
}
```

### Edge Object

```typescript
interface Edge {
  from: string; // Source node ID
  to: string; // Target node ID
  label?: string; // Edge label
  when?: string; // Conditional edge label
  style?: string; // Named style reference
  link?: { href: string; target?: string; rel?: string }; // Hyperlink
  tooltip?: string; // Hover tooltip
  data?: Record<string, unknown>; // Custom data
}
```

### Style Object

```typescript
interface Style {
  fill?: string; // Background color
  fillColor?: string; // Alias for fill
  stroke?: string; // Border color
  strokeColor?: string; // Alias for stroke
  strokeWidth?: number; // Border width (px)
  font?: string;
  fontSize?: number; // Font size (px)
  fontFamily?: string; // Font family
  fontWeight?: string; // Font weight
  textAlign?: string;
  rx?: number;
  ry?: number;
  padding?: number;
  opacity?: number;
  textColor?: string; // Alternative to fill for text
  color?: string; // Generic color
  affected?: boolean; // Pedigree charts
  carrier?: boolean;
  deceased?: boolean;
  tagFill?: string;
  extensions?: Record<string, string | number | boolean>;
}
```

### Group Object

```typescript
interface Group {
  id?: string;
  label?: string;
  children: string[];
  style?: string;
}
```

::: warning Containers and advanced fields
`@runiq/io-json` currently validates and round-trips core Diagram AST fields (astVersion, title, direction, styles, nodes, edges, groups). Container hierarchies, templates, presets, and other extended fields are not preserved by JSON conversion yet. Use DSL for those features.
:::

## Conversion Utilities

### Using `@runiq/io-json`

The `@runiq/io-json` package provides utilities for converting between DSL and JSON:

```typescript
import { astToJson, jsonToAst } from '@runiq/io-json';
import { parse } from '@runiq/parser-dsl';

// DSL -> AST -> JSON
const dsl = `diagram "Example" {
  shape A as @rect label:"Hello"
}`;

const parseResult = parse(dsl);
const diagramProfile = parseResult.document?.profiles.find(
  (profile) => profile.type === 'diagram'
);

if (!diagramProfile || !parseResult.document) {
  throw new Error('No diagram profile found');
}

const ast = {
  astVersion: parseResult.document.astVersion,
  title: diagramProfile.name,
  direction: diagramProfile.direction,
  styles: diagramProfile.styles,
  nodes: diagramProfile.nodes,
  edges: diagramProfile.edges,
  groups: diagramProfile.groups,
};

const jsonResult = astToJson(ast);
if (jsonResult.success) {
  console.log(jsonResult.data); // JSON string
}

// JSON -> AST -> DSL
const json = `{ "astVersion": "1.0", "title": "Example", "nodes": [], "edges": [] }`;

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

  style default fill:"#e3f2fd" strokeColor:"#1976d2"

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
  "astVersion": "1.0",
  "title": "Process Flow",
  "direction": "LR",
  "styles": {
    "default": {
      "fill": "#e3f2fd",
      "stroke": "#1976d2"
    }
  },
  "nodes": [
    {
      "id": "start",
      "shape": "rounded",
      "label": "Start",
      "style": "default"
    },
    {
      "id": "process",
      "shape": "rect",
      "label": "Process Data",
      "style": "default"
    },
    {
      "id": "end",
      "shape": "rounded",
      "label": "End",
      "style": "default"
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

### Example 2: Links and Labels

**DSL:**

```runiq
diagram "Service Links" {
  shape api as @hexagon label:"API" link:"https://example.com"
  shape db as @cylinder label:"Database"
  api -> db label:"reads"
}
```

**JSON:**

```json
{
  "astVersion": "1.0",
  "title": "Service Links",
  "nodes": [
    {
      "id": "api",
      "shape": "hexagon",
      "label": "API",
      "link": {
        "href": "https://example.com"
      }
    },
    {
      "id": "db",
      "shape": "cylinder",
      "label": "Database"
    }
  ],
  "edges": [
    {
      "from": "api",
      "to": "db",
      "label": "reads"
    }
  ]
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
  "astVersion": "1.0",
  "title": "Sales Chart",
  "nodes": [
    {
      "id": "sales",
      "shape": "pieChart",
      "label": "Q1-Q4 Sales",
      "data": {
        "values": [100, 150, 120, 180],
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

function generateOrgChart(data: OrgNode): DiagramAst {
  const nodes: NodeAst[] = [];
  const edges: EdgeAst[] = [];

  function traverse(node: OrgNode, parent?: string) {
    nodes.push({
      id: node.id,
      shape: 'rect',
      label: `${node.name}\n${node.role}`,
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
    astVersion: '1.0',
    title: 'Organization Chart',
    direction: 'TB',
    nodes,
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
async function generateERDiagram(database: string): Promise<DiagramAst> {
  // Query database schema
  const tables = await queryTables(database);

  const nodes: NodeAst[] = tables.map((table) => ({
    id: table.name,
    shape: 'rect',
    label: table.name,
    tooltip: `${table.rowCount} rows`,
  }));

  const edges: EdgeAst[] = [];
  for (const table of tables) {
    for (const fk of table.foreignKeys) {
      edges.push({
        from: table.name,
        to: fk.references,
        label: fk.column,
      });
    }
  }

  return {
    astVersion: '1.0',
    title: `${database} Schema`,
    direction: 'TB',
    nodes,
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
  blue: { fill: '#e3f2fd', stroke: '#1976d2' },
  green: { fill: '#e8f5e9', stroke: '#388e3c' },
  orange: { fill: '#fff3e0', stroke: '#f57c00' },
};

function generateProcess(template: ProcessTemplate): DiagramAst {
  const theme = themes[template.theme];

  return {
    astVersion: '1.0',
    title: 'Process Flow',
    direction: 'LR',
    styles: {
      theme: {
        fill: theme.fill,
        stroke: theme.stroke,
      },
    },
    nodes: template.steps.map((step, i) => ({
      id: `step${i}`,
      shape: 'rounded',
      label: step,
      style: 'theme',
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
function generateDashboard(metrics: Metric[]): DiagramAst {
  const nodes: NodeAst[] = [];
  const styles: Record<string, Style> = {
    success: { fill: '#c8e6c9', stroke: '#388e3c' },
    warning: { fill: '#ffccbc', stroke: '#d84315' },
  };

  metrics.forEach((metric, i) => {
    const status = metric.value >= metric.target ? 'success' : 'warning';
    nodes.push({
      id: `metric${i}`,
      shape: 'rect',
      label: `${metric.name}\n${metric.value}/${metric.target}`,
      style: status,
    });
  });

  return {
    astVersion: '1.0',
    title: 'KPI Dashboard',
    styles,
    nodes,
    edges: [],
  };
}
```

## Type Definitions

Full TypeScript types are available in `@runiq/core`:

```typescript
import type { DiagramAst, NodeAst, EdgeAst, GroupAst, Style } from '@runiq/core';
```

## Best Practices

### 1. Use TypeScript for Type Safety

```typescript
import type { DiagramAst } from '@runiq/core';

const diagram: DiagramAst = {
  astVersion: '1.0',
  title: 'Example',
  nodes: [],
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

const node = {
  id: uuid(),
  shape: 'rect',
  label: 'Node',
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
const styles: Record<string, Style> = {
  primary: { fill: '#e3f2fd', stroke: '#1976d2' },
};

function nodeToAst(node: Node, styleName: string): NodeAst {
  return {
    id: node.id,
    shape: 'rect',
    label: node.label,
    style: styleName,
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





