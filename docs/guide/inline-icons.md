---
title: Inline Icons in Labels
---

# Inline Icons in Labels

Runiq supports embedding icons directly within label text using a simple, intuitive syntax inspired by Mermaid. This allows you to add visual context without needing separate `icon:` properties.

## Quick Example

```runiq
shape social as @rectangle label: "fa:fa-twitter for peace"
```

This renders the Twitter icon inline with the text "for peace", making labels more expressive and visual.

## Two Ways to Add Icons

Runiq provides two complementary icon syntaxes:

### 1. Inline Icons (Within Labels) - `label: "provider:icon-name text"`

Embed icons directly in label text for contextual meaning:

```runiq
shape node label: "fa:fa-rocket Launch Plan"
```

**Syntax:** `provider:icon-name` (colon separator)

- **provider**: Icon provider ID (e.g., `fa`)
- **icon-name**: Icon identifier (e.g., `fa-rocket`)

**Examples:**

```runiq
// Icon at the start
shape node1 label: "fa:fa-star Featured Item"

// Icon in the middle
shape node2 label: "Click fa:fa-mouse to continue"

// Icon at the end
shape node3 label: "Follow us fa:fa-arrow-right"

// Multiple icons
shape node4 label: "fa:fa-code and fa:fa-rocket Development"
```

### 2. Corner Icons (Top-Right) - `icon:provider/icon-name`

Add a single icon to the top-right corner of any shape:

```runiq
shape node label: "Server" icon:fa/server
```

**Syntax:** `icon:provider/icon-name` (slash separator)

- **provider**: Icon provider ID (e.g., `fa`)
- **icon-name**: Icon identifier (e.g., `server`)

**Examples:**

```runiq
shape web as @rectangle label: "Web Server" icon:fa/server
shape db as @cylinder label: "Database" icon:fa/database
shape user as @actor label: "Customer" icon:fa/user
shape cloud as @cloud label: "AWS" icon:fa/cloud
```

**Works with all shapes** - Every shape type supports the `icon:` property.

### When to Use Each

| Feature      | Inline Icons (`label: "fa:icon"`) | Corner Icons (`icon:fa/icon`) |
| ------------ | --------------------------------- | ----------------------------- |
| **Syntax**   | Colon `:` separator               | Slash `/` separator           |
| **Location** | Within label text                 | Top-right corner              |
| **Size**     | Matches font size                 | Fixed 16px                    |
| **Quantity** | Multiple per label                | One per shape                 |
| **Use For**  | Contextual meaning                | Status/metadata               |
| **Example**  | `"fa:fa-code Development"`        | `icon:fa/check-circle`        |

## Icon Providers

All registered icon providers are supported. Currently available:

- **fa** or **fontawesome** - FontAwesome icons (500+ icons available)

Example icon names:

- `fa:fa-twitter`, `fa:fa-facebook`, `fa:fa-instagram`
- `fa:fa-rocket`, `fa:fa-star`, `fa:fa-heart`
- `fa:fa-code`, `fa:fa-laptop`, `fa:fa-mobile`
- `fa:fa-dollar`, `fa:fa-chart`, `fa:fa-users`

