# GlyphSets System Architecture

**Date:** 2025-01-10
**Status:** Design Phase
**Feature:** SmartArt-style diagram patterns (branded as "GlyphSets")

---

## Overview

**GlyphSets** provide pre-built diagram patterns that users can instantiate with their own data, similar to PowerPoint SmartArt. This dramatically reduces the effort needed to create common diagram types like process flows, org charts, comparison matrices, and more.

### Why "GlyphSets"?

The name "GlyphSets" was chosen to:

- **Avoid confusion** with existing Runiq features (Container Templates, Data-Driven Templates)
- **Embed branding** around the "glyph" concept central to Runiq
- **Describe functionality** - sets of glyphs arranged in meaningful patterns
- **Sound professional** and unique in the diagramming space

---

## Architecture Components

### 1. GlyphSet Definition Format

GlyphSets are defined as **parameterized diagram generators** that take user input and produce complete Runiq diagrams.

#### GlyphSet Structure (TypeScript)

```typescript
interface GlyphSetDefinition {
  id: string; // e.g., "horizontal-process"
  name: string; // e.g., "Horizontal Process"
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
  name: string; // e.g., "steps", "items", "title"
  type: 'string' | 'number' | 'array' | 'boolean';
  required: boolean;
  default?: any;
  description?: string;
}

type GlyphSetGenerator = (params: Record<string, any>) => DiagramAst;
```

---

### 2. GlyphSet Storage & Registry

GlyphSets will be stored in two ways:

#### Option A: JavaScript/TypeScript Modules (Recommended)

**Location:** `packages/glyphsets/src/`

```
packages/glyphsets/
├── src/
│   ├── index.ts                 # GlyphSet registry
│   ├── process/
│   │   ├── horizontal-process.ts
│   │   ├── vertical-process.ts
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

**Pros:**

- Type-safe GlyphSet definitions
- Can use full TypeScript/JavaScript logic
- Easy testing
- Tree-shakeable (only include glyphsets you use)

#### Option B: JSON/YAML Configuration Files

**Location:** `packages/glyphsets/definitions/`

**Pros:**

- Human-readable
- Easy for non-developers to create
- Could support user-created glyphsets

**Decision:** **Start with Option A** (TypeScript modules), add Option B later for user extensibility.

---

### 3. GlyphSet DSL Syntax

Users invoke GlyphSets through a special DSL syntax:

#### Syntax Option 1: GlyphSet Property (Recommended)

```runiq
diagram "My Process" glyphset:horizontal-process {
  step "Research"
  step "Design"
  step "Develop"
  step "Test"
  step "Deploy"
}
```

#### Syntax Option 2: GlyphSet Keyword (More Explicit)

```runiq
glyphset horizontal-process "My Process" {
  step "Research"
  step "Design"
  step "Develop"
  step "Test"
  step "Deploy"
}
```

#### Syntax Option 3: From Clause (Declarative)

```runiq
diagram "My Process" from glyphset horizontal-process {
  items: ["Research", "Design", "Develop", "Test", "Deploy"]
}
```

**Decision:** **Option 1** (`glyphset:` property) - simplest, most consistent with existing syntax, avoids collision with `template` keyword.

---

### 4. GlyphSet Expansion Process

```
User DSL (with glyphset)
    ↓
Parser detects glyphset usage
    ↓
GlyphSet Registry lookup
    ↓
Extract user parameters (steps, items, etc.)
    ↓
GlyphSet Generator function
    ↓
Generated DiagramAst (expanded)
    ↓
Normal layout/render pipeline
```

#### Expansion Timing Options:

**Option A: Parse-time expansion** (Recommended)

- GlyphSet expanded during parsing
- Results in standard DiagramAst
- Transparent to layout/render engines
- Easier to debug (see expanded output)

**Option B: Pre-processing**

- GlyphSets expanded before parsing
- Generate text DSL, then parse
- Could allow glyphset chaining

**Decision:** **Option A** - cleaner architecture, better error messages

---

### 5. Integration Points

#### 5.1 Grammar Changes (Langium)

Add GlyphSet support to diagram declaration:

```langium
DiagramDeclaration:
    'diagram' (type=DiagramType)? name=STRING ('glyphset:' glyphset=ID)? '{'
        body=DiagramBody
    '}';

