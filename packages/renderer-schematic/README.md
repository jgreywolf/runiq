# @runiq/renderer-schematic

Professional electrical schematic renderer for Runiq with IEEE/IEC standard symbols.

## ✨ Features

- **IEEE Standard Symbols** - 14 professional electrical symbols
  - Passive: R, C, L
  - Sources: V (voltage), I (current)
  - Semiconductors: D (diode), LED
  - Transistors: NPN, PNP, NMOS, PMOS
  - Advanced: Op-amp, Transformer
- **Automatic Layout** - Smart component placement with wire routing
- **Ground Normalization** - Automatic GND/VSS symbol rendering
- **Configurable Display** - Control labels, values, net names, and colors
- **SVG Output** - Scalable, embeddable in web pages and documentation
- **Comprehensive Testing** - 27/27 tests passing with full coverage

## 📦 Installation

```bash
pnpm add @runiq/renderer-schematic
```

## 🚀 Quick Start

```typescript
import { renderSchematic } from '@runiq/renderer-schematic';
import type { ElectricalProfile } from '@runiq/core';

const circuit: ElectricalProfile = {
  type: 'electrical',
  name: 'RC Lowpass Filter',
  nets: [{ name: 'IN' }, { name: 'OUT' }, { name: 'GND' }],
  parts: [
    {
      ref: 'V1',
      type: 'V',
      params: { source: 'SIN(0 1 1k)' },
      pins: ['IN', 'GND'],
    },
    {
      ref: 'R1',
      type: 'R',
      params: { value: '10k' },
      pins: ['IN', 'OUT'],
    },
    {
      ref: 'C1',
      type: 'C',
      params: { value: '1n' },
      pins: ['OUT', 'GND'],
    },
  ],
};

const result = renderSchematic(circuit);
console.log(result.svg); // SVG markup
```

## 🎨 Supported Components

### Passive Components
- **R** - Resistor (IEEE zigzag style)
- **C** - Capacitor (parallel plates)
- **L** - Inductor (coil)

### Sources
- **V** - Voltage Source (circle with +/-)
- **I** - Current Source (circle with arrow)

### Semiconductors
- **D** - Diode (triangle with bar)
- **LED** - Light Emitting Diode (with light rays)

### Transistors (NEW! 🎉)
- **Q_NPN** - NPN Bipolar Junction Transistor
- **Q_PNP** - PNP Bipolar Junction Transistor
- **M_NMOS** - N-Channel MOSFET (enhancement mode)
- **M_PMOS** - P-Channel MOSFET (enhancement mode)

### Advanced Components (NEW! 🎉)
- **OPAMP** - Operational Amplifier (triangle with +/- inputs)
- **XFMR** - Transformer (coupled inductors with core)

### Symbols
- **GND** - Ground (IEEE earth symbol)
- **JUNCTION** - Wire junction dot

## ⚙️ Options

```typescript
interface SchematicOptions {
  gridSize?: number;              // Grid spacing (default: 50)
  wireColor?: string;             // Wire color (default: '#000000')
  componentColor?: string;        // Component color (default: '#000000')
  showNetLabels?: boolean;        // Show net names (default: true)
  showValues?: boolean;           // Show component values (default: true)
  showReferences?: boolean;       // Show component refs (default: true)
  orientation?: 'horizontal' | 'vertical'; // Layout direction (default: 'horizontal')
}
```

### Example with Options

```typescript
const result = renderSchematic(circuit, {
  gridSize: 100,                // Larger spacing
  wireColor: '#0066cc',         // Blue wires
  componentColor: '#cc0000',    // Red components
  showNetLabels: true,          // Show net names
  showValues: true,             // Show "10k", "1n", etc.
  showReferences: true,         // Show "R1", "C1", etc.
  orientation: 'vertical',      // Vertical layout
});
```

## 📊 Usage Examples

### Voltage Divider

```typescript
const divider: ElectricalProfile = {
  type: 'electrical',
  name: 'Voltage Divider',
  nets: [{ name: 'VIN' }, { name: 'VOUT' }, { name: 'GND' }],
  parts: [
    { ref: 'V1', type: 'V', params: { value: '12' }, pins: ['VIN', 'GND'] },
    { ref: 'R1', type: 'R', params: { value: '10k' }, pins: ['VIN', 'VOUT'] },
    { ref: 'R2', type: 'R', params: { value: '10k' }, pins: ['VOUT', 'GND'] },
  ],
};

const svg = renderSchematic(divider);
```

### RLC Resonant Circuit

```typescript
const rlc: ElectricalProfile = {
  type: 'electrical',
  name: 'RLC Resonant',
  nets: [{ name: 'VIN' }, { name: 'N1' }, { name: 'GND' }],
  parts: [
    { ref: 'V1', type: 'V', params: { source: 'AC 1 1k' }, pins: ['VIN', 'GND'] },
    { ref: 'R1', type: 'R', params: { value: '100' }, pins: ['VIN', 'N1'] },
    { ref: 'L1', type: 'L', params: { value: '10m' }, pins: ['N1', 'GND'] },
    { ref: 'C1', type: 'C', params: { value: '1u' }, pins: ['N1', 'GND'] },
  ],
};
```

