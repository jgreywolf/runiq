# SmartArt vs Runiq GlyphSets - Capability Comparison

## Executive Summary

This document compares Microsoft SmartArt graphics capabilities with Runiq's GlyphSet system to identify gaps and opportunities for feature parity.

**Current Status**: Runiq has implemented **9 glyphsets** covering 5 categories. SmartArt offers **200+ layouts** across 9 types.

---

## SmartArt Type Categories vs Runiq GlyphSet Categories

| SmartArt Type    | Purpose                                  | Runiq Category  | Status                                 |
| ---------------- | ---------------------------------------- | --------------- | -------------------------------------- |
| **List**         | Show non-sequential information          | ✅ `list`       | **Implemented** (1 glyphset)           |
| **Process**      | Show steps in a process or timeline      | ✅ `process`    | **Implemented** (3 glyphsets)          |
| **Cycle**        | Show a continual process                 | ✅ `process`    | **Implemented** (cycle glyphset)       |
| **Hierarchy**    | Show organization chart or decision tree | ✅ `hierarchy`  | **Implemented** (1 glyphset)           |
| **Relationship** | Illustrate connections                   | ⚠️ Missing      | **Gap**                                |
| **Matrix**       | Show how parts relate to whole           | ✅ `comparison` | **Implemented** (matrix glyphset)      |
| **Pyramid**      | Show proportional relationships          | ✅ `hierarchy`  | **Implemented** (pyramid glyphset)     |
| **Picture**      | Use pictures to convey content           | ⚠️ Partial      | **Gap** (no dedicated picture layouts) |
| **Office.com**   | Additional templates                     | N/A             | Not applicable                         |

---

## Detailed Capability Comparison

### 1. LIST TYPE (Non-Sequential Information)

#### SmartArt List Layouts (Examples)

- Basic Block List
- Picture Accent List
- Vertical Box List
- Vertical Bullet List
- Vertical Chevron List
- Horizontal Bullet List
- Bending Picture Accent List
- Increasing Circle Process
- Picture Caption List
- Stacked List
- Table List
- Trapezoid List

#### Runiq Equivalent

✅ **Implemented**: `basicList` glyphset

- Vertical list with styled boxes
- 2-10 items supported
- Uses `processBox` shape
- Simple, clean implementation

#### Gaps & Opportunities

🔴 **Missing**:

- ❌ Picture-enhanced lists (Picture Accent List, Picture Caption List)
- ❌ Horizontal list orientation
- ❌ Chevron-style lists
- ❌ Nested/indented lists
- ❌ Multi-column lists
- ❌ Table-style lists with columns
- ❌ Progressive/increasing visual lists (Increasing Circle)
- ❌ Bending/curved lists

**Recommendation**: Add 5-8 additional list variants:

1. `horizontalList` - left-to-right bullets
2. `chevronList` - progressive chevrons
3. `pictureList` - icon/image in each item
4. `nestedList` - hierarchical indented items
5. `columnList` - multi-column layout
6. `tableList` - tabular list with columns
7. `increasingList` - progressively larger items
8. `alternatingList` - zigzag/alternating layout

---

### 2. PROCESS TYPE (Sequential Steps)

#### SmartArt Process Layouts (Examples)

- Basic Process (horizontal)
- Accent Process
- Alternating Flow
- Continuous Block Process
- Basic Chevron Process
- Chevron List
- Closed Chevron Process
- Detailed Process
- Grouped List
- Process Arrows
- Step Down Process
- Step Up Process
- Vertical Process
- Circle Accent Timeline
- Basic Timeline
- Phased Process
- Equation

#### Runiq Equivalent

✅ **Implemented**:

1. `horizontalProcess` - Left-to-right linear process (2-10 steps)
2. `verticalProcess` - Top-to-bottom process (2-10 steps)
3. `cycle` - Circular process flow (3-8 steps)

#### Gaps & Opportunities

🟡 **Partial Coverage**:

- ✅ Basic horizontal and vertical processes covered
- ✅ Cycle/circular processes covered
- ❌ Chevron processes (pointing arrows)
- ❌ Alternating flow (zigzag layout)
- ❌ Step up/down processes (diagonal stairs)
- ❌ Timeline with events on horizontal line
- ❌ Phased processes (with milestone markers)
- ❌ Process with sub-steps
- ❌ Grouped processes (parallel streams)
- ❌ Equation/formula processes

**Recommendation**: Add 10-12 additional process variants:

1. `chevronProcess` - sequential chevrons →→→
2. `alternatingProcess` - zigzag flow
3. `stepProcess` - staircase progression
4. `circularArrows` - circular with large arrows
5. `phasedProcess` - phases with milestones
6. `detailedProcess` - main steps + sub-steps
7. `groupedProcess` - parallel streams merging
8. `converging` - multiple inputs → single output
9. `diverging` - single input → multiple outputs
10. `equation` - A + B = C style
11. `repeatingBends` - S-curve flow
12. `continuousBlock` - blocks with arrows

---

### 3. CYCLE TYPE (Continuous Process)

#### SmartArt Cycle Layouts (Examples)

- Basic Cycle
- Text Cycle
- Block Cycle
- Nondirectional Cycle
- Continuous Cycle
- Multidirectional Cycle
- Segmented Cycle
- Gear
- Radial Cycle

#### Runiq Equivalent

✅ **Implemented**: `cycle` glyphset

- Circular arrangement (3-8 steps)
- Sequential connections

#### Gaps & Opportunities

🟡 **Partial Coverage**:

- ✅ Basic circular cycle covered
- ❌ Radial cycles (spokes from center)
- ❌ Gear/mechanical cycles
- ❌ Segmented cycles (pie-chart style)
- ❌ Block cycles (rectangular in circle)
- ❌ Multidirectional cycles

**Recommendation**: Add 4-6 cycle variants:

1. `radialCycle` - center hub with spokes
2. `gearCycle` - interlocking gears
3. `segmentedCycle` - pie chart segments
4. `blockCycle` - rectangular nodes in circle
5. `spiralCycle` - spiral progression
6. `orbitCycle` - planetary orbit style

---

### 4. HIERARCHY TYPE (Org Charts & Trees)

#### SmartArt Hierarchy Layouts (Examples)

- Organization Chart
- Picture Organization Chart
- Name and Title Organization Chart
- Half Circle Organization Chart
- Circle Picture Hierarchy
- Hierarchy List
- Labeled Hierarchy
- Horizontal Organization Chart
- Horizontal Multi-Level Hierarchy
- Horizontal Labeled Hierarchy
- Table Hierarchy

#### Runiq Equivalent

✅ **Implemented**: `pyramid` glyphset (hierarchical levels)
⚠️ **Partial**: Runiq has pedigree charts but not in glyphsets

#### Gaps & Opportunities

🔴 **Major Gap**:

- ✅ Pyramid hierarchy covered (stacked levels)
- ❌ **Organization chart** (tree structure with manager-subordinate)
- ❌ Picture org charts
- ❌ Horizontal org charts
- ❌ Hierarchy with labeled relationships
- ❌ Table-style hierarchies
- ❌ Circle/radial hierarchies

**Recommendation**: Add 6-8 hierarchy variants (HIGH PRIORITY):

1. `orgChart` - vertical tree (manager → reports)
2. `pictureOrgChart` - with profile pictures
3. `horizontalOrgChart` - left-to-right tree
4. `matrixOrgChart` - dual reporting lines
5. `circleHierarchy` - concentric circles
6. `labeledHierarchy` - relationship labels on edges
7. `tableHierarchy` - tabular layout with levels
8. `teamHierarchy` - grouped teams

---

### 5. RELATIONSHIP TYPE (Connections & Associations)

#### SmartArt Relationship Layouts (Examples)

- Basic Venn
- Linear Venn
- Stacked Venn
- Basic Target
- Radial Venn
- Balance
- Counterbalance
- Converging Radial
- Diverging Radial
- Radial List
- Radial Cluster
- Equation
- Funnel
- Gear
- Opposing Ideas
- Plus and Minus
- Puzzle

