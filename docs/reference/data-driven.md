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

### Basic Template with Inline Data

```runiq
diagram "User Cards"

data source:users [
  { id: "u1", name: "Alice", role: "Admin" },
  { id: "u2", name: "Bob", role: "User" },
  { id: "u3", name: "Charlie", role: "User" }
]

template "userCard" from:users {
  node "${item.id}" shape:rect
    label: "${item.name}"
    subtitle: "${item.role}"
}
```

**Output**: Creates 3 rectangle nodes with names and roles as labels.

### Template with External JSON File

```runiq
diagram "Sales Dashboard"

datasource "json" key:sales from:"sales-data.json"

template "regionCards" from:sales {
  node "${item.id}" shape:rect
    label: "${item.region}"
    subtitle: "$${item.revenue}"
}
```

## Data Sources

### Inline JSON Data

Define data directly in the diagram:

```runiq
data source:servers [
  { id: "s1", name: "Web Server", status: "active", cpu: 45 },
  { id: "s2", name: "DB Server", status: "inactive", cpu: 10 },
  { id: "s3", name: "Cache", status: "error", cpu: 85 }
]
```

**Syntax**:
- `data source:<key> [...]` - Inline JSON array
- Access with `template "name" from:<key>`

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

## Template Syntax

### Variable Substitution

Access data fields using `${expression}` syntax:

```runiq
template "users" from:userData {
  node "${item.id}" shape:rect
    label: "${item.name}"
    fill: "${item.color}"
}
```

**Available Context Variables**:
- `${item}` - Current data object
- `${item.field}` - Access field on current object
- `${item_index}` - Zero-based index (0, 1, 2, ...)
- `${item_first}` - Boolean, true for first item
- `${item_last}` - Boolean, true for last item

### Nested Property Access

Access nested objects:

```runiq
data source:users [
  {
    id: "u1",
    name: "Alice",
    address: {
      city: "New York",
      country: "USA"
    }
  }
]

template "userCards" from:users {
  node "${item.id}" shape:rect
    label: "${item.name}"
    subtitle: "${item.address.city}, ${item.address.country}"
}
```

### Filters and Limits

Filter and limit data before processing:

```runiq
template "activeUsers" from:users
  filter: "${item.active}"
  limit: 10
{
  node "${item.id}" shape:rect label: "${item.name}"
}
```

**Filter**: Boolean expression, only items evaluating to `true` are processed
**Limit**: Maximum number of items to process

## Conditionals

Generate elements conditionally based on data:

### Basic Conditionals

```runiq
template "users" from:userData {
  if "${item.active}" {
    node "${item.id}" shape:rect
      label: "${item.name}"
      fill: "#22c55e"
  }
}
```

**Operators**:
- Truthy check: `${item.field}` - evaluates boolean value
- Comparison: `${item.age > 18}`, `${item.status == "active"}`
- Logical: `${item.active && item.verified}`

### Conditional with Else Clause

```runiq
template "servers" from:serverData {
  node "${item.id}" shape:rect
    label: "${item.name}"
    fill: ${item.status == "healthy" ? "#22c55e" : "#ef4444"}
}
```

### Nested Conditionals

```runiq
template "products" from:productData {
  if "${item.inStock}" {
    if "${item.featured}" {
      node "${item.id}" shape:rect
        label: "${item.name}"
        fill: "#3b82f6"
    }
  }
}
```

### Conditional with Loops

Combine conditionals and loops for complex logic:

```runiq
template "teams" from:teamData {
  if "${item.active}" {
    for member in ${item.members} {
      node "${member.id}" shape:circle
        label: "${member.name}"
    }
  }
}
```

## Loops

Iterate over arrays to generate multiple elements:

### Basic Loop

```runiq
data source:teams [
  {
    id: "t1",
    members: [
      { id: "m1", name: "Alice" },
      { id: "m2", name: "Bob" }
    ]
  }
]

template "teamMembers" from:teams {
  for member in ${item.members} {
    node "${member.id}" shape:circle
      label: "${member.name}"
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
template "tasks" from:taskData {
  for task in ${item.tasks} {
    node "${task.id}" shape:rect
      label: "Task ${task_index}: ${task.title}"
  }
}
```

### Nested Loops

```runiq
data source:matrix [
  {
    rows: [
      {
        cells: [
          { id: "c1", value: "A1" },
          { id: "c2", value: "A2" }
        ]
      }
    ]
  }
]

template "grid" from:matrix {
  for row in ${item.rows} {
    for cell in ${row.cells} {
      node "${cell.id}" shape:rect
        label: "${cell.value}"
    }
  }
}
```

