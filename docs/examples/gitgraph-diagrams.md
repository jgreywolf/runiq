# GitGraph Diagrams

GitGraph diagrams visualize branches, commits, merges, and tags.

## Release Flow

<div style="margin: 1rem 0;">
  <img src="/examples/gitgraph-release-flow.svg" alt="GitGraph release flow" style="max-width: 720px; margin: 0 auto; display: block;">
</div>

```runiq
gitgraph "Release Flow" {
  theme runiq
  orientation vertical

  branch main label:"main" color:"#0f172a"
  branch feature label:"feature/login" parent:main color:"#2563eb"
  branch hotfix label:"hotfix/session" parent:main color:"#ef4444"

  commit c1 branch:main label:"Bootstrap repo"
  commit c2 branch:feature label:"Login form"
  commit c3 branch:feature label:"OAuth support"
  merge m1 from:feature into:main label:"Merge login" tag:"v1.0.0"

  commit c4 branch:hotfix label:"Patch session bug"
  merge m2 from:hotfix into:main label:"Merge hotfix" tag:"v1.0.1"
}
```

## Feature Branch Train

```runiq
gitgraph "Feature Train" {
  branch main label:"main" color:"#0f172a"
  branch api label:"feature/api" parent:main color:"#16a34a"
  branch ui label:"feature/ui" parent:main color:"#7c3aed"

  commit c1 branch:main label:"Baseline"
  commit c2 branch:api label:"API scaffolding"
  commit c3 branch:ui label:"UI layout"
  commit c4 branch:api label:"GraphQL schema"
  merge m1 from:api into:main label:"Merge API"
  merge m2 from:ui into:main label:"Merge UI" tag:"v1.1.0"
}
```

## Tagged Milestones

```runiq
gitgraph "Milestones" {
  branch main label:"main" color:"#0f172a"

  commit c1 branch:main label:"Alpha" tag:"v0.9.0-alpha"
  commit c2 branch:main label:"Beta" tag:"v0.9.0-beta"
  commit c3 branch:main label:"RC" tag:"v1.0.0-rc1"
  commit c4 branch:main label:"GA" tag:"v1.0.0"
}
```
