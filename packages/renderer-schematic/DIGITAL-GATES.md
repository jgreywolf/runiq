# Digital Logic Gate Symbols

## Overview

The schematic renderer now includes a complete library of **7 IEEE/ANSI standard logic gate symbols** for digital circuit design.

## Gate Specifications

### 1. AND Gate

- **Size:** 60×40 pixels
- **Shape:** IEEE distinctive - flat left side, semicircular right side
- **Terminals:**
  - A (input): x=0, y=12
  - B (input): x=0, y=28
  - Y (output): x=60, y=20
- **Usage:** `type: 'AND'`

```typescript
{ ref: 'U1', type: 'AND', params: {}, pins: ['A', 'B', 'Y'] }
```

### 2. OR Gate

- **Size:** 60×40 pixels
- **Shape:** IEEE distinctive - curved on both input and output sides
- **Terminals:**
  - A (input): x=0, y=12
  - B (input): x=0, y=28
  - Y (output): x=60, y=20
- **Usage:** `type: 'OR'`

```typescript
{ ref: 'U1', type: 'OR', params: {}, pins: ['A', 'B', 'Y'] }
```

### 3. NOT Gate (Inverter)

- **Size:** 50×30 pixels
- **Shape:** Triangle with 3px radius output bubble
- **Terminals:**
  - A (input): x=0, y=15
  - Y (output): x=50, y=15
- **Usage:** `type: 'NOT'`
- **Special Feature:** Circle at output indicates inversion

```typescript
{ ref: 'U1', type: 'NOT', params: {}, pins: ['A', 'Y'] }
```

### 4. XOR Gate

- **Size:** 65×40 pixels
- **Shape:** IEEE distinctive - OR shape with additional curved input line
- **Terminals:**
  - A (input): x=0, y=12
  - B (input): x=0, y=28
  - Y (output): x=65, y=20
- **Usage:** `type: 'XOR'`
- **Special Feature:** Extra curve at input distinguishes from OR

```typescript
{ ref: 'U1', type: 'XOR', params: {}, pins: ['A', 'B', 'Y'] }
```

### 5. NAND Gate

- **Size:** 65×40 pixels
- **Shape:** AND shape with 3px radius output bubble
- **Terminals:**
  - A (input): x=0, y=12
  - B (input): x=0, y=28
  - Y (output): x=65, y=20
- **Usage:** `type: 'NAND'`
- **Special Feature:** Circle at output indicates inversion

```typescript
{ ref: 'U1', type: 'NAND', params: {}, pins: ['A', 'B', 'Y'] }
```

### 6. NOR Gate

- **Size:** 65×40 pixels
- **Shape:** OR shape with 3px radius output bubble
- **Terminals:**
  - A (input): x=0, y=12
  - B (input): x=0, y=28
  - Y (output): x=65, y=20
- **Usage:** `type: 'NOR'`
- **Special Feature:** Circle at output indicates inversion

```typescript
{ ref: 'U1', type: 'NOR', params: {}, pins: ['A', 'B', 'Y'] }
```

### 7. BUFFER Gate

- **Size:** 50×30 pixels
- **Shape:** Triangle (same as NOT but no bubble)
- **Terminals:**
  - A (input): x=0, y=15
  - Y (output): x=50, y=15
- **Usage:** `type: 'BUFFER'`
- **Special Feature:** Non-inverting buffer, useful for signal isolation

```typescript
{ ref: 'U1', type: 'BUFFER', params: {}, pins: ['A', 'Y'] }
```

## Design Standards

All gates follow **IEEE/ANSI Std 91-1984** distinctive shapes:

### Common Elements

- **Stroke:** 2px width, `currentColor` for styling
- **Fill:** White for visibility against background
- **Input Lines:** Extend 10px left of gate body
- **Output Lines:** Extend 10px right of gate body

### Inverter Bubbles

- **Radius:** 3px
- **Gates:** NOT, NAND, NOR
- **Position:** At output terminal
- **Meaning:** Logical inversion (NOT operation)

### Terminal Naming Convention

- **Inputs:** A, B (top to bottom for 2-input gates)
- **Output:** Y (industry standard)
- **Multi-gate circuits:** Connect by net names

## Example Circuits

### Half Adder (Basic Digital Circuit)

