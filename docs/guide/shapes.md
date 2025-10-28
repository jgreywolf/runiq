---
title: Shapes Overview
---

# Shapes Overview

Runiq provides a large catalog of shapes spanning flowcharts, UML, containers, charts, block diagrams, and schematic symbols. You can mix shapes within a single diagram—there is no strict separation by diagram type.

Common examples:

```runiq
diagram "Mixing Shapes" direction: TB

shape User   as @actor    label:"Customer"
shape Decide as @rhombus  label:"In trial?"
shape API    as @rect     label:"API"
shape DB     as @cylinder label:"Database"

User -> Decide
Decide[yes] -> API -> DB
```

For the complete list of shapes and their IDs, see the [Shape Catalog](/reference/shapes).
