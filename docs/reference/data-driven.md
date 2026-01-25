# Data-Driven Diagrams

Generate diagrams dynamically from JSON arrays or CSV files using templates, loops, conditionals, and style mappings.

## Overview

Runiq's data-driven features enable:

- **Dynamic Generation**: Create nodes and edges from data sources
- **Template Variables**: Use `${expression}` syntax for property substitution
- **Conditionals**: Generate elements based on data conditions
- **Loops**: Iterate over arrays to create multiple elements
- **Style Mappings**: Map data values to visual properties (colors, sizes, opacity)
- **Legends**: Auto-generate legends for style mappings
- **Field Mappings**: Map data fields to node/edge properties

## Quick Start

### Basic `foreach` with Inline JSON (as a string)

```runiq
diagram "User Cards" {
  # Inline JSON is supported by providing a JSON array as a string.
  # (This is usually easier to maintain in a separate file; see the next example.)
  datasource "json" key:users from:"[{\"id\":\"u1\",\"name\":\"Alice\",\"role\":\"Admin\"},{\"id\":\"u2\",\"name\":\"Bob\",\"role\":\"User\"},{\"id\":\"u3\",\"name\":\"Charlie\",\"role\":\"User\"}]"

  foreach "userCard" from:users {
    node "${item.id}" shape:rect
      label: "${item.name}"
      data:{ role: "${item.role}" }
  }
}
```

**Output**: Creates 3 rectangle nodes with names and roles as labels.

### Template with External JSON File

```runiq
diagram "Sales Dashboard" {
  datasource "json" key:sales from:"sales-data.json"

  foreach "regionCards" from:sales {
    node "${item.id}" shape:rect
      label: "${item.region} ($${item.revenue})"
  }
}
```

## Data Sources

### JSON Sources

Load data from a JSON file:

```runiq
datasource "json" key:servers from:"data/servers.json"
```

You can also inline JSON by passing a JSON array as a string:

```runiq
datasource "json" key:servers from:"[{\"id\":\"s1\",\"name\":\"Web Server\"}]"
```

### External JSON Files

Load data from JSON files:

```runiq
datasource "json" key:users from:"data/users.json"
```

**JSON File Format** (`data/users.json`):

```json
[
  { "id": "u1", "name": "Alice", "email": "alice@example.com" },
  { "id": "u2", "name": "Bob", "email": "bob@example.com" }
]
```

### CSV Files

Load data from CSV files:

```runiq
datasource "csv" key:metrics from:"metrics.csv"
  options: { sep: ",", hasHeader: true }
```

**CSV File Format** (`metrics.csv`):

```csv
id,name,value,status
m1,API Response Time,245,ok
m2,Database Queries,1203,warning
m3,Error Rate,12,error
```

**CSV Options**:

- `sep`: Column separator (default: `,`)
- `hasHeader`: First row contains headers (default: `true`)

## Charts Using Data Sources

Chart shapes can bind to a datasource directly in the DSL:

```runiq
diagram "Metrics" {
  datasource "csv" key:metrics from:"id,label,value\nm1,Latency,120\nm2,Errors,30"
  shape chart as @barChart from:metrics label:"Service Metrics"
}
```

## Template Syntax

### Variable Substitution

Access data fields using `${expression}` syntax:

```runiq
diagram "Users" {
  datasource "json" key:userData from:"users.json"

  foreach "users" from:userData {
    node "${item.id}" shape:rect
      label: "${item.name}"
      fillColor: "${item.color}"
  }
}
```

**Available Context Variables**:

- `${item}` - Current data object
- `${item.field}` - Access a field on the current object

Notes:

- The built-in template evaluator supports **property paths** (e.g. `${item.status}`), not arbitrary expressions (no comparisons, ternaries, or logical operators inside `${...}`).
- `filter:` is evaluated with `{ item, index, length }` available.
- `for <var> in ...` adds `<var>`, `<var>_index`, `<var>_first`, `<var>_last` to the evaluation context.

### Nested Property Access

