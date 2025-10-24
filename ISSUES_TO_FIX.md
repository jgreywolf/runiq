# Issues to Fix - Comprehensive List

## Critical Rendering/Data Issues

- [x] #2: Venn diagram numbers showing 0 instead of actual data
- [ ] #17: Transistor/MOS shapes not displaying (Junction, NPN, PNP, NMOS, PMOS)
- [ ] #20: Buffer shape not showing in diagram

## BPMN Shape Corrections

- [x] #6: Gateway shapes need visible differences (X, +, O markers) - Already implemented, may need icon fix
- [x] #7: Event shapes need visible differences - Fixed start event to be filled
- [x] #8: Pool doesn't look like swimlane (looks like square container)
- [x] #33: BPMN events need corrections:
  - Start: Should be filled circle ✅ Fixed
  - Intermediate: Double unfilled circle ✅ Already correct
  - End: Thick circle ✅ Already correct
  - Data object: Rotate 90° and flip (vertical with notch on right) (the icon looks correct)

## Shape Appearance Issues

- [x] #4: decisionManual shape looks like upside-down heart
- [x] #5a: Package shape doesn't look like proper UML package
- [x] #9: VPC shape looks like square container
- [x] #34: The middle fo the curly braces positioned too far left/right

## Icon Display Issues

- [x] #5: Package icon not showing - Added handler
- [x] #10: Chart icons (pie, bar horizontal, bar vertical) too small
- [x] #11: multiRectangle icon looks strange
- [x] #12: dividedRectangle too wide, linedRectangle too tall
- [x] #13: taggedRectangle shows as solid black box
- [x] #14: notchedRectangle shows grey box with thick black border
- [x] #15: controlDot/cnotTarget have thick borders (should be circles)
- [x] #16: Resistor icon/shape mismatch (icon=rectangle, shape=squiggly)
- [ ] #19: OR gate icon wrong (should match shape) - **BACKLOG** (requires refactoring to use actual schematic renderer symbols)
- [ ] #21-29: Logic gate icons don't match shapes (XOR, XNOR, NAND, NOR, AND3, OR3, etc.) - **BACKLOG** (requires refactoring)

## Layout Issues

- [x] #1: Multi-Region Deployment sample has overlapping containers
- [ ] #3: Family tree line overlap + child centering under parents - **BACKLOG** (complex: requires handling multiple parents per child, not true tree structure)

## UX Improvements

- [ ] #18: Show warnings notification details
- [ ] #30: Confirm before overwriting code when loading sample
- [ ] #32: Auto-expand Basic category when no category is expanded

## Missing Features

- [ ] #31: Export button not implemented

## Missing Shapes (Future Enhancement)

### Basic Shapes

- Unfilled star
- Filled star
- Block arrows (multiple directions, single/double sided)
- Octagon
- Block style plus/cross

### UML Shapes

- Port, Module, Template
- Send Signal, Receive Signal
- History, Deletion
- Pin (and variations)
- Assembly
- Provided interface, Required interface
- Frame, Collaboration
- Submachine, Loop
- Vertical fork

### BPMN Shapes

- Transaction
- Event sub process
- Call activity
- Start non-interfering (unfilled circle with dashed stroke)
- Intermediate non-interfering (double unfilled circle with dashed stroke)
- Conversation
- Annotation

### Flowchart Shapes

- Multi-process
- OR
- Summing junction
- Curly brace annotation
- Magnetic tape

### Data Flow Shapes (New Category)

- External entity (2 versions: rectangle, rectangle with corner overlap)
- Process (large unfilled circle)
- Data store (3 versions: two horizontal lines, short rectangle with double line on left, short rectangle open on right)

## Priority Order

**P0 - Critical (Data/Rendering Broken):**

- #2, #17, #20

**P1 - High (Shape Appearance):**

- #4, #5a, #8, #33 (data object), #34

**P2 - Medium (Icon Issues):**

- #10-16, #19, #21-29

**P3 - Low (UX):**

- #1, #3, #18, #30, #32

**P4 - Future:**

- #31, #35 (all missing shapes)