```typescript
const halfAdder: SchematicProfile = {
  type: 'schematic',
  name: 'Half Adder',
  nets: [
    { name: 'A' },
    { name: 'B' },
    { name: 'SUM' }, // A XOR B
    { name: 'CARRY' }, // A AND B
  ],
  parts: [
    { ref: 'U1', type: 'XOR', params: {}, pins: ['A', 'B', 'SUM'] },
    { ref: 'U2', type: 'AND', params: {}, pins: ['A', 'B', 'CARRY'] },
  ],
};

const svg = renderSchematic(halfAdder, {
  routing: 'orthogonal', // Clean Manhattan routing
  showReferences: true, // Show U1, U2
  showNetLabels: true, // Show SUM, CARRY
});
```

**Truth Table:**
| A | B | SUM | CARRY |
|---|---|-----|-------|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

### SR Latch (Feedback Circuit)

```typescript
const srLatch: SchematicProfile = {
  type: 'schematic',
  name: 'SR Latch (NAND)',
  nets: [
    { name: 'S' }, // Set input
    { name: 'R' }, // Reset input
    { name: 'Q' }, // Output
    { name: 'Q_N' }, // Inverted output
  ],
  parts: [
    // Cross-coupled NAND gates
    { ref: 'U1', type: 'NAND', params: {}, pins: ['S', 'Q_N', 'Q'] },
    { ref: 'U2', type: 'NAND', params: {}, pins: ['R', 'Q', 'Q_N'] },
  ],
};
```

**Operation:**

- **Set (S=0, R=1):** Q=1, Q̅=0
- **Reset (S=1, R=0):** Q=0, Q̅=1
- **Hold (S=1, R=1):** Maintains previous state
- **Invalid (S=0, R=0):** Both outputs high (avoid)

### Full Adder (Multi-Stage Circuit)

```typescript
const fullAdder: SchematicProfile = {
  type: 'schematic',
  name: 'Full Adder',
  nets: [
    { name: 'A' },
    { name: 'B' },
    { name: 'CIN' },
    { name: 'SUM' },
    { name: 'COUT' },
    { name: 'XOR1_OUT' },
    { name: 'AND1_OUT' },
    { name: 'AND2_OUT' },
  ],
  parts: [
    // First half adder
    { ref: 'U1', type: 'XOR', params: {}, pins: ['A', 'B', 'XOR1_OUT'] },
    { ref: 'U2', type: 'XOR', params: {}, pins: ['XOR1_OUT', 'CIN', 'SUM'] },

    // Carry logic
    { ref: 'U3', type: 'AND', params: {}, pins: ['A', 'B', 'AND1_OUT'] },
    {
      ref: 'U4',
      type: 'AND',
      params: {},
      pins: ['XOR1_OUT', 'CIN', 'AND2_OUT'],
    },
    {
      ref: 'U5',
      type: 'OR',
      params: {},
      pins: ['AND1_OUT', 'AND2_OUT', 'COUT'],
    },
  ],
};
```

**Gates Used:** 2× XOR, 2× AND, 1× OR (5 gates total)

### 2-to-4 Decoder

```typescript
const decoder: SchematicProfile = {
  type: 'schematic',
  name: '2-to-4 Decoder',
  nets: [
    { name: 'A0' },
    { name: 'A1' }, // Address inputs
    { name: 'A0_N' },
    { name: 'A1_N' }, // Inverted addresses
    { name: 'Y0' },
    { name: 'Y1' }, // Outputs 0-3
    { name: 'Y2' },
    { name: 'Y3' },
  ],
  parts: [
    // Inverters
    { ref: 'U1', type: 'NOT', params: {}, pins: ['A0', 'A0_N'] },
    { ref: 'U2', type: 'NOT', params: {}, pins: ['A1', 'A1_N'] },

    // Decode logic (each AND gate activates one output)
    { ref: 'U3', type: 'AND', params: {}, pins: ['A0_N', 'A1_N', 'Y0'] }, // 00
    { ref: 'U4', type: 'AND', params: {}, pins: ['A0', 'A1_N', 'Y1'] }, // 01
    { ref: 'U5', type: 'AND', params: {}, pins: ['A0_N', 'A1', 'Y2'] }, // 10
    { ref: 'U6', type: 'AND', params: {}, pins: ['A0', 'A1', 'Y3'] }, // 11
  ],
};
```