// For glyphset-specific syntax
GlyphSetItem:
    'step' label=STRING properties+=Property*
    | 'item' label=STRING properties+=Property*
    | 'level' label=STRING children+=GlyphSetItem*;
```

**Note:** Using `glyphset:` instead of `template:` avoids collision with existing `template "name" { }` blocks for container templates.

#### 5.2 Parser Integration

```typescript
// packages/parser-dsl/src/langium-parser.ts
import { glyphsetRegistry } from '@runiq/glyphsets';

function parseDiagram(statement: Langium.DiagramDeclaration): DiagramAst {
  // Check if glyphset is specified
  if (statement.glyphset) {
    return expandGlyphSet(statement.glyphset, statement.body);
  }

  // Normal parsing
  return parseNormalDiagram(statement);
}

function expandGlyphSet(glyphsetId: string, body: any): DiagramAst {
  const glyphset = glyphsetRegistry.get(glyphsetId);
  if (!glyphset) {
    throw new Error(`Unknown glyphset: ${glyphsetId}`);
  }

  // Extract parameters from body
  const params = extractGlyphSetParams(body, glyphset.parameters);

  // Generate diagram
  return glyphset.generator(params);
}
```

#### 5.3 GlyphSet Registry

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
import { horizontalProcessGlyphSet } from './process/horizontal-process';
import { pyramidGlyphSet } from './hierarchy/pyramid';
// ... more imports

glyphsetRegistry.register(horizontalProcessGlyphSet);
glyphsetRegistry.register(pyramidGlyphSet);
// ... more registrations
```

---

### 6. Example GlyphSet Implementation

```typescript
// packages/glyphsets/src/process/horizontal-process.ts

import type { GlyphSetDefinition, DiagramAst } from '@runiq/core';

export const horizontalProcessGlyphSet: GlyphSetDefinition = {
  id: 'horizontal-process',
  name: 'Horizontal Process',
  category: 'process',
  description: 'Linear process flow from left to right',

  parameters: [
    {
      name: 'steps',
      type: 'array',
      required: true,
      description: 'Array of step labels',
    },
    {
      name: 'shape',
      type: 'string',
      required: false,
      default: 'rounded',
      description: 'Shape for each step',
    },
  ],

  minItems: 2,
  maxItems: 10,

  generator: (params) => {
    const steps = params.steps as string[];
    const shape = (params.shape as string) || 'rounded';

    // Generate nodes
    const nodes = steps.map((label, i) => ({
      id: `step${i + 1}`,
      shape,
      label,
    }));

    // Generate edges (sequential connections)
    const edges = [];
    for (let i = 0; i < steps.length - 1; i++) {
      edges.push({
        from: `step${i + 1}`,
        to: `step${i + 2}`,
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

#### Integration with Container Templates

GlyphSets can leverage existing container templates for consistent styling:

```typescript
// Enhanced version with container template support
export const horizontalProcessGlyphSet: GlyphSetDefinition = {
  id: 'horizontal-process',
  name: 'Horizontal Process',
  category: 'process',
  description: 'Linear process flow from left to right',

  parameters: [
    {
      name: 'steps',
      type: 'array',
      required: true,
      description: 'Array of step labels',
    },
  ],

  generator: (params) => {
    const steps = params.steps as string[];

    // Define a container template for process steps
    const templates = [
      {
        id: 'process-step',
        containerStyle: {
          fillColor: '#e3f2fd',
          strokeColor: '#2196f3',
          borderWidth: 2,
          padding: 15,
          shadow: true,
        },
      },
    ];

    // Generate containers using the template
    const containers = steps.map((label, i) => ({
      type: 'container' as const,
      id: `step${i + 1}`,
      label,
      children: [],
      containerStyle: {
        templateId: 'process-step', // ✅ Reuse container template!
      },
    }));

    // Connect containers with edges
    const edges = [];
    for (let i = 0; i < steps.length - 1; i++) {
      edges.push({
        from: `step${i + 1}`,
        to: `step${i + 2}`,
      });
    }

    return {
      astVersion: '1.0',
      direction: 'LR',
      nodes: [],
      edges,
      containers,
      templates, // Include container templates
    };
  },
};
```

---

### 7. Parameter Extraction

GlyphSets need to extract user data from the DSL body:

```typescript
// packages/parser-dsl/src/glyphset-parser.ts

