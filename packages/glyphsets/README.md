# @runiq/glyphsets

Pre-built diagram patterns (GlyphSets) for Runiq - SmartArt-style templates.

## Overview

**GlyphSets** provide ready-to-use diagram patterns that users can instantiate with their own data, similar to PowerPoint SmartArt. This dramatically reduces the effort needed to create common diagram types like process flows, org charts, comparison matrices, and more.

## Features

- **8 Built-in Patterns**: Process flows, hierarchies, comparisons, and visualizations (more coming soon!)
- **Type-Safe**: Full TypeScript support
- **Extensible**: Easy to add custom glyphsets
- **Integrated**: Works seamlessly with Runiq's DSL and existing features
- **Container Template Support**: Leverages existing container templates for consistent styling
- **Comprehensive Testing**: 68+ tests ensuring reliability

## Usage

```typescript
import { glyphsetRegistry } from '@runiq/glyphsets';

// Get a glyphset
const processGlyphSet = glyphsetRegistry.get('horizontal-process');

// Generate a diagram
const diagram = processGlyphSet.generator({
  steps: ['Research', 'Design', 'Develop', 'Test', 'Deploy'],
});
```

### In Runiq DSL

```runiq
glyphset horizontalProcess "Process Phases" {
  step "Research"
  step "Design"
  step "Develop"
  step "Test"
  step "Deploy"
}
```

## Available GlyphSets

### Process (3 glyphsets)

- **`horizontalProcess`** - Linear left-to-right process (2-10 steps)
  - Parameters: `steps`, `shape`, `useContainers`
  - Example: Software development lifecycle, user journey

- **`verticalProcess`** - Top-to-bottom process (2-10 steps)
  - Parameters: `steps`, `shape`
  - Example: Project phases, waterfall methodology

- **`cycle`** - Circular process flow (3-8 steps)
  - Parameters: `steps`, `shape`
  - Example: PDCA cycle, iterative development

### Hierarchy (1 glyphset)

- **`pyramid`** - Hierarchical pyramid structure (3-7 levels)
  - Parameters: `levels`, `shape`, `showConnections`
  - Example: Maslow's hierarchy, organizational levels

### Comparison (2 glyphsets)

- **`matrix`** - 2x2 comparison matrix (exactly 4 quadrants)
  - Parameters: `quadrants`, `horizontalAxis`, `verticalAxis`
  - Example: SWOT analysis, Eisenhower matrix

- **`venn`** - Venn diagram with overlapping circles (2-3 circles)
  - Parameters: `circles`, `showIntersection`
  - Example: Feature overlap, skill sets

### Visualization (2 glyphsets)

- **`funnel`** - Funnel visualization for conversion stages (3-7 stages)
  - Parameters: `stages`, `shape`
  - Example: Sales funnel, user conversion

- **`timeline`** - Horizontal timeline with events (2-10 events)
  - Parameters: `events`, `shape`, `showConnections`
  - Example: Project roadmap, historical events

### Coming Soon

- `chevron` - Chevron progression
- `hierarchy` - Tree hierarchy
- `org-chart` - Organization chart
- `radial` - Radial/spoke diagram
- `list` - Styled list
- `stack` - Stacked items
- `target` - Concentric target/bullseye

## API

### GlyphSetDefinition

```typescript
interface GlyphSetDefinition {
  id: string;
  name: string;
  category: 'process' | 'hierarchy' | 'comparison' | 'visualization';
  description: string;
  parameters: GlyphSetParameter[];
  generator: GlyphSetGenerator;
  tags?: string[];
  preview?: string;
  minItems?: number;
  maxItems?: number;
}
```

### GlyphSetRegistry

```typescript
class GlyphSetRegistry {
  register(glyphset: GlyphSetDefinition): void;
  get(id: string): GlyphSetDefinition | undefined;
  list(category?: string): GlyphSetDefinition[];
}
```

## Contributing

See the [GlyphSets Architecture](../../docs/template-system-architecture.md) document for implementation details.

## License

MIT