### Loop with Edges

Generate edges between loop items:

```runiq
template "workflow" from:workflowData {
  for step in ${item.steps} {
    node "${step.id}" shape:rect label: "${step.name}"
  }
  
  for conn in ${item.connections} {
    edge "${conn.from}" -> "${conn.to}"
      label: "${conn.type}"
  }
}
```

## Style Mappings

Map data values to visual properties:

### Category Mapping

Map categorical values to styles:

```runiq
diagram "Server Status"

data source:servers [
  { id: "s1", name: "API", status: "healthy" },
  { id: "s2", name: "DB", status: "warning" },
  { id: "s3", name: "Cache", status: "error" }
]

template "servers" from:servers {
  node "${item.id}" shape:rect
    label: "${item.name}"
    fill: @map(item.status) {
      healthy: "#22c55e"
      warning: "#f59e0b"
      error: "#ef4444"
    }
}
```

**Category Syntax**:
```
property: @map(data.field) {
  value1: "style1"
  value2: "style2"
  default: "defaultStyle"
}
```

### Scale Mapping

Map numeric values to color gradients:

```runiq
diagram "CPU Load"

data source:servers [
  { id: "s1", name: "Server 1", cpu: 25 },
  { id: "s2", name: "Server 2", cpu: 75 },
  { id: "s3", name: "Server 3", cpu: 95 }
]

template "cpuVisualization" from:servers {
  node "${item.id}" shape:rect
    label: "${item.name}\n${item.cpu}%"
    fill: @scale(item.cpu) {
      domain: [0, 100]
      range: ["#22c55e", "#ef4444"]
    }
}
```

**Scale Syntax**:
```
property: @scale(data.field) {
  domain: [min, max]
  range: ["startColor", "endColor"]
}
```

### Threshold Mapping

Map based on value thresholds:

```runiq
template "metrics" from:metricData {
  node "${item.id}" shape:rect
    label: "${item.name}: ${item.value}"
    fill: @threshold(item.value) {
      0: "#22c55e"     # value < 50
      50: "#f59e0b"    # 50 <= value < 80
      80: "#ef4444"    # value >= 80
    }
}
```

### Multiple Style Mappings

Apply multiple style mappings:

```runiq
template "services" from:serviceData {
  node "${item.id}" shape:rect
    label: "${item.name}"
    fill: @map(item.status) {
      running: "#22c55e"
      stopped: "#6b7280"
    }
    stroke: @threshold(item.load) {
      0: "#22c55e"
      60: "#f59e0b"
      85: "#ef4444"
    }
    strokeWidth: @scale(item.priority) {
      domain: [1, 10]
      range: [1, 5]
    }
}
```

## Legends

Auto-generate legends for style mappings:

### Basic Legend

```runiq
diagram "Status Dashboard"

data source:services [
  { id: "s1", name: "API", status: "running" },
  { id: "s2", name: "DB", status: "stopped" },
  { id: "s3", name: "Cache", status: "error" }
]

template "services" from:services {
  node "${item.id}" shape:rect
    label: "${item.name}"
    fill: @map(item.status) {
      running: "#22c55e"
      stopped: "#6b7280"
      error: "#ef4444"
    }
}

legend for fill:status position:bottom-right title:"Service Status"
```

**Legend Syntax**:
```
legend for <property>:<field>
  position: top-left | top-right | bottom-left | bottom-right
  title: "Legend Title"
```

### Scale Legend

For continuous mappings, show gradient:

```runiq
template "heatmap" from:data {
  node "${item.id}" shape:rect
    fill: @scale(item.value) {
      domain: [0, 100]
      range: ["#22c55e", "#ef4444"]
    }
}

legend for fill:value
  position: bottom-right
  title: "Value (0-100)"
  steps: 5
```

**Legend Steps**: Number of discrete values to show for scale legends (default: 5)

### Multiple Legends

Display multiple legends:

```runiq
template "network" from:networkData {
  node "${item.id}" shape:rect
    fill: @map(item.status) { ... }
    strokeWidth: @scale(item.bandwidth) { ... }
}

legend for fill:status position:bottom-right title:"Status"
legend for strokeWidth:bandwidth position:bottom-left title:"Bandwidth"
```

## Dynamic Shape Generation

### Node Generation from Data

