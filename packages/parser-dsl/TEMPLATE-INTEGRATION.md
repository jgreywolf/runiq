# Template Processor + Dynamic Shape Generator Integration

## Overview

Phase 3.3 integrates the dynamic shape generator with the template processor, enabling powerful data-driven diagram generation with automatic styling, filtering, and transformation.

## Key Functions

### `processTemplateWithGeneration()`

Combines template-based processing with automatic node/edge generation and style mapping.

```typescript
import { processTemplateWithGeneration } from '@runiq/parser-dsl';

const template = {
  id: 'user-nodes',
  dataKey: 'users',
  statements: []
};

const data = [
  { id: 'u1', name: 'Alice', status: 'active', score: 95 },
  { id: 'u2', name: 'Bob', status: 'inactive', score: 45 },
  { id: 'u3', name: 'Charlie', status: 'active', score: 78 }
];

const result = processTemplateWithGeneration(template, data, {
  nodeConfig: {
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
          active: 'green',
          inactive: 'gray'
        }
      },
      {
        property: 'opacity',
        field: 'score',
        type: 'scale',
        scale: {
          domain: [0, 100],
          range: ['0.3', '1.0']
        }
      }
    ]
  }
});

// result.nodes:
// [
//   { id: 'u1', shape: 'rect', properties: { label: 'Alice', fill: 'green', opacity: 0.965 } },
//   { id: 'u2', shape: 'rect', properties: { label: 'Bob', fill: 'gray', opacity: 0.615 } },
//   { id: 'u3', shape: 'rect', properties: { label: 'Charlie', fill: 'green', opacity: 0.846 } }
// ]
```

### `generateDiagramFromRelationalData()`

Automatically generates nodes and edges from relational/network data.

```typescript
import { generateDiagramFromRelationalData } from '@runiq/parser-dsl';

const connections = [
  { from: 'Alice', to: 'Bob', strength: 10 },
  { from: 'Bob', to: 'Charlie', strength: 5 },
  { from: 'Charlie', to: 'Alice', strength: 8 }
];

const result = generateDiagramFromRelationalData(connections, {
  nodeConfig: {
    shape: 'circle'
  },
  edgeConfig: {
    fromField: 'from',
    toField: 'to',
    fieldMappings: {
      label: 'strength'
    },
    styleMappings: [
      {
        property: 'strokeWidth',
        field: 'strength',
        type: 'scale',
        scale: {
          domain: [0, 10],
          range: ['1', '5']
        }
      }
    ]
  }
});

// result.nodes: [Alice, Bob, Charlie] (auto-extracted)
// result.edges: 3 edges with varying strokeWidth based on strength
```

## Style Mapping Types

### Category Mapping

Maps categorical values to specific styles:

```typescript
styleMappings: [{
  property: 'fill',
  field: 'status',
  type: 'category',
  categories: {
    active: 'green',
    inactive: 'gray',
    error: 'red'
  }
}]
```

### Scale Mapping

Linear interpolation for numeric values:

```typescript
styleMappings: [{
  property: 'opacity',
  field: 'score',
  type: 'scale',
  scale: {
    domain: [0, 100],      // Input range
    range: ['0.3', '1.0']  // Output range
  }
}]
```

**Color scales:**
```typescript
styleMappings: [{
  property: 'fill',
  field: 'temperature',
  type: 'scale',
  scale: {
    domain: [0, 100],
    range: ['#0000ff', '#ff0000']  // Blue to red gradient
  }
}]
```

### Threshold Mapping

Style based on threshold values:

```typescript
styleMappings: [{
  property: 'fill',
  field: 'score',
  type: 'threshold',
  thresholds: [
    { value: 80, style: 'green' },
    { value: 60, style: 'yellow' },
    { value: 0, style: 'red' }
  ]
}]
```

## Real-World Examples

### Network Service Monitor

