# Glyphsets System Architecture

**Date:** 2026-02-01
**Status:** Implemented
**Feature:** SmartArt-style diagram patterns (branded as "Glyphsets")

---

## Overview

**Glyphsets** provide pre-built diagram patterns that users can instantiate with their own data, similar to PowerPoint SmartArt. This dramatically reduces the effort needed to create common diagram types like process flows, org charts, comparison matrices, and more.

### Why "Glyphsets"?

The name "Glyphsets" was chosen to:

- **Avoid confusion** with existing Runiq features (Container Templates, Data-Driven Templates)
- **Embed branding** around the "glyph" concept central to Runiq
- **Describe functionality** - sets of glyphs arranged in meaningful patterns
- **Sound professional** and unique in the diagramming space

---

## Architecture Components

### 1. Glyphset Definition Format

Glyphsets are defined as **parameterized diagram generators** that take user input and produce complete Runiq diagrams.

#### Glyphset Structure (TypeScript)

```typescript
interface GlyphSetDefinition {
  id: string; // e.g., "basicProcess"
  name: string; // e.g., "Basic Process"
  category: string; // e.g., "process", "hierarchy", "comparison"
  description: string; // Help text for users

  parameters: GlyphSetParameter[]; // What inputs does the glyphset need?
  generator: GlyphSetGenerator; // Function that creates the diagram

  // Metadata
  tags?: string[]; // Searchability
  preview?: string; // SVG/image preview path
  minItems?: number; // Minimum items needed
  maxItems?: number; // Maximum items supported
}

interface GlyphSetParameter {
  name: string; // e.g., "items", "levels", "title"
  type: 'string' | 'number' | 'array' | 'boolean';
  required: boolean;
  default?: any;
  description?: string;
}

type GlyphSetGenerator = (params: Record<string, any>) => DiagramAst;
```

---

### 2. Glyphset Storage & Registry

Glyphsets will be stored in two ways:

#### Option A: JavaScript/TypeScript Modules (Implemented)

**Location:** `packages/glyphsets/src/`

```
packages/glyphsets/
├── src/
│   ├── index.ts                 # Glyphset registry
│   ├── process/
│   │   ├── basicProcess.ts
│   │   ├── stepProcess.ts
│   │   └── cycle.ts
│   ├── hierarchy/
│   │   ├── org-chart.ts
│   │   └── pyramid.ts
│   ├── comparison/
│   │   ├── venn.ts
│   │   └── matrix.ts
│   └── visualization/
│       ├── timeline.ts
│       └── funnel.ts
├── tests/
└── package.json
```

**Package Name:** `@runiq/glyphsets`

**Notes:**

- Type-safe Glyphset definitions
- Can use full TypeScript/JavaScript logic
- Easy testing
- Tree-shakeable (only include glyphsets you use)

#### Option B: JSON/YAML Configuration Files (Future)

**Location:** `packages/glyphsets/definitions/`

**Pros:**

- Human-readable
- Easy for non-developers to create
- Could support user-created glyphsets

**Decision:** **Option A is implemented** (TypeScript modules). Option B remains a future enhancement for user extensibility.

---

### 3. Glyphset DSL Syntax

Users invoke glyphsets through the dedicated `glyphset` profile:

```runiq
glyphset basicProcess "My Process" {
  item "Research"
  item "Design"
  item "Develop"
  item "Test"
  item "Deploy"
}
```

**Decision:** Use the `glyphset <type> "Name" { ... }` profile syntax. Item keywords (`item`, `step`, `person`, `level`, etc.) vary by glyphset.

---

### 4. Glyphset Expansion Process

```
User DSL (with glyphset)
    ↓
Parser detects glyphset profile
    ↓
Glyphset Registry lookup
    ↓
Extract user parameters (items, levels, people, etc.)
    ↓
Glyphset Generator function
    ↓
Generated DiagramAst (expanded)
    ↓
Normal layout/render pipeline
```

#### Expansion Timing

**Parse-time expansion (Implemented)**

- Glyphset expanded during parsing
- Results in standard `DiagramAst`
- Transparent to layout/render engines
- Easier to debug (expanded AST is visible in logs)

---

### 5. Integration Points

#### 5.1 Grammar Integration (Langium)

Glyphsets are a dedicated profile with their own declaration:

```runiq
glyphset <type> "Title" {
  item "Label"
  item "Label"
}
```

The grammar defines profile-specific item keywords (for example `item`, `step`, `person`, `level`) and passes the parsed data into the glyphset expansion pipeline.

#### 5.2 Parser Integration

```typescript
// packages/parser-dsl/src/langium-parser.ts
import { glyphsetRegistry } from '@runiq/glyphsets';

function expandGlyphsetProfile(profile: GlyphsetProfile): DiagramAst {
  const glyphset = glyphsetRegistry.get(profile.glyphsetId);
  if (!glyphset) {
    throw new Error(`Unknown glyphset: ${profile.glyphsetId}`);
  }

  const params = extractGlyphsetParams(profile, glyphset.parameters);
  return glyphset.generator(params);
}
```

#### 5.3 Glyphset Registry