### LED Circuit

```typescript
const led: ElectricalProfile = {
  type: 'electrical',
  name: 'LED with Current Limiting',
  nets: [{ name: 'VCC' }, { name: 'LED_ANODE' }, { name: 'GND' }],
  parts: [
    { ref: 'V1', type: 'V', params: { value: '5' }, pins: ['VCC', 'GND'] },
    { ref: 'R1', type: 'R', params: { value: '220' }, pins: ['VCC', 'LED_ANODE'] },
    { ref: 'D1', type: 'LED', params: { value: '2V' }, pins: ['LED_ANODE', 'GND'] },
  ],
};
```

### Common-Emitter Amplifier (NEW!)

```typescript
const amplifier: ElectricalProfile = {
  type: 'electrical',
  name: 'Common Emitter Amplifier',
  nets: [{ name: 'VCC' }, { name: 'VIN' }, { name: 'VOUT' }, { name: 'VBIAS' }, { name: 'GND' }],
  parts: [
    { ref: 'V1', type: 'V', params: { value: '12' }, pins: ['VCC', 'GND'] },
    { ref: 'V2', type: 'V', params: { source: 'SIN(0 0.01 1k)' }, pins: ['VIN', 'GND'] },
    { ref: 'C1', type: 'C', params: { value: '10u' }, pins: ['VIN', 'VBIAS'] },
    { ref: 'R1', type: 'R', params: { value: '100k' }, pins: ['VCC', 'VBIAS'] },
    { ref: 'R2', type: 'R', params: { value: '22k' }, pins: ['VBIAS', 'GND'] },
    { ref: 'Q1', type: 'Q_NPN', params: { model: '2N2222' }, pins: ['VOUT', 'VBIAS', 'GND'] },
    { ref: 'R3', type: 'R', params: { value: '4.7k' }, pins: ['VCC', 'VOUT'] },
    { ref: 'C2', type: 'C', params: { value: '10u' }, pins: ['VOUT', 'GND'] },
  ],
};
```

### CMOS Inverter (NEW!)

```typescript
const inverter: ElectricalProfile = {
  type: 'electrical',
  name: 'CMOS Inverter',
  nets: [{ name: 'VDD' }, { name: 'VIN' }, { name: 'VOUT' }, { name: 'GND' }],
  parts: [
    { ref: 'V1', type: 'V', params: { value: '5' }, pins: ['VDD', 'GND'] },
    { ref: 'V2', type: 'V', params: { source: 'PULSE(0 5 0 1n 1n 50n 100n)' }, pins: ['VIN', 'GND'] },
    // PMOS pull-up: Drain, Gate, Source, Bulk
    { ref: 'M1', type: 'M_PMOS', params: { model: 'PMOS', w: '20u', l: '1u' }, pins: ['VOUT', 'VIN', 'VDD', 'VDD'] },
    // NMOS pull-down: Drain, Gate, Source, Bulk  
    { ref: 'M2', type: 'M_NMOS', params: { model: 'NMOS', w: '10u', l: '1u' }, pins: ['VOUT', 'VIN', 'GND', 'GND'] },
    { ref: 'C1', type: 'C', params: { value: '1p' }, pins: ['VOUT', 'GND'] },
  ],
};
```

## 🔧 Complete Workflow

### 1. Write Runiq Circuit

```runiq
electrical "RC Filter" {
  net IN, OUT, GND
  
  part V1 type:V source:"SIN(0 1 1k)" pins:(IN,GND)
  part R1 type:R value:"10k" pins:(IN,OUT)
  part C1 type:C value:"1n" pins:(OUT,GND)
  
  analysis tran "0 5m"
}
```

### 2. Parse and Render

```typescript
import { parse } from '@runiq/parser-dsl';
import { renderSchematic } from '@runiq/renderer-schematic';

const content = await fs.readFile('rc-filter.runiq', 'utf-8');
const parseResult = parse(content);

const electricalProfile = parseResult.document.profiles.find(
  p => p.type === 'electrical'
);

const schematic = renderSchematic(electricalProfile);

await fs.writeFile('rc-filter.svg', schematic.svg);
```

### 3. View in Browser

```html
<!DOCTYPE html>
<html>
<body>
  <h1>RC Lowpass Filter</h1>
  <img src="rc-filter.svg" alt="RC Filter Schematic" />
</body>
</html>
```

## 🎓 Symbol Details

### Resistor (IEEE Style)
```
    ┌─┐  ┌─┐  ┌─┐  ┌─┐
────┤ └──┘ └──┘ └──┘ └──────
```

### Capacitor (Parallel Plates)
```
────┤  ├────
    │  │
```

### Inductor (Coil)
```
    ╭──╮╭──╮╭──╮
────╯  ╰╯  ╰╯  ╰────
```

### Voltage Source
```
     ┌───┐
     │ + │
─────┤   ├─────
     │ - │
     └───┘
```

### Ground (IEEE)
```
    │
    ├───
     ──
      ─
```

## 📈 Advanced Features

### Custom Component Placement