```typescript
const services = [
  { name: 'api', status: 'healthy', cpu: 45, memory: 60 },
  { name: 'db', status: 'healthy', cpu: 80, memory: 75 },
  { name: 'cache', status: 'warning', cpu: 60, memory: 90 }
];

const result = processTemplateWithGeneration(template, services, {
  nodeConfig: {
    idField: 'name',
    shape: 'rounded',
    fieldMappings: { label: 'name' },
    styleMappings: [
      {
        property: 'fill',
        field: 'status',
        type: 'category',
        categories: {
          healthy: '#22c55e',
          warning: '#eab308',
          error: '#ef4444'
        }
      },
      {
        property: 'stroke',
        field: 'memory',
        type: 'threshold',
        thresholds: [
          { value: 80, style: 'red' },
          { value: 60, style: 'orange' },
          { value: 0, style: 'green' }
        ]
      }
    ]
  }
});
```

### Social Network Graph

```typescript
const friendships = [
  { user1: 'Alice', user2: 'Bob', since: 2020, interactions: 150 },
  { user1: 'Bob', user2: 'Charlie', since: 2021, interactions: 80 },
  { user1: 'Alice', user2: 'Diana', since: 2019, interactions: 200 }
];

const result = generateDiagramFromRelationalData(friendships, {
  nodeConfig: {
    shape: 'circle'
  },
  edgeConfig: {
    fromField: 'user1',
    toField: 'user2',
    styleMappings: [
      {
        property: 'strokeWidth',
        field: 'interactions',
        type: 'scale',
        scale: {
          domain: [0, 200],
          range: ['1', '5']
        }
      },
      {
        property: 'stroke',
        field: 'since',
        type: 'category',
        categories: {
          '2019': '#1e40af',
          '2020': '#3b82f6',
          '2021': '#60a5fa'
        }
      }
    ]
  }
});
```

### Organizational Hierarchy

```typescript
const employees = [
  { id: 'ceo', name: 'Alice Chen', level: 1, department: 'Executive' },
  { id: 'cto', name: 'Bob Smith', level: 2, department: 'Engineering' },
  { id: 'dev1', name: 'Charlie Lee', level: 3, department: 'Engineering' },
  { id: 'dev2', name: 'Diana Park', level: 3, department: 'Engineering' }
];

const result = processTemplateWithGeneration(template, employees, {
  nodeConfig: {
    idField: 'id',
    shape: 'rect',
    fieldMappings: {
      label: 'name',
      subtitle: 'department'
    },
    styleMappings: [
      {
        property: 'fill',
        field: 'level',
        type: 'category',
        categories: {
          '1': '#FFD700',  // Gold
          '2': '#C0C0C0',  // Silver
          '3': '#CD7F32'   // Bronze
        }
      }
    ]
  }
});
```

## Combining with Templates

You can combine template statements with dynamic generation:

```typescript
const template = {
  id: 'hybrid',
  dataKey: 'items',
  statements: [
    {
      type: 'node',
      id: '${item.id}',
      properties: [
        { key: 'label', value: '${item.name}' }
      ]
    }
  ]
};

// This will process template statements AND generate additional styled nodes
const result = processTemplateWithGeneration(template, data, {
  nodeConfig: {
    // Additional auto-generated nodes
    styleMappings: [/* ... */]
  }
});
```

## API Reference

### Types

```typescript
interface NodeGenerationConfig {
  shape?: string;
  idField?: string;
  idPrefix?: string;
  fieldMappings?: Record<string, string>;
  styleMappings?: StyleMappingConfig[];
}

interface EdgeGenerationConfig {
  fromField: string;
  toField: string;
  edgeType?: string;
  fieldMappings?: Record<string, string>;
  styleMappings?: StyleMappingConfig[];
}

interface StyleMappingConfig {
  property: string;
  field: string;
  type: 'scale' | 'category' | 'threshold';
  scale?: {
    domain: [number, number];
    range: [string, string];
  };
  categories?: Record<string, string>;
  thresholds?: Array<{ value: number; style: string }>;
}
```

## Performance Considerations

- **Large datasets**: Use template `filter` and `limit` to reduce processing
- **Complex mappings**: Category lookups are O(1), scale mappings involve calculations
- **Color interpolation**: RGB calculation for each node with scale mapping

## Next Steps

- See [Legend Generation](./legend-generation.md) for automatic legend creation
- See [Template Syntax](./template-syntax.md) for template language reference
- See [Dynamic Shape Generator](./dynamic-shape-generator.md) for low-level API
