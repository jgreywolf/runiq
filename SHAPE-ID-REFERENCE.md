# Shape ID Quick Reference

## Shape Aliases 🎯

**NEW!** Runiq now supports **shape aliases** - friendly alternative names that map to registered shape IDs. You can use either the canonical ID or any of its aliases.

### Common Aliases

| Alias            | Maps To      | Description        |
| ---------------- | ------------ | ------------------ |
| `@rectangle`     | `@rect`      | Standard rectangle |
| `@box`           | `@rect`      | Alternative name   |
| `@square`        | `@rect`      | Alternative name   |
| `@diamond`       | `@rhombus`   | Decision diamond   |
| `@database`      | `@cyl`       | Database cylinder  |
| `@db`            | `@cyl`       | Short form         |
| `@cylinder`      | `@cyl`       | Full name          |
| `@pill`          | `@stadium`   | Pill/capsule shape |
| `@capsule`       | `@stadium`   | Alternative name   |
| `@rounded`       | `@stadium`   | Rounded rectangle  |
| `@parallelogram` | `@lean-r`    | Slanted rectangle  |
| `@display`       | `@curv-trap` | Display screen     |
| `@ellipse-wide`  | `@ellipse-w` | Wide ellipse       |
| `@ellipse-tall`  | `@ellipse-t` | Tall ellipse       |
| `@small-circle`  | `@sm-circ`   | Small circle       |
| `@summing`       | `@junction`  | Summing junction   |
| `@transfer`      | `@tfn`       | Transfer function  |
| `@multiply`      | `@mult-junc` | Multiply junction  |
| `@divide`        | `@div-junc`  | Divide junction    |
| `@compare`       | `@cmp-junc`  | Compare junction   |
| `@predefined`    | `@predef`    | Predefined process |
| `@manual`        | `@manual-in` | Manual input       |
| `@paper-tape`    | `@flag`      | Paper tape/flag    |

### Validation & Smart Suggestions ✨

The Runiq parser includes **smart shape validation** with typo detection:

#### Real-time Validation

- **Error Detection**: Unknown shapes are flagged immediately in the editor
- **Smart Suggestions**: Levenshtein distance algorithm suggests closest matches
- **Quick Fixes**: Click suggestions to auto-replace typos
- **Severity Levels**:
  - 🔴 **Error**: Unknown shape types
  - 🟡 **Warning**: Shape IDs longer than 50 characters
  - 🔵 **Info/Hint**: Shape alias information

#### Example Validation Messages

```
❌ Error: Unknown shape type 'rectange'. Did you mean: rectangle, triangle, rhombus?
💡 Hint: Shape 'rect' is alias for 'rectangle'. Available aliases: rect, box, square
⚠️ Warning: Shape ID 'veryLongShapeIdentifierThatExceeds50Characters' is too long (>50 chars)
```

#### Using Aliases in DSL

All of these are **valid and equivalent**:

```
shape db1 as @cylinder          # Canonical ID
shape db2 as @cylinder     # Alias
shape db3 as @database     # Alias
shape db4 as @db           # Alias
```

For a complete list of aliases, see: `packages/core/src/shape-aliases.ts`

---

## Common Shape ID Mismatches

This document lists shapes where the **common name** differs from the **actual registered ID** in the shape registry. Use this when you encounter "Unknown shape" errors.

### Block Diagrams & Control Systems

| ❌ Common Name (WRONG) | ✅ Registered ID (CORRECT) | Description                           |
| ---------------------- | -------------------------- | ------------------------------------- |
| `@box`                 | `@rect`                    | Input/output signals, reference boxes |
| `@small-circle`        | `@sm-circ`                 | Small circles for split/join points   |

**Block Diagram Shapes that ARE correct:**

- ✅ `@junction` - Summing junction (+/-)
- ✅ `@transfer-fn` - Transfer function blocks
- ✅ `@gain` - Gain/amplifier blocks
- ✅ `@integrator` - Integration (1/s)
- ✅ `@differentiator` - Differentiation (s)
- ✅ `@multiply-junction` - Multiplication junction (×)
- ✅ `@divide-junction` - Division junction (÷)
- ✅ `@compare-junction` - Comparison junction

### Basic Shapes

| ❌ Common Name (WRONG) | ✅ Registered ID (CORRECT) | Description                |
| ---------------------- | -------------------------- | -------------------------- |
| `@rectangle`           | `@rect`                    | Standard rectangle         |
| `@diamond`             | `@rhombus`                 | Decision diamond           |
| `@parallelogram`       | `@lean-r`                  | Input/output parallelogram |
| `@display`             | `@curv-trap`               | Curved trapezoid (display) |
| `@cylinder`            | `@cyl`                     | Cylinder (database)        |

**Basic Shapes that ARE correct:**

- ✅ `@rounded` - Rounded rectangle (start/end)
- ✅ `@circle` - Standard circle
- ✅ `@hex` - Hexagon
- ✅ `@triangle` - Triangle
- ✅ `@ellipse` - Ellipse
- ✅ `@cyl` - Cylinder (database)
- ✅ `@actor` - Actor/person shape
- ✅ `@doc` - Document shape
- ✅ `@cloud` - Cloud shape

### Network/Infrastructure Shapes