Use the TypeScript API for programmatic generation:

```typescript
import { generateNodes } from '@runiq/parser-dsl';

const data = [
  { id: 's1', name: 'Server 1', status: 'active', load: 75 },
  { id: 's2', name: 'Server 2', status: 'inactive', load: 20 }
];

const nodes = generateNodes(data, {
  shape: 'rect',
  idField: 'id',
  fieldMappings: {
    label: 'name'
  },
  styleMappings: [
    {
      property: 'fill',
      field: 'status',
      type: 'category',
      categories: {
        active: '#22c55e',
        inactive: '#6b7280'
      }
    },
    {
      property: 'opacity',
      field: 'load',
      type: 'scale',
      scale: {
        domain: [0, 100],
        range: [0.3, 1.0]
      }
    }
  ]
});
```

### Edge Generation from Relationships

Generate edges from relational data:

```typescript
import { generateEdges } from '@runiq/parser-dsl';

const connections = [
  { from: 's1', to: 's2', protocol: 'HTTP', bandwidth: 100 },
  { from: 's2', to: 's3', protocol: 'SQL', bandwidth: 50 }
];

const edges = generateEdges(connections, {
  fromField: 'from',
  toField: 'to',
  fieldMappings: {
    label: 'protocol'
  },
  styleMappings: [
    {
      property: 'strokeWidth',
      field: 'bandwidth',
      type: 'scale',
      scale: {
        domain: [0, 100],
        range: [1, 5]
      }
    }
  ]
});
```

### Combined Generation with Legends

Generate nodes, edges, and legends together:

```typescript
import { generateDiagramFromRelationalData } from '@runiq/parser-dsl';

const data = [
  { from: 'Alice', to: 'Bob', weight: 10, type: 'friend' },
  { from: 'Bob', to: 'Charlie', weight: 5, type: 'colleague' }
];

const result = generateDiagramFromRelationalData(data, {
  nodeConfig: {
    shape: 'circle'
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
          colleague: '#22c55e'
        }
      }
    ]
  },
  generateLegends: true,
  legendConfig: {
    position: 'bottom-right',
    title: 'Relationship Type'
  }
});

// result contains: { nodes, edges, legends }
```

## Complete Examples

### Example 1: Network Topology Dashboard

```runiq
diagram "Network Topology"

data source:nodes [
  { id: "fw1", name: "Firewall", type: "security", load: 45 },
  { id: "lb1", name: "Load Balancer", type: "network", load: 72 },
  { id: "web1", name: "Web Server", type: "server", load: 88 },
  { id: "db1", name: "Database", type: "database", load: 65 }
]

data source:connections [
  { from: "fw1", to: "lb1", protocol: "HTTPS", bandwidth: 1000 },
  { from: "lb1", to: "web1", protocol: "HTTP", bandwidth: 800 },
  { from: "web1", to: "db1", protocol: "SQL", bandwidth: 500 }
]

template "networkNodes" from:nodes {
  node "${item.id}" shape:rect
    label: "${item.name}"
    subtitle: "Load: ${item.load}%"
    fill: @map(item.type) {
      security: "#ef4444"
      network: "#3b82f6"
      server: "#22c55e"
      database: "#f59e0b"
    }
    opacity: @scale(item.load) {
      domain: [0, 100]
      range: [0.5, 1.0]
    }
}

template "networkEdges" from:connections {
  edge "${item.from}" -> "${item.to}"
    label: "${item.protocol}"
    strokeWidth: @scale(item.bandwidth) {
      domain: [0, 1000]
      range: [1, 4]
    }
}

legend for fill:type position:top-right title:"Component Type"
legend for strokeWidth:bandwidth position:bottom-right title:"Bandwidth (Mbps)"
```

### Example 2: Team Organization with Conditionals

```runiq
diagram "Team Structure"

data source:teams [
  {
    id: "engineering",
    name: "Engineering",
    active: true,
    members: [
      { id: "e1", name: "Alice", role: "Lead", seniority: 5 },
      { id: "e2", name: "Bob", role: "Developer", seniority: 3 },
      { id: "e3", name: "Charlie", role: "Developer", seniority: 1 }
    ]
  },
  {
    id: "marketing",
    name: "Marketing",
    active: false,
    members: [
      { id: "m1", name: "Dave", role: "Manager", seniority: 4 }
    ]
  }
]

template "activeTeams" from:teams
  filter: "${item.active}"
{
  for member in ${item.members} {
    node "${member.id}" shape:circle
      label: "${member.name}\n${member.role}"
      fill: @map(member.role) {
        Lead: "#3b82f6"
        Developer: "#22c55e"
        Manager: "#f59e0b"
      }
      size: @scale(member.seniority) {
        domain: [1, 5]
        range: [40, 80]
      }
  }
}

legend for fill:role position:bottom-right title:"Role"
```

