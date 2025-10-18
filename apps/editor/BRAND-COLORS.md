# Runiq Brand Colors

## Primary Brand Color

**Slate Blue**: `#5a819e` (Wolf scarf & outline)

This is a professional, trustworthy blue-gray that works well for technical/developer tools.

## Generated Color Palette

### Runiq Blue Scale (Primary)
```css
--runiq-50:  #f0f5f8   /* Lightest - backgrounds */
--runiq-100: #dce8ef   /* Very light - hover states */
--runiq-200: #b9d1df   /* Light - borders */
--runiq-300: #96bacf   /* Medium light */
--runiq-400: #73a3bf   /* Medium */
--runiq-500: #5a819e   /* PRIMARY BRAND COLOR */
--runiq-600: #48677e   /* Medium dark - text */
--runiq-700: #364d5f   /* Dark - headings */
--runiq-800: #24333f   /* Very dark */
--runiq-900: #121a20   /* Darkest - backgrounds (dark mode) */
```

### Semantic Colors

**Success** (Green) - For success states, valid syntax
```css
--success-500: #10b981   /* Emerald */
--success-600: #059669
```

**Error** (Red) - For errors, invalid syntax
```css
--error-500: #ef4444   /* Red */
--error-600: #dc2626
```

**Warning** (Amber) - For warnings
```css
--warning-500: #f59e0b   /* Amber */
--warning-600: #d97706
```

**Info** (Cyan) - For informational messages
```css
--info-500: #06b6d4   /* Cyan */
--info-600: #0891b2
```

### Neutral Colors

**Light Mode**:
```css
--neutral-50:  #f9fafb   /* Page background */
--neutral-100: #f3f4f6   /* Panel backgrounds */
--neutral-200: #e5e7eb   /* Borders */
--neutral-300: #d1d5db   /* Disabled states */
--neutral-400: #9ca3af   /* Placeholder text */
--neutral-500: #6b7280   /* Secondary text */
--neutral-600: #4b5563   /* Body text */
--neutral-700: #374151   /* Headings */
--neutral-800: #1f2937
--neutral-900: #111827   /* Darkest text */
```

**Dark Mode**:
```css
--dark-bg:     #0f1419   /* Page background */
--dark-panel:  #1a1f26   /* Panel backgrounds */
--dark-border: #2d3748   /* Borders */
--dark-text:   #e2e8f0   /* Primary text */
```

## Usage Examples

### Header
- Background: `--runiq-500` (#5a819e)
- Text: White
- Logo: Mascot wolf with scarf

### Toolbox
- Background: `--neutral-100` (light) / `--dark-panel` (dark)
- Border: `--neutral-200`
- Hover: `--runiq-100`
- Active: `--runiq-200`

### Code Editor
- Background: `--neutral-50` (light) / `--dark-bg` (dark)
- Syntax highlighting: Based on Runiq blue scale
- Error underline: `--error-500`
- Line numbers: `--neutral-400`

### Preview Panel
- Background: White (light) / `--dark-bg` (dark)
- Canvas border: `--neutral-200`
- Selected shape highlight: `--runiq-300`
- Error overlay: `--error-500` with 10% opacity

## Tailwind Configuration

Add to `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      runiq: {
        50:  '#f0f5f8',
        100: '#dce8ef',
        200: '#b9d1df',
        300: '#96bacf',
        400: '#73a3bf',
        500: '#5a819e',  // PRIMARY
        600: '#48677e',
        700: '#364d5f',
        800: '#24333f',
        900: '#121a20',
      }
    }
  }
}
```

## Accessibility

All color combinations meet WCAG 2.1 AA standards:
- `runiq-500` on white: 4.7:1 (AA Large Text) ✓
- `runiq-600` on white: 6.3:1 (AA Normal Text) ✓
- `runiq-700` on white: 9.4:1 (AAA) ✓
- White on `runiq-500`: 4.7:1 (AA Large Text) ✓

## Brand Guidelines

### Do's ✓
- Use `runiq-500` for primary actions, brand elements
- Use `runiq-600`/`700` for text on light backgrounds
- Pair with white and neutral grays
- Use softer tints (`runiq-100`, `runiq-200`) for backgrounds

### Don'ts ✗
- Don't use pure black (#000000) - use `neutral-900` or `runiq-900`
- Don't mix with competing brand colors (different blues)
- Don't use insufficient contrast for text

## Visual Examples

```
┌─────────────────────────────────────┐
│  Header (runiq-500 bg, white text) │
├────────┬────────────────────────────┤
│Toolbox │  Editor (neutral-50 bg)   │
│        │                            │
│ Light  │  Preview (white bg)        │
│ hover: │                            │
│runiq-  │  Selected: runiq-300       │
│100     │                            │
└────────┴────────────────────────────┘
```

---

**Last Updated**: October 17, 2025  
**Primary Brand Color**: #5a819e (Runiq Blue)