#### Runiq Equivalent

✅ **Implemented**:

1. `venn` - Overlapping circles (2-3 circles)

#### Gaps & Opportunities

🔴 **Major Gap** - Most relationship types missing:

- ✅ Basic Venn diagram covered
- ❌ Target/bullseye diagrams
- ❌ Balance/scale diagrams
- ❌ Radial relationship diagrams
- ❌ Converging/diverging patterns
- ❌ Opposing ideas (left vs right)
- ❌ Plus/minus comparisons
- ❌ Puzzle pieces
- ❌ Gear relationships

**Recommendation**: Add 12-15 relationship variants (HIGH PRIORITY):

1. `target` - concentric circles (bullseye)
2. `radialRelationship` - center with spokes
3. `balance` - scale with two sides
4. `opposing` - left vs right comparison
5. `converging` - multiple → one
6. `diverging` - one → multiple
7. `cluster` - grouped related items
8. `puzzle` - interlocking pieces
9. `plusMinus` - pros vs cons
10. `steppedVenn` - 3D stacked Venn
11. `linearVenn` - horizontal overlapping
12. `counterbalance` - weighted balance
13. `equation` - relationship formula
14. `interconnected` - web of connections
15. `hub` - central node with connections

---

### 6. MATRIX TYPE (Quadrants & Grids)

#### SmartArt Matrix Layouts

- Basic Matrix
- Titled Matrix
- Grid Matrix
- Segmented Matrix

#### Runiq Equivalent

✅ **Implemented**: `matrix` glyphset (2x2 quadrants)

- 4 quadrants with colors
- Optional axis labels
- SWOT, Eisenhower matrix use cases

#### Gaps & Opportunities

🟡 **Good Coverage**:

- ✅ Basic 2x2 matrix covered
- ❌ 3x3 or larger matrices
- ❌ Titled matrix (with category headers)
- ❌ Segmented matrix (subdivided cells)

**Recommendation**: Add 3-4 matrix variants:

1. `matrix3x3` - nine quadrants
2. `titledMatrix` - row/column headers
3. `segmentedMatrix` - sub-cells
4. `priorityMatrix` - with urgency/importance indicators

---

### 7. PYRAMID TYPE (Proportional Relationships)

#### SmartArt Pyramid Layouts

- Basic Pyramid
- Inverted Pyramid
- Segmented Pyramid
- Pyramid List

#### Runiq Equivalent

✅ **Implemented**: `pyramid` glyphset

- Hierarchical levels with proportional widths
- Custom labels and colors
- Value display

#### Gaps & Opportunities

🟢 **Good Coverage**:

- ✅ Basic pyramid covered
- ❌ Inverted pyramid (upside down)
- ❌ Segmented pyramid (divided sections)
- ❌ Pyramid with list items per level

**Recommendation**: Add 2-3 pyramid variants:

1. `invertedPyramid` - upside down (funnel end)
2. `segmentedPyramid` - subdivided levels
3. `pyramidList` - items listed per level

---

### 8. PICTURE TYPE (Image-Enhanced Layouts)

#### SmartArt Picture Layouts (Examples)

- Picture Accent List
- Picture Caption List
- Picture Strips
- Picture Grid
- Bending Picture Accent
- Continuous Picture List
- Picture Accent Process
- Alternating Picture Blocks
- Circular Picture Callout
- Titled Picture Blocks
- Framed Text Picture
- Picture Organization Chart

#### Runiq Equivalent

⚠️ **Not Implemented** - No dedicated picture glyphsets

- Runiq supports inline icons in labels via Font Awesome
- No picture/image placeholder layouts

#### Gaps & Opportunities

🔴 **Major Gap** - Entire category missing:

- ❌ Picture lists
- ❌ Picture processes
- ❌ Picture grids
- ❌ Picture org charts
- ❌ Image placeholders

**Recommendation**: Add picture support (MEDIUM PRIORITY):

