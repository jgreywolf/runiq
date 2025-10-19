# Shape ID Quick Reference

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

If you encounter an "Unknown shape" error:

1. **Check this document** for common mismatches
2. **Search the shape registry**: `packages/core/src/shapes/index.ts`
3. **Search shape files**: `packages/core/src/shapes/*.ts`
4. **Look for the `id` field** in the shape definition:
   ```typescript
   export const someShape: ShapeDefinition = {
     id: 'actual-id', // ← This is what you use in DSL as @actual-id
     // ...
   };
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

**Last Updated**: 2025-10-19  
**Issues Fixed Using This Reference**:

- Issue #5: @box → @rect (5 files)
- Issue #7: @small-circle → @sm-circ (1 file)