:::tip Icon Reference
See the [Shape Reference](/reference/shapes#icons) for a complete list of available icons.
:::

## Use Cases

### 1. Mindmaps with Context

Add visual indicators to mindmap branches:

```runiq
diagram "Product Launch" {
  container "Strategy" algorithm: radial spacing: 100 {
    shape main as @circle label: "fa:fa-rocket Launch Plan"

    shape social as @roundedRectangle label: "fa:fa-bullhorn Marketing"
    shape tech as @roundedRectangle label: "fa:fa-code Development"
    shape money as @roundedRectangle label: "fa:fa-dollar Budget"

    main -> social
    main -> tech
    main -> money
  }
}
```

### 2. Flowcharts with Actions

Make process steps more intuitive:

```runiq
diagram "Workflow" {
  shape start as @stadium label: "fa:fa-play Start"
  shape check as @rhombus label: "fa:fa-question Check Status"
  shape save as @rectangle label: "fa:fa-save Save Data"
  shape send as @rectangle label: "fa:fa-paper-plane Send Email"

  start -> check
  check -> save label: "Valid"
  check -> send label: "Invalid"
}
```

### 3. Social Media Diagrams

Instantly recognizable brand icons:

```runiq
diagram "Social Reach" {
  shape hub as @circle label: "fa:fa-users Community"

  shape twitter as @rectangle label: "fa:fa-twitter 10K followers"
  shape linkedin as @rectangle label: "fa:fa-linkedin 5K connections"
  shape facebook as @rectangle label: "fa:fa-facebook 15K likes"

  hub -> twitter
  hub -> linkedin
  hub -> facebook
}
```

## Features

### Automatic Sizing

Icons automatically match the text font size, ensuring consistent appearance:

```runiq
// Small text (12px)
shape small label: "fa:fa-star Small" fontSize: 12

// Large text (20px)
shape large label: "fa:fa-star Large" fontSize: 20
```

### Multiple Icons

Place as many icons as needed in a single label:

```runiq
shape tools label: "fa:fa-code fa:fa-terminal fa:fa-bug Developer Tools"
```

### Flexible Positioning

Icons can appear anywhere in the text:

```runiq
// Start: Icon introduces the concept
shape start label: "fa:fa-lightbulb Great Idea"

// Middle: Icon within context
shape middle label: "Press fa:fa-keyboard to type"

// End: Icon concludes the thought
shape end label: "Learn more fa:fa-graduation"
```

### Works with All Shapes

Inline icons work with any shape type:

```runiq
shape circle as @circle label: "fa:fa-globe World"
shape rect as @rectangle label: "fa:fa-box Package"
shape diamond as @rhombus label: "fa:fa-question Decision"
shape stadium as @stadium label: "fa:fa-flag Finish"
```

## Combining with Traditional Icons

Inline icons complement the traditional top-right `icon:` property:

```runiq
// Inline icon in text + top-right corner icon
shape node label: "fa:fa-twitter Social Media" icon:fa/share
```

Result:

- Twitter icon appears inline with "Social Media" text
- Share icon appears in the top-right corner

This is useful when you want:

- Inline icon for context (within the label text)
- Corner icon for action/status (top-right indicator)

## Rendering Behavior

### Icon Alignment

Icons are vertically aligned with the text baseline for a natural appearance:

```runiq
shape aligned label: "Text fa:fa-star and more text"
```

The icon sits on the same baseline as the surrounding text.

### Spacing

Automatic spacing (4px) is added between icons and text:

```runiq
shape spaced label: "fa:fa-heart Love this"
// Results in: [❤️ icon] [4px] Love this
```

### Missing Icons

If an icon isn't found, a warning is generated and fallback text is shown:

```runiq
shape missing label: "unknown:invalid-icon oops"
// Renders as: [unknown:invalid-icon] oops
// Console warning: "Icon unknown/invalid-icon not found in label"
```

## Best Practices

### 1. Use Icons for Clarity

Icons should enhance understanding, not clutter:

```runiq
// ✅ Good - Icons add clear meaning
shape good label: "fa:fa-warning Critical Alert"

// ❌ Too many - Distracting
shape bad label: "fa:fa-a fa:fa-b fa:fa-c fa:fa-d Text"
```

### 2. Consistent Icon Style

Stick to one icon family for visual consistency:

```runiq
// ✅ All FontAwesome icons
diagram "Consistent" {
  shape a label: "fa:fa-home Home"
  shape b label: "fa:fa-user Profile"
  shape c label: "fa:fa-gear Settings"
}
```

### 3. Icon Placement

Consider natural reading flow:

```runiq
// ✅ Icon before noun (introduces concept)
shape intro label: "fa:fa-database Database Server"

// ✅ Icon after verb (shows action)
shape action label: "Deploy fa:fa-rocket to production"

// ✅ Icon as visual separator
shape separator label: "Before fa:fa-arrow-right After"
```

### 4. Combine with Automatic Styling

In mindmaps, inline icons work beautifully with automatic color theming:

```runiq
diagram "Auto-Styled" {
  container "Ideas" algorithm: radial spacing: 80 {
    // Automatic colors applied, icons inline
    shape center as @circle label: "fa:fa-lightbulb Big Idea"
    shape branch1 as @roundedRectangle label: "fa:fa-rocket Launch"
    shape branch2 as @roundedRectangle label: "fa:fa-users Team"

    center -> branch1
    center -> branch2
  }
}
```

## Technical Details

### Parsing

Label text is analyzed for icon patterns using regex:

- Pattern: `(\w+):(\S+?)(?=\s|$)`
- Matches: `provider:icon-name` followed by space or end of string
- Segments: Label is split into text and icon segments

### Rendering

Icons are rendered as inline `<svg>` elements:

```xml
<g>
  <svg x="100" y="50" width="14" height="14" viewBox="0 0 512 512">
    <path d="..." fill="currentColor" />
  </svg>
  <text x="118" y="50">for peace</text>
</g>
```

### Measurement

Layout calculations account for icon width:

- Text width: `characters × (fontSize × 0.6)`
- Icon width: `fontSize + 4px padding`
- Total width: `textWidth + iconWidth`

## Comparison: Inline vs. Corner Icons

| Feature    | Inline Icons               | Corner Icons            |
| ---------- | -------------------------- | ----------------------- |
| Syntax     | `label: "fa:fa-icon Text"` | `icon:fa/icon`          |
| Position   | Within label text          | Top-right corner        |
| Size       | Matches font size          | Fixed 16px              |
| Purpose    | Contextual meaning         | Status/action indicator |
| Quantity   | Multiple per label         | One per node            |
| Works with | All shapes                 | All shapes              |

### When to Use Each

**Inline Icons** - For:

- Adding context to text
- Making labels more expressive
- Visual categorization
- Reading flow enhancement

**Corner Icons** - For:

- Status indicators
- Action buttons
- Metadata display
- Consistent positioning

**Both Together** - For:

- Rich contextual information (inline) + status (corner)
- Example: `label: "fa:fa-twitter Social" icon:fa/check-circle`

## Examples

### Complete Mindmap

```runiq
diagram "Project Phases" {
  container "Timeline" algorithm: radial spacing: 100 {
    shape project as @circle label: "fa:fa-rocket Project Launch"

    shape plan as @roundedRectangle label: "fa:fa-calendar Planning"
    shape design as @roundedRectangle label: "fa:fa-palette Design"
    shape dev as @roundedRectangle label: "fa:fa-code Development"
    shape test as @roundedRectangle label: "fa:fa-flask Testing"
    shape deploy as @roundedRectangle label: "fa:fa-server Deployment"

    project -> plan
    project -> design
    project -> dev
    project -> test
    project -> deploy
  }
}
```

### Business Process

```runiq
diagram "Order Flow" {
  shape start as @stadium label: "fa:fa-play New Order"
  shape validate as @rhombus label: "fa:fa-check Validate"
  shape payment as @rectangle label: "fa:fa-dollar Process Payment"
  shape shipping as @rectangle label: "fa:fa-truck Ship Order"
  shape complete as @stadium label: "fa:fa-flag Complete"

  start -> validate
  validate -> payment label: "Valid"
  payment -> shipping
  shipping -> complete
}
```

## See Also

- [Shapes Reference](/reference/shapes) - Complete shape catalog
- [Styling Guide](/guide/styling) - Text and color styling
- [Layout Options](/guide/layout) - Positioning and spacing
- [Mindmaps](/guide/flowcharts#mindmaps) - Radial layouts with icons

:::tip Try It Out
Visit the [Runiq Editor](https://editor.runiq.org) to experiment with inline icons in real-time!
:::
