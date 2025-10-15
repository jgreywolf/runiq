# Final 9 Shapes Plan - Path to 52 Shapes

## Current Status

- **43 shapes implemented** (83%)
- **250 tests passing**
- **Bundle: 85.57 KB**

## Proposed Final 9 Shapes

### Additional Process Shapes (3 shapes)

1. **Predefined Process** (`predef-proc`)
   - Rectangle with vertical lines on both sides (like framed but different spacing)
   - Used for predefined/subroutine calls
   - Similar to framed-rectangle but with closer lines

2. **Decision-Manual** (`decision-manual`)
   - Diamond with wavy bottom edge
   - Manual decision point
   - Combines diamond with document-style wavy edge

3. **Preparation** (`prep-alt`)
   - Elongated hexagon (horizontal orientation)
   - Alternative preparation shape
   - More elongated than standard hexagon

### Additional Storage Shapes (2 shapes)

4. **Sequential Access Storage** (`seq-storage`)
   - Curved rectangle (rounded on one side only)
   - Sequential access like tape storage
   - Half-stadium shape

5. **Direct Access Storage** (`direct-storage`)
   - Cylinder on its side (similar to h-cylinder but different)
   - Direct access storage device
   - Alternative disk representation

### Additional I/O Shapes (2 shapes)

6. **Card** (`card`)
   - Rectangle with one corner cut
   - Punched card input/output
   - Notched corner (different from notched-rectangle)

7. **Off-page Connector** (`off-page`)
   - Pentagon pointing down (home plate shape)
   - Connects to another page
   - Inverted home plate

### Additional Specialized Shapes (2 shapes)

8. **Summing Junction** (`junction`)
   - Circle with plus sign inside
   - Used for summing or junction points
   - Like cross-circle but with + instead of X

9. **Or** (`or`)
   - Circle with additional curved lines
   - Logical OR operation
   - Multiple inputs converging

## Implementation Plan

Each shape requires:

- Test file with 5 tests
- Shape implementation (~60-80 lines)
- Registration in index.ts
- Export in index.ts

Total estimated:

- **45 new tests**
- **~630 lines of code**
- **~4-6 hours implementation time**

## Expected Final Metrics

- **52 shapes total** (100% of goal!)
- **295 tests passing**
- **Bundle: ~93-95 KB** (estimated)
- **Complete flowchart library** ✨

## Alternative Shapes (if adjustments needed)

- **Merge** - Similar to hourglass but different orientation
- **Sort** - Alternate sorting shape
- **Extract** - Additional triangle variant
- **Offline Storage** - Alternate storage representation
- **Terminal** - Alternative start/end shape
- **Cloud** - Cloud storage/service shape
- **Message** - Message/email shape (envelope)
- **Queue** - Queue/buffer shape
- **Subprocess Alt** - Alternative subprocess indicator

## Category Breakdown (After 52 shapes)

1. Original/Basic: 9 shapes
2. Circle Variants: 5 shapes
3. Document Shapes: 4 shapes
4. Annotation Shapes: 3 shapes
5. Data I/O: 7 shapes (5 + 2 new)
6. Process: 11 shapes (8 + 3 new)
7. Storage: 7 shapes (5 + 2 new)
8. Specialized: 11 shapes (9 + 2 new)

**Total: 52 shapes across 8 categories** 🎯
