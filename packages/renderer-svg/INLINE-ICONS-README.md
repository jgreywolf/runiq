# Inline Icons in Labels

This feature allows embedding icons directly within label text using a simple syntax inspired by Mermaid.

## Quick Start

```runiq
shape social as @rectangle label: "fa:fa-twitter for peace"
```

This renders the Twitter icon inline with the text "for peace".

## Features

- **Simple syntax**: `provider:icon-name` anywhere in label text
- **Multiple icons**: Place as many icons as you need in a label
- **Flexible positioning**: Icons at start, middle, or end of text
- **Auto-sizing**: Icons match the text font size
- **All shapes**: Works with any shape type (rectangle, circle, etc.)
- **Compatibility**: Works alongside traditional top-right `icon:` property

## API

### `parseLabelWithIcons(label: string): LabelSegment[]`

Parses a label string into segments (text or icon references).

### `renderLabelWithIcons(label, x, y, style, warnings): string`

Renders a label with inline icons as SVG markup.

### `measureLabelWithIcons(label, fontSize): number`

Calculates approximate width of a label with icons for layout purposes.

## Examples

See `/examples/mindmaps/inline-icon-syntax-test.runiq` for a complete example.

See `/docs/reference/inline-icons.md` for full documentation.

## Implementation Details

- Icons are rendered as inline `<svg>` elements within text flow
- Icon size equals text font size for consistent appearance
- Missing icons generate warnings and show fallback text
- Uses the same icon registry as top-right corner icons

## Tests

Run tests with:

```bash
pnpm test
```

Test file: `src/__tests__/label-with-icons.test.ts`
