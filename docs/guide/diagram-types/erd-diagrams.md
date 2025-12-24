---
title: ERD Diagrams
description: Create entity-relationship diagrams with Chen notation for database modeling including entities, relationships, attributes, and cardinality.
lastUpdated: 2025-01-09
---

# ERD Diagrams

Entity-Relationship Diagrams (ERD) are a visual representation of the data model for a database or information system. Runiq supports **Chen notation**, the classic ERD notation with rectangles for entities, diamonds for relationships, and ellipses for attributes.

## Quick Start

Here's a simple ERD showing two entities and their relationship:

```runiq
diagram "Simple ERD" {
  // Entities
  shape customer as @erdEntity label: "Customer"
  shape order as @erdEntity label: "Order"

  // Relationship
  shape places as @erdRelationship label: "places"

  // Connections
  customer -> places
  places -> order
}
```

... (content preserved)