### Example 3: Data Pipeline with Nested Loops

```runiq
diagram "ETL Pipeline"

data source:pipeline [
  {
    stages: [
      {
        id: "extract",
        name: "Extract",
        sources: [
          { id: "src1", name: "API", status: "healthy" },
          { id: "src2", name: "Database", status: "warning" }
        ]
      },
      {
        id: "transform",
        name: "Transform",
        sources: [
          { id: "tr1", name: "Clean", status: "healthy" },
          { id: "tr2", name: "Enrich", status: "healthy" }
        ]
      }
    ]
  }
]

template "pipelineStages" from:pipeline {
  for stage in ${item.stages} {
    container "${stage.id}" label:"${stage.name}" {
      for source in ${stage.sources} {
        node "${source.id}" shape:rect
          label: "${source.name}"
          fill: @map(source.status) {
            healthy: "#22c55e"
            warning: "#f59e0b"
            error: "#ef4444"
          }
      }
    }
  }
}

legend for fill:status position:bottom-right title:"Status"
```

### Example 4: Conditional Dashboard with Multiple Data Sources

```runiq
diagram "System Dashboard"

data source:services [
  { id: "api", name: "API Gateway", status: "running", uptime: 99.9 },
  { id: "auth", name: "Auth Service", status: "running", uptime: 99.5 },
  { id: "cache", name: "Redis Cache", status: "stopped", uptime: 0 }
]

data source:alerts [
  { service: "auth", severity: "warning", message: "High latency" },
  { service: "cache", severity: "critical", message: "Service down" }
]

template "serviceCards" from:services {
  node "${item.id}" shape:rect
    label: "${item.name}"
    subtitle: "${item.status}"
    fill: @map(item.status) {
      running: "#22c55e"
      stopped: "#ef4444"
    }
}

template "alertBadges" from:alerts
  filter: "${item.severity == 'critical'}"
{
  node "alert_${item.service}" shape:circle
    label: "!"
    fill: "#ef4444"
  
  edge "alert_${item.service}" -> "${item.service}"
    label: "${item.message}"
}

legend for fill:status position:bottom-right title:"Service Status"
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
        label: '${item.label}'
      }
    }
  ]
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
        label: '${item.hostname}'
      }
    }
  ]
};

const result = processTemplates(
  [iconNodeTemplate, serverTemplate],
  {
    serverData: [
      { id: 's1', hostname: 'web01' },
      { id: 's2', hostname: 'web02' }
    ]
  }
);
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
# Good - Explicit IDs
data source:nodes [
  { id: "node1", name: "Server" },
  { id: "node2", name: "Database" }
]

# Avoid - Relying on auto-generated IDs
data source:nodes [
  { name: "Server" },
  { name: "Database" }
]
```

### 3. Style Mapping Organization

**Define clear category values**:
```runiq
# Good - Clear categories
fill: @map(item.status) {
  running: "#22c55e"
  stopped: "#6b7280"
  error: "#ef4444"
  default: "#94a3b8"
}

# Avoid - Missing default
fill: @map(item.status) {
  running: "#22c55e"
  stopped: "#6b7280"
}
```

### 4. Filter Before Loop

**Use filter to reduce processing**:
```runiq
# Good - Filter at template level
template "activeUsers" from:users
  filter: "${item.active}"
{
  node "${item.id}" shape:rect label:"${item.name}"
}

# Less efficient - Filter inside template
template "allUsers" from:users {
  if "${item.active}" {
    node "${item.id}" shape:rect label:"${item.name}"
  }
}
```

### 5. Legend Placement

**Position legends to avoid overlap**:
```runiq
# Good - Consider diagram layout
legend for fill:status position:bottom-right
legend for size:load position:bottom-left

# Avoid - Overlapping legends
legend for fill:status position:bottom-right
legend for size:load position:bottom-right
```

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

**Provide fallback values**:
```runiq
# Good - Fallback for missing data
node "${item.id}" shape:rect
  label: "${item.name || 'Unknown'}"
  fill: "${item.color || '#6b7280'}"
```

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
