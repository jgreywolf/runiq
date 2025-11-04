# Inline Icon Syntax

## Overview

Runiq supports inline icons within labels, inspired by Mermaid's icon syntax. This allows you to embed icons directly in text labels without needing separate `icon:` properties.

## Syntax

```
provider:icon-name
```

For example:

```
label: "fa:fa-twitter for peace"
```

This will render the Twitter icon inline with the text " for peace".

## Supported Providers

All registered icon providers are supported. Currently:

- **fa** or **fontawesome** - FontAwesome icons

## Examples

### Basic Usage

```runiq
shape node1 as @rectangle label: "fa:fa-rocket Launch"
```

### Multiple Icons

```runiq
shape node2 as @rectangle label: "fa:fa-twitter and fa:fa-facebook social"
```

### Icon at Different Positions

```runiq
// Icon at start
shape start as @circle label: "fa:fa-star Featured"

// Icon in middle
shape middle as @circle label: "Click fa:fa-mouse to continue"

// Icon at end
shape end as @circle label: "Follow us fa:fa-arrow-right"
```

### Mindmap Example

```runiq
diagram "Social Strategy" {
  container "Campaign" algorithm: radial spacing: 100 {
    shape main as @circle label: "fa:fa-rocket Launch Plan"

    shape twitter as @roundedRectangle label: "fa:fa-twitter Twitter"
    shape facebook as @roundedRectangle label: "fa:fa-facebook Facebook"
    shape instagram as @roundedRectangle label: "fa:fa-instagram Instagram"

    main -> twitter
    main -> facebook
    main -> instagram
  }
}
```

## Implementation

Inline icons are parsed from label text using the pattern `provider:icon-name`. The icon is rendered inline with the text at the appropriate size (matching the font size).

### Parser

The label text is analyzed for icon patterns:

- `fa:fa-twitter` → Icon reference
- Regular text → Plain text segment

### Renderer

Icons are rendered as inline SVG elements within the text flow:

- Icon size matches the text font size
- Icons are vertically aligned with text baseline
- Proper spacing is maintained between icons and text

## Notes

- Icon names must match registered icon provider names exactly
- If an icon is not found, a warning is generated and fallback text `[provider:icon-name]` is shown
- Icons in labels are separate from the `icon:` property which renders in the top-right corner
- The inline icon feature works across all shape types

## Comparison with Traditional Syntax

### Traditional (Top-Right Icon)

```runiq
shape node as @rectangle label: "Twitter" icon:fa/twitter
```

Result: "Twitter" text with small icon in top-right corner

### Inline Icon

```runiq
shape node as @rectangle label: "fa:fa-twitter Twitter"
```

Result: Icon inline with "Twitter" text (icon appears before the text)

### Both Combined

```runiq
shape node as @rectangle label: "fa:fa-twitter for peace" icon:fa/dove
```

Result: Twitter icon inline with text, plus dove icon in top-right corner
