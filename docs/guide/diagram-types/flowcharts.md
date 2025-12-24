---
---

title: Flowcharts
description: How to author flowcharts in Runiq — shapes, decision nodes, swimlanes, and best practices.
sidebar: guide
tags:

- diagram-type
- flowchart
  lastUpdated: 2025-12-23

---

# Flowcharts

Flowcharts express process logic using simple nodes and directed edges. This guide shows recommended shapes, edge styles, decision handling, and layout tips for clear diagrams.

## Basic flowchart

```runiq
diagram "Order Process" {
  direction TB
  theme professional

  shape Start as @rounded label: "Start"
  shape ReceiveOrder as @rect label: "Receive Order"
  shape Validate as @rhombus label: "Valid?"
  shape Pack as @rect label: "Pack"
  shape Ship as @rect label: "Ship"
  shape End as @rounded label: "End"

  Start -> ReceiveOrder -> Validate
  Validate -yes-> Pack -> Ship -> End
  Validate -no-> ReceiveOrder
}
```

- Use `@rounded`/`@rect` for start/end and process steps, and `@rhombus` for decisions.
- Label decision edges (`-yes->`, `-no->`) to clarify branching.

## Swimlanes and containers

Group responsibilities into lanes to clarify ownership.

```runiq
diagram "Order Flow" {
  pool Orders {
    lane Sales {
      shape Receive as @rect label: "Receive"
    }
    lane Fulfillment {
      shape Pack as @rect label: "Pack"
      shape Ship as @rect label: "Ship"
    }
  }

  Receive -> Pack -> Ship
}
```

Pools and lanes are ideal for cross-functional processes. Runiq normalizes pool widths for consistent visuals.

## Styling and patterns

- Use `strokeDasharray` for alternate flows (e.g., dashed for manual steps).
- Keep labels short; use multiline (`\n`) for longer text.

```runiq
shape Manual as @rect label: "Manual\nApproval" style: { strokeDasharray: "4 2", fillColor: "#fff7ed" }
```

## Common layout tips

- Prefer `direction TB` for linear processes; use `LR` for left-to-right sequences.
- Use `width` on shapes to prevent label wrapping when you need fixed-size boxes.
- For complex branches, add `notes` or `annotations` near decisions to explain logic.

## Accessibility & readability

- Ensure sufficient color contrast for fills and strokes when using themes.
- Use consistent spacing and edge routing; Runiq's layout engine provides orthogonal routing for clarity.

## Example: annotated flowchart with icons

```runiq
diagram "Deploy" {
  direction LR

  shape Dev as @rect label: "fa:fa-code Develop"
  shape CI as @rect label: "fa:fa-cogs CI"
  shape QA as @rect label: "fa:fa-check Test"
  shape Prod as @rect label: "fa:fa-rocket Deploy"

  Dev -> CI -> QA -> Prod
}
```

This example shows inline icons in labels to improve scannability. Use the `renderShapeLabel` helper in custom shapes to ensure consistent rendering of icons and alignment.

## When to use other diagram types

- Use **UML sequence** for message/actor interactions.
- Use **C4** or **architecture diagrams** for system context and container-level design.

---

See also: `docs/guide/dsl-syntax.md` and the shape catalog at `docs/shapes/` for shape-specific examples.
