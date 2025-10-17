# @runiq/export-simulink

Simulink MDL exporter for Runiq block diagrams

## Features

- ✅ Exports block diagrams to Simulink MDL format
- ✅ Generates `.mdl` files loadable in MATLAB/Simulink
- ✅ Converts transfer functions to MATLAB array notation
- ✅ Supports all block diagram shapes (TransferFcn, Gain, Integrator, etc.)
- ✅ Automatic block positioning from layout
- ✅ Proper port connections for signal flow
- ✅ Professional control system models for MATLAB

## Installation

```bash
pnpm add @runiq/export-simulink
```

## Usage

```typescript
import { toSimulink } from '@runiq/export-simulink';
import type { DiagramAst, LaidOutDiagram } from '@runiq/core';

// Your diagram and layout from parser + layout engine
const diagram: DiagramAst = {
  /* ... */
};
const layout: LaidOutDiagram = {
  /* ... */
};

// Export to Simulink MDL
const result = toSimulink(diagram, layout);

// result.mdl contains the complete MDL file content
console.log(result.mdl);

// Check for warnings
if (result.warnings.length > 0) {
  console.warn('Warnings:', result.warnings);
}
```

## Output Example

The exporter generates a Simulink MDL (Model Definition Language) file:

```mdl
Model {
  Name		"untitled"
  Version		"7.6"
  SavedCharacterEncoding	"UTF-8"

  System {
    Name		"untitled"
    Location		[0, 0, 800, 600]

    Block {
      BlockType		"TransferFcn"
      Name		"tf1"
      Numerator		"[1]"
      Denominator		"[1 1]"
      Position		[100, 50, 180, 110]
      SID		"1"
    }

    Block {
      BlockType		"Gain"
      Name		"g1"
      Gain		"10"
      Position		[200, 50, 260, 90]
      SID		"2"
    }

    Line {
      SrcBlock		"tf1"
      SrcPort		1
      DstBlock		"g1"
      DstPort		1
    }
  }
}
```

## Loading in MATLAB/Simulink

1. Save the output to a `.mdl` file:

   ```typescript
   import fs from 'fs';
   fs.writeFileSync('control_system.mdl', result.mdl);
   ```

2. Open in MATLAB:
   ```matlab
   open_system('control_system.mdl')
   ```

## Supported Shapes → Simulink Blocks

| Runiq Shape         | Simulink Block | Description                                  |
| ------------------- | -------------- | -------------------------------------------- |
| `transfer-fn`       | TransferFcn    | Transfer function with numerator/denominator |
| `gain`              | Gain           | Amplifier/gain block                         |
| `integrator`        | Integrator     | Integration block (1/s)                      |
| `differentiator`    | Derivative     | Differentiation block (s)                    |
| `time-delay`        | TransportDelay | Time delay block                             |
| `saturation`        | Saturate       | Saturation with limits                       |
| `compare-junction`  | Sum            | Summing junction with +/- inputs             |
| `multiply-junction` | Product        | Multiplication block                         |
| `divide-junction`   | Product        | Division block                               |

## Transfer Function Parsing

The exporter automatically parses transfer function labels:

- `"1/(s+1)"` → Numerator: `[1]`, Denominator: `[1 1]`
- `"5/(s^2+3s+2)"` → Numerator: `[5]`, Denominator: `[1 3 2]`
- `"K/(s+1)"` → Simple first-order system

For complex polynomials, the exporter provides a best-effort conversion. You may need to adjust coefficients in Simulink for advanced systems.

## API

### `toSimulink(diagram, layout): SimulinkResult`

**Parameters:**

- `diagram` (DiagramAst): The diagram AST from parser
- `layout` (LaidOutDiagram): The positioned nodes/edges from layout engine

**Returns:** `SimulinkResult`

- `mdl` (string): Complete MDL file content
- `warnings` (string[]): Array of warning messages

## Testing

```bash
pnpm test       # Run tests
pnpm build      # Build package
```

## Compatibility

- MATLAB R2010a and later
- Simulink 7.6 and later
- MDL format (text-based, not binary SLX)

## License

MIT
