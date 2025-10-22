# Known Issues

## Layout & Rendering

### Decision Diamond Edge Anchor Points Not Connecting Properly
**Status**: Open  
**Priority**: Medium  
**Date Reported**: October 22, 2025

**Description**:
When rendering flowcharts with decision diamonds (rhombus shapes), one or more edges may not properly connect to the shape's anchor points. The edge appears to connect to an arbitrary point on the shape's perimeter rather than a defined anchor point.

**Observed In**:
- Simple Process Flow sample diagram
- Decision node "Valid?" with two outgoing edges labeled "Yes" and "No"
- The "No" edge does not connect to a proper anchor point

**Reproduction**:
1. Load the "Simple Process Flow" sample diagram
2. Observe the "Valid?" decision diamond
3. Note that the "No" edge connection point is not aligned with an anchor

**Possible Causes**:
- ELK layout engine may be calculating edge routing that doesn't align with shape anchor points
- Rhombus shape anchor point calculations may need adjustment
- Edge routing algorithm may need to snap to nearest anchor point

**Related Files**:
- `packages/core/src/shapes/rhombus.ts` - Diamond/rhombus shape definition
- `packages/layout-base/` - ELK layout engine integration
- `packages/renderer-svg/` - SVG rendering with edge paths

**Next Steps**:
- [ ] Investigate rhombus anchor point calculations
- [ ] Check ELK layout edge port assignments
- [ ] Consider adding anchor point snapping logic in renderer
- [ ] Test with other shapes that have multiple outgoing edges

---