Access nested objects:

```runiq
diagram "Users" {
  datasource "json" key:users from:"users.json"

  foreach "userCards" from:users {
    node "${item.id}" shape:rect
      label: "${item.name}"
      data:{ location: "${item.address.city}, ${item.address.country}" }
  }
}
```

### Filters and Limits

Filter and limit data before processing:

```runiq
diagram "Active Users" {
  datasource "json" key:users from:"users.json"

  foreach "activeUsers" from:users {
    filter: "${item.active}"
    limit: 10
    node "${item.id}" shape:rect label: "${item.name}"
  }
}
```

**Filter**: Boolean expression, only items evaluating to `true` are processed
**Limit**: Maximum number of items to process

## Conditionals

Generate elements conditionally based on data:

### Basic Conditionals

```runiq
diagram "Users" {
  datasource "json" key:userData from:"users.json"

  foreach "users" from:userData {
    if "${item.active}" {
      node "${item.id}" shape:rect
        label: "${item.name}"
        fillColor: "#22c55e"
    }
  }
}
```

The DSL currently supports truthy checks like `${item.active}`. Comparisons/ternaries/logical operators inside `${...}` are not supported.

### Nested Conditionals

```runiq
diagram "Products" {
  datasource "json" key:productData from:"products.json"

  foreach "products" from:productData {
    if "${item.inStock}" {
      if "${item.featured}" {
        node "${item.id}" shape:rect
          label: "${item.name}"
          fillColor: "#3b82f6"
      }
    }
  }
}
```

### Conditional with Loops

Combine conditionals and loops for complex logic:

```runiq
diagram "Teams" {
  datasource "json" key:teamData from:"teams.json"

  foreach "teams" from:teamData {
    if "${item.active}" {
      for member in ${item.members} {
        node "${member.id}" shape:circle
          label: "${member.name}"
      }
    }
  }
}
```

## Loops

Iterate over arrays to generate multiple elements:

### Basic Loop

```runiq
diagram "Team Members" {
  datasource "json" key:teams from:"teams.json"

  foreach "teamMembers" from:teams {
    for member in ${item.members} {
      node "${member.id}" shape:circle
        label: "${member.name}"
    }
  }
}
```

**Loop Variables**:

- `${member}` - Current loop item
- `${member_index}` - Loop index (0-based)
- `${member_first}` - True for first iteration
- `${member_last}` - True for last iteration

### Loop with Index

```runiq
diagram "Tasks" {
  datasource "json" key:taskData from:"tasks.json"

  foreach "tasks" from:taskData {
    for task in ${item.tasks} {
      node "${task.id}" shape:rect
        label: "Task ${task_index}: ${task.title}"
    }
  }
}
```

### Nested Loops

```runiq
diagram "Grid" {
  datasource "json" key:matrix from:"matrix.json"

  foreach "grid" from:matrix {
    for row in ${item.rows} {
      for cell in ${row.cells} {
        node "${cell.id}" shape:rect
          label: "${cell.value}"
      }
    }
  }
}
```

### Loop with Edges

Generate edges between loop items:

```runiq
diagram "Workflow" {
  datasource "json" key:workflowData from:"workflow.json"

  foreach "workflow" from:workflowData {
    for step in ${item.steps} {
      node "${step.id}" shape:rect label: "${step.name}"
    }

    for conn in ${item.connections} {
      edge "${conn.from}" -> "${conn.to}"
        label: "${conn.type}"
    }
  }
}
```

## Style mappings and legends

The DSL does not currently include `@map` / `@scale` / `@threshold` syntax or `legend` statements.

If you need style mappings and legends today, use the TypeScript APIs shown below (dynamic shape generation + legend generation).

## Dynamic Shape Generation

### Node Generation from Data

Use the TypeScript API for programmatic generation:

```typescript
import { generateNodes } from '@runiq/parser-dsl';

const data = [
  { id: 's1', name: 'Server 1', status: 'active', load: 75 },
  { id: 's2', name: 'Server 2', status: 'inactive', load: 20 },
];

const nodes = generateNodes(data, {
  shape: 'rect',
  idField: 'id',
  fieldMappings: {
    label: 'name',
  },
  styleMappings: [
    {
      property: 'fill',
      field: 'status',
      type: 'category',
      categories: {
        active: '#22c55e',
        inactive: '#6b7280',
      },
    },
    {
      property: 'opacity',
      field: 'load',
      type: 'scale',
      scale: {
        domain: [0, 100],
        range: [0.3, 1.0],
      },
    },
  ],
});
```

### Edge Generation from Relationships

Generate edges from relational data:

```typescript
import { generateEdges } from '@runiq/parser-dsl';

const connections = [
  { from: 's1', to: 's2', protocol: 'HTTP', bandwidth: 100 },
  { from: 's2', to: 's3', protocol: 'SQL', bandwidth: 50 },
];

const edges = generateEdges(connections, {
  fromField: 'from',
  toField: 'to',
  fieldMappings: {
    label: 'protocol',
  },
  styleMappings: [
    {
      property: 'strokeWidth',
      field: 'bandwidth',
      type: 'scale',
      scale: {
        domain: [0, 100],
        range: [1, 5],
      },
    },
  ],
});
```

### Combined Generation with Legends

Generate nodes, edges, and legends together:

```typescript
import { generateDiagramFromRelationalData } from '@runiq/parser-dsl';

const data = [
  { from: 'Alice', to: 'Bob', weight: 10, type: 'friend' },
  { from: 'Bob', to: 'Charlie', weight: 5, type: 'colleague' },
];

const result = generateDiagramFromRelationalData(data, {
  nodeConfig: {
    shape: 'circle',
  },
  edgeConfig: {
    fromField: 'from',
    toField: 'to',
    fieldMappings: { label: 'weight' },
    styleMappings: [
      {
        property: 'stroke',
        field: 'type',
        type: 'category',
        categories: {
          friend: '#3b82f6',
          colleague: '#22c55e',
        },
      },
    ],
  },
  generateLegends: true,
  legendConfig: {
    position: 'bottom-right',
    title: 'Relationship Type',
  },
});

// result contains: { nodes, edges, legends }
```

## Complete Examples

This example is copy/paste-able with the currently-supported DSL:

```runiq
diagram "Network" {
  datasource "json" key:nodes from:"nodes.json"
  datasource "json" key:connections from:"connections.json"

  foreach "networkNodes" from:nodes {
    node "${item.id}" shape:rect
      label: "${item.name}"
  }

  foreach "networkEdges" from:connections {
    edge "${item.from}" -> "${item.to}"
      label: "${item.protocol}"
  }
}
```

## Template Composition

### Reusable Templates

Define templates that can be called from other templates:

```typescript
// TypeScript API
import { processTemplates } from '@runiq/parser-dsl';

const iconNodeTemplate = {
  id: 'icon-node',
  dataKey: 'params',
  statements: [
    {
      type: 'node',
      id: '${item.id}',
      shape: '${item.icon}',
      properties: {
        label: '${item.label}',
      },
    },
  ],
};

const serverTemplate = {
  id: 'servers',
  dataKey: 'serverData',
  statements: [
    {
      type: 'template-call',
      templateId: 'icon-node',
      parameters: {
        id: '${item.id}',
        icon: 'server',
        label: '${item.hostname}',
      },
    },
  ],
};

const result = processTemplates([iconNodeTemplate, serverTemplate], {
  serverData: [
    { id: 's1', hostname: 'web01' },
    { id: 's2', hostname: 'web02' },
  ],
});
```

## Best Practices

### 1. Data Structure Design

**Keep data flat when possible**:

```json
// Good - Flat structure
[
  { "id": "u1", "name": "Alice", "team": "Engineering" },
  { "id": "u2", "name": "Bob", "team": "Marketing" }
]

// Avoid - Overly nested
[
  {
    "user": {
      "details": {
        "identification": { "id": "u1" },
        "profile": { "name": "Alice" }
      }
    }
  }
]
```

