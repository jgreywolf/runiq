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
const processGlyphSet = glyphsetRegistry.get('basicProcess');

// Generate a diagram
const diagram = processGlyphSet.generator({
  steps: ['Research', 'Design', 'Develop', 'Test', 'Deploy'],
  orientation: 'horizontal',
  theme: 'colorful',
});
```

### In Runiq DSL

```runiq
glyphset basicProcess "Process Phases" {
  steps: ["Research", "Design", "Develop", "Test", "Deploy"]
  orientation: "horizontal"
  theme: "colorful"
}
```

## Available GlyphSets

### Process (3 glyphsets)

- **`basicProcess`** - Linear process with horizontal or vertical orientation (2-10 steps)
  - Parameters: `steps` (array), `orientation` ("horizontal" or "vertical"), `theme`, `shape`, `useContainers`
- **`alternatingProcess`** - Staggered process (2-8 steps)

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
