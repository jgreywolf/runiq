---
title: GitGraph Diagrams
description: Document branching, commits, and merges using the gitgraph profile.
lastUpdated: 2025-02-08
---

# GitGraph Diagrams

GitGraph diagrams visualize branches, commits, and merges over time. Use the `gitgraph` profile to capture version control flows with tags and branch labels.

## Basic Flow

```runiq
gitgraph "Release Flow" {
  theme runiq
  orientation vertical

  branch main label:"main" color:"#0f172a"
  branch feature label:"feature/login" parent:main color:"#2563eb"

  commit c1 branch:main label:"Initial scaffold"
  commit c2 branch:feature label:"Login form"
  commit c3 branch:feature label:"OAuth support"
  merge m1 from:feature into:main label:"Merge login" tag:"v1.0.0"
}
```

## Orientation

Switch between vertical (default) and horizontal layouts:

```runiq
gitgraph "Hotfix Lane" {
  theme forest
  orientation horizontal

  branch main label:"main"
  branch hotfix label:"hotfix/patch" parent:main

  commit c1 branch:main label:"Baseline"
  commit c2 branch:hotfix label:"Fix regression"
  merge m1 from:hotfix into:main label:"Merge hotfix" tag:"v1.0.1"
}
```

## Tags and Merge Commits

```runiq
gitgraph "Hotfix Patch" {
  branch main label:"main" color:"#0f172a"
  branch hotfix label:"hotfix/2.1.1" parent:main color:"#ef4444"

  commit c1 branch:main label:"Release 2.1.0" tag:"v2.1.0"
  commit c2 branch:hotfix label:"Fix null pointer"
  merge m1 from:hotfix into:main label:"Merge hotfix" tag:"v2.1.1"
}
```

## Notes

- **Ordering**: Commits and merges render in the order they appear in the file.
- **Branch colors**: Set a branch `color:` to keep flows distinguishable.
- **Labels**: Use `label:` for short display text. Use `message:` when you want longer context.

For more profile details, see [Profiles](/guide/profiles).
