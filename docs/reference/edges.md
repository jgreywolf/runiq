---
title: Edge Properties
---

# Edge Properties

Edges connect shapes and containers. You can add labels, control styles, define arrowheads, and annotate UML stereotypes.

## Syntax

```runiq
# Simple
A -> B

# Labeled
A -> B label:"success"

# Conditional label on source node
Decision -yes-> Success
Decision -no-> Failure

# Properties on edges
A -> B strokeColor:"#1565c0" lineStyle:"dashed" arrowType:open
```

## Line style

- `solid` (default)
- `dashed`
- `dotted`

## Arrow type

- `standard` (filled)
- `hollow` (outlined)
- `open` (V-shaped)

## Stereotypes (UML)

Add stereotype labels for include/extend patterns in use case diagrams:

```runiq
Login -> TwoFactor stereotype:"<<include>>" lineStyle:"dashed" arrowType:open
Notify -> Checkout stereotype:"<<extend>>" lineStyle:"dashed" arrowType:open
```

## Colors and thickness

```runiq
A -> B strokeColor:"#2e7d32" strokeWidth:2
```

## Tips

- Use dashed edges for UML stereotypes to match convention
- Keep labels concise; prefer `LR` layout for wide labels
