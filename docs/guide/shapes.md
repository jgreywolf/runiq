---
title: Shapes Overview
description: Comprehensive reference of all 52+ built-in shapes organized by category with syntax examples.
lastUpdated: 2025-01-09
---

# Shapes Overview

Runiq provides a large catalog of shapes spanning flowcharts, UML, containers, charts, control logic diagrams, and schematic symbols. You can mix shapes within a single diagram—there is no strict separation by diagram type.

Common examples:

```runiq
diagram "Mixing Shapes" {
  direction TB

  shape User   as @actor    label:"Customer"
  shape Decide as @rhombus  label:"In trial?"
  shape API    as @rect     label:"API"
  shape DB     as @cylinder label:"Database"

  User -> Decide
  Decide -yes-> API -> DB
}
```

For the complete list of shapes and their IDs, see the [Shape Catalog](/reference/shapes).

## Adding Icons to Shapes

Runiq provides two complementary ways to add icons to shapes:

### 1. Corner Icons (Top-Right)

Add a single icon to the top-right corner of **any shape** using **slash syntax** `icon:provider/icon-name`:

```runiq
shape node as @rectangle label: "Server" icon:fa/server
shape db as @cylinder label: "Database" icon:fa/database
shape user as @actor label: "Admin" icon:fa/user
shape cloud as @cloud label: "AWS Cloud" icon:fa/cloud
```

Corner icons are fixed at 16px and appear in the top-right of the shape.

**Key Points:**

- Syntax: `icon:fa/icon-name` (slash separator)
- Works with **all 52 shape types**
- One icon per shape
- Fixed 16px size
- Always positioned top-right

### Syntax Summary

| Type       | Syntax               | Separator | Example          |
| ---------- | -------------------- | --------- | ---------------- |
| **Corner** | `icon:provider/icon` | Slash `/` | `icon:fa/server` |