```typescript
// packages/glyphsets/src/index.ts

export class GlyphSetRegistry {
  private glyphsets = new Map<string, GlyphSetDefinition>();

  register(glyphset: GlyphSetDefinition): void {
    this.glyphsets.set(glyphset.id, glyphset);
  }

  get(id: string): GlyphSetDefinition | undefined {
    return this.glyphsets.get(id);
  }

  list(category?: string): GlyphSetDefinition[] {
    const all = Array.from(this.glyphsets.values());
    return category ? all.filter((g) => g.category === category) : all;
  }
}

// Global registry
export const glyphsetRegistry = new GlyphSetRegistry();

// Auto-register built-in glyphsets
import { basicProcessGlyphSet } from './process/basicProcess';
import { pyramidGlyphset } from './hierarchy/pyramid';
// ... more imports

glyphsetRegistry.register(basicProcessGlyphSet);
glyphsetRegistry.register(pyramidGlyphset);
// ... more registrations
```

---

### 6. Example Glyphset Implementation

```typescript
// packages/glyphsets/src/process/basicProcess.ts

import type { GlyphSetDefinition, DiagramAst } from '@runiq/core';

export const basicProcessGlyphSet: GlyphSetDefinition = {
  id: 'basicProcess',
  name: 'Basic Process',
  category: 'process',
  description: 'Linear process flow with horizontal or vertical orientation',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of item labels',
    },
    {
      name: 'shape',
      type: 'string',
      required: false,
      default: 'rounded',
      description: 'Shape for each item',
    },
  ],

  minItems: 2,
  maxItems: 10,

  generator: (params) => {
    const items = params.items as string[];
    const shape = (params.shape as string) || 'rounded';

    // Generate nodes
    const nodes = items.map((label, i) => ({
      id: `item${i + 1}`,
      shape,
      label,
    }));

    // Generate edges (sequential connections)
    const edges = [];
    for (let i = 0; i < items.length - 1; i++) {
      edges.push({
        from: `item${i + 1}`,
        to: `item${i + 2}`,
      });
    }

    // Return complete diagram AST
    return {
      astVersion: '1.0',
      direction: 'LR', // Left-to-right
      nodes,
      edges,
      groups: [],
      styles: {},
    };
  },
};
```

#### Styling and Layout Notes

Glyphsets generate standard nodes and edges in a `DiagramAst`. Styling is applied via glyphset parameters and themes during generation; container templates are not part of the glyphset expansion path today.

---

### 7. Parameter Extraction

Glyphsets need to extract user data from the DSL body:

```typescript
// packages/parser-dsl/src/glyphset-parser.ts

function extractGlyphsetParams(
  body: any,
  paramDefs: GlyphSetParameter[]
): Record<string, any> {
  const params: Record<string, any> = {};

  // Look for 'item' declarations -> items array
  if (body.items) {
    params.items = body.items.map((i: any) => i.label);
  }

  // Extract property overrides
  if (body.properties) {
    for (const prop of body.properties) {
      params[prop.key] = prop.value;
    }
  }

  // Apply defaults for missing required params
  for (const def of paramDefs) {
    if (!(def.name in params) && def.default !== undefined) {
      params[def.name] = def.default;
    }
  }

  // Validate required params
  for (const def of paramDefs) {
    if (def.required && !(def.name in params)) {
      throw new Error(`Missing required parameter: ${def.name}`);
    }
  }

  return params;
}
```

---

### 8. Error Handling

```typescript
class GlyphSetError extends Error {
  constructor(
    public glyphsetId: string,
    public parameterName?: string,
    message?: string
  ) {
    super(message || `Glyphset error in ${glyphsetId}`);
    this.name = 'GlyphSetError';
  }
}

// Usage in generator
if (items.length < 2) {
  throw new GlyphSetError(
    'basicProcess',
    'items',
    'Basic process requires at least 2 items'
  );
}
```

---

### 9. Testing Strategy

Glyphsets have per-glyphset unit tests under `packages/glyphsets/src/**.spec.ts` that validate:

- Item count constraints (`minItems`, `maxItems`)
- Key layout properties (node counts, edge counts)
- Parameter handling (shape overrides, optional labels)

---

### 10. Relationship to Existing Runiq Features

#### Distinction from Container Templates

| Feature            | Container Templates | Glyphsets                      |
| ------------------ | ------------------- | ------------------------------ |
| **Purpose**        | Style reuse         | Pre-built diagram patterns     |
| **Scope**          | Single container    | Complete multi-node diagrams   |
| **DSL Syntax**     | `template "name"`   | `glyphset <type> "Name" { }`   |
| **Defined In**     | Diagram AST         | `@runiq/glyphsets` package     |
| **Referenced Via** | `templateId:`       | Glyphset profile declaration   |

#### Distinction from Data-Driven Templates

| Feature         | Data-Driven Templates                | Glyphsets                    |
| --------------- | ------------------------------------ | ---------------------------- |
| **Purpose**     | Generate from external data          | Generate from inline items   |
| **DSL Syntax**  | `foreach "name" from:datasource { }` | `glyphset <type> "Name" { }` |
| **Data Source** | External (CSV, JSON, API)            | Inline (DSL body)            |
| **Use Case**    | Dynamic data visualization           | Quick diagram scaffolding    |

---

### 11. Future Enhancements

- JSON/YAML glyphset definitions for user extensibility
- Glyphset gallery in docs with previews
- Glyphset composition (glyphsets that use other glyphsets)
- Optional parameter-driven layout variants per glyphset

---

## Current Status Checklist

- ? `@runiq/glyphsets` package with registry and generators
- ? Glyphset profile parsing and parse-time expansion
- ? 61 built-in glyphsets across 6 categories
- ? Reference documentation and examples