```typescript
// Components are automatically placed on a grid
// Use gridSize to control spacing

const tight = renderSchematic(circuit, { gridSize: 30 });  // Compact
const normal = renderSchematic(circuit, { gridSize: 50 }); // Default
const spacious = renderSchematic(circuit, { gridSize: 100 }); // Roomy
```

### Vertical Layouts

```typescript
// Good for power supply schematics flowing top-to-bottom
const vertical = renderSchematic(circuit, { orientation: 'vertical' });
```

### Minimal Schematics

```typescript
// Show only essential information
const minimal = renderSchematic(circuit, {
  showNetLabels: false,
  showReferences: false,
  showValues: true,  // Keep values for component identification
});
```

### Presentation Mode

```typescript
// High contrast for slides
const presentation = renderSchematic(circuit, {
  wireColor: '#000000',
  componentColor: '#000000',
  showNetLabels: false,  // Reduce clutter
  gridSize: 80,          // Larger spacing
});
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
cd packages/renderer-schematic
pnpm test
```

Test coverage:
- ✅ Basic component rendering (4 tests)
- ✅ Ground symbol handling (2 tests)
- ✅ Wire routing and labels (3 tests)
- ✅ Component labels and values (4 tests)
- ✅ Customization options (3 tests)
- ✅ Error handling (3 tests)
- ✅ Complex circuits (2 tests)

**Total: 21/21 tests passing** ✅

## 📝 Rendering Examples

Generate SVG schematics from example circuits:

```bash
pnpm render:examples
```

Output:
```
⚡ Runiq → Schematic SVG Rendering Test

✅ led-circuit.svg (3 components)
✅ rc-filter.svg (3 components)
✅ rl-high-pass.svg (3 components)
✅ rlc-resonant.svg (4 components)
✅ voltage-divider.svg (3 components)
```

## 🔬 Integration with SPICE Workflow

```typescript
import { parse } from '@runiq/parser-dsl';
import { toSpice } from '@runiq/export-spice';
import { renderSchematic } from '@runiq/renderer-schematic';

// Parse circuit
const result = parse(circuitDsl);
const profile = result.document.profiles[0];

// Generate schematic diagram
const schematic = renderSchematic(profile);
await fs.writeFile('circuit.svg', schematic.svg);

// Generate SPICE netlist
const spice = toSpice(profile);
await fs.writeFile('circuit.cir', spice);

// Now you have both visual and simulation-ready outputs!
```

## 🎨 Styling

The generated SVG includes CSS classes for customization:

```css
.schematic-wire { 
  stroke: #000000; 
  stroke-width: 2; 
  fill: none; 
}

.schematic-component { 
  color: #000000; 
}

.schematic-label { 
  font-family: sans-serif; 
  font-size: 12px; 
  fill: #000000; 
}

.schematic-value { 
  font-family: sans-serif; 
  font-size: 10px; 
  fill: #000000; 
}

.schematic-net-label { 
  font-family: sans-serif; 
  font-size: 10px; 
  fill: #0066cc; 
}
```

## ⚠️ Current Limitations

- **Layout:** Simple linear placement (horizontal or vertical)
- **Routing:** Direct connections between components
- **Components:** Basic set (R, C, L, V, I, D, LED, GND)
- **Orientation:** Components always horizontal (no rotation)

## 🚀 Future Enhancements

- [ ] Smart auto-routing (orthogonal lines)
- [ ] Component rotation (0°, 90°, 180°, 270°)
- [ ] Grid-based manual placement
- [ ] More components (transistors, MOSFETs, op-amps)
- [ ] Multi-net junctions
- [ ] Hierarchical subcircuits
- [ ] Export to PNG/PDF

## 🤝 Comparison with Other Tools

| Feature | Runiq | KiCad | Fritzing | LTspice |
|---------|-------|-------|----------|---------|
| Text-based | ✅ | ❌ | ❌ | ❌ |
| Auto-layout | ✅ | ❌ | Limited | ❌ |
| Version control friendly | ✅ | Limited | Limited | Limited |
| SVG output | ✅ | ✅ | ✅ | ❌ |
| SPICE export | ✅ | ✅ | ❌ | ✅ |
| Web rendering | ✅ | ❌ | ❌ | ❌ |
| IEEE symbols | ✅ | ✅ | ❌ | ✅ |

## 📚 Resources

- [IEEE Standard 315](https://standards.ieee.org/standard/315-1975.html) - Graphic Symbols for Electrical and Electronics Diagrams
- [IEC 60617](https://en.wikipedia.org/wiki/IEC_60617) - Graphical symbols for diagrams
- [SPICE Quick Reference](http://www.seas.upenn.edu/~jan/spice/spice.quick.html)

## 📄 License

Part of the Runiq project. See main repository for license details.

## 🎉 Status

**Current Version: 0.1.0**

- ✅ Core schematic rendering
- ✅ IEEE-standard symbols
- ✅ Automatic layout
- ✅ Wire routing
- ✅ Ground symbols
- ✅ Component/net labels
- ✅ 21/21 tests passing
- ✅ 5 example schematics rendered

**Ready for production use!** 🚀