function extractGlyphSetParams(
  body: any,
  paramDefs: GlyphSetParameter[]
): Record<string, any> {
  const params: Record<string, any> = {};

  // Look for 'step' declarations -> steps array
  if (body.steps) {
    params.steps = body.steps.map((s: any) => s.label);
  }

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
    super(message || `GlyphSet error in ${glyphsetId}`);
    this.name = 'GlyphSetError';
  }
}

// Usage in generator
if (steps.length < 2) {
  throw new GlyphSetError(
    'horizontal-process',
    'steps',
    'Horizontal process requires at least 2 steps'
  );
}
```

---

### 9. Testing Strategy

```typescript
// packages/glyphsets/tests/horizontal-process.test.ts

import { describe, it, expect } from 'vitest';
import { horizontalProcessGlyphSet } from '../src/process/horizontal-process';

describe('Horizontal Process GlyphSet', () => {
  it('generates diagram with 3 steps', () => {
    const result = horizontalProcessGlyphSet.generator({
      steps: ['Start', 'Middle', 'End'],
    });

    expect(result.nodes).toHaveLength(3);
    expect(result.edges).toHaveLength(2);
    expect(result.direction).toBe('LR');
  });

  it('validates minimum steps', () => {
    expect(() => {
      horizontalProcessGlyphSet.generator({ steps: ['Only One'] });
    }).toThrow('at least 2 steps');
  });

  it('uses custom shape', () => {
    const result = horizontalProcessGlyphSet.generator({
      steps: ['A', 'B'],
      shape: 'rect',
    });

    expect(result.nodes[0].shape).toBe('rect');
  });
});
```

---

### 10. Relationship to Existing Runiq Features

#### Distinction from Container Templates

| Feature            | Container Templates (Existing) | GlyphSets (New)               |
| ------------------ | ------------------------------ | ----------------------------- |
| **Purpose**        | Style reuse for containers     | Pre-built diagram patterns    |
| **Scope**          | Single container styling       | Complete multi-node diagrams  |
| **DSL Syntax**     | `template "name" { ... }`      | `glyphset:horizontal-process` |
| **Defined In**     | Diagram AST                    | `@runiq/glyphsets` package    |
| **Referenced Via** | `templateId: "name"`           | `glyphset:` property          |

#### Integration with Container Templates

GlyphSets can **leverage** container templates for consistent styling:

```typescript
// GlyphSet generates containers that reference container templates
const diagram = {
  templates: [{ id: 'process-step', containerStyle: {...} }],  // Container template
  containers: steps.map(step => ({
    containerStyle: { templateId: 'process-step' }  // ✅ Uses container template
  }))
};
```

#### Distinction from Data-Driven Templates

| Feature         | Data-Driven Templates (Existing)          | GlyphSets (New)                       |
| --------------- | ----------------------------------------- | ------------------------------------- |
| **Purpose**     | Generate diagrams from data sources       | Generate diagrams from user input     |
| **DSL Syntax**  | `template "name" from:datasource { ... }` | `glyphset:horizontal-process { ... }` |
| **Data Source** | External (CSV, JSON, API)                 | Inline (DSL body)                     |
| **Use Case**    | Dynamic data visualization                | Quick diagram scaffolding             |

---

### 11. Future Enhancements

#### Phase 2: Advanced Features

- **GlyphSet composition**: GlyphSets that use other glyphsets
- **Conditional logic**: Different layouts based on item count
- **Style presets**: Color schemes, fonts per glyphset
- **Custom layouts**: GlyphSet-specific layout algorithms

#### Phase 3: User Extensions

- **JSON glyphset definitions**: Allow users to create glyphsets
- **GlyphSet marketplace**: Share community glyphsets
- **Visual glyphset builder**: GUI for creating glyphsets

#### Phase 4: Smart GlyphSets

- **Data binding**: Connect glyphsets to data sources (CSV, JSON, APIs)
- **Auto-layout optimization**: AI-assisted glyphset selection
- **Responsive glyphsets**: Adapt based on item count/complexity

---

## Implementation Plan

### Milestone 1: Core Infrastructure (Day 1)

1. ✅ Create `@runiq/glyphsets` package structure
2. ✅ Define TypeScript interfaces (`GlyphSetDefinition`, `GlyphSetParameter`, etc.)
3. ✅ Implement `GlyphSetRegistry` class
4. Add basic glyphset expansion to parser
5. Write infrastructure tests

### Milestone 2: Initial GlyphSets (Day 2)

1. Implement 5 essential glyphsets:
   - `horizontal-process` - Linear left-to-right process
   - `vertical-process` - Top-to-bottom process
   - `pyramid` - Hierarchical pyramid
   - `cycle` - Circular process
   - `matrix` - 2x2 comparison matrix
2. Test each glyphset thoroughly
3. Add integration with container templates

### Milestone 3: DSL Integration (Day 2-3)

1. Update Langium grammar with `glyphset:` property
2. Implement `extractGlyphSetParams` function
3. Error handling and validation (`GlyphSetError`)
4. Integration tests with parser

### Milestone 4: Documentation & Examples (Day 3)

1. GlyphSet gallery in docs
2. Usage guide (`/reference/glyphsets.md`)
3. Example diagrams for each glyphset
4. Comparison with SmartArt patterns

---

## Open Questions

1. **Should glyphsets support nested items?** (e.g., hierarchical processes)
   - **Decision:** Yes, for glyphsets like pyramid and org-chart

2. **Should glyphset expansion be reversible?** (can we extract params from expanded diagram?)
   - **Decision:** Not initially, but keep in mind for future

3. **Should users be able to override individual nodes/edges in glyphset?**
   - **Decision:** Yes, via additional DSL syntax after glyphset body

4. **How do glyphsets interact with styles?**
   - **Decision:** GlyphSets can define default styles (including container templates), user styles override

5. **Should glyphsets be able to use existing container templates?**
   - **Decision:** ✅ Yes! GlyphSets should leverage existing container templates for consistent styling

---

## Success Criteria

- ✅ 15 glyphsets implemented and tested
- ✅ GlyphSet syntax works in DSL (`glyphset:` property)
- ✅ Clear error messages for glyphset errors
- ✅ Documentation with visual gallery
- ✅ 25+ tests passing
- ✅ Zero breaking changes to existing diagrams
- ✅ Zero naming conflicts with existing "template" features
- ✅ Integration with existing container templates demonstrated

---

## Next Steps

1. ✅ Review and approve this architecture
2. ✅ Finalize naming (chose "GlyphSets" ✅)
3. Create `@runiq/glyphsets` package skeleton
4. Implement first glyphset (horizontal-process) as proof of concept
5. Demonstrate integration with container templates
6. Iterate based on learnings

---

## Appendix: Terminology Comparison

### Why Not Call It "Templates"?

Runiq already uses "template" in **two contexts**:

1. **Container Templates** (`template "name" { ... }`)
   - Reusable container styling patterns
   - Defined inline in diagrams
   - Referenced via `templateId: "name"`

2. **Data-Driven Templates** (`template "name" from:datasource { ... }`)
   - Generate diagrams from external data
   - Use variable substitution (`${item.id}`)
   - Support conditionals and loops

Adding a third "template" meaning would create confusion.

### Why "GlyphSets"?

- ✅ **Unique** - No collision with existing features
- ✅ **Branded** - Reinforces Runiq's "glyph" concept
- ✅ **Descriptive** - Sets of glyphs in meaningful patterns
- ✅ **Professional** - Sounds polished and purposeful
- ✅ **Memorable** - Distinctive name for marketing

### Alternative Names Considered

| Name                  | Pros                     | Cons                  | Decision          |
| --------------------- | ------------------------ | --------------------- | ----------------- |
| **Diagram Patterns**  | Clear, descriptive       | Generic               | ❌ Not branded    |
| **SmartArt Patterns** | Familiar to Office users | Trademarked           | ❌ Legal issues   |
| **Quick Starts**      | User-friendly            | Vague purpose         | ❌ Too generic    |
| **Diagram Presets**   | Consistent with UI       | "Preset" already used | ❌ Confusing      |
| **Layout Templates**  | Descriptive              | Uses "template"       | ❌ Name collision |
| **GlyphSets**         | Unique, branded, clear   | New term to learn     | ✅ **CHOSEN**     |
