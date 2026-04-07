# Work Breakdown Structures

Work Breakdown Structures (WBS) help decompose a project into deliverables and smaller work packages.

In Runiq, the first pass lives inside the `diagram` profile using specialized shapes:

- `@wbs`
- `@wbsDeliverable`
- `@wbsWorkPackage`

## Basic Example

```runiq
diagram "Website Launch WBS" {
  direction TB

  container launch "Website Launch" as @wbs {
    container discovery "Discovery" as @wbsDeliverable {
      shape audit as @wbsWorkPackage label:"Content audit"
      shape sitemap as @wbsWorkPackage label:"Sitemap"
    }

    container design "Design" as @wbsDeliverable {
      shape wireframes as @wbsWorkPackage label:"Wireframes"
      shape ui as @wbsWorkPackage label:"UI kit"
    }
  }
}
```

## Recommended Pattern

- use the outer `@wbs` container as the project root
- use nested `@wbsDeliverable` containers for major deliverables or work streams
- use `@wbsWorkPackage` for the lowest actionable items
- set inner deliverable containers to `direction:LR` when you want siblings laid out horizontally

## Supported Shapes

| Shape | Syntax | Purpose |
| --- | --- | --- |
| WBS Root | `@wbs` | Overall work breakdown boundary |
| Deliverable | `@wbsDeliverable` | Major branch or deliverable |
| Work Package | `@wbsWorkPackage` | Actionable lowest-level item |

## When To Use WBS

Use WBS diagrams when you need to:

- break a project into manageable deliverables
- communicate ownership boundaries
- show scope decomposition without implying a timeline
- organize planning before moving to schedule views like timelines or PERT

## Comparison with Other Tools

| Tool | Strengths | Tradeoffs vs Runiq |
| --- | --- | --- |
| PowerPoint / Draw.io | Familiar box-and-line editing | Manual alignment and hierarchy cleanup |
| Project planning suites | Task management and assignments | Usually weaker for lightweight documentation diagrams |
| Mermaid flowcharts | Quick text authoring | No dedicated WBS shape vocabulary or container styling |

## Key Advantages of Runiq

- text-based project decomposition
- reusable container hierarchy
- easy transition between architecture, tree, and planning diagrams
- works alongside timeline and kanban profiles in the same DSL ecosystem

## When to Use Alternatives

- use a PM suite when you need assignments, dependencies, and resource tracking
- use a timeline or PERT view when sequencing is more important than decomposition