### 2. ID Field Management

**Always provide explicit IDs**:

```runiq
diagram "IDs" {
  datasource "json" key:nodes from:"nodes.json"

  foreach "nodes" from:nodes {
    node "${item.id}" shape:rect label:"${item.name}"
  }
}
```

### 3. Style mappings (API)

If you need data-driven style mapping, use the TypeScript APIs (`generateNodes`, `generateEdges`, `processTemplateWithGeneration`) shown above.

### 4. Filter Before Loop

**Use filter to reduce processing**:

```runiq
diagram "Filtering" {
  datasource "json" key:users from:"users.json"

  # Prefer `filter:` at the `foreach` level.
  foreach "activeUsers" from:users {
    filter: "${item.active}"
    node "${item.id}" shape:rect label:"${item.name}"
  }

  # You can also filter inside the body using `if`.
  foreach "allUsers" from:users {
    if "${item.active}" {
      node "${item.id}" shape:rect label:"${item.name}"
    }
  }
}
```

### 5. Legends (API)

Legend generation is available via the TypeScript APIs (`legendGenerator.ts`); the DSL does not currently support `legend` statements.

### 6. Meaningful Variable Names

**Use descriptive loop variables**:

```runiq
# Good - Clear variable names
for member in ${item.members} {
  node "${member.id}" label:"${member.name}"
}

# Avoid - Generic names
for x in ${item.members} {
  node "${x.id}" label:"${x.name}"
}
```

### 7. Error Handling

The DSL template evaluator only supports property-path substitutions. If you need fallback logic, handle it in your data (or in TypeScript before passing data to the template APIs).

## API Reference

### Template Processing Functions

```typescript
/**
 * Process a single template with data
 */
function processTemplate(
  template: DataTemplate,
  data: DataObject[]
): TemplateResult;

/**
 * Process multiple templates with data map
 */
function processTemplates(
  templates: DataTemplate[],
  dataMap: Record<string, DataObject[]>
): TemplateResult;

/**
 * Process template with dynamic generation and legends
 */
function processTemplateWithGeneration(
  template: DataTemplate,
  data: DataObject[],
  options: {
    nodeConfig?: NodeGenerationConfig;
    edgeConfig?: EdgeGenerationConfig;
    generateLegends?: boolean;
    legendConfig?: LegendConfig;
  }
): TemplateResult;
```

### Dynamic Generation Functions

```typescript
/**
 * Generate nodes from data
 */
function generateNodes(
  data: DataObject[],
  config: NodeGenerationConfig
): GeneratedNode[];

/**
 * Generate edges from relational data
 */
function generateEdges(
  data: DataObject[],
  config: EdgeGenerationConfig
): GeneratedEdge[];

/**
 * Generate complete diagram from relational data
 */
function generateDiagramFromRelationalData(
  data: DataObject[],
  options: {
    nodeConfig?: Omit<NodeGenerationConfig, 'idField'>;
    edgeConfig: EdgeGenerationConfig;
    generateLegends?: boolean;
    legendConfig?: LegendConfig;
  }
): TemplateResult;
```

### Legend Generation Functions

```typescript
/**
 * Generate scale legend
 */
function generateScaleLegend(
  mapping: StyleMappingConfig & { type: 'scale' },
  config: LegendConfig
): Legend;

/**
 * Generate category legend
 */
function generateCategoryLegend(
  mapping: StyleMappingConfig & { type: 'category' },
  config: LegendConfig
): Legend;

/**
 * Generate legends from all style mappings
 */
function generateLegendsFromMappings(
  mappings: StyleMappingConfig[],
  config: LegendConfig
): Legend[];
```

## See Also

- **[Templates Reference](/reference/templates)** - Template system deep-dive
- **[JSON Format](/reference/json)** - JSON data structure reference
- **[Component Diagrams](/guide/component-diagrams)** - Using templates for UML components
- **[Examples](/examples/)** - Browse data-driven diagram examples
