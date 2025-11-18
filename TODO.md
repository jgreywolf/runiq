# Runiq TODO List

## In Progress Tasks

### Label Rendering Helper Function Rollout

**Status:** 37% Complete (53 of 142 shapes updated)  
**Priority:** Medium  
**Started:** November 17, 2025

#### Context

Created centralized `renderShapeLabel` helper function in `packages/core/src/shapes/utils/render-label.ts` to support inline icon syntax (e.g., `fa:fa-rocket`) across all shapes. The helper provides consistent label rendering with automatic icon detection and rendering.

#### Completed Categories (53 shapes)

- ✅ **Basic shapes** (18/18): rectangle, circle, hexagon, rhombus, roundedRectangle, smallCircle, filledCircle, doubleCircle, framedCircle, crossCircle, ellipseWide, stadium, triangle, parallelogram, trapezoid, flippedTrapezoid, chevron, flippedTriangle
- ✅ **Flowchart shapes** (13/13): document, delay, display, manualInput, card, offPageConnector, decisionManual, leanLeft, taggedDocument, preparationAlt, predefinedProcess, paperTape, multiDocument, linedDocument
- ✅ **Storage shapes** (7/7): cylinder, storedData, diskStorage, hCylinder, sequentialStorage, internalStorage, directStorage
- ✅ **Network shapes** (6/6): cloud, server, router, switch, firewall, loadBalancer
- ✅ **Rect-variants** (7/7): taggedRectangle, notchedRectangle, framedRectangle, linedRectangle, dividedRectangle, multiRectangle, notchedPentagon
- ⏳ **UML shapes** (2/~50): actor, choice

#### Remaining Categories (~89 shapes)

- **UML shapes** (~48 remaining): activity, class, component, state, note, interface, enum, lifeline, fragment, etc.
  - Note: Many UML shapes have complex multi-compartment rendering (class, interface) or custom text handling (activity with pins)
- **Chart shapes** (~40): pie, pyramid, venn, sankey, radar, matrix, gauge, timeline, etc.
  - Note: Many have custom data label rendering separate from main label
- **Control system shapes** (8): transferFunction, integrator, summingJunction, etc.
- **Special shapes** (~10): hourglass, lightningBolt, braces, textBlock, etc.
- **AWS shapes** (5): VPC, S3, RDS, Lambda, EC2
- **BPMN shapes** (~8): gateway, event, task, etc.
- **Star variants** (4): star4, star5, star6, star8
- **Pedigree shapes** (3): male, female, unknown
- **Other**: quantum, C4, ERD, data-flow shapes

#### Update Pattern

Each shape needs:

1. Add import: `import { renderShapeLabel } from '../utils/render-label.js'`
2. Extract label: `const label = ctx.node.label || ctx.node.id`
3. Replace inline `<text>` element with: `${renderShapeLabel(ctx, label, x, y)}`

Special cases:

- Filled shapes: Override `style.color` to `'#fff'` for white text on dark background
- Scaled fonts: Create `labelStyle` with modified `fontSize` (e.g., choice.ts uses 0.8x)
- Multi-label shapes: Handle multiple text positions separately (e.g., ellipseWide extension points)

#### Verification

- ✅ Build passing: `pnpm build` in packages/core
- ✅ Visual tests passing: 12/12 icon tests in packages/renderer-svg/tests/visual/icons.spec.ts
- ✅ Inline icon syntax working: `fa:fa-twitter`, `fa:fa-rocket`, etc.
- ✅ Package size reduced: 690.84 KB → 682.66 KB

#### Next Steps

1. Continue with simpler UML shapes (state, note) and special shapes
2. Handle complex UML shapes individually (class, activity, interface)
3. Review chart shapes for data label vs main label separation
4. Run full test suite after completion
5. Update visual regression test snapshots if needed

#### Files Modified

- `packages/core/src/shapes/utils/render-label.ts` (NEW)
- `packages/core/src/shapes/utils/index.ts` (export added)
- All shapes in: basic/, flowchart/, storage/, network/, rect-variants/
- Partial: uml/actor.ts, uml/choice.ts

---

## Future Enhancements

### Documentation

- [ ] Add examples of inline icon syntax to main documentation
- [ ] Document renderShapeLabel helper function in API reference

### Testing

- [ ] Add unit tests for renderShapeLabel helper
- [ ] Expand visual regression tests for more icon combinations

---

_Last Updated: November 17, 2025_