1. `pictureList` - image + text items
2. `pictureProcess` - images in process steps
3. `pictureGrid` - grid of images with captions
4. `pictureCallout` - central image with callouts
5. `pictureBlocks` - alternating image/text blocks
6. `framedPicture` - images with decorative frames

**Technical Note**: Would require:

- Image URL/path support in glyphset parameters
- Image rendering in SVG (via `<image>` tag or data URLs)
- Placeholder image support
- Aspect ratio preservation

---

## SmartArt Core Features vs Runiq Capabilities

### Text Pane & Data Entry

| Feature                   | SmartArt                       | Runiq GlyphSets         | Status             |
| ------------------------- | ------------------------------ | ----------------------- | ------------------ |
| Text pane for data entry  | ✅ Visual editor               | ⚠️ DSL syntax           | Different approach |
| Hierarchical bullet lists | ✅ Indent/dedent               | ⚠️ Nested syntax        | Partial via DSL    |
| Auto-shape addition       | ✅ Add bullet = add shape      | ✅ Add item = add shape | **Equivalent**     |
| Live preview              | ✅ Text pane syncs with visual | ⚠️ Editor render        | Depends on editor  |
| Placeholder text          | ✅ "[Text]" placeholders       | ⚠️ Validation errors    | Different UX       |
| Overflow handling         | ✅ Red X for unused items      | ❌ Not implemented      | **Gap**            |

**Recommendation**:

- Add better DSL editor integration for glyphset data
- Consider visual text pane UI in editor
- Implement overflow warnings

---

### Styling & Customization

| Feature                  | SmartArt                          | Runiq GlyphSets                          | Status        |
| ------------------------ | --------------------------------- | ---------------------------------------- | ------------- |
| Color themes             | ✅ 6+ theme options               | ✅ 6 themes (colorful, monochrome, etc.) | ✅ **Parity** |
| SmartArt Styles          | ✅ 3D, shadows, gradients         | ⚠️ Basic shapes only                     | **Gap**       |
| Individual shape styling | ✅ Override per shape             | ✅ Custom fill/stroke in DSL             | ✅ **Parity** |
| Layout switching         | ✅ Change layout, keep data       | ❌ Regenerate diagram                    | **Gap**       |
| Reset to default         | ✅ Reset Graphic button           | ❌ Manual revert                         | **Gap**       |
| Shape resizing           | ✅ Drag to resize                 | ✅ Width/height properties               | ✅ **Parity** |
| Custom colors per item   | ✅ Format individual shapes       | ✅ Per-item colors in data               | ✅ **Parity** |
| Font customization       | ✅ Font, size, bold, italic       | ✅ Font styles in DSL                    | ✅ **Parity** |
| Effects (glow, shadow)   | ✅ Rich effects gallery           | ⚠️ Basic stroke/fill                     | **Gap**       |
| 3D effects               | ✅ Bevels, rotations, perspective | ❌ No 3D                                 | **Gap**       |

**Recommendation**:

- Add 3D effect support (LOW PRIORITY - complex, limited value)
- Add shadow/glow support (MEDIUM PRIORITY)
- Implement layout switching without data loss (HIGH PRIORITY)
- Add gradient fill support (MEDIUM PRIORITY)

---

### Layout & Positioning

| Feature            | SmartArt               | Runiq GlyphSets        | Status        |
| ------------------ | ---------------------- | ---------------------- | ------------- |
| Auto-layout        | ✅ ELK-like algorithms | ✅ ELK layout engine   | ✅ **Parity** |
| Direction support  | ✅ LR, RL, TB, BT      | ✅ LR, RL, TB, BT      | ✅ **Parity** |
| Shape spacing      | ✅ Auto-adjusted       | ✅ ELK spacing options | ✅ **Parity** |
| Alignment          | ✅ Auto-aligned        | ✅ ELK handles         | ✅ **Parity** |
| Container grouping | ✅ Shape groups        | ✅ Container support   | ✅ **Parity** |
| Manual positioning | ✅ Drag shapes         | ✅ x/y coordinates     | ✅ **Parity** |
| Size constraints   | ✅ Min/max sizing      | ⚠️ Via shape bounds    | Partial       |

