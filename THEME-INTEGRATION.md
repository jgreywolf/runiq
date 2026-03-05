# Theme Integration Examples

The theme systems have been successfully integrated into diagram, sequence, and timeline profiles!

## Usage Examples

### Diagram Profiles (DSL)

Specify theme directly in your diagram DSL using the `theme` statement (like `direction`):

```runiq
diagram "My Architecture" {
  theme ocean
  direction LR

  shape frontend as @rounded label:"Frontend"
  shape backend as @hexagon label:"Backend"
  shape db as @cylinder label:"Database"

  frontend -> backend
  backend -> db
}
```

**Available Themes:**

- `runiq` (default) - Official Runiq brand colors (#5a819e)
- `professional` - Blue/gray professional palette
- `forest` - Green nature-inspired tones
- `sunset` - Warm orange/coral sunset colors
- `ocean` - Deep blue ocean tones
- `monochrome` - Grayscale professional look
- `colorful` - Vibrant multi-color palette
- `vibrant` - Bright saturated colors
- `warm` - Warm red/orange/yellow spectrum
- `cool` - Cool blue/purple spectrum

**Note:** All themes are built on a shared base palette system (`base-themes.ts`) ensuring consistency across diagram, sequence, timeline, and glyphset profiles. If no theme is specified, `runiq` is used by default.

### Diagram Profiles (Programmatic)

You can also pass the theme programmatically when rendering:

```typescript
import { renderSvg } from '@runiq/renderer-svg';
import { parseDiagram } from '@runiq/parser-dsl';
import { layoutDiagram } from '@runiq/layout-base';

// Parse your .runiq file
const ast = parseDiagram(runiqCode);

// Layout the diagram
const layout = await layoutDiagram(ast);

// Render with theme override (overrides DSL theme if specified)
const result = renderSvg(ast, layout, {
  theme: 'ocean', // optional: overrides theme from DSL
});
```

**Theme Priority:**

1. `diagram.theme` (from DSL `theme` statement)
2. `options.theme` (programmatic override)
3. `'runiq'` (default)

### Sequence Diagrams with Themes

```typescript
import { renderSequenceDiagram } from '@runiq/renderer-svg';

// Use a predefined theme
const profile = {
  type: 'sequence',
  title: 'Login Flow',
  theme: 'ocean', // ocean, forest, sunset, monochrome, etc.
  participants: [
    { id: 'user', name: 'User' },
    { id: 'app', name: 'App' },
    { id: 'db', name: 'Database' },
  ],
  messages: [
    { from: 'user', to: 'app', label: 'login()' },
    { from: 'app', to: 'db', label: 'query user' },
  ],
};

const result = renderSequenceDiagram(profile);
```

### Timeline Diagrams with Themes

```typescript
import { renderTimeline } from '@runiq/renderer-svg';

// Use a predefined theme
const profile = {
  type: 'timeline',
  title: 'Project Milestones',
  theme: 'sunset', // professional, forest, sunset, ocean, etc.
  orientation: 'horizontal',
  events: [
    { date: '2025-01-01', label: 'Kickoff' },
    { date: '2025-03-15', label: 'Alpha Release' },
    { date: '2025-06-01', label: 'Beta Release' },
    { date: '2025-09-01', label: 'Launch' },
  ],
};

const result = renderTimeline(profile);
```

### Available Themes

All three profile types support these 9 themes:

- **professional** (default) - Classic blue business tones
- **forest** - Natural greens and earth tones
- **sunset** - Warm oranges, reds, and purples
- **ocean** - Cool blues and teals
- **monochrome** - Sophisticated grayscale
- **colorful** - Vibrant multi-color palette
- **vibrant** - Bold, energetic colors
- **warm** - Warm reds, oranges, and yellows
- **cool** - Cool blues, purples, and teals

Plus timeline has an additional theme:

- **historical** - Vintage sepia tones

## Custom Color Overrides

You can still override individual colors in the render options:

```typescript
// Override specific colors while using a theme base
const result = renderSequenceDiagram(profile, {
  participantColor: '#FF0000', // Custom red
  messageColor: '#00FF00', // Custom green
  // Other colors still use the theme
});
```

## Theme Structure

### Sequence Theme Properties

- `participantColor` - Color for participant boxes
- `participantTextColor` - Text color in participant boxes
- `lifelineColor` - Color for vertical lifelines
- `messageColor` - Color for message arrows and text
- `activationColor` - Color for activation boxes
- `noteColor` - Background color for notes
- `noteTextColor` - Text color in notes
- `fragmentColor` - Background for fragments (loop, alt, etc.)
- `fragmentBorderColor` - Border color for fragments

### Timeline Theme Properties

- `eventColors[]` - Array of colors cycling through events
- `milestoneColor` - Special color for milestone events
- `periodColor` - Background color for time periods
- `lineColor` - Color of the main timeline axis
- `textColor` - Default text color
- `backgroundColor` - Background color
- `accentColor` - Accent/highlight color

### Diagram Theme Properties

- `nodeColors[]` - Array of colors cycling through nodes
- `edgeColor` - Color for edges/connections
- `accentColor` - Accent/highlight color
- `backgroundColor` - Background color
- `textColor` - Default text color

## Implementation Details

Theme support is implemented in:

- `packages/core/src/themes/sequence-themes.ts`
- `packages/core/src/themes/timeline-themes.ts`
- `packages/core/src/themes/diagram-themes.ts`
- `packages/core/src/themes/glyphset-themes.ts` (existing)

All themes are exported from `@runiq/core` for easy access.
