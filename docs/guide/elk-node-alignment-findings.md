# ELK Node Alignment Findings (Visual Editor)

## Context
In `diagram` profile, ELK layered layout can produce small horizontal offsets for nodes that are otherwise expected to be vertically aligned. This leads to visible edge "jags" where one branch appears slightly shifted compared to its siblings.

Example symptom:
- With 2 nodes: clean straight vertical edge.
- With 3+ nodes: one child may be slightly left/right of the parent center while others align differently.
- Result: a single branch looks visually off even though routing is technically correct.

## Root Cause
ELK optimizes globally for crossing minimization, edge length, and layer packing.
It does not prioritize "keep this child centered under its parent" unless we add explicit constraints or post-process positions.

## Options Evaluated

### 1) ELK option tuning only
What:
- Tune layered options (node placement and crossing minimization strategies).
- Keep current pipeline unchanged.

Pros:
- Low implementation risk.
- No DSL changes.

Cons:
- Inconsistent improvement.
- Can regress other graphs while improving one case.

Estimated effort:
- 1–2 hours for parameter matrix testing.

### 2) Stronger anchor/port constraints
What:
- Enforce stricter top/bottom anchor behavior for vertical flows.
- Preserve directional entry/exit more aggressively.

Pros:
- Cleaner arrow direction and edge approach consistency.
- Helps reduce apparent misalignment effects.

Cons:
- Does not fully solve node position offset.
- Can increase path rigidity for complex branching.

Estimated effort:
- 0.5–1 day.

### 3) Post-layout normalization pass (recommended)
What:
- After ELK layout, run a cleanup heuristic:
  - Detect near-vertical parent?child relationships.
  - Snap child X to parent center when within threshold.
  - Optionally normalize sibling lanes/grid alignment.
  - Re-route only affected edges.

Pros:
- Directly targets visual artifact users notice.
- Retains ELK strengths for hard layout problems.
- Predictable UX improvement for editor-created flows.

Cons:
- Additional logic layer to maintain.
- Needs guardrails to avoid over-snapping in dense graphs.

Estimated effort:
- 1–2 days including tests.

### 4) Add DSL layout constraints
What:
- Introduce optional directives such as `sameLane`, `alignWith`, `order`, `rank`.

Pros:
- Most deterministic control for advanced users.

Cons:
- Parser + docs + UX complexity.
- Larger scope than needed for initial polish.

Estimated effort:
- 2–4 days.

## Recommended Path (Deferred)
1. Implement Option 3 first (post-layout normalization).
2. Keep Option 1 as a lightweight pre-pass for quick wins.
3. Revisit Option 4 only if users need explicit placement control.

## Suggested Acceptance Criteria for Option 3
- Parent?single-child vertical edges remain visually straight in common editor-generated flows.
- No regression in existing layout and edge routing tests.
- Minimal movement threshold prevents over-correction in dense diagrams.
- Works with existing connect mode insertions and duplicate-edge handling.

## Notes for Future Implementation
- Apply normalization only in `diagram` profile initially.
- Run normalization before anchor snapping finalization to avoid oscillation.
- Gate by distance thresholds and layer proximity (do not snap across layers).
- Add snapshot/regression tests for 2-node, 3-node, and 5-node branching cases.