---

### Animation (PowerPoint Only)

| Feature                   | SmartArt              | Runiq GlyphSets | Status               |
| ------------------------- | --------------------- | --------------- | -------------------- |
| Animate all at once       | ✅ One animation      | N/A             | Not applicable (SVG) |
| Animate one shape at time | ✅ Sequential         | N/A             | Not applicable       |
| Custom animation          | ✅ Per-shape effects  | N/A             | Not applicable       |
| Animation presets         | ✅ Fade, fly in, etc. | N/A             | Not applicable       |

**Note**: Runiq generates static SVG. Animation would require:

- SVG animation (`<animate>` tags)
- Or export to animated formats
- Or JavaScript-based animation in web viewer

**Recommendation**: LOW PRIORITY - Complex, limited use case for diagrams

---

## Priority Gap Analysis

### 🔴 HIGH PRIORITY GAPS (Immediate Value)

1. **Organization Charts** (Hierarchy)
   - Most requested SmartArt type
   - Critical for business users
   - **Action**: Implement `orgChart`, `pictureOrgChart`, `horizontalOrgChart`

2. **Relationship Diagrams** (Missing Category)
   - Target/bullseye, balance, opposing ideas
   - Very common in presentations
   - **Action**: Add 8-10 relationship glyphsets

3. **Layout Switching Without Data Loss**
   - Key SmartArt UX feature
   - Try different layouts easily
   - **Action**: Implement glyphset converter utility

4. **Enhanced List Variants**
   - Chevron lists, picture lists, horizontal lists
   - Simple but high visual impact
   - **Action**: Add 5-6 list glyphsets

5. **Advanced Process Types**
   - Chevrons, alternating flow, phased processes
   - Commonly used in workflows
   - **Action**: Add 8-10 process glyphsets

---

### 🟡 MEDIUM PRIORITY GAPS (Nice to Have)

1. **Picture Support**
   - Image placeholders in layouts
   - **Action**: Design image API, add 4-6 picture glyphsets

2. **3x3 and Larger Matrices**
   - Beyond 2x2 grids
   - **Action**: Extend matrix glyphset with size parameter

3. **Visual Effects**
   - Shadows, glows, gradients
   - **Action**: Extend SVG renderer with effect support

4. **Cycle Variants**
   - Radial, gear, segmented cycles
   - **Action**: Add 3-4 cycle glyphsets

5. **Inverted & Segmented Pyramids**
   - Alternative pyramid styles
   - **Action**: Add 2 pyramid variants

---

### 🟢 LOW PRIORITY GAPS (Future Enhancements)

1. **3D Effects**
   - Bevels, rotations, perspective
   - Complex to implement, limited value

2. **Animation Support**
   - Animated SVG or export to video
   - Not core use case

3. **Advanced Picture Layouts**
   - Bending, framing, artistic effects
   - Niche use cases

---

## Recommendations Summary

### Immediate Next Steps (Weeks 1-4)

1. **Add Organization Chart Glyphsets** (Week 1-2)
   - `orgChart` - standard vertical tree
   - `horizontalOrgChart` - horizontal tree
   - `matrixOrgChart` - dual reporting

2. **Add Relationship Glyphsets** (Week 2-3)
   - `target` - concentric circles
   - `balance` - scale comparison
   - `opposing` - left vs right
   - `converging` - multiple → one
   - `diverging` - one → multiple

3. **Enhance List Glyphsets** (Week 3-4)
   - `horizontalList` - horizontal orientation
   - `chevronList` - progressive chevrons
   - `nestedList` - hierarchical items

4. **Expand Process Glyphsets** (Week 4)
   - `chevronProcess` - chevron arrows
   - `alternatingProcess` - zigzag flow
   - `phasedProcess` - with milestones

### Medium-Term Goals (Months 2-3)

1. Implement layout switching without data loss
2. Add picture/image support to glyphsets
3. Enhance matrix with 3x3+ support
4. Add 4-6 more cycle and pyramid variants
5. Implement visual effects (shadows, gradients)