| ❌ Common Name (WRONG) | ✅ Registered ID (CORRECT) | Description         |
| ---------------------- | -------------------------- | ------------------- |
| `@service`             | `@server`                  | Server/service box  |
| `@database`            | `@cyl`                     | Database (cylinder) |
| `@browser`             | `@curv-trap`               | Browser/display     |

**Network Shapes that ARE correct:**

- ✅ `@server` - Server rack
- ✅ `@router` - Network router
- ✅ `@switch` - Network switch
- ✅ `@firewall` - Firewall
- ✅ `@load-balancer` - Load balancer
- ✅ `@storage` - Storage system

### Chart Shapes

**Chart Shapes that ARE correct:**

- ✅ `@pie-chart` - Pie chart
- ✅ `@bar-chart-vertical` - Vertical bar chart
- ✅ `@bar-chart-horizontal` - Horizontal bar chart

### Pedigree/Genealogy

**Pedigree Shapes that ARE correct:**

- ✅ `@pedigree-male` - Male individual (square)
- ✅ `@pedigree-female` - Female individual (circle)
- ✅ `@pedigree-unknown` - Unknown gender (diamond)

### Network Topology

**Network Shapes that ARE correct:**

- ✅ `@server` - Server icon
- ✅ `@router` - Router icon
- ✅ `@switch` - Switch icon
- ✅ `@firewall` - Firewall icon
- ✅ `@load-balancer` - Load balancer icon
- ✅ `@storage` - Storage icon

### Quantum Circuits

**Quantum Gate Shapes that ARE correct:**

- ✅ `@gate-x` - Pauli X gate
- ✅ `@gate-y` - Pauli Y gate
- ✅ `@gate-z` - Pauli Z gate
- ✅ `@gate-h` - Hadamard gate
- ✅ `@gate-s` - S gate
- ✅ `@gate-t` - T gate
- ✅ `@gate-cnot` - CNOT gate
- ✅ `@gate-swap` - SWAP gate
- ✅ `@gate-measure` - Measurement gate

## How to Find the Correct Shape ID

### Using the Editor 🎨

**NEW!** The Runiq editor includes an enhanced **Shape Browser** with powerful search:

1. **Search Shapes**: Type in the search box to filter across all 52+ shapes
2. **Browse Categories**: Expand categories to see available shapes
3. **Visual Preview**: Each shape shows an icon preview
4. **Quick Insert**: Click any shape to insert it at your cursor
5. **Expand/Collapse All**: Control category visibility

The Shape Browser makes it easy to discover and use shapes without memorizing IDs!

### When You Get "Unknown Shape" Errors

If you encounter an "Unknown shape" error:

1. **Check error suggestions** - The editor shows smart suggestions based on typo detection
2. **Use Quick Fixes** - Click suggested shapes to auto-replace
3. **Check aliases** - Try common aliases like `@rectangle` instead of `@rect`
4. **Search the Shape Browser** - Use the search feature in the editor toolbox
5. **Check this document** - Review the alias table and common mismatches above

### Programmatic Access

For developers integrating Runiq:

### Programmatic Access

For developers integrating Runiq:

1. **Search the shape registry**: `packages/core/src/shapes/index.ts`
2. **Search shape files**: `packages/core/src/shapes/*.ts`
3. **Look for the `id` field** in the shape definition:
   ```typescript
   export const someShape: ShapeDefinition = {
     id: 'actual-id', // ← This is what you use in DSL as @actual-id
     // ...
   };
   ```
4. **Check aliases**: `packages/core/src/shape-aliases.ts`
5. **Use ShapeRegistry API**:

   ```typescript
   import { shapeRegistry } from '@runiq/core';

   // Check if shape exists (works with IDs and aliases)
   shapeRegistry.has('rectangle'); // true
   shapeRegistry.has('rect'); // true (canonical)
   shapeRegistry.has('box'); // true (alias)

   // Get canonical ID from alias
   shapeRegistry.resolveAlias('rectangle'); // 'rect'

   // Get all aliases for a shape
   shapeRegistry.getAliases('rect'); // ['rectangle', 'box', 'square']

   // Export/import shapes
   const json = shapeRegistry.toJSON();
   shapeRegistry.fromJSON(json);
   ```

## Shape Naming Conventions

- Most shapes use **abbreviated IDs** for brevity
- IDs use **kebab-case** (lowercase with hyphens)
- The `@` prefix is added in DSL syntax but not in the ID itself
- Example: File `small-circle.ts` has `id: 'sm-circ'`, used as `@sm-circ` in DSL

## Complete Shape List

For a complete list of all available shapes, see:

- `packages/core/src/shapes/index.ts` - Main registry
- `DSL-SYNTAX-REFERENCE.md` - Syntax guide with shape categories

---

**Last Updated**: 2025-10-28  
**Recent Features**:

- ✅ Shape Aliases (60+ common aliases)
- ✅ Smart Validation with Typo Detection (Levenshtein distance)
- ✅ Quick-Fix Actions in Editor
- ✅ Enhanced Shape Browser with Search
- ✅ ShapeRegistry Export/Import API

**Issues Fixed Using This Reference**:

- Issue #5: @box → @rect (5 files)
- Issue #7: @small-circle → @sm-circ (1 file)
