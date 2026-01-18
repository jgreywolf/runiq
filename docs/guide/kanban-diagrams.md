---
title: Kanban Boards
description: Build Kanban boards with swimlanes, columns, and cards using the kanban profile.
lastUpdated: 2025-02-08
---

# Kanban Boards

Kanban boards organize work into columns with cards. Use the `kanban` profile when you want structured productivity visuals that should not mix with general diagram shapes.

## Basic Board

```runiq
kanban "Product Board" {
  theme runiq
  swimlane "Q1 Focus" {
    column backlog "Backlog" wip:5 {
      card C1 "Audit auth flow" priority:high tags:["security","backend"]
      card C2 "Refresh onboarding copy" priority:medium assignee:"Maya"
    }
    column progress "In Progress" wip:3 {
      card C3 "Billing sync fixes" priority:high assignee:"Alex" estimate:"3d"
    }
    column completed "Done" {
      card C4 "Upgrade dependencies" priority:low
    }
  }
}
```

## Card Metadata

Cards can include rich metadata for display:

```runiq
kanban "Release Checklist" {
  column todo "To Do" {
    card C1 "Security review"
      description:"Threat model and dependency audit"
      assignee:"Priya"
      priority:critical
      tags:["security","release"]
      estimate:"2d"
  }
}
```

## Overflow

Limit visible cards per column and show an overflow indicator:

```runiq
kanban "Support Queue" {
  column incoming "Incoming" maxCards:2 overflow:stack {
    card C1 "Payment failures" priority:high
    card C2 "Webhook retries" priority:medium
    card C3 "Account merge request" priority:low
  }
}
```

## Styling

You can style swimlanes, columns, and cards with inline colors:

```runiq
kanban "Design Ops" {
  swimlane "Brand Refresh" fillColor:"#f8fafc" strokeColor:"#e2e8f0" textColor:"#0f172a" {
    column review "Review" fillColor:"#fef3c7" strokeColor:"#f59e0b" {
      card C1 "Homepage hero" fillColor:"#ffffff" strokeColor:"#fde68a"
    }
  }
}
```

## Key Features

- **Swimlanes**: Optional container for columns (`swimlane "Label" { ... }`).
- **Columns**: Named columns with optional WIP limits (`wip:3`).
- **Overflow**: Use `maxCards` and `overflow:stack|ellipsis` for long columns.
- **Cards**: Labels plus metadata: `description`, `assignee`, `priority`, `tags`, `estimate`.
- **Theme support**: `theme runiq` works the same as other profiles.

For complete DSL reference, see [Profiles](/guide/profiles).