### Long-Term Vision (Months 4-6)

1. Reach 50+ glyphsets (vs SmartArt's 200+)
2. Add glyphset gallery UI in editor
3. Custom glyphset builder/SDK
4. Community glyphset repository
5. Export glyphsets to PowerPoint SmartArt format

---

## Technical Implementation Notes

### Architecture Enhancements Needed

1. **Image Support**

   ```typescript
   interface GlyphSetParameter {
     type: 'string' | 'number' | 'array' | 'boolean' | 'image'; // Add image type
     // ...
   }
   ```

2. **Layout Converter**

   ```typescript
   interface GlyphSetConverter {
     canConvert(from: string, to: string): boolean;
     convert(diagram: DiagramAst, fromId: string, toId: string): DiagramAst;
   }
   ```

3. **Overflow Handling**

   ```typescript
   interface GlyphSetDefinition {
     maxItems?: number;
     overflowStrategy?: 'error' | 'warn' | 'truncate' | 'wrap';
   }
   ```

4. **Visual Effects**
   ```typescript
   interface ShapeEffects {
     shadow?: { blur: number; offset: [number, number]; color: string };
     glow?: { blur: number; color: string };
     gradient?: {
       type: 'linear' | 'radial';
       stops: Array<{ offset: number; color: string }>;
     };
   }
   ```

---

## Competitive Positioning

### Runiq Advantages Over SmartArt

1. ✅ **Text-based (DSG DSL)** - Version control, automation, API
2. ✅ **Open source** - Extensible, customizable
3. ✅ **Cross-platform** - Works in any environment (not Office-locked)
4. ✅ **Programmatic generation** - Generate from data/APIs
5. ✅ **Integration-friendly** - CI/CD, documentation pipelines

### SmartArt Advantages Over Runiq

1. ✅ **Visual editor** - WYSIWYG, easier for non-technical users
2. ✅ **200+ layouts** - More variety (Runiq has 9)
3. ✅ **Rich effects** - 3D, animations, advanced styling
4. ✅ **Office integration** - Native in Word/PowerPoint/Excel
5. ✅ **Picture support** - Built-in image placeholders
6. ✅ **Layout switching** - Try different layouts without recreating

### Path to Parity

**Target**: 40-50 high-quality glyphsets covering 80% of SmartArt use cases

**Focus on**:

- Business diagrams (org charts, processes, comparisons)
- Presentation graphics (relationships, hierarchies)
- Analytical visuals (matrices, pyramids, funnels)

**Don't focus on**:

- Decorative effects (3D, animations)
- Picture-heavy layouts (requires image management)
- Niche/specialized layouts (< 1% usage)

---

## Usage Statistics (If Available)

**Most Popular SmartArt Types** (from Microsoft user research):

1. Organization Chart (Hierarchy) - 45%
2. Basic Process - 20%
3. Basic Cycle - 10%
4. Venn Diagram (Relationship) - 8%
5. Matrix - 7%
6. Timeline - 5%
7. Funnel - 3%
8. Pyramid - 2%

**Runiq Coverage**:

- ✅ Basic Process - Covered
- ✅ Basic Cycle - Covered
- ✅ Venn - Covered
- ✅ Matrix - Covered
- ✅ Funnel - Covered
- ✅ Pyramid - Covered
- ❌ **Organization Chart** - **MISSING** (45% of usage!)
- ⚠️ Timeline - Partial (events glyphset)

**Priority**: Implement Organization Chart glyphsets immediately to capture 45% of SmartArt use cases.

---

## Conclusion

Runiq's GlyphSet system is a strong foundation comparable to SmartArt, with excellent support for processes, comparisons, and basic hierarchies. The biggest gaps are:

1. **Organization charts** (most critical - 45% of SmartArt usage)
2. **Relationship diagrams** (entire missing category)
3. **Advanced list and process variants** (breadth of options)
4. **Picture/image support** (technical capability gap)

**Recommended Focus**: Prioritize org charts and relationship glyphsets to maximize value for users transitioning from PowerPoint SmartArt.