**Gates Used:** 2× NOT, 4× AND (6 gates total)

## Testing

All 7 logic gate symbols are comprehensively tested:

### Test Coverage

1. ✅ **2-input AND gate rendering**
2. ✅ **2-input OR gate rendering**
3. ✅ **NOT gate (inverter) with bubble check**
4. ✅ **2-input XOR gate rendering**
5. ✅ **2-input NAND gate with bubble check**
6. ✅ **2-input NOR gate with bubble check**
7. ✅ **BUFFER gate rendering**
8. ✅ **Half adder (multi-gate circuit)**
9. ✅ **SR latch (feedback circuit)**

**Test Results:** 46/46 passing (100% success rate)

### Running Tests

```bash
cd packages/renderer-schematic
pnpm test
```

Expected output:

```
✓ Logic Gate Symbols (9)
  ✓ should render 2-input AND gate
  ✓ should render 2-input OR gate
  ✓ should render NOT gate (inverter)
  ✓ should render 2-input XOR gate
  ✓ should render 2-input NAND gate
  ✓ should render 2-input NOR gate
  ✓ should render BUFFER gate
  ✓ should render half adder with multiple logic gates
  ✓ should render SR latch with NAND gates

Tests  46 passed (46)
```

## Generating Example Schematics

Run the digital examples generator:

```bash
cd packages/renderer-schematic
npx tsx src/__tests__/generate-digital-examples.ts
```

Output files (in `examples/digital/schematics/`):

- `half-adder.svg` - XOR + AND implementation
- `full-adder.svg` - 5-gate cascaded design
- `decoder-2to4.svg` - Address decoder
- `sr-latch.svg` - Cross-coupled NAND memory
- `mux-4to1.svg` - Multiplexer with 9 gates

## Integration with Verilog

Digital schematics pair perfectly with Verilog export:

```typescript
import { renderSchematic } from '@runiq/renderer-schematic';
import { toVerilog } from '@runiq/export-verilog';

// Generate schematic diagram
const schematic = renderSchematic(digitalProfile, {
  routing: 'orthogonal',
  showReferences: true,
});
await fs.writeFile('circuit.svg', schematic.svg);

// Generate Verilog HDL
const verilog = toVerilog(digitalProfile);
await fs.writeFile('circuit.v', verilog);
```

Now you have both:

- 📊 **Visual documentation** (SVG schematic)
- 💻 **Simulation-ready code** (Verilog HDL)

## Symbol Registry

All gates are registered in the symbol registry:

```typescript
export const symbolRegistry = new Map<string, SymbolDefinition>([
  // ... electrical symbols ...

  // Digital logic gates
  ['AND', andGate],
  ['OR', orGate],
  ['NOT', notGate],
  ['XOR', xorGate],
  ['NAND', nandGate],
  ['NOR', norGate],
  ['BUFFER', bufferGate],
]);
```

Access via:

```typescript
import { getSymbol } from '@runiq/renderer-schematic';

const andGateDef = getSymbol('AND');
// Returns: { id, width, height, terminals, render }
```

## Future Enhancements

Potential additions to the digital gate library:

- [ ] 3-input gates (AND3, OR3, NAND3, NOR3)
- [ ] XNOR gate (XOR with inverter bubble)
- [ ] Tri-state buffer (with enable input)
- [ ] Schmitt trigger symbols
- [ ] Flip-flops (D, JK, T, SR)
- [ ] Registers (4-bit, 8-bit)
- [ ] Multiplexers/Demultiplexers (larger)
- [ ] Encoders/Decoders (larger)

## Contributing

When adding new gate symbols:

1. **Follow IEEE/ANSI standards** for distinctive shapes
2. **Use createSymbol() helper** for consistency
3. **Write tests first** (TDD approach)
4. **Document terminal positions** clearly
5. **Add usage examples** to documentation
6. **Update symbol registry** to make available

## License

Part of the Runiq project. See main repository for license details.

---

**Status:** ✅ Complete - 7/7 gates implemented and tested  
**Test Results:** 46/46 passing (100%)  
**Documentation:** Complete  
**Examples:** 5 digital circuits generated  
**Ready for production!** 🚀
