---
title: Mindmap Diagrams
description: Create visual thinking tools with radial layouts for brainstorming, planning, and knowledge mapping.
lastUpdated: 2025-11-17
---

# Mindmap Diagrams

Mindmaps are visual thinking tools that help organize information hierarchically around a central concept. They use a radial layout where ideas branch out from a central node, making them perfect for brainstorming, planning, and knowledge mapping.

## Quick Start

### Simple Mindmap with Auto-Shapes

Runiq supports simplified syntax using `type:mindmap` on containers, which automatically assigns shapes:

```runiq
diagram "Quick Mindmap" {
  container "Ideas" type:mindmap algorithm:radial spacing:80 {
    // First node becomes @circ (circle) automatically
    shape central label:"Main Idea"

    // All other nodes become @rounded automatically
    shape branch1 label:"Branch 1"
    shape branch2 label:"Branch 2"
    shape branch3 label:"Branch 3"

    central -> branch1
    central -> branch2
    central -> branch3
  }
}
```

... (content preserved)
