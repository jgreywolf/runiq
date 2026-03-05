---
title: Pedigree Diagrams
description: Create family trees with people, spouses, and parentage (including adoption).
lastUpdated: 2026-02-10
---

# Pedigree Diagrams

The **pedigree profile** is for family trees and lineage diagrams. You define people, spouse relationships, and parentage (biological or adopted). The renderer lays out generations top-to-bottom.

## Basic Syntax

```runiq
pedigree "Family Tree" {
  people {
    p1 "Alex Rivera" dob:"1970-01-10" sex:male
    p2 "Jordan Lee" dob:"1972-05-22" sex:female
    c1 "Casey Rivera" dob:"1998-03-11" sex:female
  }

  families {
    p1 + p2 date:"1995-06-12" -> c1
  }
}
```

## People

Each person has an id, a display name, and optional properties:

- `dob:"YYYY-MM-DD"` - date of birth
- `dod:"YYYY-MM-DD"` - date of death
- `sex:male|female|unknown` - used for styling

## Families

Each family uses a parent pair plus a list of children:

```runiq
families {
  p1 + p2 date:"1995-06-12" -> c1, c2
}
```

### Adoption and Step-Parentage

Inline modifiers apply to individual children:

```runiq
families {
  p1 + p2 -> c1 adopt, c2 step
}
```

## Notes

- You can add multiple families for the same person (e.g., second spouse).
- Large sibling groups can cause relationship lines to cross; we plan to improve ordering and routing heuristics in a future update.
- Dates are stored as strings (ISO-8601 recommended).
- Future additions include theme support and per-person or per-family color overrides.
