---
title: Railroad Diagrams
description: Define grammar and syntax diagrams with the railroad profile, using EBNF-style shorthand and theme-aware rendering.
lastUpdated: 2025-02-04
---

# Railroad Diagrams

The **railroad** profile renders grammar and syntax diagrams using a deterministic left-to-right layout. It supports EBNF-style shorthand, readable tokens, and configurable rails, markers, and spacing.

## Basic Syntax

```runiq
railroad "Expression Grammar" {
  diagram Expr = Term (("+" | "-") Term)*
  diagram Term = Factor (("*" | "/") Factor)*
  diagram Factor = Number | "(" Expr ")"
  diagram Number = digit+
}
```

## Shorthand Rules

Railroad expressions are parsed with the following rules:

- **Sequence**: `A B` becomes `seq(A, B)`
- **Choice**: `A | B` becomes `choice(A, B)`
- **Optional**: `A?` becomes `optional(A)`
- **One or more**: `A+` becomes `oneOrMore(A)`
- **Zero or more**: `A*` becomes `zeroOrMore(A)`
- **Grouping**: `(A B) | C`
- **Tokens**: `"literal"` is a token
- **References**: `Name` is a reference to another diagram

**Precedence:** sequence binds tighter than choice.  
`A B | C` is parsed as `choice(seq(A, B), C)`.

## Tokens and References

- Use quoted strings for literal tokens: `"+"`, `"("`, `"keyword"`.
- Use bare identifiers to reference other diagrams: `Expr`, `Factor`.

If a reference does not match a defined diagram name, the editor surfaces a warning:

```
Missing railroad diagram reference: Number
```

## Options

Use `options` to override markers, colors, and spacing:

```runiq
railroad "Tokens and Options" {
  theme runiq
  options markerColor:"#1f2937" operatorColor:"#2563eb" startMarker:circle endMarker:arrow
  options compact:true gap:16 branchPad:16 vGap:18 loop:20 boxPadX:12 boxPadY:8

  diagram Token = "let" Identifier "=" Number
  diagram Identifier = letter (letter | digit)*
  diagram Number = digit+
}
```

**Supported option keys:**

- `markerColor` - color used for rails and markers
- `operatorColor` - color for operator tokens like `+`, `*`, `?`, `|`
- `startMarker` - `circle` or `none`
- `endMarker` - `arrow`, `circle`, or `none`
- `compact` - reduces spacing between elements
- `gap` - horizontal gap between nodes
- `branchPad` - padding for branch tracks
- `vGap` - vertical gap between branches
- `loop` - loop height for `*` and `+`
- `boxPadX`, `boxPadY` - padding for token boxes

If a value is not set, the renderer uses the active theme defaults.

## Themes

Railroad diagrams respect the active `theme` and can use theme-provided colors for markers and operators. See the [Themes guide](/guide/themes) for details on overriding or creating themes.

## Troubleshooting

**Missing references**
- Confirm the referenced diagram name exists in the same railroad profile.
- References are case-sensitive.

**Unexpected grouping**
- Use parentheses to make precedence explicit.

## Example: Custom Colors

```runiq
railroad "Custom Colors" {
  options markerColor:"#0f172a" operatorColor:"#f97316" startMarker:circle endMarker:arrow

  diagram Expr = Term (("+" | "-") Term)*
  diagram Term = Factor (("*" | "/") Factor)*
  diagram Factor = Number | "(" Expr ")"
  diagram Number = digit+
}
```
